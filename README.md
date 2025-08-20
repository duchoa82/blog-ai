# Blog SEO AI - Shopify App

Shopify app for AI-powered blog content creation and SEO optimization.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install
```

### 2. Environment Variables
Copy `env.example` to `.env` and fill in your values:
```bash
cp env.example .env
```

### 3. Start Development Server
```bash
# Start frontend development server
npm run dev

# Start production server
npm start
```

## 🏗️ Project Structure

```
blog-seo-ai-main/
├── frontend/                 # React + Vite frontend
│   ├── src/                 # Source code
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   └── App.tsx         # Main app component
│   ├── lib/                # Utilities and shared data
│   └── services/           # API services
├── docs/                   # Documentation files
├── scripts/                # Utility scripts
├── server-mock.js          # Simple production server
└── package.json            # Root package configuration
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Shopify Polaris** - Design system
- **Shopify App Bridge** - Shopify integration
- **React Router** - Navigation
- **React Query** - Data fetching

### Backend
- **Express.js** - Web framework
- **Node.js** - Runtime environment

## 🔧 Configuration

### Shopify App Setup
1. **App Scopes:** `read_products,write_products,read_blog,write_blog`
2. **Redirect URL:** Configure in your Shopify app settings
3. **API Version:** Latest stable version

### Environment Variables
- `VITE_SHOPIFY_API_KEY` - Your app API key
- `VITE_SHOPIFY_API_SECRET` - Your app secret

## 🚀 Deployment

### Railway
1. Connect GitHub repository
2. Set environment variables
3. Build Command: `npm install && npm run build`
4. Start Command: `npm run start`

## 📝 Features

- AI-powered blog content generation
- SEO optimization tools
- Shopify integration
- Modern React architecture
- TypeScript support
- Responsive design

## 🔍 Development

- `npm run dev` - Start frontend development server
- `npm run build` - Build frontend for production
- `npm start` - Start production server
