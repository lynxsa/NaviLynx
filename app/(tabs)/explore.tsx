import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '@/context/ThemeContext';
import { 
  venueCategories, 
  getAllEnhancedVenues, 
  getVenuesByCategory, 
  searchVenues,
  type EnhancedVenue,
  type VenueCategory
} from '@/data/enhancedVenues';
import { UnifiedCategoryCard } from '@/components/categories/UnifiedCategoryCard';

const { width } = Dimensions.get('window');
const CATEGORY_CARD_WIDTH = (width - 60) / 2;

export default function ExploreScreen() {
  const { colors, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [venues, setVenues] = useState<EnhancedVenue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<EnhancedVenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<VenueCategory[]>([]);

  useEffect(() => {
    loadVenues();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [venues, searchQuery, selectedCategory]);

  const loadVenues = async () => {
    try {
      setLoading(true);
      
      // Load categories
      setCategories(venueCategories || []);
      
      // Load venues
      const allVenues = getAllEnhancedVenues();
      setVenues(allVenues);
    } catch (error) {
      console.error('Error loading venues:', error);
      // Set empty arrays as fallback
      setCategories([]);
      setVenues([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = venues;

    // Apply category filter
    if (selectedCategory) {
      filtered = getVenuesByCategory(selectedCategory);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const searchResults = searchVenues(searchQuery);
      if (selectedCategory) {
        // Map category IDs to venue types
        const categoryMap: { [key: string]: string } = {
          'shopping-malls': 'mall',
          'airports': 'airport',
          'hospitals': 'hospital',
          'universities': 'university',
          'stadiums': 'stadium',
          'government': 'government',
          'entertainment': 'entertainment',
        };
        filtered = searchResults.filter(venue => venue.type === categoryMap[selectedCategory]);
      } else {
        filtered = searchResults;
      }
    }

    setFilteredVenues(filtered);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSearchQuery(''); // Clear search when selecting category
  };

  const handleVenuePress = (venue: EnhancedVenue) => {
    router.push(`/venue/${venue.id}`);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSearchQuery('');
  };

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchInputContainer}>
        <IconSymbol name="magnifyingglass" size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search venues, stores, or services..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <IconSymbol name="xmark" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderCategoryCard = ({ item: category }: { item: VenueCategory }) => (
    <UnifiedCategoryCard
      category={category}
      width={CATEGORY_CARD_WIDTH}
      onPress={handleCategorySelect}
    />
  );

  const renderVenueCard = ({ item: venue }: { item: EnhancedVenue }) => (
    <TouchableOpacity
      style={[styles.venueCard, { backgroundColor: colors.surface }]}
      onPress={() => handleVenuePress(venue)}
    >
      <Image source={{ uri: venue.headerImage }} style={styles.venueImage} />
      <View style={styles.venueContent}>
        <View style={styles.venueHeader}>
          <Text style={[styles.venueName, { color: colors.text }]} numberOfLines={1}>
            {venue.name}
          </Text>
          {venue.isFeatured && (
            <View style={[styles.featuredBadge, { backgroundColor: colors.primary }]}>
              <IconSymbol name="star.fill" size={10} color="#FFFFFF" />
            </View>
          )}
        </View>
        <Text style={[styles.venueLocation, { color: colors.textSecondary }]} numberOfLines={1}>
          {venue.location.city}, {venue.location.province}
        </Text>
        <Text style={[styles.venueDescription, { color: colors.textSecondary }]} numberOfLines={2}>
          {venue.shortDescription}
        </Text>
        <View style={styles.venueFooter}>
          <View style={styles.venueRating}>
            <IconSymbol name="star.fill" size={12} color="#FFD700" />
            <Text style={[styles.venueRatingText, { color: colors.text }]}>{venue.rating}</Text>
            <Text style={[styles.venueReviewCount, { color: colors.textSecondary }]}>
              ({venue.reviewCount})
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
  const renderContent = () => {
    if (selectedCategory || searchQuery.trim()) {
      const categoryName = selectedCategory 
        ? categories.find(c => c.id === selectedCategory)?.name 
        : null;
      
      return (
        <View style={styles.venuesList}>
          <View style={styles.resultsHeader}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBackToCategories}
            >
              <IconSymbol name="chevron.left" size={20} color={colors.primary} />
              <Text style={[styles.backButtonText, { color: colors.primary }]}>
                Back to Categories
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.resultsInfo}>
            <Text style={[styles.resultsTitle, { color: colors.text }]}>
              {searchQuery.trim() ? `Search Results` : categoryName}
            </Text>
            <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>
              {filteredVenues.length} venue{filteredVenues.length !== 1 ? 's' : ''} found
            </Text>
          </View>

          <FlatList
            data={filteredVenues}
            renderItem={renderVenueCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.venuesGrid}
            columnWrapperStyle={styles.venueRow}
          />
        </View>
      );
    }

    return (
      <View style={styles.categoriesSection}>
        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
          Click on venue category to start Navigating!
        </Text>
        <FlatList
          data={categories}
          renderItem={renderCategoryCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.categoriesGrid}
          columnWrapperStyle={styles.categoryRow}
        />
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centerContent}>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading venues...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Explore</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Discover amazing venues
        </Text>
      </View>

      {renderSearchBar()}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '400',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
  },
  content: {
    flex: 1,
  },
  categoriesSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 24,
  },
  categoriesGrid: {
    paddingBottom: 20,
  },
  categoryRow: {
    justifyContent: 'space-between',
  },
  venuesList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultsHeader: {
    paddingVertical: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  resultsInfo: {
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '400',
  },
  venuesGrid: {
    paddingBottom: 20,
  },
  venueRow: {
    justifyContent: 'space-between',
  },
  venueCard: {
    width: (width - 60) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  venueImage: {
    width: '100%',
    height: 120,
  },
  venueContent: {
    padding: 12,
  },
  venueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  venueName: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  featuredBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  venueLocation: {
    fontSize: 12,
    fontWeight: '400',
    marginBottom: 6,
  },
  venueDescription: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    marginBottom: 8,
  },
  venueFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  venueRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  venueRatingText: {
    fontSize: 12,
    fontWeight: '600',
  },
  venueReviewCount: {
    fontSize: 11,
    fontWeight: '400',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '400',
  },
});
