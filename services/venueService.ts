
export interface Venue {
  id: string;
  name: string;
  category: VenueCategory;
  location: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  image?: string;
  description: string;
  features: string[];
  operatingHours: {
    [key: string]: string;
  };
  contactInfo: {
    phone?: string;
    email?: string;
    website?: string;
  };
  accessibility: string[];
  parking: {
    available: boolean;
    levels?: string[];
    cost?: string;
  };
}

export type VenueCategory = 'shopping' | 'airport' | 'hospital' | 'education' | 'convention';

export const venueCategories = {
  shopping: {
    title: 'Shopping Malls',
    icon: 'bag.fill',
    description: 'Major shopping centers and retail destinations'
  },
  airport: {
    title: 'Airports',
    icon: 'airplane',
    description: 'International and domestic airports'
  },
  hospital: {
    title: 'Hospitals',
    icon: 'cross.fill',
    description: 'Major healthcare facilities'
  },
  education: {
    title: 'Schools & Universities',
    icon: 'graduationcap.fill',
    description: 'Educational institutions'
  },
  convention: {
    title: 'Convention Centers',
    icon: 'building.2.fill',
    description: 'Event and conference venues'
  }
};

export const venues: Venue[] = [
  // Shopping Malls
  {
    id: '1',
    name: 'Sandton City',
    category: 'shopping',
    location: 'Sandton, Johannesburg',
    address: '83 Rivonia Rd, Sandhurst, Sandton, 2196',
    coordinates: { lat: -26.1074, lng: 28.0568 },
    image: 'https://picsum.photos/400/300?random=1',
    description: 'Premier shopping destination in the heart of Sandton with over 300 stores.',
    features: ['300+ Stores', 'Food Court', 'Cinema', 'Parking', 'WiFi'],
    operatingHours: {
      'Mon-Thu': '9:00 AM - 9:00 PM',
      'Fri-Sat': '9:00 AM - 10:00 PM',
      'Sun': '9:00 AM - 6:00 PM'
    },
    contactInfo: {
      phone: '+27 11 217 6000',
      website: 'https://sandtoncity.com'
    },
    accessibility: ['Wheelchair Access', 'Elevators', 'Disabled Parking'],
    parking: {
      available: true,
      levels: ['P1', 'P2', 'P3', 'Rooftop'],
      cost: 'R10/hour'
    }
  },
  {
    id: '2',
    name: 'Rosebank Mall',
    category: 'shopping',
    location: 'Rosebank, Johannesburg',
    address: '50 Bath Ave, Rosebank, Johannesburg, 2196',
    coordinates: { lat: -26.1464, lng: 28.0436 },
    image: 'https://picsum.photos/400/300?random=2',
    description: 'Trendy shopping mall in the vibrant Rosebank area.',
    features: ['200+ Stores', 'Restaurants', 'Art Gallery', 'Parking'],
    operatingHours: {
      'Mon-Sun': '9:00 AM - 9:00 PM'
    },
    contactInfo: {
      phone: '+27 11 788 3905',
      website: 'https://rosebankmall.co.za'
    },
    accessibility: ['Wheelchair Access', 'Elevators'],
    parking: {
      available: true,
      levels: ['Ground', 'P1', 'P2'],
      cost: 'R8/hour'
    }
  },
  {
    id: '3',
    name: 'Menlyn Park',
    category: 'shopping',
    location: 'Pretoria',
    address: 'Atterbury Rd & Lois Ave, Menlyn, Pretoria, 0181',
    coordinates: { lat: -25.7859, lng: 28.2775 },
    image: 'https://picsum.photos/400/300?random=3',
    description: 'Largest shopping center in Africa with extensive retail options.',
    features: ['500+ Stores', 'Entertainment', 'Food Court', 'Parking'],
    operatingHours: {
      'Mon-Thu': '9:00 AM - 9:00 PM',
      'Fri-Sat': '9:00 AM - 10:00 PM',
      'Sun': '9:00 AM - 6:00 PM'
    },
    contactInfo: {
      phone: '+27 12 348 3300'
    },
    accessibility: ['Full Wheelchair Access', 'Multiple Elevators'],
    parking: {
      available: true,
      levels: ['P1', 'P2', 'P3', 'P4'],
      cost: 'R12/hour'
    }
  },
  {
    id: '4',
    name: 'Gateway Theatre of Shopping',
    category: 'shopping',
    location: 'Umhlanga, Durban',
    address: '1 Palm Blvd, Umhlanga Ridge, Umhlanga, 4319',
    coordinates: { lat: -29.7272, lng: 31.0845 },
    image: 'https://picsum.photos/400/300?random=4',
    description: 'Premier shopping destination on the KwaZulu-Natal coast.',
    features: ['400+ Stores', 'Beach Access', 'Wave House', 'Parking'],
    operatingHours: {
      'Mon-Sun': '9:00 AM - 9:00 PM'
    },
    contactInfo: {
      phone: '+27 31 566 2000'
    },
    accessibility: ['Wheelchair Access', 'Elevators'],
    parking: {
      available: true,
      levels: ['P1', 'P2', 'P3'],
      cost: 'R10/hour'
    }
  },
  {
    id: '5',
    name: 'Mall of Africa',
    category: 'shopping',
    location: 'Midrand, Johannesburg',
    address: 'Lone Creek Cres, Waterfall City, Midrand, 1685',
    coordinates: { lat: -25.9269, lng: 28.1216 },
    image: 'https://picsum.photos/400/300?random=5',
    description: 'Modern super-regional shopping center in Waterfall City.',
    features: ['300+ Stores', 'Entertainment', 'Restaurants', 'Parking'],
    operatingHours: {
      'Mon-Thu': '9:00 AM - 9:00 PM',
      'Fri-Sat': '9:00 AM - 10:00 PM',
      'Sun': '9:00 AM - 7:00 PM'
    },
    contactInfo: {
      phone: '+27 11 5100 9000'
    },
    accessibility: ['Full Access', 'Multiple Elevators'],
    parking: {
      available: true,
      levels: ['P1', 'P2', 'P3', 'Rooftop'],
      cost: 'R15/hour'
    }
  },

  // Airports
  {
    id: '6',
    name: 'OR Tambo International Airport',
    category: 'airport',
    location: 'Kempton Park, Johannesburg',
    address: 'OR Tambo Airport Rd, Kempton Park, 1627',
    coordinates: { lat: -26.1367, lng: 28.2411 },
    image: 'https://picsum.photos/400/300?random=6',
    description: 'Africa\'s busiest airport and primary international gateway.',
    features: ['International Terminal', 'Domestic Terminal', 'Shopping', 'Dining', 'WiFi'],
    operatingHours: {
      'Mon-Sun': '24 hours'
    },
    contactInfo: {
      phone: '+27 11 921 6262',
      website: 'https://ortambo-airport.com'
    },
    accessibility: ['Full Wheelchair Access', 'Assistance Services'],
    parking: {
      available: true,
      levels: ['Short Stay', 'Long Stay', 'Parkade'],
      cost: 'R15-R180/day'
    }
  },
  {
    id: '7',
    name: 'Cape Town International Airport',
    category: 'airport',
    location: 'Cape Town',
    address: 'Matroosfontein, Cape Town, 7490',
    coordinates: { lat: -33.9648, lng: 18.6017 },
    image: 'https://picsum.photos/400/300?random=7',
    description: 'Primary airport serving Cape Town and the Western Cape.',
    features: ['International Terminal', 'Domestic Terminal', 'Duty Free', 'Restaurants'],
    operatingHours: {
      'Mon-Sun': '24 hours'
    },
    contactInfo: {
      phone: '+27 21 937 1200'
    },
    accessibility: ['Wheelchair Access', 'Special Assistance'],
    parking: {
      available: true,
      levels: ['Short Stay', 'Long Stay'],
      cost: 'R12-R150/day'
    }
  },
  {
    id: '8',
    name: 'King Shaka International Airport',
    category: 'airport',
    location: 'Durban',
    address: 'King Shaka Dr, La Mercy, 4399',
    coordinates: { lat: -29.6144, lng: 31.1197 },
    image: 'https://picsum.photos/400/300?random=8',
    description: 'Modern airport serving the Durban metropolitan area.',
    features: ['Terminal Building', 'Shopping', 'Dining', 'Car Rental'],
    operatingHours: {
      'Mon-Sun': '24 hours'
    },
    contactInfo: {
      phone: '+27 32 436 6000'
    },
    accessibility: ['Full Access', 'Mobility Assistance'],
    parking: {
      available: true,
      levels: ['Short Term', 'Long Term'],
      cost: 'R10-R120/day'
    }
  },

  // Hospitals
  {
    id: '9',
    name: 'Netcare Milpark Hospital',
    category: 'hospital',
    location: 'Parktown, Johannesburg',
    address: '9 Guild Rd, Parktown, Johannesburg, 2193',
    coordinates: { lat: -26.1785, lng: 28.0384 },
    image: 'https://picsum.photos/400/300?random=9',
    description: 'Leading private hospital with comprehensive medical services.',
    features: ['Emergency Unit', 'Specialists', 'Surgery', 'Pharmacy'],
    operatingHours: {
      'Emergency': '24 hours',
      'General': '6:00 AM - 8:00 PM'
    },
    contactInfo: {
      phone: '+27 11 480 7111',
      website: 'https://netcare.co.za'
    },
    accessibility: ['Full Wheelchair Access', 'Medical Equipment Access'],
    parking: {
      available: true,
      levels: ['Visitor Parking', 'Staff Parking'],
      cost: 'Free for patients'
    }
  },
  {
    id: '10',
    name: 'Groote Schuur Hospital',
    category: 'hospital',
    location: 'Observatory, Cape Town',
    address: 'Main Rd, Observatory, Cape Town, 7925',
    coordinates: { lat: -33.9455, lng: 18.4655 },
    image: 'https://picsum.photos/400/300?random=10',
    description: 'Academic hospital affiliated with University of Cape Town.',
    features: ['Trauma Unit', 'Research Facilities', 'Teaching Hospital'],
    operatingHours: {
      'Emergency': '24 hours',
      'Outpatient': '7:00 AM - 5:00 PM'
    },
    contactInfo: {
      phone: '+27 21 404 9111'
    },
    accessibility: ['Wheelchair Access', 'Patient Transport'],
    parking: {
      available: true,
      levels: ['Visitor', 'Staff'],
      cost: 'R5/hour'
    }
  },
  {
    id: '11',
    name: 'Tembisa Hospital',
    category: 'hospital',
    location: 'Tembisa, Ekurhuleni',
    address: 'Cnr Andrew Mapheto & Hospital Rd, Tembisa, 1632',
    coordinates: { lat: -25.9942, lng: 28.2294 },
    image: 'https://picsum.photos/400/300?random=11',
    description: 'Public hospital serving the Tembisa community.',
    features: ['Emergency Services', 'Maternity Ward', 'Pediatrics'],
    operatingHours: {
      'Emergency': '24 hours',
      'Outpatient': '7:00 AM - 4:00 PM'
    },
    contactInfo: {
      phone: '+27 11 977 8000'
    },
    accessibility: ['Basic Wheelchair Access'],
    parking: {
      available: true,
      levels: ['Visitor Parking'],
      cost: 'Free'
    }
  },

  // Educational Institutions
  {
    id: '12',
    name: 'University of the Witwatersrand',
    category: 'education',
    location: 'Braamfontein, Johannesburg',
    address: '1 Jan Smuts Ave, Braamfontein, Johannesburg, 2000',
    coordinates: { lat: -26.1929, lng: 28.0305 },
    image: 'https://picsum.photos/400/300?random=12',
    description: 'Premier research university known for excellence in education.',
    features: ['Multiple Faculties', 'Library', 'Student Centers', 'Research Facilities'],
    operatingHours: {
      'Mon-Fri': '7:00 AM - 10:00 PM',
      'Sat-Sun': '8:00 AM - 6:00 PM'
    },
    contactInfo: {
      phone: '+27 11 717 1000',
      website: 'https://wits.ac.za'
    },
    accessibility: ['Wheelchair Access', 'Student Support Services'],
    parking: {
      available: true,
      levels: ['Student Parking', 'Visitor Parking'],
      cost: 'R20/day students, R30/day visitors'
    }
  },
  {
    id: '13',
    name: 'University of Cape Town',
    category: 'education',
    location: 'Rondebosch, Cape Town',
    address: 'University Ave, Rondebosch, Cape Town, 7700',
    coordinates: { lat: -33.9579, lng: 18.4612 },
    image: 'https://picsum.photos/400/300?random=13',
    description: 'Africa\'s leading university with stunning mountain campus.',
    features: ['Historic Buildings', 'Multiple Libraries', 'Sports Facilities'],
    operatingHours: {
      'Mon-Fri': '7:00 AM - 10:00 PM',
      'Sat-Sun': '9:00 AM - 5:00 PM'
    },
    contactInfo: {
      phone: '+27 21 650 9111',
      website: 'https://uct.ac.za'
    },
    accessibility: ['Limited Wheelchair Access', 'Shuttle Services'],
    parking: {
      available: true,
      levels: ['Upper Campus', 'Lower Campus'],
      cost: 'R25/day'
    }
  },
  {
    id: '14',
    name: 'Ivory Park High School',
    category: 'education',
    location: 'Ivory Park, Midrand',
    address: 'Ivory Park Extension 10, Midrand, 1685',
    coordinates: { lat: -25.9618, lng: 28.1367 },
    image: 'https://picsum.photos/400/300?random=14',
    description: 'Secondary school serving the Ivory Park community.',
    features: ['Computer Lab', 'Library', 'Sports Fields', 'Science Lab'],
    operatingHours: {
      'Mon-Fri': '7:00 AM - 3:00 PM'
    },
    contactInfo: {
      phone: '+27 11 314 8200'
    },
    accessibility: ['Basic Access'],
    parking: {
      available: true,
      levels: ['Staff Parking', 'Visitor Parking'],
      cost: 'Free'
    }
  },

  // Convention Centers
  {
    id: '15',
    name: 'Gallagher Convention Centre',
    category: 'convention',
    location: 'Midrand, Johannesburg',
    address: '19 Richards Dr, Midrand, 1685',
    coordinates: { lat: -25.9886, lng: 28.1331 },
    image: 'https://picsum.photos/400/300?random=15',
    description: 'Premier conference and exhibition venue in Gauteng.',
    features: ['Exhibition Halls', 'Conference Rooms', 'Catering', 'AV Equipment'],
    operatingHours: {
      'Event Dependent': 'Varies by event'
    },
    contactInfo: {
      phone: '+27 11 579 9000',
      website: 'https://gallagherconvention.com'
    },
    accessibility: ['Full Wheelchair Access', 'Accessible Facilities'],
    parking: {
      available: true,
      levels: ['Exhibition Parking', 'Conference Parking'],
      cost: 'Free during events'
    }
  },
  {
    id: '16',
    name: 'Cape Town International Convention Centre',
    category: 'convention',
    location: 'Cape Town City Centre',
    address: 'Convention Square, 1 Lower Long St, Cape Town, 8001',
    coordinates: { lat: -33.9167, lng: 18.4289 },
    image: 'https://picsum.photos/400/300?random=16',
    description: 'World-class convention center in the heart of Cape Town.',
    features: ['Convention Halls', 'Meeting Rooms', 'Restaurants', 'Technology'],
    operatingHours: {
      'Event Dependent': 'Varies by event'
    },
    contactInfo: {
      phone: '+27 21 410 5000',
      website: 'https://cticc.co.za'
    },
    accessibility: ['Full Access', 'Assistive Technology'],
    parking: {
      available: true,
      levels: ['Basement Parking', 'External Lots'],
      cost: 'R25/day'
    }
  }
];

export const getVenuesByCategory = (category: VenueCategory): Venue[] => {
  return venues.filter(venue => venue.category === category);
};

export const getVenueById = (id: string): Venue | undefined => {
  return venues.find(venue => venue.id === id);
};

export const searchVenues = (query: string): Venue[] => {
  const lowercaseQuery = query.toLowerCase();
  return venues.filter(venue => 
    venue.name.toLowerCase().includes(lowercaseQuery) ||
    venue.location.toLowerCase().includes(lowercaseQuery) ||
    venue.description.toLowerCase().includes(lowercaseQuery)
  );
};

export const getRecommendedVenues = (userInterests: string[], userLocation?: string): Venue[] => {
  // Simple recommendation logic - can be enhanced
  const shoppingVenues = getVenuesByCategory('shopping');
  return shoppingVenues.slice(0, 3); // Return top 3 for now
};
