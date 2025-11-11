import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import developerRoutes from './routes/developerRoutes.js';
import breedRoutes from './routes/breedRoutes.js';
import factRoutes from './routes/factRoutes.js';
import catRoutes from './routes/catRoutes.js';
import db from './config/db.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5050;

// Allow frontend dev server origin
const CORS_ORIGIN = process.env.CORS_ORIGIN || ['http://127.0.0.1:5173', 'http://localhost:5173'];

app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/uploads', express.static('uploads'));

// Mount API routes
app.use('/api/developers', developerRoutes);
app.use('/api/breeds', breedRoutes);
app.use('/api/facts', factRoutes);
app.use('/api/cats', catRoutes);

app.get('/', (req, res) => res.json({ ok: true, message: 'CatFacts server running' }));

// Initialize DB then start server
(async () => {
  try {
    await db.init();
    const HOST = process.env.HOST || '127.0.0.1';
    app.listen(PORT, HOST, () => console.log(`Server running on http://${HOST}:${PORT}`));
  } catch (err) {
    console.error('Failed to start server due to DB error', err);
    process.exit(1);
  }
})();
