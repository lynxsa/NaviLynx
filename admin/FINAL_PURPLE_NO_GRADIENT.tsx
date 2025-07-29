/**
 * FINAL PURPLE SHOP ASSISTANT - NO GRADIENTS
 * Direct replacement for /NaviLynx/app/(tabs)/shop-assistant.tsx
 * 
 * DEPLOYMENT: Copy this entire content to replace the shop-assistant.tsx file
 * RESULT: Purple theme, no blue-orange gradients anywhere
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  SafeAreaView,
  RefreshControl,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import * as Haptics from 'expo-haptics';

// PURPLE THEME - NO GRADIENTS
const PURPLE_COLORS = {
  primary: '#9333EA',      // Main purple
  primaryLight: '#A855F7', // Light purple
  primaryDark: '#7C3AED',  // Dark purple
  accent: '#C084FC',       // Purple accent
  violet: '#8B5CF6',       // Violet
  background: '#F8FAFC',   // Light background
  cardBackground: '#FFFFFF', // White cards
  text: '#1E293B',         // Dark text
  textSecondary: '#64748B', // Gray text
};

const { width } = Dimensions.get('window');

// Mock services (replace with actual implementations)
const shopService = {
  getShoppingLists: async () => [
    { id: '1', name: 'Weekly Groceries', items: 8, category: 'Food' },
    { id: '2', name: 'Electronics Wishlist', items: 3, category: 'Tech' }
  ],
  getRecommendations: async () => [
    { id: '1', title: 'Try Local SA Brands', description: 'Consider Jungle Oats instead of imported cereals', confidence: 0.85 },
    { id: '2', title: 'Shop at Pick n Pay for Basics', description: 'Your grocery staples are typically 15% cheaper here', confidence: 0.92 }
  ],
  formatPrice: (price: number) => `R${price.toFixed(2)}`
};

const scannerService = {
  captureProductImage: async () => ({ success: true, imageUri: 'mock-uri' }),
  selectImageFromLibrary: async () => ({ success: true, imageUri: 'mock-uri' }),
  scanProductFromImage: async (imageUri: string) => ({
    success: true,
    product: { id: '1', name: 'Sample Product', price: 299.99, category: 'Electronics' }
  })
};

export default function ShopAssistantScreen() {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [scanModalVisible, setScanModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shoppingLists, setShoppingLists] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [insights, setInsights] = useState<any>(null);
  const [lastScanResult, setLastScanResult] = useState<any>(null);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadInitialData();
    startAnimations();
  }, []);

  const startAnimations = () => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
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
  }, []);

  const loadRecommendations = useCallback(async () => {
    try {
      const recs = await shopService.getRecommendations();
      setRecommendations(recs);
    } catch {
      // Handle error silently
    }
  }, []);

  const loadInsights = useCallback(async () => {
    try {
      setInsights({
        totalScans: 47,
        moneySaved: 1250,
        topCategory: 'Groceries',
        averageDiscount: 18
      });
    } catch {
      // Handle error silently
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  }, [loadInitialData]);

  const handleQuickAction = useCallback(async (action: string, navigation?: () => void) => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
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
  }, []);

  const handleCameraScan = async () => {
    try {
      setScanModalVisible(false);
      setIsLoading(true);
      
      const imageResult = await scannerService.captureProductImage();
      
      if (!imageResult.success || !imageResult.imageUri) {
        Alert.alert('Error', 'Failed to capture image. Please try again.');
        return;
      }

      const scanResult = await scannerService.scanProductFromImage(imageResult.imageUri);
      setLastScanResult(scanResult);

      if (scanResult.success && scanResult.product) {
        Alert.alert(
          'Product Scanned!',
          `Found: ${scanResult.product.name}\nPrice: ${shopService.formatPrice(scanResult.product.price)}`,
          [
            { text: 'Add to List', onPress: () => handleAddScannedProduct(scanResult.product) },
            { text: 'Compare Prices', onPress: () => handleComparePrice(scanResult.product) },
            { text: 'AI Insights', onPress: () => handleProductInsights(scanResult.product) },
            { text: 'OK' }
          ]
        );
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert('Scan Results', scanResult.message || 'Could not identify the product. Try adjusting lighting or angle.');
      }
    } catch (error) {
      console.error('Camera scan error:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Scan Error', 'Failed to scan product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLibraryScan = async () => {
    try {
      setScanModalVisible(false);
      setIsLoading(true);
      
      const imageResult = await scannerService.selectImageFromLibrary();
      if (!imageResult.success) {
        Alert.alert('Error', 'Failed to select image.');
        return;
      }

      const scanResult = await scannerService.scanProductFromImage(imageResult.imageUri!);
      setLastScanResult(scanResult);

      if (scanResult.success && scanResult.product) {
        Alert.alert(
          'Product Scanned!',
          `Found: ${scanResult.product.name}\nPrice: ${shopService.formatPrice(scanResult.product.price)}`,
          [
            { text: 'Add to List', onPress: () => handleAddScannedProduct(scanResult.product) },
            { text: 'Compare Prices', onPress: () => handleComparePrice(scanResult.product) },
            { text: 'OK' }
          ]
        );
      } else {
        Alert.alert('Scan Results', scanResult.message || 'Could not identify the product.');
      }
    } catch (error) {
      console.error('Library scan error:', error);
      Alert.alert('Scan Error', 'Failed to scan product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductInsights = async (product: any) => {
    try {
      setIsLoading(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      const insights = {
        priceTrend: 'Decreasing 📉',
        rating: '4.2',
        bestStore: 'Pick n Pay',
        recommendation: 'Good time to buy - price dropped 15% this week!'
      };
      
      Alert.alert(
        'AI Product Insights',
        `📈 Price Trend: ${insights.priceTrend}\n⭐ User Rating: ${insights.rating}/5\n🏪 Best Store: ${insights.bestStore}\n💡 Recommendation: ${insights.recommendation}`
      );
    } catch (error) {
      console.error('Product insights error:', error);
      Alert.alert('AI Insights', 'Insights temporarily unavailable. Try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddScannedProduct = async (product: any) => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', `${product.name} added to your shopping list!`);
    } catch (error) {
      Alert.alert('Error', 'Failed to add product to list.');
    }
  };

  const handleComparePrice = async (product: any) => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      Alert.alert('Price Comparison', `Comparing prices for ${product.name}...`);
    } catch (error) {
      Alert.alert('Error', 'Failed to compare prices.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: PURPLE_COLORS.background }}>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* PURPLE HEADER - NO GRADIENT */}
        <View style={{
          backgroundColor: PURPLE_COLORS.primary,
          paddingHorizontal: 20,
          paddingVertical: 24,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
        }}>
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
          }}>
            Smart shopping with AI-powered insights
          </Text>
        </View>

        {/* Quick Actions */}
        <Animated.View style={{ 
          padding: 20,
          opacity: fadeAnim,
        }}>
          <Text style={{
            fontSize: 22,
            fontWeight: '700',
            color: PURPLE_COLORS.text,
            marginBottom: 8,
          }}>
            🚀 Quick Actions
          </Text>
          <Text style={{
            fontSize: 14,
            color: PURPLE_COLORS.textSecondary,
            marginBottom: 16,
          }}>
            AI-powered shopping tools at your fingertips
          </Text>
          
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 16,
          }}>
            {/* Smart Scan - Purple Solid */}
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity
                onPress={() => handleQuickAction('scan')}
                style={{
                  backgroundColor: PURPLE_COLORS.cardBackground,
                  borderRadius: 20,
                  padding: 20,
                  alignItems: 'center',
                  minWidth: (width - 60) / 2,
                  shadowColor: PURPLE_COLORS.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <View style={{
                  backgroundColor: PURPLE_COLORS.primary,
                  borderRadius: 28,
                  width: 56,
                  height: 56,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                }}>
                  <Ionicons name="scan" size={28} color="white" />
                </View>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: PURPLE_COLORS.text,
                  textAlign: 'center',
                }}>
                  🎯 Smart Scan
                </Text>
                <Text style={{
                  fontSize: 12,
                  color: PURPLE_COLORS.textSecondary,
                  textAlign: 'center',
                  marginTop: 4,
                }}>
                  AI product recognition
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* AI Assistant - Purple Solid */}
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity
                onPress={() => handleQuickAction('chat')}
                style={{
                  backgroundColor: PURPLE_COLORS.cardBackground,
                  borderRadius: 20,
                  padding: 20,
                  alignItems: 'center',
                  minWidth: (width - 60) / 2,
                  shadowColor: PURPLE_COLORS.accent,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <View style={{
                  backgroundColor: PURPLE_COLORS.accent,
                  borderRadius: 28,
                  width: 56,
                  height: 56,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                }}>
                  <Ionicons name="chatbubble-ellipses" size={28} color="white" />
                </View>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: PURPLE_COLORS.text,
                  textAlign: 'center',
                }}>
                  🤖 AI Assistant
                </Text>
                <Text style={{
                  fontSize: 12,
                  color: PURPLE_COLORS.textSecondary,
                  textAlign: 'center',
                  marginTop: 4,
                }}>
                  Smart shopping advice
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Hot Deals - Purple Solid */}
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity
                onPress={() => handleQuickAction('deals')}
                style={{
                  backgroundColor: PURPLE_COLORS.cardBackground,
                  borderRadius: 20,
                  padding: 20,
                  alignItems: 'center',
                  minWidth: (width - 60) / 2,
                  shadowColor: PURPLE_COLORS.violet,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <View style={{
                  backgroundColor: PURPLE_COLORS.violet,
                  borderRadius: 28,
                  width: 56,
                  height: 56,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                }}>
                  <Ionicons name="flame" size={28} color="white" />
                </View>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: PURPLE_COLORS.text,
                  textAlign: 'center',
                }}>
                  🔥 Hot Deals
                </Text>
                <Text style={{
                  fontSize: 12,
                  color: PURPLE_COLORS.textSecondary,
                  textAlign: 'center',
                  marginTop: 4,
                }}>
                  Curated savings
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Find Stores - Purple Solid */}
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity
                onPress={() => handleQuickAction('stores')}
                style={{
                  backgroundColor: PURPLE_COLORS.cardBackground,
                  borderRadius: 20,
                  padding: 20,
                  alignItems: 'center',
                  minWidth: (width - 60) / 2,
                  shadowColor: PURPLE_COLORS.primaryDark,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <View style={{
                  backgroundColor: PURPLE_COLORS.primaryDark,
                  borderRadius: 28,
                  width: 56,
                  height: 56,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                }}>
                  <Ionicons name="storefront" size={28} color="white" />
                </View>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: PURPLE_COLORS.text,
                  textAlign: 'center',
                }}>
                  🏪 Find Stores
                </Text>
                <Text style={{
                  fontSize: 12,
                  color: PURPLE_COLORS.textSecondary,
                  textAlign: 'center',
                  marginTop: 4,
                }}>
                  AR navigation ready
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>

        {/* Smart Recommendations */}
        {recommendations.length > 0 && (
          <Animated.View style={{ 
            paddingHorizontal: 20, 
            marginBottom: 20,
            opacity: fadeAnim,
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: '600',
              color: PURPLE_COLORS.text,
              marginBottom: 16,
            }}>
              Smart Recommendations
            </Text>
            
            {recommendations.map((rec, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  backgroundColor: PURPLE_COLORS.cardBackground,
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: PURPLE_COLORS.primary,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 4,
                }}
              >
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 8,
                }}>
                  <View style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: PURPLE_COLORS.primary + '20',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                  }}>
                    <Ionicons name="bulb" size={14} color={PURPLE_COLORS.primary} />
                  </View>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: PURPLE_COLORS.text,
                    flex: 1,
                  }}>
                    {rec.title}
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    color: PURPLE_COLORS.primary,
                    fontWeight: '600',
                  }}>
                    {Math.round(rec.confidence * 100)}% sure
                  </Text>
                </View>
                <Text style={{
                  fontSize: 14,
                  color: PURPLE_COLORS.textSecondary,
                  lineHeight: 20,
                }}>
                  {rec.description}
                </Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}

        {/* Popular South African Stores */}
        <Animated.View style={{ 
          padding: 20,
          opacity: fadeAnim,
        }}>
          <Text style={{
            fontSize: 20,
            fontWeight: '600',
            color: PURPLE_COLORS.text,
            marginBottom: 16,
          }}>
            Popular Stores
          </Text>

          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
          }}>
            {[
              { name: 'Woolworths', icon: '🛒', deals: 23, color: PURPLE_COLORS.primary },
              { name: 'Pick n Pay', icon: '🏪', deals: 18, color: PURPLE_COLORS.accent },
              { name: 'Checkers', icon: '🛍️', deals: 15, color: PURPLE_COLORS.violet },
              { name: 'Shoprite', icon: '🏬', deals: 12, color: PURPLE_COLORS.primaryDark }
            ].map((store, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  backgroundColor: PURPLE_COLORS.cardBackground,
                  borderRadius: 16,
                  padding: 16,
                  alignItems: 'center',
                  minWidth: (width - 60) / 2,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 4,
                }}
              >
                <Text style={{ fontSize: 24, marginBottom: 8 }}>{store.icon}</Text>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: PURPLE_COLORS.text,
                  textAlign: 'center',
                }}>
                  {store.name}
                </Text>
                <View style={{
                  backgroundColor: store.color + '20',
                  borderRadius: 8,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  marginTop: 8,
                }}>
                  <Text style={{
                    fontSize: 12,
                    color: store.color,
                    fontWeight: '600',
                  }}>
                    {store.deals} deals
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* AI Recommendation Badge */}
          <View style={{
            backgroundColor: PURPLE_COLORS.primary + '15',
            borderRadius: 12,
            padding: 12,
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 16,
          }}>
            <Ionicons name="sparkles" size={16} color={PURPLE_COLORS.primary} />
            <Text style={{
              fontSize: 14,
              color: PURPLE_COLORS.primary,
              fontWeight: '600',
              marginLeft: 8,
              flex: 1,
            }}>
              AI Tip: Best shopping time is Tuesday 2-4PM for maximum savings!
            </Text>
          </View>
        </Animated.View>

      </ScrollView>

      {/* Scan Modal - Purple Theme */}
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
            backgroundColor: PURPLE_COLORS.cardBackground,
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
              color: PURPLE_COLORS.text,
              textAlign: 'center',
              marginBottom: 24,
            }}>
              🎯 AI Product Scanner
            </Text>
            
            <TouchableOpacity
              onPress={handleCameraScan}
              style={{
                backgroundColor: PURPLE_COLORS.primary,
                borderRadius: 16,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <Ionicons name="camera" size={24} color="white" />
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: 'white',
                marginLeft: 12,
              }}>
                📸 Take Photo
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleLibraryScan}
              style={{
                backgroundColor: PURPLE_COLORS.accent,
                borderRadius: 16,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 24,
              }}
            >
              <Ionicons name="images" size={24} color="white" />
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: 'white',
                marginLeft: 12,
              }}>
                🖼️ Choose from Gallery
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setScanModalVisible(false)}
              style={{
                backgroundColor: PURPLE_COLORS.textSecondary,
                borderRadius: 16,
                padding: 16,
                alignItems: 'center',
              }}
            >
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: 'white',
              }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
