import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import ProfileScreenEnhanced from '@/components/ProfileScreenEnhanced';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

const MockedProfileScreen = () => (
  <ThemeProvider>
    <LanguageProvider>
      <ProfileScreenEnhanced />
    </LanguageProvider>
  </ThemeProvider>
);

describe('ProfileScreenEnhanced', () => {
  it('renders profile screen correctly', () => {
    const { getByText } = render(<MockedProfileScreen />);
    
    expect(getByText('Welcome!')).toBeTruthy();
    expect(getByText('Please sign in to access all features')).toBeTruthy();
  });

  it('displays preferences section', () => {
    const { getByText } = render(<MockedProfileScreen />);
    
    expect(getByText('Preferences')).toBeTruthy();
    expect(getByText('Dark Mode')).toBeTruthy();
    expect(getByText('Language')).toBeTruthy();
    expect(getByText('Notifications')).toBeTruthy();
  });

  it('displays more options section', () => {
    const { getByText } = render(<MockedProfileScreen />);
    
    expect(getByText('More Options')).toBeTruthy();
    expect(getByText('Account Settings')).toBeTruthy();
    expect(getByText('Privacy & Security')).toBeTruthy();
    expect(getByText('Help & Support')).toBeTruthy();
    expect(getByText('About NaviLynx')).toBeTruthy();
  });

  it('displays app version', () => {
    const { getByText } = render(<MockedProfileScreen />);
    
    expect(getByText('NaviLynx Mobile v1.0.0')).toBeTruthy();
  });

  it('handles language selection', () => {
    const { getByText } = render(<MockedProfileScreen />);
    
    expect(getByText('English')).toBeTruthy();
  });
});
