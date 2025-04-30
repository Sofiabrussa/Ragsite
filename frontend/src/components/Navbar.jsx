import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Container } from 'react-bootstrap';

const CustomNavbar = ({ companyName }) => {
  return (
    <Navbar bg="dark" variant="dark" fixed="top" className="z-index-10">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <div
            className="d-flex justify-content-center align-items-center rounded-circle bg-primary text-white font-weight-bold"
            style={{ height: '32px', width: '32px' }}
          >
            {companyName.charAt(0)}
          </div>
          <span className="ms-2 h5 mb-0">{companyName}</span>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;

