let cols = Array.from({ length: 9 }, () => new Set());
let rows = Array.from({ length: 9 }, () => new Set());
let squares = Array.from({ length: 9 }, () => new Set());

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

function solveSudoku(board) {
  if (isComplete(board)) {
    return board;
  }

  const [row, col] = findNextEmptyCell(board);

  for (let num = 1; num <= 9; num++) {
    if (isValidMove(board, row, col, num)) {
      board[row][col] = num;
      rows[row].add(num);
      cols[col].add(num);
      squares[3 * Math.floor(row / 3) + Math.floor(col / 3)].add(num);

      if (solveSudoku(board)) {
        return board;
      }

      // Backtrack
      board[row][col] = 0;
      rows[row].delete(num);
      cols[col].delete(num);
      squares[3 * Math.floor(row / 3) + Math.floor(col / 3)].delete(num);
    }
  }

  return null;
}