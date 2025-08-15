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

// Storefront API endpoints (tokenless access) - with fallback versions
export const STOREFRONT_API = {
  // Primary version (most stable)
  products: '/api/2024-10/graphql.json',
  blogs: '/api/2024-10/graphql.json',
  collections: '/api/2024-10/graphql.json',
};

// Fallback API versions to try if primary fails
export const STOREFRONT_API_FALLBACKS = [
  '/api/2024-10/graphql.json',  // Most stable and widely supported
  '/api/2025-01/graphql.json',  // Stable
  '/api/2025-04/graphql.json',  // Stable
  // Removed 2025-07 as it's too new and causing compatibility issues
];

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

// Helper function to make tokenless Storefront API requests with fallback versions
export const makeStorefrontRequest = async (shop: string, query: string, variables: any = {}) => {
  let lastError: Error | null = null;
  
  // Try each API version until one works
  for (const apiEndpoint of STOREFRONT_API_FALLBACKS) {
    try {
      const url = `${getShopifyStorefrontUrl(shop)}${apiEndpoint}`;
      console.log(`🔍 Trying API endpoint: ${apiEndpoint}`);
      
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

      const result = await response.json();
      console.log(`✅ API endpoint ${apiEndpoint} worked successfully`);
      return result;
      
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      console.warn(`⚠️ API endpoint ${apiEndpoint} failed:`, lastError.message);
      
      // Continue to next endpoint
      continue;
    }
  }
  
  // If all endpoints failed, throw the last error
  throw lastError || new Error('All Storefront API endpoints failed');
};

// GraphQL queries for Storefront API
export const STOREFRONT_QUERIES = {
  // Get products - fixed syntax
  products: `
    query GetProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            productType
            vendor
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
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
  
  // Get blogs - fixed syntax
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
  
  // Get blog articles - fixed syntax
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
