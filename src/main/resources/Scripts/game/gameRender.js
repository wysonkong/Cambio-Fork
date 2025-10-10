// This file handles everything required to render the game based on game state/actions
//gamestate / action websocket flow varaibles
let pendingState = null;
let animationInProgress = false;


// ===== Subscriptions =====
function subscribeGameState(gameId) {
    stompClient.subscribe(`/topic/game.${gameId}.state`, msg => {
        const state = JSON.parse(msg.body);
        console.log(state);
        if(animationInProgress) {
            pendingState = state;
        } else {
            renderHands(state);
            displayTurn(state);
            setButtonsEnabled(state);
            winner(state);
        }
        players.forEach(p => {
            playersMap[p.userId] = p.userName;
        });
    });
}

async function subscribeActions(gameId) {
    stompClient.subscribe(`/topic/game.${gameId}.action`, async msg => {
        const action = JSON.parse(msg.body);
        console.log(action);
        appendAction(action);
        animationInProgress = true;
        await animationHandler(action);
        animationInProgress = false;
        if (pendingState) {
            renderHands(pendingState);
            displayTurn(pendingState);
            setButtonsEnabled(pendingState);
            winner(pendingState);
            pendingState = null;
        }
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

    switch (msg.type) {
        case "START":
            bgMusic.play().catch();
            break;
        case "CALL_CAMBIO" :
            bgMusic.pause();
            playSound("cambio");
            cambioMusic.play().catch();
            break;
        case "DRAW_DECK":
            messageEl.innerText = `${username}: ${msg.type}: ${username} drew from the deck`;
            break;

        case "SWAP":
            messageEl.innerText = `${username}: ${msg.type}: ${username} swapped cards with ${msg.payload.destinationUserId.username}`;
            break;

        case "SWAP_PENDING":
            messageEl.innerText = `${username}: ${msg.type}: ${username} swapped his card to his hand`;
            break;

        case "DISCARD_PENDING":
            messageEl.innerText = `${username}: ${msg.type}: ${username} discarded their card`;
            break;

        case "STICK":
            if(msg.payload?.didStickWork === true) {
                messageEl.innerText = `${username}: ${msg.type}: ${username} matched a card from the discard`;
            } else {
                messageEl.innerText = `${username}: ${msg.type}: ${username} did not match a card, they received a penalty!`;
            }// needs a condition for a match or a penalty
            break;


        default:
            break;
    }
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
                }
                else if (btn.id === "stick-btn") {
                    btn.disabled = false;
                    btn.classList.remove("bg-gray-500", "text-gray-300", "opacity-50", "cursor-not-allowed");
                    btn.classList.add("bg-red-600", "text-white", "hover:bg-red-700");
                }
                else if (btn.id === "cambio-btn" && !state.cambioCalled) {
                    btn.disabled = false;
                    btn.classList.remove("bg-gray-500", "text-gray-300", "opacity-50", "cursor-not-allowed");
                    btn.classList.add("bg-green-600", "text-white", "hover:bg-green-700");
                }
                else {
                    btn.disabled = true;
                    btn.classList.remove("bg-blue-600", "bg-indigo-600", "bg-red-600", "hover:bg-blue-700", "hover:bg-indigo-700", "hover:bg-red-700", "text-white");
                    btn.classList.add("bg-gray-500", "text-gray-300", "opacity-50", "cursor-not-allowed");
                }
            }
            else if (cardPending) {
                if ((btn.id === "draw-btn") || (btn.id === "cambio-btn") || (btn.id === "stick-btn")) {
                    btn.disabled = true;
                    btn.classList.remove("bg-green-600", "text-white", "hover:bg-green-700");
                    btn.classList.add("bg-gray-500", "text-gray-300", "opacity-50", "cursor-not-allowed");
                }
                if(btn.id === "swap-pending-btn") {
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
            if(btn.id === "stick-btn") {
                btn.disabled = false;
                btn.classList.remove("bg-gray-500", "text-gray-300", "opacity-50", "cursor-not-allowed");
                btn.classList.add("bg-red-600", "text-white", "hover:bg-red-700");
        }
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
    renderPlayer(me, "player-bottom", me.visibleToMe);

    // Render opponents
    others.forEach((player, index) => {
        if (playerSlots[index]) {
            renderPlayer(player, playerSlots[index], me.visibleToMe);
        }
    });

    // Update discard pile
    const discardDiv = document.getElementById("card-discard");
    discardDiv.innerHTML = "";
    if (state.prevCard) {
        const img = document.createElement("img");
        img.src = `../images/cards/${state.prevCard.rank}-${state.prevCard.suit}.png`;
        img.id = "card-discard-img"
        img.alt = "prevCard";
        img.classList.add("w-24", "h-24", "object-contain", "m-1", "card");
        discardDiv.appendChild(img);
    }

    switch (state.specialMove) {
        case 0 :
            instructions.innerText = "";
            break;
        case 1 :
            instructions.innerText = "Played a 7 or 8, choose one of your cards to peek"
            peekMeActive = true;
            break;
        case 2:
            instructions.innerText = "Played a 9 or 10, choose someone else's card to peek"
            peekAnyActive = true;
            break;
        case 3:
            instructions.innerText = "Played a Jack or Queen, choose any two cards to swap"
            swapModeActive = true;
            break;
        case 4:
            instructions.innerText = "Played a Black King, take a peek at any card and make a swap"
            peekPlusActive = true;
            break;
    }
}

function renderPlayer(player, slotId, visibleToMe) {
    const container = document.getElementById(slotId);
    container.classList.add("rounded-lg", "p-2", "bg-white", "border", "shadow", "flex", "flex-col", "items-center");
    if (!container) return;
    const user = usersMap.get(player.userId);

    const avatarFile = user?.avatar || "dog";

    container.innerHTML = `
    <img src="../images/avatars/${avatarFile}.png" alt="${player.userName}'s avatar" class="w-16 h-16 rounded-full mb-2" />
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


    const img = document.createElement("img");
    if (player.pending) {
        img.src = `../images/cards/${player.pending.rank}-${player.pending.suit}.png`;
        img.style.visibility= 'visible';
        // img.style.visibility = 'hidden';
        // setTimeout(() => {
        //     img.style.visibility = 'visible';
        // }, 600);
    } else {
        img.src = "../images/cards/5-Spade.png";
        img.style.visibility= 'hidden';
    }
        img.alt = "card";
        img.classList.add("w-20", "h-20", "m-1", "object-contain", "card");
        img.id=`${player.userId}-pending`;
        pendingContainer.appendChild(img);

    player.hand.forEach((card, i) => {
        if (!card) return;
        const img = document.createElement("img");
        if(Object.hasOwn(visibleToMe, player.userId)) {
            if(visibleToMe[player.userId].includes(i)) {
                img.src = `../images/cards/${card.rank}-${card.suit}.png`
            }
            else {
                img.src = "../images/cards/card-back.png";
            }
        }
        else {
            img.src = "../images/cards/card-back.png";
        }
        img.alt = "card";
        img.id = `${player.userId}-${i}`;
        img.classList.add("w-20", "h-20", "object-contain", "m-1", "card");
        cardContainer.appendChild(img);
    });
}



async function animationHandler(action) {
    switch (action.type) {
        case "DRAW_DECK":
            playSound("flip");
            await animation(false, "card-deck-img", `${action.userId}-pending`);
            break;

        case "SWAP":
            playSound("slide");
            await animation(true, `${action.payload.originUserId}-${action.payload.origin}`, `${action.payload.destinationUserId}-${action.payload.destination}`);
            break;

        case "SWAP_PENDING":
            // run in sequence
            playSound("slide");
            await animation(true, `${action.payload.destinationUserId}-${action.payload.destination}`, `${action.userId}-pending`);
            playSound("flip");
            await animation(false, `${action.userId}-pending`, "card-discard-img");
            break;

        case "DISCARD_PENDING":
            playSound("flip");
            await animation(false, `${action.userId}-pending`, "card-discard-img");
            break;

        case "STICK":
            if(action.payload.didStickWork) {
                playSound("slide");
                await animation(false, `${action.payload.originUserId}-${action.payload.origin}`, "card-discard-img");
            }
            else {
                playSound("slide");
                await animation(false, "card-deck-img", `${action.userId}-pending`);
            }
            break;

        default:
            // no animation to run
            break;
    }
}

function playSound(name) {
    const sound = sounds[name];
    if (!sound) return;
    sound.pause();
    sound.currentTime = 0;
    sound.play();
}

function animation(twoWay, o, d) {
    return new Promise(resolve => {
        const origin = document.getElementById(o);
        const destination = document.getElementById(d);
        if (!origin || !destination) {
            console.warn("Animation failed, missing element:", o, d);
            return resolve();
        }

        const originRect = origin.getBoundingClientRect();
        const destRect = destination.getBoundingClientRect();

        const xDiff = destRect.left - originRect.left;
        const yDiff = destRect.top - originRect.top;

        origin.classList.add("swap");
        origin.style.transform = `translate(${xDiff}px, ${yDiff}px)`;

        if (twoWay) {
            destination.classList.add("swap");
            destination.style.transform = `translate(${-xDiff}px, ${-yDiff}px)`;
        }

        // When the transition ends, clean up and resolve
        origin.addEventListener(
            "transitionend",
            () => {
                origin.classList.remove("swap");
                origin.style.transform = "";

                if (twoWay) {
                    destination.classList.remove("swap");
                    destination.style.transform = "";
                }

                resolve();
            },
            { once: true }
        );
    });
}

function winner(state) {
    let result = document.getElementById("gameOverTitle");
    let points = document.getElementById("gamePoints");
    let modal = document.getElementById("gameOver");

    const me = state.players.find(p => p.userId === currentUser.userId);

    if(state.winner && state.winner.id != null) {
        modal.showModal();

        if (me.userId === state.winner.id) {
            result.textContent = "You Win!";
            points.textContent = `Final Score: ${me.score}`;
        } else {
            const winningPlayer = state.players.find(p => p.userId === state.winner.id);
            result.textContent = `${winningPlayer.userName} Wins!`;
            points.textContent = `Winning Score: ${winningPlayer.score} Your Score: ${me.score}`;
        }

        if (me.userId === state.winner.id) {
            launchConfetti();
        }
    }
}

function launchConfetti() {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ["#fbbf24", "#f87171", "#34d399", "#60a5fa"]
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ["#fbbf24", "#f87171", "#34d399", "#60a5fa"]
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
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

