import { Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Market from './pages/Market';
import CoinDetail from './pages/CoinDetail';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    <>
      <Nav />
      <div className="container">
        <Routes>
          <Route path="/" element={<Market />} />
          <Route path="/coin/:id" element={<CoinDetail />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </>
  );
}
