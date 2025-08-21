# 🚀 Shopify Admin API Integration Setup Guide

## 📋 Overview

This project now uses the **official Shopify Admin API Client** instead of manual fetch calls. This provides:

- ✅ **Type-safe** GraphQL operations
- ✅ **Auto-retry** on rate limits
- ✅ **Better error handling** with detailed messages
- ✅ **Official Shopify** maintained code
- ✅ **GraphQL mutations** for blog operations

## 🛠️ Installation

The required packages are already installed:

```bash
npm install @shopify/admin-api-client
```

## ⚙️ Configuration

### 1. Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_SHOPIFY_STORE_DOMAIN=your-shop-name.myshopify.com
VITE_SHOPIFY_ACCESS_TOKEN=your-admin-api-access-token
VITE_SHOPIFY_API_VERSION=2025-01
```

### 2. Access Token Setup

To get your Admin API access token:

1. Go to your Shopify Admin → Apps → App and sales channel settings
2. Create a custom app or use an existing one
3. Configure Admin API access scopes:
   - `read_products` - to read product data
   - `write_products` - to create/update products
   - `read_content` - to read blog posts
   - `write_content` - to create/update blog posts
4. Install the app and copy the Admin API access token

## 🔧 Services Architecture

### Shopify Blog Service (`src/services/shopifyBlogService.ts`)

**Features:**
- Create, read, update, delete blog posts
- GraphQL mutations and queries
- Type-safe operations
- Error handling with user-friendly messages

**Usage:**
```typescript
import shopifyBlogService from '../services/shopifyBlogService';

// Initialize the service
shopifyBlogService.initialize(storeDomain, accessToken, apiVersion);

// Create a blog post
const blogData = {
  blog: {
    title: "My Blog Post",
    body_html: "<p>Blog content...</p>",
    published: true,
    handle: "my-blog-post",
    tags: "tag1, tag2"
  }
};

const response = await shopifyBlogService.createBlog(blogData);
```

### Shop Config Service (`src/services/shopConfigService.ts`)

**Features:**
- Manage shop configuration
- Test API connections
- Store credentials securely
- Validate store domains

**Usage:**
```typescript
import shopConfigService from '../services/shopConfigService';

// Save configuration
shopConfigService.saveConfig({
  storeDomain: 'your-shop.myshopify.com',
  accessToken: 'your-token',
  apiVersion: '2025-01'
});

// Test connection
const result = await shopConfigService.testConnection();
```

## 📝 Blog Operations

### Create Blog Post

```typescript
const blogData: BlogData = {
  blog: {
    title: "Summer T-Shirt Trends 2025",
    body_html: "<h2>Trending Styles...</h2>",
    published: true,
    handle: "summer-tshirt-trends-2025",
    tags: "fashion, trends, summer",
    meta_title: "SEO Title",
    meta_description: "SEO Description"
  }
};

const response = await shopifyBlogService.createBlog(blogData);
```

### Get All Blogs

```typescript
const blogs = await shopifyBlogService.getBlogs();
console.log(`Found ${blogs.blogs.length} blogs`);
```

### Update Blog

```typescript
const updates = {
  title: "Updated Title",
  published: false
};

const response = await shopifyBlogService.updateBlog(blogId, updates);
```

### Delete Blog

```typescript
const success = await shopifyBlogService.deleteBlog(blogId);
```

## 🎯 UI Integration

The `BlogGenerationPage` now includes:

1. **Shop Connection Status** - Shows connection health
2. **Auto-initialization** - Automatically sets up services
3. **Error Handling** - User-friendly error messages
4. **Loading States** - Visual feedback during operations

## 🔍 Error Handling

The service provides detailed error messages:

- **Validation Errors** - Field-specific error messages
- **Connection Errors** - Network and authentication issues
- **GraphQL Errors** - API response errors
- **User Errors** - Shopify-specific validation failures

## 🚨 Troubleshooting

### Common Issues

1. **"Shop not configured"**
   - Check environment variables
   - Verify access token permissions

2. **"Connection failed"**
   - Verify store domain format
   - Check access token validity
   - Ensure app is installed

3. **"Validation errors"**
   - Check required fields (title, body_html)
   - Verify handle format (no spaces, special chars)
   - Ensure content meets Shopify requirements

### Debug Mode

Enable console logging to see detailed API calls:

```typescript
// Check client configuration
const clientInfo = shopifyBlogService.getClientInfo();
console.log('Client config:', clientInfo);
```

## 🔄 Migration from Old Code

### Before (Manual Fetch)
```typescript
const response = await fetch('/admin/api/2025-01/blogs.json', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': accessToken
  },
  body: JSON.stringify(blogData)
});
```

### After (Admin API Client)
```typescript
const response = await shopifyBlogService.createBlog(blogData);
```

## 📚 Additional Resources

- [Shopify Admin API Reference](https://shopify.dev/docs/api/admin)
- [GraphQL Admin API](https://shopify.dev/docs/api/admin-graphql)
- [Blog API Endpoints](https://shopify.dev/docs/api/admin-rest/resources/blog)
- [Authentication Guide](https://shopify.dev/docs/apps/auth)

## 🎉 Benefits

- **Reliability** - Official Shopify client with auto-retry
- **Type Safety** - Full TypeScript support
- **Performance** - Optimized GraphQL operations
- **Maintenance** - Shopify maintains the client
- **Future-proof** - Always up-to-date with latest API versions
