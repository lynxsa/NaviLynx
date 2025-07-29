/**
 * 🃏 OPERATION LIONMOUNTAIN - Universal Card Component
 * 
 * Reusable card component that serves as the foundation for:
 * - VenueCard, DealCard, StoreCard, ArticleCard
 * - Consistent purple theme throughout
 * - World-class accessibility and animations
 * 
 * @version 1.0.0 - LIONMOUNTAIN Edition
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TouchableOpacityProps,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { purpleTheme, spacing, borderRadius, shadows } from '../theme/globalTheme';

interface UniversalCardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'gradient' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  gradientColors?: string[];
  style?: ViewStyle;
  onPress?: () => void;
  disabled?: boolean;
  isDark?: boolean;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export const UniversalCard: React.FC<UniversalCardProps> = ({
  children,
  variant = 'default',
  size = 'md',
  gradientColors,
  style,
  onPress,
  disabled = false,
  isDark = false,
  ...props
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePressIn = () => {
    if (!disabled && onPress) {
      scale.value = withSpring(0.98, {
        damping: 15,
        stiffness: 300,
      });
      opacity.value = withTiming(0.9, { duration: 100 });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressOut = () => {
    if (!disabled && onPress) {
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 300,
      });
      opacity.value = withTiming(1, { duration: 100 });
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const getCardStyle = () => {
    const baseStyle = [
      styles.base,
      styles[size],
      isDark ? styles.darkCard : styles.lightCard,
    ];

    switch (variant) {
      case 'elevated':
        return [...baseStyle, shadows.lg];
      case 'glass':
        return [...baseStyle, styles.glass];
      default:
        return [...baseStyle, shadows.md];
    }
  };

  const cardContent = (
    <View style={[getCardStyle(), style]}>
      {children}
    </View>
  );

  if (variant === 'gradient') {
    const colors = gradientColors || purpleTheme.gradients.primary;
    return (
      <AnimatedTouchableOpacity
        style={[animatedStyle]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={1}
        {...props}
      >
        <LinearGradient
          colors={colors}
          style={[getCardStyle(), style]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {children}
        </LinearGradient>
      </AnimatedTouchableOpacity>
    );
  }

  if (onPress) {
    return (
      <AnimatedTouchableOpacity
        style={[animatedStyle]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={1}
        {...props}
      >
        {cardContent}
      </AnimatedTouchableOpacity>
    );
  }

  return <View style={style}>{cardContent}</View>;
};

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },

  // Size variants
  sm: {
    padding: spacing.sm,
    minHeight: 80,
  },
  md: {
    padding: spacing.md,
    minHeight: 120,
  },
  lg: {
    padding: spacing.lg,
    minHeight: 160,
  },

  // Theme variants
  lightCard: {
    backgroundColor: purpleTheme.surface,
    borderWidth: 1,
    borderColor: purpleTheme.border,
  },
  darkCard: {
    backgroundColor: purpleTheme.surfaceDark,
    borderWidth: 1,
    borderColor: purpleTheme.borderDark,
  },

  // Glass morphism effect
  glass: {
    backgroundColor: `${purpleTheme.surface}E6`,
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: `${purpleTheme.primary}20`,
  },
});

export default UniversalCard;
