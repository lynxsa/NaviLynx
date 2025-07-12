import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Platform, Alert, Animated } from 'react-native';
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { CameraView, useCameraPermissions, PermissionStatus } from 'expo-camera';
import { DeviceMotion, DeviceMotionMeasurement } from 'expo-sensors';
import { Ionicons } from '@expo/vector-icons';
import { Route, PointOfInterest } from '../../types/navigation';
import { useTheme } from '@/context/ThemeContext';
import { brand } from '@/constants/branding';

// Polyfills for THREE JS
(global as any).THREE = (global as any).THREE || THREE;

// Mock indoor navigation service for AR
class MockIndoorNavigationService {
  private mockPOIs: PointOfInterest[] = [
    {
      id: 'poi_1',
      name: 'Main Entrance',
      coordinates: { x: 0, y: 0, level: 0 },
      type: 'exit',
      description: 'Main entrance to the building'
    },
    {
      id: 'poi_2',
      name: 'Information Desk',
      coordinates: { x: 10, y: 5, level: 0 },
      type: 'info',
      description: 'Information and help desk'
    },
    {
      id: 'poi_3',
      name: 'Store 101',
      coordinates: { x: 20, y: 10, level: 0 },
      type: 'store',
      description: 'Fashion retail store'
    },
    {
      id: 'poi_4',
      name: 'Food Court',
      coordinates: { x: 30, y: 15, level: 1 },
      type: 'store',
      description: 'Food court area'
    }
  ];

  getPOIById(id: string): PointOfInterest | undefined {
    return this.mockPOIs.find(poi => poi.id === id);
  }
}

interface ARNavigatorViewProps {
  route: Route;
  onNavigationComplete: () => void;
  onInstructionUpdate?: (instruction: string, distance: number) => void;
} 

// Polyfills for THREE JS
// To address the global.THREE error, we can cast global to any or use a more specific type if available.
// For simplicity, casting to any for now. Consider a more robust solution if this causes issues.
(global as any).THREE = (global as any).THREE || THREE;


interface ARNavigatorViewProps {
  route: Route;
  onNavigationComplete: () => void;
  onInstructionUpdate?: (instruction: string, distance: number) => void;
}

const ARNavigatorView: React.FC<ARNavigatorViewProps> = ({
  route,
  onNavigationComplete,
  onInstructionUpdate,
}) => {
  const { colors } = useTheme();
  const [cameraPermissionStatus, requestPermission] = useCameraPermissions();
  const [deviceMotionPermission, setDeviceMotionPermission] = useState<PermissionStatus | null>(null);
  const [isARSupported, setIsARSupported] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState<number>(0);
  const [currentInstruction, setCurrentInstruction] = useState<string>('');
  const [distanceToNextManeuver, setDistanceToNextManeuver] = useState<number>(0);
  const [deviceMotion, setDeviceMotion] = useState<DeviceMotionMeasurement | null>(null);
  const [isPerformanceModeEnabled, setIsPerformanceModeEnabled] = useState<boolean>(false);
  const [renderFrameRate, setRenderFrameRate] = useState<number>(60);

  // Performance monitoring
  const frameCountRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(Date.now());

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const expoCameraRef = useRef<React.ElementRef<typeof CameraView> | null>(null);
  const glContextRef = useRef<ExpoWebGLRenderingContext | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const glViewRef = useRef<GLView>(null);
  const cameraTextureRef = useRef<THREE.Texture | null>(null);
  const indoorNavServiceInstance = useRef(new MockIndoorNavigationService()).current;

  // Ref for the 3D path segment (cylinder)
  const pathSegmentMeshRef = useRef<THREE.Mesh | null>(null);

  // Refs for POI markers
  const fromPOIMarkerRef = useRef<THREE.Mesh | null>(null);
  const toPOIMarkerRef = useRef<THREE.Mesh | null>(null);
  const arrowheadMeshRef = useRef<THREE.Mesh | null>(null);

  // Animation functions
  const startEntranceAnimation = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  const startPulseAnimation = useCallback(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };
    pulse();
  }, [pulseAnim]);

  const updateNavigationState = useCallback((segmentIndex: number) => {
    if (!route || !route.segments || segmentIndex < 0 || segmentIndex >= route.segments.length) {
      console.warn('Invalid segmentIndex or route segments in updateNavigationState');
      return;
    }
    const segment = route.segments[segmentIndex];
    if (!segment) return;

    const fromPOI = indoorNavServiceInstance.getPOIById(segment.fromPOIId);
    const toPOI = indoorNavServiceInstance.getPOIById(segment.toPOIId);

    let instructionText = `Proceed towards ${toPOI?.name || 'next point'}`;
    if (segment.type === 'elevator') {
      instructionText = `Take elevator at ${fromPOI?.name || 'current location'} to ${toPOI?.coordinates.level === fromPOI?.coordinates.level ? 'another part of this floor' : `Level ${toPOI?.coordinates.level}`}`;
    } else if (segment.type === 'escalator') {
      instructionText = `Take escalator at ${fromPOI?.name || 'current location'} to ${toPOI?.coordinates.level === fromPOI?.coordinates.level ? 'another part of this floor' : `Level ${toPOI?.coordinates.level}`}`;
    } else if (segment.type === 'stairs') {
      instructionText = `Take stairs at ${fromPOI?.name || 'current location'} to ${toPOI?.coordinates.level === fromPOI?.coordinates.level ? 'another part of this floor' : `Level ${toPOI?.coordinates.level}`}`;
    }
    
    setCurrentInstruction(instructionText);
    setDistanceToNextManeuver(segment.distance);

    if (onInstructionUpdate) {
      onInstructionUpdate(instructionText, segment.distance);
    }
    console.log(`AR: Navigating from ${fromPOI?.name} to ${toPOI?.name}. Instruction: ${instructionText}`);
  }, [route, onInstructionUpdate, indoorNavServiceInstance]);

  const handleNavigationComplete = useCallback(() => {
    try {
      const destinationPOI = route ? indoorNavServiceInstance.getPOIById(route.destinationPOIId) : null;
      Alert.alert('Navigation Complete', `You have arrived at ${destinationPOI?.name || 'your destination'}.`);
      onNavigationComplete();
    } catch (error) {
      console.error('Error completing navigation:', error);
      Alert.alert('Navigation Complete', 'You have arrived at your destination.');
      onNavigationComplete();
    }
  }, [route, onNavigationComplete, indoorNavServiceInstance]);

  // Device motion setup with enhanced performance
  useEffect(() => {
    let subscription: any;
    let lastUpdate = 0;
    const updateThrottle = 50; // Throttle to 20 FPS for better performance
    
    const setupDeviceMotion = async () => {
      if (deviceMotionPermission === PermissionStatus.GRANTED) {
        try {
          subscription = DeviceMotion.addListener((data) => {
            const now = Date.now();
            if (now - lastUpdate >= updateThrottle) {
              setDeviceMotion(data);
              lastUpdate = now;
            }
          });
          DeviceMotion.setUpdateInterval(updateThrottle);
        } catch (error) {
          console.error('Error setting up device motion:', error);
        }
      }
    };

    setupDeviceMotion();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [deviceMotionPermission]);

  useEffect(() => {
    const initializeAR = async () => {
      setIsLoading(true);
      try {
        // Camera permission
        if (!cameraPermissionStatus?.granted) {
          const permissionResult = await requestPermission();
          if (!permissionResult.granted) {
            setError("Camera permission is required for AR.");
            setIsLoading(false);
            return;
          }
        }

        // Device motion permission
        const motionStatus = await DeviceMotion.getPermissionsAsync();
        if (motionStatus.status !== PermissionStatus.GRANTED) {
          const requestedMotionStatus = await DeviceMotion.requestPermissionsAsync();
          setDeviceMotionPermission(requestedMotionStatus.status);
          if (requestedMotionStatus.status !== PermissionStatus.GRANTED) {
            setError("Device motion permission is required for AR.");
            setIsLoading(false);
            return;
          }
        } else {
          setDeviceMotionPermission(motionStatus.status);
        }

        const arAvailable = await DeviceMotion.isAvailableAsync();
        setIsARSupported(arAvailable);
        if (!arAvailable) {
          setError("AR features are not supported on this device. Device motion sensor might be unavailable.");
          setIsLoading(false);
          return;
        }

        // Start animations
        startEntranceAnimation();
        startPulseAnimation();

      } catch (e: any) {
        console.error("Permission or sensor availability error:", e);
        setError(e.message || "An unexpected error occurred during setup.");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAR();
  }, [requestPermission, cameraPermissionStatus, startEntranceAnimation, startPulseAnimation]);

  useEffect(() => {
    if (isLoading || error) return; // Don't run if still loading or error occurred

    // Explicitly check for true/false to handle the null state correctly
    if (cameraPermissionStatus?.status !== PermissionStatus.GRANTED || !isARSupported) {
        // Error or guidance is already handled by the permission useEffect or initial state
        return;
    }

    if (!route || route.segments.length === 0) {
      setError('Invalid route for AR Navigation.');
      return;
    }
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
        setError('AR features are primarily supported on iOS and Android.');
        setIsARSupported(false); // Explicitly set to false
        return;
    }
    
    updateNavigationState(currentSegmentIndex); // Use currentSegmentIndex state

    const simulationInterval = setInterval(() => {
      setCurrentSegmentIndex(prevIndex => {
        const nextIndex = prevIndex + 1;
        if (nextIndex < route.segments.length) {
          updateNavigationState(nextIndex);
          return nextIndex;
        } else {
          clearInterval(simulationInterval);
          handleNavigationComplete();
          return prevIndex;
        }
      });
    }, 7000);

    return () => {
      clearInterval(simulationInterval);
      if (animationFrameIdRef.current) {
        if (typeof cancelAnimationFrame !== 'undefined') {
          cancelAnimationFrame(animationFrameIdRef.current);
        } else {
          clearTimeout(animationFrameIdRef.current);
        }
      }
      
      // Dispose Three.js resources
      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry?.dispose();
            // Ensure material is not an array before accessing dispose
            if (object.material && !Array.isArray(object.material)) {
              (object.material as THREE.Material).dispose();
            } else if (Array.isArray(object.material)) {
               object.material.forEach(material => (material as THREE.Material).dispose());
            }
          }
        });
      }
      cameraTextureRef.current?.dispose();
      rendererRef.current?.dispose();
      
      // Nullify refs
      rendererRef.current = null;
      glContextRef.current = null; 
      sceneRef.current = null;
      cameraRef.current = null;
      cameraTextureRef.current = null;
    };
  }, [
    route, 
    updateNavigationState, 
    handleNavigationComplete, 
    cameraPermissionStatus?.status, 
    isARSupported, 
    isLoading, // Added isLoading
    error, // Added error
    currentSegmentIndex // Added currentSegmentIndex
  ]); 

  // Function to update AR elements positioning
  const updateARElements = useCallback(() => {
    if (!sceneRef.current || !route || !route.segments || currentSegmentIndex >= route.segments.length) {
      return;
    }

    const segment = route.segments[currentSegmentIndex];
    if (!segment) return;

    const fromPOI = indoorNavServiceInstance.getPOIById(segment.fromPOIId);
    const toPOI = indoorNavServiceInstance.getPOIById(segment.toPOIId);

    const pathMesh = pathSegmentMeshRef.current;
    const arrowheadMesh = arrowheadMeshRef.current;
    const fromMarker = fromPOIMarkerRef.current;
    const toMarker = toPOIMarkerRef.current;

    if (!fromPOI || !toPOI || !pathMesh || !arrowheadMesh || !fromMarker || !toMarker) {
      // Hide elements if data is incomplete
      if (pathMesh) pathMesh.visible = false;
      if (fromMarker) fromMarker.visible = false;
      if (toMarker) toMarker.visible = false;
      if (arrowheadMesh) arrowheadMesh.visible = false;
      return;
    }

    // Show all elements
    pathMesh.visible = true;
    fromMarker.visible = true;
    toMarker.visible = true;
    arrowheadMesh.visible = true;

    const SCALE_FACTOR = 0.1;
    const LEVEL_HEIGHT_SCALE = 0.5;
    const arrowheadHeight = 0.1;

    const startPoint = new THREE.Vector3(
      fromPOI.coordinates.x * SCALE_FACTOR,
      fromPOI.coordinates.level * LEVEL_HEIGHT_SCALE,
      fromPOI.coordinates.y * SCALE_FACTOR
    );

    const endPoint = new THREE.Vector3(
      toPOI.coordinates.x * SCALE_FACTOR,
      toPOI.coordinates.level * LEVEL_HEIGHT_SCALE,
      toPOI.coordinates.y * SCALE_FACTOR
    );

    // Update path segment
    const direction = new THREE.Vector3().subVectors(endPoint, startPoint);
    const length = direction.length();
    
    pathMesh.scale.set(1, length, 1);
    pathMesh.position.copy(startPoint).add(direction.multiplyScalar(0.5));
    
    const normalizedDirection = direction.clone().normalize();
    pathMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normalizedDirection);

    // Update POI markers
    fromMarker.position.copy(startPoint);
    toMarker.position.copy(endPoint);

    // Update arrowhead
    const arrowheadOffset = arrowheadHeight / 2;
    arrowheadMesh.position.copy(endPoint).add(normalizedDirection.clone().multiplyScalar(arrowheadOffset));
    arrowheadMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normalizedDirection);
  }, [route, currentSegmentIndex, indoorNavServiceInstance]);

  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    if (cameraPermissionStatus?.status !== PermissionStatus.GRANTED || !isARSupported) { 
      console.warn('Camera permission not granted or AR not supported, AR session cannot start.');
      setIsLoading(false); // Ensure loading is false if we can't start
      return;
    }

    glContextRef.current = gl;

    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    
    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    if (expoCameraRef.current && glViewRef.current) {
      try {
        // Pass the actual component ref to createCameraTextureAsync
        const tex = await glViewRef.current.createCameraTextureAsync(expoCameraRef.current);
        if (tex) {
          cameraTextureRef.current = tex as unknown as THREE.Texture; 
          scene.background = cameraTextureRef.current;
        } else {
          console.warn("Failed to create camera texture, falling back to solid color.");
          renderer.setClearColor(0x202020, 1); 
        }
      } catch (e) {
        console.error("Error creating camera texture:", e);
        renderer.setClearColor(0x202020, 1); 
      }
    } else {
        console.warn("ExpoCameraComponent ref or GLView ref not available for texture creation, falling back to solid color.");
        if (rendererRef.current) { 
            rendererRef.current.setClearColor(0x202020, 1);
        }
    }

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(0, 1, 2.5); 
    camera.lookAt(0,0,0);
    
    const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0, 0);
    scene.add(cube);

    // Create animated texture for the path
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    if (context) {
      context.fillStyle = 'rgba(255, 255, 255, 0)'; // Transparent background for stripes
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.strokeStyle = brand.light; // White stripes
      context.lineWidth = 8;
      for (let i = 0; i < canvas.height / 8; i++) { // Draw horizontal stripes
        context.beginPath();
        context.moveTo(0, i * 16 + 8); // Adjust spacing and thickness as needed
        context.lineTo(canvas.width, i * 16 + 8);
        context.stroke();
      }
    }
    const pathTexture = new THREE.CanvasTexture(canvas);
    pathTexture.wrapS = THREE.RepeatWrapping;
    pathTexture.wrapT = THREE.RepeatWrapping;
    pathTexture.repeat.set(1, 4); // Repeat texture 4 times along the cylinder length by default

    // Create 3D path segment (cylinder)
    const lineThickness = 0.02;
    const pathSegmentGeometry = new THREE.CylinderGeometry(lineThickness, lineThickness, 1, 8);
    const pathSegmentMaterial = new THREE.MeshPhongMaterial({
      color: parseInt(colors.primary.replace('#', '0x')), // Bright blue
      map: pathTexture,
      transparent: true, // Needed if texture has alpha
    });
    
    const pathMesh = new THREE.Mesh(pathSegmentGeometry, pathSegmentMaterial);
    pathSegmentMeshRef.current = pathMesh;
    scene.add(pathMesh);
    
    // Create arrowhead
    const arrowheadRadius = 0.04; // Slightly wider than path
    const arrowheadHeight = 0.1;
    const arrowheadGeometry = new THREE.ConeGeometry(arrowheadRadius, arrowheadHeight, 8);
    const arrowheadMaterial = new THREE.MeshPhongMaterial({ color: parseInt(colors.primary.replace('#', '0x')) }); // Same color as path
    const arrowhead = new THREE.Mesh(arrowheadGeometry, arrowheadMaterial);
    arrowheadMeshRef.current = arrowhead;
    scene.add(arrowhead);

    // Create POI markers
    const poiMarkerGeometry = new THREE.SphereGeometry(0.05, 16, 16); 
    const fromPOIMaterial = new THREE.MeshPhongMaterial({ color: parseInt(colors.error.replace('#', '0x')) }); 
    const toPOIMaterial = new THREE.MeshPhongMaterial({ color: parseInt(colors.success.replace('#', '0x')) });   

    const fromMarker = new THREE.Mesh(poiMarkerGeometry, fromPOIMaterial);
    fromPOIMarkerRef.current = fromMarker;
    scene.add(fromMarker);

    const toMarker = new THREE.Mesh(poiMarkerGeometry, toPOIMaterial);
    toPOIMarkerRef.current = toMarker;
    scene.add(toMarker);
    
    // Initially hide path, markers, and arrowhead until route data is processed
    pathMesh.visible = false;
    fromMarker.visible = false;
    toMarker.visible = false;
    arrowhead.visible = false;

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(1, 2, 1);
    scene.add(directionalLight);

    const renderLoop = () => {
      if (typeof requestAnimationFrame !== 'undefined') {
        animationFrameIdRef.current = requestAnimationFrame(renderLoop);
      } else {
        animationFrameIdRef.current = setTimeout(renderLoop, 16) as any;
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current && glContextRef.current) {
        // Enhanced device motion integration with smoothing
        if (deviceMotion && deviceMotion.rotation) {
          const { alpha, beta, gamma } = deviceMotion.rotation;
          
          if (alpha != null && beta != null && gamma != null) {
            // Apply smoothing factor to reduce jitter
            const smoothingFactor = 0.1;
            const targetRotationX = THREE.MathUtils.degToRad(beta * 0.5); // Reduced sensitivity
            const targetRotationY = THREE.MathUtils.degToRad(gamma * 0.5); // Reduced sensitivity
            
            // Smoothly interpolate to target rotation
            cameraRef.current.rotation.x = THREE.MathUtils.lerp(
              cameraRef.current.rotation.x, 
              targetRotationX, 
              smoothingFactor
            );
            cameraRef.current.rotation.y = THREE.MathUtils.lerp(
              cameraRef.current.rotation.y, 
              targetRotationY, 
              smoothingFactor
            );
          }
        }

        // Enhanced cube animation with performance consideration
        const time = Date.now() * 0.001;
        if (!isPerformanceModeEnabled) {
          // Full animation when performance is good
          cube.rotation.x = time * 0.5;
          cube.rotation.y = time * 0.7;
          cube.position.y = Math.sin(time * 2) * 0.1;
        } else {
          // Reduced animation when performance is poor
          cube.rotation.x = time * 0.2;
          cube.rotation.y = time * 0.3;
          cube.position.y = Math.sin(time) * 0.05;
        }
        
        // Animate path texture for movement indication (performance-aware)
        if (pathSegmentMeshRef.current && pathSegmentMeshRef.current.material) {
          const material = pathSegmentMeshRef.current.material as THREE.MeshPhongMaterial;
          if (material.map && !isPerformanceModeEnabled) {
            material.map.offset.y = (time * 0.5) % 1; // Animate texture for flow effect
          }
        }

        // Performance monitoring
        const currentTime = Date.now();
        frameCountRef.current++;
        
        if (currentTime - lastFrameTimeRef.current >= 1000) {
          const fps = frameCountRef.current;
          frameCountRef.current = 0;
          lastFrameTimeRef.current = currentTime;
          
          // Auto-enable performance mode if FPS drops below 30
          if (fps < 30 && !isPerformanceModeEnabled) {
            setIsPerformanceModeEnabled(true);
            console.log('AR: Performance mode enabled due to low FPS:', fps);
          } else if (fps > 45 && isPerformanceModeEnabled) {
            setIsPerformanceModeEnabled(false);
            console.log('AR: Performance mode disabled, FPS improved:', fps);
          }
          
          setRenderFrameRate(fps);
        }

        // Update 3D path and POI positions based on current route segment
        updateARElements();

        // Animate path texture
        if (pathSegmentMeshRef.current && (pathSegmentMeshRef.current.material as THREE.MeshPhongMaterial).map) {
          const texture = (pathSegmentMeshRef.current.material as THREE.MeshPhongMaterial).map as THREE.Texture;
          texture.offset.y -= 0.02; // Adjust speed as needed
        }

        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
      gl.endFrameEXP(); 
    };
    renderLoop();
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <Animated.View style={[styles.centered, { opacity: fadeAnim }]}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading AR View...</Text>
        </Animated.View>
      </Animated.View>
    );
  }

  if (error) {
    return (
      <Animated.View style={[styles.centered, { opacity: fadeAnim }]}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Ionicons name="warning" size={64} color={colors.error} style={styles.errorIcon} />
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity onPress={onNavigationComplete} style={styles.exitButton}>
            <Text style={styles.exitButtonText}>Exit</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    );
  }

  if (cameraPermissionStatus?.status !== PermissionStatus.GRANTED) {
    return (
      <Animated.View style={[styles.centered, { opacity: fadeAnim }]}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Ionicons name="camera" size={64} color={colors.primary} style={styles.permissionIcon} />
          <Text style={styles.permissionText}>Camera permission is required to use AR features.</Text>
          <TouchableOpacity onPress={() => requestPermission()} style={styles.permissionButton}>
            <Text style={styles.buttonText}>Grant Camera Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onNavigationComplete} style={styles.exitButton}>
            <Text style={styles.exitButtonText}>Exit</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    );
  }
  
  if (deviceMotionPermission !== PermissionStatus.GRANTED) {
    return (
      <Animated.View style={[styles.centered, { opacity: fadeAnim }]}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Ionicons name="phone-portrait" size={64} color={colors.primary} style={styles.permissionIcon} />
          <Text style={styles.permissionText}>Device Motion permission is required to use AR features.</Text>
          <TouchableOpacity onPress={onNavigationComplete} style={styles.exitButton}>
            <Text style={styles.exitButtonText}>Exit</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    );
  }

  if (!isARSupported) {
    return (
      <Animated.View style={[styles.centered, { opacity: fadeAnim }]}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Ionicons name="phone-portrait" size={64} color={colors.error} style={styles.errorIcon} />
          <Text style={styles.errorText}>AR is not supported on this device.</Text>
          <TouchableOpacity onPress={onNavigationComplete} style={styles.exitButton}>
            <Text style={styles.exitButtonText}>Exit</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    );
  }

  const isNativeCamera = Platform.OS !== 'web' && cameraPermissionStatus?.status === PermissionStatus.GRANTED;

  return (
    <View style={styles.container}>
      {isNativeCamera && (
        <CameraView ref={expoCameraRef} style={StyleSheet.absoluteFill} />
      )}
      <GLView ref={glViewRef} style={StyleSheet.absoluteFill} onContextCreate={onContextCreate} />
      
      <Animated.View style={[styles.hudContainer, { opacity: fadeAnim }]}>
        <Animated.View style={[styles.instructionContainer, { transform: [{ scale: pulseAnim }] }]}>
          <Ionicons name="navigate" size={24} color={colors.primary} />
          <View style={styles.instructionTextContainer}>
            <Text style={styles.instructionText}>{currentInstruction}</Text>
            <Text style={styles.distanceText}>Distance: {distanceToNextManeuver.toFixed(1)}m</Text>
          </View>
        </Animated.View>

        <View style={styles.routeProgress}>
          <Text style={styles.progressText}>
            Step {currentSegmentIndex + 1} of {route.segments.length}
          </Text>
          {__DEV__ && (
            <Text style={styles.fpsText}>
              {renderFrameRate} FPS {isPerformanceModeEnabled && '⚡'}
            </Text>
          )}
        </View>
      </Animated.View>

      <Animated.View style={[styles.controlsContainer, { opacity: fadeAnim }]}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => setCurrentSegmentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentSegmentIndex === 0}
        >
          <Ionicons name="arrow-back" size={24} color={currentSegmentIndex === 0 ? "#666" : "white"} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => setCurrentSegmentIndex(prev => Math.min(route.segments.length - 1, prev + 1))}
          disabled={currentSegmentIndex === route.segments.length - 1}
        >
          <Ionicons name="arrow-forward" size={24} color={currentSegmentIndex === route.segments.length - 1 ? "#666" : "white"} />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.exitButtonControl]} onPress={onNavigationComplete}>
          <Ionicons name="close-circle" size={24} color="white" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  errorIcon: {
    marginBottom: 10,
  },
  permissionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  permissionIcon: {
    marginBottom: 10,
  },
  permissionButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  exitButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  exitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  hudContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  instructionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 123, 255, 0.3)',
  },
  instructionTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  instructionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  distanceText: {
    color: '#ccc',
    fontSize: 14,
  },
  routeProgress: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 123, 255, 0.3)',
  },
  progressText: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  fpsText: {
    color: '#28a745',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1000,
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 16,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    minWidth: 60,
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exitButtonControl: {
    backgroundColor: 'rgba(255, 107, 107, 0.9)',
  },
});

export default ARNavigatorView;
