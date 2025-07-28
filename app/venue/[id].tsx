/**
 * SCREEN 1: Venue Page - Operation Navigate
 * Modern card-based design consistent with homepage
 * Prioritizes AR Indoor Navigation with reusable components
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
  Linking,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  FadeIn,
  SlideInUp,
} from 'react-native-reanimated';

// Components & Theme
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '@/context/ThemeContext';
import { colors, spacing, borderRadius, shadows } from '@/styles/modernTheme';
import { StoreCardWalletSection } from '@/components/venue/StoreCardWalletSection';

// Data & Services
import { southAfricanVenues, type Venue } from '@/data/southAfricanVenues';
import { getVenueInternalAreas, type InternalArea } from '@/data/venueInternalAreas';
import { getArticlesByVenue, getDealsByVenue, getEventsByVenue } from '@/data/articlesData';

const { width: screenWidth } = Dimensions.get('window');

// Enhanced interfaces
interface VenueDeal {
  id: string;
  title: string;
  description: string;
  discount: string;
  store: string;
  category: string;
  validUntil: string;
  image: string;
  isExclusive?: boolean;
}

interface FeaturedLocation extends Omit<InternalArea, 'estimatedWalkTime'> {
  isPopular?: boolean;
  estimatedWalkTime?: string;
  currentlyOpen?: boolean;
  hasOffers?: boolean;
}

export default function VenuePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isDark } = useTheme();
  
  const [refreshing, setRefreshing] = useState(false);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [internalAreas, setInternalAreas] = useState<FeaturedLocation[]>([]);
  const [venueDeals, setVenueDeals] = useState<VenueDeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Animations
  const headerOpacity = useSharedValue(0);
  const contentOffset = useSharedValue(50);
  const buttonScale = useSharedValue(0.9);

  // Find venue helper
  const findVenue = useCallback((venueId: string): Venue | null => {
    return southAfricanVenues.find((v: Venue) => 
      v.id === venueId || 
      v.name.toLowerCase().replace(/\s+/g, '-') === venueId.toLowerCase()
    ) || null;
  }, []);

  // Generate venue-specific deals (matching existing patterns)
  const generateVenueDeals = useCallback((venueData: Venue): VenueDeal[] => {
    const dealTemplates = [
      {
        title: "Weekend Shopping Spree",
        description: "Exclusive weekend discounts across multiple stores",
        discount: "30%",
        category: "retail",
        store: "Multiple Stores",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
      },
      {
        title: "Food Court Festival",
        description: "Special pricing on all food court vendors",
        discount: "25%",
        category: "dining",
        store: "Food Court",
        image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
      },
      {
        title: "Tech Tuesday Deals",
        description: "Latest gadgets and electronics at unbeatable prices",
        discount: "40%",
        category: "electronics",
        store: "Tech Stores",
        image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
      }
    ];

    return dealTemplates.map((deal, index) => ({
      id: `${venueData.id}-deal-${index}`,
      ...deal,
      validUntil: "2025-08-31",
      isExclusive: index === 0
    }));
  }, []);

  // Generate featured locations
  const generateFeaturedLocations = useCallback((areas: InternalArea[]): FeaturedLocation[] => {
    return areas.map((area, index) => ({
      ...area,
      isPopular: index < 2,
      estimatedWalkTime: `${Math.floor(Math.random() * 5) + 2} min`,
      currentlyOpen: Math.random() > 0.3,
      hasOffers: Math.random() > 0.5
    }));
  }, []);

  // Load venue data
  useEffect(() => {
    const loadVenueData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const venueData = findVenue(id);
        if (!venueData) {
          Alert.alert('Error', 'Venue not found');
          router.back();
          return;
        }

        setVenue(venueData);
        
        // Load internal areas
        const areas = await getVenueInternalAreas(venueData.id);
        const featuredLocations = generateFeaturedLocations(areas);
        setInternalAreas(featuredLocations);
        
        // Generate deals
        const deals = generateVenueDeals(venueData);
        setVenueDeals(deals);

        // Animate content
        headerOpacity.value = withTiming(1, { duration: 800 });
        contentOffset.value = withTiming(0, { duration: 600 });
        buttonScale.value = withSpring(1, { damping: 8 });
        
      } catch (error) {
        console.error('Error loading venue data:', error);
        Alert.alert('Error', 'Failed to load venue information');
      } finally {
        setIsLoading(false);
      }
    };

    loadVenueData();
  }, [id, findVenue, generateVenueDeals, generateFeaturedLocations, router, headerOpacity, contentOffset, buttonScale]);

  // Navigation handlers
  const handleARNavigation = useCallback(() => {
    if (!venue) return;
    
    router.push({
      pathname: '/select-location',
      params: {
        venueId: venue.id,
        venueName: venue.name,
        fromVenue: 'true'
      }
    });
  }, [venue, router]);

  const handleGoogleMapsNavigation = useCallback(() => {
    if (!venue?.location?.coordinates) return;
    
    const { latitude, longitude } = venue.location.coordinates;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    
    Linking.openURL(url).catch(err => {
      console.error('Error opening Google Maps:', err);
      Alert.alert('Error', 'Could not open Google Maps');
    });
  }, [venue]);

  const handleLocationSelect = useCallback((location: FeaturedLocation) => {
    if (!venue) return;
    
    router.push({
      pathname: '/ar-navigation',
      params: {
        venueId: venue.id,
        destinationId: location.id,
        destinationName: location.name,
        fromVenue: 'true'
      }
    });
  }, [venue, router]);

  const handleCall = useCallback(() => {
    Alert.alert('Contact', `Call ${venue?.name}?\n\nPhone: +27 11 123 4567`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Call', onPress: () => Linking.openURL('tel:+27111234567') }
    ]);
  }, [venue]);

  const handleShare = useCallback(() => {
    Alert.alert('Share', `Share ${venue?.name}`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Share', onPress: () => console.log('Share venue') }
    ]);
  }, [venue]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Animated styles
  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  const animatedContentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: contentOffset.value }],
  }));

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  if (isLoading || !venue) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDark ? '#0A0A0A' : '#F8F9FA' }]}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        <Animated.View entering={FadeIn} style={styles.loadingContent}>
          <IconSymbol name="location.fill" size={48} color={colors.primary} />
          <Text style={[styles.loadingText, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
            Loading venue...
          </Text>
        </Animated.View>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0A0A0A' : '#F8F9FA' }]}>
      <StatusBar 
        barStyle={isDark ? "light-content" : "dark-content"} 
        backgroundColor="transparent"
        translucent
      />
      
      <ScrollView
        style={[styles.scrollView, { backgroundColor: isDark ? '#0A0A0A' : '#F8F9FA' }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Header Bar (matching homepage design) */}
        <Animated.View 
          style={[styles.headerBar, { backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' }, animatedHeaderStyle]}
          entering={FadeIn.duration(600)}
        >
          <TouchableOpacity 
            style={[styles.headerButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)' }]}
            onPress={() => router.back()}
          >
            <IconSymbol name="chevron.left" size={24} color={colors.primary} />
          </TouchableOpacity>
          
          <View style={styles.headerTitleContainer}>
            <Image 
              source={isDark ? require('@/assets/images/logo-w.png') : require('@/assets/images/logo-p.png')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
              {venue.name}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.headerButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)' }]}
            onPress={handleShare}
          >
            <IconSymbol name="square.and.arrow.up" size={20} color={colors.primary} />
          </TouchableOpacity>
        </Animated.View>

        {/* Hero Card (matching homepage FeaturedVenues style) */}
        <Animated.View 
          style={[styles.heroCard, { backgroundColor: isDark ? colors.surface : '#FFFFFF' }, animatedContentStyle]}
          entering={FadeIn.delay(200).duration(800)}
        >
          <Image
            source={{ uri: venue.image }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={[
              'transparent',
              'rgba(0,0,0,0.1)',
              'rgba(0,0,0,0.6)',
              'rgba(0,0,0,0.8)'
            ]}
            style={styles.heroGradient}
          />
          
          <View style={styles.heroContent}>
            <Text style={styles.venueName}>{venue.name}</Text>
            <View style={styles.venueStats}>
              <View style={styles.statItem}>
                <IconSymbol name="location" size={16} color="#FFFFFF" />
                <Text style={styles.statText}>{venue.location.city}, {venue.location.province}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <IconSymbol name="clock" size={16} color="#22C55E" />
                <Text style={[styles.statText, { color: '#22C55E' }]}>Open</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <IconSymbol name="star.fill" size={16} color="#FFD700" />
                <Text style={styles.statText}>4.8</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Primary AR Navigation Card */}
        <Animated.View 
          style={[styles.actionCard, { backgroundColor: isDark ? colors.surface : '#FFFFFF' }, animatedButtonStyle]}
          entering={SlideInUp.delay(400).duration(600)}
        >
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleARNavigation}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryButtonGradient}
            >
              <View style={styles.buttonContent}>
                <View style={styles.buttonIcon}>
                  <IconSymbol name="camera.viewfinder" size={28} color="#FFFFFF" />
                </View>
                <View style={styles.buttonTextContainer}>
                  <Text style={styles.primaryButtonText}>Navigate Inside Venue</Text>
                  <Text style={styles.primaryButtonSubtext}>Start AR Indoor Navigation</Text>
                </View>
                <IconSymbol name="chevron.right" size={20} color="#FFFFFF" />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Secondary Actions */}
          <View style={styles.secondaryActionsRow}>
            <TouchableOpacity
              style={[styles.secondaryButton, { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' }]}
              onPress={handleGoogleMapsNavigation}
              activeOpacity={0.7}
            >
              <IconSymbol name="map" size={20} color={colors.primary} />
              <Text style={[styles.secondaryButtonText, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>Maps</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryButton, { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' }]}
              onPress={handleCall}
              activeOpacity={0.7}
            >
              <IconSymbol name="phone.fill" size={20} color={colors.primary} />
              <Text style={[styles.secondaryButtonText, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryButton, { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' }]}
              onPress={handleShare}
              activeOpacity={0.7}
            >
              <IconSymbol name="square.and.arrow.up" size={20} color={colors.primary} />
              <Text style={[styles.secondaryButtonText, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>Share</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Deals Section (matching DealsCarousel design) */}
        <Animated.View 
          style={[styles.sectionCard, { backgroundColor: isDark ? colors.surface : '#FFFFFF' }]}
          entering={SlideInUp.delay(600).duration(600)}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
              Exclusive Deals at {venue.name}
            </Text>
            <TouchableOpacity
              onPress={() => Alert.alert('Deals', 'View all deals and promotions for this venue')}
              style={styles.seeAllButton}
            >
              <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
              <IconSymbol name="chevron.right" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dealsContainer}
          >
            {venueDeals.map((deal, index) => (
              <Animated.View
                key={deal.id}
                style={[styles.dealCard, { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' }]}
                entering={SlideInUp.delay(700 + index * 100).duration(400)}
              >
                <Image
                  source={{ uri: deal.image }}
                  style={styles.dealImage}
                  resizeMode="cover"
                />
                <View style={styles.dealOverlay}>
                  <View style={[styles.discountBadge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.discountText}>{deal.discount} OFF</Text>
                  </View>
                  {deal.isExclusive && (
                    <View style={[styles.exclusiveBadge, { backgroundColor: '#EF4444' }]}>
                      <Text style={styles.exclusiveText}>Exclusive</Text>
                    </View>
                  )}
                </View>
                <View style={styles.dealContent}>
                  <Text style={[styles.dealTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]} numberOfLines={2}>
                    {deal.title}
                  </Text>
                  <Text style={[styles.dealDescription, { color: isDark ? '#9CA3AF' : '#6B7280' }]} numberOfLines={2}>
                    {deal.description}
                  </Text>
                  <View style={styles.dealFooter}>
                    <Text style={[styles.dealStore, { color: colors.primary }]}>
                      {deal.store}
                    </Text>
                    <Text style={[styles.dealExpiry, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                      Until {deal.validUntil}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Venue Information Section */}
        <Animated.View 
          style={[styles.sectionCard, { backgroundColor: isDark ? colors.surface : '#FFFFFF' }]}
          entering={SlideInUp.delay(650).duration(600)}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <IconSymbol name="info.circle" size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
                Venue Information
              </Text>
            </View>
          </View>

          <View style={styles.venueInfoGrid}>
            <View style={[styles.infoCard, { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' }]}>
              <IconSymbol name="clock" size={24} color={colors.primary} />
              <Text style={[styles.infoTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>Hours</Text>
              <Text style={[styles.infoText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                {venue.openingHours || 'Mon-Sun: 9AM-9PM'}
              </Text>
            </View>

            <View style={[styles.infoCard, { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' }]}>
              <IconSymbol name="location" size={24} color={colors.primary} />
              <Text style={[styles.infoTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>Location</Text>
              <Text style={[styles.infoText, { color: isDark ? '#9CA3AF' : '#6B7280' }]} numberOfLines={2}>
                {venue.location.city}, {venue.location.province}
              </Text>
            </View>

            <View style={[styles.infoCard, { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' }]}>
              <IconSymbol name="car" size={24} color={colors.primary} />
              <Text style={[styles.infoTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>Parking</Text>
              <Text style={[styles.infoText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                {venue.parkingInfo?.available ? 'Available' : 'Limited'}
              </Text>
            </View>

            <View style={[styles.infoCard, { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' }]}>
              <IconSymbol name="phone" size={24} color={colors.primary} />
              <Text style={[styles.infoTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>Contact</Text>
              <Text style={[styles.infoText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                {venue.contact.phone}
              </Text>
            </View>
          </View>

          {venue.features && venue.features.length > 0 && (
            <>
              <Text style={[styles.amenitiesTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
                Features & Amenities
              </Text>
              <View style={styles.amenitiesGrid}>
                {venue.features.slice(0, 8).map((feature: string, index: number) => (
                  <View key={index} style={[styles.amenityTag, { backgroundColor: colors.primary + '15' }]}>
                    <Text style={[styles.amenityText, { color: colors.primary }]}>
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </Animated.View>

        {/* Store Card Wallet Section - Operation Navigate Enhancement */}
        <StoreCardWalletSection 
          venueId={venue.id}
          venueName={venue.name}
          onCardScan={(card) => {
            console.log('Store card scanned:', card);
            // Handle card scan result
          }}
        />

        {/* Articles & Content Section - Operation Navigate Content System */}
        <Animated.View 
          style={[styles.sectionCard, { backgroundColor: isDark ? colors.surface : '#FFFFFF' }]}
          entering={SlideInUp.delay(700).duration(600)}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <IconSymbol name="newspaper" size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
                Articles & Guides
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/article/' as any)}
              style={styles.seeAllButton}
            >
              <Text style={[styles.seeAllText, { color: colors.primary }]}>View All</Text>
              <IconSymbol name="chevron.right" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {getArticlesByVenue(venue.id).slice(0, 3).map((article: any, index: number) => (
              <TouchableOpacity
                key={article.id}
                style={[styles.contentCard, { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' }]}
                onPress={() => router.push('/article/' as any)}
                activeOpacity={0.8}
              >
                <Image source={{ uri: article.images[0] }} style={styles.contentImage} />
                {article.featured && (
                  <View style={styles.featuredBadge}>
                    <IconSymbol name="star.fill" size={10} color="#FFD700" />
                    <Text style={styles.featuredText}>Featured</Text>
                  </View>
                )}
                <View style={styles.contentInfo}>
                  <View style={styles.contentCategory}>
                    <Text style={styles.contentCategoryText}>{article.category}</Text>
                  </View>
                  <Text style={[styles.contentTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]} numberOfLines={2}>
                    {article.title}
                  </Text>
                  <Text style={[styles.contentSubtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]} numberOfLines={2}>
                    {article.excerpt}
                  </Text>
                  <View style={styles.contentMeta}>
                    <Text style={[styles.contentReadTime, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                      {article.readTime} min read
                    </Text>
                    <View style={styles.contentEngagement}>
                      <IconSymbol name="heart" size={12} color={colors.error} />
                      <Text style={[styles.engagementText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                        {article.likes}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Deals & Offers Section - Operation Navigate Shopping System */}
        <Animated.View 
          style={[styles.sectionCard, { backgroundColor: isDark ? colors.surface : '#FFFFFF' }]}
          entering={SlideInUp.delay(750).duration(600)}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <IconSymbol name="tag" size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
                Exclusive Deals & Offers
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/article/' as any)}
              style={styles.seeAllButton}
            >
              <Text style={[styles.seeAllText, { color: colors.primary }]}>View All</Text>
              <IconSymbol name="chevron.right" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {getDealsByVenue(venue.id).slice(0, 3).map((deal: any, index: number) => (
              <TouchableOpacity
                key={deal.id}
                style={[styles.dealCard, { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' }]}
                onPress={() => router.push('/article/' as any)}
                activeOpacity={0.8}
              >
                <Image source={{ uri: deal.image }} style={styles.dealImage} />
                <View style={styles.dealDiscount}>
                  <Text style={styles.dealDiscountText}>{deal.discountPercentage}% OFF</Text>
                </View>
                {deal.featured && (
                  <View style={[styles.featuredBadge, { top: 35 }]}>
                    <IconSymbol name="star.fill" size={10} color="#FFD700" />
                    <Text style={styles.featuredText}>Featured</Text>
                  </View>
                )}
                <View style={styles.dealContent}>
                  <View style={styles.contentCategory}>
                    <Text style={styles.contentCategoryText}>{deal.category}</Text>
                  </View>
                  <Text style={[styles.dealTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]} numberOfLines={2}>
                    {deal.title}
                  </Text>
                  <Text style={[styles.dealDescription, { color: isDark ? '#9CA3AF' : '#6B7280' }]} numberOfLines={2}>
                    {deal.description}
                  </Text>
                  <View style={styles.dealPricing}>
                    <Text style={[styles.originalPrice, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                      {deal.originalPrice}
                    </Text>
                    <Text style={[styles.discountedPrice, { color: colors.success }]}>
                      {deal.discountedPrice}
                    </Text>
                  </View>
                  <View style={styles.dealFooter}>
                    <Text style={[styles.dealStore, { color: colors.primary }]}>
                      {deal.venueName}
                    </Text>
                    <Text style={[styles.dealExpiry, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                      Save {deal.savings}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Events Section - Operation Navigate Events System */}
        <Animated.View 
          style={[styles.sectionCard, { backgroundColor: isDark ? colors.surface : '#FFFFFF' }]}
          entering={SlideInUp.delay(775).duration(600)}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <IconSymbol name="calendar" size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
                Upcoming Events
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/article/' as any)}
              style={styles.seeAllButton}
            >
              <Text style={[styles.seeAllText, { color: colors.primary }]}>View All</Text>
              <IconSymbol name="chevron.right" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {getEventsByVenue(venue.id).slice(0, 3).map((event: any, index: number) => (
              <TouchableOpacity
                key={event.id}
                style={[styles.eventCard, { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' }]}
                onPress={() => router.push('/article/' as any)}
                activeOpacity={0.8}
              >
                <Image source={{ uri: event.image }} style={styles.contentImage} />
                <View style={styles.eventDate}>
                  <Text style={styles.eventDateText}>
                    {new Date(event.startDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </Text>
                </View>
                {event.featured && (
                  <View style={[styles.featuredBadge, { top: 35 }]}>
                    <IconSymbol name="star.fill" size={10} color="#FFD700" />
                    <Text style={styles.featuredText}>Featured</Text>
                  </View>
                )}
                <View style={styles.contentInfo}>
                  <View style={styles.contentCategory}>
                    <Text style={styles.contentCategoryText}>{event.category}</Text>
                  </View>
                  <Text style={[styles.contentTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]} numberOfLines={2}>
                    {event.title}
                  </Text>
                  <Text style={[styles.contentSubtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]} numberOfLines={2}>
                    {event.description}
                  </Text>
                  <View style={styles.eventDetails}>
                    <View style={styles.eventDetail}>
                      <IconSymbol name="clock" size={12} color={colors.primary} />
                      <Text style={[styles.eventDetailText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                        {event.startTime}
                      </Text>
                    </View>
                    <View style={styles.eventDetail}>
                      <IconSymbol name="location" size={12} color={colors.primary} />
                      <Text style={[styles.eventDetailText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                        {event.location.section}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.eventFooter}>
                    {event.freeEvent ? (
                      <Text style={[styles.freeEventText, { color: colors.success }]}>FREE EVENT</Text>
                    ) : (
                      <Text style={[styles.eventPrice, { color: colors.primary }]}>{event.ticketPrice}</Text>
                    )}
                    <Text style={[styles.eventRegistered, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                      {event.registered} attending
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Featured Locations Section (matching UnifiedCategoryCard design) */}
        <Animated.View 
          style={[styles.sectionCard, { backgroundColor: isDark ? colors.surface : '#FFFFFF' }]}
          entering={SlideInUp.delay(800).duration(600)}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <IconSymbol name="location.fill" size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
                Stores & Points of Interest
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push(`/venue/${venue.id}/locations`)}
              style={styles.seeAllButton}
            >
              <Text style={[styles.seeAllText, { color: colors.primary }]}>View All</Text>
              <IconSymbol name="chevron.right" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.locationsGrid}>
            {internalAreas.slice(0, 6).map((location, index) => (
              <TouchableOpacity
                key={location.id}
                style={[styles.locationCard, { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' }]}
                onPress={() => handleLocationSelect(location)}
                activeOpacity={0.7}
              >
                {location.isPopular && (
                  <View style={[styles.popularBadge, { backgroundColor: colors.primary }]}>
                    <IconSymbol name="star.fill" size={10} color="#FFFFFF" />
                    <Text style={styles.popularText}>Popular</Text>
                  </View>
                )}
                
                <View style={[styles.locationIcon, { backgroundColor: colors.primary + '15' }]}>
                  <IconSymbol 
                    name={location.category === 'dining' ? 'fork.knife' : 
                          location.category === 'shopping' ? 'bag.fill' : 
                          location.category === 'service' ? 'gear' : 
                          location.category === 'entertainment' ? 'gamecontroller.fill' :
                          'location.fill'} 
                    size={24} 
                    color={colors.primary} 
                  />
                </View>
                
                <Text style={[styles.locationName, { color: isDark ? '#FFFFFF' : '#1F2937' }]} numberOfLines={2}>
                  {location.name}
                </Text>
                
                <Text style={[styles.locationCategory, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  {location.type}
                </Text>
                
                <View style={styles.locationMeta}>
                  <View style={styles.metaItem}>
                    <IconSymbol name="figure.walk" size={12} color={isDark ? '#9CA3AF' : '#6B7280'} />
                    <Text style={[styles.metaText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                      {location.estimatedWalkTime}
                    </Text>
                  </View>
                  
                  {location.hasOffers && (
                    <View style={[styles.offerIndicator, { backgroundColor: colors.success }]}>
                      <Text style={styles.offerText}>Deal</Text>
                    </View>
                  )}
                </View>
                
                <View style={[
                  styles.statusIndicator,
                  { backgroundColor: location.currentlyOpen ? colors.success : '#EF4444' }
                ]}>
                  <Text style={styles.statusText}>
                    {location.currentlyOpen ? 'Open' : 'Closed'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Floating AR Button */}
      <Animated.View 
        style={[styles.floatingButton, animatedButtonStyle]}
        entering={SlideInUp.delay(1000).duration(400)}
      >
        <TouchableOpacity
          style={styles.fabButton}
          onPress={handleARNavigation}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            style={styles.fabGradient}
          >
            <IconSymbol name="camera.viewfinder" size={24} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
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
  loadingContent: {
    alignItems: 'center',
    gap: spacing.md,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  
  // Header (matching homepage style)
  headerBar: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl + 8,
    paddingBottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerButton: {
    borderRadius: borderRadius.xl,
    padding: spacing.sm + 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    ...shadows.sm,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: spacing.md,
  },
  headerLogo: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Hero Card (matching FeaturedVenues style)
  heroCard: {
    height: 280,
    margin: spacing.lg,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.lg,
    elevation: 8,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  heroContent: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
  },
  venueName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: spacing.sm,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  venueStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },

  // Action Card
  actionCard: {
    margin: spacing.lg,
    marginTop: 0,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    ...shadows.md,
    elevation: 4,
  },
  primaryButton: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  primaryButtonGradient: {
    padding: spacing.lg,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  buttonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextContainer: {
    flex: 1,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  primaryButtonSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  secondaryActionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  secondaryButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.xs,
    ...shadows.sm,
    elevation: 2,
  },
  secondaryButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Section Cards
  sectionCard: {
    margin: spacing.lg,
    marginTop: 0,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    ...shadows.md,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Deals (matching DealsCarousel style)
  dealsContainer: {
    paddingRight: spacing.lg,
  },
  dealCard: {
    width: 280,
    marginRight: spacing.md,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.sm,
    elevation: 2,
  },
  dealImage: {
    width: '100%',
    height: 160,
  },
  dealOverlay: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  discountBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  discountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  exclusiveBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  exclusiveText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dealContent: {
    padding: spacing.md,
  },
  dealTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  dealDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  dealFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dealStore: {
    fontSize: 14,
    fontWeight: '600',
  },
  dealExpiry: {
    fontSize: 12,
  },

  // Floating Button
  floatingButton: {
    position: 'absolute',
    bottom: spacing.xl + 20,
    right: spacing.lg,
  },
  fabButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    ...shadows.lg,
    elevation: 8,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Locations Grid Styles
  locationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  locationCard: {
    width: (screenWidth - (spacing.lg * 2) - spacing.md) / 2,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    position: 'relative',
    ...shadows.sm,
    elevation: 2,
  },
  popularBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    gap: 2,
    zIndex: 1,
  },
  popularText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  locationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  locationName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: spacing.xs,
    lineHeight: 18,
  },
  locationCategory: {
    fontSize: 12,
    marginBottom: spacing.sm,
    textTransform: 'capitalize',
  },
  locationMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
  },
  offerIndicator: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  offerText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statusIndicator: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Venue Information Styles
  venueInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  infoCard: {
    width: (screenWidth - (spacing.lg * 2) - spacing.sm) / 2,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    gap: spacing.xs,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  infoText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  amenitiesTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  amenityTag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
  },
  amenityText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Spacing
  bottomSpacing: {
    height: 100,
  },

  // Content System Styles
  horizontalScrollContent: {
    paddingHorizontal: spacing.sm,
  },
  contentCard: {
    width: 280,
    marginRight: spacing.md,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.sm,
    elevation: 2,
  },
  eventCard: {
    width: 280,
    marginRight: spacing.md,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.sm,
    elevation: 2,
  },
  contentImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#F3F4F6',
  },
  featuredBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.9)',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    gap: 2,
  },
  featuredText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1F2937',
  },
  dealDiscount: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  dealDiscountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  eventDate: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  eventDateText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  contentInfo: {
    padding: spacing.md,
  },
  contentCategory: {
    marginBottom: spacing.xs,
  },
  contentCategoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.xs,
    lineHeight: 20,
  },
  contentSubtitle: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: spacing.sm,
  },
  contentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  contentReadTime: {
    fontSize: 11,
  },
  contentEngagement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  engagementText: {
    fontSize: 11,
  },
  dealPricing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  discountedPrice: {
    fontSize: 16,
    fontWeight: '700',
  },
  eventDetails: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  eventDetailText: {
    fontSize: 11,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  freeEventText: {
    fontSize: 12,
    fontWeight: '700',
  },
  eventPrice: {
    fontSize: 14,
    fontWeight: '700',
  },
  eventRegistered: {
    fontSize: 10,
  },
});
