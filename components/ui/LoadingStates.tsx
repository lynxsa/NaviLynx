/**
 * Loading states and skeleton components for better UX
 */

import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { colors, spacing, borderRadius } from '@/styles/modernTheme';

const { width } = Dimensions.get('window');

interface LoadingSkeletonProps {
  width?: number;
  height?: number;
  borderRadius?: number;
  style?: any;
}

/**
 * Animated skeleton loader
 */
export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  width: skeletonWidth = width * 0.8,
  height = 20,
  borderRadius: skeletonBorderRadius = 4,
  style,
}) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [animatedValue]);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E1E9EE', '#F2F8FC'],
  });

  return (
    <Animated.View
      style={[
        {
          width: skeletonWidth,
          height,
          backgroundColor,
          borderRadius: skeletonBorderRadius,
        },
        style,
      ]}
    />
  );
};

interface NavigationLoadingProps {
  message?: string;
  progress?: number;
}

/**
 * Navigation-specific loading component
 */
export const NavigationLoading: React.FC<NavigationLoadingProps> = ({
  message = 'Calculating route...',
  progress,
}) => {
  return (
    <View style={styles.navigationLoading}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>{message}</Text>
      {progress !== undefined && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </View>
      )}
    </View>
  );
};

interface ARLoadingProps {
  message?: string;
  step?: string;
}

/**
 * AR-specific loading component
 */
export const ARLoading: React.FC<ARLoadingProps> = ({
  message = 'Initializing AR...',
  step,
}) => {
  return (
    <View style={styles.arLoading}>
      <View style={styles.arLoadingIcon}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
      <Text style={styles.arLoadingTitle}>{message}</Text>
      {step && <Text style={styles.arLoadingStep}>{step}</Text>}
    </View>
  );
};

interface VenueListLoadingProps {
  count?: number;
}

/**
 * Venue list skeleton loader
 */
export const VenueListLoading: React.FC<VenueListLoadingProps> = ({
  count = 5,
}) => {
  return (
    <View style={styles.venueListLoading}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.venueItemSkeleton}>
          <LoadingSkeleton width={60} height={60} borderRadius={8} />
          <View style={styles.venueTextSkeleton}>
            <LoadingSkeleton width={width * 0.8} height={16} />
            <LoadingSkeleton width={width * 0.6} height={12} style={{ marginTop: 8 }} />
            <LoadingSkeleton width={width * 0.4} height={12} style={{ marginTop: 4 }} />
          </View>
        </View>
      ))}
    </View>
  );
};

interface MapLoadingProps {
  message?: string;
}

/**
 * Map loading overlay
 */
export const MapLoading: React.FC<MapLoadingProps> = ({
  message = 'Loading map...',
}) => {
  return (
    <View style={styles.mapLoading}>
      <View style={styles.mapLoadingContent}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.mapLoadingText}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navigationLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  progressBar: {
    width: '80%',
    height: 6,
    backgroundColor: '#E1E9EE',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  progressText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  arLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  arLoadingIcon: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 40,
    marginBottom: spacing.lg,
  },
  arLoadingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  arLoadingStep: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  venueListLoading: {
    padding: spacing.md,
  },
  venueItemSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.md,
  },
  venueTextSkeleton: {
    flex: 1,
    marginLeft: spacing.md,
  },
  mapLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapLoadingContent: {
    backgroundColor: '#FFFFFF',
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mapLoadingText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginTop: spacing.md,
  },
});
