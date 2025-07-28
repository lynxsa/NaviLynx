import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '@/context/ThemeContext';
import { colors, spacing, borderRadius } from '@/styles/modernTheme';

interface EnhancedNavigateButtonProps {
  onPress: () => void;
  title?: string;
  subtitle?: string;
  size?: 'small' | 'medium' | 'large';
  gradient?: string[];
  animateIcon?: boolean;
}

export const EnhancedNavigateButton: React.FC<EnhancedNavigateButtonProps> = ({
  onPress,
  title = 'Navigate!',
  subtitle = 'Start your indoor journey',
  size = 'large',
  gradient = ['#8B5CF6', '#7C3AED', '#6D28D9'],
  animateIcon = true,
}) => {
  const { isDark } = useTheme();
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (animateIcon) {
      // Bounce animation
      const bounceAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );

      // Rotation animation
      const rotateAnimation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      );

      // Pulse animation for the button
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.02,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      );

      bounceAnimation.start();
      rotateAnimation.start();
      pulseAnimation.start();

      return () => {
        bounceAnimation.stop();
        rotateAnimation.stop();
        pulseAnimation.stop();
      };
    }
  }, [animateIcon, bounceAnim, rotateAnim, pulseAnim]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const buttonSizes = {
    small: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
      titleSize: 14,
      subtitleSize: 10,
      iconSize: 18,
      borderRadius: 12,
    },
    medium: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      titleSize: 16,
      subtitleSize: 11,
      iconSize: 20,
      borderRadius: 16,
    },
    large: {
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.xl,
      titleSize: 18,
      subtitleSize: 12,
      iconSize: 24,
      borderRadius: 20,
    },
  };

  const currentSize = buttonSizes[size];

  return (
    <View>
      {/* Glow Effect */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: currentSize.borderRadius,
          backgroundColor: gradient[0],
          opacity: 0.2,
          transform: [{ scale: 1.02 }],
          shadowColor: gradient[0],
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 8,
        }}
      />

      <Animated.View
        style={{
          transform: [{ scale: pulseAnim }],
        }}
      >
        <TouchableOpacity 
          onPress={onPress}
          activeOpacity={0.8}
          style={{
            borderRadius: currentSize.borderRadius,
            overflow: 'hidden',
            shadowColor: gradient[0],
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 12,
          }}
        >
          <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: currentSize.paddingVertical,
              paddingHorizontal: currentSize.paddingHorizontal,
              position: 'relative',
            }}
          >
            {/* Background Pattern */}
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.1,
              }}
            >
              {[...Array(6)].map((_, i) => (
                <View
                  key={i}
                  style={{
                    position: 'absolute',
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    backgroundColor: '#FFFFFF',
                    opacity: 0.05,
                    left: i * 50 - 25,
                    top: -25,
                  }}
                />
              ))}
            </View>

            {/* Animated Icon */}
            <Animated.View
              style={{
                marginRight: spacing.md,
                transform: [
                  { scale: bounceAnim },
                  { rotate: rotation }
                ],
              }}
            >
              <View
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: currentSize.borderRadius / 2,
                  padding: spacing.sm,
                }}
              >
                <IconSymbol 
                  name="location.fill" 
                  size={currentSize.iconSize} 
                  color="#FFFFFF" 
                />
              </View>
            </Animated.View>

            {/* Text Content */}
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: currentSize.titleSize,
                  fontWeight: '800',
                  color: '#FFFFFF',
                  letterSpacing: 0.5,
                  textAlign: 'center',
                  marginBottom: 2,
                  textShadowColor: 'rgba(0,0,0,0.3)',
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 2,
                }}
              >
                {title}
              </Text>
              <Text
                style={{
                  fontSize: currentSize.subtitleSize,
                  fontWeight: '500',
                  color: 'rgba(255,255,255,0.9)',
                  textAlign: 'center',
                  letterSpacing: 0.2,
                }}
              >
                {subtitle}
              </Text>
            </View>

            {/* Arrow Icon */}
            <View
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: 12,
                padding: spacing.sm,
                marginLeft: spacing.md,
              }}
            >
              <IconSymbol 
                name="arrow.right" 
                size={16} 
                color="#FFFFFF" 
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};
