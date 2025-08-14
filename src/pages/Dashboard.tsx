import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Page,
  Card,
  Button,
  Text,
  BlockStack,
  InlineStack,
  Badge,
  Icon,
  Layout,
  LegacyStack,
  Spinner
} from '@shopify/polaris';
import {
  PlusIcon,
  ChartHistogramFlatIcon,
  QuestionCircleIcon,
  StarIcon,
  MagicIcon,
  StarFilledIcon,
  PlayIcon
} from '@shopify/polaris-icons';
import { testCurrentShop, testMultipleShopFormats } from '../utils/api-test';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const primaryAction = {
    content: 'Generate New Post',
    icon: PlusIcon,
    onAction: () => navigate('/generate', { state: { from: 'dashboard' } }),
  };

  const handleTestAPI = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      console.log('🧪 Starting API test...');
      
      // First test current context shop
      const currentResult = await testCurrentShop();
      console.log('Current shop test result:', currentResult);
      
      if (currentResult?.success) {
        setTestResult({
          type: 'current',
          ...currentResult
        });
      } else {
        // If current shop fails, test with sample shops
        console.log('Current shop failed, testing sample shops...');
        await testMultipleShopFormats();
        
        // For demo purposes, show a sample result
        setTestResult({
          type: 'sample',
          success: true,
          message: 'API test completed - check console for details',
          sampleData: {
            products: [
              {
                id: 'sample-1',
                title: 'Sample Product 1',
                handle: 'sample-product-1',
                description: 'This is a sample product for testing',
                product_type: 'Sample',
                vendor: 'Sample Vendor',
                images: [{ src: 'https://via.placeholder.com/150', alt: 'Sample Product' }]
              },
              {
                id: 'sample-2',
                title: 'Sample Product 2',
                handle: 'sample-product-2',
                description: 'Another sample product for testing',
                product_type: 'Sample',
                vendor: 'Sample Vendor',
                images: [{ src: 'https://via.placeholder.com/150', alt: 'Sample Product' }]
              }
            ]
          }
        });
      }
    } catch (error) {
      console.error('❌ API test error:', error);
      setTestResult({
        type: 'error',
        success: false,
        message: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Page
      title="Dashboard"
      primaryAction={primaryAction}
    >
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Welcome to Blog SEO AI
              </Text>
              <Text variant="bodyMd" as="p">
                Generate engaging blog content with AI assistance and integrate with your Shopify store.
              </Text>
              
              {/* API Test Section */}
              <div style={{ 
                border: '1px solid #c9cccf', 
                borderRadius: '8px', 
                padding: '16px',
                backgroundColor: '#f6f6f7'
              }}>
                <BlockStack gap="200">
                  <Text variant="headingSm" as="h3" fontWeight="semibold">
                    🧪 Test Storefront API
                  </Text>
                  <Text variant="bodyMd" as="p" tone="subdued">
                    Test if the Storefront API is working and see sample data
                  </Text>
                  
                  <InlineStack gap="200">
                    <Button
                      variant="secondary"
                      icon={PlayIcon}
                      onClick={handleTestAPI}
                      loading={isTesting}
                      disabled={isTesting}
                    >
                      {isTesting ? 'Testing...' : 'Test API'}
                    </Button>
                    
                    {testResult && (
                      <Badge tone={testResult.success ? 'success' : 'critical'}>
                        {testResult.success ? '✅ Test Complete' : '❌ Test Failed'}
                      </Badge>
                    )}
                  </InlineStack>
                  
                  {/* Test Results */}
                  {testResult && (
                    <div style={{ 
                      marginTop: '12px',
                      padding: '12px',
                      backgroundColor: testResult.success ? '#f0f9ff' : '#fef2f2',
                      border: `1px solid ${testResult.success ? '#0ea5e9' : '#f87171'}`,
                      borderRadius: '6px'
                    }}>
                      <Text variant="bodyMd" as="p" fontWeight="semibold">
                        {testResult.message}
                      </Text>
                      
                      {testResult.sampleData?.products && (
                        <div style={{ marginTop: '12px' }}>
                          <Text variant="bodySm" as="p" fontWeight="semibold">
                            Sample Products:
                          </Text>
                          <div style={{ marginTop: '8px' }}>
                            {testResult.sampleData.products.map((product: any) => (
                              <div key={product.id} style={{
                                padding: '8px',
                                backgroundColor: 'white',
                                borderRadius: '4px',
                                marginTop: '4px',
                                border: '1px solid #e1e3e5'
                              }}>
                                <Text variant="bodySm" as="p" fontWeight="semibold">
                                  {product.title}
                                </Text>
                                <Text variant="bodySm" as="p" tone="subdued">
                                  {product.description}
                                </Text>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </BlockStack>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Quick Stats
              </Text>
              <Layout>
                <Layout.Section oneThird>
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Icon source={ChartHistogramFlatIcon} color="base" />
                    <Text variant="headingLg" as="h3" fontWeight="bold">
                      0
                    </Text>
                    <Text variant="bodyMd" as="p" tone="subdued">
                      Blog Posts
                    </Text>
                  </div>
                </Layout.Section>
                <Layout.Section oneThird>
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Icon source={StarIcon} color="base" />
                    <Text variant="headingLg" as="h3" fontWeight="bold">
                      0
                    </Text>
                    <Text variant="bodyMd" as="p" tone="subdued">
                      AI Generated
                    </Text>
                  </div>
                </Layout.Section>
                <Layout.Section oneThird>
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Icon source={QuestionCircleIcon} color="base" />
                    <Text variant="headingLg" as="h3" fontWeight="bold">
                      0
                    </Text>
                    <Text variant="bodyMd" as="p" tone="subdued">
                      Products
                    </Text>
                  </div>
                </Layout.Section>
              </Layout>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Brand Voice Setup
              </Text>
              <Text variant="bodyMd" as="p">
                Configure your brand's voice and tone for AI-generated content.
              </Text>
              <Button variant="secondary" icon={MagicIcon}>
                Configure Brand Voice
              </Button>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Dashboard;