
const BOARD_ROWS = 10;
const BOARD_COLS = 9;

// --- Rule Implementation ---

function getValidMoves(board, piece, r, c) {
    const moves = [];
    const playerColor = piece.color;

    const addMove = (nR, nC) => {
        if (nR >= 0 && nR < BOARD_ROWS && nC >= 0 && nC < BOARD_COLS) {
            const target = board[nR][nC];
            if (!target || target.color !== playerColor) {
                moves.push({ r: nR, c: nC });
            }
        }
    };

    switch (piece.name) {
        case '將':
        case '帥':
            // ... General/King logic
            break;
        case '士':
        case '仕':
            // ... Advisor logic
            break;
        case '象':
        case '相':
            // ... Elephant logic
            break;
        case '馬':
        case '傌':
            // ... Horse logic
            break;
        case '車':
        case '俥':
            // ... Chariot logic
            break;
        case '炮':
        case '砲':
            // ... Cannon logic
            break;
        case '兵':
        case '卒':
            // ... Soldier/Pawn logic
            break;
        default:
            break;
    }

    // TODO: Filter out moves that leave the king in check
    return moves;
}

export { getValidMoves };
