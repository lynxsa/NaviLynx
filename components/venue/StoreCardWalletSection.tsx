/**
 * Store Card Wallet Section for Venue Pages
 * Operation Navigate Enhancement: Store card scanning integration
 * Matches homepage design with modern card-based layout
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  SlideInUp,
  FadeIn,
} from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';

// Components & Theme
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '@/context/ThemeContext';
import { colors, spacing, borderRadius, shadows } from '@/styles/modernTheme';

// Store card interface
interface StoreCard {
  id: string;
  storeName: string;
  cardNumber: string;
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  qrCode: string;
  color: string;
  logo: string;
  benefits: string[];
  expiryDate?: string;
}

// South African retailer cards
const southAfricanStoreCards: StoreCard[] = [
  {
    id: 'woolworths',
    storeName: 'Woolworths',
    cardNumber: '**** **** **** 1234',
    points: 1850,
    tier: 'gold',
    qrCode: 'woolworths_loyalty_12345',
    color: '#006B3C',
    logo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&w=150',
    benefits: ['10% off fashion', 'Free delivery', 'Birthday rewards'],
    expiryDate: '2025-12-31'
  },
  {
    id: 'pick_n_pay',
    storeName: 'Pick n Pay',
    cardNumber: '**** **** **** 5678',
    points: 420,
    tier: 'silver',
    qrCode: 'picknpay_smart_shopper_67890',
    color: '#E31837',
    logo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&w=150',
    benefits: ['5% back on groceries', 'Special member prices'],
    expiryDate: '2026-06-30'
  },
  {
    id: 'shoprite',
    storeName: 'Shoprite',
    cardNumber: '**** **** **** 9012',
    points: 680,
    tier: 'bronze',
    qrCode: 'shoprite_xtra_savings_11111',
    color: '#FF6B35',
    logo: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&w=150',
    benefits: ['Monthly discount vouchers', 'Early sale access'],
    expiryDate: '2025-08-15'
  },
  {
    id: 'clicks',
    storeName: 'Clicks',
    cardNumber: '**** **** **** 3456',
    points: 1200,
    tier: 'platinum',
    qrCode: 'clicks_clubcard_22222',
    color: '#00A651',
    logo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&w=150',
    benefits: ['Free beauty consultations', '15% off health products', 'Exclusive member events'],
    expiryDate: '2025-12-31'
  }
];

interface Props {
  venueId: string;
  venueName: string;
  onCardScan?: (card: StoreCard) => void;
}

export const StoreCardWalletSection: React.FC<Props> = ({ 
  venueId, 
  venueName, 
  onCardScan 
}) => {
  const { isDark } = useTheme();
  const [cards, setCards] = useState<StoreCard[]>([]);
  const [showScanModal, setShowScanModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedCard, setSelectedCard] = useState<StoreCard | null>(null);
  const [showCardDetails, setShowCardDetails] = useState(false);

  // Animation values
  const cardScale = useSharedValue(0.95);
  const scanOpacity = useSharedValue(0);

  useEffect(() => {
    // Load venue-specific cards (filter by venue type or show all for shopping malls)
    const venueCards = southAfricanStoreCards.filter(card => {
      // For shopping malls, show all cards
      if (venueName.toLowerCase().includes('mall') || 
          venueName.toLowerCase().includes('shopping') ||
          venueName.toLowerCase().includes('centre')) {
        return true;
      }
      // For other venues, show relevant cards
      return card.storeName.toLowerCase().includes(venueName.toLowerCase());
    });
    
    setCards(venueCards.length > 0 ? venueCards : southAfricanStoreCards.slice(0, 2));
    
    // Animate cards in
    cardScale.value = withSpring(1, { damping: 10 });
  }, [venueId, venueName, cardScale]);

  // Get tier color
  const getTierColor = (tier: string): string => {
    switch (tier) {
      case 'platinum': return '#E5E7EB';
      case 'gold': return '#F59E0B';
      case 'silver': return '#9CA3AF';
      default: return '#8B5CF6';
    }
  };

  // Handle card scanning
  const handleScanCard = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission needed', 'Camera permission is required to scan store cards.');
        return;
      }

      setShowScanModal(true);
      setIsScanning(true);
      scanOpacity.value = withTiming(1, { duration: 300 });

      // Simulate card scanning process
      setTimeout(() => {
        const newCard: StoreCard = {
          id: `scanned_${Date.now()}`,
          storeName: 'Dischem',
          cardNumber: '**** **** **** 7890',
          points: 150,
          tier: 'silver',
          qrCode: `dischem_benefits_${Date.now()}`,
          color: '#4F46E5',
          logo: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&w=150',
          benefits: ['5% cashback on supplements', 'Free health screenings'],
          expiryDate: '2025-12-31'
        };

        setCards(prev => [newCard, ...prev]);
        setIsScanning(false);
        setShowScanModal(false);
        scanOpacity.value = withTiming(0, { duration: 300 });

        Alert.alert(
          'Card Added Successfully!',
          `${newCard.storeName} loyalty card has been added to your wallet.`,
          [{ text: 'OK', onPress: () => onCardScan?.(newCard) }]
        );
      }, 3000);

    } catch (error) {
      console.error('Error scanning card:', error);
      Alert.alert('Error', 'Failed to scan card. Please try again.');
      setIsScanning(false);
      setShowScanModal(false);
    }
  };

  // Handle manual card entry
  const handleManualEntry = () => {
    Alert.alert(
      'Add Store Card',
      'Choose how to add your store card:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Enter Card Number', onPress: () => {
          Alert.alert('Manual Entry', 'Manual card entry feature coming soon!');
        }},
        { text: 'Scan Barcode', onPress: handleScanCard }
      ]
    );
  };

  // Show card details
  const handleCardPress = (card: StoreCard) => {
    setSelectedCard(card);
    setShowCardDetails(true);
  };

  // Animated styles
  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const animatedScanStyle = useAnimatedStyle(() => ({
    opacity: scanOpacity.value,
  }));

  if (cards.length === 0) {
    return null;
  }

  return (
    <Animated.View 
      style={[styles.container, { backgroundColor: isDark ? colors.surface : '#FFFFFF' }, animatedCardStyle]}
      entering={SlideInUp.delay(900).duration(600)}
    >
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <View style={styles.headerLeft}>
          <IconSymbol name="creditcard.fill" size={24} color={colors.primary} />
          <View style={styles.headerText}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
              Store Cards & Loyalty
            </Text>
            <Text style={[styles.sectionSubtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              {cards.length} card{cards.length !== 1 ? 's' : ''} available at {venueName}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary + '15' }]}
          onPress={handleManualEntry}
          activeOpacity={0.7}
        >
          <IconSymbol name="plus" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Store Cards Carousel */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsContainer}
      >
        {cards.map((card, index) => (
          <TouchableOpacity
            key={card.id}
            style={styles.cardWrapper}
            onPress={() => handleCardPress(card)}
            activeOpacity={0.8}
          >
            <Animated.View entering={FadeIn.delay(1000 + index * 100).duration(400)}>
              <LinearGradient
                colors={[card.color, `${card.color}CC`]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.storeCard}
              >
                {/* Card Header */}
                <View style={styles.cardHeader}>
                  <Image
                    source={{ uri: card.logo }}
                    style={styles.storeLogo}
                    resizeMode="contain"
                  />
                  <View style={[styles.tierBadge, { backgroundColor: getTierColor(card.tier) }]}>
                    <Text style={styles.tierText}>{card.tier.toUpperCase()}</Text>
                  </View>
                </View>

                {/* Store Name */}
                <Text style={styles.storeName}>{card.storeName}</Text>

                {/* Card Number */}
                <Text style={styles.cardNumber}>{card.cardNumber}</Text>

                {/* Points */}
                <View style={styles.pointsContainer}>
                  <View style={styles.pointsInfo}>
                    <Text style={styles.pointsLabel}>Points</Text>
                    <Text style={styles.pointsValue}>{card.points.toLocaleString()}</Text>
                  </View>
                  
                  <View style={styles.qrCodeIcon}>
                    <IconSymbol name="qrcode" size={24} color="rgba(255,255,255,0.8)" />
                  </View>
                </View>

                {/* Benefits Preview */}
                <Text style={styles.benefitsPreview} numberOfLines={1}>
                  {card.benefits[0]}
                </Text>
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>
        ))}

        {/* Add Card Button */}
        <TouchableOpacity
          style={[styles.addCardButton, { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' }]}
          onPress={handleScanCard}
          activeOpacity={0.7}
        >
          <View style={[styles.addCardIcon, { backgroundColor: colors.primary + '15' }]}>
            <IconSymbol name="camera.viewfinder" size={32} color={colors.primary} />
          </View>
          <Text style={[styles.addCardText, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
            Scan New Card
          </Text>
          <Text style={[styles.addCardSubtext, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            Camera or Barcode
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={[styles.quickAction, { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' }]}
          onPress={() => Alert.alert('Wallet', 'Opening full wallet experience...')}
        >
          <IconSymbol name="wallet.pass" size={20} color={colors.primary} />
          <Text style={[styles.quickActionText, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
            View Wallet
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickAction, { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' }]}
          onPress={() => Alert.alert('Deals', 'Checking for exclusive member deals...')}
        >
          <IconSymbol name="tag.fill" size={20} color={colors.primary} />
          <Text style={[styles.quickActionText, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
            Member Deals
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickAction, { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' }]}
          onPress={handleScanCard}
        >
          <IconSymbol name="qrcode.viewfinder" size={20} color={colors.primary} />
          <Text style={[styles.quickActionText, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
            Scan to Pay
          </Text>
        </TouchableOpacity>
      </View>

      {/* Scan Modal */}
      <Modal
        visible={showScanModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[styles.scanModal, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }, animatedScanStyle]}
          >
            <View style={styles.scanHeader}>
              <Text style={[styles.scanTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
                Scanning Store Card
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setIsScanning(false);
                  setShowScanModal(false);
                }}
                style={styles.closeButton}
              >
                <IconSymbol name="xmark" size={24} color={isDark ? '#FFFFFF' : '#1F2937'} />
              </TouchableOpacity>
            </View>

            <View style={styles.scanContent}>
              <View style={[styles.scanFrame, { borderColor: colors.primary }]}>
                <IconSymbol name="camera.viewfinder" size={64} color={colors.primary} />
              </View>
              <Text style={[styles.scanInstructions, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                {isScanning ? 'Analyzing card...' : 'Position your store card within the frame'}
              </Text>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Card Details Modal */}
      <Modal
        visible={showCardDetails}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.cardDetailsModal, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
            {selectedCard && (
              <>
                <View style={styles.cardDetailsHeader}>
                  <Text style={[styles.cardDetailsTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
                    {selectedCard.storeName} Card
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowCardDetails(false)}
                    style={styles.closeButton}
                  >
                    <IconSymbol name="xmark" size={24} color={isDark ? '#FFFFFF' : '#1F2937'} />
                  </TouchableOpacity>
                </View>

                <View style={styles.cardDetailsContent}>
                  {/* QR Code */}
                  <View style={[styles.qrCodeContainer, { backgroundColor: isDark ? '#374151' : '#F3F4F6' }]}>
                    <IconSymbol name="qrcode" size={120} color={colors.primary} />
                    <Text style={[styles.qrCodeLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                      Show this QR code at checkout
                    </Text>
                  </View>

                  {/* Card Info */}
                  <View style={styles.cardInfo}>
                    <Text style={[styles.cardInfoLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                      Card Number
                    </Text>
                    <Text style={[styles.cardInfoValue, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
                      {selectedCard.cardNumber}
                    </Text>
                  </View>

                  <View style={styles.cardInfo}>
                    <Text style={[styles.cardInfoLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                      Points Balance
                    </Text>
                    <Text style={[styles.cardInfoValue, { color: colors.primary }]}>
                      {selectedCard.points.toLocaleString()} points
                    </Text>
                  </View>

                  <View style={styles.cardInfo}>
                    <Text style={[styles.cardInfoLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                      Membership Tier
                    </Text>
                    <Text style={[styles.cardInfoValue, { color: getTierColor(selectedCard.tier) }]}>
                      {selectedCard.tier.toUpperCase()}
                    </Text>
                  </View>

                  {/* Benefits */}
                  <View style={styles.benefitsSection}>
                    <Text style={[styles.benefitsTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
                      Your Benefits
                    </Text>
                    {selectedCard.benefits.map((benefit, index) => (
                      <View key={index} style={styles.benefitItem}>
                        <IconSymbol name="checkmark.circle.fill" size={16} color={colors.accent} />
                        <Text style={[styles.benefitText, { color: isDark ? '#D1D5DB' : '#374151' }]}>
                          {benefit}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: spacing.lg,
    marginTop: 0,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    ...shadows.md,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerText: {
    marginLeft: spacing.md,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardsContainer: {
    paddingRight: spacing.lg,
    marginBottom: spacing.lg,
  },
  cardWrapper: {
    marginRight: spacing.md,
  },
  storeCard: {
    width: 220,
    height: 140,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  storeLogo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  tierBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  tierText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  storeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardNumber: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: spacing.sm,
    fontFamily: 'monospace',
  },
  pointsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.xs,
  },
  pointsInfo: {
    flex: 1,
  },
  pointsLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 2,
  },
  pointsValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  qrCodeIcon: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
  },
  benefitsPreview: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    fontStyle: 'italic',
  },
  addCardButton: {
    width: 160,
    height: 140,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.primary + '30',
    borderStyle: 'dashed',
  },
  addCardIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  addCardText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  addCardSubtext: {
    fontSize: 11,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.xs,
    ...shadows.sm,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanModal: {
    width: '85%',
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    ...shadows.lg,
  },
  scanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  scanTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeButton: {
    padding: spacing.sm,
  },
  scanContent: {
    alignItems: 'center',
  },
  scanFrame: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderRadius: borderRadius.lg,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  scanInstructions: {
    fontSize: 14,
    textAlign: 'center',
  },
  cardDetailsModal: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  cardDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  cardDetailsTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  cardDetailsContent: {
    padding: spacing.xl,
  },
  qrCodeContainer: {
    alignItems: 'center',
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  qrCodeLabel: {
    fontSize: 14,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  cardInfo: {
    marginBottom: spacing.md,
  },
  cardInfoLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  cardInfoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  benefitsSection: {
    marginTop: spacing.lg,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  benefitText: {
    fontSize: 14,
    flex: 1,
  },
});
