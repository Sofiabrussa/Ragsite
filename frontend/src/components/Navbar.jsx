import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Container } from 'react-bootstrap';

const CustomNavbar = ({ companyName }) => {
  return (
    <Navbar style={{ backgroundColor: '#0d1b2a' }} variant="dark" fixed="top" className="z-index-10">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img
            src="/logo.png"
            alt="Logo"
          style={{ height: '32px', width: '32px', borderRadius: '50%' }}
          />
          <span className="ms-2 h5 mb-0">{companyName}</span>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;

