/**
 * 🎨 OPERATION LIONMOUNTAIN - Global Purple Theme System
 * 
 * Complete design system with pure purple theming
 * NO ORANGE OR BLUE GRADIENTS - Only elegant purple variations
 * 
 * @version 1.0.0 - LIONMOUNTAIN Edition
 */

// Core Purple Color Palette
export const PURPLE_THEME = {
  // Primary Colors (Main Purple Spectrum)
  primary: '#9333EA',        // Deep Purple - Main brand color
  primaryLight: '#A855F7',   // Light Purple - Hover states
  primaryDark: '#7C3AED',    // Dark Purple - Pressed states
  
  // Secondary Purple Variations
  secondary: '#C084FC',      // Purple Accent - Secondary actions
  violet: '#8B5CF6',         // Violet - Tertiary elements
  lavender: '#E9D5FF',       // Light Lavender - Backgrounds
  
  // Neutral Colors
  background: '#FFFFFF',     // Pure white background
  surface: '#F9FAFB',        // Light gray surface
  surfaceElevated: '#FFFFFF', // Elevated surface (cards)
  
  // Text Colors
  text: '#111827',           // Primary text
  textSecondary: '#6B7280',  // Secondary text
  textMuted: '#9CA3AF',      // Muted text
  textOnPrimary: '#FFFFFF',  // Text on purple backgrounds
  
  // Status Colors (Purple-tinted)
  success: '#10B981',        // Green success
  warning: '#F59E0B',        // Amber warning
  error: '#EF4444',          // Red error
  info: '#9333EA',           // Purple info (same as primary)
  
  // Border Colors
  border: '#E5E7EB',         // Light border
  borderFocus: '#9333EA',    // Purple focus border
  
  // Shadow Colors
  shadow: 'rgba(147, 51, 234, 0.1)', // Purple-tinted shadows
}

// React Native Compatible Colors
export const RN_COLORS = {
  ...PURPLE_THEME,
  
  // Gradient Combinations (Purple Only)
  gradients: {
    primary: [PURPLE_THEME.primary, PURPLE_THEME.primaryLight],
    secondary: [PURPLE_THEME.secondary, PURPLE_THEME.violet],
    background: [PURPLE_THEME.lavender, PURPLE_THEME.surface],
    card: [PURPLE_THEME.surface, PURPLE_THEME.surfaceElevated],
  }
}

// CSS Variables for Web
export const CSS_VARIABLES = {
  '--color-primary': PURPLE_THEME.primary,
  '--color-primary-light': PURPLE_THEME.primaryLight,
  '--color-primary-dark': PURPLE_THEME.primaryDark,
  '--color-secondary': PURPLE_THEME.secondary,
  '--color-violet': PURPLE_THEME.violet,
  '--color-lavender': PURPLE_THEME.lavender,
  '--color-background': PURPLE_THEME.background,
  '--color-surface': PURPLE_THEME.surface,
  '--color-text': PURPLE_THEME.text,
  '--color-text-secondary': PURPLE_THEME.textSecondary,
  '--color-border': PURPLE_THEME.border,
  '--color-shadow': PURPLE_THEME.shadow,
}

// Tailwind CSS Colors
export const TAILWIND_COLORS = {
  primary: {
    50: '#FAF5FF',
    100: '#F3E8FF', 
    200: '#E9D5FF',
    300: '#D8B4FE',
    400: '#C084FC',
    500: '#A855F7',
    600: '#9333EA',  // Main purple
    700: '#7C3AED',
    800: '#6D28D9',
    900: '#581C87',
  },
  purple: {
    50: '#FAF5FF',
    100: '#F3E8FF',
    200: '#E9D5FF', 
    300: '#D8B4FE',
    400: '#C084FC',
    500: '#A855F7',
    600: '#9333EA',
    700: '#7C3AED',
    800: '#6D28D9',
    900: '#581C87',
  }
}

// Spacing System
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
}

// Typography System
export const TYPOGRAPHY = {
  fontSizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
  },
  fontWeights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  }
}

// Border Radius System
export const BORDER_RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
}

// Shadow System
export const SHADOWS = {
  sm: {
    shadowColor: PURPLE_THEME.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: PURPLE_THEME.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lg: {
    shadowColor: PURPLE_THEME.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  }
}

export default PURPLE_THEME
