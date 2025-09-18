let stompClient = null;

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
            renderGameState(state);
        });

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
const gameId = 1; // your game id
const chatBox = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');

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
