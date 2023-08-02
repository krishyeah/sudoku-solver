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
                print(f"r: {r}")
                print(f"c: {c}")
                print(f"board[r][c]: {board[r][c]}")
                return False
            
            cols[c].add(board[r][c])
            rows[r].add(board[r][c])
            squares[(r // 3, c // 3)].add(board[r][c])
    
    return True

def solveBoard(board):
    '''Solves current valid board using backtracking.
    rtype: bool
    '''
    
    return -1

def main():
    if len(sys.argv) >= 3 or len(sys.argv) <= 1:
        print("Usage: sudokusolver.py filepath")
        return -1
    
    board = readgridfile(sys.argv[1])
    # print(board)

    if not isValid(board):
        print("Board is not valid")
        return -1
    
    return solveBoard(board)    

if __name__ == "__main__":
    main()