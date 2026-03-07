import { Router } from 'express';
import { User } from '../models/User';
import { validateTelegramData } from '../middleware/telegramAuth';

export const userRouter = Router();
userRouter.use(validateTelegramData);

userRouter.get('/me', async (req, res) => {
  try {
    const tgUser = req.telegramUser;
    if (!tgUser) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    let user = await User.findOne({ telegramId: tgUser.id });
    if (!user) {
      user = await User.create({
        telegramId: tgUser.id,
        username: tgUser.username,
        firstName: tgUser.first_name,
      });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get user' });
  }
});

userRouter.post('/favorites/:coinId', async (req, res) => {
  try {
    const tgUser = req.telegramUser;
    if (!tgUser) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await User.findOneAndUpdate(
      { telegramId: tgUser.id },
      { $addToSet: { favorites: req.params.coinId } },
      { new: true, upsert: true }
    );

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add favorite' });
  }
});

userRouter.delete('/favorites/:coinId', async (req, res) => {
  try {
    const tgUser = req.telegramUser;
    if (!tgUser) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await User.findOneAndUpdate(
      { telegramId: tgUser.id },
      { $pull: { favorites: req.params.coinId } },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});
