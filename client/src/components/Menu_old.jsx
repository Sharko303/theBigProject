import { Link } from 'react-router-dom';
import { Nav, Navbar, Container, Button } from 'react-bootstrap';
//import { Theme } from './Theme';

export const Menu = (props) => {

  const token = localStorage.getItem('token');
  function handleLogout() {
    localStorage.removeItem('token');
    window.location.href = '/connexion'; // Redirigez l'utilisateur vers la page de connexion après la déconnexion
  }
  const open = () => {
    let navbar2 = document.querySelector('.navbar');
    navbar2.classList.add('navbar-scrolled');
    navbar2.classList.remove('navbar-dark');
    navbar2.classList.add('navbar-light');
  }

  // on attend que notre page s'affiche et quand elle est prête alors on semlect notre class
  window.addEventListener("load", () => {
    let mobile = document.getElementById('mobile');
    mobile.addEventListener('click', open);
  });
  const scrollColorNav = () => {
    let navbar = document.querySelector('.navbar');
    /* console.log(window.scrollY) */
    if (window.scrollY >= 100 && !navbar.className.includes('noscroll')) {
      navbar.classList.add('navbar-scrolled');
      navbar.classList.remove('navbar-dark');
      navbar.classList.add('navbar-light');

    } else {
      navbar.classList.remove('navbar-scrolled');
      navbar.classList.add('navbar-dark');
      navbar.classList.remove('navbar-light');
    }
  }
  window.addEventListener('scroll', scrollColorNav)

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

  return (
    <Navbar id="menu" expand="lg" className={`${props.color} ${props.scroll} ${props.colornav} ${props.noscroll} fixed-top`}>
      <Container fluid>
        <Navbar.Brand href="/">E-Sport - Tournois</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" id='mobile' onClick={focusMenu} />
        <Navbar.Collapse id="navbarNav">
          {token ? (
            <Nav className="ms-auto">
              <Nav.Link href="/" className="mx-2 active fw-bolder">Accueil</Nav.Link>
              <Nav.Link href="/creertournois" className="mx-2 fw-bolder">Creer un tournois</Nav.Link>
              <Nav.Link href="/" onClick={handleLogout} className="mx-2 fw-bolder">Déconnexion</Nav.Link>
            </Nav>
          ) : (
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/" className="mx-2 fw-bolder" >Accueil</Nav.Link>
              <Nav.Link href="/connexion" className="mx-2 fw-bolder">Connexion</Nav.Link>
              <Nav.Link as={Link} to="/inscription" className="mx-2 fw-bolder">Inscription</Nav.Link>
              <Nav.Item id="theme"></Nav.Item>
            </Nav>
          )}
          <Nav className="ms-auto d-none d-lg-inline-flex">
            <Nav.Item className="mx-2">
              <Button href="" target="blank" variant="link" className="text-dark h5"><i className="bi-envelope"></i></Button>
            </Nav.Item>
            <Nav.Item className="mx-2">
              <Button href="" target="blank" variant="link" className="text-dark h5"><i className="fab fa-twitter"></i></Button>
            </Nav.Item>
            <Nav.Item className="mx-2">
              <Button href="" target="blank" variant="link" className="text-dark h5"><i className="fab fa-facebook-square"></i></Button>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
</Navbar >
  );
}