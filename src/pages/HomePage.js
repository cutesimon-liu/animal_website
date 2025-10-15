import React, { useState, useRef, useEffect } from 'react';
import { Button, Row, Col, Container, Form } from 'react-bootstrap';
import animals from '../data/animals';
import HTMLFlipBook from 'react-pageflip';
import CoverPage from '../components/CoverPage';
import AnimalImagePage from '../components/AnimalImagePage';
import AnimalInfoPage from '../components/AnimalInfoPage';
import TableOfContents from '../components/TableOfContents';
import BackCoverPage from '../components/BackCoverPage';
import CommentBoard from '../components/CommentBoard'; // Import CommentBoard

// Helper function to generate random floating element properties
const generateFloatingElementProps = (id) => {
  const animationNames = ['float1', 'float2', 'float3'];
  const randomAnimation = animationNames[Math.floor(Math.random() * animationNames.length)];
  
  const randomStartX = Math.floor(Math.random() * 140) - 20 + 'vw'; // -20vw to 120vw
  const randomEndX = Math.floor(Math.random() * 140) - 20 + 'vw';   // -20vw to 120vw

  const randomFontSize = Math.floor(Math.random() * (60 - 30 + 1)) + 30 + 'px'; // 30px to 60px
  const randomDuration = Math.floor(Math.random() * (25 - 15 + 1)) + 15; // 15s to 25s
  const randomDelay = Math.floor(Math.random() * 5); // 0s to 5s

  return {
    id: id,
    duration: randomDuration * 1000,
    delay: randomDelay * 1000,
    style: {
      '--start-x': randomStartX,
      '--end-x': randomEndX,
      top: '-10vh', // Match animation start
      left: randomStartX, // Match animation start
      fontSize: randomFontSize,
      animation: `${randomAnimation} ${randomDuration}s linear ${randomDelay}s infinite`,
      pointerEvents: 'auto', // Make individual elements clickable
    },
    emoji: ['🍃', '🍂', '🌿', '🍁', '🍀'][Math.floor(Math.random() * 5)], // Random leaf emoji
    isDisappeared: false,
  };
};

function HomePage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const flipBook = useRef(null);
  const isTOCJump = useRef(false);
  const [floatingElements, setFloatingElements] = useState([]);

  const categories = ['All', '陸地生物', '海洋生物', '天空生物'];

  const displayedAnimals = selectedCategory === 'All'
    ? animals
    : animals.filter(animal => animal.category === selectedCategory);

  const totalPages = displayedAnimals.length * 2 + 4;

  // Effect for managing floating elements
  useEffect(() => {
    const addElement = () => {
      setFloatingElements(prevElements => {
        if (prevElements.length >= 5) {
          return prevElements;
        }
        const newElement = generateFloatingElementProps(Date.now());

        // Schedule removal
        setTimeout(() => {
          setFloatingElements(els => els.filter(el => el.id !== newElement.id));
        }, newElement.duration + newElement.delay);

        return [...prevElements, newElement];
      });
    };

    // Initial elements
    const initialTimer1 = setTimeout(addElement, 500);
    const initialTimer2 = setTimeout(addElement, 1500);

    const interval = setInterval(addElement, 7000);

    return () => {
        clearTimeout(initialTimer1);
        clearTimeout(initialTimer2);
        clearInterval(interval);
    }
  }, []);

  // Effect to reset page to 0 when category changes
  useEffect(() => {
    const pageFlipInstance = flipBook.current?.pageFlip();
    if (pageFlipInstance) {
      pageFlipInstance.turnToPage(0);
      setCurrentPage(0);
    }
  }, [selectedCategory]);

  const nextPage = () => {
    const pageFlipInstance = flipBook.current?.pageFlip();
    if (pageFlipInstance) {
      pageFlipInstance.flipNext();
    }
  };

  const prevPage = () => {
    const pageFlipInstance = flipBook.current?.pageFlip();
    if (pageFlipInstance) {
      pageFlipInstance.flipPrev();
    }
  };

  const onPage = (e) => {
    if (e.data === currentPage) return;
    setCurrentPage(e.data);
  };

  const handleReturnToTOC = () => {
    if (flipBook.current) {
      flipBook.current.pageFlip()?.turnToPage(1);
    }
  };

  const handleFloatingElementClick = (id) => {
    setFloatingElements(prevElements => 
      prevElements.map(el => 
        el.id === id ? { ...el, isDisappeared: true } : el
      )
    );

    setTimeout(() => {
      setFloatingElements(prevElements => prevElements.filter(el => el.id !== id));
    }, 200);
  };


  return (
    <Container fluid className="my-4 px-lg-5" style={{ position: 'relative' }}>
      {/* Floating Elements Layer - on top of content but below navbar */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 5, overflow: 'hidden', pointerEvents: 'none' }}>
        {floatingElements.map(el => (
          <div 
            key={el.id} 
            className={`floating-element ${el.isDisappeared ? 'disappear-element' : ''}`}
            style={el.style}
            onClick={() => handleFloatingElementClick(el.id)}
          >
            {el.emoji}
          </div>
        ))}
      </div>

      <h1 className="mb-4 text-center" style={{ color: '#004d00' }}>探索動物世界</h1>

      {/* Category Filter UI */}
      <div className="d-flex justify-content-center mb-4">
        <Form.Select 
          aria-label="選擇動物類別"
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          style={{ maxWidth: '300px' }}
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </Form.Select>
      </div>

      <Row>
        {/* Left Column for the Book */}
        <Col md={12} lg={9} xs={12}>
          <div className="d-flex justify-content-center mb-3">
            <Button variant="secondary" onClick={prevPage} disabled={currentPage === 0 || !flipBook.current?.pageFlip()} className="me-2">
              上一頁
            </Button>
            <Button variant="info" onClick={handleReturnToTOC} className="mx-2">
              返回目錄
            </Button>
            <Button variant="secondary" onClick={nextPage} disabled={currentPage === totalPages - 1 || !flipBook.current?.pageFlip()}>
              下一頁
            </Button>
          </div>

          <Row className="justify-content-center">
            <Col xs={12}>
                <HTMLFlipBook
                  key={selectedCategory}
                  width={500}
                  height={750}
                  size="stretch"
                  minWidth={315}
                  maxWidth={1000}
                  minHeight={400}
                  maxHeight={1533}
                  maxShadowOpacity={0.5}
                  showCover={true}
                  flippingTime={800}
                  onFlip={onPage}
                  className="demo-book"
                  ref={flipBook}
                >
                  <div key="cover-page" className="demo-page">
                    <CoverPage />
                  </div>
                  <div key="toc-left-page" className="demo-page">
                    <TableOfContents animals={displayedAnimals} flipBook={flipBook} page="left" isTOCJump={isTOCJump} />
                  </div>
                  <div key="toc-right-page" className="demo-page">
                    <TableOfContents animals={displayedAnimals} flipBook={flipBook} page="right" isTOCJump={isTOCJump} />
                  </div>
                  {displayedAnimals.flatMap((animal, index) => ([ 
                    <div key={`${animal.id}-image`} className="demo-page">
                      <AnimalImagePage animal={animal} flipBook={flipBook} />
                    </div>,
                    <div key={`${animal.id}-info`} className="demo-page">
                      <AnimalInfoPage animal={animal} flipBook={flipBook} />
                    </div>
                  ]))}
                  <div key="blank-last-page" className="demo-page">
                    <BackCoverPage />
                  </div>
                </HTMLFlipBook>
            </Col>
          </Row>
        </Col>

        {/* Right Column for Comment Board */}
        <Col md={12} lg={3}>
          <CommentBoard />
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;
