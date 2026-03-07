import cron from 'node-cron';
import { Alert } from '../models/Alert';

interface CoinPrice {
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

let cachedPrices: CoinPrice[] = [];
let lastUpdated: Date | null = null;

export class CoinGeckoService {
  private static readonly BASE_URL = 'https://api.coingecko.com/api/v3';

  static async fetchPrices(page = 1, perPage = 50): Promise<CoinPrice[]> {
    const url = `${this.BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=24h`;

    const res = await fetch(url);
    if (!res.ok) {
      if (cachedPrices.length > 0) return cachedPrices;
      throw new Error(`CoinGecko API error: ${res.status}`);
    }

    const data: CoinPrice[] = await res.json();
    cachedPrices = data;
    lastUpdated = new Date();
    return data;
  }

  static async searchCoins(query: string): Promise<any> {
    const res = await fetch(`${this.BASE_URL}/search?query=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error(`CoinGecko search error: ${res.status}`);
    return res.json();
  }

  static async getCoinDetail(id: string): Promise<any> {
    const res = await fetch(`${this.BASE_URL}/coins/${encodeURIComponent(id)}?localization=false&tickers=false&community_data=false&developer_data=false`);
    if (!res.ok) throw new Error(`CoinGecko detail error: ${res.status}`);
    return res.json();
  }

  static getCachedPrices() {
    return { prices: cachedPrices, lastUpdated };
  }

  static startPriceUpdater() {
    this.fetchPrices().catch(console.error);

    cron.schedule('*/2 * * * *', async () => {
      try {
        const prices = await this.fetchPrices();
        await this.checkAlerts(prices);
      } catch (err) {
        console.error('Price update failed:', err);
      }
    });

    console.log('Price updater started (every 2 min)');
  }

  private static async checkAlerts(prices: CoinPrice[]) {
    const priceMap = new Map(prices.map((p) => [p.id, p.current_price]));
    const activeAlerts = await Alert.find({ triggered: false });

    for (const alert of activeAlerts) {
      const price = priceMap.get(alert.coinId);
      if (price === undefined) continue;

      const shouldTrigger =
        (alert.direction === 'above' && price >= alert.targetPrice) ||
        (alert.direction === 'below' && price <= alert.targetPrice);

      if (shouldTrigger) {
        alert.triggered = true;
        await alert.save();
      }
    }
  }
}
