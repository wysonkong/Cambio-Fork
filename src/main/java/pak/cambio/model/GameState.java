package pak.cambio.model;

import java.util.Deque;
import java.util.List;

public class GameState {
    private final List<PlayerView> players;
    private final Card prevCard;
    private final int currentTurn;
    private final boolean cambioCalled;

    public GameState(List<PlayerView> players, Card prevCard, int currentTurn, boolean cambioCalled) {
        this.players = players;
        this.prevCard = prevCard;
        this.currentTurn = currentTurn;
        this.cambioCalled = cambioCalled;

    }

    public boolean isCambioCalled() {
        return cambioCalled;
    }

    public List<PlayerView> getPlayers() {
        return players;
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
        private final List<String> hand;
        private final int score;

        public PlayerView(Long userId, String userName, int index, List<String> hand, int score) {
            this.userId = userId;
            this.userName = userName;
            this.index = index;
            this.hand = hand;
            this.score = score;
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

        public List<String> getHand() {
            return hand;
        }

        public int getScore() { return score; }
    }
}
