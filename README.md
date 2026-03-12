# CryptoTracker

Client-side SPA for tracking cryptocurrency prices with favorites, interactive charts, and Firebase authentication.

Built with **React + TypeScript**, **Vite**, **Firebase Auth**, **Recharts**, and **CoinGecko API**.

Deployed on **GitHub Pages**: pushes to `main` trigger automatic deployment via GitHub Actions.

## Features

- Real-time cryptocurrency prices (top 50 by market cap)
- 7-day sparkline charts for each coin
- Detailed coin view with interactive price charts (24h / 7d / 30d / 1y)
- Search and filter coins by name or symbol
- Favorites — works with or without authentication (localStorage-based)
- Firebase authentication (email/password + Google OAuth)
- Dark glassmorphism UI with animated gradients

## Architecture

```
crypto-tracker/
├── src/
│   ├── components/        # CoinTable, Nav, PriceChart, Sparkline
│   ├── context/           # AuthContext (Firebase)
│   ├── hooks/             # useFavorites
│   ├── pages/             # Market, CoinDetail, Favorites, Login, Register
│   ├── services/          # api.ts (CoinGecko), firebase.ts
│   ├── App.tsx            # HashRouter routes
│   ├── main.tsx           # Entry point
│   └── styles.css         # Glassmorphism theme
├── .github/workflows/
│   └── deploy.yml         # GitHub Actions → GitHub Pages
├── vite.config.ts
├── Dockerfile
└── docker-compose.yml
```

## Quick Start

### Prerequisites

- Node.js 20+
- Firebase project (for authentication)

### 1. Install and configure

```bash
npm install
cp .env.example .env
# Fill in your Firebase credentials in .env
```

### 2. Run locally

```bash
npm run dev
```

Vite dev server starts on `http://localhost:5173`. CoinGecko API requests are proxied via `/cgapi` to avoid CORS issues.

### 3. Build for production

```bash
npm run build
npm run preview   # preview the build locally
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Firebase Web API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase App ID |

## Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Market | Crypto listing with search |
| `/coin/:id` | CoinDetail | Charts and market metrics |
| `/favorites` | Favorites | Saved coins |
| `/login` | Login | Email / Google sign-in |
| `/register` | Register | Create account |

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, React Router 6
- **Charts**: Recharts, custom SVG sparklines
- **Auth**: Firebase Authentication
- **Data**: CoinGecko API v3 (free tier, no key needed)
- **Deploy**: GitHub Actions → GitHub Pages
- **Dev**: Docker Compose (optional)
