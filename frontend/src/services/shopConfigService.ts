// Types for shop configuration
export interface ShopConfig {
  storeDomain: string;
  accessToken: string;
  apiVersion: string;
  shopName?: string;
  shopEmail?: string;
  shopCountry?: string;
  shopCurrency?: string;
}

// Service to manage shop configuration
class ShopConfigService {
  private readonly STORAGE_KEY = 'shopify_shop_config';
  private config: ShopConfig | null = null;

  // Get configuration from localStorage or environment
  getConfig(): ShopConfig | null {
    if (this.config) {
      return this.config;
    }

    try {
      // Try to get from localStorage first
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.config = JSON.parse(stored);
        return this.config;
      }

      // Fallback to environment variables
      const envConfig: ShopConfig = {
        storeDomain: import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || '',
        accessToken: import.meta.env.VITE_SHOPIFY_ACCESS_TOKEN || '',
        apiVersion: import.meta.env.VITE_SHOPIFY_API_VERSION || '2025-01',
      };

      if (envConfig.storeDomain && envConfig.accessToken) {
        this.config = envConfig;
        this.saveConfig(envConfig);
        return this.config;
      }
    } catch (error) {
      console.error('Error loading shop configuration:', error);
    }

    return null;
  }

  // Save configuration to localStorage
  saveConfig(config: ShopConfig): void {
    try {
      this.config = config;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
      console.log('Shop configuration saved successfully');
    } catch (error) {
      console.error('Error saving shop configuration:', error);
    }
  }

  // Update specific configuration fields
  updateConfig(updates: Partial<ShopConfig>): void {
    const current = this.getConfig();
    if (current) {
      const updated = { ...current, ...updates };
      this.saveConfig(updated);
    }
  }

  // Clear configuration
  clearConfig(): void {
    try {
      this.config = null;
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('Shop configuration cleared');
    } catch (error) {
      console.error('Error clearing shop configuration:', error);
    }
  }

  // Check if configuration is valid
  isConfigValid(): boolean {
    const config = this.getConfig();
    return !!(config?.storeDomain && config?.accessToken);
  }

  // Get store domain without .myshopify.com suffix
  getStoreName(): string | null {
    const config = this.getConfig();
    if (!config?.storeDomain) return null;
    
    return config.storeDomain.replace('.myshopify.com', '');
  }

  // Get full store domain
  getStoreDomain(): string | null {
    const config = this.getConfig();
    if (!config?.storeDomain) return null;
    
    // Ensure domain has .myshopify.com suffix
    if (config.storeDomain.includes('.myshopify.com')) {
      return config.storeDomain;
    }
    
    return `${config.storeDomain}.myshopify.com`;
  }

  // Get access token
  getAccessToken(): string | null {
    const config = this.getConfig();
    return config?.accessToken || null;
  }

  // Get API version
  getApiVersion(): string {
    const config = this.getConfig();
    return config?.apiVersion || '2025-01';
  }

  // Validate store domain format
  validateStoreDomain(domain: string): boolean {
    // Remove .myshopify.com if present
    const cleanDomain = domain.replace('.myshopify.com', '');
    
    // Check if it's a valid subdomain format
    const subdomainRegex = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
    return subdomainRegex.test(cleanDomain) && cleanDomain.length >= 3;
  }

  // Test connection to shop
  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      const config = this.getConfig();
      if (!config) {
        return { success: false, error: 'No configuration found' };
      }

      // Simple test by trying to fetch shop info
      const response = await fetch(`https://${config.storeDomain}/admin/api/${config.apiVersion}/shop.json`, {
        headers: {
          'X-Shopify-Access-Token': config.accessToken,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.shop) {
        // Update config with shop info
        this.updateConfig({
          shopName: data.shop.name,
          shopEmail: data.shop.email,
          shopCountry: data.shop.country_name,
          shopCurrency: data.shop.currency,
        });
        
        return { success: true };
      } else {
        return { success: false, error: 'Invalid response from Shopify API' };
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  // Get shop information
  async getShopInfo(): Promise<any> {
    try {
      const config = this.getConfig();
      if (!config) {
        throw new Error('No configuration found');
      }

      const response = await fetch(`https://${config.storeDomain}/admin/api/${config.apiVersion}/shop.json`, {
        headers: {
          'X-Shopify-Access-Token': config.accessToken,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.shop;
    } catch (error) {
      console.error('Error fetching shop info:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const shopConfigService = new ShopConfigService();
export default shopConfigService;
