import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Page,
  Card,
  Button,
  TextField,
  Badge,
  Layout,
  Grid,
  Thumbnail,
  Text,
  BlockStack,
  InlineStack,
  ButtonGroup,
  Icon,
  Spinner
} from "@shopify/polaris";
import {
  SearchIcon,
  StarFilledIcon,
  ViewIcon,
  CartIcon
} from "@shopify/polaris-icons";
import { fetchShopifyProducts, ShopifyProduct } from "../services/shopify-product";

const ProductSelection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch products from Shopify on component mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const shopifyProducts = await fetchShopifyProducts();
        setProducts(shopifyProducts);
        setError(null);
      } catch (err) {
        console.error('Failed to load products:', err);
        setError('Failed to load products from your store. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.product_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContinue = () => {
    if (selectedProduct) {
      const selectedProductData = products.find(p => p.id === selectedProduct);
      navigate('/generate', { 
        state: { 
          selectedProduct: selectedProductData 
        } 
      });
    }
  };

  const getProductPrice = (product: ShopifyProduct) => {
    if (product.variants && product.variants.length > 0) {
      return `$${parseFloat(product.variants[0].price).toFixed(2)}`;
    }
    return 'Price not available';
  };

  const getProductImage = (product: ShopifyProduct) => {
    if (product.images && product.images.length > 0) {
      return product.images[0].src;
    }
    // Fallback to a placeholder image
    return "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop";
  };

  if (loading) {
    return (
      <Page
        title="Select Product"
        subtitle="Loading products from your store..."
      >
        <Layout>
          <Layout.Section>
            <Card>
              <div style={{ padding: "40px", textAlign: "center" }}>
                <Spinner size="large" />
                <Text as="p" variant="bodyMd">
                  Loading your store's products...
                </Text>
              </div>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  if (error) {
    return (
      <Page
        title="Select Product"
        subtitle="Error loading products"
      >
        <Layout>
          <Layout.Section>
            <Card>
              <div style={{ padding: "40px", textAlign: "center" }}>
                <Text as="p" variant="bodyMd" tone="critical">
                  {error}
                </Text>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  if (products.length === 0) {
    return (
      <Page
        title="Select Product"
        subtitle="No products found in your store"
      >
        <Layout>
          <Layout.Section>
            <Card>
              <div style={{ padding: "40px", textAlign: "center" }}>
                <Text as="p" variant="bodyMd">
                  No products found in your store. Please add some products first.
                </Text>
                <Button onClick={() => navigate('/')}>
                  Back to Dashboard
                </Button>
              </div>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <Page
      title="Select Product"
      subtitle="Choose a product from your store to generate a blog post"
    >
      <Layout>
        <Layout.Section>
          <Card>
            <div style={{ padding: "16px" }}>
              <TextField
                label=""
                labelHidden
                placeholder="Search products by name, type, or vendor..."
                value={searchTerm}
                onChange={setSearchTerm}
                prefix={<Icon source={SearchIcon} tone="base" />}
                autoComplete="off"
              />
            </div>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Grid>
            {filteredProducts.map((product) => (
              <Grid.Cell key={product.id} columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
                <Card>
                  <div style={{ padding: "16px" }}>
                    <BlockStack gap="400">
                      <Thumbnail
                        source={getProductImage(product)}
                        alt={product.title}
                        size="large"
                      />
                      <div>
                        <Text as="h3" variant="headingMd">
                          {product.title}
                        </Text>
                        <Text as="p" variant="bodyMd" tone="subdued">
                          {product.product_type}
                        </Text>
                        <Text as="p" variant="bodyMd" tone="subdued">
                          {product.vendor}
                        </Text>
                        <Text as="p" variant="headingMd" tone="success">
                          {getProductPrice(product)}
                        </Text>
                        {product.body_html && (
                          <Text as="p" variant="bodySm" tone="subdued">
                            {product.body_html.replace(/<[^>]*>/g, '').substring(0, 100)}...
                          </Text>
                        )}
                      </div>
                      <Button
                        variant={selectedProduct === product.id ? "primary" : "secondary"}
                        onClick={() => setSelectedProduct(selectedProduct === product.id ? null : product.id)}
                        fullWidth
                      >
                        {selectedProduct === product.id ? "Selected" : "Select Product"}
                      </Button>
                    </BlockStack>
                  </div>
                </Card>
              </Grid.Cell>
            ))}
          </Grid>
        </Layout.Section>

        {selectedProduct && (
          <Layout.Section>
            <Card>
              <div style={{ padding: "16px" }}>
                <InlineStack align="center">
                  <Button variant="secondary" onClick={() => setSelectedProduct(null)}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleContinue}>
                    Continue to Blog Generation
                  </Button>
                </InlineStack>
              </div>
            </Card>
          </Layout.Section>
        )}
      </Layout>
    </Page>
  );
};

export default ProductSelection;