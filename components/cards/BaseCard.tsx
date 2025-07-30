import React from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import { colors, shadows, borderRadius } from '../../styles/modernTheme';

export interface BaseCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'flat' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

export function BaseCard({
  children,
  onPress,
  style,
  variant = 'default',
  size = 'medium',
  disabled = false,
}: BaseCardProps) {
  const getCardStyles = () => {
    const baseStyles = {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      overflow: 'hidden' as const,
    };

    // Variant styles
    const variantStyles = {
      default: {
        ...shadows.sm,
        borderWidth: 0,
      },
      elevated: {
        ...shadows.md,
        borderWidth: 0,
      },
      flat: {
        borderWidth: 0,
        shadowOpacity: 0,
        elevation: 0,
      },
      outlined: {
        borderWidth: 1,
        borderColor: colors.border,
        shadowOpacity: 0,
        elevation: 0,
      },
    };

    // Size styles
    const sizeStyles = {
      small: {
        padding: 12,
      },
      medium: {
        padding: 16,
      },
      large: {
        padding: 20,
      },
    };

    return {
      ...baseStyles,
      ...variantStyles[variant],
      ...sizeStyles[size],
      ...style,
    };
  };

  if (onPress && !disabled) {
    return (
      <TouchableOpacity
        style={getCardStyles()}
        onPress={onPress}
        activeOpacity={0.7}
        disabled={disabled}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={getCardStyles()}>{children}</View>;
}
