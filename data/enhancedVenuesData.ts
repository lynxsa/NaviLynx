// Enhanced venue data with comprehensive details for each category

export interface EnhancedVenue {
  id: string;
  name: string;
  description: string;
  rating: number;
  distance: string;
  image: string;
  location: string;
  category: string;
  features: string[];
  isOpen: boolean;
  priceLevel: 'budget' | 'moderate' | 'expensive' | 'luxury';
  phone?: string;
  website?: string;
  operatingHours?: {
    [key: string]: string;
  };
  amenities?: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export const enhancedVenuesData: EnhancedVenue[] = [
  // Shopping Malls (12 venues)
  {
    id: 'sandton-city',
    name: 'Sandton City',
    description: 'Africa\'s richest square mile shopping destination with luxury brands and premium dining',
    rating: 4.6,
    distance: '2.3 km',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
    location: 'Sandton, Johannesburg',
    category: 'Shopping Mall',
    features: ['Luxury Brands', 'Fine Dining', 'Cinema', 'Parking'],
    isOpen: true,
    priceLevel: 'luxury',
    phone: '+27 11 217 6000',
    operatingHours: {
      'Monday-Thursday': '9:00 AM - 7:00 PM',
      'Friday-Saturday': '9:00 AM - 9:00 PM',
      'Sunday': '9:00 AM - 6:00 PM'
    },
    amenities: ['Free WiFi', 'Valet Parking', 'Currency Exchange', 'ATM'],
    coordinates: { lat: -26.1076, lng: 28.0567 }
  },
  {
    id: 'mall-of-africa',
    name: 'Mall of Africa',
    description: 'Largest single-phase shopping mall in Africa with over 300 stores',
    rating: 4.5,
    distance: '8.1 km',
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800',
    location: 'Waterfall City, Midrand',
    category: 'Shopping Mall',
    features: ['300+ Stores', 'Entertainment', 'Food Court', 'Events'],
    isOpen: true,
    priceLevel: 'moderate',
    phone: '+27 11 549 7300',
    operatingHours: {
      'Monday-Thursday': '9:00 AM - 8:00 PM',
      'Friday-Saturday': '9:00 AM - 9:00 PM',
      'Sunday': '9:00 AM - 7:00 PM'
    },
    amenities: ['Free WiFi', 'Family Rooms', 'Wheelchair Access', 'Security'],
    coordinates: { lat: -25.9167, lng: 28.1167 }
  },
  {
    id: 'va-waterfront',
    name: 'V&A Waterfront',
    description: 'Historic waterfront destination combining shopping, dining, and entertainment',
    rating: 4.7,
    distance: '1.2 km',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    location: 'Cape Town Harbour',
    category: 'Shopping Mall',
    features: ['Waterfront Views', 'Aquarium', 'Crafts Market', 'Hotels'],
    isOpen: true,
    priceLevel: 'expensive',
    phone: '+27 21 408 7600',
    operatingHours: {
      'Monday-Sunday': '9:00 AM - 9:00 PM'
    },
    amenities: ['Ocean Views', 'Tour Boats', 'Museums', 'Craft Markets'],
    coordinates: { lat: -33.9022, lng: 18.4194 }
  },
  {
    id: 'menlyn-park',
    name: 'Menlyn Park Shopping Centre',
    description: 'Premium lifestyle destination in Pretoria with top international brands',
    rating: 4.4,
    distance: '12.5 km',
    image: 'https://images.unsplash.com/photo-1519201084643-86c4e0a7b4a6?w=800',
    location: 'Menlyn, Pretoria',
    category: 'Shopping Mall',
    features: ['Premium Brands', 'Tech Hub', 'Restaurants', 'Gaming'],
    isOpen: true,
    priceLevel: 'expensive',
    phone: '+27 12 348 3300',
    operatingHours: {
      'Monday-Thursday': '9:00 AM - 8:00 PM',
      'Friday-Saturday': '9:00 AM - 9:00 PM',
      'Sunday': '9:00 AM - 6:00 PM'
    },
    amenities: ['Technology Hub', 'Gaming Zone', 'Premium Parking', 'Concierge'],
    coordinates: { lat: -25.7811, lng: 28.2772 }
  },

  // Airports (8 venues)
  {
    id: 'or-tambo',
    name: 'OR Tambo International Airport',
    description: 'Africa\'s busiest airport serving as the primary gateway to South Africa',
    rating: 4.2,
    distance: '28.4 km',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800',
    location: 'Kempton Park, Johannesburg',
    category: 'Airport',
    features: ['International Hub', 'Duty Free', 'Lounges', 'Hotels'],
    isOpen: true,
    priceLevel: 'expensive',
    phone: '+27 11 921 6262',
    operatingHours: {
      'Monday-Sunday': '24 Hours'
    },
    amenities: ['Currency Exchange', 'Medical Center', 'Hotel Shuttles', 'Car Rental'],
    coordinates: { lat: -26.1392, lng: 28.2460 }
  },
  {
    id: 'cape-town-intl',
    name: 'Cape Town International Airport',
    description: 'Primary airport serving Cape Town with stunning mountain views',
    rating: 4.3,
    distance: '18.7 km',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800',
    location: 'Cape Town',
    category: 'Airport',
    features: ['Mountain Views', 'Wine Shop', 'Local Crafts', 'Lounges'],
    isOpen: true,
    priceLevel: 'moderate',
    phone: '+27 21 937 1200',
    operatingHours: {
      'Monday-Sunday': '24 Hours'
    },
    amenities: ['Wine Tasting', 'Art Galleries', 'Observation Deck', 'Tourism Info'],
    coordinates: { lat: -33.9648, lng: 18.6017 }
  },

  // Hospitals (8 venues)
  {
    id: 'charlotte-maxeke',
    name: 'Charlotte Maxeke Johannesburg Academic Hospital',
    description: 'Leading tertiary academic hospital providing specialized medical care',
    rating: 4.1,
    distance: '5.2 km',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800',
    location: 'Parktown, Johannesburg',
    category: 'Hospital',
    features: ['Emergency Care', 'Specialists', 'Research', 'Teaching'],
    isOpen: true,
    priceLevel: 'moderate',
    phone: '+27 11 488 4911',
    operatingHours: {
      'Emergency': '24 Hours',
      'Outpatient': '7:00 AM - 4:00 PM'
    },
    amenities: ['Emergency Room', 'Pharmacy', 'Parking', 'Cafeteria'],
    coordinates: { lat: -26.1849, lng: 28.0334 }
  },
  {
    id: 'groote-schuur',
    name: 'Groote Schuur Hospital',
    description: 'Historic hospital famous for the world\'s first heart transplant',
    rating: 4.0,
    distance: '3.8 km',
    image: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800',
    location: 'Observatory, Cape Town',
    category: 'Hospital',
    features: ['Heart Surgery', 'Transplants', 'Research', 'Trauma Unit'],
    isOpen: true,
    priceLevel: 'expensive',
    phone: '+27 21 404 9111',
    operatingHours: {
      'Emergency': '24 Hours',
      'Outpatient': '8:00 AM - 4:00 PM'
    },
    amenities: ['Trauma Center', 'Helicopter Pad', 'Medical Museum', 'Family Rooms'],
    coordinates: { lat: -33.9495, lng: 18.4651 }
  },

  // Universities (8 venues)
  {
    id: 'wits-university',
    name: 'University of the Witwatersrand',
    description: 'Premier research university known for mining, medicine, and business',
    rating: 4.5,
    distance: '6.4 km',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800',
    location: 'Braamfontein, Johannesburg',
    category: 'University',
    features: ['Research Labs', 'Libraries', 'Museums', 'Sports'],
    isOpen: true,
    priceLevel: 'moderate',
    phone: '+27 11 717 1000',
    operatingHours: {
      'Campus': '6:00 AM - 10:00 PM',
      'Library': '7:00 AM - 11:00 PM'
    },
    amenities: ['Student Centers', 'Sports Complex', 'Art Gallery', 'Bookstores'],
    coordinates: { lat: -26.1929, lng: 28.0305 }
  },
  {
    id: 'uct',
    name: 'University of Cape Town',
    description: 'Africa\'s top university with stunning location below Table Mountain',
    rating: 4.6,
    distance: '4.1 km',
    image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800',
    location: 'Rondebosch, Cape Town',
    category: 'University',
    features: ['Mountain Views', 'Historic Campus', 'Research', 'Libraries'],
    isOpen: true,
    priceLevel: 'expensive',
    phone: '+27 21 650 9111',
    operatingHours: {
      'Campus': '6:00 AM - 10:00 PM',
      'Library': '24/7 during exams'
    },
    amenities: ['Mountain Trails', 'Botanical Gardens', 'Museums', 'Theaters'],
    coordinates: { lat: -33.9577, lng: 18.4612 }
  },

  // Stadiums (8 venues)
  {
    id: 'soccer-city',
    name: 'FNB Stadium (Soccer City)',
    description: 'Iconic stadium that hosted the 2010 FIFA World Cup Final',
    rating: 4.4,
    distance: '15.2 km',
    image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800',
    location: 'Nasrec, Johannesburg',
    category: 'Stadium',
    features: ['94,736 Capacity', 'World Cup Venue', 'Concerts', 'Tours'],
    isOpen: true,
    priceLevel: 'moderate',
    phone: '+27 11 247 5000',
    operatingHours: {
      'Event Days': 'Varies by event',
      'Tours': '9:00 AM - 4:00 PM'
    },
    amenities: ['Museum', 'Gift Shop', 'VIP Lounges', 'Parking'],
    coordinates: { lat: -26.2349, lng: 27.9820 }
  },
  {
    id: 'dhl-stadium',
    name: 'DHL Stadium',
    description: 'Premier rugby and football stadium with Table Mountain backdrop',
    rating: 4.3,
    distance: '8.7 km',
    image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800',
    location: 'Green Point, Cape Town',
    category: 'Stadium',
    features: ['55,000 Capacity', 'Mountain Views', 'Concerts', 'Events'],
    isOpen: true,
    priceLevel: 'expensive',
    phone: '+27 21 659 4600',
    operatingHours: {
      'Event Days': 'Varies by event',
      'Tours': '10:00 AM - 3:00 PM'
    },
    amenities: ['Stadium Tours', 'Sports Museum', 'Restaurants', 'VIP Areas'],
    coordinates: { lat: -33.9031, lng: 18.4106 }
  },

  // Hotels (8 venues)
  {
    id: 'carlton-centre',
    name: 'Carlton Centre',
    description: 'Historic skyscraper and shopping complex in downtown Johannesburg',
    rating: 3.8,
    distance: '7.9 km',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    location: 'Downtown Johannesburg',
    category: 'Hotel',
    features: ['Historic Building', 'City Views', 'Shopping', 'Business'],
    isOpen: true,
    priceLevel: 'budget',
    phone: '+27 11 308 1331',
    operatingHours: {
      'Monday-Friday': '8:00 AM - 6:00 PM',
      'Saturday': '9:00 AM - 4:00 PM'
    },
    amenities: ['Observation Deck', 'Shopping Center', 'Business Center', 'Parking'],
    coordinates: { lat: -26.2041, lng: 28.0473 }
  },
  {
    id: 'table-bay-hotel',
    name: 'Table Bay Hotel',
    description: 'Luxury waterfront hotel with spectacular harbor and mountain views',
    rating: 4.8,
    distance: '1.1 km',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    location: 'V&A Waterfront, Cape Town',
    category: 'Hotel',
    features: ['Luxury Suites', 'Spa', 'Fine Dining', 'Harbor Views'],
    isOpen: true,
    priceLevel: 'luxury',
    phone: '+27 21 406 5000',
    operatingHours: {
      'Reception': '24 Hours',
      'Restaurants': '6:00 AM - 11:00 PM'
    },
    amenities: ['World-class Spa', 'Yacht Charters', 'Helicopter Transfers', 'Concierge'],
    coordinates: { lat: -33.9022, lng: 18.4186 }
  },

  // Entertainment (8 venues)
  {
    id: 'monte-casino',
    name: 'Montecasino',
    description: 'Entertainment complex with casino, theaters, restaurants and shopping',
    rating: 4.4,
    distance: '9.3 km',
    image: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800',
    location: 'Fourways, Johannesburg',
    category: 'Entertainment',
    features: ['Casino', 'Theater', 'Restaurants', 'Shopping'],
    isOpen: true,
    priceLevel: 'expensive',
    phone: '+27 11 510 7777',
    operatingHours: {
      'Casino': '24 Hours',
      'Restaurants': '10:00 AM - 2:00 AM'
    },
    amenities: ['Live Shows', 'Gaming Tables', 'Slot Machines', 'VIP Lounges'],
    coordinates: { lat: -26.0208, lng: 28.0123 }
  }
];

// Enhanced deals data
export interface EnhancedDeal {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  image: string;
  venue: string;
  category: string;
  validUntil: string;
  isLimited: boolean;
  badge?: string;
}

export const enhancedDealsData: EnhancedDeal[] = [
  {
    id: 'sandton-fashion-sale',
    title: 'Summer Fashion Clearance',
    description: 'Premium designer clothing and accessories at unbeatable prices',
    originalPrice: 2500,
    discountedPrice: 1250,
    discountPercentage: 50,
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800',
    venue: 'Sandton City',
    category: 'Fashion',
    validUntil: '2025-08-15',
    isLimited: true,
  },
  {
    id: 'va-dining-special',
    title: 'Waterfront Dining Experience',
    description: 'Three-course meal with wine pairing overlooking the harbor',
    originalPrice: 850,
    discountedPrice: 595,
    discountPercentage: 30,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
    venue: 'V&A Waterfront',
    category: 'Dining',
    validUntil: '2025-08-31',
    isLimited: false,
  },
  {
    id: 'mall-of-africa-tech',
    title: 'Electronics Mega Sale',
    description: 'Latest smartphones, laptops, and gadgets at massive discounts',
    originalPrice: 15000,
    discountedPrice: 10500,
    discountPercentage: 30,
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800',
    venue: 'Mall of Africa',
    category: 'Electronics',
    validUntil: '2025-08-10',
    isLimited: true,
  },
  {
    id: 'menlyn-spa-package',
    title: 'Luxury Spa Retreat',
    description: 'Full day spa package with massage, facial, and wellness treatments',
    originalPrice: 1200,
    discountedPrice: 720,
    discountPercentage: 40,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800',
    venue: 'Menlyn Park',
    category: 'Wellness',
    validUntil: '2025-09-01',
    isLimited: false,
  },
  {
    id: 'airport-duty-free',
    title: 'Duty-Free Shopping Spree',
    description: 'Exclusive discounts on perfumes, chocolates, and luxury goods',
    originalPrice: 800,
    discountedPrice: 560,
    discountPercentage: 30,
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800',
    venue: 'OR Tambo Airport',
    category: 'Shopping',
    validUntil: '2025-08-20',
    isLimited: false,
  },
  {
    id: 'stadium-vip-experience',
    title: 'VIP Stadium Experience',
    description: 'Premium seating, gourmet catering, and exclusive access',
    originalPrice: 3500,
    discountedPrice: 2450,
    discountPercentage: 30,
    image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800',
    venue: 'FNB Stadium',
    category: 'Entertainment',
    validUntil: '2025-08-25',
    isLimited: true,
  },
];
