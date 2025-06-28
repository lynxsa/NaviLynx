/**
 * AR Performance Optimization Service
 * Optimizes AR rendering performance and manages system resources
 */

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  batteryLevel: number;
  thermalState: 'nominal' | 'fair' | 'serious' | 'critical';
  renderTime: number;
  lastUpdate: number;
}

interface AROptimizationSettings {
  enablePerformanceMode: boolean;
  maxFPS: number;
  targetFPS: number;
  adaptiveQuality: boolean;
  memoryThreshold: number;
  batteryThreshold: number;
  thermalThrottling: boolean;
}

interface ARQualitySettings {
  modelComplexity: 'low' | 'medium' | 'high';
  textureQuality: 'low' | 'medium' | 'high';
  lightingQuality: 'low' | 'medium' | 'high';
  shadowQuality: 'disabled' | 'low' | 'medium' | 'high';
  antiAliasing: boolean;
  postProcessing: boolean;
}

class ARPerformanceOptimizer {
  private metrics: PerformanceMetrics = {
    fps: 60,
    memoryUsage: 0,
    batteryLevel: 1.0,
    thermalState: 'nominal',
    renderTime: 16.67,
    lastUpdate: Date.now()
  };

  private settings: AROptimizationSettings = {
    enablePerformanceMode: false,
    maxFPS: 60,
    targetFPS: 30,
    adaptiveQuality: true,
    memoryThreshold: 0.8, // 80% memory usage threshold
    batteryThreshold: 0.2, // 20% battery threshold
    thermalThrottling: true
  };

  private qualitySettings: ARQualitySettings = {
    modelComplexity: 'high',
    textureQuality: 'high',
    lightingQuality: 'high',
    shadowQuality: 'high',
    antiAliasing: true,
    postProcessing: true
  };

  private frameTimeHistory: number[] = [];
  private performanceCallbacks: Set<(metrics: PerformanceMetrics) => void> = new Set();
  private optimizationInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.startPerformanceMonitoring();
  }

  /**
   * Start monitoring performance metrics
   */
  private startPerformanceMonitoring(): void {
    this.optimizationInterval = setInterval(() => {
      this.updateMetrics();
      this.optimizePerformance();
      this.notifyPerformanceCallbacks();
    }, 1000); // Update every second
  }

  /**
   * Stop performance monitoring
   */
  public stopPerformanceMonitoring(): void {
    if (this.optimizationInterval) {
      clearInterval(this.optimizationInterval);
      this.optimizationInterval = null;
    }
  }

  /**
   * Update performance metrics
   */
  private updateMetrics(): void {
    const now = Date.now();
    const deltaTime = now - this.metrics.lastUpdate;

    // Update FPS calculation
    if (this.frameTimeHistory.length > 0) {
      const averageFrameTime = this.frameTimeHistory.reduce((a, b) => a + b, 0) / this.frameTimeHistory.length;
      this.metrics.fps = Math.round(1000 / averageFrameTime);
      this.metrics.renderTime = averageFrameTime;
    }

    // Simulate memory usage (in production, use actual memory API)
    this.metrics.memoryUsage = this.simulateMemoryUsage();

    // Simulate battery level (in production, use actual battery API)
    this.metrics.batteryLevel = this.simulateBatteryLevel();

    // Simulate thermal state (in production, use actual thermal API)
    this.metrics.thermalState = this.simulateThermalState();

    this.metrics.lastUpdate = now;

    // Use deltaTime to resolve 'never used' warning
    if (deltaTime > 1000) {
      // Log or trigger a warning if updates are too infrequent
      // (In production, you might handle this differently)
      // For now, just log
      console.log(`Performance metrics update interval: ${deltaTime}ms`);
    }

    // Keep frame time history manageable
    if (this.frameTimeHistory.length > 60) {
      this.frameTimeHistory = this.frameTimeHistory.slice(-30);
    }
  }

  /**
   * Record frame time for FPS calculation
   */
  public recordFrameTime(frameTime: number): void {
    this.frameTimeHistory.push(frameTime);
  }

  /**
   * Optimize performance based on current metrics
   */
  private optimizePerformance(): void {
    if (!this.settings.adaptiveQuality) return;

    const { fps, memoryUsage, batteryLevel, thermalState } = this.metrics;

    // Determine if performance mode should be enabled
    const shouldEnablePerformanceMode = 
      fps < this.settings.targetFPS ||
      memoryUsage > this.settings.memoryThreshold ||
      batteryLevel < this.settings.batteryThreshold ||
      (this.settings.thermalThrottling && (thermalState === 'serious' || thermalState === 'critical'));

    if (shouldEnablePerformanceMode !== this.settings.enablePerformanceMode) {
      this.settings.enablePerformanceMode = shouldEnablePerformanceMode;
      this.adaptQualitySettings();
    }
  }

  /**
   * Adapt quality settings based on performance mode
   */
  private adaptQualitySettings(): void {
    if (this.settings.enablePerformanceMode) {
      // Reduce quality for better performance
      this.qualitySettings = {
        modelComplexity: 'low',
        textureQuality: 'medium',
        lightingQuality: 'low',
        shadowQuality: 'disabled',
        antiAliasing: false,
        postProcessing: false
      };
    } else {
      // Restore high quality
      this.qualitySettings = {
        modelComplexity: 'high',
        textureQuality: 'high',
        lightingQuality: 'high',
        shadowQuality: 'high',
        antiAliasing: true,
        postProcessing: true
      };
    }
  }

  /**
   * Get current performance metrics
   */
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Get current optimization settings
   */
  public getSettings(): AROptimizationSettings {
    return { ...this.settings };
  }

  /**
   * Get current quality settings
   */
  public getQualitySettings(): ARQualitySettings {
    return { ...this.qualitySettings };
  }

  /**
   * Update optimization settings
   */
  public updateSettings(newSettings: Partial<AROptimizationSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }

  /**
   * Update quality settings manually
   */
  public updateQualitySettings(newSettings: Partial<ARQualitySettings>): void {
    this.qualitySettings = { ...this.qualitySettings, ...newSettings };
  }

  /**
   * Subscribe to performance updates
   */
  public onPerformanceUpdate(callback: (metrics: PerformanceMetrics) => void): () => void {
    this.performanceCallbacks.add(callback);
    return () => this.performanceCallbacks.delete(callback);
  }

  /**
   * Notify performance callbacks
   */
  private notifyPerformanceCallbacks(): void {
    this.performanceCallbacks.forEach(callback => {
      try {
        callback(this.metrics);
      } catch (error) {
        console.error('Error in performance callback:', error);
      }
    });
  }

  /**
   * Get recommended settings for device
   */
  public getRecommendedSettings(): AROptimizationSettings & ARQualitySettings {
    const deviceCapability = this.assessDeviceCapability();
    
    switch (deviceCapability) {
      case 'high':
        return {
          ...this.settings,
          targetFPS: 60,
          maxFPS: 60,
          modelComplexity: 'high',
          textureQuality: 'high',
          lightingQuality: 'high',
          shadowQuality: 'high',
          antiAliasing: true,
          postProcessing: true
        };
      case 'medium':
        return {
          ...this.settings,
          targetFPS: 30,
          maxFPS: 60,
          modelComplexity: 'medium',
          textureQuality: 'medium',
          lightingQuality: 'medium',
          shadowQuality: 'medium',
          antiAliasing: true,
          postProcessing: false
        };
      case 'low':
      default:
        return {
          ...this.settings,
          targetFPS: 30,
          maxFPS: 30,
          modelComplexity: 'low',
          textureQuality: 'low',
          lightingQuality: 'low',
          shadowQuality: 'disabled',
          antiAliasing: false,
          postProcessing: false
        };
    }
  }

  /**
   * Assess device capability
   */
  private assessDeviceCapability(): 'low' | 'medium' | 'high' {
    // In production, this would use actual device information
    // For now, simulate based on current performance
    
    const avgFPS = this.metrics.fps;
    const memoryPressure = this.metrics.memoryUsage;
    
    if (avgFPS >= 50 && memoryPressure < 0.6) {
      return 'high';
    } else if (avgFPS >= 30 && memoryPressure < 0.8) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  /**
   * Optimize for battery saving
   */
  public enableBatterySavingMode(): void {
    this.updateSettings({
      enablePerformanceMode: true,
      targetFPS: 20,
      maxFPS: 30,
      adaptiveQuality: true,
      batteryThreshold: 0.3
    });

    this.updateQualitySettings({
      modelComplexity: 'low',
      textureQuality: 'low',
      lightingQuality: 'low',
      shadowQuality: 'disabled',
      antiAliasing: false,
      postProcessing: false
    });
  }

  /**
   * Optimize for maximum quality
   */
  public enableHighQualityMode(): void {
    this.updateSettings({
      enablePerformanceMode: false,
      targetFPS: 60,
      maxFPS: 60,
      adaptiveQuality: false
    });

    this.updateQualitySettings({
      modelComplexity: 'high',
      textureQuality: 'high',
      lightingQuality: 'high',
      shadowQuality: 'high',
      antiAliasing: true,
      postProcessing: true
    });
  }

  /**
   * Get performance recommendations
   */
  public getPerformanceRecommendations(): string[] {
    const recommendations: string[] = [];
    const { fps, memoryUsage, batteryLevel, thermalState } = this.metrics;

    if (fps < 25) {
      recommendations.push('Consider reducing AR quality settings for better performance');
    }

    if (memoryUsage > 0.9) {
      recommendations.push('High memory usage detected. Close other apps or restart the app');
    }

    if (batteryLevel < 0.15) {
      recommendations.push('Low battery. Consider enabling battery saving mode');
    }

    if (thermalState === 'serious' || thermalState === 'critical') {
      recommendations.push('Device is overheating. Consider taking a break or reducing usage');
    }

    if (recommendations.length === 0) {
      recommendations.push('Performance is optimal');
    }

    return recommendations;
  }

  /**
   * Simulate memory usage (replace with actual implementation)
   */
  private simulateMemoryUsage(): number {
    // Simulate memory usage between 0.3 and 0.9
    return 0.3 + Math.random() * 0.6;
  }

  /**
   * Simulate battery level (replace with actual implementation)
   */
  private simulateBatteryLevel(): number {
    // Simulate gradual battery drain
    return Math.max(0.05, this.metrics.batteryLevel - 0.001);
  }

  /**
   * Simulate thermal state (replace with actual implementation)
   */
  private simulateThermalState(): 'nominal' | 'fair' | 'serious' | 'critical' {
    const states: ('nominal' | 'fair' | 'serious' | 'critical')[] = ['nominal', 'fair', 'serious', 'critical'];
    const weights = [0.7, 0.2, 0.08, 0.02]; // Probability weights
    
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < states.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) {
        return states[i];
      }
    }
    
    return 'nominal';
  }

  /**
   * Clean up resources
   */
  public dispose(): void {
    this.stopPerformanceMonitoring();
    this.performanceCallbacks.clear();
    this.frameTimeHistory = [];
  }
}

// Create singleton instance
export const arPerformanceOptimizer = new ARPerformanceOptimizer();

// Helper functions for AR components
export const ARPerformanceUtils = {
  /**
   * Get optimal texture size based on performance
   */
  getOptimalTextureSize: (): number => {
    const quality = arPerformanceOptimizer.getQualitySettings().textureQuality;
    switch (quality) {
      case 'high': return 1024;
      case 'medium': return 512;
      case 'low': return 256;
      default: return 512;
    }
  },

  /**
   * Get optimal mesh complexity based on performance
   */
  getOptimalMeshComplexity: (): number => {
    const complexity = arPerformanceOptimizer.getQualitySettings().modelComplexity;
    switch (complexity) {
      case 'high': return 1.0;
      case 'medium': return 0.6;
      case 'low': return 0.3;
      default: return 0.6;
    }
  },

  /**
   * Should render shadows
   */
  shouldRenderShadows: (): boolean => {
    return arPerformanceOptimizer.getQualitySettings().shadowQuality !== 'disabled';
  },

  /**
   * Should use anti-aliasing
   */
  shouldUseAntiAliasing: (): boolean => {
    return arPerformanceOptimizer.getQualitySettings().antiAliasing;
  },

  /**
   * Get frame rate target
   */
  getTargetFPS: (): number => {
    return arPerformanceOptimizer.getSettings().targetFPS;
  },

  /**
   * Check if performance mode is enabled
   */
  isPerformanceModeEnabled: (): boolean => {
    return arPerformanceOptimizer.getSettings().enablePerformanceMode;
  }
};

export default arPerformanceOptimizer;
