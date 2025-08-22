import React, { useEffect, useState } from 'react';
import { Card, Button, Layout, Page } from '@shopify/polaris';
import { getShopifyAuthUrl } from '../config/shopifyAuth';
import shopifySessionService from '../services/shopifySessionService';

const ShopifyAuth: React.FC = () => {
  const [shop, setShop] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Lấy shop parameter từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const shopParam = urlParams.get('shop');
    
    if (shopParam && shopParam.endsWith('.myshopify.com')) {
      setShop(shopParam);
    }
  }, []);

  const handleInstallApp = async () => {
    if (!shop) {
      setError('Please enter a valid Shopify store domain');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Kiểm tra xem shop đã có session chưa
      if (shopifySessionService.hasValidSession(shop)) {
        // Redirect vào app với shop context
        window.location.href = `/?shop=${shop}`;
        return;
      }

      // Tạo OAuth URL và redirect
      const authUrl = getShopifyAuthUrl(shop);
      // Redirect to Shopify OAuth instead of embedding
      window.location.href = authUrl;
    } catch (err) {
      setError('Failed to start OAuth process');
      console.error('OAuth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShopChange = (value: string) => {
    setShop(value);
    setError('');
  };

  return (
    <Page title="Install Shopify App">
      <Layout>
        <Layout.Section>
          <Card>
            <div style={{ padding: '24px' }}>
              <h2 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: '600' }}>
                Install AI Blog Generator
              </h2>
              
              <p style={{ margin: '0 0 24px 0', color: '#6d7175', lineHeight: '1.5' }}>
                This app will help you generate and publish AI-powered blog posts directly to your Shopify store.
              </p>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  fontSize: '14px'
                }}>
                  Shopify Store Domain
                </label>
                <input
                  type="text"
                  value={shop}
                  onChange={(e) => handleShopChange(e.target.value)}
                  placeholder="your-store.myshopify.com"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #c9cccf',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
                {error && (
                  <div style={{ 
                    color: '#d82c0d', 
                    fontSize: '14px', 
                    marginTop: '8px' 
                  }}>
                    {error}
                  </div>
                )}
              </div>

              <Button
                primary
                onClick={handleInstallApp}
                loading={isLoading}
                disabled={!shop || isLoading}
                fullWidth
              >
                Install App
              </Button>

              <div style={{ 
                marginTop: '16px', 
                fontSize: '12px', 
                color: '#6d7175',
                textAlign: 'center'
              }}>
                By installing this app, you agree to our terms of service and privacy policy.
              </div>
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default ShopifyAuth;
