package pak.cambio.model;
import jakarta.persistence.*;

public class Card {
    private String rank;
    private String suit;
    private boolean visible;

    public Card() {

    }

    public Card(String rank, String suit) {
        this.rank = rank;
        this.suit = suit;
        visible = false;
    }

    public int getValue() {
        int value = 0;
       switch(rank) {
           case "A" -> value = 1;
           case "J", "Q", "K" -> value = 10;
           case "Joker" -> value = 0;
           default -> value = Integer.parseInt(rank);
       };
       if(rank.equals("K") && (suit.equals("Diamond") || suit.equals("Heart"))) {
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
        deck.add(new Card("Joker", "Little"));
        deck.add(new Card("Joker", "Big"));
        return deck;
    }


    public String getSuit() {
        return suit;
    }

    public String getRank() {
        return rank;
    }

    public boolean isVisible() {
        return visible;
    }

    public void setVisible(boolean visible) {
        this.visible = visible;
    }
}
