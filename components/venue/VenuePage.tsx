import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  Modal,
  TextInput,
  Linking,
  Share,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '@/context/ThemeContext';
import { spacing, borderRadius, shadows } from '@/styles/modernTheme';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { getVenueById, Venue, Deal } from '@/data/southAfricanVenues';
import { getVenueInternalAreas } from '@/data/venueInternalAreas';
import { IconSymbolName } from '@/components/ui/IconSymbol';

// Types
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

interface VenueDeal {
  id: string;
  title: string;
  description: string;
  discount: string;
  validUntil: string;
  location: string;
  image?: string;
  category: string;
}

interface VenuePageProps {
  venueId: string;
}

// Helper functions (pure functions, no dependencies)
const getValidIconName = (iconName: string): IconSymbolName => {
  const iconMap: Record<string, IconSymbolName> = {
    'storefront': 'storefront',
    'bag': 'bag',
    'shopping-bag': 'bag',
    'utensils': 'gear',
    'gamepad': 'gear',
    'dumbbell': 'gear',
    'heartbeat': 'gear',
    'coffee': 'gear',
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
  
  return iconMap[iconName] || 'storefront';
};

const getCategoryForArea = (name: string): string => {
  const nameLower = name.toLowerCase();
  if (nameLower.includes('shop') || nameLower.includes('store') || nameLower.includes('retail')) return 'shopping';
  if (nameLower.includes('restaurant') || nameLower.includes('food') || nameLower.includes('café')) return 'dining';
  if (nameLower.includes('bank') || nameLower.includes('atm') || nameLower.includes('service')) return 'services';
  if (nameLower.includes('cinema') || nameLower.includes('theater') || nameLower.includes('arcade')) return 'entertainment';
  if (nameLower.includes('pharmacy') || nameLower.includes('clinic') || nameLower.includes('medical')) return 'health';
  return 'shopping';
};

const getIconForArea = (name: string): string => {
  const category = getCategoryForArea(name);
  const categoryIcons: Record<string, string> = {
    'shopping': 'bag',
    'dining': 'fork.knife',
    'services': 'briefcase',
    'entertainment': 'star',
    'health': 'heart',
  };
  return categoryIcons[category] || 'location';
};

const getColorForCategory = (category: string): string => {
  const categoryColors: Record<string, string> = {
    'all': '#6366f1',
    'shopping': '#10b981',
    'dining': '#f59e0b',
    'services': '#8b5cf6',
    'entertainment': '#ef4444',
    'health': '#06b6d4',
  };
  return categoryColors[category] || '#6366f1';
};

const getStableFloor = (name: string): number => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash % 4) + 1;
};

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

// Main component
export const VenuePage: React.FC<VenuePageProps> = ({ venueId }) => {
  const { isDark } = useTheme();
  const router = useRouter();
  
  // State
  const [venue, setVenue] = useState<Venue | null>(null);
  const [locations, setLocations] = useState<VenueLocation[]>([]);
  const [deals, setDeals] = useState<VenueDeal[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFloor] = useState<number | null>(null);
  const [showDirections, setShowDirections] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Static data (memoized to prevent re-creation)
  const categories = useMemo(() => [
    { id: 'all', name: 'All', icon: 'square.grid.2x2', color: '#6366f1' },
    { id: 'shopping', name: 'Shopping', icon: 'bag', color: '#10b981' },
    { id: 'dining', name: 'Dining', icon: 'fork.knife', color: '#f59e0b' },
    { id: 'services', name: 'Services', icon: 'briefcase', color: '#8b5cf6' },
    { id: 'entertainment', name: 'Entertainment', icon: 'star', color: '#ef4444' },
    { id: 'health', name: 'Health', icon: 'heart', color: '#06b6d4' },
  ], []);

  // Mock deals data since enhancedDeals is not available

  // Data loading effect (single, clean effect)
  useEffect(() => {
    if (!venueId) {
      setError('No venue ID provided');
      setLoading(false);
      return;
    }

    let isMounted = true;

    const loadVenueData = () => {
      try {
        // Reset state
        setLoading(true);
        setError(null);
        setVenue(null);
        setLocations([]);
        setDeals([]);

        // Load venue details (synchronous)
        const venueData = getVenueById(venueId);
        if (!isMounted) return;

        if (!venueData) {
          setError('Venue not found');
          setLoading(false);
          return;
        }

        // Load internal areas (synchronous)
        const internalAreas = getVenueInternalAreas(venueId);
        if (!isMounted) return;

        // Process locations
        const processedLocations = internalAreas.map(area => ({
          id: area.id,
          name: area.name,
          description: area.description || 'Explore this location',
          floor: getStableFloor(area.name),
          category: getCategoryForArea(area.name),
          icon: getIconForArea(area.name),
          color: getColorForCategory(getCategoryForArea(area.name)),
          contact: generateStableContactInfo(area.name),
        }));

        // Load deals - using mock data
        const venueDeals: VenueDeal[] = [
          {
            id: '1',
            title: 'Special Venue Offer',
            description: 'Exclusive deal for this venue',
            discount: '15% OFF',
            validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            location: venueData.name,
            image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
            category: 'general'
          }
        ];

        if (!isMounted) return;

        // Set all data atomically
        setVenue(venueData);
        setLocations(processedLocations);
        setDeals(venueDeals);
        setLoading(false);

      } catch (err) {
        if (isMounted) {
          console.error('Error loading venue data:', err);
          setError('Failed to load venue data');
          setLoading(false);
        }
      }
    };

    loadVenueData();

    return () => {
      isMounted = false;
    };
  }, [venueId]); // Only depend on venueId

  // Filtered locations (memoized for performance)
  const filteredLocations = useMemo(() => {
    return locations.filter(location => {
      const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           location.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || location.category === selectedCategory;
      const matchesFloor = selectedFloor === null || location.floor === selectedFloor;
      return matchesSearch && matchesCategory && matchesFloor;
    });
  }, [locations, searchQuery, selectedCategory, selectedFloor]);

  // Event handlers (memoized to prevent re-creation)
  const handleCall = useCallback((phone: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL(`tel:${phone}`);
  }, []);

  const handleNavigate = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (venue?.location?.coordinates) {
      const { latitude, longitude } = venue.location.coordinates;
      Linking.openURL(`https://maps.apple.com/?ll=${latitude},${longitude}&q=${encodeURIComponent(venue.name)}`);
    }
  }, [venue]);

  const handleShare = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (venue) {
      Share.share({
        message: `Check out ${venue.name} - ${venue.description}`,
        title: venue.name,
      });
    }
  }, [venue]);

  // Error state
  if (error) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: isDark ? '#000000' : '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
      }}>
        <IconSymbol name="exclamationmark.triangle" size={48} color={isDark ? '#ef4444' : '#dc2626'} />
        <Text style={{
          fontSize: 18,
          color: isDark ? '#ffffff' : '#1f2937',
          fontWeight: '600',
          marginTop: spacing.lg,
          textAlign: 'center',
        }}>
          {error}
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            backgroundColor: '#6366f1',
            borderRadius: borderRadius.lg,
            paddingHorizontal: spacing.xl,
            paddingVertical: spacing.md,
            marginTop: spacing.lg,
          }}
        >
          <Text style={{
            color: '#ffffff',
            fontSize: 16,
            fontWeight: '600',
          }}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Loading state
  if (loading || !venue) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: isDark ? '#000000' : '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={{
          fontSize: 18,
          color: isDark ? '#ffffff' : '#1f2937',
          fontWeight: '600',
          marginTop: spacing.lg,
        }}>
          Loading venue...
        </Text>
        <Text style={{
          fontSize: 14,
          color: isDark ? '#9ca3af' : '#6b7280',
          textAlign: 'center',
          marginTop: spacing.sm,
        }}>
          Preparing your venue experience
        </Text>
      </View>
    );
  }

  // Main render
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
        {/* Header Section */}
        <View style={{
          position: 'relative',
          height: 280,
          backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
        }}>
          {/* Hero Gradient */}
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
                {venue.description}
              </Text>
              
              {/* Action Buttons */}
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

        {/* Search and Filters */}
        <View style={{
          backgroundColor: isDark ? '#000000' : '#f8fafc',
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.xl,
        }}>
          {/* Search Bar */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
            borderRadius: borderRadius.xl,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            marginBottom: spacing.lg,
            ...shadows.sm,
          }}>
            <IconSymbol name="magnifyingglass" size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search locations..."
              placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
              style={{
                flex: 1,
                marginLeft: spacing.md,
                fontSize: 16,
                color: isDark ? '#ffffff' : '#1f2937',
              }}
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
        </View>

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
            Locations & Stores
          </Text>
          
          {filteredLocations.length === 0 ? (
            <View style={{
              alignItems: 'center',
              paddingVertical: spacing.xl,
            }}>
              <IconSymbol name="magnifyingglass" size={48} color={isDark ? '#6b7280' : '#9ca3af'} />
              <Text style={{
                fontSize: 18,
                color: isDark ? '#9ca3af' : '#6b7280',
                fontWeight: '600',
                marginTop: spacing.md,
              }}>
                No locations found
              </Text>
              <Text style={{
                fontSize: 14,
                color: isDark ? '#6b7280' : '#9ca3af',
                textAlign: 'center',
                marginTop: spacing.sm,
              }}>
                Try adjusting your search or filters
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredLocations}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={{
                  backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
                  marginHorizontal: spacing.lg,
                  marginBottom: spacing.md,
                  borderRadius: borderRadius.lg,
                  padding: spacing.lg,
                  ...shadows.sm,
                }}>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    gap: spacing.md,
                  }}>
                    <View style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: item.color,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <IconSymbol 
                        name={getValidIconName(item.icon)} 
                        size={24} 
                        color="#ffffff" 
                      />
                    </View>
                    
                    <View style={{ flex: 1 }}>
                      <Text style={{
                        fontSize: 18,
                        fontWeight: '700',
                        color: isDark ? '#ffffff' : '#1f2937',
                        marginBottom: spacing.xs,
                      }}>
                        {item.name}
                      </Text>
                      
                      <Text style={{
                        fontSize: 14,
                        color: isDark ? '#9ca3af' : '#6b7280',
                        marginBottom: spacing.sm,
                        lineHeight: 20,
                      }}>
                        {item.description}
                      </Text>
                      
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: spacing.md,
                      }}>
                        <View style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: spacing.xs,
                        }}>
                          <IconSymbol 
                            name="building.2" 
                            size={14} 
                            color={isDark ? '#9ca3af' : '#6b7280'} 
                          />
                          <Text style={{
                            fontSize: 12,
                            color: isDark ? '#9ca3af' : '#6b7280',
                            fontWeight: '600',
                          }}>
                            Floor {item.floor}
                          </Text>
                        </View>
                        
                        {item.contact?.phone && (
                          <TouchableOpacity
                            onPress={() => handleCall(item.contact!.phone!)}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: spacing.xs,
                              backgroundColor: item.color,
                              borderRadius: borderRadius.md,
                              paddingHorizontal: spacing.sm,
                              paddingVertical: spacing.xs,
                            }}
                          >
                            <IconSymbol name="phone.fill" size={12} color="#ffffff" />
                            <Text style={{
                              fontSize: 12,
                              color: '#ffffff',
                              fontWeight: '600',
                            }}>
                              Call
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              )}
            />
          )}
        </View>

        {/* Deals Section */}
        {deals.length > 0 && (
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
              Current Deals
            </Text>
            
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: spacing.lg, paddingRight: spacing.lg }}
            >
              {deals.map((deal) => (
                <TouchableOpacity
                  key={deal.id}
                  style={{
                    backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
                    borderRadius: borderRadius.lg,
                    padding: spacing.lg,
                    marginRight: spacing.md,
                    width: 280,
                    ...shadows.sm,
                  }}
                >
                  <View style={{
                    backgroundColor: '#10b981',
                    borderRadius: borderRadius.md,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.xs,
                    alignSelf: 'flex-start',
                    marginBottom: spacing.md,
                  }}>
                    <Text style={{
                      color: '#ffffff',
                      fontSize: 12,
                      fontWeight: '700',
                    }}>
                      {deal.discount}
                    </Text>
                  </View>
                  
                  <Text style={{
                    fontSize: 18,
                    fontWeight: '700',
                    color: isDark ? '#ffffff' : '#1f2937',
                    marginBottom: spacing.sm,
                  }}>
                    {deal.title}
                  </Text>
                  
                  <Text style={{
                    fontSize: 14,
                    color: isDark ? '#9ca3af' : '#6b7280',
                    marginBottom: spacing.md,
                    lineHeight: 20,
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
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {/* Directions Modal */}
      <Modal
        visible={showDirections}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowDirections(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: isDark ? '#000000' : '#ffffff',
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: spacing.lg,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? '#2a2a2a' : '#e5e7eb',
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: '700',
              color: isDark ? '#ffffff' : '#1f2937',
            }}>
              Directions
            </Text>
            
            <TouchableOpacity
              onPress={() => setShowDirections(false)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: isDark ? '#2a2a2a' : '#f3f4f6',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconSymbol name="xmark" size={16} color={isDark ? '#ffffff' : '#1f2937'} />
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

      {/* Contact Modal */}
      <Modal
        visible={showContact}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowContact(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: isDark ? '#000000' : '#ffffff',
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: spacing.lg,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? '#2a2a2a' : '#e5e7eb',
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: '700',
              color: isDark ? '#ffffff' : '#1f2937',
            }}>
              Contact Information
            </Text>
            
            <TouchableOpacity
              onPress={() => setShowContact(false)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: isDark ? '#2a2a2a' : '#f3f4f6',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconSymbol name="xmark" size={16} color={isDark ? '#ffffff' : '#1f2937'} />
            </TouchableOpacity>
          </View>
          
          <View style={{ padding: spacing.lg }}>
            {venue?.contact?.phone && (
              <TouchableOpacity
                onPress={() => handleCall(venue.contact.phone!)}
                style={{
                  backgroundColor: isDark ? '#1a1a1a' : '#f8fafc',
                  borderRadius: borderRadius.lg,
                  padding: spacing.lg,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing.md,
                  marginBottom: spacing.md,
                }}
              >
                <IconSymbol name="phone.fill" size={20} color="#10b981" />
                <Text style={{
                  fontSize: 16,
                  color: isDark ? '#ffffff' : '#1f2937',
                  fontWeight: '600',
                }}>
                  {venue.contact.phone}
                </Text>
              </TouchableOpacity>
            )}
            
            {venue?.contact?.website && (
              <TouchableOpacity
                onPress={() => Linking.openURL(venue.contact.website!)}
                style={{
                  backgroundColor: isDark ? '#1a1a1a' : '#f8fafc',
                  borderRadius: borderRadius.lg,
                  padding: spacing.lg,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing.md,
                }}
              >
                <IconSymbol name="globe" size={20} color="#6366f1" />
                <Text style={{
                  fontSize: 16,
                  color: isDark ? '#ffffff' : '#1f2937',
                  fontWeight: '600',
                }}>
                  Visit Website
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default VenuePage;
