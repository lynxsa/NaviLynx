import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeSafe } from '@/context/ThemeContext';
import { getVenueById, Venue } from '@/services/venueService';
import { incrementUserStat } from '@/services/userService';
import { Spacing } from '@/constants/Theme';

export default function VenueDetailScreen() {
  const { colors } = useThemeSafe();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVenue = async () => {
      try {
        if (id) {
          const venueData = getVenueById(id);
          setVenue(venueData || null);
          if (venueData) {
            incrementUserStat('visitedVenues');
          }
        }
      } catch (error) {
        console.error('Error loading venue:', error);
        Alert.alert('Error', 'Failed to load venue details');
      } finally {
        setLoading(false);
      }
    };

    loadVenue();
  }, [id]);

  const startNavigation = () => {
    if (venue) {
      incrementUserStat('navigationSessions');
      router.push('/ar-navigator' as any);
    }
  };

  const findParking = () => {
    if (venue?.parking.available) {
      router.push('/parking' as any);
    } else {
      Alert.alert('Parking Not Available', 'This venue does not offer parking facilities.');
    }
  };

  if (loading) {
    return (
      <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={{ color: colors.text }}>Loading venue details...</Text>
        </View>
      </ThemedView>
    );
  }

  if (!venue) {
    return (
      <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <IconSymbol name="exclamationmark.triangle" size={48} color={colors.text ?? '#000000'} />
          <Text style={[styles.errorText, { color: colors.text }]}>
            Venue not found
          </Text>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: colors.cardBackground }]}
            onPress={() => router.back()}
          >
            <IconSymbol name="chevron.left" size={24} color={colors.text ?? '#000000'} />
          </TouchableOpacity>
          <ThemedText style={[styles.headerTitle, { color: colors.text }]}>
            {venue.name}
          </ThemedText>
          <View style={styles.headerSpacer} />
        </View>

        {/* Venue Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: venue.image || 'https://picsum.photos/400/300?random=1' }} 
            style={styles.venueImage}
            resizeMode="cover"
          />
          <View style={[styles.categoryBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.categoryBadgeText}>
              {venue.category.charAt(0).toUpperCase() + venue.category.slice(1)}
            </Text>
          </View>
        </View>

        {/* Venue Info */}
        <View style={[styles.infoCard, { backgroundColor: colors.cardBackground }]}>
          <ThemedText style={[styles.venueName, { color: colors.text }]}>
            {venue.name}
          </ThemedText>
          <View style={styles.locationRow}>
            <IconSymbol name="location.fill" size={16} color={colors.primary ?? '#000000'} />
            <ThemedText style={[styles.locationText, { color: colors.text }]}>
              {venue.location}
            </ThemedText>
          </View>
          <ThemedText style={[styles.description, { color: `${String(colors.text)}80` }]}>
            {venue.description}
          </ThemedText>
        </View>

        {/* Quick Actions */}
        <View style={[styles.actionsCard, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Quick Actions
          </Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              onPress={startNavigation}
            >
              <IconSymbol name="location.fill" size={24} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Start Navigation</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.actionButton, 
                { 
                  backgroundColor: venue.parking.available ? colors.primary : colors.border,
                  opacity: venue.parking.available ? 1 : 0.5 
                }
              ]}
              onPress={findParking}
              disabled={!venue.parking.available}
            >
              <IconSymbol name="car.fill" size={24} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Find Parking</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Features */}
        <View style={[styles.featuresCard, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Features & Amenities
          </Text>
          <View style={styles.featuresGrid}>
            {venue.features.map((feature, index) => (
              <View key={index} style={[styles.featureItem, { borderColor: colors.border }]}>
                <IconSymbol name="checkmark.circle.fill" size={16} color={colors.primary ?? '#000000'} />
                <Text style={[styles.featureText, { color: colors.text }]}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Operating Hours */}
        <View style={[styles.hoursCard, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Operating Hours
          </Text>
          {Object.entries(venue.operatingHours).map(([day, hours]) => (
            <View key={day} style={styles.hoursRow}>
              <Text style={[styles.dayText, { color: colors.text }]}>{day}</Text>
              <Text style={[styles.hoursText, { color: `${String(colors.text)}80` }]}>{hours}</Text>
            </View>
          ))}
        </View>

        {/* Contact Info */}
        {(venue.contactInfo.phone || venue.contactInfo.website) && (
          <View style={[styles.contactCard, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Contact Information
            </Text>
            {venue.contactInfo.phone && (
              <View style={styles.contactRow}>
                <IconSymbol name="phone.fill" size={16} color={colors.primary ?? '#000000'} />
                <Text style={[styles.contactText, { color: colors.text }]}>
                  {venue.contactInfo.phone}
                </Text>
              </View>
            )}
            {venue.contactInfo.website && (
              <View style={styles.contactRow}>
                <IconSymbol name="globe" size={16} color={colors.primary ?? '#000000'} />
                <Text style={[styles.contactText, { color: colors.text }]}>
                  {venue.contactInfo.website}
                </Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: Spacing.md,
    textAlign: 'center',
  },
  backButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  imageContainer: {
    position: 'relative',
    height: 250,
    marginHorizontal: Spacing.md,
    borderRadius: 12,
    overflow: 'hidden',
  },
  venueImage: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 16,
  },
  categoryBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  infoCard: {
    margin: Spacing.md,
    padding: Spacing.md,
    borderRadius: 12,
  },
  venueName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  locationText: {
    fontSize: 16,
    marginLeft: Spacing.xs,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionsCard: {
    margin: Spacing.md,
    padding: Spacing.md,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: 8,
    gap: Spacing.xs,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  featuresCard: {
    margin: Spacing.md,
    padding: Spacing.md,
    borderRadius: 12,
  },
  featuresGrid: {
    gap: Spacing.xs,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    gap: Spacing.xs,
  },
  featureText: {
    fontSize: 14,
  },
  hoursCard: {
    margin: Spacing.md,
    padding: Spacing.md,
    borderRadius: 12,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
  },
  hoursText: {
    fontSize: 14,
  },
  contactCard: {
    margin: Spacing.md,
    padding: Spacing.md,
    borderRadius: 12,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    gap: Spacing.xs,
  },
  contactText: {
    fontSize: 14,
  },
  bottomSpacing: {
    height: 100,
  },
});