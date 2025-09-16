package pak.cambio.engine;

import pak.cambio.model.Card;
import pak.cambio.model.GameState;
import pak.cambio.model.Player;

import java.util.*;

public class GameEngine {
    private final Deque<Card> deck = new ArrayDeque<Card>();
    private final List<Player> players = new ArrayList<Player>();
    private int currentTurn;
    private Card prevCard;

    public GameEngine(List<Player> initialPlayers) {
        this.players.addAll(initialPlayers);
        shuffleAndDeal();
    }

    private void shuffleAndDeal() {
        List<Card> fullDeck = new LinkedList<Card>();
        for(int i = 1; i < 14; i++) {
            for(int j = 1; j < 5; j++) {
                fullDeck.add(new Card(i,j,true, true));
            }
        }
        fullDeck.add(new Card(-1, 0, true, true));
        fullDeck.add(new Card(-2, 0, true, true));

        Collections.shuffle(fullDeck);
        deck.clear();
        fullDeck.forEach(deck::addLast);
        for(int i = 0; i < 4; i++) {
            for (Player p : players) {
                p.addCard(deck.getFirst());
            }
        }

    }


    //To do
    public void drawCard(Player player) {
        Card stage = deck.getFirst();
        stage.setHiddenToMe(false);

    }



    //GAME STATE
    public GameState snapshotState(Long requestUserId) {
        List<GameState.PlayerView> views = players.stream()
                .map(p-> {
                    List<Card> hand = p.getId() == (requestUserId) ? p.getHand() : List.of();
                    return new GameState.PlayerView(
                            p.getId(),
                            p.getUser(),
                            p.getIndex(),
                            hand
                    );
                }).toList();
        return new GameState(views, deck, prevCard, currentTurn);
    }

}
