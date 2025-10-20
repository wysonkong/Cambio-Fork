package pak.cambio.model;

import java.util.Map;

public class GameAction {
    private Long userId;
    private String username;
    private ActionType type;
    private Map<String, Object> payload;
    private int seq;


    public GameAction(Long userId, String username, ActionType type, Map<String, Object> payload, int seq) {
        this.userId = userId;
        this.username = username;
        this.type = type;
        this.payload = payload;
        this.seq = seq;
    }

    public String getUsername() {
        return username;
    }

    public int getSeq() {
        return seq;
    }

    public void setSeq(int seq) {
        this.seq = seq;
    }

    public Long getUserId() {
        return userId;
    }

    public ActionType getType() {
        return type;
    }

    public Integer getInt(String key) {
        Object val = payload.get(key);
        if(val instanceof Number) {
            return ((Number) val).intValue();
        }
        return null;
    }

    public String getString(String key) {
        return payload.containsKey(key) ? (String) payload.get(key) : null;
    }

    public Long getLong(String key) {
        Object val = payload.get(key);
        if(val instanceof Number) {
            return ((Number) val).longValue();
        }
        return null;
    }


    public Map<String, Object> getPayload() { return payload; }
    public void setPayload(Map<String, Object> payload) { this.payload = payload; }

}
