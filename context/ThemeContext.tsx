import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useColorScheme, Appearance, OpaqueColorValue } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/Theme';

interface ThemeColors {
  light: string | OpaqueColorValue;
  primary: string;
  primaryLight: string;
  secondary: string;
  secondaryLight: string;
  accent: string;
  accentLight: string;
  background: string;
  surface: string;
  surfaceSecondary: string;
  card: string;
  cardBackground: string;
  cardSecondary: string;
  text: string;
  textSecondary: string;
  border: string;
  borderLight: string;
  notification: string;
  success: string;
  warning: string;
  error: string;
  destructive: string;
  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
  muted: string;
  mutedForeground: string;
}

interface Theme {
  dark: boolean;
  colors: ThemeColors;
}

interface ThemeContextType {
  theme: Theme;
  colors: ThemeColors;
  toggleTheme: () => void;
  isDark: boolean;
  setTheme: (isDark: boolean) => void;
}

const THEME_STORAGE_KEY = '@navilynx_theme_preference';

const lightTheme: Theme = {
  dark: false,
  colors: Colors.light,
};

const darkTheme: Theme = {
  dark: true,
  colors: Colors.dark,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export { ThemeContext }; // Export ThemeContext

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved theme preference on mount
  useEffect(() => {
    loadThemePreference();
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (!isLoaded) return; // Don't update until user preference is loaded
      // Only update if user hasn't set a manual preference
      AsyncStorage.getItem(THEME_STORAGE_KEY).then((saved) => {
        if (!saved) {
          setIsDark(colorScheme === 'dark');
        }
      });
    });

    return () => subscription?.remove();
  }, [isLoaded]);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme !== null) {
        setIsDark(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveThemePreference = async (darkMode: boolean) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, darkMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const setTheme = (darkMode: boolean) => {
    setIsDark(darkMode);
    saveThemePreference(darkMode);
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setTheme(newTheme);
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colors: theme.colors,
        toggleTheme,
        isDark,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Safe theme hook that provides fallback values
export function useThemeSafe() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Return fallback theme when context is not available
    return {
      colors: Colors.light,
      isDark: false,
      setIsDark: () => {},
      toggleTheme: () => {},
    };
  }
  return context;
}
