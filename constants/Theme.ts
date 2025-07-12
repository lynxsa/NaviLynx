import { brand } from './branding';

export const Colors = {
  light: {
    light: brand.light, // Added property
    text: brand.text,
    background: brand.background,
    tint: brand.primary,
    icon: '#64748B',
    tabIconDefault: '#94A3B8',
    tabIconSelected: brand.primary,
    primary: brand.primary,
    primaryLight: '#EBF5FF',
    secondary: brand.secondary,
    secondaryLight: '#FFF5E6',
    accent: brand.accent,
    accentLight: '#FFEDF2',
    surface: brand.light,
    surfaceSecondary: brand.background,
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    card: brand.light,
    cardBackground: brand.light,
    cardSecondary: brand.background,
    notification: brand.accent,
    success: '#10B981',
    warning: brand.secondary,
    error: brand.accent,
    destructive: brand.accent,
    muted: brand.background,
    mutedForeground: '#64748B',
    textSecondary: '#64748B',
  },
  dark: {
    light: brand.light, // Added property
    text: brand.light,
    background: '#0D1117',
    tint: brand.primary,
    icon: '#94A3B8',
    tabIconDefault: '#64748B',
    tabIconSelected: brand.primary,
    primary: brand.primary,
    primaryLight: '#004A99',
    secondary: brand.secondary,
    secondaryLight: '#B36A00',
    accent: brand.accent,
    accentLight: '#B31F3B',
    surface: '#161B22',
    surfaceSecondary: '#1C2128',
    border: '#30363D',
    borderLight: '#21262D',
    card: '#161B22',
    cardBackground: '#161B22',
    cardSecondary: '#1C2128',
    notification: brand.accent,
    success: '#34D399',
    warning: brand.secondary,
    error: brand.accent,
    destructive: brand.accent,
    muted: '#161B22',
    mutedForeground: '#94A3B8',
    textSecondary: '#94A3B8',
  },
};

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const Typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  weights: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
};

export const Breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

export const getResponsiveValue = (
  value: number | { [key: string]: number },
  screenWidth: number
): number => {
  if (typeof value === 'number') return value;
  
  if (screenWidth >= Breakpoints.xl) return value.xl || value.lg || value.md || value.sm || 0;
  if (screenWidth >= Breakpoints.lg) return value.lg || value.md || value.sm || 0;
  if (screenWidth >= Breakpoints.md) return value.md || value.sm || 0;
  return value.sm || 0;
};
