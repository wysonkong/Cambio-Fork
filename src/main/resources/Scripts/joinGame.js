let joinBtn = document.getElementById("join-game");
let gameCodeContainer = document.getElementById("game-code-container");

joinBtn.addEventListener("click", () => {
    gameCodeContainer.classList.toggle("hidden"); // show/hide textbox
});

let createBtn = document.getElementById("create-game");

createBtn.addEventListener("click", () => {
    window.location.href = "game.html";
})

