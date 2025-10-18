import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';
import universeKnowledge from '../data/universeKnowledge';

function UniverseKnowledgeDetailPage() {
  const { id } = useParams();
  const knowledgeItem = universeKnowledge.find(item => item.id === id);

  if (!knowledgeItem) {
    return (
      <Container className="mt-5 text-white">
        <Card style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}>
          <Card.Body>
            <Card.Title>知識項目不存在</Card.Title>
            <Card.Text>找不到您要尋找的宇宙知識。</Card.Text>
            <Link to="/universe" className="btn btn-primary">返回宇宙頁面</Link>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="mt-5 text-white">
      <Card style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
        <Card.Body>
          <Card.Title as="h2" style={{ color: 'white' }}>{knowledgeItem.title}</Card.Title>
          <Card.Text style={{ color: 'white', whiteSpace: 'pre-wrap' }}>{knowledgeItem.fullDescription}</Card.Text>
          {knowledgeItem.sourceName && knowledgeItem.sourceUrl && (
            <Card.Text>
              <strong style={{ color: 'white' }}>資料來源:</strong> <a href={knowledgeItem.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>{knowledgeItem.sourceName}</a>
            </Card.Text>
          )}
          <Link to="/universe" className="btn btn-secondary">返回宇宙頁面</Link>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default UniverseKnowledgeDetailPage;