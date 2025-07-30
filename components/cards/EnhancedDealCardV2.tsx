import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { BaseCard } from './EnhancedBaseCard';
import { designSystem } from '../../styles/designSystem';
import { IconSymbol } from '../ui/IconSymbol';

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
  termsConditions?: string[];
  minimumPurchase?: number;
  maxRedemptions?: number;
  currentRedemptions?: number;
}

interface EnhancedDealCardProps {
  deal: EnhancedDeal;
  onPress: (dealId: string) => void;
  style?: ViewStyle;
  variant?: 'compact' | 'standard' | 'featured';
  showCountdown?: boolean;
  showProgress?: boolean;
}

export function EnhancedDealCard({
  deal,
  onPress,
  style,
  variant = 'standard',
  showCountdown = true,
  showProgress = false,
}: EnhancedDealCardProps) {
  const handlePress = () => onPress(deal.id);

  const formatPrice = (price: number) => {
    return `R${price.toFixed(2)}`;
  };

  const getTimeRemaining = () => {
    const now = new Date();
    const validUntil = new Date(deal.validUntil);
    const timeLeft = validUntil.getTime() - now.getTime();
    
    if (timeLeft <= 0) return 'Expired';
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d left`;
    if (hours > 0) return `${hours}h left`;
    return 'Ending soon';
  };

  const getProgressPercentage = () => {
    if (!deal.maxRedemptions || !deal.currentRedemptions) return 0;
    return (deal.currentRedemptions / deal.maxRedemptions) * 100;
  };

  const getSavingsAmount = () => {
    return deal.originalPrice - deal.discountedPrice;
  };

  const renderDiscountBadge = () => (
    <View style={styles.discountBadge}>
      <Text style={styles.discountText}>
        {deal.discountPercentage}% OFF
      </Text>
    </View>
  );

  const renderLimitedBadge = () => {
    if (!deal.isLimited) return null;
    
    return (
      <View style={styles.limitedBadge}>
        <IconSymbol name="clock" size={12} color={designSystem.colors.error[600]} />
        <Text style={styles.limitedText}>Limited Time</Text>
      </View>
    );
  };

  const renderCustomBadge = () => {
    if (!deal.badge) return null;
    
    return (
      <View style={styles.customBadge}>
        <Text style={styles.customBadgeText}>{deal.badge}</Text>
      </View>
    );
  };

  const renderCountdown = () => {
    if (!showCountdown) return null;
    
    const timeRemaining = getTimeRemaining();
    const isUrgent = timeRemaining.includes('h') || timeRemaining === 'Ending soon';
    
    return (
      <View style={[
        styles.countdownContainer,
        isUrgent && styles.countdownUrgent
      ]}>
        <IconSymbol 
          name="clock" 
          size={12} 
          color={isUrgent ? designSystem.colors.error[600] : designSystem.colors.text.secondary} 
        />
        <Text style={[
          styles.countdownText,
          isUrgent && styles.countdownTextUrgent
        ]}>
          {timeRemaining}
        </Text>
      </View>
    );
  };

  const renderProgress = () => {
    if (!showProgress || !deal.maxRedemptions) return null;
    
    const progress = getProgressPercentage();
    const remaining = deal.maxRedemptions - (deal.currentRedemptions || 0);
    
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[
            styles.progressFill,
            { width: `${progress}%` }
          ]} />
        </View>
        <Text style={styles.progressText}>
          {remaining} left
        </Text>
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
          category: 'deal',
          action: 'view',
          label: deal.title,
          value: getSavingsAmount(),
        }}
        id={deal.id}
      >
        <View style={styles.compactContent}>
          <View style={styles.compactImageContainer}>
            <Image source={{ uri: deal.image }} style={styles.compactImage} />
            {renderDiscountBadge()}
          </View>
          
          <View style={styles.compactInfo}>
            <Text style={styles.compactTitle} numberOfLines={2}>
              {deal.title}
            </Text>
            
            <View style={styles.compactPricing}>
              <Text style={styles.compactDiscountedPrice}>
                {formatPrice(deal.discountedPrice)}
              </Text>
              <Text style={styles.compactOriginalPrice}>
                {formatPrice(deal.originalPrice)}
              </Text>
            </View>
            
            <View style={styles.compactFooter}>
              <Text style={styles.compactVenue} numberOfLines={1}>
                {deal.venue}
              </Text>
              {renderCountdown()}
            </View>
          </View>
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
          category: 'deal',
          action: 'view_featured',
          label: deal.title,
          value: getSavingsAmount(),
        }}
        id={deal.id}
      >
        <View style={styles.featuredContent}>
          <View style={styles.featuredImageContainer}>
            <Image source={{ uri: deal.image }} style={styles.featuredImage} />
            <View style={styles.featuredOverlay}>
              <View style={styles.featuredBadges}>
                {renderCustomBadge()}
                {renderLimitedBadge()}
                {renderDiscountBadge()}
              </View>
            </View>
          </View>
          
          <View style={styles.featuredInfo}>
            <View style={styles.featuredHeader}>
              <Text style={styles.featuredTitle} numberOfLines={2}>
                {deal.title}
              </Text>
              <Text style={styles.featuredVenue}>{deal.venue}</Text>
            </View>
            
            <Text style={styles.featuredDescription} numberOfLines={3}>
              {deal.description}
            </Text>
            
            <View style={styles.featuredPricing}>
              <View style={styles.priceContainer}>
                <Text style={styles.featuredDiscountedPrice}>
                  {formatPrice(deal.discountedPrice)}
                </Text>
                <Text style={styles.featuredOriginalPrice}>
                  {formatPrice(deal.originalPrice)}
                </Text>
              </View>
              
              <View style={styles.savingsContainer}>
                <Text style={styles.savingsLabel}>You save</Text>
                <Text style={styles.savingsAmount}>
                  {formatPrice(getSavingsAmount())}
                </Text>
              </View>
            </View>
            
            <View style={styles.featuredFooter}>
              {renderCountdown()}
              {renderProgress()}
            </View>
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
        category: 'deal',
        action: 'view',
        label: deal.title,
        value: getSavingsAmount(),
      }}
      id={deal.id}
    >
      <View style={styles.standardContent}>
        <View style={styles.standardImageContainer}>
          <Image source={{ uri: deal.image }} style={styles.standardImage} />
          {renderDiscountBadge()}
          {deal.isLimited && renderLimitedBadge()}
        </View>
        
        <View style={styles.standardInfo}>
          <View style={styles.standardHeader}>
            <Text style={styles.standardTitle} numberOfLines={2}>
              {deal.title}
            </Text>
            {renderCustomBadge()}
          </View>
          
          <Text style={styles.standardVenue}>{deal.venue}</Text>
          
          <Text style={styles.standardDescription} numberOfLines={2}>
            {deal.description}
          </Text>
          
          <View style={styles.standardPricing}>
            <View style={styles.priceContainer}>
              <Text style={styles.standardDiscountedPrice}>
                {formatPrice(deal.discountedPrice)}
              </Text>
              <Text style={styles.standardOriginalPrice}>
                {formatPrice(deal.originalPrice)}
              </Text>
            </View>
            
            <Text style={styles.savingsText}>
              Save {formatPrice(getSavingsAmount())}
            </Text>
          </View>
          
          <View style={styles.standardFooter}>
            {renderCountdown()}
            {renderProgress()}
          </View>
        </View>
      </View>
    </BaseCard>
  );
}

const styles = StyleSheet.create({
  // Compact variant
  compactCard: {
    marginBottom: designSystem.spacing.sm,
  },
  
  compactContent: {
    flexDirection: 'row',
  },
  
  compactImageContainer: {
    position: 'relative',
    marginRight: designSystem.spacing.md,
  },
  
  compactImage: {
    width: 80,
    height: 80,
    borderRadius: designSystem.borderRadius.lg,
  },
  
  compactInfo: {
    flex: 1,
  },
  
  compactTitle: {
    fontSize: designSystem.typography.fontSizes.base,
    fontWeight: designSystem.typography.fontWeights.semibold,
    color: designSystem.colors.text.primary,
    marginBottom: designSystem.spacing.xs,
    lineHeight: designSystem.typography.lineHeights.snug * designSystem.typography.fontSizes.base,
  },
  
  compactPricing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designSystem.spacing.sm,
    marginBottom: designSystem.spacing.xs,
  },
  
  compactDiscountedPrice: {
    fontSize: designSystem.typography.fontSizes.lg,
    fontWeight: designSystem.typography.fontWeights.bold,
    color: designSystem.colors.success[600],
  },
  
  compactOriginalPrice: {
    fontSize: designSystem.typography.fontSizes.sm,
    color: designSystem.colors.text.secondary,
    textDecorationLine: 'line-through',
  },
  
  compactFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  compactVenue: {
    fontSize: designSystem.typography.fontSizes.sm,
    color: designSystem.colors.text.secondary,
    flex: 1,
  },

  // Featured variant
  featuredCard: {
    marginBottom: designSystem.spacing.md,
  },
  
  featuredContent: {
    flex: 1,
  },
  
  featuredImageContainer: {
    position: 'relative',
    height: 200,
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
    fontSize: designSystem.typography.fontSizes['2xl'],
    fontWeight: designSystem.typography.fontWeights.bold,
    color: designSystem.colors.text.primary,
    lineHeight: designSystem.typography.lineHeights.tight * designSystem.typography.fontSizes['2xl'],
    marginBottom: designSystem.spacing.xs,
  },
  
  featuredVenue: {
    fontSize: designSystem.typography.fontSizes.base,
    color: designSystem.colors.primary[600],
    fontWeight: designSystem.typography.fontWeights.medium,
  },
  
  featuredDescription: {
    fontSize: designSystem.typography.fontSizes.base,
    color: designSystem.colors.text.secondary,
    lineHeight: designSystem.typography.lineHeights.relaxed * designSystem.typography.fontSizes.base,
    marginBottom: designSystem.spacing.md,
  },
  
  featuredPricing: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: designSystem.spacing.md,
    padding: designSystem.spacing.md,
    backgroundColor: designSystem.colors.success[50],
    borderRadius: designSystem.borderRadius.lg,
  },
  
  featuredDiscountedPrice: {
    fontSize: designSystem.typography.fontSizes['3xl'],
    fontWeight: designSystem.typography.fontWeights.bold,
    color: designSystem.colors.success[600],
  },
  
  featuredOriginalPrice: {
    fontSize: designSystem.typography.fontSizes.lg,
    color: designSystem.colors.text.secondary,
    textDecorationLine: 'line-through',
    marginTop: 4,
  },
  
  featuredFooter: {
    gap: designSystem.spacing.sm,
  },

  // Standard variant
  standardCard: {
    marginBottom: designSystem.spacing.md,
  },
  
  standardContent: {
    flexDirection: 'row',
  },
  
  standardImageContainer: {
    position: 'relative',
    marginRight: designSystem.spacing.md,
  },
  
  standardImage: {
    width: 120,
    height: 120,
    borderRadius: designSystem.borderRadius.lg,
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
    lineHeight: designSystem.typography.lineHeights.snug * designSystem.typography.fontSizes.lg,
  },
  
  standardVenue: {
    fontSize: designSystem.typography.fontSizes.sm,
    color: designSystem.colors.primary[600],
    fontWeight: designSystem.typography.fontWeights.medium,
    marginBottom: designSystem.spacing.sm,
  },
  
  standardDescription: {
    fontSize: designSystem.typography.fontSizes.sm,
    color: designSystem.colors.text.secondary,
    lineHeight: designSystem.typography.lineHeights.relaxed * designSystem.typography.fontSizes.sm,
    marginBottom: designSystem.spacing.sm,
  },
  
  standardPricing: {
    marginBottom: designSystem.spacing.sm,
  },
  
  standardDiscountedPrice: {
    fontSize: designSystem.typography.fontSizes.xl,
    fontWeight: designSystem.typography.fontWeights.bold,
    color: designSystem.colors.success[600],
  },
  
  standardOriginalPrice: {
    fontSize: designSystem.typography.fontSizes.base,
    color: designSystem.colors.text.secondary,
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  
  standardFooter: {
    gap: designSystem.spacing.xs,
  },

  // Common components
  discountBadge: {
    position: 'absolute',
    top: designSystem.spacing.sm,
    right: designSystem.spacing.sm,
    backgroundColor: designSystem.colors.error[500],
    paddingHorizontal: designSystem.spacing.sm,
    paddingVertical: 6,
    borderRadius: designSystem.borderRadius.full,
    ...designSystem.shadows.sm,
  },
  
  discountText: {
    color: designSystem.colors.text.inverse,
    fontSize: designSystem.typography.fontSizes.xs,
    fontWeight: designSystem.typography.fontWeights.bold,
  },
  
  limitedBadge: {
    position: 'absolute',
    top: designSystem.spacing.sm,
    left: designSystem.spacing.sm,
    backgroundColor: designSystem.colors.error[50],
    paddingHorizontal: designSystem.spacing.sm,
    paddingVertical: 4,
    borderRadius: designSystem.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  
  limitedText: {
    color: designSystem.colors.error[600],
    fontSize: designSystem.typography.fontSizes.xs,
    fontWeight: designSystem.typography.fontWeights.medium,
  },
  
  customBadge: {
    backgroundColor: designSystem.colors.primary[100],
    paddingHorizontal: designSystem.spacing.sm,
    paddingVertical: 4,
    borderRadius: designSystem.borderRadius.md,
  },
  
  customBadgeText: {
    color: designSystem.colors.primary[700],
    fontSize: designSystem.typography.fontSizes.xs,
    fontWeight: designSystem.typography.fontWeights.medium,
  },
  
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  
  countdownUrgent: {
    backgroundColor: designSystem.colors.error[50],
    paddingHorizontal: designSystem.spacing.sm,
    paddingVertical: 2,
    borderRadius: designSystem.borderRadius.md,
  },
  
  countdownText: {
    fontSize: designSystem.typography.fontSizes.sm,
    color: designSystem.colors.text.secondary,
    fontWeight: designSystem.typography.fontWeights.medium,
  },
  
  countdownTextUrgent: {
    color: designSystem.colors.error[600],
  },
  
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designSystem.spacing.sm,
  },
  
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: designSystem.colors.gray[200],
    borderRadius: 2,
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    backgroundColor: designSystem.colors.primary[500],
  },
  
  progressText: {
    fontSize: designSystem.typography.fontSizes.xs,
    color: designSystem.colors.text.secondary,
    fontWeight: designSystem.typography.fontWeights.medium,
  },
  
  priceContainer: {
    alignItems: 'flex-start',
  },
  
  savingsContainer: {
    alignItems: 'flex-end',
  },
  
  savingsLabel: {
    fontSize: designSystem.typography.fontSizes.xs,
    color: designSystem.colors.text.secondary,
    marginBottom: 2,
  },
  
  savingsAmount: {
    fontSize: designSystem.typography.fontSizes.lg,
    fontWeight: designSystem.typography.fontWeights.bold,
    color: designSystem.colors.success[600],
  },
  
  savingsText: {
    fontSize: designSystem.typography.fontSizes.sm,
    color: designSystem.colors.success[600],
    fontWeight: designSystem.typography.fontWeights.medium,
    marginTop: 2,
  },
});
