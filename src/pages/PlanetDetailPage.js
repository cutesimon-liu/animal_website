import React from 'react';
import { Container, Row, Col, Image, Table, Alert } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { solarSystemData } from '../data/planets';

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

  return (
    <div className="main-content-container">
      <Row className="align-items-center">
        <Col md={5} className="text-center mb-4 mb-md-0">
          <Image src={planet.image} alt={planet.name} fluid roundedCircle style={{ backgroundColor: '#000' }} />
        </Col>
        <Col md={7}>
          <h1>{planet.name}</h1>
          <h3 className="mb-3">{planet.name_en}</h3>
          <p className="lead">{planet.description}</p>
          <div className="mt-4">
            <small className="text-light">
              資料來源：
              <a href={solarSystemData.source_url} target="_blank" rel="noopener noreferrer">
                {solarSystemData.source}
              </a>
            </small>
          </div>
        </Col>
      </Row>

      <hr className="my-5" />

      <Row>
        <Col>
          <h2 className="mb-4">知識檔案</h2>
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
    </div>
  );
}

export default PlanetDetailPage;
