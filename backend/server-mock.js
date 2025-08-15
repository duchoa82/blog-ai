// server-mock.js
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
  credentials: true
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
const SHOPIFY_SCOPES = process.env.SHOPIFY_SCOPES || 'read_products,write_products,read_blog';
const SHOPIFY_APP_URL = process.env.SHOPIFY_APP_URL || 'http://localhost:3000';

// ===== Root Route - Handle Shopify App Load =====
app.get('/', (req, res) => {
  const { hmac, host, shop, timestamp } = req.query;
  
  if (hmac && shop) {
    // Shopify app load - serve HTML app interface
    console.log(`🔄 Shopify app load for shop: ${shop}`);
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Blog AI - Shopify App</title>
    <script src="https://unpkg.com/@shopify/app-bridge@3.7.9/dist/index.global.js"></script>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f6f6f7; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        h1 { color: #004c3f; margin-bottom: 20px; }
        .status { background: #d1fae5; border: 1px solid #10b981; padding: 15px; border-radius: 6px; margin: 20px 0; }
        .shop-info { background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0; }
        .btn { background: #004c3f; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; }
        .btn:hover { background: #065f46; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Blog AI - Shopify App</h1>
        
        <div class="status">
            <strong>✅ App Status:</strong> Successfully loaded in Shopify Admin
        </div>
        
        <div class="shop-info">
            <strong>🏪 Shop:</strong> ${shop}<br>
            <strong>🔑 API Key:</strong> ${SHOPIFY_API_KEY}<br>
            <strong>📋 Scopes:</strong> ${SHOPIFY_SCOPES}<br>
            <strong>⏰ Loaded at:</strong> ${new Date().toISOString()}
        </div>
        
        <h3>🎯 Next Steps:</h3>
        <ul>
            <li>✅ OAuth flow completed</li>
            <li>🔧 Configure app settings</li>
            <li>📝 Start creating blog content</li>
            <li>🚀 Deploy AI features</li>
        </ul>
        
        <button class="btn" onclick="testAPI()">🧪 Test Backend API</button>
        <button class="btn" onclick="window.location.href='/healthz'">🔍 Health Check</button>
        
        <div id="api-result" style="margin-top: 20px; padding: 15px; background: #f9fafb; border-radius: 6px; display: none;"></div>
    </div>
    
    <script>
        // Initialize Shopify App Bridge
        try {
            const app = window.createApp({
                apiKey: '${SHOPIFY_API_KEY}',
                host: '${host}',
                forceRedirect: true
            });
            console.log('✅ Shopify App Bridge initialized');
        } catch (error) {
            console.error('❌ App Bridge error:', error);
        }
        
        async function testAPI() {
            try {
                const response = await fetch('/test');
                const data = await response.json();
                document.getElementById('api-result').innerHTML = '<strong>API Response:</strong><br>' + JSON.stringify(data, null, 2);
                document.getElementById('api-result').style.display = 'block';
            } catch (error) {
                document.getElementById('api-result').innerHTML = '<strong>API Error:</strong><br>' + error.message;
                document.getElementById('api-result').style.display = 'block';
            }
        }
    </script>
</body>
</html>`;
    
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } else {
    // Direct access - serve frontend HTML
    console.log('🔄 Serving frontend for direct access');
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  }
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
  console.log(`🚀 Mock backend running on port ${PORT}`);
  console.log(`🔍 Healthcheck: http://localhost:${PORT}/healthz`);
  console.log(`🔑 Test endpoint: http://localhost:${PORT}/test`);
  console.log(`🔐 OAuth: http://localhost:${PORT}/auth/shopify?shop=your-shop.myshopify.com`);
  console.log(`📊 Session debug: http://localhost:${PORT}/session`);
  console.log(`🌐 Frontend: http://localhost:${PORT}/ (serving dist/ folder)`);
});
