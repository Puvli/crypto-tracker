import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCoinDetail, type CoinDetail as CoinDetailType } from '../services/api';
import PriceChart from '../components/PriceChart';

function fmt(n: number) {
  if (n >= 1e12) return '$' + (n / 1e12).toFixed(2) + 'T';
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M';
  if (n >= 1) return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 2 });
  return '$' + n.toPrecision(4);
}

export default function CoinDetail() {
  const { id } = useParams<{ id: string }>();
  const [coin, setCoin] = useState<CoinDetailType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchCoinDetail(id).then((d) => {
      setCoin(d);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading || !coin) {
    return <div className="loading"><div className="spinner" /></div>;
  }

  const md = coin.market_data;
  const change24 = md.price_change_percentage_24h;

  return (
    <>
      <Link to="/" className="back-link">← Back to Market</Link>

      <div className="detail-header">
        <img className="detail-img" src={coin.image.large} alt={coin.name} />
        <div>
          <span className="detail-title">{coin.name}</span>
          <span className="detail-symbol">{coin.symbol}</span>
        </div>
      </div>

      <div className="detail-price-row">
        <span className="detail-price">{fmt(md.current_price.usd)}</span>
        <span className={`detail-change change ${change24 >= 0 ? 'positive' : 'negative'}`}>
          {change24 >= 0 ? '+' : ''}{change24.toFixed(2)}%
        </span>
      </div>

      <PriceChart coinId={coin.id} />

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Market Cap</div>
          <div className="stat-value">{fmt(md.market_cap.usd)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">24h Volume</div>
          <div className="stat-value">{fmt(md.total_volume.usd)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">24h High</div>
          <div className="stat-value">{fmt(md.high_24h.usd)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">24h Low</div>
          <div className="stat-value">{fmt(md.low_24h.usd)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Circulating Supply</div>
          <div className="stat-value">{md.circulating_supply.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">All-Time High</div>
          <div className="stat-value">{fmt(md.ath.usd)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">7d Change</div>
          <div className="stat-value">
            <span className={`change ${md.price_change_percentage_7d >= 0 ? 'positive' : 'negative'}`}>
              {md.price_change_percentage_7d >= 0 ? '+' : ''}{md.price_change_percentage_7d.toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">30d Change</div>
          <div className="stat-value">
            <span className={`change ${md.price_change_percentage_30d >= 0 ? 'positive' : 'negative'}`}>
              {md.price_change_percentage_30d >= 0 ? '+' : ''}{md.price_change_percentage_30d.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
