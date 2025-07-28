/**
 * Enhanced AR Performance Monitor Component
 * Displays real-time performance metrics and optimization status
 * Production-ready with memory management and battery optimization
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Fallback colors and spacing
const colors = {
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  textPrimary: '#FFFFFF',
  textSecondary: '#CCCCCC',
  textTertiary: '#999999',
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
};

interface ARPerformanceMonitorProps {
  frameRate: number;
  memoryUsage: number;
  batteryOptimized: boolean;
  isVisible?: boolean;
}

export default function ARPerformanceMonitor({
  frameRate,
  memoryUsage,
  batteryOptimized,
  isVisible = false
}: ARPerformanceMonitorProps) {
  const isDark = true; // Default to dark theme for AR

  if (!isVisible) return null;

  const getFrameRateColor = (fps: number): string => {
    if (fps >= 55) return colors.success;
    if (fps >= 45) return colors.warning;
    return colors.error;
  };

  const getMemoryColor = (usage: number): string => {
    if (usage < 150) return colors.success;
    if (usage < 200) return colors.warning;
    return colors.error;
  };

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 80,
      right: spacing.md,
      backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
      borderRadius: 8,
      padding: spacing.sm,
      minWidth: 120,
      zIndex: 1000,
    },
    title: {
      fontSize: 12,
      fontWeight: '600',
      color: isDark ? colors.textPrimary : colors.textSecondary,
      marginBottom: spacing.xs,
      textAlign: 'center',
    },
    metric: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xs,
    },
    metricLabel: {
      fontSize: 10,
      color: isDark ? colors.textSecondary : colors.textTertiary,
    },
    metricValue: {
      fontSize: 10,
      fontWeight: '600',
    },
    optimizationStatus: {
      fontSize: 9,
      textAlign: 'center',
      marginTop: spacing.xs,
      fontWeight: '500',
    },
    separator: {
      height: 1,
      backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      marginVertical: spacing.xs,
    }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AR Performance</Text>
      
      <View style={styles.metric}>
        <Text style={styles.metricLabel}>FPS:</Text>
        <Text style={[styles.metricValue, { color: getFrameRateColor(frameRate) }]}>
          {frameRate}
        </Text>
      </View>
      
      <View style={styles.metric}>
        <Text style={styles.metricLabel}>Memory:</Text>
        <Text style={[styles.metricValue, { color: getMemoryColor(memoryUsage) }]}>
          {memoryUsage.toFixed(0)}MB
        </Text>
      </View>
      
      <View style={styles.separator} />
      
      <Text style={[
        styles.optimizationStatus,
        { color: batteryOptimized ? colors.warning : colors.success }
      ]}>
        {batteryOptimized ? 'Battery Mode' : 'Performance Mode'}
      </Text>
    </View>
  );
}
