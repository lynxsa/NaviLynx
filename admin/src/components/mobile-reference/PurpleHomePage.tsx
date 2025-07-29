/**
 * 🏠 Purple-Themed Home Page - Mobile App Component
 * 
 * This is your reference home page with PURE purple theme - NO orange or blue gradients.
 * World-class design matching your purple color requirements throughout NaviLynx.
 * 
 * Features:
 * - Complete purple color scheme (#9333EA primary)
 * - Modern gradient cards with purple variants
 * - Quick action buttons with purple accents
 * - Location-based features with purple highlights
 * - Featured deals and venues with purple theming
 * - Seamless navigation to Store Card Wallet, Navigenie, Shopping Assistant
 * 
 * @author Lead Mobile App Architect
 * @version 4.0.0 - Purple Theme Revolution
 */

import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  SafeAreaView,
  StatusBar,
  FlatList,
  RefreshControl,
  Animated,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import * as Haptics from 'expo-haptics'
import * as Location from 'expo-location'

const { width, height } = Dimensions.get('window')

// Purple Theme System - NO ORANGE OR BLUE
const PURPLE_THEME = {
  primary: '#9333EA',         // Purple-600 (main brand)
  primaryLight: '#A855F7',    // Purple-500
  primaryDark: '#7C3AED',     // Purple-700
  accent: '#C084FC',          // Purple-400
  violet: '#8B5CF6',          // Violet-500
  indigo: '#6366F1',          // Indigo-500
  fuchsia: '#D946EF',         // Fuchsia-500
  surface: '#FFFFFF',
  background: '#FAFAFA',
  backgroundPurple: '#FAF5FF', // Purple-50
  text: '#1F2937',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444'
}

// Mock Icon Component
const IconSymbol: React.FC<{ name: string; size: number; color: string }> = ({ name, size, color }) => (
  <View style={{
    width: size,
    height: size,
    backgroundColor: color + '20',
    borderRadius: size / 2,
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <Text style={{ fontSize: size * 0.4, color, fontWeight: 'bold' }}>
      {name.charAt(0).toUpperCase()}
    </Text>
  </View>
)

interface QuickAction {
  id: string
  title: string
  subtitle: string
  icon: string
  gradient: string[]
  onPress: () => void
}

interface FeaturedDeal {
  id: string
  title: string
  description: string
  discount: string
  store: string
  image: string
  validUntil: string
  category: string
}

interface NearbyVenue {
  id: string
  name: string
  category: string
  distance: string
  rating: number
  image: string
  deals: number
}

interface PurpleHomePageProps {
  onNavigateToStoreCards: () => void
  onNavigateToNavigenie: () => void
  onNavigateToShoppingAssistant: () => void
  onNavigateToVenue: (venueId: string) => void
  onNavigateToDeals: () => void
}

export default function PurpleHomePage({
  onNavigateToStoreCards,
  onNavigateToNavigenie,
  onNavigateToShoppingAssistant,
  onNavigateToVenue,
  onNavigateToDeals
}: PurpleHomePageProps) {
  const [userLocation, setUserLocation] = useState<string>('Sandton City Mall')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [quickActions, setQuickActions] = useState<QuickAction[]>([])
  const [featuredDeals, setFeaturedDeals] = useState<FeaturedDeal[]>([])
  const [nearbyVenues, setNearbyVenues] = useState<NearbyVenue[]>([])

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current

  useEffect(() => {
    initializeData()
    startAnimations()
    getUserLocation()
  }, [])

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      })
    ]).start()
  }

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({})
        // Mock reverse geocoding
        setUserLocation('Sandton City Mall')
      }
    } catch (error) {
      console.error('Location error:', error)
    }
  }

  const initializeData = () => {
    // Purple-themed Quick Actions - NO ORANGE OR BLUE
    const actions: QuickAction[] = [
      {
        id: '1',
        title: 'Store Cards',
        subtitle: 'Digital wallet',
        icon: 'wallet',
        gradient: [PURPLE_THEME.primary, PURPLE_THEME.primaryDark],
        onPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
          onNavigateToStoreCards()
        }
      },
      {
        id: '2',
        title: 'Navigenie AI',
        subtitle: 'Smart assistant',
        icon: 'robot',
        gradient: [PURPLE_THEME.violet, PURPLE_THEME.indigo],
        onPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
          onNavigateToNavigenie()
        }
      },
      {
        id: '3',
        title: 'Shopping',
        subtitle: 'AI scanning',
        icon: 'shopping',
        gradient: [PURPLE_THEME.fuchsia, PURPLE_THEME.primary],
        onPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
          onNavigateToShoppingAssistant()
        }
      },
      {
        id: '4',
        title: 'AR Navigator',
        subtitle: 'Find your way',
        icon: 'compass',
        gradient: [PURPLE_THEME.accent, PURPLE_THEME.violet],
        onPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
          // Navigate to AR
        }
      }
    ]

    const deals: FeaturedDeal[] = [
      {
        id: '1',
        title: '50% Off Electronics',
        description: 'Smartphones, laptops & more',
        discount: '50%',
        store: 'Pick n Pay',
        image: '/api/placeholder/300/160',
        validUntil: '2024-12-31',
        category: 'Electronics'
      },
      {
        id: '2',
        title: 'Buy 2 Get 1 Free',
        description: 'Fashion & accessories',
        discount: 'BOGO',
        store: 'Woolworths',
        image: '/api/placeholder/300/160',
        validUntil: '2024-12-25',
        category: 'Fashion'
      },
      {
        id: '3',
        title: '30% Off Groceries',
        description: 'Fresh produce & essentials',
        discount: '30%',
        store: 'Checkers',
        image: '/api/placeholder/300/160',
        validUntil: '2024-12-20',
        category: 'Groceries'
      }
    ]

    const venues: NearbyVenue[] = [
      {
        id: '1',
        name: 'Sandton City Mall',
        category: 'Shopping Mall',
        distance: '0.2 km',
        rating: 4.8,
        image: '/api/placeholder/200/120',
        deals: 45
      },
      {
        id: '2',
        name: 'Nelson Mandela Square',
        category: 'Shopping Center',
        distance: '0.5 km',
        rating: 4.6,
        image: '/api/placeholder/200/120',
        deals: 32
      },
      {
        id: '3',
        name: 'Eastgate Shopping Centre',
        category: 'Shopping Mall',
        distance: '3.2 km',
        rating: 4.5,
        image: '/api/placeholder/200/120',
        deals: 28
      }
    ]

    setQuickActions(actions)
    setFeaturedDeals(deals)
    setNearbyVenues(venues)
  }

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    
    // Simulate data refresh
    setTimeout(() => {
      initializeData()
      setIsRefreshing(false)
    }, 1000)
  }, [])

  function renderHeader() {
    return (
      <View style={[styles.header, { backgroundColor: PURPLE_THEME.surface }]}>
        <StatusBar barStyle="dark-content" backgroundColor={PURPLE_THEME.surface} />
        <SafeAreaView>
          <Animated.View 
            style={[
              styles.headerContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.headerTop}>
              <View style={styles.locationContainer}>
                <IconSymbol name="location" size={16} color={PURPLE_THEME.primary} />
                <Text style={[styles.locationText, { color: PURPLE_THEME.textSecondary }]}>
                  {userLocation}
                </Text>
              </View>
              
              <TouchableOpacity 
                style={[styles.profileButton, { backgroundColor: PURPLE_THEME.backgroundPurple }]}
              >
                <IconSymbol name="user" size={20} color={PURPLE_THEME.primary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.welcomeSection}>
              <Text style={[styles.welcomeText, { color: PURPLE_THEME.textSecondary }]}>
                Welcome back!
              </Text>
              <Text style={[styles.userName, { color: PURPLE_THEME.text }]}>
                John Doe
              </Text>
            </View>
          </Animated.View>
        </SafeAreaView>
      </View>
    )
  }

  function renderQuickActions() {
    return (
      <Animated.View 
        style={[
          styles.quickActionsSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Text style={[styles.sectionTitle, { color: PURPLE_THEME.text }]}>
          Quick Actions
        </Text>
        
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <Animated.View
              key={action.id}
              style={[
                styles.quickActionItem,
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: slideAnim.interpolate({
                        inputRange: [0, 50],
                        outputRange: [0, 50 + (index * 10)]
                      })
                    }
                  ]
                }
              ]}
            >
              <TouchableOpacity
                style={styles.quickActionTouchable}
                onPress={action.onPress}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={action.gradient}
                  style={styles.quickActionGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <IconSymbol name={action.icon} size={24} color="#FFFFFF" />
                  <Text style={styles.quickActionTitle}>{action.title}</Text>
                  <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </Animated.View>
    )
  }

  function renderFeaturedDeals() {
    const renderDeal = ({ item, index }: { item: FeaturedDeal; index: number }) => (
      <Animated.View
        style={[
          styles.dealCard,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateX: slideAnim.interpolate({
                  inputRange: [0, 50],
                  outputRange: [0, 100 + (index * 20)]
                })
              }
            ]
          }
        ]}
      >
        <TouchableOpacity
          style={styles.dealTouchable}
          onPress={() => onNavigateToDeals()}
          activeOpacity={0.95}
        >
          <View style={[styles.dealImageContainer, { backgroundColor: PURPLE_THEME.backgroundPurple }]}>
            <View style={[styles.discountBadge, { backgroundColor: PURPLE_THEME.primary }]}>
              <Text style={styles.discountText}>{item.discount}</Text>
            </View>
          </View>
          
          <View style={styles.dealContent}>
            <Text style={[styles.dealTitle, { color: PURPLE_THEME.text }]}>
              {item.title}
            </Text>
            <Text style={[styles.dealDescription, { color: PURPLE_THEME.textSecondary }]}>
              {item.description}
            </Text>
            <View style={styles.dealFooter}>
              <Text style={[styles.dealStore, { color: PURPLE_THEME.primary }]}>
                {item.store}
              </Text>
              <Text style={[styles.dealExpiry, { color: PURPLE_THEME.textSecondary }]}>
                Valid until {new Date(item.validUntil).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    )

    return (
      <Animated.View 
        style={[
          styles.dealsSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: PURPLE_THEME.text }]}>
            Featured Deals
          </Text>
          <TouchableOpacity onPress={onNavigateToDeals}>
            <Text style={[styles.seeAllText, { color: PURPLE_THEME.primary }]}>
              See All
            </Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={featuredDeals}
          renderItem={renderDeal}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dealsList}
        />
      </Animated.View>
    )
  }

  function renderNearbyVenues() {
    const renderVenue = ({ item, index }: { item: NearbyVenue; index: number }) => (
      <Animated.View
        style={[
          styles.venueCard,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 50],
                  outputRange: [0, 30 + (index * 15)]
                })
              }
            ]
          }
        ]}
      >
        <TouchableOpacity
          style={styles.venueTouchable}
          onPress={() => onNavigateToVenue(item.id)}
          activeOpacity={0.95}
        >
          <View style={[styles.venueImageContainer, { backgroundColor: PURPLE_THEME.backgroundPurple }]}>
            <View style={[styles.dealsCountBadge, { backgroundColor: PURPLE_THEME.primary }]}>
              <Text style={styles.dealsCountText}>{item.deals}</Text>
            </View>
          </View>
          
          <View style={styles.venueInfo}>
            <Text style={[styles.venueName, { color: PURPLE_THEME.text }]}>
              {item.name}
            </Text>
            <Text style={[styles.venueCategory, { color: PURPLE_THEME.textSecondary }]}>
              {item.category}
            </Text>
            <View style={styles.venueDetails}>
              <View style={styles.ratingContainer}>
                <IconSymbol name="star" size={12} color={PURPLE_THEME.warning} />
                <Text style={[styles.ratingText, { color: PURPLE_THEME.textSecondary }]}>
                  {item.rating}
                </Text>
              </View>
              <Text style={[styles.distanceText, { color: PURPLE_THEME.textSecondary }]}>
                {item.distance}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    )

    return (
      <Animated.View 
        style={[
          styles.venuesSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: PURPLE_THEME.text }]}>
            Nearby Venues
          </Text>
          <TouchableOpacity>
            <Text style={[styles.seeAllText, { color: PURPLE_THEME.primary }]}>
              View Map
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.venuesList}>
          {nearbyVenues.map((venue, index) => (
            <View key={venue.id}>
              {renderVenue({ item: venue, index })}
            </View>
          ))}
        </View>
      </Animated.View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: PURPLE_THEME.background }]}>
      {renderHeader()}
      
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={PURPLE_THEME.primary}
            colors={[PURPLE_THEME.primary]}
          />
        }
      >
        {renderQuickActions()}
        {renderFeaturedDeals()}
        {renderNearbyVenues()}
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '500',
  },
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeSection: {
    gap: 4,
  },
  welcomeText: {
    fontSize: 15,
    fontWeight: '500',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  
  // Quick Actions
  quickActionsSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  quickActionItem: {
    width: (width - 60) / 2,
  },
  quickActionTouchable: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  quickActionGradient: {
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 8,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  quickActionSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    fontWeight: '500',
  },
  
  // Deals Section
  dealsSection: {
    paddingVertical: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 15,
    fontWeight: '600',
  },
  dealsList: {
    paddingLeft: 20,
    paddingRight: 8,
  },
  dealCard: {
    width: 280,
    marginRight: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  dealTouchable: {
    flex: 1,
  },
  dealImageContainer: {
    height: 140,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  discountText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dealContent: {
    padding: 20,
  },
  dealTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  dealDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  dealFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dealStore: {
    fontSize: 14,
    fontWeight: '600',
  },
  dealExpiry: {
    fontSize: 12,
    fontWeight: '500',
  },
  
  // Venues Section
  venuesSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  venuesList: {
    gap: 16,
  },
  venueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  venueTouchable: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  venueImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  dealsCountBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dealsCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  venueInfo: {
    flex: 1,
    gap: 4,
  },
  venueName: {
    fontSize: 16,
    fontWeight: '700',
  },
  venueCategory: {
    fontSize: 14,
    fontWeight: '500',
  },
  venueDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
  },
  distanceText: {
    fontSize: 13,
    fontWeight: '500',
  },
})
