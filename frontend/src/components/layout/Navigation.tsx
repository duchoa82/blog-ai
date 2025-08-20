import React, { useEffect } from 'react';
import { useAppBridge } from '@shopify/app-bridge-react';

interface NavigationProps {
  shopInfo: any;
}

export default function Navigation({ shopInfo }: NavigationProps) {
  const app = useAppBridge();

  useEffect(() => {
    // 🔧 Development mode: Skip App Bridge navigation setup
    if (shopInfo?.isDevelopment || !app) {
      console.log('🔧 Development mode: Skipping App Bridge navigation setup');
      return;
    }

    // 🚀 Production mode: Set up App Bridge navigation
    try {
      console.log('🚀 Setting up App Bridge navigation...');
      
      // Note: App Bridge v3 doesn't have setMenu/setTopBar actions
      // Navigation is handled by Shopify Admin automatically
      console.log('✅ App Bridge v3: Navigation handled by Shopify Admin');
      
    } catch (error) {
      console.error('❌ Failed to set up navigation:', error);
    }
  }, [app, shopInfo]);

  // 🔧 Development mode: Show simple navigation header
  if (shopInfo?.isDevelopment || !app) {
    return (
      <div>
        {/* Simple navigation header for development */}
        <ui-title-bar title="ENIPA AI Blog Writing Assist">
          <ui-button variant="secondary" onClick={() => window.location.href = '/'}>
            Dashboard
          </ui-button>
          <ui-button variant="secondary" onClick={() => window.location.href = '/generate'}>
            Generate
          </ui-button>
          <ui-button variant="secondary" onClick={() => window.location.href = '/templates'}>
            Templates
          </ui-button>
          <ui-button variant="secondary" onClick={() => window.location.href = '/pricing'}>
            Pricing
          </ui-button>
          <ui-button variant="secondary" onClick={() => window.location.href = '/settings'}>
            Settings
          </ui-button>
        </ui-title-bar>
      </div>
    );
  }

  // 🚀 Production mode: Return null (Shopify Admin handles navigation)
  return null;
}
