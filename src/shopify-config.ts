import { createApp } from '@shopify/app-bridge';

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV;

// Helper function to get host parameter from various sources
const getHost = (): string => {
  // First try to get from URL search params (Shopify embedded app)
  const urlHost = new URLSearchParams(window.location.search).get('host');
  if (urlHost) {
    return urlHost;
  }
  
  // Try to get from window.location.hostname (fallback)
  if (window.location.hostname && window.location.hostname !== 'localhost') {
    return window.location.hostname;
  }
  
  // Development fallback
  if (isDevelopment) {
    return 'localhost:5175';
  }
  
  // Production fallback - try to construct from current URL
  return window.location.host || '';
};

// Shopify App Configuration
export const SHOPIFY_CONFIG = {
  apiKey: import.meta.env.VITE_SHOPIFY_API_KEY || 'dev-api-key',
  host: getHost(),
  forceRedirect: !isDevelopment // Don't force redirect in development
};

// Initialize Shopify App Bridge only if we have valid config
export const shopifyApp = (() => {
  try {
    // Only create app if we have both apiKey and host
    if (SHOPIFY_CONFIG.apiKey && SHOPIFY_CONFIG.host) {
      return createApp(SHOPIFY_CONFIG);
    }
    console.warn('Shopify App Bridge not initialized: missing apiKey or host');
    return null;
  } catch (error) {
    console.error('Error initializing Shopify App Bridge:', error);
    return null;
  }
})();

// Storefront API endpoints (tokenless access)
export const STOREFRONT_API = {
  // Products
  products: '/api/2025-07/graphql.json',
  // Blogs and Articles
  blogs: '/api/2025-07/graphql.json',
  // Collections
  collections: '/api/2025-07/graphql.json',
};

// Helper function to get Shopify Storefront API URL
export const getShopifyStorefrontUrl = (shop: string) => {
  if (!shop) {
    throw new Error('Shop parameter is required');
  }
  
  // Ensure shop has .myshopify.com domain
  if (!shop.includes('myshopify.com')) {
    shop = `${shop}.myshopify.com`;
  }
  
  return `https://${shop}`;
};

// Helper function to make tokenless Storefront API requests
export const makeStorefrontRequest = async (shop: string, query: string, variables: any = {}) => {
  const url = `${getShopifyStorefrontUrl(shop)}${STOREFRONT_API.products}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`Storefront API error: ${response.status}`);
  }

  return response.json();
};

// GraphQL queries for Storefront API
export const STOREFRONT_QUERIES = {
  // Get products
  products: `
    query GetProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            productType
            vendor
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `,
  
  // Get blogs
  blogs: `
    query GetBlogs($first: Int!) {
      blogs(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
          }
        }
      }
    }
  `,
  
  // Get blog articles
  blogArticles: `
    query GetBlogArticles($blogHandle: String!, $first: Int!) {
      blog(handle: $blogHandle) {
        articles(first: $first) {
          edges {
            node {
              id
              title
              handle
              content
              publishedAt
            }
          }
        }
      }
    }
  `,
};
