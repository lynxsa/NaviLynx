import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Modal,
  Dimensions,
} from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useResponsive } from '@/hooks/useResponsive';
import { IconSymbol } from '@/components/ui/IconSymbol';
import GlassCard from '@/components/GlassCard';
import { Spacing, BorderRadius, Typography, Shadows } from '@/constants/Theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ProductInfo {
  id: string;
  name: string;
  category: string;
  description: string;
  estimatedPrice: string;
  confidence: number;
  alternatives: ProductAlternative[];
  storeInfo: StoreInfo[];
  reviews: ProductReview[];
  sustainability: SustainabilityInfo;
}

interface ProductAlternative {
  id: string;
  name: string;
  price: string;
  store: string;
  distance: string;
  savings: string;
  rating: number;
}

interface StoreInfo {
  id: string;
  name: string;
  location: string;
  floor: string;
  distance: string;
  hasItem: boolean;
  price?: string;
  stock: 'in_stock' | 'low_stock' | 'out_of_stock';
}

interface ProductReview {
  rating: number;
  comment: string;
  source: string;
  verified: boolean;
}

interface SustainabilityInfo {
  rating: 'A' | 'B' | 'C' | 'D' | 'E';
  factors: string[];
  alternatives: string[];
}

interface ShoppingAssistantProps {
  visible: boolean;
  onClose: () => void;
  venueId?: string;
}

export default function SmartShoppingAssistant({ 
  visible, 
  onClose, 
  venueId 
}: ShoppingAssistantProps) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { getResponsiveValue } = useResponsive();

  // State
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'stores' | 'alternatives' | 'reviews'>('info');
  const cameraRef = useRef<CameraView>(null);

  // Permission handling
  const requestCameraPermission = useCallback(async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Camera Permission',
        'Camera access is required to scan products.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  }, []);

  // Camera capture
  const takePicture = useCallback(async () => {
    if (!cameraRef.current) return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
      });

      if (photo) {
        setCapturedImage(photo.uri);
        setShowCamera(false);
        await analyzeProduct(photo.base64 || '');
      }
    } catch (error) {
      console.error('Failed to take picture:', error);
      Alert.alert('Error', 'Failed to capture image. Please try again.');
    }
  }, []);

  // Gallery selection
  const selectFromGallery = useCallback(async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Gallery access is needed to select images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        setCapturedImage(result.assets[0].uri);
        await analyzeProduct(result.assets[0].base64 || '');
      }
    } catch (error) {
      console.error('Failed to select image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  }, []);

  // AI Analysis (Mock implementation - would use Google Gemini Vision API)
  const analyzeProduct = useCallback(async (base64Image: string) => {
    setIsAnalyzing(true);
    
    try {
      // Simulate AI analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock product recognition result
      const mockProduct: ProductInfo = {
        id: 'prod_001',
        name: 'Samsung Galaxy Earbuds Pro',
        category: 'Electronics',
        description: 'Premium wireless earbuds with active noise cancellation',
        estimatedPrice: 'R2,499 - R2,999',
        confidence: 0.92,
        alternatives: [
          {
            id: 'alt_001',
            name: 'Apple AirPods Pro',
            price: 'R4,999',
            store: 'iStore',
            distance: '100m',
            savings: '-R2,000',
            rating: 4.5,
          },
          {
            id: 'alt_002',
            name: 'Sony WF-1000XM4',
            price: 'R3,999',
            store: 'Incredible Connection',
            distance: '150m',
            savings: '-R1,000',
            rating: 4.7,
          },
        ],
        storeInfo: [
          {
            id: 'store_001',
            name: 'Samsung Store',
            location: 'Level 1, Section A',
            floor: '1',
            distance: '50m',
            hasItem: true,
            price: 'R2,499',
            stock: 'in_stock',
          },
          {
            id: 'store_002',
            name: 'Takealot Pickup Point',
            location: 'Level 2, Section C',
            floor: '2',
            distance: '200m',
            hasItem: true,
            price: 'R2,299',
            stock: 'low_stock',
          },
        ],
        reviews: [
          {
            rating: 4.5,
            comment: 'Great sound quality and battery life',
            source: 'Takealot',
            verified: true,
          },
          {
            rating: 4.0,
            comment: 'Good value for money',
            source: 'PriceCheck',
            verified: false,
          },
        ],
        sustainability: {
          rating: 'B',
          factors: ['Recyclable packaging', 'Energy efficient'],
          alternatives: ['Refurbished options available'],
        },
      };

      setProductInfo(mockProduct);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Failed to analyze product:', error);
      Alert.alert('Error', 'Failed to analyze product. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // Reset state
  const resetState = useCallback(() => {
    setCapturedImage(null);
    setProductInfo(null);
    setIsAnalyzing(false);
    setActiveTab('info');
  }, []);

  // Close handler
  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  // Camera view
  const renderCamera = () => (
    <View style={styles.cameraContainer}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
      >
        <View style={styles.cameraOverlay}>
          <View style={styles.cameraHeader}>
            <TouchableOpacity
              style={[styles.cameraButton, { backgroundColor: colors.surface + '80' }]}
              onPress={() => setShowCamera(false)}
            >
              <IconSymbol name="xmark" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.scanFrame}>
            <View style={styles.scanCorner} />
            <View style={[styles.scanCorner, styles.scanCornerTopRight]} />
            <View style={[styles.scanCorner, styles.scanCornerBottomLeft]} />
            <View style={[styles.scanCorner, styles.scanCornerBottomRight]} />
          </View>

          <View style={styles.cameraControls}>
            <TouchableOpacity
              style={[styles.galleryButton, { backgroundColor: colors.surface + '80' }]}
              onPress={selectFromGallery}
            >
              <IconSymbol name="photo" size={24} color={colors.text} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>

            <View style={styles.placeholder} />
          </View>
        </View>
      </CameraView>
    </View>
  );

  // Product info tabs
  const renderProductTabs = () => (
    <View style={styles.tabContainer}>
      {[
        { key: 'info', label: 'Info', icon: 'info.circle' },
        { key: 'stores', label: 'Stores', icon: 'building.2' },
        { key: 'alternatives', label: 'Compare', icon: 'arrow.left.arrow.right' },
        { key: 'reviews', label: 'Reviews', icon: 'star' },
      ].map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tab,
            {
              backgroundColor: activeTab === tab.key ? colors.primary : 'transparent',
            }
          ]}
          onPress={() => setActiveTab(tab.key as any)}
        >
          <IconSymbol
            name={tab.icon as any}
            size={16}
            color={activeTab === tab.key ? '#FFFFFF' : colors.mutedForeground}
          />
          <Text style={[
            styles.tabLabel,
            {
              color: activeTab === tab.key ? '#FFFFFF' : colors.mutedForeground,
            }
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // Product content
  const renderProductContent = () => {
    if (!productInfo) return null;

    switch (activeTab) {
      case 'info':
        return (
          <ScrollView style={styles.contentContainer}>
            <GlassCard style={styles.productCard}>
              <View style={styles.productHeader}>
                <Text style={[styles.productName, { color: colors.text }]}>
                  {productInfo.name}
                </Text>
                <View style={styles.confidenceIndicator}>
                  <Text style={[styles.confidenceText, { color: colors.mutedForeground }]}>
                    {Math.round(productInfo.confidence * 100)}% match
                  </Text>
                </View>
              </View>
              
              <Text style={[styles.productCategory, { color: colors.primary }]}>
                {productInfo.category}
              </Text>
              
              <Text style={[styles.productDescription, { color: colors.mutedForeground }]}>
                {productInfo.description}
              </Text>
              
              <View style={styles.priceContainer}>
                <Text style={[styles.priceLabel, { color: colors.mutedForeground }]}>
                  Estimated Price
                </Text>
                <Text style={[styles.priceValue, { color: colors.text }]}>
                  {productInfo.estimatedPrice}
                </Text>
              </View>

              <View style={styles.sustainabilityCard}>
                <View style={styles.sustainabilityHeader}>
                  <IconSymbol name="leaf" size={16} color={colors.success} />
                  <Text style={[styles.sustainabilityTitle, { color: colors.text }]}>
                    Sustainability Rating: {productInfo.sustainability.rating}
                  </Text>
                </View>
                <Text style={[styles.sustainabilityFactors, { color: colors.mutedForeground }]}>
                  {productInfo.sustainability.factors.join(' • ')}
                </Text>
              </View>
            </GlassCard>
          </ScrollView>
        );

      case 'stores':
        return (
          <ScrollView style={styles.contentContainer}>
            {productInfo.storeInfo.map((store) => (
              <GlassCard key={store.id} style={styles.storeCard}>
                <View style={styles.storeHeader}>
                  <View>
                    <Text style={[styles.storeName, { color: colors.text }]}>
                      {store.name}
                    </Text>
                    <Text style={[styles.storeLocation, { color: colors.mutedForeground }]}>
                      {store.location} • {store.distance}
                    </Text>
                  </View>
                  <View style={[
                    styles.stockIndicator,
                    { backgroundColor: store.stock === 'in_stock' ? colors.success + '20' : colors.warning + '20' }
                  ]}>
                    <Text style={[
                      styles.stockText,
                      { color: store.stock === 'in_stock' ? colors.success : colors.warning }
                    ]}>
                      {store.stock === 'in_stock' ? 'In Stock' : 'Low Stock'}
                    </Text>
                  </View>
                </View>
                
                {store.price && (
                  <Text style={[styles.storePrice, { color: colors.primary }]}>
                    {store.price}
                  </Text>
                )}
                
                <TouchableOpacity
                  style={[styles.navigateButton, { backgroundColor: colors.primary }]}
                  onPress={() => {
                    // Navigate to store
                    Alert.alert('Navigate', `Navigate to ${store.name}?`);
                  }}
                >
                  <IconSymbol name="location.fill" size={16} color="#FFFFFF" />
                  <Text style={styles.navigateButtonText}>Navigate</Text>
                </TouchableOpacity>
              </GlassCard>
            ))}
          </ScrollView>
        );

      case 'alternatives':
        return (
          <ScrollView style={styles.contentContainer}>
            {productInfo.alternatives.map((alt) => (
              <GlassCard key={alt.id} style={styles.alternativeCard}>
                <View style={styles.alternativeHeader}>
                  <Text style={[styles.alternativeName, { color: colors.text }]}>
                    {alt.name}
                  </Text>
                  <View style={styles.ratingContainer}>
                    <IconSymbol name="star.fill" size={12} color={colors.warning} />
                    <Text style={[styles.ratingText, { color: colors.mutedForeground }]}>
                      {alt.rating}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.priceComparison}>
                  <Text style={[styles.altPrice, { color: colors.text }]}>
                    {alt.price}
                  </Text>
                  <Text style={[styles.savings, { 
                    color: alt.savings.startsWith('-') ? colors.error : colors.success 
                  }]}>
                    {alt.savings}
                  </Text>
                </View>
                
                <Text style={[styles.altStore, { color: colors.mutedForeground }]}>
                  {alt.store} • {alt.distance}
                </Text>
              </GlassCard>
            ))}
          </ScrollView>
        );

      case 'reviews':
        return (
          <ScrollView style={styles.contentContainer}>
            {productInfo.reviews.map((review, index) => (
              <GlassCard key={index} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewRating}>
                    {[...Array(5)].map((_, i) => (
                      <IconSymbol
                        key={i}
                        name={i < review.rating ? "star.fill" : "star"}
                        size={12}
                        color={i < review.rating ? colors.warning : colors.mutedForeground}
                      />
                    ))}
                  </View>
                  <View style={styles.reviewSource}>
                    <Text style={[styles.sourceText, { color: colors.mutedForeground }]}>
                      {review.source}
                    </Text>
                    {review.verified && (
                      <IconSymbol name="checkmark.circle.fill" size={12} color={colors.success} />
                    )}
                  </View>
                </View>
                <Text style={[styles.reviewComment, { color: colors.text }]}>
                  {review.comment}
                </Text>
              </GlassCard>
            ))}
          </ScrollView>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {showCamera ? (
          renderCamera()
        ) : (
          <>
            {/* Header */}
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              style={styles.header}
            >
              <View style={styles.headerContent}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={handleClose}
                >
                  <IconSymbol name="xmark" size={20} color="#FFFFFF" />
                </TouchableOpacity>
                
                <Text style={styles.headerTitle}>Smart Shopping</Text>
                
                <TouchableOpacity
                  style={styles.helpButton}
                  onPress={() => Alert.alert('Help', 'Point your camera at any product to get information, compare prices, and find stores.')}
                >
                  <IconSymbol name="questionmark.circle" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </LinearGradient>

            {/* Content */}
            <View style={styles.content}>
              {!capturedImage ? (
                // Initial state
                <View style={styles.startContainer}>
                  <IconSymbol name="camera.fill" size={80} color={colors.mutedForeground} />
                  <Text style={[styles.startTitle, { color: colors.text }]}>
                    Scan Any Product
                  </Text>
                  <Text style={[styles.startDescription, { color: colors.mutedForeground }]}>
                    Get instant information, compare prices, and find the best deals
                  </Text>
                  
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: colors.primary }]}
                      onPress={async () => {
                        const hasPermission = await requestCameraPermission();
                        if (hasPermission) {
                          setShowCamera(true);
                        }
                      }}
                    >
                      <IconSymbol name="camera.fill" size={24} color="#FFFFFF" />
                      <Text style={styles.actionButtonText}>Take Photo</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: colors.secondary }]}
                      onPress={selectFromGallery}
                    >
                      <IconSymbol name="photo" size={24} color="#FFFFFF" />
                      <Text style={styles.actionButtonText}>Choose Photo</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : isAnalyzing ? (
                // Loading state
                <View style={styles.analyzingContainer}>
                  <Image source={{ uri: capturedImage }} style={styles.analyzingImage} />
                  <View style={styles.loadingOverlay}>
                    <IconSymbol name="sparkles" size={40} color={colors.primary} />
                    <Text style={[styles.analyzingText, { color: colors.text }]}>
                      Analyzing Product...
                    </Text>
                    <Text style={[styles.analyzingSubtext, { color: colors.mutedForeground }]}>
                      Using AI to identify and compare
                    </Text>
                  </View>
                </View>
              ) : productInfo ? (
                // Results state
                <>
                  <View style={styles.resultHeader}>
                    <Image source={{ uri: capturedImage }} style={styles.resultImage} />
                    <TouchableOpacity
                      style={[styles.retakeButton, { backgroundColor: colors.surface }]}
                      onPress={resetState}
                    >
                      <IconSymbol name="camera.fill" size={16} color={colors.primary} />
                      <Text style={[styles.retakeText, { color: colors.primary }]}>Retake</Text>
                    </TouchableOpacity>
                  </View>
                  
                  {renderProductTabs()}
                  {renderProductContent()}
                </>
              ) : null}
            </View>
          </>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // Camera styles
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  cameraHeader: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cameraButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanFrame: {
    position: 'absolute',
    top: '30%',
    left: '20%',
    right: '20%',
    bottom: '40%',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  scanCorner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#FFFFFF',
    top: -2,
    left: -2,
  },
  scanCornerTopRight: {
    top: -2,
    right: -2,
    left: 'auto',
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderLeftWidth: 0,
  },
  scanCornerBottomLeft: {
    bottom: -2,
    top: 'auto',
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderTopWidth: 0,
  },
  scanCornerBottomRight: {
    bottom: -2,
    right: -2,
    top: 'auto',
    left: 'auto',
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.large,
  },
  captureButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderColor: '#000000',
  },
  placeholder: {
    width: 50,
    height: 50,
  },

  // Header styles
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: '#FFFFFF',
  },
  helpButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Content styles
  content: {
    flex: 1,
  },
  startContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  startTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 24,
    marginBottom: 12,
  },
  startDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  actionButtons: {
    gap: 16,
    width: '100%',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 12,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: "600",
  },

  // Analyzing styles
  analyzingContainer: {
    flex: 1,
    position: 'relative',
  },
  analyzingImage: {
    width: '100%',
    height: '60%',
    resizeMode: 'cover',
  },
  loadingOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  analyzingText: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
  },
  analyzingSubtext: {
    fontSize: 14,
    marginTop: 4,
  },

  // Result styles
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  resultImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  retakeText: {
    fontSize: 14,
    fontWeight: "500",
  },

  // Tab styles
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "500",
  },

  // Content styles
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  productCard: {
    padding: 20,
    marginBottom: 16,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
  },
  confidenceIndicator: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 12,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: "500",
  },
  productCategory: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  priceContainer: {
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  sustainabilityCard: {
    backgroundColor: 'rgba(34, 197, 94, 0.05)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.2)',
  },
  sustainabilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sustainabilityTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  sustainabilityFactors: {
    fontSize: 12,
    lineHeight: 18,
  },

  // Store card styles
  storeCard: {
    padding: 16,
    marginBottom: 12,
  },
  storeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  storeName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  storeLocation: {
    fontSize: 12,
  },
  stockIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stockText: {
    fontSize: 10,
    fontWeight: "600",
  },
  storePrice: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  navigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  navigateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: "600",
  },

  // Alternative card styles
  alternativeCard: {
    padding: 16,
    marginBottom: 12,
  },
  alternativeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  alternativeName: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
  },
  priceComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  altPrice: {
    fontSize: 16,
    fontWeight: "700",
  },
  savings: {
    fontSize: 14,
    fontWeight: "600",
  },
  altStore: {
    fontSize: 12,
  },

  // Review card styles
  reviewCard: {
    padding: 16,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewRating: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewSource: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sourceText: {
    fontSize: 12,
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
  },
});
