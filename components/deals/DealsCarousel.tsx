import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { colors, spacing, borderRadius, shadows } from '@/styles/modernTheme';
import { Deal } from '@/data/southAfricanVenues';

const { width } = Dimensions.get('window');
const dealCardWidth = width * 0.6;

// Enhanced deals data with better offers
const deals: Deal[] = [
  {
    id: '1',
    title: 'Flash Sale: Electronics',
    description: 'Smartphones, laptops & accessories at unbeatable prices',
    discount: '25% OFF',
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
    venueName: 'TechZone Menlyn',
    venueId: 'store1',
    category: 'Electronics'
  },
  {
    id: '2',
    title: 'Fashion Week Special',
    description: 'Latest trends from top South African designers',
    discount: '40% OFF',
    validUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
    venueName: 'Trendy Fashion',
    venueId: 'store2',
    category: 'Fashion'
  },
  {
    id: '3',
    title: 'Gourmet Food Festival',
    description: 'Taste the finest cuisine at participating restaurants',
    discount: '30% OFF',
    validUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
    venueName: 'Food Court Central',
    venueId: 'store3',
    category: 'Dining'
  }
];

interface DealCardProps {
  deal: typeof deals[0];
  onPress?: (deal: typeof deals[0]) => void;
}

const DealCard: React.FC<DealCardProps> = ({ deal, onPress }) => {
  const handlePress = () => {
    if (onPress) {
      onPress(deal);
    } else {
      router.push(`/venue/${deal.venueId}` as any);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      style={[
        styles.dealCard,
        { width: dealCardWidth, height: 140 }
      ]}
    >
      <Image
        source={{ uri: deal.image }}
        style={styles.dealImage}
        resizeMode="cover"
      />
      <View style={styles.dealOverlay}>
        <View style={styles.dealHeader}>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              {deal.discount}
            </Text>
          </View>
          <IconSymbol name="heart" size={16} color="rgba(255,255,255,0.9)" />
        </View>
        
        <View style={styles.dealContent}>
          <Text style={styles.dealTitle} numberOfLines={1}>
            {deal.title}
          </Text>
          <Text style={styles.dealDescription} numberOfLines={2}>
            {deal.description}
          </Text>
          <View style={styles.dealFooter}>
            <Text style={styles.dealVenue}>
              📍 {deal.venueName}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

interface DealsCarouselProps {
  dealsData?: typeof deals;
  onDealPress?: (deal: typeof deals[0]) => void;
}

export const DealsCarousel: React.FC<DealsCarouselProps> = ({ 
  dealsData = deals, 
  onDealPress 
}) => {
  // Ensure dealsData is always an array
  const safeDealsData = Array.isArray(dealsData) && dealsData.length > 0 ? dealsData : [];

  if (safeDealsData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No deals available</Text>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {safeDealsData.map((deal) => (
        <DealCard
          key={deal.id}
          deal={deal}
          onPress={onDealPress}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  dealCard: {
    marginRight: spacing.md,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  dealImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  dealOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  dealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  discountBadge: {
    backgroundColor: `${colors.primary[600]}CC`,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  dealContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  dealTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 4,
  },
  dealDescription: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
    lineHeight: 14,
    marginBottom: 6,
  },
  dealFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dealVenue: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    fontWeight: '600',
  },
  scrollContainer: {
    paddingHorizontal: spacing.md,
  },
  emptyContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.lg,
    margin: spacing.md,
  },
  emptyText: {
    color: colors.gray[600],
    fontSize: 16,
    fontWeight: '500',
  },
});

export default DealsCarousel;
