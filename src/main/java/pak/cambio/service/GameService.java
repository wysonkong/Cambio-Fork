package pak.cambio.service;

import org.springframework.stereotype.Service;
import pak.cambio.engine.GameEngine;
import pak.cambio.model.Game;
import pak.cambio.model.GameAction;
import pak.cambio.model.GameState;
import pak.cambio.model.Player;
import pak.cambio.repository.GameRepository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class GameService {
    // active in-memory games
    private final ConcurrentHashMap<Long, GameEngine> activeEngines = new ConcurrentHashMap<>();
    // map gameId -> list of players (useful to create PlayerState objects)
    private final ConcurrentHashMap<Long, List<Player>> playersByGame = new ConcurrentHashMap<>();

//    private final AtomicLong gameIdCounter = new AtomicLong(1);
    private final GameRepository gameRepository;

    public GameService(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    /**
     * Creates a new game and returns its id.
     */
    public Long createGame(Game game) {
//        Long id = gameIdCounter.getAndIncrement();
        // start with empty player list, GameEngine created when first player joins (or created here with placeholders)
        gameRepository.save(game);
        playersByGame.put(game.getId(), Collections.synchronizedList(new ArrayList<>()));
        return game.getId();
    }

    /**
     * Player joins a game and returns current GameState for that player.
     * In a real app, prevent duplicate seats and apply auth checks.
     */
    public GameState joinGame(Long gameId, Long userId, String displayName) {

        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new IllegalArgumentException("Game not found: " + gameId));
        playersByGame.computeIfAbsent(gameId, k -> Collections.synchronizedList(new ArrayList<>()));

        List<Player> players = playersByGame.get(gameId);
        if (players == null) throw new IllegalArgumentException("Game not found: " + gameId);

        // assign seat = next free index
        int seat = players.size();
        Player p = new Player(userId, displayName, 0, seat);
        players.add(p);

        // If we have enough players to start now (you can choose threshold), create engine:
        if (players.size() >= 2 && !activeEngines.containsKey(gameId)) {
            // initialize GameEngine with copies of player states
            try {
                List<Player> enginePlayers = new ArrayList<>();
                for (Player orig : players) {
                    enginePlayers.add(new Player(orig.getId(), orig.getUser(), orig.getScore(), orig.getIndex()));
                }
                GameEngine engine = new GameEngine(enginePlayers);
                activeEngines.put(gameId, engine);
            } catch (Exception e) {
                e.printStackTrace();
                throw e;
            }
        }

        // If engine exists, return snapshot; otherwise return minimal state with waiting players
        GameEngine engine = activeEngines.get(gameId);
        if (engine != null) {
            System.out.println("Engine exists for game " + gameId);
        } else {
            System.out.println("No engine yet for game " + gameId);
        }
        if (engine != null) {
            return engine.snapshotState(userId);
        } else {
            // build simple waiting GameState: no discard, currentIndex = 0
            return new GameState(players.stream()
                    .map(pp -> new GameState.PlayerView(pp.getId(), pp.getUser(), pp.getIndex(),
                            List.of(null, null, null, null), -1)).toList(),
                    null, 0, false);
        }
    }


    /**
     * Apply an action to the game's engine. Returns the engine snapshot for broadcasting.
     */
    public GameState applyAction(Long gameId, GameAction action) {
        GameEngine engine = activeEngines.get(gameId);
        if (engine == null) throw new IllegalStateException("Game not running: " + gameId);
        // engine.applyAction will mutate engine and return snapshot for the requesting player
        System.out.println("Applying action " + action.getType() + " for game " + gameId);
        return engine.applyAction(action);
    }

    /**
     * For controllers that want to broadcast the state for everyone, get snapshot for a given user id.
     */
    public GameState snapshotFor(Long gameId, Long userId) {
        GameEngine engine = activeEngines.get(gameId);
        if (engine == null) throw new IllegalStateException("Game not running: " + gameId);
        return engine.snapshotState(userId);
    }
}
