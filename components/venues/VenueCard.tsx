import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { BlurView } from '@/components/ui/BlurView';
import { useTheme } from '@/context/ThemeContext';
import { colors, spacing, borderRadius, shadows } from '@/styles/modernTheme';

const { width } = Dimensions.get('window');

// Base venue interface
export interface Venue {
  id: string;
  name: string;
  category: string;
  rating: number;
  distance: string;
  image: string;
  isOpen: boolean;
  features?: string[];
  description?: string;
}

interface VenueCardProps {
  venue: Venue;
  size?: 'small' | 'medium' | 'large';
  layout?: 'grid' | 'list';
  onPress?: (venue: Venue) => void;
}

export const VenueCard: React.FC<VenueCardProps> = ({
  venue,
  size = 'medium',
  layout = 'grid',
  onPress
}) => {
  const { isDark } = useTheme();
  
  const handlePress = () => {
    if (onPress) {
      onPress(venue);
    } else {
      router.push(`/venue/${venue.id}` as any);
    }
  };

  const getCardDimensions = () => {
    switch (size) {
      case 'small':
        return { width: width * 0.4, height: 120 };
      case 'large':
        return { width: width - (spacing.md * 2), height: 200 };
      default:
        return { width: width * 0.45, height: 160 };
    }
  };

  const { width: cardWidth, height: cardHeight } = getCardDimensions();

  if (layout === 'list') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        style={[
          styles.listCard,
          {
            backgroundColor: isDark ? colors.gray[800] : '#FFFFFF',
            borderColor: isDark ? colors.gray[700] : colors.gray[100],
          }
        ]}
        activeOpacity={0.7}
      >
        <View style={styles.listImageContainer}>
          <Image 
            source={{ uri: venue.image }} 
            style={styles.listImage}
            resizeMode="cover"
          />
          <View style={[
            styles.statusIndicator,
            { backgroundColor: venue.isOpen ? colors.success : colors.error }
          ]} />
        </View>
        
        <View style={styles.listContent}>
          <Text style={[
            styles.listTitle,
            { color: isDark ? '#FFFFFF' : colors.gray[900] }
          ]}>
            {venue.name}
          </Text>
          <Text style={[
            styles.listCategory,
            { color: isDark ? colors.gray[300] : colors.gray[600] }
          ]}>
            {venue.category}
          </Text>
          
          {venue.description && (
            <Text 
              style={[
                styles.listDescription,
                { color: isDark ? colors.gray[400] : colors.gray[500] }
              ]} 
              numberOfLines={2}
            >
              {venue.description}
            </Text>
          )}
          
          <View style={styles.listFooter}>
            <View style={styles.ratingContainer}>
              <IconSymbol name="star.fill" size={12} color="#FFD700" />
              <Text style={[
                styles.ratingText,
                { color: isDark ? colors.gray[300] : colors.gray[600] }
              ]}>
                {venue.rating}
              </Text>
              <Text style={[
                styles.distanceText,
                { color: isDark ? colors.gray[500] : colors.gray[400] }
              ]}>
                • {venue.distance}
              </Text>
            </View>
            
            {venue.features && venue.features.length > 0 && (
              <View style={styles.featuresContainer}>
                <View style={[
                  styles.featureBadge,
                  {
                    backgroundColor: isDark ? 'rgba(139,92,246,0.3)' : 'rgba(139,92,246,0.1)',
                  }
                ]}>
                  <Text style={[
                    styles.featureText,
                    { color: isDark ? colors.primary[300] : colors.primary[600] }
                  ]}>
                    +{venue.features.length} features
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
        
        <IconSymbol name="chevron.right" size={16} color={colors.gray[400]} />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.9}
      style={[
        styles.gridCard,
        {
          width: cardWidth,
          height: cardHeight,
          backgroundColor: isDark ? colors.gray[800] : '#FFFFFF',
        }
      ]}
    >
      <View style={styles.gridImageContainer}>
        <Image
          source={{ uri: venue.image }}
          style={styles.gridImage}
          resizeMode="cover"
        />
        
        {/* Gradient overlay */}
        <View style={styles.overlay} />
        
        {/* Status indicator */}
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusDot,
            { backgroundColor: venue.isOpen ? colors.success : colors.error }
          ]} />
        </View>
        
        {/* Content */}
        <View style={styles.gridContent}>
          <View style={styles.gridRating}>
            <IconSymbol name="star.fill" size={12} color="#FFD700" />
            <Text style={styles.gridRatingText}>
              {venue.rating}
            </Text>
            <Text style={styles.gridDistanceText}>
              • {venue.distance}
            </Text>
          </View>
          
          <Text style={styles.gridTitle} numberOfLines={1}>
            {venue.name}
          </Text>
          
          <Text style={styles.gridCategory} numberOfLines={1}>
            {venue.category}
          </Text>
          
          {venue.features && venue.features.length > 0 && (
            <View style={styles.gridFeatures}>
              <BlurView style={styles.featureBlur} tint="light" intensity={30}>
                <Text style={styles.gridFeatureText}>
                  {venue.features[0]}
                </Text>
              </BlurView>
              {venue.features.length > 1 && (
                <BlurView style={[styles.featureBlur, { marginLeft: spacing.sm }]} tint="light" intensity={30}>
                  <Text style={styles.gridFeatureText}>
                    +{venue.features.length - 1} more
                  </Text>
                </BlurView>
              )}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // List layout styles
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius['2xl'],
    marginHorizontal: spacing.md,
    borderWidth: 1,
    ...shadows.sm,
  },
  listImageContainer: {
    position: 'relative',
  },
  listImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.xl,
  },
  listContent: {
    marginLeft: spacing.md,
    flex: 1,
  },
  listTitle: {
    fontWeight: '700',
    fontSize: 18,
    marginBottom: spacing.xs,
  },
  listCategory: {
    fontSize: 14,
    marginBottom: spacing.sm,
  },
  listDescription: {
    fontSize: 12,
    marginBottom: spacing.sm,
  },
  listFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    marginLeft: spacing.xs,
    fontWeight: '500',
  },
  distanceText: {
    fontSize: 14,
    marginLeft: spacing.sm,
  },
  featuresContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '500',
  },

  // Grid layout styles
  gridCard: {
    borderRadius: borderRadius['2xl'],
    overflow: 'hidden',
    marginBottom: spacing.md,
    ...shadows.lg,
  },
  gridImageContainer: {
    position: 'relative',
    flex: 1,
  },
  gridImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  statusContainer: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
  },
  statusIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  gridContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
  },
  gridRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  gridRatingText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
    marginLeft: spacing.xs,
  },
  gridDistanceText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginLeft: spacing.sm,
  },
  gridTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  gridCategory: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    marginBottom: spacing.sm,
  },
  gridFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureBlur: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  gridFeatureText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default VenueCard;
