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
  // Try to get from URL search params
  const urlShop = new URLSearchParams(window.location.search).get('shop');
  if (urlShop) {
    return urlShop;
  }
  
  // Try to get from hostname
  const hostname = window.location.hostname;
  if (hostname.includes('myshopify.com')) {
    return hostname;
  }
  
  // Try to get from pathname (Shopify admin)
  const pathname = window.location.pathname;
  const pathMatch = pathname.match(/\/admin\/apps\/[^\/]+\/([^\/]+)/);
  if (pathMatch) {
    return pathMatch[1];
  }
  
  // Development fallback
  if (isDevelopment) {
    return 'localhost:5175';
  }
  
  throw new Error('Could not detect shop from current context');
};

// Fetch images from Shopify Storefront API (products with images)
export const fetchShopifyImages = async (): Promise<ShopifyAsset[]> => {
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
          content_type: 'image/jpeg', // Assume JPEG for now
          size: 0, // Storefront API doesn't provide file size
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
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
