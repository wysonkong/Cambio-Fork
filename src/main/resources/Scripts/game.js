let stompClient = null;
const urlParams = new URLSearchParams(window.location.search);
const gameId = urlParams.get("gameId");
const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));


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
            renderHands(state)
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
    end : document.getElementById("end-turn-btn"),
    cambio : document.getElementById("cambio-btn"),
}

function setButtonsEnabled(isPlayerTurn) {
    Object.values(buttons).forEach(btn => {
        if(isPlayerTurn) {
            btn.disabled = false;
            btn.classList.remove("bg-gray-500", "text-gray-300", "opacity-50", "cursor-not-allowed");
            // Restore original color based on button type
            if (btn.id === "draw-btn") btn.classList.add("bg-green-600", "text-white", "hover:bg-green-700");
            if (btn.id === "play-btn") btn.classList.add("bg-blue-600", "text-white", "hover:bg-blue-700");
            if (btn.id === "end-turn-btn") btn.classList.add("bg-indigo-600", "text-white", "hover:bg-indigo-700");
            if (btn.id === "cambio-btn") btn.classList.add("bg-red-600", "text-white", "hover:bg-red-700");
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
    console.log("Button pressed");
    sendAction(gameId, currentUser.userId, currentUser.username,"CALL_CAMBIO", {});
})

let start = document.getElementById('start-btn');

start.addEventListener('click', () => {
    start.hidden = true;
    // const numPlayers = 2; // remove for it to be dynamic from backend
    // const hands = Array.from({ length: numPlayers }, () => Array(4).fill({}));
    sendAction(gameId, currentUser.userId, currentUser.username, "START", {});
})

function renderHands(state) {
    state.players.forEach((player, index)=> {
        const playerDiv = document.getElementById(`player${index + 1}cards`);
        playerDiv.innerHTML = "";

        if (!player.hand) {
            // Hand hasn't been dealt yet
            const placeholder = document.createElement("p");
            placeholder.textContent = "Waiting for game to start...";
            playerDiv.appendChild(placeholder);
            return;
        }

            player.hand.forEach(card => {
                if(!card) {
                    return;
                }
                const img = document.createElement("img");
                img.src = "../images/cards/" + card.rank + "-" + card.suit + ".png";
                img.alt = "card";
                img.classList.add("w-full", "h-auto", "m-1", "card");
                playerDiv.appendChild(img);
            })

    });
    // hands.forEach((hand, index) => {
    //
    //     hand.forEach((card, cardIndex) => {
    //
    //         // Add click listener to flip card
    //         // if(index === 0) {
    //         //     img.addEventListener("click", () => {
    //         //         if(cardIndex >= 2) { //player can only see the bottom 2 cards
    //         //             if (img.classList.contains("flipped")) {
    //         //                 // Flip back to back
    //         //                 img.src = "../images/cards/card-back.png";
    //         //                 img.classList.remove("flipped");
    //         //             } else {
    //         //                 // Show the actual card
    //         //                 img.src = "../img/playing-card.png"; // replace with actual card from backend
    //         //                 img.classList.add("flipped");
    //         //             }
    //         //         }
    //         //     })
    //         // }
    //
    //         playerDiv.appendChild(img);
    //     });
    // });

}


setButtonsEnabled(true);


