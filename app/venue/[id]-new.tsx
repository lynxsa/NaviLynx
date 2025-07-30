/**
 * 🚀 MODERN VENUE PAGE - NaviLynx Enhanced Experience
 * Complete Implementation of User Requirements:
 * ✅ Rosebank Mall comprehensive data integration
 * ✅ Clean 2-column grid layouts with proper spacing
 * ✅ Advanced search and filter functionality
 * ✅ Clear section separation and visual hierarchy
 * ✅ Mobile-responsive design with modern UI patterns
 * ✅ Enhanced navigation and user experience
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  FlatList,
  Image,
  Alert,
  Linking,
  RefreshControl,
  Modal,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
  SlideInUp,
} from 'react-native-reanimated';

// Components & Context
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '@/context/ThemeContext';
import { designSystem } from '@/styles/designSystem';

// Data Sources
import { enhancedVenues, EnhancedVenue, VenueStore, VenuePromotion } from '@/data/enhancedVenues';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Interface Definitions
interface FilterOptions {
  category: string;
  level: string;
  type: string;
  priceRange: string;
}

interface TabOption {
  id: string;
  label: string;
  icon: string;
  count?: number;
}

export default function ModernVenuePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // State Management
  const [venue, setVenue] = useState<EnhancedVenue | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'all',
    level: 'all',
    type: 'all',
    priceRange: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStore, setSelectedStore] = useState<VenueStore | null>(null);
  const [showStoreModal, setShowStoreModal] = useState(false);

  // Animation Values
  const headerOpacity = useSharedValue(1);
  const scrollY = useSharedValue(0);

  // Data Loading
  useEffect(() => {
    loadVenueData();
  }, [id]);

  const loadVenueData = async () => {
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const venueData = enhancedVenues.find(v => v.id === id);
      if (venueData) {
        setVenue(venueData);
      } else {
        Alert.alert('Error', 'Venue not found');
        router.back();
      }
    } catch (error) {
      console.error('Error loading venue:', error);
      Alert.alert('Error', 'Failed to load venue data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadVenueData();
    setRefreshing(false);
  };

  // Tab Configuration
  const tabs: TabOption[] = [
    { id: 'overview', label: 'Overview', icon: 'building.2', count: undefined },
    { id: 'stores', label: 'Stores', icon: 'storefront', count: venue?.stores?.length },
    { id: 'deals', label: 'Deals', icon: 'tag', count: venue?.promotions?.length },
    { id: 'map', label: 'Map', icon: 'map', count: undefined },
    { id: 'events', label: 'Events', icon: 'calendar', count: venue?.events?.length },
  ];

  // Filtered Data Logic
  const filteredStores = useMemo(() => {
    if (!venue?.stores) return [];
    
    let filtered = venue.stores;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(store =>
        store.name.toLowerCase().includes(query) ||
        store.category.toLowerCase().includes(query) ||
        store.description.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(store =>
        store.category.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    // Apply level filter
    if (filters.level !== 'all') {
      filtered = filtered.filter(store => store.level.toString() === filters.level);
    }

    // Apply type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(store => 
        store.tags?.some(tag => tag.toLowerCase().includes(filters.type.toLowerCase()))
      );
    }

    // Apply price range filter
    if (filters.priceRange !== 'all') {
      filtered = filtered.filter(store => store.priceRange === filters.priceRange);
    }

    return filtered;
  }, [venue?.stores, searchQuery, filters]);

  // Color Scheme
  const colors = {
    background: isDark ? '#0A0A0B' : '#FFFFFF',
    surface: isDark ? '#1C1C1E' : '#F8F9FA',
    card: isDark ? '#2C2C2E' : '#FFFFFF',
    border: isDark ? '#38383A' : '#E5E5E7',
    text: isDark ? '#FFFFFF' : '#1D1D1F',
    textSecondary: isDark ? '#98989D' : '#6D6D80',
    primary: '#007AFF',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
  };

  // Animations
  const headerStyle = useAnimatedStyle(() => ({
    opacity: withTiming(headerOpacity.value, { duration: 300 }),
  }));

  // Loading State
  if (loading || !venue) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading venue...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Event Handlers
  const handleStorePress = (store: VenueStore) => {
    setSelectedStore(store);
    setShowStoreModal(true);
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleWebsite = (website: string) => {
    Linking.openURL(website);
  };

  const handleNavigation = () => {
    // Navigate to AR Indoor Navigation
    router.push(`/ar-navigator?venueId=${venue.id}`);
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      level: 'all',
      type: 'all',
      priceRange: 'all'
    });
    setSearchQuery('');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Section */}
      <Animated.View style={[styles.header, headerStyle]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          {venue.name}
        </Text>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => {/* Share functionality */}}
        >
          <IconSymbol name="square.and.arrow.up" size={20} color={colors.text} />
        </TouchableOpacity>
      </Animated.View>

      {/* Hero Image Section */}
      <View style={styles.heroContainer}>
        <Image
          source={{ uri: venue.headerImage }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.heroGradient}
        />
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>{venue.name}</Text>
          <Text style={styles.heroSubtitle}>{venue.location.address}</Text>
          <View style={styles.heroStats}>
            <View style={styles.statItem}>
              <IconSymbol name="star.fill" size={16} color="#FFD700" />
              <Text style={styles.statText}>{venue.rating}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <IconSymbol name="storefront" size={16} color="#FFFFFF" />
              <Text style={styles.statText}>{venue.stores?.length || 0} stores</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <IconSymbol name="clock" size={16} color="#FFFFFF" />
              <Text style={styles.statText}>Open</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={[styles.quickActions, { backgroundColor: colors.surface }]}>
        <TouchableOpacity 
          style={[styles.actionBtn, { backgroundColor: colors.primary }]}
          onPress={handleNavigation}
        >
          <IconSymbol name="location.fill" size={20} color="#FFFFFF" />
          <Text style={styles.actionBtnText}>Navigate</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => handleCall(venue.contact.phone)}
        >
          <IconSymbol name="phone.fill" size={20} color={colors.primary} />
          <Text style={[styles.actionBtnTextSecondary, { color: colors.primary }]}>Call</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => handleWebsite(venue.contact.website)}
        >
          <IconSymbol name="globe" size={20} color={colors.primary} />
          <Text style={[styles.actionBtnTextSecondary, { color: colors.primary }]}>Website</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={[styles.tabContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScrollContent}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && { backgroundColor: colors.primary }
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <IconSymbol 
                name={tab.icon} 
                size={18} 
                color={activeTab === tab.id ? '#FFFFFF' : colors.textSecondary} 
              />
              <Text 
                style={[
                  styles.tabText,
                  { color: activeTab === tab.id ? '#FFFFFF' : colors.textSecondary }
                ]}
              >
                {tab.label}
                {tab.count !== undefined && ` (${tab.count})`}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={(event) => {
          scrollY.value = event.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
      >
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <Animated.View entering={FadeIn.duration(300)}>
            {/* Venue Description */}
            <View style={[styles.section, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
              <Text style={[styles.description, { color: colors.textSecondary }]}>
                {venue.description}
              </Text>
              
              {/* Features Grid */}
              <View style={styles.featuresGrid}>
                {venue.features?.slice(0, 6).map((feature, index) => (
                  <View key={index} style={[styles.featureItem, { backgroundColor: colors.surface }]}>
                    <IconSymbol name="checkmark.circle.fill" size={16} color={colors.success} />
                    <Text style={[styles.featureText, { color: colors.text }]}>{feature}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Quick Stats */}
            <View style={[styles.section, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Info</Text>
              <View style={styles.statsGrid}>
                <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
                  <IconSymbol name="building.2" size={24} color={colors.primary} />
                  <Text style={[styles.statValue, { color: colors.text }]}>{venue.levels}</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Levels</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
                  <IconSymbol name="car" size={24} color={colors.primary} />
                  <Text style={[styles.statValue, { color: colors.text }]}>{venue.parking?.capacity || 0}</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Parking</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
                  <IconSymbol name="tag" size={24} color={colors.primary} />
                  <Text style={[styles.statValue, { color: colors.text }]}>{venue.promotions?.length || 0}</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Deals</Text>
                </View>
              </View>
            </View>

            {/* Operating Hours */}
            <View style={[styles.section, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Opening Hours</Text>
              {Object.entries(venue.openingHours).map(([day, hours]) => (
                <View key={day} style={styles.hoursRow}>
                  <Text style={[styles.dayText, { color: colors.text }]}>
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </Text>
                  <Text style={[styles.hoursText, { color: colors.textSecondary }]}>{hours}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Stores Tab */}
        {activeTab === 'stores' && (
          <Animated.View entering={FadeIn.duration(300)}>
            {/* Search and Filter Bar */}
            <View style={[styles.section, { backgroundColor: colors.card }]}>
              <View style={styles.searchContainer}>
                <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <IconSymbol name="magnifyingglass" size={20} color={colors.textSecondary} />
                  <TextInput
                    style={[styles.searchInput, { color: colors.text }]}
                    placeholder="Search stores, brands, categories..."
                    placeholderTextColor={colors.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                      <IconSymbol name="xmark.circle.fill" size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                  )}
                </View>
                <TouchableOpacity
                  style={[styles.filterButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  onPress={() => setShowFilters(true)}
                >
                  <IconSymbol name="line.3.horizontal.decrease.circle" size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>
              
              {/* Active Filters */}
              {(filters.category !== 'all' || filters.level !== 'all' || filters.type !== 'all' || filters.priceRange !== 'all') && (
                <View style={styles.activeFilters}>
                  {Object.entries(filters).map(([key, value]) => {
                    if (value === 'all') return null;
                    return (
                      <View key={key} style={[styles.filterChip, { backgroundColor: colors.primary }]}>
                        <Text style={styles.filterChipText}>{value}</Text>
                        <TouchableOpacity
                          onPress={() => setFilters(prev => ({ ...prev, [key]: 'all' }))}
                        >
                          <IconSymbol name="xmark" size={12} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                  <TouchableOpacity onPress={clearFilters}>
                    <Text style={[styles.clearFilters, { color: colors.primary }]}>Clear all</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Stores Grid - 2 Column Layout */}
            <View style={[styles.section, { backgroundColor: colors.card }]}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Stores ({filteredStores.length})
                </Text>
              </View>
              
              <View style={styles.storesGrid}>
                {filteredStores.map((store, index) => (
                  <TouchableOpacity
                    key={store.id}
                    style={[
                      styles.storeCard,
                      { 
                        backgroundColor: colors.surface,
                        marginRight: index % 2 === 0 ? designSystem.spacing.sm : 0
                      }
                    ]}
                    onPress={() => handleStorePress(store)}
                  >
                    <View style={styles.storeImageContainer}>
                      <Image
                        source={{ uri: store.image }}
                        style={styles.storeImage}
                        resizeMode="cover"
                      />
                      {store.priceRange && (
                        <View style={[styles.priceRange, { backgroundColor: colors.primary }]}>
                          <Text style={styles.priceRangeText}>
                            {store.priceRange === 'budget' ? '$' : 
                             store.priceRange === 'mid-range' ? '$$' :
                             store.priceRange === 'premium' ? '$$$' : '$$$$'}
                          </Text>
                        </View>
                      )}
                    </View>
                    
                    <View style={styles.storeContent}>
                      <Text style={[styles.storeName, { color: colors.text }]} numberOfLines={1}>
                        {store.name}
                      </Text>
                      <Text style={[styles.storeCategory, { color: colors.textSecondary }]} numberOfLines={1}>
                        {store.category}
                      </Text>
                      <Text style={[styles.storeLocation, { color: colors.textSecondary }]} numberOfLines={1}>
                        Level {store.level} • {store.zone}
                      </Text>
                      
                      {store.rating && (
                        <View style={styles.storeRating}>
                          <IconSymbol name="star.fill" size={12} color="#FFD700" />
                          <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
                            {store.rating}
                          </Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
              
              {filteredStores.length === 0 && (
                <View style={styles.emptyState}>
                  <IconSymbol name="storefront" size={48} color={colors.textSecondary} />
                  <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                    No stores found
                  </Text>
                  <Text style={[styles.emptyStateSubtext, { color: colors.textSecondary }]}>
                    Try adjusting your search or filters
                  </Text>
                </View>
              )}
            </View>
          </Animated.View>
        )}

        {/* Deals Tab */}
        {activeTab === 'deals' && (
          <Animated.View entering={FadeIn.duration(300)}>
            <View style={[styles.section, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Current Deals ({venue.promotions?.length || 0})
              </Text>
              
              {venue.promotions?.map((deal) => (
                <View key={deal.id} style={[styles.dealCard, { backgroundColor: colors.surface }]}>
                  <Image
                    source={{ uri: deal.image }}
                    style={styles.dealImage}
                    resizeMode="cover"
                  />
                  <View style={styles.dealContent}>
                    <View style={styles.dealHeader}>
                      <Text style={[styles.dealTitle, { color: colors.text }]}>{deal.title}</Text>
                      {deal.discountPercentage && (
                        <View style={[styles.discountBadge, { backgroundColor: colors.error }]}>
                          <Text style={styles.discountText}>-{deal.discountPercentage}%</Text>
                        </View>
                      )}
                    </View>
                    <Text style={[styles.dealDescription, { color: colors.textSecondary }]}>
                      {deal.description}
                    </Text>
                    <View style={styles.dealFooter}>
                      <Text style={[styles.dealValid, { color: colors.textSecondary }]}>
                        Valid until {new Date(deal.validUntil).toLocaleDateString()}
                      </Text>
                      <TouchableOpacity style={[styles.claimButton, { backgroundColor: colors.primary }]}>
                        <Text style={styles.claimButtonText}>Claim Deal</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
              
              {(!venue.promotions || venue.promotions.length === 0) && (
                <View style={styles.emptyState}>
                  <IconSymbol name="tag" size={48} color={colors.textSecondary} />
                  <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                    No deals available
                  </Text>
                  <Text style={[styles.emptyStateSubtext, { color: colors.textSecondary }]}>
                    Check back later for new offers
                  </Text>
                </View>
              )}
            </View>
          </Animated.View>
        )}

        {/* Map Tab */}
        {activeTab === 'map' && (
          <Animated.View entering={FadeIn.duration(300)}>
            <View style={[styles.section, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Interactive Map</Text>
              <View style={[styles.mapPlaceholder, { backgroundColor: colors.surface }]}>
                <IconSymbol name="map" size={64} color={colors.textSecondary} />
                <Text style={[styles.mapText, { color: colors.textSecondary }]}>
                  AR Indoor Navigation coming soon
                </Text>
                <TouchableOpacity 
                  style={[styles.mapButton, { backgroundColor: colors.primary }]}
                  onPress={handleNavigation}
                >
                  <Text style={styles.mapButtonText}>Launch AR Navigator</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <Animated.View entering={FadeIn.duration(300)}>
            <View style={[styles.section, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Upcoming Events ({venue.events?.length || 0})
              </Text>
              
              {venue.events?.map((event) => (
                <View key={event.id} style={[styles.eventCard, { backgroundColor: colors.surface }]}>
                  <Image
                    source={{ uri: event.image }}
                    style={styles.eventImage}
                    resizeMode="cover"
                  />
                  <View style={styles.eventContent}>
                    <Text style={[styles.eventTitle, { color: colors.text }]}>{event.title}</Text>
                    <Text style={[styles.eventDescription, { color: colors.textSecondary }]}>
                      {event.description}
                    </Text>
                    <View style={styles.eventDetails}>
                      <View style={styles.eventDetail}>
                        <IconSymbol name="calendar" size={16} color={colors.primary} />
                        <Text style={[styles.eventDetailText, { color: colors.textSecondary }]}>
                          {new Date(event.date).toLocaleDateString()}
                        </Text>
                      </View>
                      <View style={styles.eventDetail}>
                        <IconSymbol name="clock" size={16} color={colors.primary} />
                        <Text style={[styles.eventDetailText, { color: colors.textSecondary }]}>
                          {event.time}
                        </Text>
                      </View>
                      <View style={styles.eventDetail}>
                        <IconSymbol name="location" size={16} color={colors.primary} />
                        <Text style={[styles.eventDetailText, { color: colors.textSecondary }]}>
                          {event.location}
                        </Text>
                      </View>
                    </View>
                    {event.ticketPrice && (
                      <Text style={[styles.eventPrice, { color: colors.primary }]}>
                        From R{event.ticketPrice}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
              
              {(!venue.events || venue.events.length === 0) && (
                <View style={styles.emptyState}>
                  <IconSymbol name="calendar" size={48} color={colors.textSecondary} />
                  <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                    No upcoming events
                  </Text>
                  <Text style={[styles.emptyStateSubtext, { color: colors.textSecondary }]}>
                    Stay tuned for exciting events
                  </Text>
                </View>
              )}
            </View>
          </Animated.View>
        )}

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFilters(false)}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Text style={[styles.modalCancel, { color: colors.primary }]}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Filters</Text>
            <TouchableOpacity onPress={clearFilters}>
              <Text style={[styles.modalClear, { color: colors.primary }]}>Clear</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {/* Category Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterTitle, { color: colors.text }]}>Category</Text>
              <View style={styles.filterOptions}>
                {['all', 'fashion', 'food', 'electronics', 'health', 'entertainment'].map(option => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.filterOption,
                      { 
                        backgroundColor: filters.category === option ? colors.primary : colors.surface,
                        borderColor: colors.border
                      }
                    ]}
                    onPress={() => setFilters(prev => ({ ...prev, category: option }))}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      { color: filters.category === option ? '#FFFFFF' : colors.text }
                    ]}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Level Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterTitle, { color: colors.text }]}>Level</Text>
              <View style={styles.filterOptions}>
                {['all', '0', '1', '2', '3'].map(option => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.filterOption,
                      { 
                        backgroundColor: filters.level === option ? colors.primary : colors.surface,
                        borderColor: colors.border
                      }
                    ]}
                    onPress={() => setFilters(prev => ({ ...prev, level: option }))}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      { color: filters.level === option ? '#FFFFFF' : colors.text }
                    ]}>
                      {option === 'all' ? 'All Levels' : `Level ${option}`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Price Range Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterTitle, { color: colors.text }]}>Price Range</Text>
              <View style={styles.filterOptions}>
                {['all', 'budget', 'mid-range', 'premium', 'luxury'].map(option => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.filterOption,
                      { 
                        backgroundColor: filters.priceRange === option ? colors.primary : colors.surface,
                        borderColor: colors.border
                      }
                    ]}
                    onPress={() => setFilters(prev => ({ ...prev, priceRange: option }))}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      { color: filters.priceRange === option ? '#FFFFFF' : colors.text }
                    ]}>
                      {option === 'all' ? 'All Prices' : 
                       option.charAt(0).toUpperCase() + option.slice(1).replace('-', ' ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
          
          <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
            <TouchableOpacity
              style={[styles.applyButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowFilters(false)}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Store Detail Modal */}
      <Modal
        visible={showStoreModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowStoreModal(false)}
      >
        {selectedStore && (
          <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <TouchableOpacity onPress={() => setShowStoreModal(false)}>
                <Text style={[styles.modalCancel, { color: colors.primary }]}>Close</Text>
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: colors.text }]}>{selectedStore.name}</Text>
              <TouchableOpacity>
                <IconSymbol name="square.and.arrow.up" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <Image
                source={{ uri: selectedStore.image }}
                style={styles.storeDetailImage}
                resizeMode="cover"
              />
              
              <View style={styles.storeDetailContent}>
                <Text style={[styles.storeDetailName, { color: colors.text }]}>
                  {selectedStore.name}
                </Text>
                <Text style={[styles.storeDetailCategory, { color: colors.textSecondary }]}>
                  {selectedStore.category}
                </Text>
                <Text style={[styles.storeDetailDescription, { color: colors.textSecondary }]}>
                  {selectedStore.description}
                </Text>
                
                {/* Store Info */}
                <View style={styles.storeInfo}>
                  <View style={styles.storeInfoItem}>
                    <IconSymbol name="location" size={20} color={colors.primary} />
                    <Text style={[styles.storeInfoText, { color: colors.text }]}>
                      Level {selectedStore.level}, {selectedStore.zone}
                    </Text>
                  </View>
                  <View style={styles.storeInfoItem}>
                    <IconSymbol name="clock" size={20} color={colors.primary} />
                    <Text style={[styles.storeInfoText, { color: colors.text }]}>
                      {selectedStore.openingHours}
                    </Text>
                  </View>
                  {selectedStore.contact.phone && (
                    <View style={styles.storeInfoItem}>
                      <IconSymbol name="phone" size={20} color={colors.primary} />
                      <Text style={[styles.storeInfoText, { color: colors.text }]}>
                        {selectedStore.contact.phone}
                      </Text>
                    </View>
                  )}
                </View>
                
                {/* Store Actions */}
                <View style={styles.storeActions}>
                  <TouchableOpacity
                    style={[styles.storeAction, { backgroundColor: colors.primary }]}
                    onPress={() => {
                      setShowStoreModal(false);
                      handleNavigation();
                    }}
                  >
                    <IconSymbol name="location.fill" size={20} color="#FFFFFF" />
                    <Text style={styles.storeActionText}>Get Directions</Text>
                  </TouchableOpacity>
                  
                  {selectedStore.contact.phone && (
                    <TouchableOpacity
                      style={[styles.storeAction, { backgroundColor: colors.surface, borderColor: colors.border }]}
                      onPress={() => handleCall(selectedStore.contact.phone!)}
                    >
                      <IconSymbol name="phone.fill" size={20} color={colors.primary} />
                      <Text style={[styles.storeActionTextSecondary, { color: colors.primary }]}>Call</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        )}
      </Modal>
    </SafeAreaView>
  );
}

// Comprehensive Styling System
const styles = {
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
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: designSystem.spacing.lg,
    paddingVertical: designSystem.spacing.md,
    zIndex: 10,
  },
  backButton: {
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
    marginHorizontal: designSystem.spacing.md,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Hero Section
  heroContainer: {
    height: 300,
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
    height: 150,
  },
  heroContent: {
    position: 'absolute',
    bottom: designSystem.spacing.lg,
    left: designSystem.spacing.lg,
    right: designSystem.spacing.lg,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: designSystem.spacing.xs,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: designSystem.spacing.md,
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: designSystem.spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: designSystem.spacing.md,
  },

  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: designSystem.spacing.lg,
    paddingVertical: designSystem.spacing.md,
    gap: designSystem.spacing.sm,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: designSystem.spacing.md,
    borderRadius: designSystem.borderRadius.lg,
    borderWidth: 1,
    gap: designSystem.spacing.xs,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  actionBtnTextSecondary: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Tab Navigation
  tabContainer: {
    borderBottomWidth: 1,
  },
  tabScrollContent: {
    paddingHorizontal: designSystem.spacing.lg,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: designSystem.spacing.md,
    paddingVertical: designSystem.spacing.sm,
    marginRight: designSystem.spacing.sm,
    borderRadius: designSystem.borderRadius.lg,
    gap: designSystem.spacing.xs,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },

  // Content
  scrollView: {
    flex: 1,
  },
  section: {
    margin: designSystem.spacing.lg,
    borderRadius: designSystem.borderRadius.xl,
    padding: designSystem.spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: designSystem.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: designSystem.spacing.md,
  },

  // Overview
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: designSystem.spacing.lg,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: designSystem.spacing.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: designSystem.spacing.md,
    paddingVertical: designSystem.spacing.sm,
    borderRadius: designSystem.borderRadius.lg,
    marginBottom: designSystem.spacing.sm,
    gap: designSystem.spacing.xs,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: designSystem.spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: designSystem.spacing.lg,
    borderRadius: designSystem.borderRadius.lg,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: designSystem.spacing.sm,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: designSystem.spacing.xs,
  },

  // Hours
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: designSystem.spacing.sm,
  },
  dayText: {
    fontSize: 16,
    fontWeight: '500',
  },
  hoursText: {
    fontSize: 16,
  },

  // Search and Filters
  searchContainer: {
    flexDirection: 'row',
    gap: designSystem.spacing.sm,
    marginBottom: designSystem.spacing.md,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: designSystem.spacing.md,
    paddingVertical: designSystem.spacing.sm,
    borderRadius: designSystem.borderRadius.lg,
    borderWidth: 1,
    gap: designSystem.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filterButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: designSystem.borderRadius.lg,
    borderWidth: 1,
  },
  activeFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: designSystem.spacing.sm,
    alignItems: 'center',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: designSystem.spacing.md,
    paddingVertical: designSystem.spacing.xs,
    borderRadius: designSystem.borderRadius.lg,
    gap: designSystem.spacing.xs,
  },
  filterChipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  clearFilters: {
    fontSize: 14,
    fontWeight: '500',
  },

  // Stores Grid
  storesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -designSystem.spacing.xs,
  },
  storeCard: {
    width: (screenWidth - designSystem.spacing.lg * 2 - designSystem.spacing.lg - designSystem.spacing.sm) / 2,
    borderRadius: designSystem.borderRadius.lg,
    marginBottom: designSystem.spacing.md,
    overflow: 'hidden',
  },
  storeImageContainer: {
    position: 'relative',
    height: 120,
  },
  storeImage: {
    width: '100%',
    height: '100%',
  },
  priceRange: {
    position: 'absolute',
    top: designSystem.spacing.sm,
    right: designSystem.spacing.sm,
    paddingHorizontal: designSystem.spacing.sm,
    paddingVertical: designSystem.spacing.xs,
    borderRadius: designSystem.borderRadius.sm,
  },
  priceRangeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  storeContent: {
    padding: designSystem.spacing.md,
  },
  storeName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: designSystem.spacing.xs,
  },
  storeCategory: {
    fontSize: 12,
    marginBottom: designSystem.spacing.xs,
  },
  storeLocation: {
    fontSize: 12,
    marginBottom: designSystem.spacing.sm,
  },
  storeRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designSystem.spacing.xs,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '500',
  },

  // Deals
  dealCard: {
    borderRadius: designSystem.borderRadius.lg,
    marginBottom: designSystem.spacing.md,
    overflow: 'hidden',
  },
  dealImage: {
    width: '100%',
    height: 150,
  },
  dealContent: {
    padding: designSystem.spacing.md,
  },
  dealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: designSystem.spacing.sm,
  },
  dealTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: designSystem.spacing.sm,
  },
  discountBadge: {
    paddingHorizontal: designSystem.spacing.sm,
    paddingVertical: designSystem.spacing.xs,
    borderRadius: designSystem.borderRadius.sm,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  dealDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: designSystem.spacing.md,
  },
  dealFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dealValid: {
    fontSize: 12,
  },
  claimButton: {
    paddingHorizontal: designSystem.spacing.md,
    paddingVertical: designSystem.spacing.sm,
    borderRadius: designSystem.borderRadius.lg,
  },
  claimButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // Map
  mapPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: designSystem.borderRadius.lg,
    gap: designSystem.spacing.md,
  },
  mapText: {
    fontSize: 16,
    fontWeight: '500',
  },
  mapButton: {
    paddingHorizontal: designSystem.spacing.lg,
    paddingVertical: designSystem.spacing.md,
    borderRadius: designSystem.borderRadius.lg,
  },
  mapButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Events
  eventCard: {
    borderRadius: designSystem.borderRadius.lg,
    marginBottom: designSystem.spacing.md,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: 120,
  },
  eventContent: {
    padding: designSystem.spacing.md,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: designSystem.spacing.sm,
  },
  eventDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: designSystem.spacing.md,
  },
  eventDetails: {
    gap: designSystem.spacing.sm,
    marginBottom: designSystem.spacing.md,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designSystem.spacing.sm,
  },
  eventDetailText: {
    fontSize: 14,
  },
  eventPrice: {
    fontSize: 16,
    fontWeight: '700',
  },

  // Empty States
  emptyState: {
    alignItems: 'center',
    paddingVertical: designSystem.spacing.xl,
    gap: designSystem.spacing.md,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },

  // Modals
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: designSystem.spacing.lg,
    paddingVertical: designSystem.spacing.md,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalCancel: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalClear: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: designSystem.spacing.lg,
  },
  modalFooter: {
    paddingHorizontal: designSystem.spacing.lg,
    paddingVertical: designSystem.spacing.md,
    borderTopWidth: 1,
  },

  // Filter Modal
  filterSection: {
    marginBottom: designSystem.spacing.xl,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: designSystem.spacing.md,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: designSystem.spacing.sm,
  },
  filterOption: {
    paddingHorizontal: designSystem.spacing.md,
    paddingVertical: designSystem.spacing.sm,
    borderRadius: designSystem.borderRadius.lg,
    borderWidth: 1,
  },
  filterOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  applyButton: {
    paddingVertical: designSystem.spacing.md,
    borderRadius: designSystem.borderRadius.lg,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Store Detail Modal
  storeDetailImage: {
    width: '100%',
    height: 250,
  },
  storeDetailContent: {
    padding: designSystem.spacing.lg,
  },
  storeDetailName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: designSystem.spacing.xs,
  },
  storeDetailCategory: {
    fontSize: 16,
    marginBottom: designSystem.spacing.md,
  },
  storeDetailDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: designSystem.spacing.lg,
  },
  storeInfo: {
    gap: designSystem.spacing.md,
    marginBottom: designSystem.spacing.xl,
  },
  storeInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designSystem.spacing.md,
  },
  storeInfoText: {
    fontSize: 16,
  },
  storeActions: {
    flexDirection: 'row',
    gap: designSystem.spacing.md,
  },
  storeAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: designSystem.spacing.md,
    borderRadius: designSystem.borderRadius.lg,
    borderWidth: 1,
    gap: designSystem.spacing.sm,
  },
  storeActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  storeActionTextSecondary: {
    fontSize: 16,
    fontWeight: '600',
  },

  // Bottom Spacing
  bottomSpacing: {
    height: designSystem.spacing.xl,
  },
};
