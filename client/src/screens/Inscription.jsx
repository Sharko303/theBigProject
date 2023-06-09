import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { Menu } from '../components/Menu';
import { Theme } from '../components/Theme';
import { Footer } from '../components/Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiCall } from '../Javascript/apiCall';


export const Inscription = () => {
    // on change le titre de notre page
    document.title = "E-Sport | Inscription";

    const handleChanges = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        setInscription({
            ...inscription,
            [name]: value,
        });
        console.log(inscription);
    }
    const [inscription, setInscription] = useState({
        username: "",
        password: "",
        passwordRetype: "",
        email: "",
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(inscription.username, inscription.password, inscription.email);
        let response = await apiCall('POST', 'users', { 
            username: inscription.username,
            password: inscription.password,
            passwordRetype: inscription.passwordRetype,
            email: inscription.email, 
        })
        /* try {
            const response = await fetch("http://localhost:8080/ws/users", {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                },
                redirect: "follow",
                referrerPolicy: "no-referrer",
                body: JSON.stringify({
                    username: inscription.username,
                    password: inscription.password,
                    passwordRetype: inscription.passwordRetype,
                    email: inscription.email,
                }),
            });
            const data = await response.json();
            if (data.status === 'success') {
                // Rediriger l'utilisateur vers une nouvelle page si la réponse est un statut 200 OK
                //window.location.href = '/home';
                console.log("inscrit")
                toast.success('Inscription effectué, un mail de confirmation vous a été envoyez', {
                    position: toast.POSITION.TOP_RIGHT
                });
            } else {
                // Afficher un message d'erreur si la réponse est un statut autre que 200 OK
                console.log('Non inscrit :', data.message);

                toast.error(data.message, {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        } catch (error) {
            console.error(error);
        } */
    };

    return (
        <div>
            {/* <Menu color="navbar-dark" scroll="navbar-scrolled" colornav="navcolor" noscroll="noscroll" /> */}
            <Menu />
            <ToastContainer />
            <div className='body-space'>
                <section className="h-100 gradient-form conins-style">
                    <Row>
                        <Col lg={1} md={1}>
                            <Container className="text-center" >
                                <Card className='w-100 title-background bg-warning'>
                                    <Card.Title><h1>Test</h1></Card.Title>
                                </Card>
                            </Container>
                        </Col>
                        <Container className="py-5 h-100 ">
                            <Row className="d-flex justify-content-center align-items-center h-100">
                                <Col xl={10}>
                                    <Card className="rounded-3 text-black">
                                        <Row className="g-0">
                                            <Col lg={6} className="d-flex align-items-center gradient-custom-2">
                                                <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                                                    <h1 className="mb-5 text-center">Bienvenue sur notre site de tournois de jeux vidéo !</h1>
                                                    <p className="small mb-0">Nous sommes ravis de vous accueillir dans notre communauté de joueurs passionnés.Ici,
                                                        vous pourrez participer à des compétitions de haut niveau dans différents jeux vidéo populaires,
                                                        en affrontant d'autres joueurs du monde entier. Que vous soyez un amateur ou un professionnel,
                                                        vous trouverez ici des tournois adaptés à votre niveau et à vos préférences.</p>
                                                </div>
                                            </Col>
                                            <Col lg={6}>
                                                <Card.Body className="p-md-5 mx-md-4">
                                                    <div className="text-center">
                                                        <h4 className="mt-1 mb-5 pb-1">Vous êtes pret en entrer dans le Game ?</h4>
                                                    </div>
                                                    <Form className="needs-validation" method="POST" onSubmit={handleSubmit}>
                                                        <p>Merci d'entrez vos informations :</p>
                                                        <Form.Group className="form-floating mb-4">
                                                            <Form.Control type="text" name="username" placeholder="Entrer un pseudo" onChange={handleChanges} required />
                                                            <Form.Label htmlFor="pseudo">Pseudo</Form.Label>
                                                        </Form.Group>
                                                        <Form.Group className="form-floating mb-4">
                                                            <Form.Control type="email" name="email" placeholder="Entrer une adresse email" onChange={(handleChanges)} required />
                                                            <Form.Label htmlFor="email">Addresse mail</Form.Label>
                                                        </Form.Group>
                                                        <Form.Group className="form-floating mb-4">
                                                            <Form.Control type="password" name="password" placeholder="Entrer un mot de passe" onChange={(handleChanges)} required />
                                                            <Form.Label htmlFor="password" >Mot de passe</Form.Label>
                                                        </Form.Group>
                                                        <Form.Group className="form-floating mb-4">
                                                            <Form.Control type="password" name="passwordRetype" placeholder="Confirmer votre mot de passe" onChange={(handleChanges)} required />
                                                            <Form.Label htmlFor="passwordRetype" >Re-tapez votre mot de passe</Form.Label>
                                                        </Form.Group>
                                                        <div className="text-center pt-1 mb-5 pb-1">
                                                            <Button className="btn btn-light btn-block fa-lg gradient-custom-2 mb-3 col-12" type="submit" name="submit">
                                                                S'INSCRIRE
                                                            </Button>
                                                        </div>
                                                        <div className="d-flex align-items-center justify-content-center pb-4">
                                                            <p className="mb-0 me-2">Dejà inscrit ?</p>
                                                            <a type="button" className="btn btn-outline-dark" href="/connexion">Se connecter</a>
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
                    </Row>
                </section>


                <Footer color="footer-violet" color2="footer-violet2"/>
            </div>
        </div>
    )
}

