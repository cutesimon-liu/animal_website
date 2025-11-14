import React, { useState, useEffect } from 'react';
import { Button, Form, Row, Col, Card } from 'react-bootstrap';
import withGameLogic from '../components/HOC/withGameLogic';
import './Game1A2B.css';

// NumberKeypad Component
const NumberKeypad = ({ onKeyPress, onClear, onDelete }) => {
    const numbers = [1, 2, 3, 'C', 4, 5, 6, '←', 7, 8, 9, 0];
    return (
        <div className="number-keypad">
            <div className="keypad-grid">
                {numbers.map((item, index) => (
                    <Button 
                        key={index} 
                        onClick={() => {
                            if (typeof item === 'number' || item === 0) onKeyPress(item.toString());
                            else if (item === 'C') onClear();
                            else if (item === '←') onDelete();
                        }}
                        className={`keypad-button ${typeof item !== 'number' ? 'control-button' : ''}`}>
                        {item}
                    </Button>
                ))}
            </div>
        </div>
    );
};

const generateSecretNumber = () => {
    let digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let secret = [];
    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        secret.push(digits[randomIndex]);
        digits.splice(randomIndex, 1);
    }
    return secret.join('');
};

const Game1A2B = ({ resetSignal }) => {
    const [secretNumber, setSecretNumber] = useState('');
    const [guess, setGuess] = useState('');
    const [history, setHistory] = useState([]);
    const [message, setMessage] = useState('');
    const [gameOver, setGameOver] = useState(false);
    const [showRules, setShowRules] = useState(false);

    const startNewGame = () => {
        setSecretNumber(generateSecretNumber());
        setGuess('');
        setHistory([]);
        setMessage('遊戲開始！請猜一個四位數，數字不重複。');
        setGameOver(false);
    };

    useEffect(() => {
        startNewGame();
    }, [resetSignal]);

    const handleGuessChange = (e) => {
        const value = e.target.value;
        // Allow only digits and limit to 4 characters
        if (/^\d*$/.test(value) && value.length <= 4) {
            setGuess(value);
        }
    };

    const handleKeyPress = (key) => {
        if (gameOver) return;
        if (guess.length < 4 && !guess.includes(key)) {
            setGuess(prevGuess => prevGuess + key);
        } else if (guess.includes(key)) {
            setMessage('數字不能重複！');
        }
    };

    const handleClear = () => {
        setGuess('');
        setMessage('');
    };

    const handleDelete = () => {
        setGuess(prevGuess => prevGuess.slice(0, -1));
        setMessage('');
    };

    const handleSubmitGuess = (e) => {
        e.preventDefault();
        if (guess.length !== 4 || new Set(guess.split('')).size !== 4) {
            setMessage('請輸入四位數，且數字不重複！');
            return;
        }

        let a = 0;
        let b = 0;
        const secretArr = secretNumber.split('');
        const guessArr = guess.split('');

        for (let i = 0; i < 4; i++) {
            if (secretArr[i] === guessArr[i]) {
                a++;
            } else if (secretArr.includes(guessArr[i])) {
                b++;
            }
        }

        const result = `${a}A${b}B`;
        setHistory([...history, { guess, result }]);

        if (a === 4) {
            setMessage(`恭喜你！你猜對了！秘密數字是 ${secretNumber}`);
            setGameOver(true);
        } else {
            setMessage(`你的猜測：${guess}，結果：${result}`);
        }
        setGuess('');
    };

    return (
        <div className="game-elements-container">
            <Card className="game-card">
                <Card.Body>
                    <p className="game-message">{message}</p>
                    {!gameOver ? (
                        <Form onSubmit={handleSubmitGuess}>
                            <Form.Group as={Row} className="mb-3 justify-content-center">
                                <Col xs={6} md={4}>
                                    <Form.Control
                                        type="text"
                                        maxLength="4"
                                        value={guess}
                                        onChange={handleGuessChange}
                                        placeholder="輸入你的猜測"
                                        className="guess-input"
                                        autoFocus
                                    />
                                </Col>
                            </Form.Group>
                            <Button variant="primary" type="submit" className="submit-button">
                                猜！
                            </Button>
                        </Form>
                    ) : (
                        <Button variant="success" onClick={startNewGame} className="new-game-button">
                            再玩一次
                        </Button>
                    )}

                    <div className="history-section mt-4">
                        <h3>猜測歷史</h3>
                        {history.length === 0 ? (
                            <p>還沒有猜測記錄。</p>
                        ) : (
                            <ul className="list-unstyled">
                                {history.map((entry, index) => (
                                    <li key={index} className="history-item">
                                        <span className="history-guess">{entry.guess}</span> - <span className="history-result">{entry.result}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </Card.Body>
            </Card>
            <NumberKeypad onKeyPress={handleKeyPress} onClear={handleClear} onDelete={handleDelete} />
            <button className={`rules-toggle-button ${showRules ? 'shifted' : ''}`} onClick={() => setShowRules(!showRules)}>
                {showRules ? '隱藏規則' : '顯示規則'}
            </button>

            <div className={`rules-overlay ${showRules ? 'show' : ''}`}>
                <div className="rules-content">
                    <h3>1A2B 規則</h3>
                    <h4>遊戲目標</h4>
                    <p>猜出一個由電腦隨機產生的四位不重複數字。</p>
                    <h4>遊戲玩法</h4>
                    <p>在輸入框中輸入你猜測的四位數字，然後點擊「猜！」按鈕。</p>
                    <p>電腦會根據你的猜測給出提示，格式為「xA yB」，其中：</p>
                    <ul>
                        <li><strong>A (Bull):</strong> 表示有數字不僅猜對了，而且位置也正確。</li>
                        <li><strong>B (Cow):</strong> 表示有數字猜對了，但位置不正確。</li>
                    </ul>
                    <h4>範例</h4>
                    <p>假設秘密數字是 <strong>1234</strong>。</p>
                    <p>如果你猜 <strong>1456</strong>，結果會是 <strong>1A 1B</strong>。</p>
                    <ul>
                        <li>1A: 數字「1」猜對了，位置也正確。</li>
                        <li>1B: 數字「4」猜對了，但位置不正確。</li>
                    </ul>
                    <p>繼續根據提示猜測，直到結果為 <strong>4A 0B</strong>，即為勝利。</p>
                    <button className="close-rules-button" onClick={() => setShowRules(false)}>關閉</button>
                </div>
            </div>
        </div>
    );
}

const Game1A2BWithLogic = withGameLogic(Game1A2B, {
    gameName: 'game-1a2b',
    displayName: '1A2B 猜數字遊戲',
    difficulties: null,
    hasGameModeSelection: false,
});

export default Game1A2BWithLogic;
