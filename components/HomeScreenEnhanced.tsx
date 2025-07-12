import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import * as Location from 'expo-location';

import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useResponsive } from '@/hooks/useResponsive';
import LanguageSelector from '@/components/LanguageSelector';
import WeatherWidget from '@/components/WeatherWidget';
import EmergencyButton from '@/components/EmergencyButton';
import { AIRecommendations } from '@/components/AIRecommendations';
import { BannerCarousel } from '@/components/BannerCarousel';
import { SmartTile } from '@/components/SmartTile';
import VenueCardEnhanced from '@/components/VenueCardEnhanced';
import OnboardingScreenEnhanced from '@/components/OnboardingScreenEnhanced';
import GlassCard from '@/components/GlassCard';
import SmartShoppingAssistant from '@/components/SmartShoppingAssistant';
import CrowdDensityHeatmap from '@/components/CrowdDensityHeatmap';
import InMallWallet from '@/components/InMallWallet';
import { ARShoppingAssistant } from '@/components/ARShoppingAssistant';
import { AIConcierge } from '@/components/AIConciergeChat';
import { HospitalNavigation } from '@/components/HospitalNavigation';
import { SchoolNavigation } from '@/components/SchoolNavigation';
import { SouthAfricanFeatures } from '@/components/SouthAfricanFeatures';
import AirportFeatures from '@/components/AirportFeatures';
import AdvertisingBanner from '@/components/AdvertisingBanner';
import { Spacing, BorderRadius, Typography, Shadows } from '@/constants/Theme';
import { venueCategories, venues } from '@/services/venueService';
import { getCurrentUser, signUp, getPersonalizedRecommendations } from '@/services/userService';
import { useAuth } from '@/hooks/useAuth';
import { useNavigationState } from '@/hooks/useNavigationState';

export default function HomeScreenEnhanced() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { getResponsiveValue, isLarge } = useResponsive();
  const { user } = useAuth();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [showOnboarding, setShowOnboarding] = useState(!currentUser);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [showSmartShopping, setShowSmartShopping] = useState(false);
  const [showCrowdHeatmap, setShowCrowdHeatmap] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [showARShopping, setShowARShopping] = useState(false);
  const [showAIConcierge, setShowAIConcierge] = useState(false);
  const [showHospitalNav, setShowHospitalNav] = useState(false);
  const [showSchoolNav, setShowSchoolNav] = useState(false);
  const [showSAFeatures, setShowSAFeatures] = useState(false);
  const [showAirportFeatures, setShowAirportFeatures] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [energySaverMode, setEnergySaverMode] = useState(false);
  const trendingVenues = useState(venues.slice(0, 5))[0];

  // Dynamic banners data
  const heroBanners = [
    {
      id: '1',
      title: 'Summer Sale at Sandton City',
      subtitle: 'Up to 70% off on fashion brands',
      image: 'https://picsum.photos/800/400?random=1',
      ctaText: 'Shop Now',
      ctaAction: () => router.push('/venue/1'),
      gradient: [colors.primary + '60', colors.primary + 'CC'],
    },
    {
      id: '2',
      title: 'New Restaurant Opening',
      subtitle: 'Grand opening at Gateway Theatre',
      image: 'https://picsum.photos/800/400?random=2',
      ctaText: 'Explore',
      ctaAction: () => router.push('/venue/4'),
      gradient: [colors.secondary + '60', colors.secondary + 'CC'],
    },
    {
      id: '3',
      title: 'AR Navigation Update',
      subtitle: 'Enhanced indoor mapping available',
      image: 'https://picsum.photos/800/400?random=3',
      ctaText: 'Try Now',
      ctaAction: () => router.push('/ar-navigator'),
      gradient: [colors.accent + '60', colors.accent + 'CC'],
    },
  ];

  const handleOnboardingComplete = async (userData: any) => {
    try {
      const result = await signUp(userData);
      if (result.success && result.user) {
        setCurrentUser(result.user);
        setShowOnboarding(false);
        setRecommendations(getPersonalizedRecommendations());
        Alert.alert('Welcome!', `Hello ${result.user.fullName}, welcome to NaviLynx!`);
      } else {
        Alert.alert('Registration Failed', result.error || 'Please try again.');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Registration failed. Please try again.');
    }
  };

  const requestLocationPermission = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Location permission is needed for better recommendations.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    } catch (error) {
      console.error('Location error:', error);
    }
  }, []);

  useEffect(() => {
    requestLocationPermission();
    if (currentUser) {
      setRecommendations(getPersonalizedRecommendations());
    }
  }, [requestLocationPermission, currentUser]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const navigateToVenueCategory = (categoryKey: string) => {
    router.push({
      pathname: '/explore',
      params: { category: categoryKey }
    });
  };

  const handleChatPress = (venueId: string) => {
    Alert.alert('Chat Room', `Joining chat for venue ${venueId}`, [
      { text: 'Cancel' },
      { text: 'Join', onPress: () => console.log('Join chat for venue:', venueId) }
    ]);
  };

  if (showOnboarding) {
    return <OnboardingScreenEnhanced onComplete={handleOnboardingComplete} />;
  }

  const getDistance = (coords: Location.LocationObjectCoords, coordinates: { lat: number; lng: number; }): number => {
    const R = 6371;
    const dLat = (coordinates.lat - coords.latitude) * Math.PI / 180;
    const dLon = (coordinates.lng - coords.longitude) * Math.PI / 180;
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(coords.latitude * Math.PI / 180) * Math.cos(coordinates.lat * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleLanguageChange = (newLanguage: 'en' | 'zu' | 'af' | 'xh' | 'ts' | 'nso' | 'tn' | 've') => {
    console.log('Language changed to:', newLanguage);
  };

  const cardPadding = getResponsiveValue({ sm: Spacing.md, md: Spacing.lg, lg: Spacing.xl });
  const sectionSpacing = getResponsiveValue({ sm: Spacing.lg, md: Spacing.xl, lg: Spacing.xxl });

  // Dynamic styles
  const dynamicStyles = {
    sectionCard: {
      ...styles.section,
      marginHorizontal: cardPadding,
      marginBottom: sectionSpacing,
    },
    marginContainer: {
      marginHorizontal: cardPadding,
      marginBottom: sectionSpacing,
    },
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Enhanced Header */}
        <View style={[styles.header, { paddingHorizontal: cardPadding }]}>
          <View style={styles.welcomeSection}>
            <Text style={[styles.welcomeText, { color: colors.text }]}>
              {user ? `Welcome back, ${user.fullName.split(' ')[0]}!` : 'Welcome to NaviLynx'}
            </Text>
            <Text style={[styles.subtitleText, { color: colors.mutedForeground }]}>
              {user ? 'Ready to explore your favorite venues?' : t('findYourWay')}
            </Text>
          </View>
          <LanguageSelector onLanguageChange={handleLanguageChange} />
        </View>

        {/* Dynamic Hero Banners */}
        <View style={{ marginBottom: sectionSpacing }}>
          <BannerCarousel banners={heroBanners} />
        </View>

        {/* Advertising Banner */}
        <View style={dynamicStyles.marginContainer}>
          <AdvertisingBanner />
        </View>

        {/* Quick Access Smart Tiles */}
        <GlassCard 
          variant="elevated" 
          style={dynamicStyles.sectionCard}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Quick Access
          </Text>
          <View style={styles.smartTilesGrid}>
            <SmartTile
              title="Nearby"
              icon="location.fill"
              onPress={() => router.push('/explore')}
              badgeCount={5}
              variant="featured"
              size={isLarge ? "large" : "medium"}
            />
            <SmartTile
              title="Favorites"
              icon="heart.fill"
              onPress={() => router.push('/profile')}
              badgeCount={3}
              variant="featured"
              size={isLarge ? "large" : "medium"}
            />
            <SmartTile
              title="New Stores"
              icon="sparkles"
              onPress={() => navigateToVenueCategory('shopping')}
              badgeCount={2}
              variant="featured"
              size={isLarge ? "large" : "medium"}
            />
            <SmartTile
              title="Events"
              icon="calendar"
              onPress={() => navigateToVenueCategory('convention')}
              badgeCount={1}
              variant="featured"
              size={isLarge ? "large" : "medium"}
            />
          </View>
        </GlassCard>

        {/* Trending Venues */}
        <GlassCard 
          variant="elevated" 
          style={dynamicStyles.sectionCard}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Trending Venues
            </Text>
            <TouchableOpacity onPress={() => router.push('/explore')}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {trendingVenues.map((venue, index) => (
              <VenueCardEnhanced
                key={venue.id}
                id={venue.id}
                name={venue.name}
                category={venue.category.charAt(0).toUpperCase() + venue.category.slice(1)}
                distance={location ? `${(getDistance(location.coords, venue.coordinates) / 1000).toFixed(1)} km` : "-- km"}
                badge="Hot"
                rating={4.2 + (index * 0.1)}
                variant="default"
                onPress={() => router.push(`/venue/${venue.id}`)}
                onChatPress={() => handleChatPress(venue.id)}
              />
            ))}
          </ScrollView>
        </GlassCard>

        {/* Weather Widget */}
        <View style={dynamicStyles.marginContainer}>
          <WeatherWidget />
        </View>

        {/* Personalized Recommendations */}
        {user && recommendations.length > 0 && (
          <GlassCard 
            variant="elevated" 
            style={dynamicStyles.sectionCard}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Just for You
            </Text>
            <View style={styles.recommendationsContainer}>
              {recommendations.map((recommendation, index) => (
                <View key={index} style={[styles.recommendationItem, { borderLeftColor: colors.primary }]}>
                  <IconSymbol name="star.fill" size={14} color={colors.primary} />
                  <Text style={[styles.recommendationText, { color: colors.text }]}>
                    {recommendation}
                  </Text>
                </View>
              ))}
            </View>
          </GlassCard>
        )}

        {/* Quick Actions */}
        <GlassCard 
          variant="elevated" 
          style={dynamicStyles.sectionCard}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Quick Actions
          </Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/ar-navigator')}
            >
              <IconSymbol name="camera.viewfinder" size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>AR Navigate</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.secondary }]}
              onPress={() => setShowSmartShopping(true)}
            >
              <IconSymbol name="cart" size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Smart Shopping</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.accent }]}
              onPress={() => setShowWallet(true)}
            >
              <IconSymbol name="creditcard" size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Wallet</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.warning }]}
              onPress={() => setShowCrowdHeatmap(true)}
            >
              <IconSymbol name="chart.bar.fill" size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Crowd Map</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.success }]}
              onPress={() => setShowARShopping(true)}
            >
              <IconSymbol name="cube.box.fill" size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>AR Shopping</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#FF6B35' }]}
              onPress={() => setShowAIConcierge(true)}
            >
              <IconSymbol name="person.2.fill" size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>AI Concierge</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#5AC8FA' }]}
              onPress={() => setShowHospitalNav(true)}
            >
              <IconSymbol name="cross.fill" size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Hospital Nav</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#34C759' }]}
              onPress={() => setShowSchoolNav(true)}
            >
              <IconSymbol name="graduationcap.fill" size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>School Nav</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#FF9500' }]}
              onPress={() => setShowSAFeatures(true)}
            >
              <IconSymbol name="flag.fill" size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>🇿🇦 Mzansi</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#007AFF' }]}
              onPress={() => setShowAirportFeatures(true)}
            >
              <IconSymbol name="airplane" size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Airport Nav</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.notification }]}
              onPress={() => {
                setOfflineMode(!offlineMode);
                Alert.alert(
                  offlineMode ? 'Online Mode' : 'Offline Mode',
                  offlineMode ? 'Switched to online mode' : 'Downloading offline data...'
                );
              }}
            >
              <IconSymbol name={offlineMode ? "wifi" : "wifi.slash"} size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>{offlineMode ? 'Online' : 'Offline'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: energySaverMode ? '#34C759' : '#8E8E93' }]}
              onPress={() => {
                setEnergySaverMode(!energySaverMode);
                Alert.alert(
                  energySaverMode ? 'Standard Mode' : 'Energy Saver',
                  energySaverMode ? 'Battery optimization disabled' : 'Battery optimization enabled'
                );
              }}
            >
              <IconSymbol name="battery.100" size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Energy Saver</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/parking')}
            >
              <IconSymbol name="car.fill" size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Find Parking</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>

        {/* Compact Advertising Banner */}
        <View style={dynamicStyles.marginContainer}>
          <AdvertisingBanner />
        </View>

        {/* Venue Categories */}
        <GlassCard 
          variant="elevated" 
          style={dynamicStyles.sectionCard}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Explore Venues
          </Text>
          <View style={styles.categoriesGrid}>
            {Object.entries(venueCategories).map(([key, category]) => (
              <TouchableOpacity
                key={key}
                style={[styles.categoryCard, { backgroundColor: colors.surface }]}
                onPress={() => navigateToVenueCategory(key)}
              >
                <IconSymbol
                  name={category.icon as any}
                  size={getResponsiveValue({ sm: 24, md: 28, lg: 32 })}
                  color={colors.primary}
                />
                <Text style={[styles.categoryText, { color: colors.text }]}>
                  {category.title}
                </Text>
                <Text style={[styles.categoryDescription, { color: colors.mutedForeground }]}>
                  {category.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </GlassCard>

        {/* Emergency Button */}
        <View style={dynamicStyles.marginContainer}>
          <EmergencyButton />
        </View>

        {/* AI Recommendations */}
        <View style={dynamicStyles.marginContainer}>
          <AIRecommendations />
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Advanced Feature Modals */}
      <SmartShoppingAssistant
        visible={showSmartShopping}
        onClose={() => setShowSmartShopping(false)}
        venueId="1" // Default venue or current venue
      />

      <CrowdDensityHeatmap
        visible={showCrowdHeatmap}
        onClose={() => setShowCrowdHeatmap(false)}
        venueId="1"
        floor="Ground Floor"
      />

      <InMallWallet
        visible={showWallet}
        onClose={() => setShowWallet(false)}
        venueId="1"
      />

      <ARShoppingAssistant
        visible={showARShopping}
        onClose={() => setShowARShopping(false)}
        venueId="1"
      />

      <AIConcierge
        visible={showAIConcierge}
        onClose={() => setShowAIConcierge(false)}
        venueId="1"
        venueName="Sandton City"
      />

      <HospitalNavigation
        visible={showHospitalNav}
        onClose={() => setShowHospitalNav(false)}
        hospitalId="1"
        hospitalName="Netcare Sandton Hospital"
      />

      <SchoolNavigation
        visible={showSchoolNav}
        onClose={() => setShowSchoolNav(false)}
        schoolId="1"
        schoolName="University of the Witwatersrand"
      />

      <SouthAfricanFeatures
        visible={showSAFeatures}
        onClose={() => setShowSAFeatures(false)}
      />

      <AirportFeatures
        visible={showAirportFeatures}
        onClose={() => setShowAirportFeatures(false)}
        airportCode="JNB"
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingVertical: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  welcomeSection: {
    flex: 1,
    marginRight: Spacing.md,
  },
  welcomeText: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: "700",
    lineHeight: Typography.lineHeights.tight * Typography.sizes['2xl'],
    marginBottom: Spacing.xs,
  },
  subtitleText: {
    fontSize: 16,
    lineHeight: Typography.lineHeights.relaxed * 16,
  },
  section: {
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  seeAllText: {
    fontSize: 16,
    fontWeight: "600",
  },
  smartTilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'space-between',
  },
  horizontalScroll: {
    paddingRight: Spacing.md,
  },
  recommendationsContainer: {
    gap: Spacing.sm,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderLeftWidth: 3,
    gap: Spacing.sm,
  },
  recommendationText: {
    fontSize: 16,
    flex: 1,
    lineHeight: Typography.lineHeights.relaxed * 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  actionButton: {
    width: '31%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xs,
    borderRadius: 12,
    gap: Spacing.xs,
    ...Shadows.medium,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: "600",
    textAlign: 'center',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    padding: Spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    ...Shadows.small,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  categoryDescription: {
    fontSize: 12,
    marginTop: Spacing.xs,
    textAlign: 'center',
    lineHeight: Typography.lineHeights.normal * 12,
  },
  bottomSpacing: {
    height: 80,
  },
});
