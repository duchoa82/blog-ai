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
  next();
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

app.get('/auth/shopify/callback', async (req, res) => {
  try {
    const result = await ShopifyService.handleCallback(req.query);
    
    // Check if OAuth was successful
    if (result.success && result.accessToken) {
      // OAuth successful - show success message and stay in the app
      const successPage = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Installation Complete</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              text-align: center; 
              padding: 50px; 
              background-color: #f6f6f7;
              color: #202223;
            }
            .success-card {
              background: white;
              padding: 40px;
              border-radius: 8px;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
              max-width: 500px;
              margin: 0 auto;
            }
            .success-icon {
              font-size: 48px;
              margin-bottom: 20px;
            }
            .success-title {
              color: #28a745;
              font-size: 24px;
              font-weight: 600;
              margin-bottom: 20px;
            }
            .app-button {
              background: #5c6ac4;
              color: white;
              padding: 12px 24px;
              border: none;
              border-radius: 6px;
              font-size: 16px;
              cursor: pointer;
              margin: 10px;
              text-decoration: none;
              display: inline-block;
            }
            .app-button:hover {
              background: #4f5aa8;
            }
          </style>
        </head>
        <body>
          <div class="success-card">
            <div class="success-icon">✅</div>
            <div class="success-title">App Installation Successful!</div>
            <p>Your Blog SEO AI app is now installed and ready to use.</p>
            <p><strong>Store:</strong> ${result.shop || 'Unknown Shop'}</p>
            <p><strong>Access Token:</strong> Received</p>
            <br>
            <button class="app-button" onclick="window.location.href='/'">
              🚀 Start Using Your App
            </button>
          </div>
        </body>
        </html>
      `;
      
      res.send(successPage);
    } else {
      // OAuth failed
      res.status(400).json({ error: 'OAuth failed', details: result });
    }
    
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).json({ error: 'OAuth callback failed', details: error.message });
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
