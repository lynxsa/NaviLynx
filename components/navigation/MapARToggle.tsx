import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import { useThemeSafe } from '@/context/ThemeContext';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface MapARToggleProps {
  initialMode?: 'map' | 'ar';
  onToggle?: (mode: 'map' | 'ar') => void;
  size?: 'small' | 'medium' | 'large';
}

export const MapARToggle: React.FC<MapARToggleProps> = ({
  initialMode = 'map',
  onToggle,
  size = 'medium'
}) => {
  const { colors } = useThemeSafe();
  const [mode, setMode] = useState<'map' | 'ar'>(initialMode);
  const animatedValue = useSharedValue(initialMode === 'ar' ? 1 : 0);

  const getSizes = () => {
    switch (size) {
      case 'small':
        return { width: 80, height: 36, iconSize: 16 };
      case 'large':
        return { width: 120, height: 48, iconSize: 24 };
      default:
        return { width: 100, height: 40, iconSize: 20 };
    }
  };

  const { width, height, iconSize } = getSizes();

  const handleToggle = () => {
    const newMode = mode === 'map' ? 'ar' : 'map';
    setMode(newMode);
    animatedValue.value = withSpring(newMode === 'ar' ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
    onToggle?.(newMode);
  };

  const animatedSwitchStyle = useAnimatedStyle(() => {
    const translateX = animatedValue.value * (width / 2 - 2);
    const backgroundColor = interpolateColor(
      animatedValue.value,
      [0, 1],
      [colors.primary, colors.accent]
    );
    
    return {
      transform: [{ translateX }],
      backgroundColor,
    };
  });

  const animatedContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      animatedValue.value,
      [0, 1],
      [colors.surface, colors.surface]
    );
    
    return {
      backgroundColor,
    };
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: height / 2,
          padding: 2,
          borderWidth: 2,
          borderColor: colors.border,
        },
        animatedContainerStyle,
      ]}
    >
      <TouchableOpacity
        onPress={handleToggle}
        activeOpacity={0.8}
        className="flex-1 flex-row"
      >
        {/* Animated background */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              width: width / 2,
              height: height - 4,
              borderRadius: (height - 4) / 2,
              top: 0,
              left: 0,
            },
            animatedSwitchStyle,
          ]}
        />

        {/* Map option */}
        <View className="flex-1 items-center justify-center">
          <IconSymbol
            name="map"
            size={iconSize}
            color={mode === 'map' ? '#FFFFFF' : colors.textSecondary}
          />
        </View>

        {/* AR option */}
        <View className="flex-1 items-center justify-center">
          <IconSymbol
            name="viewfinder.circle"
            size={iconSize}
            color={mode === 'ar' ? '#FFFFFF' : colors.textSecondary}
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Simple toggle button version
interface MapARToggleButtonProps {
  mode: 'map' | 'ar';
  onPress: () => void;
}

export const MapARToggleButton: React.FC<MapARToggleButtonProps> = ({
  mode,
  onPress
}) => {
  const { colors } = useThemeSafe();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="flex-row items-center px-4 py-2 rounded-full shadow-md"
      style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }}
    >
      <IconSymbol
        name={mode === 'map' ? 'viewfinder.circle' : 'map'}
        size={18}
        color={colors.primary}
      />
      <Text 
        className="ml-2 font-medium"
        style={{ color: colors.text }}
      >
        Switch to {mode === 'map' ? 'AR' : 'Map'}
      </Text>
    </TouchableOpacity>
  );
};

// Floating toggle for AR/Map screens
export const FloatingMapARToggle: React.FC<{
  mode: 'map' | 'ar';
  onToggle: (mode: 'map' | 'ar') => void;
  top?: number;
  right?: number;
}> = ({ mode, onToggle, top = 60, right = 20 }) => {
  const { colors } = useThemeSafe();

  const handlePress = () => {
    onToggle(mode === 'map' ? 'ar' : 'map');
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      className="absolute w-12 h-12 rounded-full shadow-lg items-center justify-center"
      style={{ 
        top, 
        right,
        backgroundColor: colors.surface + 'E6',
        borderColor: colors.border,
        borderWidth: 1
      }}
    >
      <IconSymbol
        name={mode === 'map' ? 'viewfinder.circle' : 'map'}
        size={20}
        color={colors.primary}
      />
    </TouchableOpacity>
  );
};
