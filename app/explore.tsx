import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';

// Theme and styling
import { useTheme } from '@/context/ThemeContext';
import { styles as modernStyles, colors, spacing, borderRadius, shadows } from '@/styles/modernTheme';

// Components
import SearchBar from '@/components/home/SearchBar/SearchBar';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { VenueCard } from '@/components/venues/VenueCard';
import { EnhancedCategoriesGrid } from '@/components/categories/EnhancedCategoriesGrid';

// Data
import { 
  categories, 
  getVenuesByCategory, 
  searchVenues, 
  getVenuesByProvince,
  getVenuesByCity,
  southAfricanVenues,
  getVenueStats
} from '@/data/southAfricanVenues';

export default function ExploreScreen() {
  const { isDark } = useTheme();
  const params = useLocalSearchParams();
  
  const [selectedCategory, setSelectedCategory] = useState<string>(params.category as string || '');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterBy, setFilterBy] = useState<'all' | 'province' | 'city'>('all');
  const [selectedFilter, setSelectedFilter] = useState<string>('');

  const venueStats = getVenueStats();

  // Get venues based on current filters
  const getFilteredVenues = () => {
    let venues = southAfricanVenues;

    // Apply category filter
    if (selectedCategory) {
      venues = getVenuesByCategory(selectedCategory);
    }

    // Apply search filter
    if (searchQuery) {
      venues = searchVenues(searchQuery).filter(venue => 
        !selectedCategory || venue.type === getCategoryType(selectedCategory)
      );
    }

    // Apply province/city filter
    if (filterBy === 'province' && selectedFilter) {
      venues = venues.filter(venue => venue.location.province === selectedFilter);
    } else if (filterBy === 'city' && selectedFilter) {
      venues = venues.filter(venue => venue.location.city === selectedFilter);
    }

    return venues;
  };

  const getCategoryType = (categoryId: string) => {
    const categoryTypeMap: Record<string, string> = {
      'shopping-malls': 'mall',
      'airports': 'airport',
      'parks': 'park',
      'hospitals': 'hospital',
      'stadiums': 'stadium',
      'universities': 'university',
      'government': 'government'
    };
    return categoryTypeMap[categoryId];
  };

  const filteredVenues = getFilteredVenues();
  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  // Get unique provinces and cities for filters
  const provinces = [...new Set(southAfricanVenues.map(v => v.location.province))].sort();
  const cities = [...new Set(southAfricanVenues.map(v => v.location.city))].sort();

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? '' : categoryId);
    setSearchQuery('');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory('');
  };

  return (
    <SafeAreaView style={[modernStyles.container, { backgroundColor: isDark ? modernStyles.containerDark.backgroundColor : modernStyles.container.backgroundColor }]}>
      <StatusBar 
        barStyle={isDark ? "light-content" : "dark-content"} 
        backgroundColor="transparent"
        translucent
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.title, { color: isDark ? '#FFFFFF' : colors.gray[900] }]}>
                Explore South Africa
              </Text>
              <Text style={[styles.subtitle, { color: isDark ? colors.gray[300] : colors.gray[600] }]}>
                {venueStats.totalVenues} venues across {venueStats.provincesCount} provinces
              </Text>
            </View>
            <ThemeToggle size={24} />
          </View>
          
          {/* Search Bar */}
          <SearchBar onSearch={handleSearch} />
        </View>

        {/* Active Filters */}
        {(selectedCategory || searchQuery || selectedFilter) && (
          <View style={styles.activeFilters}>
            <Text style={[styles.filtersTitle, { color: isDark ? colors.gray[300] : colors.gray[600] }]}>
              Active Filters:
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterTags}>
                {selectedCategory && (
                  <TouchableOpacity
                    style={[styles.filterTag, { backgroundColor: colors.primary[600] }]}
                    onPress={() => setSelectedCategory('')}
                  >
                    <Text style={styles.filterTagText}>
                      {selectedCategoryData?.name}
                    </Text>
                    <IconSymbol name="xmark.circle.fill" size={16} color="white" />
                  </TouchableOpacity>
                )}
                {searchQuery && (
                  <TouchableOpacity
                    style={[styles.filterTag, { backgroundColor: colors.primary[500] }]}
                    onPress={() => setSearchQuery('')}
                  >
                    <Text style={styles.filterTagText}>
                      "{searchQuery}"
                    </Text>
                    <IconSymbol name="xmark.circle.fill" size={16} color="white" />
                  </TouchableOpacity>
                )}
                {selectedFilter && (
                  <TouchableOpacity
                    style={[styles.filterTag, { backgroundColor: colors.primary[500] }]}
                    onPress={() => setSelectedFilter('')}
                  >
                    <Text style={styles.filterTagText}>
                      {selectedFilter}
                    </Text>
                    <IconSymbol name="xmark.circle.fill" size={16} color="white" />
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Categories Grid (when no specific category is selected) */}
        {!selectedCategory && !searchQuery && (
          <View style={styles.categoriesSection}>
            <EnhancedCategoriesGrid onCategoryPress={handleCategorySelect} />
          </View>
        )}

        {/* Quick Filters */}
        <View style={styles.quickFilters}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : colors.gray[900] }]}>
            Filter by Location
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterButtons}>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  filterBy === 'all' && styles.activeFilterButton,
                  { backgroundColor: filterBy === 'all' ? colors.primary[600] : (isDark ? colors.gray[800] : colors.gray[100]) }
                ]}
                onPress={() => {
                  setFilterBy('all');
                  setSelectedFilter('');
                }}
              >
                <Text style={[
                  styles.filterButtonText,
                  { color: filterBy === 'all' ? 'white' : (isDark ? '#FFFFFF' : colors.gray[700]) }
                ]}>
                  All Locations
                </Text>
              </TouchableOpacity>
              
              {provinces.slice(0, 3).map((province) => (
                <TouchableOpacity
                  key={province}
                  style={[
                    styles.filterButton,
                    selectedFilter === province && styles.activeFilterButton,
                    { backgroundColor: selectedFilter === province ? colors.primary[600] : (isDark ? colors.gray[800] : colors.gray[100]) }
                  ]}
                  onPress={() => {
                    setFilterBy('province');
                    setSelectedFilter(province === selectedFilter ? '' : province);
                  }}
                >
                  <Text style={[
                    styles.filterButtonText,
                    { color: selectedFilter === province ? 'white' : (isDark ? '#FFFFFF' : colors.gray[700]) }
                  ]}>
                    {province}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Results Section */}
        <View style={styles.resultsSection}>
          <View style={styles.resultsHeader}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : colors.gray[900] }]}>
              {selectedCategory 
                ? `${selectedCategoryData?.name} (${filteredVenues.length})`
                : searchQuery 
                  ? `Search Results (${filteredVenues.length})`
                  : `All Venues (${filteredVenues.length})`
              }
            </Text>
            
            {filteredVenues.length > 0 && (
              <Text style={[styles.resultsSubtitle, { color: isDark ? colors.gray[300] : colors.gray[600] }]}>
                Showing {filteredVenues.length} venue{filteredVenues.length !== 1 ? 's' : ''}
              </Text>
            )}
          </View>

          {/* Venues Grid */}
          {filteredVenues.length > 0 ? (
            <View style={styles.venuesGrid}>
              {filteredVenues.map((venue, index) => (
                <VenueCard
                  key={venue.id}
                  venue={{
                    id: venue.id,
                    name: venue.name,
                    distance: `${(Math.random() * 10 + 0.5).toFixed(1)} km`,
                    rating: venue.rating,
                    image: venue.image,
                    category: venue.type.charAt(0).toUpperCase() + venue.type.slice(1),
                    isOpen: venue.openingHours !== 'Closed',
                  }}
                  size="medium"
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <IconSymbol name="magnifyingglass" size={48} color={isDark ? colors.gray[600] : colors.gray[400]} />
              <Text style={[styles.emptyTitle, { color: isDark ? colors.gray[300] : colors.gray[600] }]}>
                No venues found
              </Text>
              <Text style={[styles.emptySubtitle, { color: isDark ? colors.gray[400] : colors.gray[500] }]}>
                Try adjusting your search or filters
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  activeFilters: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  filtersTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  filterTags: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  filterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  filterTagText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesSection: {
    marginBottom: spacing.lg,
  },
  quickFilters: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  filterButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    ...shadows.sm,
  },
  activeFilterButton: {
    transform: [{ scale: 1.05 }],
  },
  filterButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  resultsSection: {
    padding: spacing.md,
  },
  resultsHeader: {
    marginBottom: spacing.lg,
  },
  resultsSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: spacing.xs,
  },
  venuesGrid: {
    gap: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
});
