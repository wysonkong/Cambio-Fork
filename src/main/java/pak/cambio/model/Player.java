package pak.cambio.model;

import jakarta.persistence.*;

import java.util.*;


public class Player {

    private long id;
    private String user;
    private int score;
    private List<Card> hand;
    private int index;
    private Card pending;
    private Map<Long, Set<Integer>> visibleToMe;

    public Player() {

    }



    public Player(long id, String user, int score, int index) {
        this.id = id;
        this.user = user;
        this.score = score;
        this.hand = new ArrayList<Card>();
        this.index = index;
        this.visibleToMe = new HashMap<>();
    }

    public void makeCardVisible(long userId, int index) {
        if(this.visibleToMe.containsKey(userId)) {
            this.visibleToMe.get(userId).add(index);
        }
        else {
            Set<Integer> visible = new HashSet<Integer>();
            visible.add(index);
            this.visibleToMe.put(userId, visible);
            System.out.println("added card " + index + " to player " + userId);
        }
    }

    public void hideCard(long userId, int index) {
        if(this.visibleToMe.containsKey(userId)) {
            this.visibleToMe.get(userId).remove(index);
        }
    }

    public Map<Long, Set<Integer>> getVisibleToMe() {
        return visibleToMe;
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

    public void setVisibleToMe(Map<Long, Set<Integer>> visibleToMe) {
        this.visibleToMe = visibleToMe;
    }

    public boolean isVisible(long id, int index) {
        if(this.visibleToMe.containsKey(id)) {
            if(this.visibleToMe.get(id).contains(index)) {
                return true;
            }
        }
        return false;
    }

    public void swapVisible(long originId, int origin, long destinationId, int destination) {
        if(isVisible(originId, origin) && isVisible(destinationId, destination)) {
            return;
        }
        if(isVisible(originId, origin)) {
            this.visibleToMe.get(originId).remove(origin);
            makeCardVisible(destinationId, destination);
            return;
        }
        if(isVisible(destinationId, destination)) {
            this.visibleToMe.get(destinationId).remove(destination);
            makeCardVisible(originId, origin);
            return;
        }

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
}
