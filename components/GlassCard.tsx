
import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  variant?: 'default' | 'elevated' | 'subtle';
  borderRadius?: 'sm' | 'md' | 'lg' | 'xl';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export default function GlassCard({ 
  children, 
  style, 
  variant = 'default',
  borderRadius = 'lg',
  padding = 'md'
}: GlassCardProps) {
  const { isDark } = useTheme();

  const getBackgroundColor = () => {
    switch (variant) {
      case 'elevated':
        return isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.95)';
      case 'subtle':
        return isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.6)';
      default:
        return isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)';
    }
  };

  const getBorderColor = () => {
    switch (variant) {
      case 'elevated':
        return isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.08)';
      case 'subtle':
        return isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)';
      default:
        return isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.06)';
    }
  };

  const getShadow = () => {
    switch (variant) {
      case 'elevated':
        return {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 8,
        };
      case 'subtle':
        return {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.08,
          shadowRadius: 2,
          elevation: 2,
        };
      default:
        return {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 4,
        };
    }
  };

  const getPadding = () => {
    switch (padding) {
      case 'none': return 0;
      case 'sm': return 12;
      case 'md': return 16;
      case 'lg': return 24;
      default: return 16;
    }
  };

  const getBorderRadius = () => {
    switch (borderRadius) {
      case 'sm': return 8;
      case 'md': return 12;
      case 'lg': return 16;
      case 'xl': return 24;
      default: return 16;
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderRadius: getBorderRadius(),
          padding: getPadding(),
          ...getShadow(),
        },
        Platform.OS === 'ios' && styles.iosBlur,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  iosBlur: {
    backdropFilter: 'blur(20px)',
  },
});
