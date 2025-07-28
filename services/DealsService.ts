import { Deal } from '@/data/southAfricanVenues';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ExtendedDeal extends Deal {
  originalPrice?: number;
  discountedPrice?: number;
  discountPercentage?: number;
  termsAndConditions?: string;
  isLimited?: boolean;
  limitedQuantity?: number;
  remainingQuantity?: number;
  badge?: string;
  tags?: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface DealFilter {
  category?: string;
  venue?: string;
  minDiscount?: number;
  maxDiscount?: number;
  isActive?: boolean;
  validOnly?: boolean;
  search?: string;
}

export interface DealSort {
  field: 'title' | 'discount' | 'validUntil' | 'createdAt';
  order: 'asc' | 'desc';
}

class DealsService {
  private static instance: DealsService;
  private deals: ExtendedDeal[] = [];
  private favorites: string[] = [];
  private cacheExpiry = 5 * 60 * 1000; // 5 minutes
  private lastFetch = 0;

  private constructor() {
    this.initializeDeals();
    this.loadFavorites();
  }

  public static getInstance(): DealsService {
    if (!DealsService.instance) {
      DealsService.instance = new DealsService();
    }
    return DealsService.instance;
  }

  private initializeDeals() {
    // Enhanced sample deals with more comprehensive data
    this.deals = [
      {
        id: '1',
        title: 'Flash Sale: Electronics',
        description: 'Smartphones, laptops & accessories at unbeatable prices. Get the latest tech gadgets with massive savings. Limited time offer with exclusive deals on premium brands including Samsung, Apple, and Huawei.',
        discount: '25% OFF',
        discountPercentage: 25,
        originalPrice: 15999,
        discountedPrice: 11999,
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800',
        venueName: 'TechZone Menlyn',
        venueId: 'store1',
        category: 'Electronics',
        isLimited: true,
        limitedQuantity: 50,
        remainingQuantity: 23,
        badge: 'HOT DEAL',
        tags: ['electronics', 'smartphones', 'laptops', 'accessories'],
        isActive: true,
        termsAndConditions: 'Valid only at TechZone Menlyn. Cannot be combined with other offers. Subject to stock availability.',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Fashion Week Special',
        description: 'Latest trends from top South African designers. Discover exclusive collections featuring contemporary styles and traditional South African fashion with international influences.',
        discount: '40% OFF',
        discountPercentage: 40,
        originalPrice: 2499,
        discountedPrice: 1499,
        validUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
        venueName: 'Trendy Fashion',
        venueId: 'store2',
        category: 'Fashion',
        isLimited: false,
        badge: 'DESIGNER',
        tags: ['fashion', 'designer', 'clothing', 'south african'],
        isActive: true,
        termsAndConditions: 'Valid at all Trendy Fashion stores. Excludes sale items. Valid ID required.',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        title: 'Gourmet Food Festival',
        description: 'Taste the finest cuisine at participating restaurants. Experience authentic South African flavors and international cuisines prepared by award-winning chefs.',
        discount: '30% OFF',
        discountPercentage: 30,
        originalPrice: 450,
        discountedPrice: 315,
        validUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
        venueName: 'Food Court Central',
        venueId: 'store3',
        category: 'Dining',
        isLimited: true,
        limitedQuantity: 200,
        remainingQuantity: 156,
        badge: 'EXCLUSIVE',
        tags: ['food', 'dining', 'restaurant', 'gourmet'],
        isActive: true,
        termsAndConditions: 'Valid for dine-in only. Advance booking required. Maximum 6 people per table.',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '4',
        title: 'Health & Beauty Bonanza',
        description: 'Premium skincare, cosmetics, and wellness products from leading brands. Pamper yourself with luxury beauty treatments at discounted prices.',
        discount: '35% OFF',
        discountPercentage: 35,
        originalPrice: 899,
        discountedPrice: 584,
        validUntil: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800',
        venueName: 'Beauty Paradise',
        venueId: 'store4',
        category: 'Beauty',
        isLimited: false,
        badge: 'NEW',
        tags: ['beauty', 'skincare', 'cosmetics', 'wellness'],
        isActive: true,
        termsAndConditions: 'Valid on all beauty products. Professional services excluded. Cannot be combined with loyalty points.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '5',
        title: 'Fitness Equipment Sale',
        description: 'Get fit with premium exercise equipment at unbeatable prices. Home gym essentials, professional-grade equipment, and fitness accessories.',
        discount: '20% OFF',
        discountPercentage: 20,
        originalPrice: 8999,
        discountedPrice: 7199,
        validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
        venueName: 'FitPro Store',
        venueId: 'store5',
        category: 'Sports',
        isLimited: true,
        limitedQuantity: 30,
        remainingQuantity: 12,
        badge: 'LIMITED',
        tags: ['fitness', 'sports', 'equipment', 'gym'],
        isActive: true,
        termsAndConditions: 'Installation service available at extra cost. 2-year warranty included. Assembly required.',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];
  }

  // Get all deals with optional filtering and sorting
  public async getDeals(filter?: DealFilter, sort?: DealSort): Promise<ExtendedDeal[]> {
    let filteredDeals = [...this.deals];

    // Apply filters
    if (filter) {
      if (filter.category) {
        filteredDeals = filteredDeals.filter(deal => 
          deal.category?.toLowerCase().includes(filter.category!.toLowerCase())
        );
      }

      if (filter.venue) {
        filteredDeals = filteredDeals.filter(deal => 
          deal.venueName?.toLowerCase().includes(filter.venue!.toLowerCase())
        );
      }

      if (filter.minDiscount) {
        filteredDeals = filteredDeals.filter(deal => 
          (deal.discountPercentage || 0) >= filter.minDiscount!
        );
      }

      if (filter.maxDiscount) {
        filteredDeals = filteredDeals.filter(deal => 
          (deal.discountPercentage || 0) <= filter.maxDiscount!
        );
      }

      if (filter.isActive !== undefined) {
        filteredDeals = filteredDeals.filter(deal => deal.isActive === filter.isActive);
      }

      if (filter.validOnly) {
        const now = new Date();
        filteredDeals = filteredDeals.filter(deal => 
          new Date(deal.validUntil) > now
        );
      }

      if (filter.search) {
        const searchTerm = filter.search.toLowerCase();
        filteredDeals = filteredDeals.filter(deal =>
          deal.title?.toLowerCase().includes(searchTerm) ||
          deal.description?.toLowerCase().includes(searchTerm) ||
          deal.venueName?.toLowerCase().includes(searchTerm) ||
          deal.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }
    }

    // Apply sorting
    if (sort) {
      filteredDeals.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sort.field) {
          case 'title':
            aValue = a.title || '';
            bValue = b.title || '';
            break;
          case 'discount':
            aValue = a.discountPercentage || 0;
            bValue = b.discountPercentage || 0;
            break;
          case 'validUntil':
            aValue = new Date(a.validUntil);
            bValue = new Date(b.validUntil);
            break;
          case 'createdAt':
            aValue = new Date(a.createdAt || 0);
            bValue = new Date(b.createdAt || 0);
            break;
          default:
            return 0;
        }

        if (sort.order === 'asc') {
          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        } else {
          return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        }
      });
    }

    return filteredDeals;
  }

  // Get deal by ID
  public async getDealById(id: string): Promise<ExtendedDeal | null> {
    return this.deals.find(deal => deal.id === id) || null;
  }

  // Get deals by category
  public async getDealsByCategory(category: string): Promise<ExtendedDeal[]> {
    return this.getDeals({ category, isActive: true, validOnly: true });
  }

  // Get deals by venue
  public async getDealsByVenue(venueId: string): Promise<ExtendedDeal[]> {
    return this.deals.filter(deal => 
      deal.venueId === venueId && deal.isActive && new Date(deal.validUntil) > new Date()
    );
  }

  // Get featured deals (high discount, limited, new)
  public async getFeaturedDeals(): Promise<ExtendedDeal[]> {
    return this.deals
      .filter(deal => 
        deal.isActive && 
        new Date(deal.validUntil) > new Date() &&
        ((deal.discountPercentage || 0) >= 30 || deal.isLimited || deal.badge === 'NEW')
      )
      .sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0))
      .slice(0, 5);
  }

  // Get expiring deals (expiring in 24 hours)
  public async getExpiringDeals(): Promise<ExtendedDeal[]> {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return this.deals.filter(deal => 
      deal.isActive && 
      new Date(deal.validUntil) <= tomorrow &&
      new Date(deal.validUntil) > new Date()
    );
  }

  // Favorites management
  public async addToFavorites(dealId: string): Promise<void> {
    if (!this.favorites.includes(dealId)) {
      this.favorites.push(dealId);
      await this.saveFavorites();
    }
  }

  public async removeFromFavorites(dealId: string): Promise<void> {
    const index = this.favorites.indexOf(dealId);
    if (index > -1) {
      this.favorites.splice(index, 1);
      await this.saveFavorites();
    }
  }

  public async getFavoriteDeals(): Promise<ExtendedDeal[]> {
    return this.deals.filter(deal => this.favorites.includes(deal.id));
  }

  public isFavorite(dealId: string): boolean {
    return this.favorites.includes(dealId);
  }

  // Search functionality
  public async searchDeals(query: string): Promise<ExtendedDeal[]> {
    return this.getDeals({ search: query, isActive: true, validOnly: true });
  }

  // Analytics and insights
  public async getDealAnalytics(): Promise<{
    totalDeals: number;
    activeDeals: number;
    expiredDeals: number;
    averageDiscount: number;
    topCategories: { category: string; count: number }[];
  }> {
    const totalDeals = this.deals.length;
    const activeDeals = this.deals.filter(deal => 
      deal.isActive && new Date(deal.validUntil) > new Date()
    ).length;
    const expiredDeals = this.deals.filter(deal => 
      new Date(deal.validUntil) <= new Date()
    ).length;

    const averageDiscount = this.deals.reduce((sum, deal) => 
      sum + (deal.discountPercentage || 0), 0
    ) / this.deals.length;

    const categoryCount: { [key: string]: number } = {};
    this.deals.forEach(deal => {
      if (deal.category) {
        categoryCount[deal.category] = (categoryCount[deal.category] || 0) + 1;
      }
    });

    const topCategories = Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalDeals,
      activeDeals,
      expiredDeals,
      averageDiscount: Math.round(averageDiscount * 100) / 100,
      topCategories,
    };
  }

  // Claim deal functionality
  public async claimDeal(dealId: string): Promise<{
    success: boolean;
    message: string;
    claimCode?: string;
  }> {
    const deal = await this.getDealById(dealId);
    
    if (!deal) {
      return { success: false, message: 'Deal not found' };
    }

    if (!deal.isActive) {
      return { success: false, message: 'Deal is no longer active' };
    }

    if (new Date(deal.validUntil) <= new Date()) {
      return { success: false, message: 'Deal has expired' };
    }

    if (deal.isLimited && (deal.remainingQuantity || 0) <= 0) {
      return { success: false, message: 'Deal is sold out' };
    }

    // Generate claim code
    const claimCode = `NL${deal.id}${Date.now().toString().slice(-4)}`;

    // Update remaining quantity if limited
    if (deal.isLimited && deal.remainingQuantity) {
      deal.remainingQuantity -= 1;
    }

    // In a real app, this would be sent to the backend
    // For now, we'll store claimed deals locally
    await this.storeClaimedDeal(dealId, claimCode);

    return {
      success: true,
      message: 'Deal claimed successfully!',
      claimCode,
    };
  }

  // Get user's claimed deals
  public async getClaimedDeals(): Promise<Array<{
    deal: ExtendedDeal;
    claimCode: string;
    claimedAt: string;
  }>> {
    try {
      const claimedDealsData = await AsyncStorage.getItem('claimed_deals');
      if (!claimedDealsData) return [];

      const claimedDeals = JSON.parse(claimedDealsData);
      const result = [];

      for (const claimed of claimedDeals) {
        const deal = await this.getDealById(claimed.dealId);
        if (deal) {
          result.push({
            deal,
            claimCode: claimed.claimCode,
            claimedAt: claimed.claimedAt,
          });
        }
      }

      return result;
    } catch (error) {
      console.error('Error loading claimed deals:', error);
      return [];
    }
  }

  // Private helper methods
  private async saveFavorites(): Promise<void> {
    try {
      await AsyncStorage.setItem('deal_favorites', JSON.stringify(this.favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }

  private async loadFavorites(): Promise<void> {
    try {
      const favoritesData = await AsyncStorage.getItem('deal_favorites');
      if (favoritesData) {
        this.favorites = JSON.parse(favoritesData);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }

  private async storeClaimedDeal(dealId: string, claimCode: string): Promise<void> {
    try {
      const existingClaimed = await AsyncStorage.getItem('claimed_deals');
      const claimedDeals = existingClaimed ? JSON.parse(existingClaimed) : [];
      
      claimedDeals.push({
        dealId,
        claimCode,
        claimedAt: new Date().toISOString(),
      });

      await AsyncStorage.setItem('claimed_deals', JSON.stringify(claimedDeals));
    } catch (error) {
      console.error('Error storing claimed deal:', error);
    }
  }

  // Utility methods
  public getDiscountText(deal: ExtendedDeal): string {
    if (deal.discountPercentage) {
      return `${deal.discountPercentage}% OFF`;
    }
    return deal.discount || 'Special Offer';
  }

  public formatPrice(price: number): string {
    return `R ${price.toLocaleString()}`;
  }

  public isExpiring(deal: ExtendedDeal, hours: number = 24): boolean {
    const expiryTime = new Date(deal.validUntil).getTime();
    const checkTime = Date.now() + (hours * 60 * 60 * 1000);
    return expiryTime <= checkTime && expiryTime > Date.now();
  }

  public getDaysRemaining(deal: ExtendedDeal): number {
    const expiryTime = new Date(deal.validUntil).getTime();
    const daysRemaining = Math.ceil((expiryTime - Date.now()) / (24 * 60 * 60 * 1000));
    return Math.max(0, daysRemaining);
  }
}

export default DealsService;
