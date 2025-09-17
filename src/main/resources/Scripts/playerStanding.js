async function loadItems() {
    try {
        const response = await fetch("http://localhost:8080/api/standings");
        const items = await response.json();

        const tableBody = document.querySelector("#player-table tbody");
        tableBody.innerHTML = ""; // clear existing rows

        items.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${item.username}</td>
            <td>${item.wins}</td>
            <td>${item.loses}</td>
          `;
            tableBody.appendChild(row);
        });
    } catch (err) {
        console.error("Error fetching items:", err);
    }
}

window.onload = loadItems();