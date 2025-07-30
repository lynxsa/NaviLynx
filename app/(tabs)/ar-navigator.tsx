/**
 * Enhanced AR Navigator Screen - Complete User Flow Implementation
 * Following structured flow: Location Entry → Venue Selection → Routing → Indoor Navigation
 * Enhanced with Phase 1 Day 4-5 performance optimizations and advanced features
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  Platform,
  Modal,
  ScrollView,
  TextInput,
  Image,
  Dimensions,
} from 'react-native';
import MapView, { Marker, Polyline, Region } from 'react-native-maps';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import ARCameraView from '../../components/ar/CameraFeed/ARCameraView';
import ARNavigationOverlay from '../../components/ar/Overlays/ARNavigationOverlay';
import ARNavigationScreen from '../../components/ar/ARNavigationScreen';
import ARPerformanceMonitor from '../../components/ar/ARPerformanceMonitor';

// Enhanced AR imports
import ARPerformanceManager from '../../services/ARPerformanceManager';
import ARUserExperienceService from '../../services/ARUserExperienceService';

// Internal imports
import { useTheme } from '../../context/ThemeContext';
import { IconSymbol } from '../../components/ui/IconSymbol';
import { colors, spacing, borderRadius } from '../../styles/modernTheme';
import { LocationService } from '../../services/LocationService';
import { NavigationService } from '../../services/NavigationService';
import { southAfricanVenues, Venue } from '../../data/southAfricanVenues';
import { getAllEnhancedVenues } from '../../data/enhancedVenues';

// Type definitions
interface VenueWithDistance extends Venue {
  distance: number;
  distanceText?: string;
  internalAreas?: InternalArea[];
  arSupported?: boolean;
}

interface InternalArea {
  id: string;
  name: string;
  coordinates: { x: number; y: number; floor: number };
  type: 'entrance' | 'checkpoint' | 'destination' | 'amenity';
  venueId: string;
  location?: any;
  beaconId?: string;
  realWorldCoordinates?: { latitude: number; longitude: number };
  category?: string;
  estimatedWalkTime?: number;
  openingHours?: string;
}


// Enhanced AR imports (inspired by ViroReact and MapBox AR best practices)

// Constants for string comparisons (to avoid ESLint text warnings)
const NAVIGATION_MODES = {
  AR: 'ar' as const,
  MAP: 'map' as const,
};

const VENUE_NAMES = [
  'Sandton City',
  'Canal Walk', 
  'Gateway Theatre',
  'V&A Waterfront'
] as const;

// Internal areas mapping for venues
const INTERNAL_AREAS_MAP: Record<string, InternalArea[]> = {
  'sandton-city': [
    {
      id: 'sc-entrance-1',
      name: 'Main Entrance',
      coordinates: { x: 0, y: 0, floor: 0 },
      type: 'entrance',
      venueId: 'sandton-city',
      category: 'entrance',
      estimatedWalkTime: 0
    },
    {
      id: 'sc-food-court',
      name: 'Food Court',
      coordinates: { x: 100, y: 50, floor: 1 },
      type: 'destination',
      venueId: 'sandton-city',
      category: 'dining',
      estimatedWalkTime: 5
    }
  ],
  'canal-walk': [
    {
      id: 'cw-entrance-1',
      name: 'West Entrance',
      coordinates: { x: 0, y: 0, floor: 0 },
      type: 'entrance',
      venueId: 'canal-walk',
      category: 'entrance',
      estimatedWalkTime: 0
    }
  ],
  'gateway-theatre': [
    {
      id: 'gt-entrance-1',
      name: 'Main Entrance',
      coordinates: { x: 0, y: 0, floor: 0 },
      type: 'entrance',
      venueId: 'gateway-theatre',
      category: 'entrance',
      estimatedWalkTime: 0
    }
  ],
  'va-waterfront': [
    {
      id: 'va-entrance-1',
      name: 'Clock Tower Entrance',
      coordinates: { x: 0, y: 0, floor: 0 },
      type: 'entrance',
      venueId: 'va-waterfront',
      category: 'entrance',
      estimatedWalkTime: 0
    }
  ]
};

// Enhanced Types for structured flow
interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: string;
  timestamp: number;
  isConfirmed?: boolean;
}

type NavigationMode = 'map' | 'ar';
type NavigationPhase = 
  | 'location_entry'      // Step 1: Get user location
  | 'location_confirmation' // Step 1.5: Confirm detected location
  | 'venue_selection'     // Step 2: Select destination venue
  | 'internal_area_selection' // Step 2.5: Select specific area within venue
  | 'outdoor_navigation'  // Step 3: Route to venue (Google Maps)
  | 'arrival_prompt'      // Step 4: Arrived at venue, offer indoor nav
  | 'indoor_navigation'   // Step 5: Indoor routing with BLE simulation
  | 'destination_reached'; // Final: User reached destination

// Mock BLE data for indoor navigation
interface MockBLEBeacon {
  id: string;
  name: string;
  coordinates: { x: number; y: number; floor: number };
  type: 'entrance' | 'checkpoint' | 'destination' | 'amenity';
  venueId: string;
}

interface IndoorRoute {
  beacons: MockBLEBeacon[];
  pathSteps: string[];
  estimatedTime: number;
  floor: number;
}

// Mock BLE data for popular SA venues
const mockBLEData: Record<string, MockBLEBeacon[]> = {
  'sandton-city': [
    { id: 'sc-entrance-1', name: 'Main Entrance', coordinates: { x: 0, y: 0, floor: 1 }, type: 'entrance', venueId: 'sandton-city' },
    { id: 'sc-checkpoint-1', name: 'Food Court', coordinates: { x: 50, y: 30, floor: 1 }, type: 'checkpoint', venueId: 'sandton-city' },
    { id: 'sc-checkpoint-2', name: 'Woolworths', coordinates: { x: 80, y: 45, floor: 1 }, type: 'destination', venueId: 'sandton-city' },
    { id: 'sc-checkpoint-3', name: 'H&M', coordinates: { x: 60, y: 65, floor: 1 }, type: 'destination', venueId: 'sandton-city' },
    { id: 'sc-checkpoint-4', name: 'Game Store', coordinates: { x: 40, y: 80, floor: 1 }, type: 'destination', venueId: 'sandton-city' },
    { id: 'sc-amenity-1', name: 'Restrooms', coordinates: { x: 60, y: 20, floor: 1 }, type: 'amenity', venueId: 'sandton-city' },
    { id: 'sc-amenity-2', name: 'ATM Area', coordinates: { x: 30, y: 40, floor: 1 }, type: 'amenity', venueId: 'sandton-city' },
  ],
  'canal-walk': [
    { id: 'cw-entrance-1', name: 'Canal Entrance', coordinates: { x: 0, y: 0, floor: 1 }, type: 'entrance', venueId: 'canal-walk' },
    { id: 'cw-checkpoint-1', name: 'Bridge Area', coordinates: { x: 40, y: 25, floor: 1 }, type: 'checkpoint', venueId: 'canal-walk' },
    { id: 'cw-checkpoint-2', name: 'Pick n Pay', coordinates: { x: 70, y: 40, floor: 1 }, type: 'destination', venueId: 'canal-walk' },
    { id: 'cw-checkpoint-3', name: 'Kauai', coordinates: { x: 45, y: 60, floor: 1 }, type: 'destination', venueId: 'canal-walk' },
  ],
  'gateway-theatre': [
    { id: 'gt-entrance-1', name: 'Main Entrance', coordinates: { x: 0, y: 0, floor: 1 }, type: 'entrance', venueId: 'gateway-theatre' },
    { id: 'gt-checkpoint-1', name: 'Game Store', coordinates: { x: 45, y: 35, floor: 1 }, type: 'destination', venueId: 'gateway-theatre' },
    { id: 'gt-checkpoint-2', name: 'Nandos', coordinates: { x: 60, y: 50, floor: 1 }, type: 'destination', venueId: 'gateway-theatre' },
    { id: 'gt-amenity-1', name: 'ATM Area', coordinates: { x: 30, y: 15, floor: 1 }, type: 'amenity', venueId: 'gateway-theatre' },
  ],
};

export default function ARNavigatorEnhanced() {
  const { isDark } = useTheme();
  const router = useRouter();
  
  // Enhanced AR Services
  const performanceManager = useRef(ARPerformanceManager.getInstance());
  const userExperienceService = useRef(ARUserExperienceService.getInstance());
  
  // Core State
  const [phase, setPhase] = useState<NavigationPhase>('location_entry');
  const [mode, setMode] = useState<NavigationMode>('map');
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [selectedVenue, setSelectedVenue] = useState<VenueWithDistance | null>(null);
  const [selectedInternalArea, setSelectedInternalArea] = useState<InternalArea | null>(null);
  const [nearbyVenues, setNearbyVenues] = useState<VenueWithDistance[]>([]);
  
  // Navigation State
  const [currentRoute, setCurrentRoute] = useState<any>(null);
  const [indoorRoute, setIndoorRoute] = useState<IndoorRoute | null>(null);
  
  // Enhanced AR Navigation State
  const [currentDirection, setCurrentDirection] = useState<'straight' | 'left' | 'right' | 'u-turn'>('straight');
  const [nextTurnDistance, setNextTurnDistance] = useState<number>(25);
  const [currentInstruction, setCurrentInstruction] = useState<string>('Continue Straight');
  const [navigationProgress, setNavigationProgress] = useState<number>(65);
  const [remainingDistance, setRemainingDistance] = useState<string>('650m');
  const [estimatedArrival, setEstimatedArrival] = useState<string>('3 min');
  const [currentWaypoint, setCurrentWaypoint] = useState<number>(4);
  const [totalWaypoints] = useState<number>(7);
  
  // Performance Metrics State
  const [performanceMetrics, setPerformanceMetrics] = useState({
    frameRate: 0,
    memoryUsage: 0,
    batteryOptimized: false
  });
  
  // UI State
  const [showLocationEntry, setShowLocationEntry] = useState(true);
  const [showLocationConfirmation, setShowLocationConfirmation] = useState(false);
  const [showVenueModal, setShowVenueModal] = useState(false);
  const [showInternalAreaModal, setShowInternalAreaModal] = useState(false);
  const [showIndoorPrompt, setShowIndoorPrompt] = useState(false);
  const [manualLocationText, setManualLocationText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Refs
  const mapRef = useRef<MapView>(null);
  const locationService = useRef(LocationService.getInstance());
  const navigationService = useRef(NavigationService.getInstance());
  
  // TODO: Enhanced AR State (inspired by ViroReact and MapBox AR patterns)
  // Will be implemented in next iteration
  // const enhancedARService = useRef(EnhancedARService.getInstance());
  // const [arAnchors, setARAnchors] = useState<ARFAnchor[]>([]);
  // const [bleBeacons, setBLEBeacons] = useState<EnhancedBLEBeacon[]>([]);
  // const [arSessionActive, setARSessionActive] = useState(false);
  // const [arTrackingQuality, setARTrackingQuality] = useState<'none' | 'limited' | 'normal' | 'high'>('none');
  
  // Helper constants for phase comparisons
  // Map region state
  const [mapRegion, setMapRegion] = useState<Region>({
    latitude: -26.2041, // Johannesburg default
    longitude: 28.0473,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Helper function to calculate distance between two coordinates
  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  }, []);

  // Load all venues for manual selection
  const loadAllVenues = useCallback(() => {
    try {
      console.log('Loading all enhanced venues...');
      
      // Get all enhanced venues and convert to VenueWithDistance format
      const allVenues = getAllEnhancedVenues();
      const venuesWithDistance: VenueWithDistance[] = allVenues.map((venue) => ({
        id: venue.id,
        name: venue.name,
        type: venue.type as any, // Cast to resolve type mismatch
        description: venue.description,
        shortDescription: venue.shortDescription,
        image: venue.images?.[0] || '', // Use first image or empty string
        location: venue.location,
        openingHours: typeof venue.openingHours === 'string' 
          ? venue.openingHours 
          : venue.openingHours?.monday || '09:00 - 21:00', // Convert object to string format
        features: venue.features || [],
        rating: venue.rating || 0,
        contact: venue.contact,
        distance: userLocation && venue.location?.coordinates ? calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          venue.location.coordinates.latitude,
          venue.location.coordinates.longitude
        ) : 0
      })).sort((a, b) => a.distance - b.distance);
      
      console.log('🏢 Loaded all venues:', venuesWithDistance.length);
      setNearbyVenues(venuesWithDistance);
    } catch (error) {
      console.error('Failed to load all venues:', error);
      Alert.alert('Error', 'Failed to load venues. Please try again.');
    }
  }, [userLocation, calculateDistance]);

  // Mock reverse geocoding function
  const reverseGeocode = useCallback(async (lat: number, lon: number): Promise<string> => {
    // In real implementation, use Google Maps Geocoding API
    // For now, return location-based addresses for SA
    if (lat >= -26.2 && lat <= -26.0 && lon >= 28.0 && lon <= 28.1) {
      return 'Johannesburg, Gauteng';
    } else if (lat >= -34.0 && lat <= -33.8 && lon >= 18.3 && lon <= 18.5) {
      return 'Cape Town, Western Cape';
    } else if (lat >= -29.9 && lat <= -29.7 && lon >= 30.9 && lon <= 31.1) {
      return 'Durban, KwaZulu-Natal';
    } else if (lat >= -25.8 && lat <= -25.6 && lon >= 28.1 && lon <= 28.3) {
      return 'Pretoria, Gauteng';
    }
    return 'South Africa';
  }, []);

  // AI-Powered Location Analysis Algorithm
  const analyzeUserLocation = useCallback(async (userLoc: UserLocation) => {
    try {
      // Initialize venue navigation service if not already done
      await navigationService.current.initialize();
      const venues = await navigationService.current.getEnhancedVenues(50); // 50km radius
      
      let isAtVenue = false;
      let detectedVenue: VenueWithDistance | null = null;
      let address = 'Current Location';
      
      // Check if user is within 500m of any known venue
      for (const venue of venues) {
        if (venue.location?.coordinates) {
          const distance = calculateDistance(
            userLoc.latitude,
            userLoc.longitude,
            venue.location.coordinates.latitude,
            venue.location.coordinates.longitude
          );
          
          if (distance <= 0.5) { // Within 500 meters
            isAtVenue = true;
            detectedVenue = venue;
            address = `Near ${venue.name}`;
            break;
          }
        }
      }
      
      // Use reverse geocoding for more accurate address (mock implementation)
      if (!isAtVenue) {
        address = await reverseGeocode(userLoc.latitude, userLoc.longitude);
      }
      
      return {
        isAtVenue,
        detectedVenue,
        address,
        confidence: isAtVenue ? 0.95 : 0.8,
      };
    } catch (error) {
      console.error('Location analysis error:', error);
      return {
        isAtVenue: false,
        detectedVenue: null,
        address: 'Current Location',
        confidence: 0.5,
      };
    }
  }, [calculateDistance, reverseGeocode]);

  // Enhanced initialization with performance monitoring
  useEffect(() => {
    const initializeARServices = async () => {
      try {
        // Initialize performance monitoring
        performanceManager.current.optimizeForPerformance();
        
        // Setup UX service accessibility settings
        const accessibilitySettings = userExperienceService.current.getAccessibilitySettings();
        console.log('AR UX: Initialized with settings:', accessibilitySettings);
        
        // Start performance metrics monitoring
        const metricsInterval = setInterval(() => {
          const metrics = performanceManager.current.getMetrics();
          setPerformanceMetrics({
            frameRate: metrics.frameRate,
            memoryUsage: metrics.memoryUsage,
            batteryOptimized: metrics.frameRate < 45 // Enable battery optimization if FPS drops
          });
          
          // Auto-optimize for battery if performance is poor
          if (metrics.frameRate < 30 && !performanceMetrics.batteryOptimized) {
            performanceManager.current.optimizeForBattery();
            userExperienceService.current.announceWarning('Battery optimization enabled for better performance');
          }
        }, 5000); // Check every 5 seconds
        
        return () => clearInterval(metricsInterval);
      } catch (error) {
        console.warn('AR Services initialization failed:', error);
      }
    };
    
    initializeARServices();
  }, [performanceMetrics.batteryOptimized]);

  // Enhanced navigation announcements
  const announceNavigationUpdate = useCallback(async (instruction: string, distance: number) => {
    await userExperienceService.current.announceNavigationStep(
      instruction, 
      distance, 
      selectedVenue?.name
    );
  }, [selectedVenue]);

  // Enhanced destination reached announcement
  const announceDestinationReached = useCallback(async () => {
    if (selectedInternalArea) {
      await userExperienceService.current.announceDestinationReached(selectedInternalArea.name);
    } else if (selectedVenue) {
      await userExperienceService.current.announceDestinationReached(selectedVenue.name);
    }
  }, [selectedVenue, selectedInternalArea]);

  // Open Google Maps to search for malls near the location
  const openGoogleMapsSearch = useCallback((address: string) => {
    const searchQuery = `malls near ${address}, South Africa`;
    const googleMapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;
    
    Alert.alert(
      'Opening Google Maps',
      'This will open Google Maps in your browser to find nearby malls.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Open Google Maps', 
          onPress: () => {
            // In a real app, use Linking.openURL(googleMapsUrl)
            console.log('Opening Google Maps:', googleMapsUrl);
            Alert.alert('Demo Mode', `Would open: ${googleMapsUrl}`);
          }
        }
      ]
    );
  }, []);

  // STEP 1: Enhanced Location Entry Methods with AI-Powered Detection
  const requestLocationPermission = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const location = await locationService.current.requestUserLocation();
      
      if (location) {
        const userLoc: UserLocation = {
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: location.accuracy,
          timestamp: Date.now(),
          isConfirmed: false,
        };
        
        // Enhanced AI-powered location analysis
        const locationAnalysis = await analyzeUserLocation(userLoc);
        
        setUserLocation({ ...userLoc, address: locationAnalysis.address });
        setShowLocationEntry(false);
        
        // Smart flow based on location analysis
        if (locationAnalysis.isAtVenue) {
          // User is already at a venue - show venue confirmation
          setShowLocationConfirmation(true);
          setPhase('location_confirmation');
          
          // Pre-select the detected venue
          const detectedVenue = locationAnalysis.detectedVenue;
          if (detectedVenue) {
            setSelectedVenue(detectedVenue);
            // Auto-proceed to internal area selection after confirmation
            setTimeout(() => {
              setShowLocationConfirmation(false);
              setPhase('internal_area_selection');
              setShowInternalAreaModal(true);
            }, 2000);
          }
        } else {
          // User is at home or other location - show venue selection
          setShowLocationConfirmation(true);
          setPhase('location_confirmation');
        }
        
        // Update map to user location
        setMapRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } else {
        throw new Error('Unable to get location');
      }
    } catch (err) {
      console.error('Location request error:', err);
      Alert.alert(
        'Location Error',
        'Unable to access your location. Please enter your address manually or check your location permissions.',
        [{ text: 'OK', onPress: () => setShowLocationEntry(true) }]
      );
    } finally {
      setIsLoading(false);
    }
  }, [analyzeUserLocation]);

  // Enhanced manual location processing
  const processManualLocation = useCallback(async (locationText: string) => {
    const location = locationText.toLowerCase();
    
    // Use available venues directly
    const venues = southAfricanVenues;
    
    // Check if user entered a known mall name
    const knownMall = venues.find((venue: Venue) => 
      venue.name.toLowerCase().includes(location) ||
      location.includes(venue.name.toLowerCase()) ||
      (venue.type === 'mall' && location.includes('mall') && 
       (location.includes('sandton') && venue.name.includes('Sandton') ||
        location.includes('canal') && venue.name.includes('Canal') ||
        location.includes('gateway') && venue.name.includes('Gateway') ||
        location.includes('waterfront') && venue.name.includes('Waterfront')))
    );
    
    if (knownMall) {
      return {
        isKnownMall: true,
        detectedVenue: knownMall,
        coordinates: knownMall.location.coordinates,
        address: knownMall.name,
        nearbyVenues: [knownMall],
      };
    }
    
    // Process regular address with enhanced South African location detection
    let mockCoords = { latitude: -26.2041, longitude: 28.0473 }; // Default JHB
    let processedAddress = locationText;
    
    if (location.includes('sandton')) {
      mockCoords = { latitude: -26.1076, longitude: 28.0567 };
      processedAddress = 'Sandton, Johannesburg';
    } else if (location.includes('cape town') || location.includes('waterfront') || location.includes('v&a')) {
      mockCoords = { latitude: -33.9249, longitude: 18.4241 };
      processedAddress = 'Cape Town, Western Cape';
    } else if (location.includes('durban') || location.includes('gateway')) {
      mockCoords = { latitude: -29.8587, longitude: 31.0218 };
      processedAddress = 'Durban, KwaZulu-Natal';
    } else if (location.includes('pretoria') || location.includes('tshwane')) {
      mockCoords = { latitude: -25.7461, longitude: 28.1881 };
      processedAddress = 'Pretoria, Gauteng';
    } else if (location.includes('centurion')) {
      mockCoords = { latitude: -25.8615, longitude: 28.1871 };
      processedAddress = 'Centurion, Gauteng';
    } else if (location.includes('rosebank')) {
      mockCoords = { latitude: -26.1434, longitude: 28.0436 };
      processedAddress = 'Rosebank, Johannesburg';
    }
    
    // Find nearby venues within 10km
    const nearbyVenues = venues.filter((venue: Venue) => {
      if (!venue.location?.coordinates) return false;
      const distance = calculateDistance(
        mockCoords.latitude,
        mockCoords.longitude,
        venue.location.coordinates.latitude,
        venue.location.coordinates.longitude
      );
      return distance <= 10; // Within 10km
    });
    
    return {
      isKnownMall: false,
      detectedVenue: null,
      coordinates: mockCoords,
      address: processedAddress,
      nearbyVenues,
    };
  }, [calculateDistance]);

  // Enhanced indoor navigation with shopping integration
  const handleIndoorNavigation = useCallback(async (internalArea: InternalArea) => {
    try {
      if (!selectedVenue || !internalArea) {
        console.error('Missing venue or internal area data');
        return;
      }

      setIsLoading(true);
      
      // Get shopping integration data for contextual assistance
      const shoppingData = await userExperienceService.current.getShoppingIntegrationData(selectedVenue.id);
      
      // Check for nearby deals at this destination
      if (shoppingData.nearbyDeals.length > 0) {
        const nearbyDeal = shoppingData.nearbyDeals[0];
        await userExperienceService.current.announceNearbyDeal(
          nearbyDeal.title || 'Special offer',
          nearbyDeal.discount || '20%',
          selectedVenue.name
        );
      }
      
      // Check shopping list items
      if (shoppingData.shoppingList.length > 0) {
        const relevantItems = shoppingData.shoppingList.filter((item: any) => 
          item.location?.toLowerCase().includes(internalArea.name.toLowerCase())
        );
        
        if (relevantItems.length > 0) {
          await userExperienceService.current.announceShoppingListItem(
            relevantItems[0].name || 'Shopping list item',
            true
          );
        }
      }

      // Simulate BLE beacon-based indoor navigation
      const beacons = mockBLEData[selectedVenue.id] || [];
      const destination = beacons.find(beacon => beacon.id === internalArea.id);
      
      if (!destination) {
        Alert.alert('Navigation Error', 'Unable to find indoor route to this destination.');
        return;
      }

      // Calculate indoor route using mock BLE trilateration
      const entrance = beacons.find(beacon => beacon.type === 'entrance');
      if (!entrance) {
        Alert.alert('Navigation Error', 'Unable to find venue entrance.');
        return;
      }

      // Create route with intermediate checkpoints
      const routeBeacons = [entrance];
      const intermediateBeacons = beacons.filter(beacon => 
        beacon.type === 'checkpoint' && 
        Math.abs(beacon.coordinates.x - destination.coordinates.x) < 50 &&
        Math.abs(beacon.coordinates.y - destination.coordinates.y) < 50
      );
      
      routeBeacons.push(...intermediateBeacons);
      routeBeacons.push(destination);

      // Generate step-by-step instructions
      const pathSteps = routeBeacons.map((beacon, index) => {
        if (index === 0) return `Start at ${beacon.name}`;
        if (index === routeBeacons.length - 1) return `Arrive at ${beacon.name}`;
        return `Pass ${beacon.name}`;
      });

      const mockRoute: IndoorRoute = {
        beacons: routeBeacons,
        pathSteps,
        estimatedTime: routeBeacons.length * 2, // 2 minutes per checkpoint
        floor: destination.coordinates.floor,
      };

      setIndoorRoute(mockRoute);
      setPhase('indoor_navigation');
      setShowInternalAreaModal(false);
      setShowIndoorPrompt(false);
      setMode('ar'); // Switch to AR for indoor navigation

      // Announce navigation start
      await announceNavigationUpdate(
        `Starting indoor navigation to ${internalArea.name}`,
        mockRoute.estimatedTime
      );

      // Enhanced AR waypoint setup
      console.log('AR Navigation: Setting up enhanced waypoints for indoor navigation');
      
    } catch (error) {
      console.error('Indoor navigation error:', error);
      Alert.alert('Navigation Error', 'Failed to start indoor navigation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedVenue, userExperienceService, announceNavigationUpdate]);

  const handleManualLocationEntry = useCallback(async () => {
    if (!manualLocationText.trim()) {
      Alert.alert('Invalid Input', 'Please enter a valid address, landmark, or mall name.');
      return;
    }

    try {
      setIsLoading(true);
      
      // Enhanced location processing with mall detection
      const locationAnalysis = await processManualLocation(manualLocationText.trim());
      
      if (locationAnalysis.isKnownMall) {
        // User entered a known mall - proceed directly to internal area selection
        const mallVenue = locationAnalysis.detectedVenue;
        if (mallVenue) {
          const userLoc: UserLocation = {
            latitude: mallVenue.location.coordinates.latitude,
            longitude: mallVenue.location.coordinates.longitude,
            address: `At ${mallVenue.name}`,
            timestamp: Date.now(),
            isConfirmed: true,
          };
          
          setUserLocation(userLoc);
          
          // Add distance property to venue
          const venueWithDistance: VenueWithDistance = {
            ...mallVenue,
            distance: 0, // User is at the venue
            distanceText: 'At location',
            internalAreas: INTERNAL_AREAS_MAP[mallVenue.id] || [],
            arSupported: true
          };
          
          setSelectedVenue(venueWithDistance);
          setShowLocationEntry(false);
          setPhase('internal_area_selection');
          setShowInternalAreaModal(true);
          
          setMapRegion({
            latitude: mallVenue.location.coordinates.latitude,
            longitude: mallVenue.location.coordinates.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
          
          return;
        }
      }
      
      // Regular address processing
      const mockCoords = locationAnalysis.coordinates;
      const userLoc: UserLocation = {
        ...mockCoords,
        address: locationAnalysis.address,
        timestamp: Date.now(),
        isConfirmed: false,
      };
      
      setUserLocation(userLoc);
      setShowLocationEntry(false);
      
      // Check if they're near a venue
      if (locationAnalysis.nearbyVenues.length > 0) {
        setShowLocationConfirmation(true);
        setPhase('location_confirmation');
      } else {
        // Not near any venues - offer Google Maps navigation
        Alert.alert(
          'No Nearby Venues',
          'We couldn\'t find any supported venues near this location. Would you like to navigate to a nearby mall using Google Maps?',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Find Malls on Google Maps', 
              onPress: () => openGoogleMapsSearch(locationAnalysis.address)
            },
            {
              text: 'Select Mall Manually',
              onPress: () => {
                setPhase('venue_selection');
                loadAllVenues();
              }
            }
          ]
        );
      }
      
      setMapRegion({
        latitude: mockCoords.latitude,
        longitude: mockCoords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      
    } catch (error) {
      console.error('Manual location entry error:', error);
      Alert.alert('Error', 'Unable to process that location. Please try again with a different address or landmark.');
    } finally {
      setIsLoading(false);
    }
  }, [manualLocationText, processManualLocation, loadAllVenues, openGoogleMapsSearch]);

  // STEP 1.5: Location Confirmation
  const confirmUserLocation = useCallback(async () => {
    if (!userLocation) return;
    
    const confirmedLocation = { ...userLocation, isConfirmed: true };
    setUserLocation(confirmedLocation);
    setShowLocationConfirmation(false);
    setPhase('venue_selection');
    
    // Initialize venue navigation service and get enhanced venues
    try {
      console.log('Loading venues from data...');
      
      // Calculate distances for nearby venues
      const enhancedVenues: VenueWithDistance[] = southAfricanVenues.map((venue: Venue) => ({
        ...venue,
        distance: venue.location?.coordinates ? calculateDistance(
          confirmedLocation.latitude,
          confirmedLocation.longitude,
          venue.location.coordinates.latitude,
          venue.location.coordinates.longitude
        ) : 999
      })).filter((v: VenueWithDistance) => v.distance < 50).sort((a, b) => a.distance - b.distance);
      
      console.log('🏢 Loaded venues:', enhancedVenues.length, enhancedVenues.map((v: VenueWithDistance) => v.name));
      setNearbyVenues(enhancedVenues);
      setShowVenueModal(true);
      console.log('🏢 Venue modal should be visible now');
    } catch (error) {
      console.error('Failed to load venues:', error);
      Alert.alert('Error', 'Failed to load nearby venues. Please try again.');
    }
  }, [userLocation, calculateDistance]);

  const rejectLocationAndRetry = useCallback(() => {
    setUserLocation(null);
    setShowLocationConfirmation(false);
    setShowLocationEntry(true);
    setPhase('location_entry');
  }, []);

  // STEP 2: Venue Selection - Enhanced to redirect to venue landing page
  const handleVenueSelect = useCallback(async (venue: VenueWithDistance) => {
    console.log('🎯 Venue selected:', venue.name);
    console.log('🎯 Redirecting to venue landing page for enhanced user experience');
    setSelectedVenue(venue);
    setShowVenueModal(false);
    
    // Redirect to enhanced venue landing page for better user experience
    // This allows users to see deals, key locations, and choose navigation type
    router.push(`/venue/${venue.id}?from=ar-navigator`);
  }, [router]);

  // STEP 2.5: Enhanced Internal Area Selection with BLE & Google Maps Integration
  const handleInternalAreaSelect = useCallback(async (area: InternalArea) => {
    try {
      console.log('🏁 Internal area selected:', area.name, 'Category:', area.type, 'Floor:', area.location.floor);
      console.log('📡 BLE Beacon ID:', area.beaconId);
      console.log('🌍 Real-world coordinates:', area.realWorldCoordinates);
      
      setIsLoading(true);
      setSelectedInternalArea(area);
      setShowInternalAreaModal(false);
      setPhase('outdoor_navigation');

      if (!userLocation || !selectedVenue?.location?.coordinates) {
        throw new Error('Missing location data');
      }

      // Enhanced target coordinates - use store's real-world coordinates if available, fallback to venue entrance
      const targetCoordinates = area.realWorldCoordinates || selectedVenue.location.coordinates;
      
      console.log('🗺️ Calculating enhanced route from user location to specific store');
      console.log('📍 From:', userLocation.latitude, userLocation.longitude);
      
      if (targetCoordinates && typeof targetCoordinates === 'object' && 'latitude' in targetCoordinates) {
        console.log('📍 To:', targetCoordinates.latitude, targetCoordinates.longitude);
      } else {
        console.log('📍 To: Using venue coordinates');
      }
      console.log('🏪 Store Details:', {
        name: area.name,
        category: area.category,
        floor: area.location.floor,
        estimatedWalkTime: area.estimatedWalkTime,
        openingHours: area.openingHours
      });

      // Calculate route using Google Maps with enhanced routing
      const finalTargetCoordinates = targetCoordinates && typeof targetCoordinates === 'object' && 'latitude' in targetCoordinates 
        ? targetCoordinates 
        : selectedVenue.location.coordinates;
        
      const route = await navigationService.current.calculateAdvancedRoute(
        { latitude: userLocation.latitude, longitude: userLocation.longitude },
        finalTargetCoordinates,
        {
          mode: 'walking',
          avoidTolls: true,
          avoidHighways: true,
          alternatives: true,
          traffic: false,
          // Enhanced routing preferences for indoor navigation
          optimizeWaypoints: true,
          language: 'en',
        }
      );

      setCurrentRoute(route);
      console.log('✅ Enhanced route calculated successfully to store:', area.name);

      // Update map to show full route if available
      if (mapRef.current && route) {
        // Decode polyline and show full route
        const routeCoordinates = route.steps?.map(step => step.coords) || [
          { latitude: userLocation.latitude, longitude: userLocation.longitude },
          selectedVenue.location.coordinates,
        ];
        
        mapRef.current.fitToCoordinates(routeCoordinates, {
          edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
          animated: true,
        });
      }

      // Simulate arrival after 3 seconds (for demo)
      console.log('⏱️ Simulating arrival in 3 seconds...');
      setTimeout(() => {
        console.log('🏁 Simulated arrival - showing indoor prompt');
        setPhase('arrival_prompt');
        setShowIndoorPrompt(true);
      }, 3000);

    } catch (error) {
      console.error('❌ Navigation setup error:', error);
      Alert.alert(
        'Navigation Error', 
        `Failed to calculate route: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        [
          { text: 'Retry', onPress: () => handleInternalAreaSelect(area) },
          { text: 'Go Back', onPress: () => {
            setShowInternalAreaModal(true);
            setPhase('internal_area_selection');
          }}
        ]
      );
    } finally {
      setIsLoading(false);
    }
  }, [userLocation, selectedVenue]);

  const handleSkipInternalAreaSelection = useCallback(() => {
    console.log('⏭️ Skipping internal area selection');
    setShowInternalAreaModal(false);
    // Navigate to venue entrance directly
    const entranceArea: InternalArea = {
      id: 'entrance',
      name: `${selectedVenue?.name || 'Venue'} Main Entrance`,
      coordinates: { x: 0, y: 0, floor: 1 },
      type: 'entrance',
      venueId: selectedVenue?.id || 'unknown',
      category: 'entrance',
      estimatedWalkTime: 30,
    };
    handleInternalAreaSelect(entranceArea);
  }, [selectedVenue, handleInternalAreaSelect]);

  // Navigation Controls
  const resetNavigation = useCallback(() => {
    console.log('🔄 Resetting navigation to initial state');
    try {
      setPhase('location_entry');
      setUserLocation(null);
      setSelectedVenue(null);
      setSelectedInternalArea(null);
      setCurrentRoute(null);
      setIndoorRoute(null);
      setShowLocationEntry(true);
      setShowLocationConfirmation(false);
      setShowVenueModal(false);
      setShowInternalAreaModal(false);
      setShowIndoorPrompt(false);
      setManualLocationText('');
      setIsLoading(false);
      console.log('✅ Navigation reset completed');
    } catch (error) {
      console.error('❌ Error during navigation reset:', error);
      // Force reset even if there's an error
      setTimeout(() => {
        setPhase('location_entry');
        setShowLocationEntry(true);
      }, 100);
    }
  }, []);

  // STEP 4: Indoor Navigation Prompt
  const startIndoorNavigation = useCallback(() => {
    if (!selectedVenue) return;
    
    setShowIndoorPrompt(false);
    setPhase('indoor_navigation');
    
    // Load mock BLE data for the venue
    const venueId = selectedVenue.id;
    const beacons = mockBLEData[venueId] || mockBLEData['sandton-city']; // Fallback
    
    // Generate path steps based on selected internal area
    const destinationName = selectedInternalArea?.name || 'your destination';
    const pathSteps = selectedInternalArea ? [
      'Enter through main entrance',
      `Navigate toward ${destinationName}`,
      selectedInternalArea.location.floor > 1 ? `Take elevator to Floor ${selectedInternalArea.location.floor}` : 'Continue on ground floor',
      `Walk ${selectedInternalArea.estimatedWalkTime || 60} seconds`,
      `Destination reached: ${destinationName}`,
    ] : [
      'Enter through main entrance',
      'Walk straight for 20 meters',
      'Turn left at the food court',
      'Continue for 15 meters',
      'Destination reached',
    ];
    
    const mockIndoorRoute: IndoorRoute = {
      beacons,
      pathSteps,
      estimatedTime: selectedInternalArea?.estimatedWalkTime || 120,
      floor: selectedInternalArea?.location.floor || 1,
    };
    
    setIndoorRoute(mockIndoorRoute);
    
    Alert.alert(
      '🎯 Indoor Navigation Active',
      `AR navigation will guide you to ${destinationName}. Follow the arrows and directions.\n\n🎮 Gamification Features:\n• Earn Explorer Points\n• Unlock Achievement Badges\n• Complete Navigation Challenges\n• Track Your Progress`,
      [{ text: '🚀 Start AR Adventure', onPress: () => {} }]
    );
  }, [selectedVenue, selectedInternalArea]);

  const skipIndoorNavigation = useCallback(() => {
    setShowIndoorPrompt(false);
    setPhase('destination_reached');
    Alert.alert(
      'Navigation Complete',
      `You have arrived at ${selectedVenue?.name}. Enjoy your visit!`,
      [{ text: 'Finish', onPress: () => resetNavigation() }]
    );
  }, [selectedVenue, resetNavigation]);

  const toggleNavigationMode = useCallback(() => {
    setMode(prevMode => prevMode === 'map' ? 'ar' : 'map');
    
    if (mode === 'map') {
      // Switching to AR mode
      Alert.alert(
        '🎯 AR Mode Activated',
        'Point your camera ahead to see AR navigation overlays, waypoints, and gamified guidance!',
        [{ text: 'Start AR Navigation!' }]
      );
    } else {
      // Switching to Map mode
      Alert.alert(
        '🗺️ Map Mode',
        'Viewing navigation in traditional map view.',
        [{ text: 'Continue' }]
      );
    }
  }, [mode]);

  // Enhanced AR Navigation Simulation
  const simulateNavigationUpdates = useCallback(() => {
    if (phase !== 'indoor_navigation') return;

    // Simulate realistic turn-by-turn navigation updates
    const directions: {
      direction: 'straight' | 'left' | 'right' | 'u-turn',
      instruction: string,
      distance: number,
      arrow: string
    }[] = [
      { direction: 'straight', instruction: 'Continue Straight', distance: 25, arrow: '↑' },
      { direction: 'right', instruction: 'Turn Right', distance: 15, arrow: '→' },
      { direction: 'left', instruction: 'Turn Left', distance: 30, arrow: '←' },
      { direction: 'straight', instruction: 'Continue Straight', distance: 20, arrow: '↑' },
      { direction: 'right', instruction: 'Turn Right at Food Court', distance: 12, arrow: '↗' },
      { direction: 'straight', instruction: 'Walk Straight to Destination', distance: 8, arrow: '↑' },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep >= directions.length) {
        clearInterval(interval);
        setPhase('destination_reached');
        return;
      }

      const step = directions[currentStep];
      setCurrentDirection(step.direction);
      setCurrentInstruction(step.instruction);
      setNextTurnDistance(step.distance);
      
      // Update progress
      const progress = ((currentStep + 1) / directions.length) * 100;
      setNavigationProgress(Math.min(progress, 100));
      setCurrentWaypoint(currentStep + 1);
      
      // Update remaining distance and time
      const remainingDist = Math.max(650 - (currentStep * 100), 50);
      setRemainingDistance(`${remainingDist}m`);
      
      const remainingTime = Math.max(180 - (currentStep * 30), 30);
      setEstimatedArrival(`${Math.ceil(remainingTime / 60)} min`);

      currentStep++;
    }, 5000); // Update every 5 seconds for demo

    // Cleanup function
    return () => clearInterval(interval);
  }, [phase]);

  // Start simulation when indoor navigation begins
  React.useEffect(() => {
    if (phase === 'indoor_navigation') {
      const cleanup = simulateNavigationUpdates();
      return cleanup;
    }
  }, [phase, simulateNavigationUpdates]);

  // Get turn arrow based on current direction
  const getTurnArrow = (direction: string) => {
    switch (direction) {
      case 'left': return '←';
      case 'right': return '→';
      case 'u-turn': return '↶';
      case 'straight':
      default: return '↑';
    }
  };

  // Get arrow color based on distance
  const getArrowColor = (distance: number) => {
    if (distance <= 10) return '#FF4444'; // Red for immediate turns
    if (distance <= 25) return '#FFD700'; // Yellow for approaching turns
    return '#00AEEF'; // Blue for far turns
  };

  // Initialize on screen focus
  useFocusEffect(
    useCallback(() => {
      return () => {
        // Cleanup on screen blur
      };
    }, [])
  );

  // Render Methods

  // STEP 1: Enhanced World-Class AR Navigator Landing Page
  const renderLocationEntryModal = () => (
    <Modal visible={showLocationEntry} animationType="slide" transparent={false}>
      <SafeAreaView style={[styles.enhancedModalContainer, { backgroundColor: isDark ? '#0A0A0A' : '#F8F9FA' }]}>
        {/* Enhanced Header with Logo and Back Button */}
        <View style={[styles.worldClassHeader, { 
          backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
          borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
        }]}>
          <TouchableOpacity 
            style={[styles.enhancedBackButton, {
              backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
              borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
            }]} 
            onPress={() => setShowLocationEntry(false)}
            activeOpacity={0.7}
          >
            <IconSymbol name="chevron.left" size={18} color={isDark ? '#FFFFFF' : '#1A1A1A'} />
          </TouchableOpacity>

          {/* App Logo and Title */}
          <View style={styles.logoContainer}>
            <Image 
              source={
                isDark 
                  ? require('@/assets/images/logo-w.png')
                  : require('@/assets/images/logo-p.png')
              }
              style={styles.appLogo}
            />
            <Text style={[styles.appTitle, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
              NaviLynx
            </Text>
          </View>

          <View style={{ width: 44 }} />
        </View>

        <ScrollView 
          style={styles.enhancedModalContent} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContentContainer}
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={[styles.heroIconContainer, {
              backgroundColor: colors.primary + '20',
              borderColor: colors.primary + '30',
            }]}>
              <IconSymbol name="viewfinder.circle.fill" size={64} color={colors.primary} />
              <View style={[styles.heroIconGlow, { backgroundColor: colors.primary + '10' }]} />
            </View>
            
            <Text style={[styles.heroTitle, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>
              AR Navigator
            </Text>
            <Text style={[styles.heroSubtitle, { color: isDark ? '#B0B0B0' : '#6B7280' }]}>
              Experience next-generation indoor navigation with advanced AR technology
            </Text>

            {/* Feature Highlights */}
            <View style={styles.featureHighlights}>
              <View style={styles.featureItem}>
                <IconSymbol name="camera.viewfinder" size={16} color={colors.primary} />
                <Text style={[styles.featureText, { color: isDark ? '#E5E7EB' : '#374151' }]}>
                  AR Navigation
                </Text>
              </View>
              <View style={styles.featureItem}>
                <IconSymbol name="location.north.line.fill" size={16} color={colors.primary} />
                <Text style={[styles.featureText, { color: isDark ? '#E5E7EB' : '#374151' }]}>
                  Smart Routing
                </Text>
              </View>
              <View style={styles.featureItem}>
                <IconSymbol name="map.fill" size={16} color={colors.primary} />
                <Text style={[styles.featureText, { color: isDark ? '#E5E7EB' : '#374151' }]}>
                  Map Fallback
                </Text>
              </View>
            </View>
          </View>

          {/* Navigation Mode Selection */}
          <View style={styles.navigationModeSection}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#F3F4F6' : '#1F2937' }]}>
              Choose Navigation Mode
            </Text>
            
            <View style={styles.modeSelectionContainer}>
              {/* AR Mode Option */}
              <TouchableOpacity 
                style={[
                  styles.modeOption,
                  mode === 'ar' && styles.modeOptionSelected,
                  {
                    backgroundColor: mode === 'ar' 
                      ? colors.primary + '15' 
                      : (isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF'),
                    borderColor: mode === 'ar' 
                      ? colors.primary 
                      : (isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB'),
                  }
                ]}
                onPress={() => setMode('ar')}
                activeOpacity={0.8}
              >
                <View style={[styles.modeIconContainer, {
                  backgroundColor: mode === 'ar' ? colors.primary : (isDark ? 'rgba(255,255,255,0.08)' : '#F3F4F6'),
                }]}>
                  <IconSymbol 
                    name="camera.viewfinder" 
                    size={24} 
                    color={mode === 'ar' ? '#FFFFFF' : colors.primary} 
                  />
                </View>
                <View style={styles.modeTextContainer}>
                  <Text style={[styles.modeTitle, { 
                    color: mode === 'ar' ? colors.primary : (isDark ? '#FFFFFF' : '#1F2937') 
                  }]}>
                    AR Navigation
                  </Text>
                  <Text style={[styles.modeDescription, { 
                    color: isDark ? '#9CA3AF' : '#6B7280' 
                  }]}>
                    Immersive augmented reality experience
                  </Text>
                </View>
                {mode === NAVIGATION_MODES.AR && (
                  <IconSymbol name="checkmark.circle.fill" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>

              {/* Map Mode Option */}
              <TouchableOpacity 
                style={[
                  styles.modeOption,
                  mode === NAVIGATION_MODES.MAP && styles.modeOptionSelected,
                  {
                    backgroundColor: mode === 'map' 
                      ? colors.primary + '15' 
                      : (isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF'),
                    borderColor: mode === 'map' 
                      ? colors.primary 
                      : (isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB'),
                  }
                ]}
                onPress={() => setMode('map')}
                activeOpacity={0.8}
              >
                <View style={[styles.modeIconContainer, {
                  backgroundColor: mode === 'map' ? colors.primary : (isDark ? 'rgba(255,255,255,0.08)' : '#F3F4F6'),
                }]}>
                  <IconSymbol 
                    name="map.fill" 
                    size={24} 
                    color={mode === NAVIGATION_MODES.MAP ? '#FFFFFF' : colors.primary} 
                  />
                </View>
                <View style={styles.modeTextContainer}>
                  <Text style={[styles.modeTitle, { 
                    color: mode === NAVIGATION_MODES.MAP ? colors.primary : (isDark ? '#FFFFFF' : '#1F2937') 
                  }]}>
                    Map Navigation
                  </Text>
                  <Text style={[styles.modeDescription, { 
                    color: isDark ? '#9CA3AF' : '#6B7280' 
                  }]}>
                    Traditional map-based navigation
                  </Text>
                </View>
                {mode === NAVIGATION_MODES.MAP && (
                  <IconSymbol name="checkmark.circle.fill" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Enhanced Location Options */}
          <View style={styles.locationOptionsSection}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#F3F4F6' : '#1F2937' }]}>
              Set Your Location
            </Text>
            
            {/* Primary Smart Detection Option */}
            <TouchableOpacity 
              style={[styles.primaryActionButton, {
                backgroundColor: colors.primary,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 12,
                elevation: 8,
              }]}
              onPress={requestLocationPermission}
              disabled={isLoading}
              activeOpacity={0.9}
            >
              <View style={styles.actionButtonContent}>
                <View style={styles.actionButtonIcon}>
                  <IconSymbol name="location.circle" size={24} color="#FFFFFF" />
                </View>
                <View style={styles.actionButtonText}>
                  <Text style={styles.primaryActionTitle}>
                    {isLoading ? 'Detecting Location...' : 'Smart Location Detection'}
                  </Text>
                  <Text style={styles.primaryActionSubtitle}>
                    AI-powered location intelligence
                  </Text>
                </View>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <IconSymbol name="arrow.right" size={18} color="rgba(255,255,255,0.9)" />
                )}
              </View>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={[styles.dividerLine, { borderColor: isDark ? '#374151' : '#E5E7EB' }]} />
              <Text style={[styles.dividerText, { 
                color: isDark ? '#6B7280' : '#9CA3AF',
                backgroundColor: isDark ? '#0A0A0A' : '#F8F9FA',
              }]}>
                OR
              </Text>
              <View style={[styles.dividerLine, { borderColor: isDark ? '#374151' : '#E5E7EB' }]} />
            </View>

            {/* Manual Entry Section */}
            <View style={styles.manualEntrySection}>
              <Text style={[styles.manualEntryTitle, { color: isDark ? '#E5E7EB' : '#374151' }]}>
                Enter Location Manually
              </Text>
              
              <View style={styles.inputWrapper}>
                <View style={[styles.searchInputContainer, {
                  backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#FFFFFF',
                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#D1D5DB',
                }]}>
                  <IconSymbol 
                    name="magnifyingglass" 
                    size={18} 
                    color={isDark ? 'rgba(255,255,255,0.4)' : '#9CA3AF'} 
                  />
                  <TextInput
                    style={[styles.searchInput, { 
                      color: isDark ? '#FFFFFF' : '#1F2937',
                    }]}
                    placeholder="Search mall, hospital, or any venue..."
                    placeholderTextColor={isDark ? 'rgba(255,255,255,0.4)' : '#9CA3AF'}
                    value={manualLocationText}
                    onChangeText={setManualLocationText}
                    returnKeyType="search"
                    onSubmitEditing={handleManualLocationEntry}
                  />
                  {manualLocationText.length > 0 && (
                    <TouchableOpacity onPress={() => setManualLocationText('')}>
                      <IconSymbol 
                        name="xmark.circle.fill" 
                        size={18} 
                        color={isDark ? 'rgba(255,255,255,0.3)' : '#9CA3AF'} 
                      />
                    </TouchableOpacity>
                  )}
                </View>
                
                <TouchableOpacity 
                  style={[styles.secondaryActionButton, {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F9FAFB',
                    borderColor: isDark ? 'rgba(255,255,255,0.12)' : '#E5E7EB',
                  }]}
                  onPress={handleManualLocationEntry}
                  disabled={!manualLocationText.trim()}
                  activeOpacity={0.8}
                >
                  <IconSymbol 
                    name="arrow.right" 
                    size={20} 
                    color={manualLocationText.trim() ? colors.primary : (isDark ? '#6B7280' : '#9CA3AF')} 
                  />
                  <Text style={[styles.secondaryActionText, { 
                    color: manualLocationText.trim() ? colors.primary : (isDark ? '#6B7280' : '#9CA3AF')
                  }]}>
                    Search Location
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Quick Access Venues */}
          <View style={styles.quickAccessSection}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#F3F4F6' : '#1F2937' }]}>
              Popular Venues
            </Text>
            <Text style={[styles.sectionSubtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              Tap to navigate directly
            </Text>
            
            <View style={styles.popularVenuesGrid}>
              {VENUE_NAMES.map((venue, index) => (
                <TouchableOpacity
                  key={venue}
                  style={[styles.venueQuickAccess, {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
                    borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#E5E7EB',
                  }]}
                  onPress={() => {
                    setManualLocationText(venue);
                    handleManualLocationEntry();
                  }}
                  activeOpacity={0.8}
                >
                  <IconSymbol name="building.2" size={20} color={colors.primary} />
                  <Text style={[styles.venueQuickAccessText, { 
                    color: isDark ? '#E5E7EB' : '#374151' 
                  }]}>
                    {venue}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  // STEP 1.5: Location Confirmation Modal
  const renderLocationConfirmationModal = () => (
    <Modal visible={showLocationConfirmation} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={[styles.confirmationCard, { backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF' }]}>
          <IconSymbol name="checkmark.circle.fill" size={48} color={colors.primary} />
          <Text style={[styles.confirmationTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
            Confirm Your Location
          </Text>
          <Text style={[styles.confirmationText, { color: isDark ? '#CCCCCC' : '#666666' }]}>
            We detected your location as:
          </Text>
          <Text style={[styles.locationText, { color: colors.primary }]}>
            {userLocation?.address || `${userLocation?.latitude.toFixed(4)}, ${userLocation?.longitude.toFixed(4)}`}
          </Text>
          <Text style={[styles.confirmationSubtext, { color: isDark ? '#CCCCCC' : '#666666' }]}>
            Is this correct?
          </Text>
          
          <View style={styles.confirmationButtons}>
            <TouchableOpacity 
              style={[styles.confirmButton, styles.confirmYes]}
              onPress={confirmUserLocation}
            >
              <Text style={styles.confirmYesText}>Yes, Continue</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.confirmButton, styles.confirmNo]}
              onPress={rejectLocationAndRetry}
            >
              <Text style={[styles.confirmNoText, { color: colors.primary }]}>No, Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Enhanced Venue Selection Modal
  const renderVenueSelectionModal = () => (
    <Modal visible={showVenueModal} animationType="slide" transparent={false}>
      <SafeAreaView style={[styles.modalContainer, { backgroundColor: isDark ? '#000000' : '#FFFFFF' }]}>
        <View style={styles.venueModalHeader}>
          <TouchableOpacity onPress={() => setShowVenueModal(false)} style={styles.closeButton}>
            <IconSymbol name="xmark" size={24} color={isDark ? '#FFFFFF' : '#000000'} />
          </TouchableOpacity>
          <Text style={[styles.venueModalTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
            Select Destination
          </Text>
          <Text style={[styles.venueModalSubtitle, { color: isDark ? '#CCCCCC' : '#666666' }]}>
            Closest venues first
          </Text>
        </View>

        <ScrollView style={styles.venueList} showsVerticalScrollIndicator={false}>
          {nearbyVenues.slice(0, 20).map((venue) => (
            <TouchableOpacity
              key={venue.id}
              style={[styles.venueCard, { backgroundColor: isDark ? '#1A1A1A' : '#F8F9FA' }]}
              onPress={() => handleVenueSelect(venue)}
            >
              <View style={styles.venueCardContent}>
                <View style={styles.venueIcon}>
                  <IconSymbol 
                    name={venue.type === 'mall' ? 'building.2.fill' : 
                          venue.type === 'hospital' ? 'cross.fill' :
                          venue.type === 'airport' ? 'airplane' : 'mappin.circle.fill'} 
                    size={24} 
                    color={colors.primary} 
                  />
                </View>
                <View style={styles.venueInfo}>
                  <Text style={[styles.venueName, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                    {venue.name}
                  </Text>
                  <Text style={[styles.venueLocation, { color: isDark ? '#CCCCCC' : '#666666' }]}>
                    {venue.location.city}, {venue.location.province}
                  </Text>
                  <View style={styles.venueDetails}>
                    <Text style={[styles.venueType, { color: colors.primary }]}>
                      {venue.type.charAt(0).toUpperCase() + venue.type.slice(1)} • {venue.distance.toFixed(1)}km
                    </Text>
                    {venue.internalAreas && venue.internalAreas.length > 0 && (
                      <Text style={[styles.venueStores, { color: isDark ? '#AAAAAA' : '#888888' }]}>
                        {venue.internalAreas.length} stores & services{venue.arSupported ? ' • AR Ready' : ''}
                      </Text>
                    )}
                  </View>
                </View>
                <IconSymbol name="chevron.right" size={16} color={isDark ? '#666666' : '#CCCCCC'} />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  // Indoor Navigation Prompt
  const renderIndoorPrompt = () => (
    <Modal visible={showIndoorPrompt} animationType="fade" transparent={true}>
      <View style={styles.overlay}>
        <View style={[styles.indoorPromptCard, { backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF' }]}>
          <IconSymbol name="building.2.fill" size={64} color={colors.primary} />
          <Text style={[styles.indoorPromptTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
            You've Arrived!
          </Text>
          <Text style={[styles.indoorPromptText, { color: isDark ? '#CCCCCC' : '#666666' }]}>
            Would you like to navigate inside {selectedVenue?.name}?
          </Text>
          <Text style={[styles.indoorPromptSubtext, { color: isDark ? '#CCCCCC' : '#666666' }]}>
            We'll use AR to guide you to specific stores and amenities
          </Text>
          
          <View style={styles.indoorPromptButtons}>
            <TouchableOpacity 
              style={[styles.indoorButton, styles.startIndoorButton]}
              onPress={startIndoorNavigation}
            >
              <Text style={styles.startIndoorText}>Start Indoor Navigation</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.indoorButton, styles.skipIndoorButton]}
              onPress={skipIndoorNavigation}
            >
              <Text style={[styles.skipIndoorText, { color: colors.primary }]}>No Thanks</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Main Navigation Interface
  const renderNavigationInterface = () => {
    const isMapMode = mode === 'map';
    const isARMode = mode === 'ar';
    const isOutdoorNavigation = phase === 'outdoor_navigation';
    const isIndoorNavigation = phase === 'indoor_navigation';
    
    return (
      <View style={styles.container}>
        {/* AR Camera View - Show when in AR mode */}
        {isARMode && (isOutdoorNavigation || isIndoorNavigation) && (
          <View style={StyleSheet.absoluteFill}>
            <ARCameraView />
            
            {/* AR Overlays */}
            {selectedVenue && (
              <ARNavigationOverlay 
                venueName={selectedVenue.name}
              />
            )}
            
            {/* Outdoor AR Overlay */}
            {isOutdoorNavigation && currentRoute && (
              <View style={styles.arOverlay}>
                <Text style={styles.arTitle}>🧭 AR Outdoor Navigation</Text>
                <Text style={styles.arSubtitle}>
                  Navigating to: {selectedVenue?.name}
                </Text>
                <Text style={styles.arInstructions}>
                  Distance: {currentRoute.totalDistance || 'Calculating...'}
                </Text>
                <Text style={styles.arInstructions}>
                  ETA: {currentRoute.totalDuration || 'Calculating...'}
                </Text>
                
                {/* Direction Indicator */}
                <View style={styles.directionIndicator}>
                  <Text style={styles.directionArrow}>⬆️</Text>
                  <Text style={styles.directionText}>Continue Straight</Text>
                </View>
              </View>
            )}
            
            {/* Enhanced AR Overlay for indoor navigation */}
            {isIndoorNavigation && indoorRoute && (
              <>
                {/* Primary AR Navigation HUD */}
                <View style={styles.arNavigationHUD}>
                  {/* Turn-by-Turn Arrow Display */}
                  <View style={styles.turnByTurnContainer}>
                    <View style={[styles.primaryDirectionArrow, { 
                      borderColor: getArrowColor(nextTurnDistance),
                      backgroundColor: `rgba(${getArrowColor(nextTurnDistance).slice(1, 3)}, ${getArrowColor(nextTurnDistance).slice(3, 5)}, ${getArrowColor(nextTurnDistance).slice(5, 7)}, 0.2)` 
                    }]}>
                      <Text style={[styles.turnArrowLarge, { 
                        color: getArrowColor(nextTurnDistance),
                        textShadowColor: `rgba(${getArrowColor(nextTurnDistance).slice(1, 3)}, ${getArrowColor(nextTurnDistance).slice(3, 5)}, ${getArrowColor(nextTurnDistance).slice(5, 7)}, 0.5)` 
                      }]}>
                        {getTurnArrow(currentDirection)}
                      </Text>
                      <View style={[styles.arrowGlow, { 
                        backgroundColor: `rgba(${getArrowColor(nextTurnDistance).slice(1, 3)}, ${getArrowColor(nextTurnDistance).slice(3, 5)}, ${getArrowColor(nextTurnDistance).slice(5, 7)}, 0.1)` 
                      }]} />
                    </View>
                    <View style={styles.directionDetails}>
                      <Text style={styles.nextTurnText}>Next Turn</Text>
                      <Text style={styles.directionInstruction}>{currentInstruction}</Text>
                      <Text style={[styles.turnDistance, { color: getArrowColor(nextTurnDistance) }]}>
                        {nextTurnDistance}m ahead
                      </Text>
                    </View>
                  </View>

                  {/* Destination Info Panel */}
                  <View style={styles.destinationPanel}>
                    <View style={styles.destinationHeader}>
                      <Text style={styles.destinationIcon}>🎯</Text>
                      <View style={styles.destinationInfo}>
                        <Text style={styles.destinationName}>{selectedInternalArea?.name || 'Destination'}</Text>
                        <Text style={styles.estimatedTime}>Arriving in {estimatedArrival}</Text>
                      </View>
                    </View>
                    <View style={styles.routeProgress}>
                      <View style={styles.progressTrack}>
                        <View style={[styles.progressIndicator, { width: `${navigationProgress}%` }]} />
                      </View>
                      <Text style={styles.progressLabel}>{remainingDistance} remaining</Text>
                    </View>
                  </View>
                </View>

                {/* Floating AR Waypoints */}
                <View style={styles.arWaypoints}>
                  {/* Next Waypoint - Dynamic positioning based on direction */}
                  <View style={[
                    styles.waypoint, 
                    styles.nextWaypoint,
                    {
                      top: currentDirection === 'left' ? 180 : currentDirection === 'right' ? 220 : 200,
                      left: currentDirection === 'left' ? 60 : currentDirection === 'right' ? 120 : 80,
                    }
                  ]}>
                    <View style={styles.waypointPulse} />
                    <Text style={styles.waypointIcon}>{currentWaypoint}</Text>
                  </View>
                  
                  {/* Secondary Waypoints - Show only if not at final waypoints */}
                  {currentWaypoint < totalWaypoints - 1 && (
                    <View style={[styles.waypoint, styles.futureWaypoint, { 
                      top: 180 + (currentDirection === 'right' ? 50 : 30), 
                      left: 120 + (currentDirection === 'left' ? -30 : 20) 
                    }]}>
                      <Text style={styles.waypointIcon}>{currentWaypoint + 1}</Text>
                    </View>
                  )}
                  
                  {currentWaypoint < totalWaypoints - 2 && (
                    <View style={[styles.waypoint, styles.futureWaypoint, { 
                      top: 280 + (currentDirection === 'left' ? -20 : 10), 
                      right: 80 + (currentDirection === 'right' ? 20 : 0) 
                    }]}>
                      <Text style={styles.waypointIcon}>{currentWaypoint + 2}</Text>
                    </View>
                  )}
                  
                  {/* Destination Waypoint - Show when close */}
                  {currentWaypoint >= totalWaypoints - 2 && (
                    <View style={[styles.waypoint, styles.destinationWaypoint, { top: 250, left: 100 }]}>
                      <View style={styles.destinationPulse} />
                      <Text style={styles.waypointIcon}>🎯</Text>
                    </View>
                  )}
                </View>

                {/* AR Path Guidance */}
                <View style={styles.arPathGuide}>
                  <View style={[styles.pathLine, {
                    transform: [{
                      rotate: currentDirection === 'left' ? '-15deg' :
                             currentDirection === 'right' ? '15deg' :
                             currentDirection === 'u-turn' ? '180deg' : '0deg'
                    }]
                  }]}>
                    <View style={[styles.pathSegment, { 
                      backgroundColor: nextTurnDistance <= 15 ? '#FF4444' : 'rgba(0,174,239,0.7)',
                      shadowColor: nextTurnDistance <= 15 ? '#FF4444' : '#00AEEF',
                    }]} />
                    <View style={[styles.pathSegment, {
                      opacity: navigationProgress > 50 ? 1 : 0.5,
                      backgroundColor: navigationProgress > 50 ? '#00FF88' : 'rgba(0,174,239,0.7)',
                    }]} />
                    <View style={[styles.pathSegment, {
                      opacity: navigationProgress > 80 ? 1 : 0.3,
                      backgroundColor: navigationProgress > 80 ? '#FFD700' : 'rgba(0,174,239,0.5)',
                    }]} />
                  </View>
                </View>

                {/* Enhanced Beacon Display with Visual Indicators */}
                <View style={styles.enhancedBeaconDisplay}>
                  <Text style={styles.beaconTitle}>� AR Beacons Detected</Text>
                  {indoorRoute.beacons.slice(0, 3).map((beacon, index) => (
                    <View key={beacon.id} style={styles.beaconItemEnhanced}>
                      <View style={styles.beaconIndicator}>
                        <View style={[styles.beaconPulse, { 
                          backgroundColor: beacon.type === 'destination' ? '#00FF88' : 
                                          beacon.type === 'amenity' ? '#FFD700' : '#00AEEF' 
                        }]} />
                        <Text style={styles.beaconIconEnhanced}>
                          {beacon.type === 'destination' ? '🎯' : 
                           beacon.type === 'amenity' ? '🚻' : '📍'}
                        </Text>
                      </View>
                      <View style={styles.beaconDetails}>
                        <Text style={styles.beaconName}>{beacon.name}</Text>
                        <Text style={styles.beaconType}>{beacon.type.toUpperCase()}</Text>
                      </View>
                      <View style={styles.beaconDistanceContainer}>
                        <Text style={styles.beaconDistance}>
                          {Math.round(Math.sqrt(beacon.coordinates.x ** 2 + beacon.coordinates.y ** 2))}
                        </Text>
                        <Text style={styles.distanceUnit}>m</Text>
                      </View>
                    </View>
                  ))}
                </View>

                {/* AR Compass and Orientation */}
                <View style={styles.arCompass}>
                  <View style={styles.compassRing}>
                    <View style={[styles.compassNeedle, { 
                      transform: [{ 
                        rotate: currentDirection === 'left' ? '-45deg' : 
                               currentDirection === 'right' ? '45deg' : 
                               currentDirection === 'u-turn' ? '180deg' : '0deg' 
                      }] 
                    }]} />
                    <Text style={styles.compassDirection}>N</Text>
                  </View>
                  <Text style={styles.orientationText}>
                    {currentDirection === 'left' ? 'Turn left to face destination' :
                     currentDirection === 'right' ? 'Turn right to face destination' :
                     currentDirection === 'u-turn' ? 'Turn around' :
                     'Continue straight ahead'}
                  </Text>
                </View>

                {/* Live AR Instructions */}
                <View style={styles.liveInstructions}>
                  <View style={styles.instructionBubble}>
                    <Text style={styles.instructionText}>
                      🔍 Point camera ahead to see AR path markers
                    </Text>
                  </View>
                  <View style={styles.instructionBubble}>
                    <Text style={styles.instructionText}>
                      {currentDirection === 'left' ? '⬅️ Prepare to turn left' :
                       currentDirection === 'right' ? '➡️ Prepare to turn right' :
                       currentDirection === 'u-turn' ? '🔄 U-turn ahead' :
                       '⬆️ Continue straight ahead'}
                    </Text>
                  </View>
                  {nextTurnDistance <= 15 && (
                    <View style={[styles.instructionBubble, { backgroundColor: 'rgba(255,68,68,0.9)' }]}>
                      <Text style={styles.instructionText}>
                        ⚠️ {currentInstruction} in {nextTurnDistance}m
                      </Text>
                    </View>
                  )}
                </View>

                {/* Enhanced Gamification Panel */}
                <View style={styles.enhancedGamificationPanel}>
                  <View style={styles.gamificationHeader}>
                    <Text style={styles.gamificationTitleEnhanced}>� Navigation Challenge</Text>
                    <View style={styles.scoreDisplay}>
                      <Text style={styles.scorePoints}>1,250 pts</Text>
                    </View>
                  </View>
                  
                  <View style={styles.achievementGrid}>
                    <View style={styles.achievementBadge}>
                      <Text style={styles.badgeIcon}>🎯</Text>
                      <Text style={styles.badgeText}>Wayfinder</Text>
                    </View>
                    <View style={styles.achievementBadge}>
                      <Text style={styles.badgeIcon}>⚡</Text>
                      <Text style={styles.badgeText}>Speed Walker</Text>
                    </View>
                    <View style={styles.achievementBadge}>
                      <Text style={styles.badgeIcon}>📍</Text>
                      <Text style={styles.badgeText}>Explorer</Text>
                    </View>
                  </View>
                  
                  <View style={styles.navigationStats}>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{currentWaypoint}/{totalWaypoints}</Text>
                      <Text style={styles.statLabel}>Waypoints</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{remainingDistance}</Text>
                      <Text style={styles.statLabel}>Remaining</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{estimatedArrival}</Text>
                      <Text style={styles.statLabel}>ETA</Text>
                    </View>
                  </View>
                </View>

                {/* AR Safety Indicators */}
                <View style={styles.safetyIndicators}>
                  <View style={styles.safetyItem}>
                    <Text style={styles.safetyIcon}>⚠️</Text>
                    <Text style={styles.safetyText}>Mind the step ahead</Text>
                  </View>
                  <View style={styles.safetyItem}>
                    <Text style={styles.safetyIcon}>🚶‍♂️</Text>
                    <Text style={styles.safetyText}>Pedestrian area</Text>
                  </View>
                </View>
              </>
            )}
          </View>
        )}
         {/* Map View - Show when in map mode or as background */}
        {(isMapMode || !isARMode) && (
          <MapView
            ref={mapRef}
            style={styles.map}
            region={mapRegion}
            onRegionChangeComplete={setMapRegion}
            showsUserLocation={true}
            showsMyLocationButton={false}
            followsUserLocation={phase === 'outdoor_navigation'}
          >
            {/* User location marker */}
            {userLocation && (
              <Marker
                coordinate={{
                  latitude: userLocation.latitude,
                  longitude: userLocation.longitude,
                }}
                title="Your Location"
                pinColor={colors.primary}
              />
            )}
            
            {/* Destination marker */}
            {selectedVenue?.location?.coordinates && (
              <Marker
                coordinate={selectedVenue.location.coordinates}
                title={selectedVenue.name}
                description={selectedVenue.description}
                pinColor={colors.secondary}
              />
            )}
            
            {/* Route polyline - show actual Google Maps route */}
            {currentRoute && currentRoute.steps && (
              <Polyline
                coordinates={currentRoute.steps.map((step: any) => step.coords)}
                strokeColor={colors.primary}
                strokeWidth={4}
                lineDashPattern={[0]}
              />
            )}
            
            {/* Fallback simple route if no detailed route available */}
            {currentRoute && !currentRoute.steps && userLocation && selectedVenue?.location?.coordinates && (
              <Polyline
                coordinates={[
                  { latitude: userLocation.latitude, longitude: userLocation.longitude },
                  selectedVenue.location.coordinates,
                ]}
                strokeColor={colors.primary}
                strokeWidth={4}
                lineDashPattern={[5, 5]}
              />
            )}

            {/* Indoor BLE beacons for indoor navigation */}
            {isIndoorNavigation && indoorRoute?.beacons.map((beacon) => (
              <Marker
                key={beacon.id}
                coordinate={{
                  latitude: (selectedVenue?.location?.coordinates.latitude || 0) + (beacon.coordinates.x * 0.0001),
                  longitude: (selectedVenue?.location?.coordinates.longitude || 0) + (beacon.coordinates.y * 0.0001),
                }}
                title={beacon.name}
                pinColor={beacon.type === 'destination' ? '#FF6B6B' : '#4ECDC4'}
              />
            ))}
          </MapView>
        )}

        {/* Top control bar */}
        <View style={[styles.topBar, { backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)' }]}>
          <TouchableOpacity style={styles.controlButton} onPress={resetNavigation}>
            <IconSymbol size={24} name="xmark" color={isDark ? '#FFFFFF' : '#000000'} />
          </TouchableOpacity>
          
          <Text style={[styles.topBarTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
            {phase === 'outdoor_navigation' ? 'Navigating to Venue' : 
             phase === 'indoor_navigation' ? 'Indoor Navigation' : 'AR Navigator'}
          </Text>
          
          <TouchableOpacity style={styles.controlButton} onPress={toggleNavigationMode}>
            <IconSymbol 
              size={24} 
              name={isMapMode ? 'viewfinder.circle' : 'map'} 
              color={isDark ? '#FFFFFF' : '#000000'} 
            />
          </TouchableOpacity>
        </View>

        {/* Phase-specific UI */}
        {isOutdoorNavigation && selectedVenue && (
          <View style={[styles.navigationInfo, { backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)' }]}>
            <Text style={[styles.navigationTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
              Walking to {selectedVenue.name}
            </Text>
            <Text style={[styles.navigationSubtitle, { color: isDark ? '#CCCCCC' : '#666666' }]}>
              Follow the blue route • {selectedVenue.distance.toFixed(1)}km
            </Text>
          </View>
        )}

        {isIndoorNavigation && indoorRoute && (
          <View style={[styles.indoorNavigationPanel, { backgroundColor: isDark ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.95)' }]}>
            <Text style={[styles.indoorTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
              Indoor Navigation
            </Text>
            <Text style={[styles.floorIndicator, { color: colors.primary }]}>
              Floor {indoorRoute.floor}
            </Text>
            
            <ScrollView style={styles.stepsContainer} showsVerticalScrollIndicator={false}>
              {indoorRoute.pathSteps.map((step, index) => (
                <View key={index} style={styles.stepItem}>
                  <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={[styles.stepText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                    {step}
                  </Text>
                </View>
              ))}
            </ScrollView>
            
            <Text style={[styles.estimatedTime, { color: isDark ? '#CCCCCC' : '#666666' }]}>
              Estimated time: {Math.floor(indoorRoute.estimatedTime / 60)} min {indoorRoute.estimatedTime % 60} sec
            </Text>
          </View>
        )}

        {/* Loading overlay */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingOverlayText, { color: '#FFFFFF' }]}>
              Processing...
            </Text>
          </View>
        )}
      </View>
    );
  };

  // Main render
  const isIndoorNavigationPhase = phase === 'indoor_navigation';
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000000' : '#FFFFFF' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Enhanced AR Navigation Screen for Indoor Navigation */}
      {isIndoorNavigationPhase && selectedInternalArea && (
        <ARNavigationScreen
          isVisible={true}
          destination={selectedInternalArea.name}
          venueId={selectedVenue?.id}
          onClose={() => {
            setPhase('venue_selection');
            setSelectedInternalArea(null);
          }}
          onNavigationComplete={() => {
            Alert.alert(
              'Navigation Complete! 🎉',
              `You have arrived at ${selectedInternalArea.name}`,
              [
                {
                  text: 'Start New Navigation',
                  onPress: () => {
                    setPhase('location_entry');
                    setSelectedVenue(null);
                    setSelectedInternalArea(null);
                    setUserLocation(null);
                  },
                },
              ]
            );
          }}
          userLocation={userLocation || undefined}
        />
      )}
      
      {/* Always show the map interface when not in indoor navigation */}
      {!isIndoorNavigationPhase && renderNavigationInterface()}
      
      {/* Modals based on phase */}
      {renderLocationEntryModal()}
      {renderLocationConfirmationModal()}
      {renderVenueSelectionModal()}
      {renderIndoorPrompt()}
      
      {/* Internal Area Selection Modal */}
      <Modal
        visible={showInternalAreaModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          console.log('📱 InternalAreaSelection onClose called');
          setShowInternalAreaModal(false);
          setPhase('venue_selection');
          setShowVenueModal(true);
        }}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => {
                setShowInternalAreaModal(false);
                setPhase('venue_selection');
                setShowVenueModal(true);
              }}
            >
              <IconSymbol name="xmark" size={24} color={isDark ? '#ffffff' : '#000000'} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
              Select Destination
            </Text>
            <TouchableOpacity 
              style={styles.skipButton}
              onPress={handleSkipInternalAreaSelection}
            >
              <Text style={[styles.skipButtonText, { color: colors.primary }]}>Skip</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {selectedVenue?.internalAreas && selectedVenue.internalAreas.length > 0 ? (
              selectedVenue.internalAreas.map((area) => (
                <TouchableOpacity
                  key={area.id}
                  style={[styles.areaItem, { backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5' }]}
                  onPress={() => handleInternalAreaSelect(area)}
                >
                  <View style={styles.areaInfo}>
                    <Text style={[styles.areaName, { color: isDark ? '#ffffff' : '#000000' }]}>
                      {area.name}
                    </Text>
                    <Text style={[styles.areaType, { color: isDark ? '#cccccc' : '#666666' }]}>
                      {area.type.charAt(0).toUpperCase() + area.type.slice(1)}
                    </Text>
                  </View>
                  <IconSymbol name="chevron.right" size={16} color={isDark ? '#666666' : '#999999'} />
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyStateText, { color: isDark ? '#cccccc' : '#666666' }]}>
                  No internal areas available for this venue
                </Text>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
      
      {/* Debug Information */}
      {__DEV__ && (
        <View style={{
          position: 'absolute',
          top: 100,
          right: 10,
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: 10,
          borderRadius: 5,
          maxWidth: 200
        }}>
          <Text style={{ color: 'white', fontSize: 10 }}>
            Phase: {phase}{'\n'}
            VenueModal: {showVenueModal ? 'YES' : 'NO'}{'\n'}
            InternalModal: {showInternalAreaModal ? 'YES' : 'NO'}{'\n'}
            SelectedVenue: {selectedVenue?.name || 'None'}{'\n'}
            Loading: {isLoading ? 'YES' : 'NO'}
          </Text>
        </View>
      )}

      {/* Enhanced AR Performance Monitor */}
      <ARPerformanceMonitor
        frameRate={performanceMetrics.frameRate}
        memoryUsage={performanceMetrics.memoryUsage}
        batteryOptimized={performanceMetrics.batteryOptimized}
        isVisible={mode === 'ar' && phase === 'indoor_navigation'}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // Enhanced Modal Styles
  enhancedModalContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  enhancedModalContent: {
    maxWidth: 420,
    alignSelf: 'center',
    width: '100%',
  },
  enhancedModalHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl * 1.5,
    paddingHorizontal: spacing.md,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconAccent: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    top: -20,
    zIndex: -1,
  },
  enhancedModalTitle: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: spacing.sm,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  enhancedModalSubtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 24,
    fontWeight: '500',
  },
  modalDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  
  // Enhanced Location Options
  enhancedLocationOptions: {
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  enhancedOptionButton: {
    width: '100%',
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
    flexDirection: 'row',
    minHeight: 80,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryEnhancedOption: {
    backgroundColor: colors.primary,
  },
  secondaryEnhancedOption: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  optionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  optionTextContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  enhancedPrimaryOptionText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  enhancedSecondaryOptionText: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  enhancedOptionSubtext: {
    fontSize: 14,
    lineHeight: 18,
    opacity: 0.9,
  },
  
  // Divider Styles
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    borderBottomWidth: 1,
  },
  dividerText: {
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  
  // Enhanced Manual Entry
  enhancedManualEntry: {
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  enhancedManualTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  manualSubtext: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: spacing.lg,
  },
  enhancedLocationInput: {
    width: '100%',
    padding: spacing.lg,
    paddingRight: 50,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    fontSize: 16,
    lineHeight: 20,
    minHeight: 56,
  },
  inputIcon: {
    position: 'absolute',
    right: spacing.md,
    top: spacing.lg,
  },
  
  // Enhanced Loading
  enhancedLoadingContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingVertical: spacing.lg,
  },
  enhancedLoadingText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: spacing.md,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 15,
    marginTop: spacing.xs,
    textAlign: 'center',
    lineHeight: 20,
  },
  
  // Enhanced Footer
  enhancedFooter: {
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingVertical: spacing.lg,
  },
  poweredByText: {
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  brandText: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: spacing.xs,
    letterSpacing: 0.5,
  },
  footerDescription: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 16,
    maxWidth: 280,
  },
  
  // Legacy Modal Styles (keeping for compatibility)
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalContent: {
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: spacing.md,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  
  // Location Options
  locationOptions: {
    width: '100%',
    alignItems: 'center',
  },
  optionButton: {
    width: '100%',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  primaryOption: {
    backgroundColor: colors.primary,
  },
  secondaryOption: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  primaryOptionText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
  secondaryOptionText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
  optionSubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: spacing.xs,
  },
  orText: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: spacing.lg,
  },
  
  // Manual Entry
  manualEntry: {
    width: '100%',
    alignItems: 'center',
  },
  manualTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  locationInput: {
    width: '100%',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    fontSize: 16,
    marginBottom: spacing.md,
  },
  
  // Loading
  loadingContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  loadingText: {
    fontSize: 16,
    marginTop: spacing.md,
  },
  
  // Overlay
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  
  // Confirmation Card
  confirmationCard: {
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    minWidth: 300,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: spacing.md,
    textAlign: 'center',
  },
  confirmationText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  confirmationSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  confirmationButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  confirmButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    minWidth: 120,
    alignItems: 'center',
  },
  confirmYes: {
    backgroundColor: colors.primary,
  },
  confirmNo: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  confirmYesText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmNoText: {
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Venue Modal
  venueModalHeader: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    padding: spacing.sm,
  },
  venueModalTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  venueModalSubtitle: {
    fontSize: 14,
    marginTop: spacing.xs,
  },
  venueList: {
    flex: 1,
    padding: spacing.lg,
  },
  venueCard: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  venueCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  venueIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,123,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  venueInfo: {
    flex: 1,
  },
  venueName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  venueLocation: {
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  venueType: {
    fontSize: 12,
    fontWeight: '500',
  },
  
  // Indoor Prompt
  indoorPromptCard: {
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    minWidth: 320,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  indoorPromptTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: spacing.md,
    textAlign: 'center',
  },
  indoorPromptText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  indoorPromptSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  indoorPromptButtons: {
    width: '100%',
    gap: spacing.sm,
  },
  indoorButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  startIndoorButton: {
    backgroundColor: colors.primary,
  },
  skipIndoorButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  startIndoorText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  skipIndoorText: {
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Map and Navigation
  map: {
    flex: 1,
  },
  topBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBarTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Navigation Info
  navigationInfo: {
    position: 'absolute',
    bottom: 100,
    left: spacing.md,
    right: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  navigationTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  navigationSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  
  // Indoor Navigation Panel
  indoorNavigationPanel: {
    position: 'absolute',
    bottom: 20,
    left: spacing.md,
    right: spacing.md,
    maxHeight: 300,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  indoorTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  floorIndicator: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  stepsContainer: {
    maxHeight: 180,
    marginBottom: spacing.sm,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
  },
  stepEstimatedTime: {
    fontSize: 12,
    textAlign: 'center',
  },
  
  // Loading Overlay
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlayText: {
    fontSize: 16,
    marginTop: spacing.md,
  },
  venueDetails: {
    marginTop: spacing.xs,
  },
  venueStores: {
    fontSize: 12,
    marginTop: spacing.xs / 2,
  },
  
  // Enhanced AR Overlay Styles
  arNavigationHUD: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.9)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,174,239,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  
  // Turn-by-Turn Navigation
  turnByTurnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  primaryDirectionArrow: {
    position: 'relative',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0,174,239,0.2)',
    borderWidth: 3,
    borderColor: '#00AEEF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  turnArrowLarge: {
    fontSize: 36,
    color: '#00AEEF',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,174,239,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  arrowGlow: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,174,239,0.1)',
    opacity: 0.8,
  },
  directionDetails: {
    flex: 1,
  },
  nextTurnText: {
    fontSize: 14,
    color: '#CCCCCC',
    fontWeight: '600',
    marginBottom: 4,
  },
  directionInstruction: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  turnDistance: {
    fontSize: 16,
    color: '#00AEEF',
    fontWeight: '600',
  },
  
  // Destination Panel
  destinationPanel: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  destinationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  destinationIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  destinationInfo: {
    flex: 1,
  },
  destinationName: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  estimatedTime: {
    fontSize: 14,
    color: '#00FF88',
    fontWeight: '600',
  },
  routeProgress: {
    marginTop: 8,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    marginBottom: 6,
  },
  progressIndicator: {
    height: '100%',
    backgroundColor: '#00FF88',
    borderRadius: 3,
    shadowColor: '#00FF88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: '#CCCCCC',
    textAlign: 'right',
  },
  
  // AR Waypoints
  arWaypoints: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  waypoint: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  nextWaypoint: {
    top: 200,
    left: 80,
    backgroundColor: 'rgba(0,255,136,0.3)',
    borderColor: '#00FF88',
  },
  futureWaypoint: {
    backgroundColor: 'rgba(0,174,239,0.3)',
    borderColor: '#00AEEF',
  },
  destinationWaypoint: {
    backgroundColor: 'rgba(255,215,0,0.3)',
    borderColor: '#FFD700',
  },
  waypointPulse: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(0,255,136,0.2)',
    borderWidth: 1,
    borderColor: '#00FF88',
  },
  destinationPulse: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,215,0,0.2)',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  waypointIcon: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  
  // AR Path Guide
  arPathGuide: {
    position: 'absolute',
    bottom: 200,
    left: 40,
    right: 40,
    height: 60,
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  pathLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pathSegment: {
    width: 60,
    height: 8,
    backgroundColor: 'rgba(0,174,239,0.7)',
    borderRadius: 4,
    shadowColor: '#00AEEF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  
  // Enhanced Beacon Display
  enhancedBeaconDisplay: {
    position: 'absolute',
    top: 300,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,174,239,0.3)',
  },
  beaconItemEnhanced: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  beaconIndicator: {
    position: 'relative',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  beaconPulse: {
    position: 'absolute',
    width: 35,
    height: 35,
    borderRadius: 17.5,
    opacity: 0.3,
  },
  beaconIconEnhanced: {
    fontSize: 18,
  },
  beaconDetails: {
    flex: 1,
  },
  beaconName: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 2,
  },
  beaconType: {
    fontSize: 11,
    color: '#CCCCCC',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  beaconDistanceAlign: {
    alignItems: 'center',
  },
  distanceNumber: {
    fontSize: 16,
    color: '#00AEEF',
    fontWeight: 'bold',
  },
  distanceUnitGeneral: {
    fontSize: 10,
    color: '#CCCCCC',
  },
  
  // AR Compass
  arCompass: {
    position: 'absolute',
    top: 60,
    right: 20,
    alignItems: 'center',
  },
  compassRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#00AEEF',
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 8,
  },
  compassNeedle: {
    position: 'absolute',
    width: 2,
    height: 20,
    backgroundColor: '#FF4444',
    top: 10,
    borderRadius: 1,
  },
  compassDirection: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  orientationText: {
    fontSize: 12,
    color: '#CCCCCC',
    textAlign: 'center',
    maxWidth: 80,
  },
  
  // Live Instructions
  liveInstructions: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
  },
  instructionBubble: {
    backgroundColor: 'rgba(0,174,239,0.9)',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  instructionText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  
  // Enhanced Gamification Panel
  enhancedGamificationPanel: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.9)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
  },
  gamificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  gamificationTitleEnhanced: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  scoreDisplay: {
    backgroundColor: 'rgba(255,215,0,0.2)',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  scorePoints: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  achievementGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  achievementBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    padding: 8,
    flex: 1,
    marginHorizontal: 2,
  },
  badgeIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 10,
    color: '#CCCCCC',
    textAlign: 'center',
  },
  navigationStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 11,
    color: '#CCCCCC',
    marginTop: 2,
  },
  
  // Safety Indicators
  safetyIndicators: {
    position: 'absolute',
    top: 160,
    right: 20,
  },
  safetyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,165,0,0.9)',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 6,
  },
  safetyIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  safetyText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  
  // Legacy styles (keeping for compatibility)
  arOverlay: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  arTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00AEEF',
    marginBottom: 8,
  },
  arSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  arInstructions: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 20,
  },
  
  // Gamification Styles
  gamificationPanel: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  gamificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 12,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00FF88',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  rewardText: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  
  // Direction Indicator
  directionIndicator: {
    marginTop: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(0,174,239,0.2)',
    borderRadius: 12,
    padding: 12,
  },
  directionArrow: {
    fontSize: 32,
    marginBottom: 4,
  },
  directionText: {
    fontSize: 16,
    color: '#00AEEF',
    fontWeight: 'bold',
  },
  
  // Beacon Display
  beaconDisplay: {
    width: '100%',
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 12,
  },
  
  // World-Class Landing Page Styles
  worldClassHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
  },
  enhancedBackButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  appLogo: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  scrollContentContainer: {
    paddingBottom: spacing.xl * 2,
  },
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl * 1.5,
  },
  heroIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  heroIconGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    opacity: 0.3,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  featureHighlights: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: spacing.lg,
  },
  featureItem: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '600',
  },
  navigationModeSection: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  modeSelectionContainer: {
    gap: spacing.md,
  },
  modeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    gap: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  modeOptionSelected: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  modeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeTextContainer: {
    flex: 1,
  },
  modeTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  modeDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  locationOptionsSection: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  primaryActionButton: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  actionButtonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    flex: 1,
  },
  primaryActionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  primaryActionSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  manualEntrySection: {
    gap: spacing.md,
  },
  manualEntryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  inputWrapper: {
    gap: spacing.md,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  secondaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  secondaryActionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  quickAccessSection: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: spacing.lg,
  },
  popularVenuesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  venueQuickAccess: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: (Dimensions.get('window').width - spacing.xl * 2 - spacing.md) / 2,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  venueQuickAccessText: {
    fontSize: 14,
    fontWeight: '600',
  },
  beaconTitle: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  beaconItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    paddingVertical: 4,
  },
  beaconIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  beaconText: {
    flex: 1,
    fontSize: 12,
    color: '#CCCCCC',
  },
  beaconDistance: {
    fontSize: 11,
    color: '#00AEEF',
    fontWeight: 'bold',
  },
  beaconDistanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 40,
  },
  distanceUnit: {
    fontSize: 9,
    color: '#888888',
    marginLeft: 2,
  },
  achievementText: {
    fontSize: 12,
    color: '#FFB347',
    fontWeight: 'bold',
    marginTop: 4,
  },
  
  // Compact Modal Styles
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1000,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  compactModalHeader: {
    alignItems: 'center',
    marginBottom: 15,
  },
  compactIconContainer: {
    marginBottom: 8,
  },
  compactMainTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 5,
    textAlign: 'center',
  },
  compactModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 5,
    textAlign: 'center',
  },
  compactSubtitle: {
    fontSize: 13,
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: 18,
  },
  compactModalSubtitle: {
    fontSize: 13,
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: 18,
  },
  compactLocationOptions: {
    width: '100%',
    marginBottom: 15,
  },
  compactOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
    minHeight: 50,
  },
  primaryCompactOption: {
    backgroundColor: 'rgba(0, 174, 239, 0.1)',
    borderWidth: 1,
    borderColor: '#00AEEF',
  },
  secondaryCompactOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  compactOptionIconContainer: {
    marginRight: 12,
  },
  compactOptionIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  compactOptionTextContainer: {
    flex: 1,
  },
  compactOptionContent: {
    flex: 1,
  },
  compactOptionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  compactPrimaryOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00AEEF',
  },
  compactSecondaryOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  compactOptionDescription: {
    fontSize: 11,
    opacity: 0.7,
    lineHeight: 14,
  },
  compactOptionSubtext: {
    fontSize: 11,
    opacity: 0.7,
    lineHeight: 14,
  },
  compactDividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  compactDividerLine: {
    flex: 1,
    height: 1,
    borderBottomWidth: 1,
  },
  compactDividerText: {
    fontSize: 11,
    fontWeight: '600',
    marginHorizontal: 8,
    paddingHorizontal: 4,
  },
  compactManualEntry: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  compactManualTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  compactInputContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: 15,
  },
  compactLocationInput: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
  },





  skipButton: {
    padding: 8,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },

  areaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  areaInfo: {
    flex: 1,
  },
  areaName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  areaType: {
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
  },
  compactInput: {
    borderWidth: 1,
    fontSize: 14,
    paddingRight: 40,
  },
  compactInputIcon: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -8 }],
  },
  compactLoadingContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  compactLoadingText: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  compactFooter: {
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  compactPoweredBy: {
    fontSize: 9,
    opacity: 0.5,
    textAlign: 'center',
  },
  compactPoweredByText: {
    fontSize: 9,
    opacity: 0.5,
    textAlign: 'center',
  },
  compactBrandText: {
    fontSize: 9,
    fontWeight: '600',
    textAlign: 'center',
  },
});
