/**
 * SCREEN 2: Select Location Screen - Operation Navigate
 * Enhanced location selection with modern UI and smooth navigation flow
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  StyleSheet,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

// Components & Services
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '@/context/ThemeContext';
import { colors, spacing, borderRadius, shadows } from '@/styles/modernTheme';
import { getVenueInternalAreas, InternalArea } from '@/data/venueInternalAreas';

// Enhanced Location interface
interface EnhancedLocation extends InternalArea {
  distance?: string;
  walkTime?: string;
  popularity?: number;
  isRecommended?: boolean;
}

type CategoryFilter = 'all' | 'recommended' | 'food' | 'retail' | 'services' | 'entertainment';

const CATEGORY_ICONS: Record<string, any> = {
  'Food': 'fork.knife',
  'Retail': 'bag.fill',
  'Service': 'gear',
  'Entertainment': 'play.circle.fill',
  'Medical': 'cross.fill',
  'Education': 'book.fill',
  'Administration': 'building.fill',
  'Emergency': 'exclamationmark.triangle.fill',
};

const CATEGORY_COLORS: Record<string, string> = {
  'Food': '#FF6B6B',
  'Retail': '#4ECDC4',
  'Service': '#45B7D1',
  'Entertainment': '#96CEB4',
  'Medical': '#FFEAA7',
  'Education': '#DDA0DD',
  'Administration': '#98D8C8',
  'Emergency': '#FF7675',
};

export default function SelectLocationScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const {
    venueId,
    venueName,
  } = params as {
    venueId: string;
    venueName: string;
    venueImage?: string;
    venueType?: string;
    venueLocation?: string;
  };

  // State
  const [locations, setLocations] = useState<EnhancedLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');

  // Animation values
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(50);

  const loadLocations = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get internal areas for the venue
      const areas = await getVenueInternalAreas(venueId);
      
      // Enhance locations with additional data
      const enhancedLocations: EnhancedLocation[] = areas.map((area, index) => ({
        ...area,
        distance: `${Math.floor(Math.random() * 200 + 50)}m`,
        walkTime: `${Math.floor(Math.random() * 5 + 1)} min`,
        popularity: Math.floor(Math.random() * 100),
        isRecommended: index < 3, // First 3 are recommended
      }));

      // Sort by priority and popularity
      enhancedLocations.sort((a, b) => {
        if (a.isHighPriority && !b.isHighPriority) return -1;
        if (!a.isHighPriority && b.isHighPriority) return 1;
        if (a.isRecommended && !b.isRecommended) return -1;
        if (!a.isRecommended && b.isRecommended) return 1;
        return (b.popularity || 0) - (a.popularity || 0);
      });

      setLocations(enhancedLocations);
    } catch (error) {
      console.error('Error loading locations:', error);
      Alert.alert('Error', 'Failed to load venue locations');
    } finally {
      setLoading(false);
    }
  }, [venueId]);

  // Load locations on mount
  useEffect(() => {
    loadLocations();
    
    // Start animations
    fadeAnim.value = withTiming(1, { duration: 800 });
    slideAnim.value = withSpring(0, { damping: 15, stiffness: 200 });
  }, [loadLocations, fadeAnim, slideAnim]);

  // Filter locations based on search and category
  const filteredLocations = useMemo(() => {
    let filtered = locations;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(location =>
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'recommended') {
        filtered = filtered.filter(location => location.isRecommended);
      } else {
        filtered = filtered.filter(location => 
          location.type.toLowerCase() === selectedCategory.toLowerCase()
        );
      }
    }

    return filtered;
  }, [locations, searchQuery, selectedCategory]);

  // Category counts for filter buttons
  const categoryCounts = useMemo(() => {
    return {
      all: locations.length,
      recommended: locations.filter(l => l.isRecommended).length,
      food: locations.filter(l => l.type.toLowerCase() === 'food').length,
      retail: locations.filter(l => l.type.toLowerCase() === 'retail').length,
      services: locations.filter(l => l.type.toLowerCase() === 'service').length,
      entertainment: locations.filter(l => l.type.toLowerCase() === 'entertainment').length,
    };
  }, [locations]);

  // Navigation handlers
  const handleLocationSelect = useCallback((location: EnhancedLocation) => {
    // Navigate to Enhanced AR Navigation with selected location
    router.push({
      pathname: '/ar-navigation',
      params: {
        venueId,
        venueName,
        destinationId: location.id,
        destinationName: location.name,
        navigationType: 'ar'
      }
    });
  }, [router, venueId, venueName]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: interpolate(slideAnim.value, [50, 0], [50, 0]) }],
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }],
  }));

  // Render location item
  const renderLocationItem = useCallback(({ item, index }: { item: EnhancedLocation; index: number }) => (
    <Animated.View
      style={[
        styles.locationCard,
        {
          backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.95)',
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
        }
      ]}
    >
      <TouchableOpacity
        onPress={() => handleLocationSelect(item)}
        activeOpacity={0.8}
        style={styles.locationTouchable}
      >
        {/* Location Image */}
        <View style={styles.locationImageContainer}>
          <Image
            source={{ uri: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=400&h=300&fit=crop` }}
            style={styles.locationImage}
            resizeMode="cover"
          />
          
          {/* Category Badge */}
          <View style={[styles.categoryBadge, { backgroundColor: CATEGORY_COLORS[item.type] || '#6C7CE7' }]}>
            <IconSymbol name={CATEGORY_ICONS[item.type] || 'location.fill'} size={14} color="#FFFFFF" />
          </View>

          {/* Recommended Badge */}
          {item.isRecommended && (
            <View style={styles.recommendedBadge}>
              <BlurView intensity={80} style={styles.recommendedBadgeBlur}>
                <IconSymbol name="star.fill" size={12} color="#FFD700" />
                <Text style={styles.recommendedText}>Recommended</Text>
              </BlurView>
            </View>
          )}
        </View>

        {/* Location Info */}
        <View style={styles.locationInfo}>
          <View style={styles.locationHeader}>
            <Text style={[styles.locationName, { color: isDark ? '#FFFFFF' : colors.text }]} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={styles.locationMeta}>
              <Text style={[styles.walkTime, { color: colors.primary }]}>
                {item.walkTime}
              </Text>
            </View>
          </View>

          {item.description && (
            <Text style={[styles.locationDescription, { color: colors.textSecondary }]} numberOfLines={2}>
              {item.description}
            </Text>
          )}

          <View style={styles.locationFooter}>
            <View style={styles.locationStats}>
              <IconSymbol name="location" size={12} color={colors.textSecondary} />
              <Text style={[styles.distance, { color: colors.textSecondary }]}>
                {item.distance}
              </Text>
              
              {item.location?.floor && (
                <>
                  <Text style={[styles.separator, { color: colors.textSecondary }]}>•</Text>
                  <Text style={[styles.floor, { color: colors.textSecondary }]}>
                    Floor {item.location.floor}
                  </Text>
                </>
              )}
            </View>

            <View style={styles.navigationArrow}>
              <IconSymbol name="arrow.right" size={16} color={colors.primary} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  ), [isDark, handleLocationSelect]);

  // Render category filter
  const renderCategoryFilter = useCallback((category: CategoryFilter, label: string) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.filterButton,
        selectedCategory === category && styles.filterButtonActive,
        {
          backgroundColor: selectedCategory === category 
            ? colors.primary 
            : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
          borderColor: selectedCategory === category 
            ? colors.primary 
            : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        }
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text style={[
        styles.filterButtonText,
        {
          color: selectedCategory === category 
            ? '#FFFFFF' 
            : isDark ? '#FFFFFF' : colors.text
        }
      ]}>
        {label} ({categoryCounts[category] || 0})
      </Text>
    </TouchableOpacity>
  ), [selectedCategory, isDark, categoryCounts]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000000' : '#FFFFFF' }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: isDark ? '#FFFFFF' : colors.text }]}>
            Loading venue locations...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000000' : '#FFFFFF' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Enhanced Header */}
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <BlurView 
          intensity={20} 
          style={StyleSheet.absoluteFillObject}
          tint={isDark ? 'dark' : 'light'}
        />
        
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <IconSymbol name="chevron.left" size={24} color={isDark ? '#FFFFFF' : colors.text} />
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : colors.text }]}>
              Select Location
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              {venueName}
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Search and Filters */}
      <Animated.View style={[styles.searchSection, contentAnimatedStyle]}>
        {/* Search Bar */}
        <View style={[styles.searchContainer, {
          backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        }]}>
          <IconSymbol name="magnifyingglass" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: isDark ? '#FFFFFF' : colors.text }]}
            placeholder="Search locations..."
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

        {/* Category Filters */}
        <View style={styles.filtersContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={[
              { key: 'all', label: 'All' },
              { key: 'recommended', label: 'Recommended' },
              { key: 'food', label: 'Food' },
              { key: 'retail', label: 'Retail' },
              { key: 'services', label: 'Services' },
              { key: 'entertainment', label: 'Entertainment' },
            ]}
            renderItem={({ item }) => renderCategoryFilter(item.key as CategoryFilter, item.label)}
            keyExtractor={(item) => item.key}
            contentContainerStyle={styles.filtersContent}
          />
        </View>
      </Animated.View>

      {/* Locations List */}
      <Animated.View style={[styles.content, contentAnimatedStyle]}>
        {filteredLocations.length > 0 ? (
          <FlatList
            data={filteredLocations}
            renderItem={renderLocationItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <IconSymbol name="location" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: isDark ? '#FFFFFF' : colors.text }]}>
              No locations found
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Try adjusting your search or filters
            </Text>
          </View>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  
  // Header
  header: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  
  // Search and Filters
  searchSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: spacing.sm,
    paddingVertical: spacing.xs,
  },
  filtersContainer: {
    marginBottom: spacing.sm,
  },
  filtersContent: {
    paddingHorizontal: spacing.xs,
    gap: spacing.sm,
  },
  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  filterButtonActive: {
    ...shadows.sm,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Content
  content: {
    flex: 1,
  },
  listContent: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  
  // Location Cards
  locationCard: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    ...shadows.sm,
  },
  locationTouchable: {
    flexDirection: 'row',
  },
  locationImageContainer: {
    width: 100,
    height: 100,
    position: 'relative',
  },
  locationImage: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: spacing.xs,
    left: spacing.xs,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recommendedBadge: {
    position: 'absolute',
    bottom: spacing.xs,
    left: spacing.xs,
    right: spacing.xs,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  recommendedBadgeBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: spacing.xs,
    gap: 4,
  },
  recommendedText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // Location Info
  locationInfo: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: spacing.sm,
  },
  locationMeta: {
    alignItems: 'flex-end',
  },
  walkTime: {
    fontSize: 12,
    fontWeight: '600',
  },
  locationDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  locationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distance: {
    fontSize: 12,
    fontWeight: '500',
  },
  separator: {
    fontSize: 12,
  },
  floor: {
    fontSize: 12,
    fontWeight: '500',
  },
  navigationArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(110, 124, 231, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
