import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@shopify/polaris';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import enTranslations from '@shopify/polaris/locales/en.json';

// Import components
import Dashboard from './pages/Dashboard';
import ProductSelection from './pages/ProductSelection';
import Blogs from './pages/Blogs';
import BlogGeneration from './pages/BlogGeneration';
import Pricing from './pages/Pricing';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import ShopifyLayout from './components/layout/ShopifyLayout';
import AppLayout from './components/layout/AppLayout';
import AuthSuccess from './pages/AuthSuccess';

// Create a client
const queryClient = new QueryClient();

// Check if app is running in Shopify admin
const isShopifyAdmin = () => {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;

  // Check for Shopify admin URLs
  return hostname.includes('myshopify.com') ||
         hostname.includes('shopify.com') ||
         pathname.includes('/admin/apps/') ||
         pathname.includes('/admin/oauth/') ||
         window.location.search.includes('shop=');
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider i18n={enTranslations}>
      <BrowserRouter>
        <Routes>
          {/* Use ShopifyLayout when in Shopify admin, AppLayout when standalone */}
          <Route path="/" element={isShopifyAdmin() ? <ShopifyLayout /> : <AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductSelection />} />
            <Route path="blogs" element={<Blogs />} />
            <Route path="generate" element={<BlogGeneration />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          {/* Auth success page (outside of layout) */}
          <Route path="auth-success" element={<AuthSuccess />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
