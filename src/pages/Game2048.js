
import React, { useState, useEffect, useCallback } from 'react';
import './Game2048.css';

const Game2048 = () => {
  const size = 5;
  const [board, setBoard] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showRules, setShowRules] = useState(false);

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
          return false;
        }
        if (r < size - 1 && currentBoard[r][c] === currentBoard[r + 1][c]) {
          return false;
        }
        if (c < size - 1 && currentBoard[r][c] === currentBoard[r][c + 1]) {
          return false;
        }
      }
    }
    return true;
  }, [size]);

  const move = useCallback((direction) => {
    if (gameOver) return;

    setBoard(currentBoard => {
      let newBoard = [...currentBoard.map(row => [...row])];
      let boardChanged = false;
      let currentScore = 0;

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

      if (direction === 'ArrowUp') {
        newBoard = rotateLeft(newBoard);
        const {board: processedBoard, score: scoreToAdd, changed} = process(newBoard);
        newBoard = processedBoard;
        currentScore += scoreToAdd;
        boardChanged = changed;
        newBoard = rotateRight(newBoard);
      } else if (direction === 'ArrowDown') {
        newBoard = rotateRight(newBoard);
        const {board: processedBoard, score: scoreToAdd, changed} = process(newBoard);
        newBoard = processedBoard;
        currentScore += scoreToAdd;
        boardChanged = changed;
        newBoard = rotateLeft(newBoard);
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
        if (checkGameOver(newBoard)) {
          setGameOver(true);
        }
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
      <h1>2048</h1>
      <div className="game-header">
        <div className="score-container">Score: {score}</div>
      </div>
      <div className="game-main">
        <div className="game-2048-board">
          {board.flat().map((tile, index) => (
            <div key={index} className={`tile tile-${tile}`}>
              {tile > 0 ? tile : ''}
            </div>
          ))}
          {gameOver && <div className="game-over-overlay"><div>Game Over</div></div>}
        </div>
        <div className="controls">
          <button onClick={resetGame} className="reset-button">New Game</button>
          <button onClick={() => move('ArrowUp')} className="control-button">↑</button>
          <div className="left-right-controls">
            <button onClick={() => move('ArrowLeft')} className="control-button">←</button>
            <button onClick={() => move('ArrowDown')} className="control-button">↓</button>
            <button onClick={() => move('ArrowRight')} className="control-button">→</button>
          </div>
        </div>
      </div>
      <button className={`rules-toggle-button ${showRules ? 'shifted' : ''}`} onClick={() => setShowRules(!showRules)}>
          {showRules ? '隱藏規則' : '顯示規則'}
      </button>

      <div className={`rules-overlay ${showRules ? 'show' : ''}`}>
          <div className="rules-content">
              <h3>2048 規則</h3>
              <h4>遊戲目標</h4>
              <p>在 5x5 的棋盤上，通過合併數字方塊，最終合成出 <strong>2048</strong> 的方塊。</p>
              <h4>遊戲玩法</h4>
              <p>使用<strong>方向鍵</strong>（上、下、左、右）或遊戲介面上的<strong>按鈕</strong>來移動棋盤上的所有方塊。</p>
              <p>當兩個相同數字的方塊在移動過程中碰撞時，它們會合併成一個數字為兩者之和的新方塊。</p>
              <p>每次移動後，棋盤上會隨機出現一個數字為 2 或 4 的新方塊。</p>
              <h4>計分</h4>
              <p>合併方塊時，你會獲得新方塊的數字作為分數。遊戲會累計你的總分。</p>
              <h4>遊戲結束</h4>
              <p>當棋盤上沒有任何空格，且沒有相鄰的方塊可以合併時，遊戲結束。</p>
              <h4>策略提示</h4>
              <ul>
                  <li><strong>角落策略：</strong> 盡量將數字最大的方塊保持在一個角落，並圍繞它來排列其他方塊。</li>
                  <li><strong>保持單向：</strong> 避免在不需要時使用某個方向鍵（例如，如果你將大數字放在右下角，就盡量少用「上」方向鍵）。</li>
                  <li><strong>預判合併：</strong> 在移動前，思考一下哪些方塊會合併，以及新方塊可能出現的位置。</li>
              </ul>
              <button className="close-rules-button" onClick={() => setShowRules(false)}>關閉</button>
          </div>
      </div>
    </div>
  );
};

export default Game2048;
