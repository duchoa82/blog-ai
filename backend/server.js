import express from 'express';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { createClient } from 'redis';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ===== Redis Setup =====
const RedisStore = connectRedis(session);

const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: process.env.REDIS_TLS === 'true',
    rejectUnauthorized: false, // nếu Redis dùng TLS tự ký
  },
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

// Connect to Redis
await redisClient.connect();

// ===== Session Middleware =====
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 24 * 60 * 60 * 1000 // 1 ngày
    },
  })
);

// ===== Basic Middleware =====
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// ===== Routes =====
app.get('/', (req, res) => {
  res.send('OK'); // Healthcheck pass
});

app.get('/healthz', (_req, res) => res.send('OK'));

app.get('/test-session', (req, res) => {
  req.session.views = (req.session.views || 0) + 1;
  res.send(`You visited this page ${req.session.views} times`);
});

// Session debugging endpoint
app.get('/debug/session', (req, res) => {
  res.json({
    sessionID: req.sessionID,
    sessionExists: !!req.session,
    sessionKeys: req.session ? Object.keys(req.session) : [],
    cookies: req.headers.cookie,
    userAgent: req.headers['user-agent'],
    timestamp: new Date().toISOString()
  });
});

// API endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// ===== Start Server =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔍 Redis Configuration:`);
  console.log(`📊 REDIS_URL: ${process.env.REDIS_URL ? 'Present' : 'Missing'}`);
  console.log(`🌍 NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`🔒 REDIS_TLS: ${process.env.REDIS_TLS}`);
});
