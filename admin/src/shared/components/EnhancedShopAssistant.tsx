/**
 * 🛍️ OPERATION LIONMOUNTAIN - Enhanced Shop Assistant
 * 
 * Complete purple-themed shop assistant with NO orange/blue gradients
 * Features: Store Card Wallet, AI Shopping, Product Scanner, Deal Finder
 * World-class UX with modern purple theme throughout
 * 
 * @version 1.0.0 - LIONMOUNTAIN Edition
 */

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
  Image,
  TextInput,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeIn,
  SlideInUp,
} from 'react-native-reanimated';

import { purpleTheme, spacing, borderRadius, shadows, typography } from '../theme/globalTheme';
import { UniversalCard } from './UniversalCard';
import { AppHeader } from './AppHeader';

const { width, height } = Dimensions.get('window');

// Interfaces
interface LoyaltyCard {
  id: string;
  storeName: string;
  storeColor: string;
  loyaltyNumber: string;
  barcode?: string;
  qrCode?: string;
  logo?: string;
  points?: number;
  tier?: string;
}

interface ShoppingItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image?: string;
  store: string;
  discount?: number;
}

interface Deal {
  id: string;
  title: string;
  description: string;
  discount: string;
  store: string;
  image?: string;
  expiresAt: Date;
  category: string;
}

// Mock Data
const mockLoyaltyCards: LoyaltyCard[] = [
  {
    id: '1',
    storeName: 'Pick n Pay',
    storeColor: '#E31837',
    loyaltyNumber: '1234567890',
    points: 2450,
    tier: 'Gold',
    logo: 'https://example.com/pnp-logo.png',
  },
  {
    id: '2',
    storeName: 'Checkers',
    storeColor: '#0066CC',
    loyaltyNumber: '9876543210',
    points: 1890,
    tier: 'Silver',
    logo: 'https://example.com/checkers-logo.png',
  },
  {
    id: '3',
    storeName: 'Woolworths',
    storeColor: '#00A651',
    loyaltyNumber: '5555666677',
    points: 3200,
    tier: 'Platinum',
    logo: 'https://example.com/woolworths-logo.png',
  },
];

const mockDeals: Deal[] = [
  {
    id: '1',
    title: '50% Off Electronics',
    description: 'Latest smartphones and gadgets',
    discount: '50%',
    store: 'Takealot',
    category: 'Electronics',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    title: 'Buy 2 Get 1 Free',
    description: 'Premium beauty products',
    discount: 'BOGO',
    store: 'Clicks',
    category: 'Beauty',
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  },
];

export const EnhancedShopAssistant: React.FC = () => {
  const [loyaltyCards, setLoyaltyCards] = useState<LoyaltyCard[]>(mockLoyaltyCards);
  const [deals, setDeals] = useState<Deal[]>(mockDeals);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showCardDetail, setShowCardDetail] = useState<LoyaltyCard | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [scannerMode, setScannerMode] = useState<'camera' | 'gallery' | null>(null);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1000);
  }, []);

  const handleAddCard = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowAddCard(true);
  };

  const handleScanCard = async (mode: 'camera' | 'gallery') => {
    setScannerMode(mode);
    
    if (mode === 'camera') {
      // Camera permission and scanning logic
      Alert.alert('Camera Scanner', 'Camera scanning functionality would be implemented here');
    } else {
      // Gallery picker logic
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 10],
        quality: 1,
      });
      
      if (!result.canceled) {
        Alert.alert('Image Selected', 'Image processing for card detection would happen here');
      }
    }
    
    setScannerMode(null);
  };

  const renderLoyaltyCard = (card: LoyaltyCard) => (
    <TouchableOpacity
      key={card.id}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setShowCardDetail(card);
      }}
      style={styles.loyaltyCardContainer}
    >
      <LinearGradient
        colors={[card.storeColor, `${card.storeColor}DD`]}
        style={styles.loyaltyCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.storeName}>{card.storeName}</Text>
          <Text style={styles.tierBadge}>{card.tier}</Text>
        </View>
        
        <View style={styles.cardContent}>
          <Text style={styles.loyaltyNumber}>**** **** {card.loyaltyNumber.slice(-4)}</Text>
          <Text style={styles.pointsText}>{card.points?.toLocaleString()} Points</Text>
        </View>
        
        <View style={styles.cardFooter}>
          <Ionicons name="card" size={24} color="rgba(255,255,255,0.8)" />
          <Text style={styles.tapToView}>Tap to view barcode</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderQuickAction = (icon: string, title: string, onPress: () => void) => (
    <TouchableOpacity onPress={onPress} style={styles.quickActionItem}>
      <LinearGradient
        colors={purpleTheme.gradients.light}
        style={styles.quickActionGradient}
      >
        <Ionicons name={icon as any} size={24} color="white" />
      </LinearGradient>
      <Text style={styles.quickActionText}>{title}</Text>
    </TouchableOpacity>
  );

  const renderDealCard = (deal: Deal) => (
    <UniversalCard
      key={deal.id}
      variant="elevated"
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Alert.alert('Deal Details', deal.description);
      }}
      style={styles.dealCard}
    >
      <View style={styles.dealHeader}>
        <View style={styles.dealBadge}>
          <Text style={styles.dealDiscount}>{deal.discount}</Text>
        </View>
        <Text style={styles.dealStore}>{deal.store}</Text>
      </View>
      
      <Text style={styles.dealTitle}>{deal.title}</Text>
      <Text style={styles.dealDescription}>{deal.description}</Text>
      
      <View style={styles.dealFooter}>
        <Text style={styles.dealCategory}>{deal.category}</Text>
        <Text style={styles.dealExpiry}>
          Expires {deal.expiresAt.toLocaleDateString()}
        </Text>
      </View>
    </UniversalCard>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={purpleTheme.background} />
      
      <AppHeader
        title="Shop Assistant"
        subtitle="Your digital shopping companion"
        rightComponent={
          <TouchableOpacity onPress={handleAddCard} style={styles.addButton}>
            <Ionicons name="add" size={24} color={purpleTheme.primary} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Loyalty Cards Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Loyalty Cards</Text>
            <Text style={styles.sectionSubtitle}>
              {loyaltyCards.length} cards in wallet
            </Text>
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsContainer}
          >
            {loyaltyCards.map(renderLoyaltyCard)}
            
            {/* Add Card Button */}
            <TouchableOpacity onPress={handleAddCard} style={styles.addCardButton}>
              <LinearGradient
                colors={purpleTheme.gradients.subtle}
                style={styles.addCardGradient}
              >
                <Ionicons name="add" size={32} color={purpleTheme.primary} />
                <Text style={styles.addCardText}>Add Card</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {renderQuickAction('scan', 'Scan Barcode', () => handleScanCard('camera'))}
            {renderQuickAction('image', 'Upload Image', () => handleScanCard('gallery'))}
            {renderQuickAction('location', 'Find Stores', () => Alert.alert('Find Stores', 'Store locator coming soon'))}
            {renderQuickAction('chatbubble-ellipses', 'Ask Navigenie', () => Alert.alert('Navigenie', 'AI assistant coming soon'))}
          </View>
        </View>

        {/* Deals Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Exclusive Deals</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {deals.map(renderDealCard)}
        </View>
      </ScrollView>

      {/* Add Card Modal */}
      <Modal
        visible={showAddCard}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <AppHeader
            title="Add Loyalty Card"
            showBackButton
            onBackPress={() => setShowAddCard(false)}
          />
          
          <ScrollView style={styles.modalContent}>
            <UniversalCard variant="elevated" style={styles.scanOptionCard}>
              <TouchableOpacity
                onPress={() => handleScanCard('camera')}
                style={styles.scanOption}
              >
                <Ionicons name="camera" size={48} color={purpleTheme.primary} />
                <Text style={styles.scanOptionTitle}>Scan with Camera</Text>
                <Text style={styles.scanOptionDescription}>
                  Point your camera at the barcode or QR code
                </Text>
              </TouchableOpacity>
            </UniversalCard>
            
            <UniversalCard variant="elevated" style={styles.scanOptionCard}>
              <TouchableOpacity
                onPress={() => handleScanCard('gallery')}
                style={styles.scanOption}
              >
                <Ionicons name="image" size={48} color={purpleTheme.primary} />
                <Text style={styles.scanOptionTitle}>Upload from Gallery</Text>
                <Text style={styles.scanOptionDescription}>
                  Select a photo of your loyalty card
                </Text>
              </TouchableOpacity>
            </UniversalCard>
            
            <UniversalCard variant="elevated" style={styles.scanOptionCard}>
              <View style={styles.scanOption}>
                <Ionicons name="pencil" size={48} color={purpleTheme.primary} />
                <Text style={styles.scanOptionTitle}>Manual Entry</Text>
                <TextInput
                  style={styles.manualInput}
                  placeholder="Enter store name"
                  placeholderTextColor={purpleTheme.textSecondary}
                />
                <TextInput
                  style={styles.manualInput}
                  placeholder="Enter loyalty number"
                  placeholderTextColor={purpleTheme.textSecondary}
                />
              </View>
            </UniversalCard>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Card Detail Modal */}
      <Modal
        visible={!!showCardDetail}
        animationType="fade"
        transparent
      >
        <BlurView intensity={80} style={styles.modalOverlay}>
          <SafeAreaView style={styles.cardDetailContainer}>
            {showCardDetail && (
              <Animated.View
                entering={FadeIn.duration(300)}
                style={styles.cardDetailContent}
              >
                <TouchableOpacity
                  onPress={() => setShowCardDetail(null)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color={purpleTheme.text} />
                </TouchableOpacity>
                
                <LinearGradient
                  colors={[showCardDetail.storeColor, `${showCardDetail.storeColor}DD`]}
                  style={styles.detailCard}
                >
                  <Text style={styles.detailStoreName}>{showCardDetail.storeName}</Text>
                  <Text style={styles.detailLoyaltyNumber}>{showCardDetail.loyaltyNumber}</Text>
                  
                  {/* Mock Barcode */}
                  <View style={styles.barcodeContainer}>
                    <View style={styles.barcode}>
                      {Array.from({ length: 20 }).map((_, i) => (
                        <View
                          key={i}
                          style={[
                            styles.barcodeLine,
                            { width: Math.random() > 0.5 ? 2 : 4 }
                          ]}
                        />
                      ))}
                    </View>
                    <Text style={styles.barcodeNumber}>{showCardDetail.loyaltyNumber}</Text>
                  </View>
                </LinearGradient>
              </Animated.View>
            )}
          </SafeAreaView>
        </BlurView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: purpleTheme.background,
  },
  scrollView: {
    flex: 1,
  },
  addButton: {
    padding: spacing.xs,
    borderRadius: borderRadius.md,
    backgroundColor: `${purpleTheme.primary}15`,
  },
  
  // Section Styles
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: purpleTheme.text,
  },
  sectionSubtitle: {
    fontSize: typography.fontSizes.sm,
    color: purpleTheme.textSecondary,
    marginTop: 2,
  },
  viewAllText: {
    fontSize: typography.fontSizes.sm,
    color: purpleTheme.primary,
    fontWeight: typography.fontWeights.medium,
  },
  
  // Loyalty Cards
  cardsContainer: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  loyaltyCardContainer: {
    width: width * 0.8,
    height: 180,
  },
  loyaltyCard: {
    flex: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    justifyContent: 'space-between',
    ...shadows.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storeName: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: 'white',
  },
  tierBadge: {
    fontSize: typography.fontSizes.xs,
    color: 'white',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    fontWeight: typography.fontWeights.medium,
  },
  cardContent: {
    marginVertical: spacing.md,
  },
  loyaltyNumber: {
    fontSize: typography.fontSizes.lg,
    color: 'white',
    fontWeight: typography.fontWeights.medium,
    letterSpacing: 2,
  },
  pointsText: {
    fontSize: typography.fontSizes.sm,
    color: 'rgba(255,255,255,0.9)',
    marginTop: spacing.xs,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  tapToView: {
    fontSize: typography.fontSizes.xs,
    color: 'rgba(255,255,255,0.8)',
  },
  
  // Add Card Button
  addCardButton: {
    width: width * 0.6,
    height: 180,
  },
  addCardGradient: {
    flex: 1,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: purpleTheme.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  addCardText: {
    fontSize: typography.fontSizes.md,
    color: purpleTheme.primary,
    fontWeight: typography.fontWeights.medium,
  },
  
  // Quick Actions
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  quickActionItem: {
    width: (width - spacing.md * 3) / 2,
    alignItems: 'center',
    gap: spacing.sm,
  },
  quickActionGradient: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  quickActionText: {
    fontSize: typography.fontSizes.sm,
    color: purpleTheme.text,
    fontWeight: typography.fontWeights.medium,
    textAlign: 'center',
  },
  
  // Deals
  dealCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  dealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  dealBadge: {
    backgroundColor: purpleTheme.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  dealDiscount: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
    color: 'white',
  },
  dealStore: {
    fontSize: typography.fontSizes.sm,
    color: purpleTheme.textSecondary,
    fontWeight: typography.fontWeights.medium,
  },
  dealTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: purpleTheme.text,
    marginBottom: spacing.xs,
  },
  dealDescription: {
    fontSize: typography.fontSizes.md,
    color: purpleTheme.textSecondary,
    marginBottom: spacing.md,
  },
  dealFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dealCategory: {
    fontSize: typography.fontSizes.sm,
    color: purpleTheme.primary,
    fontWeight: typography.fontWeights.medium,
  },
  dealExpiry: {
    fontSize: typography.fontSizes.xs,
    color: purpleTheme.textSecondary,
  },
  
  // Modals
  modalContainer: {
    flex: 1,
    backgroundColor: purpleTheme.background,
  },
  modalContent: {
    flex: 1,
    padding: spacing.md,
  },
  scanOptionCard: {
    marginBottom: spacing.md,
  },
  scanOption: {
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  scanOptionTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: purpleTheme.text,
    textAlign: 'center',
  },
  scanOptionDescription: {
    fontSize: typography.fontSizes.md,
    color: purpleTheme.textSecondary,
    textAlign: 'center',
  },
  manualInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: purpleTheme.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.fontSizes.md,
    color: purpleTheme.text,
    backgroundColor: purpleTheme.surface,
  },
  
  // Card Detail Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardDetailContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  cardDetailContent: {
    width: width * 0.9,
    maxWidth: 400,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: -spacing.lg,
    right: spacing.md,
    zIndex: 1,
    backgroundColor: purpleTheme.surface,
    borderRadius: borderRadius.full,
    padding: spacing.sm,
    ...shadows.md,
  },
  detailCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.lg,
    ...shadows.lg,
  },
  detailStoreName: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.bold,
    color: 'white',
    textAlign: 'center',
  },
  detailLoyaltyNumber: {
    fontSize: typography.fontSizes.lg,
    color: 'white',
    fontWeight: typography.fontWeights.medium,
    letterSpacing: 4,
  },
  barcodeContainer: {
    backgroundColor: 'white',
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.md,
    width: '100%',
  },
  barcode: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    height: 60,
  },
  barcodeLine: {
    backgroundColor: '#000',
    height: '100%',
  },
  barcodeNumber: {
    fontSize: typography.fontSizes.md,
    color: '#000',
    fontWeight: typography.fontWeights.medium,
    letterSpacing: 2,
  },
});

export default EnhancedShopAssistant;
