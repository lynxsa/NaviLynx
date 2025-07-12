import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { IconSymbol } from './IconSymbol';
import { useTheme } from '@/context/ThemeContext';
import { colors, spacing, borderRadius, shadows } from '@/styles/modernTheme';
import { router } from 'expo-router';

interface NaviGenieCardProps {
  onPress?: () => void;
}

export const NaviGenieCard: React.FC<NaviGenieCardProps> = ({ onPress }) => {
  const { isDark } = useTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;

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

    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
    };
  }, []);

  const handleChatPress = () => {
    router.push('/chat/assistant');
  };

  return (
    <View style={[
      {
        backgroundColor: isDark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.05)',
        borderRadius: borderRadius['2xl'],
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: isDark ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.2)',
        ...shadows.md,
      }
    ]}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
        <Animated.View style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: colors.primary,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: spacing.sm,
          transform: [{ scale: pulseAnim }],
        }}>
          <IconSymbol name="lightbulb" size={22} color="#FFFFFF" />
          <View style={{
            position: 'absolute',
            top: -2,
            right: -2,
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: '#10b981',
          }} />
        </Animated.View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
            <Text style={[
              {
                fontSize: 18,
                fontWeight: '700',
                color: isDark ? '#FFFFFF' : colors.text,
                marginRight: spacing.xs,
              }
            ]}>
              NaviGenie
            </Text>
            <View style={{
              backgroundColor: colors.primary,
              borderRadius: borderRadius.sm,
              paddingHorizontal: spacing.xs,
              paddingVertical: 2,
            }}>
              <Text style={{ color: '#FFFFFF', fontSize: 9, fontWeight: '700' }}>AI</Text>
            </View>
          </View>
          <Text style={[
            {
              fontSize: 13,
              color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
              fontWeight: '500'
            }
          ]}>
            Smart navigation assistant
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={{ 
        flexDirection: 'row', 
        gap: spacing.sm,
        marginBottom: spacing.md 
      }}>
        <TouchableOpacity
          onPress={handleChatPress}
          style={[
            {
              flex: 1,
              backgroundColor: colors.primary,
              borderRadius: borderRadius.xl,
              paddingVertical: spacing.md,
              paddingHorizontal: spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              ...shadows.sm,
            }
          ]}
          activeOpacity={0.8}
        >
          <IconSymbol name="message" size={18} color="#FFFFFF" />
          <Text style={[
            {
              fontSize: 14,
              fontWeight: '600',
              marginLeft: spacing.xs,
              color: '#FFFFFF'
            }
          ]}>
            Chat with AI
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/explore')}
          style={[
            {
              flex: 1,
              backgroundColor: isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.1)',
              borderRadius: borderRadius.xl,
              paddingVertical: spacing.md,
              paddingHorizontal: spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: isDark ? 'rgba(99,102,241,0.4)' : 'rgba(99,102,241,0.3)',
            }
          ]}
          activeOpacity={0.7}
        >
          <IconSymbol name="map" size={18} color={colors.primary} />
          <Text style={[
            {
              fontSize: 14,
              fontWeight: '600',
              marginLeft: spacing.xs,
              color: colors.primary
            }
          ]}>
            Navigate
          </Text>
        </TouchableOpacity>
      </View>

      {/* Features */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <IconSymbol name="location" size={16} color={colors.primary} />
          <Text style={[
            {
              fontSize: 11,
              marginTop: spacing.xs,
              textAlign: 'center',
              color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
              fontWeight: '500'
            }
          ]}>
            Directions
          </Text>
        </View>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <IconSymbol name="search" size={16} color={colors.primary} />
          <Text style={[
            {
              fontSize: 11,
              marginTop: spacing.xs,
              textAlign: 'center',
              color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
              fontWeight: '500'
            }
          ]}>
            Find Places
          </Text>
        </View>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <IconSymbol name="accessibility" size={16} color={colors.primary} />
          <Text style={[
            {
              fontSize: 11,
              marginTop: spacing.xs,
              textAlign: 'center',
              color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
              fontWeight: '500'
            }
          ]}>
            Accessibility
          </Text>
        </View>
      </View>
    </View>
  );
};

export default NaviGenieCard;
