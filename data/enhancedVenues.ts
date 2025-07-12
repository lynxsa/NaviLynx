// Enhanced South African venues data based on comprehensive requirements
// Includes 10 venues per category across 7 categories with detailed information

export interface VenueZone {
  id: string;
  name: string;
  level: number;
  description: string;
  color: string;
  amenities: string[];
  stores?: string[];
  coordinates?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface VenuePromotion {
  id: string;
  title: string;
  description: string;
  discountPercentage?: number;
  validFrom: string;
  validUntil: string;
  image: string;
  termsAndConditions: string;
  category: string;
  stores?: string[];
}

export interface VenueAccessibility {
  wheelchairAccess: boolean;
  elevators: string[];
  disabledParking: {
    available: boolean;
    spaces: number;
    location: string;
  };
  audioNavigation: boolean;
  brailleSignage: boolean;
  hearingLoop: boolean;
  accessibleRestrooms: string[];
  guideDogFriendly: boolean;
  tactilePathways: boolean;
}

export interface VenueFloorPlan {
  level: number;
  name: string;
  mapImage: string;
  zones: string[];
  dimensions: {
    width: number;
    height: number;
  };
  scale: number; // meters per pixel
}

export interface VenueStore {
  id: string;
  name: string;
  category: string;
  level: number;
  zone: string;
  description: string;
  image: string;
  logo?: string;
  openingHours: string;
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  coordinates: {
    x: number;
    y: number;
  };
  tags: string[];
  rating?: number;
  priceRange?: 'budget' | 'mid-range' | 'premium' | 'luxury';
}

export interface EnhancedVenue {
  id: string;
  name: string;
  type: 'mall' | 'airport' | 'hospital' | 'university' | 'stadium' | 'government' | 'entertainment';
  description: string;
  shortDescription: string;
  
  // Images and branding
  headerImage: string;
  images: string[];
  logo?: string;
  
  // Location and contact
  location: {
    address: string;
    city: string;
    province: string;
    postalCode: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  contact: {
    phone: string;
    email?: string;
    website: string;
    socialMedia?: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
    };
  };
  
  // Operating information
  openingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
    publicHolidays?: string;
  };
  
  // Features and amenities
  features: string[];
  amenities: string[];
  services: string[];
  
  // Ratings and reviews
  rating: number;
  reviewCount: number;
  
  // Structure and navigation
  levels: number;
  totalArea: number; // in square meters
  zones: VenueZone[];
  floorPlans: VenueFloorPlan[];
  entrances: {
    name: string;
    level: number;
    description: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    accessibility: boolean;
  }[];
  
  // Stores and tenants
  stores: VenueStore[];
  storeCategories: string[];
  
  // Accessibility
  accessibility: VenueAccessibility;
  
  // Parking
  parking: {
    available: boolean;
    levels: number;
    capacity: number;
    pricing: {
      hourly: number;
      daily: number;
      monthly?: number;
    };
    paymentMethods: string[];
    electricVehicleCharging: boolean;
    disabledSpaces: number;
  };
  
  // Events and promotions
  promotions: VenuePromotion[];
  events: {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    image: string;
    ticketPrice?: number;
    category: string;
  }[];
  
  // Emergency and safety
  emergency: {
    exitRoutes: string[];
    assemblyPoints: string[];
    emergencyContacts: {
      security: string;
      medical: string;
      fire: string;
    };
    defibrillatorLocations: string[];
  };
  
  // Transportation
  transportation: {
    publicTransport: string[];
    shuttle: boolean;
    taxi: boolean;
    rideshare: boolean;
  };
  
  // Metadata
  lastUpdated: string;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
}

export interface VenueCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  image: string;
  color: string;
  venueCount: number;
  popularTags: string[];
}

// 7 Categories with 10 venues each (70 total venues)
export const venueCategories: VenueCategory[] = [
  {
    id: 'shopping-malls',
    name: 'Malls',
    description: 'Premier shopping destinations across South Africa',
    icon: 'shopping-bag',
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: '#FF6B6B',
    venueCount: 10,
    popularTags: ['fashion', 'dining', 'entertainment', 'luxury', 'family-friendly']
  },
  {
    id: 'airports',
    name: 'Airports',
    description: 'Major airports with comprehensive navigation',
    icon: 'airplane',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: '#4ECDC4',
    venueCount: 10,
    popularTags: ['travel', 'duty-free', 'lounges', 'transportation', 'international']
  },
  {
    id: 'hospitals',
    name: 'Hospitals',
    description: 'Leading healthcare facilities',
    icon: 'medical-cross',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: '#45B7D1',
    venueCount: 10,
    popularTags: ['healthcare', 'emergency', 'specialists', 'accessibility', 'parking']
  },
  {
    id: 'universities',
    name: 'Academic',
    description: 'Top educational institutions',
    icon: 'academic-cap',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: '#96CEB4',
    venueCount: 10,
    popularTags: ['education', 'research', 'campus', 'libraries', 'student-services']
  },
  {
    id: 'stadiums',
    name: 'Stadiums',
    description: 'Major sports and entertainment venues',
    icon: 'trophy',
    image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: '#FFEAA7',
    venueCount: 10,
    popularTags: ['sports', 'events', 'concerts', 'seating', 'concessions']
  },
  {
    id: 'government',
    name: 'Government',
    description: 'Public service facilities',
    icon: 'building-office',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: '#DDA0DD',
    venueCount: 10,
    popularTags: ['public-service', 'documentation', 'offices', 'security', 'accessibility']
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    description: 'Casinos, theaters, and entertainment complexes',
    icon: 'film',
    image: 'https://images.unsplash.com/photo-1489599210737-f47f2d15c818?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: '#FF8A80',
    venueCount: 10,
    popularTags: ['gaming', 'shows', 'dining', 'nightlife', 'luxury']
  }
];

// Enhanced venue data - Shopping Malls (10 venues)
export const shoppingMalls: EnhancedVenue[] = [
  {
    id: 'sandton-city',
    name: 'Sandton City',
    type: 'mall',
    description: 'Premier shopping destination in the heart of Sandton with over 300 stores across luxury and mainstream brands, featuring world-class dining, entertainment, and services.',
    shortDescription: 'Premier shopping destination with 300+ stores',
    headerImage: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586880244406-556ebe35f282?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519201183976-8acc8d4c1c78?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    location: {
      address: '83 Rivonia Rd, Sandhurst',
      city: 'Sandton',
      province: 'Gauteng',
      postalCode: '2196',
      coordinates: { latitude: -26.1076, longitude: 28.0567 }
    },
    contact: {
      phone: '+27 11 217 6000',
      email: 'info@sandtoncity.co.za',
      website: 'https://www.sandtoncity.co.za',
      socialMedia: {
        facebook: 'https://facebook.com/sandtoncity',
        instagram: 'https://instagram.com/sandtoncity'
      }
    },
    openingHours: {
      monday: '09:00 - 21:00',
      tuesday: '09:00 - 21:00',
      wednesday: '09:00 - 21:00',
      thursday: '09:00 - 21:00',
      friday: '09:00 - 21:00',
      saturday: '09:00 - 21:00',
      sunday: '09:00 - 19:00',
      publicHolidays: '10:00 - 17:00'
    },
    features: ['Indoor Navigation', 'AR Shopping', 'Parking Assistant', 'Digital Concierge', 'Premium Shopping'],
    amenities: ['Food Court', 'Cinema', 'Banking', 'ATMs', 'WiFi', 'Baby Change Rooms', 'Prayer Room'],
    services: ['Personal Shopping', 'Gift Wrapping', 'Valet Parking', 'Currency Exchange', 'Lost & Found'],
    rating: 4.6,
    reviewCount: 2847,
    levels: 4,
    totalArea: 142000,
    zones: [
      {
        id: 'fashion-quarter',
        name: 'Fashion Quarter',
        level: 2,
        description: 'Premium fashion and accessories',
        color: '#FF6B6B',
        amenities: ['Fitting Rooms', 'Personal Styling', 'Fashion Concierge'],
        stores: ['H&M', 'Zara', 'Woolworths', 'Truworths'],
        coordinates: { x: 100, y: 200, width: 300, height: 150 }
      },
      {
        id: 'food-court',
        name: 'Food Court',
        level: 3,
        description: 'Diverse dining options',
        color: '#4ECDC4',
        amenities: ['Seating Area', 'Kids Play Area', 'Halaal Options'],
        stores: ['McDonald\'s', 'KFC', 'Nando\'s', 'Ocean Basket'],
        coordinates: { x: 200, y: 100, width: 250, height: 200 }
      }
    ],
    floorPlans: [
      {
        level: 1,
        name: 'Ground Level',
        mapImage: 'https://example.com/sandton-city-l1.jpg',
        zones: ['main-entrance', 'anchor-stores'],
        dimensions: { width: 800, height: 600 },
        scale: 0.5
      }
    ],
    entrances: [
      {
        name: 'Main Entrance (Nelson Mandela Square)',
        level: 1,
        description: 'Primary entrance with direct access to Nelson Mandela Square',
        coordinates: { latitude: -26.1076, longitude: 28.0567 },
        accessibility: true
      }
    ],
    stores: [
      {
        id: 'h-and-m-sandton',
        name: 'H&M',
        category: 'Fashion',
        level: 2,
        zone: 'fashion-quarter',
        description: 'Swedish fashion retailer',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        openingHours: '09:00 - 21:00',
        contact: {
          phone: '+27 11 784 7600'
        },
        coordinates: { x: 150, y: 220 },
        tags: ['fashion', 'affordable', 'trendy'],
        rating: 4.2,
        priceRange: 'mid-range'
      }
    ],
    storeCategories: ['Fashion', 'Electronics', 'Beauty', 'Food', 'Home', 'Services'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Main Lift Bank A', 'Main Lift Bank B', 'Service Lifts'],
      disabledParking: {
        available: true,
        spaces: 150,
        location: 'Level P1, near main entrance'
      },
      audioNavigation: true,
      brailleSignage: true,
      hearingLoop: true,
      accessibleRestrooms: ['Level 1 Main', 'Level 2 Fashion Quarter', 'Level 3 Food Court'],
      guideDogFriendly: true,
      tactilePathways: true
    },
    parking: {
      available: true,
      levels: 6,
      capacity: 7000,
      pricing: {
        hourly: 5,
        daily: 50,
        monthly: 800
      },
      paymentMethods: ['Cash', 'Card', 'Mobile Payment', 'EFT'],
      electricVehicleCharging: true,
      disabledSpaces: 150
    },
    promotions: [
      {
        id: 'summer-sale-2024',
        title: 'Summer Sale',
        description: 'Up to 50% off selected items',
        discountPercentage: 50,
        validFrom: '2024-12-01',
        validUntil: '2024-12-31',
        image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        termsAndConditions: 'Valid on selected items only. Cannot be combined with other offers.',
        category: 'Fashion',
        stores: ['H&M', 'Zara', 'Woolworths']
      }
    ],
    events: [
      {
        id: 'festive-concert-2024',
        title: 'Festive Concert Series',
        description: 'Live music performances every weekend',
        date: '2024-12-15',
        time: '18:00',
        location: 'Nelson Mandela Square',
        image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        category: 'Entertainment'
      }
    ],
    emergency: {
      exitRoutes: ['Main Entrance', 'Emergency Exit A', 'Emergency Exit B', 'Emergency Exit C'],
      assemblyPoints: ['Nelson Mandela Square', 'Parking Level P1'],
      emergencyContacts: {
        security: '+27 11 217 6001',
        medical: '+27 11 217 6002',
        fire: '10177'
      },
      defibrillatorLocations: ['Main Entrance', 'Food Court', 'Cinema Level']
    },
    transportation: {
      publicTransport: ['Gautrain (Sandton Station)', 'Bus Rapid Transit', 'Municipal Buses'],
      shuttle: true,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: true,
    tags: ['premium', 'shopping', 'dining', 'entertainment', 'luxury', 'gautrain-connected']
  },
  {
    id: 'v-and-a-waterfront',
    name: 'V&A Waterfront',
    type: 'mall',
    description: 'Africa\'s most visited destination combining shopping, dining, entertainment, and accommodation in a stunning waterfront setting.',
    shortDescription: 'Iconic waterfront shopping and entertainment',
    headerImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    location: {
      address: 'Dock Rd, V&A Waterfront',
      city: 'Cape Town',
      province: 'Western Cape',
      postalCode: '8001',
      coordinates: { latitude: -33.9025, longitude: 18.4187 }
    },
    contact: {
      phone: '+27 21 408 7600',
      website: 'https://www.waterfront.co.za'
    },
    openingHours: {
      monday: '09:00 - 21:00',
      tuesday: '09:00 - 21:00',
      wednesday: '09:00 - 21:00',
      thursday: '09:00 - 21:00',
      friday: '09:00 - 21:00',
      saturday: '09:00 - 21:00',
      sunday: '09:00 - 21:00'
    },
    features: ['Waterfront Views', 'Marine Entertainment', 'Luxury Shopping', 'Harbor Activities'],
    amenities: ['Marina', 'Aquarium', 'Hotel', 'Conference Centre', 'Parking'],
    services: ['Boat Tours', 'Event Hosting', 'Concierge'],
    rating: 4.7,
    reviewCount: 5200,
    levels: 3,
    totalArea: 123000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Fashion', 'Dining', 'Entertainment', 'Tourism'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Main Lift Bank'],
      disabledParking: { available: true, spaces: 80, location: 'Level P1' },
      audioNavigation: false,
      brailleSignage: true,
      hearingLoop: false,
      accessibleRestrooms: ['Level 1', 'Level 2'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 3,
      capacity: 3500,
      pricing: { hourly: 8, daily: 60 },
      paymentMethods: ['Cash', 'Card'],
      electricVehicleCharging: false,
      disabledSpaces: 80
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Main Exit'],
      assemblyPoints: ['Waterfront Plaza'],
      emergencyContacts: { security: '+27 21 408 7601', medical: '+27 21 408 7602', fire: '10177' },
      defibrillatorLocations: ['Main Entrance']
    },
    transportation: {
      publicTransport: ['MyCiTi Bus'],
      shuttle: false,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: true,
    tags: ['waterfront', 'tourism', 'luxury', 'entertainment']
  },
  {
    id: 'gateway-theatre-of-shopping',
    name: 'Gateway Theatre of Shopping',
    type: 'mall',
    description: 'Africa\'s largest shopping and entertainment center featuring over 400 stores, entertainment, and dining options.',
    shortDescription: 'Africa\'s largest shopping center',
    headerImage: 'https://images.unsplash.com/photo-1519201183976-8acc8d4c1c78?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1519201183976-8acc8d4c1c78?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: '1 Palm Boulevard, Umhlanga Ridge',
      city: 'Durban',
      province: 'KwaZulu-Natal',
      postalCode: '4319',
      coordinates: { latitude: -29.7303, longitude: 31.0828 }
    },
    contact: {
      phone: '+27 31 566 4200',
      website: 'https://www.gatewayworld.co.za'
    },
    openingHours: {
      monday: '09:00 - 21:00',
      tuesday: '09:00 - 21:00',
      wednesday: '09:00 - 21:00',
      thursday: '09:00 - 21:00',
      friday: '09:00 - 21:00',
      saturday: '09:00 - 21:00',
      sunday: '09:00 - 19:00'
    },
    features: ['Skate Park', 'Wave House', 'Entertainment Complex', 'Family Activities'],
    amenities: ['Cinema', 'Bowling', 'Arcade', 'Food Court'],
    services: ['Event Hosting', 'Birthday Parties'],
    rating: 4.5,
    reviewCount: 3800,
    levels: 3,
    totalArea: 200000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Fashion', 'Electronics', 'Entertainment', 'Food'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['East Wing', 'West Wing'],
      disabledParking: { available: true, spaces: 120, location: 'All levels' },
      audioNavigation: false,
      brailleSignage: true,
      hearingLoop: false,
      accessibleRestrooms: ['Level 1', 'Level 2', 'Level 3'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 4,
      capacity: 6500,
      pricing: { hourly: 6, daily: 40 },
      paymentMethods: ['Cash', 'Card'],
      electricVehicleCharging: true,
      disabledSpaces: 120
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Main Exit A', 'Main Exit B'],
      assemblyPoints: ['Parking Level P1'],
      emergencyContacts: { security: '+27 31 566 4201', medical: '+27 31 566 4202', fire: '10177' },
      defibrillatorLocations: ['Main Entrance', 'Food Court']
    },
    transportation: {
      publicTransport: ['Bus Routes'],
      shuttle: true,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: true,
    tags: ['entertainment', 'family', 'large', 'durban']
  },
  {
    id: 'canal-walk',
    name: 'Canal Walk Shopping Centre',
    type: 'mall',
    description: 'Premier shopping destination in Cape Town featuring local and international brands in a modern setting.',
    shortDescription: 'Cape Town\'s premier shopping center',
    headerImage: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Century Boulevard, Century City',
      city: 'Cape Town',
      province: 'Western Cape',
      postalCode: '7441',
      coordinates: { latitude: -33.8901, longitude: 18.5119 }
    },
    contact: {
      phone: '+27 21 555 4444',
      website: 'https://www.canalwalk.co.za'
    },
    openingHours: {
      monday: '09:00 - 21:00',
      tuesday: '09:00 - 21:00',
      wednesday: '09:00 - 21:00',
      thursday: '09:00 - 21:00',
      friday: '09:00 - 21:00',
      saturday: '09:00 - 21:00',
      sunday: '10:00 - 18:00'
    },
    features: ['Modern Architecture', 'Anchor Stores', 'Fashion Focus'],
    amenities: ['Cinema', 'Food Court', 'Banks'],
    services: ['Personal Shopping'],
    rating: 4.3,
    reviewCount: 2100,
    levels: 2,
    totalArea: 85000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Fashion', 'Beauty', 'Electronics'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Main Lifts'],
      disabledParking: { available: true, spaces: 60, location: 'Ground Level' },
      audioNavigation: false,
      brailleSignage: false,
      hearingLoop: false,
      accessibleRestrooms: ['Level 1'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 2,
      capacity: 2500,
      pricing: { hourly: 7, daily: 50 },
      paymentMethods: ['Cash', 'Card'],
      electricVehicleCharging: false,
      disabledSpaces: 60
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Main Exit'],
      assemblyPoints: ['Parking Area'],
      emergencyContacts: { security: '+27 21 555 4445', medical: '+27 21 555 4446', fire: '10177' },
      defibrillatorLocations: ['Main Entrance']
    },
    transportation: {
      publicTransport: ['MyCiTi Bus'],
      shuttle: false,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: false,
    tags: ['cape-town', 'modern', 'fashion']
  },
  {
    id: 'menlyn-park',
    name: 'Menlyn Park Shopping Centre',
    type: 'mall',
    description: 'Pretoria\'s premier shopping destination with over 300 stores and extensive entertainment options.',
    shortDescription: 'Pretoria\'s premier shopping destination',
    headerImage: 'https://images.unsplash.com/photo-1586880244406-556ebe35f282?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1586880244406-556ebe35f282?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Cnr Garstfontein & Atterbury Roads, Menlyn',
      city: 'Pretoria',
      province: 'Gauteng',
      postalCode: '0181',
      coordinates: { latitude: -25.7863, longitude: 28.2775 }
    },
    contact: {
      phone: '+27 12 348 5300',
      website: 'https://www.menlynpark.co.za'
    },
    openingHours: {
      monday: '09:00 - 21:00',
      tuesday: '09:00 - 21:00',
      wednesday: '09:00 - 21:00',
      thursday: '09:00 - 21:00',
      friday: '09:00 - 21:00',
      saturday: '09:00 - 21:00',
      sunday: '09:00 - 19:00'
    },
    features: ['Entertainment Complex', 'Fashion Hub', 'Dining Variety'],
    amenities: ['Cinema', 'Ice Rink', 'Food Court'],
    services: ['Events', 'Functions'],
    rating: 4.4,
    reviewCount: 2600,
    levels: 3,
    totalArea: 165000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Fashion', 'Electronics', 'Home', 'Entertainment'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['North Wing', 'South Wing'],
      disabledParking: { available: true, spaces: 100, location: 'All parking levels' },
      audioNavigation: false,
      brailleSignage: true,
      hearingLoop: false,
      accessibleRestrooms: ['All levels'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 5,
      capacity: 5000,
      pricing: { hourly: 5, daily: 45 },
      paymentMethods: ['Cash', 'Card'],
      electricVehicleCharging: true,
      disabledSpaces: 100
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['North Exit', 'South Exit'],
      assemblyPoints: ['North Parking', 'South Parking'],
      emergencyContacts: { security: '+27 12 348 5301', medical: '+27 12 348 5302', fire: '10177' },
      defibrillatorLocations: ['Main Entrance', 'Cinema Level']
    },
    transportation: {
      publicTransport: ['Bus Routes'],
      shuttle: false,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: false,
    tags: ['pretoria', 'entertainment', 'ice-rink']
  },
  {
    id: 'eastgate-shopping-centre',
    name: 'Eastgate Shopping Centre',
    type: 'mall',
    description: 'East Rand\'s largest shopping center featuring comprehensive retail, dining, and entertainment.',
    shortDescription: 'East Rand\'s largest shopping center',
    headerImage: 'https://images.unsplash.com/photo-1519201183976-8acc8d4c1c78?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1519201183976-8acc8d4c1c78?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: '43 Bradford Rd, Bedfordview',
      city: 'Johannesburg',
      province: 'Gauteng',
      postalCode: '2008',
      coordinates: { latitude: -26.1753, longitude: 28.1342 }
    },
    contact: {
      phone: '+27 11 456 7890',
      website: 'https://www.eastgate.co.za'
    },
    openingHours: {
      monday: '09:00 - 21:00',
      tuesday: '09:00 - 21:00',
      wednesday: '09:00 - 21:00',
      thursday: '09:00 - 21:00',
      friday: '09:00 - 21:00',
      saturday: '09:00 - 21:00',
      sunday: '09:00 - 18:00'
    },
    features: ['Family Entertainment', 'East Rand Hub', 'Community Center'],
    amenities: ['Cinema', 'Bowling', 'Food Court'],
    services: ['Community Events'],
    rating: 4.2,
    reviewCount: 1800,
    levels: 2,
    totalArea: 95000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Fashion', 'Home', 'Electronics'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Main Lifts'],
      disabledParking: { available: true, spaces: 70, location: 'Ground level' },
      audioNavigation: false,
      brailleSignage: false,
      hearingLoop: false,
      accessibleRestrooms: ['Level 1', 'Level 2'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 2,
      capacity: 3000,
      pricing: { hourly: 4, daily: 35 },
      paymentMethods: ['Cash', 'Card'],
      electricVehicleCharging: false,
      disabledSpaces: 70
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Main Exit'],
      assemblyPoints: ['Parking Area'],
      emergencyContacts: { security: '+27 11 456 7891', medical: '+27 11 456 7892', fire: '10177' },
      defibrillatorLocations: ['Main Entrance']
    },
    transportation: {
      publicTransport: ['Bus Routes'],
      shuttle: false,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: false,
    tags: ['east-rand', 'family', 'community']
  },
  {
    id: 'pavilion-shopping-centre',
    name: 'The Pavilion Shopping Centre',
    type: 'mall',
    description: 'KZN\'s leading lifestyle destination featuring premium shopping, dining, and entertainment.',
    shortDescription: 'KZN\'s leading lifestyle destination',
    headerImage: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Jack Martens Drive, Westville',
      city: 'Durban',
      province: 'KwaZulu-Natal',
      postalCode: '3629',
      coordinates: { latitude: -29.8209, longitude: 30.9272 }
    },
    contact: {
      phone: '+27 31 265 0300',
      website: 'https://www.pavilion.co.za'
    },
    openingHours: {
      monday: '09:00 - 21:00',
      tuesday: '09:00 - 21:00',
      wednesday: '09:00 - 21:00',
      thursday: '09:00 - 21:00',
      friday: '09:00 - 21:00',
      saturday: '09:00 - 21:00',
      sunday: '09:00 - 19:00'
    },
    features: ['Lifestyle Shopping', 'Premium Brands', 'Entertainment Hub'],
    amenities: ['Cinema', 'Food Court', 'Beauty Salon'],
    services: ['Personal Shopping', 'Event Hosting'],
    rating: 4.5,
    reviewCount: 2200,
    levels: 3,
    totalArea: 118000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Fashion', 'Beauty', 'Electronics', 'Home'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Main Tower'],
      disabledParking: { available: true, spaces: 85, location: 'Level P1' },
      audioNavigation: false,
      brailleSignage: true,
      hearingLoop: false,
      accessibleRestrooms: ['All levels'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 4,
      capacity: 4200,
      pricing: { hourly: 6, daily: 42 },
      paymentMethods: ['Cash', 'Card'],
      electricVehicleCharging: true,
      disabledSpaces: 85
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Main Exit', 'Emergency Exit A'],
      assemblyPoints: ['Central Plaza'],
      emergencyContacts: { security: '+27 31 265 0301', medical: '+27 31 265 0302', fire: '10177' },
      defibrillatorLocations: ['Main Entrance', 'Food Court']
    },
    transportation: {
      publicTransport: ['Bus Routes'],
      shuttle: true,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: false,
    tags: ['lifestyle', 'premium', 'westville']
  },
  {
    id: 'cavendish-square',
    name: 'Cavendish Square',
    type: 'mall',
    description: 'Cape Town\'s upmarket shopping destination in the heart of Claremont with luxury and lifestyle brands.',
    shortDescription: 'Cape Town\'s upmarket shopping destination',
    headerImage: 'https://images.unsplash.com/photo-1586880244406-556ebe35f282?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1586880244406-556ebe35f282?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Dreyer Street, Claremont',
      city: 'Cape Town',
      province: 'Western Cape',
      postalCode: '7708',
      coordinates: { latitude: -33.9813, longitude: 18.4668 }
    },
    contact: {
      phone: '+27 21 657 5620',
      website: 'https://www.cavendish.co.za'
    },
    openingHours: {
      monday: '09:00 - 21:00',
      tuesday: '09:00 - 21:00',
      wednesday: '09:00 - 21:00',
      thursday: '09:00 - 21:00',
      friday: '09:00 - 21:00',
      saturday: '09:00 - 19:00',
      sunday: '10:00 - 17:00'
    },
    features: ['Luxury Shopping', 'Upmarket Brands', 'Fine Dining'],
    amenities: ['Cinema', 'Fine Dining', 'Luxury Services'],
    services: ['Concierge', 'Valet'],
    rating: 4.6,
    reviewCount: 1500,
    levels: 3,
    totalArea: 72000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Luxury Fashion', 'Fine Dining', 'Beauty'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Main Lift'],
      disabledParking: { available: true, spaces: 40, location: 'Underground' },
      audioNavigation: false,
      brailleSignage: true,
      hearingLoop: false,
      accessibleRestrooms: ['Level 1', 'Level 2'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 3,
      capacity: 1800,
      pricing: { hourly: 8, daily: 55 },
      paymentMethods: ['Cash', 'Card'],
      electricVehicleCharging: false,
      disabledSpaces: 40
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Main Exit'],
      assemblyPoints: ['Dreyer Street'],
      emergencyContacts: { security: '+27 21 657 5621', medical: '+27 21 657 5622', fire: '10177' },
      defibrillatorLocations: ['Main Entrance']
    },
    transportation: {
      publicTransport: ['Train Station Adjacent'],
      shuttle: false,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: false,
    tags: ['luxury', 'upmarket', 'claremont']
  },
  {
    id: 'northgate-shopping-centre',
    name: 'Northgate Shopping Centre',
    type: 'mall',
    description: 'North of Johannesburg\'s premier shopping destination serving the northern suburbs.',
    shortDescription: 'Northern suburbs shopping destination',
    headerImage: 'https://images.unsplash.com/photo-1519201183976-8acc8d4c1c78?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1519201183976-8acc8d4c1c78?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Cnr New Market & 14th Avenue, Northriding',
      city: 'Johannesburg',
      province: 'Gauteng',
      postalCode: '2169',
      coordinates: { latitude: -26.0538, longitude: 27.9605 }
    },
    contact: {
      phone: '+27 11 794 4600',
      website: 'https://www.northgate.co.za'
    },
    openingHours: {
      monday: '09:00 - 21:00',
      tuesday: '09:00 - 21:00',
      wednesday: '09:00 - 21:00',
      thursday: '09:00 - 21:00',
      friday: '09:00 - 21:00',
      saturday: '09:00 - 21:00',
      sunday: '09:00 - 18:00'
    },
    features: ['Community Hub', 'Family Shopping', 'Northern Suburbs'],
    amenities: ['Cinema', 'Food Court', 'Banks'],
    services: ['Community Events'],
    rating: 4.1,
    reviewCount: 1600,
    levels: 2,
    totalArea: 78000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Fashion', 'Home', 'Food'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Main Lifts'],
      disabledParking: { available: true, spaces: 55, location: 'Ground level' },
      audioNavigation: false,
      brailleSignage: false,
      hearingLoop: false,
      accessibleRestrooms: ['Level 1'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 2,
      capacity: 2800,
      pricing: { hourly: 5, daily: 40 },
      paymentMethods: ['Cash', 'Card'],
      electricVehicleCharging: false,
      disabledSpaces: 55
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Main Exit'],
      assemblyPoints: ['Parking Area'],
      emergencyContacts: { security: '+27 11 794 4601', medical: '+27 11 794 4602', fire: '10177' },
      defibrillatorLocations: ['Main Entrance']
    },
    transportation: {
      publicTransport: ['Bus Routes'],
      shuttle: false,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: false,
    tags: ['northern-suburbs', 'community', 'family']
  },
  {
    id: 'clearwater-mall',
    name: 'Clearwater Mall',
    type: 'mall',
    description: 'West Rand\'s premier shopping and entertainment destination with comprehensive retail options.',
    shortDescription: 'West Rand\'s premier shopping destination',
    headerImage: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Cnr Christiaan de Wet & Hendrik Potgieter Roads, Strubensvalley',
      city: 'Roodepoort',
      province: 'Gauteng',
      postalCode: '1735',
      coordinates: { latitude: -26.1124, longitude: 27.8712 }
    },
    contact: {
      phone: '+27 11 675 5000',
      website: 'https://www.clearwatermall.co.za'
    },
    openingHours: {
      monday: '09:00 - 21:00',
      tuesday: '09:00 - 21:00',
      wednesday: '09:00 - 21:00',
      thursday: '09:00 - 21:00',
      friday: '09:00 - 21:00',
      saturday: '09:00 - 21:00',
      sunday: '09:00 - 18:00'
    },
    features: ['West Rand Hub', 'Entertainment Complex', 'Family Focus'],
    amenities: ['Cinema', 'Ice Rink', 'Food Court', 'Arcade'],
    services: ['Event Hosting', 'Ice Skating Lessons'],
    rating: 4.3,
    reviewCount: 2000,
    levels: 2,
    totalArea: 112000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Fashion', 'Entertainment', 'Electronics', 'Home'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['East Wing', 'West Wing'],
      disabledParking: { available: true, spaces: 75, location: 'All levels' },
      audioNavigation: false,
      brailleSignage: true,
      hearingLoop: false,
      accessibleRestrooms: ['Level 1', 'Level 2'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 3,
      capacity: 4500,
      pricing: { hourly: 5, daily: 38 },
      paymentMethods: ['Cash', 'Card'],
      electricVehicleCharging: true,
      disabledSpaces: 75
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['East Exit', 'West Exit'],
      assemblyPoints: ['East Parking', 'West Parking'],
      emergencyContacts: { security: '+27 11 675 5001', medical: '+27 11 675 5002', fire: '10177' },
      defibrillatorLocations: ['Main Entrance', 'Ice Rink']
    },
    transportation: {
      publicTransport: ['Bus Routes'],
      shuttle: false,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: false,
    tags: ['west-rand', 'ice-rink', 'entertainment']
  }
];

// Airports (10 venues)
export const airports: EnhancedVenue[] = [
  {
    id: 'or-tambo-international',
    name: 'O.R. Tambo International Airport',
    type: 'airport',
    description: 'Africa\'s busiest airport serving as the primary gateway to South Africa with world-class facilities.',
    shortDescription: 'Africa\'s busiest international airport',
    headerImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'O.R. Tambo Airport Rd, Kempton Park',
      city: 'Johannesburg',
      province: 'Gauteng',
      postalCode: '1627',
      coordinates: { latitude: -26.1367, longitude: 28.2411 }
    },
    contact: {
      phone: '+27 11 921 6262',
      website: 'https://www.airports.co.za'
    },
    openingHours: {
      monday: '24/7',
      tuesday: '24/7',
      wednesday: '24/7',
      thursday: '24/7',
      friday: '24/7',
      saturday: '24/7',
      sunday: '24/7'
    },
    features: ['International Hub', 'Duty Free', 'Lounges', 'Business Center'],
    amenities: ['Hotels', 'Conference Facilities', 'Medical Center', 'Chapels'],
    services: ['Baggage Services', 'Porter Services', 'Airport Shuttle'],
    rating: 4.2,
    reviewCount: 8500,
    levels: 3,
    totalArea: 750000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Duty Free', 'Restaurants', 'Travel Services'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Terminal A', 'Terminal B'],
      disabledParking: { available: true, spaces: 200, location: 'All parking areas' },
      audioNavigation: true,
      brailleSignage: true,
      hearingLoop: true,
      accessibleRestrooms: ['All terminals'],
      guideDogFriendly: true,
      tactilePathways: true
    },
    parking: {
      available: true,
      levels: 6,
      capacity: 15000,
      pricing: { hourly: 12, daily: 120 },
      paymentMethods: ['Cash', 'Card', 'Mobile'],
      electricVehicleCharging: true,
      disabledSpaces: 200
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Emergency Exits A-H'],
      assemblyPoints: ['Parking Areas'],
      emergencyContacts: { security: '+27 11 921 6000', medical: '+27 11 921 6100', fire: '10177' },
      defibrillatorLocations: ['All terminals']
    },
    transportation: {
      publicTransport: ['Gautrain', 'OR Tambo Express'],
      shuttle: true,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: true,
    tags: ['international', 'hub', 'business', 'gautrain']
  },
  {
    id: 'cape-town-international',
    name: 'Cape Town International Airport',
    type: 'airport',
    description: 'Cape Town\'s primary airport serving domestic and international flights with modern facilities.',
    shortDescription: 'Cape Town\'s primary airport',
    headerImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Matroosfontein, Cape Town',
      city: 'Cape Town',
      province: 'Western Cape',
      postalCode: '7490',
      coordinates: { latitude: -33.9645, longitude: 18.6017 }
    },
    contact: {
      phone: '+27 21 937 1200',
      website: 'https://www.airports.co.za'
    },
    openingHours: {
      monday: '24/7',
      tuesday: '24/7',
      wednesday: '24/7',
      thursday: '24/7',
      friday: '24/7',
      saturday: '24/7',
      sunday: '24/7'
    },
    features: ['Domestic & International', 'Mountain Views', 'Art Exhibitions'],
    amenities: ['Duty Free', 'Restaurants', 'Conference Rooms'],
    services: ['VIP Services', 'Meet & Greet'],
    rating: 4.1,
    reviewCount: 4200,
    levels: 2,
    totalArea: 285000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Duty Free', 'Food', 'Souvenirs'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Domestic Terminal', 'International Terminal'],
      disabledParking: { available: true, spaces: 80, location: 'All levels' },
      audioNavigation: false,
      brailleSignage: true,
      hearingLoop: false,
      accessibleRestrooms: ['Both terminals'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 4,
      capacity: 6500,
      pricing: { hourly: 10, daily: 85 },
      paymentMethods: ['Cash', 'Card'],
      electricVehicleCharging: false,
      disabledSpaces: 80
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Terminal Exits'],
      assemblyPoints: ['Parking Areas'],
      emergencyContacts: { security: '+27 21 937 1000', medical: '+27 21 937 1100', fire: '10177' },
      defibrillatorLocations: ['Both terminals']
    },
    transportation: {
      publicTransport: ['MyCiTi Bus'],
      shuttle: true,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: true,
    tags: ['cape-town', 'tourism', 'mountain-views']
  },
  {
    id: 'king-shaka-international',
    name: 'King Shaka International Airport',
    type: 'airport',
    description: 'Durban\'s modern international airport serving KwaZulu-Natal with excellent facilities.',
    shortDescription: 'Durban\'s modern international airport',
    headerImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'La Mercy, KwaZulu-Natal',
      city: 'Durban',
      province: 'KwaZulu-Natal',
      postalCode: '4399',
      coordinates: { latitude: -29.6144, longitude: 31.1197 }
    },
    contact: {
      phone: '+27 32 436 6000',
      website: 'https://www.kingshakainternational.co.za'
    },
    openingHours: {
      monday: '24/7',
      tuesday: '24/7',
      wednesday: '24/7',
      thursday: '24/7',
      friday: '24/7',
      saturday: '24/7',
      sunday: '24/7'
    },
    features: ['Modern Design', 'Eco-Friendly', 'Cultural Displays'],
    amenities: ['Duty Free', 'Restaurants', 'Art Gallery'],
    services: ['Premium Services', 'Business Lounge'],
    rating: 4.3,
    reviewCount: 2100,
    levels: 2,
    totalArea: 195000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Duty Free', 'Local Crafts', 'Food'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Main Terminal'],
      disabledParking: { available: true, spaces: 60, location: 'All areas' },
      audioNavigation: false,
      brailleSignage: true,
      hearingLoop: false,
      accessibleRestrooms: ['Terminal'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 3,
      capacity: 4000,
      pricing: { hourly: 8, daily: 70 },
      paymentMethods: ['Cash', 'Card'],
      electricVehicleCharging: true,
      disabledSpaces: 60
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Terminal Exits'],
      assemblyPoints: ['Outside Areas'],
      emergencyContacts: { security: '+27 32 436 6001', medical: '+27 32 436 6002', fire: '10177' },
      defibrillatorLocations: ['Terminal']
    },
    transportation: {
      publicTransport: ['Airport Shuttle'],
      shuttle: true,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: false,
    tags: ['modern', 'eco-friendly', 'durban']
  },
  {
    id: 'cape-town-international',
    name: 'Cape Town International Airport',
    type: 'airport',
    description: 'Cape Town\'s main airport connecting the Mother City to the world with excellent facilities and services.',
    shortDescription: 'Cape Town\'s international gateway',
    headerImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Matroosfontein, Cape Town',
      city: 'Cape Town',
      province: 'Western Cape',
      postalCode: '7490',
      coordinates: { latitude: -33.9690, longitude: 18.5970 }
    },
    contact: {
      phone: '+27 21 937 1200',
      website: 'https://www.airports.co.za/cape-town',
      email: 'info@cpt.airports.co.za'
    },
    openingHours: {
      monday: '24 hours',
      tuesday: '24 hours',
      wednesday: '24 hours',
      thursday: '24 hours',
      friday: '24 hours',
      saturday: '24 hours',
      sunday: '24 hours'
    },
    features: ['Terminal Navigation', 'Flight Information', 'Baggage Tracking', 'Digital Check-in'],
    amenities: ['Duty Free', 'Restaurants', 'Lounges', 'WiFi', 'Currency Exchange', 'Car Rental'],
    services: ['Lost & Found', 'Porter Services', 'Airport Transfers', 'VIP Services'],
    rating: 4.2,
    reviewCount: 1856,
    levels: 3,
    totalArea: 85000,
    zones: [
      {
        id: 'international-departures',
        name: 'International Departures',
        level: 2,
        description: 'International departure lounges and gates',
        color: '#4ECDC4',
        amenities: ['Duty Free', 'Lounges', 'Restaurants'],
        coordinates: { x: 150, y: 100, width: 400, height: 200 }
      }
    ],
    floorPlans: [
      {
        level: 1,
        name: 'Arrivals',
        mapImage: 'https://example.com/cpt-arrivals.jpg',
        zones: ['arrivals-hall', 'baggage-claim'],
        dimensions: { width: 600, height: 400 },
        scale: 0.8
      }
    ],
    entrances: [
      {
        name: 'Main Terminal Entrance',
        level: 1,
        description: 'Primary entrance to terminal building',
        coordinates: { latitude: -33.9690, longitude: 18.5970 },
        accessibility: true
      }
    ],
    stores: [],
    storeCategories: ['Duty Free', 'Food & Beverage', 'Retail'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['All levels'],
      disabledParking: { available: true, spaces: 50, location: 'Terminal' },
      audioNavigation: true,
      brailleSignage: true,
      hearingLoop: true,
      accessibleRestrooms: ['All floors'],
      guideDogFriendly: true,
      tactilePathways: true
    },
    parking: {
      available: true,
      levels: 6,
      capacity: 6000,
      pricing: { hourly: 20, daily: 120 },
      paymentMethods: ['Cash', 'Card', 'Mobile'],
      electricVehicleCharging: true,
      disabledSpaces: 50
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Emergency Exits'],
      assemblyPoints: ['Outside Terminal'],
      emergencyContacts: { security: '+27 21 937 1111', medical: '+27 21 937 1222', fire: '10177' },
      defibrillatorLocations: ['Terminal areas']
    },
    transportation: {
      publicTransport: ['MyCiTi Bus', 'Airport Shuttle'],
      shuttle: true,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: true,
    tags: ['cape-town', 'international', 'mother-city']
  },
  {
    id: 'port-elizabeth-airport',
    name: 'Chief Dawid Stuurman International Airport',
    type: 'airport',
    description: 'Eastern Cape\'s primary airport serving Gqeberha and the surrounding region.',
    shortDescription: 'Eastern Cape\'s primary airport',
    headerImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Allister Miller Drive, Walmer',
      city: 'Gqeberha',
      province: 'Eastern Cape',
      postalCode: '6070',
      coordinates: { latitude: -33.9850, longitude: 25.6173 }
    },
    contact: {
      phone: '+27 41 507 7319',
      website: 'https://www.airports.co.za'
    },
    openingHours: {
      monday: '05:00 - 22:00',
      tuesday: '05:00 - 22:00',
      wednesday: '05:00 - 22:00',
      thursday: '05:00 - 22:00',
      friday: '05:00 - 22:00',
      saturday: '05:00 - 22:00',
      sunday: '05:00 - 22:00'
    },
    features: ['Regional Hub', 'Compact Design', 'Efficient Processing'],
    amenities: ['Restaurant', 'Shop', 'Car Rental'],
    services: ['Meet & Greet', 'Lost Luggage'],
    rating: 3.9,
    reviewCount: 850,
    levels: 1,
    totalArea: 45000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Food', 'Travel', 'Souvenirs'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Not Required'],
      disabledParking: { available: true, spaces: 20, location: 'Terminal area' },
      audioNavigation: false,
      brailleSignage: false,
      hearingLoop: false,
      accessibleRestrooms: ['Terminal'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 1,
      capacity: 1200,
      pricing: { hourly: 6, daily: 50 },
      paymentMethods: ['Cash', 'Card'],
      electricVehicleCharging: false,
      disabledSpaces: 20
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Main Exit'],
      assemblyPoints: ['Parking Area'],
      emergencyContacts: { security: '+27 41 507 7320', medical: '+27 41 507 7321', fire: '10177' },
      defibrillatorLocations: ['Terminal']
    },
    transportation: {
      publicTransport: ['Limited'],
      shuttle: true,
      taxi: true,
      rideshare: false
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: false,
    tags: ['regional', 'eastern-cape', 'compact']
  },
  {
    id: 'bloemfontein-airport',
    name: 'Bram Fischer International Airport',
    type: 'airport',
    description: 'Central South Africa\'s primary airport serving Bloemfontein and the Free State region.',
    shortDescription: 'Free State\'s primary airport',
    headerImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Airport Road, Bloemfontein',
      city: 'Bloemfontein',
      province: 'Free State',
      postalCode: '9300',
      coordinates: { latitude: -29.0927, longitude: 26.3023 }
    },
    contact: {
      phone: '+27 51 408 3318',
      website: 'https://www.airports.co.za',
      email: 'info@bloemfontein.airports.co.za'
    },
    openingHours: {
      monday: '05:00 - 21:00',
      tuesday: '05:00 - 21:00',
      wednesday: '05:00 - 21:00',
      thursday: '05:00 - 21:00',
      friday: '05:00 - 21:00',
      saturday: '05:00 - 21:00',
      sunday: '05:00 - 21:00'
    },
    features: ['Regional Hub', 'Modern Facilities', 'Efficient Processing'],
    amenities: ['Restaurant', 'Shop', 'Car Rental', 'ATM'],
    services: ['VIP Lounge', 'Lost & Found', 'Airport Transfers'],
    rating: 4.0,
    reviewCount: 645,
    levels: 2,
    totalArea: 38000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Food', 'Travel', 'Gifts'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Main Terminal'],
      disabledParking: { available: true, spaces: 15, location: 'Terminal' },
      audioNavigation: false,
      brailleSignage: true,
      hearingLoop: false,
      accessibleRestrooms: ['Ground Floor'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 1,
      capacity: 800,
      pricing: { hourly: 8, daily: 45 },
      paymentMethods: ['Cash', 'Card'],
      electricVehicleCharging: false,
      disabledSpaces: 15
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Main Exits'],
      assemblyPoints: ['Parking Area'],
      emergencyContacts: { security: '+27 51 408 3300', medical: '+27 51 408 3301', fire: '10177' },
      defibrillatorLocations: ['Terminal']
    },
    transportation: {
      publicTransport: ['Limited'],
      shuttle: true,
      taxi: true,
      rideshare: false
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: false,
    tags: ['free-state', 'regional', 'central']
  },
  {
    id: 'kimberley-airport',
    name: 'Kimberley Airport',
    type: 'airport',
    description: 'Northern Cape airport serving the diamond city of Kimberley.',
    shortDescription: 'Northern Cape regional airport',
    headerImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Airport Road, Kimberley',
      city: 'Kimberley',
      province: 'Northern Cape',
      postalCode: '8301',
      coordinates: { latitude: -28.8033, longitude: 24.7653 }
    },
    contact: {
      phone: '+27 53 838 3337',
      website: 'https://www.airports.co.za'
    },
    openingHours: {
      monday: '06:00 - 18:00',
      tuesday: '06:00 - 18:00',
      wednesday: '06:00 - 18:00',
      thursday: '06:00 - 18:00',
      friday: '06:00 - 18:00',
      saturday: '06:00 - 18:00',
      sunday: '06:00 - 18:00'
    },
    features: ['Small Regional Hub', 'Historic Significance'],
    amenities: ['Basic Services', 'Car Rental'],
    services: ['Flight Information', 'Basic Services'],
    rating: 3.5,
    reviewCount: 320,
    levels: 1,
    totalArea: 25000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Basic Retail'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Not Required'],
      disabledParking: { available: true, spaces: 8, location: 'Terminal' },
      audioNavigation: false,
      brailleSignage: false,
      hearingLoop: false,
      accessibleRestrooms: ['Terminal'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 1,
      capacity: 400,
      pricing: { hourly: 5, daily: 30 },
      paymentMethods: ['Cash', 'Card'],
      electricVehicleCharging: false,
      disabledSpaces: 8
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Main Exit'],
      assemblyPoints: ['Parking Area'],
      emergencyContacts: { security: '+27 53 838 3330', medical: '+27 53 838 3331', fire: '10177' },
      defibrillatorLocations: ['Terminal']
    },
    transportation: {
      publicTransport: ['Limited'],
      shuttle: false,
      taxi: true,
      rideshare: false
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: false,
    tags: ['diamond-city', 'northern-cape', 'small']
  },
  {
    id: 'polokwane-airport',
    name: 'Polokwane International Airport',
    type: 'airport',
    description: 'Limpopo\'s main airport serving Polokwane and surrounding areas.',
    shortDescription: 'Limpopo\'s main airport',
    headerImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'R521, Polokwane',
      city: 'Polokwane',
      province: 'Limpopo',
      postalCode: '0699',
      coordinates: { latitude: -23.8453, longitude: 29.4585 }
    },
    contact: {
      phone: '+27 15 288 0031',
      website: 'https://www.airports.co.za'
    },
    openingHours: {
      monday: '05:30 - 20:00',
      tuesday: '05:30 - 20:00',
      wednesday: '05:30 - 20:00',
      thursday: '05:30 - 20:00',
      friday: '05:30 - 20:00',
      saturday: '05:30 - 20:00',
      sunday: '05:30 - 20:00'
    },
    features: ['Growing Hub', 'Modern Facilities'],
    amenities: ['Restaurant', 'Shop', 'Car Rental'],
    services: ['VIP Services', 'Meet & Greet'],
    rating: 3.8,
    reviewCount: 540,
    levels: 2,
    totalArea: 42000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Food', 'Travel', 'Souvenirs'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Main Terminal'],
      disabledParking: { available: true, spaces: 12, location: 'Terminal' },
      audioNavigation: false,
      brailleSignage: true,
      hearingLoop: false,
      accessibleRestrooms: ['Both Floors'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 1,
      capacity: 600,
      pricing: { hourly: 7, daily: 40 },
      paymentMethods: ['Cash', 'Card'],
      electricVehicleCharging: false,
      disabledSpaces: 12
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Emergency Exits'],
      assemblyPoints: ['Parking Area'],
      emergencyContacts: { security: '+27 15 288 0030', medical: '+27 15 288 0032', fire: '10177' },
      defibrillatorLocations: ['Terminal']
    },
    transportation: {
      publicTransport: ['Limited'],
      shuttle: true,
      taxi: true,
      rideshare: false
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: false,
    tags: ['limpopo', 'growing', 'gateway']
  },
  {
    id: 'nelspruit-airport',
    name: 'Kruger Mpumalanga International Airport',
    type: 'airport',
    description: 'Gateway to the Kruger National Park and Mpumalanga province.',
    shortDescription: 'Gateway to Kruger National Park',
    headerImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'R40, Nelspruit',
      city: 'Mbombela',
      province: 'Mpumalanga',
      postalCode: '1200',
      coordinates: { latitude: -25.3832, longitude: 31.1056 }
    },
    contact: {
      phone: '+27 13 753 7500',
      website: 'https://www.kmia.co.za'
    },
    openingHours: {
      monday: '05:00 - 21:00',
      tuesday: '05:00 - 21:00',
      wednesday: '05:00 - 21:00',
      thursday: '05:00 - 21:00',
      friday: '05:00 - 21:00',
      saturday: '05:00 - 21:00',
      sunday: '05:00 - 21:00'
    },
    features: ['Tourism Hub', 'Safari Gateway', 'International Connections'],
    amenities: ['Restaurant', 'Duty Free', 'Car Rental', 'Conference Facilities'],
    services: ['VIP Lounge', 'Tourism Information', 'Safari Bookings'],
    rating: 4.1,
    reviewCount: 890,
    levels: 2,
    totalArea: 55000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Duty Free', 'Safari Gear', 'Food'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Main Terminal'],
      disabledParking: { available: true, spaces: 25, location: 'Terminal' },
      audioNavigation: false,
      brailleSignage: true,
      hearingLoop: true,
      accessibleRestrooms: ['Both Floors'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 2,
      capacity: 1500,
      pricing: { hourly: 10, daily: 55 },
      paymentMethods: ['Cash', 'Card'],
      electricVehicleCharging: true,
      disabledSpaces: 25
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Emergency Exits'],
      assemblyPoints: ['Parking Areas'],
      emergencyContacts: { security: '+27 13 753 7501', medical: '+27 13 753 7502', fire: '10177' },
      defibrillatorLocations: ['Terminal areas']
    },
    transportation: {
      publicTransport: ['Safari Shuttles'],
      shuttle: true,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: true,
    tags: ['kruger-park', 'safari', 'tourism']
  },
  {
    id: 'george-airport',
    name: 'George Airport',
    type: 'airport',
    description: 'Southern Cape airport serving the Garden Route region.',
    shortDescription: 'Garden Route gateway airport',
    headerImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Airport Road, George',
      city: 'George',
      province: 'Western Cape',
      postalCode: '6529',
      coordinates: { latitude: -34.0056, longitude: 22.3789 }
    },
    contact: {
      phone: '+27 44 876 9310',
      website: 'https://www.airports.co.za'
    },
    openingHours: {
      monday: '05:30 - 20:30',
      tuesday: '05:30 - 20:30',
      wednesday: '05:30 - 20:30',
      thursday: '05:30 - 20:30',
      friday: '05:30 - 20:30',
      saturday: '05:30 - 20:30',
      sunday: '05:30 - 20:30'
    },
    features: ['Garden Route Access', 'Tourism Hub', 'Scenic Location'],
    amenities: ['Restaurant', 'Shop', 'Car Rental'],
    services: ['Tourism Information', 'Meet & Greet'],
    rating: 4.0,
    reviewCount: 720,
    levels: 1,
    totalArea: 35000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Tourism', 'Food', 'Gifts'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Not Required'],
      disabledParking: { available: true, spaces: 18, location: 'Terminal' },
      audioNavigation: false,
      brailleSignage: true,
      hearingLoop: false,
      accessibleRestrooms: ['Terminal'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 1,
      capacity: 900,
      pricing: { hourly: 8, daily: 50 },
      paymentMethods: ['Cash', 'Card'],
      electricVehicleCharging: false,
      disabledSpaces: 18
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Main Exits'],
      assemblyPoints: ['Parking Area'],
      emergencyContacts: { security: '+27 44 876 9311', medical: '+27 44 876 9312', fire: '10177' },
      defibrillatorLocations: ['Terminal']
    },
    transportation: {
      publicTransport: ['Limited'],
      shuttle: true,
      taxi: true,
      rideshare: false
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: false,
    tags: ['garden-route', 'tourism', 'scenic']
  },
  {
    id: 'upington-airport',
    name: 'Upington Airport',
    type: 'airport',
    description: 'Northern Cape airport serving the Kalahari region.',
    shortDescription: 'Kalahari region airport',
    headerImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Airport Road, Upington',
      city: 'Upington',
      province: 'Northern Cape',
      postalCode: '8800',
      coordinates: { latitude: -28.3991, longitude: 21.2603 }
    },
    contact: {
      phone: '+27 54 337 7900',
      website: 'https://www.airports.co.za'
    },
    openingHours: {
      monday: '06:00 - 18:00',
      tuesday: '06:00 - 18:00',
      wednesday: '06:00 - 18:00',
      thursday: '06:00 - 18:00',
      friday: '06:00 - 18:00',
      saturday: '06:00 - 18:00',
      sunday: '06:00 - 18:00'
    },
    features: ['Desert Gateway', 'Regional Hub'],
    amenities: ['Basic Services', 'Car Rental'],
    services: ['Flight Information', 'Basic Services'],
    rating: 3.6,
    reviewCount: 280,
    levels: 1,
    totalArea: 22000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Basic Retail'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Not Required'],
      disabledParking: { available: true, spaces: 6, location: 'Terminal' },
      audioNavigation: false,
      brailleSignage: false,
      hearingLoop: false,
      accessibleRestrooms: ['Terminal'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 1,
      capacity: 300,
      pricing: { hourly: 4, daily: 25 },
      paymentMethods: ['Cash', 'Card'],
      electricVehicleCharging: false,
      disabledSpaces: 6
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Main Exit'],
      assemblyPoints: ['Parking Area'],
      emergencyContacts: { security: '+27 54 337 7901', medical: '+27 54 337 7902', fire: '10177' },
      defibrillatorLocations: ['Terminal']
    },
    transportation: {
      publicTransport: ['Very Limited'],
      shuttle: false,
      taxi: true,
      rideshare: false
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: false,
    tags: ['kalahari', 'desert', 'remote']
  }
];

// Hospitals (10 venues)
export const hospitals: EnhancedVenue[] = [
  {
    id: 'charlotte-maxeke-hospital',
    name: 'Charlotte Maxeke Johannesburg Academic Hospital',
    type: 'hospital',
    description: 'Major academic hospital providing comprehensive healthcare services and medical training.',
    shortDescription: 'Major academic hospital in Johannesburg',
    headerImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Jubilee Rd, Parktown',
      city: 'Johannesburg',
      province: 'Gauteng',
      postalCode: '2193',
      coordinates: { latitude: -26.1845, longitude: 28.0312 }
    },
    contact: {
      phone: '+27 11 488 4911',
      website: 'https://www.gauteng.gov.za'
    },
    openingHours: {
      monday: '24/7',
      tuesday: '24/7',
      wednesday: '24/7',
      thursday: '24/7',
      friday: '24/7',
      saturday: '24/7',
      sunday: '24/7'
    },
    features: ['Emergency Services', 'Specialist Care', 'Teaching Hospital', 'Trauma Center'],
    amenities: ['Pharmacy', 'Cafeteria', 'Chapel', 'Parking'],
    services: ['Emergency Care', 'Surgery', 'ICU', 'Outpatient Clinics'],
    rating: 3.8,
    reviewCount: 1200,
    levels: 8,
    totalArea: 185000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Medical', 'Pharmacy', 'Food'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Main Bank A', 'Main Bank B', 'Service Lifts'],
      disabledParking: { available: true, spaces: 100, location: 'All levels' },
      audioNavigation: true,
      brailleSignage: true,
      hearingLoop: true,
      accessibleRestrooms: ['All floors'],
      guideDogFriendly: true,
      tactilePathways: true
    },
    parking: {
      available: true,
      levels: 4,
      capacity: 2500,
      pricing: { hourly: 8, daily: 60 },
      paymentMethods: ['Cash', 'Card'],
      electricVehicleCharging: false,
      disabledSpaces: 100
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Multiple Emergency Exits'],
      assemblyPoints: ['Parking Areas', 'Main Entrance'],
      emergencyContacts: { security: '+27 11 488 4900', medical: '+27 11 488 4911', fire: '10177' },
      defibrillatorLocations: ['All floors']
    },
    transportation: {
      publicTransport: ['Bus Routes'],
      shuttle: true,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: true,
    tags: ['academic', 'trauma', 'emergency', 'teaching']
  },
  {
    id: 'groote-schuur-hospital',
    name: 'Groote Schuur Hospital',
    type: 'hospital',
    description: 'Historic hospital famous for the first human heart transplant, providing world-class medical care.',
    shortDescription: 'Historic hospital, first heart transplant site',
    headerImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Main Rd, Observatory',
      city: 'Cape Town',
      province: 'Western Cape',
      postalCode: '7925',
      coordinates: { latitude: -33.9354, longitude: 18.4711 }
    },
    contact: {
      phone: '+27 21 404 9111',
      website: 'https://www.westerncape.gov.za'
    },
    openingHours: {
      monday: '24/7',
      tuesday: '24/7',
      wednesday: '24/7',
      thursday: '24/7',
      friday: '24/7',
      saturday: '24/7',
      sunday: '24/7'
    },
    features: ['Heart Surgery', 'Transplant Center', 'Historic Significance', 'Research'],
    amenities: ['Medical Museum', 'Cafeteria', 'Gift Shop'],
    services: ['Cardiothoracic Surgery', 'Neurosurgery', 'Oncology'],
    rating: 4.2,
    reviewCount: 950,
    levels: 12,
    totalArea: 220000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Medical', 'Research', 'Education'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Multiple Lift Banks'],
      disabledParking: { available: true, spaces: 80, location: 'Designated areas' },
      audioNavigation: false,
      brailleSignage: true,
      hearingLoop: false,
      accessibleRestrooms: ['All floors'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 3,
      capacity: 1800,
      pricing: { hourly: 10, daily: 70 },
      paymentMethods: ['Cash', 'Card'],
      electricVehicleCharging: false,
      disabledSpaces: 80
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Multiple Emergency Exits'],
      assemblyPoints: ['Main Entrance Area'],
      emergencyContacts: { security: '+27 21 404 9000', medical: '+27 21 404 9111', fire: '10177' },
      defibrillatorLocations: ['All critical areas']
    },
    transportation: {
      publicTransport: ['Train Station Nearby'],
      shuttle: false,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: true,
    tags: ['historic', 'heart-transplant', 'research', 'world-class']
  },
  {
    id: 'inkosi-albert-luthuli-hospital',
    name: 'Inkosi Albert Luthuli Central Hospital',
    type: 'hospital',
    description: 'Largest hospital in the Southern Hemisphere, providing specialized tertiary healthcare.',
    shortDescription: 'Largest hospital in Southern Hemisphere',
    headerImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: '800 Bellair Rd, Cato Manor',
      city: 'Durban',
      province: 'KwaZulu-Natal',
      postalCode: '4091',
      coordinates: { latitude: -29.8293, longitude: 30.9874 }
    },
    contact: {
      phone: '+27 31 240 1111',
      website: 'https://www.kznhealth.gov.za'
    },
    openingHours: {
      monday: '24/7',
      tuesday: '24/7',
      wednesday: '24/7',
      thursday: '24/7',
      friday: '24/7',
      saturday: '24/7',
      sunday: '24/7'
    },
    features: ['Tertiary Care', 'Specialist Services', 'Modern Facilities', 'Research Center'],
    amenities: ['Food Court', 'Bank', 'Pharmacy', 'Accommodation'],
    services: ['All Medical Specialties', 'Emergency Services', 'ICU'],
    rating: 4.0,
    reviewCount: 1800,
    levels: 15,
    totalArea: 400000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Medical', 'Pharmacy', 'Food', 'Banking'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Multiple Lift Banks'],
      disabledParking: { available: true, spaces: 200, location: 'All parking areas' },
      audioNavigation: true,
      brailleSignage: true,
      hearingLoop: true,
      accessibleRestrooms: ['All floors'],
      guideDogFriendly: true,
      tactilePathways: true
    },
    parking: {
      available: true,
      levels: 6,
      capacity: 5000,
      pricing: { hourly: 6, daily: 45 },
      paymentMethods: ['Cash', 'Card'],
      electricVehicleCharging: true,
      disabledSpaces: 200
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Multiple Emergency Exits'],
      assemblyPoints: ['Parking Areas'],
      emergencyContacts: { security: '+27 31 240 1000', medical: '+27 31 240 1111', fire: '10177' },
      defibrillatorLocations: ['All floors']
    },
    transportation: {
      publicTransport: ['Bus Routes'],
      shuttle: true,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: true,
    tags: ['largest', 'tertiary', 'specialist', 'modern']
  },
  {
    id: 'groote-schuur-hospital',
    name: 'Groote Schuur Hospital',
    type: 'hospital',
    description: 'Famous academic hospital where the first heart transplant was performed, continuing as a leading medical institution.',
    shortDescription: 'Historic academic hospital in Cape Town',
    headerImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Main Road, Observatory',
      city: 'Cape Town',
      province: 'Western Cape',
      postalCode: '7925',
      coordinates: { latitude: -33.9391, longitude: 18.4702 }
    },
    contact: {
      phone: '+27 21 404 9111',
      website: 'https://www.westerncape.gov.za',
      email: 'info@gsh.westerncape.gov.za'
    },
    openingHours: {
      monday: '24/7',
      tuesday: '24/7',
      wednesday: '24/7',
      thursday: '24/7',
      friday: '24/7',
      saturday: '24/7',
      sunday: '24/7'
    },
    features: ['Heart Surgery Pioneer', 'Academic Excellence', 'Trauma Center', 'Transplant Unit'],
    amenities: ['Pharmacy', 'Cafeteria', 'Chapel', 'Family Rooms'],
    services: ['Heart Surgery', 'Emergency Care', 'Specialist Clinics', 'Medical Training'],
    rating: 4.1,
    reviewCount: 1650,
    levels: 12,
    totalArea: 195000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Medical', 'Pharmacy', 'Food'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Main Banks', 'Service Lifts'],
      disabledParking: { available: true, spaces: 80, location: 'Multiple areas' },
      audioNavigation: true,
      brailleSignage: true,
      hearingLoop: true,
      accessibleRestrooms: ['All floors'],
      guideDogFriendly: true,
      tactilePathways: true
    },
    parking: {
      available: true,
      levels: 3,
      capacity: 2200,
      pricing: { hourly: 10, daily: 65 },
      paymentMethods: ['Cash', 'Card'],
      electricVehicleCharging: true,
      disabledSpaces: 80
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Multiple Emergency Exits'],
      assemblyPoints: ['Main Parking', 'Garden Areas'],
      emergencyContacts: { security: '+27 21 404 9000', medical: '+27 21 404 9111', fire: '10177' },
      defibrillatorLocations: ['All major areas']
    },
    transportation: {
      publicTransport: ['Bus Routes', 'Train Station Nearby'],
      shuttle: true,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: true,
    tags: ['historic', 'heart-transplant', 'academic', 'cape-town']
  },
  {
    id: 'addington-hospital',
    name: 'Addington Hospital',
    type: 'hospital',
    description: 'Major public hospital in Durban providing comprehensive healthcare services to KwaZulu-Natal.',
    shortDescription: 'Major public hospital in Durban',
    headerImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Erskine Terrace, South Beach',
      city: 'Durban',
      province: 'KwaZulu-Natal',
      postalCode: '4001',
      coordinates: { latitude: -29.8699, longitude: 31.0175 }
    },
    contact: {
      phone: '+27 31 327 2000',
      website: 'https://www.kznhealth.gov.za'
    },
    openingHours: {
      monday: '24/7',
      tuesday: '24/7',
      wednesday: '24/7',
      thursday: '24/7',
      friday: '24/7',
      saturday: '24/7',
      sunday: '24/7'
    },
    features: ['Coastal Location', 'Emergency Services', 'Public Healthcare', 'Regional Hub'],
    amenities: ['Pharmacy', 'Cafeteria', 'Prayer Room', 'Visitor Areas'],
    services: ['Emergency Care', 'General Surgery', 'Outpatient Services', 'Maternity'],
    rating: 3.6,
    reviewCount: 980,
    levels: 8,
    totalArea: 145000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Medical', 'Pharmacy', 'Food'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Main Lifts', 'Service Lifts'],
      disabledParking: { available: true, spaces: 60, location: 'Main entrance' },
      audioNavigation: false,
      brailleSignage: true,
      hearingLoop: false,
      accessibleRestrooms: ['All floors'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 2,
      capacity: 1500,
      pricing: { hourly: 6, daily: 40 },
      paymentMethods: ['Cash', 'Card'],
      electricVehicleCharging: false,
      disabledSpaces: 60
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Emergency Exits'],
      assemblyPoints: ['Parking Areas'],
      emergencyContacts: { security: '+27 31 327 2001', medical: '+27 31 327 2000', fire: '10177' },
      defibrillatorLocations: ['Key locations']
    },
    transportation: {
      publicTransport: ['Bus Routes'],
      shuttle: false,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: false,
    tags: ['public', 'durban', 'coastal', 'regional']
  },
  {
    id: 'red-cross-childrens-hospital',
    name: 'Red Cross War Memorial Children\'s Hospital',
    type: 'hospital',
    description: 'Africa\'s premier children\'s hospital providing specialized pediatric care and treatment.',
    shortDescription: 'Premier children\'s hospital in Africa',
    headerImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Klipfontein Road, Rondebosch',
      city: 'Cape Town',
      province: 'Western Cape',
      postalCode: '7700',
      coordinates: { latitude: -33.9626, longitude: 18.4724 }
    },
    contact: {
      phone: '+27 21 658 5111',
      website: 'https://www.redcrosshospital.org.za'
    },
    openingHours: {
      monday: '24/7',
      tuesday: '24/7',
      wednesday: '24/7',
      thursday: '24/7',
      friday: '24/7',
      saturday: '24/7',
      sunday: '24/7'
    },
    features: ['Pediatric Specialist', 'Child-Friendly Design', 'Advanced Equipment', 'Family Support'],
    amenities: ['Play Areas', 'Family Accommodation', 'Cafeteria', 'Chapel'],
    services: ['Pediatric Surgery', 'Emergency Care', 'Specialized Clinics', 'Family Support'],
    rating: 4.3,
    reviewCount: 1250,
    levels: 6,
    totalArea: 125000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Medical', 'Children', 'Food'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Child-Friendly Lifts'],
      disabledParking: { available: true, spaces: 45, location: 'Main entrance' },
      audioNavigation: true,
      brailleSignage: true,
      hearingLoop: true,
      accessibleRestrooms: ['All floors'],
      guideDogFriendly: true,
      tactilePathways: true
    },
    parking: {
      available: true,
      levels: 3,
      capacity: 1200,
      pricing: { hourly: 8, daily: 50 },
      paymentMethods: ['Cash', 'Card'],
      electricVehicleCharging: true,
      disabledSpaces: 45
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Family-Safe Exits'],
      assemblyPoints: ['Safe Areas'],
      emergencyContacts: { security: '+27 21 658 5000', medical: '+27 21 658 5111', fire: '10177' },
      defibrillatorLocations: ['All areas']
    },
    transportation: {
      publicTransport: ['Bus Routes'],
      shuttle: true,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: true,
    tags: ['children', 'pediatric', 'specialist', 'family']
  },
  {
    id: 'tygerberg-hospital',
    name: 'Tygerberg Hospital',
    type: 'hospital',
    description: 'Major academic hospital and medical training center serving the greater Cape Town area.',
    shortDescription: 'Major academic hospital in Cape Town',
    headerImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Francie van Zijl Drive, Parow',
      city: 'Cape Town',
      province: 'Western Cape',
      postalCode: '7505',
      coordinates: { latitude: -33.8819, longitude: 18.6324 }
    },
    contact: {
      phone: '+27 21 938 9111',
      website: 'https://www.sun.ac.za'
    },
    openingHours: {
      monday: '24/7',
      tuesday: '24/7',
      wednesday: '24/7',
      thursday: '24/7',
      friday: '24/7',
      saturday: '24/7',
      sunday: '24/7'
    },
    features: ['Academic Excellence', 'Research Center', 'Specialist Care', 'Teaching Hospital'],
    amenities: ['Medical Library', 'Cafeteria', 'Lecture Halls', 'Research Labs'],
    services: ['Medical Training', 'Research', 'Specialist Clinics', 'Emergency Care'],
    rating: 4.0,
    reviewCount: 1420,
    levels: 10,
    totalArea: 225000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Medical', 'Academic', 'Food'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Academic Lifts', 'Patient Lifts'],
      disabledParking: { available: true, spaces: 95, location: 'Multiple areas' },
      audioNavigation: true,
      brailleSignage: true,
      hearingLoop: true,
      accessibleRestrooms: ['All floors'],
      guideDogFriendly: true,
      tactilePathways: true
    },
    parking: {
      available: true,
      levels: 4,
      capacity: 3000,
      pricing: { hourly: 9, daily: 55 },
      paymentMethods: ['Cash', 'Card'],
      electricVehicleCharging: true,
      disabledSpaces: 95
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Academic Safe Routes'],
      assemblyPoints: ['University Areas'],
      emergencyContacts: { security: '+27 21 938 9000', medical: '+27 21 938 9111', fire: '10177' },
      defibrillatorLocations: ['All major areas']
    },
    transportation: {
      publicTransport: ['University Shuttle', 'Bus Routes'],
      shuttle: true,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: true,
    tags: ['academic', 'research', 'university', 'stellenbosch']
  },
  {
    id: 'inkosi-albert-luthuli-hospital',
    name: 'Inkosi Albert Luthuli Central Hospital',
    type: 'hospital',
    description: 'Largest hospital in the Southern Hemisphere, providing tertiary and quaternary healthcare services.',
    shortDescription: 'Largest hospital in Southern Hemisphere',
    headerImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: '800 Bellair Road, Cato Manor',
      city: 'Durban',
      province: 'KwaZulu-Natal',
      postalCode: '4091',
      coordinates: { latitude: -29.8463, longitude: 30.9782 }
    },
    contact: {
      phone: '+27 31 240 1111',
      website: 'https://www.kznhealth.gov.za'
    },
    openingHours: {
      monday: '24/7',
      tuesday: '24/7',
      wednesday: '24/7',
      thursday: '24/7',
      friday: '24/7',
      saturday: '24/7',
      sunday: '24/7'
    },
    features: ['Largest in Africa', 'Advanced Technology', 'Specialist Centers', 'Research Hub'],
    amenities: ['Multiple Cafeterias', 'Chapel', 'Conference Centers', 'Accommodation'],
    services: ['Quaternary Care', 'Transplants', 'Cardiology', 'Oncology'],
    rating: 4.2,
    reviewCount: 2850,
    levels: 15,
    totalArea: 350000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Medical', 'Specialist', 'Food'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Multiple Banks', 'Service Lifts'],
      disabledParking: { available: true, spaces: 200, location: 'All areas' },
      audioNavigation: true,
      brailleSignage: true,
      hearingLoop: true,
      accessibleRestrooms: ['All floors'],
      guideDogFriendly: true,
      tactilePathways: true
    },
    parking: {
      available: true,
      levels: 6,
      capacity: 5000,
      pricing: { hourly: 8, daily: 60 },
      paymentMethods: ['Cash', 'Card', 'Mobile'],
      electricVehicleCharging: true,
      disabledSpaces: 200
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Multiple Emergency Routes'],
      assemblyPoints: ['Multiple Safe Areas'],
      emergencyContacts: { security: '+27 31 240 1000', medical: '+27 31 240 1111', fire: '10177' },
      defibrillatorLocations: ['Comprehensive coverage']
    },
    transportation: {
      publicTransport: ['Bus Routes', 'Taxi Ranks'],
      shuttle: true,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: true,
    tags: ['largest', 'tertiary', 'specialist', 'modern']
  },
  {
    id: 'steve-biko-hospital',
    name: 'Steve Biko Academic Hospital',
    type: 'hospital',
    description: 'Leading academic hospital in Pretoria providing comprehensive medical services and training.',
    shortDescription: 'Leading academic hospital in Pretoria',
    headerImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Cnr Steve Biko & Malherbe Streets',
      city: 'Pretoria',
      province: 'Gauteng',
      postalCode: '0001',
      coordinates: { latitude: -25.7479, longitude: 28.2293 }
    },
    contact: {
      phone: '+27 12 354 1000',
      website: 'https://www.gauteng.gov.za'
    },
    openingHours: {
      monday: '24/7',
      tuesday: '24/7',
      wednesday: '24/7',
      thursday: '24/7',
      friday: '24/7',
      saturday: '24/7',
      sunday: '24/7'
    },
    features: ['Academic Excellence', 'Emergency Care', 'Specialist Services'],
    amenities: ['Teaching Facilities', 'Library', 'Cafeteria'],
    services: ['Emergency Care', 'Surgery', 'Medical Training'],
    rating: 3.9,
    reviewCount: 800,
    levels: 10,
    totalArea: 160000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Medical', 'Education'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Main Lifts'],
      disabledParking: { available: true, spaces: 60, location: 'Multiple areas' },
      audioNavigation: false,
      brailleSignage: true,
      hearingLoop: false,
      accessibleRestrooms: ['All floors'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 3,
      capacity: 1500,
      pricing: { hourly: 7, daily: 50 },
      paymentMethods: ['Cash', 'Card'],
      electricVehicleCharging: false,
      disabledSpaces: 60
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Emergency Exits'],
      assemblyPoints: ['Parking Areas'],
      emergencyContacts: { security: '+27 12 354 1001', medical: '+27 12 354 1000', fire: '10177' },
      defibrillatorLocations: ['Key locations']
    },
    transportation: {
      publicTransport: ['Bus Routes'],
      shuttle: false,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: false,
    tags: ['academic', 'pretoria', 'teaching']
  },
  {
    id: 'helen-joseph-hospital',
    name: 'Helen Joseph Hospital',
    type: 'hospital',
    description: 'Public hospital in Johannesburg providing essential healthcare services to the community.',
    shortDescription: 'Public hospital in Johannesburg',
    headerImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Perth Road, Westdene',
      city: 'Johannesburg',
      province: 'Gauteng',
      postalCode: '2092',
      coordinates: { latitude: -26.1617, longitude: 27.9989 }
    },
    contact: {
      phone: '+27 11 276 8888',
      website: 'https://www.gauteng.gov.za'
    },
    openingHours: {
      monday: '24/7',
      tuesday: '24/7',
      wednesday: '24/7',
      thursday: '24/7',
      friday: '24/7',
      saturday: '24/7',
      sunday: '24/7'
    },
    features: ['Community Healthcare', 'Emergency Services', 'Public Hospital', 'Essential Services'],
    amenities: ['Pharmacy', 'Cafeteria', 'Parking', 'Waiting Areas'],
    services: ['Emergency Care', 'General Medicine', 'Surgery', 'Maternity'],
    rating: 3.4,
    reviewCount: 780,
    levels: 6,
    totalArea: 125000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Medical', 'Pharmacy', 'Food'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Main Lifts'],
      disabledParking: { available: true, spaces: 40, location: 'Main entrance' },
      audioNavigation: false,
      brailleSignage: true,
      hearingLoop: false,
      accessibleRestrooms: ['All floors'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 2,
      capacity: 1000,
      pricing: { hourly: 5, daily: 35 },
      paymentMethods: ['Cash', 'Card'],
      electricVehicleCharging: false,
      disabledSpaces: 40
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Emergency Exits'],
      assemblyPoints: ['Parking Areas'],
      emergencyContacts: { security: '+27 11 276 8800', medical: '+27 11 276 8888', fire: '10177' },
      defibrillatorLocations: ['Key locations']
    },
    transportation: {
      publicTransport: ['Bus Routes'],
      shuttle: false,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: false,
    tags: ['public', 'community', 'johannesburg', 'essential']
  },
  {
    id: 'victoria-hospital',
    name: 'Victoria Hospital',
    type: 'hospital',
    description: 'Historic hospital in Cape Town providing healthcare services with modern facilities.',
    shortDescription: 'Historic hospital in Cape Town',
    headerImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Wynberg Main Road, Wynberg',
      city: 'Cape Town',
      province: 'Western Cape',
      postalCode: '7800',
      coordinates: { latitude: -34.0154, longitude: 18.4615 }
    },
    contact: {
      phone: '+27 21 797 5000',
      website: 'https://www.westerncape.gov.za'
    },
    openingHours: {
      monday: '24/7',
      tuesday: '24/7',
      wednesday: '24/7',
      thursday: '24/7',
      friday: '24/7',
      saturday: '24/7',
      sunday: '24/7'
    },
    features: ['Historic Building', 'Modern Equipment', 'Community Focus', 'General Healthcare'],
    amenities: ['Pharmacy', 'Cafeteria', 'Chapel', 'Gardens'],
    services: ['General Medicine', 'Emergency Care', 'Outpatient Services', 'Surgery'],
    rating: 3.7,
    reviewCount: 650,
    levels: 4,
    totalArea: 95000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Medical', 'Pharmacy', 'Food'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Historic Lifts'],
      disabledParking: { available: true, spaces: 30, location: 'Main entrance' },
      audioNavigation: false,
      brailleSignage: true,
      hearingLoop: false,
      accessibleRestrooms: ['All floors'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 1,
      capacity: 800,
      pricing: { hourly: 6, daily: 40 },
      paymentMethods: ['Cash', 'Card'],
      electricVehicleCharging: false,
      disabledSpaces: 30
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Historic Safe Routes'],
      assemblyPoints: ['Garden Areas'],
      emergencyContacts: { security: '+27 21 797 5001', medical: '+27 21 797 5000', fire: '10177' },
      defibrillatorLocations: ['Key locations']
    },
    transportation: {
      publicTransport: ['Train Station Nearby', 'Bus Routes'],
      shuttle: false,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: false,
    tags: ['historic', 'community', 'wynberg', 'general']
  }
];

// Universities (10 venues)
export const universities: EnhancedVenue[] = [
  {
    id: 'university-of-witwatersrand',
    name: 'University of the Witwatersrand',
    type: 'university',
    description: 'Premier research university known for excellence in mining, engineering, and medical sciences.',
    shortDescription: 'Premier research university in Johannesburg',
    headerImage: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: '1 Jan Smuts Avenue, Braamfontein',
      city: 'Johannesburg',
      province: 'Gauteng',
      postalCode: '2000',
      coordinates: { latitude: -26.1929, longitude: 28.0305 }
    },
    contact: {
      phone: '+27 11 717 1000',
      website: 'https://www.wits.ac.za'
    },
    openingHours: {
      monday: '06:00 - 22:00',
      tuesday: '06:00 - 22:00',
      wednesday: '06:00 - 22:00',
      thursday: '06:00 - 22:00',
      friday: '06:00 - 22:00',
      saturday: '08:00 - 18:00',
      sunday: '08:00 - 18:00'
    },
    features: ['Research Excellence', 'Historic Campus', 'World Rankings', 'Innovation Hub'],
    amenities: ['Libraries', 'Sports Facilities', 'Student Centers', 'Dining Halls'],
    services: ['Student Services', 'Research Support', 'Career Guidance'],
    rating: 4.4,
    reviewCount: 2500,
    levels: 5,
    totalArea: 1200000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Education', 'Research', 'Student Services'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Multiple Buildings'],
      disabledParking: { available: true, spaces: 150, location: 'Campus wide' },
      audioNavigation: false,
      brailleSignage: true,
      hearingLoop: false,
      accessibleRestrooms: ['All buildings'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 2,
      capacity: 4000,
      pricing: { hourly: 5, daily: 30 },
      paymentMethods: ['Cash', 'Card', 'Student Card'],
      electricVehicleCharging: true,
      disabledSpaces: 150
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Multiple Campus Exits'],
      assemblyPoints: ['Central Plaza', 'Sports Fields'],
      emergencyContacts: { security: '+27 11 717 1001', medical: '+27 11 717 1002', fire: '10177' },
      defibrillatorLocations: ['Key buildings']
    },
    transportation: {
      publicTransport: ['Bus Routes', 'Rea Vaya'],
      shuttle: true,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: true,
    tags: ['research', 'prestigious', 'mining', 'medicine']
  },
  {
    id: 'university-of-cape-town',
    name: 'University of Cape Town',
    type: 'university',
    description: 'Top-ranked African university with stunning mountain campus and world-class academics.',
    shortDescription: 'Top-ranked African university',
    headerImage: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Private Bag X3, Rondebosch',
      city: 'Cape Town',
      province: 'Western Cape',
      postalCode: '7701',
      coordinates: { latitude: -33.9577, longitude: 18.4612 }
    },
    contact: {
      phone: '+27 21 650 9111',
      website: 'https://www.uct.ac.za'
    },
    openingHours: {
      monday: '06:00 - 22:00',
      tuesday: '06:00 - 22:00',
      wednesday: '06:00 - 22:00',
      thursday: '06:00 - 22:00',
      friday: '06:00 - 22:00',
      saturday: '08:00 - 18:00',
      sunday: '08:00 - 18:00'
    },
    features: ['Mountain Views', 'Global Rankings', 'Research Excellence'],
    amenities: ['Historic Buildings', 'Mountain Access', 'Libraries'],
    services: ['International Programs', 'Research Centers'],
    rating: 4.6,
    reviewCount: 3200,
    levels: 4,
    totalArea: 1500000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Education', 'Research'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Campus Buildings'],
      disabledParking: { available: true, spaces: 100, location: 'Multiple areas' },
      audioNavigation: false,
      brailleSignage: true,
      hearingLoop: false,
      accessibleRestrooms: ['All buildings'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 3,
      capacity: 3500,
      pricing: { hourly: 6, daily: 35 },
      paymentMethods: ['Cash', 'Card'],
      electricVehicleCharging: false,
      disabledSpaces: 100
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Campus Exits'],
      assemblyPoints: ['Jameson Plaza'],
      emergencyContacts: { security: '+27 21 650 2222', medical: '+27 21 650 1111', fire: '10177' },
      defibrillatorLocations: ['Main buildings']
    },
    transportation: {
      publicTransport: ['Train', 'Bus'],
      shuttle: true,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: true,
    tags: ['top-ranked', 'mountain', 'global', 'prestigious']
  },
  {
    id: 'university-of-pretoria',
    name: 'University of Pretoria',
    type: 'university',
    description: 'Leading research university in South Africa with comprehensive academic programs and modern facilities.',
    shortDescription: 'Leading research university in Pretoria',
    headerImage: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Lynwood Road, Hatfield',
      city: 'Pretoria',
      province: 'Gauteng',
      postalCode: '0002',
      coordinates: { latitude: -25.7545, longitude: 28.2314 }
    },
    contact: {
      phone: '+27 12 420 3111',
      website: 'https://www.up.ac.za',
      email: 'info@up.ac.za'
    },
    openingHours: {
      monday: '06:00 - 22:00',
      tuesday: '06:00 - 22:00',
      wednesday: '06:00 - 22:00',
      thursday: '06:00 - 22:00',
      friday: '06:00 - 22:00',
      saturday: '08:00 - 18:00',
      sunday: '08:00 - 18:00'
    },
    features: ['Research Excellence', 'Modern Facilities', 'Technology Hub', 'Veterinary School'],
    amenities: ['Libraries', 'Sports Facilities', 'Student Centers', 'Residences'],
    services: ['Academic Programs', 'Research Centers', 'Student Services', 'Career Center'],
    rating: 4.4,
    reviewCount: 2850,
    levels: 5,
    totalArea: 1200000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Education', 'Research', 'Sports'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['All Buildings'],
      disabledParking: { available: true, spaces: 120, location: 'Campus areas' },
      audioNavigation: false,
      brailleSignage: true,
      hearingLoop: false,
      accessibleRestrooms: ['All buildings'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 3,
      capacity: 8000,
      pricing: { hourly: 5, daily: 25 },
      paymentMethods: ['Card', 'Mobile'],
      electricVehicleCharging: true,
      disabledSpaces: 120
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Campus Routes'],
      assemblyPoints: ['Sports Fields'],
      emergencyContacts: { security: '+27 12 420 3000', medical: '+27 12 420 3001', fire: '10177' },
      defibrillatorLocations: ['Major buildings']
    },
    transportation: {
      publicTransport: ['Bus Routes', 'Gautrain'],
      shuttle: true,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: true,
    tags: ['research', 'technology', 'pretoria', 'comprehensive']
  },
  {
    id: 'stellenbosch-university',
    name: 'Stellenbosch University',
    type: 'university',
    description: 'Historic Afrikaans university known for wine research, beautiful campus, and academic excellence.',
    shortDescription: 'Historic university in wine country',
    headerImage: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Private Bag X1, Matieland',
      city: 'Stellenbosch',
      province: 'Western Cape',
      postalCode: '7602',
      coordinates: { latitude: -33.9321, longitude: 18.8602 }
    },
    contact: {
      phone: '+27 21 808 9111',
      website: 'https://www.sun.ac.za'
    },
    openingHours: {
      monday: '06:00 - 22:00',
      tuesday: '06:00 - 22:00',
      wednesday: '06:00 - 22:00',
      thursday: '06:00 - 22:00',
      friday: '06:00 - 22:00',
      saturday: '08:00 - 18:00',
      sunday: '08:00 - 18:00'
    },
    features: ['Wine Research', 'Historic Architecture', 'Beautiful Campus', 'Agricultural Sciences'],
    amenities: ['Historic Buildings', 'Wine Facilities', 'Sports Centers', 'Libraries'],
    services: ['Agricultural Research', 'Wine Studies', 'Student Services'],
    rating: 4.5,
    reviewCount: 2400,
    levels: 4,
    totalArea: 900000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Education', 'Agricultural', 'Wine'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Major Buildings'],
      disabledParking: { available: true, spaces: 80, location: 'Campus areas' },
      audioNavigation: false,
      brailleSignage: true,
      hearingLoop: false,
      accessibleRestrooms: ['All buildings'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 2,
      capacity: 5000,
      pricing: { hourly: 4, daily: 20 },
      paymentMethods: ['Card', 'Cash'],
      electricVehicleCharging: false,
      disabledSpaces: 80
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Campus Routes'],
      assemblyPoints: ['Open Areas'],
      emergencyContacts: { security: '+27 21 808 9000', medical: '+27 21 808 9001', fire: '10177' },
      defibrillatorLocations: ['Key buildings']
    },
    transportation: {
      publicTransport: ['Limited'],
      shuttle: true,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: true,
    tags: ['historic', 'wine', 'agricultural', 'beautiful']
  },
  {
    id: 'university-of-kwazulu-natal',
    name: 'University of KwaZulu-Natal',
    type: 'university',
    description: 'Multi-campus university known for research excellence and diverse academic programs.',
    shortDescription: 'Leading university in KwaZulu-Natal',
    headerImage: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Private Bag X54001',
      city: 'Durban',
      province: 'KwaZulu-Natal',
      postalCode: '4000',
      coordinates: { latitude: -29.8174, longitude: 31.0405 }
    },
    contact: {
      phone: '+27 31 260 1111',
      website: 'https://www.ukzn.ac.za'
    },
    openingHours: {
      monday: '06:00 - 22:00',
      tuesday: '06:00 - 22:00',
      wednesday: '06:00 - 22:00',
      thursday: '06:00 - 22:00',
      friday: '06:00 - 22:00',
      saturday: '08:00 - 18:00',
      sunday: '08:00 - 18:00'
    },
    features: ['Multi-Campus', 'Research Excellence', 'Diverse Programs', 'Coastal Location'],
    amenities: ['Multiple Campuses', 'Sports Facilities', 'Libraries', 'Student Centers'],
    services: ['Research Programs', 'Student Services', 'Career Guidance'],
    rating: 4.2,
    reviewCount: 2100,
    levels: 6,
    totalArea: 1800000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Education', 'Research', 'Sports'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['All Campuses'],
      disabledParking: { available: true, spaces: 150, location: 'All campuses' },
      audioNavigation: false,
      brailleSignage: true,
      hearingLoop: false,
      accessibleRestrooms: ['All buildings'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 4,
      capacity: 12000,
      pricing: { hourly: 6, daily: 30 },
      paymentMethods: ['Card', 'Mobile'],
      electricVehicleCharging: true,
      disabledSpaces: 150
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Campus Routes'],
      assemblyPoints: ['Sports Fields'],
      emergencyContacts: { security: '+27 31 260 1000', medical: '+27 31 260 1001', fire: '10177' },
      defibrillatorLocations: ['Major buildings']
    },
    transportation: {
      publicTransport: ['Bus Routes'],
      shuttle: true,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: true,
    tags: ['multi-campus', 'coastal', 'research', 'diverse']
  },
  {
    id: 'north-west-university',
    name: 'North-West University',
    type: 'university',
    description: 'Multi-campus university with strong research focus and comprehensive academic programs.',
    shortDescription: 'Leading university in North West Province',
    headerImage: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Private Bag X6001',
      city: 'Potchefstroom',
      province: 'North West',
      postalCode: '2520',
      coordinates: { latitude: -26.6943, longitude: 27.0917 }
    },
    contact: {
      phone: '+27 18 299 1111',
      website: 'https://www.nwu.ac.za'
    },
    openingHours: {
      monday: '06:00 - 22:00',
      tuesday: '06:00 - 22:00',
      wednesday: '06:00 - 22:00',
      thursday: '06:00 - 22:00',
      friday: '06:00 - 22:00',
      saturday: '08:00 - 18:00',
      sunday: '08:00 - 18:00'
    },
    features: ['Multi-Campus Structure', 'Research Focus', 'Technology Integration', 'Community Engagement'],
    amenities: ['Modern Facilities', 'Sports Centers', 'Libraries', 'Student Villages'],
    services: ['Research Programs', 'Student Support', 'Career Services'],
    rating: 4.1,
    reviewCount: 1800,
    levels: 4,
    totalArea: 1100000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Education', 'Research', 'Technology'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['All Buildings'],
      disabledParking: { available: true, spaces: 90, location: 'Campus areas' },
      audioNavigation: false,
      brailleSignage: true,
      hearingLoop: false,
      accessibleRestrooms: ['All buildings'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 2,
      capacity: 6000,
      pricing: { hourly: 4, daily: 20 },
      paymentMethods: ['Card', 'Cash'],
      electricVehicleCharging: false,
      disabledSpaces: 90
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Campus Routes'],
      assemblyPoints: ['Open Spaces'],
      emergencyContacts: { security: '+27 18 299 1000', medical: '+27 18 299 1001', fire: '10177' },
      defibrillatorLocations: ['Key buildings']
    },
    transportation: {
      publicTransport: ['Limited'],
      shuttle: true,
      taxi: true,
      rideshare: false
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: false,
    tags: ['multi-campus', 'research', 'technology', 'community']
  },
  {
    id: 'rhodes-university',
    name: 'Rhodes University',
    type: 'university',
    description: 'Small prestigious university known for academic excellence and beautiful historic campus.',
    shortDescription: 'Prestigious university in Grahamstown',
    headerImage: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'PO Box 94',
      city: 'Makhanda',
      province: 'Eastern Cape',
      postalCode: '6140',
      coordinates: { latitude: -33.3158, longitude: 26.5309 }
    },
    contact: {
      phone: '+27 46 603 8111',
      website: 'https://www.ru.ac.za'
    },
    openingHours: {
      monday: '06:00 - 22:00',
      tuesday: '06:00 - 22:00',
      wednesday: '06:00 - 22:00',
      thursday: '06:00 - 22:00',
      friday: '06:00 - 22:00',
      saturday: '08:00 - 18:00',
      sunday: '08:00 - 18:00'
    },
    features: ['Small Size', 'Academic Excellence', 'Historic Campus', 'Close Community'],
    amenities: ['Historic Buildings', 'Botanical Gardens', 'Sports Facilities', 'Libraries'],
    services: ['Personalized Education', 'Research Programs', 'Student Support'],
    rating: 4.6,
    reviewCount: 1400,
    levels: 3,
    totalArea: 500000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Education', 'Historic', 'Community'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Selected Buildings'],
      disabledParking: { available: true, spaces: 40, location: 'Campus areas' },
      audioNavigation: false,
      brailleSignage: true,
      hearingLoop: false,
      accessibleRestrooms: ['Major buildings'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 1,
      capacity: 2000,
      pricing: { hourly: 3, daily: 15 },
      paymentMethods: ['Card', 'Cash'],
      electricVehicleCharging: false,
      disabledSpaces: 40
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Campus Routes'],
      assemblyPoints: ['Gardens'],
      emergencyContacts: { security: '+27 46 603 8000', medical: '+27 46 603 8001', fire: '10177' },
      defibrillatorLocations: ['Key buildings']
    },
    transportation: {
      publicTransport: ['Limited'],
      shuttle: false,
      taxi: true,
      rideshare: false
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: true,
    tags: ['prestigious', 'small', 'historic', 'excellence']
  },
  {
    id: 'university-of-free-state',
    name: 'University of the Free State',
    type: 'university',
    description: 'Comprehensive university serving the heart of South Africa with diverse academic programs.',
    shortDescription: 'Comprehensive university in Bloemfontein',
    headerImage: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'PO Box 339',
      city: 'Bloemfontein',
      province: 'Free State',
      postalCode: '9300',
      coordinates: { latitude: -29.1081, longitude: 26.1849 }
    },
    contact: {
      phone: '+27 51 401 9111',
      website: 'https://www.ufs.ac.za'
    },
    openingHours: {
      monday: '06:00 - 22:00',
      tuesday: '06:00 - 22:00',
      wednesday: '06:00 - 22:00',
      thursday: '06:00 - 22:00',
      friday: '06:00 - 22:00',
      saturday: '08:00 - 18:00',
      sunday: '08:00 - 18:00'
    },
    features: ['Central Location', 'Comprehensive Programs', 'Research Focus', 'Modern Facilities'],
    amenities: ['Modern Buildings', 'Sports Complexes', 'Libraries', 'Student Centers'],
    services: ['Academic Programs', 'Research Centers', 'Student Services'],
    rating: 4.2,
    reviewCount: 1950,
    levels: 4,
    totalArea: 800000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Education', 'Research', 'Sports'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['All Buildings'],
      disabledParking: { available: true, spaces: 70, location: 'Campus areas' },
      audioNavigation: false,
      brailleSignage: true,
      hearingLoop: false,
      accessibleRestrooms: ['All buildings'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 2,
      capacity: 4500,
      pricing: { hourly: 4, daily: 20 },
      paymentMethods: ['Card', 'Cash'],
      electricVehicleCharging: false,
      disabledSpaces: 70
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Campus Routes'],
      assemblyPoints: ['Sports Fields'],
      emergencyContacts: { security: '+27 51 401 9000', medical: '+27 51 401 9001', fire: '10177' },
      defibrillatorLocations: ['Major buildings']
    },
    transportation: {
      publicTransport: ['Bus Routes'],
      shuttle: true,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: false,
    tags: ['central', 'comprehensive', 'modern', 'accessible']
  },
  {
    id: 'walter-sisulu-university',
    name: 'Walter Sisulu University',
    type: 'university',
    description: 'Multi-campus university serving the Eastern Cape with focus on community development.',
    shortDescription: 'Multi-campus university in Eastern Cape',
    headerImage: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Private Bag X1',
      city: 'Mthatha',
      province: 'Eastern Cape',
      postalCode: '5117',
      coordinates: { latitude: -31.5912, longitude: 28.7847 }
    },
    contact: {
      phone: '+27 47 502 2111',
      website: 'https://www.wsu.ac.za'
    },
    openingHours: {
      monday: '06:00 - 22:00',
      tuesday: '06:00 - 22:00',
      wednesday: '06:00 - 22:00',
      thursday: '06:00 - 22:00',
      friday: '06:00 - 22:00',
      saturday: '08:00 - 18:00',
      sunday: '08:00 - 18:00'
    },
    features: ['Community Focus', 'Multi-Campus', 'Development Programs', 'Rural Outreach'],
    amenities: ['Community Centers', 'Basic Facilities', 'Libraries', 'Student Support'],
    services: ['Community Development', 'Educational Programs', 'Rural Services'],
    rating: 3.8,
    reviewCount: 1200,
    levels: 3,
    totalArea: 600000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Education', 'Community', 'Development'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Selected Buildings'],
      disabledParking: { available: true, spaces: 50, location: 'Campus areas' },
      audioNavigation: false,
      brailleSignage: false,
      hearingLoop: false,
      accessibleRestrooms: ['Major buildings'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 1,
      capacity: 3000,
      pricing: { hourly: 3, daily: 15 },
      paymentMethods: ['Cash', 'Card'],
      electricVehicleCharging: false,
      disabledSpaces: 50
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Campus Routes'],
      assemblyPoints: ['Open Areas'],
      emergencyContacts: { security: '+27 47 502 2000', medical: '+27 47 502 2001', fire: '10177' },
      defibrillatorLocations: ['Key buildings']
    },
    transportation: {
      publicTransport: ['Limited'],
      shuttle: true,
      taxi: true,
      rideshare: false
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: false,
    tags: ['community', 'rural', 'development', 'multi-campus']
  },
  {
    id: 'university-of-limpopo',
    name: 'University of Limpopo',
    type: 'university',
    description: 'Northern university with focus on agriculture, health sciences, and community development.',
    shortDescription: 'Northern university with agricultural focus',
    headerImage: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Private Bag X1106',
      city: 'Sovenga',
      province: 'Limpopo',
      postalCode: '0727',
      coordinates: { latitude: -23.8883, longitude: 29.7394 }
    },
    contact: {
      phone: '+27 15 268 3111',
      website: 'https://www.ul.ac.za'
    },
    openingHours: {
      monday: '06:00 - 22:00',
      tuesday: '06:00 - 22:00',
      wednesday: '06:00 - 22:00',
      thursday: '06:00 - 22:00',
      friday: '06:00 - 22:00',
      saturday: '08:00 - 18:00',
      sunday: '08:00 - 18:00'
    },
    features: ['Agricultural Focus', 'Health Sciences', 'Community Development', 'Rural Programs'],
    amenities: ['Agricultural Facilities', 'Health Centers', 'Libraries', 'Research Labs'],
    services: ['Agricultural Programs', 'Health Services', 'Community Outreach'],
    rating: 3.9,
    reviewCount: 1100,
    levels: 3,
    totalArea: 700000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Education', 'Agricultural', 'Health'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Selected Buildings'],
      disabledParking: { available: true, spaces: 45, location: 'Campus areas' },
      audioNavigation: false,
      brailleSignage: false,
      hearingLoop: false,
      accessibleRestrooms: ['Major buildings'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 1,
      capacity: 2500,
      pricing: { hourly: 3, daily: 15 },
      paymentMethods: ['Cash', 'Card'],
      electricVehicleCharging: false,
      disabledSpaces: 45
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Campus Routes'],
      assemblyPoints: ['Agricultural Areas'],
      emergencyContacts: { security: '+27 15 268 3000', medical: '+27 15 268 3001', fire: '10177' },
      defibrillatorLocations: ['Key buildings']
    },
    transportation: {
      publicTransport: ['Limited'],
      shuttle: true,
      taxi: true,
      rideshare: false
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: false,
    tags: ['agricultural', 'health', 'rural', 'community']
  }
];

// Stadiums (10 venues)
export const stadiums: EnhancedVenue[] = [
  {
    id: 'fnb-stadium',
    name: 'FNB Stadium (Soccer City)',
    type: 'stadium',
    description: 'Africa\'s largest stadium, host of the 2010 FIFA World Cup Final and major events.',
    shortDescription: 'Africa\'s largest stadium',
    headerImage: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Nasrec Rd, Nasrec',
      city: 'Johannesburg',
      province: 'Gauteng',
      postalCode: '2147',
      coordinates: { latitude: -26.2349, longitude: 27.9822 }
    },
    contact: {
      phone: '+27 11 247 5000',
      website: 'https://www.stadiummanagement.co.za'
    },
    openingHours: {
      monday: 'Event Days Only',
      tuesday: 'Event Days Only',
      wednesday: 'Event Days Only',
      thursday: 'Event Days Only',
      friday: 'Event Days Only',
      saturday: 'Event Days Only',
      sunday: 'Event Days Only'
    },
    features: ['FIFA World Cup Venue', 'Largest Capacity', 'Premium Hospitality'],
    amenities: ['VIP Boxes', 'Restaurants', 'Retail Stores'],
    services: ['Event Hosting', 'Corporate Functions'],
    rating: 4.5,
    reviewCount: 4500,
    levels: 6,
    totalArea: 250000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Sports', 'Food', 'Merchandise'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Multiple Levels'],
      disabledParking: { available: true, spaces: 300, location: 'Designated areas' },
      audioNavigation: true,
      brailleSignage: true,
      hearingLoop: true,
      accessibleRestrooms: ['All levels'],
      guideDogFriendly: true,
      tactilePathways: true
    },
    parking: {
      available: true,
      levels: 3,
      capacity: 15000,
      pricing: { hourly: 10, daily: 80 },
      paymentMethods: ['Cash', 'Card'],
      electricVehicleCharging: false,
      disabledSpaces: 300
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Multiple Stadium Exits'],
      assemblyPoints: ['Parking Areas'],
      emergencyContacts: { security: '+27 11 247 5001', medical: '+27 11 247 5002', fire: '10177' },
      defibrillatorLocations: ['All levels']
    },
    transportation: {
      publicTransport: ['BRT', 'Taxi Routes'],
      shuttle: true,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: true,
    tags: ['world-cup', 'largest', 'soccer', 'iconic']
  },
  {
    id: 'cape-town-stadium',
    name: 'Cape Town Stadium',
    type: 'stadium',
    description: 'Stunning stadium with Table Mountain backdrop, host of major sporting and entertainment events.',
    shortDescription: 'Stadium with Table Mountain views',
    headerImage: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Fritz Sonnenberg Rd, Green Point',
      city: 'Cape Town',
      province: 'Western Cape',
      postalCode: '8001',
      coordinates: { latitude: -33.9033, longitude: 18.4118 }
    },
    contact: {
      phone: '+27 21 417 0400',
      website: 'https://www.capetownstadium.co.za'
    },
    openingHours: {
      monday: 'Event Days Only',
      tuesday: 'Event Days Only',
      wednesday: 'Event Days Only',
      thursday: 'Event Days Only',
      friday: 'Event Days Only',
      saturday: 'Event Days Only',
      sunday: 'Event Days Only'
    },
    features: ['Table Mountain Views', 'Modern Design', 'Multi-purpose'],
    amenities: ['Premium Suites', 'Restaurants', 'Retail'],
    services: ['Event Management', 'Catering'],
    rating: 4.7,
    reviewCount: 2800,
    levels: 5,
    totalArea: 180000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Sports', 'Hospitality'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['All Sectors'],
      disabledParking: { available: true, spaces: 200, location: 'Multiple areas' },
      audioNavigation: false,
      brailleSignage: true,
      hearingLoop: false,
      accessibleRestrooms: ['All levels'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 2,
      capacity: 8000,
      pricing: { hourly: 12, daily: 90 },
      paymentMethods: ['Cash', 'Card'],
      electricVehicleCharging: true,
      disabledSpaces: 200
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Stadium Exits'],
      assemblyPoints: ['Green Point Common'],
      emergencyContacts: { security: '+27 21 417 0401', medical: '+27 21 417 0402', fire: '10177' },
      defibrillatorLocations: ['Key locations']
    },
    transportation: {
      publicTransport: ['MyCiTi Bus'],
      shuttle: true,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: true,
    tags: ['scenic', 'modern', 'cape-town', 'multi-purpose']
  },
  {
    id: 'ellis-park-stadium',
    name: 'Ellis Park Stadium',
    type: 'stadium',
    description: 'Historic rugby and football stadium in Johannesburg, home to major sporting events.',
    shortDescription: 'Historic stadium in Johannesburg',
    headerImage: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Doornfontein, Johannesburg',
      city: 'Johannesburg',
      province: 'Gauteng',
      postalCode: '2094',
      coordinates: { latitude: -26.1952, longitude: 28.0591 }
    },
    contact: {
      phone: '+27 11 402 8644',
      website: 'https://www.ellispark.co.za'
    },
    openingHours: {
      monday: 'Event Days Only',
      tuesday: 'Event Days Only',
      wednesday: 'Event Days Only',
      thursday: 'Event Days Only',
      friday: 'Event Days Only',
      saturday: 'Event Days Only',
      sunday: 'Event Days Only'
    },
    features: ['Historic Stadium', 'Rugby Home', 'City Location', 'Traditional Atmosphere'],
    amenities: ['Hospitality Suites', 'Restaurants', 'Bars', 'Gift Shop'],
    services: ['Event Hosting', 'Corporate Facilities', 'Catering'],
    rating: 4.3,
    reviewCount: 2200,
    levels: 4,
    totalArea: 85000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Sports', 'Food', 'Merchandise'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Main Stands'],
      disabledParking: { available: true, spaces: 80, location: 'Stadium perimeter' },
      audioNavigation: false,
      brailleSignage: false,
      hearingLoop: false,
      accessibleRestrooms: ['All levels'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 1,
      capacity: 3000,
      pricing: { hourly: 0, daily: 50 },
      paymentMethods: ['Cash', 'Card'],
      electricVehicleCharging: false,
      disabledSpaces: 80
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Multiple Stadium Exits'],
      assemblyPoints: ['Parking Areas'],
      emergencyContacts: { security: '+27 11 402 8600', medical: '+27 11 402 8601', fire: '10177' },
      defibrillatorLocations: ['Stadium areas']
    },
    transportation: {
      publicTransport: ['Bus Routes'],
      shuttle: true,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: true,
    tags: ['historic', 'rugby', 'traditional', 'johannesburg']
  },
  {
    id: 'moses-mabhida-stadium',
    name: 'Moses Mabhida Stadium',
    type: 'stadium',
    description: 'Iconic stadium in Durban with distinctive arch design, built for 2010 FIFA World Cup.',
    shortDescription: 'Iconic stadium with distinctive arch',
    headerImage: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: '44 Isaiah Ntshangase Road',
      city: 'Durban',
      province: 'KwaZulu-Natal',
      postalCode: '4001',
      coordinates: { latitude: -29.8292, longitude: 31.0302 }
    },
    contact: {
      phone: '+27 31 582 8222',
      website: 'https://www.mosesmabhidastadium.com'
    },
    openingHours: {
      monday: '09:00 - 17:00',
      tuesday: '09:00 - 17:00',
      wednesday: '09:00 - 17:00',
      thursday: '09:00 - 17:00',
      friday: '09:00 - 17:00',
      saturday: '09:00 - 17:00',
      sunday: '09:00 - 17:00'
    },
    features: ['Iconic Arch', 'Adventure Sports', 'Sky Car', 'World Cup Venue'],
    amenities: ['Adventure Activities', 'Restaurants', 'Conference Center', 'Sky Car'],
    services: ['Stadium Tours', 'Adventure Sports', 'Event Hosting', 'Sky Car Rides'],
    rating: 4.5,
    reviewCount: 3100,
    levels: 5,
    totalArea: 120000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Sports', 'Adventure', 'Food', 'Souvenirs'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['All Levels'],
      disabledParking: { available: true, spaces: 100, location: 'Stadium area' },
      audioNavigation: true,
      brailleSignage: true,
      hearingLoop: true,
      accessibleRestrooms: ['All levels'],
      guideDogFriendly: true,
      tactilePathways: true
    },
    parking: {
      available: true,
      levels: 2,
      capacity: 4000,
      pricing: { hourly: 15, daily: 60 },
      paymentMethods: ['Cash', 'Card', 'Mobile'],
      electricVehicleCharging: true,
      disabledSpaces: 100
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Arch Safe Routes'],
      assemblyPoints: ['Open Areas'],
      emergencyContacts: { security: '+27 31 582 8200', medical: '+27 31 582 8201', fire: '10177' },
      defibrillatorLocations: ['All major areas']
    },
    transportation: {
      publicTransport: ['Bus Routes', 'People Mover'],
      shuttle: true,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: true,
    tags: ['iconic', 'arch', 'adventure', 'world-cup']
  },
  {
    id: 'loftus-versfeld-stadium',
    name: 'Loftus Versfeld Stadium',
    type: 'stadium',
    description: 'Premier rugby stadium in Pretoria, home to the Blue Bulls and major sporting events.',
    shortDescription: 'Premier rugby stadium in Pretoria',
    headerImage: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Kirkness Street, Arcadia',
      city: 'Pretoria',
      province: 'Gauteng',
      postalCode: '0083',
      coordinates: { latitude: -25.7512, longitude: 28.2242 }
    },
    contact: {
      phone: '+27 12 420 1000',
      website: 'https://www.loftusversfeld.co.za'
    },
    openingHours: {
      monday: 'Event Days Only',
      tuesday: 'Event Days Only',
      wednesday: 'Event Days Only',
      thursday: 'Event Days Only',
      friday: 'Event Days Only',
      saturday: 'Event Days Only',
      sunday: 'Event Days Only'
    },
    features: ['Rugby Fortress', 'Altitude Advantage', 'Iconic Home', 'Traditional Ground'],
    amenities: ['Corporate Boxes', 'Restaurants', 'Bars', 'Museum'],
    services: ['Stadium Tours', 'Corporate Events', 'Match Day Experiences'],
    rating: 4.4,
    reviewCount: 2800,
    levels: 3,
    totalArea: 95000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Sports', 'Rugby', 'Food', 'Merchandise'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Main Stands'],
      disabledParking: { available: true, spaces: 75, location: 'Stadium area' },
      audioNavigation: false,
      brailleSignage: false,
      hearingLoop: false,
      accessibleRestrooms: ['All stands'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 1,
      capacity: 2500,
      pricing: { hourly: 0, daily: 40 },
      paymentMethods: ['Cash', 'Card'],
      electricVehicleCharging: false,
      disabledSpaces: 75
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Stadium Exits'],
      assemblyPoints: ['Parking Areas'],
      emergencyContacts: { security: '+27 12 420 1001', medical: '+27 12 420 1002', fire: '10177' },
      defibrillatorLocations: ['Stadium areas']
    },
    transportation: {
      publicTransport: ['Bus Routes'],
      shuttle: true,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: true,
    tags: ['rugby', 'fortress', 'altitude', 'pretoria']
  },
  {
    id: 'kings-park-stadium',
    name: 'HollywoodBets Kings Park',
    type: 'stadium',
    description: 'Coastal rugby stadium in Durban with stunning ocean views and passionate rugby atmosphere.',
    shortDescription: 'Coastal rugby stadium with ocean views',
    headerImage: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Kingsmead Close, Stamford Hill',
      city: 'Durban',
      province: 'KwaZulu-Natal',
      postalCode: '4001',
      coordinates: { latitude: -29.8436, longitude: 31.0189 }
    },
    contact: {
      phone: '+27 31 368 1000',
      website: 'https://www.kingspark.co.za'
    },
    openingHours: {
      monday: 'Event Days Only',
      tuesday: 'Event Days Only',
      wednesday: 'Event Days Only',
      thursday: 'Event Days Only',
      friday: 'Event Days Only',
      saturday: 'Event Days Only',
      sunday: 'Event Days Only'
    },
    features: ['Ocean Views', 'Coastal Location', 'Passionate Crowds', 'Home Ground'],
    amenities: ['Hospitality Suites', 'Restaurants', 'Sports Bar', 'Pro Shop'],
    services: ['Stadium Tours', 'Corporate Events', 'Match Experiences'],
    rating: 4.3,
    reviewCount: 2400,
    levels: 3,
    totalArea: 88000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Sports', 'Rugby', 'Food', 'Merchandise'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Main Stands'],
      disabledParking: { available: true, spaces: 60, location: 'Stadium area' },
      audioNavigation: false,
      brailleSignage: false,
      hearingLoop: false,
      accessibleRestrooms: ['All stands'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 1,
      capacity: 2200,
      pricing: { hourly: 0, daily: 45 },
      paymentMethods: ['Cash', 'Card'],
      electricVehicleCharging: false,
      disabledSpaces: 60
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Coastal Safe Routes'],
      assemblyPoints: ['Parking Areas'],
      emergencyContacts: { security: '+27 31 368 1001', medical: '+27 31 368 1002', fire: '10177' },
      defibrillatorLocations: ['Stadium areas']
    },
    transportation: {
      publicTransport: ['Bus Routes'],
      shuttle: true,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: true,
    tags: ['coastal', 'ocean-views', 'rugby', 'passionate']
  },
  {
    id: 'orlando-stadium',
    name: 'Orlando Stadium',
    type: 'stadium',
    description: 'Historic football stadium in Soweto, home to Orlando Pirates and rich in football heritage.',
    shortDescription: 'Historic football stadium in Soweto',
    headerImage: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Rand Stadium Road, Orlando West',
      city: 'Soweto',
      province: 'Gauteng',
      postalCode: '1804',
      coordinates: { latitude: -26.2349, longitude: 27.9338 }
    },
    contact: {
      phone: '+27 11 933 3000',
      website: 'https://www.orlandopirates.com'
    },
    openingHours: {
      monday: 'Event Days Only',
      tuesday: 'Event Days Only',
      wednesday: 'Event Days Only',
      thursday: 'Event Days Only',
      friday: 'Event Days Only',
      saturday: 'Event Days Only',
      sunday: 'Event Days Only'
    },
    features: ['Football Heritage', 'Community Icon', 'Historic Ground', 'Passionate Support'],
    amenities: ['Corporate Boxes', 'Bars', 'Food Courts', 'Museum'],
    services: ['Stadium Tours', 'Community Events', 'Corporate Functions'],
    rating: 4.1,
    reviewCount: 1800,
    levels: 2,
    totalArea: 65000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Football', 'Community', 'Food', 'Merchandise'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Main Stand'],
      disabledParking: { available: true, spaces: 40, location: 'Stadium area' },
      audioNavigation: false,
      brailleSignage: false,
      hearingLoop: false,
      accessibleRestrooms: ['Main areas'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 1,
      capacity: 1500,
      pricing: { hourly: 0, daily: 30 },
      paymentMethods: ['Cash', 'Card'],
      electricVehicleCharging: false,
      disabledSpaces: 40
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Community Safe Routes'],
      assemblyPoints: ['Open Areas'],
      emergencyContacts: { security: '+27 11 933 3001', medical: '+27 11 933 3002', fire: '10177' },
      defibrillatorLocations: ['Stadium areas']
    },
    transportation: {
      publicTransport: ['Taxi Ranks', 'Bus Routes'],
      shuttle: false,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: false,
    tags: ['football', 'heritage', 'community', 'soweto']
  },
  {
    id: 'boet-erasmus-stadium',
    name: 'Nelson Mandela Bay Stadium',
    type: 'stadium',
    description: 'Modern stadium in Port Elizabeth built for 2010 FIFA World Cup with unique roof design.',
    shortDescription: 'Modern World Cup stadium in Port Elizabeth',
    headerImage: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Prince Alfred Road, North End',
      city: 'Gqeberha',
      province: 'Eastern Cape',
      postalCode: '6001',
      coordinates: { latitude: -33.9146, longitude: 25.5993 }
    },
    contact: {
      phone: '+27 41 506 2200',
      website: 'https://www.nmbaystadium.co.za'
    },
    openingHours: {
      monday: '09:00 - 17:00',
      tuesday: '09:00 - 17:00',
      wednesday: '09:00 - 17:00',
      thursday: '09:00 - 17:00',
      friday: '09:00 - 17:00',
      saturday: '09:00 - 17:00',
      sunday: '09:00 - 17:00'
    },
    features: ['Unique Roof Design', 'World Cup Legacy', 'Modern Facilities', 'Multi-Purpose'],
    amenities: ['Conference Center', 'Restaurants', 'Corporate Suites', 'Museum'],
    services: ['Stadium Tours', 'Conference Facilities', 'Event Hosting'],
    rating: 4.2,
    reviewCount: 1650,
    levels: 3,
    totalArea: 110000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Sports', 'Conference', 'Food', 'Souvenirs'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['All Levels'],
      disabledParking: { available: true, spaces: 90, location: 'Stadium area' },
      audioNavigation: true,
      brailleSignage: true,
      hearingLoop: true,
      accessibleRestrooms: ['All levels'],
      guideDogFriendly: true,
      tactilePathways: true
    },
    parking: {
      available: true,
      levels: 2,
      capacity: 3500,
      pricing: { hourly: 10, daily: 50 },
      paymentMethods: ['Cash', 'Card'],
      electricVehicleCharging: true,
      disabledSpaces: 90
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Modern Safe Routes'],
      assemblyPoints: ['Parking Areas'],
      emergencyContacts: { security: '+27 41 506 2201', medical: '+27 41 506 2202', fire: '10177' },
      defibrillatorLocations: ['All major areas']
    },
    transportation: {
      publicTransport: ['Bus Routes'],
      shuttle: true,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: true,
    tags: ['modern', 'world-cup', 'unique-design', 'multi-purpose']
  },
  {
    id: 'royal-bafokeng-stadium',
    name: 'Royal Bafokeng Stadium',
    type: 'stadium',
    description: 'Platinum mine-funded stadium in Rustenburg, a 2010 FIFA World Cup venue.',
    shortDescription: 'Platinum-funded World Cup stadium',
    headerImage: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Phokeng Road, Phokeng',
      city: 'Rustenburg',
      province: 'North West',
      postalCode: '0300',
      coordinates: { latitude: -25.5653, longitude: 27.1853 }
    },
    contact: {
      phone: '+27 14 566 0500',
      website: 'https://www.royalbafokengstadium.co.za'
    },
    openingHours: {
      monday: 'Event Days Only',
      tuesday: 'Event Days Only',
      wednesday: 'Event Days Only',
      thursday: 'Event Days Only',
      friday: 'Event Days Only',
      saturday: 'Event Days Only',
      sunday: 'Event Days Only'
    },
    features: ['Platinum Legacy', 'Community Investment', 'World Cup Heritage', 'Modern Design'],
    amenities: ['Corporate Facilities', 'Restaurants', 'Community Center', 'Training Facilities'],
    services: ['Community Programs', 'Corporate Events', 'Stadium Tours'],
    rating: 4.0,
    reviewCount: 1200,
    levels: 2,
    totalArea: 85000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Sports', 'Community', 'Food', 'Local'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Main Areas'],
      disabledParking: { available: true, spaces: 50, location: 'Stadium area' },
      audioNavigation: false,
      brailleSignage: true,
      hearingLoop: false,
      accessibleRestrooms: ['Main areas'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 1,
      capacity: 2800,
      pricing: { hourly: 0, daily: 35 },
      paymentMethods: ['Cash', 'Card'],
      electricVehicleCharging: false,
      disabledSpaces: 50
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Stadium Exits'],
      assemblyPoints: ['Open Areas'],
      emergencyContacts: { security: '+27 14 566 0501', medical: '+27 14 566 0502', fire: '10177' },
      defibrillatorLocations: ['Key areas']
    },
    transportation: {
      publicTransport: ['Limited'],
      shuttle: true,
      taxi: true,
      rideshare: false
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: false,
    tags: ['platinum', 'community', 'world-cup', 'rustenburg']
  },
  {
    id: 'free-state-stadium',
    name: 'Toyota Stadium (Free State Stadium)',
    type: 'stadium',
    description: 'Multi-purpose stadium in Bloemfontein, home to rugby and football with high-altitude advantage.',
    shortDescription: 'Multi-purpose stadium in Bloemfontein',
    headerImage: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Nelson Mandela Drive',
      city: 'Bloemfontein',
      province: 'Free State',
      postalCode: '9301',
      coordinates: { latitude: -29.1106, longitude: 26.1939 }
    },
    contact: {
      phone: '+27 51 407 1500',
      website: 'https://www.freestatestadium.co.za'
    },
    openingHours: {
      monday: 'Event Days Only',
      tuesday: 'Event Days Only',
      wednesday: 'Event Days Only',
      thursday: 'Event Days Only',
      friday: 'Event Days Only',
      saturday: 'Event Days Only',
      sunday: 'Event Days Only'
    },
    features: ['High Altitude', 'Multi-Purpose', 'Central Location', 'Dual Sport'],
    amenities: ['Corporate Boxes', 'Restaurants', 'Conference Facilities', 'Training Ground'],
    services: ['Stadium Tours', 'Corporate Events', 'Conference Hosting'],
    rating: 3.9,
    reviewCount: 1450,
    levels: 3,
    totalArea: 75000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Sports', 'Conference', 'Food', 'Merchandise'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Main Stands'],
      disabledParking: { available: true, spaces: 45, location: 'Stadium area' },
      audioNavigation: false,
      brailleSignage: false,
      hearingLoop: false,
      accessibleRestrooms: ['All stands'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 1,
      capacity: 2000,
      pricing: { hourly: 0, daily: 30 },
      paymentMethods: ['Cash', 'Card'],
      electricVehicleCharging: false,
      disabledSpaces: 45
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Stadium Exits'],
      assemblyPoints: ['Parking Areas'],
      emergencyContacts: { security: '+27 51 407 1501', medical: '+27 51 407 1502', fire: '10177' },
      defibrillatorLocations: ['Stadium areas']
    },
    transportation: {
      publicTransport: ['Bus Routes'],
      shuttle: true,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: false,
    tags: ['altitude', 'multi-purpose', 'central', 'bloemfontein']
  }
];

// Government Buildings (10 venues)
export const governmentBuildings: EnhancedVenue[] = [
  {
    id: 'union-buildings',
    name: 'Union Buildings',
    type: 'government',
    description: 'Seat of the South African government and the official workplace of the President.',
    shortDescription: 'Seat of South African government',
    headerImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Government Ave, Arcadia',
      city: 'Pretoria',
      province: 'Gauteng',
      postalCode: '0083',
      coordinates: { latitude: -25.7319, longitude: 28.2141 }
    },
    contact: {
      phone: '+27 12 300 5200',
      website: 'https://www.gov.za'
    },
    openingHours: {
      monday: '08:00 - 16:00',
      tuesday: '08:00 - 16:00',
      wednesday: '08:00 - 16:00',
      thursday: '08:00 - 16:00',
      friday: '08:00 - 16:00',
      saturday: 'Tours Only',
      sunday: 'Tours Only'
    },
    features: ['Historic Architecture', 'Presidential Office', 'Government Seat'],
    amenities: ['Gardens', 'Monuments', 'Tourist Facilities'],
    services: ['Government Services', 'Official Tours'],
    rating: 4.3,
    reviewCount: 1500,
    levels: 4,
    totalArea: 120000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Government', 'Tourism'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Main Building'],
      disabledParking: { available: true, spaces: 50, location: 'Visitor areas' },
      audioNavigation: false,
      brailleSignage: true,
      hearingLoop: false,
      accessibleRestrooms: ['Visitor areas'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 2,
      capacity: 1000,
      pricing: { hourly: 8, daily: 50 },
      paymentMethods: ['Cash', 'Card'],
      electricVehicleCharging: false,
      disabledSpaces: 50
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Government Protocols'],
      assemblyPoints: ['Gardens Area'],
      emergencyContacts: { security: '+27 12 300 5000', medical: '+27 12 300 5100', fire: '10177' },
      defibrillatorLocations: ['Key areas']
    },
    transportation: {
      publicTransport: ['Bus Routes'],
      shuttle: false,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: true,
    tags: ['government', 'historic', 'presidential', 'tourism']
  },
  {
    id: 'parliament-buildings',
    name: 'Houses of Parliament',
    type: 'government',
    description: 'The seat of South African Parliament in Cape Town where the National Assembly and National Council of Provinces meet.',
    shortDescription: 'Seat of South African Parliament',
    headerImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: '120 Plein Street',
      city: 'Cape Town',
      province: 'Western Cape',
      postalCode: '8001',
      coordinates: { latitude: -33.9249, longitude: 18.4241 }
    },
    contact: {
      phone: '+27 21 403 2911',
      website: 'https://www.parliament.gov.za'
    },
    openingHours: {
      monday: '09:00 - 16:00',
      tuesday: '09:00 - 16:00',
      wednesday: '09:00 - 16:00',
      thursday: '09:00 - 16:00',
      friday: '09:00 - 16:00',
      saturday: 'Tours Only',
      sunday: 'Closed'
    },
    features: ['Parliamentary Sessions', 'Historic Architecture', 'Democratic Heritage', 'Public Tours'],
    amenities: ['Visitor Center', 'Gift Shop', 'Cafeteria', 'Security'],
    services: ['Parliamentary Tours', 'Public Gallery', 'Educational Programs'],
    rating: 4.4,
    reviewCount: 1850,
    levels: 4,
    totalArea: 85000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Government', 'Education', 'Tourism'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Parliamentary Buildings'],
      disabledParking: { available: true, spaces: 25, location: 'Parliamentary area' },
      audioNavigation: true,
      brailleSignage: true,
      hearingLoop: true,
      accessibleRestrooms: ['All floors'],
      guideDogFriendly: true,
      tactilePathways: true
    },
    parking: {
      available: true,
      levels: 2,
      capacity: 500,
      pricing: { hourly: 15, daily: 80 },
      paymentMethods: ['Card Only'],
      electricVehicleCharging: false,
      disabledSpaces: 25
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Secure Parliamentary Routes'],
      assemblyPoints: ['Designated Safe Areas'],
      emergencyContacts: { security: '+27 21 403 2900', medical: '+27 21 403 2901', fire: '10177' },
      defibrillatorLocations: ['All major areas']
    },
    transportation: {
      publicTransport: ['MyCiTi Bus', 'Golden Arrow'],
      shuttle: false,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: true,
    tags: ['parliament', 'democracy', 'historic', 'tours']
  },
  {
    id: 'city-hall-cape-town',
    name: 'Cape Town City Hall',
    type: 'government',
    description: 'Historic city hall where Nelson Mandela gave his first speech after release from prison.',
    shortDescription: 'Historic city hall with Mandela heritage',
    headerImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Darling Street',
      city: 'Cape Town',
      province: 'Western Cape',
      postalCode: '8001',
      coordinates: { latitude: -33.9258, longitude: 18.4232 }
    },
    contact: {
      phone: '+27 21 400 1200',
      website: 'https://www.capetown.gov.za'
    },
    openingHours: {
      monday: '08:00 - 17:00',
      tuesday: '08:00 - 17:00',
      wednesday: '08:00 - 17:00',
      thursday: '08:00 - 17:00',
      friday: '08:00 - 17:00',
      saturday: 'Tours Only',
      sunday: 'Closed'
    },
    features: ['Historic Building', 'Mandela Heritage', 'City Services', 'Clock Tower'],
    amenities: ['Information Center', 'Municipal Services', 'Clock Tower', 'Public Spaces'],
    services: ['City Services', 'Heritage Tours', 'Public Information'],
    rating: 4.2,
    reviewCount: 1200,
    levels: 3,
    totalArea: 45000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Government', 'Heritage', 'Services'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Historic Lifts'],
      disabledParking: { available: true, spaces: 15, location: 'City Hall area' },
      audioNavigation: false,
      brailleSignage: true,
      hearingLoop: false,
      accessibleRestrooms: ['Ground floor'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 1,
      capacity: 200,
      pricing: { hourly: 12, daily: 60 },
      paymentMethods: ['Card', 'Cash'],
      electricVehicleCharging: false,
      disabledSpaces: 15
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Historic Safe Routes'],
      assemblyPoints: ['Grand Parade'],
      emergencyContacts: { security: '+27 21 400 1201', medical: '+27 21 400 1202', fire: '10177' },
      defibrillatorLocations: ['Key areas']
    },
    transportation: {
      publicTransport: ['MyCiTi Bus', 'Train Station'],
      shuttle: false,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: true,
    tags: ['historic', 'mandela', 'heritage', 'municipal']
  },
  {
    id: 'johannesburg-city-hall',
    name: 'Johannesburg City Hall',
    type: 'government',
    description: 'Historic city hall serving as municipal headquarters and cultural venue in Johannesburg.',
    shortDescription: 'Historic municipal headquarters',
    headerImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Rissik Street',
      city: 'Johannesburg',
      province: 'Gauteng',
      postalCode: '2001',
      coordinates: { latitude: -26.2041, longitude: 28.0473 }
    },
    contact: {
      phone: '+27 11 407 7000',
      website: 'https://www.joburg.org.za'
    },
    openingHours: {
      monday: '08:00 - 16:30',
      tuesday: '08:00 - 16:30',
      wednesday: '08:00 - 16:30',
      thursday: '08:00 - 16:30',
      friday: '08:00 - 16:30',
      saturday: 'Closed',
      sunday: 'Closed'
    },
    features: ['Municipal Services', 'Historic Architecture', 'Cultural Events', 'City Administration'],
    amenities: ['Municipal Offices', 'Public Services', 'Information Center', 'Meeting Halls'],
    services: ['City Services', 'Public Information', 'Municipal Affairs'],
    rating: 3.8,
    reviewCount: 950,
    levels: 4,
    totalArea: 38000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Government', 'Services', 'Administration'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Municipal Lifts'],
      disabledParking: { available: true, spaces: 20, location: 'City Hall area' },
      audioNavigation: false,
      brailleSignage: true,
      hearingLoop: false,
      accessibleRestrooms: ['All floors'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 2,
      capacity: 400,
      pricing: { hourly: 8, daily: 40 },
      paymentMethods: ['Card', 'Cash'],
      electricVehicleCharging: false,
      disabledSpaces: 20
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Municipal Safe Routes'],
      assemblyPoints: ['Public Squares'],
      emergencyContacts: { security: '+27 11 407 7001', medical: '+27 11 407 7002', fire: '10177' },
      defibrillatorLocations: ['Key areas']
    },
    transportation: {
      publicTransport: ['Bus Routes', 'Taxi Ranks'],
      shuttle: false,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: false,
    tags: ['municipal', 'administration', 'historic', 'services']
  },
  {
    id: 'constitutional-court',
    name: 'Constitutional Court of South Africa',
    type: 'government',
    description: 'Highest court in South Africa for constitutional matters, built on the site of the Old Fort prison complex.',
    shortDescription: 'Highest constitutional court',
    headerImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: '11 Kotze Street, Braamfontein',
      city: 'Johannesburg',
      province: 'Gauteng',
      postalCode: '2017',
      coordinates: { latitude: -26.1929, longitude: 28.0255 }
    },
    contact: {
      phone: '+27 11 359 7900',
      website: 'https://www.concourt.org.za'
    },
    openingHours: {
      monday: '09:00 - 17:00',
      tuesday: '09:00 - 17:00',
      wednesday: '09:00 - 17:00',
      thursday: '09:00 - 17:00',
      friday: '09:00 - 17:00',
      saturday: '09:00 - 17:00',
      sunday: '09:00 - 17:00'
    },
    features: ['Constitutional Law', 'Historic Site', 'Art Collection', 'Public Access'],
    amenities: ['Visitor Center', 'Exhibition Hall', 'Library', 'Art Gallery'],
    services: ['Court Tours', 'Educational Programs', 'Legal Information'],
    rating: 4.7,
    reviewCount: 1650,
    levels: 3,
    totalArea: 25000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Legal', 'Education', 'Art'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Court Building'],
      disabledParking: { available: true, spaces: 15, location: 'Court area' },
      audioNavigation: true,
      brailleSignage: true,
      hearingLoop: true,
      accessibleRestrooms: ['All floors'],
      guideDogFriendly: true,
      tactilePathways: true
    },
    parking: {
      available: true,
      levels: 1,
      capacity: 200,
      pricing: { hourly: 10, daily: 50 },
      paymentMethods: ['Card', 'Cash'],
      electricVehicleCharging: false,
      disabledSpaces: 15
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Secure Court Routes'],
      assemblyPoints: ['Court Grounds'],
      emergencyContacts: { security: '+27 11 359 7901', medical: '+27 11 359 7902', fire: '10177' },
      defibrillatorLocations: ['Court areas']
    },
    transportation: {
      publicTransport: ['Bus Routes'],
      shuttle: false,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: true,
    tags: ['constitutional', 'court', 'justice', 'historic']
  },
  {
    id: 'gauteng-provincial-building',
    name: 'Gauteng Provincial Legislature',
    type: 'government',
    description: 'Seat of the Gauteng provincial government where provincial laws are made and debated.',
    shortDescription: 'Gauteng provincial government seat',
    headerImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: '90 Govan Mbeki Avenue',
      city: 'Johannesburg',
      province: 'Gauteng',
      postalCode: '2001',
      coordinates: { latitude: -26.2085, longitude: 28.0423 }
    },
    contact: {
      phone: '+27 11 498 5000',
      website: 'https://www.gpl.gov.za'
    },
    openingHours: {
      monday: '08:00 - 17:00',
      tuesday: '08:00 - 17:00',
      wednesday: '08:00 - 17:00',
      thursday: '08:00 - 17:00',
      friday: '08:00 - 17:00',
      saturday: 'Closed',
      sunday: 'Closed'
    },
    features: ['Provincial Legislature', 'Democratic Process', 'Public Participation', 'Government Services'],
    amenities: ['Public Gallery', 'Committee Rooms', 'Offices', 'Conference Facilities'],
    services: ['Legislative Sessions', 'Public Participation', 'Government Information'],
    rating: 3.9,
    reviewCount: 650,
    levels: 10,
    totalArea: 55000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Government', 'Legislative', 'Services'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['All Buildings'],
      disabledParking: { available: true, spaces: 30, location: 'Government complex' },
      audioNavigation: false,
      brailleSignage: true,
      hearingLoop: true,
      accessibleRestrooms: ['All floors'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 2,
      capacity: 800,
      pricing: { hourly: 8, daily: 40 },
      paymentMethods: ['Card', 'Cash'],
      electricVehicleCharging: false,
      disabledSpaces: 30
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Government Safe Routes'],
      assemblyPoints: ['Plaza Areas'],
      emergencyContacts: { security: '+27 11 498 5001', medical: '+27 11 498 5002', fire: '10177' },
      defibrillatorLocations: ['Key areas']
    },
    transportation: {
      publicTransport: ['Bus Routes', 'Taxi Ranks'],
      shuttle: false,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: false,
    tags: ['provincial', 'legislature', 'government', 'democratic']
  },
  {
    id: 'western-cape-provincial-parliament',
    name: 'Western Cape Provincial Parliament',
    type: 'government',
    description: 'Provincial legislature building in Cape Town serving the Western Cape province.',
    shortDescription: 'Western Cape provincial legislature',
    headerImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: '7 Wale Street',
      city: 'Cape Town',
      province: 'Western Cape',
      postalCode: '8001',
      coordinates: { latitude: -33.9225, longitude: 18.4185 }
    },
    contact: {
      phone: '+27 21 487 1600',
      website: 'https://www.wcpp.gov.za'
    },
    openingHours: {
      monday: '08:00 - 17:00',
      tuesday: '08:00 - 17:00',
      wednesday: '08:00 - 17:00',
      thursday: '08:00 - 17:00',
      friday: '08:00 - 17:00',
      saturday: 'Closed',
      sunday: 'Closed'
    },
    features: ['Provincial Governance', 'Legislative Process', 'Public Access', 'Democratic Participation'],
    amenities: ['Chamber', 'Committee Rooms', 'Public Gallery', 'Offices'],
    services: ['Legislative Sessions', 'Committee Meetings', 'Public Participation'],
    rating: 4.1,
    reviewCount: 580,
    levels: 5,
    totalArea: 42000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Government', 'Legislative', 'Public Service'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Main Building'],
      disabledParking: { available: true, spaces: 20, location: 'Government area' },
      audioNavigation: false,
      brailleSignage: true,
      hearingLoop: true,
      accessibleRestrooms: ['All floors'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 1,
      capacity: 300,
      pricing: { hourly: 12, daily: 60 },
      paymentMethods: ['Card', 'Cash'],
      electricVehicleCharging: false,
      disabledSpaces: 20
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Legislative Safe Routes'],
      assemblyPoints: ['Government Grounds'],
      emergencyContacts: { security: '+27 21 487 1601', medical: '+27 21 487 1602', fire: '10177' },
      defibrillatorLocations: ['Key areas']
    },
    transportation: {
      publicTransport: ['MyCiTi Bus', 'Golden Arrow'],
      shuttle: false,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: false,
    tags: ['provincial', 'western-cape', 'legislature', 'governance']
  },
  {
    id: 'pretoria-high-court',
    name: 'Gauteng Division High Court (Pretoria)',
    type: 'government',
    description: 'Major high court serving the Pretoria area with civil and criminal jurisdiction.',
    shortDescription: 'Major high court in Pretoria',
    headerImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: '315 Church Street',
      city: 'Pretoria',
      province: 'Gauteng',
      postalCode: '0002',
      coordinates: { latitude: -25.7478, longitude: 28.1885 }
    },
    contact: {
      phone: '+27 12 492 5000',
      website: 'https://www.judiciary.org.za'
    },
    openingHours: {
      monday: '08:00 - 16:00',
      tuesday: '08:00 - 16:00',
      wednesday: '08:00 - 16:00',
      thursday: '08:00 - 16:00',
      friday: '08:00 - 16:00',
      saturday: 'Closed',
      sunday: 'Closed'
    },
    features: ['High Court', 'Civil Cases', 'Criminal Cases', 'Appeals'],
    amenities: ['Courtrooms', 'Legal Library', 'Waiting Areas', 'Offices'],
    services: ['Court Proceedings', 'Legal Services', 'Case Management'],
    rating: 3.7,
    reviewCount: 420,
    levels: 6,
    totalArea: 35000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Legal', 'Court Services', 'Justice'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Court Building'],
      disabledParking: { available: true, spaces: 25, location: 'Court area' },
      audioNavigation: false,
      brailleSignage: true,
      hearingLoop: true,
      accessibleRestrooms: ['All floors'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 2,
      capacity: 400,
      pricing: { hourly: 8, daily: 45 },
      paymentMethods: ['Card', 'Cash'],
      electricVehicleCharging: false,
      disabledSpaces: 25
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Court Safe Routes'],
      assemblyPoints: ['Court Grounds'],
      emergencyContacts: { security: '+27 12 492 5001', medical: '+27 12 492 5002', fire: '10177' },
      defibrillatorLocations: ['Court areas']
    },
    transportation: {
      publicTransport: ['Bus Routes'],
      shuttle: false,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: false,
    tags: ['high-court', 'justice', 'legal', 'pretoria']
  },
  {
    id: 'cape-town-civic-centre',
    name: 'Cape Town Civic Centre',
    type: 'government',
    description: 'Modern civic center providing various municipal services to Cape Town residents.',
    shortDescription: 'Modern municipal services center',
    headerImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: '12 Hertzog Boulevard',
      city: 'Cape Town',
      province: 'Western Cape',
      postalCode: '8001',
      coordinates: { latitude: -33.9206, longitude: 18.4185 }
    },
    contact: {
      phone: '+27 21 400 1111',
      website: 'https://www.capetown.gov.za'
    },
    openingHours: {
      monday: '07:30 - 16:30',
      tuesday: '07:30 - 16:30',
      wednesday: '07:30 - 16:30',
      thursday: '07:30 - 16:30',
      friday: '07:30 - 16:30',
      saturday: 'Limited Services',
      sunday: 'Closed'
    },
    features: ['Municipal Services', 'Modern Building', 'One-Stop Services', 'Digital Services'],
    amenities: ['Service Counters', 'Waiting Areas', 'Information Desk', 'ATMs'],
    services: ['Rates & Taxes', 'Permits', 'Licensing', 'Municipal Information'],
    rating: 3.8,
    reviewCount: 890,
    levels: 15,
    totalArea: 65000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Municipal', 'Services', 'Administration'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['All Levels'],
      disabledParking: { available: true, spaces: 35, location: 'Civic Centre' },
      audioNavigation: true,
      brailleSignage: true,
      hearingLoop: true,
      accessibleRestrooms: ['All floors'],
      guideDogFriendly: true,
      tactilePathways: true
    },
    parking: {
      available: true,
      levels: 3,
      capacity: 800,
      pricing: { hourly: 15, daily: 75 },
      paymentMethods: ['Card', 'Mobile'],
      electricVehicleCharging: true,
      disabledSpaces: 35
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Modern Safe Routes'],
      assemblyPoints: ['Plaza Areas'],
      emergencyContacts: { security: '+27 21 400 1100', medical: '+27 21 400 1101', fire: '10177' },
      defibrillatorLocations: ['All major areas']
    },
    transportation: {
      publicTransport: ['MyCiTi Bus', 'Train Station'],
      shuttle: false,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: false,
    tags: ['civic', 'modern', 'services', 'municipal']
  },
  {
    id: 'durban-city-hall',
    name: 'eThekwini City Hall',
    type: 'government',
    description: 'Historic city hall serving as the seat of eThekwini Municipality in Durban.',
    shortDescription: 'Historic eThekwini municipal seat',
    headerImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Anton Lembede Street',
      city: 'Durban',
      province: 'KwaZulu-Natal',
      postalCode: '4001',
      coordinates: { latitude: -29.8579, longitude: 31.0292 }
    },
    contact: {
      phone: '+27 31 311 1111',
      website: 'https://www.durban.gov.za'
    },
    openingHours: {
      monday: '08:00 - 16:30',
      tuesday: '08:00 - 16:30',
      wednesday: '08:00 - 16:30',
      thursday: '08:00 - 16:30',
      friday: '08:00 - 16:30',
      saturday: 'Closed',
      sunday: 'Closed'
    },
    features: ['Historic Building', 'Municipal Services', 'Cultural Heritage', 'City Administration'],
    amenities: ['Municipal Offices', 'Council Chambers', 'Public Services', 'Information Center'],
    services: ['Municipal Services', 'City Administration', 'Public Information'],
    rating: 3.9,
    reviewCount: 750,
    levels: 4,
    totalArea: 48000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Municipal', 'Heritage', 'Services'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Historic Lifts'],
      disabledParking: { available: true, spaces: 25, location: 'City Hall area' },
      audioNavigation: false,
      brailleSignage: true,
      hearingLoop: false,
      accessibleRestrooms: ['All floors'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 2,
      capacity: 500,
      pricing: { hourly: 10, daily: 50 },
      paymentMethods: ['Card', 'Cash'],
      electricVehicleCharging: false,
      disabledSpaces: 25
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Historic Safe Routes'],
      assemblyPoints: ['City Squares'],
      emergencyContacts: { security: '+27 31 311 1100', medical: '+27 31 311 1101', fire: '10177' },
      defibrillatorLocations: ['Key areas']
    },
    transportation: {
      publicTransport: ['Bus Routes', 'Taxi Ranks'],
      shuttle: false,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: false,
    tags: ['historic', 'municipal', 'durban', 'heritage']
  }
];

// Entertainment Centers (10 venues)
export const entertainmentCenters: EnhancedVenue[] = [
  {
    id: 'sun-city',
    name: 'Sun City Resort',
    type: 'entertainment',
    description: 'Premier entertainment destination featuring casinos, hotels, and world-class entertainment.',
    shortDescription: 'Premier entertainment destination',
    headerImage: 'https://images.unsplash.com/photo-1489599210737-f47f2d15c818?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1489599210737-f47f2d15c818?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Sun City Resort, Rustenburg',
      city: 'Rustenburg',
      province: 'North West',
      postalCode: '0316',
      coordinates: { latitude: -25.3317, longitude: 27.0904 }
    },
    contact: {
      phone: '+27 14 557 1000',
      website: 'https://www.suninternational.com'
    },
    openingHours: {
      monday: '24/7',
      tuesday: '24/7',
      wednesday: '24/7',
      thursday: '24/7',
      friday: '24/7',
      saturday: '24/7',
      sunday: '24/7'
    },
    features: ['Casino Gaming', 'Luxury Hotels', 'Entertainment Shows', 'Golf Course'],
    amenities: ['Multiple Restaurants', 'Spa', 'Water Park', 'Conference Facilities'],
    services: ['Gaming', 'Entertainment', 'Hospitality', 'Events'],
    rating: 4.4,
    reviewCount: 3500,
    levels: 8,
    totalArea: 500000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Gaming', 'Hospitality', 'Entertainment'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['All Buildings'],
      disabledParking: { available: true, spaces: 150, location: 'All areas' },
      audioNavigation: false,
      brailleSignage: true,
      hearingLoop: false,
      accessibleRestrooms: ['All facilities'],
      guideDogFriendly: true,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 4,
      capacity: 8000,
      pricing: { hourly: 0, daily: 0 },
      paymentMethods: ['Free'],
      electricVehicleCharging: true,
      disabledSpaces: 150
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Multiple Exits'],
      assemblyPoints: ['Resort Areas'],
      emergencyContacts: { security: '+27 14 557 1001', medical: '+27 14 557 1002', fire: '10177' },
      defibrillatorLocations: ['All major areas']
    },
    transportation: {
      publicTransport: ['Shuttle Services'],
      shuttle: true,
      taxi: true,
      rideshare: false
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: true,
    tags: ['casino', 'resort', 'luxury', 'entertainment']
  },
  {
    id: 'montecasino',
    name: 'Montecasino',
    type: 'entertainment',
    description: 'Italian-themed entertainment complex with casino, theaters, restaurants, and shopping.',
    shortDescription: 'Italian-themed entertainment complex',
    headerImage: 'https://images.unsplash.com/photo-1489599210737-f47f2d15c818?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1489599210737-f47f2d15c818?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Montecasino Boulevard, Fourways',
      city: 'Johannesburg',
      province: 'Gauteng',
      postalCode: '2055',
      coordinates: { latitude: -26.0294, longitude: 28.0094 }
    },
    contact: {
      phone: '+27 11 510 7777',
      website: 'https://www.montecasino.co.za'
    },
    openingHours: {
      monday: '24 hours',
      tuesday: '24 hours',
      wednesday: '24 hours',
      thursday: '24 hours',
      friday: '24 hours',
      saturday: '24 hours',
      sunday: '24 hours'
    },
    features: ['Italian Theme', 'Casino Gaming', 'Live Theater', 'Sky Ceiling'],
    amenities: ['Teatro', 'Casino', 'Restaurants', 'Shopping', 'Parking'],
    services: ['Gaming', 'Entertainment', 'Dining', 'Shopping', 'Theater Shows'],
    rating: 4.3,
    reviewCount: 3200,
    levels: 3,
    totalArea: 85000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Gaming', 'Entertainment', 'Dining', 'Shopping'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['All Areas'],
      disabledParking: { available: true, spaces: 100, location: 'All levels' },
      audioNavigation: false,
      brailleSignage: false,
      hearingLoop: false,
      accessibleRestrooms: ['All floors'],
      guideDogFriendly: false,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 4,
      capacity: 6000,
      pricing: { hourly: 0, daily: 0 },
      paymentMethods: ['Free'],
      electricVehicleCharging: true,
      disabledSpaces: 100
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Multiple Exits'],
      assemblyPoints: ['Parking Areas'],
      emergencyContacts: { security: '+27 11 510 7000', medical: '+27 11 510 7001', fire: '10177' },
      defibrillatorLocations: ['All major areas']
    },
    transportation: {
      publicTransport: ['Shuttle Services'],
      shuttle: true,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: true,
    tags: ['casino', 'theater', 'italian', 'entertainment']
  },
  {
    id: 'gold-reef-city',
    name: 'Gold Reef City Casino and Theme Park',
    type: 'entertainment',
    description: 'Historic gold mining-themed entertainment complex with casino, rides, and shows.',
    shortDescription: 'Gold mining-themed entertainment complex',
    headerImage: 'https://images.unsplash.com/photo-1489599210737-f47f2d15c818?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1489599210737-f47f2d15c818?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Northern Parkway, Ormonde',
      city: 'Johannesburg',
      province: 'Gauteng',
      postalCode: '2091',
      coordinates: { latitude: -26.2350, longitude: 27.9884 }
    },
    contact: {
      phone: '+27 11 248 5200',
      website: 'https://www.goldreefcity.co.za'
    },
    openingHours: {
      monday: '09:00 - 17:00',
      tuesday: '09:00 - 17:00',
      wednesday: '09:00 - 17:00',
      thursday: '09:00 - 17:00',
      friday: '09:00 - 17:00',
      saturday: '09:00 - 17:00',
      sunday: '09:00 - 17:00'
    },
    features: ['Theme Park', 'Casino Gaming', 'Historic Theme', 'Family Entertainment'],
    amenities: ['Rides', 'Casino', 'Restaurants', 'Shows', 'Shopping'],
    services: ['Theme Park Rides', 'Gaming', 'Entertainment Shows', 'Dining'],
    rating: 4.2,
    reviewCount: 4200,
    levels: 3,
    totalArea: 125000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Gaming', 'Family Entertainment', 'Dining', 'Shopping'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Theme Park Areas'],
      disabledParking: { available: true, spaces: 80, location: 'Theme park entrance' },
      audioNavigation: false,
      brailleSignage: false,
      hearingLoop: false,
      accessibleRestrooms: ['All areas'],
      guideDogFriendly: false,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 2,
      capacity: 4000,
      pricing: { hourly: 0, daily: 0 },
      paymentMethods: ['Free'],
      electricVehicleCharging: false,
      disabledSpaces: 80
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Theme Park Exits'],
      assemblyPoints: ['Open Areas'],
      emergencyContacts: { security: '+27 11 248 5201', medical: '+27 11 248 5202', fire: '10177' },
      defibrillatorLocations: ['Key areas']
    },
    transportation: {
      publicTransport: ['Shuttle Services'],
      shuttle: true,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: true,
    tags: ['theme-park', 'casino', 'family', 'historic']
  },
  {
    id: 'emperors-palace',
    name: 'Emperors Palace Casino Entertainment Complex',
    type: 'entertainment',
    description: 'Luxury casino and entertainment complex near OR Tambo Airport with Roman theme.',
    shortDescription: 'Luxury Roman-themed casino complex',
    headerImage: 'https://images.unsplash.com/photo-1489599210737-f47f2d15c818?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1489599210737-f47f2d15c818?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: '64 Jones Road, Kempton Park',
      city: 'Johannesburg',
      province: 'Gauteng',
      postalCode: '1627',
      coordinates: { latitude: -26.1420, longitude: 28.2198 }
    },
    contact: {
      phone: '+27 11 928 1000',
      website: 'https://www.emperorspalace.com'
    },
    openingHours: {
      monday: '24 hours',
      tuesday: '24 hours',
      wednesday: '24 hours',
      thursday: '24 hours',
      friday: '24 hours',
      saturday: '24 hours',
      sunday: '24 hours'
    },
    features: ['Roman Theme', 'Luxury Gaming', 'Airport Proximity', 'High-End Entertainment'],
    amenities: ['Casino', 'Hotels', 'Restaurants', 'Spa', 'Theater'],
    services: ['Gaming', 'Accommodation', 'Fine Dining', 'Entertainment'],
    rating: 4.4,
    reviewCount: 3800,
    levels: 4,
    totalArea: 95000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Gaming', 'Luxury', 'Hospitality', 'Entertainment'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['All Areas'],
      disabledParking: { available: true, spaces: 120, location: 'All areas' },
      audioNavigation: false,
      brailleSignage: false,
      hearingLoop: false,
      accessibleRestrooms: ['All floors'],
      guideDogFriendly: false,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 3,
      capacity: 5000,
      pricing: { hourly: 0, daily: 0 },
      paymentMethods: ['Free'],
      electricVehicleCharging: true,
      disabledSpaces: 120
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Luxury Safe Routes'],
      assemblyPoints: ['Resort Areas'],
      emergencyContacts: { security: '+27 11 928 1001', medical: '+27 11 928 1002', fire: '10177' },
      defibrillatorLocations: ['All major areas']
    },
    transportation: {
      publicTransport: ['Airport Shuttle'],
      shuttle: true,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: true,
    tags: ['luxury', 'casino', 'roman', 'airport']
  },
  {
    id: 'artscape-theatre',
    name: 'Artscape Theatre Complex',
    type: 'entertainment',
    description: 'Premier performing arts venue in Cape Town featuring opera, ballet, theater, and concerts.',
    shortDescription: 'Premier performing arts venue',
    headerImage: 'https://images.unsplash.com/photo-1489599210737-f47f2d15c818?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1489599210737-f47f2d15c818?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Darling Street',
      city: 'Cape Town',
      province: 'Western Cape',
      postalCode: '8001',
      coordinates: { latitude: -33.9233, longitude: 18.4224 }
    },
    contact: {
      phone: '+27 21 410 9800',
      website: 'https://www.artscape.co.za'
    },
    openingHours: {
      monday: '09:00 - 17:00',
      tuesday: '09:00 - 17:00',
      wednesday: '09:00 - 17:00',
      thursday: '09:00 - 17:00',
      friday: '09:00 - 17:00',
      saturday: 'Performance Days',
      sunday: 'Performance Days'
    },
    features: ['Opera House', 'Ballet', 'Theater', 'Concert Hall'],
    amenities: ['Multiple Theaters', 'Box Office', 'Restaurants', 'Bars'],
    services: ['Live Performances', 'Cultural Events', 'Education Programs'],
    rating: 4.6,
    reviewCount: 2200,
    levels: 6,
    totalArea: 55000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Arts', 'Culture', 'Performance', 'Education'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['All Theaters'],
      disabledParking: { available: true, spaces: 40, location: 'Theater complex' },
      audioNavigation: true,
      brailleSignage: true,
      hearingLoop: true,
      accessibleRestrooms: ['All levels'],
      guideDogFriendly: true,
      tactilePathways: true
    },
    parking: {
      available: true,
      levels: 2,
      capacity: 800,
      pricing: { hourly: 15, daily: 80 },
      paymentMethods: ['Card', 'Cash'],
      electricVehicleCharging: false,
      disabledSpaces: 40
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Theater Safe Routes'],
      assemblyPoints: ['Plaza Areas'],
      emergencyContacts: { security: '+27 21 410 9801', medical: '+27 21 410 9802', fire: '10177' },
      defibrillatorLocations: ['All theaters']
    },
    transportation: {
      publicTransport: ['MyCiTi Bus', 'Train Station'],
      shuttle: false,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: true,
    tags: ['theater', 'opera', 'culture', 'performing-arts']
  },
  {
    id: 'gateway-casino',
    name: 'Sibaya Casino and Entertainment Kingdom',
    type: 'entertainment',
    description: 'Coastal casino and entertainment complex north of Durban with gaming and shows.',
    shortDescription: 'Coastal casino entertainment complex',
    headerImage: 'https://images.unsplash.com/photo-1489599210737-f47f2d15c818?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1489599210737-f47f2d15c818?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: '1 Sibaya Drive, Umhlanga',
      city: 'Durban',
      province: 'KwaZulu-Natal',
      postalCode: '4320',
      coordinates: { latitude: -29.7139, longitude: 31.1186 }
    },
    contact: {
      phone: '+27 31 580 5000',
      website: 'https://www.sibaya.co.za'
    },
    openingHours: {
      monday: '24 hours',
      tuesday: '24 hours',
      wednesday: '24 hours',
      thursday: '24 hours',
      friday: '24 hours',
      saturday: '24 hours',
      sunday: '24 hours'
    },
    features: ['Coastal Location', 'Gaming', 'Entertainment Shows', 'Luxury Dining'],
    amenities: ['Casino', 'Restaurants', 'Bars', 'Theater', 'Hotels'],
    services: ['Gaming', 'Entertainment', 'Dining', 'Accommodation'],
    rating: 4.3,
    reviewCount: 2800,
    levels: 3,
    totalArea: 78000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Gaming', 'Entertainment', 'Hospitality', 'Dining'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['All Areas'],
      disabledParking: { available: true, spaces: 90, location: 'Casino area' },
      audioNavigation: false,
      brailleSignage: false,
      hearingLoop: false,
      accessibleRestrooms: ['All floors'],
      guideDogFriendly: false,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 2,
      capacity: 3500,
      pricing: { hourly: 0, daily: 0 },
      paymentMethods: ['Free'],
      electricVehicleCharging: true,
      disabledSpaces: 90
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Coastal Safe Routes'],
      assemblyPoints: ['Open Areas'],
      emergencyContacts: { security: '+27 31 580 5001', medical: '+27 31 580 5002', fire: '10177' },
      defibrillatorLocations: ['All major areas']
    },
    transportation: {
      publicTransport: ['Shuttle Services'],
      shuttle: true,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: true,
    tags: ['coastal', 'casino', 'entertainment', 'luxury']
  },
  {
    id: 'carnival-city',
    name: 'Carnival City Casino and Entertainment World',
    type: 'entertainment',
    description: 'Large entertainment complex with casino, hotels, restaurants, and family attractions.',
    shortDescription: 'Large casino and entertainment world',
    headerImage: 'https://images.unsplash.com/photo-1489599210737-f47f2d15c818?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1489599210737-f47f2d15c818?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Corner of R21 and R51, Brakpan',
      city: 'Johannesburg',
      province: 'Gauteng',
      postalCode: '1541',
      coordinates: { latitude: -26.2506, longitude: 28.3698 }
    },
    contact: {
      phone: '+27 11 928 7000',
      website: 'https://www.carnivalcity.co.za'
    },
    openingHours: {
      monday: '24 hours',
      tuesday: '24 hours',
      wednesday: '24 hours',
      thursday: '24 hours',
      friday: '24 hours',
      saturday: '24 hours',
      sunday: '24 hours'
    },
    features: ['Family Entertainment', 'Large Casino', 'Multiple Venues', 'Accommodation'],
    amenities: ['Casino', 'Hotels', 'Restaurants', 'Bars', 'Entertainment Areas'],
    services: ['Gaming', 'Accommodation', 'Dining', 'Family Entertainment'],
    rating: 4.1,
    reviewCount: 3400,
    levels: 4,
    totalArea: 105000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Gaming', 'Family', 'Hospitality', 'Entertainment'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['All Areas'],
      disabledParking: { available: true, spaces: 100, location: 'All areas' },
      audioNavigation: false,
      brailleSignage: false,
      hearingLoop: false,
      accessibleRestrooms: ['All floors'],
      guideDogFriendly: false,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 3,
      capacity: 4500,
      pricing: { hourly: 0, daily: 0 },
      paymentMethods: ['Free'],
      electricVehicleCharging: false,
      disabledSpaces: 100
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Multiple Exits'],
      assemblyPoints: ['Open Areas'],
      emergencyContacts: { security: '+27 11 928 7001', medical: '+27 11 928 7002', fire: '10177' },
      defibrillatorLocations: ['All major areas']
    },
    transportation: {
      publicTransport: ['Shuttle Services'],
      shuttle: true,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: false,
    tags: ['casino', 'family', 'large', 'entertainment']
  },
  {
    id: 'grand-arena',
    name: 'Grand Arena at GrandWest',
    type: 'entertainment',
    description: 'Premier entertainment venue in Cape Town hosting concerts, shows, and major events.',
    shortDescription: 'Premier concert and events venue',
    headerImage: 'https://images.unsplash.com/photo-1489599210737-f47f2d15c818?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1489599210737-f47f2d15c818?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: '1 Jakes Gerwel Drive, Goodwood',
      city: 'Cape Town',
      province: 'Western Cape',
      postalCode: '7460',
      coordinates: { latitude: -33.8994, longitude: 18.5352 }
    },
    contact: {
      phone: '+27 21 505 7777',
      website: 'https://www.grandarena.co.za'
    },
    openingHours: {
      monday: 'Event Days Only',
      tuesday: 'Event Days Only',
      wednesday: 'Event Days Only',
      thursday: 'Event Days Only',
      friday: 'Event Days Only',
      saturday: 'Event Days Only',
      sunday: 'Event Days Only'
    },
    features: ['Concert Hall', 'Major Events', 'International Acts', 'State-of-Art Sound'],
    amenities: ['Arena', 'VIP Areas', 'Bars', 'Merchandise'],
    services: ['Concerts', 'Shows', 'Corporate Events', 'Entertainment'],
    rating: 4.5,
    reviewCount: 2600,
    levels: 3,
    totalArea: 45000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Concerts', 'Events', 'Entertainment', 'Merchandise'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Arena Areas'],
      disabledParking: { available: true, spaces: 60, location: 'Arena area' },
      audioNavigation: true,
      brailleSignage: true,
      hearingLoop: true,
      accessibleRestrooms: ['All levels'],
      guideDogFriendly: true,
      tactilePathways: true
    },
    parking: {
      available: true,
      levels: 2,
      capacity: 2500,
      pricing: { hourly: 0, daily: 50 },
      paymentMethods: ['Card', 'Cash'],
      electricVehicleCharging: true,
      disabledSpaces: 60
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Arena Safe Routes'],
      assemblyPoints: ['Parking Areas'],
      emergencyContacts: { security: '+27 21 505 7700', medical: '+27 21 505 7701', fire: '10177' },
      defibrillatorLocations: ['Arena areas']
    },
    transportation: {
      publicTransport: ['Bus Routes'],
      shuttle: true,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: true,
    tags: ['arena', 'concerts', 'events', 'entertainment']
  },
  {
    id: 'flamingo-casino',
    name: 'Flamingo Casino Kimberley',
    type: 'entertainment',
    description: 'Diamond city casino offering gaming, dining, and entertainment in the Northern Cape.',
    shortDescription: 'Diamond city casino and entertainment',
    headerImage: 'https://images.unsplash.com/photo-1489599210737-f47f2d15c818?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1489599210737-f47f2d15c818?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: '142 Du Toitspan Road',
      city: 'Kimberley',
      province: 'Northern Cape',
      postalCode: '8301',
      coordinates: { latitude: -28.7320, longitude: 24.7539 }
    },
    contact: {
      phone: '+27 53 807 1000',
      website: 'https://www.flamingocasino.co.za'
    },
    openingHours: {
      monday: '24 hours',
      tuesday: '24 hours',
      wednesday: '24 hours',
      thursday: '24 hours',
      friday: '24 hours',
      saturday: '24 hours',
      sunday: '24 hours'
    },
    features: ['Diamond Heritage', 'Regional Casino', 'Local Entertainment', 'Historic Location'],
    amenities: ['Casino', 'Restaurants', 'Bars', 'Entertainment'],
    services: ['Gaming', 'Dining', 'Entertainment', 'Events'],
    rating: 3.9,
    reviewCount: 1200,
    levels: 2,
    totalArea: 35000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Gaming', 'Regional', 'Dining', 'Entertainment'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['Main Areas'],
      disabledParking: { available: true, spaces: 30, location: 'Casino area' },
      audioNavigation: false,
      brailleSignage: false,
      hearingLoop: false,
      accessibleRestrooms: ['Both floors'],
      guideDogFriendly: false,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 1,
      capacity: 800,
      pricing: { hourly: 0, daily: 0 },
      paymentMethods: ['Free'],
      electricVehicleCharging: false,
      disabledSpaces: 30
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Casino Exits'],
      assemblyPoints: ['Parking Areas'],
      emergencyContacts: { security: '+27 53 807 1001', medical: '+27 53 807 1002', fire: '10177' },
      defibrillatorLocations: ['Key areas']
    },
    transportation: {
      publicTransport: ['Limited'],
      shuttle: false,
      taxi: true,
      rideshare: false
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: false,
    tags: ['diamond-city', 'regional', 'casino', 'heritage']
  },
  {
    id: 'boardwalk-casino',
    name: 'Boardwalk Casino and Entertainment World',
    type: 'entertainment',
    description: 'Beachfront casino and entertainment complex in Port Elizabeth with ocean views.',
    shortDescription: 'Beachfront casino with ocean views',
    headerImage: 'https://images.unsplash.com/photo-1489599210737-f47f2d15c818?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1489599210737-f47f2d15c818?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
    location: {
      address: 'Marine Drive, Summerstrand',
      city: 'Gqeberha',
      province: 'Eastern Cape',
      postalCode: '6001',
      coordinates: { latitude: -33.9734, longitude: 25.6447 }
    },
    contact: {
      phone: '+27 41 507 7777',
      website: 'https://www.boardwalkcasino.co.za'
    },
    openingHours: {
      monday: '24 hours',
      tuesday: '24 hours',
      wednesday: '24 hours',
      thursday: '24 hours',
      friday: '24 hours',
      saturday: '24 hours',
      sunday: '24 hours'
    },
    features: ['Beachfront Location', 'Ocean Views', 'Casino Gaming', 'Beach Access'],
    amenities: ['Casino', 'Hotels', 'Restaurants', 'Beach Access', 'Conference Center'],
    services: ['Gaming', 'Accommodation', 'Dining', 'Beach Recreation'],
    rating: 4.2,
    reviewCount: 2100,
    levels: 3,
    totalArea: 65000,
    zones: [],
    floorPlans: [],
    entrances: [],
    stores: [],
    storeCategories: ['Gaming', 'Beach', 'Hospitality', 'Recreation'],
    accessibility: {
      wheelchairAccess: true,
      elevators: ['All Areas'],
      disabledParking: { available: true, spaces: 70, location: 'Casino area' },
      audioNavigation: false,
      brailleSignage: false,
      hearingLoop: false,
      accessibleRestrooms: ['All floors'],
      guideDogFriendly: false,
      tactilePathways: false
    },
    parking: {
      available: true,
      levels: 2,
      capacity: 2000,
      pricing: { hourly: 0, daily: 0 },
      paymentMethods: ['Free'],
      electricVehicleCharging: false,
      disabledSpaces: 70
    },
    promotions: [],
    events: [],
    emergency: {
      exitRoutes: ['Beach Safe Routes'],
      assemblyPoints: ['Beach Areas'],
      emergencyContacts: { security: '+27 41 507 7700', medical: '+27 41 507 7701', fire: '10177' },
      defibrillatorLocations: ['All major areas']
    },
    transportation: {
      publicTransport: ['Bus Routes'],
      shuttle: true,
      taxi: true,
      rideshare: true
    },
    lastUpdated: '2024-12-09',
    isActive: true,
    isFeatured: true,
    tags: ['beachfront', 'casino', 'ocean-views', 'recreation']
  }
];

// Function to get all venues across categories
export const getAllEnhancedVenues = (): EnhancedVenue[] => {
  return [
    ...shoppingMalls,
    ...airports,
    ...hospitals,
    ...universities,
    ...stadiums,
    ...governmentBuildings,
    ...entertainmentCenters
  ];
};

// Helper functions
export const getVenuesByCategory = (categoryId: string): EnhancedVenue[] => {
  switch (categoryId) {
    case 'shopping-malls':
      return shoppingMalls;
    case 'airports':
      return airports;
    case 'hospitals':
      return hospitals;
    case 'universities':
      return universities;
    case 'stadiums':
      return stadiums;
    case 'government':
      return governmentBuildings;
    case 'entertainment':
      return entertainmentCenters;
    default:
      return [];
  }
};

export const getEnhancedVenueById = (id: string): EnhancedVenue | undefined => {
  return getAllEnhancedVenues().find(venue => venue.id === id);
};

export const getFeaturedVenues = (): EnhancedVenue[] => {
  return getAllEnhancedVenues().filter(venue => venue.isFeatured);
};

export const searchVenues = (query: string): EnhancedVenue[] => {
  const allVenues = getAllEnhancedVenues();
  const lowercaseQuery = query.toLowerCase();
  
  return allVenues.filter(venue => 
    venue.name.toLowerCase().includes(lowercaseQuery) ||
    venue.description.toLowerCase().includes(lowercaseQuery) ||
    venue.location.city.toLowerCase().includes(lowercaseQuery) ||
    venue.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    venue.features.some(feature => feature.toLowerCase().includes(lowercaseQuery))
  );
};
