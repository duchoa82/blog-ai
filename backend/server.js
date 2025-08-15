// server.js - Minimal test without Shopify API
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

// ===== Middleware =====
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// ===== Routes =====
app.get('/', (req, res) => {
  res.json({ message: 'Blog AI Backend API', status: 'running', timestamp: new Date().toISOString() });
});

app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/test', (req, res) => {
  res.json({ message: 'Backend is working!', timestamp: new Date().toISOString() });
});

// ===== Start server =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`🔍 Healthcheck: http://localhost:${PORT}/healthz`);
  console.log(`�� Test: http://localhost:${PORT}/test`);
});
