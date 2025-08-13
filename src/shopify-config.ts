import { createApp } from '@shopify/app-bridge';

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV;

// Shopify App Configuration
export const SHOPIFY_CONFIG = {
  apiKey: import.meta.env.VITE_SHOPIFY_API_KEY || 'dev-api-key',
  host: new URLSearchParams(window.location.search).get('host') || (isDevelopment ? 'localhost:5175' : ''),
  forceRedirect: !isDevelopment // Don't force redirect in development
};

// Initialize Shopify App Bridge only if we have valid config
export const shopifyApp = isDevelopment ? null : createApp(SHOPIFY_CONFIG);

// Shopify API endpoints
export const SHOPIFY_API = {
  // Media/Assets API
  assets: '/admin/api/2023-10/assets.json',
  // Blog API
  blogs: '/admin/api/2023-10/blogs.json',
  articles: '/admin/api/2023-10/articles.json',
  // SEO API
  metafields: '/admin/api/2023-10/metafields.json',
};

// Helper function to get Shopify API URL
export const getShopifyApiUrl = (endpoint: string) => {
  const shop = new URLSearchParams(window.location.search).get('shop');
  return `https://${shop}${endpoint}`;
};

// Helper function to make authenticated requests
export const makeShopifyRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = getShopifyApiUrl(endpoint);
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status}`);
  }

  return response.json();
};
