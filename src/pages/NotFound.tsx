import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Page, Card, Button, Layout, Text, BlockStack } from "@shopify/polaris";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <Card>
              <div style={{ padding: "40px" }}>
                <BlockStack gap="400" align="center">
                  <Text variant="headingXl" as="h1">
                    404
                  </Text>
                  <Text variant="headingLg" as="h2" tone="subdued">
                    Oops! Page not found
                  </Text>
                  <Text variant="bodyMd" tone="subdued" as="span">
                    The page you're looking for doesn't exist.
                  </Text>
                  <Button variant="primary" url="/">
                    Return to Home
                  </Button>
                </BlockStack>
              </div>
            </Card>
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default NotFound;
