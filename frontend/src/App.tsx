import React, { useEffect, useState } from 'react';
import { AppBridgeProvider, useAppBridge } from '@shopify/app-bridge-react';
import { Provider as PolarisProvider, Page, Layout, Card, Button, TextContainer, Heading } from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';

// App Bridge configuration
const config = {
  apiKey: import.meta.env.VITE_SHOPIFY_API_KEY || '98d5cae75b3fdce1011668a7b6bdc8e2',
  host: new URLSearchParams(window.location.search).get('host') || '',
  forceRedirect: true,
};

function AppContent() {
  const app = useAppBridge();
  const [shopInfo, setShopInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get shop info from URL params
    const params = new URLSearchParams(window.location.search);
    const shop = params.get('shop');
    const host = params.get('host');

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
