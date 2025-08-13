import { makeShopifyRequest, SHOPIFY_API } from '../shopify-config';
import { isDevelopment, mockShopifyBlogs, mockApiResponse, devLog } from '../utils/dev-helpers';

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

// Fetch all blogs from Shopify
export const fetchShopifyBlogs = async (): Promise<ShopifyBlog[]> => {
  if (isDevelopment) {
    devLog('Using mock Shopify blogs for development');
    return mockApiResponse(mockShopifyBlogs);
  }

  try {
    const response = await makeShopifyRequest(SHOPIFY_API.blogs);
    return response.blogs;
  } catch (error) {
    console.error('Error fetching Shopify blogs:', error);
    // Fallback to mock data if API fails
    return mockApiResponse(mockShopifyBlogs);
  }
};

// Fetch articles from a specific blog
export const fetchShopifyArticles = async (blogId: number): Promise<ShopifyArticle[]> => {
  try {
    const response = await makeShopifyRequest(`/admin/api/2023-10/blogs/${blogId}/articles.json`);
    return response.articles;
  } catch (error) {
    console.error('Error fetching Shopify articles:', error);
    throw error;
  }
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
