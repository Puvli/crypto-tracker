import { useEffect, useState } from 'react';
import { fetchCoins, type Coin } from '../services/api';
import CoinTable from '../components/CoinTable';

export default function Market() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCoins().then((data) => {
      setCoins(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = search
    ? coins.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.symbol.toLowerCase().includes(search.toLowerCase())
      )
    : coins;

  if (loading) {
    return <div className="loading"><div className="spinner" /></div>;
  }

  return (
    <>
      <div className="search-wrapper">
        <span className="search-icon">🔍</span>
        <input
          className="search-input"
          placeholder="Search coins..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <CoinTable coins={filtered} />
    </>
  );
}
