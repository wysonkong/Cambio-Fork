//This file handles user inputs (chat, event listeners)

// ===== Chat =====
sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
    const content = chatInput.value.trim();
    if (!content) return;

    const user = JSON.parse(sessionStorage.getItem("currentUser"));
    const message = {
        userId: user.userId,
        gameId: gameId,
        message: content,
        timestamp: Date.now()
    };

    console.log("sending message " + JSON.stringify(message));
    stompClient.send(`/app/game/${gameId}/chat`, {}, JSON.stringify(message));
    chatInput.value = '';
}

// ===== Buttons =====
buttons.cambio.addEventListener("click", endTurn);
buttons.discard.addEventListener("click", () => {
    console.log("Discarded pending draw");
    sendAction(gameId, currentUser.userId, currentUser.username, "DISCARD_PENDING",{});
    specialMoves();
});

drawBtn.addEventListener("click", () => {
    console.log("Drew a card");
    sendAction(gameId, currentUser.userId, currentUser.username, "DRAW_DECK", {});
    cardPending = true;
    hasDrawn = true;
});

playBtn.addEventListener("click", () => {
    swapModeActive = true;
    console.log("Swapping mode activated, select origin and destination cards");
});

cambioBtn.addEventListener("click", () => {
    console.log("Called Cambio!");
    sendAction(gameId, currentUser.userId, currentUser.username, "CALL_CAMBIO", {});
});

// stickBtn.addEventListener("click", () => {
//     console.log("Stick");
//     sendAction(gameId, currentUser.userId, currentUser.username,"CALL_STICK", {});
// });

start.addEventListener('click', () => {
    start.hidden = true;
    sendAction(gameId, currentUser.userId, currentUser.username, "START", {});
});

// ===== Swap Mode (Card Clicks) =====
document.body.addEventListener("click", (card) => {
    if (card.target.matches("img.card")) {
        let raw = card.target.id.split("-");
        if (swapState.originIndex === null) {
            swapState.originUserId = parseInt(raw[0], 10);
            swapState.originIndex = parseInt(raw[1], 10);
            console.log("Origin card is " + swapState.originIndex + " and user Id is " + swapState.originUserId);
        } else if (swapState.destinationIndex === null) {
            swapState.destinationIndex = parseInt(raw[1], 10);
            swapState.destinationUserId = parseInt(raw[0], 10);
            console.log("Destination card is " + swapState.destinationIndex + " and user Id is " + swapState.destinationUserId);

            sendAction(gameId, currentUser.userId, currentUser.username, "SWAP", {
                origin: swapState.originIndex,
                originUserId: swapState.originUserId,
                destination: swapState.destinationIndex,
                destinationUserId: swapState.destinationUserId
            });

            // Reset swap state
            swapState = { originIndex: null, originUserId: null, destinationIndex: null, destinationUserId: null };
            swapModeActive = false;
        }
    }
});

// Special move function for draw card
function specialMoves() {

}
