import ApiService from './api';
import { detectShop } from '../utils/shopify-utils';

// Interface for Admin API product response
export interface AdminProduct {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  description?: string;
  vendor: string;
  product_type: string;
  status: string;
  created_at: string;
  updated_at: string;
  published_at: string;
  tags: string;
  images: AdminProductImage[];
  variants: AdminProductVariant[];
}

export interface AdminProductImage {
  id: number;
  product_id: number;
  src: string;
  width: number;
  height: number;
  alt: string;
  position: number;
}

export interface AdminProductVariant {
  id: number;
  product_id: number;
  title: string;
  price: string;
  sku: string;
  position: number;
  inventory_quantity: number;
}

// Interface for Admin API blog response
export interface AdminBlog {
  id: number;
  title: string;
  handle: string;
  commentable: string;
  feedburner: string;
  feedburner_location: string;
  created_at: string;
  updated_at: string;
  template_suffix: string;
  tags: string;
  admin_graphql_api_id: string;
}

export interface AdminArticle {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  author: string;
  created_at: string;
  updated_at: string;
  published_at: string;
  tags: string;
  template_suffix: string;
  admin_graphql_api_id: string;
}

// Fetch products using Admin API through our backend
export const fetchAdminProducts = async (): Promise<AdminProduct[]> => {
  try {
    const shop = detectShop();
    console.log('🛍️ Fetching products via Admin API for shop:', shop);
    
    // Use our backend proxy to Admin API
    const response = await ApiService.getShopifyProducts();
    
    console.log('📦 Admin API response:', response);
    
    if (response && Array.isArray(response)) {
      console.log(`✅ Successfully fetched ${response.length} products from ${shop}`);
      return response;
    } else {
      throw new Error('Invalid response format from Admin API');
    }
    
  } catch (error) {
    console.error('❌ Error fetching Admin API products:', error);
    
    // Enhanced error logging
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        context: {
          host: new URLSearchParams(window.location.search).get('host'),
          hostname: window.location.hostname,
          pathname: window.location.pathname
        }
      });
    }
    
    throw error;
  }
};

// Fetch blogs using Admin API through our backend
export const fetchAdminBlogs = async (): Promise<AdminBlog[]> => {
  try {
    const shop = detectShop();
    console.log('📝 Fetching blogs via Admin API for shop:', shop);
    
    // Use our backend proxy to Admin API
    const response = await ApiService.getShopifyBlogs();
    
    console.log('📚 Admin API blogs response:', response);
    
    if (response && Array.isArray(response)) {
      console.log(`✅ Successfully fetched ${response.length} blogs from ${shop}`);
      return response;
    } else {
      throw new Error('Invalid response format from Admin API');
    }
    
  } catch (error) {
    console.error('❌ Error fetching Admin API blogs:', error);
    throw error;
  }
};

// Fetch blog articles using Admin API through our backend
export const fetchAdminBlogArticles = async (blogId: number): Promise<AdminArticle[]> => {
  try {
    const shop = detectShop();
    console.log(`📄 Fetching articles for blog ${blogId} via Admin API for shop:`, shop);
    
    // Use our backend proxy to Admin API
    const response = await ApiService.getBlogArticles(blogId);
    
    console.log('📰 Admin API articles response:', response);
    
    if (response && Array.isArray(response)) {
      console.log(`✅ Successfully fetched ${response.length} articles from blog ${blogId}`);
      return response;
    } else {
      throw new Error('Invalid response format from Admin API');
    }
    
  } catch (error) {
    console.error('❌ Error fetching Admin API blog articles:', error);
    throw error;
  }
};

// Search products using Admin API
export const searchAdminProducts = async (query: string): Promise<AdminProduct[]> => {
  try {
    const shop = detectShop();
    console.log(`🔍 Searching products via Admin API for shop: ${shop}, query: ${query}`);
    
    // Use our backend proxy to Admin API with search
    const response = await ApiService.searchShopifyProducts(query);
    
    console.log('🔍 Admin API search response:', response);
    
    if (response && Array.isArray(response)) {
      console.log(`✅ Successfully found ${response.length} products matching "${query}"`);
      return response;
    } else {
      throw new Error('Invalid response format from Admin API search');
    }
    
  } catch (error) {
    console.error('❌ Error searching Admin API products:', error);
    throw error;
  }
};
