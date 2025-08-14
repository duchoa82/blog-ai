import { makeStorefrontRequest, STOREFRONT_QUERIES, getShopifyStorefrontUrl } from '../shopify-config';
import { isDevelopment, mockShopifyProducts, mockApiResponse, devLog } from '../utils/dev-helpers';

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

// Fetch all products from Shopify Storefront API
export const fetchShopifyProducts = async (): Promise<ShopifyProduct[]> => {
  if (isDevelopment) {
    devLog('Using mock Shopify products for development');
    return mockApiResponse(mockShopifyProducts);
  }

  try {
    // Detect shop from current context
    const shop = detectShop();
    
    // Use Storefront API with tokenless access
    const response = await makeStorefrontRequest(
      shop,
      STOREFRONT_QUERIES.products,
      { first: 50 } // Get first 50 products
    );
    
    // Transform GraphQL response to match your interface
    const products = response.data?.products?.edges?.map((edge: any) => ({
      id: edge.node.id.split('/').pop(), // Extract ID from GraphQL global ID
      title: edge.node.title,
      handle: edge.node.handle,
      description: edge.node.description,
      product_type: edge.node.productType,
      vendor: edge.node.vendor,
      images: edge.node.images?.edges?.map((imgEdge: any) => ({
        src: imgEdge.node.url,
        alt: imgEdge.node.altText
      })) || [],
      status: 'active' // Storefront API doesn't provide status, assume active
    })) || [];
    
    return products;
  } catch (error) {
    console.error('Error fetching Shopify products:', error);
    // Fallback to mock data if API fails
    return mockApiResponse(mockShopifyProducts);
  }
};

// Fetch single product by ID
export const fetchShopifyProduct = async (productId: number): Promise<ShopifyProduct> => {
  try {
    const shop = detectShop();
    
    // For single product, we can use the handle from the ID
    // This is a simplified approach - in production you might want to store handle mappings
    const response = await makeStorefrontRequest(
      shop,
      STOREFRONT_QUERIES.products,
      { first: 1 }
    );
    
    const product = response.data?.products?.edges?.[0]?.node;
    if (!product) {
      throw new Error('Product not found');
    }
    
    return {
      id: product.id.split('/').pop(),
      title: product.title,
      handle: product.handle,
      description: product.description,
      product_type: product.productType,
      vendor: product.vendor,
      images: product.images?.edges?.map((imgEdge: any) => ({
        src: imgEdge.node.url,
        alt: imgEdge.node.altText
      })) || [],
      status: 'active'
    };
  } catch (error) {
    console.error('Error fetching Shopify product:', error);
    throw error;
  }
};

// Search products
export const searchShopifyProducts = async (query: string): Promise<ShopifyProduct[]> => {
  try {
    const shop = detectShop();
    
    // Storefront API supports search in the products query
    const response = await makeStorefrontRequest(
      shop,
      STOREFRONT_QUERIES.products,
      { first: 20, query: query }
    );
    
    const products = response.data?.products?.edges?.map((edge: any) => ({
      id: edge.node.id.split('/').pop(),
      title: edge.node.title,
      handle: edge.node.handle,
      description: edge.node.description,
      product_type: edge.node.productType,
      vendor: edge.node.vendor,
      images: edge.node.images?.edges?.map((imgEdge: any) => ({
        src: imgEdge.node.url,
        alt: imgEdge.node.altText
      })) || [],
      status: 'active'
    })) || [];
    
    return products;
  } catch (error) {
    console.error('Error searching Shopify products:', error);
    throw error;
  }
};

// Get products by collection (simplified - you might want to implement collection queries)
export const getProductsByCollection = async (collectionId: number): Promise<ShopifyProduct[]> => {
  try {
    const shop = detectShop();
    
    // For now, just return all products (you can implement collection-specific queries later)
    return await fetchShopifyProducts();
  } catch (error) {
    console.error('Error fetching products by collection:', error);
    throw error;
  }
};
