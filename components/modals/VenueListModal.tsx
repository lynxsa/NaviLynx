/**
 * VenueListModal - Modal for selecting destination venue
 * Shows nearby venues with distance and details
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  TextInput,
} from 'react-native';

// Internal imports
import { IconSymbol } from '@/components/ui/IconSymbol';
import { colors, spacing, borderRadius } from '@/styles/modernTheme';
import { Venue } from '@/data/southAfricanVenues';
import NavigationService from '@/services/NavigationService';

interface VenueListModalProps {
  visible: boolean;
  venues: Venue[];
  userLocation: { latitude: number; longitude: number } | null;
  onVenueSelect: (venue: Venue) => void;
  onClose: () => void;
}

const navigationService = NavigationService.getInstance();

export default function VenueListModal({
  visible,
  venues,
  userLocation,
  onVenueSelect,
  onClose,
}: VenueListModalProps) {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter venues based on search query
  const filteredVenues = useMemo(() => {
    if (!searchQuery.trim()) return venues;
    const q = searchQuery.toLowerCase().trim();
    return venues.filter(v =>
      v.name.toLowerCase().includes(q) ||
      v.location.city.toLowerCase().includes(q) ||
      v.location.province.toLowerCase().includes(q) ||
      v.type.toLowerCase().includes(q) ||
      v.features.some(f => f.toLowerCase().includes(q))
    );
  }, [venues, searchQuery]);

  /**
   * Calculate distance from user to venue
   */
  const calculateDistance = (venue: Venue): string => {
    if (!userLocation || !venue.location?.coordinates) {
      return 'Unknown';
    }

    const distance = navigationService.calculateDistance(
      userLocation,
      venue.location.coordinates
    );

    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    } else {
      return `${(distance / 1000).toFixed(1)}km`;
    }
  };

  /**
   * Get venue type icon
   */
  const getVenueIcon = (type: string): "storefront" | "airplane" | "building.2" | "location" | "map" | "camera" => {
    switch (type) {
      case 'mall':
        return 'storefront';
      case 'airport':
        return 'airplane';
      case 'hospital':
        return 'building.2';
      case 'park':
        return 'map';
      case 'stadium':
        return 'camera';
      case 'university':
        return 'building.2';
      case 'government':
        return 'building.2';
      default:
        return 'location';
    }
  };

  /**
   * Handle venue selection
   */
  const handleVenueSelect = async (venue: Venue) => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      setSelectedVenue(venue);
      
      // Small delay for UI feedback
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onVenueSelect(venue);
    } catch (error) {
      console.error('Venue selection error:', error);
    } finally {
      setIsLoading(false);
      setSelectedVenue(null);
    }
  };

  /**
   * Render venue rating stars
   */
  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <IconSymbol key={i} size={12} name="star.fill" color={colors.warning} />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <IconSymbol key="half" size={12} name="star" color={colors.warning} />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <IconSymbol key={`empty-${i}`} size={12} name="star" color={colors.gray[300]} />
      );
    }

    return <View style={styles.ratingContainer}>{stars}</View>;
  };

  /**
   * Render venue features
   */
  const renderFeatures = (features: string[]) => {
    return (
      <View style={styles.featuresContainer}>
        {features.slice(0, 3).map((feature, index) => (
          <View key={index} style={styles.featureTag}>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
        {features.length > 3 && (
          <View style={styles.featureTag}>
            <Text style={styles.featureText}>+{features.length - 3}</Text>
          </View>
        )}
      </View>
    );
  };

  /**
   * Render individual venue item
   */
  const renderVenueItem = (venue: Venue) => {
    const isSelected = selectedVenue?.id === venue.id;
    const distance = calculateDistance(venue);

    return (
      <TouchableOpacity
        key={venue.id}
        style={[
          styles.venueItem,
          isSelected && styles.venueItemSelected
        ]}
        onPress={() => handleVenueSelect(venue)}
        disabled={isLoading}
      >
        {/* Venue image */}
        <View style={styles.venueImageContainer}>
          {venue.image ? (
            <Image source={{ uri: venue.image }} style={styles.venueImage} />
          ) : (
            <View style={[styles.venueImagePlaceholder, { backgroundColor: colors.gray[200] }]}>
              <IconSymbol size={24} name={getVenueIcon(venue.type)} color={colors.gray[600]} />
            </View>
          )}
          
          {/* Distance badge */}
          <View style={styles.distanceBadge}>
            <Text style={styles.distanceText}>{distance}</Text>
          </View>
        </View>

        {/* Venue details */}
        <View style={styles.venueDetails}>
          <View style={styles.venueHeader}>
            <Text style={styles.venueName} numberOfLines={1}>
              {venue.name}
            </Text>
            
            <View style={styles.venueTypeContainer}>
              <IconSymbol size={14} name={getVenueIcon(venue.type)} color={colors.primary} />
              <Text style={styles.venueType}>{venue.type}</Text>
            </View>
          </View>

          {/* Rating */}
          <View style={styles.venueRating}>
            {renderRating(venue.rating)}
            <Text style={styles.ratingText}>({venue.rating})</Text>
          </View>

          {/* Location */}
          <Text style={styles.venueLocation} numberOfLines={1}>
            {venue.location.city}, {venue.location.province}
          </Text>

          {/* Features */}
          {venue.features && venue.features.length > 0 && renderFeatures(venue.features)}

          {/* Opening hours */}
          {venue.openingHours && (
            <Text style={styles.openingHours} numberOfLines={1}>
              {venue.openingHours}
            </Text>
          )}
        </View>

        {/* Selection indicator */}
        {isSelected && (
          <View style={styles.selectionIndicator}>
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <IconSymbol size={20} name="checkmark.circle.fill" color={colors.primary} />
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modal}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <IconSymbol size={24} name="xmark" color={colors.gray[600]} />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Select Destination</Text>
            <Text style={styles.headerSubtitle}>
              {filteredVenues.length} venue{filteredVenues.length !== 1 ? 's' : ''} {searchQuery.trim() ? 'found' : 'nearby'}
            </Text>
          </View>
          
          <View style={styles.headerSpacer} />
        </View>

        {/* Search input */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search venues, cities, or features"
            placeholderTextColor={colors.gray[400]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            onSubmitEditing={() => { /* Dismiss keyboard on search */ }}
          />
        </View>

        {/* Venue list */}
        <ScrollView
          style={styles.venueList}
          contentContainerStyle={styles.venueListContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredVenues.length > 0 ? (
            filteredVenues.map(renderVenueItem)
          ) : (
            <View style={styles.emptyState}>
              <IconSymbol size={64} name="location" color={colors.gray[400]} />
              <Text style={styles.emptyStateTitle}>No venues found</Text>
              <Text style={styles.emptyStateSubtitle}>
                Try adjusting your location or search in a different area
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Showing venues within 10km of your location
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.gray[600],
    marginTop: 2,
  },
  headerSpacer: {
    width: 40,
  },
  searchContainer: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    backgroundColor: colors.gray[50],
  },
  searchInput: {
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.md,
    fontSize: 14,
    color: colors.gray[900],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  venueList: {
    flex: 1,
  },
  venueListContent: {
    padding: spacing.md,
  },
  venueItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  venueItemSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '05',
  },
  venueImageContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },
  venueImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
  },
  venueImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  distanceBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  distanceText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  venueDetails: {
    flex: 1,
  },
  venueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  venueName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[900],
    flex: 1,
    marginRight: spacing.sm,
  },
  venueTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '10',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  venueType: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  venueRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginRight: spacing.xs,
  },
  ratingText: {
    fontSize: 12,
    color: colors.gray[600],
    fontWeight: '500',
  },
  venueLocation: {
    fontSize: 14,
    color: colors.gray[600],
    marginBottom: spacing.xs,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.xs,
  },
  featureTag: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginRight: spacing.xs,
    marginBottom: 4,
  },
  featureText: {
    fontSize: 10,
    color: colors.gray[700],
    fontWeight: '500',
  },
  openingHours: {
    fontSize: 12,
    color: colors.gray[500],
    fontStyle: 'italic',
  },
  selectionIndicator: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[600],
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: colors.gray[500],
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    backgroundColor: colors.gray[50],
  },
  footerText: {
    fontSize: 12,
    color: colors.gray[500],
    textAlign: 'center',
  },
});
