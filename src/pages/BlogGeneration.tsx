import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Thumbnail,
  Badge
} from "@shopify/polaris";
import { SEOConfiguration } from "../components/SEOConfiguration";
import BlogContentCreation from "./BlogContentCreation";
import { getBusinessDescription, getTargetCustomer, setBusinessDescription as setSharedBusinessDescription, setTargetCustomer as setSharedTargetCustomer } from "../lib/sharedData";
import { ShopifyProduct } from "../services/shopify-product";

const BlogGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showBlogContentCreation, setShowBlogContentCreation] = useState(false);
  const [businessDescription, setBusinessDescription] = useState("");
  const [targetCustomer, setTargetCustomer] = useState("");
  const [generatedBlogContent, setGeneratedBlogContent] = useState<string>("");
  const [blogTitle, setBlogTitle] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get selected product from navigation state
  const selectedProduct = location.state?.selectedProduct as ShopifyProduct | undefined;

  // Load shared data on component mount
  useEffect(() => {
    setBusinessDescription(getBusinessDescription());
    setTargetCustomer(getTargetCustomer());
  }, []);

  const handleGenerate = (generatedContent?: string, title?: string) => {
    if (generatedContent) {
      // Store the generated content
      setGeneratedBlogContent(generatedContent);
      // Store the blog title
      if (title) {
        setBlogTitle(title);
      }
      // Show the blog content creation modal
      setShowBlogContentCreation(true);
    } else {
      // Fallback for when no content is generated
      setIsGenerating(true);
      setTimeout(() => {
        setIsGenerating(false);
        setShowBlogContentCreation(true);
      }, 3000);
    }
  };

  const handleBusinessDescriptionChange = (value: string) => {
    setBusinessDescription(value);
    setSharedBusinessDescription(value);
  };

  const handleTargetCustomerChange = (value: string) => {
    setTargetCustomer(value);
    setSharedTargetCustomer(value);
  };

  const backAction = {
    content: location.state?.from === 'blogs' ? 'Back to Blogs' : 'Back to Dashboard',
    onAction: () => {
      if (location.state?.from === 'blogs') {
        navigate('/blogs');
      } else {
        navigate('/');
      }
    },
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
    return "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop";
  };

  return (
    <>
      <Page
        title="Generate Blog Post"
        subtitle="Configure SEO settings and generate AI-powered content"
        backAction={backAction}
      >
        <Layout>
          {/* Selected Product Display */}
          {selectedProduct && (
            <Layout.Section>
              <Card>
                <div style={{ padding: "16px" }}>
                  <BlockStack gap="400">
                    <Text as="h3" variant="headingMd">
                      Selected Product for Blog Post
                    </Text>
                    <InlineStack align="start" gap="400">
                      <Thumbnail
                        source={getProductImage(selectedProduct)}
                        alt={selectedProduct.title}
                        size="medium"
                      />
                      <div style={{ flex: 1 }}>
                        <Text as="h4" variant="headingMd">
                          {selectedProduct.title}
                        </Text>
                        <InlineStack gap="200" wrap={false}>
                          <Badge>{selectedProduct.product_type}</Badge>
                          <Badge tone="success">{getProductPrice(selectedProduct)}</Badge>
                          {selectedProduct.vendor && (
                            <Badge tone="info">{selectedProduct.vendor}</Badge>
                          )}
                        </InlineStack>
                        {selectedProduct.body_html && (
                          <Text as="p" variant="bodyMd" tone="subdued">
                            {selectedProduct.body_html.replace(/<[^>]*>/g, '').substring(0, 200)}...
                          </Text>
                        )}
                      </div>
                    </InlineStack>
                  </BlockStack>
                </div>
              </Card>
            </Layout.Section>
          )}

          <Layout.Section>
            <SEOConfiguration
              businessDescription={businessDescription}
              targetCustomer={targetCustomer}
              onBusinessDescriptionChange={handleBusinessDescriptionChange}
              onTargetCustomerChange={handleTargetCustomerChange}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              selectedProduct={selectedProduct}
            />
          </Layout.Section>
        </Layout>
      </Page>
      
      <BlogContentCreation
        isOpen={showBlogContentCreation}
        onClose={() => setShowBlogContentCreation(false)}
        generatedContent={generatedBlogContent}
        blogTitle={blogTitle}
      />
    </>
  );
};

export default BlogGeneration;