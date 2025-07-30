import { StyleSheet } from 'react-native';

// Enhanced Color System - World-class design palette
export const designSystem = {
  colors: {
    // Primary palette
    primary: {
      50: '#eff6ff',
      100: '#dbeafe', 
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6', // Main primary
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    
    // Semantic colors
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
    },
    
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
    },
    
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
    },
    
    // Neutral palette
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
    
    // Surface colors
    surface: {
      background: '#ffffff',
      card: '#ffffff',
      elevated: '#ffffff',
      overlay: 'rgba(0, 0, 0, 0.5)',
    },
    
    // Text colors
    text: {
      primary: '#111827',
      secondary: '#6b7280',
      tertiary: '#9ca3af',
      inverse: '#ffffff',
      disabled: '#d1d5db',
    },
    
    // Border colors
    border: {
      light: '#f3f4f6',
      default: '#e5e7eb',
      strong: '#d1d5db',
      focus: '#3b82f6',
    },
  },
  
  // Enhanced spacing system
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 40,
    '3xl': 48,
    '4xl': 64,
    '5xl': 80,
    '6xl': 96,
  },
  
  // Typography system
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
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
  },
  
  // Border radius system
  borderRadius: {
    none: 0,
    xs: 2,
    sm: 4,
    md: 6,
    lg: 8,
    xl: 12,
    '2xl': 16,
    '3xl': 24,
    full: 9999,
  },
  
  // Enhanced shadow system
  shadows: {
    xs: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 12,
    },
  },
  
  // Animation constants
  animation: {
    duration: {
      fast: 150,
      normal: 250,
      slow: 400,
    },
    
    easing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
  },
};

// Card variant system for consistent styling
export const cardVariants = {
  elevated: {
    backgroundColor: designSystem.colors.surface.card,
    borderRadius: designSystem.borderRadius.xl,
    ...designSystem.shadows.md,
    borderWidth: 0,
  },
  
  outlined: {
    backgroundColor: designSystem.colors.surface.card,
    borderRadius: designSystem.borderRadius.xl,
    borderWidth: 1,
    borderColor: designSystem.colors.border.default,
    shadowOpacity: 0,
  },
  
  filled: {
    backgroundColor: designSystem.colors.gray[50],
    borderRadius: designSystem.borderRadius.xl,
    borderWidth: 0,
    shadowOpacity: 0,
  },
  
  ghost: {
    backgroundColor: 'transparent',
    borderRadius: designSystem.borderRadius.xl,
    borderWidth: 0,
    shadowOpacity: 0,
  },
};

// Interaction states
export const interactionStates = {
  hover: {
    scale: 1.02,
    shadowOpacity: 0.2,
  },
  
  pressed: {
    scale: 0.98,
    shadowOpacity: 0.1,
  },
  
  focused: {
    borderColor: designSystem.colors.border.focus,
    borderWidth: 2,
  },
};

export default designSystem;
