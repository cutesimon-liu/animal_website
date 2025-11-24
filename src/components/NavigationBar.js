import React from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function NavigationBar({ counts }) {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" style={{ zIndex: 10 }}>
      <Container>
        <Navbar.Brand as={Link} to="/">奇妙世界</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/animals">動物列表</Nav.Link>
            <Nav.Link as={Link} to="/universe">地球與宇宙</Nav.Link>
            <Nav.Link as={Link} to="/science-timeline">科學大事紀</Nav.Link>
            <NavDropdown title="小遊戲" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/tictactoe">井字遊戲</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/gomoku">五子棋</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/xiangqi">象棋</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/game2048">2048</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/game1a2b">1A2B 猜數字</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/darkchess">暗棋</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav className="ms-auto">
            <Nav.Item className="text-light me-3">
              <small>今日訪客：{counts && counts.today !== null ? counts.today : '...'}</small>
            </Nav.Item>
            <Nav.Item className="text-light">
              <small>總造訪人數：{counts && counts.total !== null ? counts.total : '...'}</small>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
