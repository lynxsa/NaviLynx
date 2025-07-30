import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
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

export function ModernVenueCard({
  venue,
  onPress,
  onNavigate,
  onCall,
  style,
  variant = 'standard',
  showDistance = true,
  showRating = true,
  showFeatures = true,
  showCTA = true,
  maxFeatures = 3,
}: EnhancedVenueCardProps) {

  const handlePress = () => {
    onPress(venue.id);
  };

  const handleNavigate = () => {
    if (onNavigate) {
      onNavigate(venue.id);
    }
  };

  const handleCall = () => {
    if (onCall) {
      onCall(venue.id);
    }
  };

  const renderRating = () => {
    if (!showRating) return null;
    
    return (
      <View style={styles.ratingContainer}>
        <IconSymbol name="star.fill" size={12} color={designSystem.colors.warning[500]} />
        <Text style={styles.ratingText}>{venue.rating.toFixed(1)}</Text>
      </View>
    );
  };

  const renderStatus = () => {
    return (
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
  };

  const renderFeatures = () => {
    if (!showFeatures || !venue.features.length) return null;
    
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

  const renderCTAButtons = () => {
    if (!showCTA) return null;
    
    return (
      <View style={styles.ctaContainer}>
        {onNavigate && (
          <TouchableOpacity style={styles.ctaButtonPrimary} onPress={handleNavigate}>
            <IconSymbol name="location.fill" size={16} color="#FFFFFF" />
            <Text style={styles.ctaButtonTextPrimary}>Navigate</Text>
          </TouchableOpacity>
        )}
        {onCall && venue.phone && (
          <TouchableOpacity style={styles.ctaButtonSecondary} onPress={handleCall}>
            <IconSymbol name="phone.fill" size={14} color={designSystem.colors.primary[600]} />
            <Text style={styles.ctaButtonTextSecondary}>Call</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const getPriceLevelIndicator = () => {
    const priceMap = {
      budget: '$',
      moderate: '$$',
      expensive: '$$$',
      luxury: '$$$$'
    };
    return priceMap[venue.priceLevel];
  };

  // Modernized Compact Variant - Less compact with larger images
  if (variant === 'compact') {
    return (
      <BaseCard
        style={[styles.modernCompactCard, style]}
        onPress={handlePress}
        variant="elevated"
        trackingProps={{
          category: 'venue',
          action: 'view',
          label: venue.name,
        }}
        id={venue.id}
      >
        <View style={styles.modernCompactContent}>
          {/* Larger, more prominent image */}
          <View style={styles.modernCompactImageContainer}>
            <Image source={{ uri: venue.image }} style={styles.modernCompactImage} />
            <View style={styles.modernCompactOverlay}>
              {renderStatus()}
              <View style={styles.priceBadge}>
                <Text style={styles.priceText}>{getPriceLevelIndicator()}</Text>
              </View>
            </View>
          </View>
          
          {/* Content with better spacing */}
          <View style={styles.modernCompactInfo}>
            <View style={styles.modernCompactHeader}>
              <Text style={styles.modernCompactTitle} numberOfLines={2}>{venue.name}</Text>
              {renderRating()}
            </View>
            
            <Text style={styles.modernCompactCategory} numberOfLines={1}>{venue.category}</Text>
            
            <View style={styles.modernCompactMeta}>
              {showDistance && (
                <View style={styles.distanceContainer}>
                  <IconSymbol name="location" size={12} color={designSystem.colors.gray[500]} />
                  <Text style={styles.distanceText}>{venue.distance}</Text>
                </View>
              )}
            </View>
            
            {/* CTA Buttons */}
            {renderCTAButtons()}
          </View>
        </View>
      </BaseCard>
    );
  }

  // Modernized Standard Variant
  if (variant === 'standard') {
    return (
      <BaseCard
        style={[styles.modernStandardCard, style]}
        onPress={handlePress}
        variant="elevated"
        trackingProps={{
          category: 'venue',
          action: 'view',
          label: venue.name,
        }}
        id={venue.id}
      >
        <View style={styles.modernStandardContent}>
          {/* Large hero image */}
          <View style={styles.modernStandardImageContainer}>
            <Image source={{ uri: venue.image }} style={styles.modernStandardImage} />
            <View style={styles.modernStandardOverlay}>
              {renderStatus()}
              <View style={styles.priceBadge}>
                <Text style={styles.priceText}>{getPriceLevelIndicator()}</Text>
              </View>
            </View>
          </View>
          
          {/* Content section */}
          <View style={styles.modernStandardInfo}>
            <View style={styles.modernStandardHeader}>
              <View style={styles.modernStandardTitleSection}>
                <Text style={styles.modernStandardTitle} numberOfLines={2}>{venue.name}</Text>
                <Text style={styles.modernStandardCategory}>{venue.category}</Text>
              </View>
              {renderRating()}
            </View>
            
            <Text style={styles.modernStandardDescription} numberOfLines={2}>
              {venue.description}
            </Text>
            
            <View style={styles.modernStandardMeta}>
              {showDistance && (
                <View style={styles.distanceContainer}>
                  <IconSymbol name="location" size={14} color={designSystem.colors.gray[500]} />
                  <Text style={styles.distanceText}>{venue.distance}</Text>
                </View>
              )}
            </View>
            
            {renderFeatures()}
            {renderCTAButtons()}
          </View>
        </View>
      </BaseCard>
    );
  }

  // Modernized Featured Variant - Premium layout
  if (variant === 'featured') {
    return (
      <BaseCard
        style={[styles.modernFeaturedCard, style]}
        onPress={handlePress}
        variant="elevated"
        trackingProps={{
          category: 'venue',
          action: 'view',
          label: venue.name,
        }}
        id={venue.id}
      >
        <View style={styles.modernFeaturedContent}>
          {/* Hero image with gradient overlay */}
          <View style={styles.modernFeaturedImageContainer}>
            <Image source={{ uri: venue.image }} style={styles.modernFeaturedImage} />
            <View style={styles.modernFeaturedGradient}>
              <View style={styles.modernFeaturedTopBadges}>
                {renderStatus()}
                <View style={styles.priceBadge}>
                  <Text style={styles.priceText}>{getPriceLevelIndicator()}</Text>
                </View>
              </View>
              
              <View style={styles.modernFeaturedBottomContent}>
                <View style={styles.modernFeaturedTitleSection}>
                  <Text style={styles.modernFeaturedTitle} numberOfLines={2}>{venue.name}</Text>
                  <Text style={styles.modernFeaturedCategory}>{venue.category}</Text>
                </View>
                {renderRating()}
              </View>
            </View>
          </View>
          
          {/* Detailed content */}
          <View style={styles.modernFeaturedInfo}>
            <Text style={styles.modernFeaturedDescription} numberOfLines={3}>
              {venue.description}
            </Text>
            
            <View style={styles.modernFeaturedMeta}>
              {showDistance && (
                <View style={styles.distanceContainer}>
                  <IconSymbol name="location" size={14} color={designSystem.colors.gray[500]} />
                  <Text style={styles.distanceText}>{venue.distance}</Text>
                </View>
              )}
            </View>
            
            {renderFeatures()}
            {renderCTAButtons()}
          </View>
        </View>
      </BaseCard>
    );
  }

  // Default to standard variant
  return null;
}

const styles = StyleSheet.create({
  // Common styles
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: designSystem.colors.warning[50],
    paddingHorizontal: designSystem.spacing.sm,
    paddingVertical: 4,
    borderRadius: designSystem.borderRadius.full,
  },
  
  ratingText: {
    fontSize: designSystem.typography.fontSizes.xs,
    fontWeight: designSystem.typography.fontWeights.semibold,
    color: designSystem.colors.warning[700],
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
    backgroundColor: designSystem.colors.gray[900],
    paddingHorizontal: designSystem.spacing.sm,
    paddingVertical: 4,
    borderRadius: designSystem.borderRadius.md,
    minWidth: 32,
    alignItems: 'center',
  },
  
  priceText: {
    fontSize: designSystem.typography.fontSizes.sm,
    fontWeight: designSystem.typography.fontWeights.bold,
    color: '#FFFFFF',
  },
  
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: designSystem.spacing.xs,
    marginTop: designSystem.spacing.sm,
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
  
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  
  distanceText: {
    fontSize: designSystem.typography.fontSizes.sm,
    color: designSystem.colors.gray[600],
    fontWeight: designSystem.typography.fontWeights.medium,
  },
  
  // CTA Button styles
  ctaContainer: {
    flexDirection: 'row',
    gap: designSystem.spacing.sm,
    marginTop: designSystem.spacing.md,
  },
  
  ctaButtonPrimary: {
    backgroundColor: designSystem.colors.primary[600],
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: designSystem.spacing.md,
    paddingVertical: designSystem.spacing.sm,
    borderRadius: designSystem.borderRadius.lg,
    gap: 6,
    flex: 1,
    justifyContent: 'center',
  },
  
  ctaButtonSecondary: {
    backgroundColor: designSystem.colors.primary[50],
    borderWidth: 1,
    borderColor: designSystem.colors.primary[200],
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: designSystem.spacing.md,
    paddingVertical: designSystem.spacing.sm,
    borderRadius: designSystem.borderRadius.lg,
    gap: 6,
    flex: 1,
    justifyContent: 'center',
  },
  
  ctaButtonTextPrimary: {
    color: '#FFFFFF',
    fontSize: designSystem.typography.fontSizes.sm,
    fontWeight: designSystem.typography.fontWeights.semibold,
  },
  
  ctaButtonTextSecondary: {
    color: designSystem.colors.primary[700],
    fontSize: designSystem.typography.fontSizes.sm,
    fontWeight: designSystem.typography.fontWeights.semibold,
  },

  // Modernized Compact Card - Less compact, larger images
  modernCompactCard: {
    width: 300, // Increased from typical compact width
    marginRight: designSystem.spacing.md,
  },
  
  modernCompactContent: {
    flex: 1,
  },
  
  modernCompactImageContainer: {
    position: 'relative',
    height: 180, // Increased height for better image visibility
    borderRadius: designSystem.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: designSystem.spacing.md,
  },
  
  modernCompactImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  
  modernCompactOverlay: {
    position: 'absolute',
    top: designSystem.spacing.sm,
    left: designSystem.spacing.sm,
    right: designSystem.spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  
  modernCompactInfo: {
    flex: 1,
    paddingHorizontal: designSystem.spacing.sm,
  },
  
  modernCompactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: designSystem.spacing.xs,
  },
  
  modernCompactTitle: {
    fontSize: designSystem.typography.fontSizes.lg,
    fontWeight: designSystem.typography.fontWeights.bold,
    color: designSystem.colors.gray[900],
    flex: 1,
    marginRight: designSystem.spacing.sm,
  },
  
  modernCompactCategory: {
    fontSize: designSystem.typography.fontSizes.sm,
    color: designSystem.colors.gray[600],
    fontWeight: designSystem.typography.fontWeights.medium,
    marginBottom: designSystem.spacing.xs,
  },
  
  modernCompactMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: designSystem.spacing.sm,
  },

  // Modernized Standard Card
  modernStandardCard: {
    width: '100%',
    marginBottom: designSystem.spacing.lg,
  },
  
  modernStandardContent: {
    flex: 1,
  },
  
  modernStandardImageContainer: {
    position: 'relative',
    height: 220, // Generous height for hero image
    borderRadius: designSystem.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: designSystem.spacing.md,
  },
  
  modernStandardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  
  modernStandardOverlay: {
    position: 'absolute',
    top: designSystem.spacing.md,
    left: designSystem.spacing.md,
    right: designSystem.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  
  modernStandardInfo: {
    paddingHorizontal: designSystem.spacing.md,
    paddingBottom: designSystem.spacing.md,
  },
  
  modernStandardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: designSystem.spacing.sm,
  },
  
  modernStandardTitleSection: {
    flex: 1,
    marginRight: designSystem.spacing.md,
  },
  
  modernStandardTitle: {
    fontSize: designSystem.typography.fontSizes.xl,
    fontWeight: designSystem.typography.fontWeights.bold,
    color: designSystem.colors.gray[900],
    marginBottom: designSystem.spacing.xs,
  },
  
  modernStandardCategory: {
    fontSize: designSystem.typography.fontSizes.md,
    color: designSystem.colors.gray[600],
    fontWeight: designSystem.typography.fontWeights.medium,
  },
  
  modernStandardDescription: {
    fontSize: designSystem.typography.fontSizes.md,
    color: designSystem.colors.gray[700],
    lineHeight: 20,
    marginBottom: designSystem.spacing.sm,
  },
  
  modernStandardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: designSystem.spacing.sm,
  },

  // Modernized Featured Card - Premium experience
  modernFeaturedCard: {
    width: '100%',
    marginBottom: designSystem.spacing.xl,
  },
  
  modernFeaturedContent: {
    flex: 1,
  },
  
  modernFeaturedImageContainer: {
    position: 'relative',
    height: 280, // Large hero image
    borderRadius: designSystem.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: designSystem.spacing.md,
  },
  
  modernFeaturedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  
  modernFeaturedGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'space-between',
    padding: designSystem.spacing.md,
  },
  
  modernFeaturedTopBadges: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  
  modernFeaturedBottomContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  
  modernFeaturedTitleSection: {
    flex: 1,
    marginRight: designSystem.spacing.md,
  },
  
  modernFeaturedTitle: {
    fontSize: designSystem.typography.fontSizes['2xl'],
    fontWeight: designSystem.typography.fontWeights.bold,
    color: '#FFFFFF',
    marginBottom: designSystem.spacing.xs,
  },
  
  modernFeaturedCategory: {
    fontSize: designSystem.typography.fontSizes.lg,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: designSystem.typography.fontWeights.medium,
  },
  
  modernFeaturedInfo: {
    paddingHorizontal: designSystem.spacing.md,
    paddingBottom: designSystem.spacing.md,
  },
  
  modernFeaturedDescription: {
    fontSize: designSystem.typography.fontSizes.lg,
    color: designSystem.colors.gray[700],
    lineHeight: 24,
    marginBottom: designSystem.spacing.md,
  },
  
  modernFeaturedMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: designSystem.spacing.sm,
  },
});
