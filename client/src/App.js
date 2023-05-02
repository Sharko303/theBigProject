import './App.css';
import './DarkMode.css';
import { Home } from './screens/Home'
import { Navigate, Route, Routes } from "react-router-dom"
import { Inscription } from './screens/Inscription'
import { Connexion } from './screens/Connexion'
import { CreerTournois } from './screens/CreerTournois';

function App() {
  return (
    <div>
    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='/home' element={<Home />}/>
      <Route path='/connexion' element={<Connexion />}/>
      <Route path='/inscription' element={<Inscription />}/>
      <Route path='/creertournois' element={<CreerTournois />}/>
      <Route path='*' element={<Navigate to='/' />} />
    </Routes>
    </div>
  );
}
export default App;