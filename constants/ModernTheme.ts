import { Dimensions } from 'react-native';
import { brand } from './branding';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Enhanced theme system with NativeWind integration
export const modernTheme = {
  // Colors with NativeWind classes
  colors: {
    // Primary palette
    primary: {
      50: '#eff6ff',
      100: '#dbeafe', 
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',  // Main primary
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    
    // South African colors
    southAfrica: {
      green: '#34C759',
      gold: '#FFD700',
      blue: '#007AFF',
      orange: '#FF6B35',
      red: '#FF3B30',
      black: '#000000',
      white: '#FFFFFF',
    },

    // Semantic colors
    semantic: {
      success: '#34C759',
      warning: '#FF9500', 
      error: '#FF3B30',
      info: '#007AFF',
    },

    // Neutral grays
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb', 
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },

    // Glass morphism
    glass: {
      light: 'rgba(255, 255, 255, 0.1)',
      dark: 'rgba(0, 0, 0, 0.1)',
      primary: 'rgba(59, 130, 246, 0.1)',
    },

    // Branding colors
    branding: {
      primary: brand.primary,
      background: brand.background,
      card: brand.light,
      text: brand.text,
      border: brand.background,
      notification: brand.accent,
    }
  },

  // Typography scale
  typography: {
    fontSizes: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
      '5xl': 48,
    },
    fontWeights: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    lineHeights: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.625,
    }
  },

  // Spacing system
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
    '4xl': 80,
    '5xl': 96,
  },

  // Border radius
  borderRadius: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    full: 9999,
  },

  // Shadows
  shadows: {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.2,
      shadowRadius: 24,
      elevation: 12,
    },
    glass: {
      shadowColor: '#1f2937',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.37,
      shadowRadius: 32,
      elevation: 16,
    }
  },

  // Responsive breakpoints
  breakpoints: {
    sm: 375,  // Small phones
    md: 768,  // Tablets
    lg: 1024, // Large tablets
    xl: 1280, // Desktop
  },

  // Screen dimensions
  screen: {
    width: screenWidth,
    height: screenHeight,
    isSmall: screenWidth < 375,
    isMedium: screenWidth >= 375 && screenWidth < 768,
    isLarge: screenWidth >= 768,
  },

  // Animation timings
  animation: {
    duration: {
      fast: 150,
      normal: 250,
      slow: 350,
    },
    easing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    }
  },

  // Glass morphism styles
  glassMorphism: {
    light: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    dark: {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
    }
  }
};

// Utility functions for responsive design
export const responsive = {
  // Get responsive value based on screen size
  getValue: (values: { sm?: any; md?: any; lg?: any; xl?: any }) => {
    const { screen } = modernTheme;
    if (screen.width >= modernTheme.breakpoints.xl && values.xl !== undefined) return values.xl;
    if (screen.width >= modernTheme.breakpoints.lg && values.lg !== undefined) return values.lg;
    if (screen.width >= modernTheme.breakpoints.md && values.md !== undefined) return values.md;
    return values.sm;
  },

  // Get responsive spacing
  spacing: (base: keyof typeof modernTheme.spacing, multiplier?: { sm?: number; md?: number; lg?: number }) => {
    const baseValue = modernTheme.spacing[base];
    const mult = responsive.getValue(multiplier || { sm: 1, md: 1.2, lg: 1.5 });
    return baseValue * mult;
  },

  // Get responsive font size
  fontSize: (base: keyof typeof modernTheme.typography.fontSizes, multiplier?: { sm?: number; md?: number; lg?: number }) => {
    const baseValue = modernTheme.typography.fontSizes[base];
    const mult = responsive.getValue(multiplier || { sm: 1, md: 1.1, lg: 1.2 });
    return baseValue * mult;
  }
};

// NativeWind utility classes
export const nativeWindClasses = {
  // Layout
  container: 'flex-1 bg-gray-50',
  centerContent: 'flex-1 justify-center items-center',
  
  // Cards
  card: 'bg-white rounded-xl p-4 shadow-md',
  glassCard: 'bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20',
  
  // Buttons
  primaryButton: 'bg-primary-500 px-6 py-3 rounded-lg shadow-button',
  secondaryButton: 'bg-gray-200 px-6 py-3 rounded-lg',
  saButton: 'bg-sa-orange px-6 py-3 rounded-lg shadow-button',
  
  // Text
  heading: 'text-2xl font-bold text-gray-900',
  subheading: 'text-lg font-semibold text-gray-700',
  body: 'text-base text-gray-600',
  caption: 'text-sm text-gray-500',
  
  // Status indicators
  success: 'bg-sa-green text-white',
  warning: 'bg-yellow-500 text-white',
  error: 'bg-sa-red text-white',
  info: 'bg-sa-blue text-white',
};

export default modernTheme;
