let joinBtn = document.getElementById("join-game");
let joinSubmit = document.getElementById("join-submit");
let joinInput = document.getElementById("game-code");
let gameCodeContainer = document.getElementById("game-code-container");
const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

joinBtn.addEventListener("click", () => {
    gameCodeContainer.classList.toggle("hidden"); // show/hide textbox
});

let createBtn = document.getElementById("create-game");

createBtn.addEventListener("click", async() => {
    const response = await fetch("/api/games/create", {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({userId: currentUser.userId})
    });

    const data = await response.json();
    const gameId = data.gameId;
    console.log("created game with id of: " + gameId);
    sessionStorage.setItem("currentGame", gameId);

    await fetch("/api/games/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userId: currentUser.userId,
            username: currentUser.username,
            gameId: gameId
        })
    });
    window.location.href = `game.html?gameId=${gameId}`;
});

joinSubmit.addEventListener("click", async (e) => {
    e.preventDefault();
    const gameId = joinInput.value;
    const response = await fetch("/api/games/join", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            userId: currentUser.userId,
            username: currentUser.username,
            gameId: gameId
        })
    });
    if(!response.ok) {
        console.log("failed to join game," + await response.text());
        return;
    }

    const gameState = await response.json();
    console.log("Joined game:", gameState);
    sessionStorage.setItem("currentGame", gameId);
    window.location.href = `game.html?gameId=${gameId}`;
});

