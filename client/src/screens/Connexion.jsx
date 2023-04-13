import React, { useState } from 'react';

export const Connexion = () => {

    //const credential = {username : "",password : "",}

    /*     const [login, setlogin] = useState(
            {
                username:"",
                password:"",
            })
        const handleChanges = (event) => {
            const{value,name} = event.target;
            setlogin({
                ...login,
                [name]:value,
            })
            console.log(login)
        }
    */
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
                window.location.href = '/home';
            } else {
                // Afficher un message d'erreur si la réponse est un statut autre que 200 OK
                console.log('Erreur:', data.message);
            }
        } catch (error) {
            console.error(error);
        }
    };
    /*         axios.post('http://localhost:8080/validatePassword', {username: 'test', password: 'test2'})
                .then(({ data }) => {
                    console.log(data)
                })
                .catch(({ response }) => {
                    console.log(response)
                })
            console.log(event) */



    return (
        <div>
            <form method="POST" onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input type="text" name="username" onChange={(e) => { setUsername(e.target.value) }} />
                <label htmlFor="password">Password</label>
                <input type="password" name="password" onChange={(e) => { setPassword(e.target.value) }} />
                <input type="submit" name="submit" value="CONNEXION" />
            </form>
            <p>Pas encore inscrit ? <a href="/inscription">Cliquez ici</a></p>
        </div>
    )
}

