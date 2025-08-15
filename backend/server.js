// server.js
import express from 'express';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { createClient } from 'redis';
import dotenv from 'dotenv';
import { shopifyApi } from '@shopify/shopify-api';

dotenv.config();
const app = express();

async function initializeApp() {
  try {
    // Redis setup
    const RedisStore = connectRedis(session);
    const redisClient = createClient({
      url: process.env.REDIS_URL,
      socket: { tls: process.env.REDIS_TLS === 'true', rejectUnauthorized: false },
    });
    redisClient.on('error', console.error);
    await redisClient.connect();

    app.use(
      session({
        store: new RedisStore({ client: redisClient }),
        secret: process.env.SESSION_SECRET || 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 },
      })
    );

    // Shopify API (bỏ sessionStorage)
    shopifyApi.initialize({
      apiKey: process.env.SHOPIFY_API_KEY,
      apiSecretKey: process.env.SHOPIFY_API_SECRET,
      scopes: process.env.SHOPIFY_SCOPES.split(','),
      hostName: process.env.SHOPIFY_APP_URL.replace(/^https?:\/\//, ''),
      isEmbeddedApp: true,
      apiVersion: '2025-07',
    });

    // Routes
    app.get('/', (req, res) => res.send('OK'));
    app.get('/healthz', (req, res) => res.send('OK'));
    app.get('/auth/shopify', async (req, res) => {
      const shop = req.query.shop;
      if (!shop) return res.status(400).send('Missing shop parameter');
      const authRoute = await shopifyApi.auth.beginAuth(req, res, shop, '/auth/shopify/callback', true);
      res.redirect(authRoute);
    });
    app.get('/auth/shopify/callback', async (req, res) => {
      try {
        const session = await shopifyApi.auth.validateAuthCallback(req, res);
        res.send('Shopify auth successful!');
      } catch (err) {
        console.error(err);
        res.status(500).send('Auth failed');
      }
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

initializeApp();
