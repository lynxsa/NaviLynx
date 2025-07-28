import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  FlatList,
  Modal,
  TextInput,
  Linking,
  Share,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '@/context/ThemeContext';
import { spacing, borderRadius, shadows } from '@/styles/modernTheme';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { getVenueById, Venue, Deal } from '@/data/southAfricanVenues';
// import { enhancedDeals, Deal } from '@/data/dealsAndArticles';
import { getVenueInternalAreas } from '@/data/venueInternalAreas';
import { IconSymbolName } from '@/components/ui/IconSymbol';

// Helper function to safely map icon names
const getValidIconName = (iconName: string): IconSymbolName => {
  // Common icon mappings
  const iconMap: Record<string, IconSymbolName> = {
    'storefront': 'storefront',
    'bag': 'bag',
    'shopping-bag': 'bag',
    'utensils': 'gear', // food related
    'gamepad': 'gear', // entertainment
    'dumbbell': 'gear', // fitness
    'heartbeat': 'gear', // health
    'coffee': 'gear', // cafe
    'phone': 'phone.fill',
    'map': 'map',
    'location': 'location',
    'star': 'star',
    'search': 'magnifyingglass',
    'home': 'house',
    'building': 'building.2',
    'floor': 'building.2',
    'level': 'building.2',
    'restaurant': 'gear',
    'shop': 'storefront',
    'store': 'storefront',
    'food': 'gear',
    'retail': 'storefront',
    'services': 'gear',
    'entertainment': 'gear',
    'facilities': 'building.2',
  };
  
  return iconMap[iconName] || 'storefront'; // Default fallback
};

interface VenueLocation {
  id: string;
  name: string;
  description: string;
  floor: number;
  category: string;
  icon: string;
  color: string;
  deals?: Deal[];
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
}

// Helper functions moved outside component to prevent re-creation
const getCategoryForArea = (name: string): string => {
  const nameLower = name.toLowerCase();
  if (nameLower.includes('shop') || nameLower.includes('store') || nameLower.includes('retail')) return 'shopping';
  if (nameLower.includes('restaurant') || nameLower.includes('food') || nameLower.includes('café')) return 'dining';
  if (nameLower.includes('bank') || nameLower.includes('atm') || nameLower.includes('service')) return 'services';
  if (nameLower.includes('cinema') || nameLower.includes('theater') || nameLower.includes('arcade')) return 'entertainment';
  if (nameLower.includes('pharmacy') || nameLower.includes('clinic') || nameLower.includes('medical')) return 'health';
  return 'shopping';
};

const getIconForArea = (name: string, categories: any[]): string => {
  const category = getCategoryForArea(name);
  const categoryConfig = categories.find(c => c.id === category);
  return categoryConfig?.icon || 'location';
};

const getColorForCategory = (category: string, categories: any[]): string => {
  const categoryConfig = categories.find(c => c.id === category);
  return categoryConfig?.color || '#6366f1';
};

// Stable floor assignment based on area name hash
const getStableFloor = (name: string): number => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash % 4) + 1; // Returns 1-4
};

// Stable contact generation based on area name
const generateStableContactInfo = (name: string) => {
  const cleanName = name.toLowerCase().replace(/\s+/g, '');
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
  }
  const phoneNumber = 100000000 + Math.abs(hash % 900000000);
  
  return {
    phone: `+27 ${phoneNumber}`,
    email: `info@${cleanName}.co.za`,
    website: `https://${cleanName}.co.za`,
  };
};

export default function ModernVenueScreen() {
  const { isDark } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const [venue, setVenue] = useState<Venue | null>(null);
  const [locations, setLocations] = useState<VenueLocation[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [showDirections, setShowDirections] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [loading, setLoading] = useState(true);

  // Category configuration for modern UI (memoized to prevent re-creation)
  const categories = useMemo(() => [
    { id: 'all', name: 'All', icon: 'square.grid.2x2', color: '#6366f1' },
    { id: 'shopping', name: 'Shopping', icon: 'bag', color: '#10b981' },
    { id: 'dining', name: 'Dining', icon: 'fork.knife', color: '#f59e0b' },
    { id: 'services', name: 'Services', icon: 'briefcase', color: '#8b5cf6' },
    { id: 'entertainment', name: 'Entertainment', icon: 'star', color: '#ef4444' },
    { id: 'health', name: 'Health', icon: 'heart', color: '#06b6d4' },
  ], []);

  // Floor configuration (memoized to prevent re-creation)
  const floors = useMemo(() => [
    { number: 1, name: 'Ground Floor', icon: '1.square' },
    { number: 2, name: 'First Floor', icon: '2.square' },
    { number: 3, name: 'Second Floor', icon: '3.square' },
    { number: 4, name: 'Third Floor', icon: '4.square' },
  ], []);

  useEffect(() => {
    // Simple effect that only runs when ID changes
    if (!id) return;
    
    let isMounted = true; // Cleanup flag
    
    const loadData = () => {
      try {
        // Reset all state at the beginning
        setLoading(true);
        setVenue(null);
        setLocations([]);
        setDeals([]);
        
        // Load venue details
        const venueData = getVenueById(id as string);
        if (!isMounted) return; // Component unmounted
        
        if (!venueData) {
          Alert.alert('Error', 'Venue not found');
          router.back();
          return;
        }
        
        // Load locations/stores within venue
        const internalAreas = getVenueInternalAreas(id as string);
        if (!isMounted) return; // Component unmounted
        
        // Fixed categories for processing
        const fixedCategories = [
          { id: 'all', name: 'All', icon: 'square.grid.2x2', color: '#6366f1' },
          { id: 'shopping', name: 'Shopping', icon: 'bag', color: '#10b981' },
          { id: 'dining', name: 'Dining', icon: 'fork.knife', color: '#f59e0b' },
          { id: 'services', name: 'Services', icon: 'briefcase', color: '#8b5cf6' },
          { id: 'entertainment', name: 'Entertainment', icon: 'star', color: '#ef4444' },
          { id: 'health', name: 'Health', icon: 'heart', color: '#06b6d4' },
        ];
        
        const processedLocations = internalAreas.map(area => ({
          id: area.id,
          name: area.name,
          description: area.description || 'Explore this location',
          floor: getStableFloor(area.name),
          category: getCategoryForArea(area.name),
          icon: getIconForArea(area.name, fixedCategories),
          color: getColorForCategory(getCategoryForArea(area.name), fixedCategories),
          contact: generateStableContactInfo(area.name),
        }));
        
        // Load deals for this venue
        // const venueDeals = enhancedDeals
        //   .filter(deal => deal.location?.toLowerCase().includes(venueData.name.toLowerCase()))
        //   .slice(0, 5)
        //   .map(deal => ({
        //     id: deal.id,
        //     title: deal.title,
        //     description: deal.description,
        //     discount: deal.discount || '10% OFF',
        //     validUntil: deal.validUntil || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        //     location: deal.location || venueData.name,
        //     image: deal.image,
        //     category: deal.category || 'general',
        //   }));
        const venueDeals: Deal[] = [];
        
        if (!isMounted) return; // Component unmounted
        
        // Set all data atomically to prevent flickering
        setVenue(venueData);
        setLocations(processedLocations);
        setDeals(venueDeals);
        
      } catch (error) {
        if (isMounted) {
          console.error('Error loading venue data:', error);
          Alert.alert('Error', 'Failed to load venue information');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    loadData();
    
    return () => {
      isMounted = false; // Cleanup
    };
  }, [id, router]); // Only depend on ID and router

  // Filter locations based on search and filters
  const filteredLocations = useMemo(() => {
    return locations.filter(location => {
      const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           location.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || location.category === selectedCategory;
      const matchesFloor = selectedFloor === null || location.floor === selectedFloor;
      return matchesSearch && matchesCategory && matchesFloor;
    });
  }, [locations, searchQuery, selectedCategory, selectedFloor]);

  // Action handlers (memoized to prevent re-creation)
  const handleCall = useCallback((phone: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL(`tel:${phone}`);
  }, []);

  const handleNavigate = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (venue?.location?.coordinates) {
      const url = `https://maps.google.com/?q=${venue.location.coordinates.latitude},${venue.location.coordinates.longitude}`;
      Linking.openURL(url);
    }
  }, [venue?.location?.coordinates]);

  const handleShare = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await Share.share({
        message: `Check out ${venue?.name}! Great deals and locations to explore.`,
        title: venue?.name,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }, [venue?.name]);

  // Component renderers (memoized to prevent re-creation)
  const renderHeader = useCallback(() => {
    if (!venue) return null;
    
    return (
      <View style={{
        position: 'relative',
        height: 280,
        backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
      }}>
        {/* Hero Image */}
        <LinearGradient
          colors={['#6366f1', '#8b5cf6', '#ec4899']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
        
        {/* Header Content */}
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar barStyle="light-content" />
          
          {/* Navigation Bar */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.md,
          }}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
              }}
            >
              <IconSymbol name="chevron.left" size={20} color="#ffffff" />
            </TouchableOpacity>
            
            <View style={{ flexDirection: 'row', gap: spacing.md }}>
              <TouchableOpacity
                onPress={handleShare}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconSymbol name="square.and.arrow.up" size={20} color="#ffffff" />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => setShowDirections(true)}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconSymbol name="location" size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Venue Info */}
          <View style={{
            flex: 1,
            justifyContent: 'flex-end',
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing.xl,
          }}>
            <Text style={{
              fontSize: 32,
              fontWeight: '900',
              color: '#ffffff',
              marginBottom: spacing.sm,
              textShadowColor: 'rgba(0, 0, 0, 0.3)',
              textShadowOffset: { width: 0, height: 2 },
              textShadowRadius: 4,
            }}>
              {venue.name}
            </Text>
            
            <Text style={{
              fontSize: 16,
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: spacing.lg,
              lineHeight: 24,
            }}>
              {venue.description || 'Discover amazing locations and deals'}
            </Text>
            
            {/* Quick Actions */}
            <View style={{
              flexDirection: 'row',
              gap: spacing.md,
            }}>
              <TouchableOpacity
                onPress={handleNavigate}
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: borderRadius.xl,
                  paddingVertical: spacing.md,
                  paddingHorizontal: spacing.lg,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: spacing.sm,
                  backdropFilter: 'blur(10px)',
                }}
              >
                <IconSymbol name="location.fill" size={18} color="#ffffff" />
                <Text style={{
                  color: '#ffffff',
                  fontSize: 16,
                  fontWeight: '700',
                }}>
                  Navigate
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => setShowContact(true)}
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: borderRadius.xl,
                  paddingVertical: spacing.md,
                  paddingHorizontal: spacing.lg,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: spacing.sm,
                  backdropFilter: 'blur(10px)',
                }}
              >
                <IconSymbol name="phone.fill" size={18} color="#ffffff" />
                <Text style={{
                  color: '#ffffff',
                  fontSize: 16,
                  fontWeight: '700',
                }}>
                  Contact
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }, [isDark, venue, router, handleShare, handleNavigate]);

  const renderSearchAndFilters = useCallback(() => (
    <View style={{
      backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333333' : '#f1f5f9',
    }}>
      {/* Search Bar */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: isDark ? '#2a2a2a' : '#f8fafc',
        borderRadius: borderRadius.xl,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        marginBottom: spacing.lg,
        ...shadows.sm,
      }}>
        <IconSymbol name="magnifyingglass" size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
        <TextInput
          style={{
            flex: 1,
            marginLeft: spacing.md,
            fontSize: 16,
            color: isDark ? '#ffffff' : '#1f2937',
          }}
          placeholder="Search locations..."
          placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <IconSymbol name="xmark.circle.fill" size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: spacing.lg }}
        contentContainerStyle={{ paddingRight: spacing.lg }}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => {
              setSelectedCategory(category.id);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            style={{
              backgroundColor: selectedCategory === category.id 
                ? category.color 
                : isDark ? '#2a2a2a' : '#f8fafc',
              borderRadius: borderRadius.xl,
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.md,
              marginRight: spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.sm,
              ...shadows.sm,
            }}
          >
            <IconSymbol 
              name={getValidIconName(category.icon)} 
              size={16} 
              color={selectedCategory === category.id ? '#ffffff' : category.color} 
            />
            <Text style={{
              color: selectedCategory === category.id ? '#ffffff' : isDark ? '#ffffff' : '#1f2937',
              fontSize: 14,
              fontWeight: '600',
            }}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {/* Floor Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: spacing.lg }}
      >
        <TouchableOpacity
          onPress={() => {
            setSelectedFloor(null);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          style={{
            backgroundColor: selectedFloor === null 
              ? '#6366f1' 
              : isDark ? '#2a2a2a' : '#f8fafc',
            borderRadius: borderRadius.lg,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            marginRight: spacing.sm,
            ...shadows.sm,
          }}
        >
          <Text style={{
            color: selectedFloor === null ? '#ffffff' : isDark ? '#ffffff' : '#1f2937',
            fontSize: 12,
            fontWeight: '600',
          }}>
            All Floors
          </Text>
        </TouchableOpacity>
        
        {floors.map((floor) => (
          <TouchableOpacity
            key={floor.number}
            onPress={() => {
              setSelectedFloor(floor.number);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            style={{
              backgroundColor: selectedFloor === floor.number 
                ? '#6366f1' 
                : isDark ? '#2a2a2a' : '#f8fafc',
              borderRadius: borderRadius.lg,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              marginRight: spacing.sm,
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.xs,
              ...shadows.sm,
            }}
          >
            <IconSymbol 
              name={getValidIconName(floor.icon)} 
              size={14} 
              color={selectedFloor === floor.number ? '#ffffff' : '#6366f1'} 
            />
            <Text style={{
              color: selectedFloor === floor.number ? '#ffffff' : isDark ? '#ffffff' : '#1f2937',
              fontSize: 12,
              fontWeight: '600',
            }}>
              {floor.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  ), [isDark, searchQuery, categories, selectedCategory, floors, selectedFloor]);

  const renderLocationCard = useCallback(({ item: location }: { item: VenueLocation }) => (
    <TouchableOpacity
      style={{
        backgroundColor: isDark ? '#2a2a2a' : '#ffffff',
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        marginHorizontal: spacing.lg,
        marginBottom: spacing.md,
        ...shadows.md,
        borderLeftWidth: 4,
        borderLeftColor: location.color,
      }}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        // Handle location selection - could navigate to location details
      }}
    >
      <View style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
      }}>
        <View style={{ flex: 1 }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: spacing.sm,
          }}>
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: `${location.color}20`,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: spacing.md,
            }}>
              <IconSymbol name={getValidIconName(location.icon)} size={20} color={location.color} />
            </View>
            
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 18,
                fontWeight: '700',
                color: isDark ? '#ffffff' : '#1f2937',
                marginBottom: spacing.xs,
              }}>
                {location.name}
              </Text>
              
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.sm,
              }}>
                <View style={{
                  backgroundColor: location.color,
                  borderRadius: borderRadius.sm,
                  paddingHorizontal: spacing.sm,
                  paddingVertical: 2,
                }}>
                  <Text style={{
                    color: '#ffffff',
                    fontSize: 10,
                    fontWeight: '600',
                  }}>
                    Floor {location.floor}
                  </Text>
                </View>
                
                <Text style={{
                  color: location.color,
                  fontSize: 12,
                  fontWeight: '600',
                  textTransform: 'capitalize',
                }}>
                  {location.category}
                </Text>
              </View>
            </View>
          </View>
          
          <Text style={{
            fontSize: 14,
            color: isDark ? '#d1d5db' : '#6b7280',
            lineHeight: 20,
            marginBottom: spacing.md,
          }}>
            {location.description}
          </Text>
          
          {/* Action Buttons */}
          <View style={{
            flexDirection: 'row',
            gap: spacing.sm,
          }}>
            {location.contact?.phone && (
              <TouchableOpacity
                onPress={() => handleCall(location.contact!.phone!)}
                style={{
                  backgroundColor: isDark ? '#374151' : '#f3f4f6',
                  borderRadius: borderRadius.lg,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.sm,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing.xs,
                }}
              >
                <IconSymbol name="phone.fill" size={14} color={location.color} />
                <Text style={{
                  color: isDark ? '#ffffff' : '#1f2937',
                  fontSize: 12,
                  fontWeight: '600',
                }}>
                  Call
                </Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={{
                backgroundColor: isDark ? '#374151' : '#f3f4f6',
                borderRadius: borderRadius.lg,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.xs,
              }}
            >
              <IconSymbol name="location" size={14} color={location.color} />
              <Text style={{
                color: isDark ? '#ffffff' : '#1f2937',
                fontSize: 12,
                fontWeight: '600',
              }}>
                Directions
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: `${location.color}20`,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: spacing.md,
          }}
        >
          <IconSymbol name="chevron.right" size={16} color={location.color} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  ), [isDark, handleCall]);

  const renderDealsSection = () => (
    <View style={{
      backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
      paddingVertical: spacing.lg,
    }}>
      <Text style={{
        fontSize: 24,
        fontWeight: '800',
        color: isDark ? '#ffffff' : '#1f2937',
        marginHorizontal: spacing.lg,
        marginBottom: spacing.lg,
      }}>
        Current Deals
      </Text>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          gap: spacing.md,
        }}
      >
        {deals.map((deal) => (
          <TouchableOpacity
            key={deal.id}
            style={{
              width: 280,
              backgroundColor: isDark ? '#2a2a2a' : '#ffffff',
              borderRadius: borderRadius.xl,
              overflow: 'hidden',
              ...shadows.lg,
            }}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              // Handle deal selection
            }}
          >
            {/* Deal Header */}
            <LinearGradient
              colors={['#f59e0b', '#f97316']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                padding: spacing.lg,
                minHeight: 120,
                justifyContent: 'center',
              }}
            >
              <Text style={{
                fontSize: 20,
                fontWeight: '800',
                color: '#ffffff',
                marginBottom: spacing.sm,
              }}>
                {deal.discount}
              </Text>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: 'rgba(255, 255, 255, 0.9)',
              }}>
                {deal.title}
              </Text>
            </LinearGradient>
            
            {/* Deal Content */}
            <View style={{ padding: spacing.lg }}>
              <Text style={{
                fontSize: 14,
                color: isDark ? '#d1d5db' : '#6b7280',
                lineHeight: 20,
                marginBottom: spacing.md,
              }}>
                {deal.description}
              </Text>
              
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <Text style={{
                  fontSize: 12,
                  color: isDark ? '#9ca3af' : '#6b7280',
                  fontWeight: '600',
                }}>
                  Valid until {deal.validUntil}
                </Text>
                
                <TouchableOpacity
                  style={{
                    backgroundColor: '#10b981',
                    borderRadius: borderRadius.lg,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm,
                  }}
                >
                  <Text style={{
                    color: '#ffffff',
                    fontSize: 12,
                    fontWeight: '700',
                  }}>
                    Get Deal
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  // Early return for loading state to prevent flickering
  if (loading || !venue) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: isDark ? '#000000' : '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <View style={{
          alignItems: 'center',
        }}>
          <Text style={{
            fontSize: 18,
            color: isDark ? '#ffffff' : '#1f2937',
            fontWeight: '600',
            marginBottom: spacing.md,
          }}>
            Loading venue...
          </Text>
          <Text style={{
            fontSize: 14,
            color: isDark ? '#9ca3af' : '#6b7280',
            textAlign: 'center',
          }}>
            Preparing your venue experience
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{
      flex: 1,
      backgroundColor: isDark ? '#000000' : '#f8fafc',
    }}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {renderHeader()}
        {renderSearchAndFilters()}
        
        {/* Locations Section */}
        <View style={{
          backgroundColor: isDark ? '#000000' : '#f8fafc',
          paddingVertical: spacing.lg,
        }}>
          <Text style={{
            fontSize: 24,
            fontWeight: '800',
            color: isDark ? '#ffffff' : '#1f2937',
            marginHorizontal: spacing.lg,
            marginBottom: spacing.lg,
          }}>
            {filteredLocations.length} Locations Found
          </Text>
          
          <FlatList
            data={filteredLocations}
            keyExtractor={(item) => item.id}
            renderItem={renderLocationCard}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
            initialNumToRender={5}
            getItemLayout={(data, index) => ({
              length: 150, // Approximate item height
              offset: 150 * index,
              index,
            })}
          />
        </View>
        
        {renderDealsSection()}
        
        {/* Bottom Padding */}
        <View style={{ height: 100 }} />
      </ScrollView>
      
      {/* Contact Modal */}
      <Modal
        visible={showContact}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowContact(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: spacing.lg,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? '#333333' : '#f1f5f9',
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: '700',
              color: isDark ? '#ffffff' : '#1f2937',
            }}>
              Contact Information
            </Text>
            <TouchableOpacity onPress={() => setShowContact(false)}>
              <IconSymbol name="xmark" size={24} color={isDark ? '#ffffff' : '#1f2937'} />
            </TouchableOpacity>
          </View>
          
          <View style={{ padding: spacing.lg }}>
            <Text style={{
              fontSize: 16,
              color: isDark ? '#d1d5db' : '#6b7280',
              textAlign: 'center',
            }}>
              Contact details will be available here
            </Text>
          </View>
        </View>
      </Modal>
      
      {/* Directions Modal */}
      <Modal
        visible={showDirections}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowDirections(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: spacing.lg,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? '#333333' : '#f1f5f9',
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: '700',
              color: isDark ? '#ffffff' : '#1f2937',
            }}>
              Navigation Options
            </Text>
            <TouchableOpacity onPress={() => setShowDirections(false)}>
              <IconSymbol name="xmark" size={24} color={isDark ? '#ffffff' : '#1f2937'} />
            </TouchableOpacity>
          </View>
          
          <View style={{ padding: spacing.lg }}>
            <TouchableOpacity
              onPress={handleNavigate}
              style={{
                backgroundColor: '#10b981',
                borderRadius: borderRadius.xl,
                padding: spacing.lg,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.md,
              }}
            >
              <IconSymbol name="location.fill" size={20} color="#ffffff" />
              <Text style={{
                color: '#ffffff',
                fontSize: 18,
                fontWeight: '700',
              }}>
                Open in Maps
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
