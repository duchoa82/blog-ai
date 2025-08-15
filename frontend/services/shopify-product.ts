import { makeStorefrontRequest, STOREFRONT_QUERIES, getShopifyStorefrontUrl } from '../shopify-config';
import { isDevelopment, mockShopifyProducts, mockApiResponse, devLog } from '../utils/dev-helpers';
import { detectShop } from '../utils/shopify-utils';

export interface ShopifyProduct {
  id: number;
  title: string;
  handle: string;
  body_html?: string;
  description?: string; // Add description field
  vendor: string;
  product_type: string;
  created_at?: string;
  updated_at?: string;
  published_at?: string;
  template_suffix?: string;
  tags?: string;
  status: string;
  admin_graphql_api_id?: string;
  product_url?: string; // Add product_url field
  variants?: ShopifyProductVariant[];
  images: ShopifyProductImage[];
  options?: ShopifyProductOption[];
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
    console.log('🛍️ Fetching products for shop:', shop);
    
    // Use Storefront API with tokenless access
    const response = await makeStorefrontRequest(
      shop,
      STOREFRONT_QUERIES.products,
      { first: 50 } // Get first 50 products
    );
    
    console.log('📦 Storefront API response:', response);
    
    // Transform GraphQL response to match your interface
    const products = response.data?.products?.edges?.map((edge: any) => {
      const product = edge.node;
      
      // Construct full product URL
      const productUrl = `https://${shop}/products/${product.handle}`;
      
      return {
        id: product.id.split('/').pop(), // Extract ID from GraphQL global ID
        title: product.title,
        handle: product.handle,
        description: product.description || 'No description available',
        product_type: product.productType || 'General',
        vendor: product.vendor || 'Unknown Vendor',
        product_url: productUrl, // Full product URL
        images: product.images?.edges?.map((imgEdge: any) => ({
          src: imgEdge.node.url,
          alt: imgEdge.node.altText || product.title
        })) || [],
        status: 'active' // Storefront API doesn't provide status, assume active
      };
    }) || [];
    
    console.log(`✅ Successfully fetched ${products.length} products from ${shop}`);
    return products;
  } catch (error) {
    console.error('❌ Error fetching Shopify products:', error);
    
    // Enhanced error logging
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        context: {
          host: new URLSearchParams(window.location.search).get('host'),
          hostname: window.location.hostname,
          pathname: window.location.pathname
        }
      });
    }
    
    // Fallback to mock data if API fails
    console.warn('⚠️ Falling back to mock data due to API failure');
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
