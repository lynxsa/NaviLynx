import React, { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';
import { AppState, AppStateStatus } from 'react-native';

// Performance metrics interfaces
export interface PerformanceMetric {
  id: string;
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
  category: PerformanceCategory;
}

export enum PerformanceCategory {
  NAVIGATION = 'NAVIGATION',
  AR_RENDERING = 'AR_RENDERING',
  API_CALL = 'API_CALL',
  UI_INTERACTION = 'UI_INTERACTION',
  DATABASE = 'DATABASE',
  CAMERA = 'CAMERA',
  LOCATION = 'LOCATION',
  STARTUP = 'STARTUP',
  MEMORY = 'MEMORY'
}

export interface PerformanceStats {
  averageApiResponseTime: number;
  totalApiCalls: number;
  averageNavigationTime: number;
  memoryUsage: number;
  arFrameRate: number;
  crashCount: number;
  lastUpdated: Date;
}

export interface PerformanceContextType {
  metrics: PerformanceMetric[];
  stats: PerformanceStats;
  startMetric: (name: string, category: PerformanceCategory, metadata?: Record<string, any>) => string;
  endMetric: (metricId: string) => void;
  recordApiCall: (endpoint: string, duration: number, success: boolean) => void;
  recordNavigation: (from: string, to: string, duration: number) => void;
  recordARFrame: (frameTime: number) => void;
  getMetricsByCategory: (category: PerformanceCategory) => PerformanceMetric[];
  getAverageMetricTime: (category: PerformanceCategory) => number;
  clearMetrics: () => void;
  enableAutoMetrics: (enabled: boolean) => void;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
};

interface PerformanceProviderProps {
  children: ReactNode;
}

export const PerformanceProvider: React.FC<PerformanceProviderProps> = ({ children }) => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [stats, setStats] = useState<PerformanceStats>({
    averageApiResponseTime: 0,
    totalApiCalls: 0,
    averageNavigationTime: 0,
    memoryUsage: 0,
    arFrameRate: 60,
    crashCount: 0,
    lastUpdated: new Date()
  });
  
  const metricIdCounter = useRef(0);
  const activeMetrics = useRef<Map<string, PerformanceMetric>>(new Map());
  const arFrameTimes = useRef<number[]>([]);

  // Generate unique metric ID
  const generateMetricId = useCallback(() => {
    metricIdCounter.current += 1;
    return `metric_${Date.now()}_${metricIdCounter.current}`;
  }, []);

  // Start performance metric
  const startMetric = useCallback((
    name: string, 
    category: PerformanceCategory, 
    metadata?: Record<string, any>
  ): string => {
    const metricId = generateMetricId();
    const metric: PerformanceMetric = {
      id: metricId,
      name,
      startTime: performance.now(),
      category,
      metadata
    };
    
    activeMetrics.current.set(metricId, metric);
    
    if (__DEV__) {
      console.log(`Performance: Started ${name} (${category})`);
    }
    
    return metricId;
  }, [generateMetricId]);

  // End performance metric
  const endMetric = useCallback((metricId: string) => {
    const metric = activeMetrics.current.get(metricId);
    if (!metric) {
      console.warn(`Performance: Metric ${metricId} not found`);
      return;
    }
    
    const endTime = performance.now();
    const duration = endTime - metric.startTime;
    
    const completedMetric: PerformanceMetric = {
      ...metric,
      endTime,
      duration
    };
    
    // Add to completed metrics
    setMetrics(prev => [...prev.slice(-99), completedMetric]); // Keep last 100 metrics
    
    // Remove from active metrics
    activeMetrics.current.delete(metricId);
    
    if (__DEV__) {
      console.log(`Performance: Ended ${metric.name} in ${duration.toFixed(2)}ms`);
    }
  }, []);

  // Record API call performance
  const recordApiCall = useCallback((endpoint: string, duration: number, success: boolean) => {
    const metric: PerformanceMetric = {
      id: generateMetricId(),
      name: `API: ${endpoint}`,
      startTime: performance.now() - duration,
      endTime: performance.now(),
      duration,
      category: PerformanceCategory.API_CALL,
      metadata: {
        endpoint,
        success,
        method: 'GET'
      }
    };
    
    setMetrics(prev => [...prev.slice(-99), metric]);
    
    // Update API stats
    setStats(prevStats => ({
      ...prevStats,
      totalApiCalls: prevStats.totalApiCalls + 1,
      averageApiResponseTime: 
        (prevStats.averageApiResponseTime * prevStats.totalApiCalls + duration) / 
        (prevStats.totalApiCalls + 1),
      lastUpdated: new Date()
    }));
  }, [generateMetricId]);

  // Record navigation performance
  const recordNavigation = useCallback((from: string, to: string, duration: number) => {
    const metric: PerformanceMetric = {
      id: generateMetricId(),
      name: `Navigation: ${from} → ${to}`,
      startTime: performance.now() - duration,
      endTime: performance.now(),
      duration,
      category: PerformanceCategory.NAVIGATION,
      metadata: {
        from,
        to,
        route: `${from}->${to}`
      }
    };
    
    setMetrics(prev => [...prev.slice(-99), metric]);
  }, [generateMetricId]);

  // Record AR frame performance
  const recordARFrame = useCallback((frameTime: number) => {
    arFrameTimes.current.push(frameTime);
    
    // Keep only last 60 frames (1 second at 60fps)
    if (arFrameTimes.current.length > 60) {
      arFrameTimes.current = arFrameTimes.current.slice(-60);
    }
    
    // Calculate current frame rate
    const averageFrameTime = arFrameTimes.current.reduce((sum, time) => sum + time, 0) / arFrameTimes.current.length;
    const frameRate = 1000 / averageFrameTime; // Convert to FPS
    
    setStats(prev => ({
      ...prev,
      arFrameRate: Math.min(60, Math.max(1, frameRate)),
      lastUpdated: new Date()
    }));
  }, []);

  // Get metrics by category
  const getMetricsByCategory = useCallback((category: PerformanceCategory) => {
    return metrics.filter(metric => metric.category === category);
  }, [metrics]);

  // Get average metric time for category
  const getAverageMetricTime = useCallback((category: PerformanceCategory) => {
    const categoryMetrics = getMetricsByCategory(category);
    if (categoryMetrics.length === 0) return 0;
    
    const totalTime = categoryMetrics.reduce((sum, metric) => sum + (metric.duration || 0), 0);
    return totalTime / categoryMetrics.length;
  }, [getMetricsByCategory]);

  // Clear all metrics
  const clearMetrics = useCallback(() => {
    setMetrics([]);
    activeMetrics.current.clear();
    arFrameTimes.current = [];
    setStats({
      averageApiResponseTime: 0,
      totalApiCalls: 0,
      averageNavigationTime: 0,
      memoryUsage: 0,
      arFrameRate: 60,
      crashCount: 0,
      lastUpdated: new Date()
    });
  }, []);

  // Enable/disable automatic performance monitoring
  const enableAutoMetrics = useCallback((enabled: boolean) => {
    if (enabled) {
      // Start monitoring app state changes
      const handleAppStateChange = (nextAppState: AppStateStatus) => {
        const metric: PerformanceMetric = {
          id: generateMetricId(),
          name: `App State Change: ${nextAppState}`,
          startTime: performance.now(),
          endTime: performance.now(),
          duration: 0,
          category: PerformanceCategory.STARTUP,
          metadata: {
            to: nextAppState
          }
        };
        
        setMetrics(prev => [...prev.slice(-99), metric]);
      };
      
      const subscription = AppState.addEventListener('change', handleAppStateChange);
      return () => subscription?.remove();
    }
  }, [generateMetricId]);

  const value: PerformanceContextType = {
    metrics,
    stats,
    startMetric,
    endMetric,
    recordApiCall,
    recordNavigation,
    recordARFrame,
    getMetricsByCategory,
    getAverageMetricTime,
    clearMetrics,
    enableAutoMetrics
  };

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
};

// Helper hooks for specific performance monitoring
export const useApiPerformance = () => {
  const { recordApiCall, stats } = usePerformance();
  
  const trackApiCall = useCallback(async (
    endpoint: string,
    apiCall: () => Promise<any>
  ) => {
    const startTime = performance.now();
    try {
      const result = await apiCall();
      const duration = performance.now() - startTime;
      recordApiCall(endpoint, duration, true);
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      recordApiCall(endpoint, duration, false);
      throw error;
    }
  }, [recordApiCall]);
  
  return {
    trackApiCall,
    averageResponseTime: stats.averageApiResponseTime,
    totalApiCalls: stats.totalApiCalls
  };
};

export default PerformanceProvider;
