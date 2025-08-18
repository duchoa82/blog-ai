// server-new.js - Shopify SDK + Full OAuth + Session Storage
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';
import Redis from 'ioredis';
import { RedisSessionStorage } from '@shopify/shopify-app-session-storage-redis';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- Middleware ----------
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// ---------- Shopify API Setup ----------
const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: process.env.SHOPIFY_SCOPES?.split(',') || ['write_products', 'write_content'],
  hostName: process.env.APP_URL?.replace(/^https?:\/\//, '') || 'blog-shopify-production.up.railway.app',
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: true,
  // Session storage sẽ được set sau khi Redis connect
});

// ---------- Redis Setup ----------
let redis;
let sessionStorage;

async function setupRedis() {
  try {
    if (process.env.REDIS_URL) {
      redis = new Redis(process.env.REDIS_URL);
      sessionStorage = new RedisSessionStorage(redis);
      shopify.config.sessionStorage = sessionStorage;
      console.log('✅ Redis session storage connected');
    } else {
      console.log('⚠️ No REDIS_URL, using memory storage');
    }
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
    console.log('⚠️ Falling back to memory storage');
  }
}

// ---------- Serve Frontend ----------
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

// ---------- Health Check ----------
app.get('/healthz', (_, res) => res.json({ 
  status: 'ok', 
  time: new Date().toISOString(),
  shopify: 'configured',
  redis: !!redis
}));

// ---------- Step 1: Bắt đầu OAuth ----------
app.get('/auth', async (req, res) => {
  try {
    const { shop, host } = req.query;
    
    if (!shop) {
      return res.status(400).json({ error: 'Missing shop parameter' });
    }

    // Lưu host để forward qua callback
    req.session = req.session || {};
    req.session.oauthHost = host;

    console.log(`🚀 Starting OAuth for shop: ${shop}, host: ${host}`);

    const authRoute = await shopify.auth.begin({
      shop,
      callbackPath: '/auth/callback',
      isOnline: false,
      rawRequest: req,
      rawResponse: res,
    });

    return res.redirect(authRoute);
  } catch (error) {
    console.error('❌ OAuth initiation failed:', error);
    res.status(500).json({ error: 'OAuth initiation failed' });
  }
});

// ---------- Step 2: OAuth Callback ----------
app.get('/auth/callback', async (req, res) => {
  try {
    console.log('🔄 OAuth callback received:', req.query);

    const session = await shopify.auth.callback({
      rawRequest: req,
      rawResponse: res,
    });

    console.log('✅ OAuth successful for shop:', session.shop);

    // Lấy host từ session (đã lưu ở step 1)
    const oauthHost = req.session?.oauthHost;
    
    if (!oauthHost) {
      console.error('❌ Missing oauthHost in session');
      return res.status(500).send('OAuth host missing');
    }

    // Redirect về embedded app trong Shopify Admin
    const storeName = session.shop.replace('.myshopify.com', '');
    const adminUrl = `https://admin.shopify.com/store/${storeName}/apps/enipa-ai-blog-writing-assist?host=${encodeURIComponent(oauthHost)}&shop=${encodeURIComponent(session.shop)}`;
    
    console.log(`🔄 Redirecting to: ${adminUrl}`);
    return res.redirect(adminUrl);
  } catch (error) {
    console.error('❌ OAuth callback failed:', error);
    res.status(500).send('OAuth callback failed');
  }
});

// ---------- Shopify REST API ----------
app.get('/api/products', async (req, res) => {
  try {
    const { shop } = req.query;
    
    if (!shop) {
      return res.status(400).json({ error: 'Missing shop parameter' });
    }

    // Lấy session từ storage
    let session;
    if (sessionStorage) {
      session = await sessionStorage.loadSession(shop);
    } else {
      // Fallback to memory (không recommended cho production)
      return res.status(500).json({ error: 'Session storage not available' });
    }

    if (!session || !session.accessToken) {
      return res.status(401).json({ error: 'App not installed or token expired' });
    }

    const client = new shopify.clients.Rest({
      session: {
        shop,
        accessToken: session.accessToken,
      },
    });

    const products = await client.get({
      path: 'products',
      query: { limit: 10 },
    });

    res.json(products.body);
  } catch (error) {
    console.error('❌ Products API error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ---------- Shopify GraphQL API ----------
app.get('/api/shop-data', async (req, res) => {
  try {
    const { shop } = req.query;
    
    if (!shop) {
      return res.status(400).json({ error: 'Missing shop parameter' });
    }

    // Lấy session từ storage
    let session;
    if (sessionStorage) {
      session = await sessionStorage.loadSession(shop);
    } else {
      return res.status(500).json({ error: 'Session storage not available' });
    }

    if (!session || !session.accessToken) {
      return res.status(401).json({ error: 'App not installed or token expired' });
    }

    const client = new shopify.clients.Graphql({
      session: { shop, accessToken: session.accessToken },
    });

    const query = `#graphql
      {
        shop {
          name
          email
          myshopifyDomain
        }
        products(first: 5) {
          edges {
            node {
              id
              title
              status
              handle
            }
          }
        }
        blogs(first: 3) {
          edges {
            node {
              id
              title
              handle
            }
          }
        }
      }
    `;

    const response = await client.query({ data: query });
    res.json(response.body.data);
  } catch (error) {
    console.error('❌ GraphQL API error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ---------- App Routes ----------
app.get(['/app', '/'], (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ---------- Catch-all for frontend routing ----------
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ---------- Start Server ----------
async function startServer() {
  await setupRedis();
  
  app.listen(PORT, () => {
    console.log(`🚀 Backend running on port ${PORT}`);
    console.log(`🔍 Healthcheck: http://localhost:${PORT}/healthz`);
    console.log(`🔐 OAuth: http://localhost:${PORT}/auth?shop=your-shop.myshopify.com`);
    console.log(`🌐 App: http://localhost:${PORT}/app`);
    console.log(`📦 Shopify SDK: ${shopify.config.apiVersion}`);
    console.log(`💾 Session Storage: ${sessionStorage ? 'Redis' : 'Memory'}`);
  });
}

startServer().catch(console.error);
