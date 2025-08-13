# Blog SEO AI - Shopify App

A modern Shopify app for AI-powered blog content generation, built with Shopify Polaris design system.

## Project Overview

This application helps Shopify store owners generate SEO-optimized blog content for their products using AI. The app features:

- **Dashboard**: Overview of blog performance and recent posts
- **Product Selection**: Choose products to generate content for
- **Blog Generation**: AI-powered content creation with SEO optimization
- **Settings**: Configure AI preferences and API integrations

## Technologies Used

This project is built with:

- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript
- **Shopify Polaris** - Official Shopify design system and component library
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **React Query** - Data fetching and state management

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Shopify Partner account (for app development)

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd blog-seo-ai-main
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   └── layout/
│       ├── AppLayout.tsx      # Main app layout with Polaris Frame
│       └── Sidebar.tsx        # Navigation sidebar
├── pages/
│   ├── Dashboard.tsx          # Main dashboard with stats and recent posts
│   ├── ProductSelection.tsx   # Product selection interface
│   ├── BlogGeneration.tsx     # AI content generation
│   ├── Settings.tsx           # App configuration
│   └── NotFound.tsx           # 404 page
├── App.tsx                    # Main app component with routing
└── main.tsx                   # App entry point
```

## Key Features

### 🎨 Shopify Polaris Design System
- Consistent with Shopify's design language
- Accessible and responsive components
- Professional UI/UX experience

### 📊 Dashboard
- Real-time statistics and metrics
- Recent blog posts overview
- Quick action buttons

### 🛍️ Product Selection
- Grid layout for product browsing
- Search and filtering capabilities
- Product details and ratings

### 🤖 AI Content Generation
- SEO-optimized content creation
- Customizable writing styles
- Keyword targeting and optimization

### ⚙️ Settings
- API configuration (OpenAI, Shopify)
- Default content preferences
- Blog post templates

## Development

### Adding New Pages

1. Create a new page component in `src/pages/`
2. Use Polaris components for consistent styling
3. Add the route in `src/App.tsx`
4. Update navigation in `src/components/layout/Sidebar.tsx`

### Styling Guidelines

- Use Polaris components whenever possible
- Follow Polaris design patterns and spacing
- Maintain consistency with Shopify's design system

### Component Structure

```tsx
import { Page, Card, Layout, Stack } from "@shopify/polaris";

const MyPage = () => {
  return (
    <Page title="Page Title" subtitle="Page description">
      <Layout>
        <Layout.Section>
          <Card>
            <Card.Section>
              {/* Content */}
            </Card.Section>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};
```

## Deployment

### For Shopify App Development

1. Build the app for production:
```bash
npm run build
```

2. Follow Shopify's app development guidelines for deployment
3. Configure your app in the Shopify Partner dashboard

### For General Web Deployment

1. Build the app:
```bash
npm run build
```

2. Deploy the `dist` folder to your preferred hosting service

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Check the [Shopify Polaris documentation](https://polaris.shopify.com/)
- Review the [React documentation](https://react.dev/)
- Open an issue in this repository
