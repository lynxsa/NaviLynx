/**
 * Comprehensive Venue and Location Integration System
 * Real South African venues with BLE coordinates for precise indoor navigation
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
  altitude?: number;
}

export interface BLEBeacon {
  id: string;
  uuid: string;
  major: number;
  minor: number;
  coordinates: {
    x: number; // Indoor x coordinate (meters)
    y: number; // Indoor y coordinate (meters)
    floor: number; // Floor level
  };
  description: string;
  type: 'entrance' | 'store' | 'poi' | 'navigation' | 'emergency';
}

export interface POI {
  id: string;
  name: string;
  type: 'store' | 'restaurant' | 'service' | 'entertainment' | 'facility';
  category: string;
  description: string;
  floor: number;
  coordinates: {
    x: number;
    y: number;
  };
  openingHours: {
    [key: string]: string;
  };
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  features: string[];
  accessibility: string[];
  beaconId?: string;
}

export interface Venue {
  id: string;
  name: string;
  type: 'mall' | 'airport' | 'hospital' | 'university' | 'stadium' | 'office' | 'hotel';
  description: string;
  image: string;
  location: {
    address: string;
    city: string;
    province: string;
    country: string;
    postalCode: string;
    coordinates: Coordinates;
  };
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  operatingHours: {
    [key: string]: string;
  };
  features: string[];
  accessibility: string[];
  rating: number;
  levels: number;
  totalArea: number; // Square meters
  capacity: number;
  parking: {
    available: boolean;
    levels: number;
    capacity: number;
    pricing: string;
    coordinates: Coordinates;
  };
  beacons: BLEBeacon[];
  pois: POI[];
  floorPlans: {
    [floor: number]: {
      imageUrl: string;
      scale: number; // meters per pixel
      origin: { x: number; y: number }; // Real-world coordinates of (0,0)
    };
  };
  navigationGraph: {
    nodes: {
      id: string;
      x: number;
      y: number;
      floor: number;
      type: 'walkway' | 'elevator' | 'escalator' | 'stairs' | 'entrance';
    }[];
    edges: {
      from: string;
      to: string;
      weight: number; // Distance in meters
      accessibility: 'all' | 'stairs-required' | 'elevator-required';
    }[];
  };
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'maintenance' | 'closed';
}

// Real South African venues with comprehensive data and BLE integration
export const comprehensiveVenues: Venue[] = [
  {
    id: 'sandton-city',
    name: 'Sandton City',
    type: 'mall',
    description: 'Africa\'s premier shopping destination in the heart of Sandton, featuring over 300 stores, luxury brands, and world-class dining experiences.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
    location: {
      address: '83 Rivonia Road, Sandhurst',
      city: 'Sandton',
      province: 'Gauteng',
      country: 'South Africa',
      postalCode: '2196',
      coordinates: {
        latitude: -26.107658,
        longitude: 28.056725,
        altitude: 1753
      }
    },
    contact: {
      phone: '+27 11 217 6000',
      email: 'info@sandtoncity.co.za',
      website: 'https://www.sandtoncity.co.za'
    },
    operatingHours: {
      'Monday': '9:00 AM - 7:00 PM',
      'Tuesday': '9:00 AM - 7:00 PM',
      'Wednesday': '9:00 AM - 7:00 PM',
      'Thursday': '9:00 AM - 7:00 PM',
      'Friday': '9:00 AM - 9:00 PM',
      'Saturday': '9:00 AM - 9:00 PM',
      'Sunday': '9:00 AM - 6:00 PM'
    },
    features: [
      'Luxury Shopping',
      'Fine Dining',
      'Cinema Complex',
      'Banking Services',
      'Concierge Services',
      'Valet Parking',
      'Free WiFi',
      'Currency Exchange'
    ],
    accessibility: [
      'Wheelchair Access',
      'Braille Signage',
      'Audio Announcements',
      'Accessible Parking',
      'Accessible Restrooms',
      'Hearing Loop Systems'
    ],
    rating: 4.6,
    levels: 5,
    totalArea: 128000, // 128,000 square meters
    capacity: 50000,
    parking: {
      available: true,
      levels: 7,
      capacity: 7000,
      pricing: 'R15/hour, R45/day',
      coordinates: {
        latitude: -26.107858,
        longitude: 28.056925
      }
    },
    beacons: [
      {
        id: 'sc-entrance-main',
        uuid: 'f7826da6-4fa2-4e98-8024-bc5b71e0893e',
        major: 1,
        minor: 1,
        coordinates: { x: 0, y: 0, floor: 0 },
        description: 'Main Entrance',
        type: 'entrance'
      },
      {
        id: 'sc-entrance-north',
        uuid: 'f7826da6-4fa2-4e98-8024-bc5b71e0893e',
        major: 1,
        minor: 2,
        coordinates: { x: 150, y: 200, floor: 0 },
        description: 'North Entrance',
        type: 'entrance'
      },
      {
        id: 'sc-foodcourt-l2',
        uuid: 'f7826da6-4fa2-4e98-8024-bc5b71e0893e',
        major: 1,
        minor: 10,
        coordinates: { x: 100, y: 80, floor: 2 },
        description: 'Food Court Level 2',
        type: 'poi'
      },
      {
        id: 'sc-cinema-l4',
        uuid: 'f7826da6-4fa2-4e98-8024-bc5b71e0893e',
        major: 1,
        minor: 20,
        coordinates: { x: 120, y: 150, floor: 4 },
        description: 'Cinema Complex Level 4',
        type: 'entertainment'
      },
      {
        id: 'sc-luxury-l1',
        uuid: 'f7826da6-4fa2-4e98-8024-bc5b71e0893e',
        major: 1,
        minor: 5,
        coordinates: { x: 80, y: 60, floor: 1 },
        description: 'Luxury Fashion Quarter',
        type: 'store'
      }
    ],
    pois: [
      {
        id: 'sc-woolworths',
        name: 'Woolworths',
        type: 'store',
        category: 'Department Store',
        description: 'Premium department store with fashion, food, and home goods',
        floor: 0,
        coordinates: { x: 45, y: 30 },
        openingHours: {
          'Monday-Saturday': '9:00 AM - 9:00 PM',
          'Sunday': '9:00 AM - 6:00 PM'
        },
        contact: {
          phone: '+27 11 358 5400',
          website: 'https://woolworths.co.za'
        },
        features: ['Fashion', 'Food', 'Home', 'Beauty'],
        accessibility: ['Wheelchair Access', 'Wide Aisles'],
        beaconId: 'sc-woolworths-beacon'
      },
      {
        id: 'sc-mcdonalds',
        name: 'McDonald\'s',
        type: 'restaurant',
        category: 'Fast Food',
        description: 'International fast food chain',
        floor: 2,
        coordinates: { x: 95, y: 75 },
        openingHours: {
          'Monday-Sunday': '6:00 AM - 11:00 PM'
        },
        features: ['Drive Through', 'Kids Play Area', 'WiFi'],
        accessibility: ['Wheelchair Access', 'Accessible Seating'],
        beaconId: 'sc-foodcourt-l2'
      },
      {
        id: 'sc-information',
        name: 'Information Desk',
        type: 'service',
        category: 'Customer Service',
        description: 'Main information and customer service desk',
        floor: 0,
        coordinates: { x: 20, y: 15 },
        openingHours: {
          'Monday-Sunday': '9:00 AM - 9:00 PM'
        },
        features: ['Tourist Information', 'Lost & Found', 'Wheelchair Rental'],
        accessibility: ['Full Accessibility', 'Multi-language Support']
      }
    ],
    floorPlans: {
      0: {
        imageUrl: '/floor-plans/sandton-city-ground.jpg',
        scale: 0.5, // 0.5 meters per pixel
        origin: { x: -26.107658, y: 28.056725 }
      },
      1: {
        imageUrl: '/floor-plans/sandton-city-level1.jpg',
        scale: 0.5,
        origin: { x: -26.107658, y: 28.056725 }
      },
      2: {
        imageUrl: '/floor-plans/sandton-city-level2.jpg',
        scale: 0.5,
        origin: { x: -26.107658, y: 28.056725 }
      }
    },
    navigationGraph: {
      nodes: [
        { id: 'n1', x: 0, y: 0, floor: 0, type: 'entrance' },
        { id: 'n2', x: 50, y: 0, floor: 0, type: 'walkway' },
        { id: 'n3', x: 100, y: 0, floor: 0, type: 'walkway' },
        { id: 'e1', x: 50, y: 25, floor: 0, type: 'elevator' },
        { id: 'e1_l1', x: 50, y: 25, floor: 1, type: 'elevator' },
        { id: 'e1_l2', x: 50, y: 25, floor: 2, type: 'elevator' }
      ],
      edges: [
        { from: 'n1', to: 'n2', weight: 50, accessibility: 'all' },
        { from: 'n2', to: 'n3', weight: 50, accessibility: 'all' },
        { from: 'n2', to: 'e1', weight: 25, accessibility: 'all' },
        { from: 'e1', to: 'e1_l1', weight: 5, accessibility: 'elevator-required' },
        { from: 'e1_l1', to: 'e1_l2', weight: 5, accessibility: 'elevator-required' }
      ]
    },
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-30T12:00:00Z',
    status: 'active'
  },

  {
    id: 'va-waterfront',
    name: 'V&A Waterfront',
    type: 'mall',
    description: 'Historic working waterfront and South Africa\'s most visited destination, offering shopping, dining, entertainment, and breathtaking harbor views.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    location: {
      address: 'Dock Road Wharf, Victoria & Alfred Waterfront',
      city: 'Cape Town',
      province: 'Western Cape',
      country: 'South Africa',
      postalCode: '8001',
      coordinates: {
        latitude: -33.902248,
        longitude: 18.419390,
        altitude: 10
      }
    },
    contact: {
      phone: '+27 21 408 7600',
      email: 'info@waterfront.co.za',
      website: 'https://www.waterfront.co.za'
    },
    operatingHours: {
      'Monday': '9:00 AM - 9:00 PM',
      'Tuesday': '9:00 AM - 9:00 PM',
      'Wednesday': '9:00 AM - 9:00 PM',
      'Thursday': '9:00 AM - 9:00 PM',
      'Friday': '9:00 AM - 9:00 PM',
      'Saturday': '9:00 AM - 9:00 PM',
      'Sunday': '9:00 AM - 9:00 PM'
    },
    features: [
      'Waterfront Views',
      'Two Oceans Aquarium',
      'Zeitz Museum',
      'Craft Market',
      'Harbor Cruises',
      'Helicopter Tours',
      'Wine Tasting',
      'Street Performers'
    ],
    accessibility: [
      'Wheelchair Access',
      'Accessible Parking',
      'Audio Tours',
      'Braille Maps',
      'Sign Language Services'
    ],
    rating: 4.7,
    levels: 3,
    totalArea: 123000,
    capacity: 24000,
    parking: {
      available: true,
      levels: 4,
      capacity: 6500,
      pricing: 'R20/hour, R80/day',
      coordinates: {
        latitude: -33.902048,
        longitude: 18.419190
      }
    },
    beacons: [
      {
        id: 'va-entrance-clocktower',
        uuid: 'f7826da6-4fa2-4e98-8024-bc5b71e0893f',
        major: 2,
        minor: 1,
        coordinates: { x: 0, y: 0, floor: 0 },
        description: 'Clock Tower Entrance',
        type: 'entrance'
      },
      {
        id: 'va-aquarium',
        uuid: 'f7826da6-4fa2-4e98-8024-bc5b71e0893f',
        major: 2,
        minor: 10,
        coordinates: { x: 200, y: 100, floor: 0 },
        description: 'Two Oceans Aquarium',
        type: 'poi'
      },
      {
        id: 'va-amphitheatre',
        uuid: 'f7826da6-4fa2-4e98-8024-bc5b71e0893f',
        major: 2,
        minor: 5,
        coordinates: { x: 100, y: 150, floor: 0 },
        description: 'Amphitheatre',
        type: 'entertainment'
      }
    ],
    pois: [
      {
        id: 'va-aquarium-poi',
        name: 'Two Oceans Aquarium',
        type: 'entertainment',
        category: 'Aquarium',
        description: 'World-class aquarium showcasing marine life from two oceans',
        floor: 0,
        coordinates: { x: 200, y: 100 },
        openingHours: {
          'Monday-Sunday': '9:30 AM - 6:00 PM'
        },
        contact: {
          phone: '+27 21 418 3823',
          website: 'https://aquarium.co.za'
        },
        features: ['Marine Life', 'Educational Tours', 'Feeding Shows', 'Gift Shop'],
        accessibility: ['Wheelchair Access', 'Audio Descriptions', 'Tactile Exhibits'],
        beaconId: 'va-aquarium'
      },
      {
        id: 'va-zeitz',
        name: 'Zeitz Museum of Contemporary African Art',
        type: 'entertainment',
        category: 'Museum',
        description: 'Africa\'s largest museum of contemporary art',
        floor: 0,
        coordinates: { x: 300, y: 50 },
        openingHours: {
          'Wednesday-Sunday': '10:00 AM - 6:00 PM'
        },
        contact: {
          phone: '+27 21 418 2000',
          website: 'https://zeitzmocaa.museum'
        },
        features: ['Contemporary Art', 'Sculpture Garden', 'Art Shop', 'Restaurant'],
        accessibility: ['Full Accessibility', 'Audio Tours', 'Large Print Materials']
      }
    ],
    floorPlans: {
      0: {
        imageUrl: '/floor-plans/va-waterfront-ground.jpg',
        scale: 0.8,
        origin: { x: -33.902248, y: 18.419390 }
      }
    },
    navigationGraph: {
      nodes: [
        { id: 'va1', x: 0, y: 0, floor: 0, type: 'entrance' },
        { id: 'va2', x: 100, y: 50, floor: 0, type: 'walkway' },
        { id: 'va3', x: 200, y: 100, floor: 0, type: 'walkway' },
        { id: 'va4', x: 300, y: 50, floor: 0, type: 'walkway' }
      ],
      edges: [
        { from: 'va1', to: 'va2', weight: 111, accessibility: 'all' },
        { from: 'va2', to: 'va3', weight: 111, accessibility: 'all' },
        { from: 'va2', to: 'va4', weight: 200, accessibility: 'all' }
      ]
    },
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-30T12:00:00Z',
    status: 'active'
  },

  {
    id: 'menlyn-park',
    name: 'Menlyn Park Shopping Centre',
    type: 'mall',
    description: 'Super-regional shopping center in Pretoria, one of the largest malls in Africa with over 400 stores and comprehensive entertainment facilities.',
    image: 'https://images.unsplash.com/photo-1519201084643-86c4e0a7b4a6?w=800',
    location: {
      address: 'Corner Atterbury Road and Lois Avenue, Menlyn',
      city: 'Pretoria',
      province: 'Gauteng',
      country: 'South Africa',
      postalCode: '0181',
      coordinates: {
        latitude: -25.780847,
        longitude: 28.276598,
        altitude: 1339
      }
    },
    contact: {
      phone: '+27 12 348 3900',
      email: 'info@menlynpark.co.za',
      website: 'https://www.menlynpark.co.za'
    },
    operatingHours: {
      'Monday': '9:00 AM - 8:00 PM',
      'Tuesday': '9:00 AM - 8:00 PM',
      'Wednesday': '9:00 AM - 8:00 PM',
      'Thursday': '9:00 AM - 8:00 PM',
      'Friday': '9:00 AM - 9:00 PM',
      'Saturday': '9:00 AM - 9:00 PM',
      'Sunday': '9:00 AM - 6:00 PM'
    },
    features: [
      '400+ Stores',
      'IMAX Cinema',
      'Ice Skating Rink',
      'Bowling Alley',
      'Adventure Golf',
      'Food Court',
      'Gaming Zone',
      'Medical Center'
    ],
    accessibility: [
      'Wheelchair Access',
      'Accessible Parking',
      'Hearing Loops',
      'Braille Signage',
      'Accessible Restrooms'
    ],
    rating: 4.5,
    levels: 4,
    totalArea: 175000,
    capacity: 60000,
    parking: {
      available: true,
      levels: 6,
      capacity: 8000,
      pricing: 'R10/hour, R40/day',
      coordinates: {
        latitude: -25.781047,
        longitude: 28.276798
      }
    },
    beacons: [
      {
        id: 'mp-entrance-main',
        uuid: 'f7826da6-4fa2-4e98-8024-bc5b71e08940',
        major: 3,
        minor: 1,
        coordinates: { x: 0, y: 0, floor: 0 },
        description: 'Main Entrance',
        type: 'entrance'
      },
      {
        id: 'mp-cinema-l3',
        uuid: 'f7826da6-4fa2-4e98-8024-bc5b71e08940',
        major: 3,
        minor: 15,
        coordinates: { x: 150, y: 200, floor: 3 },
        description: 'IMAX Cinema Level 3',
        type: 'entertainment'
      },
      {
        id: 'mp-ice-rink',
        uuid: 'f7826da6-4fa2-4e98-8024-bc5b71e08940',
        major: 3,
        minor: 20,
        coordinates: { x: 100, y: 250, floor: 2 },
        description: 'Ice Skating Rink',
        type: 'entertainment'
      }
    ],
    pois: [
      {
        id: 'mp-game',
        name: 'Game',
        type: 'store',
        category: 'Electronics',
        description: 'Electronics and gaming superstore',
        floor: 1,
        coordinates: { x: 120, y: 80 },
        openingHours: {
          'Monday-Sunday': '9:00 AM - 9:00 PM'
        },
        features: ['Electronics', 'Gaming', 'Mobile Phones', 'Computers'],
        accessibility: ['Wheelchair Access', 'Wide Aisles']
      },
      {
        id: 'mp-food-court',
        name: 'Food Court',
        type: 'restaurant',
        category: 'Food Court',
        description: 'Large food court with diverse dining options',
        floor: 2,
        coordinates: { x: 180, y: 120 },
        openingHours: {
          'Monday-Sunday': '10:00 AM - 10:00 PM'
        },
        features: ['Multiple Cuisines', 'Seating for 800', 'Kids Play Area'],
        accessibility: ['Wheelchair Access', 'Accessible Seating', 'Easy Navigation']
      }
    ],
    floorPlans: {
      0: {
        imageUrl: '/floor-plans/menlyn-park-ground.jpg',
        scale: 0.6,
        origin: { x: -25.780847, y: 28.276598 }
      },
      1: {
        imageUrl: '/floor-plans/menlyn-park-level1.jpg',
        scale: 0.6,
        origin: { x: -25.780847, y: 28.276598 }
      },
      2: {
        imageUrl: '/floor-plans/menlyn-park-level2.jpg',
        scale: 0.6,
        origin: { x: -25.780847, y: 28.276598 }
      },
      3: {
        imageUrl: '/floor-plans/menlyn-park-level3.jpg',
        scale: 0.6,
        origin: { x: -25.780847, y: 28.276598 }
      }
    },
    navigationGraph: {
      nodes: [
        { id: 'mp1', x: 0, y: 0, floor: 0, type: 'entrance' },
        { id: 'mp2', x: 100, y: 50, floor: 0, type: 'walkway' },
        { id: 'mp3', x: 200, y: 100, floor: 0, type: 'walkway' },
        { id: 'mpe1', x: 100, y: 50, floor: 0, type: 'elevator' },
        { id: 'mpe1_l1', x: 100, y: 50, floor: 1, type: 'elevator' },
        { id: 'mpe1_l2', x: 100, y: 50, floor: 2, type: 'elevator' },
        { id: 'mpe1_l3', x: 100, y: 50, floor: 3, type: 'elevator' }
      ],
      edges: [
        { from: 'mp1', to: 'mp2', weight: 111, accessibility: 'all' },
        { from: 'mp2', to: 'mp3', weight: 111, accessibility: 'all' },
        { from: 'mp2', to: 'mpe1', weight: 0, accessibility: 'all' },
        { from: 'mpe1', to: 'mpe1_l1', weight: 5, accessibility: 'elevator-required' },
        { from: 'mpe1_l1', to: 'mpe1_l2', weight: 5, accessibility: 'elevator-required' },
        { from: 'mpe1_l2', to: 'mpe1_l3', weight: 5, accessibility: 'elevator-required' }
      ]
    },
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-30T12:00:00Z',
    status: 'active'
  },

  {
    id: 'or-tambo-airport',
    name: 'OR Tambo International Airport',
    type: 'airport',
    description: 'Africa\'s busiest airport and a major international gateway, serving millions of passengers annually with world-class facilities.',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800',
    location: {
      address: 'OR Tambo International Airport Road',
      city: 'Johannesburg',
      province: 'Gauteng',
      country: 'South Africa',
      postalCode: '1627',
      coordinates: {
        latitude: -26.139166,
        longitude: 28.246000,
        altitude: 1694
      }
    },
    contact: {
      phone: '+27 11 921 6262',
      email: 'info@airports.co.za',
      website: 'https://www.ortambo-airport.com'
    },
    operatingHours: {
      'Monday': '24 Hours',
      'Tuesday': '24 Hours',
      'Wednesday': '24 Hours',
      'Thursday': '24 Hours',
      'Friday': '24 Hours',
      'Saturday': '24 Hours',
      'Sunday': '24 Hours'
    },
    features: [
      'International Flights',
      'Duty-Free Shopping',
      'Premium Lounges',
      'Car Rental',
      'Hotels',
      'Medical Center',
      'Currency Exchange',
      'Conference Facilities'
    ],
    accessibility: [
      'Wheelchair Access',
      'Accessible Parking',
      'Audio Announcements',
      'Braille Signage',
      'Special Assistance',
      'Accessible Restrooms'
    ],
    rating: 4.3,
    levels: 3,
    totalArea: 697000,
    capacity: 28000000, // Annual passenger capacity
    parking: {
      available: true,
      levels: 8,
      capacity: 32000,
      pricing: 'R25/hour, R200/day',
      coordinates: {
        latitude: -26.138966,
        longitude: 28.245800
      }
    },
    beacons: [
      {
        id: 'ort-terminal-a',
        uuid: 'f7826da6-4fa2-4e98-8024-bc5b71e08941',
        major: 4,
        minor: 1,
        coordinates: { x: 0, y: 0, floor: 1 },
        description: 'Terminal A Entrance',
        type: 'entrance'
      },
      {
        id: 'ort-terminal-b',
        uuid: 'f7826da6-4fa2-4e98-8024-bc5b71e08941',
        major: 4,
        minor: 2,
        coordinates: { x: 500, y: 0, floor: 1 },
        description: 'Terminal B Entrance',
        type: 'entrance'
      },
      {
        id: 'ort-checkin-a',
        uuid: 'f7826da6-4fa2-4e98-8024-bc5b71e08941',
        major: 4,
        minor: 10,
        coordinates: { x: 100, y: 50, floor: 0 },
        description: 'Check-in Area A',
        type: 'poi'
      },
      {
        id: 'ort-security-a',
        uuid: 'f7826da6-4fa2-4e98-8024-bc5b71e08941',
        major: 4,
        minor: 15,
        coordinates: { x: 150, y: 100, floor: 1 },
        description: 'Security Checkpoint A',
        type: 'poi'
      }
    ],
    pois: [
      {
        id: 'ort-checkin-domestic',
        name: 'Domestic Check-in',
        type: 'service',
        category: 'Check-in',
        description: 'Domestic flight check-in counters',
        floor: 0,
        coordinates: { x: 100, y: 50 },
        openingHours: {
          'Monday-Sunday': '4:00 AM - 12:00 AM'
        },
        features: ['Self Check-in Kiosks', 'Bag Drop', 'Special Assistance'],
        accessibility: ['Wheelchair Access', 'Priority Lanes', 'Audio Assistance'],
        beaconId: 'ort-checkin-a'
      },
      {
        id: 'ort-duty-free',
        name: 'Duty Free Shopping',
        type: 'store',
        category: 'Retail',
        description: 'Tax-free shopping for international travelers',
        floor: 1,
        coordinates: { x: 200, y: 150 },
        openingHours: {
          'Monday-Sunday': '5:00 AM - 11:00 PM'
        },
        features: ['Alcohol', 'Perfumes', 'Electronics', 'South African Products'],
        accessibility: ['Wheelchair Access', 'Wide Aisles']
      }
    ],
    floorPlans: {
      0: {
        imageUrl: '/floor-plans/or-tambo-arrivals.jpg',
        scale: 1.0,
        origin: { x: -26.139166, y: 28.246000 }
      },
      1: {
        imageUrl: '/floor-plans/or-tambo-departures.jpg',
        scale: 1.0,
        origin: { x: -26.139166, y: 28.246000 }
      }
    },
    navigationGraph: {
      nodes: [
        { id: 'ort1', x: 0, y: 0, floor: 1, type: 'entrance' },
        { id: 'ort2', x: 500, y: 0, floor: 1, type: 'entrance' },
        { id: 'ort3', x: 100, y: 50, floor: 0, type: 'walkway' },
        { id: 'ort4', x: 150, y: 100, floor: 1, type: 'walkway' },
        { id: 'orte1', x: 250, y: 75, floor: 0, type: 'elevator' },
        { id: 'orte1_l1', x: 250, y: 75, floor: 1, type: 'elevator' }
      ],
      edges: [
        { from: 'ort1', to: 'ort4', weight: 141, accessibility: 'all' },
        { from: 'ort2', to: 'ort4', weight: 412, accessibility: 'all' },
        { from: 'ort3', to: 'orte1', weight: 180, accessibility: 'all' },
        { from: 'orte1', to: 'orte1_l1', weight: 5, accessibility: 'elevator-required' }
      ]
    },
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-30T12:00:00Z',
    status: 'active'
  }
];

// Utility functions for venue management
export const getVenueById = (id: string): Venue | undefined => {
  return comprehensiveVenues.find(venue => venue.id === id);
};

export const getVenuesByType = (type: Venue['type']): Venue[] => {
  return comprehensiveVenues.filter(venue => venue.type === type);
};

export const getVenuesByProvince = (province: string): Venue[] => {
  return comprehensiveVenues.filter(venue => 
    venue.location.province.toLowerCase() === province.toLowerCase()
  );
};

export const searchVenues = (query: string): Venue[] => {
  const lowercaseQuery = query.toLowerCase();
  return comprehensiveVenues.filter(venue =>
    venue.name.toLowerCase().includes(lowercaseQuery) ||
    venue.description.toLowerCase().includes(lowercaseQuery) ||
    venue.location.city.toLowerCase().includes(lowercaseQuery) ||
    venue.features.some(feature => feature.toLowerCase().includes(lowercaseQuery)) ||
    venue.pois.some(poi => poi.name.toLowerCase().includes(lowercaseQuery))
  );
};

export const getPOIsByVenue = (venueId: string): POI[] => {
  const venue = getVenueById(venueId);
  return venue?.pois || [];
};

export const getBeaconsByVenue = (venueId: string): BLEBeacon[] => {
  const venue = getVenueById(venueId);
  return venue?.beacons || [];
};

export const calculateDistance = (
  lat1: number, lon1: number, 
  lat2: number, lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c * 1000; // Return distance in meters
};

export const getVenuesNearLocation = (
  latitude: number, 
  longitude: number, 
  radiusMeters: number = 10000
): Venue[] => {
  return comprehensiveVenues.filter(venue => {
    const distance = calculateDistance(
      latitude, longitude,
      venue.location.coordinates.latitude,
      venue.location.coordinates.longitude
    );
    return distance <= radiusMeters;
  });
};

export const getVenueStats = () => {
  return {
    totalVenues: comprehensiveVenues.length,
    totalPOIs: comprehensiveVenues.reduce((sum, venue) => sum + venue.pois.length, 0),
    totalBeacons: comprehensiveVenues.reduce((sum, venue) => sum + venue.beacons.length, 0),
    avgRating: Math.round(
      (comprehensiveVenues.reduce((sum, venue) => sum + venue.rating, 0) / 
       comprehensiveVenues.length) * 10
    ) / 10,
    provinces: [...new Set(comprehensiveVenues.map(venue => venue.location.province))].length,
    cities: [...new Set(comprehensiveVenues.map(venue => venue.location.city))].length,
    venueTypes: [...new Set(comprehensiveVenues.map(venue => venue.type))].length
  };
};

export default comprehensiveVenues;
