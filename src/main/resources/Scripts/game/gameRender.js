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
    const username = msg.userName || playersMap[msg.userId] || 'Unknown';
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

    if (myTurn == null) {
        state.players.forEach(player => {
            if (player.userId === currentUser.userId) {
                myTurn = player.index;
            }
        });
        players.push(state.players[myTurn]);
        players.push(...state.players.slice(myTurn + 1));
        players.push(...state.players.slice(0, myTurn));
    }

    console.log("Your turn is: " + myTurn);

    state.players.forEach((player) => {
        let index;
        players.forEach(p => {
            if (player.userId === p.userId) {
                index = players.indexOf(p);
            }
        });

        let playerName = document.getElementById(`player${index + 1}Username`);
        let playerDiv = document.getElementById(`player${index + 1}cards`);
        let playerPending = document.getElementById(`player${index + 1}draw`);
        index++;

        playerDiv.innerHTML = "";
        playerName.innerHTML = player.userName;
        playerPending.innerHTML = "";

        setButtonsEnabled(state);

        if (!player.hand) {
            const placeholder = document.createElement("p");
            placeholder.textContent = "Waiting for game to start...";
            playerDiv.appendChild(placeholder);
            return;
        }

        if (player.pending) {
            const img = document.createElement("img");
            img.src = "../images/cards/" + player.pending.rank + "-" + player.pending.suit + ".png";
            img.alt = "card";
            img.classList.add("w-28", "h-24", "object-contain", "m-1", "card",
                "transition-transform", "transition-shadow", "duration-300",
                "hover:-translate-y-2", "hover:[transform:rotateY(10deg)]", "hover:shadow-2xl");
            playerPending.appendChild(img);
        }

        let cardIndex = 0;
        player.hand.forEach(card => {
            if (!card) return;
            const img = document.createElement("img");
            if (card.visible) {
                img.src = "../images/cards/" + card.rank + "-" + card.suit + ".png";
                img.alt = "card";
                img.id = `${player.userId}-${cardIndex}`;
                img.classList.add("w-28", "h-24", "object-contain", "m-1", "card",
                    "transition-transform", "transition-shadow", "duration-300",
                    "hover:-translate-y-4", "hover:[transform:rotateY(10deg)]", "hover:shadow-2xl");
            } else {
                img.src = "../images/cards/card-back.png";
                img.id = `player${index + 1}card${cardIndex}`;
                img.classList.add("w-28", "h-28", "object-contain", "m-1", "card");
            }
            cardIndex++;
            playerDiv.appendChild(img);
        });

        const discardDiv = document.getElementById("card-discard");
        discardDiv.innerHTML = "";
        if (state.prevCard) {
            const img = document.createElement("img");
            img.src = "../images/cards/" + state.prevCard.rank + "-" + state.prevCard.suit + ".png";
            img.alt = "prevCard";
            img.classList.add("w-28", "h-24", "object-contain", "m-1", "card");
            discardDiv.appendChild(img);
        }
    });
}
