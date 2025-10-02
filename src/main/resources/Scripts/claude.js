// ============================================
// gameMain.js - MULTIPLAYER ANIMATIONS
// ============================================

// ===== Global State =====
let stompClient = null;
const urlParams = new URLSearchParams(window.location.search);
const gameId = urlParams.get("gameId");
const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
let myTurn = null;
let hasDrawn = false;
let cardPending = false;
let swapModeActive = false;
let swapPendingModeActive = false;

// Track if we're waiting for server response
let awaitingServerResponse = false;
let pendingStateUpdate = null;

const displayMyTurn = document.getElementById("display-turn");
const actionLog = document.getElementById("action-log");
const chatBox = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const joinCode = document.getElementById("join-code");
const cambioBtn = document.getElementById("cambio-btn");
const drawBtn = document.getElementById("draw-btn");
const playBtn = document.getElementById("play-btn");
const discardBtn = document.getElementById("discard-btn");
const start = document.getElementById('start-btn');
const swapPendingBtn = document.getElementById("swap-pending-btn");
swapPendingBtn.hidden = true;

joinCode.innerText = "Join Code: " + gameId;

// ===== Player State =====
let players = [];
const playersMap = {};

let swapState = {
    originIndex: null,
    originUserId: null,
    destinationIndex: null,
    destinationUserId: null
};

// ===== Buttons Registry =====
let buttons = {
    draw: drawBtn,
    play: playBtn,
    discard: discardBtn,
    cambio: cambioBtn,
    swapPending: swapPendingBtn
};

// ===== Send Action (Simple) =====
function sendAction(gameId, userId, username, actionType, payload) {
    const action = {
        userId: userId,
        username: username,
        type: actionType,
        payload: payload
    };

    console.log("Sending action:", action);
    stompClient.send(`/app/game/${gameId}/action`, {}, JSON.stringify(action));
}

function endTurn() {
    hasDrawn = false;
    cardPending = false;
}

function disableAllButtons() {
    Object.values(buttons).forEach(btn => {
        btn.disabled = true;
        btn.classList.add("opacity-50", "cursor-not-allowed");
    });
}

function connectWebSocket(gameId) {
    const socket = new SockJS('http://localhost:8080/ws');
    stompClient = Stomp.over(socket);
    stompClient.debug = null;

    stompClient.connect({}, frame => {
        console.log('Connected: ' + frame);
        subscribeGameState(gameId);
        subscribeActions(gameId);
        subscribeChat(gameId);
    }, error => {
        console.error('STOMP connection error: ', error);
    });
}

connectWebSocket(gameId);

// ============================================
// gameListeners.js - SIMPLE ACTIONS
// ============================================

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

    stompClient.send(`/app/game/${gameId}/chat`, {}, JSON.stringify(message));
    chatInput.value = '';
}

// ===== Buttons - Just send actions, animations handled by subscribeActions =====
buttons.discard.addEventListener("click", () => {
    console.log("Discarding pending card");
    sendAction(gameId, currentUser.userId, currentUser.username, "DISCARD_PENDING", {});
    endTurn();
});

drawBtn.addEventListener("click", () => {
    console.log("Drawing a card");
    sendAction(gameId, currentUser.userId, currentUser.username, "DRAW_DECK", {});
    cardPending = true;
    hasDrawn = true;
    disableAllButtons(); // Disable until animation completes
});

playBtn.addEventListener("click", () => {
    swapModeActive = true;
    console.log("Swapping mode activated, select origin and destination cards");
});

cambioBtn.addEventListener("click", () => {
    console.log("Called Cambio!");
    sendAction(gameId, currentUser.userId, currentUser.username, "CALL_CAMBIO", {});
});

swapPendingBtn.addEventListener("click", () => {
    console.log("Select one of your cards to swap with the drawn card");
    swapPendingModeActive = true;
    swapModeActive = true;
});

start.addEventListener('click', () => {
    start.hidden = true;
    sendAction(gameId, currentUser.userId, currentUser.username, "START", {});
});

// ===== Swap Mode (Card Clicks) =====
document.body.addEventListener("click", (card) => {
    if (card.target.matches("img.card")) {
        let raw = card.target.id.split("-");

        if (!swapPendingModeActive) {
            // Regular swap between two cards
            if (swapState.originIndex === null) {
                swapState.originUserId = parseInt(raw[0], 10);
                swapState.originIndex = parseInt(raw[1], 10);
                console.log(`Origin: user ${swapState.originUserId}, card ${swapState.originIndex}`);

                // Visual feedback
                card.target.classList.add('ring-4', 'ring-yellow-400');

            } else if (swapState.destinationIndex === null) {
                swapState.destinationIndex = parseInt(raw[1], 10);
                swapState.destinationUserId = parseInt(raw[0], 10);
                console.log(`Destination: user ${swapState.destinationUserId}, card ${swapState.destinationIndex}`);

                sendAction(gameId, currentUser.userId, currentUser.username, "SWAP", {
                    origin: swapState.originIndex,
                    originUserId: swapState.originUserId,
                    destination: swapState.destinationIndex,
                    destinationUserId: swapState.destinationUserId
                });

                disableAllButtons();

                // Reset state
                swapState = {
                    originIndex: null,
                    originUserId: null,
                    destinationIndex: null,
                    destinationUserId: null
                };
                swapModeActive = false;
            }
        } else {
            // Swap pending card with hand card
            if (swapState.destinationIndex === null) {
                swapState.destinationIndex = parseInt(raw[1], 10);
                swapState.destinationUserId = parseInt(raw[0], 10);

                sendAction(gameId, currentUser.userId, currentUser.username, "SWAP_PENDING", {
                    destination: swapState.destinationIndex,
                    destinationUserId: swapState.destinationUserId
                });

                disableAllButtons();

                // Reset state
                swapState = {
                    originIndex: null,
                    originUserId: null,
                    destinationIndex: null,
                    destinationUserId: null
                };
                swapPendingModeActive = false;
                swapModeActive = false;
            }
        }

        endTurn();
    }
});

// ============================================
// gameRender.js - ANIMATIONS ON ACTION BROADCAST
// ============================================

// ===== Subscriptions =====
function subscribeGameState(gameId) {
    stompClient.subscribe(`/topic/game.${gameId}.state`, msg => {
        const state = JSON.parse(msg.body);
        console.log("Received game state:", state);

        // If we're animating, store state and render after animation
        if (awaitingServerResponse) {
            pendingStateUpdate = state;
        } else {
            renderGameState(state);
        }
    });
}

function subscribeActions(gameId) {
    stompClient.subscribe(`/topic/game.${gameId}.action`, msg => {
        const action = JSON.parse(msg.body);
        console.log("Received action:", action);
        appendAction(action);

        // ANIMATE BASED ON ACTION - EVERYONE SEES THIS
        handleActionAnimation(action);
    });
}

function subscribeChat(gameId) {
    stompClient.subscribe(`/topic/game.${gameId}.chat`, msg => {
        const chatMsg = JSON.parse(msg.body);
        appendMessage(chatMsg);
    });
}

// ===== Action Animation Handler =====
function handleActionAnimation(action) {
    awaitingServerResponse = true;

    switch(action.type) {
        case "DRAW_DECK":
            animateDraw(action, () => {
                awaitingServerResponse = false;
                if (pendingStateUpdate) {
                    renderGameState(pendingStateUpdate);
                    pendingStateUpdate = null;
                }
            });
            break;

        case "SWAP":
            animateSwap(action, () => {
                awaitingServerResponse = false;
                if (pendingStateUpdate) {
                    renderGameState(pendingStateUpdate);
                    pendingStateUpdate = null;
                }
            });
            break;

        case "SWAP_PENDING":
            animateSwapPending(action, () => {
                awaitingServerResponse = false;
                if (pendingStateUpdate) {
                    renderGameState(pendingStateUpdate);
                    pendingStateUpdate = null;
                }
            });
            break;

        case "DISCARD_PENDING":
            animateDiscard(action, () => {
                awaitingServerResponse = false;
                if (pendingStateUpdate) {
                    renderGameState(pendingStateUpdate);
                    pendingStateUpdate = null;
                }
            });
            break;

        default:
            // No animation for this action
            awaitingServerResponse = false;
            if (pendingStateUpdate) {
                renderGameState(pendingStateUpdate);
                pendingStateUpdate = null;
            }
            break;
    }
}

// ===== Animation Functions =====
function animateDraw(action, callback) {
    const deck = document.getElementById("card-deck-img");
    const destination = document.getElementById(`${action.userId}-pending`);

    if (!deck) {
        console.warn("Deck element not found");
        callback();
        return;
    }

    // Create temporary card for animation
    const tempCard = deck.cloneNode(true);
    tempCard.id = 'temp-draw-card';
    tempCard.style.position = 'fixed';
    tempCard.style.zIndex = '9999';
    tempCard.style.pointerEvents = 'none';
    document.body.appendChild(tempCard);

    const deckRect = deck.getBoundingClientRect();
    tempCard.style.left = deckRect.left + 'px';
    tempCard.style.top = deckRect.top + 'px';
    tempCard.style.width = deckRect.width + 'px';
    tempCard.style.height = deckRect.height + 'px';

    // Wait a frame for layout
    requestAnimationFrame(() => {
        if (destination) {
            const destRect = destination.getBoundingClientRect();
            tempCard.style.transition = 'all 0.6s ease-in-out';
            tempCard.style.left = destRect.left + 'px';
            tempCard.style.top = destRect.top + 'px';
        }

        setTimeout(() => {
            document.body.removeChild(tempCard);
            callback();
        }, 600);
    });
}

function animateSwap(action, callback) {
    const originCard = document.getElementById(`${action.payload.originUserId}-${action.payload.origin}`);
    const destCard = document.getElementById(`${action.payload.destinationUserId}-${action.payload.destination}`);

    if (!originCard || !destCard) {
        console.warn("Cards not found for swap animation");
        callback();
        return;
    }

    // Remove any selection highlights
    originCard.classList.remove('ring-4', 'ring-yellow-400');

    const rect1 = originCard.getBoundingClientRect();
    const rect2 = destCard.getBoundingClientRect();

    const xDiff1 = rect2.left - rect1.left;
    const yDiff1 = rect2.top - rect1.top;
    const xDiff2 = rect1.left - rect2.left;
    const yDiff2 = rect1.top - rect2.top;

    originCard.style.transition = 'transform 0.6s ease-in-out';
    destCard.style.transition = 'transform 0.6s ease-in-out';
    originCard.style.zIndex = '100';
    destCard.style.zIndex = '99';

    requestAnimationFrame(() => {
        originCard.style.transform = `translate(${xDiff1}px, ${yDiff1}px)`;
        destCard.style.transform = `translate(${xDiff2}px, ${yDiff2}px)`;
    });

    setTimeout(() => {
        originCard.style.transition = '';
        destCard.style.transition = '';
        originCard.style.transform = '';
        destCard.style.transform = '';
        originCard.style.zIndex = '';
        destCard.style.zIndex = '';
        callback();
    }, 600);
}

function animateSwapPending(action, callback) {
    const pendingCard = document.getElementById(`${action.userId}-pending`);
    const handCard = document.getElementById(`${action.payload.destinationUserId}-${action.payload.destination}`);

    if (!pendingCard || !handCard) {
        console.warn("Cards not found for swap pending animation");
        callback();
        return;
    }

    const rect1 = pendingCard.getBoundingClientRect();
    const rect2 = handCard.getBoundingClientRect();

    const xDiff1 = rect2.left - rect1.left;
    const yDiff1 = rect2.top - rect1.top;
    const xDiff2 = rect1.left - rect2.left;
    const yDiff2 = rect1.top - rect2.top;

    pendingCard.style.transition = 'transform 0.6s ease-in-out';
    handCard.style.transition = 'transform 0.6s ease-in-out';
    pendingCard.style.zIndex = '100';
    handCard.style.zIndex = '99';

    requestAnimationFrame(() => {
        pendingCard.style.transform = `translate(${xDiff1}px, ${yDiff1}px)`;
        handCard.style.transform = `translate(${xDiff2}px, ${yDiff2}px)`;
    });

    setTimeout(() => {
        pendingCard.style.transition = '';
        handCard.style.transition = '';
        pendingCard.style.transform = '';
        handCard.style.transform = '';
        pendingCard.style.zIndex = '';
        handCard.style.zIndex = '';
        callback();
    }, 600);
}

function animateDiscard(action, callback) {
    const pendingCard = document.getElementById(`${action.userId}-pending`);
    const discardPile = document.getElementById("card-discard");

    if (!pendingCard || !discardPile) {
        console.warn("Elements not found for discard animation");
        callback();
        return;
    }

    const pendingRect = pendingCard.getBoundingClientRect();
    const discardRect = discardPile.getBoundingClientRect();

    const xDiff = discardRect.left - pendingRect.left;
    const yDiff = discardRect.top - pendingRect.top;

    pendingCard.style.transition = 'transform 0.6s ease-in-out';
    pendingCard.style.zIndex = '100';

    requestAnimationFrame(() => {
        pendingCard.style.transform = `translate(${xDiff}px, ${yDiff}px)`;
    });

    setTimeout(() => {
        pendingCard.style.transition = '';
        pendingCard.style.transform = '';
        pendingCard.style.zIndex = '';
        callback();
    }, 600);
}

// ===== Render Game State =====
function renderGameState(state) {
    renderHands(state);
    displayTurn(state);
    setButtonsEnabled(state);

    players.forEach(p => {
        playersMap[p.userId] = p.userName;
    });
}

// ===== Render Helpers =====
function appendMessage(msg) {
    const messageEl = document.createElement('div');
    messageEl.classList.add('message');
    const time = new Date(msg.timestamp).toLocaleTimeString();
    messageEl.innerText = `[${time}] ${msg.sender}: ${msg.content}`;
    chatBox.appendChild(messageEl);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function appendAction(msg) {
    const messageEl = document.createElement('div');
    const cardText = msg.card ? `${msg.card.rank} of ${msg.card.suit}` : '';
    const username = msg.username || playersMap[msg.userId] || 'Unknown';
    messageEl.classList.add('message');
    messageEl.innerText = `${username}: ${msg.type}: ${cardText}`;
    actionLog.appendChild(messageEl);
    actionLog.scrollTop = actionLog.scrollHeight;
}

function setButtonsEnabled(state) {
    const isMyTurn = state.currentTurn === myTurn;
    Object.values(buttons).forEach(btn => {
        if (isMyTurn) {
            if (!hasDrawn) {
                if (btn.id === "draw-btn") {
                    btn.disabled = false;
                    btn.classList.remove("bg-gray-500", "text-gray-300", "opacity-50", "cursor-not-allowed");
                    btn.classList.add("bg-green-600", "text-white", "hover:bg-green-700");
                } else {
                    btn.disabled = true;
                    btn.classList.remove("bg-blue-600", "bg-indigo-600", "bg-red-600", "hover:bg-blue-700", "hover:bg-indigo-700", "hover:bg-red-700", "text-white");
                    btn.classList.add("bg-gray-500", "text-gray-300", "opacity-50", "cursor-not-allowed");
                }
            }
            else if (cardPending) {
                if (btn.id === "draw-btn") {
                    btn.disabled = true;
                    btn.classList.remove("bg-green-600", "text-white", "hover:bg-green-700");
                    btn.classList.add("bg-gray-500", "text-gray-300", "opacity-50", "cursor-not-allowed");
                }
                if(btn.id === "swap-pending-btn")    {
                    btn.hidden = false;
                    btn.disabled = false;
                    btn.classList.remove("bg-gray-500", "text-gray-300", "opacity-50", "cursor-not-allowed");
                    btn.classList.add("bg-green-600", "text-white", "hover:bg-green-700");
                }
                if(btn.id === "discard-btn") {
                    btn.disabled = false;
                    btn.classList.remove("bg-gray-500", "text-gray-300", "opacity-50", "cursor-not-allowed");
                    btn.classList.add("bg-green-600", "text-white", "hover:bg-green-700");
                }
            }
            else {
                if(btn.id === "swap-pending-btn") {
                    btn.hidden = true;
                    btn.disabled = true;
                }
                btn.disabled = false;
                btn.classList.remove("bg-gray-500", "text-gray-300", "opacity-50", "cursor-not-allowed");
                if (btn.id === "play-btn") btn.classList.add("bg-blue-600", "text-white", "hover:bg-blue-700");
                if (btn.id === "discard-btn") btn.classList.add("bg-indigo-600", "text-white", "hover:bg-indigo-700");
                if (btn.id === "cambio-btn") btn.classList.add("bg-red-600", "text-white", "hover:bg-red-700");
                if (btn.id === "draw-btn") {
                    btn.disabled = true;
                    btn.classList.remove("bg-green-600", "text-white", "hover:bg-green-700");
                    btn.classList.add("bg-gray-500", "text-gray-300", "opacity-50", "cursor-not-allowed");
                }
            }
        } else {
            btn.disabled = true;
            btn.classList.remove("bg-green-600", "bg-blue-600", "bg-indigo-600", "bg-red-600", "hover:bg-green-700", "hover:bg-blue-700", "hover:bg-indigo-700", "hover:bg-red-700", "text-white");
            btn.classList.add("bg-gray-500", "text-gray-300", "opacity-50", "cursor-not-allowed");
        }
    });
}

function displayTurn(state) {
    displayMyTurn.innerText = state.currentTurn === myTurn ? "Your Turn!" : "";
}

function renderHands(state) {
    start.hidden = true;

    if (myTurn == null) {
        myTurn = state.players.findIndex(p => p.userId === currentUser.userId);
    }

    const me = state.players[myTurn];
    const others = state.players.filter(p => p.userId !== currentUser.userId);

    const playerSlots = [
        "player-top",
        "player-left",
        "player-right",
        "player-top-left",
        "player-top-right"
    ];

    renderPlayer(me, "player-bottom");

    others.forEach((player, index) => {
        if (playerSlots[index]) {
            renderPlayer(player, playerSlots[index]);
        }
    });

    const discardDiv = document.getElementById("card-discard");
    discardDiv.innerHTML = "";
    if (state.prevCard) {
        const img = document.createElement("img");
        img.src = `../images/cards/${state.prevCard.rank}-${state.prevCard.suit}.png`;
        img.alt = "prevCard";
        img.classList.add("w-24", "h-24", "object-contain", "m-1", "card");
        discardDiv.appendChild(img);
    }
}

function renderPlayer(player, slotId) {
    const container = document.getElementById(slotId);
    container.classList.add("rounded-lg", "p-2", "bg-white", "border", "shadow", "flex", "flex-col", "items-center");
    if (!container) return;

    container.innerHTML = `
    <div id="${slotId}-username" class="text-center font-bold mb-2">${player.userName}</div>
    <div id="${slotId}-cards" class="flex justify-center grid grid-flow-col grid-rows-2"></div>
    <div id="${slotId}-draw" class="flex justify-center"></div>
  `;

    const cardContainer = document.getElementById(`${slotId}-cards`);
    const pendingContainer = document.getElementById(`${slotId}-draw`);

    if (!player.hand) {
        cardContainer.textContent = "Waiting for game to start...";
        return;
    }

    if (player.pending) {
        const img = document.createElement("img");
        img.src = `../images/cards/${player.pending.rank}-${player.pending.suit}.png`;
        img.alt = "card";
        img.classList.add("w-20", "h-20", "m-1", "object-contain", "card");
        img.id = `${player.userId}-pending`;
        pendingContainer.appendChild(img);
    }

    player.hand.forEach((card, i) => {
        if (!card) return;
        const img = document.createElement("img");
        img.src = card.visible
            ? `../images/cards/${card.rank}-${card.suit}.png`
            : "../images/cards/card-back.png";
        img.alt = "card";
        img.id = `${player.userId}-${i}`;
        img.classList.add("w-20", "h-20", "object-contain", "m-1", "card");
        cardContainer.appendChild(img);
    });
}