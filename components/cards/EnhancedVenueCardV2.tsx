import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { BaseCard } from './EnhancedBaseCard';
import { designSystem } from '../../styles/designSystem';
import { IconSymbol } from '../ui/IconSymbol';

interface EnhancedVenue {
  id: string;
  name: string;
  description: string;
  rating: number;
  distance: string;
  image: string;
  location: string;
  category: string;
  features: string[];
  isOpen: boolean;
  priceLevel: 'budget' | 'moderate' | 'expensive' | 'luxury';
  phone?: string;
  website?: string;
  operatingHours?: {
    [key: string]: string;
  };
  amenities?: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface EnhancedVenueCardProps {
  venue: EnhancedVenue;
  onPress: (venueId: string) => void;
  onNavigate?: (venueId: string) => void;
  onCall?: (venueId: string) => void;
  style?: ViewStyle;
  variant?: 'compact' | 'standard' | 'featured';
  showDistance?: boolean;
  showRating?: boolean;
  showFeatures?: boolean;
  showCTA?: boolean;
  maxFeatures?: number;
}

export function EnhancedVenueCard({
  venue,
  onPress,
  style,
  variant = 'standard',
  showDistance = true,
  showRating = true,
  showFeatures = true,
  maxFeatures = 3,
}: EnhancedVenueCardProps) {
  const handlePress = () => onPress(venue.id);

  const getPriceLevelColor = (level: string) => {
    switch (level) {
      case 'budget': return designSystem.colors.success[500];
      case 'moderate': return designSystem.colors.primary[500];
      case 'expensive': return designSystem.colors.warning[500];
      case 'luxury': return designSystem.colors.error[500];
      default: return designSystem.colors.gray[500];
    }
  };

  const getPriceLevelText = (level: string) => {
    switch (level) {
      case 'budget': return '$';
      case 'moderate': return '$$';
      case 'expensive': return '$$$';
      case 'luxury': return '$$$$';
      default: return '$$';
    }
  };

  const renderRating = () => {
    if (!showRating) return null;
    
    return (
      <View style={styles.ratingContainer}>
        <IconSymbol name="star.fill" size={14} color={designSystem.colors.warning[500]} />
        <Text style={styles.ratingText}>{venue.rating.toFixed(1)}</Text>
      </View>
    );
  };

  const renderStatus = () => (
    <View style={[
      styles.statusBadge,
      { backgroundColor: venue.isOpen ? designSystem.colors.success[50] : designSystem.colors.error[50] }
    ]}>
      <View style={[
        styles.statusDot,
        { backgroundColor: venue.isOpen ? designSystem.colors.success[500] : designSystem.colors.error[500] }
      ]} />
      <Text style={[
        styles.statusText,
        { color: venue.isOpen ? designSystem.colors.success[700] : designSystem.colors.error[700] }
      ]}>
        {venue.isOpen ? 'Open' : 'Closed'}
      </Text>
    </View>
  );

  const renderFeatures = () => {
    if (!showFeatures || !venue.features?.length) return null;
    
    const displayFeatures = venue.features.slice(0, maxFeatures);
    
    return (
      <View style={styles.featuresContainer}>
        {displayFeatures.map((feature, index) => (
          <View key={index} style={styles.featureBadge}>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
        {venue.features.length > maxFeatures && (
          <View style={styles.featureBadge}>
            <Text style={styles.featureText}>+{venue.features.length - maxFeatures}</Text>
          </View>
        )}
      </View>
    );
  };

  if (variant === 'compact') {
    return (
      <BaseCard
        style={[styles.compactCard, style]}
        onPress={handlePress}
        variant="elevated"
        size="compact"
        trackingProps={{
          category: 'venue',
          action: 'view',
          label: venue.name,
        }}
        id={venue.id}
      >
        <View style={styles.compactContent}>
          <Image source={{ uri: venue.image }} style={styles.compactImage} />
          <View style={styles.compactInfo}>
            <Text style={styles.compactTitle} numberOfLines={1}>{venue.name}</Text>
            <Text style={styles.compactCategory} numberOfLines={1}>{venue.category}</Text>
            <View style={styles.compactMeta}>
              {renderRating()}
              {showDistance && (
                <Text style={styles.distanceText}>{venue.distance}</Text>
              )}
            </View>
          </View>
          {renderStatus()}
        </View>
      </BaseCard>
    );
  }

  if (variant === 'featured') {
    return (
      <BaseCard
        style={[styles.featuredCard, style]}
        onPress={handlePress}
        variant="elevated"
        size="expanded"
        trackingProps={{
          category: 'venue',
          action: 'view_featured',
          label: venue.name,
        }}
        id={venue.id}
      >
        <View style={styles.featuredContent}>
          <View style={styles.featuredImageContainer}>
            <Image source={{ uri: venue.image }} style={styles.featuredImage} />
            <View style={styles.featuredOverlay}>
              <View style={styles.featuredBadges}>
                {renderStatus()}
                <View style={[
                  styles.priceBadge,
                  { backgroundColor: getPriceLevelColor(venue.priceLevel) + '20' }
                ]}>
                  <Text style={[
                    styles.priceText,
                    { color: getPriceLevelColor(venue.priceLevel) }
                  ]}>
                    {getPriceLevelText(venue.priceLevel)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          
          <View style={styles.featuredInfo}>
            <View style={styles.featuredHeader}>
              <Text style={styles.featuredTitle} numberOfLines={2}>{venue.name}</Text>
              <View style={styles.featuredMeta}>
                {renderRating()}
                {showDistance && (
                  <View style={styles.distanceContainer}>
                    <IconSymbol name="location" size={12} color={designSystem.colors.text.secondary} />
                    <Text style={styles.distanceText}>{venue.distance}</Text>
                  </View>
                )}
              </View>
            </View>
            
            <Text style={styles.featuredDescription} numberOfLines={2}>
              {venue.description}
            </Text>
            
            {renderFeatures()}
          </View>
        </View>
      </BaseCard>
    );
  }

  // Standard variant
  return (
    <BaseCard
      style={[styles.standardCard, style]}
      onPress={handlePress}
      variant="elevated"
      size="standard"
      trackingProps={{
        category: 'venue',
        action: 'view',
        label: venue.name,
      }}
      id={venue.id}
    >
      <View style={styles.standardContent}>
        <Image source={{ uri: venue.image }} style={styles.standardImage} />
        
        <View style={styles.standardInfo}>
          <View style={styles.standardHeader}>
            <Text style={styles.standardTitle} numberOfLines={1}>{venue.name}</Text>
            {renderStatus()}
          </View>
          
          <Text style={styles.standardCategory}>{venue.category}</Text>
          
          <Text style={styles.standardDescription} numberOfLines={2}>
            {venue.description}
          </Text>
          
          <View style={styles.standardFooter}>
            <View style={styles.standardMeta}>
              {renderRating()}
              {showDistance && (
                <View style={styles.distanceContainer}>
                  <IconSymbol name="location" size={12} color={designSystem.colors.text.secondary} />
                  <Text style={styles.distanceText}>{venue.distance}</Text>
                </View>
              )}
            </View>
            
            <View style={[
              styles.priceBadge,
              { backgroundColor: getPriceLevelColor(venue.priceLevel) + '20' }
            ]}>
              <Text style={[
                styles.priceText,
                { color: getPriceLevelColor(venue.priceLevel) }
              ]}>
                {getPriceLevelText(venue.priceLevel)}
              </Text>
            </View>
          </View>
          
          {renderFeatures()}
        </View>
      </View>
    </BaseCard>
  );
}

const styles = StyleSheet.create({
  // Compact variant styles
  compactCard: {
    marginBottom: designSystem.spacing.sm,
  },
  
  compactContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  compactImage: {
    width: 60,
    height: 60,
    borderRadius: designSystem.borderRadius.lg,
    marginRight: designSystem.spacing.md,
  },
  
  compactInfo: {
    flex: 1,
  },
  
  compactTitle: {
    fontSize: designSystem.typography.fontSizes.base,
    fontWeight: designSystem.typography.fontWeights.semibold,
    color: designSystem.colors.text.primary,
    marginBottom: 2,
  },
  
  compactCategory: {
    fontSize: designSystem.typography.fontSizes.sm,
    color: designSystem.colors.text.secondary,
    marginBottom: designSystem.spacing.xs,
  },
  
  compactMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designSystem.spacing.sm,
  },

  // Featured variant styles
  featuredCard: {
    marginBottom: designSystem.spacing.md,
  },
  
  featuredContent: {
    flex: 1,
  },
  
  featuredImageContainer: {
    position: 'relative',
    height: 180,
    borderRadius: designSystem.borderRadius.xl,
    overflow: 'hidden',
    marginBottom: designSystem.spacing.md,
  },
  
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  
  featuredOverlay: {
    position: 'absolute',
    top: designSystem.spacing.md,
    right: designSystem.spacing.md,
  },
  
  featuredBadges: {
    gap: designSystem.spacing.sm,
    alignItems: 'flex-end',
  },
  
  featuredInfo: {
    flex: 1,
  },
  
  featuredHeader: {
    marginBottom: designSystem.spacing.sm,
  },
  
  featuredTitle: {
    fontSize: designSystem.typography.fontSizes.xl,
    fontWeight: designSystem.typography.fontWeights.bold,
    color: designSystem.colors.text.primary,
    lineHeight: designSystem.typography.lineHeights.tight * designSystem.typography.fontSizes.xl,
    marginBottom: designSystem.spacing.xs,
  },
  
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designSystem.spacing.md,
  },
  
  featuredDescription: {
    fontSize: designSystem.typography.fontSizes.base,
    color: designSystem.colors.text.secondary,
    lineHeight: designSystem.typography.lineHeights.relaxed * designSystem.typography.fontSizes.base,
    marginBottom: designSystem.spacing.md,
  },

  // Standard variant styles
  standardCard: {
    marginBottom: designSystem.spacing.md,
  },
  
  standardContent: {
    flexDirection: 'row',
  },
  
  standardImage: {
    width: 100,
    height: 100,
    borderRadius: designSystem.borderRadius.lg,
    marginRight: designSystem.spacing.md,
  },
  
  standardInfo: {
    flex: 1,
  },
  
  standardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: designSystem.spacing.xs,
  },
  
  standardTitle: {
    fontSize: designSystem.typography.fontSizes.lg,
    fontWeight: designSystem.typography.fontWeights.semibold,
    color: designSystem.colors.text.primary,
    flex: 1,
    marginRight: designSystem.spacing.sm,
  },
  
  standardCategory: {
    fontSize: designSystem.typography.fontSizes.sm,
    color: designSystem.colors.text.secondary,
    marginBottom: designSystem.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  standardDescription: {
    fontSize: designSystem.typography.fontSizes.sm,
    color: designSystem.colors.text.secondary,
    lineHeight: designSystem.typography.lineHeights.relaxed * designSystem.typography.fontSizes.sm,
    marginBottom: designSystem.spacing.sm,
  },
  
  standardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: designSystem.spacing.sm,
  },
  
  standardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designSystem.spacing.md,
  },

  // Common styles
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  
  ratingText: {
    fontSize: designSystem.typography.fontSizes.sm,
    fontWeight: designSystem.typography.fontWeights.medium,
    color: designSystem.colors.text.primary,
  },
  
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  
  distanceText: {
    fontSize: designSystem.typography.fontSizes.sm,
    color: designSystem.colors.text.secondary,
  },
  
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: designSystem.spacing.sm,
    paddingVertical: 4,
    borderRadius: designSystem.borderRadius.full,
    gap: 4,
  },
  
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  
  statusText: {
    fontSize: designSystem.typography.fontSizes.xs,
    fontWeight: designSystem.typography.fontWeights.medium,
  },
  
  priceBadge: {
    paddingHorizontal: designSystem.spacing.sm,
    paddingVertical: 4,
    borderRadius: designSystem.borderRadius.md,
    minWidth: 32,
    alignItems: 'center',
  },
  
  priceText: {
    fontSize: designSystem.typography.fontSizes.sm,
    fontWeight: designSystem.typography.fontWeights.bold,
  },
  
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: designSystem.spacing.xs,
  },
  
  featureBadge: {
    backgroundColor: designSystem.colors.primary[50],
    paddingHorizontal: designSystem.spacing.sm,
    paddingVertical: 4,
    borderRadius: designSystem.borderRadius.md,
  },
  
  featureText: {
    fontSize: designSystem.typography.fontSizes.xs,
    color: designSystem.colors.primary[700],
    fontWeight: designSystem.typography.fontWeights.medium,
  },
});
