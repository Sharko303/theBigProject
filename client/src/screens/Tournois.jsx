import React, { useState, useEffect, useContext } from 'react';
import { SingleEliminationBracket, Match, SVGViewer } from '@g-loot/react-tournament-brackets';
import { Card, Button, ListGroup, Container, Row, Col, Table, Form } from 'react-bootstrap';
import { apiCall, convertToBracketData, convertToBracketData2 } from '../Javascript/apiCall';
import UserContext from './../components/UserContext';

export const Tournois = () => {
  const [eliminationTable, setEliminationTable] = useState([]);
  const [score1, setScore1] = useState('');
  const [score2, setScore2] = useState('');
  const [currentMatch, setCurrentMatch] = useState(null);
  const [sourceGames, setSourceGames] = useState(null);

  const user = useContext(UserContext); // recupére l'utilisateur
  console.log('UTILISATEUR', user)

  const location = window.location;
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');

  useEffect(() => {
    if (id) {
      fetchTournois(id);
      console.log("on change")
    }
  }, [id]);

  useEffect(() => {
    const match = eliminationTable.find((game) => {
      const homeParticipantId = game.participants[0].id;
      const visitorParticipantId = game.participants[1].id;
      return homeParticipantId === user.id || visitorParticipantId === user.id;
    });
    if (match) {
      setCurrentMatch(match);
    }
  }, [eliminationTable]);

  const fetchTournois = async (id) => {
    let response = await apiCall('GET', `events/${id}`);
    if (response) {
      console.log('Response:', response);
      const matches = response.matchs;
      console.log('MATCH PAIRS:', response.matchs);
      const matchs = await convertToBracketData2(matches, response);
      console.log('matchs:', matchs);
      setEliminationTable(matchs);
    }
  };

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
  console.log('elimination table', eliminationTable)
  console.log("currentMatch", currentMatch)
  return (
    <div>
      <Container fluid className='body-space'>
        <p>Bonjour je suis un test</p>
        {eliminationTable.length > 0 ? (
          <div className="grid-container">
            <SingleEliminationBracket
              matches={eliminationTable}
              matchComponent={Match}
              svgWrapper={({ children, ...props }) => (
                <SVGViewer width={2000} height={2000} {...props}>
                  {children}
                </SVGViewer>
              )}
            />
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

