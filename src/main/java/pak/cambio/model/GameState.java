package pak.cambio.model;

import java.util.ArrayList;
import java.util.List;

public class GameState {
    private final List<PlayerView> players;
    private final Card prevCard;
    private final int currentTurn;
    private final boolean cambioCalled;
    private final boolean didStickWork;
    private final int specialMove;
    private final ArrayList<Player> winners;
    private final boolean tempTurn;
    private final boolean gameStarted;
    private final Player cambioPlayer;
    private int seq;

    public GameState(List<PlayerView> players, Card prevCard, int currentTurn, boolean cambioCalled, boolean didStickWork, int specialMove, ArrayList<Player> winners, boolean tempTurn, boolean gameStarted, Player cambioPlayer, int seq) {
        this.players = players;
        this.prevCard = prevCard;
        this.currentTurn = currentTurn;
        this.cambioCalled = cambioCalled;
        this.didStickWork = didStickWork;
        this.specialMove = specialMove;
        this.winners = winners;
        this.tempTurn = tempTurn;
        this.gameStarted = gameStarted;
        this.cambioPlayer = cambioPlayer;
        this.seq = seq;
    }

    public int getSeq() {
        return seq;
    }

    public void setSeq(int seq) {
        this.seq = seq;
    }

    public Player getCambioPlayer() {
        return cambioPlayer;
    }

    public boolean isGameStarted() {
        return gameStarted;
    }

    public boolean isTempTurn() {
        return tempTurn;
    }

    public int getSpecialMove() {
        return specialMove;
    }

    public ArrayList<Player> getWinners() {
        return winners;
    }

    public boolean isCambioCalled() {
        return cambioCalled;
    }

    public boolean isDidStickWork() {
        return didStickWork;
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
        private final List<Card> hand;
        private final int score;
        private final Card pending;

        public PlayerView(Long userId, String userName, int index, List<Card> hand, int score, Card pending) {
            this.userId = userId;
            this.userName = userName;
            this.index = index;
            this.hand = hand;
            this.score = score;
            this.pending = pending;
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

        public int getScore() { return score; }

        public Card getPending() {
            return pending;
        }
    }
}
