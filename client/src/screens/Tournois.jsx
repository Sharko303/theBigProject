
import React, { useState, useEffect } from 'react';
import { Card, Button, ListGroup, Container, Row, Col } from 'react-bootstrap';
import { Menu } from '../components/Menu';
import { Footer } from '../components/Footer';
import Img from '../images/fond-violet.webp'
import { BiPlus } from 'react-icons/bi';
import { ToastContainer, toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

export const Tournois = () => {
    const [tournois, setTournois] = useState([]);
    const [tournoisInscrits, setTournoisInscrits] = useState([]);

    useEffect(() => {
        fetchTournois();
    }, []);

    const fetchTournois = async () => {
        try {
            const numTournois = 1;
            const response = await fetch(`http://localhost:8080/ws/tournois/${numTournois}`, {

            });
            const data = await response.json();

            console.log(data.participantIds)
            if (data.status === 'success') {
                const participants = data.participantIds; // Remplacez 'participantIds' par la propriété contenant les participants dans votre réponse API
                const eliminationTable = generateElimination(participants);

                // Faites quelque chose avec le tableau d'élimination, comme l'afficher à l'écran
                console.log(eliminationTable);
            } else {
                console.log('Erreur lors de la récupération des participants');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des tournois :', error);
        }
    };
    function generateElimination(playerIds) {
        let matches = [];
      
        // Organize players in pairs for the first round
        const pairs = [];
        for (let i = 0; i < playerIds.length; i += 2) {
          pairs.push([playerIds[i], playerIds[i + 1]]);
        }
      
        // Create matches for the first round
        for (const pair of pairs) {
          const match = {
            players: pair,
            winner: null,
          };
          matches.push(match);
        }
      
        // Generate matches for subsequent rounds
        while (pairs.length > 1) {
          const newPairs = [];
          for (let i = 0; i < pairs.length; i += 2) {
            const winner1 = pairs[i][0];
            const winner2 = pairs[i + 1][0];
            const match = {
              players: [winner1, winner2],
              winner: null,
            };
            newPairs.push([winner1, winner2]);
            matches.push(match);
          }
          pairs = newPairs;
        }
      
        return matches;
      }
        let estInscrit

        return (
            <div>
                <Menu />
                <Container fluid className='body-space ' >
                    <p>Bonjour je suis un test</p>
                </Container>
                <Footer color="footer-violet" color2="footer-violet2" />
            </div>
        );
    };
