import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Page, Card, Text, Button, BlockStack, InlineStack } from '@shopify/polaris';
import { CheckmarkIcon } from '@shopify/polaris-icons';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const shop = searchParams.get('shop');

  useEffect(() => {
    // Auto-redirect to dashboard after 3 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleGoToDashboard = () => {
    navigate('/');
  };

  return (
    <Page>
      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto', 
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <Card>
          <div style={{ padding: '40px' }}>
            <BlockStack gap="400" align="center">
              <div style={{ 
                fontSize: '64px', 
                color: '#28a745',
                marginBottom: '20px'
              }}>
                ✅
              </div>
              
              <Text variant="headingLg" as="h1" fontWeight="bold">
                App Installation Successful!
              </Text>
              
              <Text variant="bodyMd" as="p" tone="subdued">
                Your Blog SEO AI app is now installed and ready to use.
              </Text>
              
              {shop && (
                <div style={{
                  padding: '16px',
                  backgroundColor: '#f6f6f7',
                  borderRadius: '8px',
                  border: '1px solid #c9cccf'
                }}>
                  <Text variant="bodyMd" as="p" fontWeight="semibold">
                    Store: {shop}
                  </Text>
                </div>
              )}
              
              <Text variant="bodyMd" as="p" tone="subdued">
                You'll be redirected to the dashboard in a few seconds...
              </Text>
              
              <InlineStack gap="200">
                <Button 
                  variant="primary" 
                  size="large"
                  onClick={handleGoToDashboard}
                >
                  🚀 Go to Dashboard
                </Button>
              </InlineStack>
            </BlockStack>
          </div>
        </Card>
      </div>
    </Page>
  );
};

export default AuthSuccess;
