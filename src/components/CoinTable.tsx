import { useNavigate } from 'react-router-dom';
import type { Coin } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../hooks/useFavorites';
import Sparkline from './Sparkline';

function formatPrice(n: number) {
  if (n >= 1) return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return '$' + n.toPrecision(4);
}

function formatMcap(n: number) {
  if (n >= 1e12) return '$' + (n / 1e12).toFixed(2) + 'T';
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M';
  return '$' + n.toLocaleString();
}

export default function CoinTable({ coins }: { coins: Coin[] }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toggle, isFavorite } = useFavorites();

  return (
    <table className="coin-table">
      <thead>
        <tr>
          {user && <th style={{ width: 40 }}></th>}
          <th style={{ width: 50 }}>#</th>
          <th>Coin</th>
          <th>Price</th>
          <th>24h</th>
          <th>Market Cap</th>
          <th className="sparkline-cell">7D Chart</th>
        </tr>
      </thead>
      <tbody>
        {coins.map((coin, i) => (
          <tr key={coin.id} className="coin-row" onClick={() => navigate(`/coin/${coin.id}`)}>
            {user && (
              <td>
                <button
                  className="fav-star"
                  onClick={(e) => { e.stopPropagation(); toggle(coin.id); }}
                >
                  {isFavorite(coin.id) ? '★' : '☆'}
                </button>
              </td>
            )}
            <td className="coin-rank">{i + 1}</td>
            <td>
              <div className="coin-identity">
                <img className="coin-img" src={coin.image} alt={coin.name} />
                <div className="coin-name-group">
                  <span className="coin-name">{coin.name}</span>
                  <span className="coin-symbol">{coin.symbol}</span>
                </div>
              </div>
            </td>
            <td className="price">{formatPrice(coin.current_price)}</td>
            <td>
              <span className={`change ${coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
                {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                {coin.price_change_percentage_24h?.toFixed(2)}%
              </span>
            </td>
            <td className="price">{formatMcap(coin.market_cap)}</td>
            <td className="sparkline-cell">
              {coin.sparkline_in_7d && (
                <Sparkline
                  data={coin.sparkline_in_7d.price}
                  positive={coin.price_change_percentage_24h >= 0}
                />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
