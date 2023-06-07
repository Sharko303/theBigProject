
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

export const Tournois = () => {
  const [eliminationTable, setEliminationTable] = useState([]);
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

  }, [id]);

  const fetchTournois = async (id) => {
    try {
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
    }
  };

  async function generateElimination(playerNames) {
    let matches = [];

    // Create matches for each pair
    for (let i = 0; i < playerNames.length; i++) {
      const pair = playerNames[i];
      const player1Name = pair.joueur1;
      const player2Name = pair.joueur2;

      const match = {
        id: i + 1,
        name: "semi-finals",
        scheduled: new Date().toLocaleDateString(),
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
    }

    // Generate matches for subsequent rounds
    while (playerNames.length > 1) {
      const newPlayerNames = [];
      for (let i = 0; i < playerNames.length; i += 2) {
        const pair1 = playerNames[i];
        const pair2 = playerNames[i + 1];

        if (pair2) {
          // Check if winners from previous matches are available
          const playerName1 = pair1.winner ? pair1.name : "";
          const playerName2 = pair2.winner ? pair2.name : "";

          const match = {
            id: i + 1,
            players: [],
            winner: null,
            sides: {
              home: {
                team: {
                  id: null,
                  name: playerName1,
                },
                score: {
                  score: 0,
                },
              },
              visitor: {
                team: {
                  id: null,
                  name: playerName2,
                },
                score: {
                  score: 0,
                },
              },
            },
          };
          newPlayerNames.push({ joueur1: playerName1, joueur2: playerName2 });
          matches.push(match);
        } else {
          // Handle odd number of players, bye for one player
          newPlayerNames.push(pair1);
        }
      }
      playerNames = [...newPlayerNames];
    }

    return matches;
  }
  console.log('eliminationTable[0] :', eliminationTable[0])
  console.log('autre', game1)
  console.log('eliminationTable :', eliminationTable)


  const [score, setScore] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Faites quelque chose avec le score, comme l'envoyer à votre backend
    console.log('Score soumis :', score);
  };

  const handleScoreChange = (event) => {
    setScore(event.target.value);
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
      <ScoreForm />
    </div>
  );
};