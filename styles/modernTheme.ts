import { StyleSheet } from 'react-native';

// Color system with proper values
export const colors = {
  // Primary colors as strings, not objects
  primary: '#6366f1',
  primaryLight: '#a5b4fc',
  primaryDark: '#4f46e5',
  
  // Secondary and accent colors
  accent: '#f59e0b',
  secondary: '#8b5cf6',
  
  // Semantic colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  // Gray scale
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
  
  // Text colors
  text: '#111827',
  textSecondary: '#6b7280',
  textLight: '#f9fafb',
  
  // Background colors
  background: '#ffffff',
  backgroundSecondary: '#f9fafb',
  surface: '#ffffff',
  
  // Border colors
  border: '#e5e7eb',
  borderLight: '#f3f4f6',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  heading1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  heading2: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  heading3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  body1: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  subtitle1: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 26,
  },
  subtitle2: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
};

export const styles = StyleSheet.create({
  // Containers
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  containerDark: {
    flex: 1,
    backgroundColor: colors.gray[900],
  },
  
  // Cards
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    ...shadows.md,
  },
  cardDark: {
    backgroundColor: colors.gray[800],
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    ...shadows.lg,
  },
  
  // Buttons
  buttonPrimary: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  buttonSecondary: {
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  buttonSecondaryDark: {
    backgroundColor: colors.gray[700],
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  
  // Text Styles
  h1: {
    ...typography.h1,
    color: colors.gray[900],
  },
  h1Dark: {
    ...typography.h1,
    color: '#FFFFFF',
  },
  h2: {
    ...typography.h2,
    color: colors.gray[900],
  },
  h2Dark: {
    ...typography.h2,
    color: '#FFFFFF',
  },
  h3: {
    ...typography.h3,
    color: colors.gray[900],
  },
  h3Dark: {
    ...typography.h3,
    color: '#FFFFFF',
  },
  body: {
    ...typography.body,
    color: colors.gray[700],
  },
  bodyDark: {
    ...typography.body,
    color: colors.gray[200],
  },
  caption: {
    ...typography.caption,
    color: colors.gray[500],
  },
  captionDark: {
    ...typography.caption,
    color: colors.gray[400],
  },
  
  // Layout
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  alignCenter: {
    alignItems: 'center',
  },
  
  // Input
  input: {
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.gray[900],
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  inputDark: {
    backgroundColor: colors.gray[800],
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.gray[600],
  },
  
  // Quick Action
  quickAction: {
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.gray[50],
    ...shadows.sm,
  },
  quickActionDark: {
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.gray[800],
    ...shadows.sm,
  },
  
  // Grid
  grid2: {
    width: '48%',
  },
  grid3: {
    width: '32%',
  },
  grid4: {
    width: '23%',
  },
  
  // Gradients (using solid color for now)
  gradientPrimary: {
    backgroundColor: colors.primary,
  },
  
  // Hero Card
  heroCard: {
    borderRadius: borderRadius['2xl'],
    padding: spacing.lg,
    ...shadows.md,
  },
  
  // Deal Card
  dealCard: {
    width: 200,
    height: 120,
    borderRadius: borderRadius.xl,
    marginRight: spacing.md,
    overflow: 'hidden',
    ...shadows.md,
  },
  
  // Venue Card
  venueCard: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginBottom: spacing.md,
    ...shadows.md,
  },
  
  // Stat Card
  statCard: {
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    flex: 1,
    marginHorizontal: spacing.xs,
    ...shadows.sm,
  },
  statCardDark: {
    backgroundColor: colors.gray[800],
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    flex: 1,
    marginHorizontal: spacing.xs,
    ...shadows.sm,
  },
});

export default {
  colors,
  spacing,
  borderRadius,
  shadows,
  typography,
  styles,
};
