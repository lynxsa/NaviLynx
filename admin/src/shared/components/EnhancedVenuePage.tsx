/**
 * 🏢 OPERATION LIONMOUNTAIN - Enhanced Venue Page
 * 
 * Complete venue page rebuild with AR Navigation hub
 * Perfect purple theme, modern card layouts, and seamless UX
 * 
 * @version 1.0.0 - LIONMOUNTAIN Edition
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Alert,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
  SlideInUp,
} from 'react-native-reanimated';

import { purpleTheme, spacing, borderRadius, shadows, typography } from '../theme/globalTheme';
import { UniversalCard } from './UniversalCard';
import { AppHeader } from './AppHeader';

const { width } = Dimensions.get('window');

// Interfaces
interface Venue {
  id: string;
  name: string;
  location: string;
  image: string;
  description: string;
  rating: number;
  category: string;
  amenities: string[];
  deals: Deal[];
  stores: Store[];
}

interface Deal {
  id: string;
  title: string;
  description: string;
  discount: string;
  store: string;
  image?: string;
  expiresAt: Date;
  category: string;
}

interface Store {
  id: string;
  name: string;
  category: string;
  floor: string;
  unit: string;
  logo?: string;
  rating: number;
}

// Mock Data
const mockVenue: Venue = {
  id: '1',
  name: 'Sandton City Mall',
  location: 'Sandton, Gauteng',
  image: 'https://example.com/sandton-city.jpg',
  description: 'Premier shopping destination in the heart of Sandton',
  rating: 4.5,
  category: 'Shopping Mall',
  amenities: ['Parking', 'WiFi', 'Food Court', 'ATM', 'Restrooms'],
  deals: [
    {
      id: '1',
      title: '50% Off Summer Collection',
      description: 'Latest fashion trends at unbeatable prices',
      discount: '50%',
      store: 'Zara',
      category: 'Fashion',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: '2',
      title: 'Buy 2 Get 1 Free',
      description: 'Premium electronics and gadgets',
      discount: 'BOGO',
      store: 'iStore',
      category: 'Electronics',
      expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },
  ],
  stores: [
    {
      id: '1',
      name: 'Checkers',
      category: 'Groceries',
      floor: 'Ground Floor',
      unit: 'G24',
      rating: 4.2,
    },
    {
      id: '2',
      name: 'Food Court',
      category: 'Food & Drink',
      floor: 'First Floor',
      unit: 'F12-F20',
      rating: 4.0,
    },
    {
      id: '3',
      name: 'Pick n Pay',
      category: 'Groceries',
      floor: 'Ground Floor',
      unit: 'G45',
      rating: 4.3,
    },
  ],
};

interface EnhancedVenuePageProps {
  venueId?: string;
  venue?: Venue;
  onNavigateToLocation?: () => void;
  onNavigateToGoogleMaps?: () => void;
}

export const EnhancedVenuePage: React.FC<EnhancedVenuePageProps> = ({
  venueId,
  venue = mockVenue,
  onNavigateToLocation,
  onNavigateToGoogleMaps,
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [showAllDeals, setShowAllDeals] = useState(false);
  const [showAllStores, setShowAllStores] = useState(false);

  const heroScale = useSharedValue(1);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1000);
  }, []);

  const handleNavigateInside = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (onNavigateToLocation) {
      onNavigateToLocation();
    } else {
      Alert.alert('AR Navigation', 'Starting indoor navigation...');
    }
  };

  const handleGoogleMaps = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onNavigateToGoogleMaps) {
      onNavigateToGoogleMaps();
    } else {
      const url = `https://maps.google.com/?q=${encodeURIComponent(venue.name + ' ' + venue.location)}`;
      Linking.openURL(url);
    }
  };

  const animatedHeroStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heroScale.value }],
  }));

  const renderDealCard = (deal: Deal) => (
    <UniversalCard
      key={deal.id}
      variant="elevated"
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Alert.alert('Deal Details', deal.description);
      }}
      style={styles.dealCard}
    >
      <View style={styles.dealHeader}>
        <View style={styles.dealBadge}>
          <Text style={styles.dealDiscount}>{deal.discount}</Text>
        </View>
        <Text style={styles.dealStore}>{deal.store}</Text>
      </View>
      
      <Text style={styles.dealTitle}>{deal.title}</Text>
      <Text style={styles.dealDescription} numberOfLines={2}>
        {deal.description}
      </Text>
      
      <View style={styles.dealFooter}>
        <Text style={styles.dealCategory}>{deal.category}</Text>
        <Text style={styles.dealExpiry}>
          Expires {deal.expiresAt.toLocaleDateString()}
        </Text>
      </View>
    </UniversalCard>
  );

  const renderStoreCard = (store: Store) => (
    <UniversalCard
      key={store.id}
      variant="default"
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Alert.alert('Navigate to Store', `Navigate to ${store.name}?`);
      }}
      style={styles.storeCard}
    >
      <View style={styles.storeHeader}>
        <View style={styles.storeIcon}>
          <Ionicons 
            name={store.category === 'Food & Drink' ? 'restaurant' : 'storefront'} 
            size={24} 
            color={purpleTheme.primary} 
          />
        </View>
        <View style={styles.storeInfo}>
          <Text style={styles.storeName}>{store.name}</Text>
          <Text style={styles.storeLocation}>{store.floor} • {store.unit}</Text>
        </View>
        <View style={styles.storeRating}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>{store.rating}</Text>
        </View>
      </View>
      
      <Text style={styles.storeCategory}>{store.category}</Text>
    </UniversalCard>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <Animated.View style={[styles.heroSection, animatedHeroStyle]} entering={FadeIn.duration(600)}>
          <Image
            source={{ uri: venue.image }}
            style={styles.heroImage}
            defaultSource={require('../../../assets/images/default-venue.jpg')}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.heroOverlay}
          >
            <AppHeader
              title=""
              variant="transparent"
              showBackButton
              isDark
              onBackPress={() => {/* Handle back navigation */}}
              style={styles.transparentHeader}
            />
            
            <View style={styles.heroContent}>
              <Text style={styles.venueName}>{venue.name}</Text>
              <Text style={styles.venueLocation}>{venue.location}</Text>
              
              <View style={styles.venueStats}>
                <View style={styles.statItem}>
                  <Ionicons name="star" size={20} color="#FFD700" />
                  <Text style={styles.statText}>{venue.rating}</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="location" size={20} color="white" />
                  <Text style={styles.statText}>{venue.category}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View style={styles.actionSection} entering={SlideInUp.duration(400).delay(200)}>
          <TouchableOpacity onPress={handleNavigateInside} style={styles.primaryButton}>
            <LinearGradient
              colors={purpleTheme.gradients.primary}
              style={styles.primaryGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="navigate" size={24} color="white" />
              <Text style={styles.primaryButtonText}>Navigate Inside Venue</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleGoogleMaps} style={styles.secondaryButton}>
            <View style={styles.secondaryButtonContent}>
              <Ionicons name="map" size={20} color={purpleTheme.primary} />
              <Text style={styles.secondaryButtonText}>Navigate via Google Maps</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Description */}
        <View style={styles.section}>
          <UniversalCard variant="default" style={styles.descriptionCard}>
            <Text style={styles.descriptionText}>{venue.description}</Text>
            
            <View style={styles.amenitiesContainer}>
              <Text style={styles.amenitiesTitle}>Amenities</Text>
              <View style={styles.amenitiesList}>
                {venue.amenities.map((amenity, index) => (
                  <View key={index} style={styles.amenityTag}>
                    <Text style={styles.amenityText}>{amenity}</Text>
                  </View>
                ))}
              </View>
            </View>
          </UniversalCard>
        </View>

        {/* Deals Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Exclusive Deals at {venue.name}</Text>
            <TouchableOpacity onPress={() => setShowAllDeals(!showAllDeals)}>
              <Text style={styles.viewAllText}>
                {showAllDeals ? 'Show Less' : 'View All'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dealsContainer}
          >
            {(showAllDeals ? venue.deals : venue.deals.slice(0, 2)).map(renderDealCard)}
          </ScrollView>
        </View>

        {/* Featured Stores Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Stores & Points of Interest</Text>
            <TouchableOpacity onPress={() => setShowAllStores(!showAllStores)}>
              <Text style={styles.viewAllText}>
                {showAllStores ? 'Show Less' : 'View All'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.storesGrid}>
            {(showAllStores ? venue.stores : venue.stores.slice(0, 4)).map(renderStoreCard)}
          </View>
        </View>

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: purpleTheme.background,
  },
  scrollView: {
    flex: 1,
  },
  
  // Hero Section
  heroSection: {
    height: 400,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  transparentHeader: {
    backgroundColor: 'transparent',
  },
  heroContent: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  venueName: {
    fontSize: typography.fontSizes.hero,
    fontWeight: typography.fontWeights.bold,
    color: 'white',
    marginBottom: spacing.xs,
  },
  venueLocation: {
    fontSize: typography.fontSizes.lg,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: spacing.md,
  },
  venueStats: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statText: {
    fontSize: typography.fontSizes.md,
    color: 'white',
    fontWeight: typography.fontWeights.medium,
  },
  
  // Action Buttons
  actionSection: {
    padding: spacing.lg,
    gap: spacing.md,
    marginTop: -spacing.xl,
    zIndex: 1,
  },
  primaryButton: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.lg,
  },
  primaryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  primaryButtonText: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: 'white',
  },
  secondaryButton: {
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: purpleTheme.primary,
    backgroundColor: purpleTheme.surface,
    ...shadows.md,
  },
  secondaryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  secondaryButtonText: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: purpleTheme.primary,
  },
  
  // Sections
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: purpleTheme.text,
    flex: 1,
  },
  viewAllText: {
    fontSize: typography.fontSizes.sm,
    color: purpleTheme.primary,
    fontWeight: typography.fontWeights.medium,
  },
  
  // Description
  descriptionCard: {
    marginHorizontal: spacing.lg,
  },
  descriptionText: {
    fontSize: typography.fontSizes.md,
    color: purpleTheme.text,
    lineHeight: typography.lineHeights.normal * typography.fontSizes.md,
    marginBottom: spacing.lg,
  },
  amenitiesContainer: {
    marginTop: spacing.md,
  },
  amenitiesTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.bold,
    color: purpleTheme.text,
    marginBottom: spacing.sm,
  },
  amenitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  amenityTag: {
    backgroundColor: `${purpleTheme.primary}15`,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  amenityText: {
    fontSize: typography.fontSizes.sm,
    color: purpleTheme.primary,
    fontWeight: typography.fontWeights.medium,
  },
  
  // Deals
  dealsContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  dealCard: {
    width: width * 0.8,
  },
  dealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  dealBadge: {
    backgroundColor: purpleTheme.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  dealDiscount: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
    color: 'white',
  },
  dealStore: {
    fontSize: typography.fontSizes.sm,
    color: purpleTheme.textSecondary,
    fontWeight: typography.fontWeights.medium,
  },
  dealTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: purpleTheme.text,
    marginBottom: spacing.xs,
  },
  dealDescription: {
    fontSize: typography.fontSizes.md,
    color: purpleTheme.textSecondary,
    marginBottom: spacing.md,
  },
  dealFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dealCategory: {
    fontSize: typography.fontSizes.sm,
    color: purpleTheme.primary,
    fontWeight: typography.fontWeights.medium,
  },
  dealExpiry: {
    fontSize: typography.fontSizes.xs,
    color: purpleTheme.textSecondary,
  },
  
  // Stores
  storesGrid: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  storeCard: {
    marginBottom: spacing.sm,
  },
  storeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  storeIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: `${purpleTheme.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.bold,
    color: purpleTheme.text,
  },
  storeLocation: {
    fontSize: typography.fontSizes.sm,
    color: purpleTheme.textSecondary,
    marginTop: 2,
  },
  storeRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs / 2,
  },
  ratingText: {
    fontSize: typography.fontSizes.sm,
    color: purpleTheme.text,
    fontWeight: typography.fontWeights.medium,
  },
  storeCategory: {
    fontSize: typography.fontSizes.sm,
    color: purpleTheme.primary,
    fontWeight: typography.fontWeights.medium,
  },
  
  // Bottom Padding
  bottomPadding: {
    height: spacing.xxl,
  },
});

export default EnhancedVenuePage;
