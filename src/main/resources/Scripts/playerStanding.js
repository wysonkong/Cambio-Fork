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

let filterWins = document.getElementById('filter-wins');
filterWins.addEventListener('click', () => {
    // Implement filter logic for wins (e.g., filter rows in a table)
    filterBy('wins', 'desc')
});

let filterLosses = document.getElementById('filter-losses');
filterLosses.addEventListener('click',() => {
    filterBy('losses', 'desc');
});

function filterBy(criteria, order) {
    const rows = Array.from(document.querySelectorAll('#player-table tbody tr'));

    let valueA, valueB;

    rows.sort((rowA, rowB) => {
        if (criteria === 'wins') {
            valueA = parseInt(rowA.cells[1].textContent.trim()); // Column 1 for Wins
            valueB = parseInt(rowB.cells[1].textContent.trim()); // Column 1 for Wins
        }
        if (criteria === 'losses') {
            valueA = parseInt(rowA.cells[2].textContent.trim()); // Column 2 for Losses
            valueB = parseInt(rowB.cells[2].textContent.trim()); // Column 2 for Losses
        }

        if (order === 'desc') {
            return valueB - valueA;
        } else {
            return valueA - valueB;
        }
    });

    let tbody = document.querySelector('#player-table tbody');
    rows.forEach(row => tbody.appendChild(row));
}

