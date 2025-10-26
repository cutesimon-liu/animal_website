import React from 'react';
import { useParams } from 'react-router-dom';
import { constellationData } from '../data/constellationData';
import { Container, Button } from 'react-bootstrap';
import starBg from '../assets/images/star_bg.png';

export default function ConstellationPage() {
    const { id } = useParams();
    const constellation = constellationData.find(c => c.id === id);

    const pageStyle = {
        backgroundImage: `url(${starBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: 'white',
        minHeight: '100vh',
        padding: '40px 0'
    };

    const textShadowStyle = {
        textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)'
    };

    if (!constellation) {
        return (
            <div style={pageStyle}>
                <Container className="text-center my-5">
                    <h1 style={textShadowStyle}>Constellation Not Found</h1>
                    <p style={textShadowStyle}>The constellation with ID "{id}" does not exist.</p>
                    <Button onClick={() => window.history.back()}>Go Back</Button>
                </Container>
            </div>
        );
    }

    return (
        <div style={pageStyle}>
            <Container className="text-center">
                <div className="d-flex justify-content-center align-items-center mb-4">
                    <img src={require(`../assets/images/constellation/${constellation.image}`)} alt={constellation.name} style={{ width: '80px', marginRight: '20px' }} />
                    <h1 style={{...textShadowStyle, fontSize: '3rem', margin: 0}}>{constellation.name}</h1>
                </div>
                
                <div className="my-5 text-start">
                    <h3 style={{...textShadowStyle, borderBottom: '1px solid rgba(255, 255, 255, 0.5)', paddingBottom: '10px' }}>知識</h3>
                    <p style={{...textShadowStyle, fontSize: '1.2rem', lineHeight: '1.8' }}>{constellation.knowledge}</p>
                </div>

                <div className="my-5 text-start">
                    <h3 style={{...textShadowStyle, borderBottom: '1px solid rgba(255, 255, 255, 0.5)', paddingBottom: '10px' }}>神話</h3>
                    <p style={{...textShadowStyle, fontSize: '1.2rem', lineHeight: '1.8' }}>{constellation.myth}</p>
                </div>

                <div className="text-center mt-4">
                    <a href={constellation.source} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light">
                        資訊來源
                    </a>
                </div>

                <div className="text-center mt-5">
                    <Button variant="light" onClick={() => window.history.back()}>返回</Button>
                </div>
            </Container>
        </div>
    );
}
