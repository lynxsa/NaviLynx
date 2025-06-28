import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { SavedVenuesProvider } from '@/context/SavedVenuesContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import React from 'react';
import '../global.css';
import { Slot } from 'expo-router';

export default function RootLayout() {
  return (
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
  );
}