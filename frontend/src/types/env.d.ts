/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SHOPIFY_API_KEY: string
  readonly VITE_SHOPIFY_SHOP_DOMAIN: string
  readonly VITE_APP_URL: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
