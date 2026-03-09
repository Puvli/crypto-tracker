import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { fetchPriceHistory } from '../services/api';

const RANGES = [
  { label: '24H', days: 1 },
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '1Y', days: 365 },
] as const;

interface ChartPoint {
  time: number;
  price: number;
}

export default function PriceChart({ coinId }: { coinId: string }) {
  const [days, setDays] = useState<number>(7);
  const [data, setData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchPriceHistory(coinId, days).then((prices) => {
      if (cancelled) return;
      setData(prices.map(([time, price]) => ({ time, price })));
      setLoading(false);
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [coinId, days]);

  const isPositive = data.length >= 2 && data[data.length - 1].price >= data[0].price;
  const color = isPositive ? '#3fb950' : '#f85149';

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    if (days <= 1) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (days <= 30) return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    return d.toLocaleDateString([], { month: 'short', year: '2-digit' });
  };

  const formatPrice = (v: number) => {
    if (v >= 1) return '$' + v.toLocaleString('en-US', { maximumFractionDigits: 2 });
    return '$' + v.toPrecision(4);
  };

  return (
    <div className="chart-card">
      <div className="time-range">
        {RANGES.map((r) => (
          <button
            key={r.label}
            className={`time-btn${days === r.days ? ' active' : ''}`}
            onClick={() => setDays(r.days)}
          >
            {r.label}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="loading"><div className="spinner" /></div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              tickFormatter={formatDate}
              stroke="#484f58"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              minTickGap={40}
            />
            <YAxis
              domain={['auto', 'auto']}
              tickFormatter={formatPrice}
              stroke="#484f58"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={80}
            />
            <Tooltip
              contentStyle={{
                background: '#161b22',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10,
                fontSize: 13,
              }}
              labelFormatter={(ts) => new Date(ts as number).toLocaleString()}
              formatter={(value: number) => [formatPrice(value), 'Price']}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={color}
              strokeWidth={2}
              fill="url(#priceGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
