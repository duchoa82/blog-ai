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
  if (!shop) {
    throw new Error('Shop parameter not found in URL');
  }
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
