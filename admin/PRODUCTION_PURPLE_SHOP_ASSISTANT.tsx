/**
 * 🚀 PRODUCTION PURPLE SHOP ASSISTANT - FINAL FIX
 * 
 * This file ELIMINATES the blue-orange gradient from your screenshot and
 * implements a beautiful purple theme throughout the AI Shop Assistant.
 * 
 * 🎯 DEPLOYMENT: Replace your /NaviLynx/app/(tabs)/shop-assistant.tsx with this file
 * 
 * ✅ FIXES:
 * - Removes blue-to-orange header gradient (screenshot issue)
 * - Converts all action button colors to purple variants  
 * - Implements consistent purple theme (#9333EA)
 * - Maintains all existing functionality
 * - Enhances animations and UX
 * 
 * 🏔️ OPERATION LIONMOUNTAIN - PRODUCTION READY
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Easing,
  StatusBar
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

// 🎨 PRODUCTION PURPLE THEME - ELIMINATES ALL ORANGE/BLUE!
const PRODUCTION_PURPLE = {
  primary: '#9333EA',        // Main purple (replaces blue)
  primaryLight: '#A855F7',   // Light purple (replaces orange)
  primaryDark: '#7C3AED',    // Dark purple  
  accent: '#C084FC',         // Purple accent
  violet: '#8B5CF6',         // Violet shade
  indigo: '#6366F1',         // Indigo complement
  fuchsia: '#D946EF',        // Fuchsia accent
  background: '#F8FAFC',     // Light background
  surface: '#FFFFFF',        // Card background
  text: '#1E293B',           // Primary text
  textSecondary: '#64748B'   // Secondary text
}

export default function ShopAssistantScreen() {
  const { colors, isDark } = useTheme()
  const { t } = useLanguage()
  const router = useRouter()

  // State management
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([])
  const [recommendations, setRecommendations] = useState<ShoppingRecommendation[]>([])
  const [scanModalVisible, setScanModalVisible] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [insights, setInsights] = useState<any>(null)
  
  // Animation values for purple-themed animations
  const pulseAnim = useRef(new Animated.Value(1)).current
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    startPurpleAnimations()
    loadShoppingData()
  }, [])

  const startPurpleAnimations = () => {
    // Purple pulse animation for action buttons
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start()

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start()
  }

  const loadShoppingData = async () => {
    try {
      const [listsData, recsData] = await Promise.all([
        ShopAssistantService.getShoppingLists(),
        ShopAssistantService.getRecommendations()
      ])
      
      setShoppingLists(listsData)
      setRecommendations(recsData)
      
      // Load AI insights
      const insightsData = await ShopAssistantService.getShoppingInsights()
      setInsights(insightsData)
    } catch (error) {
      console.error('Error loading shopping data:', error)
    }
  }

  const handleQuickAction = async (action: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    
    switch (action) {
      case 'scan':
        setScanModalVisible(true)
        break
      case 'deals':
        router.push('/deals')
        break
      case 'assistant':
        router.push('/chat/navigenie')
        break
      case 'stores':
        router.push('/ar-navigator')
        break
    }
  }

  const handleCameraScan = async () => {
    try {
      setScanModalVisible(false)
      setIsScanning(true)
      
      const scanResult = await ProductScannerService.scanWithCamera()
      if (scanResult.success) {
        // Process scan result with purple-themed success
        Alert.alert(
          '🎯 Product Detected!',
          `Found: ${scanResult.product.name}\nPrice: ${scanResult.product.price}`,
          [
            { text: 'View Details', style: 'default' },
            { text: 'Compare Prices', style: 'default' }
          ]
        )
      }
    } catch (error) {
      Alert.alert('Scan Error', 'Unable to scan product. Please try again.')
    } finally {
      setIsScanning(false)
    }
  }

  const handleLibraryScan = async () => {
    try {
      setScanModalVisible(false)
      setIsScanning(true)
      
      const imageResult = await ProductScannerService.selectImageFromLibrary()
      if (imageResult.success) {
        const scanResult = await ProductScannerService.analyzeImage(imageResult.uri)
        
        if (scanResult.success) {
          Alert.alert(
            '🎯 Product Identified!',
            `Found: ${scanResult.product.name}\nPrice: ${scanResult.product.price}`,
            [
              { text: 'View Details', style: 'default' },
              { text: 'Compare Prices', style: 'default' }
            ]
          )
        }
      }
    } catch (error) {
      Alert.alert('Analysis Error', 'Unable to analyze image. Please try again.')
    } finally {
      setIsScanning(false)
    }
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await loadShoppingData()
    setRefreshing(false)
  }, [])

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: PRODUCTION_PURPLE.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={PRODUCTION_PURPLE.primary} />
      
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={PRODUCTION_PURPLE.primary}
          />
        }
      >
        {/* 🎨 PURPLE HEADER - REPLACES BLUE/ORANGE GRADIENT FROM SCREENSHOT */}
        <LinearGradient
          colors={[PRODUCTION_PURPLE.primary, PRODUCTION_PURPLE.primaryLight, PRODUCTION_PURPLE.violet]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>AI Shop Assistant</Text>
          <Text style={styles.headerSubtitle}>
            Smart shopping with AI-powered insights
          </Text>
        </LinearGradient>

        {/* 🚀 PURPLE-THEMED QUICK ACTIONS - REPLACES ALL COLORED BUTTONS */}
        <Animated.View style={[styles.quickActionsContainer, { opacity: fadeAnim }]}>
          <Text style={[styles.sectionTitle, { color: PRODUCTION_PURPLE.text }]}>
            🚀 Quick Actions
          </Text>
          <Text style={[styles.sectionSubtitle, { color: PRODUCTION_PURPLE.textSecondary }]}>
            AI-powered shopping tools at your fingertips
          </Text>
          
          <View style={styles.actionsGrid}>
            {/* Smart Scan - Purple Gradient (replaces blue-brown from screenshot) */}
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity
                onPress={() => handleQuickAction('scan')}
                style={[styles.actionButton, { shadowColor: PRODUCTION_PURPLE.primary }]}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[PRODUCTION_PURPLE.primary, PRODUCTION_PURPLE.primaryDark]}
                  style={styles.actionIcon}
                >
                  <Ionicons name="scan" size={28} color="white" />
                </LinearGradient>
                <Text style={[styles.actionText, { color: PRODUCTION_PURPLE.text }]}>
                  🔍 Smart Scan
                </Text>
                <Text style={[styles.actionSubtext, { color: PRODUCTION_PURPLE.textSecondary }]}>
                  AI product recognition
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* AI Assistant - Violet Gradient (replaces orange from screenshot) */}
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity
                onPress={() => handleQuickAction('assistant')}
                style={[styles.actionButton, { shadowColor: PRODUCTION_PURPLE.violet }]}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[PRODUCTION_PURPLE.violet, PRODUCTION_PURPLE.indigo]}
                  style={styles.actionIcon}
                >
                  <Ionicons name="chatbubble-ellipses" size={28} color="white" />
                </LinearGradient>
                <Text style={[styles.actionText, { color: PRODUCTION_PURPLE.text }]}>
                  🤖 AI Assistant
                </Text>
                <Text style={[styles.actionSubtext, { color: PRODUCTION_PURPLE.textSecondary }]}>
                  Smart shopping advice
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Hot Deals - Fuchsia Gradient (replaces red-orange from screenshot) */}
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity
                onPress={() => handleQuickAction('deals')}
                style={[styles.actionButton, { shadowColor: PRODUCTION_PURPLE.fuchsia }]}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[PRODUCTION_PURPLE.fuchsia, PRODUCTION_PURPLE.accent]}
                  style={styles.actionIcon}
                >
                  <Ionicons name="pricetag" size={28} color="white" />
                </LinearGradient>
                <Text style={[styles.actionText, { color: PRODUCTION_PURPLE.text }]}>
                  💎 Hot Deals
                </Text>
                <Text style={[styles.actionSubtext, { color: PRODUCTION_PURPLE.textSecondary }]}>
                  Curated savings
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Find Stores - Accent Gradient (replaces blue-teal from screenshot) */}
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity
                onPress={() => handleQuickAction('stores')}
                style={[styles.actionButton, { shadowColor: PRODUCTION_PURPLE.accent }]}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[PRODUCTION_PURPLE.accent, PRODUCTION_PURPLE.primaryLight]}
                  style={styles.actionIcon}
                >
                  <Ionicons name="storefront" size={28} color="white" />
                </LinearGradient>
                <Text style={[styles.actionText, { color: PRODUCTION_PURPLE.text }]}>
                  🏪 Find Stores
                </Text>
                <Text style={[styles.actionSubtext, { color: PRODUCTION_PURPLE.textSecondary }]}>
                  AR navigation ready
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>

        {/* Smart Recommendations with Purple Theme */}
        {recommendations.length > 0 && (
          <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
            <View style={styles.sectionHeader}>
              <Ionicons name="bulb" size={24} color={PRODUCTION_PURPLE.primary} />
              <Text style={[styles.sectionTitle, { color: PRODUCTION_PURPLE.text }]}>
                Smart Recommendations
              </Text>
            </View>
            
            {recommendations.map((rec, index) => (
              <View key={index} style={[styles.recommendationCard, { backgroundColor: PRODUCTION_PURPLE.surface }]}>
                <View style={styles.recommendationHeader}>
                  <Ionicons name="bulb" size={20} color={PRODUCTION_PURPLE.primary} />
                  <Text style={[styles.recommendationTitle, { color: PRODUCTION_PURPLE.text }]}>
                    {rec.title}
                  </Text>
                  <Text style={[styles.confidenceText, { 
                    color: PRODUCTION_PURPLE.primary,
                    backgroundColor: PRODUCTION_PURPLE.primary + '15'
                  }]}>
                    {Math.round(rec.confidence * 100)}% sure
                  </Text>
                </View>
                <Text style={[styles.recommendationDescription, { color: PRODUCTION_PURPLE.textSecondary }]}>
                  {rec.description}
                </Text>
              </View>
            ))}
          </Animated.View>
        )}

        {/* Shopping Lists Summary */}
        {shoppingLists.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="list" size={24} color={PRODUCTION_PURPLE.primary} />
              <Text style={[styles.sectionTitle, { color: PRODUCTION_PURPLE.text }]}>
                Your Lists
              </Text>
              <TouchableOpacity>
                <Text style={{ color: PRODUCTION_PURPLE.primary, fontWeight: '500' }}>
                  View All
                </Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {shoppingLists.slice(0, 3).map(list => (
                <TouchableOpacity
                  key={list.id}
                  style={[styles.listCard, { backgroundColor: PRODUCTION_PURPLE.surface }]}
                >
                  <Text style={[styles.listTitle, { color: PRODUCTION_PURPLE.text }]}>
                    {list.name}
                  </Text>
                  <Text style={[styles.listItems, { color: PRODUCTION_PURPLE.textSecondary }]}>
                    {list.items.length} items
                  </Text>
                  <View style={[styles.listProgress, { backgroundColor: PRODUCTION_PURPLE.primary + '20' }]}>
                    <View style={[
                      styles.listProgressFill, 
                      { 
                        backgroundColor: PRODUCTION_PURPLE.primary,
                        width: `${(list.completedItems / list.items.length) * 100}%`
                      }
                    ]} />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* AI Insights Dashboard */}
        {insights && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="analytics" size={24} color={PRODUCTION_PURPLE.primary} />
              <Text style={[styles.sectionTitle, { color: PRODUCTION_PURPLE.text }]}>
                📊 Smart Insights
              </Text>
            </View>
            
            <View style={[styles.insightsCard, { backgroundColor: PRODUCTION_PURPLE.surface }]}>
              <View style={styles.insightItem}>
                <Text style={[styles.insightLabel, { color: PRODUCTION_PURPLE.textSecondary }]}>
                  Monthly Savings
                </Text>
                <Text style={[styles.insightValue, { color: PRODUCTION_PURPLE.primary }]}>
                  R{insights.monthlySavings}
                </Text>
              </View>
              <View style={styles.insightItem}>
                <Text style={[styles.insightLabel, { color: PRODUCTION_PURPLE.textSecondary }]}>
                  Best Store
                </Text>
                <Text style={[styles.insightValue, { color: PRODUCTION_PURPLE.primary }]}>
                  {insights.bestStore}
                </Text>
              </View>
              <View style={styles.insightItem}>
                <Text style={[styles.insightLabel, { color: PRODUCTION_PURPLE.textSecondary }]}>
                  Scan Accuracy
                </Text>
                <Text style={[styles.insightValue, { color: PRODUCTION_PURPLE.primary }]}>
                  {insights.scanAccuracy}%
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* AI Tip Badge */}
        <Animated.View style={[styles.tipBadge, { 
          backgroundColor: PRODUCTION_PURPLE.primary + '15',
          opacity: fadeAnim 
        }]}>
          <Ionicons name="sparkles" size={16} color={PRODUCTION_PURPLE.primary} />
          <Text style={[styles.tipText, { color: PRODUCTION_PURPLE.primary }]}>
            AI Tip: Best shopping time is Tuesday 2-4PM for maximum savings!
          </Text>
        </Animated.View>
      </ScrollView>

      {/* Purple-Themed Scan Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={scanModalVisible}
        onRequestClose={() => setScanModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: PRODUCTION_PURPLE.surface }]}>
            <LinearGradient
              colors={[PRODUCTION_PURPLE.primary, PRODUCTION_PURPLE.primaryLight]}
              style={styles.modalHeader}
            >
              <Text style={styles.modalTitle}>🔍 Smart Product Scanner</Text>
              <Text style={styles.modalSubtitle}>
                Point your camera at any product for instant information
              </Text>
            </LinearGradient>

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={handleCameraScan}
                style={[styles.modalButton, { backgroundColor: PRODUCTION_PURPLE.primary }]}
              >
                <Ionicons name="camera" size={24} color="white" />
                <Text style={styles.modalButtonText}>📸 Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleLibraryScan}
                style={[styles.modalButton, { backgroundColor: PRODUCTION_PURPLE.violet }]}
              >
                <Ionicons name="images" size={24} color="white" />
                <Text style={styles.modalButtonText}>🖼️ Choose from Library</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setScanModalVisible(false)}
                style={[styles.modalButton, { 
                  backgroundColor: 'transparent',
                  borderWidth: 1,
                  borderColor: PRODUCTION_PURPLE.primary 
                }]}
              >
                <Text style={[styles.modalButtonText, { color: PRODUCTION_PURPLE.primary }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Loading Overlay */}
      {isScanning && (
        <View style={styles.loadingOverlay}>
          <LinearGradient
            colors={[PRODUCTION_PURPLE.primary + '90', PRODUCTION_PURPLE.violet + '90']}
            style={styles.loadingContent}
          >
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <Ionicons name="scan" size={60} color="white" />
            </Animated.View>
            <Text style={styles.loadingText}>Analyzing with AI Vision...</Text>
            <Text style={styles.loadingSubtext}>Please wait while we identify your product</Text>
          </LinearGradient>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // Header Styles
  header: {
    paddingHorizontal: 20,
    paddingVertical: 40,
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
  },
  
  // Quick Actions
  quickActionsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  actionButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    minWidth: (width - 60) / 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  actionSubtext: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  
  // Sections
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  
  // Recommendations
  recommendationCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  recommendationDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  
  // Shopping Lists
  listCard: {
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
    marginBottom: 4,
  },
  listItems: {
    fontSize: 12,
    marginBottom: 8,
  },
  listProgress: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  listProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  
  // Insights
  insightsCard: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightItem: {
    alignItems: 'center',
  },
  insightLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  insightValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  // Tip Badge
  tipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    margin: 20,
    borderRadius: 12,
    gap: 8,
  },
  tipText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 20,
    padding: 0,
    margin: 20,
    maxWidth: width - 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  modalHeader: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  modalActions: {
    padding: 20,
    gap: 12,
  },
  modalButton: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  
  // Loading
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    margin: 40,
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    textAlign: 'center',
  },
  loadingSubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
})
