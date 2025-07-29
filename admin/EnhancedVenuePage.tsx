/**
 * Enhanced Venue Page Component - Mobile Layout Fixes
 * Implements 2-column layouts, category filtering, chat integration, and improved spacing
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Modal,
  FlatList,
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
  validUntil: string;
  image: string;
  category: string;
  isExclusive?: boolean;
}

interface FeaturedLocation extends Omit<InternalArea, 'estimatedWalkTime'> {
  icon: string;
  category: string;
  floor: number;
  hasOffers?: boolean;
  currentlyOpen?: boolean;
  estimatedWalkTime?: string;
}

interface VenueConnectButtonProps {
  venueId: string;
  venueName: string;
}

// Chat Button Component
const VenueConnectButton: React.FC<VenueConnectButtonProps> = ({ venueId, venueName }) => {
  const [showChat, setShowChat] = useState(false);
  const router = useRouter();
  
  const openVenueChat = useCallback(() => {
    // Navigate to existing chat functionality
    router.push(`/chat/${venueId}`);
  }, [router, venueId]);

  return (
    <TouchableOpacity
      style={styles.venueConnectButton}
      onPress={openVenueChat}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[colors.primary, colors.secondary || colors.primary]}
        style={styles.chatButtonGradient}
      >
        <IconSymbol name="message.circle.fill" size={20} color="#FFFFFF" />
        <Text style={styles.chatButtonText}>VenueConnect</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

// Category Filter Component
interface CategoryFiltersProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}) => {
  const { colors: themeColors, isDark } = useTheme();

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      style={styles.categoryFilters}
      contentContainerStyle={styles.categoryFiltersContent}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.categoryButton,
            { 
              backgroundColor: selectedCategory === category 
                ? colors.primary 
                : isDark ? '#374151' : '#F3F4F6' 
            }
          ]}
          onPress={() => onSelectCategory(category)}
        >
          <Text style={[
            styles.categoryButtonText,
            { 
              color: selectedCategory === category 
                ? '#FFFFFF' 
                : themeColors.text 
            }
          ]}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

// Venue Info Card Component
interface VenueInfoCardProps {
  title: string;
  value: string;
  icon: string;
  isDark: boolean;
}

const VenueInfoCard: React.FC<VenueInfoCardProps> = ({ title, value, icon, isDark }) => (
  <View style={[styles.venueInfoCard, { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' }]}>
    <IconSymbol name={icon as any} size={18} color={colors.primary} />
    <Text style={[styles.infoCardTitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
      {title}
    </Text>
    <Text style={[styles.infoCardValue, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
      {value}
    </Text>
  </View>
);

// Location Card Component
interface LocationCardProps {
  location: FeaturedLocation;
  onPress: () => void;
  isDark: boolean;
}

const LocationCard: React.FC<LocationCardProps> = ({ location, onPress, isDark }) => (
  <TouchableOpacity
    style={[styles.locationCard, { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' }]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    {location.hasOffers && (
      <View style={[styles.offerIndicator, { backgroundColor: colors.success }]}>
        <Text style={styles.offerText}>Deal</Text>
      </View>
    )}
    
    <View style={styles.locationHeader}>
      <IconSymbol name={location.icon as any} size={16} color={colors.primary} />
      <View style={[
        styles.statusIndicator,
        { backgroundColor: location.currentlyOpen ? colors.success : '#EF4444' }
      ]}>
        <Text style={styles.statusText}>
          {location.currentlyOpen ? 'Open' : 'Closed'}
        </Text>
      </View>
    </View>
    
    <Text style={[styles.locationName, { color: isDark ? '#FFFFFF' : '#1F2937' }]} numberOfLines={2}>
      {location.name}
    </Text>
    
    <View style={styles.locationMeta}>
      <View style={styles.metaItem}>
        <IconSymbol name="building.2" size={10} color={isDark ? '#9CA3AF' : '#6B7280'} />
        <Text style={[styles.metaText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
          Floor {location.floor}
        </Text>
      </View>
      
      {location.estimatedWalkTime && (
        <View style={styles.metaItem}>
          <IconSymbol name="figure.walk" size={10} color={isDark ? '#9CA3AF' : '#6B7280'} />
          <Text style={[styles.metaText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            {location.estimatedWalkTime}
          </Text>
        </View>
      )}
    </View>
  </TouchableOpacity>
);

export default function EnhancedVenuePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors: themeColors, isDark } = useTheme();
  
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [venueDeals, setVenueDeals] = useState<VenueDeal[]>([]);
  const [internalAreas, setInternalAreas] = useState<FeaturedLocation[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Animation values
  const headerOpacity = useSharedValue(0);
  const contentOffset = useSharedValue(50);
  const buttonScale = useSharedValue(0.9);

  // Categories for filtering
  const categories = useMemo(() => ['all', 'restaurants', 'shopping', 'services', 'entertainment'], []);

  // Filtered locations based on selected category
  const filteredLocations = useMemo(() => {
    if (selectedCategory === 'all') return internalAreas;
    return internalAreas.filter(area => 
      area.category.toLowerCase().includes(selectedCategory.toLowerCase())
    );
  }, [internalAreas, selectedCategory]);

  // Venue info cards data
  const venueInfoCards = useMemo(() => {
    if (!venue) return [];
    
    return [
      {
        title: 'Hours',
        value: venue.operatingHours || '09:00 - 21:00',
        icon: 'clock',
      },
      {
        title: 'Phone',
        value: venue.contact?.phone || 'Not available',
        icon: 'phone',
      },
      {
        title: 'Parking',
        value: venue.features?.includes('Parking') ? 'Available' : 'Limited',
        icon: 'car',
      },
      {
        title: 'WiFi',
        value: venue.features?.includes('WiFi') ? 'Free WiFi' : 'Not available',
        icon: 'wifi',
      },
    ];
  }, [venue]);

  // Load venue data
  useEffect(() => {
    const loadVenueData = async () => {
      try {
        if (!id) return;

        // Find venue
        const foundVenue = southAfricanVenues.find(v => v.id === id);
        if (!foundVenue) {
          Alert.alert('Error', 'Venue not found');
          router.back();
          return;
        }

        setVenue(foundVenue);

        // Load internal areas
        const areas = getVenueInternalAreas(id);
        const enhancedAreas: FeaturedLocation[] = areas.map((area, index) => ({
          ...area,
          icon: getIconForCategory(area.category || 'general'),
          category: area.category || 'general',
          floor: Math.floor(Math.random() * 3) + 1,
          hasOffers: Math.random() > 0.7,
          currentlyOpen: Math.random() > 0.3,
          estimatedWalkTime: `${Math.floor(Math.random() * 5) + 1} min`,
        }));
        setInternalAreas(enhancedAreas);

        // Generate deals
        const deals = generateVenueDeals(foundVenue);
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
  }, [id, router, headerOpacity, contentOffset, buttonScale]);

  // Helper functions
  const getIconForCategory = (category: string): string => {
    const iconMap: { [key: string]: string } = {
      restaurants: 'fork.knife',
      shopping: 'bag.fill',
      services: 'wrench.and.screwdriver',
      entertainment: 'tv.and.mediabox',
      general: 'location.fill',
    };
    return iconMap[category.toLowerCase()] || 'location.fill';
  };

  const generateVenueDeals = (venueData: Venue): VenueDeal[] => {
    const dealTemplates = [
      {
        title: "Weekend Shopping Spree",
        description: "Amazing discounts on fashion and lifestyle products",
        discount: "30%",
        category: "fashion",
        store: "Fashion Stores",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8"
      },
      {
        title: "Food Court Special",
        description: "Delicious meals at incredible prices",
        discount: "25%",
        category: "food",
        store: "Food Court",
        image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445"
      },
    ];

    return dealTemplates.map((deal, index) => ({
      id: `${venueData.id}-deal-${index}`,
      ...deal,
      validUntil: "2025-08-31",
      isExclusive: index === 0
    }));
  };

  const handleLocationSelect = (location: FeaturedLocation) => {
    router.push({
      pathname: '/select-location',
      params: {
        venueId: venue?.id,
        locationId: location.id,
        locationName: location.name,
        venueName: venue?.name,
      }
    });
  };

  if (isLoading || !venue) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: themeColors.text }]}>
            Loading venue...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Header */}
        <Animated.View style={[styles.heroSection, { opacity: headerOpacity }]}>
          <Image 
            source={{ uri: venue.image }} 
            style={styles.heroImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>{venue.name}</Text>
              <Text style={styles.heroSubtitle}>{venue.description}</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Venue Information - 2 Column Grid */}
        <Animated.View 
          style={[styles.sectionCard, { backgroundColor: isDark ? themeColors.surface : '#FFFFFF' }]}
          entering={SlideInUp.delay(200).duration(600)}
        >
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
            Venue Information
          </Text>
          
          <View style={styles.venueInfoGrid}>
            {venueInfoCards.map((card, index) => (
              <VenueInfoCard
                key={index}
                title={card.title}
                value={card.value}
                icon={card.icon}
                isDark={isDark}
              />
            ))}
          </View>
        </Animated.View>

        {/* Deals Section */}
        <Animated.View 
          style={[styles.sectionCard, { backgroundColor: isDark ? themeColors.surface : '#FFFFFF' }]}
          entering={SlideInUp.delay(400).duration(600)}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <IconSymbol name="tag" size={18} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
                Exclusive Deals
              </Text>
            </View>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>View All</Text>
              <IconSymbol name="chevron.right" size={14} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {venueDeals.map((deal, index) => (
              <TouchableOpacity
                key={deal.id}
                style={[styles.dealCard, { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' }]}
                activeOpacity={0.8}
              >
                <Image source={{ uri: deal.image }} style={styles.dealImage} />
                <View style={styles.dealDiscount}>
                  <Text style={styles.dealDiscountText}>{deal.discount} OFF</Text>
                </View>
                <View style={styles.dealContent}>
                  <Text style={[styles.dealTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]} numberOfLines={2}>
                    {deal.title}
                  </Text>
                  <Text style={[styles.dealDescription, { color: isDark ? '#9CA3AF' : '#6B7280' }]} numberOfLines={2}>
                    {deal.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Articles Section */}
        <Animated.View 
          style={[styles.sectionCard, { backgroundColor: isDark ? themeColors.surface : '#FFFFFF' }]}
          entering={SlideInUp.delay(600).duration(600)}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <IconSymbol name="newspaper" size={18} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
                Articles & Guides
              </Text>
            </View>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>View All</Text>
              <IconSymbol name="chevron.right" size={14} color={colors.primary} />
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
                style={[styles.articleCard, { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' }]}
                activeOpacity={0.8}
              >
                <Image source={{ uri: article.images[0] }} style={styles.articleImage} />
                <View style={styles.articleContent}>
                  <Text style={[styles.articleTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]} numberOfLines={2}>
                    {article.title}
                  </Text>
                  <Text style={[styles.articleDescription, { color: isDark ? '#9CA3AF' : '#6B7280' }]} numberOfLines={3}>
                    {article.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Stores & POI Section with Category Filtering */}
        <Animated.View 
          style={[styles.sectionCard, { backgroundColor: isDark ? themeColors.surface : '#FFFFFF' }]}
          entering={SlideInUp.delay(800).duration(600)}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <IconSymbol name="location.fill" size={18} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
                Stores & Points of Interest
              </Text>
            </View>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>View All</Text>
              <IconSymbol name="chevron.right" size={14} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Category Filters */}
          <CategoryFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Locations Grid - 2 Columns */}
          <View style={styles.locationsGrid}>
            {filteredLocations.slice(0, 6).map((location, index) => (
              <LocationCard
                key={location.id}
                location={location}
                onPress={() => handleLocationSelect(location)}
                isDark={isDark}
              />
            ))}
          </View>
        </Animated.View>

        {/* Bottom Spacing - Reduced */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Floating VenueConnect Chat Button */}
      <VenueConnectButton venueId={venue.id} venueName={venue.name} />
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
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  
  // Hero Section
  heroSection: {
    height: 200,
    position: 'relative',
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
    height: '60%',
    justifyContent: 'flex-end',
  },
  heroContent: {
    padding: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },

  // Section Cards
  sectionCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    ...shadows.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },

  // Venue Info Grid - 2 Columns
  venueInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  venueInfoCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  infoCardTitle: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  infoCardValue: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Category Filters
  categoryFilters: {
    marginBottom: 16,
  },
  categoryFiltersContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },

  // Horizontal Scroll Content
  horizontalScrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },

  // Deal Cards
  dealCard: {
    width: 240,
    borderRadius: 12,
    overflow: 'hidden',
  },
  dealImage: {
    width: '100%',
    height: 120,
  },
  dealDiscount: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  dealDiscountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  dealContent: {
    padding: 12,
  },
  dealTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  dealDescription: {
    fontSize: 14,
    lineHeight: 20,
  },

  // Article Cards
  articleCard: {
    width: 240,
    borderRadius: 12,
    overflow: 'hidden',
  },
  articleImage: {
    width: '100%',
    height: 120,
  },
  articleContent: {
    padding: 12,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  articleDescription: {
    fontSize: 14,
    lineHeight: 20,
  },

  // Locations Grid - 2 Columns
  locationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  locationCard: {
    width: '48%',
    borderRadius: 12,
    padding: 12,
    position: 'relative',
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  locationMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  offerIndicator: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  offerText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  statusIndicator: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },

  // VenueConnect Chat Button
  venueConnectButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1000,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  chatButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  chatButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // Bottom Spacing - Reduced
  bottomSpacing: {
    height: 20,
  },
});
