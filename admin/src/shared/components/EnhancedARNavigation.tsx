/**
 * 🔮 OPERATION LIONMOUNTAIN - Enhanced AR Navigation
 * 
 * Complete AR navigation system with purple theme
 * Features: Live camera feed, 3D overlays, turn-by-turn directions
 * World-class indoor navigation experience
 * 
 * @version 1.0.0 - LIONMOUNTAIN Edition
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
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  FadeIn,
  SlideInUp,
} from 'react-native-reanimated';

import { purpleTheme, spacing, borderRadius, shadows, typography } from '../theme/globalTheme';
import { AppHeader } from './AppHeader';

const { width, height } = Dimensions.get('window');

// AR Navigation Interfaces
interface ARWaypoint {
  id: string;
  x: number;
  y: number;
  z: number;
  instruction: string;
  type: 'turn_left' | 'turn_right' | 'straight' | 'destination';
}

interface ARRoute {
  waypoints: ARWaypoint[];
  totalDistance: number;
  estimatedTime: number;
  currentSegment: number;
}

interface NavigationState {
  isNavigating: boolean;
  currentInstruction: string;
  nextInstruction?: string;
  distanceToNext: number;
  progress: number;
}

// Mock AR Route Data
const mockRoute: ARRoute = {
  waypoints: [
    {
      id: '1',
      x: 0,
      y: 0,
      z: 0,
      instruction: 'Head straight towards the main entrance',
      type: 'straight',
    },
    {
      id: '2',
      x: 50,
      y: 0,
      z: 0,
      instruction: 'Turn left at the information desk',
      type: 'turn_left',
    },
    {
      id: '3',
      x: 50,
      y: 30,
      z: 0,
      instruction: 'Continue straight past the escalators',
      type: 'straight',
    },
    {
      id: '4',
      x: 80,
      y: 30,
      z: 0,
      instruction: 'Turn right towards your destination',
      type: 'turn_right',
    },
    {
      id: '5',
      x: 80,
      y: 50,
      z: 0,
      instruction: 'You have arrived at your destination',
      type: 'destination',
    },
  ],
  totalDistance: 120,
  estimatedTime: 5,
  currentSegment: 0,
};

interface EnhancedARNavigationProps {
  destination?: string;
  venue?: string;
  onNavigationComplete?: () => void;
  onToggleMapMode?: () => void;
  onExit?: () => void;
}

export const EnhancedARNavigation: React.FC<EnhancedARNavigationProps> = ({
  destination = 'Checkers',
  venue = 'Sandton City Mall',
  onNavigationComplete,
  onToggleMapMode,
  onExit,
}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [route] = useState<ARRoute>(mockRoute);
  const [navigationState, setNavigationState] = useState<NavigationState>({
    isNavigating: true,
    currentInstruction: mockRoute.waypoints[0].instruction,
    distanceToNext: 25,
    progress: 0,
  });
  const [showInstructions, setShowInstructions] = useState(true);

  // Animations
  const pulseAnim = useSharedValue(1);
  const fadeAnim = useSharedValue(1);
  const arrowRotation = useSharedValue(0);

  useEffect(() => {
    // Start pulsing animation for navigation elements
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );

    // Simulate navigation progress
    const progressInterval = setInterval(() => {
      setNavigationState(prev => {
        const newProgress = Math.min(prev.progress + 0.02, 1);
        const currentSegment = Math.floor(newProgress * (route.waypoints.length - 1));
        const nextSegment = Math.min(currentSegment + 1, route.waypoints.length - 1);
        
        const currentWaypoint = route.waypoints[currentSegment];
        const nextWaypoint = route.waypoints[nextSegment];
        
        // Update arrow rotation based on direction
        if (currentWaypoint.type === 'turn_left') {
          arrowRotation.value = withTiming(-45, { duration: 500 });
        } else if (currentWaypoint.type === 'turn_right') {
          arrowRotation.value = withTiming(45, { duration: 500 });
        } else {
          arrowRotation.value = withTiming(0, { duration: 500 });
        }
        
        return {
          ...prev,
          progress: newProgress,
          currentInstruction: currentWaypoint.instruction,
          nextInstruction: nextWaypoint ? nextWaypoint.instruction : undefined,
          distanceToNext: Math.max(1, 25 - (newProgress * 25)),
        };
      });
    }, 200);

    return () => clearInterval(progressInterval);
  }, [route, pulseAnim, arrowRotation]);

  const handleToggleMapMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (onToggleMapMode) {
      onToggleMapMode();
    }
  };

  const handleExit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      'Exit Navigation',
      'Are you sure you want to exit navigation?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Exit', 
          style: 'destructive',
          onPress: () => {
            if (onExit) {
              onExit();
            }
          }
        },
      ]
    );
  };

  const animatedPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  const animatedArrowStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${arrowRotation.value}deg` }],
  }));

  const animatedHudStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
  }));

  if (!permission) {
    return (
      <View style={styles.permissionContainer}>
        <ActivityIndicator size="large" color={purpleTheme.primary} />
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera" size={64} color={purpleTheme.primary} />
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionText}>
          AR Navigation needs camera access to overlay directions on your view
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <LinearGradient
            colors={purpleTheme.gradients.primary}
            style={styles.permissionGradient}
          >
            <Text style={styles.permissionButtonText}>Grant Camera Access</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Camera Feed */}
      <CameraView style={StyleSheet.absoluteFill} facing="back" />
      
      {/* AR Overlays */}
      <View style={styles.arOverlayContainer}>
        {/* Navigation Arrow */}
        <Animated.View style={[styles.navigationArrow, animatedPulseStyle]}>
          <Animated.View style={animatedArrowStyle}>
            <LinearGradient
              colors={purpleTheme.gradients.primary}
              style={styles.arrowGradient}
            >
              <Ionicons name="arrow-up" size={48} color="white" />
            </LinearGradient>
          </Animated.View>
        </Animated.View>
        
        {/* Distance Markers */}
        <View style={styles.distanceMarker}>
          <Text style={styles.distanceText}>
            {navigationState.distanceToNext.toFixed(0)}m
          </Text>
        </View>
      </View>
      
      {/* HUD Overlay */}
      <Animated.View style={[styles.hudContainer, animatedHudStyle]}>
        {/* Top HUD */}
        <BlurView intensity={80} style={styles.topHud}>
          <SafeAreaView edges={['top']}>
            <View style={styles.hudHeader}>
              <TouchableOpacity onPress={handleExit} style={styles.hudButton}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
              
              <View style={styles.destinationInfo}>
                <Text style={styles.destinationText}>{destination}</Text>
                <Text style={styles.venueText}>{venue}</Text>
              </View>
              
              <TouchableOpacity onPress={handleToggleMapMode} style={styles.hudButton}>
                <Ionicons name="map" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </BlurView>
        
        {/* Instruction Card */}
        <Animated.View 
          style={styles.instructionCard} 
          entering={SlideInUp.duration(400)}
        >
          <BlurView intensity={90} style={styles.instructionBlur}>
            <LinearGradient
              colors={[`${purpleTheme.primary}E6`, `${purpleTheme.primaryDark}E6`]}
              style={styles.instructionGradient}
            >
              <View style={styles.instructionIcon}>
                <Ionicons 
                  name={getInstructionIcon(route.waypoints[Math.floor(navigationState.progress * (route.waypoints.length - 1))]?.type)} 
                  size={32} 
                  color="white" 
                />
              </View>
              
              <View style={styles.instructionContent}>
                <Text style={styles.instructionText}>
                  {navigationState.currentInstruction}
                </Text>
                {navigationState.nextInstruction && (
                  <Text style={styles.nextInstructionText}>
                    Then: {navigationState.nextInstruction}
                  </Text>
                )}
              </View>
              
              <TouchableOpacity 
                onPress={() => setShowInstructions(!showInstructions)}
                style={styles.instructionToggle}
              >
                <Ionicons 
                  name={showInstructions ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color="white" 
                />
              </TouchableOpacity>
            </LinearGradient>
          </BlurView>
        </Animated.View>
        
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View 
              style={[
                styles.progressFill, 
                { width: `${navigationState.progress * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {Math.round(navigationState.progress * 100)}% Complete
          </Text>
        </View>
        
        {/* Navigation Stats */}
        <View style={styles.statsContainer}>
          <BlurView intensity={60} style={styles.statsBlur}>
            <View style={styles.statItem}>
              <Ionicons name="time" size={16} color="white" />
              <Text style={styles.statText}>
                {Math.ceil((1 - navigationState.progress) * route.estimatedTime)} min
              </Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Ionicons name="walk" size={16} color="white" />
              <Text style={styles.statText}>
                {Math.ceil((1 - navigationState.progress) * route.totalDistance)}m
              </Text>
            </View>
          </BlurView>
        </View>
      </Animated.View>
      
      {/* Success Modal */}
      <Modal
        visible={navigationState.progress >= 1}
        animationType="fade"
        transparent
      >
        <BlurView intensity={80} style={styles.successOverlay}>
          <Animated.View 
            style={styles.successCard}
            entering={FadeIn.duration(600)}
          >
            <LinearGradient
              colors={purpleTheme.gradients.primary}
              style={styles.successGradient}
            >
              <Ionicons name="checkmark-circle" size={64} color="white" />
              <Text style={styles.successTitle}>Destination Reached!</Text>
              <Text style={styles.successText}>
                You have successfully arrived at {destination}
              </Text>
              
              <TouchableOpacity 
                onPress={onNavigationComplete}
                style={styles.successButton}
              >
                <Text style={styles.successButtonText}>Done</Text>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        </BlurView>
      </Modal>
    </View>
  );
};

const getInstructionIcon = (type: ARWaypoint['type']) => {
  switch (type) {
    case 'turn_left': return 'arrow-back';
    case 'turn_right': return 'arrow-forward';
    case 'destination': return 'flag';
    default: return 'arrow-up';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  
  // Permission Screen
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: purpleTheme.background,
    padding: spacing.xl,
  },
  permissionTitle: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.bold,
    color: purpleTheme.text,
    textAlign: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  permissionText: {
    fontSize: typography.fontSizes.md,
    color: purpleTheme.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeights.normal * typography.fontSizes.md,
    marginBottom: spacing.xl,
  },
  permissionButton: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.lg,
  },
  permissionGradient: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  permissionButtonText: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: 'white',
    textAlign: 'center',
  },
  
  // AR Overlays
  arOverlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigationArrow: {
    position: 'absolute',
    top: height * 0.4,
  },
  arrowGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.lg,
  },
  distanceMarker: {
    position: 'absolute',
    top: height * 0.55,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  distanceText: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: 'white',
  },
  
  // HUD
  hudContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'box-none',
  },
  topHud: {
    paddingBottom: spacing.md,
  },
  hudHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  hudButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  destinationInfo: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  destinationText: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: 'white',
    textAlign: 'center',
  },
  venueText: {
    fontSize: typography.fontSizes.sm,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  
  // Instruction Card
  instructionCard: {
    position: 'absolute',
    top: 120,
    left: spacing.md,
    right: spacing.md,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  instructionBlur: {
    borderRadius: borderRadius.lg,
  },
  instructionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  instructionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionContent: {
    flex: 1,
  },
  instructionText: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.bold,
    color: 'white',
    marginBottom: spacing.xs,
  },
  nextInstructionText: {
    fontSize: typography.fontSizes.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  instructionToggle: {
    padding: spacing.xs,
  },
  
  // Progress
  progressContainer: {
    position: 'absolute',
    bottom: 120,
    left: spacing.md,
    right: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    width: '100%',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: purpleTheme.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: typography.fontSizes.sm,
    color: 'white',
    fontWeight: typography.fontWeights.medium,
  },
  
  // Stats
  statsContainer: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.md,
    right: spacing.md,
  },
  statsBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: spacing.lg,
  },
  statText: {
    fontSize: typography.fontSizes.sm,
    color: 'white',
    fontWeight: typography.fontWeights.medium,
  },
  
  // Success Modal
  successOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  successCard: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.lg,
  },
  successGradient: {
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.lg,
  },
  successTitle: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.bold,
    color: 'white',
    textAlign: 'center',
  },
  successText: {
    fontSize: typography.fontSizes.md,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: typography.lineHeights.normal * typography.fontSizes.md,
  },
  successButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
    marginTop: spacing.md,
  },
  successButtonText: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: 'white',
  },
});

export default EnhancedARNavigation;
