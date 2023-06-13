
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { Menu } from '../components/Menu';
import { Footer } from '../components/Footer';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
/* import { DatePicker } from "react-responsive-datepicker"; */
import { GameSelect } from '../components/GameSelect';
import * as cookie from '../components/Cookie';
import { BiJoystick } from 'react-icons/bi';
import { apiCall } from '../Javascript/apiCall';
import MyDatePicker from '../components/DatePicker';

export const CreerTournois = () => {
    const [nomTournois, setNomTournois] = useState('');
    const [dateTournoisStart, setDateTournoisStart] = useState(new Date());
    const [dateTournoisEnd, setDateTournoisEnd] = useState(new Date());
    const [heureTournois, setHeureTournois] = useState('');
    const [isOpenStart, setIsOpenStart] = useState(false);
    const [isOpenEnd, setIsOpenEnd] = useState(false);
    const [selectedGame, setSelectedGame] = useState(""); // Ajouter un état pour la valeur sélectionnée
    //const today = new Date();
    // const nextYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()); // Pour limiter la date 

    //const token = localStorage.getItem('token');
    const token = document.cookie

    const handleInputClickStart = () => {
        setIsOpenStart(true);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        setDateTournoisStart(today);
    };

    const handleDatePickerChangeStart = (date) => {
        if (!date) { // vérifier si la date est nulle ou indéfinie
            setIsOpenStart(false);
            setDateTournoisStart('');
        } else {
            setIsOpenStart(false);
            const formattedDate = date.toISOString().slice(0, 10);
            setDateTournoisStart(formattedDate);
        }
    };

    const handleInputClickEnd = () => {
        setIsOpenEnd(true);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        setDateTournoisEnd(today);
    };

    const handleDatePickerChangeEnd = (date) => {
        if (!date) { // check if date is null or undefined
            setIsOpenEnd(false);
            setDateTournoisEnd('');
        } else {
            setIsOpenEnd(false);
            const formattedDate = date;
            setDateTournoisEnd(formattedDate);
        }
    };


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
        /* console.log(nomTournois, selectedGame, dateTournoisStart, dateTournoisEnd, heureTournois, token);

        try {
            const response = await fetch("http://localhost:8080/ws/creertournois", {
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
                    nom: nomTournois,
                    game: selectedGame,
                    date_start: dateTournoisStart,
                    date_end: dateTournoisEnd,
                    heure: heureTournois,
                    token: token,

                }),
            });
            const data = await response.json();
            if (data.status === 'success') {
                // Rediriger l'utilisateur vers une nouvelle page si la réponse est un statut 200 OK
                //window.location.href = '/home';
                console.log("Success!");
                toast.success('Création de nouveau tournois effectué !', {
                    position: toast.POSITION.TOP_RIGHT
                });
            } else {
                // Afficher un message d'erreur si la réponse est un statut autre que 200 OK
                console.log('Echec création de votre tournois veuillez réessayer :', data.message);

                toast.error(data.message, {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        } catch (error) {
            console.error(error);
        } */
    };
    return (
        <Container>
            <Col>
                <Button href="/creertournois" className='btn btn-lg w-100 btn-success content-home-no-mobile text-black'><BiJoystick className='mr-3' /><span className='text mx-1 text-black fade show animate__animated animate__fadeInLeft'>
                    Listes tournois
                </span></Button>
            </Col>
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
                    {/* <Col sm={10}>
                        <Form.Control
                            type="date"
                            placeholder="Entrez la date du Tournois"
                            value={dateTournoisStart ? new Date(dateTournoisStart) : ''}
                            onClick={handleInputClickStart}
                            onChange={(e) => setDateTournoisStart(e.target.value)}
                            required
                        /> */}
                    {/* <DatePicker
                            isOpen={isOpenStart}
                            title="Date de tournois"
                            onClose={() => setIsOpenStart(false)}
                            onChange={handleDatePickerChangeStart}
                            defaultValue={dateTournoisStart}
                            colorScheme='purple'
                            selected={dateTournoisStart}
                            //minDate={new Date('12/05/2023')}
                            //maxDate={nextYear}
                            clickOutsideToClose={() => setIsOpenStart(false)}
                            yearDropdownItemNumber={2}
                        /> */}
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
                        {/* <Form.Control
                            type="text"
                            placeholder="Entrez la date du Tournois"
                            value={dateTournoisStart ? new Date(dateTournoisStart) : ''}
                            onClick={handleInputClickStart}
                            onChange={(e) => setDateTournoisStart(e.target.value)}
                            required
                        /> */}
                        {/*  <DatePicker
                            isOpen={isOpenEnd}
                            title="Date de tournois"
                            onClose={() => setIsOpenEnd(false)}
                            onChange={handleDatePickerChangeEnd}
                            defaultValue={dateTournoisEnd}
                            colorScheme='purple'
                            selected={dateTournoisEnd}
                            //minDate={new Date('12/05/2023')}
                            //maxDate={nextYear}
                            clickOutsideToClose={() => setIsOpenEnd(false)}
                            yearDropdownItemNumber={2}
                        /> */}

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
        </Container>
    );
};