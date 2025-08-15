import { Outlet } from "react-router-dom";
import "./ShopifyLayout.css";

const ShopifyLayout = () => {
  return (
    <div className="shopify-layout">
      {/* Simple Navigation */}
      <nav style={{ padding: '20px', backgroundColor: '#f6f6f7' }}>
        <a href="/" style={{ marginRight: '20px' }}>Dashboard</a>
        <a href="/blogs" style={{ marginRight: '20px' }}>Blogs</a>
        <a href="/pricing" style={{ marginRight: '20px' }}>Pricing</a>
        <a href="/settings">Settings</a>
      </nav>

      {/* Main Content Area */}
      <div className="shopify-main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default ShopifyLayout;
