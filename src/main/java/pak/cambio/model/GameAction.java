package pak.cambio.model;

import java.util.Map;

public class GameAction {
    private Long userId;
    private String username;
    private ActionType type;
    private Map<String, Object> payload;


    public GameAction(Long userId, String username, ActionType type, Map<String, Object> payload) {
        this.userId = userId;
        this.username = username;
        this.type = type;
        this.payload = payload;
    }

    public String getUsername() {
        return username;
    }



    public Long getUserId() {
        return userId;
    }

    public ActionType getType() {
        return type;
    }

    public Integer getInt(String key) {
        return payload.containsKey(key) ? (Integer) payload.get(key) : null;
    }

    public String getString(String key) {
        return payload.containsKey(key) ? (String) payload.get(key) : null;
    }

    public Long getLong(String key) {
        return payload.containsKey(key) ? (Long) payload.get(key) : null;
    }


    public Map<String, Object> getPayload() { return payload; }
    public void setPayload(Map<String, Object> payload) { this.payload = payload; }

}
