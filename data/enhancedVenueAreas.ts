/**
 * Enhanced Venue Internal Areas - Production Ready Architecture
 * Advanced data structure with comprehensive store information
 * Designed for real-world indoor navigation and AR positioning
 */

export interface EnhancedInternalArea {
  id: string;
  name: string;
  brandName?: string; // For chain stores
  type: 'Medical' | 'Retail' | 'Service' | 'Food' | 'Entertainment' | 'Education' | 'Administration' | 'Emergency';
  category: string; // Sub-category for detailed filtering
  icon: string;
  description: string;
  
  // Location & Positioning
  location: {
    floor: number;
    zone: string; // Mall zone (North Wing, South Wing, etc.)
    x: number; // Indoor coordinate system (0-200)
    y: number; // Indoor coordinate system (0-150)
    z?: number; // For multi-level areas
    area?: number; // Square meters
  };
  
  // Real-world integration
  realWorldCoordinates?: {
    latitude: number;
    longitude: number;
    accuracy?: number; // GPS accuracy in meters
  };
  
  // BLE & AR Navigation
  beaconId?: string; // BLE beacon reference
  arMarkers?: {
    id: string;
    type: 'qr' | 'image' | 'nfc';
    position: { x: number; y: number; z: number };
  }[];
  
  // Business Information
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
    socialMedia?: {
      instagram?: string;
      facebook?: string;
      tiktok?: string;
    };
  };
  
  // Operating Information
  operatingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
    holidays?: string;
  };
  
  // Enhanced Features
  features: {
    wheelchairAccessible: boolean;
    hasWifi: boolean;
    acceptsCards: boolean;
    hasParking: boolean;
    hasFittingRooms?: boolean;
    hasDelivery?: boolean;
    hasOnlineOrdering?: boolean;
  };
  
  // Visual & Branding
  branding: {
    logo?: string;
    primaryColor: string;
    secondaryColor?: string;
    images: string[]; // Store photos
    thumbnail?: string;
  };
  
  // Search & Discovery
  tags: string[]; // Enhanced search tags
  keywords: string[]; // SEO keywords
  isHighPriority: boolean; // Featured/sponsored
  isFeatured: boolean; // Mall featured stores
  isNew: boolean; // New store indicator
  
  // Navigation Enhancement
  estimatedWalkTime: number; // Seconds from main entrance
  accessibilityNotes?: string;
  nearbyLandmarks: string[]; // Helper for navigation
  
  // Promotions & Deals
  currentPromotions?: {
    id: string;
    title: string;
    description: string;
    validUntil: string;
    discountPercentage?: number;
  }[];
  
  // Ratings & Reviews
  rating?: {
    average: number; // 1-5 stars
    totalReviews: number;
    breakdown: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  };
  
  // Analytics & Insights
  analytics?: {
    popularTimes: { [hour: string]: number }; // Hour -> traffic level
    averageVisitDuration: number; // Minutes
    peakDays: string[];
  };
}

// Enhanced Category System
export const VENUE_CATEGORIES = {
  RETAIL: {
    id: 'retail',
    name: 'Retail',
    icon: 'storefront',
    color: '#3B82F6',
    subcategories: [
      'Fashion & Clothing',
      'Electronics',
      'Home & Garden',
      'Books & Media',
      'Sports & Outdoors',
      'Jewelry & Accessories',
      'Beauty & Cosmetics',
      'Toys & Games'
    ]
  },
  FOOD: {
    id: 'food',
    name: 'Food & Dining',
    icon: 'gear',
    color: '#10B981',
    subcategories: [
      'Fast Food',
      'Restaurants',
      'Cafes & Coffee',
      'Bakeries',
      'Food Court',
      'Specialty Food',
      'Ice Cream & Desserts',
      'Bars & Lounges'
    ]
  },
  SERVICES: {
    id: 'services',
    name: 'Services',
    icon: 'gear',
    color: '#8B5CF6',
    subcategories: [
      'Banking & Finance',
      'Hair & Beauty',
      'Health & Wellness',
      'Repair Services',
      'Professional Services',
      'Fitness & Gym',
      'Medical Services',
      'Travel Services'
    ]
  },
  ENTERTAINMENT: {
    id: 'entertainment',
    name: 'Entertainment',
    icon: 'gear',
    color: '#F59E0B',
    subcategories: [
      'Cinema',
      'Gaming',
      'Kids Play Area',
      'Bowling',
      'Arcade',
      'Events & Shows',
      'Art Gallery',
      'Music & Performance'
    ]
  }
} as const;

// Production-ready venue data enrichment
export const createEnhancedVenueData = (venueId: string): EnhancedInternalArea[] => {
  // This would typically come from a CMS or database
  const baseStoreData: Partial<EnhancedInternalArea>[] = [
    {
      id: 'woolworths-main',
      name: 'Woolworths',
      brandName: 'Woolworths Holdings',
      type: 'Retail',
      category: 'Supermarket',
      description: 'Premium supermarket with fresh food, clothing, and household items',
      location: {
        floor: 1,
        zone: 'North Wing',
        x: 50,
        y: 75,
        area: 2500
      },
      branding: {
        primaryColor: '#00A651',
        secondaryColor: '#FFFFFF',
        images: ['woolworths-1.jpg', 'woolworths-2.jpg'],
        logo: 'woolworths-logo.png'
      },
      features: {
        wheelchairAccessible: true,
        hasWifi: true,
        acceptsCards: true,
        hasParking: true,
        hasDelivery: true,
        hasOnlineOrdering: true
      },
      isHighPriority: true,
      isFeatured: true,
      isNew: false,
      estimatedWalkTime: 120,
      tags: ['grocery', 'supermarket', 'fresh food', 'clothing', 'woolies'],
      keywords: ['supermarket', 'groceries', 'fresh produce', 'clothing']
    },
    {
      id: 'pick-n-pay',
      name: 'Pick n Pay',
      brandName: 'Pick n Pay Stores',
      type: 'Retail',
      category: 'Supermarket',
      description: 'South Africa\'s leading supermarket chain',
      location: {
        floor: 1,
        zone: 'South Wing',
        x: 150,
        y: 100,
        area: 3000
      },
      branding: {
        primaryColor: '#E31837',
        secondaryColor: '#FFFFFF',
        images: ['pnp-1.jpg', 'pnp-2.jpg'],
        logo: 'pnp-logo.png'
      }
    },
    {
      id: 'zara-fashion',
      name: 'Zara',
      brandName: 'Inditex Group',
      type: 'Retail',
      category: 'Fashion & Clothing',
      description: 'International fashion retail chain',
      location: {
        floor: 2,
        zone: 'Fashion District',
        x: 80,
        y: 60,
        area: 800
      },
      branding: {
        primaryColor: '#000000',
        secondaryColor: '#FFFFFF',
        images: ['zara-1.jpg', 'zara-2.jpg'],
        logo: 'zara-logo.png'
      }
    },
    {
      id: 'mcdonalds-food',
      name: 'McDonald\'s',
      brandName: 'McDonald\'s Corporation',
      type: 'Food',
      category: 'Fast Food',
      description: 'World\'s largest fast food restaurant chain',
      location: {
        floor: 3,
        zone: 'Food Court',
        x: 100,
        y: 50,
        area: 200
      },
      branding: {
        primaryColor: '#FFC72C',
        secondaryColor: '#DA020E',
        images: ['mcdonalds-1.jpg', 'mcdonalds-2.jpg'],
        logo: 'mcdonalds-logo.png'
      }
    }
  ];

  // Generate complete enhanced data
  return baseStoreData.map((store, index) => ({
    id: store.id!,
    name: store.name!,
    brandName: store.brandName,
    type: store.type!,
    category: store.category!,
    icon: 'storefront',
    description: store.description!,
    location: store.location!,
    
    // Default operating hours
    operatingHours: {
      monday: '09:00-21:00',
      tuesday: '09:00-21:00',
      wednesday: '09:00-21:00',
      thursday: '09:00-21:00',
      friday: '09:00-22:00',
      saturday: '09:00-22:00',
      sunday: '10:00-20:00'
    },
    
    // Default features
    features: {
      wheelchairAccessible: true,
      hasWifi: false,
      acceptsCards: true,
      hasParking: false,
      ...store.features
    },
    
    // Default branding
    branding: {
      primaryColor: '#3B82F6',
      images: [],
      ...store.branding
    },
    
    // Enhanced search & discovery
    tags: store.tags || [store.category!.toLowerCase()],
    keywords: store.keywords || [store.name!.toLowerCase()],
    isHighPriority: store.isHighPriority || false,
    isFeatured: store.isFeatured || false,
    isNew: store.isNew || false,
    
    // Navigation
    estimatedWalkTime: store.estimatedWalkTime || 90,
    nearbyLandmarks: [`Floor ${store.location!.floor}`, store.location!.zone],
    
    // Mock analytics
    analytics: {
      popularTimes: {
        '09': 30, '10': 45, '11': 60, '12': 85, '13': 90,
        '14': 75, '15': 65, '16': 70, '17': 80, '18': 85,
        '19': 60, '20': 40, '21': 20
      },
      averageVisitDuration: 25,
      peakDays: ['Friday', 'Saturday', 'Sunday']
    }
  }));
};

// Export enhanced data for Sandton City
export const enhancedSandtonCityAreas = createEnhancedVenueData('sandton-city');
