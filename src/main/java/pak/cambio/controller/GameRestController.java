package pak.cambio.controller;


import pak.cambio.model.GameState;
import pak.cambio.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/games")
public class GameRestController {

    @Autowired
    private GameService gameService;

    @PostMapping("/create")
    public Long createGame() {
        return gameService.createGame();
    }

    @PostMapping("/{gameId}/join")
    public GameState joinGame(@PathVariable Long gameId,
                              @RequestParam Long userId,
                              @RequestParam String displayName) {
        return gameService.joinGame(gameId, userId, displayName);
    }
}
