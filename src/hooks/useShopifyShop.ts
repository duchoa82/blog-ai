import { useState, useEffect } from 'react';
import { useAppBridge } from '@shopify/app-bridge-react';

export const useShopifyShop = () => {
  const [shop, setShop] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const app = useAppBridge();

  useEffect(() => {
    const detectShop = async () => {
      try {
        // Try to get shop from App Bridge first
        if (app && app.config && app.config.host) {
          const host = app.config.host;
          if (host.includes('myshopify.com')) {
            setShop(host);
            setLoading(false);
            return;
          }
        }

        // Fallback to URL parameters
        const urlShop = new URLSearchParams(window.location.search).get('shop');
        if (urlShop) {
          setShop(urlShop);
          setLoading(false);
          return;
        }

        // Fallback to hostname
        const hostname = window.location.hostname;
        if (hostname.includes('myshopify.com')) {
          setShop(hostname);
          setLoading(false);
          return;
        }

        // Development fallback
        if (import.meta.env.DEV) {
          setShop('localhost:5175');
          setLoading(false);
          return;
        }

        setShop(null);
        setLoading(false);
      } catch (error) {
        console.error('Error detecting shop:', error);
        setShop(null);
        setLoading(false);
      }
    };

    detectShop();
  }, [app]);

  return { shop, loading };
};
