package pak.cambio.controller;


import pak.cambio.model.Game;
import pak.cambio.model.GameState;
import pak.cambio.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/games")
public class GameRestController {

    @Autowired
    private GameService gameService;

    @PostMapping("/create")
    public Map<String, Object> createGame(@RequestBody Map<String, String> payload) {
        Long userId = Long.parseLong(payload.get("userId"));
        Game newGame = new Game("running");
        Long gameId = gameService.createGame(newGame);
        return Map.of("gameId", gameId);
    }

    @PostMapping("/join")
    public GameState joinGame(@RequestBody Map<String, String> payload) {
        Long userId = Long.parseLong(payload.get("userId"));
        String username = payload.get("username");
        Long gameId = Long.parseLong(payload.get("gameId"));

        return gameService.joinGame(gameId, userId, username);
    }
}
