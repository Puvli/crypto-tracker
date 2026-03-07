import { useState } from 'react';
import { AlertData, CoinPrice } from '../types';

interface AlertsViewProps {
  alerts: AlertData[];
  prices: CoinPrice[];
  onCreateAlert: (coinId: string, targetPrice: number, direction: 'above' | 'below') => void;
  onDeleteAlert: (id: string) => void;
}

export function AlertsView({ alerts, prices, onCreateAlert, onDeleteAlert }: AlertsViewProps) {
  const [coinId, setCoinId] = useState('bitcoin');
  const [targetPrice, setTargetPrice] = useState('');
  const [direction, setDirection] = useState<'above' | 'below'>('above');

  const handleSubmit = () => {
    const price = parseFloat(targetPrice);
    if (!coinId || isNaN(price) || price <= 0) return;
    onCreateAlert(coinId, price, direction);
    setTargetPrice('');
  };

  return (
    <div>
      <div className="alert-form">
        <h3>Create Price Alert</h3>
        <div className="form-row">
          <select value={coinId} onChange={(e) => setCoinId(e.target.value)}>
            {prices.length > 0 ? (
              prices.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.symbol.toUpperCase()})
                </option>
              ))
            ) : (
              <option value="bitcoin">Bitcoin (BTC)</option>
            )}
          </select>
        </div>
        <div className="form-row">
          <input
            type="number"
            placeholder="Target price (USD)"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
          />
          <select value={direction} onChange={(e) => setDirection(e.target.value as 'above' | 'below')}>
            <option value="above">Above</option>
            <option value="below">Below</option>
          </select>
        </div>
        <button onClick={handleSubmit}>Set Alert</button>
      </div>

      {alerts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">{'\u{1F514}'}</div>
          <p>No alerts yet. Create one above to get notified when a coin hits your target price.</p>
        </div>
      ) : (
        <div>
          {alerts.map((alert) => (
            <div key={alert._id} className="alert-item">
              <div className="alert-info">
                <div className="alert-coin">{alert.coinId}</div>
                <div className="alert-condition">
                  {alert.direction === 'above' ? '\u{2191}' : '\u{2193}'} $
                  {alert.targetPrice.toLocaleString()}
                </div>
              </div>
              <span className={`alert-status ${alert.triggered ? 'triggered' : 'pending'}`}>
                {alert.triggered ? 'Triggered' : 'Active'}
              </span>
              <button className="alert-delete-btn" onClick={() => onDeleteAlert(alert._id)}>
                {'\u{2715}'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
