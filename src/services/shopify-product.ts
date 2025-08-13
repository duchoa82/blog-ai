import { makeShopifyRequest, SHOPIFY_API } from '../shopify-config';
import { isDevelopment, mockShopifyProducts, mockApiResponse, devLog } from '../utils/dev-helpers';

export interface ShopifyProduct {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  vendor: string;
  product_type: string;
  created_at: string;
  updated_at: string;
  published_at: string;
  template_suffix: string;
  tags: string;
  status: string;
  admin_graphql_api_id: string;
  variants: ShopifyProductVariant[];
  images: ShopifyProductImage[];
  options: ShopifyProductOption[];
}

export interface ShopifyProductVariant {
  id: number;
  title: string;
  price: string;
  sku: string;
  position: number;
  inventory_policy: string;
  compare_at_price: string;
  fulfillment_service: string;
  inventory_management: string;
  option1: string;
  option2: string;
  option3: string;
  created_at: string;
  updated_at: string;
  taxable: boolean;
  barcode: string;
  grams: number;
  image_id: number;
  weight: number;
  weight_unit: string;
  inventory_item_id: number;
  inventory_quantity: number;
  old_inventory_quantity: number;
  requires_shipping: boolean;
  admin_graphql_api_id: string;
}

export interface ShopifyProductImage {
  id: number;
  product_id: number;
  position: number;
  created_at: string;
  updated_at: string;
  alt: string;
  width: number;
  height: number;
  src: string;
  variant_ids: number[];
  admin_graphql_api_id: string;
}

export interface ShopifyProductOption {
  id: number;
  product_id: number;
  name: string;
  position: number;
  values: string[];
}

// Fetch all products from Shopify
export const fetchShopifyProducts = async (): Promise<ShopifyProduct[]> => {
  if (isDevelopment) {
    devLog('Using mock Shopify products for development');
    return mockApiResponse(mockShopifyProducts);
  }

  try {
    const response = await makeShopifyRequest('/admin/api/2023-10/products.json');
    return response.products;
  } catch (error) {
    console.error('Error fetching Shopify products:', error);
    // Fallback to mock data if API fails
    return mockApiResponse(mockShopifyProducts);
  }
};

// Fetch a specific product by ID
export const fetchShopifyProduct = async (productId: number): Promise<ShopifyProduct> => {
  try {
    const response = await makeShopifyRequest(`/admin/api/2023-10/products/${productId}.json`);
    return response.product;
  } catch (error) {
    console.error('Error fetching Shopify product:', error);
    throw error;
  }
};

// Search products by query
export const searchShopifyProducts = async (query: string): Promise<ShopifyProduct[]> => {
  try {
    const response = await makeShopifyRequest(`/admin/api/2023-10/products.json?query=${encodeURIComponent(query)}`);
    return response.products;
  } catch (error) {
    console.error('Error searching Shopify products:', error);
    throw error;
  }
};

// Get products by collection
export const getProductsByCollection = async (collectionId: number): Promise<ShopifyProduct[]> => {
  try {
    const response = await makeShopifyRequest(`/admin/api/2023-10/collections/${collectionId}/products.json`);
    return response.products;
  } catch (error) {
    console.error('Error fetching collection products:', error);
    throw error;
  }
};
