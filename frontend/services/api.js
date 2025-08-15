// API base URL - use Railway backend that serves both frontend and API
const API_BASE_URL = 'https://blog-shopify-production.up.railway.app';

class ApiService {
  // Health check
  static async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }

  // Blog generation
  static async generateBlog(prompt, apiKey) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/generate-blog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, apiKey })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Blog generation failed:', error);
      throw error;
    }
  }

  // Shopify OAuth
  static async initiateShopifyAuth(shop) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/shopify?shop=${shop}`);
      return await response.json();
    } catch (error) {
      console.error('Shopify auth initiation failed:', error);
      throw error;
    }
  }

  // Get Shopify products (Admin API)
  static async getShopifyProducts() {
    try {
      // First, detect the shop
      const shop = this.detectShop();
      console.log('🔍 Detected shop for API call:', shop);
      
      // Get access token from session
      const sessionResponse = await fetch(`${API_BASE_URL}/api/shopify/session?shop=${shop}`);
      if (!sessionResponse.ok) {
        throw new Error(`Session error: ${sessionResponse.status}`);
      }
      
      const sessionData = await sessionResponse.json();
      if (!sessionData.success || !sessionData.accessToken) {
        throw new Error('No valid session or access token found');
      }
      
      console.log('✅ Got access token for shop:', shop);
      
      // Now fetch products with the access token
      const productsResponse = await fetch(`${API_BASE_URL}/api/shopify/products?shop=${shop}&accessToken=${sessionData.accessToken}`);
      if (!productsResponse.ok) {
        throw new Error(`Products API error: ${productsResponse.status}`);
      }
      
      const productsData = await productsResponse.json();
      return productsData.products || [];
      
    } catch (error) {
      console.error('Failed to fetch Shopify products:', error);
      throw error;
    }
  }

  // Get Shopify blogs (Admin API)
  static async getShopifyBlogs() {
    try {
      // First, detect the shop
      const shop = this.detectShop();
      console.log('🔍 Detected shop for blogs API call:', shop);
      
      // Get access token from session
      const sessionResponse = await fetch(`${API_BASE_URL}/api/shopify/session?shop=${shop}`);
      if (!sessionResponse.ok) {
        throw new Error(`Session error: ${sessionResponse.status}`);
      }
      
      const sessionData = await sessionResponse.json();
      if (!sessionData.success || !sessionData.accessToken) {
        throw new Error('No valid session or access token found');
      }
      
      console.log('✅ Got access token for blogs, shop:', shop);
      
      // Now fetch blogs with the access token
      const blogsResponse = await fetch(`${API_BASE_URL}/api/shopify/blogs?shop=${shop}&accessToken=${sessionData.accessToken}`);
      if (!blogsResponse.ok) {
        throw new Error(`Blogs API error: ${blogsResponse.status}`);
      }
      
      const blogsData = await blogsResponse.json();
      return blogsData.blogs || [];
      
    } catch (error) {
      console.error('Failed to fetch Shopify blogs:', error);
      throw error;
    }
  }

  // Get blog articles (Admin API)
  static async getBlogArticles(blogId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/shopify/blogs/${blogId}/articles`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch blog articles:', error);
      throw error;
    }
  }

  // Search Shopify products (Admin API)
  static async searchShopifyProducts(query) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/shopify/products/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to search Shopify products:', error);
      throw error;
    }
  }

  // Create Shopify article
  static async createShopifyArticle(shop, accessToken, blogId, articleData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/shopify/articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shop,
          accessToken,
          blogId,
          articleData
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to create Shopify article:', error);
      throw error;
    }
  }

  // Helper method to detect shop (same logic as utils)
  static detectShop() {
    try {
      // Method 1: Try to get shop from App Bridge context (Shopify admin)
      const host = new URLSearchParams(window.location.search).get('host');
      if (host) {
        try {
          // Decode base64 host to get shop domain
          const decodedHost = atob(host);
          console.log('🔍 Decoded host from App Bridge:', decodedHost);
          
          // Extract shop from decoded host (format: admin.shopify.com/store/shopname)
          const shopMatch = decodedHost.match(/store\/([^.]+)/);
          if (shopMatch) {
            const shopName = shopMatch[1];
            console.log('✅ Shop detected from App Bridge:', shopName);
            return `${shopName}.myshopify.com`;
          }
        } catch (decodeError) {
          console.warn('⚠️ Failed to decode host from App Bridge:', decodeError);
        }
      }
      
      // Method 2: Try to get shop from URL search parameter
      const shopParam = new URLSearchParams(window.location.search).get('shop');
      if (shopParam) {
        if (shopParam.includes('.myshopify.com')) {
          console.log('✅ Shop detected from URL parameter:', shopParam);
          return shopParam;
        } else {
          console.log('✅ Shop detected from URL parameter (name only):', `${shopParam}.myshopify.com`);
          return `${shopParam}.myshopify.com`;
        }
      }
      
      // Method 3: Production fallback
      if (window.location.hostname === 'blog-shopify-production.up.railway.app') {
        console.warn('⚠️ No shop context found, using default shop for production');
        return 'enipa-test-app.myshopify.com';
      }
      
      // Method 4: Development fallback
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('🔧 Using development fallback shop');
        return 'demo-store.myshopify.com';
      }
      
      throw new Error('Could not detect shop from current context');
      
    } catch (error) {
      console.error('❌ Error in detectShop:', error);
      throw error;
    }
  }
}

export default ApiService;
