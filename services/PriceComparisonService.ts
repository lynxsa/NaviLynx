import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, ProductPrice, Store } from './ShopAssistantService';

export interface PriceAlert {
  id: string;
  productId: string;
  productName: string;
  targetPrice: number;
  currentPrice: number;
  storeId: string;
  storeName: string;
  isActive: boolean;
  createdDate: string;
  lastChecked: string;
}

export interface PriceHistory {
  productId: string;
  storeId: string;
  price: number;
  date: string;
  wasOnSale: boolean;
  discount?: number;
}

export interface PriceComparison {
  product: Product;
  prices: ProductPrice[];
  bestPrice: ProductPrice;
  averagePrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  recommendations: PriceRecommendation[];
  lastUpdated: string;
}

export interface PriceRecommendation {
  type: 'best-value' | 'nearby' | 'premium' | 'bulk-deal' | 'price-drop';
  title: string;
  description: string;
  storeId: string;
  savings: number;
  confidence: number;
}

export interface SavingsOpportunity {
  type: 'store-switch' | 'bulk-buy' | 'sale-timing' | 'substitute';
  title: string;
  description: string;
  potentialSavings: number;
  effort: 'low' | 'medium' | 'high';
  timeframe: string;
  actionItems: string[];
}

class PriceComparisonService {
  private static instance: PriceComparisonService;
  private priceAlerts: PriceAlert[] = [];
  private priceHistory: PriceHistory[] = [];
  private storeDatabase: Store[] = [];

  private constructor() {
    this.initializeStores();
    this.loadPriceAlerts();
    this.loadPriceHistory();
  }

  public static getInstance(): PriceComparisonService {
    if (!PriceComparisonService.instance) {
      PriceComparisonService.instance = new PriceComparisonService();
    }
    return PriceComparisonService.instance;
  }

  private initializeStores() {
    // Initialize South African store chains with price positioning
    this.storeDatabase = [
      {
        id: 'store_pnp_menlyn',
        name: 'Pick n Pay Menlyn',
        chain: 'Pick n Pay',
        location: 'Menlyn Park Shopping Centre',
        priceLevel: 'mid',
        specialties: ['fresh-produce', 'household', 'pharmacy']
      },
      {
        id: 'store_woolies_sandton',
        name: 'Woolworths Sandton City',
        chain: 'Woolworths',
        location: 'Sandton City',
        priceLevel: 'premium',
        specialties: ['organic', 'premium-brands', 'fresh-food']
      },
      {
        id: 'store_checkers_fourways',
        name: 'Checkers Hyper Fourways',
        chain: 'Checkers',
        location: 'Fourways Mall',
        priceLevel: 'budget',
        specialties: ['bulk-buying', 'household', 'value-brands']
      },
      {
        id: 'store_spar_rosebank',
        name: 'Spar Rosebank',
        chain: 'Spar',
        location: 'Rosebank',
        priceLevel: 'mid',
        specialties: ['convenience', 'fresh-produce', 'local-brands']
      },
      {
        id: 'store_shoprite_midrand',
        name: 'Shoprite Midrand',
        chain: 'Shoprite',
        location: 'Midrand',
        priceLevel: 'budget',
        specialties: ['value-brands', 'bulk-buying', 'household']
      }
    ];
  }

  // Core Price Comparison
  public async compareProductPrices(product: Product): Promise<PriceComparison> {
    const prices: ProductPrice[] = [];
    const basePrice = product.avgPrice || 50; // Default base price in ZAR

    // Generate realistic price variations across different store types
    for (const store of this.storeDatabase) {
      const price = this.calculateStorePrice(basePrice, store);
      const availability = this.determineAvailability(product, store);
      
      prices.push({
        storeId: store.id,
        storeName: store.name,
        price,
        originalPrice: this.calculateOriginalPrice(price, store),
        discount: this.calculateDiscount(store),
        availability,
        lastUpdated: new Date().toISOString(),
        specialOffer: this.generateSpecialOffer(store, product)
      });
    }

    // Sort by price (ascending)
    prices.sort((a, b) => a.price - b.price);

    const bestPrice = prices[0];
    const averagePrice = prices.reduce((sum, p) => sum + p.price, 0) / prices.length;
    const priceRange = {
      min: Math.min(...prices.map(p => p.price)),
      max: Math.max(...prices.map(p => p.price))
    };

    const recommendations = this.generatePriceRecommendations(product, prices);

    // Store price history
    await this.recordPriceHistory(product.id, prices);

    return {
      product,
      prices,
      bestPrice,
      averagePrice: Math.round(averagePrice * 100) / 100,
      priceRange,
      recommendations,
      lastUpdated: new Date().toISOString()
    };
  }

  private calculateStorePrice(basePrice: number, store: Store): number {
    let multiplier = 1.0;
    
    // Adjust based on store price level
    switch (store.priceLevel) {
      case 'budget':
        multiplier = 0.85 + Math.random() * 0.15; // 85-100% of base
        break;
      case 'mid':
        multiplier = 0.95 + Math.random() * 0.1; // 95-105% of base
        break;
      case 'premium':
        multiplier = 1.1 + Math.random() * 0.2; // 110-130% of base
        break;
    }

    // Add some random variation
    const variation = (Math.random() - 0.5) * 0.1; // ±5% random variation
    multiplier += variation;

    return Math.round(basePrice * multiplier * 100) / 100;
  }

  private calculateOriginalPrice(currentPrice: number, store: Store): number | undefined {
    // 30% chance of having an original price (indicating discount)
    if (Math.random() > 0.7) {
      return Math.round(currentPrice * (1.1 + Math.random() * 0.2) * 100) / 100;
    }
    return undefined;
  }

  private calculateDiscount(store: Store): number | undefined {
    // Budget stores have more frequent discounts
    const discountChance = store.priceLevel === 'budget' ? 0.4 : 
                          store.priceLevel === 'mid' ? 0.25 : 0.15;
    
    if (Math.random() < discountChance) {
      return Math.floor(Math.random() * 25) + 5; // 5-30% discount
    }
    return undefined;
  }

  private determineAvailability(product: Product, store: Store): 'in-stock' | 'low-stock' | 'out-of-stock' {
    // Premium stores typically have better stock
    const stockReliability = store.priceLevel === 'premium' ? 0.95 : 
                           store.priceLevel === 'mid' ? 0.85 : 0.75;
    
    const rand = Math.random();
    if (rand < stockReliability) return 'in-stock';
    if (rand < stockReliability + 0.15) return 'low-stock';
    return 'out-of-stock';
  }

  private generateSpecialOffer(store: Store, product: Product): string | undefined {
    const offers = [
      'Buy 2 Get 1 Free',
      '3 for 2',
      'Weekend Special',
      'Member Price',
      'Bulk Discount Available',
      'Flash Sale'
    ];

    // 20% chance of special offer
    if (Math.random() < 0.2) {
      return offers[Math.floor(Math.random() * offers.length)];
    }
    return undefined;
  }

  // Price Recommendations
  private generatePriceRecommendations(product: Product, prices: ProductPrice[]): PriceRecommendation[] {
    const recommendations: PriceRecommendation[] = [];
    const sortedPrices = [...prices].sort((a, b) => a.price - b.price);
    const bestPrice = sortedPrices[0];
    const averagePrice = prices.reduce((sum, p) => sum + p.price, 0) / prices.length;

    // Best value recommendation
    recommendations.push({
      type: 'best-value',
      title: 'Best Price Found',
      description: `Save R${(averagePrice - bestPrice.price).toFixed(2)} compared to average price`,
      storeId: bestPrice.storeId,
      savings: averagePrice - bestPrice.price,
      confidence: 0.95
    });

    // Nearby store recommendation (mock)
    const nearbyStore = prices.find(p => p.storeName.includes('Rosebank') || p.storeName.includes('Sandton'));
    if (nearbyStore && nearbyStore.storeId !== bestPrice.storeId) {
      recommendations.push({
        type: 'nearby',
        title: 'Convenient Option',
        description: `Only R${(nearbyStore.price - bestPrice.price).toFixed(2)} more than best price, but closer to you`,
        storeId: nearbyStore.storeId,
        savings: -(nearbyStore.price - bestPrice.price),
        confidence: 0.8
      });
    }

    // Premium option
    const premiumPrice = prices.find(p => p.storeName.includes('Woolworths'));
    if (premiumPrice) {
      recommendations.push({
        type: 'premium',
        title: 'Premium Quality',
        description: `Higher quality option at ${premiumPrice.storeName}`,
        storeId: premiumPrice.storeId,
        savings: 0,
        confidence: 0.7
      });
    }

    // Bulk deal recommendation
    const bulkStores = prices.filter(p => p.storeName.includes('Checkers') || p.storeName.includes('Shoprite'));
    if (bulkStores.length > 0) {
      const bulkStore = bulkStores[0];
      recommendations.push({
        type: 'bulk-deal',
        title: 'Bulk Buying Option',
        description: `Consider buying in bulk at ${bulkStore.storeName} for additional savings`,
        storeId: bulkStore.storeId,
        savings: 5, // Estimated bulk savings
        confidence: 0.6
      });
    }

    return recommendations.slice(0, 3); // Return top 3 recommendations
  }

  // Price Alerts
  public async createPriceAlert(
    productId: string,
    productName: string,
    targetPrice: number,
    storeId?: string
  ): Promise<PriceAlert> {
    const alert: PriceAlert = {
      id: `alert_${Date.now()}`,
      productId,
      productName,
      targetPrice,
      currentPrice: 0, // Will be updated when checked
      storeId: storeId || 'all',
      storeName: storeId ? this.getStoreName(storeId) : 'All Stores',
      isActive: true,
      createdDate: new Date().toISOString(),
      lastChecked: new Date().toISOString()
    };

    this.priceAlerts.push(alert);
    await this.savePriceAlerts();
    
    return alert;
  }

  public async getPriceAlerts(): Promise<PriceAlert[]> {
    return this.priceAlerts.filter(alert => alert.isActive);
  }

  public async updatePriceAlert(alertId: string, updates: Partial<PriceAlert>): Promise<void> {
    const alertIndex = this.priceAlerts.findIndex(alert => alert.id === alertId);
    if (alertIndex !== -1) {
      this.priceAlerts[alertIndex] = { ...this.priceAlerts[alertIndex], ...updates };
      await this.savePriceAlerts();
    }
  }

  public async deletePriceAlert(alertId: string): Promise<void> {
    this.priceAlerts = this.priceAlerts.filter(alert => alert.id !== alertId);
    await this.savePriceAlerts();
  }

  public async checkPriceAlerts(): Promise<PriceAlert[]> {
    const triggeredAlerts: PriceAlert[] = [];

    for (const alert of this.priceAlerts) {
      if (!alert.isActive) continue;

      // Check current prices for the product
      // This would typically call a real price checking API
      const currentPrice = await this.getCurrentPrice(alert.productId, alert.storeId);
      
      alert.currentPrice = currentPrice;
      alert.lastChecked = new Date().toISOString();

      if (currentPrice <= alert.targetPrice) {
        triggeredAlerts.push(alert);
      }
    }

    await this.savePriceAlerts();
    return triggeredAlerts;
  }

  private async getCurrentPrice(productId: string, storeId: string): Promise<number> {
    // Mock implementation - in production, this would check real prices
    const basePrice = 25 + Math.random() * 50; // Random price between 25-75 ZAR
    return Math.round(basePrice * 100) / 100;
  }

  // Price History and Trends
  private async recordPriceHistory(productId: string, prices: ProductPrice[]): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    
    for (const price of prices) {
      const historyEntry: PriceHistory = {
        productId,
        storeId: price.storeId,
        price: price.price,
        date: today,
        wasOnSale: !!price.discount,
        discount: price.discount
      };
      
      this.priceHistory.push(historyEntry);
    }

    // Keep only last 90 days of history
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    
    this.priceHistory = this.priceHistory.filter(entry => 
      new Date(entry.date) >= ninetyDaysAgo
    );

    await this.savePriceHistory();
  }

  public async getPriceHistory(productId: string, storeId?: string): Promise<PriceHistory[]> {
    let history = this.priceHistory.filter(entry => entry.productId === productId);
    
    if (storeId) {
      history = history.filter(entry => entry.storeId === storeId);
    }

    return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public async getPriceTrend(productId: string, storeId: string): Promise<{
    trend: 'rising' | 'falling' | 'stable';
    changePercentage: number;
    recommendation: string;
  }> {
    const history = await this.getPriceHistory(productId, storeId);
    
    if (history.length < 2) {
      return {
        trend: 'stable',
        changePercentage: 0,
        recommendation: 'Not enough price history available'
      };
    }

    const latestPrice = history[0].price;
    const oldestPrice = history[history.length - 1].price;
    const changePercentage = ((latestPrice - oldestPrice) / oldestPrice) * 100;

    let trend: 'rising' | 'falling' | 'stable';
    let recommendation: string;

    if (changePercentage > 5) {
      trend = 'rising';
      recommendation = 'Price is increasing. Consider buying soon if needed.';
    } else if (changePercentage < -5) {
      trend = 'falling';
      recommendation = 'Price is dropping. Wait for further decreases or buy now.';
    } else {
      trend = 'stable';
      recommendation = 'Price is stable. Good time to purchase.';
    }

    return {
      trend,
      changePercentage: Math.round(changePercentage * 100) / 100,
      recommendation
    };
  }

  // Savings Analysis
  public async generateSavingsOpportunities(
    monthlySpending: number,
    preferredStores: string[] = [],
    shoppingCategories: string[] = []
  ): Promise<SavingsOpportunity[]> {
    const opportunities: SavingsOpportunity[] = [];

    // Store switching opportunity
    opportunities.push({
      type: 'store-switch',
      title: 'Switch to Budget Stores',
      description: 'Shop at Checkers or Shoprite for household basics to save 15-20%',
      potentialSavings: monthlySpending * 0.175,
      effort: 'low',
      timeframe: 'immediate',
      actionItems: [
        'Compare prices for your regular items',
        'Try budget store brands',
        'Plan trips to combine errands'
      ]
    });

    // Bulk buying opportunity
    if (monthlySpending > 2000) {
      opportunities.push({
        type: 'bulk-buy',
        title: 'Bulk Purchase Savings',
        description: 'Buy non-perishables in bulk during sales to save 10-15%',
        potentialSavings: monthlySpending * 0.125,
        effort: 'medium',
        timeframe: '1-2 weeks',
        actionItems: [
          'Identify frequently used non-perishables',
          'Monitor bulk sale schedules',
          'Ensure adequate storage space'
        ]
      });
    }

    // Sale timing opportunity
    opportunities.push({
      type: 'sale-timing',
      title: 'Strategic Sale Shopping',
      description: 'Time purchases around weekly specials and month-end sales',
      potentialSavings: monthlySpending * 0.1,
      effort: 'low',
      timeframe: 'ongoing',
      actionItems: [
        'Check store catalogs weekly',
        'Plan meals around sale items',
        'Stock up during month-end clearances'
      ]
    });

    // Product substitution opportunity
    opportunities.push({
      type: 'substitute',
      title: 'Brand Substitution',
      description: 'Switch to store brands and local alternatives for similar quality',
      potentialSavings: monthlySpending * 0.15,
      effort: 'low',
      timeframe: 'immediate',
      actionItems: [
        'Try store-brand alternatives',
        'Compare ingredient lists',
        'Support local South African brands'
      ]
    });

    return opportunities;
  }

  // Store and Price Utilities
  public getStoreName(storeId: string): string {
    const store = this.storeDatabase.find(s => s.id === storeId);
    return store ? store.name : 'Unknown Store';
  }

  public formatPrice(price: number): string {
    return `R ${price.toFixed(2)}`;
  }

  public calculateSavings(originalPrice: number, salePrice: number): {
    amount: number;
    percentage: number;
    formattedAmount: string;
    formattedPercentage: string;
  } {
    const amount = originalPrice - salePrice;
    const percentage = (amount / originalPrice) * 100;
    
    return {
      amount,
      percentage,
      formattedAmount: this.formatPrice(amount),
      formattedPercentage: `${Math.round(percentage)}%`
    };
  }

  // Storage Methods
  private async savePriceAlerts(): Promise<void> {
    try {
      await AsyncStorage.setItem('price_alerts', JSON.stringify(this.priceAlerts));
    } catch (error) {
      console.error('Error saving price alerts:', error);
    }
  }

  private async loadPriceAlerts(): Promise<void> {
    try {
      const data = await AsyncStorage.getItem('price_alerts');
      if (data) {
        this.priceAlerts = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading price alerts:', error);
    }
  }

  private async savePriceHistory(): Promise<void> {
    try {
      await AsyncStorage.setItem('price_history', JSON.stringify(this.priceHistory));
    } catch (error) {
      console.error('Error saving price history:', error);
    }
  }

  private async loadPriceHistory(): Promise<void> {
    try {
      const data = await AsyncStorage.getItem('price_history');
      if (data) {
        this.priceHistory = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading price history:', error);
    }
  }
}

export default PriceComparisonService;
