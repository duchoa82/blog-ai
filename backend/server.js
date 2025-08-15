import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { ShopifyService } from './shopify.js';
import dotenv from 'dotenv';
import session from 'express-session';
import Redis from 'ioredis';
import connectRedis from 'connect-redis';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ===== Redis Session Store (v7+) =====
// FORCE RAILWAY DEPLOY - Redis configuration
console.log('🔍 Redis Configuration:');
console.log('📊 REDIS_URL:', process.env.REDIS_URL ? 'Present' : 'Missing');
console.log('🌍 NODE_ENV:', process.env.NODE_ENV);
console.log('🔒 REDIS_TLS:', process.env.REDIS_TLS);

const redisClient = new Redis(process.env.REDIS_URL, {
  tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3
});

redisClient.on('connect', () => {
  console.log('✅ Redis connection established successfully');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis connection failed:', err);
  process.exit(1); // Dừng server nếu Redis không kết nối
});

const RedisStore = connectRedis({
  client: redisClient,
  prefix: 'sess:', // để phân biệt session key trong Redis
  ttl: 24 * 60 * 60, // 1 ngày
});

app.use(session({
  store: RedisStore,
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // true khi deploy HTTPS
    sameSite: 'none',
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true
  },
  name: 'shopify-app-session'
}));

// Basic middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Session debugging middleware (for development/production debugging)
app.use((req, res, next) => {
  if (req.path.includes('/auth/')) {
    console.log(`🔍 Auth request: ${req.method} ${req.path}`);
    console.log(`📱 Session ID: ${req.sessionID}`);
    console.log(`🔑 Session exists: ${!!req.session}`);
    console.log(`🍪 Cookies: ${req.headers.cookie || 'No cookies'}`);
    if (req.session) {
      console.log(`📊 Session keys: ${Object.keys(req.session)}`);
      if (req.session.oauthState) {
        console.log(`🔐 OAuth state present: shop=${req.session.oauthState.shop}, state=${req.session.oauthState.state}`);
      }
    }
  }
  next();
});

// Healthcheck endpoint
app.get('/healthz', (_req, res) => res.send('OK'));

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

// API endpoints (simplified for now)
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Shopify OAuth endpoints
app.get('/auth/shopify', (req, res) => {
  try {
    const { shop } = req.query;
    
    if (!shop) {
      return res.status(400).json({ error: 'Shop parameter is required' });
    }
    
    const authUrl = ShopifyService.generateAuthUrl(shop, req);
    res.redirect(authUrl);
    
  } catch (error) {
    console.error('OAuth error:', error);
    res.status(500).json({ error: 'Failed to generate auth URL' });
  }
});

// OAuth callback endpoint
app.get('/auth/shopify/callback', async (req, res) => {
  try {
    console.log(`🔄 OAuth callback initiated`);
    console.log(`📱 Session ID: ${req.sessionID}`);
    console.log(`🔑 Session exists: ${!!req.session}`);
    console.log(`🍪 Cookies: ${req.headers.cookie || 'No cookies'}`);
    console.log(`🔍 Query params:`, req.query);
    
    // Check if we have required parameters
    const { shop, code, state } = req.query;
    if (!shop || !code || !state) {
      console.error('❌ Missing required OAuth parameters:', { shop, code, state });
      return res.status(400).json({ 
        error: 'Missing required OAuth parameters',
        received: { shop: !!shop, code: !!code, state: !!state }
      });
    }
    
    const result = await ShopifyService.handleCallback(req.query, req);
    
    if (result.success) {
      // OAuth successful - redirect to frontend with success
      const redirectUrl = `${process.env.FRONTEND_URL || 'https://blog-shopify-production.up.railway.app'}/auth-success?shop=${result.shop}`;
      console.log(`✅ OAuth successful, redirecting to: ${redirectUrl}`);
      res.redirect(redirectUrl);
    } else {
      // OAuth failed
      console.error(`❌ OAuth failed:`, result);
      res.status(400).json({ error: 'OAuth failed', details: result });
    }
    
  } catch (error) {
    console.error('❌ OAuth callback error:', error);
    console.error('📊 Error details:', {
      message: error.message,
      stack: error.stack,
      sessionExists: !!req.session,
      sessionKeys: req.session ? Object.keys(req.session) : 'No session',
      sessionID: req.sessionID,
      cookies: req.headers.cookie
    });
    
    // Send more detailed error response
    res.status(500).json({ 
      error: 'OAuth callback failed', 
      details: error.message,
      sessionInfo: {
        exists: !!req.session,
        keys: req.session ? Object.keys(req.session) : [],
        sessionID: req.sessionID
      },
      requestInfo: {
        query: req.query,
        cookies: req.headers.cookie ? 'Present' : 'Missing'
      }
    });
  }
});

// Session endpoint to get access token for frontend
app.get('/api/shopify/session', async (req, res) => {
  try {
    const { shop } = req.query;
    
    if (!shop) {
      return res.status(400).json({ error: 'Shop parameter is required' });
    }
    
    // Get access token from session storage
    const sessionData = req.session.shopData;
    if (!sessionData || !sessionData.accessToken || sessionData.shop !== shop) {
      return res.status(404).json({ error: 'No active session found for this shop' });
    }
    
    // Validate the access token before returning it
    const isValid = await ShopifyService.validateAccessToken(shop, sessionData.accessToken);
    if (!isValid) {
      console.log(`❌ Invalid access token for shop: ${shop}, removing session`);
      delete req.session.shopData;
      return res.status(401).json({ error: 'Access token is invalid or expired' });
    }
    
    res.json({ 
      success: true, 
      shop, 
      accessToken: sessionData.accessToken,
      timestamp: sessionData.timestamp
    });
    
  } catch (error) {
    console.error('Session fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// Shopify API endpoints
app.get('/api/shopify/products', async (req, res) => {
  try {
    const { shop, accessToken } = req.query;
    
    if (!shop || !accessToken) {
      return res.status(400).json({ 
        error: 'Shop and accessToken are required',
        received: { shop: !!shop, accessToken: !!accessToken }
      });
    }
    
    console.log(`🛍️ Products request for shop: ${shop}`);
    console.log(`🔑 Access token present: ${!!accessToken}`);
    
    const products = await ShopifyService.getProducts(shop, accessToken);
    res.json({ success: true, products });
    
  } catch (error) {
    console.error('Products fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch products',
      details: error.message,
      shop: req.query.shop
    });
  }
});

// Catch-all route to serve frontend (must be AFTER API routes)
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/healthz`);
});
