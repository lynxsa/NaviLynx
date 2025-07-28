import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StatusBar,
  Text,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { router } from 'expo-router';

// Theme and styling
import { useTheme } from '@/context/ThemeContext';
import { styles as modernStyles, colors, spacing, borderRadius, shadows } from '@/styles/modernTheme';

// Enhanced components
import AdvertisingBanner from '@/components/AdvertisingBanner';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { UnifiedCategoryCard } from '@/components/categories/UnifiedCategoryCard';
import { EnhancedVenueCard } from '@/components/venues/EnhancedVenueCard';
import { EnhancedNavigateButton } from '@/components/ui/EnhancedNavigateButton';
import { ModernCard } from '@/components/ui/ModernCard';
import { ModernStoreCard } from '@/components/ui/ModernStoreCard';

// Data imports
import { 
  advertisements
} from '@/data/southAfricanVenues';
import { venueCategories } from '@/data/enhancedVenues';
import { enhancedVenuesData, enhancedDealsData } from '@/data/enhancedVenuesData';

const { width } = Dimensions.get('window');

// Articles data
const articlesData = [
  { 
    id: 1,
    title: 'Best Mall Navigation Tips', 
    excerpt: 'Master indoor navigation with these expert tips',
    category: 'Navigation',
    readTime: '3 min read',
    image: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=300'
  },
  { 
    id: 2,
    title: 'Shopping Deals in SA', 
    excerpt: 'Find the best deals across South African malls',
    category: 'Shopping',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300'
  },
  { 
    id: 3,
    title: 'AR Navigation Guide', 
    excerpt: 'How to use augmented reality for better navigation',
    category: 'Technology',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=300'
  }
];

// Store cards data
const storeCardsData = [
  { 
    name: 'Edgars Club', 
    color: '#E53E3E', 
    discount: '25% OFF',
    memberNumber: '4567',
    points: 1250,
    tier: 'Gold' as const
  },
  { 
    name: 'Woolworths', 
    color: '#38A169', 
    discount: '15% OFF',
    memberNumber: '8901',
    points: 890,
    tier: 'Silver' as const
  },
  { 
    name: 'Pick n Pay Smart', 
    color: '#3182CE', 
    discount: '20% OFF',
    memberNumber: '2345',
    points: 2100,
    tier: 'Platinum' as const
  },
  { 
    name: 'Checkers Xtra', 
    color: '#D69E2E', 
    discount: '10% OFF',
    memberNumber: '6789',
    points: 450,
    tier: 'Bronze' as const
  }
];

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [greeting, setGreeting] = useState('Good Morning');
  const { isDark, toggleTheme } = useTheme();

  // Update greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <View style={[modernStyles.container, { backgroundColor: isDark ? modernStyles.containerDark.backgroundColor : modernStyles.container.backgroundColor }]}>
      <StatusBar 
        barStyle={isDark ? "light-content" : "dark-content"} 
        backgroundColor="transparent"
        translucent
      />
      
      {/* Header with Logo and Icons */}
      <View style={{ 
        paddingHorizontal: spacing.lg, 
        paddingTop: spacing.xl + 8, 
        paddingBottom: spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
        borderBottomWidth: 1,
        borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
      }}>
        {/* Logo with NaviLynx Text */}
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <Image 
            source={
              isDark 
                ? require('@/assets/images/logo-w.png')
                : require('@/assets/images/logo-p.png')
            }
            style={{
              width: 28,
              height: 28,
              resizeMode: 'contain',
              marginRight: spacing.sm,
            }}
          />
          <Text style={{
            fontSize: 18,
            fontWeight: '700',
            color: isDark ? '#FFFFFF' : colors.text,
            letterSpacing: 0.5,
          }}>
            NaviLynx
          </Text>
        </View>
        
        {/* Elegant Header Icons */}
        <View style={[modernStyles.row, { gap: spacing.xs }]}>
          {/* Theme Toggle Icon */}
          <TouchableOpacity 
            style={[
              {
                backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                borderRadius: borderRadius.xl,
                padding: spacing.sm + 2,
                borderWidth: 1,
                borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
                ...shadows.sm,
              }
            ]}
            onPress={() => {
              toggleTheme();
            }}
            activeOpacity={0.7}
          >
            <ThemeToggle size={14} minimal={true} />
          </TouchableOpacity>
          
          {/* Search Icon */}
          <TouchableOpacity 
            style={[
              {
                backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                borderRadius: borderRadius.xl,
                padding: spacing.sm + 2,
                borderWidth: 1,
                borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
                ...shadows.sm,
              }
            ]}
            onPress={() => {
              router.push('/explore');
            }}
            activeOpacity={0.7}
          >
            <IconSymbol name="magnifyingglass" size={18} color={colors.primary} />
          </TouchableOpacity>
          
          {/* Chat Icon */}
          <TouchableOpacity 
            style={[
              {
                backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                borderRadius: borderRadius.xl,
                padding: spacing.sm + 2,
                borderWidth: 1,
                borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
                ...shadows.sm,
              }
            ]}
            onPress={() => {
              router.push('/chat/assistant');
            }}
            activeOpacity={0.7}
          >
            <IconSymbol name="message.circle" size={18} color={colors.primary} />
          </TouchableOpacity>

          {/* Profile Icon */}
          <TouchableOpacity 
            style={[
              {
                backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                borderRadius: borderRadius.xl,
                padding: spacing.sm + 2,
                borderWidth: 1,
                borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
                ...shadows.sm,
              }
            ]}
            onPress={() => {
              router.push('/profile');
            }}
            activeOpacity={0.7}
          >
            <IconSymbol name="person" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        style={{ flex: 1 }}
      >
        {/* Greeting Message */}
        <View style={{ paddingHorizontal: spacing.md, marginBottom: spacing.md }}>
          <Text style={[
            isDark ? modernStyles.h1Dark : modernStyles.h1, 
            { 
              fontSize: 16, 
              fontWeight: '600',
              letterSpacing: 0.2,
              marginBottom: 1
            }
          ]}>
            {greeting}, Derah
          </Text>
          <Text style={[
            isDark ? modernStyles.bodyDark : modernStyles.body, 
            { 
              fontSize: 11, 
              opacity: 0.6,
              fontWeight: '400',
              letterSpacing: 0.1
            }
          ]}>
            Welcome to NaviLynx Indoor Navigation Hub
          </Text>
        </View>

        {/* Enhanced Banner with Real Images */}
        <View style={{ paddingHorizontal: spacing.md, marginBottom: spacing.lg }}>
          <AdvertisingBanner />
        </View>

        {/* Enhanced Navigate Button - Smaller & More Rounded */}
        <View style={{ paddingHorizontal: spacing.md, marginBottom: spacing.lg }}>
          <EnhancedNavigateButton 
            onPress={() => router.push('/ar-navigation-landing')}
            title="Navigate!"
            subtitle="Start your journey"
            size="medium"
            animateIcon={true}
          />
        </View>

        {/* Enhanced Categories */}
        <View style={{ marginBottom: spacing.lg }}>
          <View style={{ paddingHorizontal: spacing.md, marginBottom: spacing.md }}>
            <View style={[modernStyles.row, modernStyles.spaceBetween, modernStyles.alignCenter]}>
              <View>
                <Text style={[
                  isDark ? modernStyles.h3Dark : modernStyles.h3,
                  { fontSize: 16, fontWeight: '600' }
                ]}>Browse Categories</Text>
                <Text style={[
                  isDark ? modernStyles.bodyDark : modernStyles.body,
                  { fontSize: 11, opacity: 0.7, marginTop: 1 }
                ]}>Find venues by type</Text>
              </View>
              <TouchableOpacity 
                onPress={() => router.push('/explore')}
                style={[
                  isDark ? modernStyles.buttonSecondaryDark : modernStyles.buttonSecondary,
                  { paddingVertical: spacing.xs, paddingHorizontal: spacing.sm }
                ]}
              >
                <Text style={[{ fontWeight: '500', fontSize: 11 }, { color: isDark ? '#FFFFFF' : colors.text }]}>View All</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Category Cards Grid */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: spacing.md, gap: spacing.md }}
          >
            {venueCategories.slice(0, 6).map((category) => (
              <UnifiedCategoryCard
                key={category.id}
                category={category}
                width={(width - spacing.lg * 3) / 2}
                onPress={() => router.push('/explore')}
              />
            ))}
          </ScrollView>
        </View>

        {/* Enhanced Featured Venues */}
        <View style={{ marginBottom: spacing.lg }}>
          <View style={{ paddingHorizontal: spacing.md, marginBottom: spacing.sm }}>
            <View style={[modernStyles.row, modernStyles.spaceBetween, modernStyles.alignCenter, { marginBottom: spacing.xs }]}>
              <View>
                <Text style={[
                  isDark ? modernStyles.h3Dark : modernStyles.h3,
                  { fontSize: 18, fontWeight: '700' }
                ]}>Featured Venues</Text>
                <Text style={[
                  isDark ? modernStyles.bodyDark : modernStyles.body,
                  { fontSize: 13, opacity: 0.8, marginTop: 2 }
                ]}>Premium destinations across South Africa</Text>
              </View>
              <TouchableOpacity 
                onPress={() => router.push('/explore')}
                style={[
                  isDark ? modernStyles.buttonSecondaryDark : modernStyles.buttonSecondary,
                  { paddingVertical: spacing.xs, paddingHorizontal: spacing.sm }
                ]}
              >
                <Text style={[{ fontWeight: '600', fontSize: 11 }, { color: isDark ? '#FFFFFF' : colors.text }]}>View All</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: spacing.md }}
          >
            {enhancedVenuesData.slice(0, 8).map((venue) => (
              <EnhancedVenueCard
                key={venue.id}
                venue={venue}
                size="medium"
                showFeatures={true}
                onPress={(venueId) => router.push(`/venue/${venueId}`)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Enhanced Deals Section */}
        <View style={{ marginBottom: spacing.lg }}>
          <View style={{ paddingHorizontal: spacing.md, marginBottom: spacing.sm }}>
            <View style={[modernStyles.row, modernStyles.spaceBetween, modernStyles.alignCenter, { marginBottom: spacing.xs }]}>
              <View style={[modernStyles.row, modernStyles.alignCenter, { gap: spacing.xs, flex: 1 }]}>
                <IconSymbol name="tag.fill" size={18} color={colors.primary} />
                <Text style={[
                  isDark ? modernStyles.h3Dark : modernStyles.h3,
                  { fontSize: 18, fontWeight: '700' }
                ]}>Hot Deals</Text>
                <View style={{
                  backgroundColor: colors.error,
                  borderRadius: borderRadius.full,
                  paddingHorizontal: spacing.xs,
                  paddingVertical: 2,
                }}>
                  <Text style={{ color: '#FFFFFF', fontSize: 9, fontWeight: '700' }}>LIMITED</Text>
                </View>
              </View>
              <TouchableOpacity
                style={isDark ? modernStyles.buttonSecondaryDark : modernStyles.buttonSecondary}
                onPress={() => router.push('/(tabs)/explore')}
              >
                <Text style={[{ fontWeight: '600', fontSize: 11 }, { color: isDark ? '#FFFFFF' : colors.text }]}>View All</Text>
              </TouchableOpacity>
            </View>
            <Text style={[
              isDark ? modernStyles.bodyDark : modernStyles.body,
              { 
                fontSize: 13, 
                opacity: 0.8, 
                fontWeight: '500',
                lineHeight: 16,
                letterSpacing: 0.1
              }
            ]}>Exclusive savings at premium venues</Text>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: spacing.md }}
          >
            {enhancedDealsData.slice(0, 6).map((deal) => (
              <ModernCard
                key={deal.id}
                onPress={() => router.push(`/deal-details/${deal.id}` as any)}
                style={{ width: 240, marginRight: spacing.md }}
              >
                <View>
                  <Text style={[
                    isDark ? modernStyles.h3Dark : modernStyles.h3,
                    { fontSize: 14, fontWeight: '600', marginBottom: 4 }
                  ]}>{deal.title}</Text>
                  <Text style={[
                    isDark ? modernStyles.bodyDark : modernStyles.body,
                    { fontSize: 12, opacity: 0.7 }
                  ]}>{deal.description}</Text>
                </View>
              </ModernCard>
            ))}
          </ScrollView>
        </View>

        {/* Store Cards Section */}
        <View style={{ paddingHorizontal: spacing.md, marginBottom: spacing.lg }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
            <View>
              <Text style={[
                isDark ? modernStyles.h3Dark : modernStyles.h3,
                { fontSize: 16, fontWeight: '600' }
              ]}>Your Store Cards</Text>
              <Text style={[
                isDark ? modernStyles.bodyDark : modernStyles.body,
                { fontSize: 11, opacity: 0.7, marginTop: 1 }
              ]}>Manage loyalty cards & exclusive offers</Text>
            </View>
            <TouchableOpacity 
              onPress={() => router.push('/store-cards')}
              style={[
                isDark ? modernStyles.buttonSecondaryDark : modernStyles.buttonSecondary,
                { paddingVertical: spacing.xs, paddingHorizontal: spacing.sm }
              ]}
            >
              <Text style={[{ fontWeight: '500', fontSize: 11 }, { color: isDark ? '#FFFFFF' : colors.text }]}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {/* Store Cards Preview */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.sm }}>
            {storeCardsData.map((card, index) => (
              <ModernStoreCard
                key={index}
                name={card.name}
                color={card.color}
                discount={card.discount}
                memberNumber={card.memberNumber}
                points={card.points}
                tier={card.tier}
                onPress={() => router.push('/store-cards')}
                style={{ marginRight: spacing.md }}
              />
            ))}
          </ScrollView>
        </View>

        {/* Quick Actions Section */}
        <View style={{ paddingHorizontal: spacing.md, marginBottom: spacing.xl }}>
          <View style={{ marginBottom: spacing.md }}>
            <Text style={[
              isDark ? modernStyles.h3Dark : modernStyles.h3,
              { fontSize: 18, fontWeight: '700' }
            ]}>Quick Actions</Text>
            <Text style={[
              isDark ? modernStyles.bodyDark : modernStyles.body,
              { fontSize: 13, opacity: 0.7, marginTop: 2 }
            ]}>Access your favorite features instantly</Text>
          </View>
          
          <View style={{ 
            flexDirection: 'row', 
            flexWrap: 'wrap', 
            gap: spacing.sm,
            justifyContent: 'space-between'
          }}>
            {/* NaviGenie AI Assistant */}
            <TouchableOpacity
              style={{
                width: '48%',
                backgroundColor: isDark ? colors.surface : '#FFFFFF',
                borderRadius: borderRadius.xl,
                padding: spacing.lg,
                borderWidth: 1,
                borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                ...shadows.md,
                position: 'relative',
                overflow: 'hidden',
              }}
              onPress={() => router.push('/chat/')}
              activeOpacity={0.7}
            >
              {/* Gradient Background */}
              <View style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 80,
                height: 80,
                backgroundColor: colors.primary + '08',
                borderRadius: 40,
                transform: [{ translateX: 20 }, { translateY: -20 }],
              }} />
              
              <View style={{
                backgroundColor: colors.primary + '15',
                borderRadius: borderRadius.lg,
                padding: spacing.sm,
                marginBottom: spacing.sm,
                alignSelf: 'flex-start',
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 2,
              }}>
                <IconSymbol name="brain" size={24} color={colors.primary} />
              </View>
              <Text style={[
                isDark ? modernStyles.h3Dark : modernStyles.h3,
                { fontSize: 16, fontWeight: '700', marginBottom: 4 }
              ]}>NaviGenie</Text>
              <Text style={[
                isDark ? modernStyles.bodyDark : modernStyles.body,
                { fontSize: 12, opacity: 0.7, lineHeight: 16 }
              ]}>AI-powered assistant for navigation & shopping</Text>
            </TouchableOpacity>

            {/* Store Card Scanner */}
            <TouchableOpacity
              style={{
                width: '48%',
                backgroundColor: isDark ? colors.surface : '#FFFFFF',
                borderRadius: borderRadius.xl,
                padding: spacing.lg,
                borderWidth: 1,
                borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                ...shadows.md,
                position: 'relative',
                overflow: 'hidden',
              }}
              onPress={() => router.push('/store-cards')}
              activeOpacity={0.7}
            >
              {/* Gradient Background */}
              <View style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 80,
                height: 80,
                backgroundColor: '#10B981' + '08',
                borderRadius: 40,
                transform: [{ translateX: 20 }, { translateY: -20 }],
              }} />
              
              <View style={{
                backgroundColor: '#10B981' + '15',
                borderRadius: borderRadius.lg,
                padding: spacing.sm,
                marginBottom: spacing.sm,
                alignSelf: 'flex-start',
                shadowColor: '#10B981',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 2,
              }}>
                <IconSymbol name="creditcard" size={24} color="#10B981" />
              </View>
              <Text style={[
                isDark ? modernStyles.h3Dark : modernStyles.h3,
                { fontSize: 16, fontWeight: '700', marginBottom: 4 }
              ]}>Store Cards</Text>
              <Text style={[
                isDark ? modernStyles.bodyDark : modernStyles.body,
                { fontSize: 12, opacity: 0.7, lineHeight: 16 }
              ]}>Scan, manage & earn rewards from loyalty cards</Text>
            </TouchableOpacity>

            {/* Product Comparison */}
            <TouchableOpacity
              style={{
                width: '48%',
                backgroundColor: isDark ? colors.surface : '#FFFFFF',
                borderRadius: borderRadius.xl,
                padding: spacing.lg,
                borderWidth: 1,
                borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                ...shadows.md,
                position: 'relative',
                overflow: 'hidden',
              }}
              onPress={() => router.push('/(tabs)/explore')}
              activeOpacity={0.7}
            >
              {/* Gradient Background */}
              <View style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 80,
                height: 80,
                backgroundColor: '#F59E0B' + '08',
                borderRadius: 40,
                transform: [{ translateX: 20 }, { translateY: -20 }],
              }} />
              
              <View style={{
                backgroundColor: '#F59E0B' + '15',
                borderRadius: borderRadius.lg,
                padding: spacing.sm,
                marginBottom: spacing.sm,
                alignSelf: 'flex-start',
                shadowColor: '#F59E0B',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 2,
              }}>
                <IconSymbol name="chart.bar" size={24} color="#F59E0B" />
              </View>
              <Text style={[
                isDark ? modernStyles.h3Dark : modernStyles.h3,
                { fontSize: 16, fontWeight: '700', marginBottom: 4 }
              ]}>Price Compare</Text>
              <Text style={[
                isDark ? modernStyles.bodyDark : modernStyles.body,
                { fontSize: 12, opacity: 0.7, lineHeight: 16 }
              ]}>Compare prices across stores & find best deals</Text>
            </TouchableOpacity>

            {/* AR Navigation */}
            <TouchableOpacity
              style={{
                width: '48%',
                backgroundColor: isDark ? colors.surface : '#FFFFFF',
                borderRadius: borderRadius.xl,
                padding: spacing.lg,
                borderWidth: 1,
                borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                ...shadows.md,
                position: 'relative',
                overflow: 'hidden',
              }}
              onPress={() => router.push('/ar-navigation')}
              activeOpacity={0.7}
            >
              {/* Gradient Background */}
              <View style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 80,
                height: 80,
                backgroundColor: '#8B5CF6' + '08',
                borderRadius: 40,
                transform: [{ translateX: 20 }, { translateY: -20 }],
              }} />
              
              <View style={{
                backgroundColor: '#8B5CF6' + '15',
                borderRadius: borderRadius.lg,
                padding: spacing.sm,
                marginBottom: spacing.sm,
                alignSelf: 'flex-start',
                shadowColor: '#8B5CF6',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 2,
              }}>
                <IconSymbol name="viewfinder" size={24} color="#8B5CF6" />
              </View>
              <Text style={[
                isDark ? modernStyles.h3Dark : modernStyles.h3,
                { fontSize: 16, fontWeight: '700', marginBottom: 4 }
              ]}>AR Navigate</Text>
              <Text style={[
                isDark ? modernStyles.bodyDark : modernStyles.body,
                { fontSize: 12, opacity: 0.7, lineHeight: 16 }
              ]}>Augmented reality indoor navigation system</Text>
            </TouchableOpacity>
          </View>
        </View>



        {/* Featured Events with 2 Cards Per Row */}
        <View style={{ paddingHorizontal: spacing.md, marginBottom: spacing.lg }}>
          <View style={{ marginBottom: spacing.sm }}>
            <Text style={[
              isDark ? modernStyles.h3Dark : modernStyles.h3,
              { fontSize: 16, fontWeight: '600' }
            ]}>Featured Events</Text>
            <Text style={[
              isDark ? modernStyles.bodyDark : modernStyles.body,
              { fontSize: 11, opacity: 0.7, marginTop: 1 }
            ]}>Don't miss out</Text>
          </View>
          
          <View style={{ 
            flexDirection: 'row', 
            flexWrap: 'wrap', 
            gap: spacing.sm,
            justifyContent: 'space-between'
          }}>
            {[0, 1, 2, 3].map((index) => (
              <TouchableOpacity
                key={index}
                style={{
                  width: '48%',
                  height: 160,
                  borderRadius: borderRadius.xl,
                  overflow: 'hidden',
                  ...shadows.md,
                  marginBottom: spacing.sm,
                }}
              >
                <ImageBackground
                  source={{ 
                    uri: index === 0 
                      ? (advertisements[0]?.image || 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3') 
                      : index === 1
                      ? 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3'
                      : index === 2
                      ? 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3'
                      : 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3'
                  }}
                  style={{ flex: 1 }}
                  imageStyle={{ resizeMode: 'cover' }}
                >
                  <View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.4)',
                  }} />
                  <View style={{
                    position: 'absolute',
                    top: spacing.xs,
                    right: spacing.xs,
                  }}>
                    <View style={{
                      backgroundColor: `${colors.primary}CC`,
                      borderRadius: borderRadius.sm,
                      paddingHorizontal: spacing.xs,
                      paddingVertical: 2,
                    }}>
                      <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 8 }}>FEATURED</Text>
                    </View>
                  </View>
                  <View style={{
                    position: 'absolute',
                    bottom: spacing.md,
                    left: spacing.md,
                    right: spacing.md,
                  }}>
                    <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 14, marginBottom: 4 }}>
                      {index === 0 
                        ? (advertisements[0]?.title || 'Summer Festival')
                        : index === 1
                        ? 'Art Exhibition'
                        : index === 2  
                        ? 'Jazz Concert'
                        : 'Food Festival'
                      }
                    </Text>
                    <View style={[modernStyles.row, modernStyles.alignCenter, { gap: spacing.xs }]}>
                      <IconSymbol name="location.fill" size={10} color="white" />
                      <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 10 }}>
                        {index === 0 
                          ? (advertisements[0]?.venueName || 'V&A Waterfront')
                          : index === 1
                          ? 'Zeitz Museum'
                          : index === 2
                          ? 'Kirstenbosch'
                          : 'Green Point'
                        }
                      </Text>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tips & Articles Section - Moved to Bottom */}
        <View style={{ paddingHorizontal: spacing.md, marginBottom: spacing.lg }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
            <View>
              <Text style={[
                isDark ? modernStyles.h3Dark : modernStyles.h3,
                { fontSize: 18, fontWeight: '700' }
              ]}>Tips & Articles</Text>
              <Text style={[
                isDark ? modernStyles.bodyDark : modernStyles.body,
                { fontSize: 13, opacity: 0.8, marginTop: 2 }
              ]}>Helpful navigation tips and local insights</Text>
            </View>
            <TouchableOpacity 
              onPress={() => router.push('/article')}
              style={[
                isDark ? modernStyles.buttonSecondaryDark : modernStyles.buttonSecondary,
                { paddingVertical: spacing.xs, paddingHorizontal: spacing.sm }
              ]}
            >
              <Text style={[{ fontWeight: '600', fontSize: 11 }, { color: isDark ? '#FFFFFF' : colors.text }]}>Read More</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {articlesData.map((article) => (
              <ModernCard
                key={article.id}
                onPress={() => router.push('/article')}
                style={{
                  width: 220,
                  marginRight: spacing.md,
                }}
                shadow="lg"
              >
                <Image 
                  source={{ uri: article.image }}
                  style={{ 
                    width: '100%', 
                    height: 120,
                    borderTopLeftRadius: borderRadius.xl,
                    borderTopRightRadius: borderRadius.xl,
                    marginBottom: spacing.sm
                  }}
                  resizeMode="cover"
                />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs }}>
                    <View style={{
                      backgroundColor: colors.primary + '15',
                      paddingHorizontal: spacing.sm,
                      paddingVertical: 2,
                      borderRadius: borderRadius.sm,
                    }}>
                      <Text style={{ 
                        color: colors.primary, 
                        fontSize: 10, 
                        fontWeight: '600',
                        textTransform: 'uppercase' 
                      }}>{article.category}</Text>
                    </View>
                    <Text style={{ 
                      color: isDark ? 'rgba(255,255,255,0.6)' : colors.gray[500], 
                      fontSize: 10,
                      fontWeight: '500'
                    }}>{article.readTime}</Text>
                  </View>
                  <Text style={[
                    { fontSize: 16, fontWeight: '700', marginBottom: spacing.xs },
                    { color: isDark ? '#FFFFFF' : colors.gray[900] }
                  ]} numberOfLines={2}>{article.title}</Text>
                  <Text style={[
                    { fontSize: 13, lineHeight: 18 },
                    { color: isDark ? 'rgba(255,255,255,0.7)' : colors.gray[600] }
                  ]} numberOfLines={3}>{article.excerpt}</Text>
                </View>
              </ModernCard>
            ))}
          </ScrollView>
        </View>

        {/* Bottom spacing for FAB */}
        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}
