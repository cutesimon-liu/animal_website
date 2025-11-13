import React, { useState, useEffect, useCallback } from 'react';
import withGameLogic from '../components/HOC/withGameLogic';
import './Gomoku.css';

const BOARD_SIZE = 15;

const Gomoku = ({ gameMode, difficulty, resetSignal }) => {
  const [board, setBoard] = useState(Array(BOARD_SIZE).fill(Array(BOARD_SIZE).fill(null)));
  const [isPlayerNext, setIsPlayerNext] = useState(true); // P1 is 'B' (Black), P2/Computer is 'W' (White)
  const [winner, setWinner] = useState(null);
  const [isComputerTurn, setIsComputerTurn] = useState(false);
  const [lastMove, setLastMove] = useState(null);

  const resetGame = useCallback(() => {
    setBoard(Array(BOARD_SIZE).fill(Array(BOARD_SIZE).fill(null)));
    setIsPlayerNext(true);
    setWinner(null);
    setIsComputerTurn(false);
    setLastMove(null);
  }, []);

  useEffect(() => {
      resetGame();
  }, [resetSignal, resetGame]);

  const makeMove = useCallback((row, col) => {
    const newBoard = board.map(r => r.slice());
    newBoard[row][col] = isPlayerNext ? 'B' : 'W';
    setBoard(newBoard);
    setLastMove({ row, col });

    if (checkWinner(newBoard, row, col)) {
        let winnerName;
        if (gameMode === 'pvc') {
            winnerName = isPlayerNext ? '玩家' : '電腦';
        } else {
            winnerName = isPlayerNext ? '玩家 1 (黑棋)' : '玩家 2 (白棋)';
        }
        setWinner(winnerName);
    } else {
      setIsPlayerNext(!isPlayerNext);
    }
  }, [board, isPlayerNext, gameMode]);

  useEffect(() => {
    if (gameMode === 'pvc' && !isPlayerNext && !winner) {
      setIsComputerTurn(true);
      const timer = setTimeout(() => {
        const computerMove = findBestMove(board, difficulty);
        if (computerMove) {
          makeMove(computerMove.row, computerMove.col);
        }
        setIsComputerTurn(false);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isPlayerNext, winner, board, difficulty, gameMode, makeMove]);

  const handleClick = (row, col) => {
    if (winner || board[row][col] || (gameMode === 'pvc' && isComputerTurn)) {
      return;
    }
    makeMove(row, col);
  };

  const getStatus = () => {
    if (winner) {
      return `勝利者: ${winner}`;
    }
    if (gameMode === 'pvc') {
        if (isComputerTurn) return '電腦思考中...';
        return '輪到你了 (黑棋)';
    } else {
        return isPlayerNext ? "玩家 1 回合 (黑棋)" : "玩家 2 回合 (白棋)";
    }
  };

  return (
    <div className="gomoku-container">
      <div className="status-bar">{getStatus()}</div>
      <div className="gomoku-board-container">
        <div className="gomoku-board">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="gomoku-board-row">
              {row.map((cell, colIndex) => (
                <div key={colIndex} className="gomoku-square" onClick={() => handleClick(rowIndex, colIndex)}>
                  {cell && (
                    <div className={`stone ${cell}`}>
                      {lastMove && lastMove.row === rowIndex && lastMove.col === colIndex && (
                        <div className="last-move-indicator"></div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- AI v3.0 --- //

const checkWinner = (board, row, col) => {
    const player = board[row][col];
    if (!player) return false;
    const directions = [{ r: 0, c: 1 }, { r: 1, c: 0 }, { r: 1, c: 1 }, { r: 1, c: -1 }];
    for (const dir of directions) {
        let count = 1;
        for (let i = 1; i < 5; i++) {
            const r = row + dir.r * i, c = col + dir.c * i;
            if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE || board[r][c] !== player) break;
            count++;
        }
        for (let i = 1; i < 5; i++) {
            const r = row - dir.r * i, c = col - dir.c * i;
            if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE || board[r][c] !== player) break;
            count++;
        }
        if (count >= 5) return true;
    }
    return false;
};

const SCORES = { FIVE: 10000000, OPEN_FOUR: 500000, CLOSED_FOUR: 5000, OPEN_THREE: 5000, CLOSED_THREE: 50, OPEN_TWO: 50, CLOSED_TWO: 5 };

const evaluateCell = (board, r, c, player) => {
    let score = 0;
    const directions = [{ r: 0, c: 1 }, { r: 1, c: 0 }, { r: 1, c: 1 }, { r: 1, c: -1 }];

    for (const dir of directions) {
        let consecutive = 1;
        let openEnds = 0;

        // Check one way
        for (let i = 1; i < 5; i++) {
            const nr = r + dir.r * i, nc = c + dir.c * i;
            if (nr < 0 || nr >= BOARD_SIZE || nc < 0 || nc >= BOARD_SIZE || board[nr][nc] !== player) {
                if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE && board[nr][nc] === null) openEnds++;
                break;
            }
            consecutive++;
        }

        // Check opposite way
        for (let i = 1; i < 5; i++) {
            const nr = r - dir.r * i, nc = c - dir.c * i;
            if (nr < 0 || nr >= BOARD_SIZE || nc < 0 || nc >= BOARD_SIZE || board[nr][nc] !== player) {
                if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE && board[nr][nc] === null) openEnds++;
                break;
            }
            consecutive++;
        }

        if (consecutive >= 5) score += SCORES.FIVE;
        else if (consecutive === 4) score += openEnds === 2 ? SCORES.OPEN_FOUR : (openEnds === 1 ? SCORES.CLOSED_FOUR : 0);
        else if (consecutive === 3) score += openEnds === 2 ? SCORES.OPEN_THREE : (openEnds === 1 ? SCORES.CLOSED_THREE : 0);
        else if (consecutive === 2) score += openEnds === 2 ? SCORES.OPEN_TWO : (openEnds === 1 ? SCORES.CLOSED_TWO : 0);
    }
    return score;
};

const findBestMove = (board, difficulty) => {
    const depth = { easy: 1, medium: 1, hard: 2 }[difficulty];
    const candidates = generateCandidates(board);
    let bestMove = { row: -1, col: -1 };
    let bestScore = -Infinity;

    // 1. Immediate win/loss check (Threat-Space Pruning)
    for (const move of candidates) {
        // Check for AI win
        board[move.row][move.col] = 'W';
        if (checkWinner(board, move.row, move.col)) {
            board[move.row][move.col] = null;
            return move;
        }
        board[move.row][move.col] = null;

        // Check for player win
        board[move.row][move.col] = 'B';
        if (checkWinner(board, move.row, move.col)) {
            board[move.row][move.col] = null;
            bestMove = move; // Mandatory block
        }
        board[move.row][move.col] = null;
    }
    if (bestMove.row !== -1) return bestMove; // If there's a mandatory block, take it.

    // 2. Minimax search if no immediate threats
    for (const move of candidates) {
        board[move.row][move.col] = 'W';
        const score = minimax(board, depth, false, -Infinity, Infinity);
        board[move.row][move.col] = null;
        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }

    return bestMove.row === -1 ? candidates[0] : bestMove;
};

const minimax = (board, depth, isMaximizing, alpha, beta) => {
    if (depth === 0) {
        return evaluateBoard(board);
    }
    const candidates = generateCandidates(board);
    if (candidates.length === 0) return evaluateBoard(board);

    if (isMaximizing) {
        let maxEval = -Infinity;
        for (const move of candidates) {
            board[move.row][move.col] = 'W';
            const an_eval = minimax(board, depth - 1, false, alpha, beta);
            board[move.row][move.col] = null;
            maxEval = Math.max(maxEval, an_eval);
            alpha = Math.max(alpha, an_eval);
            if (beta <= alpha) break;
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (const move of candidates) {
            board[move.row][move.col] = 'B';
            const an_eval = minimax(board, depth - 1, true, alpha, beta);
            board[move.row][move.col] = null;
            minEval = Math.min(minEval, an_eval);
            beta = Math.min(beta, an_eval);
            if (beta <= alpha) break;
        }
        return minEval;
    }
};

const evaluateBoard = (board) => {
    let aiScore = 0;
    let playerScore = 0;
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (board[r][c] === 'W') aiScore += evaluateCell(board, r, c, 'W');
            else if (board[r][c] === 'B') playerScore += evaluateCell(board, r, c, 'B');
        }
    }
    return aiScore - playerScore * 1.2; // Prioritize blocking
};

const generateCandidates = (board) => {
    const candidates = new Set();
    if (!board.flat().some(c => c)) return [{ row: 7, col: 7 }];

    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (board[r][c] !== null) continue;
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (i === 0 && j === 0) continue;
                    const nr = r + i, nc = c + j;
                    if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE && board[nr][nc]) {
                        candidates.add(`${r},${c}`);
                        break;
                    }
                }
                if (candidates.has(`${r},${c}`)) break;
            }
        }
    }
    return Array.from(candidates, s => ({ row: parseInt(s.split(',')[0]), col: parseInt(s.split(',')[1]) }));
};

const GomokuWithLogic = withGameLogic(Gomoku, {
    gameName: 'gomoku',
    displayName: '五子棋',
    difficulties: ['easy', 'medium', 'hard'],
    hasGameModeSelection: true,
});

export default GomokuWithLogic;
