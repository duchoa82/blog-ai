# 🚀 Shopify App Setup Guide

## 📋 Prerequisites

1. **Shopify Partner Account** - Sign up at [partners.shopify.com](https://partners.shopify.com)
2. **Development Store** - Create a development store in your partner account
3. **Node.js** - Version 16 or higher
4. **Git** - For version control

## 🔧 Step 1: Create Shopify App

### 1.1 Create App in Partner Dashboard
1. Go to [partners.shopify.com](https://partners.shopify.com)
2. Click "Apps" → "Create app"
3. Choose "Custom app" or "Public app"
4. Fill in app details:
   - **App name**: Blog SEO AI
   - **App URL**: `http://localhost:5173` (for development)
   - **Allowed redirection URLs**: `http://localhost:5173/auth/callback`

### 1.2 Configure App Scopes
Add these scopes to your app:
```
read_products, write_products
read_assets, write_assets
read_blogs, write_blogs
read_articles, write_articles
read_metafields, write_metafields
```

### 1.3 Get API Credentials
1. Go to "App setup" → "Admin API integration"
2. Copy your **API key** and **API secret key**
3. Save these securely

## 🔧 Step 2: Environment Setup

### 2.1 Create Environment File
```bash
cp env.example .env
```

### 2.2 Configure Environment Variables
Edit `.env` file:
```env
VITE_SHOPIFY_API_KEY=your_actual_api_key
VITE_SHOPIFY_API_SECRET=your_actual_api_secret
VITE_SHOPIFY_SCOPES=read_products,write_products,read_assets,write_assets,read_blogs,write_blogs,read_articles,write_articles
VITE_APP_URL=http://localhost:5173
VITE_SHOPIFY_API_VERSION=2023-10
```

## 🔧 Step 3: Install Dependencies

```bash
npm install
```

## 🔧 Step 4: Start Development Server

```bash
npm run dev
```

## 🔧 Step 5: Install App on Development Store

### 5.1 Generate Installation URL
Your app installation URL will be:
```
https://your-dev-store.myshopify.com/admin/oauth/authorize?client_id=YOUR_API_KEY&scope=YOUR_SCOPES&redirect_uri=YOUR_REDIRECT_URI
```

### 5.2 Install App
1. Visit the installation URL
2. Click "Install app"
3. Authorize the requested permissions

## 🔧 Step 6: Test the App

### 6.1 Test Image Library
1. Upload some images to your Shopify store
2. Open the app and click "Select from library"
3. Verify that your Shopify images appear

### 6.2 Test Blog Creation
1. Create a blog post using the app
2. Verify it appears in your Shopify admin
3. Check that SEO settings are applied

## 🔧 Step 7: Production Deployment

### 7.1 Update App URLs
For production, update your app URLs:
- **App URL**: `https://your-domain.com`
- **Allowed redirection URLs**: `https://your-domain.com/auth/callback`

### 7.2 Deploy to Hosting
Deploy your app to a hosting service like:
- Vercel
- Netlify
- Heroku
- AWS

### 7.3 Update Environment Variables
Set production environment variables in your hosting platform.

## 🔧 Step 8: Submit for Review (Public Apps)

If creating a public app:
1. Complete app testing
2. Prepare app listing materials
3. Submit for Shopify review
4. Wait for approval

## 🐛 Troubleshooting

### Common Issues

#### 1. CORS Errors
- Ensure your app URL is correctly configured
- Check that redirect URLs match exactly

#### 2. API Authentication Errors
- Verify API key and secret are correct
- Check that scopes are properly configured
- Ensure app is installed on the store

#### 3. Image Loading Issues
- Check that assets API scope is enabled
- Verify store has images uploaded
- Check network requests in browser dev tools

### Debug Mode
Enable debug logging by adding to your `.env`:
```env
VITE_DEBUG=true
```

## 📚 Additional Resources

- [Shopify App Development Documentation](https://shopify.dev/apps)
- [Shopify Admin API Reference](https://shopify.dev/api/admin)
- [Shopify App Bridge Documentation](https://shopify.dev/apps/tools/app-bridge)
- [Polaris Design System](https://polaris.shopify.com/)

## 🤝 Support

For issues specific to this app:
1. Check the troubleshooting section above
2. Review Shopify's official documentation
3. Create an issue in the project repository

For Shopify platform issues:
- [Shopify Community](https://community.shopify.com/)
- [Shopify Support](https://help.shopify.com/)
