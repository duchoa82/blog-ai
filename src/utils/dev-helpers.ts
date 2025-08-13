// Development helpers for local testing

export const isDevelopment = import.meta.env.DEV;

// Mock Shopify data for development
export const mockShopifyImages = [
  {
    id: 1,
    key: 'product-image-1',
    public_url: 'https://via.placeholder.com/400x300/0066cc/ffffff?text=Product+Image+1',
    content_type: 'image/png',
    size: 1024000,
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
    alt: 'Product showcase image'
  },
  {
    id: 2,
    key: 'lifestyle-image-1',
    public_url: 'https://via.placeholder.com/400x300/00a651/ffffff?text=Lifestyle+Image+1',
    content_type: 'image/png',
    size: 2048000,
    created_at: '2024-01-14T15:45:00Z',
    updated_at: '2024-01-14T15:45:00Z',
    alt: 'Lifestyle photography'
  },
  {
    id: 3,
    key: 'banner-image-1',
    public_url: 'https://via.placeholder.com/400x300/ff6b35/ffffff?text=Banner+Image+1',
    content_type: 'image/png',
    size: 1536000,
    created_at: '2024-01-13T09:20:00Z',
    updated_at: '2024-01-13T09:20:00Z',
    alt: 'Promotional banner'
  },
  {
    id: 4,
    key: 'hero-image-1',
    public_url: 'https://via.placeholder.com/400x300/8e44ad/ffffff?text=Hero+Image+1',
    content_type: 'image/png',
    size: 3072000,
    created_at: '2024-01-12T14:10:00Z',
    updated_at: '2024-01-12T14:10:00Z',
    alt: 'Hero section image'
  }
];

export const mockShopifyProducts = [
  {
    id: 1,
    title: "Premium Cotton T-Shirt",
    handle: "premium-cotton-tshirt",
    body_html: "Soft, comfortable cotton t-shirt perfect for everyday wear",
    vendor: "Fashion Brand",
    product_type: "Apparel",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-15T12:00:00Z",
    published_at: "2024-01-01T00:00:00Z",
    template_suffix: "",
    tags: "cotton, t-shirt, casual, comfortable",
    status: "active",
    admin_graphql_api_id: "gid://shopify/Product/1",
    variants: [
      {
        id: 1,
        title: "Default Title",
        price: "29.99",
        sku: "TSHIRT-001",
        position: 1,
        inventory_policy: "deny",
        compare_at_price: "39.99",
        fulfillment_service: "manual",
        inventory_management: "shopify",
        option1: "Default Title",
        option2: null,
        option3: null,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-15T12:00:00Z",
        taxable: true,
        barcode: "",
        grams: 150,
        image_id: 1,
        weight: 0.15,
        weight_unit: "kg",
        inventory_item_id: 1,
        inventory_quantity: 100,
        old_inventory_quantity: 100,
        requires_shipping: true,
        admin_graphql_api_id: "gid://shopify/ProductVariant/1"
      }
    ],
    images: [
      {
        id: 1,
        product_id: 1,
        position: 1,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-15T12:00:00Z",
        alt: "Premium Cotton T-Shirt",
        width: 400,
        height: 300,
        src: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop",
        variant_ids: [1],
        admin_graphql_api_id: "gid://shopify/ProductImage/1"
      }
    ],
    options: [
      {
        id: 1,
        product_id: 1,
        name: "Title",
        position: 1,
        values: ["Default Title"]
      }
    ]
  },
  {
    id: 2,
    title: "Wireless Bluetooth Headphones",
    handle: "wireless-bluetooth-headphones",
    body_html: "High-quality wireless headphones with noise cancellation",
    vendor: "Tech Brand",
    product_type: "Electronics",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-15T12:00:00Z",
    published_at: "2024-01-01T00:00:00Z",
    template_suffix: "",
    tags: "wireless, bluetooth, headphones, noise-cancellation",
    status: "active",
    admin_graphql_api_id: "gid://shopify/Product/2",
    variants: [
      {
        id: 2,
        title: "Default Title",
        price: "79.99",
        sku: "HEADPHONES-001",
        position: 1,
        inventory_policy: "deny",
        compare_at_price: "99.99",
        fulfillment_service: "manual",
        inventory_management: "shopify",
        option1: "Default Title",
        option2: null,
        option3: null,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-15T12:00:00Z",
        taxable: true,
        barcode: "",
        grams: 250,
        image_id: 2,
        weight: 0.25,
        weight_unit: "kg",
        inventory_item_id: 2,
        inventory_quantity: 50,
        old_inventory_quantity: 50,
        requires_shipping: true,
        admin_graphql_api_id: "gid://shopify/ProductVariant/2"
      }
    ],
    images: [
      {
        id: 2,
        product_id: 2,
        position: 1,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-15T12:00:00Z",
        alt: "Wireless Bluetooth Headphones",
        width: 400,
        height: 300,
        src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
        variant_ids: [2],
        admin_graphql_api_id: "gid://shopify/ProductImage/2"
      }
    ],
    options: [
      {
        id: 2,
        product_id: 2,
        name: "Title",
        position: 1,
        values: ["Default Title"]
      }
    ]
  }
];

export const mockShopifyBlogs = [
  {
    id: 1,
    title: 'News',
    handle: 'news',
    commentable: 'moderate',
    feedburner: '',
    feedburner_location: '',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T12:00:00Z',
    template_suffix: '',
    tags: '',
    admin_graphql_api_id: 'gid://shopify/Blog/1'
  },
  {
    id: 2,
    title: 'Fashion',
    handle: 'fashion',
    commentable: 'moderate',
    feedburner: '',
    feedburner_location: '',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T12:00:00Z',
    template_suffix: '',
    tags: '',
    admin_graphql_api_id: 'gid://shopify/Blog/2'
  },
  {
    id: 3,
    title: 'Lifestyle',
    handle: 'lifestyle',
    commentable: 'moderate',
    feedburner: '',
    feedburner_location: '',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T12:00:00Z',
    template_suffix: '',
    tags: '',
    admin_graphql_api_id: 'gid://shopify/Blog/3'
  }
];

// Development mode console logging
export const devLog = (message: string, data?: any) => {
  if (isDevelopment) {
    console.log(`🔧 [DEV] ${message}`, data || '');
  }
};

// Simulate API delay for realistic testing
export const simulateApiDelay = (ms: number = 1000): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Mock API response wrapper
export const mockApiResponse = <T>(data: T): T => {
  return data;
};
