import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Spinner, Alert } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';

const StarRating = ({ rating, setRating }) => {
  const [hover, setHover] = useState(null);

  return (
    <div className="mb-3">
      {[...Array(5)].map((star, index) => {
        const ratingValue = index + 1;
        return (
          <label key={index}>
            <input 
              type="radio" 
              name="rating" 
              value={ratingValue} 
              onClick={() => setRating(ratingValue)} 
              style={{ display: 'none' }} 
            />
            <FaStar 
              size={25} 
              color={ratingValue <= (hover || rating) ? '#ffc107' : '#e4e5e9'} 
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: 'pointer', transition: 'color 200ms' }}
            />
          </label>
        );
      })}
    </div>
  );
};

const CommentBoard = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/.netlify/functions/get-comments');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to fetch comments.' }));
        throw new Error(errorData.error);
      }
      const data = await response.json();
      setComments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      fetchComments();
    } else {
      setLoading(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() === '' || newRating === 0) {
      setError('請留下您的評分和留言！');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/.netlify/functions/add-comment', {
        method: 'POST',
        body: JSON.stringify({ text: newComment, rating: newRating }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to submit comment.' }));
        throw new Error(errorData.error);
      }

      setNewComment('');
      setNewRating(0);
      await fetchComments(); // Refresh comments list
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Container>
        <h2 className="text-center mb-4" style={{ color: '#004d00' }}>網站留言板</h2>
        <Card className="mb-4">
          <Card.Body>
            <p className="text-center text-muted" style={{ fontSize: '0.9rem' }}>
              您的評論是我優化網站的原動力 ✨✨✨✨✨✨✨✨
            </p>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-2">
                <Form.Label>您對這個網站的評分是？</Form.Label>
                <StarRating rating={newRating} setRating={setNewRating} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>想說些什麼嗎？</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="請留下您的匿名評論..."
                />
              </Form.Group>
              {error && <Alert variant="danger">{error}</Alert>}
              <div className="d-grid">
                <Button variant="primary" type="submit" disabled={submitting}>
                  {submitting ? <Spinner as="span" animation="border" size="sm" /> : '送出評論'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>

        <h3 className="mb-3">最新留言</h3>
        {loading ? (
          <div className="text-center text-muted">{(process.env.NODE_ENV === 'development') ? '留言將在網站部署後顯示' : <Spinner animation="border" />}</div>
        ) : (
          comments.map(comment => (
            <Card key={comment.id} className="mb-3">
              <Card.Body>
                <Card.Text>{comment.text}</Card.Text>
              </Card.Body>
              <Card.Footer className="d-flex justify-content-between align-items-center text-muted">
                <div>
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} color={i < comment.rating ? '#ffc107' : '#e4e5e9'} />
                  ))}
                </div>
                <small>{new Date(comment.timestamp).toLocaleString()}</small>
              </Card.Footer>
            </Card>
          ))
        )}
      </Container>
    </div>
  );
};

export default CommentBoard;
