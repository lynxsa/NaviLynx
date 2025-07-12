/**
 * AROverlay - World-class AR navigation with gamified overlays
 * Features: 3D arrows, progress tracking, achievement system, voice guidance
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Text, Alert, Dimensions, Animated } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as Three from 'three';

// Internal imports
import { NavigationRoute, NavigationProgress, Coordinates } from '@/services/NavigationService';
import { ARSession } from '@/services/ARService';
import VoiceNavigationService from '@/services/VoiceNavigationService';
import { colors } from '@/styles/modernTheme';

interface AROverlayProps {
  session: ARSession | null;
  route: NavigationRoute | null;
  progress: NavigationProgress | null;
  userLocation: Coordinates | null;
  venueName?: string;
  onTrackingQualityChange: (quality: 'poor' | 'limited' | 'normal' | 'good') => void;
  onNavigationComplete?: () => void;
}

interface AR3DObject {
  id: string;
  mesh: Three.Mesh;
  position: Three.Vector3;
  type: 'arrow' | 'marker' | 'text' | 'achievement' | 'progress_ring';
  animationState?: 'idle' | 'pulsing' | 'rotating' | 'growing';
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function AROverlay({
  session,
  route,
  progress,
  userLocation,
  venueName,
  onTrackingQualityChange,
  onNavigationComplete,
}: AROverlayProps) {
  // Camera permissions
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  // Three.js refs
  const rendererRef = useRef<Renderer | null>(null);
  const sceneRef = useRef<Three.Scene | null>(null);
  const cameraRef = useRef<Three.PerspectiveCamera | null>(null);
  const arObjectsRef = useRef<Map<string, AR3DObject>>(new Map());
  
  // Animation frame
  const animationFrameRef = useRef<number | null>(null);

  // Gamification state
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [experience, setExperience] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [perfectTurns] = useState(0);
  
  // Voice service
  const voiceService = useRef(VoiceNavigationService.getInstance());
  
  // Animation values
  const levelUpAnimation = useRef(new Animated.Value(0)).current;
  const achievementAnimation = useRef(new Animated.Value(0)).current;

  /**
   * Initialize camera permissions and gamification system
   */
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
        
        if (status !== 'granted') {
          Alert.alert(
            'Camera Permission Required',
            'AR navigation requires camera access to overlay navigation information.',
            [{ text: 'OK' }]
          );
        }

        // Initialize gamification achievements
        initializeAchievements();
        
        // Initialize voice navigation service
        await voiceService.current.initializeService();
        
      } catch (error) {
        console.error('AR Overlay initialization error:', error);
      }
    })();
  }, []);

  /**
   * Initialize achievement system
   */
  const initializeAchievements = () => {
    const initialAchievements: Achievement[] = [
      {
        id: 'first_navigation',
        title: 'First Steps',
        description: 'Complete your first navigation',
        icon: 'star.fill',
        unlocked: false,
        progress: 0,
        maxProgress: 1,
      },
      {
        id: 'perfect_turns',
        title: 'Turn Master',
        description: 'Make 10 perfect turns',
        icon: 'arrow.triangle.turn.up.right.circle.fill',
        unlocked: false,
        progress: 0,
        maxProgress: 10,
      },
      {
        id: 'speed_demon',
        title: 'Speed Walker',
        description: 'Complete a route in optimal time',
        icon: 'bolt.fill',
        unlocked: false,
        progress: 0,
        maxProgress: 1,
      },
      {
        id: 'explorer',
        title: 'Explorer',
        description: 'Visit 5 different venues',
        icon: 'location.fill',
        unlocked: false,
        progress: 0,
        maxProgress: 5,
      },
    ];
    setAchievements(initialAchievements);
  };

  /**
   * Handle achievement unlock
   */
  const unlockAchievement = useCallback((achievementId: string) => {
    setAchievements(prev => {
      const updated = prev.map(achievement => {
        if (achievement.id === achievementId && !achievement.unlocked) {
          // Trigger animation
          Animated.sequence([
            Animated.timing(achievementAnimation, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.delay(2000),
            Animated.timing(achievementAnimation, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start();

          // Voice announcement
          voiceService.current.announceAchievement(achievement.title, achievement.description);
          
          // Add experience
          setExperience(prev => prev + 100);
          
          return { ...achievement, unlocked: true, progress: achievement.maxProgress };
        }
        return achievement;
      });
      return updated;
    });
  }, [achievementAnimation]);

  /**
   * Update achievement progress
   */
  const updateAchievementProgress = useCallback((achievementId: string, progress: number) => {
    setAchievements(prev => {
      return prev.map(achievement => {
        if (achievement.id === achievementId) {
          const newProgress = Math.min(progress, achievement.maxProgress);
          if (newProgress >= achievement.maxProgress && !achievement.unlocked) {
            // Achievement completed, trigger unlock
            setTimeout(() => unlockAchievement(achievementId), 500);
          }
          return { ...achievement, progress: newProgress };
        }
        return achievement;
      });
    });
  }, [unlockAchievement]);

  /**
   * Handle level up
   */
  const checkLevelUp = useCallback(() => {
    const requiredXP = currentLevel * 200; // XP required for next level
    if (experience >= requiredXP) {
      setCurrentLevel(prev => prev + 1);
      setExperience(prev => prev - requiredXP);
      setShowLevelUp(true);
      
      // Trigger level up animation
      Animated.sequence([
        Animated.timing(levelUpAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
        Animated.timing(levelUpAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => setShowLevelUp(false));

      // Voice announcement
      voiceService.current.announceLevelUp(currentLevel + 1);
    }
  }, [currentLevel, experience, levelUpAnimation]);

  /**
   * Check for level up when experience changes
   */
  useEffect(() => {
    checkLevelUp();
  }, [experience, checkLevelUp]);

  /**
   * Initialize Three.js scene for AR
   */
  const initializeARScene = (gl: any) => {
    try {
      // Create renderer
      const renderer = new Renderer({ gl });
      renderer.setSize(screenWidth, screenHeight);
      renderer.setClearColor(0x000000, 0); // Transparent background
      rendererRef.current = renderer;

      // Create scene
      const scene = new Three.Scene();
      sceneRef.current = scene;

      // Create camera
      const camera = new Three.PerspectiveCamera(
        75, // Field of view
        screenWidth / screenHeight, // Aspect ratio
        0.1, // Near clipping plane
        1000 // Far clipping plane
      );
      camera.position.set(0, 0, 0); // Camera at origin (user position)
      cameraRef.current = camera;

      // Add ambient light
      const ambientLight = new Three.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      // Add directional light
      const directionalLight = new Three.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(0, 10, 5);
      scene.add(directionalLight);

      console.log('AR Scene initialized successfully');
      onTrackingQualityChange('good');

      // Start render loop
      startRenderLoop();
    } catch (error) {
      console.error('AR Scene initialization error:', error);
      onTrackingQualityChange('poor');
    }
  };

  /**
   * Start the render loop for AR objects
   */
  const startRenderLoop = () => {
    const render = () => {
      try {
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          // Update AR objects based on navigation progress
          updateARObjects();
          
          // Render the scene
          rendererRef.current.render(sceneRef.current, cameraRef.current);
          
          // Request next frame
          animationFrameRef.current = requestAnimationFrame(render);
        }
      } catch (error) {
        console.error('AR render error:', error);
        onTrackingQualityChange('poor');
      }
    };

    render();
  };

  /**
   * Update AR objects based on current navigation state
   */
  const updateARObjects = () => {
    if (!route || !progress || !userLocation || !sceneRef.current) {
      return;
    }

    try {
      // Clear existing AR objects
      arObjectsRef.current.forEach((arObject) => {
        sceneRef.current?.remove(arObject.mesh);
      });
      arObjectsRef.current.clear();

      // Get current and next navigation steps
      const currentStep = route.steps[progress.currentStepIndex];
      const nextStep = route.steps[progress.currentStepIndex + 1];

      if (currentStep) {
        // Create arrow pointing to next waypoint
        const arrow = createDirectionArrow(userLocation, currentStep.coords, progress.distanceToNextTurn);
        if (arrow) {
          sceneRef.current.add(arrow.mesh);
          arObjectsRef.current.set(arrow.id, arrow);
        }

        // Create distance indicator
        const distanceMarker = createDistanceMarker(progress.distanceToNextTurn, currentStep.instruction);
        if (distanceMarker) {
          sceneRef.current.add(distanceMarker.mesh);
          arObjectsRef.current.set(distanceMarker.id, distanceMarker);
        }
      }

      if (nextStep) {
        // Create simplified preview marker for next turn (using existing arrow function)
        const nextTurnMarker = createDirectionArrow(userLocation, nextStep.coords, progress.distanceToDestination);
        if (nextTurnMarker) {
          // Make it smaller and more transparent to show it's a preview
          nextTurnMarker.mesh.scale.set(0.5, 0.5, 0.5);
          if (nextTurnMarker.mesh.material && typeof nextTurnMarker.mesh.material === 'object' && 'opacity' in nextTurnMarker.mesh.material) {
            (nextTurnMarker.mesh.material as any).opacity = 0.5;
          }
          nextTurnMarker.mesh.position.x += 1; // Offset to the side
          
          sceneRef.current.add(nextTurnMarker.mesh);
          arObjectsRef.current.set(nextTurnMarker.id, nextTurnMarker);
        }
      }

      // Create progress ring for gamification
      const progressRing = createProgressRing(progress.routeProgress);
      if (progressRing) {
        sceneRef.current.add(progressRing.mesh);
        arObjectsRef.current.set(progressRing.id, progressRing);
      }

      // Show achievements if any are recently unlocked
      const recentAchievement = achievements.find(a => a.unlocked);
      if (recentAchievement && showLevelUp) {
        const achievementDisplay = createAchievementDisplay(recentAchievement);
        if (achievementDisplay) {
          sceneRef.current.add(achievementDisplay.mesh);
          arObjectsRef.current.set(achievementDisplay.id, achievementDisplay);
        }
      }

      // Animate all AR objects
      animateARObjects();

      onTrackingQualityChange('good');
    } catch (error) {
      console.error('AR objects update error:', error);
      onTrackingQualityChange('limited');
    }
  };

  /**
   * Create enhanced 3D direction arrow with gamification
   */
  const createDirectionArrow = (
    userPos: Coordinates, 
    targetPos: Coordinates, 
    distance: number
  ): AR3DObject | null => {
    try {
      // Calculate direction vector
      const direction = new Three.Vector3(
        targetPos.longitude - userPos.longitude,
        0,
        targetPos.latitude - userPos.latitude
      ).normalize();

      // Create arrow geometry (more sophisticated than basic arrow)
      const arrowGeometry = new Three.ConeGeometry(0.5, 2, 8);
      const arrowMaterial = new Three.MeshLambertMaterial({
        color: distance < 50 ? 0x00ff00 : distance < 100 ? 0xffff00 : 0x0088ff,
        transparent: true,
        opacity: 0.8,
      });

      const arrowMesh = new Three.Mesh(arrowGeometry, arrowMaterial);
      
      // Position arrow in front of user (2 meters ahead)
      arrowMesh.position.set(direction.x * 2, 1.5, direction.z * 2);
      
      // Rotate arrow to point in correct direction
      arrowMesh.lookAt(new Three.Vector3(direction.x * 10, 1.5, direction.z * 10));

      // Add pulsing animation for urgency
      const animationState = distance < 20 ? 'pulsing' : 'rotating';

      return {
        id: `arrow_${Date.now()}`,
        mesh: arrowMesh,
        position: arrowMesh.position,
        type: 'arrow',
        animationState,
      };
    } catch (error) {
      console.error('Error creating direction arrow:', error);
      return null;
    }
  };

  /**
   * Create gamified progress ring
   */
  const createProgressRing = (progress: number): AR3DObject | null => {
    try {
      const ringGeometry = new Three.RingGeometry(1, 1.2, 32);
      const ringMaterial = new Three.MeshBasicMaterial({
        color: progress > 0.8 ? 0x00ff00 : progress > 0.5 ? 0xffff00 : 0xff4444,
        transparent: true,
        opacity: 0.7,
        side: Three.DoubleSide,
      });

      const ringMesh = new Three.Mesh(ringGeometry, ringMaterial);
      ringMesh.position.set(0, 0.5, -3); // Position in front of user
      ringMesh.rotation.x = -Math.PI / 2; // Lay flat

      // Scale ring based on progress
      const scale = 0.5 + (progress * 0.5);
      ringMesh.scale.set(scale, scale, scale);

      return {
        id: `progress_ring_${Date.now()}`,
        mesh: ringMesh,
        position: ringMesh.position,
        type: 'progress_ring',
        animationState: 'growing',
      };
    } catch (error) {
      console.error('Error creating progress ring:', error);
      return null;
    }
  };

  /**
   * Create distance marker with 3D text
   */
  const createDistanceMarker = (distance: number, instruction: string): AR3DObject | null => {
    try {
      // Create a simple text plane (in real app, use TextGeometry or Canvas texture)
      const textGeometry = new Three.PlaneGeometry(2, 0.5);
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) return null;
      
      canvas.width = 512;
      canvas.height = 128;
      
      // Draw background
      context.fillStyle = 'rgba(0, 0, 0, 0.8)';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw text
      context.font = '32px Arial';
      context.fillStyle = 'white';
      context.textAlign = 'center';
      
      const distanceText = distance < 1000 ? `${Math.round(distance)}m` : `${(distance / 1000).toFixed(1)}km`;
      context.fillText(distanceText, canvas.width / 2, 50);
      context.fillText(instruction.substring(0, 30), canvas.width / 2, 90);

      const texture = new Three.CanvasTexture(canvas);
      const textMaterial = new Three.MeshBasicMaterial({
        map: texture,
        transparent: true,
      });

      const textMesh = new Three.Mesh(textGeometry, textMaterial);
      textMesh.position.set(0, 2, -2); // Above the arrow

      return {
        id: `distance_marker_${Date.now()}`,
        mesh: textMesh,
        position: textMesh.position,
        type: 'text',
        animationState: 'idle',
      };
    } catch (error) {
      console.error('Error creating distance marker:', error);
      return null;
    }
  };

  /**
   * Create achievement display
   */
  const createAchievementDisplay = (achievement: Achievement): AR3DObject | null => {
    try {
      // Create floating achievement badge
      const badgeGeometry = new Three.SphereGeometry(0.3, 16, 16);
      const badgeMaterial = new Three.MeshLambertMaterial({
        color: 0xffd700, // Gold color
        transparent: true,
        opacity: 0.9,
      });

      const badgeMesh = new Three.Mesh(badgeGeometry, badgeMaterial);
      badgeMesh.position.set(1.5, 2, -1); // To the right of main view

      return {
        id: `achievement_${achievement.id}`,
        mesh: badgeMesh,
        position: badgeMesh.position,
        type: 'achievement',
        animationState: 'pulsing',
      };
    } catch (error) {
      console.error('Error creating achievement display:', error);
      return null;
    }
  };

  /**
   * Animate all AR objects based on their animation state
   */
  const animateARObjects = () => {
    if (!sceneRef.current) return;

    arObjectsRef.current.forEach((arObject) => {
      if (!arObject.mesh) return;

      const time = Date.now() * 0.001; // Time in seconds

      switch (arObject.animationState) {
        case 'pulsing':
          // Pulsing scale animation
          const scale = 1 + Math.sin(time * 4) * 0.2;
          arObject.mesh.scale.set(scale, scale, scale);
          break;

        case 'rotating':
          // Continuous rotation
          arObject.mesh.rotation.y = time * 2;
          break;

        case 'growing':
          // Growing animation (for progress rings)
          const growthScale = Math.min(1, time * 0.5);
          arObject.mesh.scale.set(growthScale, growthScale, growthScale);
          break;

        case 'idle':
        default:
          // Subtle hover animation
          arObject.mesh.position.y = arObject.position.y + Math.sin(time * 2) * 0.1;
          break;
      }
    });
  };

  /**
   * Handle navigation updates and voice guidance
   */
  useEffect(() => {
    if (!progress || !route) return;

    // Update achievement progress based on navigation
    if (progress.distanceToNextTurn < 20) {
      // User is close to a turn - track perfect turn potential
      updateAchievementProgress('perfect_turns', perfectTurns + 1);
    }

    // Check if route is completed
    if (progress.routeProgress >= 0.95) {
      updateAchievementProgress('first_navigation', 1);
      updateAchievementProgress('explorer', 1);
      
      // Add experience for completing navigation
      setExperience(prev => prev + 200);
      
      if (onNavigationComplete) {
        onNavigationComplete();
      }
    }

    // Voice guidance for turn-by-turn
    if (progress.distanceToNextTurn < 50 && progress.distanceToNextTurn > 45) {
      voiceService.current.speak({
        id: `turn_warning_${progress.currentStepIndex}`,
        text: `In 50 meters, ${progress.currentInstruction}`,
        priority: 'normal',
        type: 'direction',
        interruptible: true,
      });
    }
  }, [progress, route, perfectTurns, updateAchievementProgress, onNavigationComplete]);

  /**
   * Cleanup Three.js resources
   */
  useEffect(() => {
    const arObjects = arObjectsRef.current;
    
    return () => {
      // Cancel animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      // Dispose of Three.js objects
      arObjects.forEach((arObject) => {
        arObject.mesh.geometry.dispose();
        if (Array.isArray(arObject.mesh.material)) {
          arObject.mesh.material.forEach(material => material.dispose());
        } else {
          arObject.mesh.material.dispose();
        }
      });
      arObjects.clear();
      
      // Dispose of renderer
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Show permission request if needed
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          Camera permission is required for AR navigation.
        </Text>
        <Text style={styles.permissionSubtext}>
          Please enable camera access in Settings and restart the app.
        </Text>
      </View>
    );
  }

  // Show session status
  if (!session?.isActive) {
    return (
      <View style={styles.container}>
        <Text style={styles.statusText}>Starting AR session...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Camera background */}
      <CameraView style={styles.camera} facing="back">
        {/* AR overlay with Three.js */}
        <GLView
          style={styles.glView}
          onContextCreate={initializeARScene}
        />
        
        {/* AR UI overlays */}
        <View style={styles.arUI}>
          {progress && (
            <View style={styles.instructionPanel}>
              <Text style={styles.instructionText}>
                {progress.currentInstruction}
              </Text>
              {progress.distanceToNextTurn > 0 && (
                <Text style={styles.distanceText}>
                  {Math.round(progress.distanceToNextTurn)}m
                </Text>
              )}
            </View>
          )}
          
          {/* AR tracking quality indicator */}
          <View style={styles.trackingIndicator}>
            <View style={[
              styles.trackingDot,
              { backgroundColor: session.trackingQuality === 'good' ? '#00FF00' : 
                               session.trackingQuality === 'normal' ? '#FFFF00' : 
                               session.trackingQuality === 'limited' ? '#FFA500' : '#FF0000' }
            ]} />
            <Text style={styles.trackingText}>
              AR: {session.trackingQuality}
            </Text>
          </View>
        </View>
      </CameraView>
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
  glView: {
    flex: 1,
  },
  arUI: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  instructionPanel: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  instructionText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  distanceText: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  trackingIndicator: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 8,
    borderRadius: 8,
  },
  trackingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  trackingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  permissionText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    margin: 20,
  },
  permissionSubtext: {
    color: '#CCCCCC',
    fontSize: 14,
    textAlign: 'center',
    margin: 20,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    margin: 20,
  },
});
