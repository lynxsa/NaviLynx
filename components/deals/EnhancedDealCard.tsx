import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ModernCard } from '@/components/ui/ModernCard';
import { useTheme } from '@/context/ThemeContext';
import { colors, spacing, borderRadius } from '@/styles/modernTheme';
import { router } from 'expo-router';

interface EnhancedDealCardProps {
  deal: {
    id: string;
    title: string;
    description?: string;
    originalPrice?: number;
    discountedPrice?: number;
    discountPercentage?: number;
    image: string;
    venue?: string;
    category?: string;
    validUntil?: string;
    isLimited?: boolean;
    badge?: string;
  };
  onPress?: (dealId: string) => void;
  size?: 'small' | 'medium' | 'large';
  layout?: 'vertical' | 'horizontal';
}

export const EnhancedDealCard: React.FC<EnhancedDealCardProps> = ({
  deal,
  onPress,
  size = 'medium',
  layout = 'vertical',
}) => {
  const { isDark } = useTheme();

  const handlePress = () => {
    if (onPress) {
      onPress(deal.id);
    } else {
      router.push(`/deal-details/${deal.id}`);
    }
  };

  const cardWidths = {
    small: 180,
    medium: 240,
    large: '100%' as const,
  };

  const cardHeight = {
    small: layout === 'horizontal' ? 120 : 200,
    medium: layout === 'horizontal' ? 140 : 240,
    large: layout === 'horizontal' ? 160 : 280,
  };

  const getDiscountColor = (percentage?: number) => {
    if (!percentage) return colors.success;
    if (percentage >= 50) return colors.error;
    if (percentage >= 30) return colors.warning;
    return colors.success;
  };

  const formatPrice = (price: number) => {
    return `R${price.toFixed(0)}`;
  };

  const formatTimeLeft = (validUntil?: string) => {
    if (!validUntil) return '';
    const now = new Date();
    const endDate = new Date(validUntil);
    const diff = endDate.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d left`;
    if (hours > 0) return `${hours}h left`;
    return 'Ending soon';
  };

  if (layout === 'horizontal') {
    return (
      <ModernCard
        onPress={handlePress}
        style={{
          width: cardWidths[size],
          height: cardHeight[size],
          padding: 0,
          marginRight: spacing.md,
        }}
        shadow="lg"
      >
        <View style={{ flexDirection: 'row', flex: 1 }}>
          {/* Image Section */}
          <View style={{ width: '40%', position: 'relative' }}>
            <Image
              source={{ uri: deal.image }}
              style={{
                width: '100%',
                height: '100%',
                borderTopLeftRadius: borderRadius.xl,
                borderBottomLeftRadius: borderRadius.xl,
              }}
              resizeMode="cover"
            />
            
            {/* Discount Badge */}
            {deal.discountPercentage && (
              <View
                style={{
                  position: 'absolute',
                  top: spacing.xs,
                  left: spacing.xs,
                  backgroundColor: getDiscountColor(deal.discountPercentage),
                  paddingHorizontal: spacing.xs,
                  paddingVertical: 2,
                  borderRadius: borderRadius.xs,
                }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '700' }}>
                  -{deal.discountPercentage}%
                </Text>
              </View>
            )}
          </View>

          {/* Content Section */}
          <View style={{ flex: 1, padding: spacing.sm, justifyContent: 'space-between' }}>
            <View>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '700',
                  color: isDark ? '#FFFFFF' : colors.gray[900],
                  marginBottom: spacing.xs,
                }}
                numberOfLines={2}
              >
                {deal.title}
              </Text>
              
              {deal.venue && (
                <Text
                  style={{
                    fontSize: 10,
                    color: colors.primary,
                    fontWeight: '600',
                    marginBottom: spacing.xs,
                  }}
                  numberOfLines={1}
                >
                  {deal.venue}
                </Text>
              )}
            </View>

            {/* Price Section */}
            <View>
              {deal.originalPrice && deal.discountedPrice && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text
                    style={{
                      fontSize: 11,
                      color: isDark ? 'rgba(255,255,255,0.5)' : colors.gray[400],
                      textDecorationLine: 'line-through',
                      marginRight: spacing.xs,
                    }}
                  >
                    {formatPrice(deal.originalPrice)}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '700',
                      color: getDiscountColor(deal.discountPercentage),
                    }}
                  >
                    {formatPrice(deal.discountedPrice)}
                  </Text>
                </View>
              )}
              
              {deal.validUntil && (
                <Text
                  style={{
                    fontSize: 9,
                    color: isDark ? 'rgba(255,255,255,0.6)' : colors.gray[500],
                    marginTop: 2,
                  }}
                >
                  {formatTimeLeft(deal.validUntil)}
                </Text>
              )}
            </View>
          </View>
        </View>
      </ModernCard>
    );
  }

  // Vertical Layout
  return (
    <ModernCard
      onPress={handlePress}
      style={{
        width: cardWidths[size],
        height: cardHeight[size],
        padding: 0,
        marginRight: size !== 'large' ? spacing.md : 0,
      }}
      shadow="lg"
    >
      {/* Hero Image */}
      <View style={{ position: 'relative', height: '60%' }}>
        <Image
          source={{ uri: deal.image }}
          style={{
            width: '100%',
            height: '100%',
            borderTopLeftRadius: borderRadius.xl,
            borderTopRightRadius: borderRadius.xl,
          }}
          resizeMode="cover"
        />
        
        {/* Gradient Overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.4)']}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50%',
            borderTopLeftRadius: borderRadius.xl,
            borderTopRightRadius: borderRadius.xl,
          }}
        />

        {/* Discount Badge */}
        {deal.discountPercentage && (
          <View
            style={{
              position: 'absolute',
              top: spacing.sm,
              right: spacing.sm,
              backgroundColor: getDiscountColor(deal.discountPercentage),
              paddingHorizontal: spacing.sm,
              paddingVertical: spacing.xs,
              borderRadius: borderRadius.sm,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>
              -{deal.discountPercentage}% OFF
            </Text>
          </View>
        )}

        {/* Limited Badge */}
        {deal.isLimited && (
          <View
            style={{
              position: 'absolute',
              top: spacing.sm,
              left: spacing.sm,
              backgroundColor: colors.error,
              paddingHorizontal: spacing.sm,
              paddingVertical: spacing.xs,
              borderRadius: borderRadius.sm,
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '600' }}>
              LIMITED
            </Text>
          </View>
        )}
      </View>

      {/* Content Section */}
      <View style={{ padding: spacing.md, flex: 1, justifyContent: 'space-between' }}>
        {/* Title and Venue */}
        <View>
          <Text
            style={{
              fontSize: size === 'small' ? 14 : 16,
              fontWeight: '700',
              color: isDark ? '#FFFFFF' : colors.gray[900],
              marginBottom: spacing.xs,
            }}
            numberOfLines={2}
          >
            {deal.title}
          </Text>
          
          {deal.venue && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs }}>
              <IconSymbol name="building.2" size={12} color={colors.primary} />
              <Text
                style={{
                  fontSize: 11,
                  color: colors.primary,
                  fontWeight: '600',
                  marginLeft: 4,
                }}
                numberOfLines={1}
              >
                {deal.venue}
              </Text>
            </View>
          )}

          {deal.description && (
            <Text
              style={{
                fontSize: 12,
                color: isDark ? 'rgba(255,255,255,0.7)' : colors.gray[600],
                lineHeight: 16,
              }}
              numberOfLines={2}
            >
              {deal.description}
            </Text>
          )}
        </View>

        {/* Price and Time Section */}
        <View>
          {deal.originalPrice && deal.discountedPrice && (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xs }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={{
                    fontSize: 13,
                    color: isDark ? 'rgba(255,255,255,0.5)' : colors.gray[400],
                    textDecorationLine: 'line-through',
                    marginRight: spacing.sm,
                  }}
                >
                  {formatPrice(deal.originalPrice)}
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '700',
                    color: getDiscountColor(deal.discountPercentage),
                  }}
                >
                  {formatPrice(deal.discountedPrice)}
                </Text>
              </View>
              
              <TouchableOpacity
                style={{
                  backgroundColor: colors.primary,
                  paddingHorizontal: spacing.sm,
                  paddingVertical: spacing.xs,
                  borderRadius: borderRadius.sm,
                }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '600' }}>
                  GET DEAL
                </Text>
              </TouchableOpacity>
            </View>
          )}
          
          {deal.validUntil && (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <IconSymbol name="clock" size={12} color={colors.warning} />
                <Text
                  style={{
                    fontSize: 11,
                    color: colors.warning,
                    fontWeight: '600',
                    marginLeft: 4,
                  }}
                >
                  {formatTimeLeft(deal.validUntil)}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </ModernCard>
  );
};
