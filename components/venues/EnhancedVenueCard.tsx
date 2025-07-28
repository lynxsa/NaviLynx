import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ModernCard } from '@/components/ui/ModernCard';
import { useTheme } from '@/context/ThemeContext';
import { colors, spacing, borderRadius } from '@/styles/modernTheme';
import { router } from 'expo-router';

interface EnhancedVenueCardProps {
  venue: {
    id: string;
    name: string;
    description?: string;
    rating?: number;
    distance?: string;
    image: string;
    location?: string;
    category?: string;
    features?: string[];
    isOpen?: boolean;
    closingTime?: string;
    openingHours?: string;
    priceLevel?: 'budget' | 'moderate' | 'expensive' | 'luxury';
  };
  onPress?: (venueId: string) => void;
  onNavigate?: (venueId: string) => void;
  size?: 'small' | 'medium' | 'large';
  showFeatures?: boolean;
  showNavigateButton?: boolean;
}

export const EnhancedVenueCard: React.FC<EnhancedVenueCardProps> = ({
  venue,
  onPress,
  onNavigate,
  size = 'medium',
  showFeatures = true,
  showNavigateButton = true,
}) => {
  const { isDark } = useTheme();

  const handlePress = () => {
    if (onPress) {
      onPress(venue.id);
    } else {
      router.push(`/venue/${venue.id}`);
    }
  };

  const handleNavigate = () => {
    if (onNavigate) {
      onNavigate(venue.id);
    } else {
      router.push(`/ar-navigation?venueId=${venue.id}`);
    }
  };

  const getClosingTime = () => {
    if (venue.closingTime) return venue.closingTime;
    if (venue.openingHours) {
      const match = venue.openingHours.match(/(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm))\s*$/);
      return match ? match[1] : '9:00 PM';
    }
    return '9:00 PM';
  };

  const cardWidths = {
    small: 200,
    medium: 280,
    large: '100%' as const,
  };

  const cardHeight = {
    small: 220,
    medium: 260,
    large: 300,
  };

  const getPriceLevelIcon = (level?: string) => {
    switch (level) {
      case 'budget': return '$';
      case 'moderate': return '$$';
      case 'expensive': return '$$$';
      case 'luxury': return '$$$$';
      default: return '$$';
    }
  };

  const getPriceLevelColor = (level?: string) => {
    switch (level) {
      case 'budget': return colors.success;
      case 'moderate': return colors.warning;
      case 'expensive': return colors.error;
      case 'luxury': return colors.primary;
      default: return colors.gray[500];
    }
  };

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
      <View style={{ position: 'relative', flex: 1 }}>
        <Image
          source={{ uri: venue.image }}
          style={{
            width: '100%',
            height: '60%',
            borderTopLeftRadius: borderRadius.xl,
            borderTopRightRadius: borderRadius.xl,
          }}
          resizeMode="cover"
        />
        
        {/* Gradient Overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)']}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '60%',
            borderTopLeftRadius: borderRadius.xl,
            borderTopRightRadius: borderRadius.xl,
          }}
        />

        {/* Status Badge */}
        {venue.isOpen !== undefined && (
          <View
            style={{
              position: 'absolute',
              top: spacing.sm,
              right: spacing.sm,
              backgroundColor: venue.isOpen ? colors.success : colors.error,
              paddingHorizontal: spacing.sm,
              paddingVertical: spacing.xs,
              borderRadius: borderRadius.sm,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: '#FFFFFF',
                marginRight: spacing.xs,
              }}
            />
            <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '600' }}>
              {venue.isOpen ? 'Open' : 'Closed'}
            </Text>
          </View>
        )}

        {/* Closing Time Badge */}
        {venue.isOpen && (
          <View
            style={{
              position: 'absolute',
              top: venue.isOpen !== undefined ? spacing.sm + 32 : spacing.sm,
              right: spacing.sm,
              backgroundColor: 'rgba(0,0,0,0.7)',
              paddingHorizontal: spacing.sm,
              paddingVertical: spacing.xs,
              borderRadius: borderRadius.sm,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <IconSymbol name="clock" size={10} color="#FFFFFF" />
            <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '500', marginLeft: 2 }}>
              Closes {getClosingTime()}
            </Text>
          </View>
        )}

        {/* Rating Badge */}
        {venue.rating && (
          <View
            style={{
              position: 'absolute',
              top: spacing.sm,
              left: spacing.sm,
              backgroundColor: 'rgba(0,0,0,0.7)',
              paddingHorizontal: spacing.sm,
              paddingVertical: spacing.xs,
              borderRadius: borderRadius.sm,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <IconSymbol name="star.fill" size={12} color={colors.warning} />
            <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '600', marginLeft: 2 }}>
              {venue.rating.toFixed(1)}
            </Text>
          </View>
        )}
      </View>

      {/* Content Section */}
      <View style={{ padding: spacing.md, flex: 1, justifyContent: 'space-between' }}>
        {/* Title and Category */}
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.xs }}>
            <Text
              style={{
                fontSize: size === 'small' ? 14 : 16,
                fontWeight: '700',
                color: isDark ? '#FFFFFF' : colors.gray[900],
                flex: 1,
                marginRight: spacing.xs,
              }}
              numberOfLines={1}
            >
              {venue.name}
            </Text>
            {venue.priceLevel && (
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: getPriceLevelColor(venue.priceLevel),
                }}
              >
                {getPriceLevelIcon(venue.priceLevel)}
              </Text>
            )}
          </View>

          {venue.category && (
            <View
              style={{
                backgroundColor: colors.primary + '15',
                paddingHorizontal: spacing.sm,
                paddingVertical: 2,
                borderRadius: borderRadius.sm,
                alignSelf: 'flex-start',
                marginBottom: spacing.xs,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: '600',
                  color: colors.primary,
                  textTransform: 'uppercase',
                }}
              >
                {venue.category}
              </Text>
            </View>
          )}

          {venue.description && (
            <Text
              style={{
                fontSize: 12,
                color: isDark ? 'rgba(255,255,255,0.7)' : colors.gray[600],
                lineHeight: 16,
                marginBottom: spacing.xs,
              }}
              numberOfLines={2}
            >
              {venue.description}
            </Text>
          )}
        </View>

        {/* Features */}
        {showFeatures && venue.features && venue.features.length > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.xs }}>
            {venue.features.slice(0, 3).map((feature, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : colors.gray[100],
                  paddingHorizontal: spacing.xs,
                  paddingVertical: 2,
                  borderRadius: borderRadius.sm,
                  marginRight: spacing.xs,
                  marginBottom: 2,
                }}
              >
                <Text
                  style={{
                    fontSize: 9,
                    color: isDark ? 'rgba(255,255,255,0.8)' : colors.gray[600],
                    fontWeight: '500',
                  }}
                >
                  {feature}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            {venue.location && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                <IconSymbol name="location" size={12} color={colors.gray[500]} />
                <Text
                  style={{
                    fontSize: 11,
                    color: isDark ? 'rgba(255,255,255,0.6)' : colors.gray[500],
                    marginLeft: 4,
                  }}
                  numberOfLines={1}
                >
                  {venue.location}
                </Text>
              </View>
            )}
            {venue.distance && (
              <Text
                style={{
                  fontSize: 11,
                  color: colors.primary,
                  fontWeight: '600',
                }}
              >
                {venue.distance}
              </Text>
            )}
          </View>
          
          {/* Navigate Button */}
          {showNavigateButton && (
            <TouchableOpacity
              onPress={handleNavigate}
              style={{
                backgroundColor: colors.primary,
                paddingHorizontal: spacing.sm,
                paddingVertical: spacing.xs,
                borderRadius: borderRadius.sm,
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: spacing.sm,
              }}
              activeOpacity={0.8}
            >
              <IconSymbol name="location.fill" size={12} color="#FFFFFF" />
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 10,
                  fontWeight: '600',
                  marginLeft: 2,
                }}
              >
                Navigate
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ModernCard>
  );
};
