import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { colors, spacing, borderRadius, shadows } from '@/styles/modernTheme';
import { deals } from '@/data/southAfricanVenues';

const { width } = Dimensions.get('window');
const dealCardWidth = width * 0.6;

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
      activeOpacity={0.9}
      style={[
        styles.dealCard,
        { width: dealCardWidth, height: 120 }
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
              {deal.discount} OFF
            </Text>
          </View>
          <View style={styles.timeContainer}>
            <IconSymbol name="clock" size={12} color="rgba(255,255,255,0.8)" />
            <Text style={styles.timeText}>Until {deal.validUntil}</Text>
          </View>
        </View>
        
        <View>
          <Text style={styles.dealTitle}>
            {deal.title}
          </Text>
          <Text style={styles.dealVenue}>
            {deal.venueName}
          </Text>
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
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {dealsData.map((deal) => (
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
    fontSize: 10,
    fontWeight: '700',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    marginLeft: spacing.xs,
  },
  dealTitle: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
    marginBottom: spacing.xs,
  },
  dealVenue: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    fontWeight: '500',
  },
  scrollContainer: {
    paddingHorizontal: spacing.md,
  },
});

export default DealsCarousel;
