import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { BaseCard } from './BaseCard';
import { colors } from '../../styles/modernTheme';

interface EnhancedDeal {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  image: string;
  venue: string;
  category: string;
  validUntil: string;
  isLimited: boolean;
  badge?: string;
}

interface DealCardProps {
  deal: EnhancedDeal;
  onPress: (id: string) => void;
  style?: ViewStyle;
  cardWidth?: number;
}

export function DealCard({ deal, onPress, style, cardWidth = 240 }: DealCardProps) {

  return (
    <BaseCard
      style={{
        width: cardWidth, 
        marginRight: 16,
        ...(style || {})
      }}
      onPress={() => onPress(deal.id)}
      variant="elevated"
    >
      <View style={styles.container}>
        {/* Deal Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: deal.image }} 
            style={styles.dealImage}
            resizeMode="cover"
          />
          {deal.discountPercentage > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{deal.discountPercentage}% OFF</Text>
            </View>
          )}
          {deal.isLimited && (
            <View style={styles.limitedBadge}>
              <Text style={styles.limitedText}>LIMITED</Text>
            </View>
          )}
        </View>

        {/* Deal Info */}
        <View style={styles.contentContainer}>
          <Text style={styles.dealTitle} numberOfLines={2}>
            {deal.title}
          </Text>

          <Text style={styles.dealDescription} numberOfLines={2}>
            {deal.description}
          </Text>

          {/* Pricing */}
          <View style={styles.pricingContainer}>
            <Text style={styles.discountedPrice}>
              R{deal.discountedPrice.toFixed(2)}
            </Text>
            {deal.originalPrice > deal.discountedPrice && (
              <Text style={styles.originalPrice}>
                R{deal.originalPrice.toFixed(2)}
              </Text>
            )}
          </View>

          {/* Venue and Category */}
          <View style={styles.venueContainer}>
            <Text style={styles.venueName} numberOfLines={1}>
              {deal.venue}
            </Text>
            <Text style={styles.categoryText}>
              {deal.category}
            </Text>
          </View>

          {/* Valid Until */}
          <Text style={styles.expiryText}>
            Valid until {new Date(deal.validUntil).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </BaseCard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 140,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  dealImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: colors.textLight,
    fontSize: 12,
    fontWeight: 'bold',
  },
  limitedBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  limitedText: {
    color: colors.textLight,
    fontSize: 10,
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 12,
    flex: 1,
  },
  dealTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    lineHeight: 20,
  },
  dealDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 16,
  },
  pricingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  discountedPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  originalPrice: {
    fontSize: 14,
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  venueContainer: {
    marginBottom: 8,
  },
  venueName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  categoryText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  expiryText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
