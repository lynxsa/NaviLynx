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
import { DealsCarousel } from '@/components/deals/DealsCarousel';
import { VenueCard } from '@/components/venues/VenueCard';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { NaviGenieCard } from '@/components/ui/NaviGenieCard';
import { StatsGrid } from '@/components/ui/StatsGrid';
import { ShoppingAssistantCard } from '@/components/shopping/ShoppingAssistantCard';
import { UnifiedCategoryCard } from '@/components/categories/UnifiedCategoryCard';

// South African venue data
import { 
  advertisements, 
  getTopRatedVenues, 
  getVenueStats
} from '@/data/southAfricanVenues';
import { venueCategories } from '@/data/enhancedVenues';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [greeting, setGreeting] = useState('Good Morning');
  const { isDark, toggleTheme } = useTheme();

  // Get venue data
  const topVenues = getTopRatedVenues(4);
  const venueStats = getVenueStats();

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

        {/* Enhanced Stats Cards with Improved Typography */}
        <View style={{ paddingHorizontal: spacing.md, marginBottom: spacing.lg }}>
          <View style={[modernStyles.row, { gap: spacing.sm }]}>
            <View style={[
              isDark ? modernStyles.statCardDark : modernStyles.statCard,
              { 
                alignItems: 'center',
                paddingVertical: spacing.md,
                paddingHorizontal: spacing.sm,
                minHeight: 85,
                justifyContent: 'center'
              }
            ]}>
              <IconSymbol name="building.2.fill" size={20} color={colors.primary} />
              <Text style={[
                { 
                  fontSize: 20, 
                  fontWeight: '700', 
                  marginTop: spacing.xs,
                  marginBottom: 2,
                  lineHeight: 24
                },
                { color: isDark ? '#FFFFFF' : colors.text }
              ]}>{venueStats.totalVenues}</Text>
              <Text style={[
                isDark ? modernStyles.captionDark : modernStyles.caption,
                { 
                  fontSize: 11,
                  fontWeight: '500',
                  textAlign: 'center',
                  lineHeight: 13,
                  opacity: 0.8
                }
              ]}>SA Venues</Text>
            </View>
            <View style={[
              isDark ? modernStyles.statCardDark : modernStyles.statCard,
              { 
                alignItems: 'center',
                paddingVertical: spacing.md,
                paddingHorizontal: spacing.sm,
                minHeight: 85,
                justifyContent: 'center'
              }
            ]}>
              <IconSymbol name="star.fill" size={12} color={colors.primary} />
              <Text style={[
                { 
                  fontSize: 20, 
                  fontWeight: '700', 
                  marginTop: spacing.xs,
                  marginBottom: 2,
                  lineHeight: 24
                },
                { color: isDark ? '#FFFFFF' : colors.text }
              ]}>{venueStats.avgRating}★</Text>
              <Text style={[
                isDark ? modernStyles.captionDark : modernStyles.caption,
                { 
                  fontSize: 11,
                  fontWeight: '500',
                  textAlign: 'center',
                  lineHeight: 13,
                  opacity: 0.8
                }
              ]}>Avg Rating</Text>
            </View>
            <View style={[
              isDark ? modernStyles.statCardDark : modernStyles.statCard,
              { 
                alignItems: 'center',
                paddingVertical: spacing.md,
                paddingHorizontal: spacing.sm,
                minHeight: 85,
                justifyContent: 'center'
              }
            ]}>
              <IconSymbol name="clock.fill" size={20} color={colors.primary} />
              <Text style={[
                { 
                  fontSize: 20, 
                  fontWeight: '700', 
                  marginTop: spacing.xs,
                  marginBottom: 2,
                  lineHeight: 24
                },
                { color: isDark ? '#FFFFFF' : colors.text }
              ]}>24/7</Text>
              <Text style={[
                isDark ? modernStyles.captionDark : modernStyles.caption,
                { 
                  fontSize: 11,
                  fontWeight: '500',
                  textAlign: 'center',
                  lineHeight: 13,
                  opacity: 0.8
                }
              ]}>Navigation</Text>
            </View>
          </View>
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

        {/* Enhanced Deals Section */}
        <View style={{ marginBottom: spacing.lg }}>
          <View style={{ paddingHorizontal: spacing.md, marginBottom: spacing.sm }}>
            <View style={[modernStyles.row, modernStyles.spaceBetween, modernStyles.alignCenter, { marginBottom: spacing.xs }]}>
              <View style={[modernStyles.row, modernStyles.alignCenter, { gap: spacing.xs, flex: 1 }]}>
                <IconSymbol name="tag.fill" size={18} color={colors.primary} />
                <Text style={[
                  isDark ? modernStyles.h3Dark : modernStyles.h3,
                  { fontSize: 16, fontWeight: '600' }
                ]}>Hot Deals</Text>
                <View style={{
                  backgroundColor: colors.error,
                  borderRadius: borderRadius.full,
                  paddingHorizontal: spacing.xs,
                  paddingVertical: 2,
                }}>
                  <Text style={{ color: '#FFFFFF', fontSize: 9, fontWeight: '700' }}>NEW</Text>
                </View>
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
            <Text style={[
              isDark ? modernStyles.bodyDark : modernStyles.body,
              { 
                fontSize: 12, 
                opacity: 0.8, 
                fontWeight: '500',
                lineHeight: 16,
                letterSpacing: 0.1
              }
            ]}>Limited time offers at your favorite venues</Text>
          </View>
          <DealsCarousel />
        </View>

        {/* NaviGenie Assistant Card - Moved here */}
        <View style={{ paddingHorizontal: spacing.md, marginBottom: spacing.xl }}>
          <NaviGenieCard />
        </View>

        {/* Shopping Assistant Card */}
        <View style={{ paddingHorizontal: spacing.md, marginBottom: spacing.xl }}>
          <ShoppingAssistantCard />
        </View>

        {/* Recent Visits & Spend Summary */}
        <View style={{ paddingHorizontal: spacing.md, marginBottom: spacing.xl }}>
          <StatsGrid />
        </View>

        {/* Enhanced Featured Venues with Real South African Data */}
        <View style={{ paddingHorizontal: spacing.md, marginBottom: spacing.lg }}>
          <View style={[modernStyles.row, modernStyles.spaceBetween, modernStyles.alignCenter, { marginBottom: spacing.sm }]}>
            <View>
              <Text style={[
                isDark ? modernStyles.h3Dark : modernStyles.h3,
                { fontSize: 16, fontWeight: '600' }
              ]}>Featured Venues</Text>
              <Text style={[
                isDark ? modernStyles.bodyDark : modernStyles.body,
                { fontSize: 11, opacity: 0.7, marginTop: 1 }
              ]}>Top South African destinations</Text>
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
          
          <View style={{ 
            flexDirection: 'row', 
            flexWrap: 'wrap', 
            gap: spacing.sm,
            justifyContent: 'space-between'
          }}>
            {topVenues.slice(0, 4).map((venue, index) => (
              <View key={venue.id} style={{ width: '48%' }}>
                <VenueCard 
                  venue={{
                    id: venue.id,
                    name: venue.name,
                    distance: `${(Math.random() * 5 + 0.5).toFixed(1)} km`,
                    rating: venue.rating,
                    image: venue.image,
                    category: venue.type.charAt(0).toUpperCase() + venue.type.slice(1),
                    isOpen: true,
                  }}
                  size="medium" 
                />
              </View>
            ))}
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

        {/* Bottom spacing for FAB */}
        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}
