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


const ThemeLayout = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      document.body.className = 'first-bg';
    } else if (path.startsWith('/universe') || path.startsWith('/planet')) {
      document.body.className = 'universe-bg';
    } else if (path.startsWith('/tictactoe') || path.startsWith('/gomoku') || path.startsWith('/xiangqi')) {
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
              <Route path="/universe-knowledge/:id" element={<UniverseKnowledgeDetailPage />} />
            </Routes>
        </main>
      </ThemeLayout>
    </Router>
  );
}

export default App;