import { Outlet } from "react-router-dom";
import { Frame } from "@shopify/polaris";
import { Sidebar } from "./Sidebar";

const AppLayout = () => {
  return (
    <Frame navigation={<Sidebar />}>
      <Outlet />
    </Frame>
  );
};

export default AppLayout;