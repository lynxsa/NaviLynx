import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  RefreshControl,
  StatusBar,
  Share
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '@/components/ui/GlassCard';
import { 
  colors, 
  spacing, 
  borderRadius 
} from '@/styles/modernTheme';
import { 
  articlesDatabase, 
  dealsDatabase, 
  eventsDatabase,
  getArticlesByVenue,
  getDealsByVenue,
  getEventsByVenue,
  getFeaturedArticles,
  getFeaturedDeals,
  getTrendingDeals,
  getUpcomingEvents,
  type Article,
  type Deal,
  type EventArticle
} from '@/data/articlesData';

type ContentType = 'articles' | 'deals' | 'events';
type FilterType = 'all' | 'featured' | 'trending' | 'venue';

export default function ArticleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // State Management
  const [activeTab, setActiveTab] = useState<ContentType>('articles');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);

  // Extract content type and filters from params
  const contentType = (params.type as ContentType) || 'articles';
  const venueId = params.venueId as string;

  useEffect(() => {
    if (contentType) {
      setActiveTab(contentType);
    }
    if (venueId) {
      setSelectedVenue(venueId);
      setActiveFilter('venue');
    }
  }, [contentType, venueId]);

  // Content filtering logic
  const filteredContent = useMemo(() => {
    let articles: Article[] = [];
    let deals: Deal[] = [];
    let events: EventArticle[] = [];

    switch (activeFilter) {
      case 'featured':
        articles = getFeaturedArticles();
        deals = getFeaturedDeals();
        events = eventsDatabase.filter(e => e.featured);
        break;
      case 'trending':
        articles = articlesDatabase.filter(a => a.trending);
        deals = getTrendingDeals();
        events = eventsDatabase.filter(e => e.trending);
        break;
      case 'venue':
        if (selectedVenue) {
          articles = getArticlesByVenue(selectedVenue);
          deals = getDealsByVenue(selectedVenue);
          events = getEventsByVenue(selectedVenue);
        }
        break;
      default:
        articles = articlesDatabase;
        deals = dealsDatabase.filter(d => d.status === 'active');
        events = getUpcomingEvents();
    }

    return { articles, deals, events };
  }, [activeFilter, selectedVenue]);

  // Refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  // Share functionality
  const shareContent = async (title: string, id: string) => {
    try {
      await Share.share({
        message: `Check out: ${title} - Discover more on NaviLynx`,
        title: title,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Tab navigation
  const TabButton = ({ 
    type, 
    label, 
    count 
  }: { 
    type: ContentType; 
    label: string; 
    count: number;
  }) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        activeTab === type && styles.activeTabButton
      ]}
      onPress={() => setActiveTab(type)}
    >
      <Text style={[
        styles.tabLabel,
        activeTab === type && styles.activeTabLabel
      ]}>
        {label}
      </Text>
      <View style={[
        styles.countBadge,
        activeTab === type && styles.activeCountBadge
      ]}>
        <Text style={[
          styles.countText,
          activeTab === type && styles.activeCountText
        ]}>
          {count}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Filter buttons
  const FilterButton = ({ 
    filter, 
    label 
  }: { 
    filter: FilterType; 
    label: string;
  }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        activeFilter === filter && styles.activeFilterButton
      ]}
      onPress={() => setActiveFilter(filter)}
    >
      <Text style={[
        styles.filterLabel,
        activeFilter === filter && styles.activeFilterLabel
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  // Article Card Component
  const ArticleCard = ({ article }: { article: Article }) => (
    <GlassCard style={styles.contentCard}>
      <TouchableOpacity
        onPress={() => router.push(`/article/${article.id}` as any)}
        activeOpacity={0.8}
      >
        <Image source={{ uri: article.images[0] }} style={styles.cardImage} />
        {article.featured && (
          <View style={styles.featuredBadge}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
        
        <View style={styles.cardContent}>
          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>{article.category}</Text>
          </View>
          
          <Text style={styles.cardTitle} numberOfLines={2}>{article.title}</Text>
          <Text style={styles.cardSubtitle} numberOfLines={1}>{article.subtitle}</Text>
          <Text style={styles.cardExcerpt} numberOfLines={3}>{article.excerpt}</Text>
          
          <View style={styles.articleMeta}>
            <View style={styles.authorInfo}>
              <Image source={{ uri: article.author.avatar }} style={styles.authorAvatar} />
              <Text style={styles.authorName}>{article.author.name}</Text>
            </View>
            <Text style={styles.readTime}>{article.readTime} min read</Text>
          </View>
          
          <View style={styles.cardActions}>
            <View style={styles.engagementStats}>
              <View style={styles.statItem}>
                <Ionicons name="heart" size={16} color={colors.error} />
                <Text style={styles.statText}>{article.likes}</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="chatbubble" size={16} color={colors.primary} />
                <Text style={styles.statText}>{article.comments}</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => shareContent(article.title, article.id)}
              style={styles.shareButton}
            >
              <Ionicons name="share-outline" size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </GlassCard>
  );

  // Deal Card Component
  const DealCard = ({ deal }: { deal: Deal }) => (
    <GlassCard style={styles.contentCard}>
      <TouchableOpacity
        onPress={() => router.push(`/deal-details/${deal.id}` as any)}
        activeOpacity={0.8}
      >
        <Image source={{ uri: deal.image }} style={styles.cardImage} />
        {deal.featured && (
          <View style={styles.featuredBadge}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
        
        <View style={styles.dealDiscount}>
          <Text style={styles.discountText}>{deal.discountPercentage}% OFF</Text>
        </View>
        
        <View style={styles.cardContent}>
          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>{deal.category}</Text>
          </View>
          
          <Text style={styles.cardTitle} numberOfLines={2}>{deal.title}</Text>
          <Text style={styles.cardExcerpt} numberOfLines={2}>{deal.description}</Text>
          
          <View style={styles.priceInfo}>
            <Text style={styles.originalPrice}>{deal.originalPrice}</Text>
            <Text style={styles.discountedPrice}>{deal.discountedPrice}</Text>
            <Text style={styles.savings}>Save {deal.savings}</Text>
          </View>
          
          <View style={styles.dealMeta}>
            <Text style={styles.venueName}>{deal.venueName}</Text>
            <Text style={styles.validUntil}>
              Until {new Date(deal.validUntil).toLocaleDateString()}
            </Text>
          </View>
          
          <View style={styles.cardActions}>
            <View style={styles.dealRating}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>{deal.rating}</Text>
              <Text style={styles.reviewText}>({deal.reviewCount})</Text>
            </View>
            <TouchableOpacity
              onPress={() => shareContent(deal.title, deal.id)}
              style={styles.shareButton}
            >
              <Ionicons name="share-outline" size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </GlassCard>
  );

  // Event Card Component
  const EventCard = ({ event }: { event: EventArticle }) => (
    <GlassCard style={styles.contentCard}>
      <TouchableOpacity
        onPress={() => router.push(`/event/${event.id}` as any)}
        activeOpacity={0.8}
      >
        <Image source={{ uri: event.image }} style={styles.cardImage} />
        {event.featured && (
          <View style={styles.featuredBadge}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
        
        <View style={styles.eventDate}>
          <Text style={styles.eventDateText}>
            {new Date(event.startDate).toLocaleDateString()}
          </Text>
        </View>
        
        <View style={styles.cardContent}>
          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>{event.category}</Text>
          </View>
          
          <Text style={styles.cardTitle} numberOfLines={2}>{event.title}</Text>
          <Text style={styles.cardExcerpt} numberOfLines={2}>{event.description}</Text>
          
          <View style={styles.eventInfo}>
            <View style={styles.eventDetail}>
              <Ionicons name="location" size={14} color={colors.primary} />
              <Text style={styles.eventDetailText}>{event.location.section}</Text>
            </View>
            <View style={styles.eventDetail}>
              <Ionicons name="time" size={14} color={colors.primary} />
              <Text style={styles.eventDetailText}>{event.startTime}</Text>
            </View>
            {!event.freeEvent && (
              <View style={styles.eventDetail}>
                <Ionicons name="ticket" size={14} color={colors.primary} />
                <Text style={styles.eventDetailText}>{event.ticketPrice}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.cardActions}>
            <View style={styles.eventStats}>
              <Text style={styles.registeredText}>
                {event.registered} registered
              </Text>
              {event.freeEvent && (
                <Text style={styles.freeEventText}>FREE</Text>
              )}
            </View>
            <TouchableOpacity
              onPress={() => shareContent(event.title, event.id)}
              style={styles.shareButton}
            >
              <Ionicons name="share-outline" size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </GlassCard>
  );

  // Content renderer
  const renderContent = () => {
    switch (activeTab) {
      case 'articles':
        return filteredContent.articles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ));
      case 'deals':
        return filteredContent.deals.map(deal => (
          <DealCard key={deal.id} deal={deal} />
        ));
      case 'events':
        return filteredContent.events.map(event => (
          <EventCard key={event.id} event={event} />
        ));
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Discover & Explore</Text>
          
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TabButton 
            type="articles" 
            label="Articles" 
            count={filteredContent.articles.length} 
          />
          <TabButton 
            type="deals" 
            label="Deals" 
            count={filteredContent.deals.length} 
          />
          <TabButton 
            type="events" 
            label="Events" 
            count={filteredContent.events.length} 
          />
        </View>
      </LinearGradient>

      {/* Filter Bar */}
      <View style={styles.filterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          <FilterButton filter="all" label="All" />
          <FilterButton filter="featured" label="Featured" />
          <FilterButton filter="trending" label="Trending" />
          {venueId && <FilterButton filter="venue" label="This Venue" />}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderContent()}
        
        {/* Empty State */}
        {(() => {
          const currentContent = filteredContent[activeTab];
          if (currentContent.length === 0) {
            return (
              <View style={styles.emptyState}>
                <Ionicons 
                  name={activeTab === 'articles' ? 'document-text' : 
                       activeTab === 'deals' ? 'pricetag' : 'calendar'} 
                  size={64} 
                  color={colors.textSecondary} 
                />
                <Text style={styles.emptyTitle}>No {activeTab} found</Text>
                <Text style={styles.emptySubtitle}>
                  Try changing your filter or check back later for new content.
                </Text>
              </View>
            );
          }
          return null;
        })()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  // Header styles
  header: {
    paddingTop: 50,
    paddingBottom: spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Tab styles
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.xs,
  },
  activeTabButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    marginRight: spacing.xs,
  },
  activeTabLabel: {
    color: '#FFFFFF',
  },
  countBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  activeCountBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  activeCountText: {
    color: '#FFFFFF',
  },
  
  // Filter styles
  filterContainer: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterScrollContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  filterButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeFilterButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  activeFilterLabel: {
    color: '#FFFFFF',
  },
  
  // Content styles
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  contentCard: {
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  featuredBadge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  featuredText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFD700',
    marginLeft: spacing.xs,
  },
  dealDiscount: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: colors.error,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  discountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  eventDate: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  eventDateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // Card content
  cardContent: {
    padding: spacing.lg,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary + '20',
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginBottom: spacing.sm,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
    lineHeight: 24,
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  cardExcerpt: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  
  // Article specific
  articleMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: spacing.sm,
  },
  authorName: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
  },
  readTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  
  // Deal specific
  priceInfo: {
    marginBottom: spacing.md,
  },
  originalPrice: {
    fontSize: 14,
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  discountedPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  savings: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
  },
  dealMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  venueName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  validUntil: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  
  // Event specific
  eventInfo: {
    marginBottom: spacing.md,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  eventDetailText: {
    fontSize: 12,
    color: colors.text,
    marginLeft: spacing.xs,
  },
  
  // Card actions
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  engagementStats: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  statText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  dealRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    marginLeft: spacing.xs,
  },
  reviewText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  eventStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  registeredText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  freeEventText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.success,
    marginLeft: spacing.md,
  },
  shareButton: {
    padding: spacing.sm,
  },
  
  // Empty state
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
});
