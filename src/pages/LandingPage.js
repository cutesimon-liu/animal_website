import React from 'react';
import { Container, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <Container className="text-center my-5">
      <Card className="p-5 shadow-lg">
        <Card.Body>
          <h1 className="display-4 mb-4">歡迎來到奇妙世界</h1>
          <p className="lead mb-4">
            在這裡，您可以探索地球上各種奇妙的生物，遨遊浩瀚的宇宙星辰，
            還可以挑戰多種有趣的小遊戲。我們為您精心打造了一個充滿知識與樂趣的數位天地。
          </p>
          <p className="mb-5">
            無論您是對動物、宇宙充滿好奇，還是想在遊戲中尋找樂趣，
            這裡都能滿足您的探索慾。準備好展開您的奇妙之旅了嗎？
          </p>
          <Link to="/animals">
            <Button variant="primary" size="lg">
              進入書本，開始探索
            </Button>
          </Link>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default LandingPage;
