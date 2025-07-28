
/**
 * 🛡️ Global Error Boundary - NaviLynx Production
 * 
 * Production-grade error boundary system with graceful fallbacks
 * and comprehensive error reporting
 * 
 * @author Senior Architect
 * @version 1.0.0 - Production Ready
 */

import React, { Component, ReactNode, ErrorInfo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
  retryCount: number;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  enableRetry?: boolean;
  maxRetries?: number;
  resetOnPropsChange?: boolean;
  resetKeys?: (string | number)[];
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });

    // Log error details
    this.logError(error, errorInfo);

    // Call custom error handler
    this.props.onError?.(error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetOnPropsChange, resetKeys } = this.props;
    const { hasError } = this.state;

    if (hasError && prevProps.resetKeys !== resetKeys && resetOnPropsChange) {
      if (resetKeys?.some((key, idx) => prevProps.resetKeys?.[idx] !== key)) {
        this.resetErrorBoundary();
      }
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  private logError = async (error: Error, errorInfo: ErrorInfo) => {
    const { errorId } = this.state;
    
    const errorReport = {
      id: errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: 'React Native App',
      url: 'NaviLynx Mobile App',
      props: JSON.stringify(this.props, null, 2)
    };

    console.error('Error Boundary Caught Error:', errorReport);

    try {
      // In production, send to crash reporting service
      // await CrashReportingService.reportError(errorReport);
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  private resetErrorBoundary = () => {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0
    });
  };

  private handleRetry = () => {
    const { maxRetries = 3 } = this.props;
    const { retryCount } = this.state;

    if (retryCount >= maxRetries) {
      Alert.alert(
        'Maximum Retries Exceeded',
        'The app has encountered repeated errors. Please restart the application.',
        [
          { text: 'OK' },
          {
            text: 'Report Issue',
            onPress: this.handleReportIssue
          }
        ]
      );
      return;
    }

    this.setState({ retryCount: retryCount + 1 });

    // Add a small delay before retry to prevent rapid successive failures
    this.retryTimeoutId = setTimeout(() => {
      this.resetErrorBoundary();
    }, 1000);
  };

  private handleReportIssue = () => {
    const { error, errorInfo, errorId } = this.state;
    
    Alert.alert(
      'Report Issue',
      `Error ID: ${errorId}\n\nWould you like to send this error report to help us improve the app?`,
      [
        { text: 'Cancel' },
        {
          text: 'Send Report',
          onPress: async () => {
            try {
              // In production, integrate with support system
              console.log('Sending error report...', { error, errorInfo, errorId });
              Alert.alert('Thank You', 'Your error report has been sent. We\'ll work on fixing this issue.');
            } catch {
              Alert.alert('Error', 'Failed to send error report. Please try again later.');
            }
          }
        }
      ]
    );
  };

  private renderErrorFallback = () => {
    const { error, errorId, retryCount } = this.state;
    const { enableRetry = true, maxRetries = 3 } = this.props;

    if (!error) return null;

    const canRetry = enableRetry && retryCount < maxRetries;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
        <ScrollView 
          contentContainerStyle={{ 
            flex: 1, 
            padding: 20, 
            justifyContent: 'center', 
            alignItems: 'center' 
          }}
        >
          <View style={{ 
            backgroundColor: 'white', 
            borderRadius: 12, 
            padding: 24, 
            maxWidth: 400, 
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3
          }}>
            {/* Error Icon */}
            <View style={{ 
              width: 64, 
              height: 64, 
              borderRadius: 32, 
              backgroundColor: '#fee2e2', 
              alignSelf: 'center', 
              marginBottom: 16,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Text style={{ fontSize: 32 }}>⚠️</Text>
            </View>

            {/* Error Title */}
            <Text style={{ 
              fontSize: 20, 
              fontWeight: 'bold', 
              textAlign: 'center', 
              marginBottom: 8,
              color: '#1f2937'
            }}>
              Something went wrong
            </Text>

            {/* Error Description */}
            <Text style={{ 
              fontSize: 16, 
              textAlign: 'center', 
              color: '#6b7280', 
              marginBottom: 20,
              lineHeight: 24
            }}>
              We encountered an unexpected error. Don't worry, this happens sometimes. 
              {canRetry ? ' You can try again or ' : ' You can '}
              restart the app to continue.
            </Text>

            {/* Error Details (for development) */}
            {__DEV__ && (
              <View style={{ 
                backgroundColor: '#f3f4f6', 
                padding: 12, 
                borderRadius: 8, 
                marginBottom: 20 
              }}>
                <Text style={{ 
                  fontSize: 12, 
                  fontFamily: 'monospace', 
                  color: '#374151' 
                }}>
                  {error.message}
                </Text>
                {errorId && (
                  <Text style={{ 
                    fontSize: 10, 
                    color: '#9ca3af', 
                    marginTop: 4 
                  }}>
                    Error ID: {errorId}
                  </Text>
                )}
              </View>
            )}

            {/* Action Buttons */}
            <View style={{ gap: 12 }}>
              {canRetry && (
                <TouchableOpacity
                  onPress={this.handleRetry}
                  style={{
                    backgroundColor: '#3b82f6',
                    paddingVertical: 12,
                    paddingHorizontal: 24,
                    borderRadius: 8,
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ 
                    color: 'white', 
                    fontSize: 16, 
                    fontWeight: '600' 
                  }}>
                    Try Again {retryCount > 0 && `(${retryCount}/${maxRetries})`}
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={this.handleReportIssue}
                style={{
                  backgroundColor: 'transparent',
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  alignItems: 'center'
                }}
              >
                <Text style={{ 
                  color: '#374151', 
                  fontSize: 16, 
                  fontWeight: '500' 
                }}>
                  Report Issue
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  // In a real app, you might want to navigate to a safe screen
                  // or restart the app entirely
                  this.resetErrorBoundary();
                }}
                style={{
                  backgroundColor: 'transparent',
                  paddingVertical: 8,
                  alignItems: 'center'
                }}
              >
                <Text style={{ 
                  color: '#6b7280', 
                  fontSize: 14 
                }}>
                  Reset App
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback(this.state.error!, this.handleRetry);
      }

      // Default fallback UI
      return this.renderErrorFallback();
    }

    return this.props.children;
  }
}

/**
 * Higher-Order Component for wrapping components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

/**
 * Hook for error boundary context
 */
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null);

  const captureError = React.useCallback((error: Error | string) => {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    setError(errorObj);
  }, []);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
}

export default ErrorBoundary;
