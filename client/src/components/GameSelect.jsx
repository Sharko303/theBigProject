import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

export const GameSelect = ({ handleGameChange }) => {
  const [selectedGame, setSelectedGame] = useState('');

  const onGameChange = (e) => {
    const game = e.target.value;
    setSelectedGame(game);
    handleGameChange(game);
  }

  return (
    <Form.Group controlId="gameSelect">
      <Form.Label>Choisissez un jeu :</Form.Label>
      <Form.Control as="select" onChange={onGameChange} required>
        <option value="">Sélectionner un jeu</option>
        <option value="valorant">Valorant</option>
        <option value="rocket-league">Rocket League</option>
      </Form.Control>
      {selectedGame && <p>Vous avez choisi {selectedGame}</p>}
    </Form.Group>
  );
};