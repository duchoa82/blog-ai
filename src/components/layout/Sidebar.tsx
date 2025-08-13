import { useLocation, useNavigate } from "react-router-dom";
import { Navigation } from "@shopify/polaris";
import { 
  HomeIcon,
  SettingsIcon,
  ContentIcon,
  ChartHistogramFlatIcon
} from "@shopify/polaris-icons";

const navigation = [
  { name: "Dashboard", href: "/", icon: HomeIcon },
  { name: "Blogs", href: "/blogs", icon: ContentIcon },
  { name: "Pricing", href: "/pricing", icon: ChartHistogramFlatIcon },
  { name: "Settings", href: "/settings", icon: SettingsIcon },
];

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (url: string) => {
    navigate(url);
  };

  const navigationMarkup = (
    <Navigation location={location.pathname}>
      <Navigation.Section
        items={navigation.map((item) => ({
          url: item.href,
          label: item.name,
          icon: item.icon,
          onClick: () => handleNavigation(item.href),
        }))}
      />
    </Navigation>
  );

  return navigationMarkup;
};