import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  Alert,
  ImageBackground,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '@/context/ThemeContext';
import { colors, spacing, borderRadius, shadows } from '@/styles/modernTheme';
import { southAfricanVenues } from '@/data/southAfricanVenues';

const { width, height } = Dimensions.get('window');

type Location = {
  id: string;
  name: string;
  category: string;
  floor: number;
  coordinates: { x: number; y: number };
};

type Deal = {
  id: string;
  venueId: string;
  title: string;
  description: string;
  discount: string;
  validUntil: string;
  category: string;
};

export default function VenueNavigateScreen() {
  const { id } = useLocalSearchParams();
  const { colors: themeColors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [venue, setVenue] = useState<any>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Featured locations for quick navigation
  const featuredLocations: Location[] = [
    { id: '1', name: 'Food Court', category: 'Dining', floor: 2, coordinates: { x: 100, y: 150 } },
    { id: '2', name: 'Electronics Store', category: 'Shopping', floor: 1, coordinates: { x: 200, y: 100 } },
    { id: '3', name: 'Parking Garage', category: 'Services', floor: 0, coordinates: { x: 50, y: 200 } },
    { id: '4', name: 'Customer Service', category: 'Services', floor: 1, coordinates: { x: 150, y: 80 } },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Find venue by ID
        const foundVenue = southAfricanVenues.find(v => v.id === id);
        if (foundVenue) {
          setVenue(foundVenue);
        }

        // Mock deals data for now
        const mockDeals = [
          {
            id: '1',
            venueId: id as string,
            title: '20% Off Electronics',
            description: 'Get 20% off all electronics',
            discount: '20%',
            validUntil: '2024-12-31',
            category: 'Electronics'
          },
          {
            id: '2', 
            venueId: id as string,
            title: 'Buy 2 Get 1 Free',
            description: 'Special offer on selected items',
            discount: 'BOGO',
            validUntil: '2024-12-31',
            category: 'Fashion'
          }
        ];
        setDeals(mockDeals);
        
      } catch (error) {
        console.error('Error loading venue data:', error);
        Alert.alert('Error', 'Failed to load venue information');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleARNavigation = (location: Location) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedLocation(location.id);
    
    // Navigate to AR Navigation Flow
    Alert.alert(
      'Start AR Navigation',
      `Navigate to ${location.name} using Indoor AR?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start AR',
          onPress: () => {
            // Navigate to Screen 2: Location Selection
            router.push({
              pathname: '/select-location',
              params: {
                venueId: id,
                locationId: location.id,
                locationName: location.name,
                venueName: venue?.name || 'Venue'
              }
            });
          }
        }
      ]
    );
  };

  const handleViewDeals = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Navigate to deals view or expand inline
    Alert.alert('Deals', `View all ${deals.length} deals for ${venue?.name}`);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
        <Text style={[styles.loadingText, { color: themeColors.text }]}>
          Loading venue information...
        </Text>
      </View>
    );
  }

  if (!venue) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={[styles.errorText, { color: themeColors.text }]}>
          Venue not found
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Hero Section - Featured Venue Card Style */}
        <View style={styles.heroSection}>
          <ImageBackground
            source={{ uri: venue.image || 'https://picsum.photos/400/300' }}
            style={styles.heroImage}
            resizeMode="cover"
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)']}
              style={styles.heroGradient}
            >
              {/* Back Button */}
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
                activeOpacity={0.8}
              >
                <IconSymbol name="chevron.left" size={24} color="#ffffff" />
              </TouchableOpacity>

              {/* Venue Info */}
              <View style={styles.heroContent}>
                <Text style={styles.heroTitle}>{venue.name}</Text>
                <View style={styles.heroLocationRow}>
                  <IconSymbol name="location" size={16} color="#ffffff" />
                  <Text style={styles.heroLocation}>{venue.location || 'Cape Town, South Africa'}</Text>
                </View>
                <View style={styles.heroRatingRow}>
                  <IconSymbol name="star.fill" size={16} color="#FFD700" />
                  <Text style={styles.heroRating}>{venue.rating || '4.5'}</Text>
                  <Text style={styles.heroReviews}>({venue.reviewCount || '1,250'} reviews)</Text>
                </View>
              </View>

              {/* Primary AR Navigation Button */}
              <TouchableOpacity
                style={styles.primaryARButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                  router.push({
                    pathname: '/select-location',
                    params: {
                      venueId: id,
                      venueName: venue.name
                    }
                  });
                }}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={[colors.primary[500], colors.primary[700]]}
                  style={styles.primaryARGradient}
                >
                  <IconSymbol name="camera" size={24} color="#ffffff" />
                  <Text style={styles.primaryARText}>Start AR Navigation</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </ImageBackground>
        </View>

        {/* Deals Section */}
        {deals.length > 0 && (
          <View style={[styles.dealsSection, { backgroundColor: themeColors.surface }]}>
            <View style={styles.dealsSectionHeader}>
              <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
                Today's Deals
              </Text>
              <TouchableOpacity onPress={handleViewDeals} activeOpacity={0.7}>
                <Text style={[styles.viewAllText, { color: colors.primary[600] }]}>
                  View All
                </Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              horizontal 
              style={styles.dealsScroll}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dealsContainer}
            >
              {deals.map((deal) => (
                <TouchableOpacity
                  key={deal.id}
                  style={[styles.dealCard, { backgroundColor: themeColors.background }]}
                  activeOpacity={0.8}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    Alert.alert('Deal Details', `${deal.title}\n\n${deal.description}`);
                  }}
                >
                  <View style={styles.dealBadge}>
                    <Text style={styles.dealBadgeText}>{deal.discount}</Text>
                  </View>
                  <Text style={[styles.dealTitle, { color: themeColors.text }]} numberOfLines={2}>
                    {deal.title}
                  </Text>
                  <Text style={[styles.dealDescription, { color: themeColors.textSecondary }]} numberOfLines={2}>
                    {deal.description}
                  </Text>
                  <Text style={[styles.dealValidity, { color: colors.primary[600] }]}>
                    Valid until {new Date(deal.validUntil).toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Featured Locations Grid */}
        <View style={[styles.locationsSection, { backgroundColor: themeColors.surface }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Popular Destinations
          </Text>
          <View style={styles.locationsGrid}>
            {featuredLocations.map((location) => (
              <TouchableOpacity
                key={location.id}
                style={[
                  styles.locationCard,
                  { backgroundColor: themeColors.background },
                  selectedLocation === location.id && styles.selectedLocationCard
                ]}
                onPress={() => handleARNavigation(location)}
                activeOpacity={0.8}
              >
                <View style={[
                  styles.locationIconContainer,
                  { backgroundColor: colors.primary[100] }
                ]}>
                  <IconSymbol 
                    name={location.category === 'Dining' ? 'storefront' : 
                          location.category === 'Shopping' ? 'house' : 'map'} 
                    size={24} 
                    color={colors.primary[600]} 
                  />
                </View>
                <Text style={[styles.locationName, { color: themeColors.text }]} numberOfLines={2}>
                  {location.name}
                </Text>
                <Text style={[styles.locationCategory, { color: themeColors.textSecondary }]}>
                  {location.category}
                </Text>
                <Text style={[styles.locationFloor, { color: colors.primary[600] }]}>
                  Floor {location.floor}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={[styles.quickActionsSection, { backgroundColor: themeColors.surface }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Quick Actions
          </Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={[styles.quickAction, { backgroundColor: themeColors.background }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push({
                  pathname: '/map-navigation',
                  params: {
                    venueId: id,
                    venueName: venue.name,
                    mode: '2D'
                  }
                });
              }}
              activeOpacity={0.8}
            >
              <IconSymbol name="map" size={28} color={colors.primary[600]} />
              <Text style={[styles.quickActionText, { color: themeColors.text }]}>
                2D Map
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickAction, { backgroundColor: themeColors.background }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Alert.alert('Services', 'View venue services and amenities');
              }}
              activeOpacity={0.8}
            >
              <IconSymbol name="list.bullet" size={28} color={colors.primary[600]} />
              <Text style={[styles.quickActionText, { color: themeColors.text }]}>
                Services
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickAction, { backgroundColor: themeColors.background }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Alert.alert('Accessibility', 'View accessibility options and features');
              }}
              activeOpacity={0.8}
            >
              <IconSymbol name="accessibility" size={28} color={colors.primary[600]} />
              <Text style={[styles.quickActionText, { color: themeColors.text }]}>
                Accessibility
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickAction, { backgroundColor: themeColors.background }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Alert.alert('Help', 'Get help and support for navigation');
              }}
              activeOpacity={0.8}
            >
              <IconSymbol name="message" size={28} color={colors.primary[600]} />
              <Text style={[styles.quickActionText, { color: themeColors.text }]}>
                Help
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 16,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    height: height * 0.6,
    overflow: 'hidden',
  },
  heroImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  heroGradient: {
    flex: 1,
    justifyContent: 'space-between',
    padding: spacing.lg,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + spacing.lg : spacing.xl * 2,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: spacing.xl,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: spacing.sm,
  },
  heroLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  heroLocation: {
    fontSize: 16,
    color: '#ffffff',
    marginLeft: spacing.xs,
  },
  heroRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroRating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: spacing.xs,
  },
  heroReviews: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: spacing.xs,
  },
  primaryARButton: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.lg,
  },
  primaryARGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  primaryARText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: spacing.md,
  },
  dealsSection: {
    padding: spacing.lg,
  },
  dealsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: '600',
  },
  dealsScroll: {
    marginHorizontal: -spacing.sm,
  },
  dealsContainer: {
    paddingHorizontal: spacing.sm,
  },
  dealCard: {
    width: width * 0.7,
    marginHorizontal: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  dealBadge: {
    backgroundColor: colors.secondary[500],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  dealBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  dealTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  dealDescription: {
    fontSize: 14,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  dealValidity: {
    fontSize: 12,
    fontWeight: '500',
  },
  locationsSection: {
    padding: spacing.lg,
  },
  locationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  locationCard: {
    width: (width - spacing.lg * 3) / 2,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  selectedLocationCard: {
    borderWidth: 2,
    borderColor: colors.primary[500],
  },
  locationIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  locationCategory: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  locationFloor: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  quickActionsSection: {
    padding: spacing.lg,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    gap: spacing.md,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    ...shadows.sm,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
  bottomSpacing: {
    height: spacing.xl * 2,
  },
});
