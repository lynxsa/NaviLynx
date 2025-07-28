import React from 'react';
import { View, TouchableOpacity, ViewStyle, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';
import { colors, spacing, borderRadius, shadows } from '@/styles/modernTheme';

interface ModernCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  gradient?: boolean;
  gradientColors?: string[];
  padding?: number;
  cardBorderRadius?: number;
  shadow?: 'sm' | 'md' | 'lg';
  backgroundColor?: string;
  border?: boolean;
  disabled?: boolean;
}

export const ModernCard: React.FC<ModernCardProps> = ({
  children,
  onPress,
  style,
  gradient = false,
  gradientColors = [],
  padding = spacing.lg,
  cardBorderRadius = borderRadius.xl,
  shadow = 'md',
  backgroundColor,
  border = true,
  disabled = false,
}) => {
  const { isDark } = useTheme();

  const cardShadow = {
    sm: shadows.sm,
    md: shadows.md,
    lg: shadows.lg,
  }[shadow];

  const defaultBackgroundColor = backgroundColor || (isDark ? colors.surface : '#FFFFFF');

  const cardStyle = [
    styles.card,
    {
      padding,
      borderRadius: cardBorderRadius,
      backgroundColor: gradient ? 'transparent' : defaultBackgroundColor,
      borderWidth: border ? 1 : 0,
      borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
      opacity: disabled ? 0.6 : 1,
      ...cardShadow,
    },
    style,
  ];

  const CardContent = () => (
    <View style={cardStyle}>
      {children}
    </View>
  );

  if (gradient && gradientColors.length >= 2) {
    return (
      <TouchableOpacity 
        onPress={onPress} 
        activeOpacity={onPress ? 0.7 : 1}
        disabled={disabled || !onPress}
        style={[cardStyle, { backgroundColor: 'transparent', padding: 0 }]}
      >
        <LinearGradient colors={gradientColors as any} style={{ borderRadius: cardBorderRadius, padding }}>
          {children}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (onPress) {
    return (
      <TouchableOpacity 
        onPress={onPress} 
        activeOpacity={0.7}
        disabled={disabled}
      >
        <CardContent />
      </TouchableOpacity>
    );
  }

  return <CardContent />;
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});
