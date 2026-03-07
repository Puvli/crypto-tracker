import { CoinPrice } from '../types';
import { Sparkline } from './Sparkline';

interface CoinListProps {
  coins: CoinPrice[];
  loading: boolean;
  favorites: string[];
  onToggleFavorite: (coinId: string, isFav: boolean) => void;
  emptyMessage?: string;
}

function formatPrice(price: number): string {
  if (price >= 1) return price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  return '$' + price.toPrecision(4);
}

function formatChange(change: number | null): { text: string; className: string } {
  if (change === null || change === undefined) return { text: '—', className: '' };
  const sign = change >= 0 ? '+' : '';
  return {
    text: `${sign}${change.toFixed(2)}%`,
    className: change >= 0 ? 'positive' : 'negative',
  };
}

export function CoinList({ coins, loading, favorites, onToggleFavorite, emptyMessage }: CoinListProps) {
  if (loading) {
    return <div className="loading">Loading prices...</div>;
  }

  if (coins.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">{emptyMessage ? '\u{2B50}' : '\u{1F50D}'}</div>
        <p>{emptyMessage || 'No coins found'}</p>
      </div>
    );
  }

  return (
    <ul className="coin-list">
      {coins.map((coin) => {
        const change = formatChange(coin.price_change_percentage_24h);
        const isFav = favorites.includes(coin.id);

        return (
          <li key={coin.id} className="coin-item">
            <img src={coin.image} alt={coin.name} />
            <div className="coin-info">
              <div className="coin-name">{coin.name}</div>
              <div className="coin-symbol">{coin.symbol}</div>
            </div>
            {coin.sparkline_in_7d && (
              <Sparkline
                data={coin.sparkline_in_7d.price}
                positive={coin.price_change_percentage_24h >= 0}
              />
            )}
            <div className="coin-price">
              <div className="price">{formatPrice(coin.current_price)}</div>
              <div className={`change ${change.className}`}>{change.text}</div>
            </div>
            <button
              className="fav-btn"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(coin.id, isFav);
              }}
            >
              {isFav ? '\u{2B50}' : '\u{2606}'}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
