
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
    useEffect(() => {
            fetchTournois();
    }, []);

    const fetchTournois = async () => {
        setTournois(await apiCall('GET', 'events'))
    };
    const rejoindreTournoi = async (tournoiId) => {
        let response = apiCall('POST', 'events/join', {
            tournois_id: tournoiId
        })

        if (response) {
            toast.success('Vous avez bien rejoin le tournois !', {
                position: toast.POSITION.TOP_RIGHT
            });
        } else {    
            toast.error("Problème lors de l'inscription au tournois.", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    };

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
                                                    <Button variant="danger">
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
                    <ToastContainer />
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