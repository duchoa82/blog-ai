# 🚀 Shopify App Deployment Guide

## 📋 **Prerequisites**

1. **Shopify Partner Account** - Để tạo app
2. **Railway Account** - Để deploy backend
3. **GitHub Repository** - Để quản lý code

## 🔧 **Setup Shopify App**

### **1. Tạo App trong Shopify Partners**
```bash
# Login vào Shopify Partners
# Tạo app mới với tên "Blog SEO AI"
# Lấy Client ID và Client Secret
```

### **2. Cập nhật Configuration**
```bash
# Cập nhật shopify.app.toml
client_id = "YOUR_CLIENT_ID"
application_url = "YOUR_RAILWAY_URL"
```

## 🚀 **Deploy to Railway**

### **1. Connect GitHub Repository**
```bash
# Login vào Railway
# Connect GitHub repo
# Deploy từ main branch
```

### **2. Set Environment Variables**
```bash
# Trong Railway dashboard, set:
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SHOPIFY_APP_URL=https://your-app.railway.app
NODE_ENV=production
```

### **3. Deploy**
```bash
# Railway sẽ tự động build và deploy
# Build command: npm install && cd frontend && npm run build
# Start command: npm run start
```

## 🔗 **Install App vào Shopify Store**

### **1. Generate Install URL**
```bash
# URL format:
https://your-app.railway.app/auth/shopify?shop=your-store.myshopify.com
```

### **2. Install App**
```bash
# Mở URL trên trong browser
# Authorize app với Shopify
# App sẽ được install vào store
```

## ✅ **Verify Deployment**

### **1. Check App Bridge**
```bash
# Console logs sẽ hiện:
🚀 Production mode: Using real Shopify configuration
🚀 Production mode: Wrapping with App Bridge
✅ App Bridge initialized with: { shop, host }
```

### **2. Test Navigation**
```bash
# Sidebar navigation sẽ hiện trong Shopify Admin
# Top bar với title "ENIPA AI Blog Writing Assist"
# Các menu items: Dashboard, Generate, Templates, Pricing, Settings
```

### **3. Test Features**
```bash
# Dashboard page
# Blog generation (AI)
# Pricing plans
# Settings modal
# Templates management
```

## 🐛 **Troubleshooting**

### **App Bridge Errors**
```bash
# Nếu có lỗi "missing shop configuration":
# Kiểm tra URL parameters shop và host
# Đảm bảo app được install từ Shopify Admin
```

### **Build Errors**
```bash
# Nếu build fail:
npm run build
# Kiểm tra TypeScript errors
# Fix linter issues trước khi deploy
```

### **Runtime Errors**
```bash
# Check Railway logs
# Verify environment variables
# Test local với shopify dev
```

## 🔄 **Update App**

### **1. Push Code Changes**
```bash
git add .
git commit -m "Update app features"
git push origin main
```

### **2. Railway Auto-deploy**
```bash
# Railway sẽ tự động rebuild và deploy
# Không cần manual intervention
```

## 📱 **Production Features**

✅ **App Bridge Integration** - Sidebar navigation  
✅ **Polaris v12 UI** - Modern web components  
✅ **AI Blog Generation** - OpenAI integration  
✅ **Pricing Plans** - Subscription management  
✅ **Settings Management** - App configuration  
✅ **Responsive Design** - Mobile friendly  

## 🎯 **Next Steps**

1. **Test tất cả features** trong Shopify Admin
2. **Setup AI API keys** trong production
3. **Configure webhooks** cho real-time updates
4. **Monitor performance** và errors
5. **Gather user feedback** và iterate

---

**🎉 App đã sẵn sàng deploy lên Shopify!**
