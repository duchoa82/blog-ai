# Blog AI Backend API

Shopify Backend API for Blog AI App with OAuth flow.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `env.example` to `.env` and fill in your values:
```bash
cp env.example .env
```

### 3. Start Server
```bash
npm start
```

## 🔑 OAuth Flow

### 1. Initiate OAuth
```
GET /auth/shopify?shop=your-shop.myshopify.com
```

### 2. Shopify Redirect
User will be redirected to Shopify for authorization.

### 3. OAuth Callback
```
GET /auth/shopify/callback
```

## 📡 API Endpoints

- `GET /` - API status
- `GET /healthz` - Health check
- `GET /test` - Test endpoint
- `GET /auth/shopify` - OAuth initiation
- `GET /auth/shopify/callback` - OAuth callback

## 🛠️ Tech Stack

- **Express.js** - Web framework
- **Shopify API v7.x** - Stable Shopify integration
- **MemorySessionStorage** - Simple session management
- **CORS** - Cross-origin support

## 🔧 Configuration

### Shopify App Setup
1. **App Scopes:** `read_products,write_products,read_blog,write_blog`
2. **Redirect URL:** `https://blog-ai-be.up.railway.app/auth/shopify/callback`
3. **API Version:** `2025-07`

### Environment Variables
- `SHOPIFY_API_KEY` - Your app API key
- `SHOPIFY_API_SECRET` - Your app secret
- `SHOPIFY_SCOPES` - App permissions
- `SHOPIFY_APP_URL` - Backend domain
- `FRONTEND_URL` - Frontend domain for CORS

## 🚀 Deployment

### Railway
1. Create new service: `blog-ai-be`
2. Connect GitHub repository
3. Set environment variables
4. Deploy!

## 📝 Next Steps

After OAuth flow works:
1. Add Redis session storage
2. Implement GraphQL Admin API endpoints
3. Implement Storefront API endpoints
4. Add rate limiting and error handling
