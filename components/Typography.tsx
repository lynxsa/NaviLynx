import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Typography } from '@/constants/Theme';

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body1' | 'body2' | 'caption' | 'button';
  color?: 'primary' | 'secondary' | 'text' | 'muted' | 'error' | 'success' | 'warning';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
}

export function TypographyText({
  variant = 'body1',
  color = 'text',
  weight,
  align = 'left',
  style,
  children,
  ...props
}: TypographyProps) {
  const { colors } = useTheme();

  const getVariantStyle = () => {
    switch (variant) {
      case 'h1':
        return {
          fontSize: Typography.sizes['5xl'],
          fontWeight: "700",
          lineHeight: Typography.lineHeights.tight * Typography.sizes['5xl'],
        };
      case 'h2':
        return {
          fontSize: Typography.sizes['4xl'],
          fontWeight: "700",
          lineHeight: Typography.lineHeights.tight * Typography.sizes['4xl'],
        };
      case 'h3':
        return {
          fontSize: Typography.sizes['3xl'],
          fontWeight: "600",
          lineHeight: Typography.lineHeights.tight * Typography.sizes['3xl'],
        };
      case 'h4':
        return {
          fontSize: Typography.sizes['2xl'],
          fontWeight: "600",
          lineHeight: Typography.lineHeights.normal * Typography.sizes['2xl'],
        };
      case 'body1':
        return {
          fontSize: 16,
          fontWeight: "400",
          lineHeight: Typography.lineHeights.relaxed * 16,
        };
      case 'body2':
        return {
          fontSize: 14,
          fontWeight: "400",
          lineHeight: Typography.lineHeights.normal * 14,
        };
      case 'caption':
        return {
          fontSize: 12,
          fontWeight: "500",
          lineHeight: Typography.lineHeights.normal * 12,
        };
      case 'button':
        return {
          fontSize: 16,
          fontWeight: "600",
          lineHeight: Typography.lineHeights.tight * 16,
        };
      default:
        return {};
    }
  };

  const getColorValue = () => {
    switch (color) {
      case 'primary': return colors.primary;
      case 'secondary': return colors.secondary;
      case 'text': return colors.text;
      case 'muted': return colors.mutedForeground;
      case 'error': return colors.error;
      case 'success': return colors.success;
      case 'warning': return colors.warning;
      default: return colors.text;
    }
  };

  const getWeight = () => {
    if (weight) {
      return Typography.weights[weight];
    }
    return undefined;
  };

  return (
    <Text
      style={[
        getVariantStyle() as any,
        {
          color: getColorValue(),
          textAlign: align,
          fontWeight: (getWeight() as any) || (getVariantStyle() as any).fontWeight,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}

export default TypographyText;
