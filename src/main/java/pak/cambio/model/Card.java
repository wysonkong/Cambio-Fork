package pak.cambio.model;
import jakarta.persistence.*;

public class Card {
    private String rank;
    private String suit;
    private boolean hiddenToMe;
    private boolean hiddenToYou;

    public Card() {

    }

    public Card(String rank, String suit) {
        this.rank = rank;
        this.suit = suit;
    }

    public int getValue() {
       return switch(rank) {
           case "A" -> 1;
           case "J", "Q", "K" -> 10;
           default -> Integer.parseInt(rank);
       };
    }


    public String getSuit() {
        return suit;
    }

    public String getRank() {
        return rank;
    }
}
