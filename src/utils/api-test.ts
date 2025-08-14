import { makeStorefrontRequest, STOREFRONT_QUERIES } from '../shopify-config';

// Simple test query to debug 400 errors
const SIMPLE_TEST_QUERY = `
  query {
    shop {
      name
      description
    }
  }
`;

// Test API availability with a simple query
export const testStorefrontAPI = async (shop: string) => {
  try {
    console.log('🧪 Testing Storefront API for shop:', shop);
    
    // First test with a very simple query
    console.log('🔍 Testing simple shop query...');
    const simpleResponse = await makeStorefrontRequest(
      shop,
      SIMPLE_TEST_QUERY,
      {}
    );
    
    console.log('✅ Simple query response:', simpleResponse);
    
    // If simple query works, test products query
    console.log('🔍 Testing products query...');
    const response = await makeStorefrontRequest(
      shop,
      STOREFRONT_QUERIES.products,
      { first: 5 } // Just get 5 products for testing
    );
    
    console.log('✅ Products query response:', response);
    
    if (response.data?.products?.edges) {
      console.log('🎉 API is working! Found products:', response.data.products.edges.length);
      return {
        success: true,
        products: response.data.products.edges,
        message: `Successfully fetched ${response.data.products.edges.length} products`
      };
    } else {
      console.log('⚠️ API responded but no products found');
      return {
        success: false,
        message: 'API responded but no products found',
        response
      };
    }
  } catch (error) {
    console.error('❌ Storefront API test failed:', error);
    return {
      success: false,
      message: `API test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error
    };
  }
};

// Test with multiple shop formats
export const testMultipleShopFormats = async () => {
  const testShops = [
    'your-store-name.myshopify.com',
    'demo-store.myshopify.com',
    'test-shop.myshopify.com'
  ];
  
  console.log('🧪 Testing multiple shop formats...');
  
  for (const shop of testShops) {
    console.log(`\n--- Testing ${shop} ---`);
    const result = await testStorefrontAPI(shop);
    console.log(`Result: ${result.success ? '✅ Success' : '❌ Failed'}`);
    if (result.success) {
      console.log('Sample product:', result.products?.[0]?.node);
      break; // Stop at first successful shop
    }
  }
};

// Test with current context shop
export const testCurrentShop = async () => {
  try {
    // Try to detect shop from current context
    const urlShop = new URLSearchParams(window.location.search).get('shop');
    const hostname = window.location.hostname;
    
    let shop = urlShop;
    
    if (!shop && hostname.includes('myshopify.com')) {
      shop = hostname;
    }
    
    if (!shop) {
      console.log('🔍 No shop detected in current context');
      return null;
    }
    
    console.log('🔍 Testing current context shop:', shop);
    return await testStorefrontAPI(shop);
    
  } catch (error) {
    console.error('❌ Error testing current shop:', error);
    return null;
  }
};
