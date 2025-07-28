/**
 * Enhanced AR Navigation Screen
 * Inspired by Google Maps Live View, ViroReact patterns, and 0xknon AR navigation
 * Combines real camera feed with 3D AR navigation elements and BLE trilateration
 * Enhanced with modern UI, realistic navigation flow, and immersive features
 */

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
  SafeAreaView,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { DeviceMotion, DeviceMotionMeasurement } from 'expo-sensors';

// Internal imports
import { useTheme } from '@/context/ThemeContext';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { MockIndoorNavigationService, ARWaypoint } from '../../services/MockIndoorNavigationService';
import { InternalArea } from '@/data/venueInternalAreas';

interface ARNavigationScreenProps {
  isVisible: boolean;
  destination: string;
  venueId?: string;
  onClose: () => void;
  onNavigationComplete: () => void;
  userLocation?: {
    latitude: number;
    longitude: number;
  };
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ARNavigationScreen({
  isVisible,
  destination,
  venueId,
  onClose,
  onNavigationComplete,
  userLocation
}: ARNavigationScreenProps) {
  const { colors } = useTheme();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [arWaypoints, setArWaypoints] = useState<ARWaypoint[]>([]);
  const [compassHeading, setCompassHeading] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [currentInstruction, setCurrentInstruction] = useState('');
  const [remainingDistance, setRemainingDistance] = useState(0);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const arrowRotation = useRef(new Animated.Value(0)).current;
  
  // Three.js refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const arrowMeshRef = useRef<THREE.Mesh | null>(null);
  const waypointMeshes = useRef<THREE.Mesh[]>([]);
  
  // Services
  const navigationService = useMemo(() => new MockIndoorNavigationService(), []);

  /**
   * Initialize AR tracking and animations when component becomes visible
   */
  useEffect(() => {
    if (isVisible) {
      initializeNavigation();
      startARTracking();
      startAnimations();
    } else {
      stopARTracking();
    }

    return () => {
      stopARTracking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  /**
   * Initialize navigation service for the venue
   */
  const initializeNavigation = useCallback(async () => {
    try {
      // Create a mock destination based on the destination string
      const mockDestination: InternalArea = {
        id: 'dest-1',
        name: destination,
        type: 'Retail',
        icon: 'storefront',
        location: { 
          floor: 1, 
          x: 50, 
          y: 30 
        },
        description: `Navigate to ${destination}`,
        tags: ['store', 'shopping', destination.toLowerCase()],
        estimatedWalkTime: 300, // 5 minutes
      };
      
      // Start indoor navigation
      const result = await navigationService.startIndoorNavigation(
        mockDestination,
        venueId || 'default-venue'
      );
      
      if (result.success) {
        const instruction = navigationService.getCurrentInstruction();
        const state = navigationService.getNavigationState();
        
        setCurrentInstruction(instruction);
        setRemainingDistance(state.progress.remainingDistance);
        
        console.log('🧭 AR Navigation initialized:', { destination, routeLength: state.navigationPoints.length });
      } else {
        throw new Error(result.error || 'Failed to start navigation');
      }
    } catch (error) {
      console.error('Failed to initialize navigation:', error);
      Alert.alert('Navigation Error', 'Could not initialize AR navigation for this venue.');
    }
  }, [venueId, destination, navigationService]);

  /**
   * Start AR tracking with device motion sensors
   */
  const startARTracking = useCallback(async () => {
    try {
      // Request device motion permission
      const { status } = await DeviceMotion.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Device motion access is needed for AR navigation.');
        return;
      }

      // Start motion tracking
      DeviceMotion.setUpdateInterval(50); // 20 FPS
      const subscription = DeviceMotion.addListener((motionData) => {
        updateCompassHeading(motionData);
        updateNavigationState();
      });

      setIsTracking(true);
      console.log('📱 AR tracking started');

      return () => {
        subscription?.remove();
      };
    } catch (error) {
      console.error('Failed to start AR tracking:', error);
      Alert.alert('AR Error', 'Could not start AR tracking. Please try again.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Stop AR tracking
   */
  const stopARTracking = useCallback(() => {
    setIsTracking(false);
    DeviceMotion.removeAllListeners();
    console.log('📱 AR tracking stopped');
  }, []);

  /**
   * Update compass heading from device motion (inspired by ARExplorer)
   */
  const updateCompassHeading = useCallback((motion: DeviceMotionMeasurement) => {
    if (motion.rotation) {
      // Convert rotation to compass heading
      const heading = motion.rotation.gamma || 0;
      setCompassHeading(heading * (180 / Math.PI));
    }
  }, []);

  /**
   * Update navigation state based on user movement
   */
  const updateNavigationState = useCallback(() => {
    const state = navigationService.getNavigationState();
    const instruction = navigationService.getCurrentInstruction();
    
    setCurrentInstruction(instruction);
    setRemainingDistance(state.progress.remainingDistance);
    
    // Check if user has reached destination
    if (state.progress.remainingDistance < 2.0) {
      onNavigationComplete();
    }
  }, [onNavigationComplete, navigationService]);

  /**
   * Start entrance animations
   */
  const startAnimations = useCallback(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Pulse animation for waypoints
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

    // Arrow rotation animation
    Animated.loop(
      Animated.timing(arrowRotation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Initialize Three.js AR scene (inspired by 0xknon/react-native-ar-navigation-sample)
   */
  const initializeThreeJSScene = useCallback((gl: any) => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, screenWidth / screenHeight, 0.1, 1000);
    const renderer = new Renderer({ gl });
    
    renderer.setSize(screenWidth, screenHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background for AR

    // Store refs
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    // Create navigation arrow (inspired by ViroReact ARObjectMarker patterns)
    createNavigationArrow(scene);

    // Start render loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (renderer && scene && camera) {
        // Update arrow rotation based on compass
        if (arrowMeshRef.current) {
          arrowMeshRef.current.rotation.y = (compassHeading * Math.PI) / 180;
        }

        // Update waypoint positions
        updateWaypointMeshes();

        renderer.render(scene, camera);
        gl.endFrameEXP();
      }
    };
    animate();

    console.log('🎮 Three.js AR scene initialized');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compassHeading]);

  /**
   * Create 3D navigation arrow (inspired by ViroReact ViroARObjectMarker)
   */
  const createNavigationArrow = useCallback((scene: THREE.Scene) => {
    // Create arrow geometry
    const arrowGeometry = new THREE.ConeGeometry(0.3, 1, 8);
    const arrowMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x007AFF,
      transparent: true,
      opacity: 0.8
    });
    
    const arrowMesh = new THREE.Mesh(arrowGeometry, arrowMaterial);
    arrowMesh.position.set(0, 0, -3); // 3 meters ahead
    arrowMesh.rotation.x = -Math.PI / 2; // Point forward
    
    scene.add(arrowMesh);
    arrowMeshRef.current = arrowMesh;
  }, []);

  /**
   * Update waypoint meshes based on navigation state (inspired by ViroReact ARImageMarker)
   */
  const updateWaypointMeshes = useCallback(() => {
    if (!sceneRef.current) return;

    // Clear existing waypoint meshes
    waypointMeshes.current.forEach(mesh => {
      sceneRef.current?.remove(mesh);
    });
    waypointMeshes.current = [];

    // Generate current AR waypoints
    const currentWaypoints = navigationService.generateARWaypoints();
    setArWaypoints(currentWaypoints);

    // Create new waypoint meshes
    currentWaypoints.forEach((waypoint: ARWaypoint) => {
      let geometry: THREE.BufferGeometry;
      let material: THREE.Material;

      switch (waypoint.type) {
        case 'start':
        case 'end':
          geometry = new THREE.SphereGeometry(0.2, 16, 16);
          material = new THREE.MeshPhongMaterial({
            color: waypoint.color,
            transparent: true,
            opacity: 0.7
          });
          break;
        case 'turn':
          geometry = new THREE.ConeGeometry(0.15, 0.3, 8);
          material = new THREE.MeshPhongMaterial({
            color: waypoint.color,
            transparent: true,
            opacity: 0.8
          });
          break;
        case 'landmark':
          geometry = new THREE.CylinderGeometry(0.2, 0.2, 0.4, 16);
          material = new THREE.MeshPhongMaterial({
            color: waypoint.color,
            transparent: true,
            opacity: 0.9
          });
          break;
        default:
          return;
      }

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(waypoint.position.x, waypoint.position.y, waypoint.position.z);
      
      sceneRef.current?.add(mesh);
      waypointMeshes.current.push(mesh);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Handle navigation instruction tap
   */
  const handleInstructionTap = useCallback(() => {
    Alert.alert('Navigation Instruction', currentInstruction);
  }, [currentInstruction]);

  /**
   * Handle next waypoint button
   */
  const handleNextWaypoint = useCallback(() => {
    // Simulate moving to next waypoint
    const state = navigationService.getNavigationState();
    if (state.currentPointIndex < state.navigationPoints.length - 1) {
      // In a real implementation, this would advance the navigation
      updateNavigationState();
    }
  }, [updateNavigationState, navigationService]);

  /**
   * Render AR controls overlay (inspired by Google Maps Live View UI)
   */
  const renderARControls = () => (
    <Animated.View 
      style={[
        styles.controlsOverlay, 
        { opacity: fadeAnim }
      ]}
    >
      {/* Top bar */}
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.topBar, { backgroundColor: colors.surface + 'CC' }]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <IconSymbol name="xmark" size={24} color={colors.text} />
          </TouchableOpacity>
          
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: colors.text }]}>AR Navigation</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              To {destination}
            </Text>
          </View>

          <View style={styles.statusContainer}>
            <View style={[
              styles.trackingIndicator,
              { backgroundColor: isTracking ? '#34C759' : '#FF3B30' }
            ]} />
            <Text style={[styles.trackingText, { color: colors.textSecondary }]}>
              {isTracking ? 'Tracking' : 'Lost'}
            </Text>
          </View>
        </View>
      </SafeAreaView>

      {/* Compass overlay */}
      <Animated.View
        style={[
          styles.compassContainer,
          {
            transform: [
              {
                rotate: arrowRotation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          },
        ]}
      >
        <View style={[styles.compass, { borderColor: colors.primary }]}>
          <IconSymbol name="location" size={32} color={colors.primary} />
        </View>
      </Animated.View>

      {/* Bottom instruction panel */}
      <TouchableOpacity
        style={[styles.instructionPanel, { backgroundColor: colors.surface + 'DD' }]}
        onPress={handleInstructionTap}
      >
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <IconSymbol name="arrow.up" size={24} color={colors.primary} />
        </Animated.View>
        
        <View style={styles.instructionContent}>
          <Text style={[styles.instructionText, { color: colors.text }]}>
            {currentInstruction}
          </Text>
          <Text style={[styles.instructionDistance, { color: colors.textSecondary }]}>
            {remainingDistance.toFixed(0)}m remaining
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: colors.primary }]}
          onPress={handleNextWaypoint}
        >
          <Text style={[styles.nextButtonText, { color: 'white' }]}>Next</Text>
        </TouchableOpacity>
      </TouchableOpacity>

      {/* AR Waypoint indicators */}
      {arWaypoints.map(waypoint => (
        <Animated.View
          key={waypoint.id}
          style={[
            styles.waypointIndicator,
            {
              left: screenWidth * 0.1 + (waypoint.position.x * 10),
              top: screenHeight * 0.3 + (waypoint.position.z * 10),
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <View style={[
            styles.waypointDot,
            { backgroundColor: waypoint.color }
          ]} />
          <Text style={[styles.waypointLabel, { color: colors.text }]}>
            {waypoint.instruction}
          </Text>
        </Animated.View>
      ))}
    </Animated.View>
  );

  // Show permission request if needed
  if (!cameraPermission?.granted) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <SafeAreaView style={styles.permissionContainer}>
          <IconSymbol name="camera" size={64} color={colors.textSecondary} />
          <Text style={[styles.permissionText, { color: colors.text }]}>
            Camera access is required for AR navigation
          </Text>
          <TouchableOpacity
            style={[styles.permissionButton, { backgroundColor: colors.primary }]}
            onPress={requestCameraPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  }

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      {/* Camera view */}
      <CameraView style={styles.camera} facing="back">
        {/* Three.js AR overlay */}
        <GLView
          style={StyleSheet.absoluteFill}
          onContextCreate={initializeThreeJSScene}
        />
        
        {/* UI controls overlay */}
        {renderARControls()}
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
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  safeArea: {
    flex: 0,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  closeButton: {
    padding: 8,
  },
  titleContainer: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackingIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  trackingText: {
    fontSize: 12,
    fontWeight: '500',
  },
  compassContainer: {
    position: 'absolute',
    top: 150,
    right: 20,
    zIndex: 1001,
  },
  compass: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionPanel: {
    position: 'absolute',
    bottom: 50,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  instructionContent: {
    flex: 1,
    marginLeft: 12,
  },
  instructionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  instructionDistance: {
    fontSize: 14,
    marginTop: 2,
  },
  nextButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  nextButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  waypointIndicator: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 999,
  },
  waypointDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  waypointLabel: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    color: 'white',
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  permissionText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
  },
  permissionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
