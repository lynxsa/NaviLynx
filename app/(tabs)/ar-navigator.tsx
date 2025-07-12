/**
 * AR Navigator Screen - Main navigation interface with AR/Map toggle
 * Comprehensive AR navigation experience for NaviLynx
 */

import React, { useState, useRef, useCallback, useMemo } from 'react';
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
} from 'react-native';
import MapView, { Marker, Polyline, Region } from 'react-native-maps';
import { useFocusEffect } from '@react-navigation/native';

// Internal imports
import { useTheme } from '../../context/ThemeContext';
import { IconSymbol } from '../../components/ui/IconSymbol';
import { colors, spacing, borderRadius } from '../../styles/modernTheme';
import { southAfricanVenues, Venue } from '../../data/southAfricanVenues';
import { LocationService } from '../../services/LocationService';
import { NavigationService, NavigationRoute, NavigationProgress, Coordinates } from '../../services/NavigationService';
import { ARService, ARCapabilities, ARSession } from '../../services/ARService';

// Components (will be created next)
import AROverlay from '../../components/ar/AROverlay';
import TurnByTurnPanel from '../../components/navigation/TurnByTurnPanel';
import VenueListModal from '../../components/modals/VenueListModal';

// Types
interface UserLocation extends Coordinates {
  accuracy?: number;
  address?: string;
  timestamp: number;
}

type NavigationMode = 'map' | 'ar';
type NavigationPhase = 'loading' | 'venue_selection' | 'navigating' | 'indoor' | 'arrived';

export default function ARNavigator() {
  const { isDark } = useTheme();
  
  // Core State
  const [phase, setPhase] = useState<NavigationPhase>('loading');
  const [mode, setMode] = useState<NavigationMode>('map');
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [nearbyVenues, setNearbyVenues] = useState<Venue[]>([]);
  
  // Navigation State
  const [currentRoute, setCurrentRoute] = useState<NavigationRoute | null>(null);
  const [navigationProgress, setNavigationProgress] = useState<NavigationProgress | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isIndoorMode, setIsIndoorMode] = useState(false);
  
  // UI State
  const [showVenueModal, setShowVenueModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // AR State
  const [arCapabilities, setArCapabilities] = useState<ARCapabilities | null>(null);
  const [arSession, setArSession] = useState<ARSession | null>(null);
  
  // Refs
  const mapRef = useRef<MapView>(null);
  const locationService = useRef(LocationService.getInstance());
  const navigationService = useRef(NavigationService.getInstance());
  const arService = useRef(ARService.getInstance());
  
  // Map region state
  const [mapRegion, setMapRegion] = useState<Region>({
    latitude: -26.2041, // Johannesburg default
    longitude: 28.0473,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  /**
   * Memoized nearby venues sorted by distance
   */
  const sortedNearbyVenues = useMemo(() => {
    if (!userLocation || nearbyVenues.length === 0) {
      return nearbyVenues;
    }

    return [...nearbyVenues].sort((a, b) => {
      const distanceA = navigationService.current.calculateDistance(
        { latitude: userLocation.latitude, longitude: userLocation.longitude },
        a.location.coordinates
      );
      const distanceB = navigationService.current.calculateDistance(
        { latitude: userLocation.latitude, longitude: userLocation.longitude },
        b.location.coordinates
      );
      return distanceA - distanceB;
    });
  }, [userLocation, nearbyVenues]);

  /**
   * Handle venue selection and start navigation
   */
  const handleVenueSelect = useCallback(async (venue: Venue) => {
    try {
      setIsLoading(true);
      setSelectedVenue(venue);
      setShowVenueModal(false);
      setPhase('navigating');

      if (!userLocation || !venue.location?.coordinates) {
        throw new Error('Missing location data');
      }

      // Calculate route from user location to venue
      console.log('Calculating route to venue:', venue.name);
      const route = await navigationService.current.calculateAdvancedRoute(
        { latitude: userLocation.latitude, longitude: userLocation.longitude },
        venue.location.coordinates,
        {
          mode: 'walking',
          avoidTolls: true,
          avoidHighways: true,
          alternatives: true,
          traffic: true,
          language: 'en-ZA',
        }
      );

      if (!route) {
        throw new Error('Failed to calculate route');
      }

      setCurrentRoute(route);

      // Start location tracking for real-time navigation
      await locationService.current.startLocationTracking();

      // If AR mode is selected and supported, start AR session
      if (mode === 'ar' && arCapabilities?.isARSupported) {
        const session = await arService.current.startARSession();
        setArSession(session);
      }

      // Update map to show route
      if (mapRef.current && route) {
        const coordinates = route.steps.map((step: any) => step.coords);
        mapRef.current.fitToCoordinates(coordinates, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }

    } catch (error) {
      console.error('Navigation start error:', error);
      setError('Failed to start navigation. Please try again.');
      Alert.alert('Navigation Error', 'Failed to start navigation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [userLocation, mode, arCapabilities]);

  /**
   * Memoized map markers for performance
   */
  const mapMarkers = useMemo(() => {
    return sortedNearbyVenues.slice(0, 20).map((venue) => ( // Limit to 20 for performance
      <Marker
        key={venue.id}
        coordinate={venue.location.coordinates}
        title={venue.name}
        description={venue.description}
        onPress={() => handleVenueSelect(venue)}
      />
    ));
  }, [sortedNearbyVenues, handleVenueSelect]);

  /**
   * Initialize the AR Navigator on screen focus
   */
  const initializeARNavigator = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setPhase('loading');

      // Initialize AR service and detect capabilities
      console.log('Initializing AR capabilities...');
      const capabilities = await arService.current.initialize();
      setArCapabilities(capabilities);

      // Set recommended mode based on device capabilities
      setMode(capabilities.recommendedMode);

      // Request user location
      console.log('Requesting user location...');
      const location = await locationService.current.requestUserLocation();
      
      if (location) {
        setUserLocation(location);
        
        // Update map region to user's location
        setMapRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        
        // Get all venues with valid coordinates
        const allVenues = southAfricanVenues.filter(venue => {
          return venue.location?.coordinates;
        });

        // Sort all venues by distance (closest first)
        allVenues.sort((a, b) => {
          const distanceA = navigationService.current.calculateDistance(
            { latitude: location.latitude, longitude: location.longitude },
            a.location.coordinates
          );
          const distanceB = navigationService.current.calculateDistance(
            { latitude: location.latitude, longitude: location.longitude },
            b.location.coordinates
          );
          return distanceA - distanceB;
        });

        setNearbyVenues(allVenues);
        setPhase('venue_selection');
        setShowVenueModal(true);
      } else {
        // Fallback to manual location entry
        Alert.prompt(
          'Enter Your Location',
          'Please enter your current address or a nearby landmark:',
          [
            { text: 'Cancel', style: 'cancel', onPress: () => setPhase('venue_selection') },
            {
              text: 'OK',
              onPress: async (address?: string) => {
                if (address?.trim()) {
                  try {
                    setIsLoading(true);
                    // In a real implementation, use Google Geocoding API
                    // For now, use Johannesburg as fallback
                    const mockLocation: UserLocation = {
                      latitude: -26.2041,
                      longitude: 28.0473,
                      address: address.trim(),
                      timestamp: Date.now(),
                    };
                    
                    setUserLocation(mockLocation);
                    setMapRegion({
                      latitude: mockLocation.latitude,
                      longitude: mockLocation.longitude,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    });
                    
                    // Get all venues with valid coordinates and sort by distance
                    const allVenues = southAfricanVenues.filter(venue => {
                      return venue.location?.coordinates;
                    });
                    
                    allVenues.sort((a, b) => {
                      const distanceA = navigationService.current.calculateDistance(
                        { latitude: mockLocation.latitude, longitude: mockLocation.longitude },
                        a.location.coordinates
                      );
                      const distanceB = navigationService.current.calculateDistance(
                        { latitude: mockLocation.latitude, longitude: mockLocation.longitude },
                        b.location.coordinates
                      );
                      return distanceA - distanceB;
                    });

                    setNearbyVenues(allVenues);
                    setPhase('venue_selection');
                    setShowVenueModal(true);
                  } catch (error) {
                    console.error('Geocoding error:', error);
                    Alert.alert('Error', 'Unable to find that address. Please try again.');
                  } finally {
                    setIsLoading(false);
                  }
                }
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error('AR Navigator initialization error:', error);
      setError('Failed to initialize navigation. Please check your location settings.');
      Alert.alert(
        'Initialization Error',
        'Unable to initialize AR Navigator. Please check your location and camera permissions.',
        [
          { text: 'Retry', onPress: initializeARNavigator },
          { text: 'Continue without AR', onPress: () => setMode('map') }
        ]
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Cleanup AR Navigator resources
   */
  const cleanupARNavigator = useCallback(async () => {
    try {
      // Stop navigation if active
      if (isNavigating) {
        navigationService.current.stopNavigation();
        setIsNavigating(false);
      }

      // Stop AR session if active
      if (arSession?.isActive) {
        await arService.current.stopARSession();
        setArSession(null);
      }

      // Stop location tracking
      await locationService.current.stopLocationTracking();
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }, [isNavigating, arSession]);

  /**
   * Initialize the AR Navigator on screen focus
   */
  useFocusEffect(
    useCallback(() => {
      initializeARNavigator();
      
      return () => {
        cleanupARNavigator();
      };
    }, [initializeARNavigator, cleanupARNavigator])
  );

  // Removed duplicate handleVenueSelect function

  /**
   * Handle indoor navigation mode
      const route = await navigationService.current.calculateAdvancedRoute(
        { latitude: userLocation.latitude, longitude: userLocation.longitude },
        venue.location.coordinates,
        {
          mode: 'walking',
          avoidTolls: true,


  /**
   * Toggle between AR and Map modes
   */
  const toggleNavigationMode = async () => {
    try {
      if (mode === 'map') {
        // Switch to AR mode
        if (!arCapabilities?.isARSupported) {
          Alert.alert(
            'AR Not Supported',
            'AR navigation is not supported on this device. Please use Map mode.',
            [{ text: 'OK' }]
          );
          return;
        }

        setMode('ar');
        
        // Start AR session if not already active
        if (!arSession?.isActive) {
          const session = await arService.current.startARSession();
          setArSession(session);
        }
        
        Alert.alert(
          'AR Mode Active',
          'Point your camera ahead to see AR navigation overlays. The route will be displayed in augmented reality.',
          [{ text: 'Got it!' }]
        );
      } else {
        // Switch to Map mode
        setMode('map');
        
        // Stop AR session
        if (arSession?.isActive) {
          await arService.current.stopARSession();
          setArSession(null);
        }
      }
    } catch (error) {
      console.error('Mode toggle error:', error);
      Alert.alert('Error', 'Failed to switch navigation mode.');
    }
  };

  /**
   * Stop navigation and return to venue selection
   */
  const stopNavigation = async () => {
    try {
      // Stop navigation service
      navigationService.current.stopNavigation();
      setIsNavigating(false);
      setCurrentRoute(null);
      setNavigationProgress(null);
      
      // Stop AR session
      if (arSession?.isActive) {
        await arService.current.stopARSession();
        setArSession(null);
      }
      
      // Stop location tracking
      await locationService.current.stopLocationTracking();
      
      // Reset state
      setSelectedVenue(null);
      setIsIndoorMode(false);
      setPhase('venue_selection');
      setShowVenueModal(true);
    } catch (error) {
      console.error('Stop navigation error:', error);
    }
  };



  /**
   * Render loading screen
   */
  const renderLoadingScreen = () => (
    <View style={[styles.container, styles.centerContent]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[styles.loadingText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
        Initializing AR Navigator...
      </Text>
      <Text style={[styles.loadingSubtext, { color: isDark ? '#CCCCCC' : '#666666' }]}>
        Detecting location and AR capabilities
      </Text>
    </View>
  );

  /**
   * Render error screen
   */
  const renderErrorScreen = () => (
    <View style={[styles.container, styles.centerContent]}>
      <IconSymbol size={64} name="exclamationmark.triangle" color={colors.warning} />
      <Text style={[styles.errorText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
        {error}
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={initializeARNavigator}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  /**
   * Render main navigation interface
   */
  const renderNavigationInterface = () => {
    const isMapMode = mode === 'map';
    const isIndoorActive = phase === 'indoor';
    
    return (
      <View style={styles.container}>
        {/* Map or AR View */}
        {isMapMode ? (
          <MapView
            ref={mapRef}
            style={styles.map}
            region={mapRegion}
            onRegionChangeComplete={setMapRegion}
            showsUserLocation={true}
            showsMyLocationButton={false}
            followsUserLocation={isNavigating}
          >
            {/* Nearby venue markers (memoized for performance) */}
            {!selectedVenue && mapMarkers}
            
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
            
            {/* Route polyline */}
            {currentRoute && (
              <Polyline
                coordinates={currentRoute.steps.map(step => step.coords)}
                strokeColor={colors.primary}
                strokeWidth={4}
              />
            )}
          </MapView>
        ) : (
          <AROverlay
            session={arSession}
            route={currentRoute}
            progress={navigationProgress}
            userLocation={userLocation}
            onTrackingQualityChange={(quality: any) => {
              arService.current.updateTrackingQuality(quality);
            }}
          />
        )}

        {/* Top control bar */}
        <View style={[styles.topBar, { backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)' }]}>
          <TouchableOpacity style={styles.controlButton} onPress={stopNavigation}>
            <IconSymbol size={24} name="xmark" color={isDark ? '#FFFFFF' : '#000000'} />
          </TouchableOpacity>
          
          <Text style={[styles.topBarTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
            {phase === 'navigating' ? 'Navigating' : isIndoorActive ? 'Indoor Nav' : 'AR Navigator'}
          </Text>
          
          <TouchableOpacity style={styles.controlButton} onPress={toggleNavigationMode}>
            <IconSymbol 
              size={24} 
              name={isMapMode ? 'viewfinder.circle' : 'map'} 
              color={isDark ? '#FFFFFF' : '#000000'} 
            />
          </TouchableOpacity>
        </View>

        {/* Turn-by-turn panel */}
        {(isNavigating || isIndoorActive) && navigationProgress && (
          <TurnByTurnPanel
            progress={navigationProgress}
            route={currentRoute}
            isIndoorMode={isIndoorMode}
            venue={selectedVenue}
          />
        )}

        {/* Venue selection modal */}
        <VenueListModal
          visible={showVenueModal}
          venues={nearbyVenues}
          userLocation={userLocation}
          onVenueSelect={handleVenueSelect}
          onClose={() => setShowVenueModal(false)}
        />

        {/* Loading overlay */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      </View>
    );
  };

  // Main render logic
  if (phase === 'loading' || isLoading) {
    return renderLoadingScreen();
  }

  if (error) {
    return renderErrorScreen();
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000000' : '#FFFFFF' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      {renderNavigationInterface()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
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
    fontSize: 18,
    fontWeight: '600',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: spacing.md,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
