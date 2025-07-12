import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import HomeScreen from '@/app/(tabs)/index';
import ExploreScreen from '@/app/(tabs)/explore';
import { getAllEnhancedVenues } from '@/data/enhancedVenues';

const Tab = createBottomTabNavigator();

// Mock navigation components
jest.mock('@/components/ImprovedHomeScreen', () => {
  const { View, Text } = require('react-native');
  return function MockImprovedHomeScreen() {
    return (
      <View>
        <Text>Welcome to NaviLynx</Text>
        <Text>Indoor navigation app</Text>
      </View>
    );
  };
});

const TestApp = () => (
  <ThemeProvider>
    <LanguageProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Explore" component={ExploreScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </LanguageProvider>
  </ThemeProvider>
);

describe('NaviLynx Integration Tests', () => {
  describe('Data Integration', () => {
    it('should load venue data correctly', () => {
      const venues = getAllEnhancedVenues();
      expect(venues).toBeDefined();
      expect(Array.isArray(venues)).toBe(true);
      expect(venues.length).toBeGreaterThan(0);
    });

    it('should have proper venue structure', () => {
      const venues = getAllEnhancedVenues();
      const firstVenue = venues[0];
      
      expect(firstVenue).toHaveProperty('id');
      expect(firstVenue).toHaveProperty('name');
      expect(firstVenue).toHaveProperty('type');
      expect(firstVenue).toHaveProperty('location');
      expect(firstVenue).toHaveProperty('rating');
    });

    it('should have South African venues', () => {
      const venues = getAllEnhancedVenues();
      const southAfricanVenues = venues.filter(venue => 
        venue.location.province === 'Gauteng' || 
        venue.location.province === 'Western Cape' ||
        venue.location.city.includes('Cape Town') ||
        venue.location.city.includes('Johannesburg')
      );
      
      expect(southAfricanVenues.length).toBeGreaterThan(0);
    });
  });

  describe('Context Integration', () => {
    it('should handle theme context without errors', () => {
      const TestComponent = () => {
        const { View, Text } = require('react-native');
        const { useTheme } = require('@/context/ThemeContext');
        const { theme } = useTheme();
        return <View><Text>Theme loaded</Text></View>;
      };

      const { View, Text } = require('react-native');
      const { getByText } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(getByText('Theme loaded')).toBeTruthy();
    });

    it('should handle language context without errors', () => {
      const TestComponent = () => {
        const { View, Text } = require('react-native');
        const { useLanguage } = require('@/context/LanguageContext');
        const { language } = useLanguage();
        return <View><Text>Language loaded</Text></View>;
      };

      const { View, Text } = require('react-native');
      const { getByText } = render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      expect(getByText('Language loaded')).toBeTruthy();
    });
  });

  describe('Component Integration', () => {
    it('should render components without theme/language errors', () => {
      const { toJSON } = render(
        <ThemeProvider>
          <LanguageProvider>
            <HomeScreen />
          </LanguageProvider>
        </ThemeProvider>
      );

      expect(toJSON()).toBeTruthy();
    });

    it('should handle component interactions', () => {
      const { getByText } = render(
        <ThemeProvider>
          <LanguageProvider>
            <HomeScreen />
          </LanguageProvider>
        </ThemeProvider>
      );

      // Test that components render essential content
      expect(getByText(/Good Evening/)).toBeTruthy();
      expect(getByText('Discover amazing places around you')).toBeTruthy();
    });
  });
});
