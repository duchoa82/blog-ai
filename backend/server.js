import express from "express";
import session from "express-session";
import { shopifyApp } from "@shopify/shopify-app-express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Session middleware
app.use(session({ 
  secret: process.env.SESSION_SECRET || "app-secret", 
  saveUninitialized: false, 
  resave: false 
}));

// Shopify app configuration
const shopify = shopifyApp({
  api: {
    apiKey: process.env.SHOPIFY_API_KEY,
    apiSecretKey: process.env.SHOPIFY_API_SECRET,
    scopes: ["read_products", "write_products", "read_orders", "write_orders"],
    hostName: process.env.HOST?.replace(/https:\/\//, "") || "localhost:3000",
  },
  auth: {
    path: "/auth",
    callbackPath: "/auth/callback",
  },
  webhooks: {
    path: "/webhooks",
  },
});

// OAuth routes
app.use("/auth", shopify.auth.begin());
app.use("/auth/callback", shopify.auth.callback());

// Custom redirect after OAuth
app.get("/auth/callback", async (req, res) => {
  try {
    // OAuth callback đã được xử lý bởi shopify.auth.callback()
    // Bây giờ redirect về app với host parameter
    const { shop, host } = req.query;
    
    if (shop && host) {
      // Redirect về embedded app trong Shopify Admin
      const storeName = shop.replace('.myshopify.com', '');
      const adminUrl = `https://admin.shopify.com/store/${storeName}/apps/enipa-ai-blog-writing-assist?host=${encodeURIComponent(host)}&shop=${encodeURIComponent(shop)}`;
      
      console.log(`🔄 Redirecting to: ${adminUrl}`);
      return res.redirect(adminUrl);
    } else {
      // Fallback redirect
      res.redirect('/app');
    }
  } catch (error) {
    console.error('❌ OAuth redirect failed:', error);
    res.redirect('/app');
  }
});

// Webhook verification
app.post("/webhooks", express.raw({ type: "application/json" }), shopify.webhooks.process());

// Serve static files from frontend dist
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Main app route - ensure shop is installed
app.use("/app", shopify.ensureInstalledOnShop(), (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Health check for Railway
app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Catch-all route for SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
  console.log(`🔗 OAuth path: /auth`);
  console.log(`🔗 App path: /app`);
  console.log(`🔗 Health check: /healthz`);
});
