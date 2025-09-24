let stompClient = null;
const urlParams = new URLSearchParams(window.location.search);
const gameId = urlParams.get("gameId");
const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
let myTurn = null;

const displayMyTurn = document.getElementById("display-turn");
let players = [];

//In prototyping, set all buttons enabled

function connectWebSocket(gameId) {
    // 1. Create SockJS connection to your Spring Boot endpoint
    const socket = new SockJS('http://localhost:8080/ws'); // '/ws' is your WebSocket endpoint in Spring Boot

    // 2. Create STOMP client over SockJS
    stompClient = Stomp.over(socket);

    // Optional: disable debug logs
    stompClient.debug = null;

    // 3. Connect with STOMP
    stompClient.connect({}, frame => {
        console.log('Connected: ' + frame);

        // Subscribe to game state updates
        stompClient.subscribe(`/topic/game.${gameId}.state`, msg => {
            const state = JSON.parse(msg.body);
            console.log(state);
            renderHands(state);
            displayTurn(state);
            setButtonsEnabled(state);
            // console.log(state);
            //renderGameState(state);
            // appendAction(state);
        });

        //subscribe to actions
        stompClient.subscribe(`/topic/game.${gameId}.action`, msg => {
            const action = JSON.parse(msg.body);
            console.log(action);
            appendAction(action);
        })

        // Subscribe to chat messages
        stompClient.subscribe(`/topic/game.${gameId}.chat`, msg => {
            const chatMsg = JSON.parse(msg.body);
            appendMessage(chatMsg);
        });
    }, error => {
        console.error('STOMP connection error: ', error);
    });
}


// Assume stompClient is already connected

const actionLog = document.getElementById("action-log");
const chatBox = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const joinCode = document.getElementById("join-code");
const stickBtn = document.getElementById("stick-btn");
const cambioBtn = document.getElementById("cambio-btn");
const drawBtn = document.getElementById("draw-btn");
const playBtn = document.getElementById("play-btn");
const discardBtn = document.getElementById("discard-btn");

joinCode.innerText = "Join Code: " + gameId;
connectWebSocket(gameId);
// Append a new message to the chat box
function appendMessage(msg) {
    const messageEl = document.createElement('div');
    messageEl.classList.add('message');
    const time = new Date(msg.timestamp).toLocaleTimeString();
    messageEl.innerText = `[${time}] ${msg.sender}: ${msg.content}`;
    chatBox.appendChild(messageEl);

    // Scroll to bottom
    chatBox.scrollTop = chatBox.scrollHeight;
}

function appendAction(msg) {
    const messageEl = document.createElement('div');
    messageEl.classList.add('message');
    messageEl.innerText = `${msg.username}: ${msg.type}: ${msg.payload}`;
    actionLog.appendChild(messageEl);

    actionLog.scrollTop = actionLog.scrollHeight;
}

// Send message when button clicked
sendBtn.addEventListener('click', () => {
    sendMessage();
});

// Send message on Enter key
chatInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
    const content = chatInput.value.trim();
    if (!content) return;
    const user = JSON.parse(sessionStorage.getItem("currentUser"));

    const message = {
        userId: user.userId,
        gameId: gameId,// set this from your logged-in user
        message: content,
        timestamp: Date.now()
    };

    console.log("sending message " + JSON.stringify(message));
    stompClient.send(`/app/game/${gameId}/chat`, {}, JSON.stringify(message));
    chatInput.value = '';
}

// Button functions

let buttons = {
    draw : document.getElementById("draw-btn"),
    play : document.getElementById("play-btn"),
    discard : document.getElementById("discard-btn"),
    cambio : document.getElementById("cambio-btn"),
}

function setButtonsEnabled(state) {
    Object.values(buttons).forEach(btn => {
        if(state.currentTurn === myTurn) {
            btn.disabled = false;
            btn.classList.remove("bg-gray-500", "text-gray-300", "opacity-50", "cursor-not-allowed");
            // Restore original color based on button type
            if (btn.id === "draw-btn") btn.classList.add("bg-green-600", "text-white", "hover:bg-green-700");
            if (btn.id === "play-btn") {btn.disabled = true; btn.classList.add("bg-gray-500", "text-gray-300", "opacity-50", "cursor-not-allowed");}
            if (btn.id === "discard-btn") {btn.disabled = true; btn.classList.add("bg-gray-500", "text-gray-300", "opacity-50", "cursor-not-allowed");}
            if (btn.id === "cambio-btn") {btn.disabled = true; btn.classList.add("bg-gray-500", "text-gray-300", "opacity-50", "cursor-not-allowed");}
        } else {
            btn.disabled = true;
            btn.classList.remove("bg-green-600", "bg-blue-600", "bg-indigo-600", "bg-red-600", "hover:bg-green-700", "hover:bg-blue-700", "hover:bg-indigo-700", "hover:bg-red-700", "text-white");
            btn.classList.add("bg-gray-500", "text-gray-300", "opacity-50", "cursor-not-allowed");
        }
    })
}

function sendAction(gameId,userId, username, actionType, payload) {
    const action = {
        userId : userId,
        username : username,
        type : actionType,
        payload : payload
    };
    console.log(action);
    stompClient.send(`/app/game/${gameId}/action`, {}, JSON.stringify(action));
}

cambioBtn.addEventListener("click", () => {
    console.log("Called Cambio!");
    sendAction(gameId, currentUser.userId, currentUser.username,"CALL_CAMBIO", {});
})

drawBtn.addEventListener("click", () => {
    console.log("Drew a card");
    sendAction(gameId, currentUser.userId, currentUser.username,"DRAW_DECK", {});
    if (buttons.id === "play-btn") {
        buttons.disabled = false;
        buttons.classList.remove("bg-gray-500", "text-gray-300", "opacity-50", "cursor-not-allowed");
        buttons.classList.add("bg-blue-600", "text-white", "hover:bg-blue-700");
    }
    if (buttons.id === "discard-btn") {
        buttons.disabled = false;
        buttons.classList.remove("bg-gray-500", "text-gray-300", "opacity-50", "cursor-not-allowed");
        buttons.classList.add("bg-indigo-600", "text-white", "hover:bg-indigo-700");
    }
    if (buttons.id === "cambio-btn") {
        buttons.disabled = false;
        buttons.classList.remove("bg-gray-500", "text-gray-300", "opacity-50", "cursor-not-allowed");
        buttons.classList.add("bg-red-600", "text-white", "hover:bg-red-700");
    }
})

playBtn.addEventListener("click", () => {
    console.log("Played a card");
    sendAction(gameId, currentUser.userId, currentUser.username,"SWAP", {});
})

// stickBtn.addEventListener("click", () => {
//     console.log("Stick");
//     sendAction(gameId, currentUser.userId, currentUser.username,"CALL_STICK", {});
// })

let start = document.getElementById('start-btn');

start.addEventListener('click', () => {
    start.hidden = true;
    // const numPlayers = 2; // remove for it to be dynamic from backend
    // const hands = Array.from({ length: numPlayers }, () => Array(4).fill({}));
    sendAction(gameId, currentUser.userId, currentUser.username, "START", {});
})


function displayTurn(state) {
    if(state.currentTurn === myTurn) {
        displayMyTurn.innerText = "Your Turn!";
    }
    else {
        displayMyTurn.innerText = "";
    }
}

function renderHands(state) {
    start.hidden = true;
    //get user's turn index from the backend and save it locally
    if(myTurn == null) {
        state.players.forEach(player => {
            if(player.userId === currentUser.userId) {
                myTurn = player.index;
            }
        })
        players.push(state.players[myTurn])
        players.push(...state.players.slice(myTurn + 1));
        players.push(...state.players.slice(0, myTurn));
    }
    console.log("Your turn is: " + myTurn);
    let index = 0;
    players.forEach((player)=> {
        let playerName = document.getElementById(`player${index + 1}Username`);
        let playerDiv = document.getElementById(`player${index + 1}cards`);
        index++;
        playerDiv.innerHTML = "";
        playerName.innerHTML ="";
        playerName.innerHTML = player.userName;

        setButtonsEnabled(state);

        if (!player.hand) {
            // Hand hasn't been dealt yet
            const placeholder = document.createElement("p");
            placeholder.textContent = "Waiting for game to start...";
            playerDiv.appendChild(placeholder);
            return;
        }

            player.hand.forEach(card => {
                if (!card) {
                    return;
                }
                if (card.visible) {
                    const img = document.createElement("img");
                    img.src = "../images/cards/" + card.rank + "-" + card.suit + ".png";
                    img.alt = "card";
                    img.classList.add("w-28",
                        "h-24",// or w-24, w-28 for size control
                        "object-contain",
                        "hover:bg-blue-700",// scale without stretching
                        "m-1",
                        "card");
                    playerDiv.appendChild(img);
                } else {
                    const img = document.createElement("img")
                    img.src = "../images/cards/card-back.png";
                    img.classList.add("w-28",
                        "h-28", // size control
                        "object-contain",      // scale without stretching
                        "m-1",
                        "card");
                    playerDiv.appendChild(img);
                }
            })

        const discardDiv = document.getElementById("card-discard");
        discardDiv.innerHTML = "";
        if (state.prevCard) {
            const img = document.createElement("img");
            img.src = "../images/cards/" + state.prevCard.rank + "-" + state.prevCard.suit + ".png";
            img.alt = "prevCard";
            img.classList.add("w-28",
                "h-24", // size control
                "object-contain",
                "m-1",
                "card");
            discardDiv.appendChild(img);
        }

    });
}





