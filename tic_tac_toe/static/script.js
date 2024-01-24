// script.js
document.addEventListener('DOMContentLoaded', function () {
    const board = document.getElementById('board');

    function initializeBoard() {
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            cell.addEventListener('click', handleCellClick);
            board.appendChild(cell);
        }
    }

    function handleCellClick(event) {
        const cell = event.target;
        const index = cell.dataset.index;

        // Get row and column from the index (assuming a 3x3 grid)
        const row = Math.floor(index / 3);
        const col = index % 3;

        // Send a move to the backend
        fetch('/move', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ row, col }),
        })
        .then(response => response.json())
        .then(data => {
            handleMoveResult(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function handleMoveResult(data) {
        if (data.result === 'success') {
            // Update the frontend with the new board
            updateBoard(data.board);
        } else if (data.result === 'win') {
            // Handle a win
            alert(`Player ${data.winner} wins!`);
            resetBoard();
        } else if (data.result === 'draw') {
            // Handle a draw
            alert('It\'s a draw!');
            resetBoard();
        } else {
            // Handle other errors (e.g., cell already occupied)
            alert(data.message || 'An error occurred.');
        }
    }

    function updateBoard(newBoard) {
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            const row = Math.floor(index / 3);
            const col = index % 3;
            cell.textContent = newBoard[row][col];
        });
    }

    function resetBoard() {
        // Clear the board on the frontend
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.textContent = '';
        });
    }

    // Initialize the board when the page loads
    initializeBoard();
});
