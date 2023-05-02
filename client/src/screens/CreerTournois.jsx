
import React, { useState, useEffect } from 'react';
import { Menu } from '../components/Menu';
import { Footer } from '../components/Footer';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

export const CreerTournois = () => {
    const [title, setTitle] = useState("");
    const [participants, setParticipants] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const tournamentData = {
            title,
            participants,
            startDate,
            endDate,
        };

        /* try {
            const response = await fetch("http://localhost:8080/ws/validatePassword", {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin",
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
        } */

    };

    return (
        <div>
            <Menu />
            <section className="h-100 gradient-form conins-style mt-5">
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-xl-10">
                            <div className="card rounded-3 text-black">
                                <div className="row g-0">
                                    <div className="col-lg-6 d-flex align-items-center gradient-custom-2">
                                        <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                                            <h1 className="mb-5 text-center">Bienvenue chers Gamer sur notre page de connexion !</h1>
                                            <p className="small mb-0">Une fois connecté, vous pourrez participer à des compétitions de haut niveau dans différents jeux vidéo populaires,
                                                en affrontant d'autres joueurs du monde entier. Que vous soyez un amateur ou un professionnel,
                                                vous trouverez ici des tournois adaptés à votre niveau et à vos préférences.</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="card-body p-md-5 mx-md-4">

                                            <div className="text-center">

                                                <h4 className="mt-1 mb-5 pb-1">E-Sport Tournois</h4>
                                            </div>
                                            <form className="needs-validation" method="POST" onSubmit={handleSubmit}>
                                                <div className="form-floating mb-4">
                                                    <input type="text" name="username" className="form-control" placeholder="Pseudo" onChange={(e) => { setTitle(e.target.value) }} required />
                                                    <label className="form-label" htmlFor="username">Pseudo</label>
                                                </div>
                                                <div className="form-floating mb-4">
                                                    <input type="password" name="password" className="form-control" placeholder="Mot de passe" onChange={(e) => { setStartDate(e.target.value) }} required />
                                                    <label className="form-label" htmlFor="password">Mot de passe</label>
                                                </div>
                                                <div className="text-center pt-1 mb-0 pb-1">
                                                    <input type="submit" name="submit" className="btn btn-light btn-block fa-lg gradient-custom-2 mb-3 col-12" value="CONNEXION" />
                                                </div>
                                                <div className="text-center pt-1 mb-5 pb-1">
                                                    <a className="text-muted" href="#!">Mot de passe oublié ?</a>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-center pb-4">
                                                    <p className="mb-0 me-2">Pas encore  inscrit ?</p>
                                                    <a type="button" className="btn btn-outline-dark" href="/inscription">Créer un compte</a>
                                                </div>
                                                <a type="text" className='d-flex align-items-center justify-content-center' href="/home">Revenir a l'accueil</a>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <ToastContainer />
            <Footer />
        </div>
    );
};