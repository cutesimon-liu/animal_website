import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function AnimalCard({ animal }) {
  return (
    <Card className="h-100">
      <Card.Img variant="top" src={animal.image} />
      <Card.Body>
        <Card.Title>{animal.name}</Card.Title>
      </Card.Body>
      <Card.Footer>
        <Link to={`/animal/${animal.id}`} className="btn btn-primary">詳細資訊</Link>
      </Card.Footer>
    </Card>
  );
}

export default AnimalCard;
