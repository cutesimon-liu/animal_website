import React from 'react'; // Removed useState and useEffect
import { Card, ListGroup } from 'react-bootstrap';

function AnimalInfoPage({ animal }) {
  // Removed animation state and effect

  if (!animal) {
    return <div className="text-center p-3">資訊載入失敗</div>;
  }
  return (
    <Card className="h-100 p-3" style={{ overflowY: 'auto' }}> {/* Removed conditional class */}
      <Card.Body>
        <Card.Title as="h2">{animal.name}</Card.Title>
        <p>{animal.description}</p>
        <ListGroup variant="flush">
          <ListGroup.Item><strong>棲地:</strong> {animal.habitat}</ListGroup.Item>
          <ListGroup.Item><strong>食物:</strong> {animal.diet}</ListGroup.Item>
          <ListGroup.Item><strong>保育狀況:</strong> {animal.status}</ListGroup.Item>
          <ListGroup.Item>
            <strong>資料來源:</strong> <a href={animal.source} target="_blank" rel="noopener noreferrer">維基百科</a>
          </ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );
}

export default AnimalInfoPage;
