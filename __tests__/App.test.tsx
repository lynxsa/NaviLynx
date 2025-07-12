
import React from 'react';
import { render } from '@testing-library/react-native';
import { View, Text } from 'react-native';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import HomeScreen from '@/app/(tabs)/index';

// Mock the ImprovedHomeScreen component
jest.mock('@/components/ImprovedHomeScreen', () => {
  return function MockImprovedHomeScreen() {
    return (
      <View>
        <Text>Welcome to NaviLynx</Text>
        <Text>Your indoor navigation companion</Text>
        <Text>You are near Sandton City – here's a coupon!</Text>
        <Text>Mall</Text>
        <Text>Airport</Text>
      </View>
    );
  };
});

const MockedApp = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <LanguageProvider>
      {children}
    </LanguageProvider>
  </ThemeProvider>
);

describe('HomeScreen', () => {
  it('renders welcome message', () => {
    const { getByText } = render(
      <MockedApp>
        <HomeScreen />
      </MockedApp>
    );
    
    // Check for actual greeting text that appears in the component
    expect(getByText(/Good Evening/)).toBeTruthy();
    expect(getByText('Discover amazing places around you')).toBeTruthy();
  });

  it('displays South African venues', () => {
    const { getByText, getAllByText } = render(
      <MockedApp>
        <HomeScreen />
      </MockedApp>
    );
    
    // Check for venue-related content that's actually rendered
    const sandtonElements = getAllByText(/Sandton City/);
    expect(sandtonElements.length).toBeGreaterThan(0); // Multiple instances of Sandton City
    expect(getByText('Shopping Malls')).toBeTruthy(); // This is in the venue categories
    expect(getByText('Airports')).toBeTruthy(); // This is in the venue categories
  });
});
