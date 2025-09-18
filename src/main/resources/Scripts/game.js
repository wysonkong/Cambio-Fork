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