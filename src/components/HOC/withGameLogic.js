
import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const withGameLogic = (WrappedComponent, gameConfig) => {
  return (props) => {
    const [gameMode, setGameMode] = useState('pvc');
    const [difficulty, setDifficulty] = useState('medium');
    const [resetCounter, setResetCounter] = useState(0);

    const handleGameModeChange = (e) => {
      setGameMode(e.target.value);
    };

    const handleDifficultyChange = (e) => {
      setDifficulty(e.target.value);
    };
    
    const handleReset = () => {
      setResetCounter(prev => prev + 1);
    };

    const difficultyLabels = {
        easy: '簡單',
        medium: '中等',
        hard: '困難'
    };

    return (
      <div className={`${gameConfig.gameName}-game`}>
        <h1>{gameConfig.displayName}</h1>
        <div className={`${gameConfig.gameName}-controls`}>
            <Form.Group className="control-group">
                <Form.Label>遊戲模式</Form.Label>
                <Form.Select value={gameMode} onChange={handleGameModeChange}>
                    <option value="pvc">人機對戰</option>
                    <option value="pvp">雙人對戰</option>
                </Form.Select>
            </Form.Group>
            {gameMode === 'pvc' && gameConfig.difficulties && (
                <Form.Group className="control-group">
                    <Form.Label>遊戲難度</Form.Label>
                    <Form.Select value={difficulty} onChange={handleDifficultyChange}>
                        {gameConfig.difficulties.map(d => <option key={d} value={d}>{difficultyLabels[d]}</option>)}
                    </Form.Select>
                </Form.Group>
            )}
            <Button variant="primary" onClick={handleReset} className="control-group">再來一局</Button>
        </div>
        <WrappedComponent {...props} gameMode={gameMode} difficulty={difficulty} resetSignal={gameMode + difficulty + resetCounter} />
      </div>
    );
  };
};

export default withGameLogic;
