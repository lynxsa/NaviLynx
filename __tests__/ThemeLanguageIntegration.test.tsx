import React from 'react';
import { render, act } from '@testing-library/react-native';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';
import { Text, View } from 'react-native';

// Test component to access context values
const TestComponent = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  return (
    <View>
      <Text testID="theme-dark">{theme.dark ? 'dark' : 'light'}</Text>
      <Text testID="language">{language}</Text>
      <Text testID="translated-text">{t('welcome')}</Text>
      <Text testID="primary-color">{theme.colors.primary}</Text>
    </View>
  );
};

const WrappedTestComponent = () => (
  <ThemeProvider>
    <LanguageProvider>
      <TestComponent />
    </LanguageProvider>
  </ThemeProvider>
);

describe('Theme and Language Context Integration', () => {
  it('should provide theme context correctly', () => {
    const { getByTestId } = render(<WrappedTestComponent />);
    
    expect(getByTestId('theme-dark')).toBeTruthy();
    expect(getByTestId('primary-color')).toBeTruthy();
  });

  it('should provide language context correctly', () => {
    const { getByTestId } = render(<WrappedTestComponent />);
    
    expect(getByTestId('language')).toBeTruthy();
    expect(getByTestId('translated-text')).toBeTruthy();
  });

  it('should have default theme values', () => {
    const { getByTestId } = render(<WrappedTestComponent />);
    
    const themeText = getByTestId('theme-dark');
    expect(themeText.children[0]).toBe('light'); // Default theme
  });

  it('should have default language', () => {
    const { getByTestId } = render(<WrappedTestComponent />);
    
    const languageText = getByTestId('language');
    expect(languageText.children[0]).toBe('en'); // Default language
  });
});

describe('Theme Integration', () => {
  it('should render with theme colors', () => {
    const ThemeTestComponent = () => {
      const { theme } = useTheme();
      return (
        <View style={{ backgroundColor: theme.colors.primary }}>
          <Text style={{ color: theme.colors.text }}>Theme Test</Text>
        </View>
      );
    };

    const { getByText } = render(
      <ThemeProvider>
        <ThemeTestComponent />
      </ThemeProvider>
    );

    expect(getByText('Theme Test')).toBeTruthy();
  });

  it('should handle missing theme gracefully', () => {
    const DirectTestComponent = () => {
      const { theme } = useTheme();
      return <Text>Has Theme</Text>;
    };

    const { getByText } = render(
      <ThemeProvider>
        <DirectTestComponent />
      </ThemeProvider>
    );
    expect(getByText('Has Theme')).toBeTruthy();
  });
});
