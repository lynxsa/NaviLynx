/**
 * NaviLynx Charter Compliance: Performance Optimization Service
 * Targets: Sub-second load times, 60 F  setupFrameRateMonitoring(): void {
    if (!this.config.enableFrameRateMonitoring) return;

    // Check if requestAnimationFrame is available (web environment)
    const hasRequestAnimationFrame = typeof requestAnimationFrame !== 'undefined';
    
    // Monitor frame rate using requestAnimationFrame or setInterval fallback
    const measureFrameRate = () => {
      const now = Date.now();
      const deltaTime = now - this.lastFrameTime;
      this.lastFrameTime = now;
      
      if (deltaTime > 0) {
        const currentFPS = 1000 / deltaTime;
        this.metrics.frameRate = (this.metrics.frameRate * 0.9) + (currentFPS * 0.1);
      }
      
      this.frameCount++;
      
      // Use requestAnimationFrame if available, otherwise use setInterval
      if (hasRequestAnimationFrame) {
        requestAnimationFrame(measureFrameRate);
      } else {
        setTimeout(measureFrameRate, 16); // ~60 FPS fallback
      }
    };
    
    // Start monitoring
    if (hasRequestAnimationFrame) {
      requestAnimationFrame(measureFrameRate);
    } else {
      measureFrameRate();
    }
  }rate
 * Features: Memory management, frame rate monitoring, crash prevention
 */

import { 
  PixelRatio, 
  Dimensions, 
  Platform,
  InteractionManager,
  DeviceEventEmitter,
} from 'react-native';
import React from 'react';

interface PerformanceMetrics {
  frameRate: number;
  memoryUsage: number;
  renderTime: number;
  loadTime: number;
  crashCount: number;
  errorCount: number;
  sessionDuration: number;
}

interface PerformanceTarget {
  frameRate: number;      // 60 FPS
  loadTime: number;       // < 1000ms
  memoryLimit: number;    // < 512MB
  crashRate: number;      // < 0.05%
}

interface OptimizationConfig {
  enableImageOptimization: boolean;
  enableMemoryMonitoring: boolean;
  enableFrameRateMonitoring: boolean;
  enableCrashPrevention: boolean;
  maxCacheSize: number;
  preloadLimit: number;
}

class PerformanceOptimizationService {
  private static instance: PerformanceOptimizationService;
  private metrics: PerformanceMetrics;
  private targets: PerformanceTarget;
  private config: OptimizationConfig;
  private startTime: number;
  private frameCount: number;
  private lastFrameTime: number;
  private memoryWarningThreshold: number;
  private imageCache: Map<string, any>;
  private componentCache: Map<string, React.ComponentType>;
  private errorBoundaryEnabled: boolean;

  private constructor() {
    this.metrics = {
      frameRate: 60,
      memoryUsage: 0,
      renderTime: 0,
      loadTime: 0,
      crashCount: 0,
      errorCount: 0,
      sessionDuration: 0,
    };

    this.targets = {
      frameRate: 60,
      loadTime: 1000,
      memoryLimit: 512 * 1024 * 1024, // 512MB
      crashRate: 0.0005, // 0.05%
    };

    this.config = {
      enableImageOptimization: true,
      enableMemoryMonitoring: true,
      enableFrameRateMonitoring: true,
      enableCrashPrevention: true,
      maxCacheSize: 100 * 1024 * 1024, // 100MB
      preloadLimit: 10,
    };

    this.startTime = Date.now();
    this.frameCount = 0;
    this.lastFrameTime = Date.now();
    this.memoryWarningThreshold = 400 * 1024 * 1024; // 400MB warning
    this.imageCache = new Map();
    this.componentCache = new Map();
    this.errorBoundaryEnabled = true;

    this.initialize();
  }

  static getInstance(): PerformanceOptimizationService {
    if (!this.instance) {
      this.instance = new PerformanceOptimizationService();
    }
    return this.instance;
  }

  private initialize() {
    this.setupFrameRateMonitoring();
    this.setupMemoryMonitoring();
    this.setupErrorHandling();
    this.optimizeRendering();
  }

  // === FRAME RATE OPTIMIZATION ===
  
  private setupFrameRateMonitoring() {
    if (!this.config.enableFrameRateMonitoring) return;

    // Check if requestAnimationFrame is available (web environment)
    const hasRequestAnimationFrame = typeof requestAnimationFrame !== 'undefined';
    
    // Monitor frame rate using requestAnimationFrame or setInterval fallback
    const measureFrameRate = () => {
      const now = Date.now();
      const deltaTime = now - this.lastFrameTime;
      this.lastFrameTime = now;
      
      if (deltaTime > 0) {
        const currentFPS = 1000 / deltaTime;
        this.metrics.frameRate = (this.metrics.frameRate * 0.9) + (currentFPS * 0.1);
      }
      
      this.frameCount++;
      
      // Use requestAnimationFrame if available, otherwise use setInterval
      if (hasRequestAnimationFrame) {
        requestAnimationFrame(measureFrameRate);
      } else {
        setTimeout(measureFrameRate, 16); // ~60 FPS fallback
      }
    };
    
    // Start monitoring
    if (hasRequestAnimationFrame) {
      requestAnimationFrame(measureFrameRate);
    } else {
      measureFrameRate();
    }
  }

  optimizeFrameRate(): void {
    // Reduce unnecessary re-renders
    this.debounceAnimations();
    this.optimizeFlatLists();
    this.reduceOverdraw();
  }

  private debounceAnimations() {
    // Debounce animation updates to prevent frame drops
    let animationFrameId: number;
    
    return (callback: () => void) => {
      if (animationFrameId) {
        // Check if cancelAnimationFrame is available
        if (typeof cancelAnimationFrame !== 'undefined') {
          cancelAnimationFrame(animationFrameId);
        } else {
          clearTimeout(animationFrameId);
        }
      }
      
      // Use requestAnimationFrame if available, otherwise use setTimeout
      if (typeof requestAnimationFrame !== 'undefined') {
        animationFrameId = requestAnimationFrame(() => {
          InteractionManager.runAfterInteractions(callback);
        });
      } else {
        animationFrameId = setTimeout(() => {
          InteractionManager.runAfterInteractions(callback);
        }, 16);
      }
    };
  }

  private optimizeFlatLists() {
    // Default optimization settings for FlatList components
    return {
      removeClippedSubviews: true,
      maxToRenderPerBatch: 10,
      updateCellsBatchingPeriod: 16,
      initialNumToRender: 8,
      windowSize: 5,
      getItemLayout: (data: any[], index: number) => ({
        length: 100, // Estimated item height
        offset: 100 * index,
        index,
      }),
    };
  }

  private reduceOverdraw() {
    // Techniques to reduce overdraw
    return {
      backgroundColor: 'transparent',
      useNativeDriver: true,
      shouldRasterizeIOS: true,
    };
  }

  // === MEMORY OPTIMIZATION ===
  
  private setupMemoryMonitoring() {
    if (!this.config.enableMemoryMonitoring) return;

    setInterval(() => {
      this.checkMemoryUsage();
    }, 5000); // Check every 5 seconds
  }

  private async checkMemoryUsage() {
    try {
      // MemoryProfiler is not available in Expo; use a stub or skip
      // Set memoryUsage to 0 or a placeholder value
      this.metrics.memoryUsage = 0;
      // Optionally, trigger warning if needed
      if (this.metrics.memoryUsage > this.memoryWarningThreshold) {
        this.handleMemoryWarning();
      }
    } catch (error) {
      console.warn('Memory monitoring failed:', error);
    }
  }

  private handleMemoryWarning() {
    console.warn('Memory usage high, triggering cleanup');
    
    // Clear image cache
    this.clearImageCache();
    
    // Clear component cache
    this.clearComponentCache();
    
    // Removed: global.gc(); not available in React Native/Expo
    
    DeviceEventEmitter.emit('memoryWarning');
  }

  optimizeMemoryUsage(): void {
    this.implementImageCaching();
    this.implementComponentCaching();
    this.optimizeAssets();
  }

  private implementImageCaching() {
    return {
      cacheImage: (uri: string, image: any) => {
        if (this.imageCache.size < 50) { // Limit cache size
          this.imageCache.set(uri, image);
        }
      },
      getCachedImage: (uri: string) => {
        return this.imageCache.get(uri);
      },
      preloadImages: (uris: string[]) => {
        const limited = uris.slice(0, this.config.preloadLimit);
        return Promise.all(
          limited.map(uri => {
            if (!this.imageCache.has(uri)) {
              return this.loadImageWithCache(uri);
            }
            return Promise.resolve();
          })
        );
      }
    };
  }

  private async loadImageWithCache(uri: string): Promise<void> {
    try {
      // Implement image loading with cache
      const response = await fetch(uri);
      const blob = await response.blob();
      this.imageCache.set(uri, blob);
    } catch (error) {
      console.warn('Image preload failed:', error);
    }
  }

  private implementComponentCaching() {
    return {
      cacheComponent: (key: string, component: React.ComponentType) => {
        this.componentCache.set(key, component);
      },
      
      getCachedComponent: (key: string) => {
        return this.componentCache.get(key);
      }
    };
  }

  private optimizeAssets() {
    const pixelRatio = PixelRatio.get();
    const { width, height } = Dimensions.get('window');
    
    return {
      getOptimalImageSize: (originalWidth: number, originalHeight: number) => {
        const maxWidth = width * pixelRatio;
        const maxHeight = height * pixelRatio;
        
        const aspectRatio = originalWidth / originalHeight;
        
        if (originalWidth > maxWidth) {
          return {
            width: maxWidth,
            height: maxWidth / aspectRatio,
          };
        }
        
        if (originalHeight > maxHeight) {
          return {
            width: maxHeight * aspectRatio,
            height: maxHeight,
          };
        }
        
        return {
          width: originalWidth,
          height: originalHeight,
        };
      },
      
      getImageFormat: () => {
        return Platform.OS === 'ios' ? 'webp' : 'webp';
      }
    };
  }

  clearImageCache(): void {
    this.imageCache.clear();
  }

  clearComponentCache(): void {
    this.componentCache.clear();
  }

  // === LOAD TIME OPTIMIZATION ===
  
  optimizeLoadTime(): void {
    this.implementLazyLoading();
    this.optimizeNetworkRequests();
    this.implementProgressiveLoading();
  }

  private implementLazyLoading() {
    return {
      createLazyComponent: (loader: () => Promise<{ default: React.ComponentType }>) => {
        return React.lazy(loader);
      },
      
      createSuspenseWrapper: (children: React.ReactNode, fallback?: React.ReactNode) => {
        return React.createElement(
          React.Suspense,
          { fallback: fallback || 'Loading...' },
          children
        );
      }
    };
  }

  private optimizeNetworkRequests() {
    return {
      batchRequests: (requests: Promise<any>[]) => {
        return Promise.allSettled(requests);
      },
      
      cacheResponses: new Map<string, any>(),
      
      getCachedResponse: function(key: string) {
        return this.cacheResponses.get(key);
      },
      
      setCachedResponse: function(key: string, response: any) {
        this.cacheResponses.set(key, response);
      }
    };
  }

  private implementProgressiveLoading() {
    return {
      loadCriticalResources: async () => {
        // Load only essential resources first
        const criticalResources = [
          'theme',
          'user-preferences',
          'venue-search-index'
        ];
        
        return Promise.all(
          criticalResources.map(resource => this.loadResource(resource))
        );
      },
      
      loadSecondaryResources: async () => {
        // Load non-essential resources after critical ones
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const secondaryResources = [
          'venue-images',
          'ar-models',
          'map-tiles'
        ];
        
        return Promise.all(
          secondaryResources.map(resource => this.loadResource(resource))
        );
      }
    };
  }

  private async loadResource(resourceType: string): Promise<void> {
    const startTime = Date.now();
    
    try {
      // Simulate resource loading
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
      
      const loadTime = Date.now() - startTime;
      this.metrics.loadTime = Math.max(this.metrics.loadTime, loadTime);
      
    } catch (error) {
      this.metrics.errorCount++;
      throw error;
    }
  }

  // === CRASH PREVENTION ===
  
  private setupErrorHandling() {
    if (!this.config.enableCrashPrevention) return;

    // Global error handler
    const originalConsoleError = console.error;
    console.error = (...args) => {
      this.metrics.errorCount++;
      this.handleError(new Error(args.join(' ')));
      originalConsoleError.apply(console, args);
    };

    // Removed: global.addEventListener for 'unhandledrejection' (not available in React Native/Expo)
  }

  private handleError(error: Error) {
    console.warn('Performance service caught error:', error.message);
    
    // Implement error recovery strategies
    if (error.message.includes('Network')) {
      this.handleNetworkError();
    } else if (error.message.includes('Memory')) {
      this.handleMemoryError();
    } else {
      this.handleGenericError(error);
    }
  }

  private handleNetworkError() {
    // Implement network error recovery
    console.log('Implementing network error recovery');
  }

  private handleMemoryError() {
    // Implement memory error recovery
    this.handleMemoryWarning();
  }

  private handleGenericError(error: Error) {
    // Log error for analysis
    this.logErrorForAnalytics(error);
  }

  private logErrorForAnalytics(error: Error) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      metrics: this.metrics,
      platform: Platform.OS,
    };
    
    // In production, send to analytics service
    console.log('Error logged for analytics:', errorData);
  }

  createErrorBoundary(): React.ComponentType<any> {
    return class PerformanceErrorBoundary extends React.Component<
      { children: React.ReactNode },
      { hasError: boolean }
    > {
      constructor(props: any) {
        super(props);
        this.state = { hasError: false };
      }

      static getDerivedStateFromError(error: Error) {
        PerformanceOptimizationService.getInstance().handleError(error);
        return { hasError: true };
      }

      componentDidCatch(error: Error, errorInfo: any) {
        console.error('Error boundary caught error:', error, errorInfo);
      }

      render() {
        if (this.state.hasError) {
          return React.createElement('div', { 
            style: { 
              padding: 20, 
              textAlign: 'center' as const,
              backgroundColor: '#f5f5f5',
              borderRadius: 8 
            } 
          }, 'Something went wrong. Please try again.');
        }

        return this.props.children;
      }
    };
  }

  // === RENDERING OPTIMIZATION ===
  
  private optimizeRendering() {
    // Implement rendering optimizations
    this.setupRenderProfiling();
  }

  private setupRenderProfiling() {
    return {
      startRender: () => Date.now(),
      endRender: (startTime: number) => {
        const renderTime = Date.now() - startTime;
        this.metrics.renderTime = (this.metrics.renderTime * 0.9) + (renderTime * 0.1);
        
        if (renderTime > 16) { // 60fps = 16ms per frame
          console.warn(`Slow render detected: ${renderTime}ms`);
        }
      }
    };
  }

  // === PERFORMANCE MONITORING ===
  
  getMetrics(): PerformanceMetrics {
    this.metrics.sessionDuration = Date.now() - this.startTime;
    return { ...this.metrics };
  }

  getTargets(): PerformanceTarget {
    return { ...this.targets };
  }

  isPerformanceOptimal(): boolean {
    const metrics = this.getMetrics();
    
    return (
      metrics.frameRate >= this.targets.frameRate * 0.9 && // 90% of target FPS
      metrics.loadTime <= this.targets.loadTime &&
      metrics.memoryUsage <= this.targets.memoryLimit &&
      (metrics.crashCount / (metrics.sessionDuration / 1000)) <= this.targets.crashRate
    );
  }

  getPerformanceReport(): {
    overall: 'excellent' | 'good' | 'fair' | 'poor';
    metrics: PerformanceMetrics;
    targets: PerformanceTarget;
    recommendations: string[];
  } {
    const metrics = this.getMetrics();
    const recommendations: string[] = [];
    
    let score = 0;
    
    // Frame rate scoring
    if (metrics.frameRate >= this.targets.frameRate) score += 25;
    else if (metrics.frameRate >= this.targets.frameRate * 0.8) score += 15;
    else recommendations.push('Optimize rendering to improve frame rate');
    
    // Load time scoring
    if (metrics.loadTime <= this.targets.loadTime) score += 25;
    else if (metrics.loadTime <= this.targets.loadTime * 1.5) score += 15;
    else recommendations.push('Optimize resource loading to reduce load time');
    
    // Memory scoring
    if (metrics.memoryUsage <= this.targets.memoryLimit) score += 25;
    else if (metrics.memoryUsage <= this.targets.memoryLimit * 1.2) score += 15;
    else recommendations.push('Optimize memory usage');
    
    // Crash rate scoring
    const crashRate = metrics.crashCount / (metrics.sessionDuration / 1000);
    if (crashRate <= this.targets.crashRate) score += 25;
    else recommendations.push('Improve error handling to reduce crashes');
    
    let overall: 'excellent' | 'good' | 'fair' | 'poor';
    if (score >= 90) overall = 'excellent';
    else if (score >= 70) overall = 'good';
    else if (score >= 50) overall = 'fair';
    else overall = 'poor';
    
    return {
      overall,
      metrics,
      targets: this.targets,
      recommendations,
    };
  }

  // === PUBLIC OPTIMIZATION METHODS ===
  
  optimizeApp(): void {
    this.optimizeFrameRate();
    this.optimizeMemoryUsage();
    this.optimizeLoadTime();
  }

  clearAllCaches(): void {
    this.clearImageCache();
    this.clearComponentCache();
  }

  setConfig(newConfig: Partial<OptimizationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  startPerformanceMonitoring(): void {
    console.log('Performance monitoring started');
    this.startTime = Date.now();
    this.metrics.crashCount = 0;
    this.metrics.errorCount = 0;
  }

  stopPerformanceMonitoring(): PerformanceMetrics {
    console.log('Performance monitoring stopped');
    return this.getMetrics();
  }
}

// Export singleton instance
export const performanceOptimizationService = PerformanceOptimizationService.getInstance();
export default performanceOptimizationService;
