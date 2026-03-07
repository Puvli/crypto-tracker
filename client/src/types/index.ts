export interface CoinPrice {
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

export interface UserData {
  telegramId: number;
  username?: string;
  firstName?: string;
  favorites: string[];
}

export interface AlertData {
  _id: string;
  coinId: string;
  targetPrice: number;
  direction: 'above' | 'below';
  triggered: boolean;
  createdAt: string;
}

export type Tab = 'market' | 'favorites' | 'alerts';
