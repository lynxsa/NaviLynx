import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  RefreshControl,
  Alert,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ModernCard } from '@/components/ui/ModernCard';
import { EnhancedDealCard } from '@/components/deals/EnhancedDealCard';
import { useTheme } from '@/context/ThemeContext';
import { colors, spacing, borderRadius, shadows } from '@/styles/modernTheme';
import DealsService, { ExtendedDeal, DealFilter, DealSort } from '@/services/DealsService';

const { width } = Dimensions.get('window');

const categories = [
  { id: 'all', name: 'All', icon: 'grid.circle' },
  { id: 'Electronics', name: 'Electronics', icon: 'laptopcomputer' },
  { id: 'Fashion', name: 'Fashion', icon: 'tshirt' },
  { id: 'Dining', name: 'Dining', icon: 'fork.knife' },
  { id: 'Beauty', name: 'Beauty', icon: 'sparkles' },
  { id: 'Sports', name: 'Sports', icon: 'figure.run' },
];

const sortOptions = [
  { field: 'discount' as const, order: 'desc' as const, label: 'Highest Discount' },
  { field: 'validUntil' as const, order: 'asc' as const, label: 'Expiring Soon' },
  { field: 'title' as const, order: 'asc' as const, label: 'Name A-Z' },
  { field: 'createdAt' as const, order: 'desc' as const, label: 'Newest First' },
];

export default function DealsScreen() {
  const { isDark } = useTheme();
  const dealsService = DealsService.getInstance();
  
  const [deals, setDeals] = useState<ExtendedDeal[]>([]);
  const [featuredDeals, setFeaturedDeals] = useState<ExtendedDeal[]>([]);
  const [expiringDeals, setExpiringDeals] = useState<ExtendedDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSort, setSelectedSort] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Load deals data
  const loadDeals = useCallback(async () => {
    try {
      const filter: DealFilter = {
        isActive: true,
        validOnly: true,
      };

      if (selectedCategory !== 'all') {
        filter.category = selectedCategory;
      }

      if (searchQuery.trim()) {
        filter.search = searchQuery.trim();
      }

      const sort: DealSort = sortOptions[selectedSort];

      const [allDeals, featured, expiring] = await Promise.all([
        dealsService.getDeals(filter, sort),
        dealsService.getFeaturedDeals(),
        dealsService.getExpiringDeals(),
      ]);

      setDeals(allDeals);
      setFeaturedDeals(featured);
      setExpiringDeals(expiring);
    } catch (error) {
      console.error('Error loading deals:', error);
      Alert.alert('Error', 'Failed to load deals. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCategory, searchQuery, selectedSort]);

  useEffect(() => {
    loadDeals();
  }, [loadDeals]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadDeals();
  };

  const handleDealPress = (dealId: string) => {
    router.push(`/deal-details/${dealId}`);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleSortSelect = (index: number) => {
    setSelectedSort(index);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedSort(0);
  };

  const renderFeaturedDeal = ({ item }: { item: ExtendedDeal }) => (
    <EnhancedDealCard
      deal={item}
      onPress={handleDealPress}
      size="large"
      layout="horizontal"
    />
  );

  const renderDeal = ({ item }: { item: ExtendedDeal }) => (
    <View style={styles.dealItem}>
      <EnhancedDealCard
        deal={item}
        onPress={handleDealPress}
        size="medium"
        layout="vertical"
      />
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Title Section */}
      <View style={styles.titleSection}>
        <Text style={[
          styles.screenTitle,
          { color: isDark ? colors.dark.text : colors.light.text }
        ]}>
          Exclusive Deals
        </Text>
        <Text style={[
          styles.screenSubtitle,
          { color: isDark ? colors.dark.textSecondary : colors.light.textSecondary }
        ]}>
          Discover amazing offers at your favorite venues
        </Text>
      </View>

      {/* Search and Filter Section */}
      <View style={styles.searchSection}>
        <View style={[
          styles.searchContainer,
          { backgroundColor: isDark ? colors.dark.surface : colors.light.surface }
        ]}>
          <IconSymbol name="magnifyingglass" size={20} color={colors.primary} />
          <TextInput
            style={[
              styles.searchInput,
              { color: isDark ? colors.dark.text : colors.light.text }
            ]}
            placeholder="Search deals..."
            placeholderTextColor={isDark ? colors.dark.textSecondary : colors.light.textSecondary}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <IconSymbol name="xmark.circle.fill" size={20} color={colors.secondary} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.filterButton,
            { backgroundColor: isDark ? colors.dark.surface : colors.light.surface }
          ]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <IconSymbol name="line.3.horizontal.decrease.circle" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Filters Section */}
      {showFilters && (
        <ModernCard style={styles.filtersCard}>
          {/* Categories */}
          <View style={styles.filterSection}>
            <Text style={[
              styles.filterTitle,
              { color: isDark ? colors.dark.text : colors.light.text }
            ]}>
              Categories
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesContainer}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category.id && styles.selectedCategoryButton,
                    {
                      backgroundColor: selectedCategory === category.id
                        ? colors.primary
                        : (isDark ? colors.dark.surface : colors.light.surface)
                    }
                  ]}
                  onPress={() => handleCategorySelect(category.id)}
                >
                  <IconSymbol 
                    name={category.icon} 
                    size={18} 
                    color={selectedCategory === category.id ? 'white' : colors.primary} 
                  />
                  <Text style={[
                    styles.categoryButtonText,
                    {
                      color: selectedCategory === category.id
                        ? 'white'
                        : (isDark ? colors.dark.text : colors.light.text)
                    }
                  ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Sort Options */}
          <View style={styles.filterSection}>
            <Text style={[
              styles.filterTitle,
              { color: isDark ? colors.dark.text : colors.light.text }
            ]}>
              Sort By
            </Text>
            <View style={styles.sortContainer}>
              {sortOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.sortButton,
                    selectedSort === index && styles.selectedSortButton,
                    {
                      backgroundColor: selectedSort === index
                        ? colors.primary + '20'
                        : 'transparent'
                    }
                  ]}
                  onPress={() => handleSortSelect(index)}
                >
                  <Text style={[
                    styles.sortButtonText,
                    {
                      color: selectedSort === index
                        ? colors.primary
                        : (isDark ? colors.dark.text : colors.light.text)
                    }
                  ]}>
                    {option.label}
                  </Text>
                  {selectedSort === index && (
                    <IconSymbol name="checkmark" size={16} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Clear Filters */}
          <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
            <Text style={styles.clearFiltersText}>Clear All Filters</Text>
          </TouchableOpacity>
        </ModernCard>
      )}

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <ModernCard style={styles.statCard}>
          <Text style={[
            styles.statNumber,
            { color: isDark ? colors.dark.text : colors.light.text }
          ]}>
            {deals.length}
          </Text>
          <Text style={[
            styles.statLabel,
            { color: isDark ? colors.dark.textSecondary : colors.light.textSecondary }
          ]}>
            Active Deals
          </Text>
        </ModernCard>

        <ModernCard style={styles.statCard}>
          <Text style={[
            styles.statNumber,
            { color: colors.accent }
          ]}>
            {expiringDeals.length}
          </Text>
          <Text style={[
            styles.statLabel,
            { color: isDark ? colors.dark.textSecondary : colors.light.textSecondary }
          ]}>
            Expiring Soon
          </Text>
        </ModernCard>

        <ModernCard style={styles.statCard}>
          <Text style={[
            styles.statNumber,
            { color: colors.primary }
          ]}>
            {featuredDeals.length}
          </Text>
          <Text style={[
            styles.statLabel,
            { color: isDark ? colors.dark.textSecondary : colors.light.textSecondary }
          ]}>
            Featured
          </Text>
        </ModernCard>
      </View>

      {/* Featured Deals Section */}
      {featuredDeals.length > 0 && (
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[
              styles.sectionTitle,
              { color: isDark ? colors.dark.text : colors.light.text }
            ]}>
              🔥 Featured Deals
            </Text>
            <TouchableOpacity onPress={() => router.push('/deals/featured')}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={featuredDeals}
            renderItem={renderFeaturedDeal}
            keyExtractor={(item) => `featured-${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredList}
          />
        </View>
      )}

      {/* Expiring Soon Section */}
      {expiringDeals.length > 0 && (
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[
              styles.sectionTitle,
              { color: isDark ? colors.dark.text : colors.light.text }
            ]}>
              ⏰ Expiring Soon
            </Text>
            <TouchableOpacity onPress={() => router.push('/deals/expiring')}>
              <Text style={[styles.seeAllText, { color: colors.accent }]}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={expiringDeals}
            renderItem={renderFeaturedDeal}
            keyExtractor={(item) => `expiring-${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredList}
          />
        </View>
      )}

      {/* All Deals Header */}
      <View style={styles.sectionHeader}>
        <Text style={[
          styles.sectionTitle,
          { color: isDark ? colors.dark.text : colors.light.text }
        ]}>
          All Deals
        </Text>
        <Text style={[
          styles.resultsCount,
          { color: isDark ? colors.dark.textSecondary : colors.light.textSecondary }
        ]}>
          {deals.length} deals found
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[
      styles.container,
      { backgroundColor: isDark ? colors.dark.background : colors.light.background }
    ]}>
      <FlatList
        data={deals}
        renderItem={renderDeal}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <IconSymbol name="tag" size={48} color={colors.secondary} />
              <Text style={[
                styles.emptyTitle,
                { color: isDark ? colors.dark.text : colors.light.text }
              ]}>
                No Deals Found
              </Text>
              <Text style={[
                styles.emptyText,
                { color: isDark ? colors.dark.textSecondary : colors.light.textSecondary }
              ]}>
                Try adjusting your search or filters to find more deals.
              </Text>
              <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
                <LinearGradient
                  colors={[colors.primary, colors.secondary]}
                  style={styles.clearButtonGradient}
                >
                  <Text style={styles.clearFiltersText}>Clear Filters</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
  },
  header: {
    padding: spacing.medium,
  },
  titleSection: {
    marginBottom: spacing.large,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: spacing.xsmall,
  },
  screenSubtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.small,
    marginBottom: spacing.medium,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
    borderRadius: borderRadius.medium,
    gap: spacing.small,
    ...shadows.small,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filterButton: {
    padding: spacing.small,
    borderRadius: borderRadius.medium,
    ...shadows.small,
  },
  filtersCard: {
    marginBottom: spacing.medium,
  },
  filterSection: {
    marginBottom: spacing.medium,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.small,
  },
  categoriesContainer: {
    marginBottom: spacing.small,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
    marginRight: spacing.small,
    borderRadius: borderRadius.medium,
    gap: spacing.xsmall,
  },
  selectedCategoryButton: {
    ...shadows.small,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sortContainer: {
    gap: spacing.xsmall,
  },
  sortButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
    borderRadius: borderRadius.small,
  },
  selectedSortButton: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  clearFiltersButton: {
    alignSelf: 'center',
    marginTop: spacing.small,
  },
  clearButtonGradient: {
    paddingHorizontal: spacing.large,
    paddingVertical: spacing.small,
    borderRadius: borderRadius.medium,
  },
  clearFiltersText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.small,
    marginBottom: spacing.large,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.medium,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: spacing.xsmall,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  sectionContainer: {
    marginBottom: spacing.large,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.medium,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  resultsCount: {
    fontSize: 14,
  },
  featuredList: {
    paddingRight: spacing.medium,
  },
  listContent: {
    paddingBottom: spacing.xlarge,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: spacing.medium,
  },
  dealItem: {
    width: (width - spacing.medium * 3) / 2,
    marginBottom: spacing.medium,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xlarge,
    paddingHorizontal: spacing.large,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: spacing.medium,
    marginBottom: spacing.small,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.large,
  },
};
