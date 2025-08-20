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
        <div style={{ display: 'flex', height: '100vh' }}>
          {/* Sidebar Navigation */}
          <div
            style={{
              width: '240px',
              borderRight: '1px solid #e1e3e5',
              padding: '8px 0',
              background: '#202223',
              color: 'white',
            }}
          >
            <div style={{ padding: '20px 0' }}>
              <div style={{ padding: '12px 24px', fontSize: '16px', fontWeight: 'bold', marginBottom: '20px' }}>
                Blog AI
              </div>
              <nav>
                <a href="/" style={{ display: 'block', padding: '12px 24px', color: 'white', textDecoration: 'none' }}>
                  Dashboard
                </a>
                <a href="/generate" style={{ display: 'block', padding: '12px 24px', color: 'white', textDecoration: 'none' }}>
                  Generate
                </a>
                <a href="/templates" style={{ display: 'block', padding: '12px 24px', color: 'white', textDecoration: 'none' }}>
                  Templates
                </a>
                <a href="/pricing" style={{ display: 'block', padding: '12px 24px', color: 'white', textDecoration: 'none' }}>
                  Pricing
                </a>
                <a href="/settings" style={{ display: 'block', padding: '12px 24px', color: 'white', textDecoration: 'none' }}>
                  Settings
                </a>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            <Routes>
              <Route path="/" element={<DashboardPage shopInfo={{ isDevelopment: true }} />} />
              <Route path="/generate" element={<BlogGenerationPage />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
