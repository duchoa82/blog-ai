const crypto = require('crypto');

// Store for active sessions (in production, use Redis or database)
const sessions = new Map();

class ShopifyService {
  // Generate OAuth URL for shop installation
  static generateAuthUrl(shop) {
    const state = crypto.randomBytes(16).toString('hex');
    
    // For development, return a placeholder URL
    const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${process.env.SHOPIFY_API_KEY || 'test'}&scope=${process.env.SHOPIFY_SCOPES || 'read_products,write_products'}&redirect_uri=${process.env.SHOPIFY_APP_URL || 'http://localhost:3001'}/auth/shopify/callback&state=${state}`;
    
    // Store state for verification
    sessions.set(state, { shop, timestamp: Date.now() });
    
    return authUrl;
  }

  // Handle OAuth callback
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
      
      // For development, simulate successful OAuth
      const accessToken = 'dev_access_token_' + Date.now();
      
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

  // Get shop products (mock data for development)
  static async getProducts(shop, accessToken) {
    try {
      // Return mock products for development
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
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Get shop blogs (mock data for development)
  static async getBlogs(shop, accessToken) {
    try {
      // Return mock blogs for development
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
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw error;
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
