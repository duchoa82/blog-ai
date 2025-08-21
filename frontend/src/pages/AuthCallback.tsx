import React, { useEffect, useState } from 'react';
import { Card, Layout, Page, Spinner } from '@shopify/polaris';
import { useNavigate, useSearchParams } from 'react-router-dom';
import shopifySessionService, { ShopSession } from '../services/shopifySessionService';
import { SHOPIFY_AUTH_CONFIG } from '../config/shopifyAuth';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    handleOAuthCallback();
  }, []);

  const handleOAuthCallback = async () => {
    try {
      // Lấy parameters từ URL
      const shop = searchParams.get('shop');
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const hmac = searchParams.get('hmac');

      if (!shop || !code) {
        throw new Error('Missing required OAuth parameters');
      }

      // Validate HMAC (security check)
      if (!hmac) {
        console.warn('No HMAC provided - proceeding without validation');
      }

      // Exchange code for access token
      const accessToken = await exchangeCodeForToken(shop, code);
      
      // Lấy shop info
      const shopInfo = await getShopInfo(shop, accessToken);
      
      // Tạo session
      const session: ShopSession = {
        shop,
        accessToken,
        scope: SHOPIFY_AUTH_CONFIG.SCOPES,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
        shopName: shopInfo.name,
        shopDomain: shop,
        email: shopInfo.email
      };

      // Lưu session
      shopifySessionService.saveSession(session);
      
      setStatus('success');
      
      // Redirect vào app sau 2 giây
      setTimeout(() => {
        navigate(`/?shop=${shop}`);
      }, 2000);

    } catch (err) {
      console.error('OAuth callback error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setStatus('error');
    }
  };

  const exchangeCodeForToken = async (shop: string, code: string): Promise<string> => {
    // Trong production, bạn cần backend để exchange code
    // Ở đây tôi sẽ simulate để demo
    console.log('Exchanging code for token...', { shop, code });
    
    // TODO: Implement real token exchange
    // const response = await fetch('/api/shopify/exchange-token', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ shop, code })
    // });
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock token (trong thực tế sẽ lấy từ Shopify)
    return 'mock_access_token_' + Date.now();
  };

  const getShopInfo = async (shop: string, accessToken: string) => {
    // TODO: Implement real shop info fetch
    // const response = await fetch(`https://${shop}/admin/api/2025-01/shop.json`, {
    //   headers: { 'X-Shopify-Access-Token': accessToken }
    // });
    
    // Return mock data
    return {
      name: shop.replace('.myshopify.com', ''),
      email: 'admin@example.com'
    };
  };

  if (status === 'processing') {
    return (
      <Page title="Installing App">
        <Layout>
          <Layout.Section>
            <Card>
              <div style={{ 
                padding: '48px', 
                textAlign: 'center' 
              }}>
                <Spinner size="large" />
                <h2 style={{ 
                  margin: '24px 0 16px 0', 
                  fontSize: '20px', 
                  fontWeight: '600' 
                }}>
                  Installing AI Blog Generator...
                </h2>
                <p style={{ 
                  margin: '0', 
                  color: '#6d7175' 
                }}>
                  Please wait while we set up your app
                </p>
              </div>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  if (status === 'error') {
    return (
      <Page title="Installation Failed">
        <Layout>
          <Layout.Section>
            <Card>
              <div style={{ 
                padding: '48px', 
                textAlign: 'center' 
              }}>
                <div style={{ 
                  fontSize: '48px', 
                  marginBottom: '16px' 
                }}>
                  ❌
                </div>
                <h2 style={{ 
                  margin: '0 0 16px 0', 
                  fontSize: '20px', 
                  fontWeight: '600',
                  color: '#d82c0d'
                }}>
                  Installation Failed
                </h2>
                <p style={{ 
                  margin: '0 0 24px 0', 
                  color: '#6d7175' 
                }}>
                  {error}
                </p>
                <button
                  onClick={() => window.location.href = '/auth'}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#008060',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Try Again
                </button>
              </div>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <Page title="Installation Successful">
      <Layout>
        <Layout.Section>
          <Card>
            <div style={{ 
              padding: '48px', 
              textAlign: 'center' 
            }}>
              <div style={{ 
                fontSize: '48px', 
                marginBottom: '16px' 
              }}>
                ✅
              </div>
              <h2 style={{ 
                margin: '0 0 16px 0', 
                fontSize: '20px', 
                fontWeight: '600',
                color: '#50b83c'
              }}>
                Installation Successful!
              </h2>
              <p style={{ 
                margin: '0', 
                color: '#6d7175' 
              }}>
                Redirecting to your app...
              </p>
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default AuthCallback;
