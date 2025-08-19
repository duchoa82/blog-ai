import React, { useEffect, useState } from 'react';
import { AppBridgeProvider, useAppBridge, TitleBar } from '@shopify/app-bridge-react';
import { Provider as PolarisProvider } from '@shopify/polaris';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@shopify/polaris/build/esm/styles.css';

// Import pages
import DashboardPage from './pages/DashboardPage';
import TemplatesPage from './pages/TemplatesPage';
import SettingsPage from './pages/SettingsPage';

// ✅ App Bridge configuration với host parameter
const config = {
  apiKey: import.meta.env.VITE_SHOPIFY_API_KEY || '98d5cae75b3fdce1011668a7b6bdc8e2',
  host: new URLSearchParams(window.location.search).get('host') || '',
  forceRedirect: true,
  isEmbedded: true,
};

function AppContent() {
  const app = useAppBridge();
  const [shopInfo, setShopInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy shop và host từ URL parameters
    const params = new URLSearchParams(window.location.search);
    const shop = params.get('shop');
    const host = params.get('host');

    if (shop && host) {
      setShopInfo({ shop, host });
      console.log('✅ App Bridge initialized with:', { shop, host });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (app && shopInfo) {
      console.log('🚀 Setting up App Bridge navigation...');
      
      try {
        // Set up top bar
        app.dispatch(
          app.actions.Navigation.setTopBar({
            title: 'ENIPA AI Blog Writing Assist',
            buttons: {
              primary: {
                label: 'Create Template',
                onClick: () => {
                  console.log('Create Template clicked');
                },
              },
            },
          })
        );
        console.log('✅ Top bar set successfully');

        // Set up navigation menu (sidebar) - Giống hệt ui-nav-menu
        app.dispatch(
          app.actions.Navigation.setMenu({
            items: [
              {
                label: 'Home',
                destination: '/',
              },
              {
                label: 'Templates',
                destination: '/templates',
              },
              {
                label: 'Settings',
                destination: '/settings',
              },
            ],
          })
        );
        console.log('✅ Navigation menu set successfully');

      } catch (error) {
        console.error('❌ Failed to set up navigation:', error);
      }
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
                <p>Setting up Blog AI navigation...</p>
              </TextContainer>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <>
      {/* ✅ TitleBar để hiện title trong Shopify Admin */}
      <TitleBar title="ENIPA AI Blog Writing Assist" />
      
      {/* React Router for navigation */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardPage shopInfo={shopInfo} />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </BrowserRouter>
    </>
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
