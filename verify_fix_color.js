
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

// COPIED FROM DarkChess.js (with fix applied)
const isValidMove = (selected, target, currentBoard, isBlindCheck = false, explicitTargetPiece = null, isUnrevealedCapture = false) => {
    const { piece, row, col } = selected;
    const targetPiece = explicitTargetPiece || currentBoard[target.row][target.col];
    const isTargetEmpty = !targetPiece;
    // If explicitTargetPiece is passed, we assume it's revealed for the purpose of the check
    const isTargetRevealed = explicitTargetPiece ? true : revealed.has(`${target.row}-${target.col}`);

    if (row === target.row && col === target.col) {
        return false;
    }

    const isAdjacent = Math.abs(row - target.row) + Math.abs(col - target.col) === 1;

    if (piece.name !== '炮' && piece.name !== '包') {
        if (!isAdjacent) {
            return false;
        }
        if (isTargetEmpty) {
            return true;
        }

        // If we are doing a "Blind Check" (checking if we can ATTEMPT the move),
        // we allow it if the target is unrevealed.
        if (isBlindCheck && !isTargetRevealed) {
            return true;
        }

        // If not blind check (or target is revealed), we enforce rules
        if (!isBlindCheck && !isTargetRevealed) {
            // This case means we are trying to capture an unrevealed piece without a blind check.
            // For safety, we'll say it's not a valid capture in this strict mode.
            return false;
        }

        // NEW: Color check enforced BEFORE unrevealed capture check
        if (targetPiece.color === piece.color) {
            return false;
        }

        // If it is an unrevealed capture (we just revealed it to eat it), we skip rank checks
        if (isUnrevealedCapture) {
            return true;
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
            // Cannon Blind Capture Logic
            if (isBlindCheck && !isTargetRevealed) {
                return piecesInBetween.length === 1;
            }

            // If not blind check (or target is revealed), we enforce rules
            if (!isBlindCheck && !isTargetRevealed) {
                return false; // Cannot capture unrevealed in strict mode
            }

            // NEW: Color check enforced BEFORE unrevealed capture check
            if (targetPiece.color === piece.color) {
                return false;
            }

            // If it is an unrevealed capture (we just revealed it to eat it), we skip color check
            // But we still need to check if there is exactly one piece in between (which is already checked above)
            if (isUnrevealedCapture) {
                return piecesInBetween.length === 1;
            }

            return piecesInBetween.length === 1;
        }
    }

    return false;
};

// Test Cases
console.log("--- Verification Test Cases (Color Check) ---");

// Case 1: Red Horse tries to eat Unrevealed Red Soldier (Own Color)
placePiece(0, 0, 'h'); // Red Horse
placePiece(0, 1, 's'); // Red Soldier
revealed.clear();
revealed.add('0-0');
// 0-1 is NOT revealed

// 1. Blind check (Should still be TRUE - we can ATTEMPT to move there)
const canAttempt = isValidMove({ piece: board[0][0], row: 0, col: 0 }, { row: 0, col: 1 }, board, true);
console.log(`Case 1 (Blind Check): ${canAttempt} (Expected: true)`);

// 2. Reveal and Capture check (Should be FALSE - cannot eat own color)
const targetPiece1 = board[0][1];
const canCapture1 = isValidMove(
    { piece: board[0][0], row: 0, col: 0 },
    { row: 0, col: 1 },
    board,
    false,
    targetPiece1,
    true // isUnrevealedCapture
);
console.log(`Case 1 (Capture Check): ${canCapture1} (Expected: false)`);


// Case 2: Cannon tries to eat Unrevealed Red Piece (Own Color) with screen
placePiece(1, 0, 'c'); // Red Cannon
placePiece(1, 1, 's'); // Screen
placePiece(1, 2, 'r'); // Red Chariot (Target)
revealed.add('1-0');

// Blind check
const canAttempt2 = isValidMove({ piece: board[1][0], row: 1, col: 0 }, { row: 1, col: 2 }, board, true);
console.log(`Case 2 (Blind Check): ${canAttempt2} (Expected: true)`);

// Capture check
const targetPiece2 = board[1][2];
const canCapture2 = isValidMove(
    { piece: board[1][0], row: 1, col: 0 },
    { row: 1, col: 2 },
    board,
    false,
    targetPiece2,
    true // isUnrevealedCapture
);
console.log(`Case 2 (Capture Check): ${canCapture2} (Expected: false)`);
