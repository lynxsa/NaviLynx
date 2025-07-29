/**
 * 🏠 OPERATION LIONMOUNTAIN - Enhanced Home Screen
 * 
 * Complete home screen with modern purple theme
 * Features: Enhanced venue cards, deal cards, article cards
 * Perfect UI/UX with world-class design
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
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  FadeIn,
  SlideInUp,
} from 'react-native-reanimated';

import { purpleTheme, spacing, borderRadius, shadows, typography } from '../theme/globalTheme';
import { UniversalCard } from './UniversalCard';
import { AppHeader } from './AppHeader';

const { width } = Dimensions.get('window');

// Interfaces
interface FeaturedVenue {
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  category: string;
  distance: string;
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

interface Article {
  id: string;
  title: string;
  summary: string;
  image: string;
  readTime: number;
  category: string;
  publishedAt: Date;
}

interface VenueCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
}

// Mock Data
const mockVenues: FeaturedVenue[] = [
  {
    id: '1',
    name: 'Sandton City Mall',
    location: 'Sandton, Gauteng',
    image: 'https://example.com/sandton-city.jpg',
    rating: 4.5,
    category: 'Shopping Mall',
    distance: '2.1 km',
  },
  {
    id: '2',
    name: 'V&A Waterfront',
    location: 'Cape Town, Western Cape',
    image: 'https://example.com/va-waterfront.jpg',
    rating: 4.8,
    category: 'Shopping & Entertainment',
    distance: '5.3 km',
  },
];

const mockDeals: Deal[] = [
  {
    id: '1',
    title: '50% Off Electronics',
    description: 'Latest smartphones and gadgets at incredible prices',
    discount: '50%',
    store: 'Takealot',
    category: 'Electronics',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    title: 'Buy 2 Get 1 Free',
    description: 'Premium beauty and wellness products',
    discount: 'BOGO',
    store: 'Clicks',
    category: 'Beauty',
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  },
];

const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Best Shopping Tips for Black Friday',
    summary: 'Expert advice on maximizing your savings during the biggest shopping event',
    image: 'https://example.com/black-friday-tips.jpg',
    readTime: 5,
    category: 'Shopping Guide',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    title: 'AR Navigation: The Future is Here',
    summary: 'How augmented reality is revolutionizing indoor navigation',
    image: 'https://example.com/ar-navigation.jpg',
    readTime: 3,
    category: 'Technology',
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
];

const mockCategories: VenueCategory[] = [
  { id: '1', name: 'Shopping Malls', icon: 'storefront', color: purpleTheme.primary, count: 24 },
  { id: '2', name: 'Restaurants', icon: 'restaurant', color: '#10B981', count: 18 },
  { id: '3', name: 'Entertainment', icon: 'game-controller', color: '#F59E0B', count: 12 },
  { id: '4', name: 'Hospitals', icon: 'medical', color: '#EF4444', count: 8 },
];

interface EnhancedHomeScreenProps {
  onNavigateToVenue?: (venueId: string) => void;
  onNavigateToExplore?: () => void;
  onNavigateToDeals?: () => void;
  onNavigateToArticles?: () => void;
  onNavigateToCategory?: (categoryId: string) => void;
}

export const EnhancedHomeScreen: React.FC<EnhancedHomeScreenProps> = ({
  onNavigateToVenue,
  onNavigateToExplore,
  onNavigateToDeals,
  onNavigateToArticles,
  onNavigateToCategory,
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [greeting, setGreeting] = useState('');

  const heroOpacity = useSharedValue(0);
  const heroTranslateY = useSharedValue(50);

  useEffect(() => {
    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 17) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }

    // Animate hero section
    heroOpacity.value = withTiming(1, { duration: 800 });
    heroTranslateY.value = withSpring(0, {
      damping: 15,
      stiffness: 100,
    });
  }, [heroOpacity, heroTranslateY]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1000);
  }, []);

  const animatedHeroStyle = useAnimatedStyle(() => ({
    opacity: heroOpacity.value,
    transform: [{ translateY: heroTranslateY.value }],
  }));

  const renderFeaturedVenueCard = (venue: FeaturedVenue) => (
    <UniversalCard
      key={venue.id}
      variant="elevated"
      size="lg"
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onNavigateToVenue?.(venue.id);
      }}
      style={styles.venueCard}
    >
      <Image
        source={{ uri: venue.image }}
        style={styles.venueImage}
        alt={venue.name}
      />
      
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.venueOverlay}
      >
        <View style={styles.venueContent}>
          <View style={styles.venueHeader}>
            <Text style={styles.venueName}>{venue.name}</Text>
            <View style={styles.venueRating}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{venue.rating}</Text>
            </View>
          </View>
          
          <Text style={styles.venueLocation}>{venue.location}</Text>
          
          <View style={styles.venueFooter}>
            <Text style={styles.venueCategory}>{venue.category}</Text>
            <Text style={styles.venueDistance}>{venue.distance} away</Text>
          </View>
        </View>
      </LinearGradient>
    </UniversalCard>
  );

  const renderDealCard = (deal: Deal) => (
    <UniversalCard
      key={deal.id}
      variant="default"
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        // Handle deal tap
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

  const renderArticleCard = (article: Article) => (
    <UniversalCard
      key={article.id}
      variant="elevated"
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        // Handle article tap
      }}
      style={styles.articleCard}
    >
      <Image
        source={{ uri: article.image }}
        style={styles.articleImage}
        alt={article.title}
      />
      
      <View style={styles.articleContent}>
        <Text style={styles.articleTitle} numberOfLines={2}>
          {article.title}
        </Text>
        <Text style={styles.articleSummary} numberOfLines={3}>
          {article.summary}
        </Text>
        
        <View style={styles.articleFooter}>
          <View style={styles.articleMeta}>
            <Text style={styles.articleCategory}>{article.category}</Text>
            <Text style={styles.articleReadTime}>{article.readTime} min read</Text>
          </View>
          <Text style={styles.articleDate}>
            {article.publishedAt.toLocaleDateString()}
          </Text>
        </View>
      </View>
    </UniversalCard>
  );

  const renderCategoryCard = (category: VenueCategory) => (
    <UniversalCard
      key={category.id}
      variant="gradient"
      gradientColors={[category.color, `${category.color}CC`]}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onNavigateToCategory?.(category.id);
      }}
      style={styles.categoryCard}
    >
      <View style={styles.categoryContent}>
        <View style={styles.categoryIcon}>
          <Ionicons 
            name={category.icon as any} 
            size={24} 
            color="white" 
          />
        </View>
        <Text style={styles.categoryName}>{category.name}</Text>
        <Text style={styles.categoryCount}>{category.count} venues</Text>
      </View>
    </UniversalCard>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={purpleTheme.background} />
      
      <AppHeader
        title=""
        showLogo
        rightComponent={
          <TouchableOpacity 
            onPress={() => {/* Handle notifications */}}
            style={styles.headerButton}
          >
            <Ionicons name="notifications-outline" size={24} color={purpleTheme.text} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <Animated.View style={[styles.heroSection, animatedHeroStyle]} entering={FadeIn.duration(600)}>
          <LinearGradient
            colors={purpleTheme.gradients.hero}
            style={styles.heroGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.heroContent}>
              <Text style={styles.greetingText}>{greeting}!</Text>
              <Text style={styles.heroTitle}>Ready to explore?</Text>
              <Text style={styles.heroSubtitle}>
                Discover amazing venues, deals, and experiences with AR navigation
              </Text>
              
              <TouchableOpacity 
                onPress={onNavigateToExplore}
                style={styles.heroButton}
              >
                <View style={styles.heroButtonContent}>
                  <Ionicons name="search" size={20} color={purpleTheme.primary} />
                  <Text style={styles.heroButtonText}>Start Exploring</Text>
                </View>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Categories Section */}
        <Animated.View style={styles.section} entering={SlideInUp.duration(400).delay(200)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Browse Categories</Text>
            <Text style={styles.sectionSubtitle}>Find venues by type</Text>
          </View>
          
          <View style={styles.categoriesGrid}>
            {mockCategories.map(renderCategoryCard)}
          </View>
        </Animated.View>

        {/* Featured Venues */}
        <Animated.View style={styles.section} entering={SlideInUp.duration(400).delay(400)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Venues</Text>
            <TouchableOpacity onPress={onNavigateToExplore}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.venuesContainer}
          >
            {mockVenues.map(renderFeaturedVenueCard)}
          </ScrollView>
        </Animated.View>

        {/* Deals Section */}
        <Animated.View style={styles.section} entering={SlideInUp.duration(400).delay(600)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Deals</Text>
            <TouchableOpacity onPress={onNavigateToDeals}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dealsContainer}
          >
            {mockDeals.map(renderDealCard)}
          </ScrollView>
        </Animated.View>

        {/* Articles Section */}
        <Animated.View style={styles.section} entering={SlideInUp.duration(400).delay(800)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tips & Articles</Text>
            <TouchableOpacity onPress={onNavigateToArticles}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.articlesContainer}
          >
            {mockArticles.map(renderArticleCard)}
          </ScrollView>
        </Animated.View>

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
  headerButton: {
    position: 'relative',
    padding: spacing.xs,
  },
  notificationBadge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  
  // Hero Section
  heroSection: {
    margin: spacing.md,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.lg,
  },
  heroGradient: {
    padding: spacing.xl,
  },
  heroContent: {
    alignItems: 'center',
    gap: spacing.md,
  },
  greetingText: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.medium,
    color: 'rgba(255,255,255,0.9)',
  },
  heroTitle: {
    fontSize: typography.fontSizes.hero,
    fontWeight: typography.fontWeights.bold,
    color: 'white',
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: typography.fontSizes.md,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: typography.lineHeights.normal * typography.fontSizes.md,
  },
  heroButton: {
    backgroundColor: 'white',
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginTop: spacing.md,
    ...shadows.md,
  },
  heroButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  heroButtonText: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.bold,
    color: purpleTheme.primary,
  },
  
  // Sections
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  sectionTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: purpleTheme.text,
  },
  sectionSubtitle: {
    fontSize: typography.fontSizes.sm,
    color: purpleTheme.textSecondary,
    marginTop: 2,
  },
  viewAllText: {
    fontSize: typography.fontSizes.sm,
    color: purpleTheme.primary,
    fontWeight: typography.fontWeights.medium,
  },
  
  // Categories
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  categoryCard: {
    width: (width - spacing.md * 3) / 2,
    height: 120,
  },
  categoryContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.bold,
    color: 'white',
    textAlign: 'center',
  },
  categoryCount: {
    fontSize: typography.fontSizes.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  
  // Venues
  venuesContainer: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  venueCard: {
    width: width * 0.8,
    height: 200,
    position: 'relative',
  },
  venueImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: borderRadius.lg,
  },
  venueOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    borderBottomLeftRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
    justifyContent: 'flex-end',
  },
  venueContent: {
    padding: spacing.md,
  },
  venueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  venueName: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: 'white',
    flex: 1,
  },
  venueRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs / 2,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.full,
  },
  ratingText: {
    fontSize: typography.fontSizes.sm,
    color: 'white',
    fontWeight: typography.fontWeights.medium,
  },
  venueLocation: {
    fontSize: typography.fontSizes.sm,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: spacing.sm,
  },
  venueFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  venueCategory: {
    fontSize: typography.fontSizes.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  venueDistance: {
    fontSize: typography.fontSizes.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  
  // Deals
  dealsContainer: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  dealCard: {
    width: width * 0.7,
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
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.bold,
    color: purpleTheme.text,
    marginBottom: spacing.xs,
  },
  dealDescription: {
    fontSize: typography.fontSizes.sm,
    color: purpleTheme.textSecondary,
    marginBottom: spacing.md,
    lineHeight: typography.lineHeights.normal * typography.fontSizes.sm,
  },
  dealFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dealCategory: {
    fontSize: typography.fontSizes.xs,
    color: purpleTheme.primary,
    fontWeight: typography.fontWeights.medium,
  },
  dealExpiry: {
    fontSize: typography.fontSizes.xs,
    color: purpleTheme.textSecondary,
  },
  
  // Articles
  articlesContainer: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  articleCard: {
    width: width * 0.75,
  },
  articleImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
  },
  articleContent: {
    padding: spacing.md,
  },
  articleTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.bold,
    color: purpleTheme.text,
    marginBottom: spacing.sm,
    lineHeight: typography.lineHeights.tight * typography.fontSizes.md,
  },
  articleSummary: {
    fontSize: typography.fontSizes.sm,
    color: purpleTheme.textSecondary,
    marginBottom: spacing.md,
    lineHeight: typography.lineHeights.normal * typography.fontSizes.sm,
  },
  articleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  articleCategory: {
    fontSize: typography.fontSizes.xs,
    color: purpleTheme.primary,
    fontWeight: typography.fontWeights.medium,
  },
  articleReadTime: {
    fontSize: typography.fontSizes.xs,
    color: purpleTheme.textSecondary,
  },
  articleDate: {
    fontSize: typography.fontSizes.xs,
    color: purpleTheme.textSecondary,
  },
  
  // Bottom Padding
  bottomPadding: {
    height: spacing.xxl,
  },
});

export default EnhancedHomeScreen;
