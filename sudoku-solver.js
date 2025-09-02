let cols = Array.from({ length: 9 }, () => new Set());
let rows = Array.from({ length: 9 }, () => new Set());
let squares = Array.from({ length: 9 }, () => new Set());

const sudoku_board = document.querySelector('.sudoku-board');

for (let i = 0; i < 81; i++) {
    const input = document.createElement('input');
    input.type = 'text';
    input.maxLength = 1;
    sudoku_board.appendChild(input);
}

const cells = document.querySelectorAll('.sudoku-board input');
cells.forEach(cell => {
    cell.addEventListener('input', (e) => {
        const value = e.target.value;
        if (!/^[1-9]$/.test(value)) {
            e.target.value = '';
        }
    });
});

function resetSets() {
    cols = Array.from({ length: 9 }, () => new Set());
    rows = Array.from({ length: 9 }, () => new Set());
    squares = Array.from({ length: 9 }, () => new Set());
}

function isValid(board) {
    if (board.length !== 9 || board[0].length !== 9) {
        return false;
    }

    resetSets();

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (board[r][c] === 0) continue;

            if (
                rows[r].has(board[r][c]) ||
                cols[c].has(board[r][c]) ||
                squares[3 * Math.floor(r / 3) + Math.floor(c / 3)].has(board[r][c])
            ) {
                return false;
            }

            rows[r].add(board[r][c]);
            cols[c].add(board[r][c]);
            squares[3 * Math.floor(r / 3) + Math.floor(c / 3)].add(board[r][c]);
        }
    }

    return true;
}

function isComplete(board) {
    return board.every(row => row.every(cell => cell !== 0));
}

function findNextEmptyCell(board) {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (board[r][c] === 0) {
                return [r, c];
            }
        }
    }

    return [-1, -1];
}

function isValidMove(board, row, col, num) {
    return !(
        rows[row].has(num) ||
        cols[col].has(num) ||
        squares[3 * Math.floor(row / 3) + Math.floor(col / 3)].has(num)
    )
}

function showPopup(message) {
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popup-message');
    popupMessage.textContent = message;
    popup.style.display = 'block';
}

document.getElementById('popup-close').addEventListener('click', () => {
    const popup = document.getElementById('popup');
    popup.style.display = 'none';
});

function solveSudoku() {
    const board = [];
    const cells = sudoku_board.querySelectorAll('input');

    for (let row = 0; row < 9; row++) {
        const currentRow = [];
        for (let col = 0; col < 9; col++) {
            const idx = row * 9 + col;
            const rawValue = cells[idx].value.trim();
            let value;

            if (rawValue === '') {
                value = 0;
            } else {
                value = parseInt(rawValue);
                if (isNaN(value) || value < 1 || value > 9) {
                    showPopup(
                        'Invalid value at row ${row + 1}, column ${col + 1}. Please enter a number from 1 to 9.'
                    );
                    return null;
                }
            }

            currentRow.push(value);
        }
        board.push(currentRow);
    }

    if (!isValid(board)) {
        showPopup('Board is not valid. Please enter a valid Sudoku board.');
        return null;
    }

    return backtrack(board) ? board : null;
}

function backtrack(board) {
    if (isComplete(board)) {
        return true;
    }

    const [row, col] = findNextEmptyCell(board);

    for (let num = 1; num <= 9; num++) {
        if (isValidMove(board, row, col, num)) {
            board[row][col] = num;
            rows[row].add(num);
            cols[col].add(num);
            squares[3 * Math.floor(row / 3) + Math.floor(col / 3)].add(num);

            if (backtrack(board)) {
                return board;
            }

            // Backtrack
            board[row][col] = 0;
            rows[row].delete(num);
            cols[col].delete(num);
            squares[3 * Math.floor(row / 3) + Math.floor(col / 3)].delete(num);
        }
    }

    return false;
}

function solve() {
    const solution = solveSudoku();
    
    const parent = document.getElementById('sudoku-container');
    
    // clean up any previous solutions
    const oldSolution = document.getElementById('solved-grid');
    if (oldSolution) {
        oldSolution.remove();
    }

    // create new solution grid
    const gridDiv = document.createElement('div');
    gridDiv.className = 'sudoku-board';
    gridDiv.id = 'solved-grid';

    if (solution) {
        for (let i = 0; i < 81; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = 1;
            input.value = solution[Math.floor(i / 9)][i % 9];
            input.disabled = true;
            gridDiv.appendChild(input);
        }
        parent.appendChild(gridDiv);
    }
}