import { Outlet } from "react-router-dom";
import { NavMenu } from '@shopify/app-bridge-react';
import { useAppBridge } from '@shopify/app-bridge-react';
import "./ShopifyLayout.css";

const ShopifyLayout = () => {
  const app = useAppBridge();

  console.log('🚀 ShopifyLayout component loaded with App Bridge React!');
  console.log('🔍 App Bridge app:', app);

  return (
    <div className="shopify-layout">
      {/* Shopify App Bridge React Navigation Menu */}
      <NavMenu>
        <a href="/" rel="home">Dashboard</a>
        <a href="/blogs">Blogs</a>
        <a href="/pricing">Pricing</a>
        <a href="/settings">Settings</a>
      </NavMenu>

      {/* Main Content Area */}
      <div className="shopify-main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default ShopifyLayout;
