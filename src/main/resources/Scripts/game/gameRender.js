// This file handles everything required to render the game based on game state/actions

// ===== Subscriptions =====
function subscribeGameState(gameId) {
    stompClient.subscribe(`/topic/game.${gameId}.state`, msg => {
        const state = JSON.parse(msg.body);
        console.log(state);

        renderHands(state);
        displayTurn(state);
        setButtonsEnabled(state);

        players.forEach(p => {
            playersMap[p.userId] = p.userName;
        });
    });
}

function subscribeActions(gameId) {
    stompClient.subscribe(`/topic/game.${gameId}.action`, msg => {
        const action = JSON.parse(msg.body);
        console.log(action);
        appendAction(action);
    });
}

function subscribeChat(gameId) {
    stompClient.subscribe(`/topic/game.${gameId}.chat`, msg => {
        const chatMsg = JSON.parse(msg.body);
        appendMessage(chatMsg);
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
            } else {
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

    // Find your index
    if (myTurn == null) {
        myTurn = state.players.findIndex(p => p.userId === currentUser.userId);
    }

    // Split you vs. others
    const me = state.players[myTurn];
    const others = state.players.filter(p => p.userId !== currentUser.userId);

    // Order others around the board
    // top → left → right (expandable up to 5 others)
    const playerSlots = [
        "player-top",   // 1st opponent
        "player-left",  // 2nd
        "player-right", // 3rd
        "player-top-left",  // 4th (optional)
        "player-top-right"  // 5th (optional)
    ];

    // Render me (always bottom)
    renderPlayer(me, "player-bottom");

    // Render opponents
    others.forEach((player, index) => {
        if (playerSlots[index]) {
            renderPlayer(player, playerSlots[index]);
        }
    });

    // Update discard pile
    const discardDiv = document.getElementById("card-discard");
    discardDiv.innerHTML = "";
    if (state.prevCard) {
        const img = document.createElement("img");
        img.src = `../images/cards/${state.prevCard.rank}-${state.prevCard.suit}.png`;
        img.alt = "prevCard";
        img.classList.add("w-24", "h-30", "object-contain", "m-1", "card");
        discardDiv.appendChild(img);
    }
}

function renderPlayer(player, slotId) {
    const container = document.getElementById(slotId);
    container.classList.add("rounded-lg", "p-2", "bg-white", "border", "shadow", "flex", "flex-col", "items-center");
    if (!container) return;

    container.innerHTML = `
    <div id="${slotId}-username" class="text-center font-bold mb-2">${player.userName}</div>
    <div id="${slotId}-cards" class="flex justify-center flex-wrap"></div>
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
        img.classList.add("w-24", "h-30", "m-1", "card");
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
        img.classList.add("w-24", "h-30", "object-contain", "m-1", "card");
        cardContainer.appendChild(img);
    });
}



// function getPlayerSlots(count) {
//     switch (count) {
//         case 2:
//             return ["player-bottom", "player-top"];
//         case 3:
//             return ["player-bottom", "player-left", "player-right"];
//         case 4:
//             return ["player-bottom", "player-top", "player-left", "player-right"];
//         case 5:
//             return ["player-bottom", "player-top", "player-left", "player-right", "player-top-left"];
//         case 6:
//             return ["player-bottom", "player-top", "player-left", "player-right", "player-top-left", "player-top-right"];
//         default:
//             return ["player-bottom"]; // fallback
//     }
// }

// const playerGrid = document.getElementById("players");
//
// function renderPlayerGrid(playerCount) {
//     playerGrid.innerHTML = "";
//
//     // Grid: 2 cols top row (deck + discard), rest players
//     playerGrid.style.gridTemplateColumns = `repeat(4, 1fr)`;
//     playerGrid.style.gridTemplateRows = `auto auto`;
//
//     // Player slots
//     for (let i = 0; i < playerCount; i++) {
//         const playerZone = document.createElement("div");
//         playerZone.className = "rounded-lg p-2 bg-white border shadow flex flex-col items-center";
//
//         // Username
//         const username = document.createElement("div");
//         username.id = `player${i + 1}Username`;
//         username.className = "font-bold mb-1";
//         playerZone.appendChild(username);
//
//         // Hand cards
//         const cards = document.createElement("div");
//         cards.id = `player${i + 1}cards`;
//         cards.className = "flex flex-wrap justify-center";
//         playerZone.appendChild(cards);
//
//         // Pending card slot
//         const pending = document.createElement("div");
//         pending.id = `player${i + 1}draw`;
//         pending.className = "flex justify-center mt-1";
//         playerZone.appendChild(pending);
//
//         playerGrid.appendChild(playerZone);
//     }
// }

