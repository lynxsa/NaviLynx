/**
 * NaviLynx Charter Compliance: Modern Home Screen with Vibrant UI
 * Features: NativeWind styling, South African venues, glass morphism, fluid animations
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Platform,
  Text,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  withSequence,
} from 'react-native-reanimated';

// Modern UI Components
import {
  ModernCard,
  ModernText,
  ModernContainer,
  ModernBadge,
} from '@/components/ui/ModernComponents';
import { ResponsiveLayout, ResponsiveGrid, ResponsiveSpacer } from '@/components/ui/ResponsiveLayout';
import { IconSymbol } from '@/components/ui/IconSymbol';
import WeatherWidget from '@/components/WeatherWidget';

// Services
import { VenueDataService, Venue } from '@/services/venueDataService';

// Context
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { brand } from '@/constants/branding';

interface QuickActionData {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  route: string;
  gradient: [string, string];
}

interface FeaturedVenueCardProps {
  venue: Venue;
  onPress: () => void;
}

const FeaturedVenueCard: React.FC<FeaturedVenueCardProps> = ({ venue, onPress }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View style={animatedStyle} className="mr-4">
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
      >
        <ModernCard variant="glass" className="w-72 h-48 relative overflow-hidden">
          {/* Background gradient based on venue type */}
          <LinearGradient
            colors={
              venue.type === 'mall' 
                ? ['rgba(255, 107, 53, 0.8)', 'rgba(247, 147, 30, 0.8)'] 
                : venue.type === 'airport'
                ? ['rgba(0, 122, 255, 0.8)', 'rgba(52, 199, 89, 0.8)']
                : ['rgba(88, 86, 214, 0.8)', 'rgba(255, 45, 85, 0.8)']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="absolute inset-0"
          />
          
          <View className="p-4 h-full justify-between">
            {/* Header */}
            <View className="flex-row justify-between items-start">
              <ModernBadge 
                variant="sa-themed" 
                size="sm"
                className="capitalize"
              >
                {venue.type}
              </ModernBadge>
              
              <View className="flex-row items-center bg-white/20 rounded-full px-2 py-1">
                <IconSymbol name="star.fill" size={12} color="#FFD700" />
                <ModernText variant="caption" color="white" className="ml-1 font-semibold">
                  {venue.averageRating.toFixed(1)}
                </ModernText>
              </View>
            </View>

            {/* Content */}
            <View>
              <ModernText variant="h4" color="white" weight="bold" className="mb-1">
                {venue.name}
              </ModernText>
              
              <View className="flex-row items-center mb-2">
                <IconSymbol name="location.fill" size={14} color="rgba(255,255,255,0.8)" />
                <ModernText variant="caption" color="white" className="ml-1 opacity-80">
                  {`${venue.location.city}, ${venue.location.province}`}
                </ModernText>
              </View>

              {/* Features preview */}
              <View className="flex-row space-x-2">
                {venue.features.slice(0, 3).map((feature, index) => (
                  <View key={`${feature.id}-${index}`} className="bg-white/20 rounded-full px-2 py-1">
                    <IconSymbol name="star.fill" size={12} color="white" />
                  </View>
                ))}
                {venue.features.length > 3 && (
                  <View className="bg-white/20 rounded-full px-2 py-1">
                    <ModernText variant="caption" color="white" className="text-xs">
                      {`+${venue.features.length - 3}`}
                    </ModernText>
                  </View>
                )}
              </View>
            </View>
          </View>
        </ModernCard>
      </TouchableOpacity>
    </Animated.View>
  );
};

interface QuickActionCardProps {
  action: QuickActionData;
  onPress: () => void;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({ action, onPress }) => {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    rotation.value = withSequence(
      withTiming(-2, { duration: 100 }),
      withTiming(0, { duration: 100 })
    );
    setTimeout(onPress, 200);
  };

  return (
    <Animated.View style={animatedStyle} className="flex-1 mx-1">
      <TouchableOpacity onPress={handlePress}>
        <ModernCard variant="glass" className="h-28 justify-center items-center relative overflow-hidden">
          <LinearGradient
            colors={action.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="absolute inset-0 opacity-80"
          />
          
          <View className="items-center">
            <View className="bg-white/20 rounded-full p-3 mb-2">
              <IconSymbol name="star.fill" size={24} color="white" />
            </View>
            
            <ModernText variant="label" color="white" weight="semibold" className="text-center">
              {action.title}
            </ModernText>
            
            <ModernText variant="caption" color="white" className="text-center opacity-80">
              {action.subtitle}
            </ModernText>
          </View>
        </ModernCard>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function ModernHomeScreen() {
  const { colors, isDark } = useTheme();
  const { t } = useLanguage();
  
  // State
  const [featuredVenues, setFeaturedVenues] = useState<Venue[]>([]);
  const [nearbyVenues, setNearbyVenues] = useState<Venue[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  
  // Animations
  const headerOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(50);
  const actionScale = useSharedValue(0);

  const animateEntrance = useCallback(() => {
    headerOpacity.value = withTiming(1, { duration: 800 });
    cardTranslateY.value = withTiming(0, { duration: 600 });
    actionScale.value = withTiming(1, { duration: 500 });
  }, [headerOpacity, cardTranslateY, actionScale]);

  const loadData = useCallback(async () => {
    try {
      // Load featured venues (top rated)
      const topVenues = VenueDataService.getTopRatedVenues(5);
      setFeaturedVenues(topVenues);

      // Load nearby venues (mock location - Johannesburg CBD)
      const nearby = VenueDataService.getVenuesNearLocation(-26.2041, 28.0473, 15);
      setNearbyVenues(nearby.slice(0, 6));

    } catch (error) {
      console.error('Error loading home screen data:', error);
    }
  }, []);

  useEffect(() => {
    loadData();
    animateEntrance();
  }, [loadData, animateEntrance]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const quickActions: QuickActionData[] = [
    {
      id: 'ar-navigate',
      title: t('arNavigation') || 'AR Navigate',
      subtitle: t('findYourWay') || 'Find Your Way',
      icon: 'viewfinder',
      color: '#007AFF',
      route: '/ar-navigator',
      gradient: ['#007AFF', '#34C759'],
    },
    {
      id: 'explore',
      title: t('explore') || 'Explore',
      subtitle: t('discoverVenues') || 'Discover Venues',
      icon: 'map.fill',
      color: '#FF6B35',
      route: '/explore',
      gradient: ['#FF6B35', '#F7931E'],
    },
    {
      id: 'parking',
      title: t('parking') || 'Parking',
      subtitle: t('findParking') || 'Find Parking',
      icon: 'car.fill',
      color: '#34C759',
      route: '/parking',
      gradient: ['#34C759', '#30D158'],
    },
    {
      id: 'sa-features',
      title: 'SA Features',
      subtitle: 'Local Services',
      icon: 'flag.fill',
      color: '#FF9500',
      route: '/explore',
      gradient: ['#FF9500', '#FFD700'],
    },
  ];

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cardTranslateY.value }],
  }));

  const actionAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: actionScale.value }],
  }));

  const navigateToVenue = (venue: Venue) => {
    router.push('/explore');
  };

  const navigateToAction = (route: string) => {
    if (route === '/ar-navigator' || route === '/explore' || route === '/parking') {
      router.push(route as '/ar-navigator' | '/explore' | '/parking');
    }
  };

  return (
    <ResponsiveLayout variant="gradient" safeArea={true}>
      <RefreshControl
        refreshing={refreshing}
        onRefresh={handleRefresh}
        tintColor={colors.primary}
      />
      
      {/* Header Section */}
      <Animated.View style={headerAnimatedStyle}>
        <LinearGradient
          colors={isDark 
            ? ['rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 0.4)'] as const
            : ['rgba(255, 107, 53, 0.1)', 'rgba(247, 147, 30, 0.05)'] as const
          }
          className="pt-4 pb-8 px-4"
        >
          <View className="flex-row justify-between items-start mb-6">
            <View style={{ flex: 1 }}>
              <Text style={[{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }, { color: colors.text }]}>
                Hello! Welcome to NaviLynx
              </Text>
              
              <Text style={[{ fontSize: 16, marginBottom: 4, opacity: 0.8 }, { color: colors.text }]}>
                {t('welcomeBack') || 'Welcome back to NaviLynx'}
              </Text>
              
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <IconSymbol name="location.fill" size={14} color={colors.primary} />
                <Text style={[{ fontSize: 14, marginLeft: 4, opacity: 0.7 }, { color: colors.text }]}>
                  Johannesburg, South Africa
                </Text>
              </View>
            </View>

            <TouchableOpacity 
              onPress={() => router.push('/profile')}
              className="glass-card rounded-full p-3"
            >
              <IconSymbol name="person.fill" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Load Shedding Alert */}
          <ModernCard variant="glass" className="mb-4 border border-yellow-400/50">
            <View className="flex-row items-center">
              <IconSymbol name="bolt.fill" size={20} color="#FF9500" />
              <View className="ml-3 flex-1">
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#FF9500' }}>
                  Load Shedding Stage 2
                </Text>
                <Text style={{ fontSize: 12, opacity: 0.8, color: colors.text }}>
                  Next outage in your area: 16:00 - 18:00
                </Text>
              </View>
            </View>
          </ModernCard>
        </LinearGradient>
      </Animated.View>

      <ResponsiveSpacer size="md" />

      {/* Quick Actions */}
      <Animated.View style={actionAnimatedStyle} className="px-4 mb-6">
        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 16, color: colors.text }}>
          Quick Actions
        </Text>
        
        <ResponsiveGrid columns={2} gap="sm">
          {quickActions.map((action) => (
            <QuickActionCard
              key={action.id}
              action={action}
              onPress={() => navigateToAction(action.route)}
            />
          ))}
        </ResponsiveGrid>
      </Animated.View>

      {/* Weather Widget */}
      <WeatherWidget />

      <ResponsiveSpacer size="md" />

      {/* Featured Venues */}
      <Animated.View style={cardAnimatedStyle} className="mb-6">
        <View className="flex-row justify-between items-center px-4 mb-4">
          <Text style={{ fontSize: 20, fontWeight: '600', color: colors.text }}>
            Featured Venues
          </Text>
          
          <TouchableOpacity 
            onPress={() => router.push('/explore')}
            className="flex-row items-center"
          >
            <Text style={{ fontSize: 14, fontWeight: '600', color: colors.primary }}>
              View All
            </Text>
            <IconSymbol name="chevron.right" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {featuredVenues.map((venue) => (
            <FeaturedVenueCard
              key={venue.id}
              venue={venue}
              onPress={() => navigateToVenue(venue)}
            />
          ))}
        </ScrollView>
      </Animated.View>

      {/* Nearby Venues Grid */}
      <Animated.View style={cardAnimatedStyle} className="px-4 mb-8">
        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 16, color: colors.text }}>
          Nearby Venues
        </Text>
        
        <ResponsiveGrid columns={2} gap="md">
          {nearbyVenues.map((venue) => (
            <TouchableOpacity
              key={venue.id}
              onPress={() => navigateToVenue(venue)}
            >
              <ModernCard variant="standard" className="h-32">
                <View className="flex-1 justify-between">
                  <View>
                    <View className="flex-row justify-between items-start mb-2">
                      <ModernBadge variant="info" size="sm" className="capitalize">
                        {venue.type}
                      </ModernBadge>
                      
                      <View className="flex-row items-center">
                        <IconSymbol name="star.fill" size={12} color="#FFD700" />
                        <ModernText variant="caption" className="ml-1">
                          {venue.averageRating.toFixed(1)}
                        </ModernText>
                      </View>
                    </View>
                    
                    <ModernText variant="label" weight="semibold" className="mb-1">
                      {venue.name}
                    </ModernText>
                  </View>
                  
                  <View className="flex-row items-center">
                    <IconSymbol name="location.fill" size={12} color={colors.primary} />
                    <ModernText variant="caption" color="secondary" className="ml-1">
                      {venue.location.city}
                    </ModernText>
                  </View>
                </View>
              </ModernCard>
            </TouchableOpacity>
          ))}
        </ResponsiveGrid>
      </Animated.View>

      {/* South African Features Showcase */}
      <Animated.View style={cardAnimatedStyle} className="px-4 mb-8">
        <TouchableOpacity 
          onPress={() => router.push('/explore')}
          className="overflow-hidden rounded-xl"
        >
          <LinearGradient
            colors={[colors.secondary, colors.warning, colors.success] as const}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="p-6"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: brand.light }}>
                  South African Features
                </Text>
                
                <Text style={{ fontSize: 14, marginBottom: 16, color: brand.light, opacity: 0.9 }}>
                  Local payments, load shedding info, safety alerts, and township marketplace
                </Text>
                
                <View className="flex-row items-center">
                  <Text style={{ fontSize: 14, fontWeight: '600', color: brand.light }}>
                    Explore Local Services
                  </Text>
                  <IconSymbol name="arrow.right" size={16} color={brand.light} />
                </View>
              </View>
              
              <View className="ml-4">
                <IconSymbol name="flag.fill" size={48} color={brand.light + 'CC'} />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      <ResponsiveSpacer size="xl" />
    </ResponsiveLayout>
  );
}
