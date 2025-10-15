import React, { useState, useEffect } from 'react';
import { Button, Alert } from 'react-bootstrap';

function AnimalQuiz({ animal }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  // Reset quiz when animal changes
  useEffect(() => {
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, [animal]);

  const handleAnswerClick = (option) => {
    setSelectedAnswer(option);
    if (option === animal.funFactAnswer) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const getButtonVariant = (option) => {
    if (selectedAnswer === null) {
      return 'outline-secondary';
    }
    if (option === animal.funFactAnswer) {
      return 'success';
    }
    if (option === selectedAnswer && option !== animal.funFactAnswer) {
      return 'danger';
    }
    return 'outline-secondary';
  };

  if (!animal.funFactQuestion) {
    return null;
  }

  return (
    <div className="mt-3">
      <h5 className="text-center mb-2">小知識問答</h5>
      <p className="text-center small">{animal.funFactQuestion}</p>
      <div className="d-grid gap-2">
        {animal.funFactOptions.map((option, index) => (
          <Button
            key={index}
            size="sm"
            variant={getButtonVariant(option)}
            onClick={() => handleAnswerClick(option)}
            disabled={selectedAnswer !== null}
          >
            {option}
          </Button>
        ))}
      </div>
      {isCorrect === true && (
        <Alert variant="success" className="mt-2 p-2 small">
          答對了！ {animal.funFactExplanation && <p className="mb-0 mt-1">{animal.funFactExplanation}</p>} <a href={animal.funFactSource} target="_blank" rel="noopener noreferrer" className="alert-link">查看資料來源</a>
        </Alert>
      )}
      {isCorrect === false && (
        <Alert variant="danger" className="mt-2 p-2 small d-flex justify-content-between align-items-center">
          答錯了！
          <Button variant="outline-light" size="sm" onClick={handleReset}>
            再試一次
          </Button>
        </Alert>
      )}
    </div>
  );
}

export default AnimalQuiz;