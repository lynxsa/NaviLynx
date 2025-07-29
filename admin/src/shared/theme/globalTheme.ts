/**
 * 🎨 OPERATION LIONMOUNTAIN - Global Theme System
 * 
 * Unified purple theme system for mobile app with perfect consistency
 * Eliminates all orange/blue gradients - pure purple excellence
 * 
 * @version 1.0.0 - LIONMOUNTAIN Edition
 */

export const purpleTheme = {
  // Primary Purple Palette
  primary: '#9333EA',      // Deep purple - primary actions
  primaryLight: '#A855F7', // Light purple - hover states
  primaryDark: '#7C3AED',  // Dark purple - pressed states
  primaryAlpha: '#9333EA20', // Purple with transparency

  // Purple Gradients (ONLY Purple - NO orange/blue)
  gradients: {
    primary: ['#9333EA', '#7C3AED'] as const,
    light: ['#A855F7', '#9333EA'] as const,
    dark: ['#7C3AED', '#6B21A8'] as const,
    subtle: ['#9333EA10', '#9333EA30'] as const,
    hero: ['#9333EA', '#7C3AED', '#6B21A8'] as const,
    card: ['#FAFAFA', '#F3F4F6'] as const,
    darkCard: ['#1F2937', '#111827'] as const,
  },

  // Supporting Colors
  background: '#FAFAFA',
  backgroundDark: '#111827',
  surface: '#FFFFFF',
  surfaceDark: '#1F2937',
  text: '#1F2937',
  textDark: '#F9FAFB',
  textSecondary: '#6B7280',
  textSecondaryDark: '#9CA3AF',
  
  // Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // UI Elements
  border: '#E5E7EB',
  borderDark: '#374151',
  shadow: '#00000015',
  shadowDark: '#00000040',

  // Transparency Levels
  alpha: {
    low: '10',
    medium: '20',
    high: '40',
    strong: '60',
  }
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: purpleTheme.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: purpleTheme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: purpleTheme.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const typography = {
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    hero: 32,
  },
  fontWeights: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    loose: 1.8,
  },
};

export default purpleTheme;
