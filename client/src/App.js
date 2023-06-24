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
import { UserInfos } from './screens/User';

function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiCall('GET', 'users/me');
        setUser(response);
        console.log('userInfos : ', response);
      } catch (error) {
        // Gérer les erreurs de l'appel API
        console.log(error);
      }
    };

    if (!user) {
      fetchData();
    }
  }, []);


  return (

    <div>
      {user === null ? (
        <div>Loading...</div>
      ) : user === false ? (
        <div>
          <UserContext.Provider value={false}>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/home' element={<Home />} />
              <Route path='/connexion' element={<Connexion />} />
              <Route path='/inscription' element={<Inscription />} />
              <Route path='*' element={<Navigate to='/' />} />
            </Routes>
          </UserContext.Provider>
        </div>
      ) : (
        <div>
          <UserContext.Provider value={user}>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/home' element={<Home />} />
              <Route path='/creertournois' element={<CreerTournois />} />
              <Route path='/listetournois' element={<ListeTournois />} />
              <Route path='/tournois' element={<Tournois />} />
              <Route path='/me' element={<UserInfos />} />
              <Route path='*' element={<Navigate to='/' />} />
            </Routes>
          </UserContext.Provider>
        </div>
      )}
    </div>
  );
}
export default App;