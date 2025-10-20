import React from 'react';
import { Row, Col, Image, Table, Alert, Tabs, Tab } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { solarSystemData } from '../data/planets';
import plutoImage from '../assets/images/planets/pluto.png';

function PlanetDetailPage() {
  const { id } = useParams();
  const planet = solarSystemData.planets.find(p => p.id === id);

  if (!planet) {
    return (
      <div className="main-content-container">
        <Alert variant="danger">
          <h2>星球不存在</h2>
          <p>找不到您要尋找的星球資料。</p>
          <Link to="/universe">返回太陽系總覽</Link>
        </Alert>
      </div>
    );
  }

  const imageUrl = planet.id === 'pluto' ? plutoImage : planet.image;

  // Split description into science and mythology
  const [scienceDesc, mythDesc] = planet.description.split('\n\n');

  return (
    <div className="main-content-container">
      <Row className="mb-5">
        <Col md={2} className="text-center mb-4 mb-md-0">
          <Image src={imageUrl} alt={planet.name} fluid roundedCircle style={{ backgroundColor: '#000' }} />
          <h1 style={{ fontSize: '2rem', marginBottom: '0', marginTop: '1rem' }}>{planet.name}</h1>
          <h3 style={{ fontSize: '1.5rem', marginTop: '0' }}>{planet.name_en}</h3>
        </Col>
        <Col md={10}>
          <h4 className="mb-3">知識檔案</h4>
          <Table responsive className="planet-facts-table">
            <thead>
              <tr>
                <th>項目</th>
                <th>資料</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(planet.facts).map(([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      <Tabs defaultActiveKey="science" id="planet-info-tabs" className="mb-3" fill>
        <Tab eventKey="science" title="科學資訊">
          <p className="lead mt-3">{scienceDesc}</p>
        </Tab>
        <Tab eventKey="mythology" title="神話故事">
          <p className="lead mt-3">{mythDesc || '關於這個天體的神話故事較少，或與其發現歷史緊密相關。'}</p>
        </Tab>
      </Tabs>
      
      <div className="mt-5 text-center">
        <small className="text-light">
          資料來源：
          <a href={solarSystemData.source_url} target="_blank" rel="noopener noreferrer">
            {solarSystemData.source}
          </a>
        </small>
      </div>
    </div>
  );
}

export default PlanetDetailPage;
