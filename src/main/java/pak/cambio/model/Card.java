package pak.cambio.model;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

public class Card {
    private String rank;
    private String suit;
    private Set<Long> visible;

    public Card() {

    }

    public Card(String rank, String suit) {
        this.rank = rank;
        this.suit = suit;
        this.visible = new HashSet<Long>();
    }

    public int getValue() {
        int value = 0;
       switch(rank) {
           case "A" -> value = 1;
           case "J", "Q", "K" -> value = 10;
           default -> value = Integer.parseInt(rank);
       };
       if(rank.equals("K") && (suit.equals("Spade") || suit.equals("Club"))) {
           value = -1;
       }
       return value;
    }

    public static java.util.List<Card> standard() {
        String[] ranks = {"A","2","3","4","5","6","7","8","9","10","J","Q","K"};
        String[] suits = {"Spade","Heart","Diamond","Club"};
        java.util.List<Card> deck = new java.util.ArrayList<>();
        for (String r : ranks) {
            for (String s : suits) {
                deck.add(new Card(r, s));
            }
        }
        return deck;
    }

    public Set<Long> getVisible() {
        return visible;
    }

    public void makeVisibleTo(long id) {
        if(!this.visible.contains(id)) {
            this.visible.add(id);
        }
    }

    public void removeVisibleTo(long id) {
        if(this.visible.contains(id)) {
            this.visible.remove(id);
        }
    }


    public String getSuit() {
        return suit;
    }

    public String getRank() {
        return rank;
    }

}
