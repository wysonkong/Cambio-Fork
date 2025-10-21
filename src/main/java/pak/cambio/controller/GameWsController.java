package pak.cambio.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.yaml.snakeyaml.events.Event;
import pak.cambio.dto.ChatDTO;
import pak.cambio.dto.ChatMessageDTO;
import pak.cambio.model.*;
import pak.cambio.repository.ChatRepository;
import pak.cambio.repository.GameRepository;
import pak.cambio.repository.UserRepository;
import pak.cambio.service.GameService;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

@Controller
public class GameWsController {

    private GameService gameService;

    private SimpMessagingTemplate messaging;

    private ChatRepository chatRepository;

    private UserRepository userRepository;

    private GameRepository gameRepository;

    public GameWsController(GameService gameService, SimpMessagingTemplate messaging, ChatRepository chatRepository, GameRepository gameRepository, UserRepository userRepository) {
        this.gameService = gameService;
        this.messaging = messaging;
        this.chatRepository = chatRepository;
        this.gameRepository = gameRepository;
        this.userRepository = userRepository;
    }

    /**
     * Client sends to /app/game/{gameId}/action
     * We apply the action, then broadcast the resulting GameState to /topic/game.{gameId}.state
     */
    @MessageMapping("/game/{gameId}/action")
    public void handleAction(@DestinationVariable Long gameId, GameAction action) {
        // NOTE: In production, verify the principal (Principal) to ensure action.userId matches the authenticated user
        // Increment seq atomically in the service
        int nextSeq = gameService.incrementSeq();
        action.setSeq(nextSeq);

        // Apply the action in the engine and get updated state
        GameState updatedState = gameService.applyAction(gameId, action);
//        updatedState.setSeq(nextSeq);
//
//        // Special handling for STICK payload
//        if (action.getType() == ActionType.STICK) {
//            Map<String, Object> newPayload = action.getPayload();
//            newPayload.put("didStickWork", updatedState.isDidStickWork());
//            action.setPayload(newPayload);
//        }

        // Broadcast action for animations
        messaging.convertAndSend("/topic/game." + gameId + ".action", action);

        // Broadcast updated state for rendering
        messaging.convertAndSend("/topic/game." + gameId + ".state", updatedState);

        //Update DB if game is over
//        if(updatedState.getWinner() != null) {
//            List<GameState.PlayerView> players = updatedState.getPlayers();
//            ArrayList<Long> ids = new ArrayList<Long>();
//            for(GameState.PlayerView p : players) {
//               ids.add(p.getUserId());
//            }
//            List<User> users = userRepository.findAllById(ids);
//            for(User u : users) {
//                if(u.getUsername().equals(updatedState.getWinner().getUser())) {
//                    System.out.println("Adding win to " + u.getUsername());
//                    u.setWins(u.getWins() + 1);
//                }
//                else {
//                    System.out.println("Adding loss to " + u.getUsername());
//                    u.setLoses(u.getLoses() + 1);
//                }
//                userRepository.save(u);
//            }
//            Game game = gameRepository.findById(gameId).orElseThrow();
//            game.setStatus("Finished");
//            gameRepository.save(game);
//        }
    }

    @MessageMapping("/game/{gameId}/join")
    public void joinGame(@DestinationVariable Long gameId, Long userId) {
        GameState state = gameService.snapshotFor(gameId, userId);
        messaging.convertAndSend("/topic/game" + gameId + ".state", state);
    }

    @MessageMapping("/game/{gameId}/chat")
    public void handleChatMessage(@DestinationVariable Long gameId, ChatMessageDTO dto) {
        User user = userRepository.findById(dto.userId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        Chat chat = new Chat(dto.message(), game, user);
        chatRepository.save(chat);

        // Broadcast to all clients
        messaging.convertAndSend("/topic/game." + gameId + ".chat",
                new ChatDTO(user.getUsername(), chat.getMessage(), chat.getCreatedAt()));
    }

}

