// server-mock.js - Backend with Real Shopify OAuth
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== Middleware =====
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// ===== Serve static frontend files =====
app.use(express.static(path.join(__dirname, 'dist')));

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
const SHOPIFY_SCOPES = process.env.SHOPIFY_SCOPES || 'read_products,write_products,read_content,write_content';
const SHOPIFY_APP_URL = process.env.SHOPIFY_APP_URL || 'http://localhost:3000';

// ===== Root Route - Serve Frontend or Shopify App =====
app.get('/', (req, res) => {
  const { hmac, host, shop, timestamp } = req.query;

  if (hmac && shop) {
    // Shopify app load - redirect to OAuth flow instead of serving HTML
    console.log(`🔄 Shopify app load detected for shop: ${shop}`);
    console.log(`🔄 Redirecting to OAuth flow...`);
    
    // Redirect to OAuth initiation instead of serving HTML
    const oauthUrl = `/auth/shopify?shop=${shop}`;
    console.log(`🔗 Redirecting to: ${oauthUrl}`);
    res.redirect(oauthUrl);
  } else {
    // Direct access - serve frontend HTML
    console.log('🔄 Serving frontend for direct access');
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  }
});

// ===== Real OAuth Routes =====
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
  
  // ✅ FIX: Redirect user to Shopify consent screen instead of returning JSON
  res.redirect(redirectUrl);
});

app.get('/auth/shopify/callback', async (req, res) => {
  const { code, state, shop } = req.query;
  
  console.log('🔄 OAuth callback received:', { code: !!code, state, shop });

  // Validate OAuth state
  if (!req.session.oauthState || state !== req.session.oauthState) {
    console.error('❌ OAuth state mismatch');
    return res.status(400).json({ 
      error: 'OAuth callback failed',
      details: 'Invalid OAuth state' 
    });
  }

  if (!code || !shop) {
    console.error('❌ Missing OAuth parameters');
    return res.status(400).json({ 
      error: 'OAuth callback failed',
      details: 'Missing code or shop parameter' 
    });
  }

  try {
    // ✅ FIX: Exchange code for access token with Shopify
    const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: SHOPIFY_API_KEY,
        client_secret: SHOPIFY_API_SECRET,
        code
      })
    });

    const tokenData = await tokenResponse.json();
    
    if (tokenData.error) {
      throw new Error(tokenData.error_description || tokenData.error);
    }

    console.log('✅ OAuth successful for shop:', shop);
    console.log('🔑 Access token received:', !!tokenData.access_token);
    console.log('📋 Scope:', tokenData.scope);
    
    // Clear OAuth state
    delete req.session.oauthState;
    
    res.json({
      success: true,
      shop,
      accessToken: tokenData.access_token,
      scope: tokenData.scope,
      message: 'OAuth completed successfully!'
    });
  } catch (err) {
    console.error('❌ OAuth exchange failed:', err);
    res.status(500).json({ 
      error: 'OAuth exchange failed', 
      details: err.message 
    });
  }
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
  console.log(`🚀 Backend with Real OAuth running on port ${PORT}`);
  console.log(`🔍 Healthcheck: http://localhost:${PORT}/healthz`);
  console.log(`🔑 Test endpoint: http://localhost:${PORT}/test`);
  console.log(`🔐 OAuth: http://localhost:${PORT}/auth/shopify?shop=your-shop.myshopify.com`);
  console.log(`📊 Session debug: http://localhost:${PORT}/session`);
  console.log(`🌐 Frontend: http://localhost:${PORT}/ (serving dist/ folder)`);
  console.log(`📡 CORS enabled for external frontend`);
  console.log(`✅ Real OAuth flow implemented with code exchange`);
});
