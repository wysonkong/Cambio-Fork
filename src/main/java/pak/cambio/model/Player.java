package pak.cambio.model;

import java.util.ArrayList;
import java.util.List;


public class Player {

    private long id;
    private String user;
    private int score;
    private List<Card> hand;
    private int index;
    private Card pending;

    public Player() {

    }



    public Player(long id, String user, int score, int index) {
        this.id = id;
        this.user = user;
        this.score = score;
        this.hand = new ArrayList<Card>();
        this.index = index;
    }




    public Card getPending() {
        return pending;
    }

    public void setPending(Card pending) {
        this.pending = pending;
    }

    public int getIndex() {
        return index;
    }

    public void setHand(List<Card> hand) {
        this.hand = hand;
    }


    public long getId() {
        return id;
    }

    public List<Card> getHand() {
        return hand;
    }

    public String getUser() {
        return user;
    }




    public int getScore() {
        score = 0;
        for(Card c : hand) {
            score += c.getValue();
        }
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    @Override
    public boolean equals(Object obj) {
        if(obj instanceof Player player) {
            return this.getId() == player.getId();
        }
        return false;
    }
}
