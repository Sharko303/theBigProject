import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

export const ScoreForm = () => {
  const [score1, setScore1] = useState('');
  const [score2, setScore2] = useState('');

  const handleSubmit = async (event) => {
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

  const handleScore1Change = (event) => {
    setScore1(event.target.value);
  };

  const handleScore2Change = (event) => {
    setScore2(event.target.value);
  };

  return (
    <Form onSubmit={handleSubmit}>
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
  );
};

export default ScoreForm;