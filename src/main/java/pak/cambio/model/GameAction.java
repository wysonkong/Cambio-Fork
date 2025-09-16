package pak.cambio.model;

public class GameAction {
    private Long userId;
    private ActionType type;
    private Integer handIndex;
    private Card card;


    public GameAction(Long userId, ActionType type, Integer handIndex, Card card) {
        this.userId = userId;
        this.type = type;
        this.handIndex = handIndex;
        this.card = card;
    }

    public Long getUserId() {
        return userId;
    }

    public ActionType getType() {
        return type;
    }

    public Integer getHandIndex() {
        return handIndex;
    }

    public Card getCard() {
        return card;
    }
}
