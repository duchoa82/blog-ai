# 🏠 Local Development Guide

## 🚀 Quick Start

### 1. Start Development Server
```bash
npm run dev
```

### 2. Open Your Browser
Navigate to: `http://localhost:5173`

## 🎯 What You'll See

### **Shopify Admin Simulation**
- ✅ **Shopify Admin Header** - Green Shopify logo and navigation
- ✅ **Admin Navigation** - Home, Orders, Products, Customers, Analytics, Apps
- ✅ **App Integration** - Your app appears as "Blog SEO AI" in the Apps section
- ✅ **Development Badge** - Shows "Development Store" indicator

### **Your App Interface**
- ✅ **Dashboard** - Main app landing page
- ✅ **Blog Generation** - Your blog creation interface
- ✅ **Settings** - App configuration
- ✅ **Product Selection** - Product management

## 🔧 Development Features

### **Mock Data**
- ✅ **Shopify Images** - Mock image library with placeholder images
- ✅ **Shopify Blogs** - Mock blogs (News, Fashion, Lifestyle)
- ✅ **Realistic Delays** - Simulated API response times
- ✅ **Console Logging** - Development logs with 🔧 prefix

### **Testing Scenarios**

#### **1. Test Image Library**
1. Go to Blog Generation page
2. Click "Select from library" in Featured Image section
3. You'll see mock Shopify images
4. Click any image to select it
5. Image should appear in both left sidebar and right preview

#### **2. Test Blog Creation**
1. Fill out the blog form
2. Click "Generate" button
3. Blog content creation modal should open
4. Test all the features we built:
   - Image upload/selection
   - SEO settings
   - Content preview
   - Publish functionality

#### **3. Test Responsive Design**
1. Resize browser window
2. Test on different screen sizes
3. Verify mobile responsiveness

## 🐛 Debugging

### **Console Logs**
Open browser DevTools (F12) and look for:
```
🔧 [DEV] Using mock Shopify images for development
🔧 [DEV] Using mock Shopify blogs for development
```

### **Network Tab**
- Check for any failed API calls
- Verify mock data is being used
- No real Shopify API calls in development

### **Common Issues**

#### **1. Images Not Loading**
- Check if placeholder URLs are accessible
- Verify image components are rendering
- Check console for errors

#### **2. Modal Not Opening**
- Check if BlogContentCreation component is imported
- Verify modal state management
- Check for JavaScript errors

#### **3. Styling Issues**
- Verify Polaris CSS is loading
- Check for CSS conflicts
- Ensure proper component imports

## 🔄 Development Workflow

### **1. Make Changes**
- Edit any component files
- Save changes
- Browser should auto-reload

### **2. Test Features**
- Test all user interactions
- Verify data flow
- Check UI responsiveness

### **3. Debug Issues**
- Use browser DevTools
- Check console logs
- Verify component state

## 🚀 Next Steps

### **When Ready for Shopify Integration:**
1. **Create Shopify App** in Partner Dashboard
2. **Get API Credentials** (key & secret)
3. **Update .env file** with real credentials
4. **Test with Real Shopify Store**

### **Production Deployment:**
1. **Build the app**: `npm run build`
2. **Deploy to hosting** (Vercel, Netlify, etc.)
3. **Update Shopify app URLs**
4. **Submit for review** (if public app)

## 📝 Notes

- **Development Mode Only**: The Shopify admin wrapper only appears in development
- **Production Ready**: In production, your app will be embedded in real Shopify admin
- **Mock Data**: All Shopify API calls use mock data locally
- **Real Integration**: Switch to real Shopify API by updating environment variables

## 🆘 Need Help?

1. **Check this guide** for common issues
2. **Review console logs** for error messages
3. **Verify file structure** matches the setup
4. **Test step by step** following the scenarios above

Happy coding! 🎉
