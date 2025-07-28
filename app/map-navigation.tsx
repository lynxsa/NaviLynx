import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  ScrollView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '@/context/ThemeContext';
import { spacing, borderRadius, shadows } from '@/styles/modernTheme';

/**
 * OPERATION NAVIGATE - Screen 4: MapModeScreen
 * 
 * 2D map toggle view for AR navigation. Provides traditional map-based
 * navigation as an alternative to AR mode with detailed floor plans.
 */
export default function MapModeScreen() {
  const {
    venueId,
    venueName,
    fromLocationId,
    fromLocationName,
    toLocationId,
    toLocationName,
    estimatedTime,
    difficulty,
    currentStep
  } = useLocalSearchParams<{
    venueId: string;
    venueName: string;
    fromLocationId: string;
    fromLocationName: string;
    toLocationId: string;
    toLocationName: string;
    estimatedTime: string;
    difficulty: string;
    currentStep: string;
  }>();

  const { colors: themeColors, isDark } = useTheme();
  
  const [selectedFloor, setSelectedFloor] = useState('0');
  const [isFollowing, setIsFollowing] = useState(true);
  const [currentStepIndex] = useState(parseInt(currentStep || '0'));
  const [showDirections, setShowDirections] = useState(true);

  // Mock floor plans and locations
  const floors = [
    { id: '-1', name: 'B1', label: 'Basement 1' },
    { id: '0', name: 'GF', label: 'Ground Floor' },
    { id: '1', name: 'L1', label: 'Level 1' },
    { id: '2', name: 'L2', label: 'Level 2' },
    { id: '3', name: 'L3', label: 'Level 3' }
  ];

  const mapLocations = [
    {
      id: 'entrance_main',
      name: 'Main Entrance',
      floor: '0',
      x: 50,
      y: 80,
      type: 'entrance',
      color: '#10b981'
    },
    {
      id: 'food_court_main',
      name: 'Food Court',
      floor: '2',
      x: 70,
      y: 40,
      type: 'dining',
      color: '#f59e0b'
    },
    {
      id: 'electronics_zone',
      name: 'Electronics Zone',
      floor: '1',
      x: 40,
      y: 30,
      type: 'shopping',
      color: '#3b82f6'
    },
    {
      id: 'cinema_complex',
      name: 'Cinema Complex',
      floor: '3',
      x: 80,
      y: 20,
      type: 'entertainment',
      color: '#8b5cf6'
    },
    {
      id: 'parking_b1',
      name: 'Parking',
      floor: '-1',
      x: 30,
      y: 60,
      type: 'services',
      color: '#6b7280'
    }
  ];

  const navigationPath = [
    { x: 50, y: 80, floor: '0' },
    { x: 55, y: 70, floor: '0' },
    { x: 60, y: 50, floor: '0' },
    { x: 65, y: 45, floor: '2' },
    { x: 70, y: 40, floor: '2' }
  ];

  const directions = [
    {
      id: 1,
      instruction: 'Head straight towards the main corridor',
      distance: '15m',
      floor: '0',
      icon: 'arrow.up'
    },
    {
      id: 2,
      instruction: 'Turn left at the information desk',
      distance: '8m',
      floor: '0',
      icon: 'arrow.turn.up.left'
    },
    {
      id: 3,
      instruction: 'Take the escalator to Level 2',
      distance: '5m',
      floor: '0',
      icon: 'arrow.up.to.line'
    },
    {
      id: 4,
      instruction: 'Turn right after exiting escalator',
      distance: '12m',
      floor: '2',
      icon: 'arrow.turn.up.right'
    },
    {
      id: 5,
      instruction: 'You have arrived at your destination',
      distance: '0m',
      floor: '2',
      icon: 'checkmark.circle.fill'
    }
  ];

  const currentFloorLocations = mapLocations.filter(loc => loc.floor === selectedFloor);
  const currentFloorPath = navigationPath.filter(point => point.floor === selectedFloor);

  const switchToARMode = () => {
    Alert.alert(
      'Switch to AR Mode',
      'Continue navigation in augmented reality?',
      [
        { text: 'Stay in Map', style: 'cancel' },
        {
          text: 'Switch to AR',
          onPress: () => {
            router.push({
              pathname: '/ar-navigation',
              params: {
                venueId,
                venueName,
                fromLocationId,
                fromLocationName,
                toLocationId,
                toLocationName,
                estimatedTime,
                difficulty
              }
            });
          }
        }
      ]
    );
  };

  const renderMapPoint = (location: any) => {
    const isStartLocation = location.id === fromLocationId;
    const isEndLocation = location.id === toLocationId;
    
    return (
      <TouchableOpacity
        key={location.id}
        style={[
          styles.mapPoint,
          {
            left: `${location.x}%`,
            top: `${location.y}%`,
            backgroundColor: location.color,
          },
          isStartLocation && styles.startPoint,
          isEndLocation && styles.endPoint
        ]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          Alert.alert(location.name, `Floor: ${floors.find(f => f.id === location.floor)?.label}`);
        }}
      >
        <IconSymbol
          name={isStartLocation ? 'location' : isEndLocation ? 'star.fill' : 'storefront'}
          size={isStartLocation || isEndLocation ? 16 : 12}
          color="#ffffff"
        />
      </TouchableOpacity>
    );
  };

  const renderPathSegment = (point: any, index: number) => {
    if (index === currentFloorPath.length - 1) return null;
    
    const nextPoint = currentFloorPath[index + 1];
    const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * 180 / Math.PI;
    const distance = Math.sqrt(
      Math.pow(nextPoint.x - point.x, 2) + Math.pow(nextPoint.y - point.y, 2)
    );

    return (
      <View
        key={`path-${index}`}
        style={[
          styles.pathSegment,
          {
            left: `${point.x}%`,
            top: `${point.y}%`,
            width: `${distance}%`,
            transform: [{ rotate: `${angle}deg` }]
          }
        ]}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: themeColors.background }]}>
        <TouchableOpacity
          style={[styles.headerButton, { backgroundColor: isDark ? '#374151' : '#f3f4f6' }]}
          onPress={() => router.back()}
        >
          <IconSymbol name="chevron.left" size={24} color={themeColors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: themeColors.text }]}>
            Map Navigation
          </Text>
          <Text style={[styles.headerSubtitle, { color: themeColors.textSecondary }]}>
            {fromLocationName} → {toLocationName}
          </Text>
        </View>
        
        <TouchableOpacity
          style={[styles.headerButton, { backgroundColor: '#8b5cf6' }]}
          onPress={switchToARMode}
        >
          <IconSymbol name="camera.viewfinder" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Floor Selector */}
        <View style={styles.floorSelector}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Select Floor
          </Text>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.floorsContainer}
          >
            {floors.map((floor) => (
              <TouchableOpacity
                key={floor.id}
                style={[
                  styles.floorChip,
                  { backgroundColor: isDark ? '#374151' : '#f3f4f6' },
                  selectedFloor === floor.id && styles.selectedFloor
                ]}
                onPress={() => {
                  setSelectedFloor(floor.id);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Text style={[
                  styles.floorText,
                  { color: selectedFloor === floor.id ? '#ffffff' : themeColors.text }
                ]}>
                  {floor.name}
                </Text>
                <Text style={[
                  styles.floorLabel,
                  { color: selectedFloor === floor.id ? 'rgba(255,255,255,0.8)' : themeColors.textSecondary }
                ]}>
                  {floor.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Map View */}
        <View style={[styles.mapContainer, { backgroundColor: isDark ? '#1f2937' : '#ffffff' }]}>
          <View style={styles.mapHeader}>
            <Text style={[styles.mapTitle, { color: themeColors.text }]}>
              {floors.find(f => f.id === selectedFloor)?.label} Map
            </Text>
            
            <TouchableOpacity
              style={[styles.mapAction, { backgroundColor: isFollowing ? '#10b981' : '#6b7280' }]}
              onPress={() => setIsFollowing(!isFollowing)}
            >
              <IconSymbol name="location" size={16} color="#ffffff" />
              <Text style={styles.mapActionText}>
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Floor Plan */}
          <View style={styles.floorPlan}>
            {/* Grid Background */}
            <View style={styles.gridBackground}>
              {[...Array(10)].map((_, i) => (
                <View key={`h-${i}`} style={[styles.gridLine, styles.horizontalLine, { top: `${i * 10}%` }]} />
              ))}
              {[...Array(10)].map((_, i) => (
                <View key={`v-${i}`} style={[styles.gridLine, styles.verticalLine, { left: `${i * 10}%` }]} />
              ))}
            </View>
            
            {/* Navigation Path */}
            {currentFloorPath.map((point, index) => renderPathSegment(point, index))}
            
            {/* Location Points */}
            {currentFloorLocations.map(renderMapPoint)}
            
            {/* Floor Plan Elements */}
            <View style={[styles.roomElement, styles.room1]} />
            <View style={[styles.roomElement, styles.room2]} />
            <View style={[styles.roomElement, styles.room3]} />
            <View style={[styles.corridorElement, styles.corridor1]} />
            <View style={[styles.corridorElement, styles.corridor2]} />
          </View>
        </View>

        {/* Toggle Directions */}
        <TouchableOpacity
          style={[styles.toggleDirections, { backgroundColor: isDark ? '#374151' : '#f3f4f6' }]}
          onPress={() => setShowDirections(!showDirections)}
        >
          <IconSymbol 
            name={showDirections ? 'chevron.down' : 'arrow.up'} 
            size={20} 
            color={themeColors.text} 
          />
          <Text style={[styles.toggleText, { color: themeColors.text }]}>
            Turn-by-Turn Directions
          </Text>
        </TouchableOpacity>

        {/* Directions List */}
        {showDirections && (
          <ScrollView style={styles.directionsContainer} showsVerticalScrollIndicator={false}>
            {directions.map((direction, index) => (
              <View
                key={direction.id}
                style={[
                  styles.directionItem,
                  { backgroundColor: isDark ? '#1f2937' : '#ffffff' },
                  index === currentStepIndex && styles.currentDirection
                ]}
              >
                <View style={[
                  styles.directionIcon,
                  { backgroundColor: index === currentStepIndex ? '#8b5cf6' : '#6b7280' }
                ]}>
                  <IconSymbol name={'arrow.turn.up.right' as any} size={16} color="#ffffff" />
                </View>
                
                <View style={styles.directionContent}>
                  <Text style={[
                    styles.directionText,
                    { color: themeColors.text },
                    index === currentStepIndex && styles.currentDirectionText
                  ]}>
                    {direction.instruction}
                  </Text>
                  
                  <View style={styles.directionMeta}>
                    <Text style={[styles.directionDistance, { color: themeColors.textSecondary }]}>
                      {direction.distance}
                    </Text>
                    <Text style={[styles.directionFloor, { color: themeColors.textSecondary }]}>
                      • Floor {floors.find(f => f.id === direction.floor)?.name}
                    </Text>
                  </View>
                </View>
                
                {index === currentStepIndex && (
                  <View style={styles.currentIndicator}>
                    <IconSymbol name="location.fill" size={16} color="#8b5cf6" />
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Bottom Actions */}
      <View style={[styles.bottomActions, { backgroundColor: themeColors.background }]}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#ef4444' }]}
          onPress={() => {
            Alert.alert(
              'Stop Navigation',
              'Are you sure you want to stop navigation?',
              [
                { text: 'Continue', style: 'cancel' },
                { text: 'Stop', style: 'destructive', onPress: () => router.back() }
              ]
            );
          }}
        >
          <IconSymbol name="xmark" size={20} color="#ffffff" />
          <Text style={styles.actionButtonText}>Stop</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryAction]}
          onPress={switchToARMode}
        >
          <LinearGradient
            colors={['#8b5cf6', '#a855f7']}
            style={styles.actionButtonGradient}
          >
            <IconSymbol name="camera.viewfinder" size={20} color="#ffffff" />
            <Text style={styles.actionButtonText}>Switch to AR</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#10b981' }]}
          onPress={() => {
            Alert.alert('Share Location', 'Share your current navigation progress?');
          }}
        >
          <IconSymbol name="square.and.arrow.up" size={20} color="#ffffff" />
          <Text style={styles.actionButtonText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    ...shadows.sm,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    marginHorizontal: spacing.md,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: spacing.xs,
  },

  // Content Styles
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },

  // Floor Selector Styles
  floorSelector: {
    marginVertical: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  floorsContainer: {
    gap: spacing.sm,
  },
  floorChip: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    minWidth: 80,
  },
  selectedFloor: {
    backgroundColor: '#8b5cf6',
  },
  floorText: {
    fontSize: 16,
    fontWeight: '700',
  },
  floorLabel: {
    fontSize: 12,
    marginTop: spacing.xs,
  },

  // Map Container Styles
  mapContainer: {
    height: 300,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  mapAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  mapActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },

  // Floor Plan Styles
  floorPlan: {
    flex: 1,
    borderRadius: borderRadius.lg,
    backgroundColor: '#f8fafc',
    position: 'relative',
    overflow: 'hidden',
  },
  gridBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: '#e2e8f0',
  },
  horizontalLine: {
    left: 0,
    right: 0,
    height: 1,
  },
  verticalLine: {
    top: 0,
    bottom: 0,
    width: 1,
  },

  // Map Elements
  mapPoint: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    ...shadows.sm,
  },
  startPoint: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#ffffff',
    transform: [{ translateX: -16 }, { translateY: -16 }],
  },
  endPoint: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#ffffff',
    transform: [{ translateX: -16 }, { translateY: -16 }],
  },
  pathSegment: {
    position: 'absolute',
    height: 4,
    backgroundColor: '#8b5cf6',
    borderRadius: 2,
    transformOrigin: '0 50%',
  },

  // Room Elements
  roomElement: {
    position: 'absolute',
    backgroundColor: '#cbd5e1',
    borderRadius: borderRadius.md,
  },
  room1: {
    left: '10%',
    top: '20%',
    width: '25%',
    height: '30%',
  },
  room2: {
    right: '10%',
    top: '20%',
    width: '25%',
    height: '30%',
  },
  room3: {
    left: '35%',
    bottom: '20%',
    width: '30%',
    height: '25%',
  },
  corridorElement: {
    position: 'absolute',
    backgroundColor: '#e2e8f0',
    borderRadius: borderRadius.sm,
  },
  corridor1: {
    left: '10%',
    top: '45%',
    right: '10%',
    height: '10%',
  },
  corridor2: {
    left: '45%',
    top: '20%',
    width: '10%',
    bottom: '20%',
  },

  // Directions Styles
  toggleDirections: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
  },
  directionsContainer: {
    flex: 1,
    marginBottom: spacing.lg,
  },
  directionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  currentDirection: {
    borderWidth: 2,
    borderColor: '#8b5cf6',
  },
  directionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  directionContent: {
    flex: 1,
  },
  directionText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  currentDirectionText: {
    fontWeight: '700',
  },
  directionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  directionDistance: {
    fontSize: 14,
    fontWeight: '500',
  },
  directionFloor: {
    fontSize: 12,
    marginLeft: spacing.xs,
  },
  currentIndicator: {
    marginLeft: spacing.md,
  },

  // Bottom Actions Styles
  bottomActions: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.lg,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.xs,
  },
  primaryAction: {
    overflow: 'hidden',
  },
  actionButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
});
