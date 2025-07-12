/**
 * ARService - Handles AR capabilities detection and AR-specific functionality
 * Provides abstraction layer for AR features across different platforms
 */

import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ARCapabilities {
  isARSupported: boolean;
  hasGyroscope: boolean;
  hasAccelerometer: boolean;
  hasMagnetometer: boolean;
  hasCamera: boolean;
  platformSupport: {
    ios: boolean;
    android: boolean;
  };
  recommendedMode: 'ar' | 'map';
  devicePerformanceLevel: 'low' | 'medium' | 'high';
}

export interface ARSession {
  id: string;
  isActive: boolean;
  startTime: number;
  trackingQuality: 'poor' | 'limited' | 'normal' | 'good';
  anchorsCount: number;
  fps: number;
}

export interface ARPlacement {
  id: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    x: number;
    y: number;
    z: number;
    w: number;
  };
  scale: {
    x: number;
    y: number;
    z: number;
  };
  type: 'arrow' | 'marker' | 'poi' | 'text';
  content?: string;
  distance?: number;
}

const AR_SETTINGS_KEY = 'navilynx_ar_settings';
class ARService {
  private static instance: ARService;
  private capabilities: ARCapabilities | null = null;
  private currentSession: ARSession | null = null;
  private placements: Map<string, ARPlacement> = new Map();
  private performanceMetrics: {
    averageFPS: number;
    memoryUsage: number;
    batteryImpact: 'low' | 'medium' | 'high';
  } | null = null;

  private constructor() {}

  public static getInstance(): ARService {
    if (!ARService.instance) {
      ARService.instance = new ARService();
    }
    return ARService.instance;
  }

  /**
   * Initialize AR service and detect capabilities
   */
  public async initialize(): Promise<ARCapabilities> {
    try {
      console.log('Initializing AR Service...');
      
      const capabilities = await this.detectARCapabilities();
      this.capabilities = capabilities;
      
      // Save capabilities for future reference
      await AsyncStorage.setItem(AR_SETTINGS_KEY, JSON.stringify(capabilities));
      
      console.log('AR Service initialized:', capabilities);
      return capabilities;
    } catch (error) {
      console.error('Failed to initialize AR Service:', error);
      
      // Return fallback capabilities
      const fallbackCapabilities: ARCapabilities = {
        isARSupported: false,
        hasGyroscope: false,
        hasAccelerometer: false,
        hasMagnetometer: false,
        hasCamera: false,
        platformSupport: { ios: false, android: false },
        recommendedMode: 'map',
        devicePerformanceLevel: 'low',
      };
      
      this.capabilities = fallbackCapabilities;
      return fallbackCapabilities;
    }
  }

  /**
   * Detect AR capabilities of the current device
   */
  private async detectARCapabilities(): Promise<ARCapabilities> {
    const isPhysicalDevice = Device.isDevice;
    const deviceType = Device.deviceType;
    
    // Basic platform support
    const iosSupport = Platform.OS === 'ios' && 
                      isPhysicalDevice && 
                      deviceType !== Device.DeviceType.TV;
    
    const androidSupport = Platform.OS === 'android' && 
                          isPhysicalDevice && 
                          Number(Platform.Version) >= 24; // Android 7.0+

    // Sensor availability (mock detection - in real app would use expo-sensors)
    const hasGyroscope = isPhysicalDevice; // Most modern devices have gyroscope
    const hasAccelerometer = isPhysicalDevice; // Almost all devices have accelerometer
    const hasMagnetometer = isPhysicalDevice; // Most devices have magnetometer
    const hasCamera = isPhysicalDevice; // Assume physical devices have camera

    // Performance level estimation
    let performanceLevel: 'low' | 'medium' | 'high' = 'medium';
    
    if (Device.modelName) {
      const modelName = Device.modelName.toLowerCase();
      
      // High-end devices
      if (modelName.includes('pro') || 
          modelName.includes('ultra') || 
          modelName.includes('iphone 1') || // iPhone 10+
          modelName.includes('samsung galaxy s2') || 
          modelName.includes('samsung galaxy s3') ||
          modelName.includes('pixel 6') ||
          modelName.includes('pixel 7') ||
          modelName.includes('pixel 8')) {
        performanceLevel = 'high';
      }
      // Low-end devices
      else if (modelName.includes('se') || 
               modelName.includes('mini') || 
               modelName.includes('lite') ||
               modelName.includes('iphone 6') ||
               modelName.includes('iphone 7') ||
               modelName.includes('iphone 8')) {
        performanceLevel = 'low';
      }
    }

    const isARSupported = (iosSupport || androidSupport) && 
                         hasGyroscope && 
                         hasAccelerometer && 
                         hasCamera &&
                         performanceLevel !== 'low';

    const recommendedMode = isARSupported && performanceLevel === 'high' ? 'ar' : 'map';

    return {
      isARSupported,
      hasGyroscope,
      hasAccelerometer,
      hasMagnetometer,
      hasCamera,
      platformSupport: {
        ios: iosSupport,
        android: androidSupport,
      },
      recommendedMode,
      devicePerformanceLevel: performanceLevel,
    };
  }

  /**
   * Start AR session
   */
  public async startARSession(): Promise<ARSession | null> {
    if (!this.capabilities?.isARSupported) {
      console.warn('AR not supported on this device');
      return null;
    }

    if (this.currentSession?.isActive) {
      console.warn('AR session already active');
      return this.currentSession;
    }

    try {
      const session: ARSession = {
        id: `ar-session-${Date.now()}`,
        isActive: true,
        startTime: Date.now(),
        trackingQuality: 'limited', // Start with limited, improve over time
        anchorsCount: 0,
        fps: 30, // Target FPS
      };

      this.currentSession = session;
      
      // Start performance monitoring
      this.startPerformanceMonitoring();
      
      console.log('AR session started:', session.id);
      return session;
    } catch (error) {
      console.error('Failed to start AR session:', error);
      return null;
    }
  }

  /**
   * Stop AR session and cleanup
   */
  public async stopARSession(): Promise<void> {
    if (!this.currentSession?.isActive) {
      return;
    }

    try {
      // Clear all AR placements
      this.placements.clear();
      
      // Stop performance monitoring
      this.stopPerformanceMonitoring();
      
      // Mark session as inactive
      if (this.currentSession) {
        this.currentSession.isActive = false;
      }
      
      console.log('AR session stopped');
    } catch (error) {
      console.error('Error stopping AR session:', error);
    }
  }

  /**
   * Add AR placement (arrow, marker, etc.)
   */
  public addPlacement(placement: Omit<ARPlacement, 'id'>): string {
    const id = `placement-${Date.now()}-${Math.random()}`;
    const fullPlacement: ARPlacement = {
      id,
      ...placement,
    };
    
    this.placements.set(id, fullPlacement);
    
    // Update anchors count
    if (this.currentSession) {
      this.currentSession.anchorsCount = this.placements.size;
    }
    
    return id;
  }

  /**
   * Remove AR placement
   */
  public removePlacement(id: string): boolean {
    const removed = this.placements.delete(id);
    
    // Update anchors count
    if (this.currentSession) {
      this.currentSession.anchorsCount = this.placements.size;
    }
    
    return removed;
  }

  /**
   * Get all current AR placements
   */
  public getPlacements(): ARPlacement[] {
    return Array.from(this.placements.values());
  }

  /**
   * Update AR session tracking quality
   */
  public updateTrackingQuality(quality: ARSession['trackingQuality']): void {
    if (this.currentSession) {
      this.currentSession.trackingQuality = quality;
    }
  }

  /**
   * Get current AR capabilities
   */
  public getCapabilities(): ARCapabilities | null {
    return this.capabilities;
  }

  /**
   * Get current AR session
   */
  public getCurrentSession(): ARSession | null {
    return this.currentSession;
  }

  /**
   * Check if AR is currently active
   */
  public isARActive(): boolean {
    return this.currentSession?.isActive ?? false;
  }

  /**
   * Get recommended mode based on device capabilities
   */
  public getRecommendedMode(): 'ar' | 'map' {
    return this.capabilities?.recommendedMode ?? 'map';
  }

  /**
   * Start monitoring AR performance
   */
  private startPerformanceMonitoring(): void {
    // In a real implementation, this would monitor:
    // - Frame rate
    // - Memory usage
    // - Battery consumption
    // - Tracking quality
    
    console.log('Started AR performance monitoring');
  }

  /**
   * Stop monitoring AR performance
   */
  private stopPerformanceMonitoring(): void {
    console.log('Stopped AR performance monitoring');
  }

  /**
   * Calculate world position from screen coordinates
   */
  public screenToWorldPosition(
    screenX: number, 
    screenY: number, 
    distance: number = 1.0
  ): { x: number; y: number; z: number } | null {
    // Mock implementation - in real AR, this would use camera matrices
    // to convert screen coordinates to world space
    
    if (!this.currentSession?.isActive) {
      return null;
    }

    // Simple mock conversion
    const normalizedX = (screenX / 1000) - 0.5; // Assuming screen width ~1000
    const normalizedY = (screenY / 1000) - 0.5; // Assuming screen height ~1000
    
    return {
      x: normalizedX * distance,
      y: normalizedY * distance,
      z: -distance, // Negative Z is forward in AR
    };
  }

  /**
   * Calculate distance between two 3D points
   */
  public calculateDistance3D(
    point1: { x: number; y: number; z: number },
    point2: { x: number; y: number; z: number }
  ): number {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    const dz = point2.z - point1.z;
    
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  /**
   * Save AR settings for user preferences
   */
  public async saveARSettings(settings: {
    preferredMode: 'ar' | 'map';
    arQuality: 'low' | 'medium' | 'high';
    showInstructions: boolean;
  }): Promise<void> {
    try {
      await AsyncStorage.setItem(AR_SETTINGS_KEY + '_user', JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save AR settings:', error);
    }
  }

  /**
   * Load AR settings for user preferences
   */
  public async loadARSettings(): Promise<{
    preferredMode: 'ar' | 'map';
    arQuality: 'low' | 'medium' | 'high';
    showInstructions: boolean;
  } | null> {
    try {
      const settings = await AsyncStorage.getItem(AR_SETTINGS_KEY + '_user');
      return settings ? JSON.parse(settings) : null;
    } catch (error) {
      console.warn('Failed to load AR settings:', error);
      return null;
    }
  }
}

export { ARService };
export default ARService;
