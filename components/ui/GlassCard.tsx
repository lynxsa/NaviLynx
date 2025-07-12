import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

interface GlassCardProps {
  children: React.ReactNode;
  style?: any;
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  className?: string;
}

export default function GlassCard({ 
  children, 
  style, 
  intensity = 50, 
  tint = Platform.OS === 'ios' ? 'light' : 'default',
  className = '',
  ...accessibilityProps 
}: GlassCardProps & React.ComponentProps<typeof View>) {
  return (
    <View 
      style={[styles.shadow, style]} 
      className={`rounded-2xl overflow-hidden ${className}`}
      {...accessibilityProps}
    >
      <BlurView 
        intensity={intensity} 
        tint={tint} 
        style={styles.glass}
        className="rounded-2xl p-4"
      >
        {children}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    margin: 8,
  },
  glass: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
});
