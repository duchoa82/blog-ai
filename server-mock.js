// server-mock.js - API only backend
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// ===== Middleware =====
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// ===== Session setup =====
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, 
    maxAge: 24*60*60*1000,
    sameSite: 'lax'
  }
}));

// ===== Shopify OAuth Configuration =====
const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY || 'mock-api-key';
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET || 'mock-api-secret';
const SHOPIFY_SCOPES = process.env.SHOPIFY_SCOPES || 'read_products,write_products,read_blog';
const SHOPIFY_APP_URL = process.env.SHOPIFY_APP_URL || 'http://localhost:3000';

// ===== Root Route - API Info =====
app.get('/', (req, res) => {
  res.json({
    message: 'Blog AI Backend API',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/healthz',
      test: '/test',
      oauth: '/auth/shopify',
      session: '/session'
    },
    frontend: 'http://localhost:5173',
    note: 'Frontend runs separately on port 5173'
  });
});

// ===== OAuth Routes =====
app.get('/auth/shopify', (req, res) => {
  const shop = req.query.shop;
  
  if (!shop) {
    return res.status(400).json({ 
      error: 'Missing shop parameter',
      example: '/auth/shopify?shop=your-shop.myshopify.com'
    });
  }

  // Generate OAuth state for security
  const state = Math.random().toString(36).substring(7);
  req.session.oauthState = state;
  req.session.shop = shop;

  // Build OAuth URL
  const redirectUrl = `https://${shop}/admin/oauth/authorize?` +
    `client_id=${SHOPIFY_API_KEY}&` +
    `scope=${SHOPIFY_SCOPES}&` +
    `redirect_uri=${SHOPIFY_APP_URL}/auth/shopify/callback&` +
    `state=${state}`;

  console.log(`🔄 OAuth initiated for shop: ${shop}`);
  console.log(`🔗 Redirect URL: ${redirectUrl}`);
  
  res.json({ 
    message: 'OAuth URL generated',
    shop,
    redirectUrl,
    state,
    scopes: SHOPIFY_SCOPES
  });
});

app.get('/auth/shopify/callback', (req, res) => {
  const { code, state, shop } = req.query;
  
  console.log('🔄 OAuth callback received:', { code: !!code, state, shop });

  // Validate OAuth state
  if (!req.session.oauthState || state !== req.session.oauthState) {
    console.error('❌ OAuth state mismatch');
    return res.status(400).json({ 
      error: 'OAuth callback failed',
      details: 'No OAuth state found in session or state mismatch'
    });
  }

  if (!code || !shop) {
    console.error('❌ Missing OAuth parameters');
    return res.status(400).json({ 
      error: 'OAuth callback failed',
      details: 'Missing code or shop parameter'
    });
  }

  // Mock successful OAuth (in real app, exchange code for access token)
  console.log('✅ OAuth successful for shop:', shop);
  
  // Clear OAuth state
  delete req.session.oauthState;
  
  res.json({ 
    success: true, 
    shop,
    message: 'OAuth completed successfully (mocked)',
    code: code.substring(0, 10) + '...',
    scopes: SHOPIFY_SCOPES
  });
});

// ===== Test Endpoints =====
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/test', (req, res) => {
  res.json({ message: 'Backend test endpoint works!', timestamp: new Date().toISOString() });
});

// ===== Session Debug =====
app.get('/session', (req, res) => {
  res.json({
    sessionId: req.sessionID,
    shop: req.session.shop,
    oauthState: req.session.oauthState ? 'set' : 'not set',
    timestamp: new Date().toISOString()
  });
});

// ===== Error handling =====
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ 
    error: err.message, 
    timestamp: new Date().toISOString() 
  });
});

// ===== Start server =====
app.listen(PORT, () => {
  console.log(`🚀 Backend API running on port ${PORT}`);
  console.log(`🔍 Healthcheck: http://localhost:${PORT}/healthz`);
  console.log(`🔑 Test endpoint: http://localhost:${PORT}/test`);
  console.log(`🔐 OAuth: http://localhost:${PORT}/auth/shopify?shop=your-shop.myshopify.com`);
  console.log(`📊 Session debug: http://localhost:${PORT}/session`);
  console.log(`🌐 Frontend: http://localhost:5173 (separate Vite dev server)`);
  console.log(`📡 CORS enabled for frontend`);
});
