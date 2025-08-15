/// <reference types="vite/client" />

// Shopify UI Components
declare namespace JSX {
  interface IntrinsicElements {
    'ui-nav-menu': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  }
}

// Shopify Window Object
declare global {
  interface Window {
    shopify?: {
      config?: {
        navigation?: {
          setNavigationItems: (items: Array<{ label: string; destination: string }>) => void;
        };
      };
    };
  }
}
