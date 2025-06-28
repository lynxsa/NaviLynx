import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '@/context/ThemeContext';
import { brand } from '@/constants/branding';

export type NavigationMode = 'map' | 'ar';

interface MapARToggleProps {
  mode: NavigationMode;
  onModeChange: (mode: NavigationMode) => void;
  style?: any;
}

export default function MapARToggle({ mode, onModeChange, style }: MapARToggleProps) {
  const { colors } = useTheme();
  const slideAnimation = useSharedValue(mode === 'map' ? 0 : 1);

  const handleModeChange = (newMode: NavigationMode) => {
    slideAnimation.value = withSpring(newMode === 'map' ? 0 : 1, {
      damping: 15,
      stiffness: 150,
    });
    onModeChange(newMode);
  };

  const animatedSliderStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideAnimation.value * 80 }],
  }));

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }, style]}>
      <View style={styles.toggleContainer}>
        {/* Animated Slider Background */}
        <Animated.View style={[animatedSliderStyle, styles.slider]}>
          <LinearGradient
            colors={[colors.primary, colors.success]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sliderGradient}
          />
        </Animated.View>

        {/* Map Mode Button */}
        <TouchableOpacity
          style={styles.modeButton}
          onPress={() => handleModeChange('map')}
          activeOpacity={0.8}
        >
          <IconSymbol 
            name="map.fill" 
            size={18} 
            color={mode === 'map' ? brand.light : colors.textSecondary} 
          />
          <Text 
            style={[
              styles.modeText,
              { color: mode === 'map' ? brand.light : colors.textSecondary }
            ]}
          >
            Map
          </Text>
        </TouchableOpacity>

        {/* AR Mode Button */}
        <TouchableOpacity
          style={styles.modeButton}
          onPress={() => handleModeChange('ar')}
          activeOpacity={0.8}
        >
          <IconSymbol 
            name="viewfinder" 
            size={18} 
            color={mode === 'ar' ? brand.light : colors.textSecondary} 
          />
          <Text 
            style={[
              styles.modeText,
              { color: mode === 'ar' ? brand.light : colors.textSecondary }
            ]}
          >
            AR
          </Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 25,
    borderWidth: 1,
    padding: 4,
    alignSelf: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    position: 'relative',
  },
  slider: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 80,
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  sliderGradient: {
    flex: 1,
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: 80,
    borderRadius: 20,
  },
  modeText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
});
