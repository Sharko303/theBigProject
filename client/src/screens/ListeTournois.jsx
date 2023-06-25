
import React, { useState, useEffect, useContext } from 'react';
import { Card, Button, ListGroup, Container, Row, Col } from 'react-bootstrap';
import { Menu } from '../components/Menu';
import { Footer } from '../components/Footer';
import Img from '../images/fond-violet.webp'
import { BiPlus } from 'react-icons/bi';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { apiCall } from '../Javascript/apiCall';
import UserContext from './../components/UserContext';
export const ListeTournois = () => {
    const [tournois, setTournois] = useState([]);
    const [tournoisInscrits, setTournoisInscrits] = useState([]);

    const user = useContext(UserContext);
    console.log(user)
    useEffect(() => {
            fetchTournois();
    }, []);

    const fetchTournois = async () => {

        setTournois(await apiCall('GET', 'events'))
        console.log(tournois)
    };
    const rejoindreTournoi = async (tournoiId) => {
        console.log(tournoiId);
        let response = apiCall('POST', 'events/join', {
            tournois_id: tournoiId
        })

        if (response) {
            console.log("Success rejoin !");
            toast.success('Création de nouveau tournois effectué !', {
                position: toast.POSITION.TOP_RIGHT
            });
        } else {    
            console.log('Echec lors de l inscription au tournois veuillez réessayer :');

            toast.error("Problème lors de l'inscription au tournois.", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
        /* const data = await response.json();
        if (data.status === 'success') {
            // Rediriger l'utilisateur vers une nouvelle page si la réponse est un statut 200 OK
            //window.location.href = '/home';
            console.log("Success rejoin !");
            toast.success('Création de nouveau tournois effectué !', {
                position: toast.POSITION.TOP_RIGHT
            });
        } else {
            // Afficher un message d'erreur si la réponse est un statut autre que 200 OK
            console.log('Echec lors de l inscription au tournois veuillez réessayer :', data.message);

            toast.error(data.message, {
                position: toast.POSITION.TOP_RIGHT
            });
        }
        // Logique pour rejoindre le tournoi avec l'ID donné
        console.log('Rejoindre tournoi avec ID :', tournoiId); */
    };

    let estInscrit
    console.log(tournois)
    return (
        <div>
            <Menu />
            {user ? (
                <Container fluid className='body-space ' >

                    <div className="hero-section"
                        style={{
                            paddingTop: '50px',
                            backgroundImage: `url(${Img})`,
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                            height: '100%',
                            backgroundAttachment: 'fixed',
                        }}>
                        <Row>
                            <Col lg={8} md={4}>
                                <Container className="text-center" >
                                    <Card className='bg-warning'>
                                        <Card.Title><h1>Liste de tournois</h1></Card.Title>
                                    </Card>
                                </Container>

                            </Col>
                            <Col lg={4}>
                                <Button href="/creertournois" className='btn btn-lg w-100 btn-success content-home-no-mobile text-black'><BiPlus className='mr-3' /><span className='text mx-1 text-black fade show animate__animated animate__fadeInLeft'>
                                    Créer un tournois
                                </span></Button>
                            </Col>
                            <Col lg={4}>
                                <img className='' />
                            </Col>
                            {tournois.map((tournoi) => {
                                const estInscrit = tournoisInscrits.includes(tournoi.id);

                                return (
                                    <Col lg={6} md="12" key={tournoi.id}>
                                        <Card className="mt-5 card-yellow" >
                                            <Card.Body>
                                                <Card.Title>{tournoi.name}</Card.Title>
                                                <ListGroup className="list-group-flush list-group-tournois">
                                                    <ListGroup.Item>Jeu : {tournoi.game}</ListGroup.Item>
                                                    <ListGroup.Item>Date de début : {tournoi.date_start}</ListGroup.Item>
                                                    {/* <ListGroup.Item>Date de fin : {tournoi.date_stop}</ListGroup.Item> */}
                                                    <ListGroup.Item>Heure de début : {tournoi.heure}</ListGroup.Item>
                                                    <ListGroup.Item>Créé par : {tournoi.user_creator}</ListGroup.Item>
                                                </ListGroup>

                                                {estInscrit ? (
                                                    <Button variant="danger" onClick={() => console.log("on quitte")}>
                                                        Quitter
                                                    </Button>
                                                ) : (
                                                    <div>
                                                        <Button variant="success" onClick={() => rejoindreTournoi(tournoi.id)}>
                                                            Rejoindre
                                                        </Button>
                                                    </div>
                                                )}
                                                <Link to={`/tournois?id=${tournoi.id}`} className='btn btn-info'>
                                                    Voir
                                                </Link>
                                                <hr />
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                );
                            })}

                        </Row>
                    </div>
                </Container>
            ) : 
            (
                <p className='mt-5 mb-5 text-center'>Vous devez être connecté pour accèder a cette page <a href='/connexion'> SE CONNECTER </a></p>
            )}

            <Footer color="footer-violet" color2="footer-violet2" />
        </div>
    );
};

export default ListeTournois;