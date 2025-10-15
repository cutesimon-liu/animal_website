import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Row, Col, Image, Card, ListGroup } from 'react-bootstrap';
import animals from '../data/animals';

function AnimalDetailPage() {
  const { id } = useParams();
  const animal = animals.find(a => a.id === id);

  if (!animal) {
    return (
      <div>
        <h2>動物不存在</h2>
        <p>找不到您要尋找的動物。</p>
        <Link to="/" className="btn btn-primary">返回首頁</Link>
      </div>
    );
  }

  return (
    <Card>
      <Card.Header as="h2">{animal.name}</Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}>
            <Image src={animal.image} fluid rounded />
          </Col>
          <Col md={6}>
            <p>{animal.description}</p>
            <ListGroup variant="flush">
              <ListGroup.Item><strong>棲地:</strong> {animal.habitat}</ListGroup.Item>
              <ListGroup.Item><strong>食物:</strong> {animal.diet}</ListGroup.Item>
              <ListGroup.Item><strong>保育狀況:</strong> {animal.status}</ListGroup.Item>
              <ListGroup.Item>
                <strong>資料來源:</strong> <a href={animal.source} target="_blank" rel="noopener noreferrer">維基百科</a>
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
        <Link to="/" className="btn btn-secondary mt-3">返回列表</Link>
      </Card.Body>
    </Card>
  );
}

export default AnimalDetailPage;