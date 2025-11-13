import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { theoryData } from '../data/theoryData';
import './TheoryDetailPage.css';
import scienceImage from '../assets/images/science.png';

const TheoryDetailPage = () => {
  const { id } = useParams();
  const theory = theoryData[id];

  if (!theory) {
    return (
      <div className="theory-detail-container">
        <div className="theory-not-found">
          <h2>理論不存在</h2>
          <p>抱歉，我們找不到您要尋找的理論。</p>
          <Link to="/science-timeline" className="back-link">返回時間軸</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="theory-detail-container">
      <div className="theory-header" style={{ backgroundImage: `url(${scienceImage})` }}>
        <div className="theory-header-overlay">
          <h1>{theory.title}</h1>
          <p className="summary">{theory.summary}</p>
        </div>
      </div>
      <div className="theory-content">
        {theory.sections.map((section, index) => (
          <div className="theory-section" key={index}>
            <h2>{section.heading}</h2>
            <p>{section.content}</p>
          </div>
        ))}
        <div className="theory-references">
          <h3>參考資料</h3>
          <ul>
            {theory.references.map((ref, index) => (
              <li key={index}>
                <a href={ref.url} target="_blank" rel="noopener noreferrer">{ref.name}</a>
              </li>
            ))}
          </ul>
        </div>
        <Link to="/science-timeline" className="back-link">返回時間軸</Link>
      </div>
    </div>
  );
};

export default TheoryDetailPage;
