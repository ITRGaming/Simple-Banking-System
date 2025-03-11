import Customer from './Pages/Customer';
import Banker from './Pages/Banker';
import Login from './Pages/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/banker" element={<Banker />} />
      </Routes>
    </Router>
  );
}

export default App;
