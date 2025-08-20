import React from 'react';
import { AppProvider } from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppBridgeProvider } from "@shopify/app-bridge-react";

import Navigation from "./components/layout/Navigation";
import DashboardPage from "./pages/DashboardPage";
import BlogGenerationPage from "./pages/BlogGenerationPage";
import TemplatesPage from "./pages/TemplatesPage";
import PricingPage from "./pages/PricingPage";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  return (
    <AppProvider i18n={enTranslations}>
      <AppBridgeProvider>
        <BrowserRouter>
          <div style={{ display: "flex", height: "100vh" }}>
            {/* Sidebar Navigation */}
            <div
              style={{
                width: "240px",
                borderRight: "1px solid #e1e3e5",
                padding: "8px 0",
                background: "#fff",
              }}
            >
              <Navigation />
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, overflowY: "auto" }}>
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
      </AppBridgeProvider>
    </AppProvider>
  );
}
