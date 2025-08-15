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
  const urlParams = new URLSearchParams(window.location.search);
  const shop = urlParams.get('shop');

  // Check for Shopify admin URLs or shop parameter
  return hostname.includes('myshopify.com') ||
         hostname.includes('shopify.com') ||
         pathname.includes('/admin/apps/') ||
         pathname.includes('/admin/oauth/') ||
         !!shop;
};

// Get shop domain from URL parameters
const getShopDomain = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('shop');
};

// Get Shopify API key from environment or use default
const getShopifyApiKey = () => {
  return import.meta.env.VITE_SHOPIFY_API_KEY || '98d5cae75b3fdce1011668a7b6bdc8e2';
};

const App = () => {
  const isAdmin = isShopifyAdmin();
  const shopDomain = getShopDomain();
  const apiKey = getShopifyApiKey();

  console.log('🔍 App initialization:', {
    isShopifyAdmin: isAdmin,
    shopDomain,
    apiKey: apiKey ? 'Present' : 'Missing'
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider i18n={enTranslations}>
        {isAdmin && shopDomain ? (
          // Use ShopifyLayout when in Shopify admin
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<ShopifyLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<ProductSelection />} />
                <Route path="blogs" element={<Blogs />} />
                <Route path="generate" element={<BlogGeneration />} />
                <Route path="pricing" element={<Pricing />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              <Route path="auth-success" element={<AuthSuccess />} />
              <Route path="*" element={<NotFound />} />
            </BrowserRouter>
          ) : (
          // Standalone app without App Bridge
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<ProductSelection />} />
                <Route path="blogs" element={<Blogs />} />
                <Route path="generate" element={<BlogGeneration />} />
                <Route path="pricing" element={<Pricing />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              <Route path="auth-success" element={<AuthSuccess />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        )}
      </AppProvider>
    </QueryClientProvider>
  );
};

export default App;
