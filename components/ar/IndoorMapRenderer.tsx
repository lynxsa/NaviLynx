import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { BlurView } from '@/components/ui/BlurView';
import { colors, spacing, borderRadius } from '@/styles/modernTheme';
import { Route, MallLayout, PointOfInterest, IndoorCoordinates } from '@/types/navigation';

interface IndoorMapRendererProps {
  venue: any; // Using any for now since we need to adapt venue types
  isVisible: boolean;
  onDestinationSelect?: (poi: PointOfInterest) => void;
  onRouteFound?: (route: Route) => void;
}

const IndoorMapRenderer: React.FC<IndoorMapRendererProps> = ({
  venue,
  isVisible,
  onDestinationSelect,
  onRouteFound
}) => {
  const { theme } = useTheme();
  const isDark = theme.dark;
  const [currentFloor, setCurrentFloor] = useState(0);
  const [selectedPOI, setSelectedPOI] = useState<PointOfInterest | null>(null);
  const [showPOIList, setShowPOIList] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null);

  // Type guard to check if coordinates are indoor coordinates
  const isIndoorCoordinates = (coords: any): coords is IndoorCoordinates => {
    return coords && typeof coords.x === 'number' && typeof coords.y === 'number' && typeof coords.level === 'number';
  };

  // Mock mall layout for demo purposes
  const mockMallLayout: MallLayout = {
    id: venue?.id || 'mock-mall',
    name: venue?.name || 'Mock Mall',
    floors: [
      {
        level: 0,
        name: 'Ground Floor',
        mapImageUrl: undefined,
        pois: [
          {
            id: 'entrance-main',
            name: 'Main Entrance',
            type: 'exit',
            coordinates: { x: 50, y: 90, level: 0 },
            description: 'Main mall entrance'
          },
          {
            id: 'store-electronics',
            name: 'Electronics Store',
            type: 'store',
            coordinates: { x: 30, y: 60, level: 0 },
            description: 'Latest electronics and gadgets',
            storeDetails: {
              category: 'Electronics',
              promotions: ['20% off smartphones']
            }
          },
          {
            id: 'food-court',
            name: 'Food Court',
            type: 'custom',
            coordinates: { x: 70, y: 40, level: 0 },
            description: 'Various dining options'
          },
          {
            id: 'restroom-gf',
            name: 'Restrooms',
            type: 'restroom',
            coordinates: { x: 20, y: 20, level: 0 },
            description: 'Public restrooms'
          },
          {
            id: 'elevator-main',
            name: 'Main Elevator',
            type: 'elevator',
            coordinates: { x: 50, y: 50, level: 0 },
            description: 'Access to all floors'
          }
        ],
        paths: [
          {
            fromPOIId: 'entrance-main',
            toPOIId: 'store-electronics',
            distance: 25,
            type: 'walkway',
            isAccessible: true,
            durationEstimate: 30
          },
          {
            fromPOIId: 'store-electronics',
            toPOIId: 'elevator-main',
            distance: 20,
            type: 'walkway',
            isAccessible: true,
            durationEstimate: 25
          }
        ]
      },
      {
        level: 1,
        name: 'First Floor',
        mapImageUrl: undefined,
        pois: [
          {
            id: 'store-fashion',
            name: 'Fashion Boutique',
            type: 'store',
            coordinates: { x: 40, y: 70, level: 1 },
            description: 'Latest fashion trends',
            storeDetails: {
              category: 'Fashion',
              promotions: ['Buy 2 Get 1 Free']
            }
          },
          {
            id: 'elevator-main-l1',
            name: 'Main Elevator',
            type: 'elevator',
            coordinates: { x: 50, y: 50, level: 1 },
            description: 'Access to all floors'
          }
        ],
        paths: [
          {
            fromPOIId: 'elevator-main-l1',
            toPOIId: 'store-fashion',
            distance: 15,
            type: 'walkway',
            isAccessible: true,
            durationEstimate: 20
          }
        ]
      }
    ]
  };

  const getCurrentFloorData = () => {
    return mockMallLayout.floors.find(floor => floor.level === currentFloor);
  };

  const handlePOISelect = (poi: PointOfInterest) => {
    setSelectedPOI(poi);
    onDestinationSelect?.(poi);
    setShowPOIList(false);
    
    // Generate a simple route for demo
    const mockRoute: Route = {
      id: `route-to-${poi.id}`,
      originPOIId: 'entrance-main',
      destinationPOIId: poi.id,
      segments: [],
      totalDistance: 50,
      estimatedDuration: 120,
      isAccessible: true,
      preferenceType: 'shortest',
      instructions: [`Walk to ${poi.name}`, 'You have arrived at your destination']
    };
    
    setCurrentRoute(mockRoute);
    onRouteFound?.(mockRoute);
  };

  const renderFloorSelector = () => (
    <BlurView style={styles.floorSelector} tint={isDark ? 'dark' : 'light'} intensity={80}>
      <Text style={[styles.floorSelectorTitle, { color: theme.colors.text }]}>
        Floor
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {mockMallLayout.floors.map((floor) => (
          <TouchableOpacity
            key={floor.level}
            style={[
              styles.floorButton,
              currentFloor === floor.level && { backgroundColor: colors.primary }
            ]}
            onPress={() => setCurrentFloor(floor.level)}
          >
            <Text style={[
              styles.floorButtonText,
              { color: currentFloor === floor.level ? 'white' : theme.colors.text }
            ]}>
              {floor.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </BlurView>
  );

  const renderPOIMarker = (poi: PointOfInterest) => {
    const getIconName = () => {
      switch (poi.type) {
        case 'store': return 'bag';
        case 'restroom': return 'person';
        case 'elevator': return 'arrow.up';
        case 'escalator': return 'arrow.up';
        case 'exit': return 'arrow.right';
        case 'info': return 'info.circle';
        default: return 'map';
      }
    };

    const isSelected = selectedPOI?.id === poi.id;

    return (
      <TouchableOpacity
        key={poi.id}
        style={[
          styles.poiMarker,
          {
            left: `${isIndoorCoordinates(poi.coordinates) ? poi.coordinates.x : 50}%`,
            top: `${isIndoorCoordinates(poi.coordinates) ? poi.coordinates.y : 50}%`,
            backgroundColor: isSelected ? colors.primary : colors.surface
          }
        ]}
        onPress={() => handlePOISelect(poi)}
      >
        <IconSymbol
          name={getIconName()}
          size={16}
          color={isSelected ? 'white' : colors.primary}
        />
        {isSelected && (
          <View style={styles.poiLabel}>
            <Text style={[styles.poiLabelText, { color: theme.colors.text }]}>
              {poi.name}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderIndoorMap = () => {
    const floorData = getCurrentFloorData();
    if (!floorData) return null;

    return (
      <View style={styles.mapContainer}>
        {/* Map Background */}
        <View style={[styles.mapBackground, { backgroundColor: theme.colors.surface }]}>
          {/* Grid lines for visual reference */}
          {Array.from({ length: 10 }, (_, i) => (
            <View key={`h-${i}`} style={[styles.gridLine, styles.horizontalLine, { top: `${i * 10}%` }]} />
          ))}
          {Array.from({ length: 10 }, (_, i) => (
            <View key={`v-${i}`} style={[styles.gridLine, styles.verticalLine, { left: `${i * 10}%` }]} />
          ))}
          
          {/* POI Markers */}
          {floorData.pois.map(poi => renderPOIMarker(poi))}
          
          {/* Route visualization */}
          {currentRoute && (
            <View style={styles.routePath}>
              {/* Simple route line for demo */}
              <View style={[styles.routeLine, { backgroundColor: colors.primary }]} />
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderPOIList = () => (
    <BlurView style={styles.poiListContainer} tint={isDark ? 'dark' : 'light'} intensity={95}>
      <View style={styles.poiListHeader}>
        <Text style={[styles.poiListTitle, { color: theme.colors.text }]}>
          Points of Interest
        </Text>
        <TouchableOpacity onPress={() => setShowPOIList(false)}>
          <IconSymbol name="xmark" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.poiList}>
        {getCurrentFloorData()?.pois.map(poi => (
          <TouchableOpacity
            key={poi.id}
            style={[styles.poiListItem, { borderBottomColor: theme.colors.border }]}
            onPress={() => handlePOISelect(poi)}
          >
            <View style={styles.poiItemInfo}>
              <Text style={[styles.poiItemName, { color: theme.colors.text }]}>
                {poi.name}
              </Text>
              <Text style={[styles.poiItemDescription, { color: theme.colors.textSecondary }]}>
                {poi.description}
              </Text>
              {poi.storeDetails?.promotions && (
                <Text style={[styles.poiItemPromo, { color: colors.primary }]}>
                  {poi.storeDetails.promotions[0]}
                </Text>
              )}
            </View>
            <IconSymbol name="chevron.right" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </BlurView>
  );

  if (!isVisible) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Floor Selector */}
      {renderFloorSelector()}
      
      {/* Indoor Map */}
      {renderIndoorMap()}
      
      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: colors.primary }]}
          onPress={() => setShowPOIList(true)}
        >
          <IconSymbol name="list.bullet" size={20} color="white" />
          <Text style={styles.controlButtonText}>Browse</Text>
        </TouchableOpacity>
        
        {selectedPOI && (
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: colors.surface }]}
            onPress={() => setSelectedPOI(null)}
          >
            <IconSymbol name="xmark" size={20} color={theme.colors.text} />
            <Text style={[styles.controlButtonText, { color: theme.colors.text }]}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* POI List Modal */}
      {showPOIList && renderPOIList()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  floorSelector: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 10,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  floorSelectorTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  floorButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  floorButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  mapContainer: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: 120, // Account for floor selector
  },
  mapBackground: {
    flex: 1,
    borderRadius: borderRadius.lg,
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  horizontalLine: {
    width: '100%',
    height: 1,
  },
  verticalLine: {
    height: '100%',
    width: 1,
  },
  poiMarker: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -16 }, { translateY: -16 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  poiLabel: {
    position: 'absolute',
    top: 40,
    left: -40,
    width: 80,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  poiLabelText: {
    fontSize: 10,
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  routePath: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  routeLine: {
    position: 'absolute',
    width: 2,
    height: '50%',
    top: '25%',
    left: '50%',
  },
  controls: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    gap: spacing.md,
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  controlButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  poiListContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.lg,
  },
  poiListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  poiListTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  poiList: {
    flex: 1,
  },
  poiListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  poiItemInfo: {
    flex: 1,
  },
  poiItemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  poiItemDescription: {
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  poiItemPromo: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default IndoorMapRenderer;
