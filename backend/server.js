// server.js - Clean Shopify OAuth + Embedded App
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- basic middlewares ----------
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// ---------- session (MemoryStore OK lúc đầu; prod thì dùng Redis) ----------
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// ---------- CSP để cho phép embed trong Shopify Admin ----------
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "frame-ancestors https://*.myshopify.com https://admin.shopify.com;"
  );
  // KHÔNG đặt X-Frame-Options: DENY. Nếu muốn, có thể bỏ luôn header này.
  next();
});

// ---------- serve FE (dist/) ----------
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

// ---------- health ----------
app.get('/healthz', (_, res) => res.json({ ok: true, ts: new Date().toISOString() }));

// ---------- helper ----------
function buildInstallUrl({ shop, state }) {
  const params = new URLSearchParams({
    client_id: process.env.SHOPIFY_API_KEY,
    scope: process.env.SHOPIFY_SCOPES,
    redirect_uri: `${process.env.APP_URL}/auth/callback`,
    state
  });
  return `https://${shop}/admin/oauth/authorize?${params.toString()}`;
}

function verifyHmac(query) {
  const { hmac, ...rest } = query;
  const message = Object.keys(rest)
    .sort()
    .map(k => `${k}=${Array.isArray(rest[k]) ? rest[k].join(',') : rest[k]}`)
    .join('&');

  const digest = crypto
    .createHmac('sha256', process.env.SHOPIFY_API_SECRET)
    .update(message)
    .digest('hex');

  return crypto.timingSafeEqual(Buffer.from(digest, 'utf-8'), Buffer.from(hmac, 'utf-8'));
}

// ---------- 1) bắt đầu OAuth ----------
app.get('/auth', (req, res) => {
  const shop = (req.query.shop || '').toString();
  if (!shop.endsWith('.myshopify.com')) {
    return res.status(400).json({ error: 'Missing or invalid shop (your-shop.myshopify.com)' });
  }

  const state = crypto.randomBytes(16).toString('hex');
  req.session.state = state;
  req.session.shop = shop;

  const url = buildInstallUrl({ shop, state });
  return res.redirect(url);
});

// ---------- 2) callback: verify + lấy access_token + redirect vào app ----------
app.get('/auth/callback', async (req, res) => {
  try {
    const { shop, hmac, state, code, host } = req.query;

    if (!shop || !hmac || !state || !code) {
      return res.status(400).send('Missing required OAuth params');
    }
    if (!req.session.state || state !== req.session.state) {
      return res.status(400).send('Invalid state');
    }
    if (!verifyHmac(req.query)) {
      return res.status(400).send('Invalid HMAC');
    }

    // exchange code -> token
    const tokenResp = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.SHOPIFY_API_KEY,
        client_secret: process.env.SHOPIFY_API_SECRET,
        code
      })
    });

    if (!tokenResp.ok) {
      const text = await tokenResp.text();
      console.error('Access token exchange failed:', text);
      return res.status(500).send('Token exchange failed');
    }
    const tokenJson = await tokenResp.json();
    // Lưu session tối thiểu
    req.session.accessToken = tokenJson.access_token;
    req.session.scopes = tokenJson.scope;
    req.session.shop = shop;

    // host param: nếu Shopify chưa truyền, tự dựng base64("shop/admin")
    const hostParam = host || Buffer.from(`${shop}/admin`).toString('base64');

    // Redirect vào FE (embedded) kèm host + shop —> App Bridge sẽ hoạt động
    return res.redirect(`/app?shop=${encodeURIComponent(shop)}&host=${encodeURIComponent(hostParam)}`);
  } catch (e) {
    console.error('OAuth callback error:', e);
    return res.status(500).send('OAuth callback error');
  }
});

// ---------- trang app (embedded) ----------
app.get(['/app', '/'], (req, res) => {
  // Nếu được gọi từ Admin (có host/hmac) -> cứ trả index.html (App Bridge sẽ forceRedirect nếu cần)
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ---------- Catch-all route for frontend routing ----------
app.get('*', (req, res) => {
  // Serve index.html for all other routes to support frontend routing
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ---------- API test (đã auth) ----------
app.get('/api/me', (req, res) => {
  if (!req.session?.accessToken || !req.session?.shop) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json({
    ok: true,
    shop: req.session.shop,
    scopes: req.session.scopes,
    token: 'present'
  });
});

// ---------- Blog AI API routes ----------
app.post('/generate', async (req, res) => {
  try {
    if (!req.session?.accessToken || !req.session?.shop) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { prompt, type } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt parameter' });
    }

    // Mock AI generation for now
    const generatedContent = {
      title: `AI Generated: ${prompt}`,
      content: `This is AI-generated content based on your prompt: "${prompt}". In a real implementation, this would call an AI service like OpenAI or similar.`,
      type: type || 'blog_post',
      timestamp: new Date().toISOString(),
      shop: req.session.shop
    };

    res.json({
      success: true,
      data: generatedContent
    });
  } catch (error) {
    console.error('Generate error:', error);
    res.status(500).json({ error: 'Generation failed' });
  }
});

app.get('/posts', async (req, res) => {
  try {
    if (!req.session?.accessToken || !req.session?.shop) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Mock posts data
    const posts = [
      {
        id: 1,
        title: 'Welcome to Blog AI',
        content: 'This is your first AI-generated blog post.',
        status: 'published',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Getting Started with AI Writing',
        content: 'Learn how to use AI to create engaging content.',
        status: 'draft',
        createdAt: new Date().toISOString()
      }
    ];

    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    console.error('Posts error:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

app.get('/settings', async (req, res) => {
  try {
    if (!req.session?.accessToken || !req.session?.shop) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const settings = {
      shop: req.session.shop,
      scopes: req.session.scopes,
      apiKey: process.env.SHOPIFY_API_KEY,
      appUrl: process.env.APP_URL
    };

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Settings error:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
  console.log(`🔍 Healthcheck: http://localhost:${PORT}/healthz`);
  console.log(`🔐 OAuth: http://localhost:${PORT}/auth?shop=your-shop.myshopify.com`);
  console.log(`🌐 App: http://localhost:${PORT}/app`);
});
