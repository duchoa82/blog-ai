import { makeStorefrontRequest, STOREFRONT_QUERIES, getShopifyStorefrontUrl } from '../shopify-config';
import { isDevelopment, mockShopifyImages, mockApiResponse, devLog } from '../utils/dev-helpers';

export interface ShopifyAsset {
  id: number;
  key: string;
  public_url: string;
  content_type: string;
  size: number;
  created_at: string;
  updated_at: string;
  alt?: string;
}

export interface ShopifyAssetsResponse {
  assets: ShopifyAsset[];
}

// Helper function to detect shop from current context
const detectShop = (): string => {
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
        console.warn('⚠️ Failed to decode App Bridge host:', decodeError);
      }
    }
    
    // Method 2: Try to get from URL search params
    const urlShop = new URLSearchParams(window.location.search).get('shop');
    if (urlShop) {
      console.log('✅ Shop detected from URL params:', urlShop);
      return urlShop;
    }
    
    // Method 3: Try to get from hostname
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
    
    // Method 5: Development fallback
    if (isDevelopment) {
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

// ✅ FIX: Disable Storefront API calls tạm thời
export const fetchShopifyImages = async (): Promise<ShopifyAsset[]> => {
  // Temporarily disable Storefront API to fix navigation issues
  console.log('📝 Using mock data temporarily to fix navigation');
  return mockApiResponse(mockShopifyImages);
  
  // TODO: Re-enable when Storefront API permissions are fixed
  /*
  if (isDevelopment) {
    devLog('Using mock Shopify images for development');
    return mockApiResponse(mockShopifyImages);
  }

  try {
    const shop = detectShop();
    
    // Use Storefront API to get products with images
    const response = await makeStorefrontRequest(
      shop,
      STOREFRONT_QUERIES.products,
      { first: 50 }
    );
    
    // Transform product images to asset format
    const assets: ShopifyAsset[] = [];
    let assetId = 1;
    
    response.data?.products?.edges?.forEach((edge: any) => {
      edge.node.images?.edges?.forEach((imgEdge: any) => {
        assets.push({
          id: assetId++,
          key: imgEdge.node.url.split('/').pop() || `image-${assetId}`,
          public_url: imgEdge.node.url,
          alt: imgEdge.node.altText || edge.node.title
        });
      });
    });
    
    return assets;
  } catch (error) {
    console.error('Error fetching Shopify images:', error);
    // Fallback to mock data if API fails
    return mockApiResponse(mockShopifyImages);
  }
  */
};

// Upload image to Shopify (simplified - Storefront API is read-only)
export const uploadImageToShopify = async (file: File): Promise<ShopifyAsset> => {
  // Note: Storefront API is read-only, so we can't actually upload
  // This is a placeholder for future Admin API implementation
  console.warn('Image upload not supported via Storefront API (read-only)');
  
  // Return a mock asset for now
  return {
    id: Date.now(),
    key: file.name,
    public_url: URL.createObjectURL(file),
    content_type: file.type,
    size: file.size,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    alt: file.name
  };
};

// Delete image from Shopify (simplified - Storefront API is read-only)
export const deleteImageFromShopify = async (assetId: number): Promise<void> => {
  // Note: Storefront API is read-only, so we can't actually delete
  // This is a placeholder for future Admin API implementation
  console.warn('Image deletion not supported via Storefront API (read-only)');
  
  // For now, just log the deletion request
  console.log(`Would delete asset ${assetId} if Admin API was available`);
};
