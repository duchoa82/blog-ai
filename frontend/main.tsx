import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './src/App.tsx';
import './index.css';
import '@shopify/polaris/build/esm/styles.css';

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);
root.render(<App />);
