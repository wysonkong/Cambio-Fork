package pak.cambio.game;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "games")
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String status; //lobby, running, finished

    @Lob
    private String stateJson;
    private Instant createdAt = Instant.now();

    public Game(){

    }

    public Game(String status) {
        this.status = status;
    }

    public long getId() {
        return id;
    }


    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStateJson() {
        return stateJson;
    }

    public void setStateJson(String stateJson) {
        this.stateJson = stateJson;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

}
