import React, { useState, useEffect, useContext } from 'react';
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
import UserContext from './../components/UserContext';

export const Tournois = () => {
  const [eliminationTable, setEliminationTable] = useState([]);
  const [score1, setScore1] = useState('');
  const [score2, setScore2] = useState('');
  const [currentMatch, setCurrentMatch] = useState(null);
  const [sourceGames, setSourceGames] = useState(null);

  const user = useContext(UserContext); // recupére l'utilisateur
  console.log('UTILISATEUR', user)

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
  const location = window.location;
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  useEffect(() => {
    if (id) {
      fetchTournois(id);
      console.log("on change")
    }
  }, [id]);

  const fetchTournois = async (id) => {
    let response = await apiCall('GET', `events/${id}`);
    if (response) {
      console.log('Response:', response);
      const matches = response.matchs;
      console.log('MATCH PAIRS:', response.matchs);
      const eliminationTable = generateElimination(matches);
      console.log('Elimination Table:', eliminationTable);
      setEliminationTable(eliminationTable);
      const currentUser = user.id; // Remplacez "nom_utilisateur" par le nom d'utilisateur de l'utilisateur actuel
      console.log('Current User:', currentUser)
      const match = eliminationTable.find((game) => game.sides.home.team.id === currentUser || game.sides.visitor.team.id === currentUser);
      if (match) {
        setCurrentMatch(match);
        console.log('Current Match:', match)
      }
    }
  };

  const generateElimination = (matchPairs) => {
    let matches = [];
  
    const getCurrentDate = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
  
    const generateMatches = (matchPairs, sourceGames, matchId) => {
      if (matchPairs.length === 1) {
        console.log('Generating', matchPairs)
        const player1Name = matchPairs[0].users[0].username || "";
        const player1Id = matchPairs[0].users[0].id || null;
        const player2Name = matchPairs[0].users[1].username || "";
        const player2Id = matchPairs[0].users[1].id || null;
        const matchIdPlayer = matchPairs[0].id || null;
        console.log(player1Name, player1Id, player2Name, player2Id, matchIdPlayer);
        console.log('MATCH POUR GPT', matchPairs);
        const match = {
          id: matchId,
          name: "finals",
          matchId: matchIdPlayer,
          scheduled: getCurrentDate(),
          players: [],
          winner: null,
          sides: {
            home: {
              team: {
                id: player1Id,
                name: player1Name,
              },
              score: {
                score: 0,
              },  
              seed: {
                displayName: "A1",
                rank: 1,
                sourceGame: sourceGames.length > 0 ? sourceGames[sourceGames.length - 1] : null,
              },
            },
            visitor: {
              team: {
                id: player2Id,
                name: player2Name,
              },
              score: {
                score: 0,
              },
              seed: {
                displayName: "A1",
                rank: 1,
                sourceGame: sourceGames.length > 0 ? sourceGames[sourceGames.length - 1] : null,
              },
            },
          },
        };
  
        return [match];
      }
  
      const newMatches = [];
      const numMatches = Math.ceil(matchPairs.length / 2);
      console.log(numMatches);
  
      for (let i = 0; i < numMatches; i++) {
        const player1Name = matchPairs[i].users[0].username || "";
        const player2Name = matchPairs[i].users[1].username || "";
        const player1Id = matchPairs[i].users[0].id || null;
        const player2Id = matchPairs[i].users[1].id || null;
        const matchIdPlayer = matchPairs[i].users.match;
  
        const game = {
          id: i + 1,
          name: `Match ${matchId}`,
          matchId: matchIdPlayer,
          scheduled: getCurrentDate(),
          players: [],
          winner: null,
          sides: {
            home: {
              team: {
                id: player1Id,
                name: player1Name,
              },
              score: {
                score: 0,
              },
              seed: {
                displayName: "A1",
                rank: 1,
                sourceGame: sourceGames.length > 0 ? sourceGames[sourceGames.length - 1] : null,
              },
            },
            visitor: {
              team: {
                id: player2Id,
                name: player2Name,
              },
              score: {
                score: 0,
              },
              seed: {
                displayName: "A1",
                rank: 1,
                sourceGame: sourceGames.length > 0 ? sourceGames[sourceGames.length - 1] : null,
              },
            },
          },
        };
  
        sourceGames.push(game);
        newMatches.push(game);
      }
  
      const newParticipants = newMatches.map((match) => match.sides.home.team.name);
  
      if (newParticipants.length === matchPairs.length) {
        return newMatches;
      } else {
        const remainingMatchPairs = matchPairs.slice(numMatches);
        const remainingMatches = generateMatches(remainingMatchPairs, sourceGames, matchId + 1);
        console.log('ET LAAA', remainingMatches);
        return [...newMatches, ...remainingMatches];
      }
    };
  
    const sourceGames = [];
    console.log('YA RIEN LA', matches);
    matches = generateMatches(matchPairs, sourceGames, 2);
  
    if (matches.length > 1) {
      const winners = matches.map((match) => match.sides.home.team);
      const finalMatchPairs = [];
  
      for (let i = 0; i < winners.length; i += 2) {
        const player1 = winners[i];
        const player2 = winners[i + 1] || null;
  
        const matchPair = {
          player: [player1.id, player2 ? player2.id : null],
          username: [player1.name, player2 ? player2.name : ""],
        };
  
        finalMatchPairs.push(matchPair);
      }
  
      if (finalMatchPairs.length > 1) {
        const byeMatchPair = finalMatchPairs.pop();
        matches.push(...generateMatches([byeMatchPair], sourceGames, matches.length + 1));
      }
  
      const finalMatch = generateMatches(finalMatchPairs, sourceGames, matches.length + 1);
      matches.push(...finalMatch);
    }
  
    return matches;
  };
  

  console.log('eliminationTable[0] :', eliminationTable[0])
  console.log('autre', game1)
  console.log('eliminationTable :', eliminationTable)

  const [score, setScore] = useState('');

  const handleScore1Change = (event) => {
    setScore1(event.target.value);
  };

  const handleScore2Change = (event) => {
    setScore2(event.target.value);
  };


  const handleSubmitScore = async (event) => {
    event.preventDefault();
    const response = await apiCall('PUT', `events/match/${currentMatch.matchId}`, {
      event_id: id,
      scoreJoueur1: score1,
      scoreJoueur2: score2
    })

    if (response) {
      // Le score a été soumis avec succès
      console.log('Scores soumis avec succès');
      // Effectuez ici toute autre action nécessaire après l'envoi des scores
    } else {
      console.log('Une erreur s\'est produite lors de la soumission des scores');
    };
  }
  return (
    <div>
      <Container fluid className='body-space'>
        <p>Bonjour je suis un test</p>
        {eliminationTable.length > 0 ? (
          <div className="grid-container">
            {/* {eliminationTable.map((game, index) => (
              <React.Fragment key={index}>
                <div className={`grid-item column-${index + 1}`}>
                  <Bracket game={game} />
                </div>
              </React.Fragment>
            ))} */}
            <Bracket game={eliminationTable[eliminationTable.length - 1]} />
          </div>
        ) : (
          <p>Tournois INTROUVABLE !</p>
        )}
      </Container>
      {/* Saisie de score*/}
      {currentMatch && (
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
      )}

      {/* <ScoreForm /> */}
    </div>
  );
};

