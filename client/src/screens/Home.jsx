import { Menu } from '../components/Menu';
import { Footer } from '../components/Footer';
import { RocketValoCaroussel } from '../components/RocketValoCaroussel';
import Img from '../images/fond-violet.webp'
import { useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { BiGroup, BiUserCircle, BiLogOut, BiPlus, BiJoystick } from 'react-icons/bi';


export const Home = () => {
    // on change le titre de notre page
    document.title = "E-Sport | Accueil";

    // on récupère les paramètres de notre url
    const location = useLocation();

    // on récupère le token
    const token = localStorage.getItem('token');

    let countToast = 0; // on compte les toast pour éviter d'en avoir plus d'1

    function handleLogout() { // on déconnecte notre utilisateur
        localStorage.removeItem('token');
        window.location.href = '/connexion'; // Redirigez l'utilisateur vers la page de connexion après la déconnexion
    }

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
        <div>
            <header>
                <Menu />
            </header>

            <Container fluid className='custom-background-home-body body-space' >
                <Row> 
                    <Col md={12}>
                    <div className="hero-section"
                        style={{
                            paddingTop: '50px',
                            backgroundImage: `url(${Img})`,
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                            height: '1000px',
                            backgroundAttachment: 'fixed',
                        }}>
                        <Row >
                            <Col lg={8} md={12}>
                                <Container className='content-home-and-mobile'>
                                    <Row>
                                        <Col lg={12} md={4}>
                                            <Container className="text-center" >
                                                <Card className='bg-warning'>
                                                    <Card.Title><h1>Test</h1></Card.Title>
                                                </Card>
                                            </Container>

                                        </Col>
                                        <Col lg={12}>
                                            <div className='tournoisbanner-content mt-5 ml-5 mb-5 text-white'>
                                                <h1>Tournois E-Sport</h1>
                                                <p className='mt-4'>E-Sport est une plateforme en ligne pour les joueurs de jeux vidéo qui cherchent à participer à des tournois E-Sport compétitifs. Les utilisateurs peuvent créer un compte gratuit, rejoindre des équipes, et participer à des tournois de jeux vidéo organisés par la plateforme.</p>

                                                <p>Le site propose une variété de tournois dans différents genres de jeux, tels que les jeux de combat, les jeux de stratégie en temps réel, les jeux de sport électroniques et bien d'autres. Les joueurs peuvent également créer leur propre tournoi, inviter leurs amis et gérer les règles du jeu.</p>


                                            </div>
                                        </Col>
                                        <Col lg={6} md={12}>
                                            <RocketValoCaroussel />
                                        </Col>
                                    </Row>
                                </Container>
                            </Col>
                            <Col lg='4' md='4'>
                                <Container className='home-right content-home-no-mobile'>

                                    {token ? (
                                        <Row>
                                            <Col>
                                                <Button href="/creertournois" className='btn btn-lg w-100 btn-success content-home-no-mobile text-black'><BiJoystick className='mr-3' /><span className='text mx-1 text-black fade show animate__animated animate__fadeInLeft'>
                                                    Listes tournois
                                                </span></Button>
                                            </Col>

                                            <Col>
                                                <Button className='btn btn-lg w-100 btn-danger content-home-no-mobile text-dark' href="/" onClick={handleLogout}><BiLogOut /> <span className='text mx-1 text-black fade show animate__animated animate__fadeInLeft'>
                                                    Déconnexion
                                                </span></Button>
                                            </Col>

                                            <Col lg={{ span: 8, offset: 2 }} md={12}>
                                                <iframe className='mt-5 ml-5 w-100' src="https://discord.com/widget?id=1101437640525488169&theme=dark" width="350" height="500" allowtransparency="true" frameBorder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>
                                            </Col>
                                        </Row>
                                    ) : (
                                        <Row>
                                            <Col xs={6}>
                                                <Button href="/connexion" className='btn btn-lg w-100 btn-warning content-home-no-mobile'><BiUserCircle className='mr-3' /><span className='text mx-1 text-black fade show animate__animated animate__fadeInLeft'>
                                                    Connexion
                                                </span></Button>
                                            </Col>
                                            <Col xs={6}>
                                                <Button href="/inscription" className='btn btn-lg w-100 btn-light content-home-no-mobile'><BiGroup /> <span className='text mx-1 text-black fade show animate__animated animate__fadeInLeft'>
                                                    Inscription
                                                </span></Button>
                                            </Col>
                                            <Col lg={{ span: 8, offset: 2 }} md={12}>
                                                <iframe className='mt-5 ml-5 w-100' src="https://discord.com/widget?id=1101437640525488169&theme=dark" width="350" height="500" allowtransparency="true" frameBorder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>
                                            </Col>
                                        </Row>
                                    )}




                                </Container>
                            </Col>
                        </Row>

                    </div >
                </Col>
                    <Col md={12}>
                        <Container className="my-5 text-dark">
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

                                <Col md={6} className='mt-5'>
                                    <h3>Une expérience de jeu fluide</h3>
                                    <p>Nous nous engageons à offrir une expérience de jeu fluide et équitable à tous les joueurs participants à nos tournois. Nous utilisons les dernières technologies pour garantir des temps de latence minimaux et une connexion stable.</p>
                                </Col>
                                <Col md={6} className='mt-5'>
                                    <h3>Des jeux populaires</h3>
                                    <p>Participez à des tournois pour certains des jeux les plus populaires, comme Rocket League et Valorant. Nous ajoutons régulièrement de nouveaux jeux à notre plateforme pour répondre aux demandes de notre communauté de joueurs.</p>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                    <footer>
                        <Footer color="footer-violet" color2="footer-violet2" />
                    </footer>

                </Row>
            </Container>

            <ToastContainer />



        </div >
    )
}
