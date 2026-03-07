import { Router } from 'express';
import { CoinGeckoService } from '../services/coingecko';

export const cryptoRouter = Router();

cryptoRouter.get('/prices', async (_req, res) => {
  try {
    const { prices, lastUpdated } = CoinGeckoService.getCachedPrices();
    if (prices.length === 0) {
      const fresh = await CoinGeckoService.fetchPrices();
      res.json({ prices: fresh, lastUpdated: new Date() });
      return;
    }
    res.json({ prices, lastUpdated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch prices' });
  }
});

cryptoRouter.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      res.status(400).json({ error: 'Query parameter "q" is required' });
      return;
    }
    const results = await CoinGeckoService.searchCoins(q);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Search failed' });
  }
});

cryptoRouter.get('/coin/:id', async (req, res) => {
  try {
    const detail = await CoinGeckoService.getCoinDetail(req.params.id);
    res.json(detail);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch coin details' });
  }
});
