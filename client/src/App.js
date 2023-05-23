import './App.css';
import './DarkMode.css';
import "react-responsive-datepicker/dist/index.css";
import { Home } from './screens/Home'
import { Navigate, Route, Routes } from "react-router-dom"
import { Inscription } from './screens/Inscription'
import { Connexion } from './screens/Connexion'
import { CreerTournois } from './screens/CreerTournois';
import { ListeTournois } from './screens/Tournois';

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/connexion' element={<Connexion />} />
        <Route path='/inscription' element={<Inscription />} />
        <Route path='/creertournois' element={<CreerTournois />} />
        <Route path='/listetournois' element={<ListeTournois />} />
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </div>
  );
}
export default App;