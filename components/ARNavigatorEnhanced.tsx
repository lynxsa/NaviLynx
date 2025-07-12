import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '@/context/ThemeContext';
import { useNavigationState } from '@/hooks/useNavigationState';
import { Spacing, BorderRadius, Typography, Shadows } from '@/constants/Theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ARMarker {
  id: string;
  title: string;
  category: string;
  distance: number;
  direction: number; // angle in degrees (0-360)
  x: number; // screen position
  y: number;
  isVisible: boolean;
  color: string;
  icon: string;
  description?: string;
  floor?: string;
  estimatedWalkTime?: number;
}

interface UserPosition {
  x: number;
  y: number;
  orientation: number; // compass bearing in degrees
  floor: string;
}

interface NavigationPath {
  id: string;
  points: { x: number; y: number }[];
  color: string;
  width: number;
  animated: boolean;
}

export default function ARNavigatorEnhanced() {
  const { colors } = useTheme();
  const { goBack, navigateToVenue } = useNavigationState();
  
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [currentMode, setCurrentMode] = useState<'explore' | 'navigate' | 'search'>('explore');
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [compassHeading, setCompassHeading] = useState(0);
  
  // User position and orientation
  const [userPosition] = useState<UserPosition>({
    x: screenWidth / 2,
    y: screenHeight * 0.8,
    orientation: 0,
    floor: 'Ground Floor',
  });

  // AR markers for nearby stores/points of interest
  const [arMarkers] = useState<ARMarker[]>([
    {
      id: '1',
      title: 'Zara',
      category: 'Fashion',
      distance: 45,
      direction: 15,
      x: screenWidth * 0.7,
      y: screenHeight * 0.4,
      isVisible: true,
      color: '#FF6B35',
      icon: 'bag.fill',
      description: 'Latest fashion collection',
      floor: 'Ground Floor',
      estimatedWalkTime: 2,
    },
    {
      id: '2',
      title: 'iStore',
      category: 'Electronics',
      distance: 80,
      direction: 45,
      x: screenWidth * 0.8,
      y: screenHeight * 0.3,
      isVisible: true,
      color: '#007AFF',
      icon: 'phone.fill',
      description: 'Apple products and accessories',
      floor: 'Ground Floor',
      estimatedWalkTime: 3,
    },
    {
      id: '3',
      title: 'Vida e Caffè',
      category: 'Food & Beverage',
      distance: 25,
      direction: 330,
      x: screenWidth * 0.3,
      y: screenHeight * 0.5,
      isVisible: true,
      color: '#34C759',
      icon: 'cup.and.saucer.fill',
      description: 'Premium coffee and light meals',
      floor: 'Ground Floor',
      estimatedWalkTime: 1,
    },
    {
      id: '4',
      title: 'Restrooms',
      category: 'Facilities',
      distance: 20,
      direction: 270,
      x: screenWidth * 0.2,
      y: screenHeight * 0.6,
      isVisible: true,
      color: '#5AC8FA',
      icon: 'figure.walk',
      description: 'Public restrooms',
      floor: 'Ground Floor',
      estimatedWalkTime: 1,
    },
  ]);

  // Navigation path
  const [navigationPath, setNavigationPath] = useState<NavigationPath | null>(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const markerAnims = useRef(arMarkers.map(() => new Animated.Value(0))).current;

  const startAnimations = useCallback(() => {
    // Pulse animation for user position
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Staggered entrance for markers
    markerAnims.forEach((anim, index) => {
      Animated.sequence([
        Animated.delay(index * 200),
        Animated.spring(anim, {
          toValue: 1,
          useNativeDriver: true,
        })
      ]).start();
    });
  }, [pulseAnim, markerAnims]);

  useEffect(() => {
    requestCameraPermission();
    startAnimations();
    
    // Simulate compass updates
    const compassInterval = setInterval(() => {
      setCompassHeading(prev => (prev + 1) % 360);
    }, 100);

    return () => clearInterval(compassInterval);
  }, [startAnimations]);

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const handleMarkerPress = (marker: ARMarker) => {
    Alert.alert(
      marker.title,
      `${marker.description}\n\nDistance: ${marker.distance}m\nEstimated walk time: ${marker.estimatedWalkTime} min${marker.estimatedWalkTime && marker.estimatedWalkTime > 1 ? 's' : ''}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Navigate', 
          onPress: () => startNavigation(marker),
          style: 'default'
        },
        { 
          text: 'View Store', 
          onPress: () => navigateToVenue(marker.id, marker.title),
        },
      ]
    );
  };

  const startNavigation = (destination: ARMarker) => {
    setSelectedDestination(destination.id);
    setCurrentMode('navigate');
    
    // Create navigation path
    const path: NavigationPath = {
      id: 'navigation',
      points: [
        { x: userPosition.x, y: userPosition.y },
        { x: destination.x * 0.8, y: destination.y + 50 },
        { x: destination.x, y: destination.y },
      ],
      color: colors.primary,
      width: 4,
      animated: true,
    };
    
    setNavigationPath(path);
    
    Alert.alert(
      'Navigation Started',
      `Navigating to ${destination.title}. Follow the blue path.`
    );
  };

  const stopNavigation = () => {
    setSelectedDestination(null);
    setCurrentMode('explore');
    setNavigationPath(null);
  };

  const toggleControls = () => {
    const toValue = showControls ? 0 : 1;
    Animated.timing(fadeAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setShowControls(!showControls);
  };

  if (hasPermission === null) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.message, { color: colors.text }]}>
          Requesting camera permission...
        </Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.message, { color: colors.text }]}>
          Camera permission is required for AR navigation
        </Text>
        <TouchableOpacity
          style={[styles.permissionButton, { backgroundColor: colors.primary }]}
          onPress={requestCameraPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Camera View */}
      <CameraView
        style={styles.camera}
        facing="back"
        autofocus="on"
      >
        {/* Navigation Path Overlay */}
        {navigationPath && (
          <View style={styles.pathOverlay}>
            {navigationPath.points.map((point, index) => (
              <View
                key={index}
                style={[
                  styles.pathPoint,
                  {
                    left: point.x - 2,
                    top: point.y - 2,
                    backgroundColor: navigationPath.color,
                  },
                ]}
              />
            ))}
          </View>
        )}

        {/* User Position Indicator */}
        <Animated.View
          style={[
            styles.userPosition,
            {
              left: userPosition.x - 15,
              top: userPosition.y - 15,
              transform: [
                { scale: pulseAnim },
                { rotate: `${userPosition.orientation}deg` },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            style={styles.userPositionInner}
          >
            <IconSymbol name="location.fill" size={16} color="#FFFFFF" />
          </LinearGradient>
        </Animated.View>

        {/* AR Markers */}
        {arMarkers.map((marker, index) => (
          <Animated.View
            key={marker.id}
            style={[
              styles.arMarker,
              {
                left: marker.x - 30,
                top: marker.y - 60,
                transform: [{ scale: markerAnims[index] }],
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.markerContainer,
                { backgroundColor: marker.color + '20' },
                selectedDestination === marker.id && styles.selectedMarker,
              ]}
              onPress={() => handleMarkerPress(marker)}
            >
              <View style={[styles.markerIcon, { backgroundColor: marker.color }]}>
                <IconSymbol name={marker.icon as any} size={20} color="#FFFFFF" />
              </View>
              <View style={[styles.markerLabel, { backgroundColor: colors.surface }]}>
                <Text style={[styles.markerTitle, { color: colors.text }]}>
                  {marker.title}
                </Text>
                <Text style={[styles.markerDistance, { color: colors.mutedForeground }]}>
                  {marker.distance}m
                </Text>
              </View>
              <View style={[styles.markerArrow, { borderTopColor: colors.surface }]} />
            </TouchableOpacity>
          </Animated.View>
        ))}

        {/* Compass */}
        <View style={[styles.compass, { backgroundColor: colors.surface + 'E6' }]}>
          <Animated.View
            style={[
              styles.compassNeedle,
              { transform: [{ rotate: `${compassHeading}deg` }] },
            ]}
          >
            <IconSymbol name="location.north.line.fill" size={24} color={colors.primary} />
          </Animated.View>
          <Text style={[styles.compassText, { color: colors.text }]}>
            {Math.round(compassHeading)}°
          </Text>
        </View>

        {/* Mode Indicator */}
        <View style={[styles.modeIndicator, { backgroundColor: colors.surface + 'E6' }]}>
          <IconSymbol
            name={currentMode === 'navigate' ? 'arrow.triangle.turn.up.right.diamond.fill' : 'viewfinder'}
            size={16}
            color={colors.primary}
          />
          <Text style={[styles.modeText, { color: colors.text }]}>
            {currentMode === 'navigate' ? 'Navigating' : 'Exploring'}
          </Text>
        </View>

        {/* Controls Overlay */}
        <Animated.View
          style={[
            styles.controlsOverlay,
            { opacity: fadeAnim },
          ]}
        >
          {/* Top Controls */}
          <View style={styles.topControls}>
            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: colors.surface + 'CC' }]}
              onPress={goBack}
            >
              <IconSymbol name="chevron.left" size={24} color={colors.text} />
            </TouchableOpacity>

            <View style={[styles.infoPanel, { backgroundColor: colors.surface + 'CC' }]}>
              <Text style={[styles.infoPanelText, { color: colors.text }]}>
                {arMarkers.filter(m => m.isVisible).length} nearby locations
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: colors.surface + 'CC' }]}
              onPress={() => {
                Alert.alert('AR Help', 'Point your camera around to discover nearby stores and facilities. Tap on markers to get directions.');
              }}
            >
              <IconSymbol name="questionmark" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Bottom Controls */}
          <View style={styles.bottomControls}>
            {currentMode === 'navigate' && selectedDestination && (
              <TouchableOpacity
                style={[styles.stopNavigationButton, { backgroundColor: colors.error }]}
                onPress={stopNavigation}
              >
                <IconSymbol name="xmark" size={16} color="#FFFFFF" />
                <Text style={styles.stopNavigationText}>Stop Navigation</Text>
              </TouchableOpacity>
            )}

            <View style={styles.modeButtons}>
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  { backgroundColor: colors.surface + 'CC' },
                  currentMode === 'explore' && { backgroundColor: colors.primary },
                ]}
                onPress={() => setCurrentMode('explore')}
              >
                <IconSymbol
                  name="viewfinder"
                  size={20}
                  color={currentMode === 'explore' ? '#FFFFFF' : colors.text}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modeButton,
                  { backgroundColor: colors.surface + 'CC' },
                  currentMode === 'search' && { backgroundColor: colors.primary },
                ]}
                onPress={() => setCurrentMode('search')}
              >
                <IconSymbol
                  name="magnifyingglass"
                  size={20}
                  color={currentMode === 'search' ? '#FFFFFF' : colors.text}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Tap to hide controls */}
        <TouchableOpacity
          style={styles.tapOverlay}
          onPress={toggleControls}
          activeOpacity={1}
        />
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  message: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: Spacing.lg,
  },
  permissionButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    alignSelf: 'center',
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: "600",
  },
  pathOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  pathPoint: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  userPosition: {
    position: 'absolute',
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userPositionInner: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.medium,
  },
  arMarker: {
    position: 'absolute',
    alignItems: 'center',
  },
  markerContainer: {
    alignItems: 'center',
    borderRadius: 12,
    padding: Spacing.xs,
  },
  selectedMarker: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  markerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
    ...Shadows.small,
  },
  markerLabel: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 60,
    ...Shadows.small,
  },
  markerTitle: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: 'center',
  },
  markerDistance: {
    fontSize: 12,
    textAlign: 'center',
  },
  markerArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: 2,
  },
  compass: {
    position: 'absolute',
    top: 100,
    right: Spacing.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.medium,
  },
  compassNeedle: {
    position: 'absolute',
  },
  compassText: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 24,
  },
  modeIndicator: {
    position: 'absolute',
    top: 100,
    left: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 16,
    gap: Spacing.xs,
    ...Shadows.medium,
  },
  modeText: {
    fontSize: 14,
    fontWeight: "600",
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'box-none',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: Spacing.lg,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.medium,
  },
  infoPanel: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 16,
    ...Shadows.medium,
  },
  infoPanelText: {
    fontSize: 14,
    fontWeight: "500",
  },
  bottomControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: Spacing.lg,
  },
  stopNavigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 16,
    gap: Spacing.sm,
    ...Shadows.medium,
  },
  stopNavigationText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: "600",
  },
  modeButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  modeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.medium,
  },
  tapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
