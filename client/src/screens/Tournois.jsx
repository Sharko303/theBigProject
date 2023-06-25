import React, { useState, useEffect, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { SingleEliminationBracket, Match, SVGViewer } from '@g-loot/react-tournament-brackets';
import { Button, Container, Form } from 'react-bootstrap';
import { apiCall, convertToBracketData } from '../Javascript/apiCall';
import UserContext from './../components/UserContext';

export const Tournois = () => {
  const [eliminationTable, setEliminationTable] = useState([]);
  const [score1, setScore1] = useState('');
  const [score2, setScore2] = useState('');
  const [currentMatch, setCurrentMatch] = useState(null);

  const user = useContext(UserContext); // recupére l'utilisateur

  const location = window.location;
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');

  useEffect(() => {
    if (id) {
      fetchTournois(id);
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
      const matches = response.matchs;
      const matchs = await convertToBracketData(matches, response);
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
      toast.success('Score soumis !');

    } else {
      toast.error('Score non soumis !');
    }
  }
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

      <ToastContainer />
    </div>
  );
};

