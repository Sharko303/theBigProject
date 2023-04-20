import { Link } from 'react-router-dom';
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
    if (window.scrollY >= 100) {
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

/* function focusMenu(event) {
    event.preventDefault(); // empêche le comportement par défaut du lien
  
    // obtenir tous les liens de navigation dans la barre de navigation
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  
    // enlever la classe active de tous les liens de navigation
    navLinks.forEach(link => {
      link.classList.remove('active');
    });
  
    // ajouter la classe active au lien cliqué
    event.target.classList.add('active');
  } */

  return (
    <nav id="menu" className={`navbar ${props.color} ${props.scroll} ${props.colornav} navbar-expand-lg fixed-top fixed-top `}>
      <div className="container-fluid">
        <a className="navbar-brand" href="/">E-Sport - Tournois</a>
        <button id="mobile" className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className=" collapse navbar-collapse transparent" id="navbarNav">
          {token ? (
            <ul className="navbar-nav ms-auto ">
              <li className="nav-item">
                <a className="nav-link mx-2 active fw-bolder" aria-current="page"  href="/">Accueil</a>
              </li>
              <li className="nav-item">
                <a className="nav-link mx-2 fw-bolder" href="/" onClick={handleLogout}>Déconnexion</a>
              </li>
            </ul>
          ) : (
            <ul className="navbar-nav ms-auto ">
              <li className="nav-item">
                <Link id="accueil" className="nav-link mx-2 fw-bolder" aria-current="page" to="/" >Accueil</Link>
              </li>
              <li className="nav-item">
                <a id="connexion" className="nav-link mx-2 fw-bolder" href="/connexion" >Connexion</a>
              </li>
              <li id="inscription" className="nav-item">
                <Link className="nav-link mx-2 fw-bolder" to="/inscription" >Inscription</Link>
              </li>
              <li id="theme" className="nav-item">
                
              </li>
            </ul>
          )}
          <ul className="navbar-nav ms-auto d-none d-lg-inline-flex">
            <li className="nav-item mx-2">
              <a className="nav-link text-dark h5" href="" target="blank"><i className="bi-envelope"></i></a>
            </li>
            <li className="nav-item mx-2">
              <a className="nav-link text-dark h5" href="" target="blank"><i className="fab fa-twitter"></i></a>
            </li>
            <li className="nav-item mx-2">
              <a className="nav-link text-dark h5" href="" target="blank"><i className="fab fa-facebook-square"></i></a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}