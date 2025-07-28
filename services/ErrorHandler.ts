/**
 * 🛡️ Global Error Handling System - NaviLynx Production
 * 
 * World-class error handling with automatic recovery, user feedback,
 * and comprehensive logging for production monitoring
 * 
 * @author Senior Architect
 * @version 1.0.0 - Production Ready
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Share
} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { AnalyticsService, AnalyticsEventType } from '@/services/AnalyticsService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Error types classification
export enum ErrorType {
  NETWORK = 'network',
  PERMISSION = 'permission',
  LOCATION = 'location',
  CAMERA = 'camera',
  STORAGE = 'storage',
  NAVIGATION = 'navigation',
  AR = 'ar',
  AUTHENTICATION = 'authentication',
  VALIDATION = 'validation',
  RUNTIME = 'runtime',
  UNKNOWN = 'unknown'
}

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface AppError {
  id: string;
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  details?: string;
  stack?: string;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  context?: string;
  retryCount?: number;
  isRecoverable?: boolean;
  userAction?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: AppError | null;
  errorId: string | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: AppError, retry: () => void) => ReactNode;
  onError?: (error: AppError) => void;
}

/**
 * Global Error Boundary Component
 */
export class GlobalErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const appError = ErrorHandler.createAppError(
      ErrorType.RUNTIME,
      ErrorSeverity.CRITICAL,
      error.message,
      {
        details: error.stack,
        stack: error.stack,
        context: 'React Error Boundary'
      }
    );

    return {
      hasError: true,
      error: appError,
      errorId: appError.id
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const appError = this.state.error;
    if (appError) {
      // Enhanced error info
      appError.details = `${error.toString()}\n\nComponent Stack:\n${errorInfo.componentStack}`;
      
      // Log to error handler
      ErrorHandler.handleError(appError);
      
      // Notify parent if callback provided
      this.props.onError?.(appError);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorId: null
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry);
      }

      // Default error UI
      return (
        <ErrorFallbackScreen 
          error={this.state.error} 
          onRetry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Default Error Fallback Screen
 */
export const ErrorFallbackScreen: React.FC<{
  error: AppError;
  onRetry: () => void;
}> = ({ error, onRetry }) => {
  const handleReportError = async () => {
    try {
      const errorReport = {
        errorId: error.id,
        type: error.type,
        severity: error.severity,
        message: error.message,
        timestamp: error.timestamp.toISOString(),
        userAgent: 'NaviLynx Mobile App',
        appVersion: '1.0.0'
      };

      await Share.share({
        message: `NaviLynx Error Report\n\n${JSON.stringify(errorReport, null, 2)}`,
        title: 'NaviLynx Error Report'
      });
    } catch (shareError) {
      Alert.alert('Error', 'Unable to share error report');
    }
  };

  const getErrorIcon = () => {
    switch (error.type) {
      case ErrorType.NETWORK:
        return 'wifi.slash';
      case ErrorType.LOCATION:
        return 'location.slash';
      case ErrorType.CAMERA:
        return 'camera.slash';
      case ErrorType.PERMISSION:
        return 'lock.slash';
      default:
        return 'exclamationmark.triangle';
    }
  };

  const getErrorColor = () => {
    switch (error.severity) {
      case ErrorSeverity.CRITICAL:
        return '#DC2626';
      case ErrorSeverity.HIGH:
        return '#EA580C';
      case ErrorSeverity.MEDIUM:
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  return (
    <SafeAreaView style={styles.errorContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.errorContent}>
        <View style={[styles.errorIconContainer, { backgroundColor: getErrorColor() + '20' }]}>
          <IconSymbol 
            name={getErrorIcon() as any} 
            size={48} 
            color={getErrorColor()} 
          />
        </View>

        <Text style={styles.errorTitle}>
          {getErrorTitle(error.type)}
        </Text>

        <Text style={styles.errorMessage}>
          {getErrorMessage(error.type, error.message)}
        </Text>

        <View style={styles.errorActions}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: getErrorColor() }]}
            onPress={onRetry}
            activeOpacity={0.8}
          >
            <IconSymbol name="arrow.clockwise" size={20} color="#ffffff" />
            <Text style={styles.primaryButtonText}>Try Again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleReportError}
            activeOpacity={0.8}
          >
            <IconSymbol name="exclamationmark.bubble" size={20} color={getErrorColor()} />
            <Text style={[styles.secondaryButtonText, { color: getErrorColor() }]}>
              Report Issue
            </Text>
          </TouchableOpacity>
        </View>

        {error.type === ErrorType.NETWORK && (
          <View style={styles.helpSection}>
            <Text style={styles.helpTitle}>Troubleshooting Tips:</Text>
            <Text style={styles.helpText}>
              • Check your internet connection{'\n'}
              • Try switching between WiFi and mobile data{'\n'}
              • Restart the app if the problem persists
            </Text>
          </View>
        )}

        {error.severity === ErrorSeverity.CRITICAL && (
          <TouchableOpacity
            style={styles.supportButton}
            onPress={() => Linking.openURL('mailto:support@navilynx.com')}
          >
            <Text style={styles.supportButtonText}>
              Contact Support
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

/**
 * Main Error Handler Service
 */
export class ErrorHandler {
  private static errorQueue: AppError[] = [];
  private static maxQueueSize = 100;
  private static retryAttempts: Map<string, number> = new Map();

  /**
   * Create standardized app error
   */
  static createAppError(
    type: ErrorType,
    severity: ErrorSeverity,
    message: string,
    options: {
      details?: string;
      stack?: string;
      context?: string;
      userId?: string;
      sessionId?: string;
      isRecoverable?: boolean;
      userAction?: string;
    } = {}
  ): AppError {
    return {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      severity,
      message,
      timestamp: new Date(),
      retryCount: 0,
      isRecoverable: true,
      ...options
    };
  }

  /**
   * Handle error with comprehensive logging and recovery
   */
  static async handleError(error: AppError): Promise<void> {
    try {
      // Add to queue
      this.addToQueue(error);

      // Log to analytics
      await AnalyticsService.trackError(
        new Error(error.message),
        error.context,
        error.severity
      );

      // Store error locally
      await this.storeError(error);

      // Auto-recovery for recoverable errors
      if (error.isRecoverable && error.retryCount < 3) {
        await this.attemptRecovery(error);
      }

      // Show user notification for high severity errors
      if (error.severity === ErrorSeverity.HIGH || error.severity === ErrorSeverity.CRITICAL) {
        this.showErrorNotification(error);
      }

      console.error(`🚨 [${error.severity.toUpperCase()}] ${error.type}: ${error.message}`, error);
    } catch (handlingError) {
      console.error('Error in error handler:', handlingError);
    }
  }

  /**
   * Automatic error recovery
   */
  private static async attemptRecovery(error: AppError): Promise<boolean> {
    const retryKey = `${error.type}_${error.context}`;
    const currentRetries = this.retryAttempts.get(retryKey) || 0;

    if (currentRetries >= 3) {
      return false;
    }

    this.retryAttempts.set(retryKey, currentRetries + 1);

    try {
      switch (error.type) {
        case ErrorType.NETWORK:
          return await this.recoverNetworkError();
        case ErrorType.LOCATION:
          return await this.recoverLocationError();
        case ErrorType.STORAGE:
          return await this.recoverStorageError();
        default:
          return false;
      }
    } catch (recoveryError) {
      console.error('Recovery attempt failed:', recoveryError);
      return false;
    }
  }

  /**
   * Network error recovery
   */
  private static async recoverNetworkError(): Promise<boolean> {
    try {
      // Simple connectivity check
      const response = await fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD',
        cache: 'no-cache'
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Location error recovery
   */
  private static async recoverLocationError(): Promise<boolean> {
    try {
      // Re-request location permissions
      const LocationService = await import('@/services/LocationService');
      return await LocationService.LocationService.requestLocationPermission();
    } catch {
      return false;
    }
  }

  /**
   * Storage error recovery
   */
  private static async recoverStorageError(): Promise<boolean> {
    try {
      // Test storage access
      await AsyncStorage.setItem('test_key', 'test_value');
      await AsyncStorage.removeItem('test_key');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Add error to queue with size management
   */
  private static addToQueue(error: AppError): void {
    this.errorQueue.push(error);
    
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift(); // Remove oldest error
    }
  }

  /**
   * Store error locally for offline analysis
   */
  private static async storeError(error: AppError): Promise<void> {
    try {
      const errorKey = `error_${error.id}`;
      await AsyncStorage.setItem(errorKey, JSON.stringify(error));
      
      // Maintain error index
      const errorIndex = await AsyncStorage.getItem('error_index');
      const errors = errorIndex ? JSON.parse(errorIndex) : [];
      errors.push(error.id);
      
      // Keep only last 50 errors
      if (errors.length > 50) {
        const removedError = errors.shift();
        await AsyncStorage.removeItem(`error_${removedError}`);
      }
      
      await AsyncStorage.setItem('error_index', JSON.stringify(errors));
    } catch (storageError) {
      console.error('Failed to store error:', storageError);
    }
  }

  /**
   * Show user-friendly error notification
   */
  private static showErrorNotification(error: AppError): void {
    const title = getErrorTitle(error.type);
    const message = getErrorMessage(error.type, error.message);

    Alert.alert(
      title,
      message,
      [
        { text: 'OK', style: 'default' },
        ...(error.isRecoverable ? [{ 
          text: 'Retry', 
          onPress: () => this.attemptRecovery(error) 
        }] : [])
      ]
    );
  }

  /**
   * Get error analytics summary
   */
  static async getErrorAnalytics(): Promise<{
    totalErrors: number;
    errorsByType: Record<ErrorType, number>;
    errorsBySeverity: Record<ErrorSeverity, number>;
    topErrors: AppError[];
    recoveryRate: number;
  }> {
    try {
      const errorIndex = await AsyncStorage.getItem('error_index');
      const errorIds = errorIndex ? JSON.parse(errorIndex) : [];
      
      const errors: AppError[] = [];
      for (const errorId of errorIds) {
        const errorData = await AsyncStorage.getItem(`error_${errorId}`);
        if (errorData) {
          const error = JSON.parse(errorData);
          error.timestamp = new Date(error.timestamp);
          errors.push(error);
        }
      }

      const errorsByType = errors.reduce((acc, error) => {
        acc[error.type] = (acc[error.type] || 0) + 1;
        return acc;
      }, {} as Record<ErrorType, number>);

      const errorsBySeverity = errors.reduce((acc, error) => {
        acc[error.severity] = (acc[error.severity] || 0) + 1;
        return acc;
      }, {} as Record<ErrorSeverity, number>);

      const recoveredErrors = errors.filter(e => e.retryCount > 0 && e.isRecoverable);
      const recoveryRate = errors.length > 0 ? (recoveredErrors.length / errors.length) * 100 : 0;

      return {
        totalErrors: errors.length,
        errorsByType,
        errorsBySeverity,
        topErrors: errors.slice(0, 10),
        recoveryRate
      };
    } catch {
      return {
        totalErrors: 0,
        errorsByType: {} as Record<ErrorType, number>,
        errorsBySeverity: {} as Record<ErrorSeverity, number>,
        topErrors: [],
        recoveryRate: 0
      };
    }
  }
}

/**
 * Helper function to get user-friendly error titles
 */
function getErrorTitle(type: ErrorType): string {
  switch (type) {
    case ErrorType.NETWORK:
      return 'Connection Problem';
    case ErrorType.LOCATION:
      return 'Location Access Required';
    case ErrorType.CAMERA:
      return 'Camera Access Required';
    case ErrorType.PERMISSION:
      return 'Permission Required';
    case ErrorType.STORAGE:
      return 'Storage Error';
    case ErrorType.NAVIGATION:
      return 'Navigation Error';
    case ErrorType.AR:
      return 'AR Feature Unavailable';
    case ErrorType.AUTHENTICATION:
      return 'Authentication Required';
    case ErrorType.VALIDATION:
      return 'Invalid Input';
    case ErrorType.RUNTIME:
      return 'Application Error';
    default:
      return 'Unexpected Error';
  }
}

/**
 * Helper function to get user-friendly error messages
 */
function getErrorMessage(type: ErrorType, originalMessage: string): string {
  switch (type) {
    case ErrorType.NETWORK:
      return 'Please check your internet connection and try again.';
    case ErrorType.LOCATION:
      return 'NaviLynx needs location access to provide navigation services.';
    case ErrorType.CAMERA:
      return 'Camera access is required for AR navigation and barcode scanning.';
    case ErrorType.PERMISSION:
      return 'Please grant the required permissions to continue.';
    case ErrorType.STORAGE:
      return 'Unable to save data. Please check your device storage.';
    case ErrorType.NAVIGATION:
      return 'Unable to calculate route. Please try a different destination.';
    case ErrorType.AR:
      return 'AR features are not available on this device.';
    case ErrorType.AUTHENTICATION:
      return 'Please sign in to continue using NaviLynx.';
    case ErrorType.VALIDATION:
      return 'Please check your input and try again.';
    case ErrorType.RUNTIME:
      return 'Something went wrong. Please restart the app.';
    default:
      return originalMessage || 'An unexpected error occurred.';
  }
}

// Styles
const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  errorContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  errorMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  errorActions: {
    width: '100%',
    gap: 12,
    marginBottom: 24,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  helpSection: {
    width: '100%',
    padding: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 16,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  supportButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  supportButtonText: {
    fontSize: 14,
    color: '#6366F1',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default ErrorHandler;
