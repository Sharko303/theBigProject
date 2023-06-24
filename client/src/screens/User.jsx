import React, { useContext } from 'react';
import UserContext from './../components/UserContext';

export const UserInfos = () => {
  const user = useContext(UserContext);

  if (!user) {
    // Gérer le cas où user n'est pas défini
    return <div>Utilisateur non trouvé</div>;
  }

  return (
    <div>
      <h1>Bienvenue, {user.username}!</h1>
      <p>ID de l'utilisateur : {user.id}</p>
    </div>
  );
};