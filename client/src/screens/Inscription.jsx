import React, { useState } from 'react';
import { Menu } from '../components/Menu';
import { Theme } from '../components/Theme';
import {Footer} from '../components/Footer';

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
        email: "",
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(inscription.username, inscription.password, inscription.email);
        try {
            const response = await fetch("http://localhost:8080/ws/inscription", {
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
                    email: inscription.email,
                }),
            });
            const data = await response.json();
            if (data.status === 'success') {
                // Rediriger l'utilisateur vers une nouvelle page si la réponse est un statut 200 OK
                //window.location.href = '/home';
                console.log("inscrit")
            } else {
                // Afficher un message d'erreur si la réponse est un statut autre que 200 OK
                console.log('Erreur:', data.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <Menu color="navbar-dark" scroll="navbar-scrolled" colornav="navcolor"/>
            <section className="h-100 gradient-form conins-style mt-5">
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-xl-10">
                            <div className="card rounded-3 text-black">
                                <div className="row g-0">
                                <div className="col-lg-6 d-flex align-items-center gradient-custom-2">
                                        <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                                            <h1 className="mb-5 text-center">Bienvenue sur notre site de tournois de jeux vidéo !</h1>
                                            <p className="small mb-0">Nous sommes ravis de vous accueillir dans notre communauté de joueurs passionnés.Ici,
                                             vous pourrez participer à des compétitions de haut niveau dans différents jeux vidéo populaires, 
                                             en affrontant d'autres joueurs du monde entier. Que vous soyez un amateur ou un professionnel, 
                                             vous trouverez ici des tournois adaptés à votre niveau et à vos préférences.</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="card-body p-md-5 mx-md-4">
                                            
                                            <div className="text-center">
                                                <h4 className="mt-1 mb-5 pb-1">Vous êtes pret en entrer dans le Game ?</h4>
                                            </div>

                                            <form className="needs-validation" method="POST" onSubmit={handleSubmit}>
                                                <p>Merci d'entrez vos informations :</p>
                                                
                                                <div className="form-floating mb-4">
                                                    <input type="text" name="username" className="form-control" placeholder="Entrer un pseudo" onChange={handleChanges} />
                                                    <label className="form-label" htmlFor="pseudo">Pseudo</label>
                                                </div>
                                                <div className="form-floating mb-4">
                                                    <input type="text" name="email" className="form-control" placeholder="Entrer une adresse email" onChange={(handleChanges)} />
                                                    <label className="form-label" htmlFor="email">Addresse mail</label>
                                                </div>
                                                <div className="form-floating mb-4">
                                                    <input type="password" className="form-control" name="password" placeholder="Entrer un mot de passe" onChange={(handleChanges)} />
                                                    <label className="form-label" htmlFor="password" >Mot de passe</label>
                                                </div>
                                                <div className="text-center pt-1 mb-5 pb-1">
                                                    <input className="btn btn-light btn-block fa-lg gradient-custom-2 mb-3 col-12" type="submit" name="submit" value="S'INSCRIRE" />
                                                </div>
                                                <div className="d-flex align-items-center justify-content-center pb-4">
                                                    <p className="mb-0 me-2">Dejà inscrit ?</p>
                                                    <a type="button" className="btn btn-outline-dark" href="/connexion">Se connecter</a>
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
            <Theme />
            <Footer color = "bg-dark"/>
        </div>
    )
}

