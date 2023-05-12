
import React, { useState, useEffect } from 'react';
import { Menu } from '../components/Menu';
import { Footer } from '../components/Footer';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

/* export const CreerTournois = () => {
    const [tournois, setTournois] = useState([]);

    useEffect(() => {
        async function fetchTournois() {
            const response = await fetch('/api/tournois');
            const tournoisData = await response.json();
            setTournois(tournoisData);
        }
        fetchTournois();
    }, []);

    async function ajouterTournoi(nom) {
        const response = await fetch('/api/tournois', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nom: nom }),
        });
        const nouveauTournoi = await response.json();
        setTournois([...tournois, nouveauTournoi]);
    }

    return (
        <div>
            <h1>Liste des tournois</h1>
            <ul>
                {tournois.map((tournoi) => (
                    <li key={tournoi.id}>
                        <Link to={`/tournois/${tournoi.id}`}>{tournoi.nom}</Link>
                        <button onClick={() => rejoindreTournoi(tournoi.id)}>Rejoindre</button>
                    </li>
                ))}
            </ul>
            <form onSubmit={(e) => {
                e.preventDefault();
                ajouterTournoi(e.target.nom.value);
                e.target.nom.value = '';
            }}>
                <label>Nom du tournoi:</label>
                <input type="text" name="nom" />
                <button type="submit">Ajouter un tournoi</button>
            </form>
        </div>
    );
}; */