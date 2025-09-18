async function loadItems() {
    try {
        // Fetch the standings data from the server
        const response = await fetch("http://localhost:8080/api/standings");
        const items = await response.json();

        // Calculate win percentage for each player and rank them
        items.forEach(item => {
            item.winPercentage = calculateWinPercent(item.wins, item.loses);
        });

        // Sort players based on win percentage in descending order
        items.sort((a, b) => b.winPercentage - a.winPercentage);

        // Assign ranks based on sorted order
        items.forEach((item, index) => {
            item.rank = index + 1; // Rank starts at 1
        });

        // Select the table body to update
        const tableBody = document.querySelector("#player-table tbody");
        tableBody.innerHTML = ""; // Clear existing rows

        // Loop through the items and append rows to the table
        items.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.username} <span class="text-sm text-gray-400">[Rank ${item.rank}]</span></td>
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

function calculateWinPercent(wins, losses) {
    let totalGames = wins + losses;
    if (totalGames === 0) {
        return 0;
    }
    return (wins/totalGames) * 100;
}

function rankPlayers(players){
    players.sort((a,b) => b.winPercentage - a.winPercentage);

    players.forEach((players, index) => {
        players.rank = index + 1
    })
}



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

