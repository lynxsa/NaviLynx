import React from 'react';
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Linking,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { BlurView } from '@/components/ui/BlurView';
import { useTheme } from '@/context/ThemeContext';
import { colors, spacing, borderRadius, shadows } from '@/styles/modernTheme';
import { Venue } from '@/data/southAfricanVenues';

const { width } = Dimensions.get('window');

interface VenueDetailsCardProps {
  venue: Venue;
  onNavigatePress?: () => void;
  onCallPress?: () => void;
  onWebsitePress?: () => void;
}

export const VenueDetailsCard: React.FC<VenueDetailsCardProps> = ({
  venue,
  onNavigatePress,
  onCallPress,
  onWebsitePress,
}) => {
  const { isDark } = useTheme();

  const handleCallPress = () => {
    if (onCallPress) {
      onCallPress();
    } else {
      Linking.openURL(`tel:${venue.contact.phone}`);
    }
  };

  const handleWebsitePress = () => {
    if (onWebsitePress) {
      onWebsitePress();
    } else {
      Linking.openURL(venue.contact.website);
    }
  };

  const getVenueTypeIcon = (type: string) => {
    const iconMap: Record<string, string> = {
      'mall': 'bag.fill',
      'airport': 'airplane',
      'park': 'leaf.fill',
      'hospital': 'cross.fill',
      'stadium': 'sportscourt.fill',
      'university': 'graduationcap.fill',
      'government': 'building.columns.fill'
    };
    return iconMap[type] || 'building.2.fill';
  };

  const formatVenueType = (type: string) => {
    const typeMap: Record<string, string> = {
      'mall': 'Shopping Mall',
      'airport': 'Airport',
      'park': 'Park & Recreation',
      'hospital': 'Hospital',
      'stadium': 'Stadium',
      'university': 'University',
      'government': 'Government Building'
    };
    return typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? colors.gray[900] : '#FFFFFF' }]}>
      {/* Hero Image */}
      <View style={styles.heroContainer}>
        <ImageBackground
          source={{ uri: venue.image }}
          style={styles.heroImage}
          imageStyle={{ borderBottomLeftRadius: borderRadius['2xl'], borderBottomRightRadius: borderRadius['2xl'] }}
        >
          <View style={styles.heroOverlay} />
          
          {/* Venue Type Badge */}
          <View style={styles.typeBadgeContainer}>
            <BlurView style={styles.typeBadge} tint="light" intensity={40}>
              <IconSymbol name={getVenueTypeIcon(venue.type) as any} size={16} color="white" />
              <Text style={styles.typeBadgeText}>{formatVenueType(venue.type)}</Text>
            </BlurView>
          </View>

          {/* Rating Badge */}
          <View style={styles.ratingBadgeContainer}>
            <BlurView style={styles.ratingBadge} tint="light" intensity={40}>
              <IconSymbol name="star.fill" size={12} color="#FFD700" />
              <Text style={styles.ratingText}>{venue.rating}</Text>
            </BlurView>
          </View>

          {/* Bottom Info */}
          <View style={styles.heroBottomInfo}>
            <Text style={styles.venueName}>{venue.name}</Text>
            <View style={styles.locationRow}>
              <IconSymbol name="location.fill" size={16} color="rgba(255,255,255,0.9)" />
              <Text style={styles.locationText}>
                {venue.location.city}, {venue.location.province}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Description */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : colors.gray[900] }]}>
            About
          </Text>
          <Text style={[styles.description, { color: isDark ? colors.gray[300] : colors.gray[700] }]}>
            {venue.description}
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : colors.gray[900] }]}>
            Quick Actions
          </Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryAction]}
              onPress={onNavigatePress}
            >
              <IconSymbol name="location.fill" size={20} color="white" />
              <Text style={styles.primaryActionText}>Navigate</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryAction, { borderColor: isDark ? colors.gray[600] : colors.gray[300] }]}
              onPress={handleCallPress}
            >
              <IconSymbol name="phone.fill" size={18} color={isDark ? '#FFFFFF' : colors.gray[700]} />
              <Text style={[styles.secondaryActionText, { color: isDark ? '#FFFFFF' : colors.gray[700] }]}>Call</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryAction, { borderColor: isDark ? colors.gray[600] : colors.gray[300] }]}
              onPress={handleWebsitePress}
            >
              <IconSymbol name="globe" size={18} color={isDark ? '#FFFFFF' : colors.gray[700]} />
              <Text style={[styles.secondaryActionText, { color: isDark ? '#FFFFFF' : colors.gray[700] }]}>Website</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : colors.gray[900] }]}>
            Features & Services
          </Text>
          <View style={styles.featuresGrid}>
            {venue.features.map((feature, index) => (
              <View key={index} style={[styles.featureItem, { backgroundColor: isDark ? colors.gray[800] : colors.gray[50] }]}>
                <IconSymbol name="checkmark.circle.fill" size={16} color={colors.primary[600]} />
                <Text style={[styles.featureText, { color: isDark ? colors.gray[300] : colors.gray[700] }]}>
                  {feature}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Zones & Areas (if available) */}
        {venue.zones && venue.zones.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : colors.gray[900] }]}>
              Main Areas
            </Text>
            <View style={styles.zonesContainer}>
              {venue.zones.map((zone, index) => (
                <View key={index} style={[styles.zoneItem, { backgroundColor: isDark ? colors.gray[800] : colors.gray[50] }]}>
                  <IconSymbol name="mappin.circle.fill" size={16} color={colors.primary[600]} />
                  <Text style={[styles.zoneText, { color: isDark ? colors.gray[300] : colors.gray[700] }]}>
                    {zone}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Accessibility Features */}
        {venue.accessibility && venue.accessibility.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : colors.gray[900] }]}>
              Accessibility
            </Text>
            <View style={styles.accessibilityContainer}>
              {venue.accessibility.map((feature, index) => (
                <View key={index} style={[styles.accessibilityItem, { backgroundColor: isDark ? colors.gray[800] : colors.gray[50] }]}>
                  <IconSymbol name="accessibility" size={16} color={colors.primary[600]} />
                  <Text style={[styles.accessibilityText, { color: isDark ? colors.gray[300] : colors.gray[700] }]}>
                    {feature}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Information Grid */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : colors.gray[900] }]}>
            Information
          </Text>
          <View style={styles.infoGrid}>
            <View style={[styles.infoItem, { backgroundColor: isDark ? colors.gray[800] : colors.gray[50] }]}>
              <IconSymbol name="clock.fill" size={20} color={colors.primary[600]} />
              <Text style={[styles.infoLabel, { color: isDark ? colors.gray[400] : colors.gray[600] }]}>
                Hours
              </Text>
              <Text style={[styles.infoValue, { color: isDark ? '#FFFFFF' : colors.gray[900] }]}>
                {venue.openingHours}
              </Text>
            </View>

            {venue.levels && (
              <View style={[styles.infoItem, { backgroundColor: isDark ? colors.gray[800] : colors.gray[50] }]}>
                <IconSymbol name="building.2.fill" size={20} color={colors.primary[600]} />
                <Text style={[styles.infoLabel, { color: isDark ? colors.gray[400] : colors.gray[600] }]}>
                  Levels
                </Text>
                <Text style={[styles.infoValue, { color: isDark ? '#FFFFFF' : colors.gray[900] }]}>
                  {venue.levels} Floors
                </Text>
              </View>
            )}

            <View style={[styles.infoItem, { backgroundColor: isDark ? colors.gray[800] : colors.gray[50] }]}>
              <IconSymbol name="phone.fill" size={20} color={colors.primary[600]} />
              <Text style={[styles.infoLabel, { color: isDark ? colors.gray[400] : colors.gray[600] }]}>
                Contact
              </Text>
              <Text style={[styles.infoValue, { color: isDark ? '#FFFFFF' : colors.gray[900] }]}>
                {venue.contact.phone}
              </Text>
            </View>
          </View>
        </View>

        {/* Parking Information */}
        {venue.parkingInfo && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : colors.gray[900] }]}>
              Parking Information
            </Text>
            <View style={[styles.parkingCard, { backgroundColor: isDark ? colors.gray[800] : colors.gray[50] }]}>
              <View style={styles.parkingHeader}>
                <IconSymbol name="car.fill" size={24} color={colors.primary[600]} />
                <View style={styles.parkingInfo}>
                  <Text style={[styles.parkingTitle, { color: isDark ? '#FFFFFF' : colors.gray[900] }]}>
                    {venue.parkingInfo.capacity.toLocaleString()} Spaces Available
                  </Text>
                  <Text style={[styles.parkingSubtitle, { color: isDark ? colors.gray[300] : colors.gray[600] }]}>
                    {venue.parkingInfo.levels} Parking Levels
                  </Text>
                </View>
              </View>
              <Text style={[styles.parkingPrice, { color: isDark ? colors.gray[300] : colors.gray[700] }]}>
                {venue.parkingInfo.pricing}
              </Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroContainer: {
    height: 300,
  },
  heroImage: {
    flex: 1,
    justifyContent: 'space-between',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  typeBadgeContainer: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.md,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  typeBadgeText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: spacing.xs,
  },
  ratingBadgeContainer: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.md,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  ratingText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
    marginLeft: spacing.xs,
  },
  heroBottomInfo: {
    padding: spacing.md,
  },
  venueName: {
    color: 'white',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: spacing.xs,
  },
  content: {
    padding: spacing.md,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.xl,
    ...shadows.sm,
  },
  primaryAction: {
    backgroundColor: colors.primary[600],
    flex: 1,
  },
  secondaryAction: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    flex: 1,
  },
  primaryActionText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: spacing.sm,
  },
  secondaryActionText: {
    fontWeight: '600',
    fontSize: 16,
    marginLeft: spacing.sm,
  },
  featuresGrid: {
    gap: spacing.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  featureText: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: spacing.sm,
  },
  zonesContainer: {
    gap: spacing.sm,
  },
  zoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  zoneText: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: spacing.sm,
  },
  accessibilityContainer: {
    gap: spacing.sm,
  },
  accessibilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  accessibilityText: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: spacing.sm,
  },
  infoGrid: {
    gap: spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: spacing.md,
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  parkingCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
  },
  parkingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  parkingInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  parkingTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  parkingSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: spacing.xs,
  },
  parkingPrice: {
    fontSize: 15,
    fontWeight: '500',
  },
});

export default VenueDetailsCard;
