import React from 'react';
import { 
  View, 
  Animated, 
  ViewStyle, 
  StyleSheet,
  Platform,
  Pressable,
  AccessibilityRole,
  StyleProp,
} from 'react-native';
import { designSystem, cardVariants, interactionStates } from '../../styles/designSystem';

export interface BaseCardProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled' | 'ghost';
  size?: 'compact' | 'standard' | 'expanded';
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  
  // Backend integration props
  id?: string;
  trackingProps?: {
    category?: string;
    action?: string;
    label?: string;
    value?: number;
  };
  
  // Accessibility props
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: 'button' | 'link' | 'text' | 'image' | 'none';
  
  // Loading state
  loading?: boolean;
  
  // Interactive features
  rippleEffect?: boolean;
  hapticFeedback?: boolean;
}

export function BaseCard({
  children,
  variant = 'elevated',
  size = 'standard',
  onPress,
  onLongPress,
  disabled = false,
  style,
  contentStyle,
  id,
  trackingProps,
  accessible = true,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'button',
  loading = false,
  rippleEffect = true,
  hapticFeedback = true,
}: BaseCardProps) {
  const animatedValue = React.useRef(new Animated.Value(1)).current;

  // Size configurations
  const sizeConfig = {
    compact: {
      padding: designSystem.spacing.sm,
      minHeight: 64,
    },
    standard: {
      padding: designSystem.spacing.md,
      minHeight: 80,
    },
    expanded: {
      padding: designSystem.spacing.lg,
      minHeight: 120,
    },
  };

  // Handle press with analytics tracking
  const handlePress = React.useCallback(() => {
    if (disabled || loading) return;
    
    // Haptic feedback
    if (hapticFeedback && Platform.OS === 'ios') {
      // Add haptic feedback for iOS
    }
    
    // Analytics tracking
    if (trackingProps) {
      // Log analytics event - ready for backend integration
      console.log('Card Analytics:', {
        cardId: id,
        ...trackingProps,
        timestamp: new Date().toISOString(),
      });
    }
    
    onPress?.();
  }, [disabled, loading, hapticFeedback, trackingProps, id, onPress]);

  // Animation handlers
  const handlePressIn = () => {
    Animated.spring(animatedValue, {
      toValue: interactionStates.pressed.scale,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  // Combine styles
  const cardStyle = [
    styles.baseCard,
    cardVariants[variant],
    sizeConfig[size],
    disabled && styles.disabled,
    loading && styles.loading,
    style,
  ];

  const contentStyles = [
    styles.content,
    contentStyle,
  ];

  // Render interactive card
  if (onPress || onLongPress) {
    return (
      <Animated.View style={[{ transform: [{ scale: animatedValue }] }]}>
        <Pressable
          style={cardStyle}
          onPress={handlePress}
          onLongPress={onLongPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled || loading}
          accessible={accessible}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
          accessibilityRole={accessibilityRole}
          android_ripple={rippleEffect ? {
            color: designSystem.colors.primary[100],
            borderless: false,
            radius: 300,
          } : undefined}
        >
          <View style={contentStyles}>
            {children}
          </View>
        </Pressable>
      </Animated.View>
    );
  }

  // Render static card
  return (
    <View style={cardStyle}>
      <View style={contentStyles}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  baseCard: {
    overflow: 'hidden',
    position: 'relative',
  },
  
  content: {
    flex: 1,
  },
  
  disabled: {
    opacity: 0.6,
  },
  
  loading: {
    opacity: 0.8,
  },
});

export default BaseCard;
