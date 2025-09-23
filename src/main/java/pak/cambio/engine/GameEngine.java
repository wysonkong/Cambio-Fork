package pak.cambio.engine;

import pak.cambio.model.Card;
import pak.cambio.model.GameAction;
import pak.cambio.model.GameState;
import pak.cambio.model.Player;

import java.util.*;

public class GameEngine {
    private final Deque<Card> deck = new ArrayDeque<Card>();
    private final Deque<Card> discard = new ArrayDeque<Card>();
    private final List<Player> players = new ArrayList<Player>();
    private boolean cambioCalled = false;
    private int currentTurn = 0;

    public GameEngine(List<Player> initialPlayers) {
        this.players.addAll(initialPlayers);
    }

    public void startNewGame() {
        shuffleAndDeal();
    }

    private void shuffleAndDeal() {
        List<Card> fullDeck = new LinkedList<Card>();
        fullDeck = Card.standard();

        Collections.shuffle(fullDeck);
        deck.clear();
        fullDeck.forEach(deck::addLast);
        for(Player p : players) {
            List<Card> hand = new ArrayList<Card>();
            List<Boolean> visible = new ArrayList<Boolean>();
            for(int i =0; i < 4; i++) {
                hand.add(deck.removeFirst());
                visible.add(i < 2);
            }
            p.setHand(hand);
            p.setVisible(visible);
        }
        discard.clear();
        discard.add(deck.removeLast());
        cambioCalled = false;
    }

    public GameState applyAction(GameAction action) {
        Player player = findPlayer(action.getUserId());

        switch (action.getType()) {
            case DRAW_DECK -> {
                action = new GameAction(player.getId(), player.getUser(), action.getType(), null, deck.removeFirst());
            }
            case DRAW_DISCARD -> {
                action = new GameAction(player.getId(), player.getUser(), action.getType(), null, discard.removeFirst());
            }
            case SWAP -> {
                Card newCard = action.getCard();
                int idx = action.getHandIndex();
                Card old = player.getHand().get(idx);
                player.getHand().set(idx, newCard);
                player.getVisible().set(idx, true);
                discard.addFirst(old);
            }
            case DISCARD -> {
                discard.addFirst(action.getCard());
            }
            case CALL_CAMBIO -> {
                cambioCalled = true;
            }
            case START -> {
                startNewGame();
            }
        }

        advanceTurn();
        return snapshotState(action.getUserId());
    }

    //To do
    public Player findPlayer(long id) {
        Player result = null;
        for(Player p : players) {
            if(p.getId() == id) {
                result = p;
            }
        }
        return result;
    }

    public void advanceTurn() {
        currentTurn = (currentTurn + 1) % players.size();
    }



    //GAME STATE
    public GameState snapshotState(Long requestingUserId) {
        List<GameState.PlayerView> views = new ArrayList<>();
        for (Player p : players) {
            List<Card> handView = new ArrayList<>();
            for (int i = 0; i < p.getHand().size(); i++) {
                if (p.getId() == requestingUserId || p.getVisible().get(i) || cambioCalled) {
                    p.getHand().get(i).setVisible(true);
                    handView.add(p.getHand().get(i));
                } else {
                    p.getHand().get(i).setVisible(true);
                    handView.add(p.getHand().get(i));
                }
            }
            int score = cambioCalled ? p.getScore() : -1;
            views.add(new GameState.PlayerView(
                    p.getId(),
                    p.getUser(),
                    p.getIndex(),
                    handView,
                    score
            ));
        }

        return new GameState(views, discard.peekFirst(), currentTurn, cambioCalled);
    }

}
