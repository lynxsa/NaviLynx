import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { brand } from '@/constants/branding';

// Modern UI Components
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import WeatherWidget from '@/components/WeatherWidget';
import SharedVenueCard from '@/components/SharedVenueCard';
import {
  GeminiAISearchBar,
  ARScannerFAB,
  SmartSuggestionsCarousel,
  IndoorNavigationCard,
  GeminiVisionStub,
  GeminiChatStub,
} from '@/components/ui/ModernComponents';

// Services
import { VenueDataService, Venue } from '@/services/venueDataService';

// Context
import { useThemeSafe } from '@/context/ThemeContext';
import { useLanguageSafe } from '@/context/LanguageContext';

const { width, height } = Dimensions.get('window');

interface QuickActionData {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  route: string;
  gradient: [string, string];
  image?: string;
}

interface BentoCardData {
  id: string;
  title: string;
  subtitle?: string;
  size: 'small' | 'medium' | 'large';
  type: 'feature' | 'venue' | 'service' | 'weather';
  gradient?: [string, string];
  backgroundColor?: string;
  image?: string;
  icon?: string;
  data?: any;
}

// Modernized Quick Action Card with improved design
const QuickActionCard: React.FC<{
  action: QuickActionData;
  onPress: () => void;
  index: number;
}> = ({ action, onPress, index }) => {
  const { colors } = useThemeSafe();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500 + index * 100 });
  }, [index, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePress = () => {
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
    });
    setTimeout(onPress, 100);
  };

  return (
    <Animated.View style={[animatedStyle, styles.quickActionCard]}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8} style={styles.quickActionTouch}>
        <LinearGradient
          colors={action.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.quickActionGradient}
        >
          {action.image && (
            <Image source={{ uri: action.image }} style={styles.quickActionImage} />
          )}
          
          <View style={styles.quickActionContent}>
            <View style={styles.quickActionIcon}>
              <IconSymbol name={action.icon as any} size={20} color={brand.light} />
            </View>
            
            <ThemedText style={styles.quickActionTitle}>
              {action.title}
            </ThemedText>
            
            <ThemedText style={styles.quickActionSubtitle}>
              {action.subtitle}
            </ThemedText>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Bento Grid Card Component
const BentoCard: React.FC<{
  card: BentoCardData;
  onPress?: () => void;
}> = ({ card, onPress }) => {
  const { colors } = useThemeSafe();
  const scale = useSharedValue(1);

  const handlePress = () => {
    if (onPress) {
      scale.value = withSpring(0.98, {}, () => {
        scale.value = withSpring(1);
      });
      setTimeout(onPress, 100);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const cardStyle = [
    styles.bentoCard,
    {
      backgroundColor: card.backgroundColor || colors.surface,
      borderColor: colors.border,
    },
    card.size === 'large' && styles.bentoCardLarge,
    card.size === 'medium' && styles.bentoCardMedium,
    card.size === 'small' && styles.bentoCardSmall,
  ];

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity 
        onPress={handlePress} 
        activeOpacity={0.9} 
        style={cardStyle}
        disabled={!onPress}
      >
        {card.gradient ? (
          <LinearGradient
            colors={card.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.bentoCardContent}
          >
            <BentoCardInner card={card} />
          </LinearGradient>
        ) : (
          <View style={styles.bentoCardContent}>
            <BentoCardInner card={card} />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const BentoCardInner: React.FC<{ card: BentoCardData }> = ({ card }) => {
  const { colors } = useThemeSafe();

  return (
    <>
      {card.image && (
        <Image source={{ uri: card.image }} style={styles.bentoCardImage} />
      )}
      
      <View style={styles.bentoCardTextContainer}>
        {card.icon && (
          <IconSymbol 
            name={card.icon as any} 
            size={card.size === 'large' ? 32 : 24} 
            color={card.gradient ? colors.light : colors.primary} 
          />
        )}
        
        <ThemedText 
          type={card.size === 'large' ? 'title' : 'defaultSemiBold'} 
          style={[
            styles.bentoCardTitle,
            { color: card.gradient ? colors.light : colors.text }
          ]}
        >
          {card.title}
        </ThemedText>
        
        {card.subtitle && (
          <ThemedText 
            style={[
              styles.bentoCardSubtitle,
              { color: card.gradient ? 'rgba(255,255,255,0.8)' : colors.textSecondary }
            ]}
          >
            {card.subtitle}
          </ThemedText>
        )}
      </View>
    </>
  );
};

export default function ImprovedHomeScreen() {
  const { colors, isDark } = useThemeSafe();
  const { t } = useLanguageSafe();
  
  // State
  const [featuredVenues, setFeaturedVenues] = useState<Venue[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Venue categories for buttons
  const venueTypes = Array.from(new Set(VenueDataService.getAllVenues().map(v => v.type)));
  const venueTypeMeta: Record<string, { label: string; icon: string; gradient: [string, string]; }> = {
    mall: { label: 'Mall', icon: 'bag.fill', gradient: [colors.primary, colors.success] },
    airport: { label: 'Airport', icon: 'airplane', gradient: [colors.accent, colors.primary] },
    hospital: { label: 'Hospital', icon: 'cross.fill', gradient: [colors.accent, colors.warning] },
    university: { label: 'University', icon: 'book.fill', gradient: [colors.warning, colors.success] },
    stadium: { label: 'Stadium', icon: 'sportscourt.fill', gradient: [colors.success, colors.success] },
    cultural: { label: 'Cultural', icon: 'paintpalette.fill', gradient: [colors.secondary, colors.warning] },
    government: { label: 'Government', icon: 'building.columns.fill', gradient: [colors.accent, colors.success] },
    transport: { label: 'Transport', icon: 'tram.fill', gradient: [colors.warning, colors.success] },
  };
  const fallbackMeta = { label: 'Other', icon: 'questionmark.circle', gradient: [colors.muted, colors.mutedForeground] };

  // Animations
  const headerOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(50);

  const loadData = useCallback(async () => {
    try {
      const topVenues = VenueDataService.getTopRatedVenues(6);
      setFeaturedVenues(topVenues);
    } catch (error) {
      console.error('Error loading home screen data:', error);
    }
  }, []);

  useEffect(() => {
    loadData();
    // Animate entrance
    headerOpacity.value = withTiming(1, { duration: 800 });
    contentTranslateY.value = withTiming(0, { duration: 600 });
  }, [loadData, headerOpacity, contentTranslateY]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Render venue category buttons (4 per row)
  const renderVenueCategoryButtons = () => {
    const rows = [];
    for (let i = 0; i < venueTypes.length; i += 4) {
      const row = venueTypes.slice(i, i + 4);
      rows.push(
        <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
          {row.map(type => {
            const meta = venueTypeMeta[type] || fallbackMeta;
            return (
              <QuickActionCard
                key={type}
                action={{
                  id: type,
                  title: meta.label,
                  subtitle: '',
                  icon: meta.icon,
                  color: colors.primary,
                  route: `/explore?type=${type}`,
                  gradient: meta.gradient,
                }}
                onPress={() => router.push(`/explore?type=${type}`)}
                index={i}
              />
            );
          })}
          {/* Fill empty slots if less than 4 in last row */}
          {row.length < 4 && Array.from({ length: 4 - row.length }).map((_, idx) => (
            <View key={`empty-${idx}`} style={{ flex: 1, marginHorizontal: 8 }} />
          ))}
        </View>
      );
    }
    return rows;
  };

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const navigateToAction = (route: string) => {
    if (route === '/ar-navigator' || route === '/explore' || route === '/parking') {
      router.push(route as '/ar-navigator' | '/explore' | '/parking');
    }
  };

  const navigateToVenue = (venue: Venue) => {
    router.push('/explore');
  };

  // Smart suggestions (stub)
  const smartSuggestions = [
    'You are near Sandton City – here’s a coupon!',
    'Find vegan food on level 2',
    'Check out the new sneakers at Sportscene',
    'Nearest exit is 50m ahead',
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5' }]}> 
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header Section */}
        <Animated.View style={headerAnimatedStyle}>
          <LinearGradient
            colors={isDark 
              ? ['rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 0.4)'] 
              : ['rgba(255, 107, 53, 0.1)', 'rgba(247, 147, 30, 0.05)']
            }
            style={styles.headerGradient}
          >
            <View style={styles.headerContent}>
              <View style={styles.flex1}>
                <Text style={[styles.welcomeTitle, { color: colors.text }]}>Welcome to NaviLynx</Text>
                <Text style={[styles.subtitle, { color: colors.text }]}>Your indoor navigation companion</Text>
                <View style={styles.locationRow}>
                  <IconSymbol name="location.fill" size={14} color={colors.primary} />
                  <Text style={[styles.locationSubText, { color: colors.text }]}>Johannesburg, South Africa</Text>
                </View>
              </View>
              <TouchableOpacity 
                onPress={() => router.push('/profile')}
                style={[styles.profileButton, { backgroundColor: colors.surface + '80' }]}
              >
                <IconSymbol name="person.fill" size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>
            {/* Load Shedding Alert */}
            <ThemedView style={[styles.loadSheddingCard, { backgroundColor: colors.surface, borderColor: '#FF9500' + '30' }]}> 
              <View style={styles.loadSheddingContent}>
                <IconSymbol name="bolt.fill" size={20} color="#FF9500" />
                <View style={styles.loadSheddingInfo}>
                  <Text style={[styles.loadSheddingStatus, { color: '#FF9500' }]}>Load Shedding Stage 2</Text>
                  <Text style={[styles.loadSheddingTime, { color: colors.text }]}>Next outage: 16:00 - 18:00</Text>
                </View>
              </View>
            </ThemedView>
          </LinearGradient>
        </Animated.View>

        <Animated.View style={[contentAnimatedStyle, styles.contentContainer]}>
          {/* Gemini AI Search Bar */}
          <GeminiAISearchBar onSearch={(query) => {/* TODO: Integrate Gemini search */}} />
          {/* Smart Suggestions Carousel */}
          <SmartSuggestionsCarousel suggestions={smartSuggestions} />
          {/* Indoor Navigation Card */}
          <IndoorNavigationCard onPress={() => router.push('/ar-navigator')} />
          {/* AR Scanner Floating Button (mobile only, but visible for demo) */}
          <ARScannerFAB onPress={() => router.push('/ar-navigator')} />
          {/* Gemini Vision and Chat Stubs */}
          <GeminiVisionStub />
          <GeminiChatStub />

          {/* Venue Categories Grid */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.quickActionsTitle, { color: colors.text }]}>Venue Categories</Text>
            {renderVenueCategoryButtons()}
          </View>

          {/* Weather Widget */}
          <WeatherWidget />

          {/* Featured Venues */}
          <View style={styles.sectionContainer}>
            <View style={styles.venuesHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Venues</Text>
              <TouchableOpacity 
                onPress={() => router.push('/explore')}
                style={styles.viewAllContainer}
              >
                <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
                <IconSymbol name="chevron.right" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {featuredVenues.map((venue) => (
              <SharedVenueCard
                key={venue.id}
                venue={venue}
                onPress={() => navigateToVenue(venue)}
                variant="standard"
              />
            ))}
          </View>

          {/* South African Features Showcase */}
          <View style={styles.saFeaturesContainer}>
            <TouchableOpacity 
              onPress={() => router.push('/explore')}
              style={styles.saFeaturesCard}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#FF6B35', '#F7931E', '#FFD700']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.saFeaturesGradient}
              >
                <View style={styles.saFeaturesContent}>
                  <View style={styles.flex1}>
                    <Text style={[styles.saFeaturesTitle, { color: 'white' }]}>South African Features</Text>
                    <Text style={[styles.saFeaturesSubtitle, { color: 'white' }]}>Local payments, load shedding info, and safety alerts</Text>
                    <View style={styles.viewAllContainer}>
                      <Text style={[styles.saFeaturesButtonText, { color: 'white' }]}>Explore Local Services</Text>
                      <IconSymbol name="arrow.right" size={16} color="white" />
                    </View>
                  </View>
                  <View style={styles.saFeaturesIcon}>
                    <IconSymbol name="flag.fill" size={48} color="rgba(255,255,255,0.8)" />
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Bottom spacing for tab bar */}
          <View style={{ height: 80 }} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  headerGradient: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  profileButton: {
    borderRadius: 20,
    padding: 12,
  },
  loadSheddingCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  loadSheddingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  locationCard: {
    marginHorizontal: 24,
    marginBottom: 20,
    padding: 16,
    borderRadius: 16,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loadSheddingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  loadSheddingSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 24,
    marginBottom: 16,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  quickActionCard: {
    flex: 1,
    marginHorizontal: 8,
  },
  quickActionTouch: {
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
  },
  quickActionGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  quickActionIcon: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 8,
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
  },
  venuesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  venuesList: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  saFeaturesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  saFeaturesSubtitle: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 16,
  },
  saFeaturesButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  saFeaturesButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  // Additional styles for header section
  flex1: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
    opacity: 0.8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationSubText: {
    fontSize: 14,
    marginLeft: 4,
    opacity: 0.7,
  },
  loadSheddingInfo: {
    marginLeft: 12,
    flex: 1,
  },
  loadSheddingStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  loadSheddingTime: {
    fontSize: 12,
    opacity: 0.8,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  quickActionsTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  viewAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saFeaturesContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  // Venue Card Styles
  venueCardContainer: {
    marginBottom: 16,
  },
  venueCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  venueCardContent: {
    padding: 16,
  },
  venueCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  venueCardInfo: {
    flex: 1,
  },
  venueCardTitle: {
    marginBottom: 8,
  },
  venueLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  venueLocationText: {
    marginLeft: 4,
    fontSize: 14,
  },
  venueTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  venueTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  venueTypeText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  venueRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  venueRatingText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  // Content container styles
  contentContainer: {
    paddingHorizontal: 16,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  saFeaturesContainer: {
    marginBottom: 32,
  },
  saFeaturesGradient: {
    padding: 24,
  },
  saFeaturesIcon: {
    marginLeft: 16,
  },
  // Quick Action Image and Content Styles
  quickActionImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.3,
    borderRadius: 16,
  },
  quickActionContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  // Bento Grid Styles
  bentoCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    margin: 6,
  },
  bentoCardLarge: {
    height: 200,
    width: width - 32,
  },
  bentoCardMedium: {
    height: 140,
    width: (width - 48) / 2,
  },
  bentoCardSmall: {
    height: 100,
    width: (width - 60) / 3,
  },
  bentoCardContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  bentoCardImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.2,
  },
  bentoCardTextContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bentoCardTitle: {
    marginTop: 8,
    marginBottom: 4,
  },
  bentoCardSubtitle: {
    fontSize: 12,
    opacity: 0.8,
  },
  // Quick Actions Horizontal Scroll
  quickActionsScrollContainer: {
    paddingHorizontal: 16,
  },
  quickActionsScrollView: {
    paddingVertical: 8,
  },
  // Bento Grid Container
  bentoGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  // SA Features Card
  saFeaturesCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 32,
  },
});
