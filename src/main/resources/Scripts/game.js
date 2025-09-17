// Assume stompClient is already connected
const gameId = 1; // your game id
const chatBox = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');

// Subscribe to chat topic
stompClient.subscribe(`/topic/game.${gameId}.chat`, msg => {
    const chatMsg = JSON.parse(msg.body);
    appendMessage(chatMsg);
});

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

    const message = {
        sender: "You",       // set this from your logged-in user
        content: content,
        timestamp: Date.now()
    };

    stompClient.send(`/app/game/${gameId}/chat`, {}, JSON.stringify(message));
    chatInput.value = '';
}