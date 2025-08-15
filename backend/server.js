// server.js
import express from 'express';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { createClient } from 'redis';
import dotenv from 'dotenv';
import { shopifyApi, Session } from '@shopify/shopify-api';

dotenv.config();
const app = express();

async function initializeApp() {
  try {
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
    console.log('✅ Redis connected successfully');

    // ===== Session middleware =====
    app.use(
      session({
        store: new RedisStore({ client: redisClient }),
        secret: process.env.SESSION_SECRET || 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: process.env.NODE_ENV === 'production',
          maxAge: 24 * 60 * 60 * 1000,
        },
      })
    );

    // ===== Shopify API initialization =====
    try {
      shopifyApi.initialize({
        apiKey: process.env.SHOPIFY_API_KEY,
        apiSecretKey: process.env.SHOPIFY_API_SECRET,
        scopes: process.env.SHOPIFY_SCOPES.split(','),
        hostName: process.env.SHOPIFY_APP_URL.replace(/^https?:\/\//, ''),
        isEmbeddedApp: true,
        apiVersion: '2025-07',
        sessionStorage: new Session.MemorySessionStorage(),
      });
      console.log('✅ Shopify API initialized');
    } catch (shopifyError) {
      console.error('❌ Shopify API initialization failed:', shopifyError);
      console.log('⚠️ Shopify OAuth routes disabled');
    }

    // ===== Routes =====
    app.get('/', (req, res) => res.send('OK'));
    app.get('/healthz', (req, res) => res.status(200).send('OK'));

    app.get('/test-session', (req, res) => {
      req.session.views = (req.session.views || 0) + 1;
      res.send(`You visited this page ${req.session.views} times`);
    });

    // ===== Auth routes =====
    app.get('/auth/shopify', async (req, res) => {
      const shop = req.query.shop;
      if (!shop) return res.status(400).send('Missing shop parameter');
      const authRoute = await shopifyApi.auth.beginAuth(
        req,
        res,
        shop,
        '/auth/shopify/callback',
        true
      );
      return res.redirect(authRoute);
    });

    app.get('/auth/shopify/callback', async (req, res) => {
      try {
        const session = await shopifyApi.auth.validateAuthCallback(req, res);
        res.send('Shopify auth successful!');
      } catch (error) {
        console.error(error);
        res.status(500).send('Auth failed');
      }
    });

    // ===== Start server =====
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🔍 Healthcheck: http://localhost:${PORT}/healthz`);
    });

  } catch (error) {
    console.error('❌ App initialization failed:', error);
    process.exit(1);
  }
}

// Start app
initializeApp();
