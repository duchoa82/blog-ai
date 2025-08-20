import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Context, useAppBridge } from '@shopify/app-bridge-react';
import Navigation from './components/layout/Navigation';
import DashboardPage from './pages/DashboardPage';
import BlogGenerationPage from './pages/BlogGenerationPage';
import TemplatesPage from './pages/TemplatesPage';
import PricingPage from './pages/PricingPage';
import SettingsPage from './pages/SettingsPage';

// ✅ App Bridge configuration cho production
const getAppBridgeConfig = () => {
  const params = new URLSearchParams(window.location.search);
  const shop = params.get('shop');
  const host = params.get('host');
  
  // Nếu không có shop parameter (development), sử dụng mock values
  if (!shop || !host) {
    console.log('🔧 Development mode: Using mock shop configuration');
    return {
      apiKey: import.meta.env.VITE_SHOPIFY_API_KEY || '98d5cae75b3fdce1011668a7b6bdc8e2',
      host: 'mock-host',
      forceRedirect: false,
      isEmbedded: false,
    };
  }
  
  // Production mode với real shop
  console.log('🚀 Production mode: Using real Shopify configuration');
  return {
    apiKey: import.meta.env.VITE_SHOPIFY_API_KEY || '98d5cae75b3fdce1011668a7b6bdc8e2',
    host: host,
    forceRedirect: true,
    isEmbedded: true,
  };
};

// Custom App Bridge Provider cho version 3.7.10
function AppBridgeProvider({ children, config }: { children: React.ReactNode; config: any }) {
  const [app, setApp] = useState<any>(null);

  useEffect(() => {
    if (config.host && config.host !== 'mock-host') {
      // Import App Bridge client dynamically
      import('@shopify/app-bridge/client').then(({ createApp }) => {
        const appBridge = createApp(config);
        setApp(appBridge);
        console.log('✅ App Bridge client created:', appBridge);
      }).catch(error => {
        console.error('❌ Failed to create App Bridge client:', error);
      });
    }
  }, [config]);

  // Show loading while App Bridge initializes
  if (!app && config.host !== 'mock-host') {
    return (
      <div>
        <ui-title-bar title="Initializing..."></ui-title-bar>
        <ui-layout>
          <ui-layout-section>
            <ui-card>
              <ui-text variant="heading">Initializing App Bridge...</ui-text>
              <p>Setting up Shopify integration...</p>
            </ui-card>
          </ui-layout-section>
        </ui-layout>
      </div>
    );
  }

  return (
    <Context.Provider value={app}>
      {children}
    </Context.Provider>
  );
}

function AppContent() {
  const [shopInfo, setShopInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy shop và host từ URL parameters
    const params = new URLSearchParams(window.location.search);
    const shop = params.get('shop');
    const host = params.get('host');

    if (shop && host) {
      setShopInfo({ shop, host, isDevelopment: false });
      console.log('✅ App Bridge initialized with:', { shop, host });
    } else {
      // Development mode - set mock shop info
      setShopInfo({ 
        shop: 'dev-shop.myshopify.com', 
        host: 'mock-host',
        isDevelopment: true 
      });
      console.log('🔧 Development mode: Using mock shop info');
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div>
        <ui-title-bar title="Loading..."></ui-title-bar>
        <ui-layout>
          <ui-layout-section>
            <ui-card>
              <ui-text variant="heading">Loading...</ui-text>
              <p>Setting up Blog AI navigation...</p>
            </ui-card>
          </ui-layout-section>
        </ui-layout>
      </div>
    );
  }

  return (
    <>
      {/* Navigation sidebar */}
      <Navigation />
      
      {/* Main content area */}
      <div className="main-content">
        {/* React Router for navigation */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<DashboardPage shopInfo={shopInfo} />} />
            <Route path="/generate" element={<BlogGenerationPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

function App() {
  const config = getAppBridgeConfig();
  
  // 🔧 Development mode: Skip App Bridge wrapper
  if (!config.host || config.host === 'mock-host') {
    console.log('🔧 Development mode: Running without App Bridge wrapper');
    return <AppContent />;
  }
  
  // 🚀 Production mode: Wrap with App Bridge
  console.log('🚀 Production mode: Wrapping with App Bridge');
  return (
    <AppBridgeProvider config={config}>
      <AppContent />
    </AppBridgeProvider>
  );
}

export default App;
