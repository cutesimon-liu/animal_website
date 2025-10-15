import React from 'react';
import { Card } from 'react-bootstrap';

function CoverPage() {
  return (
    <Card 
      className="h-100 text-center d-flex flex-column justify-content-end align-items-center text-white" 
      style={{ 
        backgroundImage: `url('/images/book_cover_placeholder.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        border: 'none'
      }}
    >
      <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: '15px', padding: '1rem 2rem', marginBottom: '2rem' }}>
        <h1 className="display-4" style={{ fontFamily: "'Fredoka One', cursive", fontWeight: 'normal', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>探索動物世界</h1>
      </div>
    </Card>
  );
}

export default CoverPage;
