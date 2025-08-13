import { useState } from "react";
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
  Icon
} from "@shopify/polaris";
import {
  SearchIcon,
  StarFilledIcon,
  ViewIcon,
  CartIcon
} from "@shopify/polaris-icons";

const ProductSelection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const navigate = useNavigate();

  const products = [
    {
      id: 1,
      name: "Premium Cotton T-Shirt",
      price: "$29.99",
      category: "Apparel",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
      description: "Soft, comfortable cotton t-shirt perfect for everyday wear",
      rating: 4.8,
      reviews: 124,
      inStock: true
    },
    {
      id: 2,
      name: "Wireless Bluetooth Headphones",
      price: "$79.99", 
      category: "Electronics",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
      description: "High-quality wireless headphones with noise cancellation",
      rating: 4.6,
      reviews: 89,
      inStock: true
    },
    {
      id: 3,
      name: "Eco-Friendly Water Bottle",
      price: "$24.99",
      category: "Lifestyle", 
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=300&fit=crop",
      description: "Sustainable stainless steel water bottle with insulation",
      rating: 4.9,
      reviews: 156,
      inStock: false
    },
    {
      id: 4,
      name: "Smart Fitness Tracker",
      price: "$149.99",
      category: "Electronics",
      image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=300&h=300&fit=crop", 
      description: "Advanced fitness tracking with heart rate monitoring",
      rating: 4.7,
      reviews: 203,
      inStock: true
    }
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContinue = () => {
    if (selectedProduct) {
      navigate('/generate');
    }
  };

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
                placeholder="Search products..."
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
              <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 4, lg: 4, xl: 4 }} key={product.id}>
                <div 
                  onClick={() => setSelectedProduct(product.id)}
                  style={{ cursor: "pointer" }}
                >
                  <Card>
                    <div style={{ 
                      padding: "16px",
                      border: selectedProduct === product.id ? "2px solid var(--p-action-primary)" : "none",
                      borderRadius: "8px"
                    }}>
                      <BlockStack gap="200">
                        <div style={{ position: "relative" }}>
                          <Thumbnail
                            source={product.image}
                            alt={product.name}
                            size="large"
                          />
                          {!product.inStock && (
                            <div style={{ position: "absolute", top: "8px", right: "8px" }}>
                              <Badge tone="critical">Out of Stock</Badge>
                            </div>
                          )}
                        </div>
                        
                        <BlockStack gap="100">
                          <Badge>{product.category}</Badge>
                          <Text variant="headingMd" as="h3">
                            {product.name}
                          </Text>
                          <Text variant="bodySm" tone="subdued" as="span">
                            {product.description}
                          </Text>
                        </BlockStack>

                        <InlineStack align="center">
                          <Text variant="headingMd" as="h4" fontWeight="semibold">
                            {product.price}
                          </Text>
                          <InlineStack align="center" gap="100">
                            <Icon source={StarFilledIcon} tone="warning" />
                            <Text variant="bodySm" as="span">
                              {product.rating} ({product.reviews})
                            </Text>
                          </InlineStack>
                        </InlineStack>

                        <ButtonGroup fullWidth>
                          <Button icon={ViewIcon} variant="secondary" size="slim" onClick={() => {
                            alert(`Previewing ${product.name}`);
                          }}>
                            Preview
                          </Button>
                          <Button 
                            icon={CartIcon} 
                            size="slim"
                            disabled={!product.inStock}
                            onClick={() => {
                              setSelectedProduct(product.id);
                            }}
                          >
                            Select
                          </Button>
                        </ButtonGroup>
                      </BlockStack>
                    </div>
                  </Card>
                </div>
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