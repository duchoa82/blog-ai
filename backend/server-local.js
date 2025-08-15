// server-local.js - Local-safe mode
import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();

// ===== Middleware =====
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// ===== Session setup =====
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24*60*60*1000 }
}));

// ===== Shopify API Initialization (mocked for local) =====
try {
  console.log('✅ Shopify API initialized (mocked for local)');
} catch (err) {
  console.error('❌ Shopify API init failed, skipping for local:', err.message);
}

// ===== Routes =====
app.get('/', (req, res) => {
  res.json({ message: 'Blog AI Backend API (local-safe)', status: 'running', timestamp: new Date().toISOString() });
});

app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ===== OAuth (mocked) =====
app.get('/auth/shopify', (req, res) => {
  const shop = req.query.shop || 'local-test.myshopify.com';
  console.log(`🔄 OAuth initiated for shop: ${shop} (mocked)`);
  res.json({ message: 'OAuth mocked', shop });
});

app.get('/auth/shopify/callback', (req, res) => {
  console.log('🔄 OAuth callback received (mocked)', req.query);
  res.json({ success: true, shop: req.query.shop || 'local-test.myshopify.com', scope: 'mocked' });
});

// ===== Test endpoint =====
app.get('/test', (req, res) => {
  res.json({ message: 'Backend is working!', timestamp: new Date().toISOString() });
});

// ===== Error handling =====
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ error: err.message, timestamp: new Date().toISOString() });
});

// ===== Start server =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`🔍 Healthcheck: http://localhost:${PORT}/healthz`);
  console.log(`🔑 OAuth (mocked): http://localhost:${PORT}/auth/shopify`);
});
