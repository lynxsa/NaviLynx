/**
 * Enhanced Mobile App Integration Service
 * Connects mobile app with admin dashboard for comprehensive control
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const ADMIN_API_BASE = 'http://localhost:3001/api'; // Admin dashboard API
const MOBILE_API_BASE = 'http://localhost:3000/api'; // Mobile app API

export interface AdminConfig {
  // Feature Controls
  features: {
    arNavigation: boolean;
    voiceGuidance: boolean;
    offlineMode: boolean;
    betaFeatures: boolean;
    debugMode: boolean;
  };
  
  // UI/UX Controls
  ui: {
    theme: 'light' | 'dark' | 'auto';
    primaryColor: string;
    accentColor: string;
    borderRadius: 'sm' | 'md' | 'lg' | 'xl';
    fontScale: number;
    animationSpeed: 'slow' | 'normal' | 'fast';
  };
  
  // Content Controls
  content: {
    maxVenues: number;
    maxDeals: number;
    maxArticles: number;
    refreshInterval: number;
    cacheTimeout: number;
  };
  
  // Analytics Controls
  analytics: {
    enabled: boolean;
    level: 'basic' | 'detailed' | 'comprehensive';
    retention: number; // days
    exportEnabled: boolean;
  };
  
  // Security Controls
  security: {
    requireAuth: boolean;
    biometricEnabled: boolean;
    sessionTimeout: number; // minutes
    dataEncryption: boolean;
  };
  
  // Performance Controls
  performance: {
    imageQuality: 'low' | 'medium' | 'high';
    preloadContent: boolean;
    backgroundSync: boolean;
    compressionLevel: number;
  };
}

export interface UserMetrics {
  userId: string;
  deviceInfo: {
    platform: string;
    version: string;
    model: string;
  };
  usage: {
    sessionsToday: number;
    totalSessions: number;
    avgSessionDuration: number;
    lastActive: string;
  };
  navigation: {
    arUsage: number;
    routesCompleted: number;
    avgAccuracy: number;
    preferredMode: string;
  };
  preferences: {
    favoriteVenues: string[];
    savedDeals: string[];
    searchHistory: string[];
    categories: string[];
  };
}

class MobileAppIntegrationService {
  private adminConfig: AdminConfig | null = null;
  private userMetrics: UserMetrics | null = null;
  private syncInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeService();
  }

  // Initialize the service and start syncing
  async initializeService() {
    try {
      await this.loadStoredConfig();
      await this.loadUserMetrics();
      this.startPeriodicSync();
    } catch (error) {
      console.error('Failed to initialize integration service:', error);
    }
  }

  // Load admin configuration from storage
  async loadStoredConfig(): Promise<AdminConfig | null> {
    try {
      const storedConfig = await AsyncStorage.getItem('admin_config');
      if (storedConfig) {
        this.adminConfig = JSON.parse(storedConfig);
        return this.adminConfig;
      }
      return null;
    } catch (error) {
      console.error('Error loading admin config:', error);
      return null;
    }
  }

  // Fetch latest admin configuration from dashboard
  async fetchAdminConfig(): Promise<AdminConfig | null> {
    try {
      const response = await fetch(`${ADMIN_API_BASE}/mobile-config`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        }
      });

      if (response.ok) {
        const config = await response.json();
        this.adminConfig = config;
        await AsyncStorage.setItem('admin_config', JSON.stringify(config));
        return config;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching admin config:', error);
      return this.adminConfig; // Return cached config on error
    }
  }

  // Get current admin configuration
  getAdminConfig(): AdminConfig | null {
    return this.adminConfig;
  }

  // Check if a feature is enabled by admin
  isFeatureEnabled(feature: keyof AdminConfig['features']): boolean {
    return this.adminConfig?.features[feature] ?? true; // Default to enabled
  }

  // Get UI configuration from admin
  getUIConfig(): AdminConfig['ui'] | null {
    return this.adminConfig?.ui ?? null;
  }

  // Get performance settings from admin
  getPerformanceConfig(): AdminConfig['performance'] | null {
    return this.adminConfig?.performance ?? null;
  }

  // Load user metrics from storage
  async loadUserMetrics(): Promise<UserMetrics | null> {
    try {
      const storedMetrics = await AsyncStorage.getItem('user_metrics');
      if (storedMetrics) {
        this.userMetrics = JSON.parse(storedMetrics);
        return this.userMetrics;
      }
      return null;
    } catch (error) {
      console.error('Error loading user metrics:', error);
      return null;
    }
  }

  // Update user metrics
  async updateUserMetrics(updates: Partial<UserMetrics>): Promise<void> {
    try {
      this.userMetrics = {
        ...this.userMetrics,
        ...updates
      } as UserMetrics;
      
      await AsyncStorage.setItem('user_metrics', JSON.stringify(this.userMetrics));
    } catch (error) {
      console.error('Error updating user metrics:', error);
    }
  }

  // Send user metrics to admin dashboard
  async syncUserMetrics(): Promise<boolean> {
    try {
      if (!this.userMetrics) return false;

      const response = await fetch(`${ADMIN_API_BASE}/user-metrics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify(this.userMetrics)
      });

      return response.ok;
    } catch (error) {
      console.error('Error syncing user metrics:', error);
      return false;
    }
  }

  // Track user session
  async trackSession(sessionData: {
    startTime: string;
    endTime?: string;
    screenViews: string[];
    actions: string[];
  }): Promise<void> {
    try {
      const response = await fetch(`${ADMIN_API_BASE}/session-tracking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify(sessionData)
      });

      if (!response.ok) {
        console.warn('Failed to track session');
      }
    } catch (error) {
      console.error('Error tracking session:', error);
    }
  }

  // Track AR navigation usage
  async trackARUsage(usageData: {
    sessionId: string;
    startTime: string;
    endTime: string;
    accuracy: number;
    venueId: string;
    success: boolean;
  }): Promise<void> {
    try {
      const response = await fetch(`${ADMIN_API_BASE}/ar-tracking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify(usageData)
      });

      if (!response.ok) {
        console.warn('Failed to track AR usage');
      }
    } catch (error) {
      console.error('Error tracking AR usage:', error);
    }
  }

  // Send app performance metrics
  async sendPerformanceMetrics(metrics: {
    appLaunchTime: number;
    memoryUsage: number;
    cpuUsage: number;
    networkLatency: number;
    errorCount: number;
    crashCount: number;
  }): Promise<void> {
    try {
      const response = await fetch(`${ADMIN_API_BASE}/performance-metrics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify(metrics)
      });

      if (!response.ok) {
        console.warn('Failed to send performance metrics');
      }
    } catch (error) {
      console.error('Error sending performance metrics:', error);
    }
  }

  // Request remote configuration update
  async requestConfigUpdate(): Promise<AdminConfig | null> {
    return await this.fetchAdminConfig();
  }

  // Start periodic sync with admin dashboard
  startPeriodicSync(intervalMs: number = 300000): void { // 5 minutes default
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(async () => {
      await this.fetchAdminConfig();
      await this.syncUserMetrics();
    }, intervalMs);
  }

  // Stop periodic sync
  stopPeriodicSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // Get authentication token for API calls
  private async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  // Force full sync with admin dashboard
  async forceSync(): Promise<{
    configUpdated: boolean;
    metricsSync: boolean;
  }> {
    const configUpdated = !!(await this.fetchAdminConfig());
    const metricsSync = await this.syncUserMetrics();
    
    return {
      configUpdated,
      metricsSync
    };
  }

  // Get admin dashboard URL for web view
  getAdminDashboardUrl(): string {
    return 'http://localhost:3001/dashboard';
  }

  // Check admin connectivity
  async checkAdminConnectivity(): Promise<boolean> {
    try {
      const response = await fetch(`${ADMIN_API_BASE}/health`, {
        method: 'GET',
        timeout: 5000
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // Reset all stored data
  async resetIntegration(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        'admin_config',
        'user_metrics',
        'auth_token'
      ]);
      
      this.adminConfig = null;
      this.userMetrics = null;
      this.stopPeriodicSync();
    } catch (error) {
      console.error('Error resetting integration:', error);
    }
  }
}

// Export singleton instance
export const mobileAppIntegration = new MobileAppIntegrationService();

// Export utility functions
export const IntegrationUtils = {
  // Apply admin UI configuration to app
  applyUIConfig: (config: AdminConfig['ui']) => {
    // Apply theme
    if (config.theme !== 'auto') {
      // Set theme in theme context
    }
    
    // Apply colors
    if (config.primaryColor) {
      // Update primary color in design system
    }
    
    // Apply other UI settings
    return config;
  },

  // Check if feature should be shown based on admin config
  shouldShowFeature: (feature: keyof AdminConfig['features']): boolean => {
    return mobileAppIntegration.isFeatureEnabled(feature);
  },

  // Get styled component props based on admin config
  getStyledProps: (componentType: string) => {
    const uiConfig = mobileAppIntegration.getUIConfig();
    if (!uiConfig) return {};

    return {
      borderRadius: uiConfig.borderRadius,
      animationDuration: uiConfig.animationSpeed === 'fast' ? 150 : 
                        uiConfig.animationSpeed === 'slow' ? 500 : 300,
      fontSize: 16 * uiConfig.fontScale
    };
  }
};

export default mobileAppIntegration;
