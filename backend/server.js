const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { ShopifyService } = require('./shopify');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      frameAncestors: ["'self'", "https://*.myshopify.com", "https://*.shopify.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://*.myshopify.com", "https://*.shopify.com"]
    }
  }
}));
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'https://blog-shopify-production.up.railway.app',
    /https:\/\/.*\.myshopify\.com$/,
    /https:\/\/.*\.shopify\.com$/
  ],
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Shopify app embedding headers
app.use((req, res, next) => {
  // Remove conflicting X-Frame-Options header
  // Let CSP handle iframe permissions
  res.setHeader('Content-Security-Policy', "frame-ancestors 'self' https://*.myshopify.com https://*.shopify.com");
  
  // Add CORS headers for preflight requests
  res.header('Access-Control-Allow-Origin', 'https://blog-shopify-production.up.railway.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  next();
});

// Handle preflight requests for specific routes
app.options('/api/generate-blog', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'https://blog-shopify-production.up.railway.app');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.sendStatus(200);
});

app.options('/api/shopify/products', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'https://blog-shopify-production.up.railway.app');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.sendStatus(200);
});

app.options('/api/shopify/blogs', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'https://blog-shopify-production.up.railway.app');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.sendStatus(200);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  // Check if this is a Shopify OAuth request
  if (req.query.shop && req.query.hmac) {
    // This is a Shopify OAuth request, redirect to OAuth handler
    return res.redirect(`/auth/shopify?${new URLSearchParams(req.query).toString()}`);
  }
  
  // Regular API info request
  res.json({
    message: '🚀 Blog SEO AI Backend API',
    version: '1.0.0',
    status: 'Running',
    endpoints: {
      health: '/health',
      shopify: {
        auth: '/auth/shopify',
        callback: '/auth/shopify/callback',
        products: '/api/shopify/products',
        blogs: '/api/shopify/blogs',
        articles: '/api/shopify/articles'
      },
      ai: {
        generateBlog: '/api/generate-blog'
      }
    },
    timestamp: new Date().toISOString()
  });
});

// Shopify OAuth endpoints
app.get('/auth/shopify', (req, res) => {
  try {
    const { shop } = req.query;
    
    if (!shop) {
      return res.status(400).json({ error: 'Shop parameter is required' });
    }
    
    const authUrl = ShopifyService.generateAuthUrl(shop);
    
    // Automatically redirect to the authorization URL
    res.redirect(authUrl);
    
  } catch (error) {
    console.error('OAuth error:', error);
    res.status(500).json({ error: 'Failed to generate auth URL' });
  }
});

// OAuth callback endpoint
app.get('/auth/shopify/callback', async (req, res) => {
  try {
    const result = await ShopifyService.handleCallback(req.query);
    
    if (result.success) {
      // OAuth successful - redirect to frontend with success
      const redirectUrl = `${process.env.FRONTEND_URL || 'https://blog-shopify-production.up.railway.app'}/auth-success?shop=${result.shop}`;
      res.redirect(redirectUrl);
    } else {
      // OAuth failed
      res.status(400).json({ error: 'OAuth failed', details: result });
    }
    
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).json({ error: 'OAuth callback failed', details: error.message });
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
    const session = sessions.get(shop);
    if (!session || !session.accessToken) {
      return res.status(404).json({ error: 'No active session found for this shop' });
    }
    
    res.json({ 
      success: true, 
      shop, 
      accessToken: session.accessToken,
      timestamp: session.timestamp
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
      return res.status(400).json({ error: 'Shop and accessToken are required' });
    }
    
    const products = await ShopifyService.getProducts(shop, accessToken);
    res.json({ success: true, products });
    
  } catch (error) {
    console.error('Products fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/shopify/blogs', async (req, res) => {
  try {
    const { shop, accessToken } = req.query;
    
    if (!shop || !accessToken) {
      return res.status(400).json({ error: 'Shop and accessToken are required' });
    }
    
    const blogs = await ShopifyService.getBlogs(shop, accessToken);
    res.json({ success: true, blogs });
    
  } catch (error) {
    console.error('Blogs fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

app.post('/api/shopify/articles', async (req, res) => {
  try {
    const { shop, accessToken, blogId, articleData } = req.body;
    
    if (!shop || !accessToken || !blogId || !articleData) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const article = await ShopifyService.createArticle(shop, accessToken, blogId, articleData);
    res.json({ success: true, article });
    
  } catch (error) {
    console.error('Article creation error:', error);
    res.status(500).json({ error: 'Failed to create article' });
  }
});

// Blog generation endpoint
app.post('/api/generate-blog', async (req, res) => {
  try {
    const { prompt, apiKey } = req.body;
    
    if (!prompt || !apiKey) {
      return res.status(400).json({ 
        error: 'Missing required fields: prompt and apiKey' 
      });
    }

    // Call Google Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.candidates[0].content.parts[0].text;

    res.json({ 
      success: true, 
      content: generatedContent 
    });

  } catch (error) {
    console.error('Blog generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate blog content',
      details: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Shopify OAuth: http://localhost:${PORT}/auth/shopify`);
});
