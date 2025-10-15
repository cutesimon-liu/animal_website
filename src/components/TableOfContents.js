import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import Icon from './Icon';


function TableOfContents({ animals, flipBook, page, isTOCJump }) {
  const handleAnimalClick = (animalIndex) => {
    if (flipBook.current) {
      isTOCJump.current = true;

      const pageNumber = 3 + (animalIndex * 2);
      
      const pageFlipInstance = flipBook.current.pageFlip();
      if (pageFlipInstance) {
        pageFlipInstance.flip(pageNumber);
      }
    }
  };

  const splitIndex = Math.ceil(animals.length / 2);
  const displayedAnimals = page === 'left' ? animals.slice(0, splitIndex) : animals.slice(splitIndex);

  return (
    <Card className="h-100 p-3" style={{ overflowY: 'auto' }}>
      <Card.Body>
        {page === 'left' && <Card.Title as="h2" className="text-center mb-4">目錄</Card.Title>}
        <ListGroup variant="flush">
          {displayedAnimals.map((animal, index) => {
            const animalIdx = page === 'left' ? index : splitIndex + index;
            return (
              <ListGroup.Item 
                key={animal.id} 
                action 
                onClick={() => handleAnimalClick(animalIdx)} 
                className="d-flex justify-content-between align-items-center" 
                style={{ cursor: 'pointer', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
              >
                <div style={{ pointerEvents: 'none' }} className="d-flex align-items-center">
                  <span style={{ fontSize: '1.2rem', width: '24px', textAlign: 'center', display: 'inline-block' }}>
                    {animal.emoji ? animal.emoji : <Icon name={animal.icon} />}
                  </span>
                  <span className="ms-3">{animal.name}</span>
                </div>
                <span style={{ pointerEvents: 'none' }}>{3 + (animalIdx * 2)}</span>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </Card.Body>
    </Card>
  );
}

export default TableOfContents;
