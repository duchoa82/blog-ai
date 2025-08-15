// server.js
import express from 'express';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { createClient } from 'redis';
import dotenv from 'dotenv';
import { shopifyApi } from '@shopify/shopify-api';

dotenv.config();
const app = express();

// ===== Redis setup =====
const RedisStore = connectRedis(session);
const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: process.env.REDIS_TLS === 'true',
    rejectUnauthorized: false,
  },
});
redisClient.on('error', (err) => console.error('Redis Client Error', err));
await redisClient.connect();

// ===== Session middleware =====
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 },
  })
);

// ===== Shopify context =====
shopifyApi.initialize({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: process.env.SCOPES.split(','),
  hostName: process.env.HOST.replace(/^https?:\/\//, ''),
  isEmbeddedApp: true,
  apiVersion: '2025-07',
  sessionStorage: new shopifyApi.Session.MemorySessionStorage(),
});

// ===== Routes =====

// Healthcheck & test session
app.get('/', (req, res) => res.send('OK'));
app.get('/healthz', (req, res) => res.status(200).send('OK'));

app.get('/test-session', (req, res) => {
  req.session.views = (req.session.views || 0) + 1;
  res.send(`You visited this page ${req.session.views} times`);
});

// Auth start
app.get('/auth/shopify', async (req, res) => {
  const shop = req.query.shop;
  if (!shop) return res.status(400).send('Missing shop parameter');
  const authRoute = await shopifyApi.auth.beginAuth(req, res, shop, '/auth/shopify/callback', true);
  return res.redirect(authRoute);
});

// Auth callback
app.get('/auth/shopify/callback', async (req, res) => {
  try {
    const session = await shopifyApi.auth.validateAuthCallback(req, res);
    // session chứa access token
    res.send('Shopify auth successful!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Auth failed');
  }
});

// ===== Start server =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
