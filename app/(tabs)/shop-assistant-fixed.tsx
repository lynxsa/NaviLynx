import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  RefreshControl,
  Modal,
  TextInput,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

import { shopAssistantService } from '@/services/ShopAssistantService';
import { productScannerService } from '@/services/ProductScannerService';
import { priceComparisonService } from '@/services/PriceComparisonService';

const { width, height } = Dimensions.get('window');

interface ShopAssistantScreenProps {}

export default function ShopAssistantScreen({}: ShopAssistantScreenProps) {
  const router = useRouter();
  const { colors } = useTheme();
  
  // State management
  const [shoppingLists, setShoppingLists] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [insights, setInsights] = useState<any>(null);
  const [lastScanResult, setLastScanResult] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [quickListPrompt, setQuickListPrompt] = useState('');
  const [isCreatingList, setIsCreatingList] = useState(false);

  // Load data on component mount
  useEffect(() => {
    loadData();
    requestCameraPermission();
  }, []);

  const loadData = useCallback(async () => {
    try {
      await Promise.all([
        loadShoppingLists(),
        loadRecommendations(),
        loadInsights()
      ]);
    } catch (error) {
      console.error('Error loading Shop Assistant data:', error);
    }
  }, []);

  const loadShoppingLists = useCallback(async () => {
    try {
      const lists = await shopAssistantService.getShoppingLists();
      setShoppingLists(lists);
    } catch (error) {
      console.error('Error loading shopping lists:', error);
    }
  }, []);

  const loadRecommendations = useCallback(async () => {
    try {
      const recs = await shopAssistantService.getSmartRecommendations();
      setRecommendations(recs);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
  }, []);

  const loadInsights = useCallback(async () => {
    try {
      const insightsData = await shopAssistantService.getShoppingInsights();
      setInsights(insightsData);
    } catch (error) {
      console.error('Error loading insights:', error);
    }
  }, []);

  const requestCameraPermission = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(status === 'granted');
    } catch (error) {
      console.error('Camera permission error:', error);
      setCameraPermission(false);
    }
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const handleScanProduct = async () => {
    if (!cameraPermission) {
      Alert.alert(
        'Camera Permission Required',
        'Please grant camera permission to scan products.',
        [{ text: 'OK' }]
      );
      return;
    }
    setShowScanModal(true);
  };

  const handleCameraCapture = async () => {
    try {
      setIsScanning(true);
      const scanResult = await productScannerService.captureAndScan();
      
      if (scanResult) {
        setLastScanResult(scanResult);
        setShowScanModal(false);
        
        // Show scan results
        Alert.alert(
          'Product Scanned!',
          `Found: ${scanResult.product.name}\\nConfidence: ${Math.round(scanResult.confidence * 100)}%`,
          [
            { text: 'View Details', onPress: () => showProductDetails(scanResult.product) },
            { text: 'OK' }
          ]
        );
      }
    } catch (error) {
      console.error('Camera scan error:', error);
      Alert.alert('Scan Error', 'Unable to scan product. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleLibrarySelection = async () => {
    try {
      setIsScanning(true);
      const scanResult = await productScannerService.scanFromLibrary();
      
      if (scanResult) {
        setLastScanResult(scanResult);
        setShowScanModal(false);
        
        Alert.alert(
          'Product Analyzed!',
          `Found: ${scanResult.product.name}\\nConfidence: ${Math.round(scanResult.confidence * 100)}%`,
          [
            { text: 'View Details', onPress: () => showProductDetails(scanResult.product) },
            { text: 'OK' }
          ]
        );
      }
    } catch (error) {
      console.error('Library scan error:', error);
      Alert.alert('Analysis Error', 'Unable to analyze image. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const showProductDetails = async (product: any) => {
    try {
      const priceInfo = await priceComparisonService.compareProductPrices(product.id);
      const formattedPrices = priceInfo.storeComparisons
        .map(comp => `${comp.storeName}: R${comp.price.toFixed(2)}`)
        .join('\\n');
      
      Alert.alert(
        'Price Comparison',
        `${product.name}\\n\\n${formattedPrices}`
      );
    } catch (error) {
      console.error('Price comparison error:', error);
      Alert.alert('Error', 'Unable to load price comparison.');
    }
  };

  const handleCreateQuickList = async () => {
    if (!quickListPrompt.trim()) {
      Alert.alert('Input Required', 'Please enter what you need to shop for.');
      return;
    }

    try {
      setIsCreatingList(true);
      const smartList = await shopAssistantService.generateSmartList(quickListPrompt);
      await loadShoppingLists();
      setQuickListPrompt('');
      Alert.alert('List Created!', `Created "${smartList.name}" with ${smartList.items.length} items.`);
    } catch (error) {
      console.error('Quick list creation error:', error);
      Alert.alert('Error', 'Unable to create shopping list.');
    } finally {
      setIsCreatingList(false);
    }
  };

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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header Section */}
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          style={{
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 30,
            borderBottomLeftRadius: 25,
            borderBottomRightRadius: 25,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <Ionicons name="storefront" size={32} color="white" />
            <Text
              style={{
                fontSize: 28,
                fontWeight: 'bold',
                color: 'white',
                marginLeft: 12,
                flex: 1,
              }}
            >
              Shop Assistant
            </Text>
            <TouchableOpacity
              onPress={handleScanProduct}
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                padding: 12,
                borderRadius: 15,
              }}
            >
              <Ionicons name="camera" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <Text
            style={{
              fontSize: 16,
              color: 'rgba(255,255,255,0.9)',
              textAlign: 'center',
            }}
          >
            AI-powered shopping with smart recommendations
          </Text>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 15 }}>
            Quick Actions
          </Text>
          
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            <TouchableOpacity
              onPress={handleScanProduct}
              style={{
                backgroundColor: colors.cardBackground,
                padding: 16,
                borderRadius: 12,
                flex: 1,
                minWidth: '45%',
                alignItems: 'center',
              }}
            >
              <Ionicons name="camera" size={24} color={colors.primary} />
              <Text style={{ marginTop: 8, color: colors.text, fontWeight: '500' }}>
                Scan Product
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={navigateToPriceAlerts}
              style={{
                backgroundColor: colors.cardBackground,
                padding: 16,
                borderRadius: 12,
                flex: 1,
                minWidth: '45%',
                alignItems: 'center',
              }}
            >
              <Ionicons name="notifications" size={24} color={colors.secondary} />
              <Text style={{ marginTop: 8, color: colors.text, fontWeight: '500' }}>
                Price Alerts
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Smart Recommendations */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 15 }}>
            Smart Recommendations
          </Text>
          
          {recommendations.length > 0 ? (
            recommendations.slice(0, 3).map((rec, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: colors.cardBackground,
                  padding: 16,
                  borderRadius: 12,
                  marginBottom: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: colors.primary,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <Ionicons 
                    name={rec.type === 'product' ? 'cube' : rec.type === 'deal' ? 'pricetag' : 'star'} 
                    size={20} 
                    color={colors.primary} 
                  />
                  <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginLeft: 8 }}>
                    {rec.title}
                  </Text>
                </View>
                <Text style={{ color: colors.textSecondary, lineHeight: 20 }}>
                  {rec.description}
                </Text>
                <Text style={{ fontSize: 14, color: colors.primary, fontWeight: '500', marginTop: 8 }}>
                  {rec.reason}
                </Text>
              </View>
            ))
          ) : (
            <Text style={{ color: colors.textSecondary, textAlign: 'center', padding: 20 }}>
              Loading smart recommendations...
            </Text>
          )}
        </View>

        {/* Shopping Lists */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text }}>
              Shopping Lists
            </Text>
            <Text style={{ color: colors.primary, fontWeight: '500' }} onPress={navigateToShoppingLists}>
              View All
            </Text>
          </View>

          {shoppingLists.length > 0 ? (
            shoppingLists.slice(0, 2).map((list) => (
              <TouchableOpacity
                key={list.id}
                style={{
                  backgroundColor: colors.cardBackground,
                  padding: 16,
                  borderRadius: 12,
                  marginBottom: 12,
                }}
                onPress={() => router.push(`/shopping-list/${list.id}`)}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>
                      {list.name}
                    </Text>
                    <Text style={{ color: colors.textSecondary, marginTop: 4 }}>
                      {list.items.length} items • {list.completedItems || 0} completed
                    </Text>
                  </View>
                  <Text style={{ fontSize: 14, color: colors.primary, fontWeight: '500' }}>
                    R{list.estimatedTotal?.toFixed(2) || '0.00'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={{ alignItems: 'center', padding: 20 }}>
              <Ionicons name="list" size={48} color={colors.textSecondary} />
              <Text style={{ color: colors.textSecondary, marginTop: 8 }}>
                No shopping lists yet
              </Text>
            </View>
          )}
        </View>

        {/* Quick List Creator */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 15 }}>
            Quick List Creator
          </Text>
          
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TextInput
              style={{
                flex: 1,
                backgroundColor: colors.cardBackground,
                padding: 16,
                borderRadius: 12,
                color: colors.text,
                fontSize: 16,
              }}
              placeholder="e.g., 'Weekend braai for 6 people'"
              placeholderTextColor={colors.textSecondary}
              value={quickListPrompt}
              onChangeText={setQuickListPrompt}
              multiline
            />
            <TouchableOpacity
              onPress={handleCreateQuickList}
              disabled={isCreatingList || !quickListPrompt.trim()}
              style={{
                backgroundColor: colors.primary,
                paddingHorizontal: 20,
                paddingVertical: 16,
                borderRadius: 12,
                justifyContent: 'center',
                opacity: isCreatingList || !quickListPrompt.trim() ? 0.6 : 1,
              }}
            >
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Shopping Insights */}
        {insights && (
          <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 15 }}>
              Shopping Insights
            </Text>
            
            <View style={{ backgroundColor: colors.cardBackground, padding: 16, borderRadius: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                <Text style={{ color: colors.text, fontWeight: '500' }}>Monthly Savings</Text>
                <Text style={{ color: colors.primary, fontWeight: '600' }}>
                  R{insights.monthlySavings?.toFixed(2) || '0.00'}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                <Text style={{ color: colors.text, fontWeight: '500' }}>Items Scanned</Text>
                <Text style={{ color: colors.text }}>
                  {insights.itemsScanned || 0}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: colors.text, fontWeight: '500' }}>Best Store</Text>
                <Text style={{ color: colors.text }}>
                  {insights.bestStore || 'Not enough data'}
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Scan Modal */}
      <Modal
        visible={showScanModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
          <View style={{ padding: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text }}>
                Scan Product
              </Text>
              <TouchableOpacity onPress={() => setShowScanModal(false)}>
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={{ gap: 20 }}>
              <TouchableOpacity
                onPress={handleCameraCapture}
                disabled={isScanning}
                style={{
                  backgroundColor: colors.primary,
                  padding: 20,
                  borderRadius: 15,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: isScanning ? 0.6 : 1,
                }}
              >
                <Ionicons name="camera" size={24} color="white" />
                <Text style={{ color: 'white', fontSize: 18, fontWeight: '600', marginLeft: 12 }}>
                  {isScanning ? 'Scanning...' : 'Take Photo'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleLibrarySelection}
                disabled={isScanning}
                style={{
                  backgroundColor: colors.secondary,
                  padding: 20,
                  borderRadius: 15,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: isScanning ? 0.6 : 1,
                }}
              >
                <Ionicons name="images" size={24} color="white" />
                <Text style={{ color: 'white', fontSize: 18, fontWeight: '600', marginLeft: 12 }}>
                  {isScanning ? 'Processing...' : 'Choose from Library'}
                </Text>
              </TouchableOpacity>
            </View>

            {lastScanResult && (
              <View style={{ marginTop: 30, padding: 16, backgroundColor: colors.cardBackground, borderRadius: 12 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 8 }}>
                  Last Scan Result
                </Text>
                <Text style={{ color: colors.text, marginBottom: 4 }}>
                  {lastScanResult.product.name}
                </Text>
                <Text style={{ color: colors.textSecondary }}>
                  Confidence: {Math.round(lastScanResult.confidence * 100)}%
                </Text>
              </View>
            )}
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
