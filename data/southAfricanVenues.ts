// South African venues data with real images and comprehensive information
export interface Venue {
  id: string;
  name: string;
  type: 'mall' | 'airport' | 'park' | 'hospital' | 'stadium' | 'university' | 'government';
  image: string;
  location: {
    city: string;
    province: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  features: string[];
  rating: number;
  description: string;
  openingHours: string;
  contact: {
    phone: string;
    website: string;
  };
  zones?: string[];
  levels?: number;
  entrances?: string[];
  accessibility?: string[];
  parkingInfo?: {
    available: boolean;
    levels: number;
    capacity: number;
    pricing: string;
  };
  stores?: Store[];
}

export interface Store {
  id: string;
  name: string;
  category: string;
  level: number;
  description: string;
  image: string;
  openingHours: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  venueCount: number;
}

export interface Deal {
  id: string;
  title: string;
  description: string;
  discount: string;
  validUntil: string;
  image: string;
  venueName: string;
  venueId: string;
  category: string;
}

export interface Advertisement {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  venueName: string;
  venueId: string;
  ctaText: string;
  priority: number;
  type: string;
}

// Real South African venues with actual images - Comprehensive dataset
export const southAfricanVenues: Venue[] = [
  // SHOPPING MALLS
  {
    id: 'sandton-city',
    name: 'Sandton City',
    type: 'mall',
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    location: {
      city: 'Sandton',
      province: 'Gauteng',
      coordinates: { latitude: -26.1076, longitude: 28.0567 }
    },
    features: ['Indoor Navigation', 'AR Shopping', 'Parking Assistant', 'Digital Concierge', 'Premium Shopping'],
    rating: 4.6,
    description: 'Premier shopping destination in the heart of Sandton with over 300 stores across luxury and mainstream brands.',
    openingHours: 'Mon-Sat: 9:00-21:00, Sun: 9:00-19:00',
    contact: {
      phone: '+27 11 217 6000',
      website: 'https://www.sandtoncity.co.za'
    },
    zones: ['Fashion Quarter', 'Food Court', 'Electronics Hub', 'Beauty & Health', 'Home & Lifestyle'],
    levels: 4,
    entrances: ['Main Entrance (Nelson Mandela Square)', 'Parking Level Entrances A-F', 'Sandton Station Entrance'],
    accessibility: ['Wheelchair Access', 'Elevators', 'Disabled Parking', 'Audio Navigation'],
    parkingInfo: {
      available: true,
      levels: 6,
      capacity: 7000,
      pricing: 'R5 per hour, max R50 per day'
    }
  },
  {
    id: 'v-a-waterfront',
    name: 'V&A Waterfront',
    type: 'mall',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    location: {
      city: 'Cape Town',
      province: 'Western Cape',
      coordinates: { latitude: -33.9020, longitude: 18.4190 }
    },
    features: ['Waterfront Views', 'Indoor Navigation', 'Event Spaces', 'Tourist Information', 'Harbor Activities'],
    rating: 4.8,
    description: 'World-renowned waterfront destination combining shopping, dining, entertainment, and breathtaking harbor views.',
    openingHours: 'Daily: 9:00-21:00',
    contact: {
      phone: '+27 21 408 7600',
      website: 'https://www.waterfront.co.za'
    },
    zones: ['Victoria Wharf', 'Alfred Mall', 'Dock Road Jetty', 'Two Oceans Aquarium', 'Clock Tower Centre'],
    levels: 3,
    entrances: ['Main Waterfront Entrance', 'Alfred Mall Entrance', 'Breakwater Lodge Entrance', 'Aquarium Entrance'],
    accessibility: ['Wheelchair Friendly', 'Audio Guides Available', 'Sign Language Tours', 'Accessible Parking'],
    parkingInfo: {
      available: true,
      levels: 4,
      capacity: 6500,
      pricing: 'R6 per hour, max R80 per day'
    }
  }
];

// Helper functions for venue data
export const getTopRatedVenues = (limit: number = 10): Venue[] => {
  return southAfricanVenues
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};

export const getVenuesByType = (type: Venue['type']): Venue[] => {
  return southAfricanVenues.filter(venue => venue.type === type);
};

export const getVenueStats = () => {
  return {
    totalVenues: southAfricanVenues.length,
    avgRating: Math.round((southAfricanVenues.reduce((sum, venue) => sum + venue.rating, 0) / southAfricanVenues.length) * 10) / 10,
    provinces: [...new Set(southAfricanVenues.map(venue => venue.location.province))].length
  };
};

export const searchVenues = (query: string): Venue[] => {
  const lowercaseQuery = query.toLowerCase();
  return southAfricanVenues.filter(venue =>
    venue.name.toLowerCase().includes(lowercaseQuery) ||
    venue.description.toLowerCase().includes(lowercaseQuery) ||
    venue.location.city.toLowerCase().includes(lowercaseQuery) ||
    venue.features.some(feature => feature.toLowerCase().includes(lowercaseQuery))
  );
};

export const getVenueById = (id: string): Venue | undefined => {
  return southAfricanVenues.find(venue => venue.id === id);
};

// Sample advertisements
export const advertisements: Advertisement[] = [
  {
    id: 'ad_1',
    title: 'Summer Fashion Festival',
    subtitle: 'Up to 70% off premium brands',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    venueName: 'Sandton City',
    venueId: 'sandton-city',
    ctaText: 'Shop Now',
    priority: 1,
    type: 'promotion'
  },
  {
    id: 'ad_2',
    title: 'Waterfront Weekend',
    subtitle: 'Family fun activities & dining specials',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    venueName: 'V&A Waterfront',
    venueId: 'v-a-waterfront',
    ctaText: 'Explore',
    priority: 2,
    type: 'event'
  }
];