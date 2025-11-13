import React, { useState, useEffect } from 'react';
import { Container, Button, Form, Row, Col, Card } from 'react-bootstrap';
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
        <Row className="justify-content-center">
            <Col md={6}>
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
            </Col>
            <Col md={4}>
                <NumberKeypad onKeyPress={handleKeyPress} onClear={handleClear} onDelete={handleDelete} />
            </Col>
        </Row>
    );
}

const Game1A2BWithLogic = withGameLogic(Game1A2B, {
    gameName: 'game-1a2b',
    displayName: '1A2B 猜數字遊戲',
    difficulties: null,
    hasGameModeSelection: false,
});

export default Game1A2BWithLogic;
