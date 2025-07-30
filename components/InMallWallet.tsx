// components/InMallWallet.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  TextInput
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/context/ThemeContext';
import GlassCard from './GlassCard';
import { IconSymbol, IconSymbolName } from './ui/IconSymbol';
import { Spacing } from '@/constants/Theme';

// --- Interfaces ---
export interface WalletTransaction {
  id: string;
  type: 'purchase' | 'reward' | 'cashback' | 'transfer' | 'topup';
  amount: number;
  description: string;
  merchant?: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  category: string;
  location?: string;
}

export interface LoyaltyCard {
  id: string;
  merchantName: string;
  cardNumber: string;
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  nextTierPoints: number;
  benefits: string[];
  expiryDate?: string;
  qrCode: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  category: 'discount' | 'freebie' | 'experience' | 'cashback';
  validUntil: string;
  terms: string[];
  merchantId: string;
  imageUrl?: string;
  claimable: boolean;
}

export interface WalletProps {
  visible: boolean;
  onClose: () => void;
  venueId: string; // This prop isn't used in the mock data, but kept as per original
}

// --- Main Component ---
export default function InMallWallet({ visible, onClose, venueId }: WalletProps) {
  const { colors } = useTheme();

  // --- State Management ---
  const [activeTab, setActiveTab] = useState<'wallet' | 'cards' | 'rewards' | 'transactions'>('wallet');
  const [balance, setBalance] = useState<number>(245.50);
  const [loyaltyCards, setLoyaltyCards] = useState<LoyaltyCard[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [showTopUpModal, setShowTopUpModal] = useState<boolean>(false);
  const [topUpAmount, setTopUpAmount] = useState<string>('');

  // --- Data Loading Effect ---
  // Using useCallback for loadWalletData to prevent unnecessary re-renders
  const loadWalletData = useCallback(async () => {
    // Mock wallet data - replace with actual API calls
    setLoyaltyCards([
      {
        id: 'card_1',
        merchantName: 'Woolworths',
        cardNumber: '**** **** **** 1234',
        points: 1850,
        tier: 'gold',
        nextTierPoints: 2500,
        benefits: ['10% off fashion', 'Free delivery', 'Birthday rewards'],
        qrCode: 'woolworths_qr_data'
      },
      {
        id: 'card_2',
        merchantName: 'Pick n Pay',
        cardNumber: '**** **** **** 5678',
        points: 420,
        tier: 'silver',
        nextTierPoints: 1000,
        benefits: ['5% back on groceries', 'Special member prices'],
        qrCode: 'picknpay_qr_data'
      },
      {
        id: 'card_3',
        merchantName: 'Edgars',
        cardNumber: '**** **** **** 9012',
        points: 680,
        tier: 'bronze',
        nextTierPoints: 1000,
        benefits: ['Monthly discount vouchers', 'Early sale access'],
        qrCode: 'edgars_qr_data'
      }
    ]);

    setRewards([
      {
        id: 'reward_1',
        title: 'R50 Off Your Next Purchase',
        description: 'Valid on purchases over R300',
        pointsCost: 500,
        category: 'discount',
        validUntil: '2024-03-31',
        terms: ['Minimum spend R300', 'Cannot be combined with other offers'],
        merchantId: 'woolworths',
        claimable: true
      },
      {
        id: 'reward_2',
        title: 'Free Coffee',
        description: 'Complimentary coffee at Seattle Coffee Company',
        pointsCost: 200,
        category: 'freebie',
        validUntil: '2024-02-29',
        terms: ['One per customer', 'Valid at participating stores'],
        merchantId: 'seattle_coffee',
        claimable: true
      },
      {
        id: 'reward_3',
        title: '15% Cashback on Electronics',
        description: 'Get 15% back on all electronics purchases',
        pointsCost: 800,
        category: 'cashback',
        validUntil: '2024-04-15',
        terms: ['Maximum cashback R200', 'Valid for 30 days'],
        merchantId: 'dion_wired',
        claimable: false
      }
    ]);

    setTransactions([
      {
        id: 'txn_1',
        type: 'purchase',
        amount: -45.99,
        description: 'Lunch at Tashas',
        merchant: 'Tashas',
        timestamp: '2024-01-15T12:30:00Z',
        status: 'completed',
        category: 'Food & Beverage',
        location: 'Sandton City'
      },
      {
        id: 'txn_2',
        type: 'reward',
        amount: 25.00,
        description: 'Loyalty cashback',
        merchant: 'Woolworths',
        timestamp: '2024-01-14T15:45:00Z',
        status: 'completed',
        category: 'Rewards'
      },
      {
        id: 'txn_3',
        type: 'purchase',
        amount: -89.50,
        description: 'Groceries',
        merchant: 'Pick n Pay',
        timestamp: '2024-01-13T10:20:00Z',
        status: 'completed',
        category: 'Groceries',
        location: 'Sandton City'
      }
    ]);
  }, []); // Empty dependency array means this function is created once

  useEffect(() => {
    if (visible) {
      loadWalletData();
    }
  }, [visible, loadWalletData]); // Depend on 'visible' and 'loadWalletData'

  // --- Handlers ---
  const handleTopUp = useCallback(async () => {
    const amount = parseFloat(topUpAmount);

    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount to top up.');
      return;
    }

    try {
      // Mock top-up process
      setBalance(prev => prev + amount);

      const newTransaction: WalletTransaction = {
        id: `txn_${Date.now()}`,
        type: 'topup',
        amount: amount,
        description: 'Wallet Top-up',
        timestamp: new Date().toISOString(),
        status: 'completed',
        category: 'Top-up'
      };

      setTransactions(prev => [newTransaction, ...prev]);
      setTopUpAmount('');
      setShowTopUpModal(false);

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', `Successfully added R${amount.toFixed(2)} to your wallet.`);

    } catch (error) { // Catch actual errors for better debugging
      console.error("Top-up error:", error);
      Alert.alert('Error', 'Failed to top up wallet. Please try again.');
    }
  }, [topUpAmount]); // Depend on 'topUpAmount'

  const handleClaimReward = useCallback(async (reward: Reward) => {
    try {
      // Check if user has enough points (this would be dynamic based on selected loyalty card)
      const totalPoints = loyaltyCards.reduce((sum, card) => sum + card.points, 0);

      if (totalPoints < reward.pointsCost) {
        Alert.alert(
          'Insufficient Points',
          `You need ${reward.pointsCost} points to claim this reward. You currently have ${totalPoints} points.`
        );
        return;
      }

      // Mock reward claiming process
      Alert.alert(
        'Claim Reward',
        `Claim "${reward.title}" for ${reward.pointsCost} points?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Claim',
            onPress: async () => {
              // Deduct points from the card with the most points
              const cardWithMostPoints = loyaltyCards.reduce((prev, current) =>
                prev.points > current.points ? prev : current
              );

              setLoyaltyCards(prev => prev.map(card =>
                card.id === cardWithMostPoints.id
                  ? { ...card, points: card.points - reward.pointsCost }
                  : card
              ));

              setRewards(prev => prev.map(r =>
                r.id === reward.id ? { ...r, claimable: false } : r
              ));

              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert('Success', 'Reward claimed successfully!');
            }
          }
        ]
      );
    } catch (error) { // Catch actual errors for better debugging
      console.error("Claim reward error:", error);
      Alert.alert('Error', 'Failed to claim reward. Please try again.');
    }
  }, [loyaltyCards]); // Depend on 'loyaltyCards'

  // --- Helper Functions ---
  // Using useMemo for functions that return calculated values based on props/state
  const getTierColor = useMemo(() => (tier: string): string => {
    switch (tier) {
      case 'bronze': return '#CD7F32';
      case 'silver': return '#C0C0C0';
      case 'gold': return '#FFD700';
      case 'platinum': return '#E5E4E2';
      default: return colors.primary;
    }
  }, [colors.primary]);

  const getTransactionIcon = useMemo(() => (type: string): IconSymbolName => {
    switch (type) {
      case 'purchase': return 'cart';
      case 'reward': return 'gift';
      case 'cashback': return 'arrow.down.circle';
      case 'transfer': return 'arrow.left.arrow.right';
      case 'topup': return 'plus.circle';
      default: return 'ellipsis';
    }
  }, []); // No dependencies, as icon names are static

  // --- Render Functions for Tabs ---
  const renderWalletTab = useCallback(() => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Balance Card */}
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={styles.balanceCard}
      >
        <View style={styles.balanceHeader}>
          <Text style={styles.balanceLabel}>NaviLynx Wallet</Text>
          <IconSymbol name="creditcard" size={24} color="#FFFFFF" />
        </View>

        <Text style={styles.balanceAmount}>R{balance.toFixed(2)}</Text>

        <View style={styles.balanceActions}>
          <TouchableOpacity
            style={styles.balanceActionButton}
            onPress={() => setShowTopUpModal(true)}
          >
            <IconSymbol name="plus" size={16} color="#FFFFFF" />
            <Text style={styles.balanceActionText}>Top Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.balanceActionButton}
            onPress={() => Alert.alert('Send Money', 'Send money feature coming soon!')}
          >
            <IconSymbol name="paperplane" size={16} color="#FFFFFF" />
            <Text style={styles.balanceActionText}>Send</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Quick Actions */}
      <GlassCard style={styles.quickActionsCard}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>

        <View style={styles.quickActionsGrid}>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => Alert.alert('Pay', 'Scan QR code to pay at participating stores')}
          >
            <IconSymbol name="qrcode" size={32} color={colors.primary} />
            <Text style={[styles.quickActionText, { color: colors.text }]}>Pay</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => setActiveTab('transactions')}
          >
            <IconSymbol name="list.bullet" size={32} color={colors.primary} />
            <Text style={[styles.quickActionText, { color: colors.text }]}>History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => setActiveTab('rewards')}
          >
            <IconSymbol name="gift" size={32} color={colors.primary} />
            <Text style={[styles.quickActionText, { color: colors.text }]}>Rewards</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => Alert.alert('Split Bill', 'Split bill feature coming soon!')}
          >
            <IconSymbol name="person.2" size={32} color={colors.primary} />
            <Text style={[styles.quickActionText, { color: colors.text }]}>Split</Text>
          </TouchableOpacity>
        </View>
      </GlassCard>

      {/* Recent Transactions */}
      <GlassCard style={styles.recentTransactionsCard}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => setActiveTab('transactions')}>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>

        {transactions.slice(0, 3).map((transaction: WalletTransaction) => ( // Explicitly type transaction
          <View key={transaction.id} style={styles.transactionItem}>
            <View style={[styles.transactionIcon, { backgroundColor: colors.surface }]}>
              <IconSymbol
                name={getTransactionIcon(transaction.type)}
                size={20}
                color={transaction.amount >= 0 ? colors.success : colors.text}
              />
            </View>

            <View style={styles.transactionDetails}>
              <Text style={[styles.transactionDescription, { color: colors.text }]}>
                {transaction.description}
              </Text>
              <Text style={[styles.transactionMerchant, { color: colors.textSecondary }]}>
                {transaction.merchant} • {new Date(transaction.timestamp).toLocaleDateString()}
              </Text>
            </View>

            <Text style={[
              styles.transactionAmount,
              { color: transaction.amount >= 0 ? colors.success : colors.text }
            ]}>
              {transaction.amount >= 0 ? '+' : ''}R{Math.abs(transaction.amount).toFixed(2)}
            </Text>
          </View>
        ))}
      </GlassCard>
    </ScrollView>
  ), [balance, colors, transactions, getTransactionIcon]); // Depend on state and helper functions

  const renderCardsTab = useCallback(() => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {loyaltyCards.map((card: LoyaltyCard) => ( // Explicitly type card
        <TouchableOpacity // Corrected syntax: Removed the duplicate TouchableOpacity
          key={card.id}
          onPress={() => {
            // Handle loyalty card press, e.g., show QR code or card details
            Alert.alert(`Loyalty Card: ${card.merchantName}`, `Card Number: ${card.cardNumber}\nPoints: ${card.points}\nQR Code Data: ${card.qrCode}`);
          }}
        >
          <LinearGradient
            colors={[getTierColor(card.tier), `${getTierColor(card.tier)}CC`]} // Use getTierColor
            style={styles.loyaltyCard}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardMerchant}>{card.merchantName}</Text>
              <Text style={styles.cardTier}>{card.tier.toUpperCase()}</Text>
            </View>

            <Text style={styles.cardNumber}>{card.cardNumber}</Text>

            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.cardPointsLabel}>Points</Text>
                <Text style={styles.cardPoints}>{card.points.toLocaleString()}</Text>
              </View>

              <View style={styles.cardProgress}>
                <Text style={styles.cardProgressText}>
                  {card.nextTierPoints - card.points} to next tier
                </Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${(card.points / card.nextTierPoints) * 100}%` }
                    ]}
                  />
                </View>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </ScrollView>
  ), [loyaltyCards, getTierColor]); // Depend on state and helper functions

  const renderRewardsTab = useCallback(() => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {rewards.map((reward: Reward) => ( // Explicitly type reward
        <GlassCard key={reward.id} style={styles.rewardCard}>
          <View style={styles.rewardHeader}>
            <View style={styles.rewardInfo}>
              <Text style={[styles.rewardTitle, { color: colors.text }]}>
                {reward.title}
              </Text>
              <Text style={[styles.rewardDescription, { color: colors.textSecondary }]}>
                {reward.description}
              </Text>
            </View>

            <View style={styles.rewardPoints}>
              <Text style={[styles.rewardPointsCost, { color: colors.primary }]}>
                {reward.pointsCost}
              </Text>
              <Text style={[styles.rewardPointsLabel, { color: colors.textSecondary }]}>
                points
              </Text>
            </View>
          </View>

          <View style={styles.rewardFooter}>
            <Text style={[styles.rewardExpiry, { color: colors.textSecondary }]}>
              Valid until {new Date(reward.validUntil).toLocaleDateString()}
            </Text>

            <TouchableOpacity
              style={[
                styles.claimButton,
                {
                  backgroundColor: reward.claimable ? colors.primary : colors.border,
                  opacity: reward.claimable ? 1 : 0.5
                }
              ]}
              onPress={() => reward.claimable && handleClaimReward(reward)}
              disabled={!reward.claimable}
            >
              <Text style={styles.claimButtonText}>
                {reward.claimable ? 'Claim' : 'Claimed'}
              </Text>
            </TouchableOpacity>
          </View>
        </GlassCard>
      ))}
    </ScrollView>
  ), [rewards, colors, handleClaimReward]); // Depend on state, colors, and handler

  const renderTransactionsTab = useCallback(() => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {transactions.map((transaction: WalletTransaction) => ( // Explicitly type transaction
        <GlassCard key={transaction.id} style={styles.fullTransactionCard}>
          <View style={styles.transactionHeader}>
            <View style={[styles.transactionIcon, { backgroundColor: colors.surface }]}>
              <IconSymbol
                name={getTransactionIcon(transaction.type)}
                size={24}
                color={transaction.amount >= 0 ? colors.success : colors.text}
              />
            </View>

            <View style={styles.transactionMainInfo}>
              <Text style={[styles.transactionDescription, { color: colors.text }]}>
                {transaction.description}
              </Text>
              <Text style={[styles.transactionCategory, { color: colors.textSecondary }]}>
                {transaction.category}
              </Text>
            </View>

            <View style={styles.transactionAmountContainer}>
              <Text style={[
                styles.transactionAmount,
                { color: transaction.amount >= 0 ? colors.success : colors.text }
              ]}>
                {transaction.amount >= 0 ? '+' : ''}R{Math.abs(transaction.amount).toFixed(2)}
              </Text>
              <View style={[
                styles.statusBadge,
                { backgroundColor: transaction.status === 'completed' ? colors.success : colors.warning }
              ]}>
                <Text style={styles.statusText}>{transaction.status}</Text>
              </View>
            </View>
          </View>

          <View style={styles.transactionMeta}>
            <Text style={[styles.transactionDate, { color: colors.textSecondary }]}>
              {new Date(transaction.timestamp).toLocaleString()}
            </Text>
            {transaction.location && (
              <Text style={[styles.transactionLocation, { color: colors.textSecondary }]}>
                📍 {transaction.location}
              </Text>
            )}
          </View>
        </GlassCard>
      ))}
    </ScrollView>
  ), [transactions, colors, getTransactionIcon]); // Depend on state, colors, and helper

  const renderTopUpModal = useCallback(() => (
    <Modal
      visible={showTopUpModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowTopUpModal(false)} // Add onRequestClose for Android back button
    >
      <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.modalHeader, { backgroundColor: colors.surface }]}>
          <TouchableOpacity onPress={() => setShowTopUpModal(false)}>
            <IconSymbol name="xmark" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Top Up Wallet</Text>
          <View style={{ width: 24 }} /> {/* Spacer to balance title */}
        </View>

        <View style={styles.modalContent}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>Amount (R)</Text>
          <TextInput
            style={[styles.amountInput, { backgroundColor: colors.surface, color: colors.text }]}
            value={topUpAmount}
            onChangeText={setTopUpAmount}
            keyboardType="numeric"
            placeholder="0.00"
            placeholderTextColor={colors.textSecondary}
          />

          <View style={styles.quickAmounts}>
            {[50, 100, 200, 500].map((amount) => (
              <TouchableOpacity
                key={amount}
                style={[styles.quickAmountButton, { borderColor: colors.border }]}
                onPress={() => setTopUpAmount(amount.toString())}
              >
                <Text style={[styles.quickAmountText, { color: colors.text }]}>
                  R{amount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.topUpButton, { backgroundColor: colors.primary }]}
            onPress={handleTopUp}
          >
            <Text style={styles.topUpButtonText}>Top Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  ), [showTopUpModal, topUpAmount, colors, handleTopUp]); // Depend on state, colors, and handler

  // Tab configuration
  const TAB_WALLET = 'wallet';
  const TAB_CARDS = 'cards';
  const TAB_REWARDS = 'rewards';
  const TAB_TRANSACTIONS = 'transactions';
  
  const tabConfig = [
    { key: TAB_WALLET, label: 'Wallet', icon: 'creditcard' },
    { key: TAB_CARDS, label: 'Cards', icon: 'rectangle.stack' },
    { key: TAB_REWARDS, label: 'Rewards', icon: 'gift' },
    { key: TAB_TRANSACTIONS, label: 'History', icon: 'list.bullet' }
  ];

  // --- Main Component Render ---
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose} // Add onRequestClose for Android back button
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.surface }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onClose}
          >
            <IconSymbol name="xmark" size={24} color={colors.text} />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: colors.text }]}>
            NaviLynx Wallet
          </Text>

          <TouchableOpacity style={styles.settingsButton} onPress={() => Alert.alert('Settings', 'Wallet settings coming soon!')}>
            <IconSymbol name="gear" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View style={[styles.tabNav, { backgroundColor: colors.surface }]}>
          {tabConfig.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabButton,
                activeTab === tab.key && { backgroundColor: colors.primary + '20' }
              ]}
              onPress={() => setActiveTab(tab.key as any)}
            >
              <IconSymbol
                name={tab.icon as IconSymbolName}
                size={20}
                color={activeTab === tab.key ? colors.primary : colors.textSecondary}
              />
              <Text style={[
                styles.tabLabel,
                { color: activeTab === tab.key ? colors.primary : colors.textSecondary }
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {activeTab === TAB_WALLET && renderWalletTab()}
        {activeTab === TAB_CARDS && renderCardsTab()}
        {activeTab === TAB_REWARDS && renderRewardsTab()}
        {activeTab === TAB_TRANSACTIONS && renderTransactionsTab()}

        {/* Top Up Modal */}
        {renderTopUpModal()}
      </View>
    </Modal>
  );
}

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingTop: Spacing.xl,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  settingsButton: {
    padding: Spacing.xs,
  },
  tabNav: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: 8,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  balanceCard: {
    marginVertical: Spacing.md,
    padding: Spacing.lg,
    borderRadius: 16,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  balanceLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: Spacing.lg,
  },
  balanceActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  balanceActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    gap: Spacing.xs,
  },
  balanceActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  quickActionsCard: {
    marginVertical: Spacing.sm,
    padding: Spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  quickAction: {
    alignItems: 'center',
    width: '22%', // Adjusted to allow for Spacing.md gap
  },
  quickActionText: {
    fontSize: 12,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  recentTransactionsCard: {
    marginVertical: Spacing.sm,
    padding: Spacing.md,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '500',
  },
  transactionMerchant: {
    fontSize: 12,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  loyaltyCard: {
    marginVertical: Spacing.sm,
    padding: Spacing.lg,
    borderRadius: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardMerchant: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardTier: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cardNumber: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'monospace',
    marginBottom: Spacing.lg,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardPointsLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.8,
  },
  cardPoints: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardProgress: {
    alignItems: 'flex-end',
  },
  cardProgressText: {
    color: '#FFFFFF',
    fontSize: 10,
    opacity: 0.8,
    marginBottom: 4,
  },
  progressBar: {
    width: 80,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  rewardCard: {
    marginVertical: Spacing.sm,
    padding: Spacing.md,
  },
  rewardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  rewardInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  rewardDescription: {
    fontSize: 14,
  },
  rewardPoints: {
    alignItems: 'center',
  },
  rewardPointsCost: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  rewardPointsLabel: {
    fontSize: 12,
  },
  rewardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardExpiry: {
    fontSize: 12,
  },
  claimButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 16,
  },
  claimButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  fullTransactionCard: {
    marginVertical: Spacing.sm,
    padding: Spacing.md,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  transactionMainInfo: {
    flex: 1,
    marginHorizontal: Spacing.sm,
  },
  transactionCategory: {
    fontSize: 12,
    marginTop: 2,
  },
  transactionAmountContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    marginTop: 4,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  transactionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  transactionDate: {
    fontSize: 12,
  },
  transactionLocation: {
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingTop: Spacing.xl,
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: Spacing.sm,
  },
  amountInput: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: Spacing.lg,
    borderRadius: 12,
    marginBottom: Spacing.lg,
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  quickAmountButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderRadius: 8,
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: '500',
  },
  topUpButton: {
    paddingVertical: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  topUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});