import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import NavigationBar from './components/NavigationBar';
import HomePage from './pages/HomePage';
import AnimalDetailPage from './pages/AnimalDetailPage';
import LandingPage from './pages/LandingPage';
import TicTacToe from './pages/TicTacToe';
import Gomoku from './pages/Gomoku';
import Xiangqi from './pages/Xiangqi';
import UniversePage from './pages/UniversePage';
import PlanetDetailPage from './pages/PlanetDetailPage';
import UniverseKnowledgeDetailPage from './pages/UniverseKnowledgeDetailPage';
import Game2048 from './pages/Game2048';
import Game1A2B from './pages/Game1A2B';
import ConstellationPage from './pages/ConstellationPage';
import ConstellationKnowledgeDetailPage from './pages/ConstellationKnowledgeDetailPage';
import ScienceTimelinePage from './pages/ScienceTimelinePage';
import TheoryDetailPage from './pages/TheoryDetailPage';
import DarkChess from './pages/DarkChess';


const ThemeLayout = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      document.body.className = 'first-bg';
    } else if (path.startsWith('/universe') || path.startsWith('/planet') || path.startsWith('/constellation-knowledge') || path.startsWith('/science-timeline')) {
      document.body.className = 'universe-bg';
    } else if (path.startsWith('/tictactoe') || path.startsWith('/gomoku') || path.startsWith('/xiangqi') || path.startsWith('/game2048') || path.startsWith('/game1a2b') || path.startsWith('/darkchess')) {
      document.body.className = 'game-bg';
    } else if (path.startsWith('/animal') || path.startsWith('/animals')) {
      document.body.className = 'animal-bg';
    } else {
      document.body.className = 'default-bg';
    }
  }, [location]);

  return <>{children}</>;
};

function App() {
  const [counts, setCounts] = useState({ total: null, today: null });

  useEffect(() => {
    // We only fetch the count once when the app loads.
    // This avoids re-fetching on every navigation.
    fetch('/.netlify/functions/visitorCounter')
      .then(response => response.json())
      .then(data => {
        if (data.total !== undefined && data.today !== undefined) {
          setCounts({ total: data.total, today: data.today });
        }
      })
      .catch(error => console.error('Error fetching visitor count:', error));
  }, []); // Empty dependency array ensures this runs only once.

  return (
    <Router>
      <ThemeLayout>
        <NavigationBar counts={counts} />
        <main>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/animals" element={<HomePage />} />
              <Route path="/animal/:id" element={<AnimalDetailPage />} />
              <Route path="/universe" element={<UniversePage />} />
              <Route path="/planet/:id" element={<PlanetDetailPage />} />
              <Route path="/tictactoe" element={<TicTacToe />} />
              <Route path="/gomoku" element={<Gomoku />} />
              <Route path="/xiangqi" element={<Xiangqi />} />
              <Route path="/game2048" element={<Game2048 />} />
              <Route path="/game1a2b" element={<Game1A2B />} />
              <Route path="/darkchess" element={<DarkChess />} />
              <Route path="/universe-knowledge/:id" element={<UniverseKnowledgeDetailPage />} />
              <Route path="/constellation/:id" element={<ConstellationPage />} />
              <Route path="/constellation-knowledge/:id" element={<ConstellationKnowledgeDetailPage />} />
              <Route path="/science-timeline" element={<ScienceTimelinePage />} />
              <Route path="/theory/:id" element={<TheoryDetailPage />} />
            </Routes>
        </main>
      </ThemeLayout>
    </Router>
  );
}

export default App;