import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from './IconSymbol';
import { useTheme } from '@/context/ThemeContext';
import { colors, spacing, borderRadius, shadows } from '@/styles/modernTheme';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

interface NaviGenieCardProps {
  onPress?: () => void;
}

export const NaviGenieCard: React.FC<NaviGenieCardProps> = ({ onPress }) => {
  const { isDark } = useTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation for the icon
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
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

    // Shimmer animation for premium feel
    const shimmerAnimation = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    );

    pulseAnimation.start();
    shimmerAnimation.start();

    return () => {
      pulseAnimation.stop();
      shimmerAnimation.stop();
    };
  }, []);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push('/chat/assistant');
    }
  };

  const handleScanPress = () => {
    // For now, navigate to explore page or show a scanner modal
    router.push('/explore');
  };

  const handleChatPress = () => {
    router.push('/chat/assistant');
  };

  const shimmerTranslateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.95}
      style={styles.container}
    >
      <LinearGradient
        colors={[
          isDark ? '#6366f1' : '#8b5cf6',
          isDark ? '#8b5cf6' : '#a855f7', 
          isDark ? '#a855f7' : '#c084fc'
        ]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Shimmer Effect */}
        <Animated.View
          style={[
            styles.shimmer,
            {
              transform: [{ translateX: shimmerTranslateX }],
            },
          ]}
        />

        <View style={styles.content}>
          <View style={styles.header}>
            <Animated.View 
              style={[
                styles.iconContainer,
                {
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              <IconSymbol name="bolt.fill" size={22} color="#FFFFFF" />
              <View style={styles.aiIndicator}>
                <View style={styles.aiDot} />
              </View>
            </Animated.View>
            <View style={styles.titleContainer}>
              <View style={styles.titleRow}>
                <Text style={styles.title}>NaviGenie</Text>
                <View style={styles.aibadge}>
                  <Text style={styles.aiBadgeText}>AI</Text>
                </View>
              </View>
              <Text style={styles.subtitle}>Smart navigation assistant</Text>
            </View>
          </View>
          
          <Text style={styles.description}>
            Ask for directions, scan items, or discover nearby places instantly! �
          </Text>
          
          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleScanPress}
              activeOpacity={0.8}
            >
              <View style={styles.actionIconContainer}>
                <IconSymbol name="camera.viewfinder" size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.actionText}>Scan</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleChatPress}
              activeOpacity={0.8}
            >
              <View style={styles.actionIconContainer}>
                <IconSymbol name="message.circle" size={16} color="#FFFFFF" />
              </View>
              <Text style={styles.actionText}>Chat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius['2xl'],
    overflow: 'hidden',
    ...shadows.lg,
    elevation: 8,
  },
  gradient: {
    padding: spacing.md,
    position: 'relative',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.1)',
    width: 100,
    transform: [{ skewX: '-20deg' }],
  },
  content: {
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconContainer: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: borderRadius.xl,
    padding: spacing.sm,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  aiIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00FF88',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  aiDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#FFFFFF',
  },
  titleContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 2,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  aibadge: {
    backgroundColor: 'rgba(0,255,136,0.2)',
    borderRadius: borderRadius.sm,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderWidth: 1,
    borderColor: '#00FF88',
  },
  aiBadgeText: {
    color: '#00FF88',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  description: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  actionIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: borderRadius.sm,
    padding: 3,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
});

export default NaviGenieCard;
