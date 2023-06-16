
import React, { useState, useEffect } from 'react';
import { Card, Button, ListGroup, Container, Row, Col, Table, Form } from 'react-bootstrap';
import { Menu } from '../components/Menu';
import { Footer } from '../components/Footer';
import Img from '../images/fond-violet.webp'
import { BiPlus } from 'react-icons/bi';
import { ToastContainer, toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { Bracket, BracketGame } from 'react-tournament-bracket';
import { useLocation } from 'react-router-dom';
import { ScoreForm } from "../components/ScoreForm"
import { apiCall } from '../Javascript/apiCall';

export const Tournois = () => {
  const [eliminationTable, setEliminationTable] = useState([]);
  const [score1, setScore1] = useState('');
  const [score2, setScore2] = useState('');

  const game1 = {
    id: "1",
    name: "semi-finals",
    scheduled: Number(new Date()),
    sides: {
      home: {
        team: {
          id: "11",
          name: "Team q"
        },
        score: {
          score: 1

          /* export const ListeTournois = () => {
              const [tournois, setTournois] = useState([]);
              const [tournoisInscrits, setTournoisInscrits] = useState([]);
               useEffect(() => {
                  cookie.checkCookieAndRedirect();
                }, []); 
          
              useEffect(() => {
                  cookie.checkCookieAndRedirect();
                  fetchTournois();
                  
              }, []);
          
              const fetchTournois = async () => {
                  try {
                      const token = document.cookie;
                      console.log(token);
                      const response = await fetch('http://localhost:8080/ws/getTournois', {
                          headers: {
                              Authorization: `Bearer ${token}`,
                          },
                      });
                      const data = await response.json();
                       if (data.status === 'success') {
                          setTournois(data.tournois);
          
                          // Filtrer les tournois auxquels vous êtes inscrit
                          const tournoisInscrits = data.tournoisInscrit;
                          setTournoisInscrits(tournoisInscrits);
                          console.log("tournois : ", tournoisInscrits)
                      } else {
                          // Afficher un message d'erreur si la réponse est un statut autre que 200 OK
                          console.log('Tournois non récupérés');
                          toast.error(data.message, {
                              position: toast.POSITION.TOP_RIGHT,
                          });
                      } 
                  } catch (error) {
                      console.error('Erreur lors de la récupération des tournois :', error); */
        }
      },
      visitor: {
        team: {
          id: "12",
          name: "Team bosta"
        },
        score: {
          score: 0
        }
      }
    }
  }
  const location = window.location;
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  useEffect(() => {
    if (id) {
      fetchTournois(id);
    }

  }, []);

  const fetchTournois = async (id) => {
    let response = await apiCall('GET', `events/${id}`)
    if (response) {
      //toast
      console.log('test', response);
      const participants = response.user_ids;
      const participantNames = response.participantNames;
      console.log('participants:', participants);
      console.log('participantNames:', participantNames);
      const eliminationTable = await generateElimination(participants);
      setEliminationTable(eliminationTable);
    }
    /* try {
      console.log('NUMERO :', id);
      const response = await fetch(`http://localhost:8080/ws/tournois/${id}`);
      const data = await response.json();

      if (data.status === 'success') {
        const participants = data.participantIds;
        const participantNames = data.participantNames;
        console.log('participants:', participants);
        console.log('participantNames:', participantNames);
        const eliminationTable = await generateElimination(participantNames);
        setEliminationTable(eliminationTable);
      } else {
        console.log('Erreur lors de la récupération des participants');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des tournois :', error);
    } */
  };

  function generateElimination(playerNames) {
    let matches = [];

    const getCurrentDate = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Helper function to generate matches recursively
    const generateMatches = (players) => {
      if (players.length === 1) {
        // Single player remains, the winner
        return {
          id: 1,
          name: "finals",
          scheduled: getCurrentDate(),
          players: [],
          winner: null,
          sides: {
            home: {
              team: {
                id: null,
                name: players[0],
              },
              score: {
                score: 0,
              },
            },
            visitor: {
              team: {
                id: null,
                name: "",
              },
              score: {
                score: 0,
              },
            },
          },
        };
      }

      const newPlayers = [];
      const numMatches = Math.ceil(players.length / 2);

      for (let i = 0; i < numMatches; i++) {
        const player1Name = players[i * 2] || "";
        const player2Name = players[i * 2 + 1] || "";

        const match = {
          id: i + 1,
          name: "semi-finals",
          scheduled: getCurrentDate(),
          players: [],
          winner: null,
          sides: {
            home: {
              team: {
                id: null,
                name: player1Name,
              },
              score: {
                score: 0,
              },
            },
            visitor: {
              team: {
                id: null,
                name: player2Name,
              },
              score: {
                score: 0,
              },
            },
          },
        };
        matches.push(match);

        const winnerName = ""; // Placeholder for the winner of the match
        newPlayers.push(winnerName);
      }

      return generateMatches(newPlayers);
    };

    generateMatches(playerNames);

    return matches;
  }

  console.log('eliminationTable[0] :', eliminationTable[0])
  console.log('autre', game1)
  console.log('eliminationTable :', eliminationTable)
  /* console.log("matches : ",match) */

  const [score, setScore] = useState('');

  const handleScore1Change = (event) => {
    setScore1(event.target.value);
  };

  const handleScore2Change = (event) => {
    setScore2(event.target.value);
  };


  const handleSubmitScore = async (event) => {
    event.preventDefault();
  
    const data = {
      score1: score1,
      score2: score2
    };
  
    try {
      const response = await fetch('http://localhost:8080/ws/addscore/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
  
      const dataReturn = await response.json();

      if (dataReturn.status === 'success') {
        // Le score a été soumis avec succès
        console.log('Scores soumis avec succès');
        // Effectuez ici toute autre action nécessaire après l'envoi des scores
      } else {
        console.log('Une erreur s\'est produite lors de la soumission des scores');
      }
    } catch (error) {
      console.log('Une erreur s\'est produite lors de la soumission des scores :', error);
    }
  };
  return (
    <div>
      <Container fluid className='body-space'>
        <p>Bonjour je suis un test</p>
        {eliminationTable.length > 0 ? (
          <div className="grid-container">
            {eliminationTable.map((game, index) => (
              <React.Fragment key={index}>
                <div className={`grid-item column-${index + 1}`}>
                  <Bracket game={game} />
                </div>
              </React.Fragment>
            ))}
          </div>
        ) : (
          <p>Tournois INTROUVABLE !</p>
        )}
      </Container>
      {/* Saisie de score*/} 
      <Form onSubmit={handleSubmitScore}>
        <Form.Group controlId="score1">
          <Form.Label>Saisir le score 1 :</Form.Label>
          <Form.Control
            type="number"
            placeholder="Entrez le score 1"
            value={score1}
            onChange={handleScore1Change}
          />
        </Form.Group>
        <Form.Group controlId="score2">
          <Form.Label>Saisir le score 2 :</Form.Label>
          <Form.Control
            type="number"
            placeholder="Entrez le score 2"
            value={score2}
            onChange={handleScore2Change}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Soumettre
        </Button>
      </Form>
      <ScoreForm />
    </div>
  );
};