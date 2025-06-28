import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useLanguage } from '@/context/LanguageContext';
import GlassCard from '@/components/GlassCard';
import { BorderRadius, Typography, Spacing } from '@/constants/Theme';

interface VenueCardProps {
  id: string;
  name: string;
  category: string;
  distance: string;
  badge?: string;
  imageUrl?: string;
  onPress: () => void;
  onChatPress: () => void;
  style?: any;
  variant?: 'default' | 'compact' | 'featured';
  rating?: number;
  isOpen?: boolean;
}

export function VenueCard({
  id,
  name,
  category,
  distance,
  badge,
  imageUrl,
  onPress,
  onChatPress,
  style,
  variant = 'default',
  rating,
  isOpen = true,
}: VenueCardProps) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { width } = Dimensions.get('window');

  const getCardWidth = () => {
    switch (variant) {
      case 'compact': return width * 0.4;
      case 'featured': return width * 0.85;
      default: return width * 0.7;
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <IconSymbol
          key={i}
          name={i <= rating ? 'star.fill' : 'star'}
          size={12}
          color={i <= rating ? '#FFD700' : colors.mutedForeground}
        />
      );
    }
    return stars;
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { width: getCardWidth() },
        variant === 'featured' && styles.featuredContainer,
        style
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <GlassCard 
        variant={variant === 'featured' ? 'elevated' : 'default'}
        padding="none"
        style={styles.cardContent}
      >
        <View style={styles.imageContainer}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.image} />
          ) : (
            <View style={[styles.placeholderImage, { backgroundColor: colors.muted }]}>
              <IconSymbol name="photo" size={variant === 'compact' ? 24 : 32} color={colors.mutedForeground} />
            </View>
          )}
          
          {badge && (
            <View style={[styles.badge, { backgroundColor: colors.primary }]}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          )}

          {!isOpen && (
            <View style={[styles.closedOverlay, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
              <Text style={styles.closedText}>Closed</Text>
            </View>
          )}
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
              {name}
            </Text>
            {rating && (
              <View style={styles.ratingContainer}>
                <View style={styles.starsContainer}>
                  {renderStars(rating)}
                </View>
                <Text style={[styles.ratingText, { color: colors.mutedForeground }]}>
                  {rating.toFixed(1)}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.detailsRow}>
            <Text style={[styles.category, { color: colors.mutedForeground }]} numberOfLines={1}>
              {category}
            </Text>
            <View style={styles.distanceContainer}>
              <IconSymbol name="location" size={12} color={colors.mutedForeground} />
              <Text style={[styles.distance, { color: colors.mutedForeground }]}>
                {distance}
              </Text>
            </View>
          </View>

          {variant !== 'compact' && (
            <View style={styles.actionRow}>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: colors.surface }]}
                onPress={onChatPress}
              >
                <IconSymbol name="message" size={16} color={colors.primary} />
                <Text style={[styles.actionText, { color: colors.primary }]}>
                  {t('chat') || 'Chat'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.primaryAction, { backgroundColor: colors.primary }]}
                onPress={onPress}
              >
                <IconSymbol name="arrow.right" size={16} color="#FFFFFF" />
                <Text style={[styles.actionText, { color: '#FFFFFF' }]}>
                  {t('navigate') || 'Navigate'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
}

export default VenueCard;

const styles = StyleSheet.create({
  container: {
    marginRight: Spacing.md,
  },
  featuredContainer: {
    marginHorizontal: Spacing.md,
  },
  cardContent: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 140,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  closedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closedText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: Spacing.sm,
  },
  ratingContainer: {
    alignItems: 'flex-end',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    marginTop: 2,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    fontSize: 12,
    flex: 1,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distance: {
    fontSize: 12,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 12,
    gap: 6,
    flex: 1,
    justifyContent: 'center',
  },
  primaryAction: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
