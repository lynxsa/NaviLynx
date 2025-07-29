import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Alert } from 'react-native';

// Enhanced error types for better categorization
export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTH = 'AUTH',
  VALIDATION = 'VALIDATION',
  PERMISSION = 'PERMISSION',
  API = 'API',
  UNKNOWN = 'UNKNOWN',
  AR = 'AR',
  NAVIGATION = 'NAVIGATION',
  STORAGE = 'STORAGE',
  CAMERA = 'CAMERA',
  LOCATION = 'LOCATION'
}

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface AppError {
  id: string;
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  details?: string;
  timestamp: Date;
  userId?: string;
  screen?: string;
  action?: string;
  stack?: string;
  metadata?: Record<string, any>;
}

export interface ErrorHandlerContextType {
  errors: AppError[];
  reportError: (error: Partial<AppError>) => void;
  clearError: (errorId: string) => void;
  clearAllErrors: () => void;
  handleAsyncError: (
    operation: () => Promise<any>,
    errorType?: ErrorType,
    customMessage?: string
  ) => Promise<any | null>;
  getErrorsByType: (type: ErrorType) => AppError[];
  getErrorsBySeverity: (severity: ErrorSeverity) => AppError[];
}

const ErrorHandlerContext = createContext<ErrorHandlerContextType | undefined>(undefined);

export const useErrorHandler = () => {
  const context = useContext(ErrorHandlerContext);
  if (!context) {
    throw new Error('useErrorHandler must be used within an ErrorHandlerProvider');
  }
  return context;
};

interface ErrorHandlerProviderProps {
  children: ReactNode;
}

export const ErrorHandlerProvider: React.FC<ErrorHandlerProviderProps> = ({ children }) => {
  const [errors, setErrors] = useState<AppError[]>([]);

  const generateErrorId = () => {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const reportToCrashlytics = (error: AppError) => {
    // Integration with crash reporting service (Firebase Crashlytics, Sentry, etc.)
    if (__DEV__) {
      console.log('Would report to crashlytics:', error);
    }
    // TODO: Implement actual crash reporting
  };

  const reportError = useCallback((errorData: Partial<AppError>) => {
    const error: AppError = {
      id: generateErrorId(),
      type: errorData.type || ErrorType.UNKNOWN,
      severity: errorData.severity || ErrorSeverity.MEDIUM,
      message: errorData.message || 'An unknown error occurred',
      details: errorData.details,
      timestamp: new Date(),
      userId: errorData.userId,
      screen: errorData.screen,
      action: errorData.action,
      stack: errorData.stack,
      metadata: errorData.metadata
    };

    setErrors(prev => [...prev, error]);

    // Log error to console for development
    if (__DEV__) {
      console.error('App Error Reported:', error);
    }

    // Handle critical errors immediately
    if (error.severity === ErrorSeverity.CRITICAL) {
      Alert.alert(
        'Critical Error',
        error.message,
        [
          {
            text: 'Report Issue',
            onPress: () => {
              // Report to crash analytics service
              reportToCrashlytics(error);
            }
          },
          {
            text: 'Continue',
            style: 'cancel'
          }
        ]
      );
    }

    // Auto-report high severity errors
    if (error.severity === ErrorSeverity.HIGH) {
      reportToCrashlytics(error);
    }
  }, []);

  const clearError = useCallback((errorId: string) => {
    setErrors(prev => prev.filter(error => error.id !== errorId));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const handleAsyncError = useCallback(async (
    operation: () => Promise<any>,
    errorType: ErrorType = ErrorType.UNKNOWN,
    customMessage?: string
  ): Promise<any | null> => {
    try {
      return await operation();
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : customMessage || 'An unexpected error occurred';
      
      reportError({
        type: errorType,
        message: errorMessage,
        details: error instanceof Error ? error.stack : String(error),
        severity: ErrorSeverity.MEDIUM
      });
      
      return null;
    }
  }, [reportError]);

  const getErrorsByType = useCallback((type: ErrorType) => {
    return errors.filter(error => error.type === type);
  }, [errors]);

  const getErrorsBySeverity = useCallback((severity: ErrorSeverity) => {
    return errors.filter(error => error.severity === severity);
  }, [errors]);

  const value: ErrorHandlerContextType = {
    errors,
    reportError,
    clearError,
    clearAllErrors,
    handleAsyncError,
    getErrorsByType,
    getErrorsBySeverity
  };

  return (
    <ErrorHandlerContext.Provider value={value}>
      {children}
    </ErrorHandlerContext.Provider>
  );
};

// Helper hooks for specific error types
export const useNetworkError = () => {
  const { reportError } = useErrorHandler();
  
  return useCallback((message: string, details?: string) => {
    reportError({
      type: ErrorType.NETWORK,
      severity: ErrorSeverity.MEDIUM,
      message,
      details
    });
  }, [reportError]);
};

export const useAuthError = () => {
  const { reportError } = useErrorHandler();
  
  return useCallback((message: string, details?: string) => {
    reportError({
      type: ErrorType.AUTH,
      severity: ErrorSeverity.HIGH,
      message,
      details
    });
  }, [reportError]);
};

export const useARError = () => {
  const { reportError } = useErrorHandler();
  
  return useCallback((message: string, details?: string, metadata?: Record<string, any>) => {
    reportError({
      type: ErrorType.AR,
      severity: ErrorSeverity.MEDIUM,
      message,
      details,
      metadata
    });
  }, [reportError]);
};

export const useNavigationError = () => {
  const { reportError } = useErrorHandler();
  
  return useCallback((message: string, details?: string) => {
    reportError({
      type: ErrorType.NAVIGATION,
      severity: ErrorSeverity.MEDIUM,
      message,
      details
    });
  }, [reportError]);
};

export default ErrorHandlerProvider;
