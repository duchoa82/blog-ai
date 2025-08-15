// Helper function to detect shop from current context
export const detectShop = (): string => {
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
        console.warn('⚠️ Failed to decode host from App Bridge:', decodeError);
      }
    }
    
    // Method 2: Try to get shop from URL search parameter (e.g., ?shop=your-store.myshopify.com)
    const shopParam = new URLSearchParams(window.location.search).get('shop');
    if (shopParam) {
      // Ensure it's a valid shop domain
      if (shopParam.includes('.myshopify.com')) {
        console.log('✅ Shop detected from URL parameter:', shopParam);
        return shopParam;
      } else {
        // If it's just the shop name, append .myshopify.com
        console.log('✅ Shop detected from URL parameter (name only):', `${shopParam}.myshopify.com`);
        return `${shopParam}.myshopify.com`;
      }
    }
    
    // Method 3: Try to get from hostname (for direct access to .myshopify.com)
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
    
    // Method 5: Fallback for production when no shop context (use a default)
    if (hostname === 'blog-shopify-production.up.railway.app') {
      console.warn('⚠️ No shop context found, using default shop for production');
      return 'enipa-test-app.myshopify.com'; // Your actual shop
    }
    
    // Method 6: Development fallback
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
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
