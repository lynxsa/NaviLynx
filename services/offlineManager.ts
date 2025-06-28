// services/offlineManager.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Network from 'expo-network';
import { Venue } from './venueService';

export interface OfflineData {
  venues: Venue[];
  maps: OfflineMap[];
  routes: OfflineRoute[];
  lastUpdated: string;
  version: string;
}

export interface OfflineMap {
  id: string;
  venueId: string;
  floor: string;
  mapData: string; // Base64 encoded map image or SVG data
  landmarks: OfflineLandmark[];
  paths: OfflinePath[];
}

export interface OfflineLandmark {
  id: string;
  name: string;
  type: 'store' | 'restroom' | 'elevator' | 'escalator' | 'exit' | 'information';
  coordinates: { x: number; y: number };
  floor: string;
  description?: string;
}

export interface OfflinePath {
  id: string;
  from: string;
  to: string;
  coordinates: { x: number; y: number }[];
  floor: string;
  accessibility: string[];
  estimatedTime: number;
}

export interface OfflineRoute {
  id: string;
  startPoint: string;
  destination: string;
  steps: {
    instruction: string;
    duration: number;
    distance: number;
    coordinates?: { x: number; y: number };
  }[];
  totalDuration: number;
  accessibility: string[];
}

export interface SyncStatus {
  isOnline: boolean;
  lastSync: Date | null;
  pendingUpdates: number;
  downloadProgress: number;
  syncInProgress: boolean;
}

class OfflineManager {
  private readonly STORAGE_KEY = 'navilynx_offline_data';
  private readonly CACHE_DIR = `${FileSystem.documentDirectory}navilynx_cache/`;
  private readonly MAX_CACHE_SIZE = 100 * 1024 * 1024; // 100MB
  private readonly CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

  private syncListeners: ((status: SyncStatus) => void)[] = [];
  private currentSyncStatus: SyncStatus = {
    isOnline: true,
    lastSync: null,
    pendingUpdates: 0,
    downloadProgress: 0,
    syncInProgress: false
  };

  async initialize(): Promise<void> {
    try {
      // Create cache directory if it doesn't exist
      const dirInfo = await FileSystem.getInfoAsync(this.CACHE_DIR);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.CACHE_DIR, { intermediates: true });
      }

      // Check network status
      await this.updateNetworkStatus();
      
      // Load cached data
      await this.loadOfflineData();
      
      // Set up network monitoring
      this.startNetworkMonitoring();
      
    } catch (error) {
      console.error('Failed to initialize offline manager:', error);
    }
  }

  private async updateNetworkStatus(): Promise<void> {
    try {
      const networkState = await Network.getNetworkStateAsync();
      const isOnline: boolean = Boolean(networkState.isConnected && (networkState.isInternetReachable ?? false));
      
      this.currentSyncStatus.isOnline = isOnline;
      this.notifySyncListeners();
      
    } catch (error) {
      console.error('Failed to check network status:', error);
      this.currentSyncStatus.isOnline = false;
    }
  }

  private startNetworkMonitoring(): void {
    // Monitor network changes every 30 seconds
    setInterval(async () => {
      await this.updateNetworkStatus();
      
      // Auto-sync when online
      if (this.currentSyncStatus.isOnline && !this.currentSyncStatus.syncInProgress) {
        await this.syncData();
      }
    }, 30000);
  }

  async syncData(forceSync: boolean = false): Promise<void> {
    if (this.currentSyncStatus.syncInProgress) {
      return;
    }

    try {
      this.currentSyncStatus.syncInProgress = true;
      this.currentSyncStatus.downloadProgress = 0;
      this.notifySyncListeners();

      if (!this.currentSyncStatus.isOnline && !forceSync) {
        return;
      }

      // Check if sync is needed
      const shouldSync = await this.shouldPerformSync();
      if (!shouldSync && !forceSync) {
        return;
      }

      // Download venues data
      this.currentSyncStatus.downloadProgress = 20;
      this.notifySyncListeners();
      const venues = await this.downloadVenuesData();

      // Download maps data
      this.currentSyncStatus.downloadProgress = 50;
      this.notifySyncListeners();
      const maps = await this.downloadMapsData();

      // Download routes data
      this.currentSyncStatus.downloadProgress = 80;
      this.notifySyncListeners();
      const routes = await this.downloadRoutesData();

      // Save offline data
      const offlineData: OfflineData = {
        venues,
        maps,
        routes,
        lastUpdated: new Date().toISOString(),
        version: '1.0.0'
      };

      await this.saveOfflineData(offlineData);

      this.currentSyncStatus.downloadProgress = 100;
      this.currentSyncStatus.lastSync = new Date();
      this.currentSyncStatus.pendingUpdates = 0;

    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      this.currentSyncStatus.syncInProgress = false;
      this.notifySyncListeners();
    }
  }

  private async shouldPerformSync(): Promise<boolean> {
    if (!this.currentSyncStatus.lastSync) {
      return true; // First sync
    }

    const timeSinceLastSync = Date.now() - this.currentSyncStatus.lastSync.getTime();
    return timeSinceLastSync > this.CACHE_EXPIRY;
  }

  private async downloadVenuesData(): Promise<Venue[]> {
    // Mock API call - replace with actual API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            name: 'Sandton City',
            category: 'shopping',
            location: 'Sandton, Johannesburg',
            address: '83 Rivonia Rd, Sandhurst, Sandton, 2196',
            coordinates: { lat: -26.1076, lng: 28.0567 },
            image: 'offline_cached_image_1',
            description: 'Premier shopping destination in Sandton',
            features: ['500+ Stores', 'Cinema', 'Food Court', 'Parking'],
            operatingHours: { 'Mon-Sun': '9:00 AM - 9:00 PM' },
            contactInfo: { phone: '+27 11 217 6000' },
            accessibility: ['Full Wheelchair Access', 'Multiple Elevators'],
            parking: { available: true, levels: ['P1', 'P2', 'P3'], cost: 'R15/hour' }
          }
          // Add more venues
        ]);
      }, 1000);
    });
  }

  private async downloadMapsData(): Promise<OfflineMap[]> {
    // Mock map data download
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'map_sandton_gf',
            venueId: '1',
            floor: 'Ground Floor',
            mapData: 'data:image/svg+xml;base64,PHN2Zz4uLi48L3N2Zz4=', // Mock SVG data
            landmarks: [
              {
                id: 'landmark_1',
                name: 'Main Entrance',
                type: 'information',
                coordinates: { x: 100, y: 50 },
                floor: 'Ground Floor',
                description: 'Primary entrance with information desk'
              },
              {
                id: 'landmark_2',
                name: 'Food Court',
                type: 'store',
                coordinates: { x: 200, y: 150 },
                floor: 'Ground Floor'
              }
            ],
            paths: [
              {
                id: 'path_1',
                from: 'landmark_1',
                to: 'landmark_2',
                coordinates: [
                  { x: 100, y: 50 },
                  { x: 150, y: 100 },
                  { x: 200, y: 150 }
                ],
                floor: 'Ground Floor',
                accessibility: ['wheelchair', 'mobility_aid'],
                estimatedTime: 120
              }
            ]
          }
        ]);
      }, 800);
    });
  }

  private async downloadRoutesData(): Promise<OfflineRoute[]> {
    // Mock routes data download
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'route_1',
            startPoint: 'Main Entrance',
            destination: 'Food Court',
            steps: [
              {
                instruction: 'Start at main entrance',
                duration: 0,
                distance: 0
              },
              {
                instruction: 'Walk straight through the main corridor',
                duration: 60,
                distance: 50,
                coordinates: { x: 150, y: 100 }
              },
              {
                instruction: 'Turn left at the food court sign',
                duration: 30,
                distance: 25,
                coordinates: { x: 200, y: 150 }
              }
            ],
            totalDuration: 90,
            accessibility: ['wheelchair', 'mobility_aid']
          }
        ]);
      }, 600);
    });
  }

  private async saveOfflineData(data: OfflineData): Promise<void> {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      
      // Also save to file system for larger data
      const filePath = `${this.CACHE_DIR}offline_data.json`;
      await FileSystem.writeAsStringAsync(filePath, JSON.stringify(data));
      
    } catch (error) {
      console.error('Failed to save offline data:', error);
      throw error;
    }
  }

  private async loadOfflineData(): Promise<OfflineData | null> {
    try {
      // Try to load from AsyncStorage first
      const storedData = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (storedData) {
        return JSON.parse(storedData);
      }

      // Fallback to file system
      const filePath = `${this.CACHE_DIR}offline_data.json`;
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      if (fileInfo.exists) {
        const fileContent = await FileSystem.readAsStringAsync(filePath);
        return JSON.parse(fileContent);
      }

      return null;
    } catch (error) {
      console.error('Failed to load offline data:', error);
      return null;
    }
  }

  async getOfflineVenues(): Promise<Venue[]> {
    const offlineData = await this.loadOfflineData();
    return offlineData?.venues || [];
  }

  async getOfflineMaps(venueId: string): Promise<OfflineMap[]> {
    const offlineData = await this.loadOfflineData();
    return offlineData?.maps.filter(map => map.venueId === venueId) || [];
  }

  async getOfflineRoutes(startPoint: string, destination: string): Promise<OfflineRoute[]> {
    const offlineData = await this.loadOfflineData();
    return offlineData?.routes.filter(route => 
      route.startPoint === startPoint && route.destination === destination
    ) || [];
  }

  async clearCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.STORAGE_KEY);
      
      // Clear file system cache
      const dirInfo = await FileSystem.getInfoAsync(this.CACHE_DIR);
      if (dirInfo.exists) {
        await FileSystem.deleteAsync(this.CACHE_DIR, { idempotent: true });
        await FileSystem.makeDirectoryAsync(this.CACHE_DIR, { intermediates: true });
      }

      this.currentSyncStatus.lastSync = null;
      this.currentSyncStatus.pendingUpdates = 0;
      this.notifySyncListeners();
      
    } catch (error) {
      console.error('Failed to clear cache:', error);
      throw error;
    }
  }

  async getCacheSize(): Promise<number> {
    try {
      let totalSize = 0;
      
      const dirInfo = await FileSystem.getInfoAsync(this.CACHE_DIR);
      if (dirInfo.exists) {
        const files = await FileSystem.readDirectoryAsync(this.CACHE_DIR);
        
        for (const file of files) {
          const filePath = `${this.CACHE_DIR}${file}`;
          const fileInfo = await FileSystem.getInfoAsync(filePath);
          if (fileInfo.exists && 'size' in fileInfo) {
            totalSize += fileInfo.size || 0;
          }
        }
      }
      
      return totalSize;
    } catch (error) {
      console.error('Failed to calculate cache size:', error);
      return 0;
    }
  }

  async isOfflineModeEnabled(): Promise<boolean> {
    const offlineData = await this.loadOfflineData();
    return offlineData !== null;
  }

  getSyncStatus(): SyncStatus {
    return { ...this.currentSyncStatus };
  }

  addSyncListener(listener: (status: SyncStatus) => void): void {
    this.syncListeners.push(listener);
  }

  removeSyncListener(listener: (status: SyncStatus) => void): void {
    const index = this.syncListeners.indexOf(listener);
    if (index > -1) {
      this.syncListeners.splice(index, 1);
    }
  }

  private notifySyncListeners(): void {
    this.syncListeners.forEach(listener => {
      try {
        listener(this.currentSyncStatus);
      } catch (error) {
        console.error('Sync listener error:', error);
      }
    });
  }

  async preloadVenueData(venueId: string): Promise<void> {
    if (!this.currentSyncStatus.isOnline) return;

    try {
      // Preload specific venue maps and routes
      console.log(`Preloading data for venue ${venueId}`);
      // Implementation would download and cache specific venue data
    } catch (error) {
      console.error('Failed to preload venue data:', error);
    }
  }

  async getSmartCacheRecommendations(): Promise<string[]> {
    // Return recommended venues to cache based on user behavior
    return [
      'Frequently visited venues',
      'Venues near your location',
      'Popular venues in your category preferences'
    ];
  }
}

export const offlineManager = new OfflineManager();
