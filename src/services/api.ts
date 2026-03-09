const BASE = 'https://api.coingecko.com/api/v3';

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  sparkline_in_7d?: { price: number[] };
}

export interface CoinDetail {
  id: string;
  symbol: string;
  name: string;
  image: { large: string };
  market_data: {
    current_price: { usd: number };
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    market_cap: { usd: number };
    total_volume: { usd: number };
    high_24h: { usd: number };
    low_24h: { usd: number };
    circulating_supply: number;
    total_supply: number | null;
    ath: { usd: number };
    atl: { usd: number };
  };
  description: { en: string };
}

export async function fetchCoins(page = 1, perPage = 50): Promise<Coin[]> {
  const res = await fetch(
    `${BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true`
  );
  if (!res.ok) throw new Error('Failed to fetch coins');
  return res.json();
}

export async function fetchCoinDetail(id: string): Promise<CoinDetail> {
  const res = await fetch(
    `${BASE}/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`
  );
  if (!res.ok) throw new Error('Failed to fetch coin detail');
  return res.json();
}

export async function fetchPriceHistory(
  id: string,
  days: number | 'max'
): Promise<[number, number][]> {
  const res = await fetch(
    `${BASE}/coins/${id}/market_chart?vs_currency=usd&days=${days}`
  );
  if (!res.ok) throw new Error('Failed to fetch price history');
  const data = await res.json();
  return data.prices;
}

export async function searchCoins(query: string): Promise<{ id: string; name: string; symbol: string; thumb: string }[]> {
  const res = await fetch(`${BASE}/search?query=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Search failed');
  const data = await res.json();
  return data.coins?.slice(0, 10) || [];
}
