/**
 * 🛍️ Enhanced Shopping Assistant - Mobile App Reference
 * 
 * Modern, elegant shopping assistant matching your sophisticated design system.
 * Removes orange gradients, applies consistent color schemes, and creates
 * world-class user experience aligned with your app's layout.
 * 
 * Key Improvements:
 * - Elegant header design consistent with app headers
 * - Refined color scheme (no orange gradients)
 * - Modern card layouts with proper spacing
 * - Image upload functionality for card scanning
 * - World-class UI/UX with sophisticated animations
 * 
 * @author Senior Architect
 * @version 3.0.0 - Mobile App Enhancement
 */

import React, { useState, useRef, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
  Alert,
  Dimensions,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  Animated,
  TextInput
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import * as ImagePicker from 'expo-image-picker'
import * as Haptics from 'expo-haptics'
import { IconSymbol } from '@/components/ui/IconSymbol'
import { useTheme } from '@/context/ThemeContext'

const { width, height } = Dimensions.get('window')

interface EnhancedShoppingAssistantProps {
  visible: boolean
  onClose: () => void
  venueId?: string
}

interface ProductScanResult {
  productName: string
  description: string
  category: string
  price: string
  confidence: number
  stores: StoreInfo[]
  barcode?: string
}

interface StoreInfo {
  name: string
  price: string
  location: string
  distance: string
  availability: 'in-stock' | 'low-stock' | 'out-of-stock'
}

interface QuickAction {
  id: string
  title: string
  description: string
  icon: string
  onPress: () => void
}

export default function EnhancedShoppingAssistant({ 
  visible, 
  onClose, 
  venueId 
}: EnhancedShoppingAssistantProps) {
  const { colors, isDark } = useTheme()
  const [currentStep, setCurrentStep] = useState<'home' | 'scanning' | 'results' | 'store-cards'>('home')
  const [scanResult, setScanResult] = useState<ProductScanResult | null>(null)
  const [scannedImage, setScannedImage] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [uploadedCardImage, setUploadedCardImage] = useState<string | null>(null)

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(height)).current

  // Quick actions for shopping experience
  const quickActions: QuickAction[] = [
    {
      id: 'ai-scan',
      title: 'AI Product Scanner',
      description: 'Identify any product instantly with camera',
      icon: 'camera.viewfinder',
      onPress: handleCameraScan
    },
    {
      id: 'gallery-scan',
      title: 'Upload & Scan',
      description: 'Scan products from your photo gallery',
      icon: 'photo.stack',
      onPress: handleGalleryUpload
    },
    {
      id: 'store-cards',
      title: 'Digital Store Cards',
      description: 'Manage loyalty cards and rewards',
      icon: 'creditcard.and.123',
      onPress: () => setCurrentStep('store-cards')
    },
    {
      id: 'price-compare',
      title: 'Price Comparison',
      description: 'Compare prices across different stores',
      icon: 'chart.bar.xaxis',
      onPress: handlePriceComparison
    }
  ]

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        })
      ]).start()
    } else {
      fadeAnim.setValue(0)
      slideAnim.setValue(height)
    }
  }, [visible])

  async function handleCameraScan() {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync()
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Camera access is needed to scan products')
        return
      }

      setCurrentStep('scanning')
      setIsScanning(true)
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      })

      if (!result.canceled && result.assets[0]) {
        setScannedImage(result.assets[0].uri)
        await processProductImage(result.assets[0].uri)
      } else {
        setCurrentStep('home')
        setIsScanning(false)
      }
    } catch (error) {
      console.error('Camera scan error:', error)
      Alert.alert('Error', 'Failed to access camera')
      setCurrentStep('home')
      setIsScanning(false)
    }
  }

  async function handleGalleryUpload() {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Photo library access is needed')
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      })

      if (!result.canceled && result.assets[0]) {
        setCurrentStep('scanning')
        setIsScanning(true)
        setScannedImage(result.assets[0].uri)
        await processProductImage(result.assets[0].uri)
      }
    } catch (error) {
      console.error('Gallery upload error:', error)
      Alert.alert('Error', 'Failed to process image')
    }
  }

  async function handleCardImageUpload() {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Photo library access is needed')
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 10], // Card ratio
        quality: 0.9,
      })

      if (!result.canceled && result.assets[0]) {
        setUploadedCardImage(result.assets[0].uri)
        // Process card image and create virtual card
        await processStoreCard(result.assets[0].uri)
      }
    } catch (error) {
      console.error('Card upload error:', error)
      Alert.alert('Error', 'Failed to process card image')
    }
  }

  async function processProductImage(imageUri: string) {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    
    // Simulate AI processing
    setTimeout(() => {
      const mockResult: ProductScanResult = {
        productName: 'iPhone 15 Pro Max',
        description: 'Latest flagship smartphone with titanium design',
        category: 'Electronics',
        price: 'R21,999 - R24,999',
        confidence: 0.96,
        barcode: '194252916346',
        stores: [
          {
            name: 'iStore - Sandton City',
            price: 'R21,999',
            location: 'Upper Level, Shop 123',
            distance: '0.2km',
            availability: 'in-stock'
          },
          {
            name: 'Incredible Connection',
            price: 'R23,499',
            location: 'Ground Floor, Shop 45',
            distance: '1.2km',
            availability: 'low-stock'
          },
          {
            name: 'Takealot Collection Point',
            price: 'R24,999',
            location: 'Level 2, Shop 67',
            distance: '0.8km',
            availability: 'out-of-stock'
          }
        ]
      }

      setScanResult(mockResult)
      setIsScanning(false)
      setCurrentStep('results')
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    }, 3500)
  }

  async function processStoreCard(imageUri: string) {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    
    // Simulate card processing and barcode generation
    setTimeout(() => {
      Alert.alert(
        'Card Processed Successfully!',
        'Your store card has been digitized and added to your wallet with a new barcode.',
        [
          { text: 'View Card', onPress: () => console.log('View card in wallet') },
          { text: 'OK' }
        ]
      )
      setUploadedCardImage(null)
    }, 2000)
  }

  function handlePriceComparison() {
    Alert.alert('Price Comparison', 'Opening price comparison tool...')
  }

  function handleClose() {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      })
    ]).start(() => {
      setCurrentStep('home')
      setScanResult(null)
      setScannedImage(null)
      setIsScanning(false)
      setUploadedCardImage(null)
      onClose()
    })
  }

  function renderHeader() {
    return (
      <View style={[styles.header, { backgroundColor: isDark ? colors.surface : '#FFFFFF' }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={[styles.headerButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}
              onPress={handleClose}
            >
              <IconSymbol name="xmark" size={18} color={colors.text} />
            </TouchableOpacity>
            
            <View style={styles.headerTitleContainer}>
              <Text style={[styles.headerTitle, { color: colors.text }]}>
                Shopping Assistant
              </Text>
              <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                AI-powered shopping companion
              </Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.headerButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}
              onPress={() => Alert.alert('Help', 'Shopping assistant helps you scan products, compare prices, and manage store cards.')}
            >
              <IconSymbol name="questionmark.circle" size={18} color={colors.text} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    )
  }

  function renderQuickActions() {
    return (
      <View style={styles.quickActionsContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Quick Actions
        </Text>
        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
          Choose how you'd like to start shopping
        </Text>
        
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={action.id}
              style={[styles.actionCard, { backgroundColor: isDark ? colors.surface : '#FFFFFF' }]}
              onPress={action.onPress}
              activeOpacity={0.8}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: colors.primary + '15' }]}>
                <IconSymbol name={action.icon} size={24} color={colors.primary} />
              </View>
              
              <View style={styles.actionContent}>
                <Text style={[styles.actionTitle, { color: colors.text }]}>
                  {action.title}
                </Text>
                <Text style={[styles.actionDescription, { color: colors.textSecondary }]}>
                  {action.description}
                </Text>
              </View>
              
              <View style={styles.actionArrow}>
                <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    )
  }

  function renderSearchBar() {
    return (
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: isDark ? colors.surface : '#F8FAFC' }]}>
          <IconSymbol name="magnifyingglass" size={18} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search products or scan history..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
    )
  }

  function renderScanningState() {
    return (
      <View style={styles.scanningContainer}>
        <View style={[styles.scanningCard, { backgroundColor: isDark ? colors.surface : '#FFFFFF' }]}>
          <ActivityIndicator size="large" color={colors.primary} style={styles.loadingIndicator} />
          
          <Text style={[styles.scanningTitle, { color: colors.text }]}>
            Processing with AI...
          </Text>
          <Text style={[styles.scanningSubtitle, { color: colors.textSecondary }]}>
            Analyzing your image for product information
          </Text>
          
          {scannedImage && (
            <Image source={{ uri: scannedImage }} style={styles.scanningImage} />
          )}
          
          <View style={styles.processingSteps}>
            <View style={styles.stepItem}>
              <View style={[styles.stepIndicator, { backgroundColor: colors.success }]} />
              <Text style={[styles.stepText, { color: colors.text }]}>Image captured</Text>
            </View>
            <View style={styles.stepItem}>
              <View style={[styles.stepIndicator, { backgroundColor: colors.primary }]} />
              <Text style={[styles.stepText, { color: colors.text }]}>AI analyzing...</Text>
            </View>
            <View style={styles.stepItem}>
              <View style={[styles.stepIndicator, { backgroundColor: colors.textSecondary }]} />
              <Text style={[styles.stepText, { color: colors.textSecondary }]}>Finding stores</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }

  function renderResults() {
    if (!scanResult) return null

    return (
      <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
        {/* Product Information */}
        <View style={[styles.productCard, { backgroundColor: isDark ? colors.surface : '#FFFFFF' }]}>
          <View style={styles.productHeader}>
            <View style={styles.productInfo}>
              <Text style={[styles.productName, { color: colors.text }]}>
                {scanResult.productName}
              </Text>
              <Text style={[styles.productDescription, { color: colors.textSecondary }]}>
                {scanResult.description}
              </Text>
              <Text style={[styles.productPrice, { color: colors.primary }]}>
                {scanResult.price}
              </Text>
            </View>
            
            <View style={styles.confidenceContainer}>
              <Text style={[styles.confidenceLabel, { color: colors.textSecondary }]}>
                AI Confidence
              </Text>
              <Text style={[styles.confidenceValue, { color: colors.success }]}>
                {Math.round(scanResult.confidence * 100)}%
              </Text>
            </View>
          </View>
          
          {scanResult.barcode && (
            <View style={styles.barcodeContainer}>
              <Text style={[styles.barcodeLabel, { color: colors.textSecondary }]}>
                Barcode: {scanResult.barcode}
              </Text>
            </View>
          )}
        </View>

        {/* Store Availability */}
        <View style={styles.storesSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Store Availability
          </Text>
          
          {scanResult.stores.map((store, index) => (
            <View
              key={index}
              style={[styles.storeCard, { backgroundColor: isDark ? colors.surface : '#FFFFFF' }]}
            >
              <View style={styles.storeInfo}>
                <Text style={[styles.storeName, { color: colors.text }]}>
                  {store.name}
                </Text>
                <Text style={[styles.storeLocation, { color: colors.textSecondary }]}>
                  {store.location} • {store.distance}
                </Text>
                
                <View style={styles.storeDetails}>
                  <View style={[
                    styles.availabilityBadge,
                    { 
                      backgroundColor: store.availability === 'in-stock' ? colors.success + '20' : 
                                     store.availability === 'low-stock' ? colors.warning + '20' : 
                                     colors.error + '20'
                    }
                  ]}>
                    <Text style={[
                      styles.availabilityText,
                      { 
                        color: store.availability === 'in-stock' ? colors.success : 
                               store.availability === 'low-stock' ? colors.warning : 
                               colors.error
                      }
                    ]}>
                      {store.availability === 'in-stock' ? 'In Stock' :
                       store.availability === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.storePriceContainer}>
                <Text style={[styles.storePrice, { color: colors.text }]}>
                  {store.price}
                </Text>
                <TouchableOpacity
                  style={[styles.navigateButton, { backgroundColor: colors.primary }]}
                  onPress={() => Alert.alert('Navigate', `Navigate to ${store.name}?`)}
                >
                  <IconSymbol name="location.fill" size={14} color="#FFFFFF" />
                  <Text style={styles.navigateButtonText}>Navigate</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => {
              setCurrentStep('home')
              setScanResult(null)
              setScannedImage(null)
            }}
          >
            <IconSymbol name="camera.fill" size={18} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Scan Again</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: isDark ? colors.surface : '#F8FAFC', borderWidth: 1, borderColor: colors.border }]}
            onPress={() => Alert.alert('Share', 'Sharing product information...')}
          >
            <IconSymbol name="square.and.arrow.up" size={18} color={colors.primary} />
            <Text style={[styles.shareButtonText, { color: colors.primary }]}>Share</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }

  function renderStoreCards() {
    return (
      <View style={styles.storeCardsContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Digital Store Cards
        </Text>
        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
          Upload and manage your loyalty cards digitally
        </Text>
        
        <TouchableOpacity
          style={[styles.uploadCardButton, { backgroundColor: isDark ? colors.surface : '#FFFFFF' }]}
          onPress={handleCardImageUpload}
        >
          <View style={[styles.uploadIconContainer, { backgroundColor: colors.primary + '15' }]}>
            <IconSymbol name="plus.circle.fill" size={32} color={colors.primary} />
          </View>
          <Text style={[styles.uploadTitle, { color: colors.text }]}>
            Upload Store Card
          </Text>
          <Text style={[styles.uploadDescription, { color: colors.textSecondary }]}>
            Take a photo of your card to create a digital version with barcode
          </Text>
        </TouchableOpacity>
        
        {uploadedCardImage && (
          <View style={[styles.uploadPreview, { backgroundColor: isDark ? colors.surface : '#FFFFFF' }]}>
            <Image source={{ uri: uploadedCardImage }} style={styles.previewImage} />
            <Text style={[styles.previewText, { color: colors.text }]}>
              Processing card image...
            </Text>
          </View>
        )}
      </View>
    )
  }

  function renderContent() {
    switch (currentStep) {
      case 'scanning':
        return renderScanningState()
      case 'results':
        return renderResults()
      case 'store-cards':
        return renderStoreCards()
      default:
        return (
          <ScrollView style={styles.homeContainer} showsVerticalScrollIndicator={false}>
            {renderSearchBar()}
            {renderQuickActions()}
          </ScrollView>
        )
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="none"
      presentationStyle="fullScreen"
    >
      <Animated.View 
        style={[
          styles.container,
          { backgroundColor: isDark ? colors.background : '#F8FAFC' },
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        {renderHeader()}
        {renderContent()}
      </Animated.View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  homeContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchContainer: {
    paddingVertical: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
  },
  quickActionsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  actionsGrid: {
    gap: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  actionArrow: {
    marginLeft: 12,
  },
  scanningContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  scanningCard: {
    width: '100%',
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  loadingIndicator: {
    marginBottom: 24,
  },
  scanningTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  scanningSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  scanningImage: {
    width: 180,
    height: 135,
    borderRadius: 12,
    marginBottom: 24,
  },
  processingSteps: {
    alignSelf: 'stretch',
    gap: 12,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stepText: {
    fontSize: 14,
    fontWeight: '500',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  productCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  productInfo: {
    flex: 1,
    marginRight: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  productDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
  },
  confidenceContainer: {
    alignItems: 'center',
  },
  confidenceLabel: {
    fontSize: 11,
    marginBottom: 4,
  },
  confidenceValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  barcodeContainer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  barcodeLabel: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
  storesSection: {
    marginBottom: 24,
  },
  storeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  storeInfo: {
    flex: 1,
    marginRight: 16,
  },
  storeName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  storeLocation: {
    fontSize: 12,
    marginBottom: 8,
  },
  storeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  availabilityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  storePriceContainer: {
    alignItems: 'flex-end',
  },
  storePrice: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  navigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  navigateButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  shareButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  storeCardsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  uploadCardButton: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  uploadIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  uploadDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  uploadPreview: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  previewImage: {
    width: 200,
    height: 125,
    borderRadius: 8,
    marginBottom: 12,
  },
  previewText: {
    fontSize: 14,
    fontWeight: '500',
  },
})
