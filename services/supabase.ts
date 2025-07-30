// Supabase Configuration for NaviLynx Production Backend
// Enhanced real-time database integration

import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Supabase configuration
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

// Database type definitions
export interface Database {
  public: {
    Tables: {
      venues: {
        Row: {
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
          createdAt: string;
          updatedAt: string;
        };
        Insert: Omit<Database['public']['Tables']['venues']['Row'], 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Database['public']['Tables']['venues']['Insert']>;
      };
      ble_beacons: {
        Row: {
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
          createdAt: string;
          updatedAt: string;
        };
        Insert: Omit<Database['public']['Tables']['ble_beacons']['Row'], 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Database['public']['Tables']['ble_beacons']['Insert']>;
      };
      points_of_interest: {
        Row: {
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
          createdAt: string;
          updatedAt: string;
        };
        Insert: Omit<Database['public']['Tables']['points_of_interest']['Row'], 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Database['public']['Tables']['points_of_interest']['Insert']>;
      };
      user_analytics: {
        Row: {
          id: string;
          userId: string;
          venueId: string;
          action: 'visit' | 'navigate' | 'search' | 'scan' | 'purchase';
          metadata: Record<string, any>;
          timestamp: string;
          sessionId: string;
          createdAt: string;
        };
        Insert: Omit<Database['public']['Tables']['user_analytics']['Row'], 'id' | 'createdAt'>;
        Update: Partial<Database['public']['Tables']['user_analytics']['Insert']>;
      };
      real_time_updates: {
        Row: {
          id: string;
          type: 'venue_status' | 'beacon_update' | 'poi_change' | 'deal_alert';
          venueId: string;
          data: Record<string, any>;
          timestamp: string;
          priority: 'low' | 'medium' | 'high' | 'urgent';
          createdAt: string;
        };
        Insert: Omit<Database['public']['Tables']['real_time_updates']['Row'], 'createdAt'>;
        Update: Partial<Database['public']['Tables']['real_time_updates']['Insert']>;
      };
      deals: {
        Row: {
          id: string;
          venueId: string;
          title: string;
          description: string;
          discountPercentage: number;
          originalPrice: number;
          discountedPrice: number;
          category: string;
          validUntil: string;
          isActive: boolean;
          images: string[];
          terms: string;
          claimCount: number;
          maxClaims?: number;
          createdAt: string;
          updatedAt: string;
        };
        Insert: Omit<Database['public']['Tables']['deals']['Row'], 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Database['public']['Tables']['deals']['Insert']>;
      };
      articles: {
        Row: {
          id: string;
          title: string;
          content: string;
          summary: string;
          author: string;
          category: string;
          tags: string[];
          publishedAt: string;
          isPublished: boolean;
          featuredImage?: string;
          readTime: number;
          viewCount: number;
          createdAt: string;
          updatedAt: string;
        };
        Insert: Omit<Database['public']['Tables']['articles']['Row'], 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Database['public']['Tables']['articles']['Insert']>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_nearby_venues: {
        Args: {
          lat: number;
          lng: number;
          radius_km: number;
        };
        Returns: Database['public']['Tables']['venues']['Row'][];
      };
      search_venues_advanced: {
        Args: {
          search_term: string;
          venue_type?: string;
          city?: string;
          province?: string;
          features?: string[];
        };
        Returns: Database['public']['Tables']['venues']['Row'][];
      };
    };
    Enums: {
      venue_type: 'shopping_mall' | 'airport' | 'hospital' | 'university' | 'office';
      beacon_status: 'active' | 'inactive' | 'low_battery';
      poi_type: 'store' | 'restaurant' | 'service' | 'entrance' | 'exit';
      analytics_action: 'visit' | 'navigate' | 'search' | 'scan' | 'purchase';
      update_priority: 'low' | 'medium' | 'high' | 'urgent';
    };
  };
}

// Create Supabase client with offline support
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
    global: {
      headers: {
        'X-Client-Info': 'navilynx-mobile@1.0.0',
      },
    },
  }
);

// Enhanced authentication helper
export class AuthService {
  static async signInWithEmail(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { user: data.user, session: data.session };
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  static async signUpWithEmail(email: string, password: string, metadata?: Record<string, any>) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) throw error;
      return { user: data.user, session: data.session };
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  static async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  }

  static onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

// Connection status helper
export class ConnectionService {
  private static isOnline = true;
  private static listeners: ((status: boolean) => void)[] = [];

  static async checkConnection(): Promise<boolean> {
    try {
      const { error } = await supabase.from('venues').select('id').limit(1);
      this.isOnline = !error;
      this.notifyListeners();
      return this.isOnline;
    } catch {
      this.isOnline = false;
      this.notifyListeners();
      return false;
    }
  }

  static addListener(callback: (status: boolean) => void) {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private static notifyListeners() {
    this.listeners.forEach(callback => callback(this.isOnline));
  }

  static get status() {
    return this.isOnline;
  }
}

// Data synchronization helper
export class SyncService {
  private static pendingWrites: any[] = [];

  static async queueWrite(table: string, operation: 'insert' | 'update' | 'delete', data: any) {
    this.pendingWrites.push({ table, operation, data, timestamp: Date.now() });
    
    // Try to sync immediately if online
    if (ConnectionService.status) {
      await this.syncPendingWrites();
    }
  }

  static async syncPendingWrites(): Promise<void> {
    if (!ConnectionService.status || this.pendingWrites.length === 0) return;

    try {
      for (const write of this.pendingWrites) {
        const { table, operation, data } = write;
        
        switch (operation) {
          case 'insert':
            await supabase.from(table).insert(data);
            break;
          case 'update':
            await supabase.from(table).update(data).eq('id', data.id);
            break;
          case 'delete':
            await supabase.from(table).delete().eq('id', data.id);
            break;
        }
      }

      this.pendingWrites = [];
      console.log('✅ Synced all pending writes');
    } catch (error) {
      console.error('Failed to sync pending writes:', error);
    }
  }

  static getPendingWriteCount(): number {
    return this.pendingWrites.length;
  }
}

// Export types and client
export type { Database };
export default supabase;
