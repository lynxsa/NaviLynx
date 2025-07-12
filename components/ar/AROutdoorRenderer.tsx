import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useTheme } from '@/context/ThemeContext';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { BlurView } from '@/components/ui/BlurView';
import { NavigationRoute, UserLocation, ARCapabilities } from '@/types/navigation';
import { colors, spacing, borderRadius } from '@/styles/modernTheme';

interface AROutdoorRendererProps {
  route: NavigationRoute | null;
  userLocation: UserLocation | null;
  isVisible: boolean;
  onARError?: (error: string) => void;
}

const AROutdoorRenderer: React.FC<AROutdoorRendererProps> = ({
  route,
  userLocation,
  isVisible,
  onARError
}) => {
  const { theme } = useTheme();
  const isDark = theme.dark;
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [arCapabilities, setArCapabilities] = useState<ARCapabilities>({
    isARSupported: false,
    hasARCore: false,
    hasARKit: false,
    supportsPlaneDetection: false,
    supportsLightEstimation: false,
  });
  const [isARReady, setIsARReady] = useState(false);

  useEffect(() => {
    const checkARCapabilities = async () => {
      try {
        // Check device AR capabilities
        const capabilities: ARCapabilities = {
          isARSupported: Platform.OS === 'ios' || Platform.OS === 'android',
          hasARCore: Platform.OS === 'android',
          hasARKit: Platform.OS === 'ios',
          supportsPlaneDetection: true, // Assume supported for now
          supportsLightEstimation: true, // Assume supported for now
        };

        setArCapabilities(capabilities);
        setIsARReady(capabilities.isARSupported);

        if (!capabilities.isARSupported) {
          onARError?.('AR is not supported on this device');
        }
      } catch (error) {
        console.error('AR capability check error:', error);
        onARError?.('Failed to check AR capabilities');
      }
    };

    const requestCameraAccess = async () => {
      if (!cameraPermission?.granted) {
        const result = await requestCameraPermission();
        if (!result?.granted) {
          Alert.alert(
            'Camera Permission Required',
            'Camera access is needed for AR navigation. Please enable it in settings.',
            [{ text: 'OK' }]
          );
          onARError?.('Camera permission denied');
        }
      }
    };

    if (isVisible) {
      checkARCapabilities();
      requestCameraAccess();
    }
  }, [isVisible, cameraPermission?.granted, requestCameraPermission, onARError]);

  const calculateBearing = (
    startLat: number,
    startLng: number,
    destLat: number,
    destLng: number
  ): number => {
    const dLng = (destLng - startLng) * Math.PI / 180;
    const lat1 = startLat * Math.PI / 180;
    const lat2 = destLat * Math.PI / 180;

    const y = Math.sin(dLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

    let bearing = Math.atan2(y, x) * 180 / Math.PI;
    return (bearing + 360) % 360;
  };

  const getNextWaypoint = () => {
    if (!route || !userLocation) return null;
    
    // Find the next waypoint that hasn't been passed
    return route.waypoints.find(waypoint => {
      const distance = Math.sqrt(
        Math.pow(waypoint.latitude - userLocation.latitude, 2) +
        Math.pow(waypoint.longitude - userLocation.longitude, 2)
      );
      return distance > 0.0001; // roughly 10 meters
    });
  };

  const renderAROverlays = () => {
    if (!route || !userLocation || !isARReady) return null;

    const nextWaypoint = getNextWaypoint();
    if (!nextWaypoint) return null;

    const bearing = calculateBearing(
      userLocation.latitude,
      userLocation.longitude,
      nextWaypoint.latitude,
      nextWaypoint.longitude
    );

    return (
      <>
        {/* Destination Info Card */}
        <BlurView style={styles.destinationCard} tint={isDark ? 'dark' : 'light'} intensity={80}>
          <Text style={[styles.destinationName, { color: theme.colors.text }]}>
            {route.destination.name}
          </Text>
          <Text style={[styles.destinationDistance, { color: theme.colors.textSecondary }]}>
            {Math.round(route.distance / 1000 * 10) / 10} km away
          </Text>
        </BlurView>

        {/* AR Direction Arrow */}
        <View style={styles.arDirectionContainer}>
          <View style={[styles.arArrow, { backgroundColor: colors.primary }]}>
            <IconSymbol 
              name="arrow.up" 
              size={32} 
              color="white"
              style={{ transform: [{ rotate: `${bearing}deg` }] }}
            />
          </View>
          <Text style={[styles.directionText, { color: theme.colors.text }]}>
            {nextWaypoint.instruction}
          </Text>
        </View>

        {/* Distance and ETA Info */}
        <BlurView style={styles.navigationInfo} tint={isDark ? 'dark' : 'light'} intensity={80}>
          <View style={styles.infoRow}>
            <IconSymbol name="location" size={16} color={colors.primary} />
            <Text style={[styles.infoText, { color: theme.colors.text }]}>
              {Math.round(nextWaypoint.distance)} m
            </Text>
          </View>
          <View style={styles.infoRow}>
            <IconSymbol name="clock" size={16} color={colors.primary} />
            <Text style={[styles.infoText, { color: theme.colors.text }]}>
              {Math.round(route.duration / 60)} min
            </Text>
          </View>
        </BlurView>

        {/* AR Path Indicators */}
        <View style={styles.pathIndicators}>
          {[1, 2, 3].map((_, index) => (
            <View
              key={index}
              style={[
                styles.pathDot,
                { 
                  backgroundColor: colors.primary,
                  opacity: 1 - (index * 0.3),
                  marginTop: index * 20,
                }
              ]}
            />
          ))}
        </View>
      </>
    );
  };

  if (!isVisible) return null;

  if (!arCapabilities.isARSupported) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.errorContainer}>
          <IconSymbol name="exclamationmark.triangle" size={48} color={colors.error} />
          <Text style={[styles.errorTitle, { color: theme.colors.text }]}>
            AR Not Supported
          </Text>
          <Text style={[styles.errorMessage, { color: theme.colors.textSecondary }]}>
            Your device doesn't support AR features. Please use Map view instead.
          </Text>
        </View>
      </View>
    );
  }

  if (!cameraPermission?.granted) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.errorContainer}>
          <IconSymbol name="camera" size={48} color={colors.primary} />
          <Text style={[styles.errorTitle, { color: theme.colors.text }]}>
            Camera Access Required
          </Text>
          <Text style={[styles.errorMessage, { color: theme.colors.textSecondary }]}>
            Please enable camera access to use AR navigation.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera}>
        <View style={styles.arOverlayContainer}>
          {renderAROverlays()}
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  arOverlayContainer: {
    flex: 1,
    padding: spacing.lg,
  },
  destinationCard: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  destinationName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  destinationDistance: {
    fontSize: 14,
  },
  arDirectionContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -40 }, { translateY: -60 }],
    alignItems: 'center',
  },
  arArrow: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  directionText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    color: 'white',
  },
  navigationInfo: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.lg,
    right: spacing.lg,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '600',
  },
  pathIndicators: {
    position: 'absolute',
    bottom: '30%',
    left: '50%',
    transform: [{ translateX: -5 }],
    alignItems: 'center',
  },
  pathDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginVertical: 2,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default AROutdoorRenderer;
