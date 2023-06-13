import './App.css';
import './DarkMode.css';
/* import "react-responsive-datepicker/dist/index.css"; */

import React, { useState, useEffect } from 'react';
import UserContext from './components/UserContext';
import { apiCall } from './Javascript/apiCall';


import { Home } from './screens/Home'
import { Navigate, Route, Routes } from "react-router-dom"
import { Inscription } from './screens/Inscription'
import { Connexion } from './screens/Connexion'
import { CreerTournois } from './screens/CreerTournois';
import { ListeTournois } from './screens/ListeTournois';
import { Tournois } from './screens/Tournois';

function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiCall('GET', 'users/me');
        setUser(response);
        console.log('userInfos : ', user);
      } catch (error) {
        // Gérer les erreurs de l'appel API
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (

    <div>
      <UserContext.Provider value={user}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/home' element={<Home />} />
          <Route path='/connexion' element={<Connexion />} />

          {/* Afficher les pages accessibles aux utilisateurs connectés */}
          <Route path='/creertournois' element={<CreerTournois />} />
          <Route path='/listetournois' element={<ListeTournois />} />
          <Route path='/tournois' element={<Tournois />} />
          {/* On redirige toutes les autres routes vers notre page d'accueil */}
          <Route path='*' element={<Navigate to='/' />} />

        </Routes>
      </UserContext.Provider>
    </div>
  );
}
export default App;