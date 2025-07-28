import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Modal, 
  Alert,
  RefreshControl,
  Dimensions,
  StyleSheet,
  Animated,
  Easing
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

import ShopAssistantService, {
  ShoppingList,
  ShoppingRecommendation,
  Product
} from '@/services/ShopAssistantService';
import ProductScannerService from '@/services/ProductScannerService';
import PriceComparisonService from '@/services/PriceComparisonService';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function ShopAssistantScreen() {
  const { colors, isDark } = useTheme();
  const { t } = useLanguage();
  const router = useRouter();
  
  // Services
  const [shopService] = useState(() => ShopAssistantService.getInstance());
  const [scannerService] = useState(() => ProductScannerService.getInstance());
  const [priceService] = useState(() => PriceComparisonService.getInstance());
  
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [scanModalVisible, setScanModalVisible] = useState(false);
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [recommendations, setRecommendations] = useState<ShoppingRecommendation[]>([]);
  const [insights, setInsights] = useState<any>(null);
  const [lastScanResult, setLastScanResult] = useState<any>(null);
  
  // Enhanced Animation Values for Phase 1 Day 6-7
  const [pulseAnim] = useState(new Animated.Value(1));
  const [slideAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));

  // Enhanced Quick Action with Haptic Feedback
  const handleQuickAction = async (action: string, navigation?: () => void) => {
    try {
      // Haptic feedback for premium UX
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // Button pulse animation
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.95,
          duration: 100,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 100,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();

      // Execute action
      switch (action) {
        case 'scan':
          setScanModalVisible(true);
          break;
        case 'chat':
          router.push('/chat/smart-assistant');
          break;
        case 'deals':
          router.push('/deal-details/featured');
          break;
        case 'stores':
          router.push('/venue/stores');
          break;
        default:
          if (navigation) navigation();
      }
    } catch (error) {
      console.error('Quick action error:', error);
    }
  };

  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadShoppingLists(),
        loadRecommendations(),
        loadInsights()
      ]);
    } catch {
      // Handle error silently
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadShoppingLists = useCallback(async () => {
    try {
      const lists = await shopService.getShoppingLists();
      setShoppingLists(lists);
    } catch {
      // Handle error silently
    }
  }, [shopService]);

  const loadRecommendations = useCallback(async () => {
    try {
      const recs = await shopService.getShoppingRecommendations({
        budget: 1000,
        preferences: ['local-brands', 'value']
      });
      setRecommendations(recs);
    } catch {
      // Handle error silently
    }
  }, [shopService]);

  const loadInsights = useCallback(async () => {
    try {
      const data = await shopService.getShoppingInsights();
      setInsights(data);
    } catch {
      // Handle error silently
    }
  }, [shopService]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };

  // Scanning Functions
  const handleCameraScan = async () => {
    try {
      setScanModalVisible(false);
      setIsLoading(true);
      
      // Enhanced haptic feedback for scanning
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      const imageResult = await scannerService.captureProductImage();
      if (!imageResult.success) {
        Alert.alert('Camera Error', imageResult.error || 'Failed to capture image');
        return;
      }

      const scanResult = await scannerService.scanProductFromImage(imageResult.imageUri!);
      setLastScanResult(scanResult);
      
      if (scanResult.success && scanResult.product) {
        // Enhanced success feedback
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        Alert.alert(
          '🎯 Product Identified!',
          `Found: ${scanResult.product.name}
💡 Confidence: ${Math.round(scanResult.confidence * 100)}%
�️ Category: ${scanResult.product.category}`,
          [
            { text: '📊 View Prices', onPress: () => handleViewPrices(scanResult.product!) },
            { text: '➕ Add to List', onPress: () => handleAddToList(scanResult.product!) },
            { text: '✨ AI Insights', onPress: () => handleProductInsights(scanResult.product!) },
            { text: 'OK' }
          ]
        );
      } else {
        // Enhanced error feedback
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert('🔍 Scan Results', scanResult.message || 'Could not identify the product. Try adjusting lighting or angle.');
      }
    } catch (error) {
      console.error('Camera scan error:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('❌ Scan Error', 'Failed to scan product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // New AI-powered product insights
  const handleProductInsights = async (product: Product) => {
    try {
      setIsLoading(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      // Enhanced AI analysis simulation
      const insights = {
        priceTrend: 'Decreasing 📉',
        rating: '4.2',
        bestStore: 'Pick n Pay',
        recommendation: 'Good time to buy - price dropped 15% this week!'
      };
      
      Alert.alert(
        '🤖 AI Product Insights',
        `📈 Price Trend: ${insights.priceTrend}
⭐ User Rating: ${insights.rating}/5
🏪 Best Store: ${insights.bestStore}
💡 Recommendation: ${insights.recommendation}`
      );
    } catch (error) {
      console.error('Product insights error:', error);
      Alert.alert('AI Insights', 'Insights temporarily unavailable. Try again later.');
    } finally {
      setIsLoading(false);
    }
  };  const handleLibraryScan = async () => {
    try {
      setScanModalVisible(false);
      setIsLoading(true);
      
      const imageResult = await scannerService.selectImageFromLibrary();
      if (!imageResult.success) {
        Alert.alert('Image Error', imageResult.error || 'Failed to select image');
        return;
      }

      const scanResult = await scannerService.scanProductFromImage(imageResult.imageUri!);
      
      if (scanResult.success && scanResult.product) {
        Alert.alert(
          'Product Identified!',
          `Found: ${scanResult.product.name}
Confidence: ${Math.round(scanResult.confidence * 100)}%`,
          [
            { text: 'View Prices', onPress: () => handleViewPrices(scanResult.product!) },
            { text: 'Add to List', onPress: () => handleAddToList(scanResult.product!) },
            { text: 'OK' }
          ]
        );
      } else {
        Alert.alert('Identification Failed', scanResult.message);
      }
    } catch {
      Alert.alert('Error', 'Failed to identify product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewPrices = async (product: Product) => {
    try {
      setIsLoading(true);
      const comparison = await shopService.compareProductPrices(product.id);
      
      const priceInfo = comparison.map(price => 
        `${price.storeName}: ${shopService.formatPrice(price.price)}`
      ).join('\n');
      
      Alert.alert(
        'Price Comparison',
        `${product.name}

${priceInfo}`
      );
    } catch {
      Alert.alert('Error', 'Failed to compare prices');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToList = async (product: Product) => {
    try {
      if (shoppingLists.length === 0) {
        const newList = await shopService.createShoppingList('My Shopping List');
        setShoppingLists([newList]);
        
        await shopService.addItemToList(newList.id, {
          productId: product.id,
          name: product.name,
          quantity: 1,
          unit: 'item',
          category: product.category,
          priority: 'medium',
          estimatedPrice: product.avgPrice,
          isCompleted: false
        });
      } else {
        await shopService.addItemToList(shoppingLists[0].id, {
          productId: product.id,
          name: product.name,
          quantity: 1,
          unit: 'item',
          category: product.category,
          priority: 'medium',
          estimatedPrice: product.avgPrice,
          isCompleted: false
        });
      }
      
      await loadShoppingLists();
      Alert.alert('Success', `${product.name} added to shopping list!`);
    } catch {
      Alert.alert('Error', 'Failed to add item to list');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          style={{
            paddingHorizontal: 20,
            paddingVertical: 24,
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
          }}
        >
          <Text style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 8,
          }}>
            AI Shop Assistant
          </Text>
          <Text style={{
            fontSize: 16,
            color: 'rgba(255, 255, 255, 0.9)',
            opacity: 0.9,
          }}>
            Smart shopping with AI-powered insights
          </Text>
        </LinearGradient>

        {/* Enhanced Quick Actions with Animations */}
        <View style={{ padding: 20 }}>
          <Text style={{
            fontSize: 22,
            fontWeight: '700',
            color: colors.text,
            marginBottom: 8,
          }}>
            🚀 Quick Actions
          </Text>
          <Text style={{
            fontSize: 14,
            color: colors.textSecondary,
            marginBottom: 16,
          }}>
            AI-powered shopping tools at your fingertips
          </Text>
          
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
          }}>
            {/* Enhanced Product Scanner */}
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity
                onPress={() => handleQuickAction('scan')}
                style={{
                  backgroundColor: colors.cardBackground,
                  borderRadius: 20,
                  padding: 20,
                  alignItems: 'center',
                  minWidth: (width - 60) / 2,
                  shadowColor: colors.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                  elevation: 6,
                  borderWidth: 1,
                  borderColor: colors.primary + '20',
                }}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[colors.primary, colors.secondary]}
                  style={{
                    borderRadius: 28,
                    width: 56,
                    height: 56,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12,
                  }}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="scan" size={28} color="white" />
                </LinearGradient>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: colors.text,
                  textAlign: 'center',
                }}>
                  🎯 Smart Scan
                </Text>
                <Text style={{
                  fontSize: 12,
                  color: colors.textSecondary,
                  textAlign: 'center',
                  marginTop: 4,
                }}>
                  AI product recognition
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Enhanced AI Chat */}
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity
                onPress={() => handleQuickAction('chat')}
                style={{
                  backgroundColor: colors.cardBackground,
                  borderRadius: 20,
                  padding: 20,
                  alignItems: 'center',
                  minWidth: (width - 60) / 2,
                  shadowColor: colors.secondary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                  elevation: 6,
                  borderWidth: 1,
                  borderColor: colors.secondary + '20',
                }}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[colors.secondary, colors.accent]}
                  style={{
                    borderRadius: 28,
                    width: 56,
                    height: 56,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12,
                  }}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="chatbubble-ellipses" size={28} color="white" />
                </LinearGradient>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: colors.text,
                  textAlign: 'center',
                }}>
                  🤖 AI Assistant
                </Text>
                <Text style={{
                  fontSize: 12,
                  color: colors.textSecondary,
                  textAlign: 'center',
                  marginTop: 4,
                }}>
                  Smart shopping advice
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Enhanced Deals Browser */}
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity
                onPress={() => handleQuickAction('deals')}
                style={{
                  backgroundColor: colors.cardBackground,
                  borderRadius: 20,
                  padding: 20,
                  alignItems: 'center',
                  minWidth: (width - 60) / 2,
                  shadowColor: colors.accent,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                  elevation: 6,
                  borderWidth: 1,
                  borderColor: colors.accent + '20',
                }}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[colors.accent, colors.warning]}
                  style={{
                    borderRadius: 28,
                    width: 56,
                    height: 56,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12,
                  }}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="pricetag" size={28} color="white" />
                </LinearGradient>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: colors.text,
                  textAlign: 'center',
                }}>
                  💎 Hot Deals
                </Text>
                <Text style={{
                  fontSize: 12,
                  color: colors.textSecondary,
                  textAlign: 'center',
                  marginTop: 4,
                }}>
                  Curated savings
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Enhanced Store Finder */}
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity
                onPress={() => handleQuickAction('stores')}
                style={{
                  backgroundColor: colors.cardBackground,
                  borderRadius: 20,
                  padding: 20,
                  alignItems: 'center',
                  minWidth: (width - 60) / 2,
                  shadowColor: colors.success,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                  elevation: 6,
                  borderWidth: 1,
                  borderColor: colors.success + '20',
                }}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[colors.success, colors.primary]}
                  style={{
                    borderRadius: 28,
                    width: 56,
                    height: 56,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12,
                  }}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="storefront" size={28} color="white" />
                </LinearGradient>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: colors.text,
                  textAlign: 'center',
                }}>
                  🏪 Find Stores
                </Text>
                <Text style={{
                  fontSize: 12,
                  color: colors.textSecondary,
                  textAlign: 'center',
                  marginTop: 4,
                }}>
                  AR navigation ready
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>

        {/* Shopping Lists Summary */}
        {shoppingLists.length > 0 && (
          <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}>
              <Text style={{
                fontSize: 20,
                fontWeight: '600',
                color: colors.text,
              }}>
                Your Lists
              </Text>
              <TouchableOpacity onPress={() => Alert.alert('Coming Soon', 'Shopping lists view coming soon!')}>
                <Text style={{ color: colors.primary, fontWeight: '500' }}>
                  View All
                </Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {shoppingLists.slice(0, 3).map(list => (
                <TouchableOpacity
                  key={list.id}
                  onPress={() => Alert.alert('Coming Soon', 'Shopping lists view coming soon!')}
                  style={{
                    backgroundColor: colors.cardBackground,
                    borderRadius: 12,
                    padding: 16,
                    marginRight: 12,
                    minWidth: 160,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 2,
                  }}
                >
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: colors.text,
                    marginBottom: 8,
                  }}>
                    {list.name}
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: colors.textSecondary,
                    marginBottom: 4,
                  }}>
                    {list.items.length} items
                  </Text>
                  {list.estimatedTotal && (
                    <Text style={{
                      fontSize: 14,
                      color: colors.primary,
                      fontWeight: '500',
                    }}>
                      ~R {list.estimatedTotal.toFixed(2)}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* AI Recommendations */}
        {recommendations.length > 0 && (
          <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
            <Text style={{
              fontSize: 20,
              fontWeight: '600',
              color: colors.text,
              marginBottom: 16,
            }}>
              Smart Recommendations
            </Text>
            
            {recommendations.slice(0, 3).map((rec, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: colors.cardBackground,
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: colors.primary,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  elevation: 2,
                }}
              >
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 8,
                }}>
                  <Ionicons 
                    name="bulb" 
                    size={20} 
                    color={colors.primary} 
                    style={{ marginRight: 8 }}
                  />
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: colors.text,
                    flex: 1,
                  }}>
                    {rec.title}
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    color: colors.textSecondary,
                    backgroundColor: colors.background,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 8,
                  }}>
                    {Math.round(rec.confidence * 100)}% sure
                  </Text>
                </View>
                <Text style={{
                  fontSize: 14,
                  color: colors.textSecondary,
                  lineHeight: 20,
                }}>
                  {rec.description}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Enhanced AI Insights Dashboard */}
        {insights && (
          <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 16,
            }}>
              <LinearGradient
                colors={[colors.primary, colors.secondary]}
                style={{
                  borderRadius: 12,
                  width: 36,
                  height: 36,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="analytics" size={20} color="white" />
              </LinearGradient>
              <Text style={{
                fontSize: 22,
                fontWeight: '700',
                color: colors.text,
              }}>
                📊 Smart Insights
              </Text>
            </View>
            
            <View style={{
              backgroundColor: colors.cardBackground,
              borderRadius: 20,
              padding: 20,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 8,
              borderWidth: 1,
              borderColor: colors.primary + '10',
            }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 20,
              }}>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={{
                    fontSize: 28,
                    fontWeight: '800',
                    color: colors.primary,
                  }}>
                    R{insights.monthlySpend?.toFixed(0) || '0'}
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    color: colors.textSecondary,
                    textAlign: 'center',
                    marginTop: 4,
                  }}>
                    💳 This Month
                  </Text>
                </View>
                
                <View style={{
                  width: 1,
                  backgroundColor: colors.border,
                  marginHorizontal: 16,
                }} />
                
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={{
                    fontSize: 28,
                    fontWeight: '800',
                    color: colors.success,
                  }}>
                    R{insights.totalSavings?.toFixed(0) || '0'}
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    color: colors.textSecondary,
                    textAlign: 'center',
                    marginTop: 4,
                  }}>
                    💰 Total Saved
                  </Text>
                </View>
                
                <View style={{
                  width: 1,
                  backgroundColor: colors.border,
                  marginHorizontal: 16,
                }} />
                
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={{
                    fontSize: 20,
                    fontWeight: '700',
                    color: colors.text,
                    textAlign: 'center',
                  }}>
                    {insights.favoriteStore || '🏪'}
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    color: colors.textSecondary,
                    textAlign: 'center',
                    marginTop: 4,
                  }}>
                    🌟 Top Store
                  </Text>
                </View>
              </View>
              
              {/* AI Recommendation Badge */}
              <View style={{
                backgroundColor: colors.primary + '15',
                borderRadius: 12,
                padding: 12,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <Ionicons name="sparkles" size={16} color={colors.primary} />
                <Text style={{
                  fontSize: 14,
                  color: colors.primary,
                  fontWeight: '600',
                  marginLeft: 8,
                  flex: 1,
                }}>
                  AI Tip: Best shopping time is Tuesday 2-4PM for maximum savings!
                </Text>
              </View>
            </View>
          </View>
        )}

      </ScrollView>

      {/* Enhanced Scan Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={scanModalVisible}
        onRequestClose={() => setScanModalVisible(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
          <View style={{
            backgroundColor: colors.cardBackground,
            borderRadius: 20,
            padding: 24,
            width: width * 0.85,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 8,
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: colors.text,
              textAlign: 'center',
              marginBottom: 24,
            }}>
              🎯 AI Product Scanner
            </Text>
            
            <TouchableOpacity
              onPress={handleCameraScan}
              style={{
                backgroundColor: colors.primary,
                borderRadius: 12,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
              }}
            >
              <Ionicons name="camera" size={24} color="white" style={{ marginRight: 8 }} />
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: 'white',
              }}>
                📸 Take Photo
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleLibraryScan}
              style={{
                backgroundColor: colors.secondary,
                borderRadius: 12,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24,
              }}
            >
              <Ionicons name="images" size={24} color="white" style={{ marginRight: 8 }} />
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: 'white',
              }}>
                🖼️ Choose from Gallery
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setScanModalVisible(false)}
              style={{
                backgroundColor: colors.background,
                borderRadius: 12,
                padding: 16,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Text style={{
                fontSize: 16,
                color: colors.textSecondary,
              }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Enhanced Loading Overlay */}
      {isLoading && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: colors.cardBackground,
            borderRadius: 12,
            padding: 24,
            alignItems: 'center',
          }}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <Ionicons name="hourglass" size={32} color={colors.primary} />
            </Animated.View>
            <Text style={{
              fontSize: 16,
              color: colors.text,
              marginTop: 12,
            }}>
              🤖 AI Processing...
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
