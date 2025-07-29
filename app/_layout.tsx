import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { SavedVenuesProvider } from '@/context/SavedVenuesContext';
import { ErrorHandlerProvider } from '@/context/ErrorHandlerContext';
import { PerformanceProvider } from '@/context/PerformanceContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import React from 'react';
// Temporarily disable global.css to fix CSS parsing error
// import '../global.css';
import { Slot } from 'expo-router';

export default function RootLayout() {
  return (
    <ErrorHandlerProvider>
      <PerformanceProvider>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <SavedVenuesProvider>
                <ErrorBoundary>
                  <Slot />
                </ErrorBoundary>
              </SavedVenuesProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </PerformanceProvider>
    </ErrorHandlerProvider>
  );
}