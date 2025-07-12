import React, { useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withSequence,
  interpolate,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface ShoppingAssistantButtonProps {
  size?: number;
  bottom?: number;
  right?: number;
}

export const ShoppingAssistantButton: React.FC<ShoppingAssistantButtonProps> = ({
  size = 56,
  bottom = 100,
  right = 20
}) => {
  const scale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.7);

  useEffect(() => {
    // Continuous pulse animation
    pulseOpacity.value = withRepeat(
      withSequence(
        withSpring(1, { duration: 1000 }),
        withSpring(0.7, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(0.9, { duration: 100 }),
      withSpring(1, { duration: 100 })
    );
    
    // Navigate to NaviGenie chat with shopping context
    router.push('/(tabs)/navigenie' as any);
  };

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedPulseStyle = useAnimatedStyle(() => {
    const pulseScale = interpolate(pulseOpacity.value, [0.7, 1], [1, 1.2]);
    return {
      transform: [{ scale: pulseScale }],
      opacity: interpolate(pulseOpacity.value, [0.7, 1], [0.3, 0.1]),
    };
  });

  return (
    <View className="absolute z-50" style={{ bottom, right }}>
      {/* Pulse ring */}
      <Animated.View
        className="absolute bg-purple-600 rounded-full"
        style={[
          {
            width: size,
            height: size,
          },
          animatedPulseStyle,
        ]}
      />
      
      {/* Main button */}
      <Animated.View style={animatedButtonStyle}>
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.8}
          className="bg-purple-600 shadow-lg rounded-full flex items-center justify-center"
          style={{ width: size, height: size }}
        >
          <IconSymbol 
            name="bag" 
            size={size * 0.4} 
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default ShoppingAssistantButton;
