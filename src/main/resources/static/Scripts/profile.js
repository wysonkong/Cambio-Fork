const username = document.getElementById("username");
const avatar = document.getElementById("avatar");
const avatarBtn = document.getElementById("avatar-button")


async function loadItems() {
    try {
        // Fetch the standings data from the server
        const response = await fetch("/api/me", {
            method: "GET",
            headers: {
                "X-Session-Id": sessionStorage.getItem("sessionId"),
                "Content-Type": "application/json"
            }
        });
        const items = await response.json();


        // Select the table body to update
        const tableBody = document.querySelector("#player-table tbody");
        tableBody.innerHTML = ""; // Clear existing rows

        username.innerHTML = `${items.username}`;
        console.log(items.avatar)
        const avatarFile = sessionStorage.getItem("avatar")
        avatar.innerHTML = `<img src="../images/avatars/${avatarFile}.png" alt="player avatar" height="100" width="100"/>`;




        // Loop through the items and append rows to the table
        const row = document.createElement("tr");
        row.innerHTML = `
                <td>${items.wins}</td>
                <td>${items.loses}</td>
            `;
        tableBody.appendChild(row);

    } catch (err) {
        console.error("Error fetching items:", err);
    }
}

window.onload = () => {
    loadItems();
    const urlParams = new URLSearchParams(window.location.search);
    if(urlParams.get(`avatarUpdated`)) {
        loadItems();
    }
};

avatarBtn.addEventListener("click", () => {
    window.location.href = "../HTML/avatar.html";
})
