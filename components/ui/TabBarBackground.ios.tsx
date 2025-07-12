import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useThemeSafe } from '@/context/ThemeContext';
import { colors } from '@/styles/modernTheme';

export default function BlurTabBarBackground() {
  const { isDark } = useThemeSafe();
  
  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Background color that matches the home page */}
      <View 
        style={[
          StyleSheet.absoluteFill, 
          { backgroundColor: isDark ? colors.gray[900] : '#FFFFFF' }
        ]} 
      />
      {/* Blur overlay for iOS native feel */}
      <BlurView
        tint={isDark ? "dark" : "light"}
        intensity={isDark ? 60 : 80}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

export function useBottomTabOverflow() {
  return useBottomTabBarHeight();
}
