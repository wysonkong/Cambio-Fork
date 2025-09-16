package pak.cambio.model;

import java.util.Deque;
import java.util.List;

public class GameState {
    private final List<PlayerView> players;
    private final Deque<Card> deck;
    private final Card prevCard;
    private final int currentTurn;

    public GameState(List<PlayerView> players, Deque<Card> deck, Card prevCard, int currentTurn) {
        this.players = players;
        this.deck = deck;
        this.prevCard = prevCard;
        this.currentTurn = currentTurn;

    }

    public List<PlayerView> getPlayers() {
        return players;
    }

    public Deque<Card> getDeck() {
        return deck;
    }

    public Card getPrevCard() {
        return prevCard;
    }

    public int getCurrentTurn() {
        return currentTurn;
    }

    public static class PlayerView {
        private final Long userId;
        private final String userName;
        private final int index;
        private final List<Card> hand;

        public PlayerView(Long userId, String userName, int index, List<Card> hand) {
            this.userId = userId;
            this.userName = userName;
            this.index = index;
            this.hand = hand;
        }

        public Long getUserId() {
            return userId;
        }

        public String getUserName() {
            return userName;
        }

        public int getIndex() {
            return index;
        }

        public List<Card> getHand() {
            return hand;
        }
    }
}
