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

import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

import ShopAssistantService, {
  ShoppingList,
  ShoppingRecommendation,
  Product
} from '../../services/ShopAssistantService';
import ProductScannerService, { ScanResult } from '../../services/ProductScannerService';
import PriceComparisonService from '../../services/PriceComparisonService';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function ShopAssistantScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  
  // Services - Singleton pattern for performance
  const [shopService] = useState(() => ShopAssistantService.getInstance());
  const [scannerService] = useState(() => ProductScannerService.getInstance());
  
  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [scanModalVisible, setScanModalVisible] = useState(false);
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [recommendations, setRecommendations] = useState<ShoppingRecommendation[]>([]);

  // Data loading functions
  const loadShoppingLists = useCallback(async () => {
    try {
      const lists = await shopService.getShoppingLists();
      setShoppingLists(lists || []);
    } catch (error) {
      console.error('Failed to load shopping lists:', error);
    }
  }, [shopService]);

  const loadRecommendations = useCallback(async () => {
    try {
      const recs = await shopService.getPersonalizedRecommendations();
      setRecommendations(recs || []);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    }
  }, [shopService]);

  const loadInsights = useCallback(async () => {
    try {
      const insightsData = await shopService.getShoppingInsights();
      setInsights(insightsData);
    } catch (error) {
      console.error('Failed to load insights:', error);
    }
  }, [shopService]);

  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadShoppingLists(),
        loadRecommendations(),
        loadInsights()
      ]);
    } catch (error) {
      console.error('Failed to load initial data:', error);
      Alert.alert('Error', 'Failed to load shopping data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [loadShoppingLists, loadRecommendations, loadInsights]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  }, [loadInitialData]);

  // Product scanning functions
  const handleCameraScan = useCallback(async () => {
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
            { text: 'OK' }
          ]
        );
      } else {
        Alert.alert('Scan Failed', scanResult.error || 'Could not identify the product. Please try again.');
      }
    } catch (error) {
      console.error('Camera scan error:', error);
      Alert.alert('Error', 'Failed to scan product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [scannerService, shopService]);

  const handleGalleryScan = useCallback(async () => {
    try {
      setScanModalVisible(false);
      setIsLoading(true);
      
      const imageResult = await scannerService.selectImageFromLibrary();
      
      if (!imageResult.success || !imageResult.imageUri) {
        Alert.alert('Error', 'Failed to select image. Please try again.');
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
            { text: 'OK' }
          ]
        );
      } else {
        Alert.alert('Scan Failed', scanResult.error || 'Could not identify the product. Please try again.');
      }
    } catch (error) {
      console.error('Gallery scan error:', error);
      Alert.alert('Error', 'Failed to scan product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [scannerService, shopService]);

  const handleComparePrice = useCallback(async (product: Product) => {
    try {
      setIsLoading(true);
      const comparison = await shopService.compareProductPrices(product.id);
      
      const priceInfo = comparison.map((price: any) =>
        `${price.storeName}: ${shopService.formatPrice(price.price)}`
      ).join('\n');

      Alert.alert('Price Comparison', priceInfo);
    } catch (error) {
      console.error('Price comparison error:', error);
      Alert.alert('Error', 'Failed to compare prices. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [shopService]);

  const handleAddScannedProduct = useCallback(async (product: Product) => {
    try {
      if (shoppingLists.length === 0) {
        const newList = await shopService.createShoppingList('My Shopping List');
        await shopService.addItemToList(newList.id, {
          name: product.name,
          category: product.category || 'General',
          quantity: 1,
          estimatedPrice: product.price
        });
        await loadShoppingLists();
      } else {
        await shopService.addItemToList(shoppingLists[0].id, {
          name: product.name,
          category: product.category || 'General',
          quantity: 1,
          estimatedPrice: product.price
        });
        await loadShoppingLists();
      }
      
      Alert.alert('Success', `${product.name} added to your shopping list!`);
    } catch (error) {
      console.error('Add product error:', error);
      Alert.alert('Error', 'Failed to add product to list. Please try again.');
    }
  }, [shoppingLists, shopService, loadShoppingLists]);

  // Initialize data on mount
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 20,
      paddingVertical: 24,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: 'white',
      marginBottom: 8,
    },
    headerSubtitle: {
      fontSize: 16,
      color: 'rgba(255, 255, 255, 0.9)',
      opacity: 0.9,
    },
    quickActions: {
      padding: 20,
    },
    quickActionsTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 16,
    },
    actionButton: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      alignItems: 'center',
      minWidth: (width - 60) / 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      marginBottom: 12,
    },
    actionIconContainer: {
      borderRadius: 24,
      width: 48,
      height: 48,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    actionText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      textAlign: 'center',
    },
    actionSubtext: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 4,
    },
    section: {
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 16,
    },
    listCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginRight: 12,
      minWidth: 160,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    listTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    listItemCount: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    recommendationCard: {
      backgroundColor: colors.surface,
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
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 24,
      width: width * 0.85,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 8,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 24,
    },
    modalButton: {
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    modalButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: 'white',
      marginLeft: 8,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: colors.textSecondary,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    emptyStateText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 10,
    },
  });

  if (isLoading && shoppingLists.length === 0 && recommendations.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="hourglass-outline" size={48} color={colors.primary} />
          <Text style={styles.loadingText}>Loading your shopping data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>AI Shop Assistant</Text>
          <Text style={styles.headerSubtitle}>
            Smart shopping with AI-powered insights
          </Text>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
          
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setScanModalVisible(true)}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: colors.primary }]}>
                <Ionicons name="scan" size={24} color="white" />
              </View>
              <Text style={styles.actionText}>Scan Product</Text>
              <Text style={styles.actionSubtext}>Camera or library</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/chat')}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: colors.secondary }]}>
                <Ionicons name="chatbubble-outline" size={24} color="white" />
              </View>
              <Text style={styles.actionText}>Ask AI Assistant</Text>
              <Text style={styles.actionSubtext}>Get advice</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Shopping Lists */}
        <View style={styles.section}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.sectionTitle}>Your Lists</Text>
            {shoppingLists.length > 0 && (
              <TouchableOpacity>
                <Text style={{ color: colors.primary, fontWeight: '500' }}>View All</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {shoppingLists.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {shoppingLists.slice(0, 3).map(list => (
                <View key={list.id} style={styles.listCard}>
                  <Text style={styles.listTitle}>{list.name}</Text>
                  <Text style={styles.listItemCount}>
                    {list.items?.length || 0} items
                  </Text>
                  {list.estimatedTotal && (
                    <Text style={{ fontSize: 14, color: colors.primary, fontWeight: '500' }}>
                      ~R {list.estimatedTotal.toFixed(2)}
                    </Text>
                  )}
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="list-outline" size={48} color={colors.textSecondary} />
              <Text style={styles.emptyStateText}>
                No shopping lists yet.{'\n'}Scan a product to get started!
              </Text>
            </View>
          )}
        </View>

        {/* Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Smart Recommendations</Text>
          {recommendations.length > 0 ? (
            recommendations.slice(0, 3).map((rec, index) => (
              <View key={index} style={styles.recommendationCard}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <Ionicons name="bulb" size={20} color={colors.primary} style={{ marginRight: 8 }} />
                  <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, flex: 1 }}>
                    {rec.title}
                  </Text>
                </View>
                <Text style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 20 }}>
                  {rec.description}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="bulb-outline" size={48} color={colors.textSecondary} />
              <Text style={styles.emptyStateText}>
                Recommendations will appear here{'\n'}as you use the app more.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Scan Modal */}
      <Modal
        visible={scanModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setScanModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Scan Product</Text>
            
            <TouchableOpacity 
              style={[styles.modalButton, { backgroundColor: colors.primary }]}
              onPress={handleCameraScan}
            >
              <Ionicons name="camera" size={24} color="white" />
              <Text style={styles.modalButtonText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.modalButton, { backgroundColor: colors.secondary }]}
              onPress={handleGalleryScan}
            >
              <Ionicons name="images" size={24} color="white" />
              <Text style={styles.modalButtonText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.modalButton, { 
                backgroundColor: colors.background,
                borderWidth: 1,
                borderColor: colors.border 
              }]}
              onPress={() => setScanModalVisible(false)}
            >
              <Ionicons name="close" size={24} color={colors.text} />
              <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
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
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 24,
            alignItems: 'center',
          }}>
            <Ionicons name="hourglass-outline" size={32} color={colors.primary} />
            <Text style={{ fontSize: 16, color: colors.text, marginTop: 12 }}>
              Processing...
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
