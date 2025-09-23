package pak.cambio.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import pak.cambio.dto.ChatDTO;
import pak.cambio.dto.ChatMessageDTO;
import pak.cambio.model.*;
import pak.cambio.repository.ChatRepository;
import pak.cambio.repository.GameRepository;
import pak.cambio.repository.UserRepository;
import pak.cambio.service.GameService;

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
        GameState updatedForRequester = gameService.applyAction(gameId, action);

        // Broadcast full state to all players
        // We broadcast the snapshot *as seen by the action initiator* for convenience.
        // If you prefer to broadcast individualized states (hiding certain cards per player),
        // you can iterate all players and messaging.convertAndSendToUser(...) accordingly.
        messaging.convertAndSend("/topic/game." + gameId + ".state", updatedForRequester);
        messaging.convertAndSend("/topic/game." + gameId + ".action", action);
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

