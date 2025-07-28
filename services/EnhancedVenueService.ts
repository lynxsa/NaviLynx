/**
 * Enhanced Venue Service - Production-Ready Business Logic
 * Comprehensive venue data management with search, analytics, and recommendations
 */

import { enhancedSandtonCityAreas, VENUE_CATEGORIES, type EnhancedInternalArea } from '@/data/enhancedVenueAreas';

// Export the interface for use in other components
export type { EnhancedInternalArea };

export interface VenueSearchOptions {
  query?: string;
  category?: string;
  floor?: number;
  features?: string[]; // e.g., ['wheelchairAccessible', 'hasWifi']
  isOpen?: boolean;
  sortBy?: 'name' | 'distance' | 'popularity' | 'rating';
  limit?: number;
}

export interface VenueAnalytics {
  totalStores: number;
  categoriesCount: { [category: string]: number };
  averageRating: number;
  popularStores: EnhancedInternalArea[];
  newStores: EnhancedInternalArea[];
  featuredStores: EnhancedInternalArea[];
}

export class EnhancedVenueService {
  private venues: Map<string, EnhancedInternalArea[]> = new Map();
  
  constructor() {
    // Initialize with mock data
    this.venues.set('sandton-city', enhancedSandtonCityAreas);
  }
  
  /**
   * Get all areas for a venue with optional filtering
   */
  public getVenueAreas(
    venueId: string, 
    options: VenueSearchOptions = {}
  ): EnhancedInternalArea[] {
    const areas = this.venues.get(venueId) || [];
    let filtered = [...areas];
    
    // Apply filters
    if (options.query) {
      const query = options.query.toLowerCase();
      filtered = filtered.filter(area => 
        area.name.toLowerCase().includes(query) ||
        area.description.toLowerCase().includes(query) ||
        area.tags.some(tag => tag.toLowerCase().includes(query)) ||
        area.keywords.some(keyword => keyword.toLowerCase().includes(query))
      );
    }
    
    if (options.category) {
      filtered = filtered.filter(area => area.category === options.category);
    }
    
    if (options.floor !== undefined) {
      filtered = filtered.filter(area => area.location.floor === options.floor);
    }
    
    if (options.features && options.features.length > 0) {
      filtered = filtered.filter(area => 
        options.features!.every(feature => 
          area.features[feature as keyof typeof area.features]
        )
      );
    }
    
    if (options.isOpen !== undefined) {
      filtered = filtered.filter(area => this.isStoreOpen(area) === options.isOpen);
    }
    
    // Apply sorting
    if (options.sortBy) {
      filtered = this.sortAreas(filtered, options.sortBy);
    }
    
    // Apply limit
    if (options.limit) {
      filtered = filtered.slice(0, options.limit);
    }
    
    return filtered;
  }
  
  /**
   * Get venue analytics and insights
   */
  public getVenueAnalytics(venueId: string): VenueAnalytics {
    const areas = this.venues.get(venueId) || [];
    
    // Calculate category counts
    const categoriesCount: { [category: string]: number } = {};
    areas.forEach(area => {
      categoriesCount[area.category] = (categoriesCount[area.category] || 0) + 1;
    });
    
    // Calculate average rating
    const ratedAreas = areas.filter(area => area.rating);
    const averageRating = ratedAreas.length > 0 
      ? ratedAreas.reduce((sum, area) => sum + (area.rating?.average || 0), 0) / ratedAreas.length
      : 0;
    
    return {
      totalStores: areas.length,
      categoriesCount,
      averageRating,
      popularStores: areas.filter(area => area.isHighPriority).slice(0, 10),
      newStores: areas.filter(area => area.isNew),
      featuredStores: areas.filter(area => area.isFeatured)
    };
  }
  
  /**
   * Get areas by category with enhanced filtering
   */
  public getAreasByCategory(
    venueId: string, 
    categoryId: string
  ): EnhancedInternalArea[] {
    const category = VENUE_CATEGORIES[categoryId as keyof typeof VENUE_CATEGORIES];
    if (!category) return [];
    
    return this.getVenueAreas(venueId, {
      category: category.name,
      sortBy: 'popularity'
    });
  }
  
  /**
   * Get recommended areas based on user preferences
   */
  public getRecommendedAreas(
    venueId: string,
    userPreferences: {
      categories?: string[];
      features?: string[];
      maxWalkTime?: number;
    } = {}
  ): EnhancedInternalArea[] {
    const areas = this.venues.get(venueId) || [];
    
    let recommendations = areas.filter(area => {
      // Filter by preferred categories
      if (userPreferences.categories && userPreferences.categories.length > 0) {
        if (!userPreferences.categories.includes(area.category)) {
          return false;
        }
      }
      
      // Filter by required features
      if (userPreferences.features && userPreferences.features.length > 0) {
        if (!userPreferences.features.every(feature => 
          area.features[feature as keyof typeof area.features]
        )) {
          return false;
        }
      }
      
      // Filter by walk time
      if (userPreferences.maxWalkTime) {
        if (area.estimatedWalkTime > userPreferences.maxWalkTime) {
          return false;
        }
      }
      
      return true;
    });
    
    // Sort by priority and rating
    recommendations = recommendations.sort((a, b) => {
      // Prioritize featured stores
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      
      // Then by rating
      const aRating = a.rating?.average || 0;
      const bRating = b.rating?.average || 0;
      if (aRating !== bRating) return bRating - aRating;
      
      // Finally by priority
      if (a.isHighPriority && !b.isHighPriority) return -1;
      if (!a.isHighPriority && b.isHighPriority) return 1;
      
      return 0;
    });
    
    return recommendations.slice(0, 20); // Limit to top 20
  }
  
  /**
   * Calculate navigation time between areas
   */
  public calculateNavigationTime(
    fromArea: EnhancedInternalArea,
    toArea: EnhancedInternalArea
  ): number {
    // Simple distance calculation (in a real app, this would use proper pathfinding)
    const dx = Math.abs(fromArea.location.x - toArea.location.x);
    const dy = Math.abs(fromArea.location.y - toArea.location.y);
    const floorDiff = Math.abs(fromArea.location.floor - toArea.location.floor);
    
    // Base time: 1 meter per second walking speed
    const horizontalTime = Math.sqrt(dx * dx + dy * dy);
    
    // Add time for floor changes (30 seconds per floor via elevator/escalator)
    const verticalTime = floorDiff * 30;
    
    return Math.round(horizontalTime + verticalTime);
  }
  
  /**
   * Check if a store is currently open
   */
  public isStoreOpen(area: EnhancedInternalArea): boolean {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as keyof typeof area.operatingHours;
    const currentTime = now.getHours() * 100 + now.getMinutes();
    
    const todayHours = area.operatingHours[currentDay];
    if (!todayHours || todayHours === 'Closed') return false;
    
    const [openTime, closeTime] = todayHours.split('-');
    const openingTime = this.parseTime(openTime);
    const closingTime = this.parseTime(closeTime);
    
    return currentTime >= openingTime && currentTime <= closingTime;
  }
  
  /**
   * Get store hours for today
   */
  public getTodayHours(area: EnhancedInternalArea): string {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as keyof typeof area.operatingHours;
    return area.operatingHours[today] || 'Hours not available';
  }
  
  /**
   * Search areas with fuzzy matching
   */
  public searchAreas(
    venueId: string,
    query: string,
    options: Omit<VenueSearchOptions, 'query'> = {}
  ): EnhancedInternalArea[] {
    return this.getVenueAreas(venueId, { ...options, query });
  }
  
  // Private helper methods
  
  private sortAreas(areas: EnhancedInternalArea[], sortBy: string): EnhancedInternalArea[] {
    return areas.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'distance':
          return a.estimatedWalkTime - b.estimatedWalkTime;
        case 'popularity':
          // Sort by priority, then rating, then name
          if (a.isHighPriority && !b.isHighPriority) return -1;
          if (!a.isHighPriority && b.isHighPriority) return 1;
          
          const aRating = a.rating?.average || 0;
          const bRating = b.rating?.average || 0;
          if (aRating !== bRating) return bRating - aRating;
          
          return a.name.localeCompare(b.name);
        case 'rating':
          const aRat = a.rating?.average || 0;
          const bRat = b.rating?.average || 0;
          return bRat - aRat;
        default:
          return 0;
      }
    });
  }
  
  private parseTime(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 100 + minutes;
  }
}

// Export singleton instance
export const enhancedVenueService = new EnhancedVenueService();
