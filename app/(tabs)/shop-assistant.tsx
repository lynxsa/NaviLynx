import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl,
  Dimensions,
  Image,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, shadows } from '@/styles/modernTheme';

const { width } = Dimensions.get('window');

// Featured stores data - main feature
const featuredStores = [
  {
    id: 1,
    name: 'Woolworths',
    logo: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=100&h=100&fit=crop&crop=center',
    category: 'Food & Clothing',
    distance: '50m',
    rating: 4.8,
    offers: ['20% off clothing', 'Fresh produce deals'],
    color: colors.success,
    hours: 'Open until 8PM'
  },
  {
    id: 2,
    name: 'Pick n Pay',
    logo: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop&crop=center',
    category: 'Groceries',
    distance: '120m',
    rating: 4.6,
    offers: ['Smart Shopper points', '3 for 2 deals'],
    color: colors.primary,
    hours: 'Open until 9PM'
  },
  {
    id: 3,
    name: 'Edgars',
    logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop&crop=center',
    category: 'Fashion',
    distance: '200m',
    rating: 4.5,
    offers: ['Thank U points', 'End of season sale'],
    color: colors.error,
    hours: 'Open until 7PM'
  },
  {
    id: 4,
    name: 'Checkers',
    logo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&h=100&fit=crop&crop=center',
    category: 'Groceries',
    distance: '300m',
    rating: 4.4,
    offers: ['Xtra Savings', 'Weekly specials'],
    color: colors.accent,
    hours: 'Open 24/7'
  }
];

// Quick action buttons
const quickActions = [
  {
    id: 1,
    title: 'Scan Product',
    subtitle: 'Find deals & compare prices',
    icon: 'scan-outline',
    color: colors.primary,
    action: 'scan'
  },
  {
    id: 2,
    title: 'Shopping List',
    subtitle: 'Manage your items',
    icon: 'list-outline',
    color: colors.success,
    action: 'list'
  },
  {
    id: 3,
    title: 'Store Locator',
    subtitle: 'Find nearby stores',
    icon: 'location-outline',
    color: colors.info,
    action: 'locate'
  },
  {
    id: 4,
    title: 'Deals & Offers',
    subtitle: 'Current promotions',
    icon: 'pricetag-outline',
    color: colors.warning,
    action: 'deals'
  },
  {
    id: 5,
    title: 'Price Compare',
    subtitle: 'Best prices nearby',
    icon: 'analytics-outline',
    color: colors.secondary,
    action: 'compare'
  },
  {
    id: 6,
    title: 'Loyalty Cards',
    subtitle: 'Manage your cards',
    icon: 'card-outline',
    color: colors.accent,
    action: 'cards'
  }
];

// Recent shopping activity
const recentActivity = [
  {
    id: 1,
    store: 'Woolworths',
    item: 'Organic Apples',
    price: 'R45.99',
    saved: 'R8.00',
    date: '2 hours ago'
  },
  {
    id: 2,
    store: 'Pick n Pay',
    item: 'Bread & Milk',
    price: 'R32.50',
    saved: 'R5.50',
    date: 'Yesterday'
  }
];

export default function ShopAssistantScreen() {
  // State
  const [refreshing, setRefreshing] = useState(false);

  // Mock data loading
  const loadData = useCallback(async () => {
    try {
      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error loading shopping data:', error);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const handleQuickAction = (action: string) => {
    console.log('Quick action pressed:', action);
    // Navigation would go here when routes are available
  };

  const handleStorePress = (store: any) => {
    console.log('Store pressed:', store.name);
    // Navigation would go here when routes are available
  };

  const renderStoreCard = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.storeCard, { backgroundColor: colors.surface }]}
      onPress={() => handleStorePress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.storeCardHeader}>
        <Image source={{ uri: item.logo }} style={styles.storeLogo} />
        <View style={styles.storeInfo}>
          <Text style={[styles.storeName, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.storeCategory, { color: colors.textSecondary }]}>{item.category}</Text>
          <Text style={[styles.storeHours, { color: colors.success }]}>{item.hours}</Text>
        </View>
        <View style={styles.storeActions}>
          <View style={[styles.ratingBadge, { backgroundColor: colors.success }]}>
            <Ionicons name="star" size={12} color="white" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
          <Text style={[styles.storeDistance, { color: colors.textSecondary }]}>{item.distance}</Text>
        </View>
      </View>
      
      <View style={styles.storeOffers}>
        {item.offers.map((offer: string, index: number) => (
          <View key={index} style={[styles.offerTag, { backgroundColor: item.color + '20' }]}>
            <Text style={[styles.offerText, { color: item.color }]}>{offer}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  const renderQuickAction = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.quickActionCard, { backgroundColor: colors.surface }]}
      onPress={() => handleQuickAction(item.action)}
      activeOpacity={0.7}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: item.color + '20' }]}>
        <Ionicons name={item.icon as any} size={24} color={item.color} />
      </View>
      <Text style={[styles.quickActionTitle, { color: colors.text }]}>{item.title}</Text>
      <Text style={[styles.quickActionSubtitle, { color: colors.textSecondary }]}>{item.subtitle}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Shop Assistant</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Discover stores, deals, and manage your shopping
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <FlatList
            data={quickActions}
            renderItem={renderQuickAction}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.quickActionsRow}
            scrollEnabled={false}
            style={styles.quickActionsList}
          />
        </View>

        {/* Featured Stores - Main Feature */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Stores</Text>
            <TouchableOpacity onPress={() => console.log('See all stores')}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={featuredStores}
            renderItem={renderStoreCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storesList}
          />
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
          {recentActivity.map((activity) => (
            <View key={activity.id} style={[styles.activityCard, { backgroundColor: colors.surface }]}>
              <View style={styles.activityInfo}>
                <Text style={[styles.activityStore, { color: colors.text }]}>{activity.store}</Text>
                <Text style={[styles.activityItem, { color: colors.textSecondary }]}>{activity.item}</Text>
                <Text style={[styles.activityDate, { color: colors.textSecondary }]}>{activity.date}</Text>
              </View>
              <View style={styles.activityPricing}>
                <Text style={[styles.activityPrice, { color: colors.text }]}>{activity.price}</Text>
                <Text style={[styles.activitySaved, { color: colors.success }]}>Saved {activity.saved}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 16,
    fontWeight: '500' as const,
  },
  quickActionsList: {
    paddingHorizontal: 20,
  },
  quickActionsRow: {
    justifyContent: 'space-between' as const,
    marginBottom: 12,
  },
  quickActionCard: {
    flex: 0.48,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center' as const,
    ...shadows.sm,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    textAlign: 'center' as const,
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 12,
    textAlign: 'center' as const,
    lineHeight: 16,
  },
  storesList: {
    paddingLeft: 20,
  },
  storeCard: {
    width: width * 0.85,
    padding: 16,
    borderRadius: 16,
    marginRight: 16,
    ...shadows.md,
  },
  storeCardHeader: {
    flexDirection: 'row' as const,
    marginBottom: 12,
  },
  storeLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 18,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  storeCategory: {
    fontSize: 14,
    marginBottom: 2,
  },
  storeHours: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  storeActions: {
    alignItems: 'flex-end' as const,
  },
  ratingBadge: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  ratingText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600' as const,
    marginLeft: 2,
  },
  storeDistance: {
    fontSize: 12,
  },
  storeOffers: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 8,
  },
  offerTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  offerText: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  activityCard: {
    flexDirection: 'row' as const,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
    ...shadows.sm,
  },
  activityInfo: {
    flex: 1,
  },
  activityStore: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  activityItem: {
    fontSize: 14,
    marginBottom: 2,
  },
  activityDate: {
    fontSize: 12,
  },
  activityPricing: {
    alignItems: 'flex-end' as const,
  },
  activityPrice: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  activitySaved: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  bottomSpacing: {
    height: 20,
  },
};
