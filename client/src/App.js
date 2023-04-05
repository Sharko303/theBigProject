import './App.css';
import { Home } from './screens/Home'
import { Navigate, Route, Routes } from "react-router-dom";


function App() {
  return (
    <div>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/test' element={<Home />} />
      <Route path='*' element={<Navigate to='/' />} />
    </Routes>
    </div>
  );
}
export default App;
