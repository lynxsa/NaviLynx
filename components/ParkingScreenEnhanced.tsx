import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { Spacing, BorderRadius, Typography, Shadows } from '@/constants/Theme';
import GlassCard from '@/components/GlassCard';

interface ParkingSpot {
  id: string;
  name: string;
  location: string;
  availability: 'available' | 'occupied' | 'reserved';
  cost: string;
  distance: string;
  features: string[];
  floor?: string;
  spotNumber?: string;
  image?: string;
  timeLimit?: string;
}

interface SavedSpot {
  id: string;
  location: string;
  image: string;
  notes: string;
  timestamp: Date;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

const MOCK_AVAILABLE_SPOTS: ParkingSpot[] = [
  {
    id: '1',
    name: 'Level P1 - Section A',
    location: 'Sandton City Mall',
    availability: 'available',
    cost: 'R15/hour',
    distance: '50m',
    features: ['Covered', 'CCTV', 'Close to Entrance'],
    floor: 'P1',
    spotNumber: 'A-23',
    timeLimit: '4 hours',
  },
  {
    id: '2',
    name: 'Level P2 - Section B',
    location: 'Sandton City Mall',
    availability: 'available',
    cost: 'R12/hour',
    distance: '120m',
    features: ['Covered', 'Security Guard'],
    floor: 'P2',
    spotNumber: 'B-45',
    timeLimit: '8 hours',
  },
  {
    id: '3',
    name: 'Ground Level - VIP',
    location: 'Sandton City Mall',
    availability: 'available',
    cost: 'R25/hour',
    distance: '30m',
    features: ['Premium', 'Valet Service', 'Reserved'],
    floor: 'Ground',
    spotNumber: 'VIP-01',
    timeLimit: 'No limit',
  },
];

const MOCK_SAVED_SPOTS: SavedSpot[] = [
  {
    id: '1',
    location: 'Sandton City Mall - Level P1',
    image: 'https://picsum.photos/400/300?random=1',
    notes: 'Near the main entrance, easy to find',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
];

interface ParkingSpotCardProps {
  spot: ParkingSpot;
  onReserve: (spot: ParkingSpot) => void;
  onNavigate: (spot: ParkingSpot) => void;
}

const ParkingSpotCard: React.FC<ParkingSpotCardProps> = ({ 
  spot, 
  onReserve, 
  onNavigate 
}) => {
  const { colors } = useTheme();
  const { getResponsiveValue } = useResponsive();

  const availabilityColor = {
    available: colors.success || '#4CAF50',
    occupied: colors.error || '#F44336',
    reserved: colors.warning || '#FF9800',
  };

  const availabilityIcon = {
    available: 'checkmark.circle.fill',
    occupied: 'xmark.circle.fill',
    reserved: 'clock.fill',
  };

  return (
    <GlassCard 
      variant="elevated" 
      style={StyleSheet.flatten([
        styles.parkingSpotCard,
        { marginBottom: getResponsiveValue({ sm: 12, md: 16, lg: 20 }) }
      ])}
    >
      <View style={styles.spotHeader}>
        <View style={styles.spotInfo}>
          <Text style={[styles.spotName, { 
            color: colors.text,
            fontSize: getResponsiveValue({ sm: 16, md: 18, lg: 20 }),
          }]}>
            {spot.name}
          </Text>
          <View style={styles.spotLocation}>
            <IconSymbol 
              name="location.fill" 
              size={getResponsiveValue({ sm: 14, md: 16, lg: 18 })} 
              color={colors.mutedForeground} 
            />
            <Text style={[styles.locationText, { 
              color: colors.mutedForeground,
              fontSize: getResponsiveValue({ sm: 12, md: 14, lg: 16 }),
            }]}>
              {spot.location}
            </Text>
          </View>
        </View>
        
        <View style={[styles.availabilityBadge, { 
          backgroundColor: availabilityColor[spot.availability] + '20' 
        }]}>
          <IconSymbol 
            name={availabilityIcon[spot.availability] as any}
            size={getResponsiveValue({ sm: 14, md: 16, lg: 18 })}
            color={availabilityColor[spot.availability]}
          />
          <Text style={[styles.availabilityText, { 
            color: availabilityColor[spot.availability],
            fontSize: getResponsiveValue({ sm: 10, md: 12, lg: 14 }),
          }]}>
            {spot.availability.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.spotDetails}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <IconSymbol name="car.fill" size={16} color={colors.mutedForeground} />
            <Text style={[styles.detailText, { color: colors.text }]}>
              {spot.spotNumber || 'TBD'}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <IconSymbol name="location" size={16} color={colors.mutedForeground} />
            <Text style={[styles.detailText, { color: colors.text }]}>
              {spot.distance}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <IconSymbol name="creditcard.fill" size={16} color={colors.mutedForeground} />
            <Text style={[styles.detailText, { color: colors.text }]}>
              {spot.cost}
            </Text>
          </View>
        </View>

        {spot.timeLimit && (
          <View style={styles.timeLimit}>
            <IconSymbol name="clock" size={14} color={colors.mutedForeground} />
            <Text style={[styles.timeLimitText, { color: colors.mutedForeground }]}>
              Max: {spot.timeLimit}
            </Text>
          </View>
        )}

        <View style={styles.featureContainer}>
          {spot.features.map((feature, index) => (
            <View key={index} style={[styles.featureTag, { 
              backgroundColor: colors.primary + '20',
              borderColor: colors.primary + '40',
            }]}>
              <Text style={[styles.featureText, { 
                color: colors.primary,
                fontSize: getResponsiveValue({ sm: 10, md: 11, lg: 12 }),
              }]}>
                {feature}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.spotActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.navigateButton, { 
            backgroundColor: colors.secondary,
            flex: 1,
          }]}
          onPress={() => onNavigate(spot)}
        >
          <IconSymbol name="location.fill" size={16} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Navigate</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.reserveButton, { 
            backgroundColor: spot.availability === 'available' ? colors.primary : colors.mutedForeground,
            flex: 1,
            marginLeft: Spacing.sm,
          }]}
          onPress={() => onReserve(spot)}
          disabled={spot.availability !== 'available'}
        >
          <IconSymbol 
            name={spot.availability === 'available' ? 'checkmark.circle.fill' : 'lock.fill'} 
            size={16} 
            color="#FFFFFF" 
          />
          <Text style={styles.actionButtonText}>
            {spot.availability === 'available' ? 'Reserve' : 'Unavailable'}
          </Text>
        </TouchableOpacity>
      </View>
    </GlassCard>
  );
};

interface SavedSpotCardProps {
  spot: SavedSpot;
  onNavigate: (spot: SavedSpot) => void;
  onDelete: (spot: SavedSpot) => void;
}

const SavedSpotCard: React.FC<SavedSpotCardProps> = ({ 
  spot, 
  onNavigate, 
  onDelete 
}) => {
  const { colors } = useTheme();
  const { getResponsiveValue } = useResponsive();

  const timeAgo = useMemo(() => {
    const now = new Date();
    const diff = now.getTime() - spot.timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ago`;
    }
    return `${minutes}m ago`;
  }, [spot.timestamp]);

  return (
    <GlassCard 
      variant="subtle" 
      style={StyleSheet.flatten([
        styles.savedSpotCard,
        { marginBottom: getResponsiveValue({ sm: 12, md: 16, lg: 20 }) }
      ])}
    >
      <View style={styles.savedSpotContent}>
        {spot.image && (
          <Image source={{ uri: spot.image }} style={styles.spotImage} />
        )}
        
        <View style={styles.savedSpotInfo}>
          <Text style={[styles.savedSpotLocation, { 
            color: colors.text,
            fontSize: getResponsiveValue({ sm: 14, md: 16, lg: 18 }),
          }]}>
            {spot.location}
          </Text>
          
          <Text style={[styles.savedSpotNotes, { 
            color: colors.mutedForeground,
            fontSize: getResponsiveValue({ sm: 12, md: 14, lg: 16 }),
          }]}>
            {spot.notes}
          </Text>
          
          <Text style={[styles.savedSpotTime, { 
            color: colors.mutedForeground,
            fontSize: getResponsiveValue({ sm: 10, md: 12, lg: 14 }),
          }]}>
            Saved {timeAgo}
          </Text>
        </View>
      </View>

      <View style={styles.savedSpotActions}>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: colors.primary + '20' }]}
          onPress={() => onNavigate(spot)}
        >
          <IconSymbol name="location.fill" size={16} color={colors.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: colors.error + '20' }]}
          onPress={() => onDelete(spot)}
        >
          <IconSymbol name="trash.fill" size={16} color={colors.error} />
        </TouchableOpacity>
      </View>
    </GlassCard>
  );
};

export default function ParkingScreenEnhanced() {
  const { colors } = useTheme();
  const { getResponsiveValue } = useResponsive();

  // State
  const [activeTab, setActiveTab] = useState<'available' | 'saved'>('available');
  const [availableSpots] = useState<ParkingSpot[]>(MOCK_AVAILABLE_SPOTS);
  const [savedSpots, setSavedSpots] = useState<SavedSpot[]>(MOCK_SAVED_SPOTS);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);

  // Responsive values
  const headerPadding = getResponsiveValue({ sm: 16, md: 24, lg: 32 });
  const contentPadding = getResponsiveValue({ sm: 16, md: 20, lg: 24 });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate API refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleReserveSpot = useCallback((spot: ParkingSpot) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedSpot(spot);
    
    Alert.alert(
      'Reserve Spot',
      `Would you like to reserve ${spot.name} for ${spot.cost}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reserve',
          onPress: () => {
            Alert.alert('Success', `${spot.name} has been reserved!`);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        }
      ]
    );
  }, []);

  const handleNavigateToSpot = useCallback((spot: ParkingSpot | SavedSpot) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'AR Navigation',
      'Start AR navigation to this parking spot?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start AR',
          onPress: () => {
            router.push('/ar-navigator');
          }
        }
      ]
    );
  }, []);

  const handleSaveCurrentLocation = useCallback(async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is needed to save parking spots.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newSpot: SavedSpot = {
          id: Date.now().toString(),
          location: 'Current Location',
          image: result.assets[0].uri,
          notes: 'Saved parking spot',
          timestamp: new Date(),
        };

        setSavedSpots(prev => [newSpot, ...prev]);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Success', 'Parking spot saved successfully!');
      }
    } catch (error) {
      console.error('Error saving parking spot:', error);
      Alert.alert('Error', 'Failed to save parking spot. Please try again.');
    }
  }, []);

  const handleDeleteSavedSpot = useCallback((spot: SavedSpot) => {
    Alert.alert(
      'Delete Spot',
      'Are you sure you want to delete this saved spot?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setSavedSpots(prev => prev.filter(s => s.id !== spot.id));
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        }
      ]
    );
  }, []);

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={[styles.header, { paddingHorizontal: headerPadding }]}
      >
        <SafeAreaView>
          <View style={styles.headerContent}>
            <View>
              <ThemedText style={[styles.headerTitle, {
                fontSize: getResponsiveValue({ sm: 24, md: 28, lg: 32 }),
              }]}>
                Smart Parking
              </ThemedText>
              <ThemedText style={[styles.headerSubtitle, {
                fontSize: getResponsiveValue({ sm: 14, md: 16, lg: 18 }),
              }]}>
                Find parking easily
              </ThemedText>
            </View>

            <TouchableOpacity
              style={[styles.saveLocationButton, {
                width: getResponsiveValue({ sm: 48, md: 56, lg: 64 }),
                height: getResponsiveValue({ sm: 48, md: 56, lg: 64 }),
              }]}
              onPress={handleSaveCurrentLocation}
            >
              <IconSymbol 
                name="camera.fill" 
                size={getResponsiveValue({ sm: 20, md: 24, lg: 28 })} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Tab Navigation */}
      <View style={[styles.tabContainer, { paddingHorizontal: contentPadding }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'available' && { backgroundColor: colors.primary },
            { paddingVertical: getResponsiveValue({ sm: 12, md: 16, lg: 20 }) }
          ]}
          onPress={() => setActiveTab('available')}
        >
          <IconSymbol 
            name="car.fill" 
            size={getResponsiveValue({ sm: 16, md: 18, lg: 20 })} 
            color={activeTab === 'available' ? '#FFFFFF' : colors.text} 
          />
          <Text style={[
            styles.tabText,
            { 
              color: activeTab === 'available' ? '#FFFFFF' : colors.text,
              fontSize: getResponsiveValue({ sm: 14, md: 16, lg: 18 }),
            }
          ]}>
            Available ({availableSpots.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'saved' && { backgroundColor: colors.primary },
            { paddingVertical: getResponsiveValue({ sm: 12, md: 16, lg: 20 }) }
          ]}
          onPress={() => setActiveTab('saved')}
        >
          <IconSymbol 
            name="bookmark.fill" 
            size={getResponsiveValue({ sm: 16, md: 18, lg: 20 })} 
            color={activeTab === 'saved' ? '#FFFFFF' : colors.text} 
          />
          <Text style={[
            styles.tabText,
            { 
              color: activeTab === 'saved' ? '#FFFFFF' : colors.text,
              fontSize: getResponsiveValue({ sm: 14, md: 16, lg: 18 }),
            }
          ]}>
            Saved ({savedSpots.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={[styles.content, { paddingHorizontal: contentPadding }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {activeTab === 'available' ? (
          <View style={styles.availableSection}>
            {availableSpots.map((spot) => (
              <ParkingSpotCard
                key={spot.id}
                spot={spot}
                onReserve={handleReserveSpot}
                onNavigate={handleNavigateToSpot}
              />
            ))}
          </View>
        ) : (
          <View style={styles.savedSection}>
            {savedSpots.length === 0 ? (
              <GlassCard style={styles.emptyState}>
                <IconSymbol name="bookmark" size={48} color={colors.mutedForeground} />
                <ThemedText style={[styles.emptyStateText, { color: colors.text }]}>
                  You have no saved spots
                </ThemedText>
                <ThemedText style={[styles.emptyStateSubtext, { color: colors.mutedForeground }]}>
                  Save your first parking spot to see it here.
                </ThemedText>
                <TouchableOpacity
                  style={[styles.saveFirstSpotButton, { backgroundColor: colors.primary }]}
                  onPress={handleSaveCurrentLocation}
                >
                  <IconSymbol name="camera.fill" size={16} color="#FFFFFF" />
                  <Text style={styles.saveFirstSpotText}>Save First Spot</Text>
                </TouchableOpacity>
              </GlassCard>
            ) : (
              savedSpots.map((spot) => (
                <SavedSpotCard
                  key={spot.id}
                  spot={spot}
                  onNavigate={handleNavigateToSpot}
                  onDelete={handleDeleteSavedSpot}
                />
              ))
            )}
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* AR Navigation Prompt */}
      {selectedSpot && (
        <View style={[styles.arPrompt, { backgroundColor: colors.primary }]}>
          <IconSymbol name="arkit" size={24} color="#FFFFFF" />
          <Text style={styles.arPromptText}>
            Start AR navigation to {selectedSpot.name}?
          </Text>
          <TouchableOpacity
            style={[styles.arButton, { backgroundColor: '#FFFFFF' }]}
            onPress={() => router.push('/ar-navigator')}
          >
            <Text style={[styles.arButtonText, { color: colors.primary }]}>
              Start AR
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontWeight: "700",
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    color: '#FFFFFF',
    opacity: 0.9,
    fontWeight: "500",
  },
  saveLocationButton: {
    backgroundColor: '#FFFFFF20',
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.medium,
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    gap: Spacing.xs,
    ...Shadows.small,
  },
  tabText: {
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  availableSection: {
    gap: Spacing.md,
  },
  savedSection: {
    gap: Spacing.md,
  },
  parkingSpotCard: {
    padding: Spacing.lg,
  },
  spotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  spotInfo: {
    flex: 1,
  },
  spotName: {
    fontWeight: "700",
    marginBottom: Spacing.xs,
  },
  spotLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  locationText: {
    fontWeight: "500",
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  availabilityText: {
    fontWeight: "700",
  },
  spotDetails: {
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  detailText: {
    fontSize: 14,
    fontWeight: "500",
  },
  timeLimit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  timeLimitText: {
    fontSize: 12,
    fontWeight: "500",
  },
  featureContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  featureTag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  featureText: {
    fontWeight: "500",
  },
  spotActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 12,
    gap: Spacing.xs,
    ...Shadows.small,
  },
  navigateButton: {
    // Style will be applied via backgroundColor prop
  },
  reserveButton: {
    // Style will be applied via backgroundColor prop
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: "600",
  },
  savedSpotCard: {
    padding: Spacing.lg,
  },
  savedSpotContent: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  spotImage: {
    width: 80,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  savedSpotInfo: {
    flex: 1,
  },
  savedSpotLocation: {
    fontWeight: "700",
    marginBottom: Spacing.xs,
  },
  savedSpotNotes: {
    marginBottom: Spacing.xs,
    lineHeight: Typography.lineHeights.relaxed * 14,
  },
  savedSpotTime: {
    fontWeight: "500",
  },
  savedSpotActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl * 2,
    paddingHorizontal: Spacing.lg,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: Typography.lineHeights.relaxed * 14,
  },
  saveFirstSpotButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 12,
    gap: Spacing.xs,
  },
  saveFirstSpotText: {
    color: '#FFFFFF',
    fontWeight: "600",
  },
  arPrompt: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  arPromptText: {
    flex: 1,
    color: '#FFFFFF',
    fontWeight: "500",
  },
  arButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
  },
  arButtonText: {
    fontWeight: "600",
  },
  bottomSpacing: {
    height: 100,
  },
});
