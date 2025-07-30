// Advanced Deals System for NaviLynx
// Real-time deal discovery and management with enhanced features

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  TextInput,
  Modal,
  Alert,
  Share,
  Linking,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { productionBackend } from '../../services/ProductionBackendService';
import { enhancedVenues } from '../../data/enhancedVenues';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

const { width, height } = Dimensions.get('window');

export interface AdvancedDeal {
  id: string;
  venueId: string;
  venueName: string;
  title: string;
  description: string;
  discountPercentage: number;
  originalPrice: number;
  discountedPrice: number;
  category: string;
  validUntil: string;
  isActive: boolean;
  images: string[];
  terms: string;
  claimCount: number;
  maxClaims?: number;
  priority: 'low' | 'medium' | 'high' | 'featured';
  tags: string[];
  restrictions?: string[];
  qrCode?: string;
  coordinates?: { latitude: number; longitude: number };
  distance?: number;
  rating: number;
  reviewCount: number;
  merchantInfo: {
    name: string;
    logo?: string;
    verified: boolean;
  };
  socialProof: {
    recentClaims: number;
    popularityScore: number;
  };
}

interface DealsScreenProps {
  userLocation?: { latitude: number; longitude: number };
}

const DealsScreen: React.FC<DealsScreenProps> = ({ userLocation }) => {
  const { theme } = useTheme();
  const { language, translations } = useLanguage();
  
  // State management
  const [deals, setDeals] = useState<AdvancedDeal[]>([]);
  const [filteredDeals, setFilteredDeals] = useState<AdvancedDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDeal, setSelectedDeal] = useState<AdvancedDeal | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [claimedDeals, setClaimedDeals] = useState<Set<string>>(new Set());
  const [favoriteDeals, setFavoriteDeals] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'distance' | 'discount' | 'expiry' | 'popularity'>('popularity');

  // Categories for filtering
  const categories = [
    'all',
    'food',
    'shopping',
    'entertainment',
    'health',
    'services',
    'travel',
    'electronics'
  ];

  // Load deals data
  const loadDeals = useCallback(async () => {
    try {
      setLoading(true);
      
      // Simulate advanced deals data with enhanced features
      const mockDeals: AdvancedDeal[] = [
        {
          id: '1',
          venueId: 'sandton_city',
          venueName: 'Sandton City',
          title: '50% Off Premium Electronics',
          description: 'Get massive discounts on latest smartphones, laptops, and gaming gear. Limited time offer!',
          discountPercentage: 50,
          originalPrice: 2999,
          discountedPrice: 1499,
          category: 'electronics',
          validUntil: '2024-02-15T23:59:59Z',
          isActive: true,
          images: ['https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400'],
          terms: 'Valid on selected items only. Cannot be combined with other offers.',
          claimCount: 127,
          maxClaims: 200,
          priority: 'featured',
          tags: ['electronics', 'smartphones', 'limited'],
          qrCode: 'DEAL50ELEC',
          coordinates: { latitude: -26.1076, longitude: 28.0567 },
          rating: 4.8,
          reviewCount: 89,
          merchantInfo: {
            name: 'TechZone',
            verified: true
          },
          socialProof: {
            recentClaims: 23,
            popularityScore: 95
          }
        },
        {
          id: '2',
          venueId: 'gateway_durban',
          venueName: 'Gateway Theatre of Shopping',
          title: 'Buy 2 Get 1 Free - All Meals',
          description: 'Enjoy our signature dishes with friends and family. Perfect for group dining!',
          discountPercentage: 33,
          originalPrice: 180,
          discountedPrice: 120,
          category: 'food',
          validUntil: '2024-02-10T22:00:00Z',
          isActive: true,
          images: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400'],
          terms: 'Valid for dine-in only. Beverages not included.',
          claimCount: 84,
          maxClaims: 150,
          priority: 'high',
          tags: ['food', 'family', 'group'],
          qrCode: 'FOOD2FOR1',
          coordinates: { latitude: -29.7633, longitude: 31.0218 },
          rating: 4.6,
          reviewCount: 156,
          merchantInfo: {
            name: 'Ocean Basket',
            verified: true
          },
          socialProof: {
            recentClaims: 18,
            popularityScore: 87
          }
        },
        {
          id: '3',
          venueId: 'canal_walk',
          venueName: 'Canal Walk',
          title: '70% Off Designer Fashion',
          description: 'End of season sale on premium fashion brands. Limited stock available.',
          discountPercentage: 70,
          originalPrice: 1200,
          discountedPrice: 360,
          category: 'shopping',
          validUntil: '2024-02-08T18:00:00Z',
          isActive: true,
          images: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400'],
          terms: 'While stocks last. All sales final.',
          claimCount: 203,
          maxClaims: 300,
          priority: 'featured',
          tags: ['fashion', 'designer', 'sale'],
          qrCode: 'FASHION70',
          coordinates: { latitude: -33.8936, longitude: 18.5108 },
          rating: 4.9,
          reviewCount: 234,
          merchantInfo: {
            name: 'Fashion Forward',
            verified: true
          },
          socialProof: {
            recentClaims: 45,
            popularityScore: 98
          }
        }
      ];

      // Calculate distances if user location is available
      if (userLocation) {
        mockDeals.forEach(deal => {
          if (deal.coordinates) {
            deal.distance = calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              deal.coordinates.latitude,
              deal.coordinates.longitude
            );
          }
        });
      }

      setDeals(mockDeals);
      setFilteredDeals(mockDeals);
    } catch (error) {
      console.error('Failed to load deals:', error);
      Alert.alert('Error', 'Failed to load deals. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userLocation]);

  // Filter and sort deals
  const applyFiltersAndSort = useCallback(() => {
    let filtered = deals.filter(deal => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.venueName.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory = selectedCategory === 'all' || deal.category === selectedCategory;

      return matchesSearch && matchesCategory && deal.isActive;
    });

    // Sort deals
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return (a.distance || 0) - (b.distance || 0);
        case 'discount':
          return b.discountPercentage - a.discountPercentage;
        case 'expiry':
          return new Date(a.validUntil).getTime() - new Date(b.validUntil).getTime();
        case 'popularity':
        default:
          return b.socialProof.popularityScore - a.socialProof.popularityScore;
      }
    });

    setFilteredDeals(filtered);
  }, [deals, searchQuery, selectedCategory, sortBy]);

  // Calculate distance between two coordinates
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Handle deal claim
  const claimDeal = async (deal: AdvancedDeal) => {
    try {
      if (claimedDeals.has(deal.id)) {
        Alert.alert('Already Claimed', 'You have already claimed this deal.');
        return;
      }

      // Track analytics
      await productionBackend.trackUserAction('purchase', {
        dealId: deal.id,
        venueId: deal.venueId,
        amount: deal.discountedPrice,
        category: deal.category
      });

      setClaimedDeals(prev => new Set(prev).add(deal.id));
      
      Alert.alert(
        'Deal Claimed!',
        `Your ${deal.title} deal has been claimed. Show the QR code: ${deal.qrCode} at the store.`,
        [
          { text: 'OK' },
          { text: 'Share Deal', onPress: () => shareDeal(deal) }
        ]
      );
    } catch (error) {
      console.error('Failed to claim deal:', error);
      Alert.alert('Error', 'Failed to claim deal. Please try again.');
    }
  };

  // Share deal
  const shareDeal = async (deal: AdvancedDeal) => {
    try {
      await Share.share({
        message: `Check out this amazing deal: ${deal.title} - ${deal.discountPercentage}% off at ${deal.venueName}! Valid until ${new Date(deal.validUntil).toLocaleDateString()}`,
        url: `navilynx://deal/${deal.id}`,
      });
    } catch (error) {
      console.error('Failed to share deal:', error);
    }
  };

  // Toggle favorite
  const toggleFavorite = (dealId: string) => {
    setFavoriteDeals(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dealId)) {
        newSet.delete(dealId);
      } else {
        newSet.add(dealId);
      }
      return newSet;
    });
  };

  // Refresh deals
  const onRefresh = () => {
    setRefreshing(true);
    loadDeals();
  };

  // Effects
  useEffect(() => {
    loadDeals();
  }, [loadDeals]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort]);

  // Render category filter chips
  const renderCategoryChips = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginVertical: 15 }}
      contentContainerStyle={{ paddingHorizontal: 20 }}
    >
      {categories.map(category => (
        <TouchableOpacity
          key={category}
          onPress={() => setSelectedCategory(category)}
          style={{
            backgroundColor: selectedCategory === category ? theme.primary : theme.card,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            marginRight: 10,
            borderWidth: 1,
            borderColor: selectedCategory === category ? theme.primary : theme.border,
          }}
        >
          <Text
            style={{
              color: selectedCategory === category ? theme.background : theme.text,
              fontWeight: selectedCategory === category ? '600' : '400',
              textTransform: 'capitalize',
            }}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  // Render deal card
  const renderDealCard = (deal: AdvancedDeal) => {
    const isClaimed = claimedDeals.has(deal.id);
    const isFavorite = favoriteDeals.has(deal.id);
    const isExpiringSoon = new Date(deal.validUntil).getTime() - Date.now() < 24 * 60 * 60 * 1000;
    const availabilityPercentage = deal.maxClaims ? (deal.claimCount / deal.maxClaims) * 100 : 0;

    return (
      <TouchableOpacity
        key={deal.id}
        onPress={() => setSelectedDeal(deal)}
        style={{
          backgroundColor: theme.card,
          borderRadius: 15,
          marginHorizontal: 20,
          marginBottom: 15,
          overflow: 'hidden',
          elevation: 3,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}
      >
        {/* Deal Image with Priority Badge */}
        <View style={{ position: 'relative' }}>
          <Image
            source={{ uri: deal.images[0] }}
            style={{ width: '100%', height: 200 }}
            resizeMode="cover"
          />
          
          {/* Priority Badge */}
          {deal.priority === 'featured' && (
            <View
              style={{
                position: 'absolute',
                top: 10,
                left: 10,
                backgroundColor: '#FFD700',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
              }}
            >
              <Text style={{ color: '#000', fontWeight: '600', fontSize: 12 }}>
                FEATURED
              </Text>
            </View>
          )}

          {/* Discount Badge */}
          <View
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              backgroundColor: theme.accent,
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 15,
            }}
          >
            <Text style={{ color: theme.background, fontWeight: 'bold', fontSize: 16 }}>
              -{deal.discountPercentage}%
            </Text>
          </View>

          {/* Favorite Button */}
          <TouchableOpacity
            onPress={() => toggleFavorite(deal.id)}
            style={{
              position: 'absolute',
              bottom: 10,
              right: 10,
              backgroundColor: 'rgba(0,0,0,0.5)',
              borderRadius: 20,
              padding: 8,
            }}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={isFavorite ? '#FF4757' : '#FFF'}
            />
          </TouchableOpacity>
        </View>

        {/* Deal Content */}
        <View style={{ padding: 15 }}>
          {/* Merchant Info */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ color: theme.textSecondary, fontSize: 14 }}>
              {deal.merchantInfo.name}
            </Text>
            {deal.merchantInfo.verified && (
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" style={{ marginLeft: 5 }} />
            )}
            <Text style={{ color: theme.textSecondary, fontSize: 12, marginLeft: 'auto' }}>
              {deal.venueName}
            </Text>
          </View>

          {/* Deal Title */}
          <Text style={{ color: theme.text, fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
            {deal.title}
          </Text>

          {/* Price Information */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Text
              style={{
                color: theme.textSecondary,
                fontSize: 16,
                textDecorationLine: 'line-through',
                marginRight: 8,
              }}
            >
              R{deal.originalPrice}
            </Text>
            <Text style={{ color: theme.accent, fontSize: 20, fontWeight: 'bold' }}>
              R{deal.discountedPrice}
            </Text>
          </View>

          {/* Distance and Rating */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            {deal.distance && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
                <Ionicons name="location-outline" size={16} color={theme.textSecondary} />
                <Text style={{ color: theme.textSecondary, fontSize: 14, marginLeft: 4 }}>
                  {deal.distance.toFixed(1)}km
                </Text>
              </View>
            )}
            
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={{ color: theme.textSecondary, fontSize: 14, marginLeft: 4 }}>
                {deal.rating} ({deal.reviewCount})
              </Text>
            </View>
          </View>

          {/* Availability Bar */}
          {deal.maxClaims && (
            <View style={{ marginBottom: 10 }}>
              <View
                style={{
                  height: 6,
                  backgroundColor: theme.border,
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    height: '100%',
                    width: `${availabilityPercentage}%`,
                    backgroundColor: availabilityPercentage > 80 ? '#FF4757' : '#4CAF50',
                  }}
                />
              </View>
              <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 4 }}>
                {deal.claimCount} of {deal.maxClaims} claimed
              </Text>
            </View>
          )}

          {/* Expiry Warning */}
          {isExpiringSoon && (
            <View
              style={{
                backgroundColor: '#FFF3CD',
                borderColor: '#FFEAA7',
                borderWidth: 1,
                borderRadius: 8,
                padding: 8,
                marginBottom: 10,
              }}
            >
              <Text style={{ color: '#856404', fontSize: 12, textAlign: 'center' }}>
                ⏰ Expires in less than 24 hours!
              </Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
              onPress={() => claimDeal(deal)}
              disabled={isClaimed}
              style={{
                backgroundColor: isClaimed ? theme.border : theme.primary,
                paddingHorizontal: 20,
                paddingVertical: 12,
                borderRadius: 25,
                flex: 1,
                marginRight: 10,
              }}
            >
              <Text
                style={{
                  color: isClaimed ? theme.textSecondary : theme.background,
                  fontWeight: '600',
                  textAlign: 'center',
                }}
              >
                {isClaimed ? 'Claimed ✓' : 'Claim Deal'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => shareDeal(deal)}
              style={{
                backgroundColor: theme.card,
                borderColor: theme.border,
                borderWidth: 1,
                paddingHorizontal: 15,
                paddingVertical: 12,
                borderRadius: 25,
              }}
            >
              <Ionicons name="share-outline" size={20} color={theme.text} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ color: theme.textSecondary, marginTop: 10 }}>Loading amazing deals...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Header with Search and Filters */}
      <View
        style={{
          backgroundColor: theme.card,
          paddingTop: 50,
          paddingBottom: 15,
          paddingHorizontal: 20,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
          <Text style={{ color: theme.text, fontSize: 24, fontWeight: 'bold', flex: 1 }}>
            Deals & Offers
          </Text>
          <TouchableOpacity
            onPress={() => setShowFilters(!showFilters)}
            style={{ padding: 8 }}
          >
            <Ionicons name="options-outline" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: theme.background,
            borderRadius: 25,
            paddingHorizontal: 15,
            paddingVertical: 10,
            alignItems: 'center',
          }}
        >
          <Ionicons name="search-outline" size={20} color={theme.textSecondary} />
          <TextInput
            placeholder="Search deals..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ flex: 1, marginLeft: 10, color: theme.text }}
          />
        </View>

        {/* Sort Options */}
        {showFilters && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 15 }}
          >
            {(['popularity', 'distance', 'discount', 'expiry'] as const).map(option => (
              <TouchableOpacity
                key={option}
                onPress={() => setSortBy(option)}
                style={{
                  backgroundColor: sortBy === option ? theme.primary : theme.background,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 15,
                  marginRight: 8,
                }}
              >
                <Text
                  style={{
                    color: sortBy === option ? theme.background : theme.text,
                    fontSize: 12,
                    textTransform: 'capitalize',
                  }}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Category Filters */}
      {renderCategoryChips()}

      {/* Deals List */}
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {filteredDeals.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Ionicons name="gift-outline" size={64} color={theme.textSecondary} />
            <Text style={{ color: theme.textSecondary, fontSize: 18, marginTop: 15 }}>
              No deals found
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: 14, textAlign: 'center', marginTop: 5 }}>
              Try adjusting your search or filters
            </Text>
          </View>
        ) : (
          filteredDeals.map(renderDealCard)
        )}

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Deal Detail Modal */}
      {selectedDeal && (
        <Modal
          visible={!!selectedDeal}
          animationType="slide"
          onRequestClose={() => setSelectedDeal(null)}
        >
          <View style={{ flex: 1, backgroundColor: theme.background }}>
            {/* Modal Header */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop: 50,
                paddingHorizontal: 20,
                paddingBottom: 15,
                backgroundColor: theme.card,
                borderBottomWidth: 1,
                borderBottomColor: theme.border,
              }}
            >
              <TouchableOpacity onPress={() => setSelectedDeal(null)}>
                <Ionicons name="close-outline" size={24} color={theme.text} />
              </TouchableOpacity>
              <Text style={{ color: theme.text, fontSize: 18, fontWeight: '600', marginLeft: 15 }}>
                Deal Details
              </Text>
            </View>

            <ScrollView style={{ flex: 1 }}>
              {/* Deal Image */}
              <Image
                source={{ uri: selectedDeal.images[0] }}
                style={{ width: '100%', height: 250 }}
                resizeMode="cover"
              />

              <View style={{ padding: 20 }}>
                {/* Deal Title and Description */}
                <Text style={{ color: theme.text, fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
                  {selectedDeal.title}
                </Text>
                
                <Text style={{ color: theme.textSecondary, fontSize: 16, lineHeight: 24, marginBottom: 20 }}>
                  {selectedDeal.description}
                </Text>

                {/* Terms and Conditions */}
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ color: theme.text, fontSize: 18, fontWeight: '600', marginBottom: 10 }}>
                    Terms & Conditions
                  </Text>
                  <Text style={{ color: theme.textSecondary, fontSize: 14, lineHeight: 20 }}>
                    {selectedDeal.terms}
                  </Text>
                </View>

                {/* QR Code Section */}
                {selectedDeal.qrCode && (
                  <View
                    style={{
                      backgroundColor: theme.card,
                      borderRadius: 15,
                      padding: 20,
                      alignItems: 'center',
                      marginBottom: 20,
                    }}
                  >
                    <Text style={{ color: theme.text, fontSize: 16, fontWeight: '600', marginBottom: 10 }}>
                      Show this code at the store:
                    </Text>
                    <Text
                      style={{
                        color: theme.primary,
                        fontSize: 24,
                        fontWeight: 'bold',
                        fontFamily: 'monospace',
                      }}
                    >
                      {selectedDeal.qrCode}
                    </Text>
                  </View>
                )}

                {/* Action Buttons */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <TouchableOpacity
                    onPress={() => {
                      claimDeal(selectedDeal);
                      setSelectedDeal(null);
                    }}
                    style={{
                      backgroundColor: theme.primary,
                      paddingHorizontal: 30,
                      paddingVertical: 15,
                      borderRadius: 25,
                      flex: 1,
                      marginRight: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: theme.background,
                        fontWeight: '600',
                        textAlign: 'center',
                        fontSize: 16,
                      }}
                    >
                      Claim Deal
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      shareDeal(selectedDeal);
                      setSelectedDeal(null);
                    }}
                    style={{
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                      borderWidth: 1,
                      paddingHorizontal: 20,
                      paddingVertical: 15,
                      borderRadius: 25,
                    }}
                  >
                    <Ionicons name="share-outline" size={20} color={theme.text} />
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default DealsScreen;
