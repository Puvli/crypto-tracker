import express from 'express';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import { cryptoRouter } from './routes/crypto';
import { userRouter } from './routes/user';
import { alertRouter } from './routes/alert';
import { CoinGeckoService } from './services/coingecko';

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/crypto_tracker';

app.use(cors());
app.use(express.json());

app.use('/api/crypto', cryptoRouter);
app.use('/api/user', userRouter);
app.use('/api/alerts', alertRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Serve React static build in production
const clientDistPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));
app.get('*', (_req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

async function start() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  CoinGeckoService.startPriceUpdater();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start().catch(console.error);
