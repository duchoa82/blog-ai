export const SHOPIFY_AUTH_CONFIG = {
  // App credentials từ Shopify Partner Dashboard
  SHOPIFY_API_KEY: import.meta.env.VITE_SHOPIFY_API_KEY || '98d5cae75b3fdce1011668a7b6bdc8e2',
  SHOPIFY_API_SECRET: import.meta.env.VITE_SHOPIFY_API_SECRET || '13d50cfc21ee885d1dc5b4de4739bf2e',
  
  // Scopes cần thiết cho app
  SCOPES: [
    'read_products',
    'write_products', 
    'read_content',
    'write_content',
    'read_themes',
    'write_themes'
  ].join(','),
  
  // App URL (sẽ thay đổi khi deploy)
  APP_URL: import.meta.env.VITE_APP_URL || 'https://blog-seo-ai-production.up.railway.app',
  
  // Redirect URLs
  AUTH_CALLBACK_URL: '/auth/callback',
  
  // API version
  API_VERSION: '2025-01'
};

export const getShopifyAuthUrl = (shop: string) => {
  const { SHOPIFY_API_KEY, SCOPES, APP_URL, AUTH_CALLBACK_URL } = SHOPIFY_AUTH_CONFIG;
  
  const redirectUri = `${APP_URL}${AUTH_CALLBACK_URL}`;
  const nonce = Math.random().toString(36).substring(2, 15);
  
  const params = new URLSearchParams({
    client_id: SHOPIFY_API_KEY,
    scope: SCOPES,
    redirect_uri: redirectUri,
    state: nonce,
    'grant_options[]': 'per-user'
  });
  
  return `https://${shop}/admin/oauth/authorize?${params.toString()}`;
};
