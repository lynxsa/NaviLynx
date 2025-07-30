import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { BaseCard } from './BaseCard';
import { colors } from '../../styles/modernTheme';
import { type EnhancedVenue } from '@/data/enhancedVenues';

interface VenueCardProps {
  venue: EnhancedVenue;
  onPress: (venue: EnhancedVenue) => void;
  variant?: 'list' | 'grid';
}

export const VenueCard: React.FC<VenueCardProps> = ({ venue, onPress, variant = 'list' }) => {
  return (
    <BaseCard
      style={variant === 'grid' ? styles.gridCard : styles.listCard}
      onPress={() => onPress(venue)}
      variant="elevated"
    >
      <Image source={{ uri: venue.headerImage }} style={styles.venueImage} />
      <View style={styles.venueContent}>
        <View style={styles.venueHeader}>
          <Text style={styles.venueName} numberOfLines={1}>
            {venue.name}
          </Text>
          {venue.isFeatured && (
            <View style={styles.featuredBadge}>
              <IconSymbol name="star.fill" size={10} color="#FFFFFF" />
            </View>
          )}
        </View>
        <Text style={styles.venueLocation} numberOfLines={1}>
          {venue.location.city}, {venue.location.province}
        </Text>
        <Text style={styles.venueDescription} numberOfLines={2}>
          {venue.shortDescription}
        </Text>
        <View style={styles.venueFooter}>
          <View style={styles.venueRating}>
            <IconSymbol name="star.fill" size={12} color="#FFD700" />
            <Text style={styles.venueRatingText}>{venue.rating}</Text>
            <Text style={styles.venueReviewCount}>
              ({venue.reviewCount})
            </Text>
          </View>
        </View>
      </View>
    </BaseCard>
  );
};

const styles = StyleSheet.create({
  listCard: {
    marginBottom: 16,
  },
  gridCard: {
    flex: 1,
    marginHorizontal: 8,
    marginBottom: 16,
  },
  venueImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  venueContent: {
    paddingTop: 12,
  },
  venueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  venueName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  featuredBadge: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 4,
    marginLeft: 8,
  },
  venueLocation: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  venueDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  venueFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  venueRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  venueRatingText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 4,
  },
  venueReviewCount: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
});


