import { Router } from 'express';
import { Alert } from '../models/Alert';
import { validateTelegramData } from '../middleware/telegramAuth';

export const alertRouter = Router();
alertRouter.use(validateTelegramData);

alertRouter.get('/', async (req, res) => {
  try {
    const tgUser = req.telegramUser;
    if (!tgUser) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const alerts = await Alert.find({ telegramId: tgUser.id }).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

alertRouter.post('/', async (req, res) => {
  try {
    const tgUser = req.telegramUser;
    if (!tgUser) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { coinId, targetPrice, direction } = req.body;

    if (!coinId || !targetPrice || !direction) {
      res.status(400).json({ error: 'coinId, targetPrice, and direction are required' });
      return;
    }

    if (!['above', 'below'].includes(direction)) {
      res.status(400).json({ error: 'direction must be "above" or "below"' });
      return;
    }

    const alert = await Alert.create({
      telegramId: tgUser.id,
      coinId,
      targetPrice: Number(targetPrice),
      direction,
    });

    res.status(201).json(alert);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create alert' });
  }
});

alertRouter.delete('/:id', async (req, res) => {
  try {
    const tgUser = req.telegramUser;
    if (!tgUser) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    await Alert.findOneAndDelete({ _id: req.params.id, telegramId: tgUser.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete alert' });
  }
});
