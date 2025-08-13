import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Frame, Navigation } from "@shopify/polaris";
import "./ShopifyLayout.css";

const ShopifyLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: "Dashboard", href: "/" },
    { name: "Blogs", href: "/blogs" },
    { name: "Pricing", href: "/pricing" },
    { name: "Settings", href: "/settings" },
  ];

  const handleNavigation = (url: string) => {
    navigate(url);
  };

  const navigationMarkup = (
    <Navigation location={location.pathname}>
      <Navigation.Section
        items={navigation.map((item) => ({
          url: item.href,
          label: item.name,
          onClick: () => handleNavigation(item.href),
        }))}
      />
    </Navigation>
  );

  return (
    <div className="shopify-layout">
      {/* Use the same Frame + Navigation structure as local app */}
      <Frame navigation={navigationMarkup}>
        <div className="shopify-main-content">
          <Outlet />
        </div>
      </Frame>
    </div>
  );
};

export default ShopifyLayout;
