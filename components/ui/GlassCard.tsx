import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

export default function GlassCard({ children, style, ...accessibilityProps }: { children: React.ReactNode; style?: any } & React.ComponentProps<typeof View>) {
  return (
    <View style={[styles.shadow, style]} {...accessibilityProps}>
      <BlurView intensity={50} tint={Platform.OS === 'ios' ? 'light' : 'default'} style={styles.glass}>
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
