import React from 'react';
import { constellationData } from '../data/constellationData';
import './ConstellationMenu.css';
import { useNavigate } from 'react-router-dom';

const ConstellationMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleConstellationClick = (constellationId) => {
    navigate(`/constellation/${constellationId}`);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="constellation-menu-overlay" onClick={onClose}>
      <div className="constellation-menu-sidebar" onClick={(e) => e.stopPropagation()}>
        <h3 className="menu-title">探索星座</h3>
        <ul className="constellation-list">
          {constellationData.map((constellation) => (
            <li key={constellation.id} className="constellation-item" onClick={() => handleConstellationClick(constellation.id)}>
              <img src={require(`../assets/images/constellation/${constellation.image}`)} alt={constellation.name} className="constellation-thumbnail" />
              <span className="constellation-name">{constellation.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ConstellationMenu;