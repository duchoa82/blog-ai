import React, { useEffect, useState } from 'react';
import { AppBridgeProvider, useAppBridge } from '@shopify/app-bridge-react';
import { Provider as PolarisProvider, Page, Layout, Card, Button, TextContainer, Heading } from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';

// ✅ FIX: App Bridge configuration với isEmbedded
const config = {
  apiKey: import.meta.env.VITE_SHOPIFY_API_KEY || '98d5cae75b3fdce1011668a7b6bdc8e2',
  host: new URLSearchParams(window.location.search).get('host') || '',
  forceRedirect: true,
  isEmbedded: true, // Bắt buộc để app chạy trong iframe
};

function AppContent() {
  const app = useAppBridge();
  const [shopInfo, setShopInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ FIX: Kiểm tra app có đang chạy trong Shopify Admin iframe không
    const params = new URLSearchParams(window.location.search);
    const shop = params.get('shop');
    const host = params.get('host');
    const hmac = params.get('hmac');

    // Nếu không có host/hmac → app đang mở ngoài iframe → redirect về Admin
    if (!host || !hmac) {
      console.log('⚠️ App opened outside iframe, redirecting to Shopify Admin...');
      const currentShop = shop || 'your-shop';
      const adminUrl = `https://admin.shopify.com/store/${currentShop.replace('.myshopify.com', '')}/apps/enipa-ai-blog-writing-assist`;
      window.location.href = adminUrl;
      return;
    }

    if (shop && host) {
      setShopInfo({ shop, host });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (app && shopInfo) {
      // Register navigation with Shopify Admin
      app.dispatch(
        app.actions.Navigation.setTopBar({
          title: 'Blog AI',
          buttons: {
            primary: {
              label: 'Create Post',
              onClick: () => {
                console.log('Create Post clicked');
              },
            },
          },
        })
      );

      // Set up navigation menu
      app.dispatch(
        app.actions.Navigation.setMenu({
          items: [
            {
              label: 'Dashboard',
              destination: '/',
            },
            {
              label: 'Blog Posts',
              destination: '/posts',
            },
            {
              label: 'Settings',
              destination: '/settings',
            },
          ],
        })
      );
    }
  }, [app, shopInfo]);

  if (loading) {
    return (
      <Page>
        <Layout>
          <Layout.Section>
            <Card>
              <TextContainer>
                <Heading>Loading...</Heading>
              </TextContainer>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <Page title="Blog AI Dashboard">
      <Layout>
        <Layout.Section>
          <Card>
            <TextContainer>
              <Heading>Welcome to Blog AI!</Heading>
              <p>Your AI-powered blog writing assistant for Shopify.</p>
              {shopInfo && (
                <div>
                  <p><strong>Shop:</strong> {shopInfo.shop}</p>
                  <p><strong>Host:</strong> {shopInfo.host}</p>
                </div>
              )}
            </TextContainer>
          </Card>
        </Layout.Section>
        
        <Layout.Section secondary>
          <Card>
            <TextContainer>
              <Heading>Quick Actions</Heading>
              <Button primary fullWidth>Create New Post</Button>
              <Button fullWidth style={{ marginTop: '1rem' }}>View Analytics</Button>
            </TextContainer>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

function App() {
  return (
    <PolarisProvider>
      <AppBridgeProvider config={config}>
        <AppContent />
      </AppBridgeProvider>
    </PolarisProvider>
  );
}

export default App;
