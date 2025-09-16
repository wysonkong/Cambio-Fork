package pak.cambio.model;
import jakarta.persistence.*;

@Entity
public class Card {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private int value;
    private int suit;
    private boolean hiddenToMe;
    private boolean hiddenToYou;

    public Card() {

    }

    public Card(int value, int suit, boolean hiddenToMe, boolean hiddenToYou) {
        this.value = value;
        this.suit = suit;
        this.hiddenToMe = hiddenToMe;
        this.hiddenToYou = hiddenToYou;
    }

    public boolean isHiddenToMe() {
        return hiddenToMe;
    }

    public void setHiddenToMe(boolean hiddenToMe) {
        this.hiddenToMe = hiddenToMe;
    }

    public boolean isHiddenToYou() {
        return hiddenToYou;
    }

    public void setHiddenToYou(boolean hiddenToYou) {
        this.hiddenToYou = hiddenToYou;
    }

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }

    public int getSuit() {
        return suit;
    }

    public void setSuit(int suit) {
        this.suit = suit;
    }
}
