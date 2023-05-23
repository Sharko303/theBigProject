import React, { useState, useEffect } from 'react';
import { Menu } from '../components/Menu';
import { Footer } from '../components/Footer';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { getCookieValue } from '../components/Cookie';

export const Connexion = () => {
    // on change le titre de notre page
    document.title = "E-Sport | Connexion";

    const token = localStorage.getItem('token');

    const authenticationValue = getCookieValue('Authentification');

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(username, password);
        try {
            const response = await fetch("http://localhost:8080/ws/validatePassword", {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                redirect: "follow",
                referrerPolicy: "no-referrer",
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (data.status === 'success') {
                // Stocker le token dans le stockage local du navigateur
                localStorage.setItem('token', data.token);
                // Rediriger l'utilisateur vers une nouvelle page si la réponse est un statut 200 OK
                window.location.href = '/home?success=true';
            } else {
                // Afficher un message d'erreur si la réponse est un statut autre que 200 OK

                toast.error(data.message, {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        } catch (error) {
            console.error(error);
        }
    };
    const location = useLocation();

    let countToast = 0; // on compte les toast pour éviter d'en avoir plus d'1

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const success = queryParams.get('success');
        const error = queryParams.get('error');

        if (success === 'true' && countToast < 1) {
            toast.success('Votre compte est activé, veuillez vous connecter.');
            console.log('toast');
            console.log(countToast)
            countToast = 1
        } else if (error === "already_confirmed" && countToast < 1) {
            toast.warning('Votre compte est déjà activé.');
            countToast = 1
        } else if (error === "true" && countToast < 1) {
            toast.error('Un problème est survenue lors de l\'activation de votre compte.');
            countToast = 1
        }
    }, [location.search]);

    return (

        <div>
            {/* <Menu color="navbar-dark" scroll="navbar-scrolled" colornav="navcolor" noscroll="noscroll" /> */}
            <Menu />
            <ToastContainer />
            {authenticationValue ? (
                <div className='body-space'>
                    <p className='text-center p-5'>Vous êtes déjà connecté !</p>
                </div>
            ) : (
                <section className="h-100 gradient-form conins-style">
                    <Container className="py-5 h-100">
                        <Row className="d-flex justify-content-center align-items-center h-100">
                            <Col xl={10}>
                                <Card className="rounded-3 text-black">
                                    <Row className="g-0">
                                        <Col lg={6} className="d-flex align-items-center gradient-custom-2">
                                            <div className="text-black px-3 py-4 p-md-5 mx-md-4">
                                                <h1 className="mb-5 text-center">Bienvenue chers Gamer sur notre page de connexion !</h1>
                                                <p className="small mb-0">Une fois connecté, vous pourrez participer à des compétitions de haut niveau dans différents jeux vidéo populaires, en affrontant d'autres joueurs du monde entier. Que vous soyez un amateur ou un professionnel, vous trouverez ici des tournois adaptés à votre niveau et à vos préférences.</p>
                                            </div>
                                        </Col>
                                        <Col lg={6}>
                                            <Card.Body className="p-md-5 mx-md-4">
                                                <div className="text-center">
                                                    <h4 className="mt-1 mb-5 pb-1">E-Sport Tournois</h4>
                                                </div>
                                                <Form className="needs-validation" method="POST" onSubmit={handleSubmit}>
                                                    <Form.Group className="form-floating mb-4">
                                                        <Form.Control type="text" name="username" placeholder="Pseudo" value={username} onChange={(e) => setUsername(e.target.value)} required />
                                                        <Form.Label>Pseudo</Form.Label>
                                                    </Form.Group>
                                                    <Form.Group className="form-floating mb-4">
                                                        <Form.Control type="password" name="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                                        <Form.Label>Mot de passe</Form.Label>
                                                    </Form.Group>
                                                    <div className="text-center pt-1 mb-0 pb-1">
                                                        <Button type="submit" name="submit" className="btn btn-light btn-block fa-lg gradient-custom-2 mb-3 col-12">CONNEXION</Button>
                                                    </div>
                                                    <div className="text-center pt-1 mb-5 pb-1">
                                                        <a className="text-muted" href="#!">Mot de passe oublié ?</a>
                                                    </div>
                                                    <div className="d-flex align-items-center justify-content-center pb-4">
                                                        <p className="mb-0 me-2">Pas encore inscrit ?</p>
                                                        <a type="button" className="btn btn-outline-dark" href="/inscription">Créer un compte</a>
                                                    </div>
                                                    <a type="text" className='d-flex align-items-center justify-content-center' href="/home">Revenir a l'accueil</a>
                                                </Form>
                                            </Card.Body>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </section>

            )}

            <Footer color="footer-violet" color2="footer-violet2" />
        </div>
    )
}

