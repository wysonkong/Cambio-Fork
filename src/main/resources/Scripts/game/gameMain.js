//NOTE: This file contains all global variables and functions necessary to operate all game front end logic.


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

const displayMyTurn = document.getElementById("display-turn");
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

// ===== Utility Functions =====
function sendAction(gameId, userId, username, actionType, payload) {
    const action = {
        userId: userId,
        username: username,
        type: actionType,
        payload: payload
    };
    console.log(action);
    stompClient.send(`/app/game/${gameId}/action`, {}, JSON.stringify(action));
}

function endTurn() {
    hasDrawn = false;
}

function connectWebSocket(gameId) {
    const socket = new SockJS('http://localhost:8080/ws');
    stompClient = Stomp.over(socket);
    stompClient.debug = null;

    stompClient.connect({}, frame => {
        console.log('Connected: ' + frame);

        // Hook subscriptions from gameRender.js
        subscribeGameState(gameId);
        subscribeActions(gameId);
        subscribeChat(gameId);
    }, error => {
        console.error('STOMP connection error: ', error);
    });
}

connectWebSocket(gameId);
