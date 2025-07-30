// Advanced AR Enhancement System
// Next-generation augmented reality for indoor navigation

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Animated, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import { useTheme } from '../context/ThemeContext';
import { productionBackend } from '../services/ProductionBackendService';

const { width, height } = Dimensions.get('window');

export interface ARElement {
  id: string;
  type: 'venue' | 'direction' | 'poi' | 'deal' | 'warning';
  position: {
    x: number;
    y: number;
    z: number; // Distance from user
  };
  screenPosition: {
    x: number;
    y: number;
  };
  data: {
    name: string;
    description?: string;
    distance: number;
    bearing: number;
    confidence: number;
  };
  style: {
    color: string;
    size: 'small' | 'medium' | 'large';
    priority: number;
  };
  animation?: {
    type: 'pulse' | 'bounce' | 'fade' | 'slide';
    duration: number;
  };
}

export interface ARNavigationRoute {
  id: string;
  points: {
    x: number;
    y: number;
    floor: number;
    instruction: string;
  }[];
  totalDistance: number;
  estimatedTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface AdvancedARSystemProps {
  userLocation: { latitude: number; longitude: number; floor?: number };
  userHeading: number;
  venues: any[];
  activeRoute?: ARNavigationRoute;
  showDeals?: boolean;
  performanceMode?: 'high' | 'balanced' | 'battery';
}

export const AdvancedARSystem: React.FC<AdvancedARSystemProps> = ({
  userLocation,
  userHeading,
  venues,
  activeRoute,
  showDeals = true,
  performanceMode = 'balanced'
}) => {
  const { theme } = useTheme();
  const [arElements, setArElements] = useState<ARElement[]>([]);
  const [cameraPermission, setCameraPermission] = useState<boolean>(false);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [compassHeading, setCompassHeading] = useState(0);
  const [frameRate, setFrameRate] = useState(30);
  
  // Animation references
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    initializeAR();
    startAnimations();
  }, []);

  useEffect(() => {
    updateARElements();
  }, [userLocation, userHeading, venues, activeRoute]);

  useEffect(() => {
    adjustPerformanceSettings();
  }, [performanceMode]);

  const initializeAR = async () => {
    try {
      // Request camera permissions
      const { status } = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(status === 'granted');

      // Initialize compass and location services
      await Location.requestForegroundPermissionsAsync();
      
      // Start compass tracking
      Location.watchHeadingAsync((heading) => {
        setCompassHeading(heading.trueHeading || heading.magHeading);
      });

      console.log('✅ Advanced AR System initialized');
    } catch (error) {
      console.error('AR initialization failed:', error);
    }
  };

  const adjustPerformanceSettings = () => {
    switch (performanceMode) {
      case 'high':
        setFrameRate(60);
        break;
      case 'balanced':
        setFrameRate(30);
        break;
      case 'battery':
        setFrameRate(15);
        break;
    }
  };

  const updateARElements = () => {
    const elements: ARElement[] = [];
    const maxElements = performanceMode === 'battery' ? 5 : performanceMode === 'balanced' ? 10 : 15;
    const fieldOfView = 120; // degrees

    // Process venues for AR display
    venues.slice(0, maxElements).forEach((venue, index) => {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        venue.coordinates.latitude,
        venue.coordinates.longitude
      );

      // Only show venues within reasonable distance
      if (distance > 500) return; // 500 meters max

      const bearing = calculateBearing(
        userLocation.latitude,
        userLocation.longitude,
        venue.coordinates.latitude,
        venue.coordinates.longitude
      );

      const relativeBearing = (bearing - userHeading + 360) % 360;
      
      // Only show venues within field of view
      if (relativeBearing > fieldOfView / 2 && relativeBearing < 360 - fieldOfView / 2) return;

      const screenPosition = calculateScreenPosition(relativeBearing, distance, fieldOfView);

      elements.push({
        id: `venue_${venue.id}`,
        type: 'venue',
        position: { x: venue.coordinates.latitude, y: venue.coordinates.longitude, z: distance },
        screenPosition,
        data: {
          name: venue.name,
          description: venue.type,
          distance,
          bearing: relativeBearing,
          confidence: 0.95
        },
        style: {
          color: theme.primary,
          size: distance < 50 ? 'large' : distance < 150 ? 'medium' : 'small',
          priority: distance < 100 ? 3 : 2
        },
        animation: {
          type: 'pulse',
          duration: 2000
        }
      });
    });

    // Add route arrows if active route exists
    if (activeRoute) {
      const routeElements = generateRouteElements(activeRoute);
      elements.push(...routeElements);
    }

    // Add deal notifications if enabled
    if (showDeals) {
      const dealElements = generateDealElements();
      elements.push(...dealElements);
    }

    // Sort by priority and distance
    elements.sort((a, b) => {
      if (a.style.priority !== b.style.priority) {
        return b.style.priority - a.style.priority;
      }
      return a.data.distance - b.data.distance;
    });

    setArElements(elements);
  };

  const generateRouteElements = (route: ARNavigationRoute): ARElement[] => {
    const elements: ARElement[] = [];
    
    // Generate arrow elements for route guidance
    route.points.slice(0, 3).forEach((point, index) => {
      const bearing = calculateBearing(
        userLocation.latitude,
        userLocation.longitude,
        point.x,
        point.y
      );

      const relativeBearing = (bearing - userHeading + 360) % 360;
      const distance = calculateDistance(userLocation.latitude, userLocation.longitude, point.x, point.y);
      
      if (distance < 200) { // Only show nearby route points
        const screenPosition = calculateScreenPosition(relativeBearing, distance, 120);
        
        elements.push({
          id: `route_${index}`,
          type: 'direction',
          position: { x: point.x, y: point.y, z: distance },
          screenPosition,
          data: {
            name: `Step ${index + 1}`,
            description: point.instruction,
            distance,
            bearing: relativeBearing,
            confidence: 0.98
          },
          style: {
            color: '#00FF00', // Green for route
            size: 'large',
            priority: 5 // Highest priority
          },
          animation: {
            type: 'bounce',
            duration: 1500
          }
        });
      }
    });

    return elements;
  };

  const generateDealElements = (): ARElement[] => {
    // Mock deal notifications near user
    const mockDeals = [
      {
        id: 'deal_1',
        name: '50% off Coffee',
        venue: 'Starbucks',
        coordinates: { latitude: userLocation.latitude + 0.001, longitude: userLocation.longitude + 0.001 }
      }
    ];

    return mockDeals.map(deal => {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        deal.coordinates.latitude,
        deal.coordinates.longitude
      );

      const bearing = calculateBearing(
        userLocation.latitude,
        userLocation.longitude,
        deal.coordinates.latitude,
        deal.coordinates.longitude
      );

      const relativeBearing = (bearing - userHeading + 360) % 360;
      const screenPosition = calculateScreenPosition(relativeBearing, distance, 120);

      return {
        id: deal.id,
        type: 'deal' as const,
        position: { x: deal.coordinates.latitude, y: deal.coordinates.longitude, z: distance },
        screenPosition,
        data: {
          name: deal.name,
          description: `at ${deal.venue}`,
          distance,
          bearing: relativeBearing,
          confidence: 0.9
        },
        style: {
          color: '#FFD700', // Gold for deals
          size: 'medium' as const,
          priority: 4
        },
        animation: {
          type: 'pulse' as const,
          duration: 3000
        }
      };
    });
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const calculateBearing = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const lat1Rad = lat1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;
    
    const y = Math.sin(dLon) * Math.cos(lat2Rad);
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - 
              Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
    
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  };

  const calculateScreenPosition = (relativeBearing: number, distance: number, fieldOfView: number) => {
    // Convert bearing to screen X position
    const normalizedBearing = relativeBearing > 180 ? relativeBearing - 360 : relativeBearing;
    const x = (normalizedBearing / (fieldOfView / 2)) * (width / 2) + (width / 2);
    
    // Calculate Y position based on distance (closer = lower on screen)
    const maxDistance = 200; // meters
    const normalizedDistance = Math.min(distance / maxDistance, 1);
    const y = height * 0.3 + (normalizedDistance * height * 0.4);
    
    return { x: Math.max(0, Math.min(width, x)), y: Math.max(0, Math.min(height, y)) };
  };

  const startAnimations = () => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Fade in animation
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const renderARElement = (element: ARElement, index: number) => {
    const getAnimationStyle = () => {
      switch (element.animation?.type) {
        case 'pulse':
          return { transform: [{ scale: pulseAnimation }] };
        case 'fade':
          return { opacity: fadeAnimation };
        default:
          return {};
      }
    };

    const getSizeStyle = () => {
      switch (element.style.size) {
        case 'small':
          return { width: 60, height: 40 };
        case 'medium':
          return { width: 80, height: 50 };
        case 'large':
          return { width: 100, height: 60 };
      }
    };

    return (
      <Animated.View
        key={element.id}
        style={[
          {
            position: 'absolute',
            left: element.screenPosition.x - getSizeStyle().width / 2,
            top: element.screenPosition.y - getSizeStyle().height / 2,
            backgroundColor: 'rgba(0,0,0,0.8)',
            borderRadius: 10,
            padding: 8,
            alignItems: 'center',
            borderWidth: 2,
            borderColor: element.style.color,
            ...getSizeStyle(),
          },
          getAnimationStyle(),
        ]}
      >
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 10, textAlign: 'center' }}>
          {element.data.name}
        </Text>
        <Text style={{ color: 'white', fontSize: 8, textAlign: 'center' }}>
          {element.data.distance.toFixed(0)}m
        </Text>
        
        {/* Direction indicator */}
        <View
          style={{
            position: 'absolute',
            bottom: -8,
            left: '50%',
            marginLeft: -4,
            width: 8,
            height: 8,
            backgroundColor: element.style.color,
            borderRadius: 4,
          }}
        />
      </Animated.View>
    );
  };

  if (!cameraPermission) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <Text style={{ color: theme.text, fontSize: 18, textAlign: 'center' }}>
          Camera permission is required for AR navigation.
        </Text>
        <Text style={{ color: theme.textSecondary, fontSize: 14, textAlign: 'center', marginTop: 10 }}>
          Please enable camera access in your device settings.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Camera View */}
      <Camera
        style={{ flex: 1 }}
        type={Camera.Constants.Type.back}
        ratio="16:9"
      />
      
      {/* AR Overlay */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        {arElements.map(renderARElement)}
      </View>

      {/* Compass and Status */}
      <View
        style={{
          position: 'absolute',
          top: 50,
          right: 20,
          backgroundColor: 'rgba(0,0,0,0.7)',
          borderRadius: 10,
          padding: 10,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
          {Math.round(compassHeading)}°
        </Text>
        <Text style={{ color: 'white', fontSize: 10 }}>
          {arElements.length} objects
        </Text>
        <Text style={{ color: 'white', fontSize: 10 }}>
          {frameRate}fps
        </Text>
      </View>

      {/* Performance indicator */}
      <View
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          backgroundColor: 'rgba(0,0,0,0.7)',
          borderRadius: 8,
          padding: 8,
        }}
      >
        <Text style={{ color: 'white', fontSize: 12 }}>
          {performanceMode.toUpperCase()} MODE
        </Text>
      </View>
    </View>
  );
};

export default AdvancedARSystem;
