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
  StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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
      
      const imageResult = await scannerService.captureProductImage();
      if (!imageResult.success) {
        Alert.alert('Camera Error', imageResult.error || 'Failed to capture image');
        return;
      }

      const scanResult = await scannerService.scanProductFromImage(imageResult.imageUri!);
      
      if (scanResult.success && scanResult.product) {
        Alert.alert(
          'Product Scanned!',
          `Found: ${scanResult.product.name}
Confidence: ${Math.round(scanResult.confidence * 100)}%`,
          [
            { text: 'View Prices', onPress: () => handleViewPrices(scanResult.product!) },
            { text: 'Add to List', onPress: () => handleAddToList(scanResult.product!) },
            { text: 'OK' }
          ]
        );
      } else {
        Alert.alert('Scan Failed', scanResult.message);
      }
    } catch {
      Alert.alert('Error', 'Failed to scan product');
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

        {/* Quick Actions */}
        <View style={{ padding: 20 }}>
          <Text style={{
            fontSize: 20,
            fontWeight: '600',
            color: colors.text,
            marginBottom: 16,
          }}>
            Quick Actions
          </Text>
          
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
          }}>
            {/* Product Scanner */}
            <TouchableOpacity
              onPress={() => setScanModalVisible(true)}
              style={{
                backgroundColor: colors.cardBackground,
                borderRadius: 16,
                padding: 16,
                alignItems: 'center',
                minWidth: (width - 60) / 2,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <View style={{
                backgroundColor: colors.primary,
                borderRadius: 24,
                width: 48,
                height: 48,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
              }}>
                <Ionicons name="scan" size={24} color="white" />
              </View>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: colors.text,
                textAlign: 'center',
              }}>
                Scan Product
              </Text>
              <Text style={{
                fontSize: 12,
                color: colors.textSecondary,
                textAlign: 'center',
                marginTop: 4,
              }}>
                Camera or library
              </Text>
            </TouchableOpacity>

            {/* Price Comparison */}
            <TouchableOpacity
              onPress={() => Alert.alert('Coming Soon', 'Price alerts feature coming soon!')}
              style={{
                backgroundColor: colors.cardBackground,
                borderRadius: 16,
                padding: 16,
                alignItems: 'center',
                minWidth: (width - 60) / 2,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <View style={{
                backgroundColor: colors.secondary,
                borderRadius: 24,
                width: 48,
                height: 48,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
              }}>
                <Ionicons name="analytics" size={24} color="white" />
              </View>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: colors.text,
                textAlign: 'center',
              }}>
                Price Alerts
              </Text>
              <Text style={{
                fontSize: 12,
                color: colors.textSecondary,
                textAlign: 'center',
                marginTop: 4,
              }}>
                Track & save
              </Text>
            </TouchableOpacity>
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

        {/* Insights Dashboard */}
        {insights && (
          <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
            <Text style={{
              fontSize: 20,
              fontWeight: '600',
              color: colors.text,
              marginBottom: 16,
            }}>
              Shopping Insights
            </Text>
            
            <View style={{
              backgroundColor: colors.cardBackground,
              borderRadius: 16,
              padding: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 16,
              }}>
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <Text style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: colors.primary,
                  }}>
                    {insights.totalLists}
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    color: colors.textSecondary,
                    textAlign: 'center',
                  }}>
                    Shopping Lists
                  </Text>
                </View>
                
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <Text style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: colors.secondary,
                  }}>
                    {insights.totalItems}
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    color: colors.textSecondary,
                    textAlign: 'center',
                  }}>
                    Total Items
                  </Text>
                </View>
                
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <Text style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: colors.accent,
                  }}>
                    {insights.averageListSize}
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    color: colors.textSecondary,
                    textAlign: 'center',
                  }}>
                    Avg List Size
                  </Text>
                </View>
              </View>

              {insights.topCategories.length > 0 && (
                <View>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: colors.text,
                    marginBottom: 12,
                  }}>
                    Top Categories
                  </Text>
                  {insights.topCategories.slice(0, 3).map((cat: any, index: number) => (
                    <View 
                      key={index}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 8,
                      }}
                    >
                      <Text style={{
                        fontSize: 14,
                        color: colors.text,
                        flex: 1,
                      }}>
                        {cat.category}
                      </Text>
                      <Text style={{
                        fontSize: 14,
                        color: colors.primary,
                        fontWeight: '500',
                      }}>
                        {cat.count} items
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Scan Modal */}
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
              Scan Product
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
                Take Photo
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
                Choose from Library
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

      {/* Loading Overlay */}
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
            <Text style={{
              fontSize: 16,
              color: colors.text,
              marginTop: 12,
            }}>
              Processing...
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

  const handleLibraryScan = async () => {
    try {
      setScanModalVisible(false);
      setIsLoading(true);
      
      const imageResult = await scannerService.selectImageFromLibrary();
      if (!imageResult.success) {
        Alert.alert('Image Error', imageResult.error || 'Failed to select image');
        return;
      }

      const scanResult = await scannerService.scanProductFromImage(imageResult.imageUri!);
      setLastScanResult(scanResult);
      
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
    } catch (error) {
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
        `${product.name}\n\n${priceInfo}`
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to compare prices');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToList = async (product: Product) => {
    try {
      if (shoppingLists.length === 0) {
        // Create a new list first
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
        // Add to first list
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
    } catch (error) {
      Alert.alert('Error', 'Failed to add item to list');
    }
  };

  // Smart List Creation
  const handleCreateSmartList = async () => {
    if (!quickListPrompt.trim()) {
      Alert.alert('Please enter what you need', 'Describe what you want to shop for');
      return;
    }
    
    try {
      setIsCreatingList(true);
      const smartList = await shopService.generateSmartList(quickListPrompt);
      setShoppingLists([smartList, ...shoppingLists]);
      setQuickListPrompt('');
      Alert.alert('Smart List Created!', `Created "${smartList.name}" with AI suggestions`);
    } catch (error) {
      Alert.alert('Error', 'Failed to create smart list');
    } finally {
      setIsCreatingList(false);
    }
  };

  // Navigation Functions
  const navigateToShoppingLists = () => {
    router.push('/shopping-lists');
  };

  const navigateToPriceAlerts = () => {
    router.push('/price-alerts');
  };

  const navigateToScanHistory = () => {
    router.push('/scan-history');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient
          colors={[theme.primary, theme.secondary]}
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

        {/* Quick Actions */}
        <View style={{ padding: 20 }}>
          <Text style={{
            fontSize: 20,
            fontWeight: '600',
            color: theme.text,
            marginBottom: 16,
          }}>
            Quick Actions
          </Text>
          
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
          }}>
            {/* Product Scanner */}
            <TouchableOpacity
              onPress={() => setScanModalVisible(true)}
              style={{
                backgroundColor: theme.cardBackground,
                borderRadius: 16,
                padding: 16,
                alignItems: 'center',
                minWidth: (width - 60) / 2,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <View style={{
                backgroundColor: theme.primary,
                borderRadius: 24,
                width: 48,
                height: 48,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
              }}>
                <Ionicons name="scan" size={24} color="white" />
              </View>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: theme.text,
                textAlign: 'center',
              }}>
                Scan Product
              </Text>
              <Text style={{
                fontSize: 12,
                color: theme.textSecondary,
                textAlign: 'center',
                marginTop: 4,
              }}>
                Camera or library
              </Text>
            </TouchableOpacity>

            {/* Price Comparison */}
            <TouchableOpacity
              onPress={navigateToPriceAlerts}
              style={{
                backgroundColor: theme.cardBackground,
                borderRadius: 16,
                padding: 16,
                alignItems: 'center',
                minWidth: (width - 60) / 2,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <View style={{
                backgroundColor: theme.secondary,
                borderRadius: 24,
                width: 48,
                height: 48,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
              }}>
                <Ionicons name="analytics" size={24} color="white" />
              </View>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: theme.text,
                textAlign: 'center',
              }}>
                Price Alerts
              </Text>
              <Text style={{
                fontSize: 12,
                color: theme.textSecondary,
                textAlign: 'center',
                marginTop: 4,
              }}>
                Track & save
              </Text>
            </TouchableOpacity>
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
                color: theme.text,
              }}>
                Your Lists
              </Text>
              <TouchableOpacity onPress={navigateToShoppingLists}>
                <Text style={{ color: theme.primary, fontWeight: '500' }}>
                  View All
                </Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {shoppingLists.slice(0, 3).map(list => (
                <TouchableOpacity
                  key={list.id}
                  onPress={navigateToShoppingLists}
                  style={{
                    backgroundColor: theme.cardBackground,
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
                    color: theme.text,
                    marginBottom: 8,
                  }}>
                    {list.name}
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: theme.textSecondary,
                    marginBottom: 4,
                  }}>
                    {list.items.length} items
                  </Text>
                  {list.estimatedTotal && (
                    <Text style={{
                      fontSize: 14,
                      color: theme.primary,
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
              color: theme.text,
              marginBottom: 16,
            }}>
              Smart Recommendations
            </Text>
            
            {recommendations.slice(0, 3).map((rec, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: theme.cardBackground,
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: theme.primary,
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
                    color={theme.primary} 
                    style={{ marginRight: 8 }}
                  />
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: theme.text,
                    flex: 1,
                  }}>
                    {rec.title}
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    color: theme.textSecondary,
                    backgroundColor: theme.background,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 8,
                  }}>
                    {Math.round(rec.confidence * 100)}% sure
                  </Text>
                </View>
                <Text style={{
                  fontSize: 14,
                  color: theme.textSecondary,
                  lineHeight: 20,
                }}>
                  {rec.description}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Insights Dashboard */}
        {insights && (
          <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
            <Text style={{
              fontSize: 20,
              fontWeight: '600',
              color: theme.text,
              marginBottom: 16,
            }}>
              Shopping Insights
            </Text>
            
            <View style={{
              backgroundColor: theme.cardBackground,
              borderRadius: 16,
              padding: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 16,
              }}>
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <Text style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: theme.primary,
                  }}>
                    {insights.totalLists}
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    color: theme.textSecondary,
                    textAlign: 'center',
                  }}>
                    Shopping Lists
                  </Text>
                </View>
                
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <Text style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: theme.secondary,
                  }}>
                    {insights.totalItems}
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    color: theme.textSecondary,
                    textAlign: 'center',
                  }}>
                    Total Items
                  </Text>
                </View>
                
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <Text style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: theme.accent,
                  }}>
                    {insights.averageListSize}
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    color: theme.textSecondary,
                    textAlign: 'center',
                  }}>
                    Avg List Size
                  </Text>
                </View>
              </View>

              {insights.topCategories.length > 0 && (
                <View>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: theme.text,
                    marginBottom: 12,
                  }}>
                    Top Categories
                  </Text>
                  {insights.topCategories.slice(0, 3).map((cat: any, index: number) => (
                    <View 
                      key={index}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 8,
                      }}
                    >
                      <Text style={{
                        fontSize: 14,
                        color: theme.text,
                        flex: 1,
                      }}>
                        {cat.category}
                      </Text>
                      <Text style={{
                        fontSize: 14,
                        color: theme.primary,
                        fontWeight: '500',
                      }}>
                        {cat.count} items
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Scan Modal */}
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
            backgroundColor: theme.cardBackground,
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
              color: theme.text,
              textAlign: 'center',
              marginBottom: 24,
            }}>
              Scan Product
            </Text>
            
            <TouchableOpacity
              onPress={handleCameraScan}
              style={{
                backgroundColor: theme.primary,
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
                Take Photo
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleLibraryScan}
              style={{
                backgroundColor: theme.secondary,
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
                Choose from Library
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setScanModalVisible(false)}
              style={{
                backgroundColor: theme.background,
                borderRadius: 12,
                padding: 16,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: theme.border,
              }}
            >
              <Text style={{
                fontSize: 16,
                color: theme.textSecondary,
              }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Loading Overlay */}
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
            backgroundColor: theme.cardBackground,
            borderRadius: 12,
            padding: 24,
            alignItems: 'center',
          }}>
            <Text style={{
              fontSize: 16,
              color: theme.text,
              marginTop: 12,
            }}>
              Processing...
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
