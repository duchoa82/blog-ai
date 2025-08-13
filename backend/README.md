# Enipa AI Blog Generator - Backend

This is the backend server for the Enipa AI Blog Generator Shopify app.

## Features

- **Shopify OAuth Integration** - Secure authentication with Shopify stores
- **Blog Generation API** - AI-powered blog content generation using Google Gemini
- **Shopify API Integration** - Fetch products, blogs, and create articles
- **RESTful API** - Clean endpoints for frontend integration

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Shopify Partner account
- Google Gemini API key

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure your variables:

```bash
cp env.example .env
```

Edit `.env` with your actual values:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Shopify App Configuration
SHOPIFY_API_KEY=your_shopify_api_key_here
SHOPIFY_API_SECRET=your_shopify_api_secret_here
SHOPIFY_SCOPES=read_products,write_products,read_content,write_content
SHOPIFY_APP_URL=https://your-app-domain.com

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Session Secret
SESSION_SECRET=your_session_secret_here
```

### 3. Shopify App Setup

1. Go to [Shopify Partners](https://partners.shopify.com)
2. Create a new app
3. Set App URL to your backend URL
4. Add OAuth redirect URLs
5. Copy API key and secret to your `.env` file

### 4. Run the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on port 3001 (or the port specified in your `.env` file).

## API Endpoints

### Health Check
- `GET /health` - Server status

### Shopify OAuth
- `GET /auth/shopify?shop={shop}` - Generate OAuth URL
- `GET /auth/shopify/callback` - Handle OAuth callback

### Shopify API
- `GET /api/shopify/products?shop={shop}&accessToken={token}` - Get shop products
- `GET /api/shopify/blogs?shop={shop}&accessToken={token}` - Get shop blogs
- `POST /api/shopify/articles` - Create blog article

### Blog Generation
- `POST /api/generate-blog` - Generate blog content using AI

## Development

### Project Structure

```
backend/
├── server.js          # Main server file
├── shopify.js         # Shopify integration service
├── package.json       # Dependencies and scripts
├── .env              # Environment variables
└── README.md         # This file
```

### Adding New Features

1. **New API endpoints**: Add to `server.js`
2. **Shopify functionality**: Extend `shopify.js`
3. **Middleware**: Add to the middleware section in `server.js`

### Testing

Test the API endpoints using tools like:
- Postman
- Insomnia
- curl commands

Example health check:
```bash
curl http://localhost:3001/health
```

## Production Deployment

### Environment Variables
- Set `NODE_ENV=production`
- Use strong `SESSION_SECRET`
- Configure proper `SHOPIFY_APP_URL`

### Security
- Enable HTTPS
- Set up proper CORS origins
- Use environment-specific API keys

### Monitoring
- Add logging (Winston, Bunyan)
- Set up error tracking (Sentry)
- Monitor API rate limits

## Troubleshooting

### Common Issues

1. **CORS errors**: Check `FRONTEND_URL` in `.env`
2. **Shopify OAuth fails**: Verify API key/secret and redirect URLs
3. **Port conflicts**: Change `PORT` in `.env`

### Debug Mode

Enable detailed logging by setting:
```env
NODE_ENV=development
```

## Support

For issues and questions:
1. Check the logs in your terminal
2. Verify environment configuration
3. Test individual API endpoints
4. Check Shopify Partner dashboard for app status
