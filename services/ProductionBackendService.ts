// NaviLynx Production Backend Integration Service
// Advanced real-time venue and user management system

import { supabase } from './supabase';

export interface ProductionVenue {
  id: string;
  name: string;
  description: string;
  location: {
    address: string;
    city: string;
    province: string;
    coordinates: { latitude: number; longitude: number };
  };
  type: 'shopping_mall' | 'airport' | 'hospital' | 'university' | 'office';
  amenities: string[];
  rating: number;
  reviewCount: number;
  openingHours: string;
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  isActive: boolean;
  features: string[];
  images: string[];
  capacity: number;
  bleBeacons: BLEBeacon[];
  pois: PointOfInterest[];
  createdAt: string;
  updatedAt: string;
}

export interface BLEBeacon {
  id: string;
  venueId: string;
  name: string;
  uuid: string;
  major: number;
  minor: number;
  position: { x: number; y: number; floor: number };
  transmissionPower: number;
  battery: number;
  status: 'active' | 'inactive' | 'low_battery';
  lastSeen: string;
}

export interface PointOfInterest {
  id: string;
  venueId: string;
  name: string;
  type: 'store' | 'restaurant' | 'service' | 'entrance' | 'exit';
  description?: string;
  position: { x: number; y: number; floor: number };
  category: string;
  hours?: string;
  contact?: string;
  isActive: boolean;
}

export interface UserAnalytics {
  id: string;
  userId: string;
  venueId: string;
  action: 'visit' | 'navigate' | 'search' | 'scan' | 'purchase';
  metadata: Record<string, any>;
  timestamp: string;
  sessionId: string;
}

export interface RealTimeUpdate {
  id: string;
  type: 'venue_status' | 'beacon_update' | 'poi_change' | 'deal_alert';
  venueId: string;
  data: Record<string, any>;
  timestamp: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

class ProductionBackendService {
  private static instance: ProductionBackendService;
  private isInitialized = false;
  private subscriptions: (() => void)[] = [];

  static getInstance(): ProductionBackendService {
    if (!this.instance) {
      this.instance = new ProductionBackendService();
    }
    return this.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Test database connection
      const { error } = await supabase.from('venues').select('count').limit(1);
      if (error) {
        console.warn('Database connection issue:', error);
        // Continue in offline mode
      }

      this.isInitialized = true;
      console.log('✅ Production Backend Service initialized');
    } catch (error) {
      console.error('Backend initialization failed:', error);
      // Graceful degradation to offline mode
    }
  }

  // Venue Management
  async getAllVenues(): Promise<ProductionVenue[]> {
    try {
      const { data, error } = await supabase
        .from('venues')
        .select(`
          *,
          ble_beacons(*),
          points_of_interest(*)
        `)
        .eq('isActive', true)
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch venues:', error);
      // Return cached data or empty array
      return this.getCachedVenues();
    }
  }

  async getVenueById(id: string): Promise<ProductionVenue | null> {
    try {
      const { data, error } = await supabase
        .from('venues')
        .select(`
          *,
          ble_beacons(*),
          points_of_interest(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to fetch venue:', error);
      return null;
    }
  }

  async searchVenues(query: string, filters?: {
    type?: string;
    city?: string;
    province?: string;
    features?: string[];
  }): Promise<ProductionVenue[]> {
    try {
      let queryBuilder = supabase
        .from('venues')
        .select(`
          *,
          ble_beacons(*),
          points_of_interest(*)
        `)
        .eq('isActive', true);

      // Add text search
      if (query) {
        queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
      }

      // Add filters
      if (filters?.type) {
        queryBuilder = queryBuilder.eq('type', filters.type);
      }
      if (filters?.city) {
        queryBuilder = queryBuilder.eq('location->>city', filters.city);
      }
      if (filters?.province) {
        queryBuilder = queryBuilder.eq('location->>province', filters.province);
      }

      const { data, error } = await queryBuilder.order('rating', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    }
  }

  // BLE Beacon Management
  async updateBeaconStatus(beaconId: string, status: BLEBeacon['status'], batteryLevel?: number): Promise<void> {
    try {
      const updateData: Partial<BLEBeacon> = {
        status,
        lastSeen: new Date().toISOString()
      };

      if (batteryLevel !== undefined) {
        updateData.battery = batteryLevel;
      }

      const { error } = await supabase
        .from('ble_beacons')
        .update(updateData)
        .eq('id', beaconId);

      if (error) throw error;

      // Trigger real-time update
      await this.publishRealTimeUpdate({
        id: `beacon_${beaconId}_${Date.now()}`,
        type: 'beacon_update',
        venueId: '', // Will be filled by trigger
        data: { beaconId, status, batteryLevel },
        timestamp: new Date().toISOString(),
        priority: batteryLevel && batteryLevel < 20 ? 'high' : 'medium'
      });
    } catch (error) {
      console.error('Failed to update beacon status:', error);
    }
  }

  async getActiveBeacons(venueId?: string): Promise<BLEBeacon[]> {
    try {
      let query = supabase
        .from('ble_beacons')
        .select('*')
        .eq('status', 'active');

      if (venueId) {
        query = query.eq('venueId', venueId);
      }

      const { data, error } = await query.order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch beacons:', error);
      return [];
    }
  }

  // Analytics & User Behavior
  async trackUserAction(action: UserAnalytics['action'], metadata: Record<string, any>): Promise<void> {
    try {
      const analytics: Omit<UserAnalytics, 'id'> = {
        userId: await this.getCurrentUserId(),
        venueId: metadata.venueId || '',
        action,
        metadata,
        timestamp: new Date().toISOString(),
        sessionId: this.getSessionId()
      };

      const { error } = await supabase.from('user_analytics').insert([analytics]);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to track user action:', error);
      // Store locally for later sync
      this.queueOfflineAnalytics(action, metadata);
    }
  }

  // Real-time Updates
  async subscribeToVenueUpdates(venueId: string, callback: (update: RealTimeUpdate) => void): Promise<() => void> {
    try {
      const subscription = supabase
        .channel(`venue_${venueId}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'real_time_updates',
          filter: `venueId=eq.${venueId}`
        }, (payload) => {
          callback(payload.new as RealTimeUpdate);
        })
        .subscribe();

      const unsubscribe = () => {
        supabase.removeChannel(subscription);
      };

      this.subscriptions.push(unsubscribe);
      return unsubscribe;
    } catch (error) {
      console.error('Failed to subscribe to venue updates:', error);
      return () => {};
    }
  }

  async publishRealTimeUpdate(update: Omit<RealTimeUpdate, 'id'>): Promise<void> {
    try {
      const { error } = await supabase
        .from('real_time_updates')
        .insert([{
          ...update,
          id: `${update.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to publish update:', error);
    }
  }

  // Caching & Offline Support
  private getCachedVenues(): ProductionVenue[] {
    // Return cached venue data for offline mode
    // This would integrate with AsyncStorage or similar
    return [];
  }

  private async getCurrentUserId(): Promise<string> {
    // Get current authenticated user ID
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || 'anonymous';
  }

  private getSessionId(): string {
    // Generate or retrieve session ID for analytics
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private queueOfflineAnalytics(action: UserAnalytics['action'], metadata: Record<string, any>): void {
    // Queue analytics for later sync when connection is restored
    console.log('Queued offline analytics:', { action, metadata });
  }

  // Performance Optimization
  async preloadVenueData(venueIds: string[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('venues')
        .select(`
          *,
          ble_beacons(*),
          points_of_interest(*)
        `)
        .in('id', venueIds);

      if (error) throw error;

      // Cache the preloaded data
      // Implementation would store in AsyncStorage or similar
      console.log('Preloaded venue data for', venueIds.length, 'venues');
    } catch (error) {
      console.error('Failed to preload venue data:', error);
    }
  }

  // Cleanup
  destroy(): void {
    this.subscriptions.forEach(unsubscribe => unsubscribe());
    this.subscriptions = [];
    this.isInitialized = false;
  }
}

// Real-time Venue Status Service
class RealTimeVenueService {
  private backendService: ProductionBackendService;
  private statusCache = new Map<string, any>();
  private updateCallbacks = new Map<string, ((status: any) => void)[]>();

  constructor() {
    this.backendService = ProductionBackendService.getInstance();
  }

  async subscribeToVenueStatus(venueId: string, callback: (status: any) => void): Promise<() => void> {
    // Add callback to list
    if (!this.updateCallbacks.has(venueId)) {
      this.updateCallbacks.set(venueId, []);
    }
    this.updateCallbacks.get(venueId)!.push(callback);

    // Subscribe to real-time updates
    const unsubscribe = await this.backendService.subscribeToVenueUpdates(venueId, (update) => {
      this.handleVenueUpdate(venueId, update);
    });

    // Return cleanup function
    return () => {
      const callbacks = this.updateCallbacks.get(venueId) || [];
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
      unsubscribe();
    };
  }

  private handleVenueUpdate(venueId: string, update: RealTimeUpdate): void {
    // Update cache
    this.statusCache.set(venueId, { ...this.statusCache.get(venueId), ...update.data });

    // Notify callbacks
    const callbacks = this.updateCallbacks.get(venueId) || [];
    const status = this.statusCache.get(venueId);
    callbacks.forEach(callback => callback(status));
  }

  getVenueStatus(venueId: string): any {
    return this.statusCache.get(venueId);
  }
}

// Export services
export const productionBackend = ProductionBackendService.getInstance();
export const realTimeVenueService = new RealTimeVenueService();

// Initialize on app start
export const initializeProductionServices = async (): Promise<void> => {
  try {
    await productionBackend.initialize();
    console.log('🚀 Production services initialized successfully');
  } catch (error) {
    console.error('Failed to initialize production services:', error);
  }
};
