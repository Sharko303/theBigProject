
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
/* import { DatePicker } from "react-responsive-datepicker"; */
import { GameSelect } from '../components/GameSelect';
import { apiCall } from '../Javascript/apiCall';
import MyDatePicker from '../components/DatePicker';

export const CreerTournois = () => {
    const [nomTournois, setNomTournois] = useState('');
    const [dateTournoisStart, setDateTournoisStart] = useState(new Date());
    const [dateTournoisEnd, setDateTournoisEnd] = useState(new Date());
    const [heureTournois, setHeureTournois] = useState('');
    const [selectedGame, setSelectedGame] = useState(""); // Ajouter un état pour la valeur sélectionnée

    const token = document.cookie

    const handleGameChange = (game) => {
        setSelectedGame(game);
    }
    const ajouterTournois = async (event) => {
        event.preventDefault();
        const response = await apiCall('POST', 'events',
            {
                name: nomTournois,
                game: selectedGame,
                date_start: dateTournoisStart,
                date_stop: dateTournoisEnd,
                heure: heureTournois,
                token: token,
            })
            if(response) {
                toast.success('Votre tournois a bien était créé.');
            }else {
                toast.error('ERREUR lors de la création de votre tournois.');
            }
    };
    return (
        <Container>
            <h1>Créer un Tournois</h1>
            <Form onSubmit={(e) => {
                e.preventDefault();
                ajouterTournois();
            }}>
                <GameSelect handleGameChange={handleGameChange}></GameSelect>
                <Form.Group as={Row}>
                    <Form.Label column sm={2}>
                        Nom du Tournois :
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control type="text" placeholder="Entrez le nom du Tournois" value={nomTournois} onChange={(e) => setNomTournois(e.target.value)} required />
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column sm={2}>
                        Date début du Tournois :
                    </Form.Label>
                    <Col sm={10}>
                        <MyDatePicker selectedDate={dateTournoisStart} onChange={(date) => setDateTournoisStart(date)} />
                    </Col>
                    {/* </Col> */}
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column sm={2}>
                        Date fin du Tournois :
                    </Form.Label>
                    <Col sm={10}>
                        <MyDatePicker selectedDate={dateTournoisEnd} onChange={(date) => setDateTournoisEnd(date)} />
                    </Col>
                </Form.Group>

                <Form.Group as={Row}>
                    <Form.Label column sm={2}>
                        Heure du Tournois :
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control type="time" placeholder="Entrez l'heure du Tournois" value={heureTournois} onChange={(e) => setHeureTournois(e.target.value)} required />
                    </Col>
                </Form.Group>
                <Button variant="primary" type="submit" onClick={ajouterTournois}>
                    Créer le Tournois
                </Button>
            </Form>
            <ToastContainer />
        </Container>
    );
};