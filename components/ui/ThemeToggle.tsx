import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { IconSymbol } from './IconSymbol';
import { useTheme } from '@/context/ThemeContext';
import { colors, spacing, borderRadius, shadows } from '@/styles/modernTheme';

interface ThemeToggleProps {
  size?: number;
  minimal?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ size = 28, minimal = false }) => {
  const { isDark, toggleTheme } = useTheme();

  if (minimal) {
    return (
      <IconSymbol
        name={isDark ? 'sun.max.fill' : 'moon.fill'}
        size={size}
        color={isDark ? '#FFD700' : colors.primary[600]}
      />
    );
  }

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={[
        styles.container,
        {
          backgroundColor: isDark ? colors.gray[800] : colors.gray[100],
        }
      ]}
      activeOpacity={0.7}
    >
      <IconSymbol
        name={isDark ? 'sun.max.fill' : 'moon.fill'}
        size={size}
        color={isDark ? '#FFD700' : colors.primary[600]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.full,
    padding: spacing.md,
    ...shadows.sm,
  },
});

export default ThemeToggle;
