/**
 * Performance monitoring and optimization service
 * Tracks app performance metrics and provides optimization insights
 */

import { Platform } from 'react-native';

interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

interface MemoryUsage {
  used: number;
  total: number;
  percentage: number;
  timestamp: number;
}

interface NetworkMetric {
  url: string;
  method: string;
  startTime: number;
  endTime?: number;
  responseTime?: number;
  status?: number;
  error?: string;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, PerformanceMetric> = new Map();
  private networkMetrics: NetworkMetric[] = [];
  private memoryUsage: MemoryUsage[] = [];
  private isMonitoring = false;
  private memoryCheckInterval?: any;

  private constructor() {
    this.startMemoryMonitoring();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Start timing a performance metric
   */
  startTiming(name: string, metadata?: Record<string, any>): void {
    const metric: PerformanceMetric = {
      name,
      startTime: Date.now(),
      metadata,
    };
    
    this.metrics.set(name, metric);
    console.log(`⏱️ Started timing: ${name}`);
  }

  /**
   * End timing and calculate duration
   */
  endTiming(name: string): number | null {
    const metric = this.metrics.get(name);
    if (!metric) {
      console.warn(`⚠️ No metric found for: ${name}`);
      return null;
    }

    metric.endTime = Date.now();
    metric.duration = metric.endTime - metric.startTime;

    console.log(`✅ Completed timing: ${name} (${metric.duration}ms)`);
    
    // Log slow operations
    if (metric.duration > 1000) {
      console.warn(`🐌 Slow operation detected: ${name} took ${metric.duration}ms`);
    }

    return metric.duration;
  }

  /**
   * Track network request performance
   */
  trackNetworkRequest(url: string, method: string = 'GET'): string {
    const requestId = `${method}_${url}_${Date.now()}`;
    const networkMetric: NetworkMetric = {
      url,
      method,
      startTime: Date.now(),
    };

    this.networkMetrics.push(networkMetric);
    return requestId;
  }

  /**
   * Complete network request tracking
   */
  completeNetworkRequest(
    url: string, 
    method: string = 'GET', 
    status?: number, 
    error?: string
  ): void {
    const metric = this.networkMetrics.find(
      m => m.url === url && m.method === method && !m.endTime
    );

    if (metric) {
      metric.endTime = Date.now();
      metric.responseTime = metric.endTime - metric.startTime;
      metric.status = status;
      metric.error = error;

      // Log slow network requests
      if (metric.responseTime > 3000) {
        console.warn(`🌐 Slow network request: ${method} ${url} took ${metric.responseTime}ms`);
      }

      // Log failed requests
      if (error || (status && status >= 400)) {
        console.error(`❌ Failed network request: ${method} ${url} - ${error || status}`);
      }
    }
  }

  /**
   * Start memory monitoring
   */
  private startMemoryMonitoring(): void {
    if (Platform.OS === 'web') return; // Skip for web platform

    this.memoryCheckInterval = setInterval(() => {
      try {
        // Note: React Native doesn't have direct memory APIs
        // This is a placeholder for when performance APIs are available
        const memoryInfo = this.getMemoryInfo();
        this.memoryUsage.push(memoryInfo);

        // Keep only last 100 memory readings
        if (this.memoryUsage.length > 100) {
          this.memoryUsage = this.memoryUsage.slice(-100);
        }

        // Alert on high memory usage
        if (memoryInfo.percentage > 85) {
          console.warn(`💾 High memory usage: ${memoryInfo.percentage}%`);
        }
      } catch (error) {
        console.error('Memory monitoring error:', error);
      }
    }, 10000); // Check every 10 seconds
  }

  /**
   * Get estimated memory info (placeholder)
   */
  private getMemoryInfo(): MemoryUsage {
    // This is a simplified estimation
    // In a real app, you'd use platform-specific APIs
    return {
      used: 0,
      total: 0,
      percentage: 0,
      timestamp: Date.now(),
    };
  }

  /**
   * Get performance report
   */
  getPerformanceReport(): {
    metrics: PerformanceMetric[];
    networkMetrics: NetworkMetric[];
    memoryUsage: MemoryUsage[];
    summary: {
      slowOperations: PerformanceMetric[];
      failedRequests: NetworkMetric[];
      averageResponseTime: number;
      peakMemoryUsage: number;
    };
  } {
    const metrics = Array.from(this.metrics.values()).filter(m => m.duration);
    const slowOperations = metrics.filter(m => m.duration! > 1000);
    const failedRequests = this.networkMetrics.filter(m => m.error || (m.status && m.status >= 400));
    
    const responseTimesSum = this.networkMetrics
      .filter(m => m.responseTime)
      .reduce((sum, m) => sum + m.responseTime!, 0);
    const averageResponseTime = responseTimesSum / Math.max(this.networkMetrics.length, 1);

    const peakMemoryUsage = Math.max(...this.memoryUsage.map(m => m.percentage), 0);

    return {
      metrics,
      networkMetrics: this.networkMetrics,
      memoryUsage: this.memoryUsage,
      summary: {
        slowOperations,
        failedRequests,
        averageResponseTime,
        peakMemoryUsage,
      },
    };
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics.clear();
    this.networkMetrics = [];
    this.memoryUsage = [];
    console.log('🧹 Performance metrics cleared');
  }

  /**
   * Get optimization recommendations
   */
  getOptimizationRecommendations(): string[] {
    const report = this.getPerformanceReport();
    const recommendations: string[] = [];

    // Check for slow operations
    if (report.summary.slowOperations.length > 0) {
      recommendations.push(
        `Found ${report.summary.slowOperations.length} slow operations. Consider optimizing: ${
          report.summary.slowOperations.map(op => op.name).join(', ')
        }`
      );
    }

    // Check for failed requests
    if (report.summary.failedRequests.length > 0) {
      recommendations.push(
        `${report.summary.failedRequests.length} network requests failed. Implement retry logic and better error handling.`
      );
    }

    // Check average response time
    if (report.summary.averageResponseTime > 2000) {
      recommendations.push(
        `Average network response time is ${Math.round(report.summary.averageResponseTime)}ms. Consider caching and request optimization.`
      );
    }

    // Check memory usage
    if (report.summary.peakMemoryUsage > 80) {
      recommendations.push(
        `Peak memory usage reached ${report.summary.peakMemoryUsage}%. Consider implementing memory management optimizations.`
      );
    }

    // General recommendations
    if (recommendations.length === 0) {
      recommendations.push('Performance looks good! Continue monitoring for optimal user experience.');
    }

    return recommendations;
  }

  /**
   * Enable/disable monitoring
   */
  setMonitoring(enabled: boolean): void {
    this.isMonitoring = enabled;
    
    if (!enabled && this.memoryCheckInterval) {
      clearInterval(this.memoryCheckInterval);
      this.memoryCheckInterval = undefined;
    } else if (enabled && !this.memoryCheckInterval) {
      this.startMemoryMonitoring();
    }
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    if (this.memoryCheckInterval) {
      clearInterval(this.memoryCheckInterval);
    }
    this.clearMetrics();
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// Utility functions for easy usage
export const timing = {
  start: (name: string, metadata?: Record<string, any>) => 
    performanceMonitor.startTiming(name, metadata),
  
  end: (name: string) => 
    performanceMonitor.endTiming(name),
    
  measure: async <T>(name: string, fn: () => Promise<T>): Promise<T> => {
    performanceMonitor.startTiming(name);
    try {
      const result = await fn();
      return result;
    } finally {
      performanceMonitor.endTiming(name);
    }
  },
};

export const network = {
  track: (url: string, method?: string) => 
    performanceMonitor.trackNetworkRequest(url, method),
    
  complete: (url: string, method?: string, status?: number, error?: string) => 
    performanceMonitor.completeNetworkRequest(url, method, status, error),
};
