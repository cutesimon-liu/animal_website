
import React, { useState, useEffect, useCallback } from 'react';
import './Game2048.css';

const Game2048 = () => {
  const size = 5;
  const [board, setBoard] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const addRandomTile = useCallback((currentBoard) => {
    let emptyTiles = [];
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (currentBoard[r][c] === 0) {
          emptyTiles.push({ r, c });
        }
      }
    }
    if (emptyTiles.length > 0) {
      let { r, c } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
      currentBoard[r][c] = Math.random() > 0.1 ? 2 : 4;
    }
    return currentBoard;
  }, []);

  const createBoard = useCallback(() => {
    let newBoard = Array(size).fill(null).map(() => Array(size).fill(0));
    addRandomTile(newBoard);
    addRandomTile(newBoard);
    return newBoard;
  }, [addRandomTile]);

  const operate = useCallback((row) => {
    const slide = (row) => {
      let arr = row.filter(val => val);
      let missing = size - arr.length;
      let zeros = Array(missing).fill(0);
      arr = arr.concat(zeros);
      return arr;
    };

    const combine = (row) => {
      let newScore = 0;
      for (let i = 0; i < size - 1; i++) {
        if (row[i] !== 0 && row[i] === row[i + 1]) {
          row[i] *= 2;
          newScore += row[i];
          row[i + 1] = 0;
        }
      }
      return { row, score: newScore };
    };

    row = slide(row);
    const { row: newRow, score: newScore } = combine(row);
    const finalRow = slide(newRow);
    return { row: finalRow, score: newScore };
  }, [size]);

  const rotateLeft = useCallback((matrix) => {
    let result = [];
    for (let i = 0; i < size; i++) {
      result.push([]);
      for (let j = 0; j < size; j++) {
        result[i][j] = matrix[j][size - 1 - i];
      }
    }
    return result;
  }, [size]);

  const rotateRight = useCallback((matrix) => {
    let result = [];
    for (let i = 0; i < size; i++) {
      result.push([]);
      for (let j = 0; j < size; j++) {
        result[i][j] = matrix[size - 1 - j][i];
      }
    }
    return result;
  }, [size]);

  const checkGameOver = useCallback((currentBoard) => {
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (currentBoard[r][c] === 0) {
          return;
        }
        if (r < size - 1 && currentBoard[r][c] === currentBoard[r + 1][c]) {
          return;
        }
        if (c < size - 1 && currentBoard[r][c] === currentBoard[r][c + 1]) {
          return;
        }
      }
    }
    setGameOver(true);
  }, [size]);

  const move = useCallback((direction) => {
    const process = (board) => {
        let tempBoard = [...board.map(row => [...row])];
        let tempScore = 0;
        let changed = false;
        for (let i = 0; i < size; i++) {
            const { row: newRow, score: newScore } = operate([...tempBoard[i]]);
            if (JSON.stringify(tempBoard[i]) !== JSON.stringify(newRow)) {
                changed = true;
            }
            tempBoard[i] = newRow;
            tempScore += newScore;
        }
        return {board: tempBoard, score: tempScore, changed };
    }

    setBoard(currentBoard => {
      if (gameOver) return currentBoard;

      let newBoard = [...currentBoard.map(row => [...row])];
      let boardChanged = false;
      let currentScore = 0;

      if (direction === 'ArrowDown') {
          newBoard = rotateLeft(newBoard);
          newBoard = rotateLeft(newBoard);
          newBoard = rotateLeft(newBoard);
          const {board: processedBoard, score: scoreToAdd, changed} = process(newBoard);
          newBoard = processedBoard;
          currentScore += scoreToAdd;
          boardChanged = changed;
          newBoard = rotateRight(newBoard);
          newBoard = rotateRight(newBoard);
          newBoard = rotateRight(newBoard);
      } else if (direction === 'ArrowUp') {
          newBoard = rotateLeft(newBoard);
          const {board: processedBoard, score: scoreToAdd, changed} = process(newBoard);
          newBoard = processedBoard;
          currentScore += scoreToAdd;
          boardChanged = changed;
          newBoard = rotateRight(newBoard);
      } else if (direction === 'ArrowLeft') {
          const {board: processedBoard, score: scoreToAdd, changed} = process(newBoard);
          newBoard = processedBoard;
          currentScore += scoreToAdd;
          boardChanged = changed;
      } else if (direction === 'ArrowRight') {
          newBoard = rotateLeft(newBoard);
          newBoard = rotateLeft(newBoard);
          const {board: processedBoard, score: scoreToAdd, changed} = process(newBoard);
          newBoard = processedBoard;
          currentScore += scoreToAdd;
          boardChanged = changed;
          newBoard = rotateRight(newBoard);
          newBoard = rotateRight(newBoard);
      }

      if (boardChanged) {
        addRandomTile(newBoard);
        setScore(prevScore => prevScore + currentScore);
        checkGameOver(newBoard);
        return newBoard;
      }
      return currentBoard;
    });
  }, [gameOver, operate, addRandomTile, checkGameOver, rotateLeft, rotateRight, size]);

  const resetGame = () => {
    setBoard(createBoard());
    setScore(0);
    setGameOver(false);
  };

  useEffect(() => {
    setBoard(createBoard());
  }, [createBoard]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        move(e.key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [move]);

  return (
    <div className="game-2048">
      <div className="title-container">
        <h1>2048</h1>
        <div className="score-container">Score: {score}</div>
      </div>
      <div className="game-header">
        <button onClick={resetGame}>New Game</button>
      </div>
      <div className="game-2048-board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((tile, colIndex) => (
              <div key={colIndex} className={`tile tile-${tile}`}>
                {tile > 0 ? tile : ''}
              </div>
            ))}
          </div>
        ))}
      </div>
      {gameOver && <div className="game-over">Game Over!</div>}
    </div>
  );
};

export default Game2048;
