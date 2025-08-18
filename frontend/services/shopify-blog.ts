import { makeStorefrontRequest, STOREFRONT_QUERIES, getShopifyStorefrontUrl } from '../shopify-config';
import { isDevelopment, mockShopifyBlogs, mockApiResponse, devLog } from '../utils/dev-helpers';

// Helper function to detect shop from current context
const detectShop = (): string => {
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
        console.warn('⚠️ Failed to decode App Bridge host:', decodeError);
      }
    }
    
    // Method 2: Try to get from URL search params
    const urlShop = new URLSearchParams(window.location.search).get('shop');
    if (urlShop) {
      console.log('✅ Shop detected from URL params:', urlShop);
      return urlShop;
    }
    
    // Method 3: Try to get from hostname
    const hostname = window.location.hostname;
    if (hostname.includes('myshopify.com')) {
      console.log('✅ Shop detected from hostname:', hostname);
      return hostname;
    }
    
    // Method 4: Try to get from pathname (Shopify admin)
    const pathname = window.location.pathname;
    const pathMatch = pathname.match(/\/admin\/apps\/[^\/]+\/([^\/]+)/);
    if (pathMatch) {
      const shopName = pathMatch[1];
      console.log('✅ Shop detected from pathname:', shopName);
      return `${shopName}.myshopify.com`;
    }
    
    // Method 5: Development fallback
    if (isDevelopment) {
      console.log('🔧 Using development fallback shop');
      return 'demo-store.myshopify.com';
    }
    
    // If all methods fail, throw error with context info
    const contextInfo = {
      host: new URLSearchParams(window.location.search).get('host'),
      hostname: window.location.hostname,
      pathname: window.location.pathname,
      search: window.location.search,
      href: window.location.href
    };
    
    console.error('❌ Shop detection failed. Context:', contextInfo);
    throw new Error(`Could not detect shop from current context. Please check if you're in the correct Shopify admin environment. Context: ${JSON.stringify(contextInfo)}`);
    
  } catch (error) {
    console.error('❌ Error in detectShop:', error);
    throw error;
  }
};

export interface ShopifyBlog {
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

export interface ShopifyArticle {
  id: number;
  title: string;
  body_html: string;
  body_summary: string;
  author: string;
  created_at: string;
  updated_at: string;
  published_at: string;
  template_suffix: string;
  tags: string;
  admin_graphql_api_id: string;
  image?: {
    src: string;
    alt: string;
  };
  seo?: {
    title: string;
    description: string;
  };
}

export interface CreateArticleData {
  title: string;
  body_html: string;
  author: string;
  tags: string;
  published_at?: string;
  image?: {
    src: string;
    alt: string;
  };
  seo?: {
    title: string;
    description: string;
  };
}

// ✅ FIX: Disable Storefront API calls tạm thời để fix navigation
export const fetchShopifyBlogs = async (): Promise<ShopifyBlog[]> => {
  // Temporarily disable Storefront API to fix navigation issues
  console.log('📝 Using mock data temporarily to fix navigation');
  return mockApiResponse(mockShopifyBlogs);
  
  // TODO: Re-enable when Storefront API permissions are fixed
  /*
  if (isDevelopment) {
    devLog('Using mock Shopify blogs for development');
    return mockApiResponse(mockShopifyBlogs);
  }

  try {
    // Detect shop from current context
    const shop = detectShop();
    
    // Use Storefront API with tokenless access
    const response = await makeStorefrontRequest(
      shop,
      STOREFRONT_QUERIES.blogs,
      { first: 50 } // Get first 50 blogs
    );
    
    // Transform GraphQL response to match your interface
    const blogs = response.data?.blogs?.edges?.map((edge: any) => ({
      id: edge.node.id.split('/').pop(), // Extract ID from GraphQL global ID
      title: edge.node.title,
      handle: edge.node.handle,
      description: edge.node.description || '',
      created_at: new Date().toISOString(), // Storefront API doesn't provide creation date
      updated_at: new Date().toISOString()  // Storefront API doesn't provide update date
    })) || [];
    
    return blogs;
  } catch (error) {
    console.error('Error fetching Shopify blogs:', error);
    // Fallback to mock data if API fails
    return mockApiResponse(mockShopifyBlogs);
  }
  */
};

// ✅ FIX: Disable Storefront API calls tạm thời
export const fetchBlogArticles = async (blogHandle: string): Promise<ShopifyArticle[]> => {
  // Temporarily disable Storefront API to fix navigation issues
  console.log('📝 Using mock data temporarily to fix navigation');
  return mockApiResponse(mockShopifyBlogs[0]?.articles || []);
  
  // TODO: Re-enable when Storefront API permissions are fixed
  /*
  try {
    const shop = detectShop();
    
    const response = await makeStorefrontRequest(
      shop,
      STOREFRONT_QUERIES.blogArticles,
      { blogHandle, first: 50 }
    );
    
    const articles = response.data?.blog?.articles?.edges?.map((edge: any) => ({
      id: edge.node.id.split('/').pop(),
      title: edge.node.title,
      handle: edge.node.handle,
      content: edge.node.content || '',
      published_at: edge.node.publishedAt || new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })) || [];
    
    return articles;
  } catch (error) {
    console.error('Error fetching blog articles:', error);
    throw error;
  }
  */
};

// Create a new article
export const createShopifyArticle = async (blogId: number, articleData: CreateArticleData): Promise<ShopifyArticle> => {
  try {
    const response = await makeShopifyRequest(`/admin/api/2023-10/blogs/${blogId}/articles.json`, {
      method: 'POST',
      body: JSON.stringify({
        article: articleData
      }),
    });
    
    return response.article;
  } catch (error) {
    console.error('Error creating Shopify article:', error);
    throw error;
  }
};

// Update an existing article
export const updateShopifyArticle = async (blogId: number, articleId: number, articleData: Partial<CreateArticleData>): Promise<ShopifyArticle> => {
  try {
    const response = await makeShopifyRequest(`/admin/api/2023-10/blogs/${blogId}/articles/${articleId}.json`, {
      method: 'PUT',
      body: JSON.stringify({
        article: articleData
      }),
    });
    
    return response.article;
  } catch (error) {
    console.error('Error updating Shopify article:', error);
    throw error;
  }
};

// Delete an article
export const deleteShopifyArticle = async (blogId: number, articleId: number): Promise<void> => {
  try {
    await makeShopifyRequest(`/admin/api/2023-10/blogs/${blogId}/articles/${articleId}.json`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting Shopify article:', error);
    throw error;
  }
};
