
import React, { useState, useEffect } from 'react';
import { Card, Button, ListGroup, Container, Row, Col, Table } from 'react-bootstrap';
import { Menu } from '../components/Menu';
import { Footer } from '../components/Footer';
import Img from '../images/fond-violet.webp'
import { BiPlus } from 'react-icons/bi';
import { ToastContainer, toast } from 'react-toastify';
<<<<<<< Updated upstream
import { useParams } from 'react-router-dom';
import { Bracket, BracketGame } from 'react-tournament-bracket';


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
=======
import * as cookie from '../components/Cookie';

export const ListeTournois = () => {
    const [tournois, setTournois] = useState([]);
    const [tournoisInscrits, setTournoisInscrits] = useState([]);
    /* useEffect(() => {
        cookie.checkCookieAndRedirect();
      }, []); */

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
            console.error('Erreur lors de la récupération des tournois :', error);
>>>>>>> Stashed changes
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

  useEffect(() => {
    fetchTournois();
  }, []);

  const fetchTournois = async () => {
    try {
      const numTournois = 1;
      const response = await fetch(`http://localhost:8080/ws/tournois/${numTournois}`);
      const data = await response.json();

      if (data.status === 'success') {
        const participants = data.participantIds;
        const participantNames = data.participantNames;
        console.log('participants:', participants);
        console.log('participantNames:', participantNames);
        const eliminationTable = await generateElimination(participants, participantNames);
        setEliminationTable(eliminationTable);
      } else {
        console.log('Erreur lors de la récupération des participants');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des tournois :', error);
    }
  };

  async function generateElimination(playerIds, playerNames) {
    let matches = [];

    // Organize players in pairs for the first round
    let pairs = [];
    for (let i = 0; i < playerIds.length; i += 2) {
      pairs.push([playerIds[i], playerIds[i + 1]]);
    }

    // Create matches for the first round
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      const player1Index = i * 2;
      const player2Index = i * 2 + 1;
      const player1Name = playerNames[player1Index] || "";
      const player2Name = playerNames[player2Index] || "";

      const match = {
        id: i + 1,
        name: "semi-finals",
        scheduled: Number(new Date()),
        players: pair,
        winner: null,
        sides: {
          home: {
            team: {
              id: player1Index,
              name: player1Name,
            },
            score: {
              score: 0,
            },
          },
          visitor: {
            team: {
              id: player2Index,
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
    while (pairs.length > 1) {
      const newPairs = [];
      for (let i = 0; i < pairs.length; i += 2) {
        const winner1Index = i * 2;
        const winner2Index = i * 2 + 1;
        const winner1Name = playerNames[winner1Index] || '';
        const winner2Name = winner2Index < playerNames.length ? playerNames[winner2Index] : '';

        if (winner2Name !== '') {
          const match = {
            id: i + 1, // Generate unique ID for each match
            players: [winner1Index, winner2Index],
            winner: null,
            sides: {
              home: {
                team: {
                  id: winner1Index,
                  name: winner1Name,
                },
                score: {
                  score: 0,
                },
              },
              visitor: {
                team: {
                  id: winner2Index,
                  name: winner2Name,
                },
                score: {
                  score: 0,
                },
              },
            },
          };
          newPairs.push([winner1Index, winner2Index]);
          matches.push(match);
        } else {
          // Handle odd number of players, bye for one player
          newPairs.push([winner1Index]);
        }
      }
      pairs = newPairs;
    }

    return matches;
  }
  console.log('eliminationTable[0] :', eliminationTable[0])
  console.log('autre', game1)
  console.log('eliminationTable :', eliminationTable)
  return (
    <div>
  <Container fluid className='body-space'>
    <p>Bonjour je suis un test</p>
    {eliminationTable.length > 0 ? (
      <div>
        {eliminationTable.map((game, index) => {
          // Afficher les éléments en paires consécutives
          if (index % 2 === 0) {
            return <Bracket key={index} game={game} />;
          } else {
            return null;
          }
        })}
      </div>
    ) : (
      <p>Tournois INTROUVABLE !</p>
    )}
    {/* <Bracket rounds={eliminationTable}>
      {eliminationTable.map((match, index) => (
        <BracketGame key={index} match={match} />
      ))}
    </Bracket> */}
  </Container>
</div>
  );
};