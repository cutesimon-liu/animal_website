import React from 'react';
import { Card } from 'react-bootstrap';

function BackCoverPage() {
  return (
    <Card 
      className="h-100 text-center d-flex flex-column justify-content-end align-items-center text-white" 
      style={{ 
        backgroundImage: `url('/images/book_cover_placeholder.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        border: 'none',
        position: 'relative'
      }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(4px)'
      }}></div>

      <div style={{ zIndex: 1, marginBottom: '2rem', padding: '1rem' }}>
        <h2 className="display-5" style={{ fontFamily: "'Fredoka One', cursive", fontWeight: 'normal', textShadow: '2px 2px 4px rgba(0,0,0,0.7)'}}>感謝閱讀！</h2>
        <p className="lead" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)'}}>你現在認識了好多新朋友！<br/>繼續探索這個奇妙的世界吧！</p>
      </div>
    </Card>
  );
}

export default BackCoverPage;
