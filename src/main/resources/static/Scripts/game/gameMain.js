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
let stickModeActive = false;
let peekMeActive = false;
let peekAnyActive = false;
let peekPlusActive = false;
let giveModeActive = false;
let lastStickPlayer = null;
let unseenCount = 0;
let cambioPlayerId = null;
let firstDraw = false;


const displayMyTurn = document.getElementById("display-turn");
const actionLog = document.getElementById("action-log");
const action = document.getElementById("actionDrawer");
const rule = document.getElementById("ruleDrawer");
const chatBtn = document.getElementById("chat-btn");
const chatBadge = document.getElementById("chat-badge");
const chatBox = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const chat = document.getElementById('drawer');
const sendBtn = document.getElementById('send-btn');
const joinCode = document.getElementById("join-code");
const playersIn = document.getElementById('players-in');
const stickBtn = document.getElementById("stick-btn");
const cambioBtn = document.getElementById("cambio-btn");
const drawBtn = document.getElementById("draw-btn");
const playBtn = document.getElementById("play-btn");
const discardBtn = document.getElementById("discard-btn");
const start = document.getElementById('start-btn');
start.classList.remove("bg-green-600", "text-white", "hover:bg-green-700");
start.classList.add("bg-gray-500", "text-gray-300", "opacity-50", "cursor-not-allowed");
const swapPendingBtn = document.getElementById("swap-pending-btn");
const instructions = document.getElementById("instructions");

instructions.style.color = "white";
swapPendingBtn.hidden = true;

const sounds = {
    flip: new Audio("../../sounds/card-flick.wav"),
    slide: new Audio("../../sounds/air-whoosh.wav"),
    cambio: new Audio("../../sounds/classic-alarm.wav")
}

const bgMusic = new Audio("../../music/background-pixelparty.mp3");
bgMusic.volume = 0.4;
bgMusic.loop = true;

const cambioMusic = new Audio("../../music/background-cambio.mp3");
cambioMusic.volume = 0.4;
cambioMusic.loop = true;

Object.values(sounds).forEach(sound => {
    sound.preload = "auto";
    sound.volume = 0.5;
})


joinCode.innerText = "Join Code: " + gameId;


// ===== Player State =====
let players = [];
let avatarsMap = new Map();
let playerIndexMap = new Map();
let sequence = [];
let lastSeq = 0;

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
    swapPending: swapPendingBtn,
    stick: stickBtn
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
    if(action.type === "START") {
        gameStarted = true;
    }
    stompClient.send(`/app/game/${gameId}/action`, {}, JSON.stringify(action));
}

function endTurn() {
    hasDrawn = false;
    peekMeActive = false;
    peekAnyActive = false;
    peekPlusActive = false;
    swapModeActive = false;
    stickModeActive = false;
    swapPendingModeActive = false;
    cardPending = false;
    giveModeActive = false;
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

        sendAction(gameId, currentUser.userId, currentUser.username, "JOIN", {});
    }, error => {
        console.error('STOMP connection error: ', error);
    });

};

function findPlayer(username) {
    players.forEach((p) => {
        if(p.userName === username) {
            return p;
        }
    })
    return null;
}

function getPlayerById(userId) {
    return players.find(p => p.userId === userId) || null;
}

connectWebSocket(gameId);

