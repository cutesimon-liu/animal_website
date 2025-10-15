import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { Image, Card } from 'react-bootstrap';
import AnimalQuiz from './AnimalQuiz';

function AnimalImagePage({ animal }) {
  const [animate, setAnimate] = useState(false); // State to control animation

  useEffect(() => {
    setAnimate(false); // Reset animation state
    const timer = setTimeout(() => setAnimate(true), 50); // Trigger animation shortly after render
    return () => clearTimeout(timer); // Cleanup timer
  }, [animal.id]); // Re-run effect when animal changes

  if (!animal) {
    return <div className="text-center p-3">圖片載入失敗</div>;
  }
  return (
    <Card className={`h-100 d-flex flex-column justify-content-start align-items-center p-3 ${animate ? 'slide-in-content' : ''}`}>
      <Card.Body className="text-center d-flex flex-column align-items-center justify-content-start" style={{ flex: '1 1 auto', overflowY: 'auto', width: '100%' }}>
        <Image src={animal.image} fluid rounded style={{ maxHeight: '55%', objectFit: 'contain' }} />
        <AnimalQuiz animal={animal} />
      </Card.Body>
    </Card>
  );
}

export default AnimalImagePage;
