package pak.cambio.model;

import jakarta.persistence.*;

@Entity
@Table(name="users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(unique = true, nullable = false)
    private String username;
    private String password;
    int wins;
    int loses;
    private String avatar;

    private String ownedAvatars;
    private String card;

    private String ownedCards;
    private int balance;


    public User() {

    }

    public User(String username, String password, int wins, int loses) {
        this.username = username;
        this.password = password;
        this.wins = wins;
        this.loses = loses;
        this.avatar = "dog";
        this.ownedAvatars = "dog";
        this.card = "default";
        this.ownedCards = "default";
    }

    public int getBalance() {
        return balance;
    }

    public void setBalance(int balance) {
        this.balance = balance;
    }

    public String getCard() {
        return card;
    }

    public String getOwnedAvatars() {
        return ownedAvatars;
    }

    public void setOwnedAvatars(String ownedAvatars) {
        this.ownedAvatars = ownedAvatars;
    }

    public String getOwnedCards() {
        return ownedCards;
    }

    public void setOwnedCards(String ownedCards) {
        this.ownedCards = ownedCards;
    }

    public void setCard(String card) {
        this.card = card;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public int getLoses() {
        return loses;
    }

    public void setLoses(int loses) {
        this.loses = loses;
    }

    public int getWins() {
        return wins;
    }

    public void setWins(int wins) {
        this.wins = wins;
    }
}
