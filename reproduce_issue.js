
const PIECES = {
    'k': { name: '帥', rank: 7, color: 'red' },
    'a': { name: '仕', rank: 6, color: 'red' },
    'e': { name: '相', rank: 5, color: 'red' },
    'r': { name: '俥', rank: 4, color: 'red' },
    'h': { name: '傌', rank: 3, color: 'red' },
    'c': { name: '炮', rank: 2, color: 'red' },
    's': { name: '兵', rank: 1, color: 'red' },
    'K': { name: '將', rank: 7, color: 'black' },
    'A': { name: '士', rank: 6, color: 'black' },
    'E': { name: '象', rank: 5, color: 'black' },
    'R': { name: '車', rank: 4, color: 'black' },
    'H': { name: '馬', rank: 3, color: 'black' },
    'C': { name: '包', rank: 2, color: 'black' },
    'S': { name: '卒', rank: 1, color: 'black' },
};

// Mock Board
const board = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null]
];

// Helper to place piece
function placePiece(row, col, key) {
    board[row][col] = { key, ...PIECES[key] };
}

// Mock Revealed Set
const revealed = new Set();

// isValidMove Logic (Copied from DarkChess.js - FIXED)
const isValidMove = (selected, target, currentBoard) => {
    const { piece, row, col } = selected;
    const targetPiece = currentBoard[target.row][target.col];
    const isTargetEmpty = !targetPiece;
    const isTargetRevealed = revealed.has(`${target.row}-${target.col}`);

    if (row === target.row && col === target.col) {
        return false;
    }

    // Allow capturing ANY unrevealed piece (except for Cannons which need to jump)
    // Cannons still need to check for jump logic, but we skip color/rank check for unrevealed target there too.

    const isAdjacent = Math.abs(row - target.row) + Math.abs(col - target.col) === 1;

    if (piece.name !== '炮' && piece.name !== '包') {
        if (!isAdjacent) {
            return false;
        }
        if (isTargetEmpty) {
            return true;
        }

        // If target is NOT revealed, we can eat it (blind capture)
        if (!isTargetRevealed) {
            return true;
        }

        if (targetPiece.color === piece.color) {
            return false;
        }
        if (piece.name === '兵' || piece.name === '卒') {
            return targetPiece.name === '帥' || targetPiece.name === '將' || targetPiece.rank === 1;
        }
        if (piece.name === '帥' || piece.name === '將') {
            return targetPiece.rank !== 1;
        }
        return piece.rank >= targetPiece.rank;
    }

    if (piece.name === '炮' || piece.name === '包') {
        const isSameRow = row === target.row;
        const isSameCol = col === target.col;

        if (!isSameRow && !isSameCol) {
            return false;
        }

        const piecesInBetween = [];
        if (isSameRow) {
            const start = Math.min(col, target.col) + 1;
            const end = Math.max(col, target.col);
            for (let i = start; i < end; i++) {
                if (currentBoard[row][i]) {
                    piecesInBetween.push(currentBoard[row][i]);
                }
            }
        } else {
            const start = Math.min(row, target.row) + 1;
            const end = Math.max(row, target.row);
            for (let i = start; i < end; i++) {
                if (currentBoard[i][col]) {
                    piecesInBetween.push(currentBoard[i][col]);
                }
            }
        }

        if (isTargetEmpty) {
            return piecesInBetween.length === 0;
        } else {
            // If target is unrevealed, we can eat it IF there is exactly one piece in between
            if (!isTargetRevealed) {
                return piecesInBetween.length === 1;
            }

            if (targetPiece.color === piece.color) {
                return false;
            }
            return piecesInBetween.length === 1;
        }
    }

    return false;
};

// Test Cases
console.log("--- Test Cases ---");

// Case 1: Red Horse (Rank 3) tries to eat Unrevealed Black Chariot (Rank 4)
// Should be ALLOWED by rules (eat unrevealed), but BLOCKED by current logic (rank check).
placePiece(0, 0, 'h'); // Red Horse
placePiece(0, 1, 'R'); // Black Chariot
// 0-0 is revealed (implied, since we are moving it)
// 0-1 is NOT revealed
revealed.clear();
revealed.add('0-0');

const move1 = isValidMove(
    { piece: board[0][0], row: 0, col: 0 },
    { row: 0, col: 1 },
    board
);
console.log(`Case 1 (Horse eats Unrevealed Chariot): ${move1} (Expected: true if 'eat unrevealed' is fully supported, currently likely false)`);


// Case 2: Red Horse tries to eat Unrevealed Red Soldier
// Should be ALLOWED if 'eat unrevealed' means 'eat anything'.
// Should be BLOCKED if 'eat unrevealed' means 'eat enemy'.
placePiece(1, 0, 'h');
placePiece(1, 1, 's'); // Red Soldier
revealed.add('1-0');
// 1-1 not revealed

const move2 = isValidMove(
    { piece: board[1][0], row: 1, col: 0 },
    { row: 1, col: 1 },
    board
);
console.log(`Case 2 (Horse eats Unrevealed Own Soldier): ${move2} (Expected: depends on variant)`);

// Case 3: Red Horse eats Unrevealed Black Soldier (Rank 1)
// Should be ALLOWED (Rank 3 >= Rank 1)
placePiece(2, 0, 'h');
placePiece(2, 1, 'S'); // Black Soldier
revealed.add('2-0');

const move3 = isValidMove(
    { piece: board[2][0], row: 2, col: 0 },
    { row: 2, col: 1 },
    board
);
console.log(`Case 3 (Horse eats Unrevealed Black Soldier): ${move3} (Expected: true)`);

