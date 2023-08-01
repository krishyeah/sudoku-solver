import sys

def readgridfile(fileName):
    '''Read grid from grid.txt and output as list[list[int]]
    rtype: list[list[int]]
    '''
    with open(fileName) as file:
        lines = [line.rstrip() for line in file]
    return lines

def isValid(board):
    
    return False


def main():
    if len(sys.argv) >= 3 or len(sys.argv) <= 1:
        print("Usage: sudokusolver.py filepath")
        return -1
    
    board = readgridfile(sys.argv[1])
    # print(board)

    if not isValid(board):
        print("Board is not valid")
        return -1

if __name__ == "__main__":
    main()