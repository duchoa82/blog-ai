import React from 'react';
import {
  Page,
  Layout,
  Card,
  Button,
  Text,
  InlineStack,
  BlockStack,
  Badge
} from '@shopify/polaris';

interface ShopifyAdminWrapperProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const ShopifyAdminWrapper: React.FC<ShopifyAdminWrapperProps> = ({ 
  children, 
  title = "Blog SEO AI", 
  subtitle = "Create and manage your blog posts with AI assistance" 
}) => {
  // Check if we're in development mode
  const isDevelopment = import.meta.env.DEV;

  if (!isDevelopment) {
    // In production, just render the children (will be embedded in Shopify admin)
    return <>{children}</>;
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#f6f6f7",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, sans-serif",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Shopify Admin Header */}
      <div style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e1e3e5",
        padding: "12px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <InlineStack gap="400" align="center">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "32px",
              height: "32px",
              backgroundColor: "#008060",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <span style={{ color: "white", fontSize: "16px", fontWeight: "bold" }}>S</span>
            </div>
            <Text variant="headingMd" as="h1" fontWeight="bold">Shopify Admin</Text>
          </div>
          <Badge tone="success">Development Store</Badge>
        </InlineStack>
        
        <InlineStack gap="200" align="center">
          <Text variant="bodySm" as="span">admin@example.com</Text>
          <Button variant="plain" size="slim">Settings</Button>
        </InlineStack>
      </div>

      {/* Shopify Admin Navigation */}
      <div style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e1e3e5",
        padding: "0 20px",
        overflowX: "auto"
      }}>
        <InlineStack gap="400" align="center" wrap={false}>
          <Button variant="plain" size="slim">Home</Button>
          <Button variant="plain" size="slim">Orders</Button>
          <Button variant="plain" size="slim">Products</Button>
          <Button variant="plain" size="slim">Customers</Button>
          <Button variant="plain" size="slim">Analytics</Button>
          <Button variant="plain" size="slim">Apps</Button>
          <Button variant="primary" size="slim" tone="success">
            Blog SEO AI
          </Button>
        </InlineStack>
      </div>

      {/* App Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Page
          title={title}
          subtitle={subtitle}
          backAction={{
            content: 'Apps',
            onAction: () => console.log('Back to apps')
          }}
          primaryAction={{
            content: 'Help',
            onAction: () => console.log('Help clicked')
          }}
          fullWidth
        >
          <Layout>
            <Layout.Section>
              <Card>
                <BlockStack gap="400">
                  <div 
                    className="dev-mode-indicator"
                    style={{
                      padding: "16px",
                      backgroundColor: "#f6f6f7",
                      borderRadius: "8px",
                      border: "2px dashed #c9cccf"
                    }}
                  >
                    <BlockStack gap="200">
                      <Text variant="bodyMd" as="p">
                        <strong>Local Development Mode:</strong> This simulates the Shopify admin interface. 
                        In production, your app will be embedded within the actual Shopify admin.
                      </Text>
                      <InlineStack gap="200" align="center">
                        <Badge tone="info">🔧 Development Mode</Badge>
                        <Text variant="bodySm" as="span">
                          Mock data • No real Shopify API calls • Local testing only
                        </Text>
                      </InlineStack>
                    </BlockStack>
                  </div>
                  <div style={{ flex: 1 }}>
                    {children}
                  </div>
                </BlockStack>
              </Card>
            </Layout.Section>
          </Layout>
        </Page>
      </div>
    </div>
  );
};

export default ShopifyAdminWrapper;
