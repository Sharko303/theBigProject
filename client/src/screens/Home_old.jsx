import { Menu } from '../components/Menu';
import {Menu2} from '../components/Menu2';
import { Footer } from '../components/Footer';
import Img from '../images/home.jpg'
import { useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Container, Row, Col, Button, Carousel } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';


export const Home = () => {
    // on change le titre de notre page
    document.title = "E-Sport | Accueil";
    // on récupère les paramètres de notre url
    const location = useLocation();

    let countToast = 0; // on compte les toast pour éviter d'en avoir plus d'1

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const success = queryParams.get('success');

        if (success === 'true' && countToast < 1) {
            toast.success('Connexion réussie !');
            console.log('toast');
            console.log(countToast)
            countToast = 1
        }
    }, [location.search]);

    return (
        <div className='custom-background-home-body'>
            <header>
                <Menu color="navbar-dark" />
                
            </header>
            <div className="hero-section"
                style={{
                    paddingTop: '50px',
                    backgroundImage: `url(${Img})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    height: '100vh',
                    backgroundAttachment: 'fixed',
                }}>
                <Container className="mt-5">
                    <h1 className="display-4 text-white text-center mb-5 fw-bold">
                        Organisez vos tournois de jeux vidéo
                    </h1>
                    <p className="lead text-white mt-5 text-center fw-bold">
                        Avec notre plateforme en ligne, organisez facilement des tournois pour vos jeux préférés, comme Rocket League et Valorant.
                    </p>
                    <p className="lead text-white mt-5 text-center fw-bold">
                        Rejoignez-nous dès maintenant pour vivre des moments de jeu intenses et relever de nouveaux défis avec des joueurs du monde entier ! Cliquez sur le bouton "REJOINDRE" ci-dessous pour accéder à votre compte ou vous inscrire sur notre plateforme.
                    </p>
                    <Col className="text-center">
                        <Button variant="primary" size="lg" className="mt-5 mb-5" aria-label="REJOINDRE" href="/connexion">
                            REJOINDRE !
                        </Button>
                    </Col>

                </Container>
            </div>
            <Container className="my-5 text-white">
                <h2 className="text-center mb-5">Notre plateforme de tournois de jeux vidéo</h2>
                <Row>
                    <Col md={6}>
                        <h3>Des tournois personnalisables</h3>
                        <p>Nous proposons des tournois personnalisables pour répondre à tous vos besoins. Choisissez le format du tournoi, les règles, les prix et bien plus encore.</p>
                    </Col>
                    <Col md={6}>
                        <h3>Des prix pour les gagnants</h3>
                        <p>Offrez des prix aux gagnants de vos tournois pour les encourager à continuer à jouer et à participer à vos événements futurs.</p>
                    </Col>
                </Row>
                <Row className="mt-5">
                    <Col md={6}>
                        <h3>Une expérience de jeu fluide</h3>
                        <p>Nous nous engageons à offrir une expérience de jeu fluide et équitable à tous les joueurs participants à nos tournois. Nous utilisons les dernières technologies pour garantir des temps de latence minimaux et une connexion stable.</p>
                    </Col>
                    <Col md={6}>
                        <h3>Des jeux populaires</h3>
                        <p>Participez à des tournois pour certains des jeux les plus populaires, comme Rocket League et Valorant. Nous ajoutons régulièrement de nouveaux jeux à notre plateforme pour répondre aux demandes de notre communauté de joueurs.</p>
                    </Col>
                </Row>
            </Container>
            <Container className='mt-5'>
                <Carousel>
                    <Carousel.Item>
                        <img
                            //className="d-block w-100"
                            src="../images/valorant.webp"
                            alt="Valorant"
                            
                        />
                        <Carousel.Caption>
                            <h3>First slide label</h3>
                            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="holder.js/800x400?text=Second slide&bg=282c34"
                            alt="Second slide"
                        />

                        <Carousel.Caption>
                            <h3>Second slide label</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="holder.js/800x400?text=Third slide&bg=20232a"
                            alt="Third slide"
                        />

                        <Carousel.Caption>
                            <h3>Third slide label</h3>
                            <p>
                                Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                            </p>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
            </Container>
            <ToastContainer />
            <footer>
                <Footer color="bg-light" />
            </footer>

        </div >
    )
}