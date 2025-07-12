import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  RefreshControl,
  Animated,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeSafe } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { 
  Venue, 
  VenueCategory, 
  venueCategories,
  getVenuesByCategory,
  searchVenues
} from '@/services/venueService';
import { useLanguage } from '@/context/LanguageContext';
import { ModernCard } from '@/components/ui/ModernComponents';
import VenueCardEnhanced from '@/components/VenueCardEnhanced';

interface CategoryFilterProps {
  label: string;
  icon?: any;
  selected: boolean;
  onPress: () => void;
  count?: number;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  label, 
  icon, 
  selected, 
  onPress, 
  count 
}) => {
  const { colors } = useThemeSafe();
  const { getResponsiveValue } = useResponsive();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity
      style={[
        styles.categoryFilter,
        {
          backgroundColor: selected ? colors.primary : colors.surface,
          borderColor: selected ? colors.primary : colors.border,
        }
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {icon && (
        <IconSymbol 
          name={icon} 
          size={14} 
          color={selected ? '#FFFFFF' : colors.primary} 
        />
      )}
      <ThemedText
        style={[
          styles.categoryFilterText,
          {
            color: selected ? '#FFFFFF' : colors.text,
            fontSize: 12,
            fontWeight: selected ? '600' : '500',
          }
        ]}
      >
        {label}
      </ThemedText>
      {count !== undefined && count > 0 && (
        <View style={[styles.countBadge, { backgroundColor: selected ? '#FFFFFF20' : colors.primary + '20' }]}>
          <ThemedText
            style={[
              styles.countText,
              {
                color: selected ? '#FFFFFF' : colors.primary,
                fontSize: 10,
              }
            ]}
          >
            {count}
          </ThemedText>
        </View>
      )}
    </TouchableOpacity>
  );
}

// Prevent raw string literal warnings for category comparisons
const ALL_CATEGORY = 'all';

export default function ExploreScreenEnhanced() {
  const { colors } = useThemeSafe();
  const { getResponsiveValue, isTablet } = useResponsive();
  const { t } = useLanguage();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<VenueCategory | 'all'>(ALL_CATEGORY);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchAnimation = useState(new Animated.Value(0))[0];

  // Responsive values
  const headerPadding = getResponsiveValue({ sm: 16, md: 24, lg: 32 });
  const cardPadding = getResponsiveValue({ sm: 16, md: 20, lg: 24 });

  const loadVenues = useCallback(() => {
    if (searchQuery.trim()) {
      setVenues(searchVenues(searchQuery));
    } else if (selectedCategory === ALL_CATEGORY) {
      const all = Object.keys(venueCategories).flatMap(cat =>
        getVenuesByCategory(cat as VenueCategory)
      );
      setVenues(all);
    } else {
      setVenues(getVenuesByCategory(selectedCategory));
    }
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    loadVenues();
  }, [loadVenues]);

  // Search focus animation
  useEffect(() => {
    Animated.timing(searchAnimation, {
      toValue: isSearchFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isSearchFocused, searchAnimation]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      loadVenues();
      setRefreshing(false);
    }, 1000);
  }, [loadVenues]);

  const handleChatPress = useCallback((venueId: string) => {
    Alert.alert(
      'Join Chat Room',
      'Would you like to join the chat room for this venue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Join', 
          onPress: () => {
            console.log('Join chat for venue:', venueId);
            // TODO: Navigate to chat room
          }
        }
      ]
    );
  }, []);

  const navigateToVenue = useCallback((venueId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(`/venue/${venueId}`);
  }, []);

  // Memoized category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: 0 };
    
    Object.keys(venueCategories).forEach(category => {
      const categoryVenues = getVenuesByCategory(category as VenueCategory);
      counts[category] = categoryVenues.length;
      counts.all += categoryVenues.length;
    });
    
    return counts;
  }, []);

  const renderVenueItem = useCallback(({ item, index }: { item: Venue; index: number }) => (
    <VenueCardEnhanced
      key={item.id}
      id={item.id}
      name={item.name}
      category={item.category.charAt(0).toUpperCase() + item.category.slice(1)}
      image={item.image}
      description={item.description}
      distance={`${(Math.random() * 5 + 0.5).toFixed(1)} km`}
      rating={4.0 + Math.random() * 1}
      badge={index < 3 ? (index === 0 ? 'Popular' : index === 1 ? 'New' : 'Trending') : undefined}
      variant="default"
      onPress={() => navigateToVenue(item.id)}
      onChatPress={() => handleChatPress(item.id)}
      style={{ 
        marginBottom: 16,
        marginHorizontal: isTablet ? 8 : 0,
      }}
    />
  ), [navigateToVenue, handleChatPress, isTablet]);

  const searchBarHeight = searchAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 60],
  });

  const searchBarBorderWidth = searchAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2],
  });

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: headerPadding }]}>
        <ThemedText style={[styles.title, { 
          color: colors.text,
          fontSize: getResponsiveValue({ sm: 24, md: 28, lg: 32 }),
        }]}>
          {t('exploreVenues')}
        </ThemedText>
        <ThemedText style={[styles.subtitle, { 
          color: colors.mutedForeground,
          fontSize: getResponsiveValue({ sm: 14, md: 16, lg: 18 }),
        }]}>
          {t('discoverNewPlaces')}
        </ThemedText>
      </View>

      {/* Enhanced Search Bar */}
      <ModernCard style={StyleSheet.flatten([styles.searchSection, { marginHorizontal: cardPadding }])}>
        <Animated.View style={[
          styles.searchContainer,
          {
            backgroundColor: colors.surface,
            borderColor: colors.primary,
            height: searchBarHeight,
            borderWidth: searchBarBorderWidth,
          }
        ]}>
          <IconSymbol 
            name="magnifyingglass" 
            size={getResponsiveValue({ sm: 18, md: 20, lg: 22 })} 
            color={isSearchFocused ? colors.primary : colors.mutedForeground} 
          />
          <TextInput
            style={[styles.searchInput, { 
              color: colors.text,
              fontSize: getResponsiveValue({ sm: 14, md: 16, lg: 18 }),
            }]}
            placeholder={t('searchVenues')}
            placeholderTextColor={colors.mutedForeground}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <IconSymbol 
                name="xmark.circle.fill" 
                size={getResponsiveValue({ sm: 16, md: 18, lg: 20 })} 
                color={colors.mutedForeground} 
              />
            </TouchableOpacity>
          )}
        </Animated.View>
      </ModernCard>

      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={[styles.categoryContainer, { paddingHorizontal: cardPadding }]}
      >
        <CategoryFilter
          label={t('all')}
          selected={selectedCategory === 'all'}
          onPress={() => setSelectedCategory('all')}
          count={categoryCounts.all}
        />

        {Object.entries(venueCategories).map(([key, category]) => (
          <CategoryFilter
            key={key}
            label={category.title}
            icon={category.icon as any}
            selected={selectedCategory === key}
            onPress={() => setSelectedCategory(key as VenueCategory)}
            count={categoryCounts[key]}
          />
        ))}
      </ScrollView>

      {/* Results Section */}
      <View style={[styles.resultsSection, { paddingHorizontal: cardPadding }]}>
        <View style={styles.resultsHeader}>
          <ThemedText style={[styles.resultsCount, { 
            color: colors.text,
            fontSize: getResponsiveValue({ sm: 14, md: 16, lg: 18 }),
          }]}>
            {venues.length} {venues.length === 1 ? t('venue') : t('venues')} {t('found')}
          </ThemedText>
          
          {selectedCategory !== ALL_CATEGORY && (
            <TouchableOpacity
              style={[styles.clearFiltersButton, { backgroundColor: colors.primary + '20' }]}
              onPress={() => setSelectedCategory(ALL_CATEGORY)}
            >
              <ThemedText style={[styles.clearFiltersText, { color: colors.primary }]}> 
                {t('clearFilters')}
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>

        {/* Venues List */}
        <FlatList
          data={venues}
          renderItem={renderVenueItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.venuesList, { paddingBottom: 100 }]}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          numColumns={isTablet ? 2 : 1}
          key={isTablet ? 'tablet' : 'phone'} // Force re-render when layout changes
          columnWrapperStyle={isTablet ? styles.columnWrapper : undefined}
          ListEmptyComponent={
            <ModernCard style={styles.emptyState}>
              <IconSymbol name="magnifyingglass" size={48} color={colors.mutedForeground} />
              <ThemedText style={[styles.emptyStateText, { color: colors.text }]}>
                {t('noVenuesFound')}
              </ThemedText>
              <ThemedText style={[styles.emptyStateSubtext, { color: colors.mutedForeground }]}>
                {t('tryDifferentSearch')}
              </ThemedText>
            </ModernCard>
          }
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 32,
    paddingBottom: 24,
  },
  title: {
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontWeight: "600",
  },
  searchSection: {
    marginBottom: 16,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontWeight: "600",
  },
  clearButton: {
    padding: 8,
  },
  categoryScroll: {
    marginBottom: 16,
    maxHeight: 50,
  },
  categoryContainer: {
    gap: 8,
    alignItems: 'center',
    paddingVertical: 8,
  },
  categoryFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    minWidth: 70,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 6,
  },
  categoryFilterText: {
    fontWeight: "600",
    textAlign: 'center',
  },
  countBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  countText: {
    fontWeight: "600",
  },
  resultsSection: {
    flex: 1,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsCount: {
    fontWeight: "600",
  },
  clearFiltersButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  clearFiltersText: {
    fontSize: 12,
    fontWeight: "600",
  },
  venuesList: {
    gap: 12,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32 * 2,
    paddingHorizontal: 24,
    marginTop: 32,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
