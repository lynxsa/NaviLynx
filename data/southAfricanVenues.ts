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
  image: string;
  description: string;
  venueCount: number;
  color: string;
}

export interface Deal {
  id: string;
  title: string;
  description: string;
  discount: string;
  image: string;
  venueId: string;
  venueName: string;
  validUntil: string;
  category: string;
  terms: string;
}

export interface Advertisement {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  venueId: string;
  venueName: string;
  type: 'featured' | 'promotion' | 'event';
  ctaText: string;
  validUntil?: string;
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
    description: 'Iconic waterfront shopping and entertainment destination with stunning harbor views and world-class attractions.',
    openingHours: 'Daily: 9:00-21:00',
    contact: {
      phone: '+27 21 408 7600',
      website: 'https://www.waterfront.co.za'
    },
    zones: ['Victoria Wharf', 'Alfred Mall', 'Amphitheatre', 'Two Oceans Aquarium', 'Zeitz Museum'],
    levels: 3,
    entrances: ['Main Entrance (Clock Tower)', 'Aquarium Entrance', 'Pierhead Entrance', 'Breakwater Boulevard'],
    accessibility: ['Full Wheelchair Access', 'Audio Tours', 'Braille Signage', 'Disabled Facilities'],
    parkingInfo: {
      available: true,
      levels: 3,
      capacity: 5000,
      pricing: 'R10 per hour, max R80 per day'
    }
  },
  {
    id: 'gateway-theatre',
    name: 'Gateway Theatre of Shopping',
    type: 'mall',
    image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    location: {
      city: 'Durban',
      province: 'KwaZulu-Natal',
      coordinates: { latitude: -29.7352, longitude: 31.0669 }
    },
    features: ['Wave Pool', 'Ice Rink', 'Indoor Navigation', 'Entertainment Hub', 'Largest Mall in Africa'],
    rating: 4.5,
    description: 'Africa\'s largest shopping center featuring unique entertainment attractions including wave pool and ice rink.',
    openingHours: 'Daily: 9:00-21:00',
    contact: {
      phone: '+27 31 566 0500',
      website: 'https://www.gatewayworld.co.za'
    },
    zones: ['Fashion Mall', 'Entertainment Centre', 'Wave House', 'Ice Rink', 'Food Court', 'Lifestyle Centre'],
    levels: 3,
    entrances: ['Main Entrance', 'Entertainment Entrance', 'Cinema Entrance', 'Wave House Entrance'],
    accessibility: ['Wheelchair Access', 'Accessible Restrooms', 'Guide Dog Friendly', 'Priority Parking'],
    parkingInfo: {
      available: true,
      levels: 4,
      capacity: 8000,
      pricing: 'R8 per hour, max R60 per day'
    }
  },
  {
    id: 'menlyn-park',
    name: 'Menlyn Park Shopping Centre',
    type: 'mall',
    image: 'https://images.unsplash.com/photo-1567496898669-ee935f5317ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    location: {
      city: 'Pretoria',
      province: 'Gauteng',
      coordinates: { latitude: -25.7842, longitude: 28.2770 }
    },
    features: ['Fashion Hub', 'Food Court', 'Indoor Navigation', 'Event Spaces', 'Premium Brands'],
    rating: 4.4,
    description: 'Premier shopping destination in Pretoria with over 400 stores, featuring top local and international brands.',
    openingHours: 'Mon-Sat: 9:00-21:00, Sun: 9:00-19:00',
    contact: {
      phone: '+27 12 348 3000',
      website: 'https://www.menlynpark.co.za'
    },
    zones: ['Fashion District', 'Electronics Quarter', 'Food Paradise', 'Home & Garden', 'Sports & Leisure'],
    levels: 2,
    entrances: ['Main Entrance (Atterbury Road)', 'Lois Avenue Entrance', 'Garsfontein Road Entrance'],
    accessibility: ['Full Access', 'Elevators', 'Accessible Parking', 'Support Services'],
    parkingInfo: {
      available: true,
      levels: 5,
      capacity: 6500,
      pricing: 'R6 per hour, max R45 per day'
    }
  },
  {
    id: 'canal-walk',
    name: 'Canal Walk Shopping Centre',
    type: 'mall',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    location: {
      city: 'Cape Town',
      province: 'Western Cape',
      coordinates: { latitude: -33.8830, longitude: 18.5102 }
    },
    features: ['Canal Design', 'Indoor Navigation', 'Cinema Complex', 'Ice Rink', 'Adventure Golf'],
    rating: 4.3,
    description: 'Unique canal-themed shopping center with over 400 stores and world-class entertainment facilities.',
    openingHours: 'Mon-Sat: 9:00-21:00, Sun: 9:00-19:00',
    contact: {
      phone: '+27 21 555 4444',
      website: 'https://www.canalwalk.co.za'
    },
    zones: ['Central Plaza', 'Fashion Avenue', 'Entertainment Quarter', 'Food Court', 'Canal Walk'],
    levels: 2,
    entrances: ['Main Entrance', 'Cinema Entrance', 'Ice Rink Entrance', 'Century City Entrance'],
    accessibility: ['Wheelchair Friendly', 'Lifts Available', 'Accessible Toilets', 'Reserved Parking'],
    parkingInfo: {
      available: true,
      levels: 3,
      capacity: 5500,
      pricing: 'R7 per hour, max R55 per day'
    }
  },

  {
    id: 'rosebank-mall',
    name: 'Rosebank Mall',
    type: 'mall',
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    location: {
      city: 'Rosebank',
      province: 'Gauteng',
      coordinates: { latitude: -26.1448, longitude: 28.0410 }
    },
    features: ['Rooftop Market', 'Art Gallery', 'Boutique Stores', 'African Craft Centre', 'Design District'],
    rating: 4.7,
    description: 'Trendy shopping destination in Rosebank featuring unique boutiques, African crafts, and creative spaces.',
    openingHours: 'Mon-Sat: 9:00-21:00, Sun: 9:00-18:00',
    contact: {
      phone: '+27 11 788 3900',
      website: 'https://www.rosebankmall.co.za'
    },
    zones: ['Ground Floor Retail', 'Rooftop Market', 'Gallery Level', 'Food Court', 'African Craft Market'],
    levels: 3,
    entrances: ['Main Oxford Road Entrance', 'Cradock Avenue Entrance', 'Rooftop Market Entrance'],
    accessibility: ['Wheelchair Friendly', 'Lifts Available', 'Accessible Toilets', 'Guide Dog Friendly'],
    parkingInfo: {
      available: true,
      levels: 2,
      capacity: 800,
      pricing: 'R5 per hour, max R40 per day'
    }
  },

  // AIRPORTS
  {
    id: 'or-tambo',
    name: 'OR Tambo International Airport',
    type: 'airport',
    image: 'https://images.unsplash.com/photo-1556388158-158dc78b206e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    location: {
      city: 'Johannesburg',
      province: 'Gauteng',
      coordinates: { latitude: -26.1367, longitude: 28.2411 }
    },
    features: ['Terminal Navigation', 'Flight Information', 'Shopping Areas', 'Parking Assistant', 'Busiest Airport in Africa'],
    rating: 4.2,
    description: 'Africa\'s busiest airport serving international and domestic flights with world-class facilities.',
    openingHours: '24/7',
    contact: {
      phone: '+27 11 921 6262',
      website: 'https://www.airports.co.za'
    },
    zones: ['Terminal A', 'Terminal B', 'International Departures', 'Domestic Departures', 'Arrivals Hall', 'Retail Zone'],
    levels: 6,
    entrances: ['International Departures', 'Domestic Departures', 'Arrivals Level', 'Parking Entrances'],
    accessibility: ['Full Accessibility', 'Assistance Services', 'Wheelchair Rentals', 'Audio Announcements'],
    parkingInfo: {
      available: true,
      levels: 8,
      capacity: 15000,
      pricing: 'Short-term: R15/hour, Long-term: R120/day'
    }
  },
  {
    id: 'cape-town-airport',
    name: 'Cape Town International Airport',
    type: 'airport',
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    location: {
      city: 'Cape Town',
      province: 'Western Cape',
      coordinates: { latitude: -33.9715, longitude: 18.6021 }
    },
    features: ['Modern Facilities', 'Mountain Views', 'Duty-Free Shopping', 'Car Rental Hub', 'Tourist Information'],
    rating: 4.4,
    description: 'Gateway to Cape Town with stunning Table Mountain views and excellent passenger facilities.',
    openingHours: '24/7',
    contact: {
      phone: '+27 21 937 1200',
      website: 'https://www.airports.co.za'
    },
    zones: ['International Terminal', 'Domestic Terminal', 'Arrivals', 'Departures', 'Shopping Area'],
    levels: 3,
    entrances: ['Main Terminal Entrance', 'Domestic Wing', 'Car Rental Area', 'Parking Entrances'],
    accessibility: ['Wheelchair Access', 'Assistance Desk', 'Accessible Restrooms', 'Priority Services'],
    parkingInfo: {
      available: true,
      levels: 4,
      capacity: 8000,
      pricing: 'Short-term: R18/hour, Long-term: R140/day'
    }
  },
  {
    id: 'king-shaka',
    name: 'King Shaka International Airport',
    type: 'airport',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    location: {
      city: 'Durban',
      province: 'KwaZulu-Natal',
      coordinates: { latitude: -29.6144, longitude: 31.1197 }
    },
    features: ['Modern Design', 'Duty-Free Shopping', 'Business Lounges', 'Transport Links', 'Cultural Displays'],
    rating: 4.1,
    description: 'Modern airport serving the Durban region with excellent connectivity to the city and surrounding areas.',
    openingHours: '24/7',
    contact: {
      phone: '+27 32 436 6000',
      website: 'https://www.airports.co.za'
    },
    zones: ['Main Terminal', 'International Area', 'Domestic Area', 'Retail Zone', 'Food Court'],
    levels: 2,
    entrances: ['Main Entrance', 'Departures Level', 'Arrivals Level', 'Car Park Entrance'],
    accessibility: ['Full Access', 'Special Assistance', 'Mobility Aid', 'Audio Visual Aids'],
    parkingInfo: {
      available: true,
      levels: 3,
      capacity: 6000,
      pricing: 'Short-term: R12/hour, Long-term: R100/day'
    }
  },

  // PARKS & RECREATIONAL AREAS
  {
    id: 'kruger-national-park',
    name: 'Kruger National Park',
    type: 'park',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    location: {
      city: 'Skukuza',
      province: 'Mpumalanga',
      coordinates: { latitude: -24.9947, longitude: 31.5914 }
    },
    features: ['Wildlife Navigation', 'Camp Locator', 'Game Drive Routes', 'Emergency Services', 'Conservation Info'],
    rating: 4.9,
    description: 'South Africa\'s largest game reserve, home to the Big Five and incredible biodiversity.',
    openingHours: 'Gates: 6:00-18:00 (varies by season)',
    contact: {
      phone: '+27 13 735 4000',
      website: 'https://www.sanparks.org'
    },
    zones: ['Skukuza Camp', 'Berg-en-Dal', 'Satara', 'Olifants', 'Letaba', 'Punda Maria'],
    levels: 1,
    entrances: ['Paul Kruger Gate', 'Phabeni Gate', 'Numbi Gate', 'Malelane Gate', 'Crocodile Bridge'],
    accessibility: ['Limited Access', 'Designated Routes', 'Accessible Facilities', 'Special Tours'],
    parkingInfo: {
      available: true,
      levels: 1,
      capacity: 2000,
      pricing: 'Included in park fees'
    }
  },
  {
    id: 'table-mountain',
    name: 'Table Mountain National Park',
    type: 'park',
    image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    location: {
      city: 'Cape Town',
      province: 'Western Cape',
      coordinates: { latitude: -33.9628, longitude: 18.4098 }
    },
    features: ['Hiking Trails', 'Cable Car', 'Scenic Views', 'Flora & Fauna', 'Photography Spots'],
    rating: 4.8,
    description: 'Iconic flat-topped mountain offering breathtaking views of Cape Town and surrounding areas.',
    openingHours: 'Cable Car: 8:00-18:00 (weather dependent)',
    contact: {
      phone: '+27 21 712 8527',
      website: 'https://www.sanparks.org'
    },
    zones: ['Lower Cableway', 'Upper Cableway', 'Platteklip Gorge', 'India Venster', 'Skeleton Gorge'],
    levels: 2,
    entrances: ['Lower Cableway Station', 'Tafelberg Road', 'Rhodes Memorial', 'Kirstenbosch'],
    accessibility: ['Cable Car Access', 'Limited Hiking Access', 'Viewing Platforms', 'Wheelchair Routes'],
    parkingInfo: {
      available: true,
      levels: 2,
      capacity: 800,
      pricing: 'R20 per day'
    }
  },

  // HOSPITALS
  {
    id: 'groote-schuur',
    name: 'Groote Schuur Hospital',
    type: 'hospital',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    location: {
      city: 'Cape Town',
      province: 'Western Cape',
      coordinates: { latitude: -33.9391, longitude: 18.4653 }
    },
    features: ['Emergency Navigation', 'Department Locator', 'Appointment Finder', 'Visitor Guidance', 'World-Class Care'],
    rating: 4.5,
    description: 'Leading academic hospital known for groundbreaking medical procedures including the first heart transplant.',
    openingHours: '24/7 Emergency, Departments vary',
    contact: {
      phone: '+27 21 404 9111',
      website: 'https://www.groote-schuur.uct.ac.za'
    },
    zones: ['Emergency Department', 'Cardiology', 'Oncology', 'Neurology', 'Pediatrics', 'Surgery'],
    levels: 12,
    entrances: ['Main Entrance', 'Emergency Entrance', 'Outpatient Entrance', 'Staff Entrance'],
    accessibility: ['Full Wheelchair Access', 'Accessible Lifts', 'Patient Transport', 'Special Needs Support'],
    parkingInfo: {
      available: true,
      levels: 3,
      capacity: 1200,
      pricing: 'R10 per hour, R50 per day'
    }
  },
  {
    id: 'charlotte-maxeke',
    name: 'Charlotte Maxeke Johannesburg Academic Hospital',
    type: 'hospital',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    location: {
      city: 'Johannesburg',
      province: 'Gauteng',
      coordinates: { latitude: -26.1947, longitude: 28.0294 }
    },
    features: ['Trauma Center', 'Specialist Units', 'Teaching Hospital', 'Emergency Services', 'Research Facilities'],
    rating: 4.2,
    description: 'Major academic hospital providing comprehensive healthcare services and medical training.',
    openingHours: '24/7 Emergency, Departments vary',
    contact: {
      phone: '+27 11 488 4911',
      website: 'https://www.wits.ac.za/medicine'
    },
    zones: ['Trauma Unit', 'Medical Wards', 'Surgical Wards', 'ICU', 'Outpatients', 'Radiology'],
    levels: 15,
    entrances: ['Main Entrance', 'Casualty Entrance', 'Outpatient Entrance', 'Staff Parking Entrance'],
    accessibility: ['Wheelchair Access', 'Accessible Facilities', 'Patient Assistance', 'Special Transport'],
    parkingInfo: {
      available: true,
      levels: 4,
      capacity: 1000,
      pricing: 'R8 per hour, R40 per day'
    }
  },

  // STADIUMS
  {
    id: 'fnb-stadium',
    name: 'FNB Stadium (Soccer City)',
    type: 'stadium',
    image: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    location: {
      city: 'Johannesburg',
      province: 'Gauteng',
      coordinates: { latitude: -26.2349, longitude: 27.9820 }
    },
    features: ['Seat Finder', 'Concession Locator', 'Emergency Exits', 'VIP Areas', 'Largest Stadium in Africa'],
    rating: 4.7,
    description: 'Africa\'s largest stadium, host to the 2010 FIFA World Cup Final and major sporting events.',
    openingHours: 'Event days only, Tours: 9:00-16:00',
    contact: {
      phone: '+27 11 941 8787',
      website: 'https://www.fnbstadium.co.za'
    },
    zones: ['Lower Tier', 'Upper Tier', 'VIP Boxes', 'Hospitality Suites', 'Media Center', 'Player Areas'],
    levels: 3,
    entrances: ['Gate A (North)', 'Gate B (East)', 'Gate C (South)', 'Gate D (West)', 'VIP Entrance'],
    accessibility: ['Wheelchair Seating', 'Accessible Restrooms', 'Lifts Available', 'Audio Description'],
    parkingInfo: {
      available: true,
      levels: 2,
      capacity: 8000,
      pricing: 'R50 per event'
    }
  },
  {
    id: 'dhl-stadium',
    name: 'DHL Stadium (Cape Town Stadium)',
    type: 'stadium',
    image: 'https://images.unsplash.com/photo-1594736797933-d0400caa7f7c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    location: {
      city: 'Cape Town',
      province: 'Western Cape',
      coordinates: { latitude: -33.9034, longitude: 18.4114 }
    },
    features: ['Waterfront Views', 'Modern Facilities', 'Event Navigation', 'Premium Seating', 'Iconic Design'],
    rating: 4.6,
    description: 'Stunning modern stadium with Table Mountain backdrop, host to rugby and soccer matches.',
    openingHours: 'Event days only, Tours: 10:00-15:00',
    contact: {
      phone: '+27 21 417 0000',
      website: 'https://www.capetownstadium.co.za'
    },
    zones: ['East Stand', 'West Stand', 'North Stand', 'South Stand', 'Club Level', 'Sky Boxes'],
    levels: 4,
    entrances: ['North Entrance', 'South Entrance', 'East Entrance', 'West Entrance', 'Club Entrance'],
    accessibility: ['Full Access', 'Wheelchair Platforms', 'Accessible Parking', 'Special Services'],
    parkingInfo: {
      available: true,
      levels: 1,
      capacity: 3000,
      pricing: 'R40 per event'
    }
  },

  // UNIVERSITIES
  {
    id: 'university-cape-town',
    name: 'University of Cape Town',
    type: 'university',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    location: {
      city: 'Cape Town',
      province: 'Western Cape',
      coordinates: { latitude: -33.9570, longitude: 18.4612 }
    },
    features: ['Campus Navigation', 'Building Locator', 'Lecture Hall Finder', 'Library Access', 'Top-Ranked University'],
    rating: 4.8,
    description: 'Africa\'s top-ranked university with stunning campus set against Table Mountain.',
    openingHours: 'Campus: 24/7, Buildings vary',
    contact: {
      phone: '+27 21 650 9111',
      website: 'https://www.uct.ac.za'
    },
    zones: ['Upper Campus', 'Middle Campus', 'Health Sciences', 'Engineering', 'Commerce', 'Humanities'],
    levels: 1,
    entrances: ['Main Gate (University Avenue)', 'Medical School Entrance', 'Mowbray Entrance', 'Sports Centre'],
    accessibility: ['Wheelchair Routes', 'Accessible Buildings', 'Transport Services', 'Support Facilities'],
    parkingInfo: {
      available: true,
      levels: 1,
      capacity: 2500,
      pricing: 'R15 per day for visitors'
    }
  },
  {
    id: 'university-witwatersrand',
    name: 'University of the Witwatersrand',
    type: 'university',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    location: {
      city: 'Johannesburg',
      province: 'Gauteng',
      coordinates: { latitude: -26.1929, longitude: 28.0305 }
    },
    features: ['Campus Maps', 'Faculty Navigation', 'Research Centers', 'Student Services', 'Historic Campus'],
    rating: 4.6,
    description: 'Prestigious research university known for its medical school and diverse academic programs.',
    openingHours: 'Campus: 24/7, Buildings vary',
    contact: {
      phone: '+27 11 717 1000',
      website: 'https://www.wits.ac.za'
    },
    zones: ['East Campus', 'West Campus', 'Medical School', 'Engineering', 'Commerce Law Management', 'Science'],
    levels: 1,
    entrances: ['Main Gate (Yale Road)', 'Medical School Gate', 'Engineering Gate', 'West Campus Gate'],
    accessibility: ['Accessibility Services', 'Wheelchair Access', 'Adapted Facilities', 'Support Systems'],
    parkingInfo: {
      available: true,
      levels: 1,
      capacity: 3000,
      pricing: 'R12 per day for visitors'
    }
  },

  // GOVERNMENT BUILDINGS
  {
    id: 'union-buildings',
    name: 'Union Buildings',
    type: 'government',
    image: 'https://images.unsplash.com/photo-1590735213920-68192a487bc3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    location: {
      city: 'Pretoria',
      province: 'Gauteng',
      coordinates: { latitude: -25.7320, longitude: 28.2145 }
    },
    features: ['Public Tours', 'Historical Significance', 'Government Offices', 'Gardens', 'Presidential Office'],
    rating: 4.7,
    description: 'Seat of the South African government and official office of the President, architectural masterpiece.',
    openingHours: 'Tours: Mon-Fri 10:00, 14:00 (booking required)',
    contact: {
      phone: '+27 12 300 5200',
      website: 'https://www.gov.za'
    },
    zones: ['East Wing', 'West Wing', 'Amphitheatre', 'Government Gardens', 'Mandela Statue', 'Visitor Center'],
    levels: 3,
    entrances: ['Main Visitor Entrance', 'Government Avenue Entrance', 'Staff Entrances (restricted)'],
    accessibility: ['Limited Access', 'Guided Tours', 'Security Screening', 'Photography Restrictions'],
    parkingInfo: {
      available: true,
      levels: 1,
      capacity: 200,
      pricing: 'R20 per visit'
    }
  },
  {
    id: 'city-hall-cape-town',
    name: 'Cape Town City Hall',
    type: 'government',
    image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    location: {
      city: 'Cape Town',
      province: 'Western Cape',
      coordinates: { latitude: -33.9249, longitude: 18.4241 }
    },
    features: ['Historical Tours', 'Public Services', 'Council Chambers', 'Municipal Offices', 'Heritage Site'],
    rating: 4.4,
    description: 'Historic city hall featuring Edwardian architecture and serving as municipal headquarters.',
    openingHours: 'Mon-Fri: 8:00-16:30',
    contact: {
      phone: '+27 21 400 1111',
      website: 'https://www.capetown.gov.za'
    },
    zones: ['Council Chambers', 'Mayor\'s Office', 'Public Services', 'Administrative Offices', 'Historical Exhibits'],
    levels: 4,
    entrances: ['Main Entrance (Darling Street)', 'Staff Entrance', 'Public Services Entrance'],
    accessibility: ['Wheelchair Access', 'Accessible Lifts', 'Public Facilities', 'Assistance Available'],
    parkingInfo: {
      available: true,
      levels: 1,
      capacity: 150,
      pricing: 'R15 per hour'
    }
  }
];

export const categories: Category[] = [
  {
    id: 'shopping-malls',
    name: 'Shopping Malls',
    icon: 'storefront',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Navigate through South Africa\'s premier shopping destinations with indoor navigation and AR features',
    venueCount: 5,
    color: '#FF6B6B'
  },
  {
    id: 'airports',
    name: 'Airports',
    icon: 'airplane',
    image: 'https://images.unsplash.com/photo-1556388158-158dc78b206e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Terminal navigation made simple with real-time flight information and facility locators',
    venueCount: 3,
    color: '#4ECDC4'
  },
  {
    id: 'parks',
    name: 'Parks & Recreation',
    icon: 'leaf',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Explore South Africa\'s natural wonders with trail maps and wildlife navigation',
    venueCount: 2,
    color: '#45B7D1'
  },
  {
    id: 'hospitals',
    name: 'Hospitals',
    icon: 'medical',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Navigate healthcare facilities with ease, find departments and emergency services quickly',
    venueCount: 2,
    color: '#96CEB4'
  },
  {
    id: 'stadiums',
    name: 'Stadiums',
    icon: 'trophy',
    image: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Find your seats, concessions, and facilities at major sporting venues across the country',
    venueCount: 2,
    color: '#FFEAA7'
  },
  {
    id: 'universities',
    name: 'Universities',
    icon: 'school',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Campus navigation for students and visitors, locate buildings, libraries, and facilities',
    venueCount: 2,
    color: '#DDA0DD'
  },
  {
    id: 'government',
    name: 'Government Buildings',
    icon: 'business',
    image: 'https://images.unsplash.com/photo-1590735213920-68192a487bc3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Navigate government facilities and public service buildings with guided assistance',
    venueCount: 2,
    color: '#74B9FF'
  }
];

export const deals: Deal[] = [
  {
    id: 'deal-1',
    title: '30% Off Fashion at Sandton City',
    description: 'Exclusive discount on selected fashion brands',
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3',
    venueId: 'sandton-city',
    venueName: 'Sandton City',
    validUntil: '2024-12-31',
    category: 'Fashion',
    terms: 'Valid on selected items. Cannot be combined with other offers.'
  },
  {
    id: 'deal-2',
    title: 'Free Parking at V&A Waterfront',
    description: 'First 2 hours free with any purchase',
    discount: 'Free',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3',
    venueId: 'v-a-waterfront',
    venueName: 'V&A Waterfront',
    validUntil: '2024-12-15',
    category: 'Parking',
    terms: 'Minimum purchase of R200 required. Show receipt at parking.'
  },
  {
    id: 'deal-3',
    title: 'Gateway Entertainment Package',
    description: 'Ice skating + movie + meal combo',
    discount: '25%',
    image: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?ixlib=rb-4.0.3',
    venueId: 'gateway-theatre',
    venueName: 'Gateway Theatre',
    validUntil: '2024-12-20',
    category: 'Entertainment',
    terms: 'Package deal valid weekdays only. Advance booking required.'
  }
];

export const advertisements: Advertisement[] = [
  {
    id: 'ad-1',
    title: 'Black Friday Sale',
    subtitle: 'Up to 70% off at Sandton City',
    image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?ixlib=rb-4.0.3',
    venueId: 'sandton-city',
    venueName: 'Sandton City',
    type: 'promotion',
    ctaText: 'Shop Now',
    validUntil: '2024-11-29'
  },
  {
    id: 'ad-2',
    title: 'Summer Festival',
    subtitle: 'Live music at V&A Waterfront',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3',
    venueId: 'v-a-waterfront',
    venueName: 'V&A Waterfront',
    type: 'event',
    ctaText: 'Get Tickets'
  },
  {
    id: 'ad-3',
    title: 'New Store Opening',
    subtitle: 'Premium tech store at Gateway',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3',
    venueId: 'gateway-theatre',
    venueName: 'Gateway Theatre',
    type: 'featured',
    ctaText: 'Visit Store'
  }
];

// Mock BLE beacons for indoor positioning
export const mockBLEBeacons = [
  { id: 'beacon-1', uuid: 'f7826da6-4fa2-4e98-8024-bc5b71e0893e', major: 1, minor: 1, location: 'Entrance' },
  { id: 'beacon-2', uuid: 'f7826da6-4fa2-4e98-8024-bc5b71e0893e', major: 1, minor: 2, location: 'Food Court' },
  { id: 'beacon-3', uuid: 'f7826da6-4fa2-4e98-8024-bc5b71e0893e', major: 1, minor: 3, location: 'Parking Level 1' }
];

// Helper functions for venue and category operations
export function getVenuesByCategory(categoryId: string): Venue[] {
  const categoryTypeMap: Record<string, string> = {
    'shopping-malls': 'mall',
    'airports': 'airport',
    'parks': 'park',
    'hospitals': 'hospital',
    'stadiums': 'stadium',
    'universities': 'university',
    'government': 'government'
  };
  
  const venueType = categoryTypeMap[categoryId];
  return southAfricanVenues.filter(venue => venue.type === venueType);
}

export function getVenueById(venueId: string): Venue | undefined {
  return southAfricanVenues.find(venue => venue.id === venueId);
}

export function getCategoryById(categoryId: string): Category | undefined {
  return categories.find(category => category.id === categoryId);
}

export function getTopRatedVenues(limit: number = 5): Venue[] {
  return [...southAfricanVenues]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

export function getFeaturedVenues(): Venue[] {
  // Return a curated list of featured venues from different categories
  return [
    getVenueById('sandton-city'),
    getVenueById('v-a-waterfront'),
    getVenueById('or-tambo'),
    getVenueById('kruger-national-park'),
    getVenueById('fnb-stadium'),
    getVenueById('university-cape-town'),
    getVenueById('union-buildings')
  ].filter(Boolean) as Venue[];
}

export function getRandomVenues(limit: number = 3): Venue[] {
  const shuffled = [...southAfricanVenues].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, limit);
}

export function searchVenues(query: string): Venue[] {
  const lowercaseQuery = query.toLowerCase();
  return southAfricanVenues.filter(venue => 
    venue.name.toLowerCase().includes(lowercaseQuery) ||
    venue.description.toLowerCase().includes(lowercaseQuery) ||
    venue.location.city.toLowerCase().includes(lowercaseQuery) ||
    venue.location.province.toLowerCase().includes(lowercaseQuery) ||
    venue.features.some(feature => feature.toLowerCase().includes(lowercaseQuery))
  );
}

export function getVenuesByProvince(province: string): Venue[] {
  return southAfricanVenues.filter(venue => 
    venue.location.province.toLowerCase() === province.toLowerCase()
  );
}

export function getVenuesByCity(city: string): Venue[] {
  return southAfricanVenues.filter(venue => 
    venue.location.city.toLowerCase() === city.toLowerCase()
  );
}

export function getNearbyVenues(latitude: number, longitude: number, radiusKm: number = 50): Venue[] {
  // Simple distance calculation (Haversine formula approximation)
  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  return southAfricanVenues.filter(venue => {
    const distance = calculateDistance(
      latitude, longitude, 
      venue.location.coordinates.latitude, 
      venue.location.coordinates.longitude
    );
    return distance <= radiusKm;
  });
}

export function getVenueStats() {
  const totalVenues = southAfricanVenues.length;
  const avgRating = southAfricanVenues.reduce((sum, venue) => sum + venue.rating, 0) / totalVenues;
  const provinces = [...new Set(southAfricanVenues.map(v => v.location.province))];
  const cities = [...new Set(southAfricanVenues.map(v => v.location.city))];
  
  return {
    totalVenues,
    avgRating: Math.round(avgRating * 10) / 10,
    provincesCount: provinces.length,
    citiesCount: cities.length,
    categoryCount: categories.length,
    topRatedVenue: getTopRatedVenues(1)[0]?.name || 'N/A'
  };
}

// Mock data for app statistics
export function getAppStats() {
  return {
    totalNavigations: 12847,
    activeUsers: 3421,
    venuesWithAR: southAfricanVenues.filter(v => v.features.includes('AR')).length,
    avgSessionTime: '8.5 min'
  };
}
