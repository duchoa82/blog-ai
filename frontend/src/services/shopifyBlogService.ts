// Shopify Blog Service using REST Admin API Client
// Based on: https://shopify.dev/docs/api/admin-rest/latest/resources/blog

// Types for blog operations
export interface BlogData {
  title: string;
  handle?: string;
  tags?: string;
  template_suffix?: string;
  commentable?: 'no' | 'moderate' | 'yes';
}

export interface BlogResponse {
  id: number;
  title: string;
  handle: string;
  commentable: string;
  feedburner: string | null;
  feedburner_location: string | null;
  created_at: string;
  updated_at: string;
  template_suffix: string | null;
  tags: string;
  admin_graphql_api_id: string;
}

export interface BlogListResponse {
  blogs: BlogResponse[];
}

class ShopifyBlogService {
  private session: any = null;

  // Initialize the service with shop session
  initialize(storeDomain: string, accessToken: string, apiVersion: string = '2025-01') {
    // Create session object for Shopify REST Admin API Client
    this.session = {
      shop: storeDomain,
      accessToken: accessToken,
      apiVersion: apiVersion
    };
    console.log('Shopify Blog Service initialized with session');
  }

  // Check if service is initialized
  private checkInitialization() {
    if (!this.session) {
      throw new Error('Shopify Blog Service not initialized. Call initialize() first.');
    }
  }

  // Create a new blog
  async createBlog(blogData: BlogData): Promise<BlogResponse> {
    this.checkInitialization();

    try {
      console.log('Creating blog with data:', blogData);

      const response = await fetch(`https://${this.session.shop}/admin/api/${this.session.apiVersion}/blogs.json`, {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': this.session.accessToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ blog: blogData }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('Blog creation response:', result);

      if (result.blog) {
        return result.blog;
      } else {
        throw new Error('No blog data returned from API');
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      throw error;
    }
  }

  // Get all blogs
  async getBlogs(): Promise<BlogListResponse> {
    this.checkInitialization();

    try {
      const response = await fetch(`https://${this.session.shop}/admin/api/${this.session.apiVersion}/blogs.json`, {
        method: 'GET',
        headers: {
          'X-Shopify-Access-Token': this.session.accessToken,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw error;
    }
  }

  // Get a specific blog by ID
  async getBlog(blogId: number): Promise<BlogResponse> {
    this.checkInitialization();

    try {
      const response = await fetch(`https://${this.session.shop}/admin/api/${this.session.apiVersion}/blogs/${blogId}.json`, {
        method: 'GET',
        headers: {
          'X-Shopify-Access-Token': this.session.accessToken,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      if (result.blog) {
        return result.blog;
      } else {
        throw new Error('Blog not found');
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      throw error;
    }
  }

  // Update an existing blog
  async updateBlog(blogId: number, blogData: Partial<BlogData>): Promise<BlogResponse> {
    this.checkInitialization();

    try {
      const response = await fetch(`https://${this.session.shop}/admin/api/${this.session.apiVersion}/blogs/${blogId}.json`, {
        method: 'PUT',
        headers: {
          'X-Shopify-Access-Token': this.session.accessToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ blog: blogData }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      if (result.blog) {
        return result.blog;
      } else {
        throw new Error('No blog data returned from API');
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      throw error;
    }
  }

  // Delete a blog
  async deleteBlog(blogId: number): Promise<boolean> {
    this.checkInitialization();

    try {
      const response = await fetch(`https://${this.session.shop}/admin/api/${this.session.apiVersion}/blogs/${blogId}.json`, {
        method: 'DELETE',
        headers: {
          'X-Shopify-Access-Token': this.session.accessToken,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting blog:', error);
      throw error;
    }
  }

  // Get service configuration info
  getServiceInfo() {
    return {
      storeDomain: this.session?.shop,
      apiVersion: this.session?.apiVersion,
      isInitialized: !!this.session,
    };
  }
}

// Export singleton instance
export const shopifyBlogService = new ShopifyBlogService();
export default shopifyBlogService;
