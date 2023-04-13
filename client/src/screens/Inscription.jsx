import React, { useState } from 'react';

export const Inscription = () => {


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
            <form method="POST" onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input type="text" name="username" onChange={handleChanges} />
                <label htmlFor="email">Addresse mail</label>
                <input type="text" name="email" onChange={(handleChanges)} />
                <label htmlFor="password">Password</label>
                <input type="password" name="password" onChange={(handleChanges)} />
                <input type="submit" name="submit" value="S'INSCRIRE" />
            </form>
            <p>Dejà inscrit ? <a href="/connexion">Cliquez ici</a></p>
        </div>
    )
}

