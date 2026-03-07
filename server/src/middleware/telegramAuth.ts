import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

export interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
}

declare global {
  namespace Express {
    interface Request {
      telegramUser?: TelegramUser;
    }
  }
}

export function validateTelegramData(req: Request, res: Response, next: NextFunction) {
  const initData = req.headers['x-telegram-init-data'] as string;

  const botToken = process.env.BOT_TOKEN;

  if (!initData) {
    if (!botToken) {
      // Dev mode: no Telegram, no token — use mock user
      req.telegramUser = { id: 1, first_name: 'Dev', username: 'dev_user' };
      next();
      return;
    }
    res.status(401).json({ error: 'Missing Telegram init data' });
    return;
  }

  if (!botToken) {
    console.warn('BOT_TOKEN not set — skipping validation in dev mode');
    try {
      const params = new URLSearchParams(initData);
      const userStr = params.get('user');
      if (userStr) {
        req.telegramUser = JSON.parse(userStr);
      }
    } catch {
      // ignore parse errors in dev
    }
    next();
    return;
  }

  try {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    params.delete('hash');

    const dataCheckString = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, val]) => `${key}=${val}`)
      .join('\n');

    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
    const expectedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    if (hash !== expectedHash) {
      res.status(401).json({ error: 'Invalid Telegram data' });
      return;
    }

    const userStr = params.get('user');
    if (userStr) {
      req.telegramUser = JSON.parse(userStr);
    }

    next();
  } catch {
    res.status(401).json({ error: 'Auth validation failed' });
  }
}
