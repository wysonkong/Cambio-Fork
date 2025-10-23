package pak.cambio.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.time.ZoneId;

public class ChatDTO {
    @JsonProperty("sender")
    private String sender;

    @JsonProperty("content")
    private String content;

    @JsonProperty("timestamp")
    private long timestamp; // use epoch millis for JS

    public ChatDTO(String sender, String content, LocalDateTime createdAt) {
        this.sender = sender;
        this.content = content;
        this.timestamp = createdAt.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
    }

    // getters required for Jackson
    public String getSender() { return sender; }
    public String getContent() { return content; }
    public long getTimestamp() { return timestamp; }
}
