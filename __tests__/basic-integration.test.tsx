/**
 * NaviLynx Basic Integration Tests
 * Simple tests to verify core functionality
 */

import React from 'react';
import { render } from '@testing-library/react-native';
// Import providers and custom hooks
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';

// Import core components
import MallNavigator from '@/components/navigation/MallNavigator';
import ParkingScreenEnhanced from '@/components/ParkingScreenEnhanced';
import ProfileScreenEnhanced from '@/components/ProfileScreenEnhanced';

// Import services
import { IndoorNavigationService } from '@/services/indoorNavigationService';

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>
    <LanguageProvider>
      {children}
    </LanguageProvider>
  </ThemeProvider>
);

describe('NaviLynx Integration Tests', () => {
  
  describe('Core Components', () => {
    it('should render MallNavigator without errors', async () => {
      const { getByText } = render(
        <TestWrapper>
          <MallNavigator 
            mallId="sandton_city_01"
            enableAR={false}
          />
        </TestWrapper>
      );

      // Should render without throwing
      expect(getByText).toBeTruthy();
    });

    it('should render ParkingScreenEnhanced without errors', () => {
      const { getByText } = render(
        <TestWrapper>
          <ParkingScreenEnhanced />
        </TestWrapper>
      );

      // Should render without throwing
      expect(getByText).toBeTruthy();
    });

    it('should render ProfileScreenEnhanced without errors', () => {
      const { getByText } = render(
        <TestWrapper>
          <ProfileScreenEnhanced />
        </TestWrapper>
      );

      // Should render without throwing
      expect(getByText).toBeTruthy();
    });
  });

  describe('Navigation Service', () => {
    it('should create IndoorNavigationService instance', () => {
      const navigationService = new IndoorNavigationService();
      expect(navigationService).toBeDefined();
    });

    it('should load POIs', () => {
      const navigationService = new IndoorNavigationService();
      const pois = navigationService.getAllPOIs();
      expect(Array.isArray(pois)).toBe(true);
    });

    it('should have user preferences', () => {
      const navigationService = new IndoorNavigationService();
      const preferences = navigationService.getUserPreferences();
      expect(preferences).toBeDefined();
      expect(typeof preferences.preferAccessibleRoutes).toBe('boolean');
    });
  });

  describe('Theme Integration', () => {
    it('should provide theme context', () => {
      let themeContextValue: any;
      
      const TestComponent = () => {
        const theme = useTheme(); // Use the hook
        themeContextValue = theme;
        return null;
      };

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      expect(themeContextValue).toBeDefined();
      expect(themeContextValue.colors).toBeDefined();
    });
  });

  describe('Language Integration', () => {
    it('should provide language context', () => {
      let languageContextValue: any;
      
      const TestComponent = () => {
        const language = useLanguage(); // Use the hook
        languageContextValue = language;
        return null;
      };

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      expect(languageContextValue).toBeDefined();
      expect(typeof languageContextValue.t).toBe('function');
    });
  });
});
