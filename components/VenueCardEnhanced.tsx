import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, Animated } from 'react-native';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { ModernCard } from "@/components/ui/ModernComponents";


interface VenueCardProps {
  id: string;
  name: string;
  category: string;
  distance: string;
  badge?: string;
  image?: string;
  imageUrl?: string;
  description?: string;
  onPress: () => void;
  onChatPress: () => void;
  style?: any;
  variant?: 'default' | 'compact' | 'featured';
  rating?: number;
  isOpen?: boolean;
  tags?: string[]; // new prop for tags
  status?: 'open' | 'closed' | 'busy' | 'quiet';
  onSaveToggle?: (id: string, saved: boolean) => void;
  initiallySaved?: boolean;
}

const styles = StyleSheet.create({
  container: {
    marginRight: 16,
  },
  featuredContainer: {
    marginVertical: 12,
  },
  cardContent: {
    overflow: 'hidden',
    borderRadius: 16,
  },
  imageContainer: {
    position: 'relative',
    height: 140,
    overflow: 'hidden',
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
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: "700",
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
    fontWeight: "700",
  },
  contentContainer: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    marginRight: 12,
  },
  ratingContainer: {
    alignItems: 'flex-end',
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "600",
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  category: {
    flex: 1,
    fontSize: 14,
    marginRight: 12,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distance: {
    fontSize: 14,
    fontWeight: "600",
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  primaryAction: {
    // backgroundColor set dynamically
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
  },
  glass: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    // Note: backdropFilter is web-only
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  tagChip: {
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 4,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  saveButton: {
    marginLeft: 8,
    padding: 4,
  },
  description: {
    fontSize: 13,
    marginBottom: 6,
  },
  featuredTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 4,
  },
  featuredText: {
    color: '#333',
    fontWeight: '700',
    fontSize: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    marginRight: 4,
    gap: 4,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 4,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export function VenueCard({
  id,
  name,
  category,
  distance,
  badge,
  image,
  imageUrl,
  description,
  onPress,
  onChatPress,
  style,
  variant = 'default',
  rating,
  isOpen = true,
  tags = [],
  status = 'open',
  onSaveToggle,
  initiallySaved = false,
}: VenueCardProps & { tags?: string[] }) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { width } = Dimensions.get('window');

  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  };

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

  const statusMap = {
    open: { label: 'Open', color: '#4CAF50' },
    closed: { label: 'Closed', color: '#F44336' },
    busy: { label: 'Busy', color: '#FF9800' },
    quiet: { label: 'Quiet', color: '#2196F3' },
  };

  const [saved, setSaved] = React.useState(initiallySaved);
  const handleSave = () => {
    setSaved((prev) => {
      const next = !prev;
      if (onSaveToggle) onSaveToggle(id, next);
      return next;
    });
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[
          styles.container,
          { width: getCardWidth() },
          variant === 'featured' && styles.featuredContainer,
          style
        ]}
        onPress={onPress}
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <ModernCard 
          variant={variant === 'featured' ? 'elevated' : 'standard'}
          padding="none"
          style={([styles.cardContent, styles.glass] as any)}
        >
          <View style={styles.imageContainer}>
            {(image || imageUrl) ? (
              <Image source={{ uri: image || imageUrl }} style={styles.image} />
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
              {/* Venue Status Indicator */}
              {status && (
                <View style={styles.statusRow}>
                  <View style={[styles.statusDot, { backgroundColor: statusMap[status].color }]} />
                  <Text style={styles.statusLabel}>{statusMap[status].label}</Text>
                </View>
              )}
              {/* Save/Bookmark Button */}
              <TouchableOpacity style={styles.saveButton} onPress={handleSave} accessibilityLabel={saved ? 'Unsave venue' : 'Save venue'}>
                <IconSymbol name={saved ? 'bookmark.fill' : 'bookmark'} size={20} color={saved ? colors.primary : colors.mutedForeground} />
              </TouchableOpacity>
              {rating && (
                <View style={styles.ratingContainer}>
                  <View style={styles.starsContainer}>
                    {renderStars(rating)}
                  </View>
                  <Text style={[styles.ratingText, { color: colors.mutedForeground }]}> {rating.toFixed(1)} </Text>
                </View>
              )}
            </View>

            <View style={styles.detailsRow}>
              <Text style={[styles.category, { color: colors.mutedForeground }]} numberOfLines={1}>
                {category}
              </Text>
              <View style={styles.distanceContainer}>
                <IconSymbol name="location" size={12} color={colors.mutedForeground} />
                <Text style={[styles.distance, { color: colors.mutedForeground }]}> {distance} </Text>
              </View>
            </View>

            {/* Venue Description */}
            {description && (
              <Text style={[styles.description, { color: colors.mutedForeground }]} numberOfLines={2}>
                {description}
              </Text>
            )}
            {/* Venue Tags */}
            {tags && tags.length > 0 && (
              <View style={styles.tagsRow}>
                {tags.map((tag, idx) => (
                  <View key={idx} style={styles.tagChip}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Featured Indicator */}
            {variant === "featured" && (
              <View style={styles.featuredTag}>
                <Text style={styles.featuredText}>Featured</Text>
              </View>
            )}

            {variant !== 'compact' && (
              <View style={styles.actionRow}>
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: colors.surface }]}
                  onPress={onChatPress}
                >
                  <IconSymbol name="message" size={16} color={colors.primary} />
                  <Text style={[styles.actionText, { color: colors.primary }]}> {t('chat') || 'Chat'} </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.primaryAction, { backgroundColor: colors.primary }]}
                  onPress={onPress}
                >
                  <IconSymbol name="arrow.right" size={16} color="#FFFFFF" />
                  <Text style={[styles.actionText, { color: '#FFFFFF' }]}> {t('navigate') || 'Navigate'} </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ModernCard>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default VenueCard;
