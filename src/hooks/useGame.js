
import { useState, useEffect } from 'react';

export const useGame = ({ initialBoard, initialIsNext, checkWinner, findBestMove }) => {
    const [board, setBoard] = useState(initialBoard);
    const [isPlayerNext, setIsPlayerNext] = useState(initialIsNext);
    const [winner, setWinner] = useState(null);
    const [isComputerTurn, setIsComputerTurn] = useState(false);
    const [lastMove, setLastMove] = useState(null);
    const [difficulty, setDifficulty] = useState('medium');
    const [gameMode, setGameMode] = useState('pvc');

    useEffect(() => {
        if (gameMode === 'pvc' && !isPlayerNext && !winner) {
            setIsComputerTurn(true);
            const timer = setTimeout(() => {
                const computerMove = findBestMove(board, difficulty);
                if (computerMove) {
                    makeMove(computerMove.row, computerMove.col);
                }
                setIsComputerTurn(false);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isPlayerNext, winner, board, difficulty, gameMode, findBestMove]);

    const makeMove = (row, col) => {
        const newBoard = board.map(r => r.slice());
        newBoard[row][col] = isPlayerNext ? 'B' : 'W'; // Note: This is Gomoku-specific, might need to be passed in
        setBoard(newBoard);
        setLastMove({ row, col });

        const winnerCheck = checkWinner(newBoard, row, col);
        if (winnerCheck) {
            let winnerName;
            if (gameMode === 'pvc') {
                winnerName = isPlayerNext ? 'Player' : 'Computer';
            } else {
                winnerName = isPlayerNext ? 'Player 1 (Black)' : 'Player 2 (White)';
            }
            setWinner(winnerName);
        } else {
            setIsPlayerNext(!isPlayerNext);
        }
    };

    const handleClick = (row, col) => {
        if (winner || board[row][col] || (gameMode === 'pvc' && isComputerTurn)) {
            return;
        }
        makeMove(row, col);
    };

    const resetGame = () => {
        setBoard(initialBoard);
        setIsPlayerNext(initialIsNext);
        setWinner(null);
        setIsComputerTurn(false);
        setLastMove(null);
    };

    const handleGameModeChange = (e) => {
        setGameMode(e.target.value);
        resetGame();
    }

    const handleDifficultyChange = (e) => {
        setDifficulty(e.target.value);
        resetGame();
    }

    return {
        board,
        winner,
        isComputerTurn,
        lastMove,
        difficulty,
        gameMode,
        isPlayerNext,
        getStatus: () => { /* Will be implemented in the component */ },
        handleClick,
        resetGame,
        handleGameModeChange,
        handleDifficultyChange
    };
};
