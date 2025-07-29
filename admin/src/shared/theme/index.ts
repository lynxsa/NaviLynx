/**
 * NaviLynx Unified Purple Theme System
 * Cross-platform theme for React Native & Next.js
 */

export const PURPLE_THEME = {
  // Primary Purple Palette
  primary: '#9333EA',
  primaryLight: '#A855F7', 
  primaryDark: '#7C3AED',
  
  // Secondary Purple Shades
  violet: '#8B5CF6',
  indigo: '#6366F1',
  fuchsia: '#D946EF',
  
  // Accent Colors
  accent: '#C084FC',
  accentLight: '#DDD6FE',
  accentDark: '#9333EA',
  
  // Neutral Colors
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  
  // Status Colors (Purple-tinted)
  success: '#8B5CF6',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#6366F1',
  
  // Background Gradients (Purple Only)
  gradients: {
    primary: ['#9333EA', '#7C3AED'],
    secondary: ['#A855F7', '#8B5CF6'],
    accent: ['#C084FC', '#9333EA'],
    hero: ['#9333EA', '#6366F1'],
    card: ['#A855F7', '#D946EF'],
    button: ['#8B5CF6', '#7C3AED'],
    warm: ['#D946EF', '#F59E0B'], // Purple to warm accent
    cool: ['#6366F1', '#8B5CF6'],
  },
  
  // Shadow Colors
  shadows: {
    light: 'rgba(147, 51, 234, 0.1)',
    medium: 'rgba(147, 51, 234, 0.2)',
    strong: 'rgba(147, 51, 234, 0.3)',
  }
} as const

// React Native StyleSheet Colors
export const RN_COLORS = {
  ...PURPLE_THEME,
  // React Native specific color formats
  transparent: 'transparent',
  backdrop: 'rgba(0, 0, 0, 0.5)',
}

// CSS Custom Properties for Web
export const CSS_VARIABLES = {
  '--color-primary': PURPLE_THEME.primary,
  '--color-primary-light': PURPLE_THEME.primaryLight,
  '--color-primary-dark': PURPLE_THEME.primaryDark,
  '--color-violet': PURPLE_THEME.violet,
  '--color-indigo': PURPLE_THEME.indigo,
  '--color-fuchsia': PURPLE_THEME.fuchsia,
  '--color-accent': PURPLE_THEME.accent,
  '--color-white': PURPLE_THEME.white,
  '--color-black': PURPLE_THEME.black,
  
  // Gradients
  '--gradient-primary': `linear-gradient(135deg, ${PURPLE_THEME.gradients.primary.join(', ')})`,
  '--gradient-secondary': `linear-gradient(135deg, ${PURPLE_THEME.gradients.secondary.join(', ')})`,
  '--gradient-hero': `linear-gradient(135deg, ${PURPLE_THEME.gradients.hero.join(', ')})`,
}

// Tailwind CSS Color Extensions
export const TAILWIND_COLORS = {
  purple: {
    50: '#FAF5FF',
    100: '#F3E8FF', 
    200: '#E9D5FF',
    300: '#D8B4FE',
    400: PURPLE_THEME.accent,
    500: PURPLE_THEME.primary,
    600: PURPLE_THEME.primaryDark,
    700: '#6B21A8',
    800: '#581C87',
    900: '#4C1D95',
  },
  navilynx: {
    primary: PURPLE_THEME.primary,
    light: PURPLE_THEME.primaryLight,
    dark: PURPLE_THEME.primaryDark,
    violet: PURPLE_THEME.violet,
    indigo: PURPLE_THEME.indigo,
    fuchsia: PURPLE_THEME.fuchsia,
    accent: PURPLE_THEME.accent,
  }
}

// Spacing System (4px grid)
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const

// Typography Scale
export const TYPOGRAPHY = {
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
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  }
} as const

// Platform-specific helpers
export const createGradient = (colors: string[], angle: number = 135) => {
  if (Platform.OS === 'web') {
    return `linear-gradient(${angle}deg, ${colors.join(', ')})`
  }
  return colors // React Native LinearGradient will handle this
}

// Helper to check if we're on React Native
const Platform = {
  OS: typeof window === 'undefined' ? 'ios' : 'web'
}

export default PURPLE_THEME
