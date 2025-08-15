// server.js
import express from 'express';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { createClient } from 'redis';
import dotenv from 'dotenv';
import { shopifyApi } from '@shopify/shopify-api';
import { MemorySessionStorage } from '@shopify/shopify-api/dist/auth/session/index.js';
import path from 'path';

dotenv.config();
const app = express();

// ===== Basic Routes FIRST (always available) =====
app.get('/', (req, res) => res.send('OK'));
app.get('/healthz', (req, res) => res.status(200).send('OK'));

// ===== Start server FIRST =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔍 Healthcheck: http://localhost:${PORT}/healthz`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// ===== Initialize Redis and Shopify AFTER server start =====
(async () => {
  try {
    // ===== Redis setup =====
    let redisClient = null;
    let RedisStore = null;
    
    if (process.env.REDIS_URL) {
      try {
        RedisStore = connectRedis(session);
        redisClient = createClient({
          url: process.env.REDIS_URL,
          socket: {
            tls: process.env.REDIS_TLS === 'true',
            rejectUnauthorized: false,
          },
        });
        
        redisClient.on('error', (err) => console.error('Redis Client Error', err));
        await redisClient.connect();
        console.log('✅ Redis connected successfully');

        // ===== Session middleware with Redis =====
        app.use(
          session({
            store: new RedisStore({ client: redisClient }),
            secret: process.env.SESSION_SECRET || 'keyboard cat',
            resave: false,
            saveUninitialized: false,
            cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 },
          })
        );
        
        // Add test session route after Redis is ready
        app.get('/test-session', (req, res) => {
          req.session.views = (req.session.views || 0) + 1;
          res.send(`You visited this page ${req.session.views} times (Redis)`);
        });
        
      } catch (redisError) {
        console.error('❌ Redis connection failed, using memory store:', redisError);
        // Fallback to memory store
        app.use(
          session({
            secret: process.env.SESSION_SECRET || 'keyboard cat',
            resave: false,
            saveUninitialized: false,
            cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 },
          })
        );
        
        // Add test session route with memory store
        app.get('/test-session', (req, res) => {
          req.session.views = (req.session.views || 0) + 1;
          res.send(`You visited this page ${req.session.views} times (Memory)`);
        });
      }
    } else {
      console.log('⚠️ No REDIS_URL, using memory store');
      app.use(
        session({
          secret: process.env.SESSION_SECRET || 'keyboard cat',
          resave: false,
          saveUninitialized: false,
          cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 },
        })
      );
      
      // Add test session route with memory store
      app.get('/test-session', (req, res) => {
        req.session.views = (req.session.views || 0) + 1;
        res.send(`You visited this page ${req.session.views} times (Memory)`);
      });
    }

    // ===== Shopify context =====
    if (process.env.SHOPIFY_API_KEY && process.env.SHOPIFY_API_SECRET && process.env.SCOPES && (process.env.HOST || process.env.SHOPIFY_APP_URL)) {
      try {
        const hostName = (process.env.HOST || process.env.SHOPIFY_APP_URL).replace(/^https?:\/\//, '');
        shopifyApi.initialize({
          apiKey: process.env.SHOPIFY_API_KEY,
          apiSecretKey: process.env.SHOPIFY_API_SECRET,
          scopes: process.env.SCOPES.split(','),
          hostName: hostName,
          isEmbeddedApp: true,
          apiVersion: '2025-07',
          sessionStorage: new MemorySessionStorage(),
        });
        console.log('✅ Shopify API initialized');

        // ===== Shopify OAuth Routes =====
        app.get('/auth/shopify', async (req, res) => {
          const shop = req.query.shop;
          if (!shop) return res.status(400).send('Missing shop parameter');
          const authRoute = await shopifyApi.auth.beginAuth(req, res, shop, '/auth/shopify/callback', true);
          return res.redirect(authRoute);
        });

        app.get('/auth/shopify/callback', (req, res) => {
          console.log('🔍 === CALLBACK DEBUG ===');
          console.log('✅ Callback hit:', req.originalUrl);
          console.log('📝 Query params:', req.query);
          console.log('🌐 Full URL:', req.protocol + '://' + req.get('host') + req.originalUrl);
          console.log('🔑 Shopify API Key:', process.env.SHOPIFY_API_KEY ? '✅ Set' : '❌ Missing');
          console.log('🔐 Shopify API Secret:', process.env.SHOPIFY_API_SECRET ? '✅ Set' : '❌ Missing');
          console.log('📋 Scopes:', process.env.SCOPES || '❌ Missing');
          console.log('🏠 HOST:', process.env.HOST || '❌ Missing');
          console.log('🔗 SHOPIFY_APP_URL:', process.env.SHOPIFY_APP_URL || '❌ Missing');
          console.log('================================');
          
          // Temporary test response
          res.send(`
            <h1>🎯 Callback Reached Successfully!</h1>
            <p><strong>URL:</strong> ${req.originalUrl}</p>
            <p><strong>Shop:</strong> ${req.query.shop || 'N/A'}</p>
            <p><strong>HMAC:</strong> ${req.query.hmac ? '✅ Present' : '❌ Missing'}</p>
            <p><strong>Timestamp:</strong> ${req.query.timestamp || 'N/A'}</p>
            <hr>
            <p><em>This is a test route. Check server logs for full debug info.</em></p>
          `);
        });

        // ===== Handle Shopify redirect to root with OAuth params =====
        // Override the basic healthcheck route to handle OAuth redirects
        app.get('/', (req, res) => {
          // Check if this is Shopify OAuth redirect
          if (req.query.shop && req.query.hmac && req.query.timestamp) {
            console.log('🔄 Shopify OAuth redirect detected, redirecting to callback');
            const callbackUrl = `/auth/shopify/callback?${new URLSearchParams(req.query).toString()}`;
            return res.redirect(callbackUrl);
          }
          // Normal healthcheck
          res.send('OK');
        });

        console.log('🔑 Shopify OAuth routes enabled');

        // ===== Serve Frontend Static Files =====
        app.use(express.static(path.join(process.cwd(), 'frontend', 'dist')));
        
        // Catch-all route for SPA
        app.get('*', (req, res) => {
          res.sendFile(path.join(process.cwd(), 'frontend', 'dist', 'index.html'));
        });

      } catch (shopifyError) {
        console.error('❌ Shopify API initialization failed:', shopifyError);
        console.log('⚠️ Shopify OAuth routes disabled');
      }
    } else {
      console.log('⚠️ Missing Shopify environment variables, OAuth routes disabled');
    }

    console.log('📊 App initialization completed');

  } catch (error) {
    console.error('❌ App initialization failed:', error);
    // Don't exit - server is already running
  }
})();
