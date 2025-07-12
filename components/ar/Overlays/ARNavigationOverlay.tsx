import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GlassCard from '../../ui/GlassCard';

interface ARNavigationOverlayProps {
  venueName: string;
  // In the future, add route, POIs, user position, etc.
}

export default function ARNavigationOverlay({ venueName }: ARNavigationOverlayProps) {
  return (
    <View style={styles.overlay} pointerEvents="none">
      <GlassCard style={{ alignItems: 'center', padding: 16, backgroundColor: 'rgba(255,255,255,0.18)' }}>
        <Text style={styles.title}>AR Navigation Overlay</Text>
        <Text style={styles.subtitle}>Guiding to: {venueName}</Text>
        {/* Future: Render 3D arrows, POIs, route, etc. */}
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.15)',
    padding: 12,
    borderRadius: 12,
  },
  title: {
    color: '#00AEEF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  subtitle: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
  },
});
