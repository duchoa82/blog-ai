// Shopify Article Service - For managing blog posts/articles
// Using Shopify REST Admin API Client for modern approach
// Based on: https://shopify.dev/docs/api/admin-rest/latest/resources/article

export interface ArticleData {
  title: string;
  body_html: string;
  author?: string;
  tags?: string;
  published?: boolean;
  published_at?: string;
  handle?: string;
  template_suffix?: string;
  metafields?: Array<{
    key: string;
    value: string;
    type: string;
    namespace: string;
    description?: string;
  }>;
}

export interface ArticleResponse {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  author: string;
  tags: string;
  published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
  template_suffix: string;
  admin_graphql_api_id: string;
}

export interface ArticleListResponse {
  articles: ArticleResponse[];
}

class ShopifyArticleService {
  private session: any = null;

  // Initialize the service with shop session
  initialize(storeDomain: string, accessToken: string, apiVersion: string = '2025-01') {
    // Create session object for Shopify REST Admin API Client
    this.session = {
      shop: storeDomain,
      accessToken: accessToken,
      apiVersion: apiVersion
    };
    console.log('Shopify Article Service initialized with session');
  }

  // Check if service is initialized
  private checkInitialization() {
    if (!this.session) {
      throw new Error('Shopify Article Service not initialized. Call initialize() first.');
    }
  }

  // Create a new article in a blog
  async createArticle(blogId: number, articleData: ArticleData): Promise<ArticleResponse> {
    this.checkInitialization();

    try {
      console.log('Creating article with data:', articleData);

      const response = await fetch(this.getApiUrl(`blogs/${blogId}/articles.json`), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(articleData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('Article creation response:', result);

      return result;
    } catch (error) {
      console.error('Error creating article:', error);
      throw error;
    }
  }

  // Get all articles from a blog
  async getArticles(blogId: number, limit: number = 250, page: number = 1): Promise<ArticleListResponse> {
    this.checkInitialization();

    try {
      const response = await fetch(
        this.getApiUrl(`blogs/${blogId}/articles.json?limit=${limit}&page=${page}`),
        {
          method: 'GET',
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }
  }

  // Get a specific article by ID
  async getArticle(blogId: number, articleId: number): Promise<ArticleResponse> {
    this.checkInitialization();

    try {
      const response = await fetch(
        this.getApiUrl(`blogs/${blogId}/articles/${articleId}.json`),
        {
          method: 'GET',
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching article:', error);
      throw error;
    }
  }

  // Update an existing article
  async updateArticle(blogId: number, articleId: number, articleData: Partial<ArticleData['article']>): Promise<ArticleResponse> {
    this.checkInitialization();

    try {
      const response = await fetch(
        this.getApiUrl(`blogs/${blogId}/articles/${articleId}.json`),
        {
          method: 'PUT',
          headers: this.getHeaders(),
          body: JSON.stringify({ article: articleData }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error updating article:', error);
      throw error;
    }
  }

  // Delete an article
  async deleteArticle(blogId: number, articleId: number): Promise<boolean> {
    this.checkInitialization();

    try {
      const response = await fetch(
        this.getApiUrl(`blogs/${blogId}/articles/${articleId}.json`),
        {
          method: 'DELETE',
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting article:', error);
      throw error;
    }
  }

  // Get article count for a blog
  async getArticleCount(blogId: number): Promise<number> {
    this.checkInitialization();

    try {
      const response = await fetch(
        this.getApiUrl(`blogs/${blogId}/articles/count.json`),
        {
          method: 'GET',
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      return result.count;
    } catch (error) {
      console.error('Error fetching article count:', error);
      throw error;
    }
  }

  // Publish an article (set published_at to current time)
  async publishArticle(blogId: number, articleId: number): Promise<ArticleResponse> {
    return this.updateArticle(blogId, articleId, {
      published: true,
      published_at: new Date().toISOString(),
    });
  }

  // Unpublish an article (remove published_at)
  async unpublishArticle(blogId: number, articleId: number): Promise<ArticleResponse> {
    return this.updateArticle(blogId, articleId, {
      published: false,
      published_at: null,
    });
  }

  // Get service configuration info
  getServiceInfo() {
    return {
      storeDomain: this.storeDomain,
      apiVersion: this.apiVersion,
      isInitialized: !!(this.storeDomain && this.accessToken),
    };
  }
}

// Export singleton instance
export const shopifyArticleService = new ShopifyArticleService();
export default shopifyArticleService;
