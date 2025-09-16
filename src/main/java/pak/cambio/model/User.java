package pak.cambio.model;

import jakarta.persistence.*;

@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(unique = true, nullable = false)
    private String username;
    int wins;
    int loses;

    public User() {

    }

    public User(String username, int wins, int loses) {
        this.username = username;
        this.wins = wins;
        this.loses = loses;
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
