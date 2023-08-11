import sys
import collections
import csv

def readgridfile(fileName):
    '''Read grid from grid.txt and output as list[list[int]]
    rtype: list[list[int]]
    '''
    with open(fileName) as file:
        board = [list(map(int, num)) for num in csv.reader(file)]
    return board

def isValid(board):
    '''Checks if current board is a valid board before attempting to solve.
    rtype: bool
    '''
    if len(board) != 9 and len(board[0]) != 9:
        return False
    
    cols = collections.defaultdict(set)
    rows = collections.defaultdict(set)
    squares = collections.defaultdict(set)

    for r in range(9):
        for c in range(9):
            if board[r][c] == 0:
                continue
            
            if (board[r][c] in rows[r] or
                board[r][c] in cols[c] or
                board[r][c] in squares[r // 3, c // 3]):
                return False
            
            cols[c].add(board[r][c])
            rows[r].add(board[r][c])
            squares[(r // 3, c // 3)].add(board[r][c])
    
    return True

def solveSudoku(board):
    if isComplete(board):
        return board  # Puzzle is solved
    
    row, col = findNextEmptyCell(board)
    
    for num in range(1,10):
        if isValidMove(board, row, col, num):
            board[row][col] = num
            
            if solveSudoku(board) is not None:
                return board  # Successfully solved
            
            board[row][col] = 0  # Backtrack
        
    return None  # No solution found

def isComplete(board):
    for row in board:
        for cell in row:
            if cell == 0:
                return False
    return True

def findNextEmptyCell(board):
    for row in range(9):
        for col in range(9):
            if board[row][col] == 0:
                return row, col
    return -1, -1  # No empty cell found

def isValidMove(board, row, col, num):
    # Check row and column
    for i in range(9):
        if board[row][i] == num or board[i][col] == num:
            return False
    
    # Check 3x3 subgrid
    startRow, startCol = row - row % 3, col - col % 3
    for i in range(3):
        for j in range(3):
            if board[startRow + i][startCol + j] == num:
                return False
    
    return True
    

def main():
    if len(sys.argv) >= 3 or len(sys.argv) <= 1:
        print("Usage: sudokusolver.py filepath")
        return -1
    
    board = readgridfile(sys.argv[1])
    # print(board)

    if not isValid(board):
        print("Board is not valid")
        return -1
    
    solvedBoard = solveSudoku(board)
    for row in solvedBoard:
        print(row)
        
if __name__ == "__main__":
    main()