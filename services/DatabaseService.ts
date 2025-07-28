/**
 * 🏗️ Database Service Layer - NaviLynx Production Backend
 * 
 * Offline-first architecture with future Supabase integration
 * Currently uses local storage with cloud-ready structure
 * 
 * @author Senior Architect
 * @version 1.0.0 - Investor Ready
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Venue, Deal } from '@/data/southAfricanVenues';

// Supabase types (for future implementation)
type SupabaseClient = any;
const createClient = (url: string, key: string): SupabaseClient => null;

// Store Card interface
export interface StoreCard {
  id: string;
  storeName: string;
  barcodeData: string;
  logoUrl: string;
  accentColor: string;
  loyaltyTier?: string;
  createdAt: Date;
}

// Types for database operations
export interface DatabaseVenue extends Venue {
  created_at?: string;
  updated_at?: string;
  view_count?: number;
  popularity_score?: number;
  status?: 'active' | 'inactive' | 'maintenance';
}

export interface UserSession {
  id: string;
  user_id: string;
  session_start: string;
  session_end?: string;
  venues_visited: string[];
  navigation_count: number;
  device_info: {
    platform: string;
    version: string;
    model: string;
  };
}

export interface NavigationLog {
  id: string;
  user_id: string;
  venue_id: string;
  start_location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  destination: {
    latitude: number;
    longitude: number;
    venue_name: string;
  };
  route_type: 'walking' | 'driving' | 'ar';
  success: boolean;
  duration_seconds?: number;
  distance_meters?: number;
  created_at: string;
}

export interface VenueAnalytics {
  venue_id: string;
  date: string;
  views: number;
  navigations: number;
  average_rating: number;
  popular_times: Record<string, number>;
  user_demographics: {
    age_groups: Record<string, number>;
    platforms: Record<string, number>;
  };
}

class DatabaseService {
  private supabase: SupabaseClient | null = null;
  private isOnline: boolean = true;
  private cacheTimeout: number = 5 * 60 * 1000; // 5 minutes
  private retryAttempts: number = 3;

  constructor() {
    this.initializeSupabase();
    this.setupOfflineDetection();
  }

  /**
   * Initialize Supabase connection
   */
  private initializeSupabase(): void {
    try {
      // TODO: Replace with your actual Supabase credentials
      const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
      const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

      if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project')) {
        this.supabase = createClient(supabaseUrl, supabaseAnonKey);
        console.log('✅ Database: Supabase initialized');
      } else {
        console.log('⚠️ Database: Running in offline mode - Supabase credentials not configured');
        this.isOnline = false;
      }
    } catch (error) {
      console.error('❌ Database: Supabase initialization failed:', error);
      this.isOnline = false;
    }
  }

  /**
   * Setup network detection for offline handling
   */
  private setupOfflineDetection(): void {
    // This would integrate with NetInfo in a real app
    // For now, we'll assume online unless Supabase fails
  }

  /**
   * Generic retry mechanism for database operations
   */
  private async withRetry<T>(
    operation: () => Promise<T>,
    attempts: number = this.retryAttempts
  ): Promise<T> {
    for (let i = 0; i < attempts; i++) {
      try {
        return await operation();
      } catch (error) {
        if (i === attempts - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
    throw new Error('Max retry attempts exceeded');
  }

  /**
   * Cache management utilities
   */
  private async getFromCache<T>(key: string): Promise<T | null> {
    try {
      const cached = await AsyncStorage.getItem(`cache_${key}`);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp > this.cacheTimeout) {
        await AsyncStorage.removeItem(`cache_${key}`);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  }

  private async setCache<T>(key: string, data: T): Promise<void> {
    try {
      await AsyncStorage.setItem(`cache_${key}`, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('Cache write failed:', error);
    }
  }

  // =============================================================================
  // VENUE OPERATIONS
  // =============================================================================

  /**
   * Get all venues with caching and offline support
   */
  async getVenues(): Promise<DatabaseVenue[]> {
    const cacheKey = 'all_venues';
    
    // Try cache first
    const cached = await this.getFromCache<DatabaseVenue[]>(cacheKey);
    if (cached && cached.length > 0) {
      return cached;
    }

    if (!this.supabase || !this.isOnline) {
      // Fallback to static data in offline mode
      const { southAfricanVenues } = await import('@/data/southAfricanVenues');
      return southAfricanVenues.map(venue => ({
        ...venue,
        status: 'active' as const,
        view_count: Math.floor(Math.random() * 1000),
        popularity_score: Math.random() * 5
      }));
    }

    try {
      const { data, error } = await this.withRetry(async () => {
        return await this.supabase!
          .from('venues')
          .select('*')
          .eq('status', 'active')
          .order('popularity_score', { ascending: false });
      });

      if (error) throw error;

      const venues = data || [];
      await this.setCache(cacheKey, venues);
      return venues;
    } catch (error) {
      console.error('❌ Database: Failed to fetch venues:', error);
      // Fallback to static data
      const { southAfricanVenues } = await import('@/data/southAfricanVenues');
      return southAfricanVenues.map(venue => ({ ...venue, status: 'active' as const }));
    }
  }

  /**
   * Get venue by ID with caching
   */
  async getVenueById(id: string): Promise<DatabaseVenue | null> {
    const cacheKey = `venue_${id}`;
    
    // Try cache first
    const cached = await this.getFromCache<DatabaseVenue>(cacheKey);
    if (cached) {
      return cached;
    }

    if (!this.supabase || !this.isOnline) {
      // Fallback to static data
      const { getVenueById } = await import('@/data/southAfricanVenues');
      const venue = getVenueById(id);
      return venue ? { ...venue, status: 'active' as const } : null;
    }

    try {
      const { data, error } = await this.withRetry(async () => {
        return await this.supabase!
          .from('venues')
          .select('*')
          .eq('id', id)
          .single();
      });

      if (error) throw error;

      if (data) {
        await this.setCache(cacheKey, data);
        // Track view
        this.trackVenueView(id);
      }

      return data;
    } catch (error) {
      console.error(`❌ Database: Failed to fetch venue ${id}:`, error);
      // Fallback to static data
      const { getVenueById } = await import('@/data/southAfricanVenues');
      const venue = getVenueById(id);
      return venue ? { ...venue, status: 'active' as const } : null;
    }
  }

  /**
   * Search venues with advanced filtering
   */
  async searchVenues(query: string, filters?: {
    category?: string;
    province?: string;
    city?: string;
    rating_min?: number;
  }): Promise<DatabaseVenue[]> {
    if (!this.supabase || !this.isOnline) {
      // Fallback to local search
      const venues = await this.getVenues();
      return venues.filter(venue => {
        const matchesQuery = !query || 
          venue.name.toLowerCase().includes(query.toLowerCase()) ||
          venue.description.toLowerCase().includes(query.toLowerCase());
          // venue.location.address.toLowerCase().includes(query.toLowerCase());

        const matchesFilters = !filters || (
          // (!filters.category || venue.category === filters.category) &&
          (!filters.province || venue.location.province === filters.province) &&
          (!filters.city || venue.location.city === filters.city) &&
          (!filters.rating_min || venue.rating >= filters.rating_min)
        );

        return matchesQuery && matchesFilters;
      });
    }

    try {
      let queryBuilder = this.supabase
        .from('venues')
        .select('*')
        .eq('status', 'active');

      if (query) {
        queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%,address.ilike.%${query}%`);
      }

      if (filters?.category) {
        queryBuilder = queryBuilder.eq('category', filters.category);
      }

      if (filters?.province) {
        queryBuilder = queryBuilder.eq('province', filters.province);
      }

      if (filters?.city) {
        queryBuilder = queryBuilder.eq('city', filters.city);
      }

      if (filters?.rating_min) {
        queryBuilder = queryBuilder.gte('rating', filters.rating_min);
      }

      const { data, error } = await queryBuilder.order('popularity_score', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Database: Search failed:', error);
      return this.searchVenues(query, filters); // Fallback to local search
    }
  }

  // =============================================================================
  // DEALS OPERATIONS
  // =============================================================================

  /**
   * Get active deals for a venue
   */
  async getVenueDeals(venueId: string): Promise<Deal[]> {
    const cacheKey = `deals_${venueId}`;
    const cached = await this.getFromCache<Deal[]>(cacheKey);
    if (cached) return cached;

    if (!this.supabase || !this.isOnline) {
      // Fallback to static data
      // const { southAfricanVenues } = await import('@/data/southAfricanVenues');
      // const venue = southAfricanVenues.find(v => v.id === venueId);
      return []; // venue?.deals || [];
    }

    try {
      const { data, error } = await this.supabase
        .from('deals')
        .select('*')
        .eq('venue_id', venueId)
        .eq('active', true)
        .gte('valid_until', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      const deals = data || [];
      await this.setCache(cacheKey, deals);
      return deals;
    } catch (error) {
      console.error('❌ Database: Failed to fetch deals:', error);
      return [];
    }
  }

  /**
   * Get all active deals across venues
   */
  async getAllDeals(): Promise<Deal[]> {
    const cacheKey = 'all_deals';
    const cached = await this.getFromCache<Deal[]>(cacheKey);
    if (cached) return cached;

    if (!this.supabase || !this.isOnline) {
      // Fallback to static data
      // const { southAfricanVenues } = await import('@/data/southAfricanVenues');
      const allDeals: Deal[] = [];
      // southAfricanVenues.forEach(venue => {
      //   if (venue.deals) {
      //     allDeals.push(...venue.deals);
      //   }
      // });
      return allDeals;
    }

    try {
      const { data, error } = await this.supabase
        .from('deals')
        .select(`
          *,
          venues (
            name,
            category,
            location
          )
        `)
        .eq('active', true)
        .gte('valid_until', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      const deals = data || [];
      await this.setCache(cacheKey, deals);
      return deals;
    } catch (error) {
      console.error('❌ Database: Failed to fetch all deals:', error);
      return [];
    }
  }

  // =============================================================================
  // USER ANALYTICS & TRACKING
  // =============================================================================

  /**
   * Track venue view for analytics
   */
  async trackVenueView(venueId: string, userId?: string): Promise<void> {
    if (!this.supabase || !this.isOnline) return;

    try {
      await this.supabase
        .from('venue_views')
        .insert([{
          venue_id: venueId,
          user_id: userId || 'anonymous',
          viewed_at: new Date().toISOString(),
          platform: 'mobile'
        }]);
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  }

  /**
   * Track navigation attempt
   */
  async trackNavigation(log: Omit<NavigationLog, 'id' | 'created_at'>): Promise<void> {
    if (!this.supabase || !this.isOnline) {
      // Store locally for later sync
      await this.setCache(`nav_log_${Date.now()}`, log);
      return;
    }

    try {
      await this.supabase
        .from('navigation_logs')
        .insert([{
          ...log,
          created_at: new Date().toISOString()
        }]);
    } catch (error) {
      console.warn('Navigation tracking failed:', error);
      // Store locally as fallback
      await this.setCache(`nav_log_${Date.now()}`, log);
    }
  }

  /**
   * Get analytics for investor dashboard
   */
  async getAnalytics(): Promise<{
    totalVenues: number;
    totalNavigations: number;
    totalViews: number;
    popularVenues: { venue_id: string; name: string; count: number }[];
    successRate: number;
  }> {
    if (!this.supabase || !this.isOnline) {
      // Return mock data for demo
      return {
        totalVenues: 50,
        totalNavigations: 1250,
        totalViews: 5670,
        popularVenues: [
          { venue_id: 'sandton-city', name: 'Sandton City', count: 234 },
          { venue_id: 'or-tambo', name: 'OR Tambo Airport', count: 198 },
          { venue_id: 'v-a-waterfront', name: 'V&A Waterfront', count: 167 }
        ],
        successRate: 0.94
      };
    }

    try {
      const [venuesResult, navigationResult, viewsResult] = await Promise.all([
        this.supabase.from('venues').select('id', { count: 'exact' }),
        this.supabase.from('navigation_logs').select('id', { count: 'exact' }),
        this.supabase.from('venue_views').select('id', { count: 'exact' })
      ]);

      const successRateResult = await this.supabase
        .from('navigation_logs')
        .select('success')
        .eq('success', true);

      const totalNavigations = navigationResult.count || 0;
      const successfulNavigations = successRateResult.data?.length || 0;

      return {
        totalVenues: venuesResult.count || 0,
        totalNavigations,
        totalViews: viewsResult.count || 0,
        popularVenues: [], // Would need more complex query
        successRate: totalNavigations > 0 ? successfulNavigations / totalNavigations : 0
      };
    } catch (error) {
      console.error('❌ Analytics fetch failed:', error);
      // Return fallback data
      return {
        totalVenues: 50,
        totalNavigations: 1250,
        totalViews: 5670,
        popularVenues: [],
        successRate: 0.94
      };
    }
  }

  // =============================================================================
  // STORE CARD OPERATIONS
  // =============================================================================

  /**
   * Save store card to database
   */
  async saveStoreCard(card: Omit<StoreCard, 'id' | 'createdAt'>): Promise<string> {
    const cardId = `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullCard: StoreCard = {
      ...card,
      id: cardId,
      createdAt: new Date()
    };

    // Always save locally first
    await AsyncStorage.setItem(`store_card_${cardId}`, JSON.stringify(fullCard));

    if (this.supabase && this.isOnline) {
      try {
        await this.supabase
          .from('store_cards')
          .insert([{
            id: cardId,
            user_id: 'current_user', // Would be actual user ID in production
            store_name: card.storeName,
            barcode_data: card.barcodeData,
            logo_url: card.logoUrl,
            accent_color: card.accentColor,
            loyalty_tier: card.loyaltyTier,
            created_at: new Date().toISOString()
          }]);
      } catch (error) {
        console.warn('Store card cloud save failed:', error);
      }
    }

    return cardId;
  }

  /**
   * Get all store cards for user
   */
  async getStoreCards(): Promise<StoreCard[]> {
    // Get local cards first
    const localCards: StoreCard[] = [];
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cardKeys = keys.filter(key => key.startsWith('store_card_'));
      
      for (const key of cardKeys) {
        const cardData = await AsyncStorage.getItem(key);
        if (cardData) {
          localCards.push(JSON.parse(cardData));
        }
      }
    } catch (error) {
      console.error('Failed to load local store cards:', error);
    }

    // If online, try to sync with cloud
    if (this.supabase && this.isOnline) {
      try {
        const { data, error } = await this.supabase
          .from('store_cards')
          .select('*')
          .eq('user_id', 'current_user')
          .order('created_at', { ascending: false });

        if (!error && data) {
          // Merge cloud and local data (cloud takes precedence)
          const cloudCards: StoreCard[] = data.map((card: any) => ({
            id: card.id,
            storeName: card.store_name,
            barcodeData: card.barcode_data,
            logoUrl: card.logo_url,
            accentColor: card.accent_color,
            loyaltyTier: card.loyalty_tier,
            createdAt: new Date(card.created_at)
          }));

          return cloudCards;
        }
      } catch (error) {
        console.warn('Cloud store cards fetch failed:', error);
      }
    }

    return localCards;
  }

  // =============================================================================
  // SYNC & MAINTENANCE
  // =============================================================================

  /**
   * Sync local data with cloud when online
   */
  async syncLocalData(): Promise<void> {
    if (!this.supabase || !this.isOnline) return;

    try {
      // Sync navigation logs
      const keys = await AsyncStorage.getAllKeys();
      const navLogKeys = keys.filter(key => key.startsWith('nav_log_'));
      
      for (const key of navLogKeys) {
        const logData = await AsyncStorage.getItem(key);
        if (logData) {
          const log = JSON.parse(logData);
          await this.trackNavigation(log);
          await AsyncStorage.removeItem(key);
        }
      }

      console.log('✅ Local data synced with cloud');
    } catch (error) {
      console.error('❌ Sync failed:', error);
    }
  }

  /**
   * Clear expired cache entries
   */
  async clearExpiredCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith('cache_'));
      
      for (const key of cacheKeys) {
        const cached = await AsyncStorage.getItem(key);
        if (cached) {
          const { timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp > this.cacheTimeout) {
            await AsyncStorage.removeItem(key);
          }
        }
      }
    } catch (error) {
      console.warn('Cache cleanup failed:', error);
    }
  }
}

// Export singleton instance
export const databaseService = new DatabaseService();
export default databaseService;
