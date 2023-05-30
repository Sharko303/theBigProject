
import React, { useState, useEffect } from 'react';
import { Card, Button, ListGroup, Container, Row, Col, Table } from 'react-bootstrap';
import { Menu } from '../components/Menu';
import { Footer } from '../components/Footer';
import Img from '../images/fond-violet.webp'
import { BiPlus } from 'react-icons/bi';
import { ToastContainer, toast } from 'react-toastify';
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
        const participantNames = data.participantNames
        const eliminationTable = generateElimination(participants, participantNames);
        setEliminationTable(eliminationTable);
      } else {
        console.log('Erreur lors de la récupération des participants');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des tournois :', error);
    }
  };

  function generateElimination(playerIds, playerNames) {
    let matches = [];

    // Organize players in pairs for the first round
    let pairs = [];
    for (let i = 0; i < playerIds.length; i += 2) {
      pairs.push([playerIds[i], playerIds[i + 1]]);
    }

    // Create matches for the first round
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      console.log(pair, 'test')
      const player1Name = playerNames[i];
      const player2Name = playerNames[i + 1];
      const match = {
        id: i+1,
        name: "semi-finals",
        scheduled: Number(new Date()),
        sides: {
          home: {
            team: {
              id: pair[0],
              name: player1Name
            },
            score: {
              score: 0
            }
          },
          visitor: {
            team: {
              id: pair[1],
              name: player2Name
            },
            score: {
              score: 0
            }
          }
        }
      };
      matches.push(match);
    }

    // Generate matches for subsequent rounds
    while (pairs.length > 1) {
      const newPairs = [];
      for (let i = 0; i < pairs.length; i += 2) {
        const winner1 = pairs[i][0];
        const winner2 = pairs[i + 1][0];

        const player1Name = playerNames[winner1];
        const player2Name = playerNames[winner2];

        const match = {
          id: i + 1, // Generate unique ID for each match
          name: "semi-finals",
          scheduled: Number(new Date()),
          sides: {
            home: {
              team: {
                id: winner1,
                name: player1Name
              },
              score: {
                score: 0
              }
            },
            visitor: {
              team: {
                id: winner2,
                name: player2Name
              },
              score: {
                score: 0
              }
            }
          }
        };
        newPairs.push([winner1, winner2]);
        matches.push(match);
      }
      pairs = newPairs;
    }

    return matches;
  }
  console.log('eliminationTable :', eliminationTable[0])
  console.log('autre', game1)
  return (
    <div>
      <Container fluid className='body-space'>
        <p>Bonjour je suis un test</p>
        {eliminationTable ?
          <Bracket game={game1} />
          :
          <p>Tournois INTROUVABLE !</p>
        }
        {/* <Bracket rounds={eliminationTable}>
          {eliminationTable.map((match, index) => (
            <BracketGame key={index} match={match} />
          ))}
        </Bracket> */}
      </Container>
    </div>
  );
};