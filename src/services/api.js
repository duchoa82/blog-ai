const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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

  // Get Shopify products
  static async getShopifyProducts(shop, accessToken) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/shopify/products?shop=${shop}&accessToken=${accessToken}`
      );
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch Shopify products:', error);
      throw error;
    }
  }

  // Get Shopify blogs
  static async getShopifyBlogs(shop, accessToken) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/shopify/blogs?shop=${shop}&accessToken=${accessToken}`
      );
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch Shopify blogs:', error);
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
}

export default ApiService;
