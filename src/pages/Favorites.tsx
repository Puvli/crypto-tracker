import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../hooks/useFavorites';
import { fetchCoins, type Coin } from '../services/api';
import CoinTable from '../components/CoinTable';

export default function Favorites() {
  const { user, loading: authLoading } = useAuth();
  const { favorites } = useFavorites();
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoins(1, 100).then((data) => {
      setCoins(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (authLoading) return <div className="loading"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" />;

  const favCoins = coins.filter((c) => favorites.includes(c.id));

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  if (favCoins.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">⭐</div>
        <h3>No favorites yet</h3>
        <p>Click the star icon on any coin to add it to your favorites.</p>
      </div>
    );
  }

  return <CoinTable coins={favCoins} />;
}
