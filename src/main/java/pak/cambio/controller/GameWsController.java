package pak.cambio.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import pak.cambio.model.GameAction;
import pak.cambio.model.GameState;
import pak.cambio.service.GameService;

@Controller
public class GameWsController {

    @Autowired
    private GameService gameService;

    @Autowired
    private SimpMessagingTemplate messaging;

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
    }
}

