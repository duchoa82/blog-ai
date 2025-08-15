import crypto from 'crypto';

// Session management will be handled by express-session
// No need for global sessions Map

export class ShopifyService {
  // Generate OAuth URL for shop installation
  static generateAuthUrl(shop, req) {
    const state = crypto.randomBytes(16).toString('hex');
    
    // Updated scopes to include all necessary permissions
    const scopes = process.env.SHOPIFY_SCOPES || 'read_products,write_products,read_content,write_content,read_blog,write_blog,read_articles,write_articles';
    
    const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${process.env.SHOPIFY_API_KEY || '98d5cae75b3fdce1011668a7b6bdc8e2'}&scope=${scopes}&redirect_uri=${process.env.SHOPIFY_APP_URL || 'https://blog-shopify-production.up.railway.app'}/auth/shopify/callback&state=${state}`;
    
    // Enhanced session management with better error handling
    if (req && req.session) {
      req.session.oauthState = { state, shop, timestamp: Date.now() };
      
      // Force session save to ensure persistence
      req.session.save((err) => {
        if (err) {
          console.error('❌ Failed to save OAuth state to session:', err);
        } else {
          console.log(`✅ OAuth state stored for shop: ${shop}, state: ${state}`);
        }
      });
    } else {
      console.error('❌ No session available for OAuth state storage');
      throw new Error('Session not available for OAuth flow');
    }
    
    return authUrl;
  }

  // Handle OAuth callback and exchange code for access token
  static async handleCallback(query, req) {
    try {
      const { shop, code, state } = query;
      
      console.log(`🔐 OAuth callback received for shop: ${shop}`);
      console.log(`🔑 State from query: ${state}`);
      console.log(`📱 Session exists: ${!!req.session}`);
      console.log(`🔍 OAuth state in session: ${!!req.session?.oauthState}`);
      
      // Verify state from session with detailed logging
      if (!req || !req.session) {
        console.error('❌ No request or session object available');
        throw new Error('No session available for OAuth callback');
      }
      
      if (!req.session.oauthState) {
        console.error('❌ No OAuth state found in session');
        console.log('📊 Session contents:', Object.keys(req.session));
        throw new Error('No OAuth state found in session');
      }
      
      const sessionData = req.session.oauthState;
      console.log(`🔍 Session state: ${sessionData.state}, Query state: ${state}`);
      console.log(`🏪 Session shop: ${sessionData.shop}, Query shop: ${shop}`);
      
      if (sessionData.state !== state) {
        console.error(`❌ State mismatch: Session=${sessionData.state}, Query=${state}`);
        throw new Error('Invalid state parameter');
      }
      
      if (sessionData.shop !== shop) {
        console.error(`❌ Shop mismatch: Session=${sessionData.shop}, Query=${shop}`);
        throw new Error('Shop mismatch');
      }
      
      // Exchange authorization code for access token
      const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: process.env.SHOPIFY_API_KEY || '98d5cae75b3fdce1011668a7b6bdc8e2',
          client_secret: process.env.SHOPIFY_API_SECRET,
          code: code,
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error(`Token exchange failed: ${tokenResponse.status}`);
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;
      
      // Store access token in session
      req.session.shopData = { 
        shop,
        accessToken,
        timestamp: Date.now()
      };
      
      // Clean up OAuth state
      delete req.session.oauthState;
      
      return { success: true, shop, accessToken };
      
    } catch (error) {
      console.error('OAuth callback error:', error);
      throw error;
    }
  }

  // Validate if access token is still valid
  static async validateAccessToken(shop, accessToken) {
    try {
      console.log(`🔍 Validating access token for shop: ${shop}`);
      
      // Try to fetch shop info to validate token
      const response = await fetch(`https://${shop}/admin/api/2024-10/shop.json`, {
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error(`❌ Token validation failed: ${response.status}`);
        return false;
      }

      const shopData = await response.json();
      console.log(`✅ Token is valid! Shop: ${shopData.shop?.name || 'Unknown'}`);
      return true;
      
    } catch (error) {
      console.error('❌ Token validation error:', error);
      return false;
    }
  }

  // Get shop products from real Shopify API
  static async getProducts(shop, accessToken) {
    try {
      console.log(`🛍️ Fetching products via Admin API for shop: ${shop}`);
      console.log(`🔑 Using access token: ${accessToken ? 'Present' : 'Missing'}`);
      
      // Try multiple API versions for better compatibility
      const apiVersions = ['2025-01', '2024-10', '2024-07'];
      let lastError = null;
      
      for (const version of apiVersions) {
        try {
          console.log(`🔍 Trying Admin API version: ${version}`);
          
          const response = await fetch(`https://${shop}/admin/api/${version}/products.json?limit=50`, {
            headers: {
              'X-Shopify-Access-Token': accessToken,
              'Content-Type': 'application/json',
            },
          });

          console.log(`📊 Response status: ${response.status}`);
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ API version ${version} failed:`, response.status, errorText);
            console.error(`🔍 Response headers:`, Object.fromEntries(response.headers.entries()));
            console.error(`🔍 Request URL:`, `https://${shop}/admin/api/${version}/products.json?limit=50`);
            console.error(`🔍 Access token present:`, !!accessToken);
            console.error(`🔍 Access token length:`, accessToken ? accessToken.length : 0);
            lastError = new Error(`Shopify API ${version} error: ${response.status} - ${errorText}`);
            continue; // Try next version
          }

          const data = await response.json();
          console.log(`✅ API version ${version} succeeded! Found ${data.products?.length || 0} products`);
          
          // Transform products to include all needed fields
          const transformedProducts = (data.products || []).map(product => ({
            id: product.id,
            title: product.title,
            handle: product.handle,
            description: product.body_html || product.description || 'No description available',
            product_type: product.product_type || 'General',
            vendor: product.vendor || 'Unknown Vendor',
            status: product.status || 'active',
            images: product.images?.map(img => ({
              src: img.src,
              alt: img.alt || product.title
            })) || []
          }));
          
          return transformedProducts;
          
        } catch (versionError) {
          console.error(`❌ API version ${version} error:`, versionError);
          lastError = versionError;
          continue; // Try next version
        }
      }
      
      // If all versions failed, throw the last error
      console.error('❌ All Admin API versions failed');
      throw lastError || new Error('All Shopify Admin API versions failed');
      
    } catch (error) {
      console.error('❌ Error fetching products from Shopify:', error);
      throw error; // Don't fall back to mock data - let the error propagate
    }
  }

  // Get shop blogs from real Shopify API
  static async getBlogs(shop, accessToken) {
    try {
      console.log(`📝 Fetching blogs via Admin API for shop: ${shop}`);
      console.log(`🔑 Using access token: ${accessToken ? 'Present' : 'Missing'}`);
      
      // Try multiple API versions for better compatibility
      const apiVersions = ['2025-01', '2024-10', '2024-07'];
      let lastError = null;
      
      for (const version of apiVersions) {
        try {
          console.log(`🔍 Trying Admin API version: ${version}`);
          
          const response = await fetch(`https://${shop}/admin/api/${version}/blogs.json?limit=50&fields=id,title,handle,commentable,feedburner,feedburner_location,handle,id,metafield_definition,metafields,title,updated_at`, {
            headers: {
              'X-Shopify-Access-Token': accessToken,
              'Content-Type': 'application/json',
            },
          });

          console.log(`📊 Response status: ${response.status}`);
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ API version ${version} failed:`, response.status, errorText);
            lastError = new Error(`Shopify API ${version} error: ${response.status} - ${errorText}`);
            continue; // Try next version
          }

          const data = await response.json();
          console.log(`✅ API version ${version} succeeded! Found ${data.blogs?.length || 0} blogs`);
          
          return data.blogs || [];
          
        } catch (versionError) {
          console.error(`❌ API version ${version} error:`, versionError);
          lastError = versionError;
          continue; // Try next version
        }
      }
      
      // If all versions failed, throw the last error
      console.error('❌ All Admin API versions failed');
      throw lastError || new Error('All Shopify Admin API versions failed');
      
    } catch (error) {
      console.error('❌ Error fetching blogs from Shopify:', error);
      throw error; // Don't fall back to mock data - let the error propagate
    }
  }

  // Create blog article (mock for development)
  static async createArticle(shop, accessToken, blogId, articleData) {
    try {
      // Simulate article creation
      const article = {
        id: Date.now(),
        title: articleData.title,
        body_html: articleData.body_html,
        author: articleData.author,
        tags: articleData.tags,
        created_at: new Date().toISOString()
      };
      
      return article;
    } catch (error) {
      console.error('Error creating article:', error);
      throw error;
    }
  }

  // Get shop info (mock for development)
  static async getShopInfo(shop, accessToken) {
    try {
      // Return mock shop info
      return {
        name: "Development Shop",
        domain: shop,
        email: "dev@example.com"
      };
    } catch (error) {
      console.error('Error fetching shop info:', error);
      throw error;
    }
  }
}

// Export is already done above with 'export class ShopifyService'
