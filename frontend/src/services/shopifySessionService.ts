export interface ShopSession {
  shop: string;
  accessToken: string;
  scope: string;
  expiresAt: number;
  userId?: number;
  email?: string;
  shopName?: string;
  shopDomain?: string;
}

class ShopifySessionService {
  private readonly STORAGE_KEY = 'shopify_sessions';
  private sessions: Map<string, ShopSession> = new Map();

  constructor() {
    this.loadSessions();
  }

  private loadSessions() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.sessions = new Map(Object.entries(parsed));
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  }

  private saveSessions() {
    try {
      const obj = Object.fromEntries(this.sessions);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(obj));
    } catch (error) {
      console.error('Error saving sessions:', error);
    }
  }

  // Lưu session mới
  saveSession(session: ShopSession): void {
    this.sessions.set(session.shop, session);
    this.saveSessions();
  }

  // Lấy session cho shop cụ thể
  getSession(shop: string): ShopSession | null {
    const session = this.sessions.get(shop);
    if (!session) return null;

    // Kiểm tra token có hết hạn chưa
    if (session.expiresAt < Date.now()) {
      this.removeSession(shop);
      return null;
    }

    return session;
  }

  // Lấy access token cho shop
  getAccessToken(shop: string): string | null {
    const session = this.getSession(shop);
    return session?.accessToken || null;
  }

  // Xóa session
  removeSession(shop: string): void {
    this.sessions.delete(shop);
    this.saveSessions();
  }

  // Lấy tất cả sessions
  getAllSessions(): ShopSession[] {
    return Array.from(this.sessions.values());
  }

  // Kiểm tra shop có session hợp lệ không
  hasValidSession(shop: string): boolean {
    return this.getSession(shop) !== null;
  }

  // Lấy shop hiện tại từ URL
  getCurrentShop(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    const shop = urlParams.get('shop');
    
    if (shop && shop.endsWith('.myshopify.com')) {
      return shop;
    }

    // Fallback: kiểm tra localStorage
    const sessions = this.getAllSessions();
    if (sessions.length > 0) {
      return sessions[0].shop;
    }

    return null;
  }

  // Clear tất cả sessions
  clearAllSessions(): void {
    this.sessions.clear();
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

export const shopifySessionService = new ShopifySessionService();
export default shopifySessionService;
