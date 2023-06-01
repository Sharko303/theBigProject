import { Nav, Navbar, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BiHome, BiGroup, BiUserCircle, BiLogOut, BiPlus, BiJoystick } from 'react-icons/bi';
import React, { useState, useEffect } from 'react';
import Flavicon from '../images/favicon.ico';
import 'animate.css/animate.min.css';
import * as cookie from '../components/Cookie';
//import { Theme } from './Theme';

export const Menu = () => {
  const token = document.cookie;


/*   function focusMenu() {
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
  } */
  const [isActive, setIsActive] = useState(false);

  const handleMouseEnter = () => {
    setIsActive(true);
  }
  const handleMouseLeave = () => {
    setIsActive(false);
  };

  const scrollColorNav = () => {
    let navbar = document.querySelector('.navbar');
    if (window.scrollY >= 100 && !navbar.className.includes('noscroll')) {
      navbar.classList.add('navbar-scrolled');
      navbar.classList.remove('navbar-dark');

    } else {
      navbar.classList.remove('navbar-scrolled');
      navbar.classList.add('navbar-dark');
    }
  }
  window.addEventListener('scroll', scrollColorNav)
  const open = () => {
    let navbar2 = document.querySelector('.navbar');
    navbar2.classList.add('navbar-scrolled');
    navbar2.classList.remove('navbar-dark');
  }

  // on attend que notre page s'affiche et quand elle est prête alors on semlect notre class
  window.addEventListener("load", () => {
    let mobile = document.getElementById('mobile');
    mobile.addEventListener('click', open);
  });

  // Pour notre menu mobile ou non on adapte les classes a utilisé :


const MyNavbar = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const navbarClass = isMobile ? "" : "d-flex";
}
  return (
    <Navbar id="menu" expand="lg" className="fixed-top" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Container fluid>
        <Navbar.Brand className="sidebar-start" href="/">
          <img
            className="d-block w-100 mx-1"
            src={Flavicon}
            alt="Valorant"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" id="mobile" />
        <Navbar.Collapse className='w-100 align-items-center justify-content-center' id="navbarNav">
          {token ? (
             <Nav className="mt-5">
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
              <Nav.Link href="/listetournois" className={`mx-3 fw-bolder mt-5 sidebar-btn sidebar-middle ${isActive ? 'active' : ''}`}>
                <BiJoystick className="icon-color" />
                {isActive && (
                  <span className='mx-2 text-black fade show animate__animated animate__fadeInLeft' >
                    Tournois
                  </span>
                )}
              </Nav.Link>
              <Nav.Item className="mx-auto sidebar-end">
                <Nav.Link href="/connexion" className="fw-bolder">
                  <Button className="btn-danger" onClick={cookie.delCookie} style={{ position: 'relative', overflow: 'hidden' }}>
                    <BiLogOut className="icon-color" />
                    {isActive && (
                      <span className='text mx-1 text-black fade show animate__animated animate__fadeInLeft'>
                        Déconnexion
                      </span>
                    )}
                  </Button>
                </Nav.Link>
              </Nav.Item>
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