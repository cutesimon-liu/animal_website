import React, { useState, useEffect, useCallback } from 'react';
import withGameLogic from '../components/HOC/withGameLogic';
import './DarkChess.css';

const ROWS = 4;
const COLS = 8;

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

const INITIAL_PIECES = [
  'k', 'a', 'a', 'e', 'e', 'r', 'r', 'h', 'h', 'c', 'c', 's', 's', 's', 's', 's',
  'K', 'A', 'A', 'E', 'E', 'R', 'R', 'H', 'H', 'C', 'C', 'S', 'S', 'S', 'S', 'S'
];

const DarkChess = ({ gameMode, difficulty, resetSignal }) => {
  const [board, setBoard] = useState([]);
  const [revealed, setRevealed] = useState(new Set());
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [playerColor, setPlayerColor] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [showRules, setShowRules] = useState(false);
  const [redCaptured, setRedCaptured] = useState([]);
  const [blackCaptured, setBlackCaptured] = useState([]);
  const [isComputerTurn, setIsComputerTurn] = useState(false);
  const [aiColor, setAiColor] = useState(null);
  const [aiDifficulty] = useState(difficulty || 'easy');

  const [isContinuousCapture, setIsContinuousCapture] = useState(false);
  const [aiPendingMove, setAiPendingMove] = useState(null);

  // Determine AI color after first move
  useEffect(() => {
    if (playerColor && !aiColor && gameMode === 'pvc') {
      // AI plays opposite color of the first player
      setAiColor(playerColor === 'red' ? 'black' : 'red');
    }
  }, [playerColor, aiColor, gameMode]);

  // DEBUG LOGGING
  const [logs, setLogs] = useState([]);
  const addLog = (msg) => {
    console.log(msg);
    setLogs(prev => [...prev, `${new Date().toISOString().split('T')[1]} - ${msg}`].slice(-20));
  };

  // Helper to check if attacker CAN capture defender based on Rank and Color
  const canCapture = (attacker, defender) => {
    if (!attacker || !defender) return false;
    if (attacker.color === defender.color) return false;

    // Cannon special case: Rank doesn't matter for capture power,
    // but the "screen" logic is handled in isValidMove.
    // Here we just say Cannon CAN capture any enemy if the move logic allows it.
    if (attacker.name === '炮' || attacker.name === '包') {
      return true;
    }

    // Soldier vs General special case
    if (attacker.name === '兵' || attacker.name === '卒') {
      return defender.name === '帥' || defender.name === '將' || defender.rank === 1;
    }
    // General vs Soldier special case (General CANNOT eat Soldier)
    if (attacker.name === '帥' || attacker.name === '將') {
      return defender.rank !== 1;
    }

    // Standard Rank Check
    return attacker.rank >= defender.rank;
  };

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

    // --- NON-CANNON MOVES ---
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
        return false;
      }

      // If isUnrevealedCapture is true, it means we just flipped the piece
      // and are now checking if the capture is valid against the revealed piece.
      // In this specific scenario, we use canCapture directly.
      if (isUnrevealedCapture) {
        return canCapture(piece, targetPiece);
      }

      // For regular captures (target already revealed)
      return canCapture(piece, targetPiece);
    }

    // --- CANNON MOVES ---
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
        // Cannon move without capture: Must have NO pieces in between
        return piecesInBetween.length === 0;
      } else {
        // Cannon Capture Logic

        // Blind check on unrevealed target
        if (isBlindCheck && !isTargetRevealed) {
          // For a blind attack, we need exactly one screen.
          return piecesInBetween.length === 1;
        }

        // If not blind check (or target is revealed)
        if (!isBlindCheck && !isTargetRevealed) {
          return false;
        }

        // Must have exactly one screen
        if (piecesInBetween.length !== 1) {
          return false;
        }

        // Check capture rules (color, etc)
        return canCapture(piece, targetPiece);
      }
    }

    return false;
  };

  const calculatePossibleMoves = (piece, row, col, currentBoard) => {
    const moves = [];
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        // For possible moves calculation, we still use the "blind" check
        // because we want to show where the player CAN click.
        // The actual outcome (eat or just reveal) happens in handleSquareClick.
        if (isValidMove({ piece, row, col }, { row: i, col: j }, currentBoard, true)) {
          moves.push({ row: i, col: j });
        }
      }
    }
    return moves;
  };

  const calculateCaptureMoves = (piece, row, col, currentBoard, includeBlind = false) => {
    const moves = calculatePossibleMoves(piece, row, col, currentBoard);
    return moves.filter(move => {
      const targetPiece = currentBoard[move.row][move.col];
      // Only count as a capture move if there is a piece AND we can actually capture it
      // If includeBlind is true, we allow attacking unrevealed pieces (blindCheck=true)
      return targetPiece !== null && isValidMove({ piece, row, col }, move, currentBoard, includeBlind);
    });
  };

  const findBestMoveForDarkChess = (currentBoard, revealedSet, color, difficulty, isContinuousCapture, selectedPiece) => {
    let bestMove = null;
    let maxScore = -Infinity;

    // Helper to score captures
    const evaluateCapture = (source, targetPos, targetPiece, isRevealed) => {
      let score = 0;
      // Base Score
      if (!isRevealed) {
        score = 1.5; // Blind attack
      } else {
        score = targetPiece.rank;
      }

      // Risk Assessment
      // Simulate the move
      const movingPiece = currentBoard[source.row][source.col];

      // We need to check if the TARGET square will be safe AFTER the move.
      // This means:
      // 1. The target piece is gone (eaten).
      // 2. The moving piece is at the target square.
      // 3. The source square is empty.

      let isSafe = true;

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const enemy = currentBoard[r][c];
          const enemyPos = `${r}-${c}`;

          // If enemy exists, is revealed, and is NOT the one being eaten (targetPos)
          if (enemy && enemy.color !== color && revealedSet.has(enemyPos) && !(r === targetPos.row && c === targetPos.col)) {

            // Check if this enemy can eat 'movingPiece' at 'targetPos'
            // We need to check adjacency or cannon path.

            // 1. Check Rank
            if (!canCapture(enemy, movingPiece)) continue;

            // 2. Check Move Validity (Adjacency or Cannon)
            const isAdjacent = Math.abs(r - targetPos.row) + Math.abs(c - targetPos.col) === 1;

            if (enemy.name === '炮' || enemy.name === '包') {
              // Cannon Logic: Needs exactly one screen.
              // The screen must be on the path between (r,c) and (targetPos.row, targetPos.col)
              // considering the SIMULATED board (source is empty, target has movingPiece).

              if (r !== targetPos.row && c !== targetPos.col) continue; // Not in same line

              let screens = 0;
              if (r === targetPos.row) {
                const start = Math.min(c, targetPos.col) + 1;
                const end = Math.max(c, targetPos.col);
                for (let k = start; k < end; k++) {
                  // Check if there is a piece at [r][k]
                  // If [r][k] is the source square, it's empty now.
                  // If [r][k] is the target square, it's the moving piece (but we are checking path TO target, so target is endpoint).
                  // If [r][k] is any other square, use currentBoard.
                  if (r === source.row && k === source.col) continue; // Source is empty
                  if (currentBoard[r][k]) screens++;
                }
              } else {
                const start = Math.min(r, targetPos.row) + 1;
                const end = Math.max(r, targetPos.row);
                for (let k = start; k < end; k++) {
                  if (k === source.row && c === source.col) continue; // Source is empty
                  if (currentBoard[k][c]) screens++;
                }
              }

              if (screens === 1) {
                isSafe = false;
                break;
              }

            } else {
              // Non-Cannon Logic: Must be adjacent
              if (isAdjacent) {
                isSafe = false;
                break;
              }
            }
          }
        }
        if (!isSafe) break;
      }

      // Adjust Score based on Safety
      if (isSafe) {
        score += 0.1; // Preference for safe moves
      } else {
        // Bad Trade: Score = Gain - Cost
        // Cost = Value of my piece (movingPiece.rank)
        score -= movingPiece.rank;
      }

      // Tie-breaker: Prefer using lower-ranked pieces to capture (risk management)
      if (movingPiece) {
        score -= (movingPiece.rank * 0.01);
      }

      return score;
    };

    // If in continuous capture mode, we MUST capture with the selected piece
    if (isContinuousCapture && selectedPiece) {
      const { piece, row, col } = selectedPiece;
      // We allow blind captures in AI logic too (includeBlind = true)
      const captures = calculateCaptureMoves(piece, row, col, currentBoard, true);

      if (captures.length > 0) {
        // Find the best capture among available ones
        for (const capture of captures) {
          const targetPiece = currentBoard[capture.row][capture.col];
          const targetPosKey = `${capture.row}-${capture.col}`;
          const isRevealed = revealedSet.has(targetPosKey);
          const score = evaluateCapture({ row, col }, { row: capture.row, col: capture.col }, targetPiece, isRevealed);

          if (score > maxScore) {
            maxScore = score;
            bestMove = {
              type: 'capture',
              source: { row, col },
              target: { row: capture.row, col: capture.col }
            };
          }
        }
        return bestMove;
      }
      return null;
    }

    // Simple AI: prioritize captures, then flip unrevealed pieces, then random move
    const ownPieces = [];
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        const piece = currentBoard[i][j];
        const posKey = `${i}-${j}`;
        // AI can only move/attack with REVEALED pieces
        if (piece && piece.color === color && revealedSet.has(posKey)) {
          ownPieces.push({ piece, row: i, col: j });
        }
      }
    }

    // 1. Try to find the BEST capture
    for (const { piece, row, col } of ownPieces) {
      const captures = calculateCaptureMoves(piece, row, col, currentBoard, true);
      for (const capture of captures) {
        const targetPiece = currentBoard[capture.row][capture.col];
        const targetPosKey = `${capture.row}-${capture.col}`;
        const isRevealed = revealedSet.has(targetPosKey);
        const score = evaluateCapture({ row, col }, { row: capture.row, col: capture.col }, targetPiece, isRevealed);

        if (score > maxScore) {
          maxScore = score;
          bestMove = {
            type: 'capture',
            source: { row, col },
            target: { row: capture.row, col: capture.col }
          };
        }
      }
    }

    if (bestMove) {
      return bestMove;
    }
    // Flip unrevealed pieces adjacent to own pieces (Strategic Flip)
    // Or just find ANY unrevealed piece to flip if we have no good moves?
    // Standard AI usually just flips random unrevealed if no captures.

    // Let's check if we can flip something adjacent to us (safe flip?)
    // Actually, let's just look for ANY unrevealed piece to flip.
    const unrevealedMoves = [];
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        const posKey = `${i}-${j}`;
        if (!revealedSet.has(posKey)) {
          unrevealedMoves.push({ row: i, col: j });
        }
      }
    }

    // Prioritize flipping if we have no captures?
    // Or prioritize moving to safety?
    // Let's stick to the requested logic: Capture > Flip > Random Move

    if (unrevealedMoves.length > 0 && Math.random() > 0.3) { // 70% chance to flip if available
      const idx = Math.floor(Math.random() * unrevealedMoves.length);
      return {
        type: 'flip',
        target: unrevealedMoves[idx]
      };
    }

    // Fallback: random possible move (non-capture)
    const allMoves = [];
    for (const { piece, row, col } of ownPieces) {
      const moves = calculatePossibleMoves(piece, row, col, currentBoard);
      for (const m of moves) {
        // Ensure it's not a capture (already handled) and not invalid
        // calculatePossibleMoves returns valid moves (empty or capture)
        // We just want empty moves here
        if (!currentBoard[m.row][m.col]) {
          allMoves.push({
            source: { row, col },
            target: { row: m.row, col: m.col }
          });
        }
      }
    }

    if (allMoves.length > 0) {
      const idx = Math.floor(Math.random() * allMoves.length);
      return {
        type: 'move',
        ...allMoves[idx]
      };
    }

    // If no moves and no captures, but unrevealed exist, flip one
    if (unrevealedMoves.length > 0) {
      const idx = Math.floor(Math.random() * unrevealedMoves.length);
      return {
        type: 'flip',
        target: unrevealedMoves[idx]
      };
    }

    return null;
  };

  const setupBoard = useCallback(() => {
    const shuffledPieces = INITIAL_PIECES.sort(() => Math.random() - 0.5);
    const newBoard = [];
    for (let i = 0; i < ROWS; i++) {
      const row = [];
      for (let j = 0; j < COLS; j++) {
        const pieceKey = shuffledPieces[i * COLS + j];
        row.push({
          key: pieceKey,
          ...PIECES[pieceKey]
        });
      }
      newBoard.push(row);
    }
    setBoard(newBoard);
    setRevealed(new Set());
    setSelectedPiece(null);
    setPlayerColor(null);
    setCurrentPlayer(null);
    setGameOver(false);
    setWinner(null);
    setPossibleMoves([]);
    setRedCaptured([]);
    setBlackCaptured([]);
    setIsComputerTurn(false);
    setAiColor(null);
    setIsContinuousCapture(false);
  }, []);

  const endTurn = () => {
    setSelectedPiece(null);
    setPossibleMoves([]);
    setIsContinuousCapture(false);
    setCurrentPlayer(prev => prev === 'red' ? 'black' : 'red');
  };

  const checkGameOver = (currentBoard) => {
    const redPieces = [];
    const blackPieces = [];
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        const piece = currentBoard[i][j];
        if (piece) {
          if (piece.color === 'red') {
            redPieces.push(piece);
          } else {
            blackPieces.push(piece);
          }
        }
      }
    }

    if (redPieces.length === 0) {
      setGameOver(true);
      setWinner('黑方');
    } else if (blackPieces.length === 0) {
      setGameOver(true);
      setWinner('紅方');
    }
  };

  const handleSquareClick = useCallback((row, col) => {
    if (gameOver) return;

    // Prevent player from moving opponent's pieces (unless it's the very first move)
    if (selectedPiece && selectedPiece.piece.color !== currentPlayer) {
      return;
    }

    const targetPiece = board[row][col];
    const targetPos = `${row}-${col}`;
    const isTargetRevealed = revealed.has(targetPos);

    // --- Action: A piece is already selected ---
    if (selectedPiece) {
      // STRICT CONTINUOUS CAPTURE CHECK
      if (isContinuousCapture) {
        // If in continuous capture mode, the ONLY valid action is to capture a valid target.
        // Clicking anything else (empty space, self, invalid target) ends the turn.

        const isCaptureMove = possibleMoves.some(m => m.row === row && m.col === col);

        if (!isCaptureMove) {
          endTurn();
          return;
        }

        // If it IS a capture move, proceed to execute it below...
      }

      // Case 1: The target is a valid move (capture or empty square)
      // We pass 'true' to allow attacking unrevealed pieces blindly
      if (isValidMove(selectedPiece, { row, col }, board, true)) {

        // Special Logic for Unrevealed Target:
        // 1. Reveal it first.
        // 2. Check if the move is valid against the REVEALED piece.
        if (targetPiece && !isTargetRevealed) {
          const newRevealed = new Set(revealed);
          newRevealed.add(targetPos);

          // Check validity against the NOW REVEALED piece
          // We pass 'false' (or omit) for isBlindCheck to enforce strict rules
          // But we pass 'true' for isUnrevealedCapture to allow eating unrevealed pieces
          const canCapture = isValidMove(selectedPiece, { row, col }, board, false, targetPiece, true);

          if (canCapture) {
            // Capture Logic
            const newBoard = board.map(r => r.slice());
            newBoard[row][col] = selectedPiece.piece;
            newBoard[selectedPiece.row][selectedPiece.col] = null;

            // Add to captured list
            if (targetPiece.color === 'red') {
              setRedCaptured(prev => [...prev, targetPiece]);
            } else {
              setBlackCaptured(prev => [...prev, targetPiece]);
            }

            setBoard(newBoard);
            setRevealed(newRevealed); // Update revealed state
            checkGameOver(newBoard);

            // Check for continuous capture after eating unrevealed piece
            // We allow blind captures in the chain (includeBlind = true)
            const furtherCaptures = calculateCaptureMoves(selectedPiece.piece, row, col, newBoard, true);
            if (furtherCaptures.length > 0) {
              setSelectedPiece({ piece: selectedPiece.piece, row, col });
              setPossibleMoves(furtherCaptures);
              setIsContinuousCapture(true); // Enable continuous capture mode
              // Do NOT switch player - allow continuous capture
            } else {
              endTurn();
            }
          } else {
            // Failed Capture Logic (Bounce off)
            // Target is revealed (already done above in newRevealed), Attacker stays.
            setRevealed(newRevealed); // Update revealed state
            endTurn();
          }
          return;
        }

        // Normal Move/Capture (Target is empty or already revealed)
        const wasCapture = targetPiece !== null;
        const newBoard = board.map(r => r.slice());
        newBoard[row][col] = selectedPiece.piece;
        newBoard[selectedPiece.row][selectedPiece.col] = null;

        if (wasCapture) {
          if (targetPiece.color === 'red') {
            setRedCaptured(prev => [...prev, targetPiece]);
          } else {
            setBlackCaptured(prev => [...prev, targetPiece]);
          }
        }

        setBoard(newBoard);
        checkGameOver(newBoard);

        // If it was a capture, check for consecutive captures
        if (wasCapture) {
          // We allow blind captures in the chain (includeBlind = true)
          const furtherCaptures = calculateCaptureMoves(selectedPiece.piece, row, col, newBoard, true);
          if (furtherCaptures.length > 0) {
            setSelectedPiece({ piece: selectedPiece.piece, row, col });
            setPossibleMoves(furtherCaptures);
            setIsContinuousCapture(true); // Enable continuous capture mode
            // Do NOT switch player
          } else {
            endTurn();
          }
        } else { // If it was a simple move to an empty square
          endTurn();
        }
      }
      // Case 2: The target is NOT a valid move. Maybe user wants to select another piece.
      else {
        // If we are in continuous capture, we already handled this at the top (endTurn).
        // So this block is only for the FIRST move.

        if (targetPiece && isTargetRevealed && targetPiece.color === currentPlayer) {
          const newSelectedPiece = { piece: targetPiece, row, col };
          setSelectedPiece(newSelectedPiece);
          setPossibleMoves(calculatePossibleMoves(targetPiece, row, col, board));
        } else {
          // Invalid move, deselect
          setSelectedPiece(null);
          setPossibleMoves([]);
        }
      }
      return;
    }

    // --- Action: No piece is selected ---
    if (!selectedPiece) {
      // Case 3: Click on an unrevealed piece to flip it
      if (!isTargetRevealed) {
        const newRevealed = new Set(revealed);
        newRevealed.add(targetPos);
        setRevealed(newRevealed);

        if (!playerColor) { // First move of the game
          const firstPlayerColor = targetPiece.color;
          setPlayerColor(firstPlayerColor);
          // Turn passes to the other player immediately
          setCurrentPlayer(firstPlayerColor === 'red' ? 'black' : 'red');
        } else {
          setCurrentPlayer(prev => prev === 'red' ? 'black' : 'red');
        }
      }
      // Case 4: Click on a revealed piece of the current player to select it
      else if (targetPiece && isTargetRevealed && targetPiece.color === currentPlayer) {
        const newSelectedPiece = { piece: targetPiece, row, col };
        setSelectedPiece(newSelectedPiece);
        setPossibleMoves(calculatePossibleMoves(targetPiece, row, col, board));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board, revealed, selectedPiece, currentPlayer, isContinuousCapture, possibleMoves, gameOver, playerColor]);

  const handleUserClick = (row, col) => {
    if (gameOver) return;

    // Block user input if it's AI's turn in PvAI mode
    if (gameMode === 'pvc') {
      if (isComputerTurn) return;
      if (playerColor && currentPlayer !== playerColor) return;
    }

    handleSquareClick(row, col);
  };

  const getStatus = () => {
    if (gameOver) {
      return `遊戲結束! 贏家: ${winner}`;
    }
    if (gameMode === 'pvc') {
      if (isComputerTurn) return '電腦思考中...';
      return `輪到: ${currentPlayer === 'red' ? '紅方' : '黑方'} (玩家)`;
    }
    return `輪到: ${currentPlayer === 'red' ? '紅方' : '黑方'}`;
  };

  // Determine AI color after first move
  useEffect(() => {
    if (playerColor && !aiColor && gameMode === 'pvc') {
      // AI plays opposite color of the first player
      setAiColor(playerColor === 'red' ? 'black' : 'red');
    }
  }, [playerColor, aiColor, gameMode]);

  useEffect(() => {
    setupBoard();
  }, [resetSignal, setupBoard]);

  // AI turn handling - Trigger "Thinking" state
  useEffect(() => {
    if (gameMode !== 'pvc' || !aiColor || gameOver) return;
    if (currentPlayer === aiColor && !isComputerTurn) {
      addLog(`Trigger Thinking: CP=${currentPlayer}, AI=${aiColor}`);
      setIsComputerTurn(true);
    }
  }, [currentPlayer, aiColor, gameMode, gameOver, isComputerTurn]);

  // AI turn handling - Calculate the move
  useEffect(() => {
    if (!isComputerTurn || aiPendingMove) return;

    addLog("AI Calculating...");

    const timer = setTimeout(() => {
      try {
        const move = findBestMoveForDarkChess(board, revealed, aiColor, aiDifficulty, isContinuousCapture, selectedPiece);
        if (move) {
          addLog(`AI Found Move: ${move.type} to ${move.target.row}-${move.target.col}`);
          setAiPendingMove(move);
        } else {
          addLog("AI No Moves");
          // If no moves found, end turn (especially important if stuck in continuous capture)
          if (isContinuousCapture) {
            endTurn();
          }
          setIsComputerTurn(false);
        }
      } catch (error) {
        console.error("AI Error:", error);
        setIsComputerTurn(false);
      }
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComputerTurn, aiPendingMove, board, revealed, aiColor, aiDifficulty, isContinuousCapture, selectedPiece]);

  // Execute AI move when aiPendingMove is set
  useEffect(() => {
    if (!aiPendingMove || !isComputerTurn) return;

    const { type, source, target } = aiPendingMove;

    if (type === 'flip') {
      addLog(`AI Executing Flip: ${target.row}-${target.col}`);
      const timer = setTimeout(() => {
        // Explicitly handle flip to ensure state updates are correct and turn is passed
        const targetPiece = board[target.row][target.col];
        const targetPos = `${target.row}-${target.col}`;

        setRevealed(prev => {
          const newRevealed = new Set(prev);
          newRevealed.add(targetPos);
          return newRevealed;
        });

        if (!playerColor) {
          const firstPlayerColor = targetPiece.color;
          setPlayerColor(firstPlayerColor);
          setCurrentPlayer(firstPlayerColor === 'red' ? 'black' : 'red');
        } else {
          setCurrentPlayer(prev => prev === 'red' ? 'black' : 'red');
        }

        setSelectedPiece(null);
        setPossibleMoves([]);
        setAiPendingMove(null);
        setIsComputerTurn(false);
        setIsContinuousCapture(false); // Ensure continuous capture is cleared on flip
        addLog("AI Flip Done: Turn Ended");
      }, 500);
      return () => clearTimeout(timer);
    } else {
      // Direct Move/Capture Execution
      addLog(`AI Executing Move/Capture: ${source.row}-${source.col} to ${target.row}-${target.col}`);

      const timer = setTimeout(() => {
        const newBoard = board.map(r => r.slice());
        const movingPiece = newBoard[source.row][source.col];
        const targetPiece = newBoard[target.row][target.col];
        const targetPos = `${target.row}-${target.col}`;
        const isTargetRevealed = revealed.has(targetPos);

        // BLIND ATTACK LOGIC
        if (targetPiece && !isTargetRevealed) {
          // 1. Reveal the piece
          setRevealed(prev => {
            const newRevealed = new Set(prev);
            newRevealed.add(targetPos);
            return newRevealed;
          });

          // 2. Check if valid capture
          // We use isValidMove with isBlindCheck=false, explicitTargetPiece=targetPiece, isUnrevealedCapture=true
          let canEat = isValidMove(
            { piece: movingPiece, row: source.row, col: source.col },
            { row: target.row, col: target.col },
            board,
            false,
            targetPiece,
            true
          );

          // EXPLICIT SAFETY CHECKS (Redundant but necessary for robustness)
          // Check 1: Friendly Fire
          if (movingPiece.color === targetPiece.color) {
            canEat = false;
            addLog(`AI Safety Check: Cannot eat same color (${movingPiece.color})`);
          }
          // Check 2: General vs Soldier
          if ((movingPiece.name === '帥' || movingPiece.name === '將') && targetPiece.rank === 1) {
            canEat = false;
            addLog(`AI Safety Check: General cannot eat Soldier`);
          }

          if (canEat) {
            addLog(`AI Blind Attack SUCCESS: ${movingPiece.name} eats ${targetPiece.name}`);
            // Proceed to execute capture below (fall through to shared logic)
            // We need to ensure newBoard is updated correctly below
          } else {
            addLog(`AI Blind Attack FAILED: ${movingPiece.name} cannot eat ${targetPiece.name}`);
            // Bounce back: Reveal only. Turn Ends.
            // newBoard is NOT modified (pieces stay).
            // revealed is already updated above.
            setSelectedPiece(null);
            setPossibleMoves([]);
            setAiPendingMove(null);
            setIsComputerTurn(false);
            setIsContinuousCapture(false);
            setCurrentPlayer(prev => prev === 'red' ? 'black' : 'red');
            addLog("AI Turn Ended (Invalid Blind Attack)");
            return; // EXIT HERE
          }
        }

        // EXECUTE MOVE / CAPTURE (Shared Logic)
        // If we are here, it's either a normal move, a normal capture, or a SUCCESSFUL blind capture

        newBoard[target.row][target.col] = movingPiece;
        newBoard[source.row][source.col] = null;

        // Handle Capture
        if (targetPiece) {
          if (targetPiece.color === 'red') {
            setRedCaptured(prev => [...prev, targetPiece]);
          } else {
            setBlackCaptured(prev => [...prev, targetPiece]);
          }
        }

        setBoard(newBoard);
        checkGameOver(newBoard);

        // Check for Continuous Capture
        let canContinue = false;
        if (targetPiece) { // Only check if we just captured
          const furtherCaptures = calculateCaptureMoves(movingPiece, target.row, target.col, newBoard, true);
          if (furtherCaptures.length > 0) {
            canContinue = true;
            // Update state for continuous capture
            setSelectedPiece({ piece: movingPiece, row: target.row, col: target.col });
            setPossibleMoves(furtherCaptures); // Optional: mainly for UI visualization if we wanted to show it
            setIsContinuousCapture(true);
            // Do NOT switch player, Do NOT clear isComputerTurn (AI keeps playing)
            setAiPendingMove(null); // Clear pending move so AI loop can calculate next move
            addLog("AI Continuous Capture: Continuing Turn");
          }
        }

        if (!canContinue) {
          // End Turn
          setSelectedPiece(null);
          setPossibleMoves([]);
          setAiPendingMove(null);
          setIsComputerTurn(false);
          setIsContinuousCapture(false);
          setCurrentPlayer(prev => prev === 'red' ? 'black' : 'red');
          addLog("AI Move Done: Turn Ended");
        }

      }, 500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiPendingMove, isComputerTurn, isContinuousCapture, board, playerColor, revealed]);

  return (
    <div className="dark-chess-container">
      <div id="debug-logs" style={{ display: 'none' }}>{JSON.stringify(logs)}</div>
      <div className="status-bar">{getStatus()}</div>

      <div className="game-area">
        <div className="captured-area left">
          <h4>紅方吃子</h4>
          <div className="captured-pieces">
            {redCaptured.map((piece, index) => (
              <div key={index} className={`captured-piece ${piece.color}`}>{piece.name}</div>
            ))}
          </div>
        </div>

        <div className="dark-chess-board-container">
          <div className="board">
            {board.map((row, rowIndex) =>
              row.map((piece, colIndex) => {
                const isRevealed = revealed.has(`${rowIndex}-${colIndex}`);
                const isSelected = selectedPiece && selectedPiece.row === rowIndex && selectedPiece.col === colIndex;
                const isPossibleMove = possibleMoves.some(move => move.row === rowIndex && move.col === colIndex);

                return (
                  <div key={`${rowIndex}-${colIndex}`} className="col" onClick={() => handleUserClick(rowIndex, colIndex)}>
                    {piece && (
                      <div
                        className={`square ${isRevealed ? piece.color : 'face-down'} ${isSelected ? 'selected' : ''}`}
                      >
                        {isRevealed ? piece.name : ''}
                      </div>
                    )}
                    {isPossibleMove && <div className="possible-move"></div>}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="captured-area right">
          <h4>黑方吃子</h4>
          <div className="captured-pieces">
            {blackCaptured.map((piece, index) => (
              <div key={index} className={`captured-piece ${piece.color}`}>{piece.name}</div>
            ))}
          </div>
        </div>
      </div>
      <button className={`rules-toggle-button ${showRules ? 'shifted' : ''}`} onClick={() => setShowRules(!showRules)}>
        {showRules ? '隱藏規則' : '顯示規則'}
      </button>

      <div className={`rules-overlay ${showRules ? 'show' : ''}`}>
        <div className="rules-content">
          <h3>暗棋規則</h3>
          <h4>遊戲目標</h4>
          <p>吃掉對手所有棋子。</p>
          <h4>遊戲玩法</h4>
          <ul>
            <li>開始時，所有棋子背面朝上。</li>
            <li>第一位玩家翻開一枚棋子，該棋子的顏色即為該玩家的顏色。</li>
            <li>玩家輪流進行，可以選擇翻開一枚未翻開的棋子，或移動自己已翻開的棋子。</li>
            <li><b>移動:</b> 棋子可以移動到相鄰的空格。</li>
            <li><b>吃子:</b> 棋子可以移動到相鄰的敵方棋子上（無論是否翻開），並將其吃掉。如果吃子後，在新的位置上仍有可吃的棋子，可以連續吃子。</li>
          </ul>
          <h4>吃子規則</h4>
          <ul>
            <li><b>帥/將:</b> 可以吃掉除了兵/卒以外的任何棋子。</li>
            <li><b>仕/士, 相/象, 俥/車, 傌/馬:</b> 可以吃掉階級不大於自己的棋子。</li>
            <li><b>兵/卒:</b> 可以吃掉對方的帥/將或兵/卒。</li>
            <li><b>炮/包:</b> 必須跳過一個棋子（無論敵我）才能吃掉直線上的下一個棋子。</li>
          </ul>
          <h4>階級</h4>
          <p>帥/將 &gt; 仕/士 &gt; 相/象 &gt; 俥/車 &gt; 傌/馬 &gt; 兵/卒</p>
          <button className="close-rules-button" onClick={() => setShowRules(false)}>關閉</button>
        </div>
      </div>
    </div>
  );
};

const DarkChessWithLogic = withGameLogic(DarkChess, {
  gameName: 'dark-chess',
  displayName: '暗棋',
  hasGameModeSelection: true, // Enable mode selection for PvP and PvAI
  difficulties: ['easy', 'medium', 'hard'],
});

export default DarkChessWithLogic;