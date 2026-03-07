# CryptoTracker - Telegram Mini App

Telegram Mini App for tracking cryptocurrency prices with favorites and price alerts.

Built with **React + TypeScript**, **Express**, **MongoDB**, **Telegram Web App SDK**, and **CoinGecko API**.

## Features

- Real-time cryptocurrency prices (top 50 by market cap)
- 7-day sparkline charts for each coin
- Search and filter coins
- Add coins to favorites (synced per Telegram user)
- Price alerts: get notified when a coin crosses your target price
- Adaptive UI that follows the Telegram theme
- Telegram user authentication via `initData` validation

## Architecture

```
crypto-tracker/
├── client/          # React + Vite frontend
│   └── src/
│       ├── components/   # UI components
│       ├── hooks/        # useTelegram, useApi
│       ├── styles/       # CSS (Telegram theme variables)
│       └── types/        # TypeScript interfaces
├── server/          # Express backend
│   └── src/
│       ├── routes/       # /crypto, /user, /alerts
│       ├── models/       # Mongoose: User, Alert
│       ├── services/     # CoinGecko integration
│       └── middleware/   # Telegram auth validation
└── docker-compose.yml
```

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Telegram Bot Token (from [@BotFather](https://t.me/BotFather))

### 1. Clone and configure

```bash
cd crypto-tracker
cp .env.example .env
# Edit .env and add your BOT_TOKEN
```

### 2. Run with Docker

```bash
docker-compose up --build
```

This starts:
- **MongoDB** on port 27017
- **Express API** on port 3001
- **Vite dev server** on port 5173

### 3. Set up Telegram Bot

1. Create a bot via [@BotFather](https://t.me/BotFather)
2. Use `/newapp` to create a Web App and set the URL to your public endpoint (use [ngrok](https://ngrok.com/) for local dev: `ngrok http 5173`)
3. Open the bot in Telegram and launch the Mini App

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/crypto/prices` | Get cached crypto prices |
| GET | `/api/crypto/search?q=` | Search coins |
| GET | `/api/crypto/coin/:id` | Get coin details |
| GET | `/api/user/me` | Get/create user profile |
| POST | `/api/user/favorites/:coinId` | Add to favorites |
| DELETE | `/api/user/favorites/:coinId` | Remove from favorites |
| GET | `/api/alerts` | List user alerts |
| POST | `/api/alerts` | Create price alert |
| DELETE | `/api/alerts/:id` | Delete alert |

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Telegram Web App SDK
- **Backend**: Express, TypeScript, Mongoose
- **Database**: MongoDB 7
- **API**: CoinGecko (free tier, no API key needed)
- **Infrastructure**: Docker, Docker Compose
