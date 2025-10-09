//This file handles user inputs (chat, event listeners)
document.addEventListener("DOMContentLoaded", fetchUsers);

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
buttons.discard.addEventListener("click", () => {
    console.log("Discarded pending draw");
    sendAction(gameId, currentUser.userId, currentUser.username, "DISCARD_PENDING",{});
    endTurn();
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
    endTurn();
});

swapPendingBtn.addEventListener("click", () => {
    console.log("Select one of your cards to swap with the drawn card");
    swapPendingModeActive = true;
});

stickBtn.addEventListener("click", () => {
    console.log("Stick!");
    stickModeActive = true;
})

// stickBtn.addEventListener("click", () => {
//     console.log("Stick");
//     sendAction(gameId, currentUser.userId, currentUser.username,"CALL_STICK", {});
// });

const usersMap = new Map();

async function fetchUsers() {
    try {
        const response = await fetch("http://localhost:8080/api/standings", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) throw new Error("Failed to fetch users");

        const users = await response.json();

        usersMap.clear();
        users.forEach(user => usersMap.set(user.id, user));

        console.log("Fetched users:", users);

    } catch (err) {
        console.error("Error fetching users:", err);
    }
}


start.addEventListener('click', async () => {
    start.hidden = true;

        sendAction(gameId, currentUser.userId, currentUser.username, "START", {});

});

// ===== Swap Mode (Card Clicks) =====
document.body.addEventListener("click", (card) => {
    if (card.target.matches("img.card")) {
        let raw = card.target.id.split("-");
        if (swapModeActive) {
            if (swapState.originIndex === null) {
                swapState.originUserId = parseInt(raw[0], 10);
                swapState.originIndex = parseInt(raw[1], 10);
                console.log("Origin card is " + swapState.originIndex + " and user Id is " + swapState.originUserId);
                return;
            } if (swapState.destinationIndex === null) {
                swapState.destinationIndex = parseInt(raw[1], 10);
                swapState.destinationUserId = parseInt(raw[0], 10);
                console.log("Destination card is " + swapState.destinationIndex + " and user Id is " + swapState.destinationUserId);

                sendAction(gameId, currentUser.userId, currentUser.username, "SWAP", {
                    origin: swapState.originIndex,
                    originUserId: swapState.originUserId,
                    destination: swapState.destinationIndex,
                    destinationUserId: swapState.destinationUserId
                });
            }
        }
        else if(stickModeActive) {
            if(swapState.originIndex === null) {
                swapState.originUserId = parseInt(raw[0], 10);
                swapState.originIndex = parseInt(raw[1], 10);
                console.log("Origin card is " + swapState.originIndex + " and user Id is " + swapState.originUserId);
                sendAction(gameId, currentUser.userId, currentUser.username, "STICK", {
                    origin: swapState.originIndex,
                    originUserId: swapState.originUserId
                })
            }
        }
        else if(swapPendingModeActive) {
            if(swapState.destinationIndex === null) {
                swapState.destinationIndex = parseInt(raw[1], 10);
                swapState.destinationUserId = parseInt(raw[0], 10);
                console.log("Destination card is " + swapState.destinationIndex + " and user Id is " + swapState.destinationUserId);
                sendAction(gameId, currentUser.userId, currentUser.username, "SWAP_PENDING", {
                    destination: swapState.destinationIndex,
                    destinationUserId: swapState.destinationUserId
                })
            }
        }
        else if(peekMeActive) {
            let ID = parseInt(raw[0], 10);
            let IDX = parseInt(raw[1], 10);
            if(ID === currentUser.userId) {
                sendAction(gameId, currentUser.userId, currentUser.username, "PEEK", {
                    id: ID,
                    idx: IDX
                })
                console.log("Peeked card " + IDX + "for userId " + IDX);
            }
            else {
                console.log("CAN ONLY SELECT ONE OF YOUR CARDS TO PEEK")
            }
        }
        else if(peekAnyActive) {
            let ID = parseInt(raw[0], 10);
            let IDX = parseInt(raw[1], 10);
            sendAction(gameId, currentUser.userId, currentUser.username, "PEEK", {
                id: ID,
                idx: IDX
            })
            console.log("Peeked card " + IDX + "for userId " + IDX);
        }
        else if(peekPlusActive) {
            let ID = parseInt(raw[0], 10);
            let IDX = parseInt(raw[1], 10);
            sendAction(gameId, currentUser.userId, currentUser.username, "PEEK_PLUS", {
                id: ID,
                idx: IDX
            })
            console.log("Peeked card " + IDX + "for userId " + IDX);
        }

        swapState = {
            originIndex: null,
            originUserId: null,
            destinationIndex: null,
            destinationUserId: null
        };
        if(!peekPlusActive) {
            endTurn();
        }
        else {
            endTurn();
            swapModeActive = true;
        }
    }
});

