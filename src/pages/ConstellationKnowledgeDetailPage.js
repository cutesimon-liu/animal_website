import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';
import constellationKnowledge from '../data/constellationKnowledge';

function ConstellationKnowledgeDetailPage() {
  const { id } = useParams();
  const knowledgeItem = constellationKnowledge.find(item => item.id === id);

  const [tapeStyles, setTapeStyles] = useState([]);

  useEffect(() => {
    const corners = [
      { top: '0px', left: '0px', transformOrigin: 'top left' },
      { top: '0px', right: '0px', transformOrigin: 'top right' },
      { bottom: '0px', left: '0px', transformOrigin: 'bottom left' },
      { bottom: '0px', right: '0px', transformOrigin: 'bottom right' },
    ];

    const numTapes = Math.floor(Math.random() * 2) + 1; // 1 or 2 tapes
    const newTapeStyles = [];
    const usedCorners = new Set();

    for (let i = 0; i < numTapes; i++) {
      let randomCornerIndex;
      do {
        randomCornerIndex = Math.floor(Math.random() * corners.length);
      } while (usedCorners.has(randomCornerIndex));
      usedCorners.add(randomCornerIndex);

      const corner = corners[randomCornerIndex];
      const rotateAngle = Math.floor(Math.random() * 46); // 0 to 45 degrees
      const backgroundColor = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.7)`;

      newTapeStyles.push({
        ...corner,
        transform: `rotate(${rotateAngle}deg)`,
        backgroundColor,
        position: 'absolute',
        width: '80px',
        height: '25px',
        borderRadius: '3px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        zIndex: 10,
      });
    }
    setTapeStyles(newTapeStyles);
  }, []);

  if (!knowledgeItem) {
    return (
      <Container className="mt-5 text-white">
        <Card style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}>
          <Card.Body>
            <Card.Title>知識項目不存在</Card.Title>
            <Card.Text>找不到您要尋找的星座知識。</Card.Text>
            <Link to="/universe" className="btn btn-primary">返回宇宙頁面</Link>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="mt-5 text-white">
      <div className="sticky-note-container">
        {tapeStyles.map((style, index) => (
          <div key={index} className="tape-decoration" style={style}></div>
        ))}
        <Card style={{
          backgroundColor: '#fff380', // Sticky note yellow
          border: '1px solid #e0e0e0',
          borderRadius: '5px',
          padding: '20px',
          transform: 'rotate(-2deg)', // Slight rotation
          boxShadow: '5px 5px 15px rgba(0,0,0,0.3)', // Lifted effect
          fontFamily: 'Caveat, cursive', // Handwriting font
          color: '#333', // Darker text for contrast
          lineHeight: '1.8',
          fontSize: '1.2em'
        }}>
          <Card.Body>
            <Card.Title as="h2" style={{ color: '#333', fontFamily: 'Caveat, cursive', fontSize: '2.5em' }}>{knowledgeItem.title}</Card.Title>
            <Card.Text style={{ color: '#333', whiteSpace: 'pre-wrap', fontFamily: 'Caveat, cursive' }}>{knowledgeItem.fullDescription}</Card.Text>
            {knowledgeItem.sourceName && knowledgeItem.sourceUrl && (
              <Card.Text>
                <strong style={{ color: 'black' }}>資料來源:</strong> <a href={knowledgeItem.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'black' }}>{knowledgeItem.sourceName}</a>
              </Card.Text>
            )}
            <Link to="/universe?view=constellations" className="btn btn-secondary">返回星座頁面</Link>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

export default ConstellationKnowledgeDetailPage;