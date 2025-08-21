import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';

import DashboardPage from './pages/DashboardPage';
import BlogGenerationPage from './pages/BlogGenerationPage';
import TemplatesPage from './pages/TemplatesPage';
import PricingPage from './pages/PricingPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <AppProvider i18n={enTranslations}>
      <BrowserRouter>
        {/* Navigation Menu */}
        <ui-nav-menu>
          <a href="/" rel="home">Dashboard</a>
          <a href="/generate">Blog Posts</a>
          <a href="/pricing">Pricing</a>
        </ui-nav-menu>

        {/* Main Content - giữ nguyên layout cũ */}
        <div className="main-content">
          <Routes>
            <Route path="/" element={<DashboardPage shopInfo={{ isDevelopment: true }} />} />
            <Route path="/generate" element={<BlogGenerationPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
