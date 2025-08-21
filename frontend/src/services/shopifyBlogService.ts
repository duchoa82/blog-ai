import { createAdminApiClient } from '@shopify/admin-api-client';

// Types for blog operations
export interface BlogData {
  blog: {
    title: string;
    body_html: string;
    published: boolean;
    handle?: string;
    tags?: string;
    meta_title?: string;
    meta_description?: string;
    author?: string;
    template_suffix?: string;
  };
}

export interface BlogResponse {
  blog: {
    id: number;
    title: string;
    handle: string;
    body_html: string;
    published: boolean;
    created_at: string;
    updated_at: string;
  };
}

export interface BlogListResponse {
  blogs: BlogResponse['blog'][];
}

class ShopifyBlogService {
  private client: ReturnType<typeof createAdminApiClient> | null = null;

  // Initialize the client with shop credentials
  initialize(storeDomain: string, accessToken: string, apiVersion: string = '2025-01') {
    try {
      this.client = createAdminApiClient({
        storeDomain,
        apiVersion,
        accessToken,
        retries: 3, // Auto-retry on rate limits
      });
      console.log('Shopify Admin API Client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Shopify Admin API Client:', error);
      throw error;
    }
  }

  // Check if client is initialized
  private checkClient() {
    if (!this.client) {
      throw new Error('Shopify Admin API Client not initialized. Call initialize() first.');
    }
  }

  // Create a new blog post
  async createBlog(blogData: BlogData): Promise<BlogResponse> {
    this.checkClient();

    try {
      console.log('Creating blog post with data:', blogData);

      const response = await this.client!.request(`
        mutation CreateBlog($input: BlogInput!) {
          blogCreate(input: $input) {
            blog {
              id
              title
              handle
              bodyHtml
              published
              createdAt
              updatedAt
            }
            userErrors {
              field
              message
            }
          }
        }
      `, {
        variables: {
          input: {
            title: blogData.blog.title,
            bodyHtml: blogData.blog.body_html,
            published: blogData.blog.published,
            handle: blogData.blog.handle,
            tags: blogData.blog.tags,
            metaTitle: blogData.blog.meta_title,
            metaDescription: blogData.blog.meta_description,
            author: blogData.blog.author,
            templateSuffix: blogData.blog.template_suffix,
          }
        }
      });

      console.log('Blog creation response:', response);

      if (response.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(response.errors)}`);
      }

      if (response.data?.blogCreate?.userErrors?.length > 0) {
        const errors = response.data.blogCreate.userErrors;
        throw new Error(`Validation errors: ${errors.map(e => `${e.field}: ${e.message}`).join(', ')}`);
      }

      const blog = response.data?.blogCreate?.blog;
      if (!blog) {
        throw new Error('No blog data returned from API');
      }

      return {
        blog: {
          id: parseInt(blog.id.split('/').pop() || '0'),
          title: blog.title,
          handle: blog.handle,
          body_html: blog.bodyHtml,
          published: blog.published,
          created_at: blog.createdAt,
          updated_at: blog.updatedAt,
        }
      };
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  }

  // Get all blogs
  async getBlogs(): Promise<BlogListResponse> {
    this.checkClient();

    try {
      const response = await this.client!.request(`
        query GetBlogs {
          blogs(first: 250) {
            edges {
              node {
                id
                title
                handle
                bodyHtml
                published
                createdAt
                updatedAt
              }
            }
          }
        }
      `);

      if (response.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(response.errors)}`);
      }

      const blogs = response.data?.blogs?.edges?.map((edge: any) => ({
        id: parseInt(edge.node.id.split('/').pop() || '0'),
        title: edge.node.title,
        handle: edge.node.handle,
        body_html: edge.node.bodyHtml,
        published: edge.node.published,
        created_at: edge.node.createdAt,
        updated_at: edge.node.updatedAt,
      })) || [];

      return { blogs };
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw error;
    }
  }

  // Get a specific blog by ID
  async getBlog(blogId: number): Promise<BlogResponse> {
    this.checkClient();

    try {
      const response = await this.client!.request(`
        query GetBlog($id: ID!) {
          blog(id: $id) {
            id
            title
            handle
            bodyHtml
            published
            createdAt
            updatedAt
          }
        }
      `, {
        variables: {
          id: `gid://shopify/Blog/${blogId}`
        }
      });

      if (response.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(response.errors)}`);
      }

      const blog = response.data?.blog;
      if (!blog) {
        throw new Error('Blog not found');
      }

      return {
        blog: {
          id: parseInt(blog.id.split('/').pop() || '0'),
          title: blog.title,
          handle: blog.handle,
          body_html: blog.bodyHtml,
          published: blog.published,
          created_at: blog.createdAt,
          updated_at: blog.updatedAt,
        }
      };
    } catch (error) {
      console.error('Error fetching blog:', error);
      throw error;
    }
  }

  // Update an existing blog
  async updateBlog(blogId: number, blogData: Partial<BlogData['blog']>): Promise<BlogResponse> {
    this.checkClient();

    try {
      const response = await this.client!.request(`
        mutation UpdateBlog($input: BlogInput!) {
          blogUpdate(input: $input) {
            blog {
              id
              title
              handle
              bodyHtml
              published
              createdAt
              updatedAt
            }
            userErrors {
              field
              message
            }
          }
        }
      `, {
        variables: {
          input: {
            id: `gid://shopify/Blog/${blogId}`,
            title: blogData.title,
            bodyHtml: blogData.body_html,
            published: blogData.published,
            handle: blogData.handle,
            tags: blogData.tags,
            metaTitle: blogData.meta_title,
            metaDescription: blogData.meta_description,
            author: blogData.author,
            templateSuffix: blogData.template_suffix,
          }
        }
      });

      if (response.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(response.errors)}`);
      }

      if (response.data?.blogUpdate?.userErrors?.length > 0) {
        const errors = response.data.blogUpdate.userErrors;
        throw new Error(`Validation errors: ${errors.map(e => `${e.field}: ${e.message}`).join(', ')}`);
      }

      const blog = response.data?.blogUpdate?.blog;
      if (!blog) {
        throw new Error('No blog data returned from API');
      }

      return {
        blog: {
          id: parseInt(blog.id.split('/').pop() || '0'),
          title: blog.title,
          handle: blog.handle,
          body_html: blog.bodyHtml,
          published: blog.published,
          created_at: blog.createdAt,
          updated_at: blog.updatedAt,
        }
      };
    } catch (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }
  }

  // Delete a blog
  async deleteBlog(blogId: number): Promise<boolean> {
    this.checkClient();

    try {
      const response = await this.client!.request(`
        mutation DeleteBlog($input: BlogDeleteInput!) {
          blogDelete(input: $input) {
            deletedBlogId
            userErrors {
              field
              message
            }
          }
        }
      `, {
        variables: {
          input: {
            id: `gid://shopify/Blog/${blogId}`
          }
        }
      });

      if (response.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(response.errors)}`);
      }

      if (response.data?.blogDelete?.userErrors?.length > 0) {
        const errors = response.data.blogDelete.userErrors;
        throw new Error(`Validation errors: ${errors.map(e => `${e.field}: ${e.message}`).join(', ')}`);
      }

      const deletedId = response.data?.blogDelete?.deletedBlogId;
      return !!deletedId;
    } catch (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }
  }

  // Get client configuration info
  getClientInfo() {
    if (!this.client) {
      return null;
    }
    return {
      config: this.client.config,
      apiUrl: this.client.getApiUrl(),
      headers: this.client.getHeaders(),
    };
  }
}

// Export singleton instance
export const shopifyBlogService = new ShopifyBlogService();
export default shopifyBlogService;
