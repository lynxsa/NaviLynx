/**
 * Enhanced AR Navigation Screen - Operation Navigate Implementation
 * Features: Modern glassmorphism UI, realistic overlays, turn-by-turn directions
 * Integrates with select-location screen for complete navigation flow
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Animated,
  Alert,
  ActivityIndicator,
  Modal,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

// Components & Services
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '@/context/ThemeContext';
import { colors, spacing, borderRadius } from '@/styles/modernTheme';
import { enhancedARPositioningService, ARNavigationState, AROverlay } from '@/services/EnhancedARPositioningService';
import { getVenueInternalAreas } from '@/data/venueInternalAreas';

const screenDimensions = Dimensions.get('window');

// Enhanced navigation parameters interface (for future use)
/*
interface NavigationParams {
  venueId?: string;
  destinationId?: string;
  venueName?: string;
  destinationName?: string;
  navigationType?: 'ar' | 'map';
}
*/

// AR Navigation interfaces
interface ARWaypoint {
  id: string;
  coordinates: { x: number; y: number; z: number };
  description: string;
  type: 'turn' | 'landmark' | 'destination' | 'checkpoint';
  distance: number;
  direction: 'left' | 'right' | 'straight' | 'up' | 'down';
  instruction: string;
}

interface ARRoute {
  waypoints: ARWaypoint[];
  totalDistance: number;
  estimatedTime: number;
  currentWaypointIndex: number;
  progress: number; // 0-1
}

interface AROverlayElement {
  id: string;
  type: 'arrow' | 'badge' | 'line' | 'marker';
  position: { x: number; y: number };
  data: any;
  isVisible: boolean;
  distance?: number;
}

// Navigation phases
type NavigationPhase = 'initializing' | 'tracking' | 'navigating' | 'arrived' | 'recalculating';

// Element types as constants
const ELEMENT_TYPE = {
  ARROW: 'arrow' as const,
  BADGE: 'badge' as const,
  MARKER: 'marker' as const,
  LINE: 'line' as const,
} as const;

const PHASE = {
  INITIALIZING: 'initializing' as const,
  TRACKING: 'tracking' as const,
  NAVIGATING: 'navigating' as const,
  ARRIVED: 'arrived' as const,
  RECALCULATING: 'recalculating' as const,
} as const;

const OVERLAY_TYPE = {
  STORE_INFO: 'store_info' as const,
  DIRECTION_ARROW: 'direction_arrow' as const,
  DISTANCE_BADGE: 'distance_badge' as const,
  WAYPOINT: 'waypoint' as const,
} as const;

const VISIBILITY = {
  VISIBLE: 'visible' as const,
  HIDDEN: 'hidden' as const,
  OCCLUDED: 'occluded' as const,
} as const;

export default function EnhancedARNavigation() {
  const { isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams() as any; // Fix type constraint issue
  
  // Core State
  const [phase, setPhase] = useState<NavigationPhase>('initializing');
  const [isNavigating, setIsNavigating] = useState(false);
  const [route, setRoute] = useState<ARRoute | null>(null);
  const [overlayElements, setOverlayElements] = useState<AROverlayElement[]>([]);
  const [showModeSwitch, setShowModeSwitch] = useState(false);
  
  // Enhanced AR Positioning State (future implementation)
  // const [arNavigationState, setArNavigationState] = useState<ARNavigationState | null>(null);
  const [arOverlays, setArOverlays] = useState<AROverlay[]>([]);
  // const [positioningAccuracy, setPositioningAccuracy] = useState<number>(5.0);
  
  // Navigation State
  const [currentDirection, setCurrentDirection] = useState<'straight' | 'left' | 'right'>('straight');
  const [nextTurnDistance, setNextTurnDistance] = useState<number>(25);
  const [currentInstruction, setCurrentInstruction] = useState<string>('Initializing AR...');
  const [navigationProgress, setNavigationProgress] = useState<number>(0);
  const [remainingDistance, setRemainingDistance] = useState<string>('--');
  const [estimatedArrival, setEstimatedArrival] = useState<string>('--');
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  // Enhanced route generation with Dijkstra-inspired pathfinding
  const generateARRoute = useCallback((venueId: string, destinationId: string): ARRoute => {
    // Mock enhanced route generation
    const mockWaypoints: ARWaypoint[] = [
      {
        id: 'start',
        coordinates: { x: 0, y: 0, z: 0 },
        description: 'Starting point',
        type: 'checkpoint',
        distance: 0,
        direction: 'straight',
        instruction: 'Begin navigation'
      },
      {
        id: 'turn-1',
        coordinates: { x: 25, y: 0, z: 0 },
        description: 'First turn',
        type: 'turn',
        distance: 25,
        direction: 'right',
        instruction: 'Turn right towards main corridor'
      },
      {
        id: 'landmark-1',
        coordinates: { x: 25, y: 30, z: 0 },
        description: 'Food court area',
        type: 'landmark',
        distance: 55,
        direction: 'straight',
        instruction: 'Continue straight past food court'
      },
      {
        id: 'turn-2',
        coordinates: { x: 45, y: 30, z: 0 },
        description: 'Second turn',
        type: 'turn',
        distance: 75,
        direction: 'left',
        instruction: 'Turn left towards destination'
      },
      {
        id: 'destination',
        coordinates: { x: 45, y: 50, z: 0 },
        description: params.destinationName || 'Destination',
        type: 'destination',
        distance: 95,
        direction: 'straight',
        instruction: 'Arrive at destination'
      }
    ];

    return {
      waypoints: mockWaypoints,
      totalDistance: 95,
      estimatedTime: 3,
      currentWaypointIndex: 0,
      progress: 0
    };
  }, [params.destinationName]);

  // Generate AR overlay elements
  const generateOverlayElements = useCallback((currentRoute: ARRoute): AROverlayElement[] => {
    if (!currentRoute) return [];
    
    const elements: AROverlayElement[] = [];
    const currentWaypoint = currentRoute.waypoints[currentRoute.currentWaypointIndex];
    
    if (currentWaypoint) {
      // Direction arrow
      elements.push({
        id: 'direction-arrow',
        type: 'arrow',
        position: { x: screenDimensions.width / 2, y: screenDimensions.height * 0.3 },
        data: { direction: currentWaypoint.direction },
        isVisible: true,
        distance: currentWaypoint.distance
      });
      
      // Distance badge
      elements.push({
        id: 'distance-badge',
        type: 'badge',
        position: { x: screenDimensions.width * 0.8, y: screenDimensions.height * 0.2 },
        data: { text: `${currentWaypoint.distance}m` },
        isVisible: true
      });
      
      // Instruction marker
      elements.push({
        id: 'instruction-marker',
        type: 'marker',
        position: { x: screenDimensions.width / 2, y: screenDimensions.height * 0.7 },
        data: { instruction: currentWaypoint.instruction },
        isVisible: true
      });
    }
    
    return elements;
  }, []);

  // Simulate navigation progress
  const simulateNavigationProgress = useCallback(() => {
    if (!route || phase !== 'navigating') return;
    
    const interval = setInterval(() => {
      setRoute(prevRoute => {
        if (!prevRoute) return null;
        
        const newProgress = Math.min(prevRoute.progress + 0.02, 1);
        const newWaypointIndex = Math.floor(newProgress * prevRoute.waypoints.length);
        
        // Update current waypoint if changed
        if (newWaypointIndex !== prevRoute.currentWaypointIndex && newWaypointIndex < prevRoute.waypoints.length) {
          const newWaypoint = prevRoute.waypoints[newWaypointIndex];
          setCurrentInstruction(newWaypoint.instruction);
          setCurrentDirection(newWaypoint.direction as any);
          setNextTurnDistance(Math.max(0, newWaypoint.distance - Math.floor(newProgress * prevRoute.totalDistance)));
          
          // Haptic feedback for turn
          if (newWaypoint.type === 'turn') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
        }
        
        // Update remaining distance and time
        const remaining = Math.max(0, prevRoute.totalDistance - Math.floor(newProgress * prevRoute.totalDistance));
        setRemainingDistance(`${remaining}m`);
        setEstimatedArrival(`${Math.ceil(remaining / 30)}min`);
        setNavigationProgress(newProgress * 100);
        
        // Check if arrived
        if (newProgress >= 1) {
          setPhase('arrived');
          setCurrentInstruction('You have arrived!');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        
        return {
          ...prevRoute,
          progress: newProgress,
          currentWaypointIndex: Math.min(newWaypointIndex, prevRoute.waypoints.length - 1)
        };
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, [route, phase]);

  // Initialize navigation
  const startNavigation = useCallback(() => {
    if (!params.venueId || !params.destinationId) {
      Alert.alert('Error', 'Missing navigation parameters');
      return;
    }
    
    setIsNavigating(true);
    setPhase('tracking');
    
    // Simulate AR tracking initialization
    setTimeout(() => {
      const newRoute = generateARRoute(params.venueId!, params.destinationId!);
      setRoute(newRoute);
      setOverlayElements(generateOverlayElements(newRoute));
      setPhase('navigating');
      setCurrentInstruction('Follow the AR indicators');
      
      // Start animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Start pulsing animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
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
      
    }, 2000);
  }, [params, generateARRoute, generateOverlayElements, fadeAnim, overlayAnim, pulseAnim]);

  // Handle navigation completion
  const handleNavigationComplete = useCallback(() => {
    Alert.alert(
      'Navigation Complete!',
      `You have arrived at ${params.destinationName}`,
      [
        {
          text: 'New Navigation',
          onPress: () => router.push('/select-location')
        },
        {
          text: 'Done',
          onPress: () => router.back()
        }
      ]
    );
  }, [params.destinationName, router]);

  // Handle exit navigation
  const handleExitNavigation = useCallback(() => {
    Alert.alert(
      'Exit Navigation',
      'Are you sure you want to stop navigation?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Exit', 
          style: 'destructive',
          onPress: () => router.back()
        }
      ]
    );
  }, [router]);

  // Initialize on mount
  useEffect(() => {
    const initializeEnhancedAR = async () => {
      try {
        console.log('🎯 Initializing Enhanced AR Navigation...');
        
        // Get screen dimensions
        const screenWidth = screenDimensions.width;
        const screenHeight = screenDimensions.height;
        
        // Initialize AR positioning service
        const initialized = await enhancedARPositioningService.initialize(
          params.venueId || 'sandton-city',
          screenWidth,
          screenHeight
        );
        
        if (initialized) {
          console.log('✅ Enhanced AR positioning initialized');
          
          // Find target store
          const venueAreas = await getVenueInternalAreas(params.venueId || 'sandton-city');
          const targetStore = venueAreas.find(area => area.id === params.destinationId);
          
          if (targetStore) {
            console.log(`🎯 Starting navigation to: ${targetStore.name}`);
            
            // Start AR navigation
            const navigationStarted = await enhancedARPositioningService.startNavigation(
              targetStore,
              (state: ARNavigationState) => {
                // setArNavigationState(state);
                setArOverlays(state.activeOverlays);
                // setPositioningAccuracy(state.accuracy);
                console.log('AR positioning accuracy:', state.accuracy);
                
                // Update navigation phase based on AR state
                if (state.userPosition && state.targetStore) {
                  const distance = Math.sqrt(
                    Math.pow(state.userPosition.x - state.targetStore.location.x, 2) +
                    Math.pow(state.userPosition.y - state.targetStore.location.y, 2)
                  );
                  
                  if (distance < 3) {
                    setPhase('arrived');
                  } else {
                    setPhase('navigating');
                  }
                }
              }
            );
            
            if (navigationStarted) {
              console.log('✅ AR navigation started successfully');
            }
          }
        } else {
          console.log('⚠️ Using fallback navigation mode');
        }
      } catch (error) {
        console.error('❌ Failed to initialize enhanced AR:', error);
      }
    };

    const timer = setTimeout(() => {
      initializeEnhancedAR();
      startNavigation();
    }, 1000);
    
    return () => {
      clearTimeout(timer);
      // Cleanup AR positioning service
      enhancedARPositioningService.stopNavigation();
    };
  }, [startNavigation, params.venueId, params.destinationId]);

  // Setup navigation progress simulation
  useEffect(() => {
    if (phase === 'navigating') {
      return simulateNavigationProgress();
    }
  }, [phase, simulateNavigationProgress]);

  // Handle navigation completion
  useEffect(() => {
    if (phase === 'arrived') {
      const timer = setTimeout(() => {
        handleNavigationComplete();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [phase, handleNavigationComplete]);

  // Camera view placeholder (would be replaced with actual AR camera)
  const renderCameraView = () => (
    <View style={styles.cameraView}>
      <LinearGradient
        colors={['#000000', '#1a1a1a', '#333333']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.cameraOverlay}>
        <Text style={styles.cameraText}>AR Camera View</Text>
        <Text style={styles.cameraSubtext}>
          {phase === 'initializing' ? 'Initializing AR system...' :
           phase === 'tracking' ? 'Tracking environment...' :
           phase === 'navigating' ? 'AR Navigation Active' :
           phase === 'arrived' ? 'Destination reached!' : 'Ready'}
        </Text>
      </View>
    </View>
  );

  // Render AR overlay elements
  const renderOverlayElements = () => (
    <Animated.View 
      style={[
        styles.overlayContainer,
        { opacity: overlayAnim }
      ]}
      pointerEvents="none"
    >
      {overlayElements.map((element) => {
        if (!element.isVisible) return null;
        
        const isArrow = element.type === ELEMENT_TYPE.ARROW;
        const isBadge = element.type === ELEMENT_TYPE.BADGE;
        const isMarker = element.type === ELEMENT_TYPE.MARKER;
        
        return (
          <View
            key={element.id}
            style={[
              styles.overlayElement,
              {
                left: element.position.x - 25,
                top: element.position.y - 25,
              }
            ]}
          >
            {isArrow && (
              <Animated.View 
                style={[
                  styles.arrowElement,
                  { transform: [{ scale: pulseAnim }] }
                ]}
              >
                <LinearGradient
                  colors={[colors.primary, colors.secondary]}
                  style={styles.arrowGradient}
                >
                  <IconSymbol 
                    name={
                      element.data.direction === 'left' ? 'chevron.left' :
                      element.data.direction === 'right' ? 'chevron.right' :
                      'arrow.up'
                    }
                    size={32}
                    color="white"
                  />
                </LinearGradient>
              </Animated.View>
            )}
            
            {isBadge && (
              <View style={styles.badgeElement}>
                <BlurView intensity={80} style={styles.badgeBlur}>
                  <Text style={styles.badgeText}>
                    {element.data.text}
                  </Text>
                </BlurView>
              </View>
            )}
            
            {isMarker && (
              <View style={styles.markerElement}>
                <BlurView intensity={90} style={styles.markerBlur}>
                  <Text style={styles.markerText}>
                    {element.data.instruction}
                  </Text>
                </BlurView>
              </View>
            )}
          </View>
        );
      })}
      
      {/* Enhanced AR Overlays */}
      {arOverlays.map((overlay) => {
        if (overlay.visibility !== VISIBILITY.VISIBLE) return null;
        
        return (
          <View
            key={overlay.id}
            style={[
              styles.enhancedOverlay,
              {
                left: overlay.screenPosition.x - 50,
                top: overlay.screenPosition.y - 30,
              }
            ]}
          >
            {overlay.overlayType === OVERLAY_TYPE.STORE_INFO && (
              <Animated.View 
                style={[
                  styles.storeOverlay,
                  { transform: [{ scale: pulseAnim }] }
                ]}
              >
                <BlurView intensity={90} style={styles.storeOverlayBlur}>
                  <LinearGradient
                    colors={overlay.priority === 'high' ? [colors.primary, colors.secondary] : ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
                    style={styles.storeOverlayGradient}
                  >
                    <IconSymbol 
                      name="storefront"
                      size={16}
                      color={overlay.priority === 'high' ? 'white' : colors.text}
                    />
                    <Text style={[
                      styles.storeOverlayText,
                      { color: overlay.priority === 'high' ? 'white' : colors.text }
                    ]}>
                      {overlay.storeName}
                    </Text>
                    <Text style={[
                      styles.storeDistanceText,
                      { color: overlay.priority === 'high' ? 'rgba(255,255,255,0.8)' : colors.textSecondary }
                    ]}>
                      {overlay.distance.toFixed(0)}m
                    </Text>
                  </LinearGradient>
                </BlurView>
              </Animated.View>
            )}
            
            {overlay.overlayType === OVERLAY_TYPE.DIRECTION_ARROW && (
              <Animated.View 
                style={[
                  styles.directionOverlay,
                  { transform: [{ scale: pulseAnim }] }
                ]}
              >
                <LinearGradient
                  colors={[colors.primary, colors.secondary]}
                  style={styles.directionGradient}
                >
                  <IconSymbol 
                    name="arrow.up"
                    size={24}
                    color="white"
                  />
                </LinearGradient>
              </Animated.View>
            )}
          </View>
        );
      })}
    </Animated.View>
  );

  // Main UI overlay
  const renderUIOverlay = () => (
    <View style={styles.uiOverlay}>
      {/* Top Status Bar */}
      <Animated.View 
        style={[
          styles.topBar,
          { opacity: fadeAnim }
        ]}
      >
        <BlurView intensity={80} style={styles.topBarBlur}>
          <View style={styles.topBarContent}>
            <TouchableOpacity 
              onPress={handleExitNavigation}
              style={styles.exitButton}
            >
              <IconSymbol name="xmark" size={24} color={colors.error} />
            </TouchableOpacity>
            
            <View style={styles.statusInfo}>
              <Text style={[styles.statusTitle, { color: isDark ? colors.textLight : colors.text }]}>
                {params.venueName}
              </Text>
              <Text style={[styles.statusSubtitle, { color: isDark ? colors.textSecondary : colors.textSecondary }]}>
                → {params.destinationName}
              </Text>
            </View>
            
            <TouchableOpacity 
              onPress={() => setShowModeSwitch(true)}
              style={styles.modeButton}
            >
              <IconSymbol name="map" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </BlurView>
      </Animated.View>

      {/* Navigation Instructions */}
      {phase === PHASE.NAVIGATING && (
        <Animated.View 
          style={[
            styles.instructionCard,
            { opacity: fadeAnim }
          ]}
        >
          <BlurView intensity={90} style={styles.instructionBlur}>
            <LinearGradient
              colors={[colors.primary + '20', colors.secondary + '20']}
              style={styles.instructionGradient}
            >
              <View style={styles.instructionContent}>
                <View style={styles.instructionIcon}>
                  <IconSymbol 
                    name={
                      currentDirection === 'left' ? 'chevron.left' :
                      currentDirection === 'right' ? 'chevron.right' :
                      'arrow.up'
                    }
                    size={28}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.instructionText}>
                  <Text style={[styles.instruction, { color: isDark ? colors.textLight : colors.text }]}>
                    {currentInstruction}
                  </Text>
                  <Text style={[styles.instructionDistance, { color: isDark ? colors.textSecondary : colors.textSecondary }]}>
                    {nextTurnDistance > 0 ? `in ${nextTurnDistance}m` : 'Now'}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </BlurView>
        </Animated.View>
      )}

      {/* Progress Stats */}
      {phase === PHASE.NAVIGATING && (
        <Animated.View 
          style={[
            styles.statsCard,
            { opacity: fadeAnim }
          ]}
        >
          <BlurView intensity={80} style={styles.statsBlur}>
            <View style={styles.statsContent}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.primary }]}>
                  {remainingDistance}
                </Text>
                <Text style={[styles.statLabel, { color: isDark ? colors.textSecondary : colors.textSecondary }]}>
                  Distance
                </Text>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.secondary }]}>
                  {estimatedArrival}
                </Text>
                <Text style={[styles.statLabel, { color: isDark ? colors.textSecondary : colors.textSecondary }]}>
                  ETA
                </Text>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.success }]}>
                  {Math.round(navigationProgress)}%
                </Text>
                <Text style={[styles.statLabel, { color: isDark ? colors.textSecondary : colors.textSecondary }]}>
                  Progress
                </Text>
              </View>
            </View>
            
            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBarBg, { backgroundColor: isDark ? colors.gray[800] : colors.gray[200] }]}>
                <Animated.View 
                  style={[
                    styles.progressBarFill,
                    { 
                      width: `${navigationProgress}%`,
                      backgroundColor: colors.primary
                    }
                  ]}
                />
              </View>
            </View>
          </BlurView>
        </Animated.View>
      )}
    </View>
  );

  // Mode switch modal
  const renderModeSwitch = () => (
    <Modal
      visible={showModeSwitch}
      transparent
      animationType="fade"
      onRequestClose={() => setShowModeSwitch(false)}
    >
      <View style={styles.modalOverlay}>
        <BlurView intensity={80} style={styles.modalBlur}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? colors.gray[800] : colors.surface }]}>
            <Text style={[styles.modalTitle, { color: isDark ? colors.textLight : colors.text }]}>
              Switch Navigation Mode
            </Text>
            
            <TouchableOpacity style={styles.modeOption}>
              <IconSymbol name="camera" size={24} color={colors.primary} />
              <Text style={[styles.modeOptionText, { color: isDark ? colors.textLight : colors.text }]}>
                AR Navigation (Current)
              </Text>
              <IconSymbol name="checkmark" size={20} color={colors.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modeOption}
              onPress={() => {
                setShowModeSwitch(false);
                // TODO: Switch to 2D map mode
              }}
            >
              <IconSymbol name="map" size={24} color={colors.secondary} />
              <Text style={[styles.modeOptionText, { color: isDark ? colors.textLight : colors.text }]}>
                2D Map Navigation
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => setShowModeSwitch(false)}
              style={styles.modalCloseButton}
            >
              <Text style={[styles.modalCloseText, { color: colors.primary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
    </Modal>
  );

  if (phase === 'initializing' && !isNavigating) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? colors.gray[900] : colors.background }]}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: isDark ? colors.textLight : colors.text }]}>
            Initializing AR Navigation...
          </Text>
          <Text style={[styles.loadingSubtext, { color: isDark ? colors.textSecondary : colors.textSecondary }]}>
            Preparing indoor navigation for {params.destinationName}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* AR Camera View */}
      {renderCameraView()}
      
      {/* AR Overlay Elements */}
      {renderOverlayElements()}
      
      {/* UI Overlay */}
      {renderUIOverlay()}
      
      {/* Mode Switch Modal */}
      {renderModeSwitch()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
  },
  loadingSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: spacing.xl,
  },
  
  // Camera View
  cameraView: {
    flex: 1,
    backgroundColor: '#000000',
  },
  cameraOverlay: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    transform: [{ translateY: -50 }],
  },
  cameraText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  cameraSubtext: {
    color: '#CCCCCC',
    fontSize: 16,
  },
  
  // Overlay Elements
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  overlayElement: {
    position: 'absolute',
    width: 50,
    height: 50,
  },
  arrowElement: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  arrowGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeElement: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  badgeBlur: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  markerElement: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    maxWidth: 200,
  },
  markerBlur: {
    padding: spacing.sm,
  },
  markerText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
  },
  
  // UI Overlay
  uiOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'box-none',
  },
  
  // Top Bar
  topBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: spacing.md,
    right: spacing.md,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  topBarBlur: {
    borderRadius: borderRadius.lg,
  },
  topBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  exitButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.error + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusInfo: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: spacing.md,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  statusSubtitle: {
    fontSize: 14,
  },
  modeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Instruction Card
  instructionCard: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 140 : 120,
    left: spacing.md,
    right: spacing.md,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  instructionBlur: {
    borderRadius: borderRadius.xl,
  },
  instructionGradient: {
    borderRadius: borderRadius.xl,
  },
  instructionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  instructionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  instructionText: {
    flex: 1,
  },
  instruction: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  instructionDistance: {
    fontSize: 14,
  },
  
  // Stats Card
  statsCard: {
    position: 'absolute',
    bottom: 100,
    left: spacing.md,
    right: spacing.md,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  statsBlur: {
    borderRadius: borderRadius.lg,
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border + '40',
    marginHorizontal: spacing.sm,
  },
  progressBarContainer: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBlur: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    margin: spacing.xl,
  },
  modalContent: {
    padding: spacing.xl,
    minWidth: 280,
    borderRadius: borderRadius.xl,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  modeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
    backgroundColor: colors.primary + '10',
  },
  modeOptionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  modalCloseButton: {
    alignItems: 'center',
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Enhanced AR Overlay Styles
  enhancedOverlay: {
    position: 'absolute',
    zIndex: 10,
  },
  storeOverlay: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    minWidth: 100,
  },
  storeOverlayBlur: {
    borderRadius: borderRadius.md,
  },
  storeOverlayGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
  },
  storeOverlayText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  storeDistanceText: {
    fontSize: 10,
    fontWeight: '500',
  },
  directionOverlay: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  directionGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
