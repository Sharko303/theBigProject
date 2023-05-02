import { Nav, Navbar, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BiHome, BiGroup, BiUserCircle} from 'react-icons/bi';
import React, { useState } from 'react';
import 'animate.css/animate.min.css';
//import { Theme } from './Theme';

export const Menu = () => {
  const token = localStorage.getItem('token');
  function handleLogout() {
    localStorage.removeItem('token');
    window.location.href = '/connexion'; // Redirigez l'utilisateur vers la page de connexion après la déconnexion
  }

  function focusMenu() {
    let navbar = document.querySelector('.navbar');
    if (!navbar.className.includes('noscroll') && !navbar.className.includes('navbar-scrolled')) {
      navbar.classList.add('navbar-scrolled');
      navbar.classList.remove('navbar-dark');
      navbar.classList.add('navbar-light');
    } else if (window.scrollY <= 100) {
      navbar.classList.remove('navbar-scrolled');
      navbar.classList.add('navbar-dark');
      navbar.classList.remove('navbar-light');
    }
  }
  const [isActive, setIsActive] = useState(false);

  const handleMouseEnter = () => {
      setIsActive(true);
  }
  const handleMouseLeave = () => {
    setIsActive(false);
  };

  return (
    <Navbar id="menu" expand="lg" className="fixed-top" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Container fluid>
        <Navbar.Brand className="sidebar-start" href="/">
          E-S
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" id="mobile"/>
        <Navbar.Collapse id="navbarNav">
          {token ? (
            <Nav className="mx-auto d-flex align-items-center justify-content-center">
              <Nav.Link href="/" className="active fw-bolder">
                <BiHome className="icon-color" />
              </Nav.Link>
              <Nav.Link href="/creertournois" className="fw-bolder">
                Creer un tournois
              </Nav.Link>
              <Nav.Link href="/" onClick={handleLogout} className="fw-bolder">
                Déconnexion
              </Nav.Link>
            </Nav>
          ) : (
            <Nav className="mt-5 d-flex align-items-center justify-content-center">
              <Nav.Link
                as={Link}
                to="/"
                className={`mx-3 fw-bolder sidebar-btn sidebar-middle ${isActive ? 'active' : ''}`}
              >
                <BiHome className="icon-color" />
                {isActive && (
                  <span className='mx-2 text-black fade show animate__animated animate__fadeInLeft' >
                    Accueil
                  </span>
                )}
              </Nav.Link>
              <Nav.Item className="mx-auto sidebar-end">
                <Nav.Link href="/connexion" className="fw-bolder">
                  <Button className="btn2-color" style={{ position: 'relative', overflow: 'hidden' }}>
                    <BiUserCircle className="icon-color" />
                    {isActive && (
                      <span className='text mx-1 text-black fade show animate__animated animate__fadeInLeft'>
                        Connexion
                      </span>
                    )}
                  </Button>
                </Nav.Link>
                <Nav.Link as={Link} to="/inscription" className="fw-bolder">
                <Button className="btn-color">
                    <BiGroup />
                    {isActive && (
                      <span className='text btn-text fade show animate__animated animate__fadeInLeft'>
                      Inscription
                    </span>
                    )}
                  </Button>
                </Nav.Link>
                <Nav.Item id="theme"></Nav.Item>
              </Nav.Item>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}