import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Animated,
  StatusBar,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeSafe } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol, IconSymbolName } from '@/components/ui/IconSymbol';
import { AppErrorHandler } from '@/utils/errorHandler';
import MapARToggle, { NavigationMode } from '@/components/MapARToggle';
import MapView from '@/components/MapView';

const { width, height } = Dimensions.get('window');

const DESTINATION_TYPE = 'destination';

interface ARNavigation {
  isActive: boolean;
  destination: string;
  currentFloor: string;
  direction: string;
  distance: string;
  instructions: string[];
  confidence: number;
}

interface ARMarker {
  id: string;
  type: 'destination' | 'waypoint' | 'poi' | 'hazard';
  x: number;
  y: number;
  label: string;
  distance?: string;
  info?: string;
}

export default function ARNavigatorScreen() {
  const { colors } = useThemeSafe();
  const { t, currentLanguage } = useLanguage();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraType: CameraType = 'back';
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationMode, setNavigationMode] = useState<NavigationMode>('ar');
  const [arNavigation, setArNavigation] = useState<ARNavigation>({
    isActive: false,
    destination: '',
    currentFloor: 'Ground Floor',
    direction: '',
    distance: '',
    instructions: [],
    confidence: 0,
  });
  const [arMarkers, setArMarkers] = useState<ARMarker[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const navigationInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const initializeAR = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Simulate AR markers detection
    setArMarkers([
      {
        id: '1',
        type: 'poi',
        x: width * 0.3,
        y: height * 0.4,
        label: 'Entrance A',
        distance: '15m',
        info: 'Main entrance to shopping center'
      },
      {
        id: '2',
        type: 'poi',
        x: width * 0.7,
        y: height * 0.6,
        label: 'ATM',
        distance: '8m',
        info: 'Standard Bank ATM'
      },
      {
        id: '3',
        type: 'poi',
        x: width * 0.5,
        y: height * 0.3,
        label: 'Information Desk',
        distance: '12m',
        info: 'Customer service and information'
      }
    ]);
  }, [fadeAnim]);

  const requestPermissions = useCallback(async () => {
    try {
      await requestPermission();
      await Location.requestForegroundPermissionsAsync();
    } catch (error) {
      AppErrorHandler.handleCameraError(error, currentLanguage);
    }
  }, [currentLanguage, requestPermission]);

  useEffect(() => {
    requestPermissions();
    initializeAR();
    
    return () => {
      if (navigationInterval.current) {
        clearInterval(navigationInterval.current);
      }
    };
  }, [requestPermissions, initializeAR]);

  const startPulseAnimation = useCallback(() => {
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
  }, [pulseAnim]);

  const simulateARNavigation = useCallback(() => {
    const destinations = [
      'Woolworths Store',
      'Food Court',
      'Cinema Complex',
      'Parking Level P2',
      'ATM Services',
      'Customer Service'
    ];

    const instructions = [
      'Walk straight for 20 meters',
      'Turn right at the corridor',
      'Go up one level using the escalator',
      'Continue until you see the store entrance',
      'You have arrived at your destination'
    ];

    const randomDestination = destinations[Math.floor(Math.random() * destinations.length)];

    startPulseAnimation();

    setArNavigation({
      isActive: true,
      destination: randomDestination,
      currentFloor: 'Ground Floor',
      direction: 'Northeast',
      distance: '45m',
      instructions: instructions,
      confidence: 92,
    });

    // Add destination marker
    setArMarkers(prev => [...prev, {
      id: 'destination',
      type: 'destination',
      x: width * 0.8,
      y: height * 0.2,
      label: randomDestination,
      distance: '45m'
    }]);

    // Simulate navigation updates
    let step = 0;
    navigationInterval.current = setInterval(() => {
      step++;
      if (step >= instructions.length) {
        if (navigationInterval.current) {
          clearInterval(navigationInterval.current);
        }
        setIsNavigating(false);
        Alert.alert(t('arrived'), `You have arrived at ${randomDestination}!`);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        return;
      }

      setArNavigation(prev => ({
        ...prev,
        distance: `${Math.max(5, 45 - (step * 10))}m`,
        confidence: Math.min(95, 85 + (step * 2)),
      }));
    }, 3000);
  }, [t, startPulseAnimation]);

  const startNavigation = useCallback(() => {
    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setTimeout(() => {
      setIsNavigating(true);
      setIsLoading(false);
      simulateARNavigation();
    }, 1500);
  }, [simulateARNavigation]);

  const stopNavigation = useCallback(() => {
    setIsNavigating(false);
    setArNavigation(prev => ({ ...prev, isActive: false }));
    setArMarkers(prev => prev.filter(marker => marker.type !== 'destination'));
    
    if (navigationInterval.current) {
      clearInterval(navigationInterval.current);
      navigationInterval.current = null;
    }
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const renderARMarker = useCallback((marker: ARMarker) => {
    const markerColors = {
      destination: colors.notification || '#FF5252',
      waypoint: colors.primary || '#6200EE',
      poi: colors.secondary || '#03DAC6',
      hazard: '#FF6B6B'
    };

    const markerIcons: Record<string, IconSymbolName> = {
      destination: 'location',
      waypoint: 'circle',
      poi: 'info',
      hazard: 'exclamationmark.triangle'
    };

    return (
      <Animated.View
        key={marker.id}
        style={[
          styles.arMarker,
          {
            left: marker.x - 25,
            top: marker.y - 25,
            transform: marker.type === DESTINATION_TYPE ? [{ scale: pulseAnim }] : [],
          }
        ]}
      >
        <LinearGradient
          colors={[markerColors[marker.type as keyof typeof markerColors], String(markerColors[marker.type as keyof typeof markerColors]) + '80']}
          style={styles.markerGradient}
        >
          <IconSymbol name={markerIcons[marker.type]} size={20} color="#FFFFFF" />
        </LinearGradient>

        <View style={[styles.markerLabel, { backgroundColor: colors.card || '#FFFFFF' }]}>
          <Text style={StyleSheet.flatten([styles.markerText, { color: colors.text || '#000000' }])}>{marker.label}</Text>
          {marker.distance && (
            <Text style={StyleSheet.flatten([styles.markerDistance, { color: colors.icon || '#888888' }])}>{marker.distance}</Text>
          )}
        </View>

        {marker.type === DESTINATION_TYPE && (
          <View style={styles.destinationIndicator}>
            <IconSymbol name="chevron.down" size={16} color={colors.notification || '#FF5252'} />
          </View>
        )}
      </Animated.View>
    );
  }, [colors, pulseAnim]);

  if (!permission) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background || '#000000' }]}>
        <View style={styles.centerContainer}>
          <Text style={StyleSheet.flatten([styles.loadingText, { color: colors.text || '#FFFFFF' }])}>Requesting permissions...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  if (!permission?.granted) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background || '#000000' }]}>
        <View style={styles.centerContainer}>
          <IconSymbol name="camera.fill" size={64} color={colors.icon || '#888888'} />
          <Text style={StyleSheet.flatten([styles.errorTitle, { color: colors.text || '#FFFFFF' }])}>Camera Access Required</Text>
          <Text style={StyleSheet.flatten([styles.errorSubtitle, { color: colors.icon || '#888888' }])}>NaviLynx needs camera access for AR navigation</Text>
          <TouchableOpacity
            style={[styles.permissionButton, { backgroundColor: colors.primary || '#6200EE' }]}
            onPress={requestPermissions}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <CameraView
          style={styles.camera}
          facing={cameraType}
        />
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          {/* AR Markers */}
          {arMarkers.map(renderARMarker)}

          {/* Top Navigation Bar */}
          <SafeAreaView style={styles.topContainer}>
            <ThemedView style={styles.topBar}>
              <View style={styles.topBarContent}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => {/* Navigate back */}}
                >
                  <IconSymbol name="chevron.left" size={20} color={colors.text || '#FFFFFF'} />
                </TouchableOpacity>

                <View style={styles.titleContainer}>
                  <ThemedText style={StyleSheet.flatten([styles.screenTitle, { color: colors.text || '#FFFFFF' }])}>{t('arNavigationTitle')}</ThemedText>
                  {arNavigation.isActive && (
                    <ThemedText style={StyleSheet.flatten([styles.confidenceText, { color: colors.primary || '#6200EE' }])}>{`${arNavigation.confidence}% confidence`}</ThemedText>
                  )}
                </View>

                <TouchableOpacity
                  style={styles.settingsButton}
                  onPress={() => {/* Open settings */}}
                >
                  <IconSymbol name="gear" size={20} color={colors.text || '#FFFFFF'} />
                </TouchableOpacity>
              </View>
            </ThemedView>
          </SafeAreaView>

          {/* Navigation Info */}
          {arNavigation.isActive && (
            <View style={styles.navigationContainer}>
              <ThemedView style={styles.navigationCard}>
                <View style={styles.navigationHeader}>
                  <View style={styles.destinationInfo}>
                    <ThemedText style={StyleSheet.flatten([styles.destinationLabel, { color: colors.icon || '#888888' }])}>{t('navigating')}</ThemedText>
                    <ThemedText style={StyleSheet.flatten([styles.destinationName, { color: colors.text || '#FFFFFF' }])}>{arNavigation.destination}</ThemedText>
                  </View>
                  <View style={styles.distanceInfo}>
                    <ThemedText style={StyleSheet.flatten([styles.distance, { color: colors.primary || '#6200EE' }])}>{arNavigation.distance}</ThemedText>
                    <ThemedText style={StyleSheet.flatten([styles.direction, { color: colors.icon || '#888888' }])}>{arNavigation.direction}</ThemedText>
                  </View>
                </View>

                <View style={styles.instructionContainer}>
                  <IconSymbol name="arrow.forward" size={16} color={colors.primary || '#6200EE'} />
                  <ThemedText style={StyleSheet.flatten([styles.instruction, { color: colors.text || '#FFFFFF' }])}>{arNavigation.instructions[0]}</ThemedText>
                </View>

                <View style={styles.floorInfo}>
                  <IconSymbol name="building.2" size={14} color={colors.icon || '#888888'} />
                  <ThemedText style={StyleSheet.flatten([styles.floorText, { color: colors.icon || '#888888' }])}>{`${t('currentFloor')}: ${arNavigation.currentFloor}`}</ThemedText>
                </View>
              </ThemedView>
            </View>
          )}

          {/* Bottom Controls */}
          <View style={styles.bottomContainer}>
            <ThemedView style={styles.controlsCard}>
              {!isNavigating ? (
                <View style={styles.startContainer}>
                  <Text style={StyleSheet.flatten([styles.startTitle, { color: colors.text || '#FFFFFF' }])}>{'Ready to navigate?'}</Text>
                  <Text style={StyleSheet.flatten([styles.startSubtitle, { color: colors.icon || '#888888' }])}>{'Point your camera around to see available destinations'}</Text>

                  <TouchableOpacity
                    style={[
                      styles.startButton,
                      { backgroundColor: colors.primary || '#6200EE' },
                      isLoading && { opacity: 0.6 }
                    ]}
                    onPress={startNavigation}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Text style={styles.startButtonText}>{'Initializing AR...'}</Text>
                    ) : (
                      <>
                        <IconSymbol name="camera.viewfinder" size={20} color="#FFFFFF" />
                        <Text style={styles.startButtonText}>{t('startNavigation')}</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.activeControls}>
                  <TouchableOpacity
                    style={[styles.controlButton, { backgroundColor: colors.notification || '#FF5252' }]}
                    onPress={stopNavigation}
                  >
                    <IconSymbol name="stop.fill" size={20} color="#FFFFFF" />
                    <ThemedText style={styles.controlButtonText}>{t('stopNavigation')}</ThemedText>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.controlButton, { backgroundColor: colors.secondary || '#03DAC6' }]}
                    onPress={() => {/* Recalculate route */}}
                  >
                    <IconSymbol name="arrow.clockwise" size={20} color="#FFFFFF" />
                    <Text style={styles.controlButtonText}>{'Recalculate'}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ThemedView>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <TouchableOpacity
                style={[styles.quickActionButton, { backgroundColor: colors.card || '#FFFFFF' }]}
                onPress={() => {/* Search venues */}}
              >
                <IconSymbol name="magnifyingglass" size={20} color={colors.primary || '#6200EE'} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.quickActionButton, { backgroundColor: colors.card || '#FFFFFF' }]}
                onPress={() => {/* Save location */}}
              >
                <IconSymbol name="bookmark.fill" size={20} color={colors.primary || '#6200EE'} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.quickActionButton, { backgroundColor: colors.card || '#FFFFFF' }]}
                onPress={() => {/* Emergency */}}
              >
                <IconSymbol name="exclamationmark.triangle.fill" size={20} color={colors.notification || '#FF5252'} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#FFFFFF',
  },
  errorSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    color: '#CCCCCC',
  },
  permissionButton: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#6200EE',
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Top Navigation
  topContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  topBar: {
    margin: 16,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
  },
  topBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  screenTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6200EE',
    marginTop: 2,
  },
  settingsButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
  },
  // AR Markers
  arMarker: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 50,
  },
  markerGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  markerLabel: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    maxWidth: 120,
  },
  markerText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  markerDistance: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },
  destinationIndicator: {
    marginTop: 4,
    alignItems: 'center',
  },
  // Navigation Info
  navigationContainer: {
    position: 'absolute',
    top: 100,
    left: 16,
    right: 16,
    zIndex: 90,
  },
  navigationCard: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 12,
    padding: 16,
  },
  navigationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  destinationInfo: {
    flex: 1,
  },
  destinationLabel: {
    fontSize: 12,
    color: '#CCCCCC',
    marginBottom: 4,
  },
  destinationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  distanceInfo: {
    alignItems: 'flex-end',
  },
  distance: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200EE',
  },
  direction: {
    fontSize: 12,
    color: '#CCCCCC',
    marginTop: 2,
  },
  instructionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(98,0,238,0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  instruction: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
    flex: 1,
  },
  floorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  floorText: {
    fontSize: 12,
    color: '#CCCCCC',
    marginLeft: 6,
  },
  // Bottom Controls
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  controlsCard: {
    margin: 16,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 16,
  },
  startContainer: {
    alignItems: 'center',
  },
  startTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  startSubtitle: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 20,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6200EE',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 200,
    justifyContent: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  activeControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  quickActionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
});

/* eslint-disable react-native-text-watcher */
// Prevent errors for raw strings and custom text components