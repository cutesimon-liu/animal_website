
import React, { useState, useEffect } from 'react';
import withGameLogic from '../components/HOC/withGameLogic';
import './TicTacToe.css';

const TicTacToe = ({ gameMode, resetSignal }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [isComputerTurn, setIsComputerTurn] = useState(false);
  const [showRules, setShowRules] = useState(false);

  useEffect(() => {
      resetGame();
  }, [resetSignal]);

  useEffect(() => {
    const newWinner = calculateWinner(board);
    if (newWinner) {
      setWinner(newWinner);
    } else if (board.every(Boolean)) {
      setWinner('Draw');
    } else if (gameMode === 'pvc' && !isXNext) {
      setIsComputerTurn(true);
      const timer = setTimeout(() => {
        const computerMove = findBestMove(board);
        if (computerMove !== -1) {
          const newBoard = board.slice();
          newBoard[computerMove] = 'O';
          setBoard(newBoard);
          setIsXNext(true);
        }
        setIsComputerTurn(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [board, isXNext, gameMode]);

  const handleClick = (i) => {
    if (winner || board[i] || (gameMode === 'pvc' && isComputerTurn)) {
      return;
    }
    const newBoard = board.slice();
    newBoard[i] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const renderSquare = (i) => {
    const value = board[i];
    const className = `square ${value ? (value === 'X' ? 'is-x' : 'is-o') : ''}`;
    // Using a div instead of a button for more reliable pseudo-element rendering.
    return (
      <div role="button" tabIndex={0} className={className} onClick={() => handleClick(i)} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick(i)} />
    );
  };

  const getStatus = () => {
    if (winner) {
        if (winner === 'Draw') return "平手!";
        if (gameMode === 'pvc') return `勝利者: ${winner === 'X' ? '玩家' : '電腦'}`;
        return `勝利者: ${winner}`;
    }
    if (gameMode === 'pvc') {
        return isComputerTurn ? '電腦思考中...' : '輪到你了 (X)';
    } else {
        return `輪到玩家: ${isXNext ? 'X' : 'O'}`;
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setIsComputerTurn(false);
  }

  return (
    <div className="main-content-container"> {/* Added main-content-container for consistent styling */}
        <div className="status">{getStatus()}</div>
        <div className="tictactoe-board-container"> {/* Added tictactoe-board-container */}
            <div className="game-board">
              {board.map((_, i) => renderSquare(i))}
            </div>
        </div>
        <button className={`rules-toggle-button ${showRules ? 'shifted' : ''}`} onClick={() => setShowRules(!showRules)}>
            {showRules ? '隱藏規則' : '顯示規則'}
        </button>

        <div className={`rules-overlay ${showRules ? 'show' : ''}`}>
            <div className="rules-content">
                <h3>井字遊戲規則</h3>
                <h4>遊戲目標</h4>
                <p>率先在 3x3 的棋盤上，讓自己的三個符號（X 或 O）連成一線（橫、豎、斜皆可）。</p>
                <h4>遊戲玩法</h4>
                <ul>
                    <li>遊戲由兩位玩家進行，一方執 <strong>X</strong>，一方執 <strong>O</strong>。</li>
                    <li>玩家輪流在棋盤的空格中放置自己的符號。</li>
                    <li>通常由執 <strong>X</strong> 的玩家先行。</li>
                </ul>
                <h4>勝負判定</h4>
                <ul>
                    <li>最先將自己的三個符號連成一線的玩家獲勝。</li>
                    <li>如果棋盤所有九個格子都被填滿，但沒有任何一方達成連線，則遊戲為<strong>平手</strong>。</li>
                </ul>
                <button className="close-rules-button" onClick={() => setShowRules(false)}>關閉</button>
            </div>
        </div>
    </div>
  );
};

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function findBestMove(squares) {
  // Simple AI for Tic Tac Toe
  for (let i = 0; i < 9; i++) {
    if (!squares[i]) {
      const tempBoard = squares.slice();
      tempBoard[i] = 'O';
      if (calculateWinner(tempBoard) === 'O') return i;
    }
  }
  for (let i = 0; i < 9; i++) {
    if (!squares[i]) {
      const tempBoard = squares.slice();
      tempBoard[i] = 'X';
      if (calculateWinner(tempBoard) === 'X') return i;
    }
  }
  if (!squares[4]) return 4;
  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter(i => !squares[i]);
  if (availableCorners.length > 0) return availableCorners[Math.floor(Math.random() * availableCorners.length)];
  const sides = [1, 3, 5, 7];
  const availableSides = sides.filter(i => !squares[i]);
  if (availableSides.length > 0) return availableSides[Math.floor(Math.random() * availableSides.length)];
  return -1;
}

const TicTacToeWithLogic = withGameLogic(TicTacToe, {
    gameName: 'game', // Using generic 'game' class for TicTacToe styles
    displayName: '井字遊戲',
    // No difficulties for TicTacToe as the AI is simple
});

export default TicTacToeWithLogic;
