import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { BaseCard } from './BaseCard';
import { colors } from '../../styles/modernTheme';

const { width } = Dimensions.get('window');

interface EnhancedVenueCardProps {
  venue: {
    id: string;
    name: string;
    description?: string;
    image?: string;
    rating?: number;
    category?: string;
    location?: string;
    features?: string[];
    isOpen?: boolean;
    distance?: string;
  };
  onPress: (venueId: string) => void;
  size?: 'small' | 'medium' | 'large';
  showFeatures?: boolean;
  style?: any;
}

export const EnhancedVenueCard: React.FC<EnhancedVenueCardProps> = ({ 
  venue, 
  onPress, 
  size = 'medium',
  showFeatures = false,
  style 
}) => {
  const getCardWidth = () => {
    switch (size) {
      case 'small': return width * 0.4;
      case 'large': return width * 0.8;
      default: return width * 0.6;
    }
  };

  const getImageHeight = () => {
    switch (size) {
      case 'small': return 80;
      case 'large': return 160;
      default: return 120;
    }
  };

  return (
    <BaseCard
      style={{
        width: getCardWidth(), 
        marginRight: 16,
        ...(style || {})
      }}
      onPress={() => onPress(venue.id)}
      variant="elevated"
    >
      {venue.image && (
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: venue.image }} 
            style={[styles.venueImage, { height: getImageHeight() }]}
            resizeMode="cover"
          />
          
          {venue.isOpen !== undefined && (
            <View style={[
              styles.statusBadge, 
              { backgroundColor: venue.isOpen ? colors.success : colors.error }
            ]}>
              <Text style={styles.statusText}>
                {venue.isOpen ? 'Open' : 'Closed'}
              </Text>
            </View>
          )}
          
          {venue.distance && (
            <View style={styles.distanceBadge}>
              <Text style={styles.distanceText}>{venue.distance}</Text>
            </View>
          )}
        </View>
      )}
      
      <View style={styles.venueContent}>
        <View style={styles.venueHeader}>
          <Text style={styles.venueName} numberOfLines={1}>
            {venue.name}
          </Text>
          
          {venue.rating && (
            <View style={styles.ratingContainer}>
              <IconSymbol name="star.fill" size={12} color="#FFD700" />
              <Text style={styles.ratingText}>{venue.rating}</Text>
            </View>
          )}
        </View>
        
        {venue.category && (
          <Text style={styles.venueCategory}>{venue.category}</Text>
        )}
        
        {venue.location && (
          <View style={styles.locationContainer}>
            <IconSymbol name="location" size={10} color={colors.textSecondary} />
            <Text style={styles.locationText} numberOfLines={1}>
              {venue.location}
            </Text>
          </View>
        )}
        
        {venue.description && (
          <Text style={styles.venueDescription} numberOfLines={2}>
            {venue.description}
          </Text>
        )}
        
        {showFeatures && venue.features && venue.features.length > 0 && (
          <View style={styles.featuresContainer}>
            {venue.features.slice(0, 2).map((feature, index) => (
              <View key={index} style={styles.featureBadge}>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        )}
        
        <View style={styles.actionRow}>
          <Text style={styles.actionText}>View Details</Text>
          <IconSymbol name="chevron.right" size={14} color={colors.primary} />
        </View>
      </View>
    </BaseCard>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  venueImage: {
    width: '100%',
    borderRadius: 8,
  },
  statusBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '600',
  },
  distanceBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  distanceText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '500',
  },
  venueContent: {
    flex: 1,
  },
  venueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  venueName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 2,
  },
  venueCategory: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '500',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  locationText: {
    fontSize: 10,
    color: colors.textSecondary,
    marginLeft: 4,
    flex: 1,
  },
  venueDescription: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 15,
    marginBottom: 8,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  featureBadge: {
    backgroundColor: colors.secondary + '20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 4,
    marginBottom: 2,
  },
  featureText: {
    fontSize: 9,
    color: colors.secondary,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
});


