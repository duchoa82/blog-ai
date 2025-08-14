const crypto = require('crypto');

// Store for active sessions (in production, use Redis or database)
const sessions = new Map();

class ShopifyService {
  // Generate OAuth URL for shop installation
  static generateAuthUrl(shop) {
    const state = crypto.randomBytes(16).toString('hex');
    
    const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${process.env.SHOPIFY_API_KEY || '98d5cae75b3fdce1011668a7b6bdc8e2'}&scope=${process.env.SHOPIFY_SCOPES || 'read_products,write_products,read_content,write_content'}&redirect_uri=${process.env.SHOPIFY_APP_URL || 'https://exquisite-nature-production.up.railway.app'}/auth/shopify/callback&state=${state}`;
    
    // Store state for verification
    sessions.set(state, { shop, timestamp: Date.now() });
    
    return authUrl;
  }

  // Handle OAuth callback and exchange code for access token
  static async handleCallback(query) {
    try {
      const { shop, code, state } = query;
      
      // Verify state
      if (!sessions.has(state)) {
        throw new Error('Invalid state parameter');
      }
      
      const sessionData = sessions.get(state);
      if (sessionData.shop !== shop) {
        throw new Error('Shop mismatch');
      }
      
      // Exchange authorization code for access token
      const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: process.env.SHOPIFY_API_KEY || '98d5cae75b3fdce1011668a7b6bdc8e2',
          client_secret: process.env.SHOPIFY_API_SECRET,
          code: code,
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error(`Token exchange failed: ${tokenResponse.status}`);
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;
      
      // Store access token
      sessions.set(shop, { 
        accessToken,
        timestamp: Date.now()
      });
      
      // Clean up state
      sessions.delete(state);
      
      return { success: true, shop, accessToken };
      
    } catch (error) {
      console.error('OAuth callback error:', error);
      throw error;
    }
  }

  // Get shop products from real Shopify API
  static async getProducts(shop, accessToken) {
    try {
      const response = await fetch(`https://${shop}/admin/api/2024-10/products.json`, {
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Shopify API error: ${response.status}`);
      }

      const data = await response.json();
      return data.products || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to mock data if API fails
      return [
        {
          id: 1,
          title: "Sample Product 1",
          handle: "sample-product-1",
          status: "active"
        },
        {
          id: 2,
          title: "Sample Product 2", 
          handle: "sample-product-2",
          status: "active"
        }
      ];
    }
  }

  // Get shop blogs from real Shopify API
  static async getBlogs(shop, accessToken) {
    try {
      const response = await fetch(`https://${shop}/admin/api/2024-10/blogs.json`, {
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Shopify API error: ${response.status}`);
      }

      const data = await response.json();
      return data.blogs || [];
    } catch (error) {
      console.error('Error fetching blogs:', error);
      // Fallback to mock data if API fails
      return [
        {
          id: 1,
          title: "News",
          handle: "news"
        },
        {
          id: 2,
          title: "Fashion",
          handle: "fashion"
        }
      ];
    }
  }

  // Create blog article (mock for development)
  static async createArticle(shop, accessToken, blogId, articleData) {
    try {
      // Simulate article creation
      const article = {
        id: Date.now(),
        title: articleData.title,
        body_html: articleData.body_html,
        author: articleData.author,
        tags: articleData.tags,
        created_at: new Date().toISOString()
      };
      
      return article;
    } catch (error) {
      console.error('Error creating article:', error);
      throw error;
    }
  }

  // Get shop info (mock for development)
  static async getShopInfo(shop, accessToken) {
    try {
      // Return mock shop info
      return {
        name: "Development Shop",
        domain: shop,
        email: "dev@example.com"
      };
    } catch (error) {
      console.error('Error fetching shop info:', error);
      throw error;
    }
  }
}

module.exports = { ShopifyService };
