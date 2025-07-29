'use client'

import React from 'react'
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<ErrorFallbackProps>
}

interface ErrorFallbackProps {
  error?: Error
  resetError?: () => void
  errorInfo?: React.ErrorInfo
}

const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  resetError,
  errorInfo 
}) => {
  const isDevelopment = process.env.NODE_ENV === 'development'

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
            Oops! Something went wrong
          </CardTitle>
          <p className="text-gray-600 text-lg mt-2">
            We apologize for the inconvenience. An unexpected error occurred.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {isDevelopment && error && (
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-auto max-h-60">
              <div className="text-red-400 font-bold mb-2">Error Details:</div>
              <div className="whitespace-pre-wrap">{error.toString()}</div>
              {error.stack && (
                <div className="mt-4">
                  <div className="text-yellow-400 font-bold mb-2">Stack Trace:</div>
                  <div className="whitespace-pre-wrap text-xs">{error.stack}</div>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={resetError}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Try Again
            </Button>
            
            <Button
              onClick={() => window.location.href = '/dashboard'}
              variant="outline"
              size="lg"
              className="border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
            >
              <Home className="h-5 w-5 mr-2" />
              Go to Dashboard
            </Button>
            
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              size="lg"
              className="border-2 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Go Back
            </Button>
          </div>

          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              If this problem persists, please contact the administrator.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Error ID: {Date.now().toString(36).toUpperCase()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })

    // Log error to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: logErrorToService(error, errorInfo)
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return (
        <FallbackComponent
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          resetError={this.resetError}
        />
      )
    }

    return this.props.children
  }
}

// Higher-order component for wrapping pages with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<ErrorFallbackProps>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  )
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  return WrappedComponent
}

export default ErrorBoundary
