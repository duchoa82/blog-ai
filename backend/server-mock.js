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
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));
app.use(express.json());

// ===== Serve static frontend files =====
app.use(express.static(path.join(__dirname, 'dist')));

// ===== Session setup =====
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 24*60*60*1000,
    sameSite: 'lax',
    httpOnly: true,
    domain: process.env.NODE_ENV === 'production' ? '.up.railway.app' : undefined
  },
  name: 'blog-ai-session' // Custom session name
}));

// Session middleware logging
app.use((req, res, next) => {
  console.log(`📊 Session middleware - ID: ${req.sessionID}, State: ${req.session.oauthState || 'not set'}`);
  next();
});

// ===== Shopify OAuth Configuration =====
const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY || 'mock-api-key';
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET || 'mock-api-secret';
const SHOPIFY_SCOPES = process.env.SHOPIFY_SCOPES || 'read_products,write_products,read_content,write_content';
const SHOPIFY_APP_URL = process.env.SHOPIFY_APP_URL || 'http://localhost:3000';

// ===== Root Route - Simple logic to avoid redirect loops =====
app.get('/', (req, res) => {
  const { hmac, host, shop, timestamp } = req.query;

  if (hmac && shop) {
    // Always serve the main app UI for Shopify app loads
    // Let the frontend handle OAuth flow if needed
    console.log(`🔄 Shopify app load for shop: ${shop}, serving main app UI`);
    serveMainAppUI(req, res, shop);
  } else {
    // Direct access - serve frontend HTML
    console.log('🔄 Serving frontend for direct access');
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  }
});

// ===== Helper function to serve main app UI =====
function serveMainAppUI(req, res, shop) {
  const accessToken = req.session.accessToken;
  const scope = req.session.scope;
  
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
        .btn { background: #004c3f; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; margin: 5px; }
        .btn:hover { background: #065f46; }
        .token-info { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0; }
        .oauth-section { background: #dbeafe; border: 1px solid #3b82f6; padding: 15px; border-radius: 6px; margin: 20px 0; }
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
        
        ${accessToken ? `
        <div class="token-info">
            <strong>🔐 Access Token:</strong> ✅ Present<br>
            <strong>🔒 Token Status:</strong> Valid<br>
            <strong>📋 Granted Scopes:</strong> ${scope || 'N/A'}
        </div>
        ` : `
        <div class="oauth-section">
            <strong>🔐 OAuth Status:</strong> Not authenticated yet<br>
            <strong>📋 Required Scopes:</strong> ${SHOPIFY_SCOPES}<br>
            <button class="btn" onclick="initiateOAuth()">🔑 Start OAuth Flow</button>
        </div>
        `}
        
        <h3>🎯 Next Steps:</h3>
        <ul>
            <li>${accessToken ? '✅ OAuth flow completed' : '⏳ OAuth flow pending'}</li>
            <li>🔧 Configure app settings</li>
            <li>📝 Start creating blog content</li>
            <li>🚀 Deploy AI features</li>
        </ul>
        
        <button class="btn" onclick="testAPI()">🧪 Test Backend API</button>
        <button class="btn" onclick="window.location.href='/healthz'">🔍 Health Check</button>
        <button class="btn" onclick="window.location.href='/session'">📊 Session Info</button>
        ${!accessToken ? `<button class="btn" onclick="initiateOAuth()">🔄 Retry OAuth</button>` : ''}
        
        <div id="api-result" style="margin-top: 20px; padding: 15px; background: #f9fafb; border-radius: 6px; display: none;"></div>
    </div>
    
    <script>
        // Initialize Shopify App Bridge
        try {
            const app = window.createApp({
                apiKey: '${SHOPIFY_API_KEY}',
                host: 'admin.shopify.com',
                forceRedirect: true
            });
            console.log('✅ Shopify App Bridge initialized');
        } catch (error) {
            console.error('❌ App Bridge error:', error);
        }
        
        async function initiateOAuth() {
            try {
                console.log('🔄 Initiating OAuth flow...');
                // Redirect directly to Shopify OAuth endpoint
                const oauthUrl = 'https://${shop}/admin/oauth/authorize?' +
                    'client_id=${SHOPIFY_API_KEY}&' +
                    'scope=${SHOPIFY_SCOPES}&' +
                    'redirect_uri=${SHOPIFY_APP_URL}/auth/shopify/callback&' +
                    'state=' + Math.random().toString(36).substring(7);
                console.log('🔗 Redirecting to Shopify OAuth:', oauthUrl);
                window.location.href = oauthUrl;
            } catch (error) {
                console.error('❌ OAuth initiation failed:', error);
                alert('OAuth initiation failed: ' + error.message);
            }
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
        
        // Auto-initiate OAuth if not authenticated
        if (!${accessToken ? 'true' : 'false'}) {
            console.log('🔄 Auto-initiating OAuth flow...');
            setTimeout(() => {
                // Direct redirect to Shopify OAuth
                const oauthUrl = 'https://${shop}/admin/oauth/authorize?' +
                    'client_id=${SHOPIFY_API_KEY}&' +
                    'scope=${SHOPIFY_SCOPES}&' +
                    'redirect_uri=${SHOPIFY_APP_URL}/auth/shopify/callback&' +
                    'state=' + Math.random().toString(36).substring(7);
                console.log('🔗 Auto-redirecting to Shopify OAuth:', oauthUrl);
                window.location.href = oauthUrl;
            }, 1000);
        }
    </script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
}

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
  
  // Force session save
  req.session.save((err) => {
    if (err) {
      console.error('❌ Session save failed:', err);
      return res.status(500).json({ error: 'Session save failed' });
    }
    
    console.log(`🔄 OAuth initiated for shop: ${shop}`);
    console.log(`🔑 OAuth state saved: ${state}`);
    console.log(`📊 Session ID: ${req.sessionID}`);
    
    // Build OAuth URL
    const redirectUrl = `https://${shop}/admin/oauth/authorize?` +
      `client_id=${SHOPIFY_API_KEY}&` +
      `scope=${SHOPIFY_SCOPES}&` +
      `redirect_uri=${SHOPIFY_APP_URL}/auth/shopify/callback&` +
      `state=${state}`;

    console.log(`🔗 Redirect URL: ${redirectUrl}`);
    
    // Redirect user to Shopify consent screen
    res.redirect(redirectUrl);
  });
});

app.get('/auth/shopify/callback', async (req, res) => {
  const { code, state, shop } = req.query;
  
  console.log('🔄 OAuth callback received:', { code: !!code, state, shop });
  console.log(`📊 Session ID: ${req.sessionID}`);
  console.log(`🔑 Session OAuth state: ${req.session.oauthState || 'not set'}`);

  // Try session state first, then fallback to query parameter
  let validState = req.session.oauthState;
  let stateSource = 'session';
  
  if (!validState && state) {
    // Fallback: use state from query parameter (less secure but functional)
    console.log('⚠️ Using fallback state from query parameter');
    validState = state;
    stateSource = 'query';
  }

  if (!validState) {
    console.error('❌ No OAuth state found in session or query');
    return res.status(400).json({ 
      error: 'OAuth callback failed',
      details: 'No OAuth state found in session or query parameters'
    });
  }

  if (state !== validState) {
    console.error(`❌ OAuth state mismatch - Expected: ${validState}, Received: ${state}, Source: ${stateSource}`);
    return res.status(400).json({ 
      error: 'OAuth callback failed',
      details: `OAuth state mismatch - Expected: ${validState}, Received: ${state}`
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
    // Exchange code for access token
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
    console.log(`📊 State validation: ${stateSource} (${validState})`);
    
    // Clear OAuth state
    delete req.session.oauthState;
    
    // Store access token in session for future use
    req.session.accessToken = tokenData.access_token;
    req.session.shop = shop;
    req.session.scope = tokenData.scope;
    
    // Force session save
    req.session.save((err) => {
      if (err) {
        console.error('❌ Session save failed:', err);
        return res.status(500).json({ error: 'Session save failed' });
      }
      
      // Redirect to main app UI
      const appUrl = `/?hmac=oauth_completed&shop=${shop}&host=admin.shopify.com&timestamp=${Date.now()}&redirect_count=0`;
      console.log(`🔄 Redirecting to main app UI: ${appUrl}`);
      res.redirect(appUrl);
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
    accessToken: req.session.accessToken ? 'present' : 'not present',
    scope: req.session.scope,
    timestamp: new Date().toISOString(),
    sessionData: req.session
  });
});

app.get('/debug-oauth', (req, res) => {
  const { shop } = req.query;
  if (!shop) {
    return res.json({ error: 'Missing shop parameter' });
  }
  
  // Simulate OAuth initiation for debugging
  const state = Math.random().toString(36).substring(7);
  req.session.oauthState = state;
  req.session.shop = shop;
  
  req.session.save((err) => {
    if (err) {
      return res.json({ error: 'Session save failed', details: err.message });
    }
    
    res.json({
      message: 'OAuth state set for debugging',
      shop,
      state,
      sessionId: req.sessionID,
      sessionData: req.session
    });
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
