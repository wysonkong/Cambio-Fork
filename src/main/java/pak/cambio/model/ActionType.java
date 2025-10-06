package pak.cambio.model;

public enum ActionType {
    DRAW_DECK,
    STICK,
    SWAP_PENDING,
    DISCARD_PENDING,// take from deck
    DRAW_DISCARD,   // take from discard
    SWAP,           // swap drawn card with one in hand
    DISCARD,        // discard drawn card
    CALL_CAMBIO,     // end game call
    START //start game
}
