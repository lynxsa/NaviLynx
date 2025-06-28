import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface AppMonitorProps {
  children: React.ReactNode;
}

interface AppError {
  id: string;
  type: 'runtime' | 'navigation' | 'component' | 'api';
  message: string;
  stack?: string;
  timestamp: Date;
  resolved: boolean;
}

export function AppMonitor({ children }: AppMonitorProps) {
  const [errors, setErrors] = useState<AppError[]>([]);
  const [showErrorPanel, setShowErrorPanel] = useState(false);
  const { colors } = useTheme();

  useEffect(() => {
    // Global error handler for unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error: AppError = {
        id: Date.now().toString(),
        type: 'runtime',
        message: event.reason?.message || 'Unhandled promise rejection',
        stack: event.reason?.stack,
        timestamp: new Date(),
        resolved: false,
      };
      
      setErrors(prev => [...prev, error]);
      console.warn('Unhandled promise rejection caught by AppMonitor:', event.reason);
      
      // Prevent default behavior
      event.preventDefault();
    };

    // Global error handler for JavaScript errors
    const handleGlobalError = (event: ErrorEvent) => {
      const error: AppError = {
        id: Date.now().toString(),
        type: 'runtime',
        message: event.message || 'Global JavaScript error',
        stack: event.error?.stack,
        timestamp: new Date(),
        resolved: false,
      };
      
      setErrors(prev => [...prev, error]);
      console.warn('Global error caught by AppMonitor:', event.error);
    };

    // Add listeners
    if (typeof window !== 'undefined') {
      window.addEventListener('unhandledrejection', handleUnhandledRejection);
      window.addEventListener('error', handleGlobalError);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        window.removeEventListener('error', handleGlobalError);
      }
    };
  }, []);

  const resolveError = (errorId: string) => {
    setErrors(prev => 
      prev.map(error => 
        error.id === errorId 
          ? { ...error, resolved: true }
          : error
      )
    );
  };

  const clearAllErrors = () => {
    setErrors([]);
  };

  const unresolvedErrors = errors.filter(error => !error.resolved);

  return (
    <>
      {children}
      
      {/* Error indicator */}
      {unresolvedErrors.length > 0 && (
        <TouchableOpacity
          style={[
            styles.errorIndicator,
            { backgroundColor: colors.destructive }
          ]}
          onPress={() => setShowErrorPanel(true)}
        >
          <IconSymbol name="exclamationmark.triangle" size={16} color="#FFFFFF" />
          <Text style={styles.errorCount}>{unresolvedErrors.length}</Text>
        </TouchableOpacity>
      )}

      {/* Error panel */}
      {showErrorPanel && (
        <View style={[styles.errorPanel, { backgroundColor: colors.card }]}>
          <View style={[styles.errorHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.errorTitle, { color: colors.text }]}>
              Application Errors ({unresolvedErrors.length})
            </Text>
            <View style={styles.errorActions}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.secondary }]}
                onPress={clearAllErrors}
              >
                <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>
                  Clear All
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.primary }]}
                onPress={() => setShowErrorPanel(false)}
              >
                <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <ScrollView style={styles.errorList}>
            {unresolvedErrors.map((error) => (
              <View
                key={error.id}
                style={[styles.errorItem, { backgroundColor: colors.muted }]}
              >
                <View style={styles.errorItemHeader}>
                  <View style={[
                    styles.errorTypeBadge,
                    { backgroundColor: getErrorTypeColor(error.type) }
                  ]}>
                    <Text style={styles.errorTypeText}>{error.type}</Text>
                  </View>
                  <Text style={[styles.errorTimestamp, { color: colors.mutedForeground }]}>
                    {error.timestamp.toLocaleTimeString()}
                  </Text>
                </View>
                
                <Text style={[styles.errorMessage, { color: colors.text }]}>
                  {error.message}
                </Text>
                
                {error.stack && (
                  <Text style={[styles.errorStack, { color: colors.mutedForeground }]}>
                    {error.stack.substring(0, 200)}...
                  </Text>
                )}
                
                <TouchableOpacity
                  style={[styles.resolveButton, { backgroundColor: colors.accent }]}
                  onPress={() => resolveError(error.id)}
                >
                  <Text style={[styles.resolveButtonText, { color: '#FFFFFF' }]}>
                    Mark Resolved
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </>
  );
}

function getErrorTypeColor(type: AppError['type']): string {
  switch (type) {
    case 'runtime': return '#ef4444';
    case 'navigation': return '#f97316';
    case 'component': return '#eab308';
    case 'api': return '#8b5cf6';
    default: return '#6b7280';
  }
}

const styles = StyleSheet.create({
  errorIndicator: {
    position: 'absolute',
    top: 60,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
    zIndex: 1000,
  },
  errorCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  errorPanel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  errorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  errorActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  errorList: {
    flex: 1,
    padding: 16,
  },
  errorItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  errorItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  errorTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  errorTypeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  errorTimestamp: {
    fontSize: 12,
  },
  errorMessage: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  errorStack: {
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  resolveButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  resolveButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
