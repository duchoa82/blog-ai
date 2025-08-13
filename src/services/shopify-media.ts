import { makeShopifyRequest, SHOPIFY_API } from '../shopify-config';
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

// Fetch images from Shopify media library
export const fetchShopifyImages = async (): Promise<ShopifyAsset[]> => {
  if (isDevelopment) {
    devLog('Using mock Shopify images for development');
    return mockApiResponse(mockShopifyImages);
  }

  try {
    const response = await makeShopifyRequest(SHOPIFY_API.assets);
    const data: ShopifyAssetsResponse = response;
    
    // Filter for image assets only
    const imageAssets = data.assets.filter(asset => 
      asset.content_type.startsWith('image/')
    );
    
    return imageAssets;
  } catch (error) {
    console.error('Error fetching Shopify images:', error);
    // Fallback to mock data if API fails
    return mockApiResponse(mockShopifyImages);
  }
};

// Upload image to Shopify
export const uploadImageToShopify = async (file: File): Promise<ShopifyAsset> => {
  try {
    const formData = new FormData();
    formData.append('asset[attachment]', file);
    
    const response = await makeShopifyRequest(SHOPIFY_API.assets, {
      method: 'POST',
      body: formData,
      headers: {
        // Remove Content-Type for FormData
      },
    });
    
    return response.asset;
  } catch (error) {
    console.error('Error uploading image to Shopify:', error);
    throw error;
  }
};

// Delete image from Shopify
export const deleteImageFromShopify = async (assetId: number): Promise<void> => {
  try {
    await makeShopifyRequest(`${SHOPIFY_API.assets}/${assetId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting image from Shopify:', error);
    throw error;
  }
};
