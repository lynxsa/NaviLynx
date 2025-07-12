import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Design System Colors
export const colors = {
  // Primary Brand Colors
  primary: {
    50: '#F3E8FF',
    100: '#E9D5FF',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6', // Main Primary
    600: '#7C3AED',
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
  },
  
  // Accent Colors
  accent: {
    purple: '#6A0DAD',
    blue: '#3B82F6',
    green: '#10B981',
    orange: '#F59E0B',
    red: '#EF4444',
  },
  
  // Neutral Colors
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // Light Theme
  light: {
    background: '#FFFFFF',
    surface: '#F9FAFB',
    card: '#FFFFFF',
    text: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  
  // Dark Theme
  dark: {
    background: '#111827',
    surface: '#1F2937',
    card: '#374151',
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    border: '#4B5563',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
  
  // Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

// Typography
export const typography = {
  // Font Sizes
  fontSize: {
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
  
  // Font Weights
  fontWeight: {
    light: '300' as const,
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Spacing System
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

// Border Radius
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
};

// Shadows
export const shadows = {
  sm: {
    shadowColor: colors.gray[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: colors.gray[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: colors.gray[900],
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 6,
  },
  xl: {
    shadowColor: colors.gray[900],
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 10,
  },
};

// Component Styles
export const globalStyles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  containerDark: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  
  // Cards
  card: {
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    ...shadows.md,
  },
  cardDark: {
    backgroundColor: colors.dark.card,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    ...shadows.lg,
  },
  
  // Typography
  heading1: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.light.text,
    lineHeight: typography.lineHeight.tight * typography.fontSize['3xl'],
  },
  heading1Dark: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.dark.text,
    lineHeight: typography.lineHeight.tight * typography.fontSize['3xl'],
  },
  
  heading2: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.light.text,
    lineHeight: typography.lineHeight.tight * typography.fontSize['2xl'],
  },
  heading2Dark: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.dark.text,
    lineHeight: typography.lineHeight.tight * typography.fontSize['2xl'],
  },
  
  heading3: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.light.text,
    lineHeight: typography.lineHeight.normal * typography.fontSize.xl,
  },
  heading3Dark: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.dark.text,
    lineHeight: typography.lineHeight.normal * typography.fontSize.xl,
  },
  
  bodyText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.normal,
    color: colors.light.text,
    lineHeight: typography.lineHeight.normal * typography.fontSize.base,
  },
  bodyTextDark: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.normal,
    color: colors.dark.text,
    lineHeight: typography.lineHeight.normal * typography.fontSize.base,
  },
  
  captionText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.normal,
    color: colors.light.textSecondary,
    lineHeight: typography.lineHeight.normal * typography.fontSize.sm,
  },
  captionTextDark: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.normal,
    color: colors.dark.textSecondary,
    lineHeight: typography.lineHeight.normal * typography.fontSize.sm,
  },
  
  // Buttons
  buttonPrimary: {
    backgroundColor: colors.primary[600],
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  
  buttonSecondary: {
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  buttonSecondaryDark: {
    backgroundColor: colors.gray[700],
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  
  buttonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.light.background,
  },
  
  buttonTextSecondary: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.light.text,
  },
  buttonTextSecondaryDark: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.dark.text,
  },
  
  // Input Fields
  input: {
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    fontSize: typography.fontSize.base,
    color: colors.light.text,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  inputDark: {
    backgroundColor: colors.gray[800],
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    fontSize: typography.fontSize.base,
    color: colors.dark.text,
    borderWidth: 1,
    borderColor: colors.gray[600],
  },
  
  // Layout Utilities
  flexRow: {
    flexDirection: 'row',
  },
  flexCol: {
    flexDirection: 'column',
  },
  alignCenter: {
    alignItems: 'center',
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  justifyBetween: {
    justifyContent: 'space-between',
  },
  
  // Grid System
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.sm,
  },
  gridItem2: {
    width: '50%',
    paddingHorizontal: spacing.sm,
  },
  gridItem3: {
    width: '33.333%',
    paddingHorizontal: spacing.sm,
  },
  gridItem4: {
    width: '25%',
    paddingHorizontal: spacing.sm,
  },
});

// Screen Dimensions
export const dimensions = {
  screenWidth,
  screenHeight,
  isSmallDevice: screenWidth < 375,
  isMediumDevice: screenWidth >= 375 && screenWidth < 414,
  isLargeDevice: screenWidth >= 414,
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  globalStyles,
  dimensions,
};
