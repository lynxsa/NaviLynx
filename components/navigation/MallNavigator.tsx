// /Users/derahmanyelo/Documents/LYNX Code Vault/NaviLynx-v04/components/navigation/MallNavigator.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IndoorNavigationService } from '../../services/indoorNavigationService';
import type { 
  PointOfInterest, 
  Route, 
  MallFloor, 
  NavigationUserPreferences 
} from '../../types/navigation';

// Create a singleton instance
const indoorNavigationService = new IndoorNavigationService();
// Import AR Navigator if you have it, e.g.:
// import ARNavigatorView from './ARNavigatorView'; 

interface MallNavigatorProps {
  mallId: string;
  initialOriginPOIId?: string;
  initialDestinationPOIId?: string;
  onRouteCalculated?: (route: Route) => void;
  onNavigationStarted?: (route: Route) => void;
  onNavigationEnded?: () => void;
  // For AR integration
  enableAR?: boolean; 
}

const MallNavigator: React.FC<MallNavigatorProps> = ({
  mallId,
  initialOriginPOIId,
  initialDestinationPOIId,
  onRouteCalculated,
  onNavigationStarted,
  onNavigationEnded,
  enableAR = false,
}) => {
  const [mallLayout, setMallLayout] = useState<MallFloor[] | null>(null);
  const [allPOIs, setAllPOIs] = useState<PointOfInterest[]>([]);
  const [selectedOrigin, setSelectedOrigin] = useState<PointOfInterest | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<PointOfInterest | null>(null);
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFloor, setCurrentFloor] = useState<MallFloor | null>(null);
  const [userPreferences, setUserPreferences] = useState<NavigationUserPreferences>(
    indoorNavigationService.getUserPreferences()
  );
  const [isNavigating, setIsNavigating] = useState(false);
  const [showARView, setShowARView] = useState(false);

  useEffect(() => {
    const loadLayout = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const layout = await indoorNavigationService.loadMallLayout(mallId);
        setMallLayout(layout.floors);
        const pois = indoorNavigationService.getAllPOIs();
        setAllPOIs(pois);
        if (layout.floors.length > 0) {
          setCurrentFloor(layout.floors[0]); // Default to first floor
        }
        if (initialOriginPOIId) {
          setSelectedOrigin(pois.find((p: PointOfInterest) => p.id === initialOriginPOIId) || null);
        }
        if (initialDestinationPOIId) {
          setSelectedDestination(pois.find((p: PointOfInterest) => p.id === initialDestinationPOIId) || null);
        }
      } catch (e: any) {
        setError(e.message || 'Failed to load mall layout.');
        Alert.alert('Error', e.message || 'Failed to load mall layout.');
      } finally {
        setIsLoading(false);
      }
    };
    loadLayout();
  }, [mallId, initialOriginPOIId, initialDestinationPOIId]);

  const calculateRoute = useCallback(async () => {
    if (!selectedOrigin || !selectedDestination) return;
    setIsLoading(true);
    try {
      const route = await indoorNavigationService.findRoute(
        selectedOrigin.id,
        selectedDestination.id,
        userPreferences.preferredMode
      );
      setCurrentRoute(route);
      if (route && onRouteCalculated) {
        onRouteCalculated(route);
      }
      if (!route) {
        Alert.alert('No Route', 'Could not find a route between the selected points.');
      }
    } catch (e: any) {
      setError(e.message || 'Failed to calculate route.');
      Alert.alert('Error', e.message || 'Failed to calculate route.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedOrigin, selectedDestination, userPreferences, onRouteCalculated]);

  useEffect(() => {
    if (selectedOrigin && selectedDestination) {
      calculateRoute();
    }
  }, [selectedOrigin, selectedDestination, userPreferences, calculateRoute]);

  const handleSetPreference = (prefs: Partial<NavigationUserPreferences>) => {
    indoorNavigationService.updateUserPreferences(prefs);
    setUserPreferences(indoorNavigationService.getUserPreferences());
    // Route will be recalculated by useEffect due to userPreferences change
  };

  const startNavigation = () => {
    if (currentRoute) {
      setIsNavigating(true);
      if (enableAR) {
        setShowARView(true);
      }
      if (onNavigationStarted) {
        onNavigationStarted(currentRoute);
      }
      Alert.alert('Navigation Started', `Navigating to ${selectedDestination?.name}`);
    }
  };

  const stopNavigation = () => {
    setIsNavigating(false);
    setShowARView(false);
    if (onNavigationEnded) {
      onNavigationEnded();
    }
    // Optionally clear route or keep it for review
    // setCurrentRoute(null);
    // setSelectedOrigin(null);
    // setSelectedDestination(null);
    Alert.alert('Navigation Ended');
  };

  const swapOriginDestination = () => {
    const tempOrigin = selectedOrigin;
    setSelectedOrigin(selectedDestination);
    setSelectedDestination(tempOrigin);
  };

  const handlePOISelect = (poi: PointOfInterest, type: 'origin' | 'destination') => {
    if (type === 'origin') {
      setSelectedOrigin(poi);
    } else {
      setSelectedDestination(poi);
    }
  };
  
  const renderFloorSelector = () => {
    if (!mallLayout || mallLayout.length <= 1) return null;
    return (
      <View style={styles.floorSelectorContainer}>
        {mallLayout.map(floor => (
          <TouchableOpacity
            key={floor.level}
            style={[
              styles.floorButton,
              currentFloor?.level === floor.level && styles.activeFloorButton,
            ]}
            onPress={() => setCurrentFloor(floor)}
          >
            <Text style={[
              styles.floorButtonText,
              currentFloor?.level === floor.level && styles.activeFloorButtonText
            ]}>
              {floor.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderPOISelector = (type: 'origin' | 'destination') => {
    const selectedValue = type === 'origin' ? selectedOrigin : selectedDestination;
    // Filter POIs on current floor - check if coordinates has level property
    const poisOnCurrentFloor = currentFloor ? allPOIs.filter(p => 
      'level' in p.coordinates && p.coordinates.level === currentFloor.level
    ) : [];

    return (
      <View style={styles.selectorContainer}>
        <Text style={styles.selectorLabel}>{type === 'origin' ? 'Start Point' : 'Destination'}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.poiScrollView}>
          {poisOnCurrentFloor.map(poi => (
            <TouchableOpacity
              key={poi.id}
              style={[
                styles.poiChip,
                selectedValue?.id === poi.id && styles.selectedPoiChip,
              ]}
              onPress={() => handlePOISelect(poi, type)}
            >
              <Text style={styles.poiChipText}>{poi.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {selectedValue && <Text style={styles.selectedPoiText}>Selected: {selectedValue.name}</Text>}
      </View>
    );
  };

  const renderRouteDetails = () => {
    if (!currentRoute) return null;
    return (
      <View style={styles.routeDetailsContainer}>
        <Text style={styles.routeTitle}>Route to {selectedDestination?.name}</Text>
        <Text>Total Distance: {currentRoute.totalDistance.toFixed(0)}m</Text>
        <Text>Estimated Time: {(currentRoute.estimatedDuration / 60).toFixed(0)} min</Text>
        <Text>Accessible: {currentRoute.isAccessible ? 'Yes' : 'No'}</Text>
        <ScrollView style={styles.instructionsScroll}>
          {currentRoute.instructions?.map((step, index) => (
            <Text key={index} style={styles.instructionStep}>{`${index + 1}. ${step}`}</Text>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderPreferences = () => (
    <View style={styles.preferencesContainer}>
      <Text style={styles.preferencesTitle}>Navigation Preferences</Text>
      <View style={styles.preferenceItem}>
        <Text>Accessible Routes</Text>
        <TouchableOpacity onPress={() => handleSetPreference({ preferAccessibleRoutes: !userPreferences.preferAccessibleRoutes })}>
          <Ionicons name={userPreferences.preferAccessibleRoutes ? 'checkbox' : 'square-outline'} size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.preferenceItem}>
        <Text>Avoid Stairs</Text>
        <TouchableOpacity onPress={() => handleSetPreference({ avoidStairs: !userPreferences.avoidStairs })}>
          <Ionicons name={userPreferences.avoidStairs ? 'checkbox' : 'square-outline'} size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.preferenceItem}>
        <Text>Avoid Escalators</Text>
        <TouchableOpacity onPress={() => handleSetPreference({ avoidEscalators: !userPreferences.avoidEscalators })}>
          <Ionicons name={userPreferences.avoidEscalators ? 'checkbox' : 'square-outline'} size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading && !mallLayout) {
    return <ActivityIndicator size="large" style={styles.centered} />;
  }

  if (error) {
    return <Text style={[styles.centered, styles.errorText]}>{error}</Text>;
  }

  if (showARView && currentRoute) {
    // return <ARNavigatorView route={currentRoute} onNavigationComplete={stopNavigation} />;
    return (
        <View style={styles.arViewPlaceholder}>
            <Text style={styles.arViewText}>AR Navigation View (Placeholder)</Text>
            <Text>Displaying route to: {selectedDestination?.name}</Text>
            <TouchableOpacity style={styles.actionButton} onPress={stopNavigation}>
                <Text style={styles.actionButtonText}>End AR Navigation</Text>
            </TouchableOpacity>
        </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Mall Navigator - {indoorNavigationService.getMallLayout()?.name}</Text>
      
      {renderFloorSelector()}

      {currentFloor && currentFloor.mapImageUrl && (
        <Image source={{ uri: currentFloor.mapImageUrl }} style={styles.mapImage} resizeMode="contain" />
      )}

      {renderPOISelector('origin')}
      <TouchableOpacity style={styles.swapButton} onPress={swapOriginDestination}>
        <Ionicons name="swap-vertical" size={24} color="#007AFF" />
        <Text style={styles.swapButtonText}>Swap</Text>
      </TouchableOpacity>
      {renderPOISelector('destination')}

      {renderPreferences()}

      {isLoading && <ActivityIndicator style={{ marginVertical: 10 }} />}

      {currentRoute && !isNavigating && (
        <TouchableOpacity style={styles.actionButton} onPress={startNavigation}>
          <Ionicons name={enableAR ? 'camera' : 'walk'} size={20} color="white" />
          <Text style={styles.actionButtonText}>{enableAR ? 'Start AR Navigation' : 'Start Navigation'}</Text>
        </TouchableOpacity>
      )}

      {isNavigating && (
        <TouchableOpacity style={[styles.actionButton, styles.stopButton]} onPress={stopNavigation}>
          <Ionicons name="stop-circle" size={20} color="white" />
          <Text style={styles.actionButtonText}>Stop Navigation</Text>
        </TouchableOpacity>
      )}
      
      {renderRouteDetails()}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  floorSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  floorButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
  },
  activeFloorButton: {
    backgroundColor: '#007AFF',
  },
  floorButtonText: {
    color: '#333',
  },
  activeFloorButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  mapImage: {
    width: '100%',
    height: 200, // Adjust as needed
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectorContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
  },
  selectorLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#555',
  },
  poiScrollView: {
    marginBottom: 5,
  },
  poiChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#eee',
    borderRadius: 15,
    marginRight: 8,
  },
  selectedPoiChip: {
    backgroundColor: '#007AFF',
  },
  poiChipText: {
    color: '#333',
  },
  selectedPoiText: {
    marginTop: 5,
    fontStyle: 'italic',
    color: '#007AFF',
  },
  swapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginVertical: 5,
    backgroundColor: '#e7f0ff',
    borderRadius: 5,
  },
  swapButtonText: {
    marginLeft: 5,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  preferencesContainer: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
    marginBottom: 15,
  },
  preferencesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    marginVertical: 10,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  stopButton: {
    backgroundColor: '#FF3B30',
  },
  routeDetailsContainer: {
    marginTop: 15,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
  },
  routeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  instructionsScroll: {
    maxHeight: 150, // Limit height for scrollability
    marginTop: 10,
  },
  instructionStep: {
    fontSize: 14,
    marginBottom: 5,
    lineHeight: 20,
  },
  arViewPlaceholder: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#333',
  },
  arViewText: {
      color: 'white',
      fontSize: 20,
      marginBottom: 20,
  }
});

export default MallNavigator;
