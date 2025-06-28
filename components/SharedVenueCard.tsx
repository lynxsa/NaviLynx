import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Text
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '@/context/ThemeContext';
import { brand } from '@/constants/branding';

interface Venue {
  id: string;
  name: string;
  type: string;
  location: {
    city: string;
    address?: string;
  };
  averageRating: number;
  image?: string;
  distance?: string;
  isOpen?: boolean;
}

interface SharedVenueCardProps {
  venue: Venue;
  onPress: () => void;
  variant?: 'standard' | 'compact' | 'detailed';
  showDistance?: boolean;
  showStatus?: boolean;
}

export default function SharedVenueCard({ 
  venue, 
  onPress, 
  variant = 'standard',
  showDistance = false,
  showStatus = true 
}: SharedVenueCardProps) {
  const { colors } = useTheme();

  const getVenueTypeGradient = (type: string): [string, string] => {
    switch (type.toLowerCase()) {
      case 'mall':
        return ['rgba(255, 107, 53, 0.1)', 'rgba(247, 147, 30, 0.05)'];
      case 'restaurant':
        return ['rgba(255, 45, 146, 0.1)', 'rgba(255, 107, 53, 0.05)'];
      case 'shopping':
        return ['rgba(88, 86, 214, 0.1)', 'rgba(0, 122, 255, 0.05)'];
      case 'entertainment':
        return ['rgba(50, 215, 75, 0.1)', 'rgba(52, 199, 89, 0.05)'];
      default:
        return ['rgba(0, 122, 255, 0.1)', 'rgba(52, 199, 89, 0.05)'];
    }
  };

  const getVenueTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'mall':
        return 'building.2.fill';
      case 'restaurant':
        return 'fork.knife';
      case 'shopping':
        return 'bag.fill';
      case 'entertainment':
        return 'tv.fill';
      default:
        return 'mappin.circle.fill';
    }
  };

  if (variant === 'compact') {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.compactContainer}>
        <ThemedView style={[styles.compactCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <LinearGradient
            colors={getVenueTypeGradient(venue.type)}
            style={styles.compactContent}
          >
            {venue.image && (
              <Image source={{ uri: venue.image }} style={styles.compactImage} />
            )}
            
            <View style={styles.compactInfo}>
              <ThemedText type="defaultSemiBold" style={styles.compactTitle} numberOfLines={1}>
                {venue.name}
              </ThemedText>
              
              <View style={styles.compactMeta}>
                <IconSymbol 
                  name={getVenueTypeIcon(venue.type) as any} 
                  size={12} 
                  color={colors.primary} 
                />
                <ThemedText style={[styles.compactType, { color: colors.textSecondary }]}>
                  {venue.type}
                </ThemedText>
              </View>
            </View>

            <View style={styles.compactRating}>
              <IconSymbol name="star.fill" size={10} color="#FFD700" />
              <ThemedText style={styles.compactRatingText}>
                {venue.averageRating.toFixed(1)}
              </ThemedText>
            </View>
          </LinearGradient>
        </ThemedView>
      </TouchableOpacity>
    );
  }

  if (variant === 'detailed') {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.detailedContainer}>
        <ThemedView style={[styles.detailedCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {venue.image && (
            <Image source={{ uri: venue.image }} style={styles.detailedImage} />
          )}
          
          <LinearGradient
            colors={getVenueTypeGradient(venue.type)}
            style={styles.detailedContent}
          >
            <View style={styles.detailedHeader}>
              <View style={styles.detailedInfo}>
                <ThemedText type="defaultSemiBold" style={styles.detailedTitle}>
                  {venue.name}
                </ThemedText>
                
                <View style={styles.detailedLocation}>
                  <IconSymbol name="location.fill" size={14} color={colors.primary} />
                  <ThemedText style={[styles.detailedLocationText, { color: colors.textSecondary }]}>
                    {venue.location.city}
                  </ThemedText>
                  {showDistance && venue.distance && (
                    <>
                      <Text style={[styles.detailedSeparator, { color: colors.textSecondary }]}>•</Text>
                      <ThemedText style={[styles.detailedDistance, { color: colors.textSecondary }]}> 
                        {venue.distance}
                      </ThemedText>
                    </>
                  )}
                </View>

                <View style={styles.detailedMeta}>
                  <ThemedView style={[styles.detailedTypeBadge, { backgroundColor: colors.primary + '20' }]}>
                    <IconSymbol 
                      name={getVenueTypeIcon(venue.type) as any} 
                      size={12} 
                      color={colors.primary} 
                    />
                    <ThemedText style={[styles.detailedTypeText, { color: colors.primary }]}>
                      {venue.type}
                    </ThemedText>
                  </ThemedView>

                  {showStatus && venue.isOpen !== undefined && (
                    <ThemedView style={[
                      styles.statusBadge,
                      { backgroundColor: venue.isOpen ? colors.success : colors.error }
                    ]}>
                      <Text style={styles.statusText}>
                        {venue.isOpen ? 'Open' : 'Closed'}
                      </Text>
                    </ThemedView>
                  )}
                </View>
              </View>
              
              <ThemedView style={[styles.detailedRatingContainer, { backgroundColor: colors.surface + '80' }]}>
                <IconSymbol name="star.fill" size={14} color="#FFD700" />
                <ThemedText style={[styles.detailedRatingText, { color: colors.text }]}>
                  {venue.averageRating.toFixed(1)}
                </ThemedText>
              </ThemedView>
            </View>
          </LinearGradient>
        </ThemedView>
      </TouchableOpacity>
    );
  }

  // Standard variant (default)
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.standardContainer}>
      <ThemedView style={[styles.standardCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <LinearGradient
          colors={getVenueTypeGradient(venue.type)}
          style={styles.standardContent}
        >
          <View style={styles.standardHeader}>
            <View style={styles.standardInfo}>
              <ThemedText type="defaultSemiBold" style={styles.standardTitle}>
                {venue.name}
              </ThemedText>
              
              <View style={styles.standardLocation}>
                <IconSymbol name="location.fill" size={14} color={colors.primary} />
                <ThemedText style={[styles.standardLocationText, { color: colors.textSecondary }]}>
                  {venue.location.city}
                </ThemedText>
              </View>

              <View style={styles.standardTypeContainer}>
                <ThemedView style={[styles.standardTypeBadge, { backgroundColor: colors.primary + '20' }]}>
                  <ThemedText style={[styles.standardTypeText, { color: colors.primary }]}>
                    {venue.type}
                  </ThemedText>
                </ThemedView>
              </View>
            </View>
            
            <ThemedView style={[styles.standardRatingContainer, { backgroundColor: colors.surface + '80' }]}>
              <IconSymbol name="star.fill" size={12} color="#FFD700" />
              <ThemedText style={[styles.standardRatingText, { color: colors.text }]}>
                {venue.averageRating.toFixed(1)}
              </ThemedText>
            </ThemedView>
          </View>
        </LinearGradient>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Standard variant styles
  standardContainer: {
    marginBottom: 16,
  },
  standardCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  standardContent: {
    padding: 16,
  },
  standardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  standardInfo: {
    flex: 1,
  },
  standardTitle: {
    marginBottom: 8,
  },
  standardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  standardLocationText: {
    marginLeft: 4,
    fontSize: 14,
  },
  standardTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  standardTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  standardTypeText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  standardRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  standardRatingText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
  },

  // Compact variant styles
  compactContainer: {
    marginRight: 12,
    width: 160,
  },
  compactCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  compactContent: {
    padding: 12,
    height: 120,
  },
  compactImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.2,
  },
  compactInfo: {
    flex: 1,
  },
  compactTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  compactMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactType: {
    marginLeft: 4,
    fontSize: 12,
    textTransform: 'capitalize',
  },
  compactRating: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  compactRatingText: {
    marginLeft: 2,
    fontSize: 10,
    fontWeight: '600',
  },

  // Detailed variant styles
  detailedContainer: {
    marginBottom: 20,
  },
  detailedCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  detailedImage: {
    height: 120,
    width: '100%',
  },
  detailedContent: {
    padding: 20,
  },
  detailedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  detailedInfo: {
    flex: 1,
  },
  detailedTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  detailedLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailedLocationText: {
    marginLeft: 4,
    fontSize: 14,
  },
  detailedSeparator: {
    marginHorizontal: 6,
    fontSize: 12,
  },
  detailedDistance: {
    fontSize: 14,
    fontWeight: '500',
  },
  detailedMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailedTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  detailedTypeText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  detailedRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  detailedRatingText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
  },
});
