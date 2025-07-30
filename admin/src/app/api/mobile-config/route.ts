/**
 * Admin API for Mobile App Integration
 * Provides endpoints for controlling mobile app features and collecting analytics
 */

import { NextRequest, NextResponse } from 'next/server';

// Mock database - in production, this would connect to a real database
const mockDatabase = {
  mobileConfig: {
    features: {
      arNavigation: true,
      voiceGuidance: true,
      offlineMode: false,
      betaFeatures: false,
      debugMode: false,
    },
    ui: {
      theme: 'auto' as const,
      primaryColor: '#8B5CF6',
      accentColor: '#7C3AED',
      borderRadius: 'lg' as const,
      fontScale: 1.0,
      animationSpeed: 'normal' as const,
    },
    content: {
      maxVenues: 100,
      maxDeals: 50,
      maxArticles: 25,
      refreshInterval: 300000, // 5 minutes
      cacheTimeout: 3600000, // 1 hour
    },
    analytics: {
      enabled: true,
      level: 'detailed' as const,
      retention: 30, // days
      exportEnabled: true,
    },
    security: {
      requireAuth: false,
      biometricEnabled: true,
      sessionTimeout: 30, // minutes
      dataEncryption: true,
    },
    performance: {
      imageQuality: 'medium' as const,
      preloadContent: true,
      backgroundSync: true,
      compressionLevel: 0.8,
    },
  },
  userMetrics: [] as any[],
  sessionData: [] as any[],
  arUsageData: [] as any[],
  performanceMetrics: [] as any[],
};

// Get mobile app configuration
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const configType = searchParams.get('type');

    if (configType) {
      // Return specific configuration section
      const config = mockDatabase.mobileConfig[configType as keyof typeof mockDatabase.mobileConfig];
      if (config) {
        return NextResponse.json(config);
      } else {
        return NextResponse.json({ error: 'Invalid config type' }, { status: 400 });
      }
    }

    // Return full configuration
    return NextResponse.json(mockDatabase.mobileConfig);
  } catch (error) {
    console.error('Error getting mobile config:', error);
    return NextResponse.json(
      { error: 'Failed to get mobile configuration' },
      { status: 500 }
    );
  }
}

// Update mobile app configuration
export async function PUT(request: NextRequest) {
  try {
    const updates = await request.json();
    
    // Validate and update configuration
    for (const [section, sectionData] of Object.entries(updates)) {
      if (section in mockDatabase.mobileConfig) {
        mockDatabase.mobileConfig[section as keyof typeof mockDatabase.mobileConfig] = {
          ...mockDatabase.mobileConfig[section as keyof typeof mockDatabase.mobileConfig],
          ...sectionData,
        };
      }
    }

    // In production, save to database here
    console.log('Mobile config updated:', updates);

    return NextResponse.json({ 
      success: true, 
      config: mockDatabase.mobileConfig 
    });
  } catch (error) {
    console.error('Error updating mobile config:', error);
    return NextResponse.json(
      { error: 'Failed to update mobile configuration' },
      { status: 500 }
    );
  }
}

// Receive user metrics from mobile app
export async function POST(request: NextRequest) {
  try {
    const { pathname } = new URL(request.url);
    const data = await request.json();

    if (pathname.includes('user-metrics')) {
      // Store user metrics
      const existingIndex = mockDatabase.userMetrics.findIndex(
        m => m.userId === data.userId
      );

      if (existingIndex >= 0) {
        mockDatabase.userMetrics[existingIndex] = {
          ...mockDatabase.userMetrics[existingIndex],
          ...data,
          lastUpdated: new Date().toISOString(),
        };
      } else {
        mockDatabase.userMetrics.push({
          ...data,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
        });
      }

      return NextResponse.json({ success: true });

    } else if (pathname.includes('session-tracking')) {
      // Store session data
      mockDatabase.sessionData.push({
        ...data,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json({ success: true });

    } else if (pathname.includes('ar-tracking')) {
      // Store AR usage data
      mockDatabase.arUsageData.push({
        ...data,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json({ success: true });

    } else if (pathname.includes('performance-metrics')) {
      // Store performance metrics
      mockDatabase.performanceMetrics.push({
        ...data,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json({ success: true });

    } else {
      return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error processing mobile data:', error);
    return NextResponse.json(
      { error: 'Failed to process mobile data' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}
