import React from 'react';
import { solarSystemData } from '../data/planets';
import './SolarSystemMenu.css';
import { useNavigate } from 'react-router-dom';

const SolarSystemMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handlePlanetClick = (planetId) => {
    navigate(`/planet/${planetId}`);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="solar-system-menu-overlay" onClick={onClose}>
      <div className="solar-system-menu-sidebar" onClick={(e) => e.stopPropagation()}>
        <h3 className="menu-title">探索星系</h3>
        <ul className="planet-list">
          {solarSystemData.planets.map((planet) => (
            <li key={planet.id} className="planet-item" onClick={() => handlePlanetClick(planet.id)}>
              <img src={planet.image} alt={planet.name} className="planet-thumbnail" />
              <span className="planet-name">{planet.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SolarSystemMenu;