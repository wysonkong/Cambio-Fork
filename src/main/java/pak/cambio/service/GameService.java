package pak.cambio.service;

import org.springframework.stereotype.Service;
import pak.cambio.engine.GameEngine;
import pak.cambio.model.*;
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


        // assign seat = next free index
        int seat = playersByGame.get(gameId).size();
        Player p = new Player(userId, displayName, 0, seat);
        playersByGame.get(gameId).add(p);



        return new GameState(playersByGame.get(gameId).stream()
                .map(pp -> new GameState.PlayerView(pp.getId(), pp.getUser(), pp.getIndex(),
                        List.of(), -1)).toList(),
                null, 0, false);
    }


    public GameState startGame(long gameId, long userId) {
        List<Player> players = playersByGame.get(gameId);
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
                return engine.snapshotState(userId);
            } catch (Exception e) {
                e.printStackTrace();
                throw e;
            }
        }
        throw new RuntimeException("Cannot initialize game engine");
    }


    /**
     * Apply an action to the game's engine. Returns the engine snapshot for broadcasting.
     */
    public GameState applyAction(Long gameId, GameAction action) {
        GameEngine engine = activeEngines.get(gameId);
        if (engine == null && action.getType() == ActionType.START) {
            startGame(gameId, action.getUserId());
            engine = activeEngines.get(gameId);
        }
        else if(engine == null && !(action.getType() == ActionType.START)) {
            throw new IllegalStateException("Game not running: " + gameId);
        }
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
