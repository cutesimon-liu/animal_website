import React, { useState, useEffect, useCallback } from 'react';
import withGameLogic from '../components/HOC/withGameLogic';
import './Xiangqi.css';

const BOARD_ROWS = 10;
const BOARD_COLS = 9;

// --- Game Data and Rules ---

const getInitialBoard = () => {
    const board = Array(BOARD_ROWS).fill(null).map(() => Array(BOARD_COLS).fill(null));
    const layout = {
        0: { 0: '車', 1: '馬', 2: '象', 3: '士', 4: '將', 5: '士', 6: '象', 7: '馬', 8: '車' },
        2: { 1: '炮', 7: '炮' },
        3: { 0: '兵', 2: '兵', 4: '兵', 6: '兵', 8: '兵' },
        9: { 0: '俥', 1: '傌', 2: '相', 3: '仕', 4: '帥', 5: '仕', 6: '相', 7: '傌', 8: '俥' },
        7: { 1: '砲', 7: '砲' },
        6: { 0: '卒', 2: '卒', 4: '卒', 6: '卒', 8: '卒' },
    };
    for (const row in layout) {
        for (const col in layout[row]) {
            const name = layout[row][col];
            const color = parseInt(row) < 5 ? 'b' : 'r';
            board[row][col] = { name, color };
        }
    }
    return board;
};

function isKingInCheck(board, kingColor) {
    let kingPos = null;
    const kingName = kingColor === 'r' ? '帥' : '將';
    for (let r = 0; r < BOARD_ROWS; r++) {
        for (let c = 0; c < BOARD_COLS; c++) {
            if (board[r][c] && board[r][c].name === kingName) {
                kingPos = { r, c };
                break;
            }
        }
        if (kingPos) break;
    }
    if (!kingPos) return false;

    for (let r = 0; r < BOARD_ROWS; r++) {
        for (let c = 0; c < BOARD_COLS; c++) {
            const piece = board[r][c];
            if (piece && piece.color !== kingColor) {
                const moves = getValidMoves(board, r, c, true);
                if (moves.some(move => move.r === kingPos.r && move.c === kingPos.c)) {
                    return true;
                }
            }
        }
    }
    return false;
}

function getValidMoves(board, r, c, isForCheckCheck = false) {
    const piece = board[r][c];
    if (!piece) return [];
    const moves = [];
    const color = piece.color;

    const addMove = (nR, nC, canCapture = true) => {
        if (nR < 0 || nR >= BOARD_ROWS || nC < 0 || nC >= BOARD_COLS) return false;
        const target = board[nR][nC];
        if (!target) {
            if (canCapture) moves.push({ r: nR, c: nC });
            return true;
        }
        if (target.color !== color && canCapture) {
            moves.push({ r: nR, c: nC });
        }
        return false;
    };

    switch (piece.name) {
        case '將': case '帥':
            [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].forEach(([nR, nC]) => {
                if (nC >= 3 && nC <= 5 && ((color === 'b' && nR >= 0 && nR <= 2) || (color === 'r' && nR >= 7 && nR <= 9))) {
                    addMove(nR, nC);
                }
            });
            const oppKingName = color === 'r' ? '將' : '帥';
            let oppKingPos = null;
            for(let i=0; i<BOARD_ROWS; i++) for(let j=0; j<BOARD_COLS; j++) if(board[i][j] && board[i][j].name === oppKingName) oppKingPos = {r: i, c: j};
            if (oppKingPos && oppKingPos.c === c) {
                let intervening = 0;
                for (let i = Math.min(r, oppKingPos.r) + 1; i < Math.max(r, oppKingPos.r); i++) {
                    if (board[i][c]) intervening++;
                }
                if (intervening === 0) moves.push({ r: oppKingPos.r, c: oppKingPos.c });
            }
            break;

        case '士': case '仕':
            [[r - 1, c - 1], [r - 1, c + 1], [r + 1, c - 1], [r + 1, c + 1]].forEach(([nR, nC]) => {
                if (nC >= 3 && nC <= 5 && ((color === 'b' && nR >= 0 && nR <= 2) || (color === 'r' && nR >= 7 && nR <= 9))) {
                    addMove(nR, nC);
                }
            });
            break;

        case '象': case '相':
            [[r - 2, c - 2], [r - 2, c + 2], [r + 2, c - 2], [r + 2, c + 2]].forEach(([nR, nC]) => {
                const blockR = r + (nR - r) / 2, blockC = c + (nC - c) / 2;
                if (blockR >= 0 && blockR < BOARD_ROWS && blockC >= 0 && blockC < BOARD_COLS && !board[blockR][blockC] && ((color === 'b' && nR < 5) || (color === 'r' && nR > 4))) {
                    addMove(nR, nC);
                }
            });
            break;

        case '馬': case '傌':
            [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]].forEach(([dR, dC]) => {
                const nR = r + dR, nC = c + dC;
                const blockR = r + (Math.abs(dR) === 2 ? dR / 2 : 0);
                const blockC = c + (Math.abs(dC) === 2 ? dC / 2 : 0);
                if (blockR >= 0 && blockR < BOARD_ROWS && blockC >= 0 && blockC < BOARD_COLS && !board[blockR][blockC]) {
                    addMove(nR, nC);
                }
            });
            break;

        case '車': case '俥':
            for (let i = r - 1; i >= 0; i--) if (!addMove(i, c)) break;
            for (let i = r + 1; i < BOARD_ROWS; i++) if (!addMove(i, c)) break;
            for (let i = c - 1; i >= 0; i--) if (!addMove(r, i)) break;
            for (let i = c + 1; i < BOARD_COLS; i++) if (!addMove(r, i)) break;
            break;

        case '炮': case '砲': {
            // Non-capturing moves
            const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
            for (const [dr, dc] of directions) {
                let nR = r + dr;
                let nC = c + dc;
                while (nR >= 0 && nR < BOARD_ROWS && nC >= 0 && nC < BOARD_COLS) {
                    if (board[nR][nC]) {
                        break;
                    }
                    moves.push({ r: nR, c: nC });
                    nR += dr;
                    nC += dc;
                }
            }

            // Capturing moves
            for (const [dr, dc] of directions) {
                let screen = false;
                let nR = r + dr;
                let nC = c + dc;
                while (nR >= 0 && nR < BOARD_ROWS && nC >= 0 && nC < BOARD_COLS) {
                    if (board[nR][nC]) {
                        if (screen) {
                            if (board[nR][nC].color !== color) {
                                moves.push({ r: nR, c: nC });
                            }
                            break;
                        } else {
                            screen = true;
                        }
                    }
                    nR += dr;
                    nC += dc;
                }
            }
            break;
        }

        case '兵': // Black
            addMove(r + 1, c);
            if (r >= 5) { addMove(r, c - 1); addMove(r, c + 1); }
            break;
        case '卒': // Red
            addMove(r - 1, c);
            if (r <= 4) { addMove(r, c - 1); addMove(r, c + 1); }
            break;
        default: break;
    }

    if (isForCheckCheck) return moves;
    return moves.filter(move => {
        const tempBoard = board.map(row => [...row]);
        tempBoard[move.r][move.c] = tempBoard[r][c];
        tempBoard[r][c] = null;
        return !isKingInCheck(tempBoard, color);
    });
}

const PIECE_VALUES = { '將': 10000, '帥': 10000, '車': 9, '俥': 9, '馬': 4, '傌': 4, '炮': 4.5, '砲': 4.5, '士': 2, '仕': 2, '象': 2, '相': 2, '兵': 1, '卒': 1 };

function evaluateBoard(board) {
    let redScore = 0;
    let blackScore = 0;
    for (let r = 0; r < BOARD_ROWS; r++) {
        for (let c = 0; c < BOARD_COLS; c++) {
            const piece = board[r][c];
            if (piece) {
                const value = PIECE_VALUES[piece.name] || 0;
                if (piece.color === 'r') {
                    redScore += value;
                } else {
                    blackScore += value;
                }
            }
        }
    }
    return blackScore - redScore;
}

function minimax(board, depth, isMaximizingPlayer, alpha, beta) {
    if (depth === 0) {
        return evaluateBoard(board);
    }

    const colorToMove = isMaximizingPlayer ? 'b' : 'r';
    const allMoves = [];
    for (let r = 0; r < BOARD_ROWS; r++) {
        for (let c = 0; c < BOARD_COLS; c++) {
            const piece = board[r][c];
            if (piece && piece.color === colorToMove) {
                const moves = getValidMoves(board, r, c);
                for (const move of moves) {
                    allMoves.push({ from: { r, c }, to: move });
                }
            }
        }
    }

    if (allMoves.length === 0) {
        return evaluateBoard(board);
    }

    if (isMaximizingPlayer) {
        let maxEval = -Infinity;
        for (const move of allMoves) {
            const tempBoard = board.map(row => [...row]);
            const capturedPiece = tempBoard[move.to.r][move.to.c];
            if (capturedPiece && (capturedPiece.name === '將' || capturedPiece.name === '帥')) return Infinity;
            tempBoard[move.to.r][move.to.c] = tempBoard[move.from.r][move.from.c];
            tempBoard[move.from.r][move.from.c] = null;
            
            const boardEval = minimax(tempBoard, depth - 1, false, alpha, beta);
            maxEval = Math.max(maxEval, boardEval);
            alpha = Math.max(alpha, boardEval);
            if (beta <= alpha) break;
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (const move of allMoves) {
            const tempBoard = board.map(row => [...row]);
            const capturedPiece = tempBoard[move.to.r][move.to.c];
            if (capturedPiece && (capturedPiece.name === '將' || capturedPiece.name === '帥')) return -Infinity;
            tempBoard[move.to.r][move.to.c] = tempBoard[move.from.r][move.from.c];
            tempBoard[move.from.r][move.from.c] = null;

            const boardEval = minimax(tempBoard, depth - 1, true, alpha, beta);
            minEval = Math.min(minEval, boardEval);
            beta = Math.min(beta, boardEval);
            if (beta <= alpha) break;
        }
        return minEval;
    }
}

function isAIFirstMove(board) {
    const initial = getInitialBoard();
    for (let r = 0; r < 5; r++) { // Black's side
        for (let c = 0; c < BOARD_COLS; c++) {
            const currentPiece = board[r][c];
            const initialPiece = initial[r][c];
            if (initialPiece && initialPiece.color === 'b') {
                if (!currentPiece || currentPiece.name !== initialPiece.name || currentPiece.color !== initialPiece.color) {
                    return false;
                }
            } else if (currentPiece && currentPiece.color === 'b') {
                return false;
            }
        }
    }
    return true;
}

function findBestMoveXiangqi(board, difficulty) {
    const aiColor = 'b';

    if (isAIFirstMove(board)) {
        const openingMoves = [
            { from: { r: 2, c: 1 }, to: { r: 2, c: 4 } }, // 中炮
            { from: { r: 0, c: 1 }, to: { r: 2, c: 2 } }, // 跳馬
            { from: { r: 0, c: 7 }, to: { r: 2, c: 6 } }, // 跳馬
            { from: { r: 3, c: 0 }, to: { r: 4, c: 0 } }, // 進兵
        ];
        const validOpeningMoves = openingMoves.filter(move => {
            const moves = getValidMoves(board, move.from.r, move.from.c);
            return moves.some(m => m.r === move.to.r && m.c === move.to.c);
        });
        if (validOpeningMoves.length > 0) {
            return validOpeningMoves[Math.floor(Math.random() * validOpeningMoves.length)];
        }
    }

    let bestMove = null;
    let bestValue = -Infinity;

    const difficultySettings = {
        easy: { depth: 1, randomness: 0.7 },
        medium: { depth: 2, randomness: 0.3 },
        hard: { depth: 3, randomness: 0.1 },
    };
    const { depth, randomness } = difficultySettings[difficulty] || difficultySettings.medium;

    const allPossibleMoves = [];
    for (let r = 0; r < BOARD_ROWS; r++) {
        for (let c = 0; c < BOARD_COLS; c++) {
            const piece = board[r][c];
            if (piece && piece.color === aiColor) {
                const moves = getValidMoves(board, r, c);
                for (const move of moves) {
                    allPossibleMoves.push({ from: { r, c }, to: move });
                }
            }
        }
    }

    if (allPossibleMoves.length === 0) return null;

    if (Math.random() < randomness && difficulty !== 'hard') {
        return allPossibleMoves[Math.floor(Math.random() * allPossibleMoves.length)];
    }
    
    allPossibleMoves.sort((a, b) => {
        const pieceA = board[a.to.r][a.to.c];
        const pieceB = board[b.to.r][b.to.c];
        const valueA = pieceA ? PIECE_VALUES[pieceA.name] : 0;
        const valueB = pieceB ? PIECE_VALUES[pieceB.name] : 0;
        return valueB - valueA;
    });

    for (const move of allPossibleMoves) {
        const tempBoard = board.map(row => [...row]);
        const capturedPiece = tempBoard[move.to.r][move.to.c];
        if (capturedPiece && (capturedPiece.name === '將' || capturedPiece.name === '帥')) {
            return move;
        }
        tempBoard[move.to.r][move.to.c] = tempBoard[move.from.r][move.from.c];
        tempBoard[move.from.r][move.from.c] = null;
        
        const boardValue = minimax(tempBoard, depth - 1, false, -Infinity, Infinity);
        
        if (boardValue >= bestValue) {
            bestValue = boardValue;
            bestMove = move;
        }
    }

    return bestMove || allPossibleMoves[0];
}

// --- Component ---

const Xiangqi = ({ gameMode, difficulty, resetSignal }) => {
    const [board, setBoard] = useState(getInitialBoard());
    const [isRedNext, setIsRedNext] = useState(true);
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [possibleMoves, setPossibleMoves] = useState([]);
    const [winner, setWinner] = useState(null);
    const [inCheck, setInCheck] = useState(null);
    const [showRules, setShowRules] = useState(false);

    const resetGame = useCallback(() => {
        setBoard(getInitialBoard());
        setIsRedNext(true);
        setSelectedPiece(null);
        setPossibleMoves([]);
        setWinner(null);
        setInCheck(null);
    }, []);

    useEffect(() => {
        resetGame();
    }, [resetSignal, resetGame]);

    const movePiece = useCallback((fromR, fromC, toR, toC) => {
        const newBoard = board.map(row => [...row]);
        const piece = newBoard[fromR][fromC];
        
        if(newBoard[toR][toC] && (newBoard[toR][toC].name === '將' || newBoard[toR][toC].name === '帥')){
            setWinner(isRedNext ? '紅方' : '黑方');
        }

        newBoard[toR][toC] = piece;
        newBoard[fromR][fromC] = null;

        const opponentColor = isRedNext ? 'b' : 'r';
        if (isKingInCheck(newBoard, opponentColor)) {
            setInCheck(opponentColor);
        } else {
            setInCheck(null);
        }

        setBoard(newBoard);
        setIsRedNext(!isRedNext);
        setSelectedPiece(null);
        setPossibleMoves([]);
    }, [board, isRedNext]);

    useEffect(() => {
        if (gameMode === 'pvc' && !isRedNext && !winner) {
            const timer = setTimeout(() => {
                const aiMove = findBestMoveXiangqi(board, difficulty);
                if (aiMove) {
                    movePiece(aiMove.from.r, aiMove.from.c, aiMove.to.r, aiMove.to.c);
                }
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isRedNext, gameMode, winner, board, difficulty, movePiece]);

    const handleSquareClick = (r, c) => {
        if (winner || (gameMode === 'pvc' && !isRedNext)) return;

        if (selectedPiece) {
            const isPossible = possibleMoves.some(move => move.r === r && move.c === c);
            if (isPossible) {
                movePiece(selectedPiece.r, selectedPiece.c, r, c);
            } else {
                selectPiece(r, c);
            }
        } else {
            selectPiece(r, c);
        }
    };

    const selectPiece = (r, c) => {
        const piece = board[r][c];
        if (piece && (isRedNext ? piece.color === 'r' : piece.color === 'b')) {
            const validMoves = getValidMoves(board, r, c);
            setSelectedPiece({ r, c });
            setPossibleMoves(validMoves);
        } else {
            setSelectedPiece(null);
            setPossibleMoves([]);
        }
    };

    return (
        <div className="xiangqi-container">
            <div className="status-bar">
                {winner ? `勝利者: ${winner}` : `輪到: ${isRedNext ? '紅方' : '黑方'}`}
                {inCheck && <span className="check-status"> (將軍!)</span>}
            </div>
            <div className="xiangqi-board-container">
                <div className="xiangqi-board">
                    <div className="palace palace-top" />
                    <div className="palace palace-bottom" />
                    <div className="river">楚 河 漢 界</div>
                    {Array(BOARD_ROWS).fill(null).map((_, r) =>
                        Array(BOARD_COLS).fill(null).map((_, c) => {
                            const isPossibleMove = possibleMoves.some(move => move.r === r && move.c === c);
                            return (
                                <div
                                    key={`${r}-${c}`}
                                    className={`intersection ${isPossibleMove ? 'possible-move' : ''}`}
                                    style={{
                                        top: `${r * (100 / 9)}%`,
                                        left: `${c * (100 / 8)}%`,
                                    }}
                                    onClick={() => handleSquareClick(r, c)}
                                />
                            );
                        })
                    )}
                    {board.map((row, r) =>
                        row.map((piece, c) => {
                            if (!piece) return null;
                            const isSelected = selectedPiece && selectedPiece.r === r && selectedPiece.c === c;
                            return (
                                <div
                                    key={`${r}-${c}-piece`}
                                    className={`piece ${piece.color} ${isSelected ? 'selected' : ''}`}
                                    style={{
                                        top: `${r * (100 / 9)}%`,
                                        left: `${c * (100 / 8)}%`,
                                    }}
                                    onClick={() => handleSquareClick(r, c)}
                                >
                                    {piece.name}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
            <button className={`rules-toggle-button ${showRules ? 'shifted' : ''}`} onClick={() => setShowRules(!showRules)}>
                {showRules ? '隱藏規則' : '顯示規則'}
            </button>

            <div className={`rules-overlay ${showRules ? 'show' : ''}`}>
                <div className="rules-content">
                    <h3>象棋規則</h3>
                    <h4>遊戲目標</h4>
                    <p>將死對方的「將」或「帥」。</p>
                    <h4>基本規則</h4>
                    <ul>
                        <li><strong>將/帥 (King):</strong> 只能在九宮（由四個小方格組成的區域）內移動，每次只能沿著直線或橫線移動一格。帥和將不能在同一條直線上直接相對，中間必須有其他棋子。</li>
                        <li><strong>士/仕 (Advisor):</strong> 只能在九宮內沿著斜線移動一格。</li>
                        <li><strong>象/相 (Elephant):</strong> 不能過河。每次移動走「田」字（即斜走兩格），但如果「田」字的中心有棋子（稱為「塞象眼」），則不能移動。</li>
                        <li><strong>馬/傌 (Horse):</strong> 走「日」字（即直走一格再斜走一格）。如果馬的移動路徑上，與其相鄰的交叉點有棋子（稱為「蹩馬腿」），則不能朝該方向移動。</li>
                        <li><strong>車/俥 (Chariot):</strong> 可以在棋盤上無限制地直線或橫線移動，只要路徑上沒有其他棋子。</li>
                        <li><strong>炮/砲 (Cannon):</strong> 移動時與車相同。吃子時，必須在自己和對方棋子之間隔著一個棋子（稱為「炮台」或「翻山」）。</li>
                        <li><strong>兵/卒 (Pawn):</strong> 在過河前，每次只能向前移動一格。過河後，除了向前，還可以向左或向右移動一格，但不能後退。</li>
                    </ul>
                    <h4>特殊規則</h4>
                    <ul>
                        <li><strong>將軍 (Check):</strong> 當一方的棋子攻擊到對方的將/帥時，稱為「將軍」。被將軍的一方必須立即「應將」，即移動將/帥或用其他棋子擋住攻擊。</li>
                        - <li><strong>將死 (Checkmate):</strong> 如果被將軍的一方無法應將，則為「將死」，遊戲結束。</li>
                        - <li><strong>困斃 (Stalemate):</strong> 如果輪到一方走棋，但其已無子可走（所有棋子都被困住），則為「困斃」，判和棋。</li>
                    </ul>
                    <button className="close-rules-button" onClick={() => setShowRules(false)}>關閉</button>
                </div>
            </div>
        </div>
    );
};
const XiangqiWithLogic = withGameLogic(Xiangqi, {
    gameName: 'xiangqi',
    displayName: '象棋',
    difficulties: ['easy', 'medium', 'hard'],
    hasGameModeSelection: true,
});

export default XiangqiWithLogic;