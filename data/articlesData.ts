// NaviLynx Articles & Content Data System
// South African focused venue articles, guides, and content

export interface Article {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  excerpt: string;
  category: 'shopping' | 'navigation' | 'deals' | 'events' | 'guides' | 'local' | 'reviews';
  venueId?: string; // Optional venue association
  location?: {
    city: string;
    province: string;
  };
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  publishedAt: string;
  updatedAt: string;
  readTime: number; // in minutes
  images: string[];
  tags: string[];
  featured: boolean;
  trending: boolean;
  likes: number;
  comments: number;
  shares: number;
  status: 'published' | 'draft' | 'archived';
  seoMetadata: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

export interface Deal {
  id: string;
  title: string;
  description: string;
  venueId: string;
  venueName: string;
  category: 'fashion' | 'electronics' | 'food' | 'beauty' | 'home' | 'services' | 'entertainment';
  dealType: 'percentage' | 'fixed_amount' | 'buy_one_get_one' | 'bundle' | 'cashback';
  originalPrice: string;
  discountedPrice: string;
  discountPercentage?: number;
  savings: string;
  validFrom: string;
  validUntil: string;
  image: string;
  gallery: string[];
  terms: string[];
  featured: boolean;
  trending: boolean;
  limited: boolean;
  stock?: number;
  claimed: number;
  maxClaims?: number;
  locations: string[];
  tags: string[];
  rating: number;
  reviewCount: number;
  status: 'active' | 'expired' | 'coming_soon' | 'sold_out';
}

export interface EventArticle {
  id: string;
  title: string;
  description: string;
  venueId: string;
  venueName: string;
  eventType: 'sale' | 'launch' | 'exhibition' | 'performance' | 'workshop' | 'conference' | 'festival';
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  image: string;
  gallery: string[];
  ticketPrice?: string;
  freeEvent: boolean;
  capacity?: number;
  registered: number;
  location: {
    floor?: string;
    section?: string;
    address: string;
  };
  organizer: {
    name: string;
    contact: string;
    website?: string;
  };
  featured: boolean;
  trending: boolean;
  tags: string[];
  category: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

// South African Articles Database
export const articlesDatabase: Article[] = [
  {
    id: 'art_001',
    title: 'Ultimate Shopping Guide to Sandton City',
    subtitle: 'Discover Africa\'s premier shopping destination',
    content: `Sandton City stands as one of Africa's most prestigious shopping destinations, offering an unparalleled retail experience in the heart of Johannesburg's financial district. This comprehensive guide will take you through everything you need to know to make the most of your visit.

**Getting There & Parking**
Located at the intersection of Rivonia Road and 5th Street, Sandton City is easily accessible by car, Gautrain, or taxi. The mall offers over 7,000 parking bays across multiple levels, with convenient parking guidance systems to help you find available spots quickly.

**Shopping Highlights**
- **Fashion**: Home to international brands like Zara, H&M, and Cotton On, alongside premium South African retailers
- **Electronics**: Incredible Connection, iStore, and Samsung stores offer the latest technology
- **Beauty**: Dis-Chem, Clicks, and Edgars Beauty provide comprehensive beauty and wellness products
- **Dining**: From Tashas to Ocean Basket, enjoy diverse culinary experiences

**Insider Tips**
- Visit during weekday mornings for the best parking and less crowded shopping
- Download the Sandton City app for store directories and parking assistance
- Check out the rooftop for stunning Johannesburg skyline views
- Use the Gautrain station entrance for convenient public transport access

**Special Services**
The mall offers personal shopping services, gift wrapping, and concierge assistance. Free WiFi is available throughout, and there are multiple ATMs and banking services.

**Best Times to Visit**
- Weekday mornings (9 AM - 12 PM): Quiet shopping experience
- Thursday evenings: Extended shopping hours until 21:00
- Weekend afternoons: Vibrant atmosphere with events and activities`,
    excerpt: 'Your complete guide to navigating Sandton City, Africa\'s premier shopping destination, with insider tips and shopping highlights.',
    category: 'shopping',
    venueId: 'sandton_city',
    location: {
      city: 'Johannesburg',
      province: 'Gauteng'
    },
    author: {
      name: 'Sarah Molekane',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b372?w=150&h=150&fit=crop&crop=face',
      bio: 'Shopping expert and Johannesburg lifestyle blogger with 8 years of retail industry experience.'
    },
    publishedAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z',
    readTime: 7,
    images: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=600&fit=crop'
    ],
    tags: ['sandton', 'shopping', 'johannesburg', 'mall', 'fashion', 'lifestyle'],
    featured: true,
    trending: true,
    likes: 324,
    comments: 45,
    shares: 78,
    status: 'published',
    seoMetadata: {
      metaTitle: 'Ultimate Shopping Guide to Sandton City - NaviLynx',
      metaDescription: 'Complete guide to Sandton City shopping mall with insider tips, store directories, parking info, and best times to visit.',
      keywords: ['sandton city', 'shopping guide', 'johannesburg mall', 'shopping tips', 'sandton shopping']
    }
  },
  {
    id: 'art_002',
    title: 'V&A Waterfront: Beyond Shopping',
    subtitle: 'Explore Cape Town\'s iconic waterfront destination',
    content: `The V&A Waterfront is much more than a shopping center - it's a complete lifestyle destination that captures the essence of Cape Town's maritime heritage while offering world-class entertainment, dining, and retail experiences.

**Historical Significance**
Built around the historic Alfred and Victoria basins, the V&A Waterfront preserves Cape Town's working harbor atmosphere while providing modern amenities. The dock area dates back to the 1860s and remains an active port.

**Must-Visit Attractions**
- **Two Oceans Aquarium**: World-class marine experiences with local ocean life
- **Zeitz Museum of Contemporary African Art**: Stunning architecture and African art collections
- **The Clock Tower Centre**: Helicopter tours and adventure activities
- **Robben Island Ferry**: Departure point for the historic island tours

**Shopping & Dining**
Over 450 shops and restaurants cater to every taste and budget. From African craft markets to international luxury brands, the variety is exceptional. The Watershed offers authentic African crafts and artworks.

**Entertainment Options**
- **Cinema Nouveau**: Art house and mainstream films
- **Amphitheatre**: Free outdoor concerts and events
- **Street Performers**: Daily entertainment throughout the precinct
- **Harbor Cruises**: Various boat trips around the harbor

**Navigation Tips**
The waterfront is pedestrian-friendly with clear signage and multiple information points. Free WiFi is available throughout, and the MyCiTi bus service provides convenient access from the city center.

**Best Experiences by Time of Day**
- **Morning**: Quieter shopping, better parking availability
- **Afternoon**: Peak activity, street performances, harbor views
- **Evening**: Sunset views, restaurants, nightlife
- **Weekend**: Markets, family activities, live entertainment`,
    excerpt: 'Discover the V&A Waterfront\'s hidden gems beyond shopping, from historical attractions to entertainment options and insider navigation tips.',
    category: 'guides',
    venueId: 'va_waterfront',
    location: {
      city: 'Cape Town',
      province: 'Western Cape'
    },
    author: {
      name: 'Marco Williams',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      bio: 'Cape Town tourism specialist and local historian with expertise in waterfront culture and attractions.'
    },
    publishedAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-12T10:15:00Z',
    readTime: 9,
    images: [
      'https://images.unsplash.com/photo-1563115298-e9585e7943d4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1580500550469-9c0e8563ab80?w=800&h=600&fit=crop'
    ],
    tags: ['va waterfront', 'cape town', 'tourism', 'attractions', 'entertainment', 'history'],
    featured: true,
    trending: false,
    likes: 298,
    comments: 34,
    shares: 56,
    status: 'published',
    seoMetadata: {
      metaTitle: 'V&A Waterfront Complete Guide - Beyond Shopping | NaviLynx',
      metaDescription: 'Explore V&A Waterfront attractions, dining, entertainment and hidden gems in Cape Town\'s premier destination.',
      keywords: ['va waterfront', 'cape town attractions', 'waterfront guide', 'cape town tourism', 'waterfront shopping']
    }
  },
  {
    id: 'art_003',
    title: 'Smart Shopping with AR Technology',
    subtitle: 'How NaviLynx is revolutionizing retail navigation',
    content: `Augmented Reality (AR) is transforming the shopping experience, and NaviLynx is at the forefront of this revolution. Our AR-powered shopping assistant is changing how South Africans discover, compare, and purchase products in malls and retail centers.

**What is AR Shopping?**
AR shopping overlays digital information onto the real world through your smartphone camera. Point your device at any product, and instantly receive detailed information, price comparisons, reviews, and availability across multiple stores.

**Key Features of NaviLynx AR Shopping**
- **Product Recognition**: Instantly identify products using advanced AI
- **Price Comparison**: Real-time pricing across local retailers
- **Store Location**: Navigate directly to stores selling specific items
- **Reviews & Ratings**: Access to authentic customer reviews
- **Sustainability Info**: Environmental impact and ethical sourcing data

**Real-World Applications**
At Sandton City, our AR system can help you:
- Find the best price for electronics across Incredible Connection, Game, and iStore
- Locate specific fashion items in Zara, Cotton On, or local boutiques
- Compare beauty products at Dis-Chem, Clicks, and Edgars
- Navigate to stores using visual wayfinding

**Success Stories**
Shoppers using NaviLynx AR features report:
- 40% time savings when shopping
- 25% better price discovery
- 60% improved satisfaction with purchases
- Reduced decision fatigue through informed choices

**Getting Started**
1. Open NaviLynx and navigate to your chosen venue
2. Activate AR Shopping Assistant
3. Point camera at any product
4. Explore detailed information and options
5. Navigate to stores using AR directions

**Privacy & Security**
NaviLynx prioritizes user privacy with:
- No personal data storage in images
- Local processing where possible
- Transparent data usage policies
- User control over shared information

**Future Developments**
Coming soon: Virtual try-ons, social shopping features, and integration with loyalty programs from major South African retailers.`,
    excerpt: 'Discover how NaviLynx\'s AR technology is revolutionizing shopping in South Africa with smart product recognition and price comparison.',
    category: 'navigation',
    author: {
      name: 'Dr. Aisha Patel',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
      bio: 'Technology researcher and AR specialist focusing on retail innovation and user experience design.'
    },
    publishedAt: '2024-01-08T11:00:00Z',
    updatedAt: '2024-01-20T16:45:00Z',
    readTime: 6,
    images: [
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop'
    ],
    tags: ['ar technology', 'smart shopping', 'innovation', 'navilynx', 'retail tech', 'mobile app'],
    featured: false,
    trending: true,
    likes: 412,
    comments: 67,
    shares: 95,
    status: 'published',
    seoMetadata: {
      metaTitle: 'AR Shopping Technology Guide - Smart Retail with NaviLynx',
      metaDescription: 'Learn how NaviLynx AR technology revolutionizes shopping with product recognition, price comparison, and smart navigation.',
      keywords: ['ar shopping', 'smart retail', 'navilynx technology', 'augmented reality shopping', 'mobile shopping']
    }
  },
  {
    id: 'art_004',
    title: 'Local Gems: Hidden Stores in Gateway Theatre',
    subtitle: 'Discover unique shops beyond the major brands',
    content: `Gateway Theatre of Shopping in Durban isn't just about the big-name stores - it's home to numerous hidden gems that offer unique products, personalized service, and authentic South African experiences.

**Unique Local Boutiques**
Explore these lesser-known stores that locals love:
- **African Art Gallery**: Authentic Zulu crafts and contemporary pieces
- **Spice Route**: Aromatic spices and traditional Indian ingredients
- **Wave Riders**: Local surf and beach wear from KZN designers
- **Book Nook**: Independent bookstore with South African literature focus

**Artisan Food Specialists**
Gateway's food scene extends beyond chain restaurants:
- **Durban Curry Company**: Authentic bunny chow and curry specialists
- **Coastal Coffee Roasters**: Locally roasted coffee beans and brewing equipment
- **Sugar Coast Sweets**: Traditional South African confectionery
- **Umhlanga Honey**: Local honey and bee products

**Service-Based Hidden Gems**
Don't miss these service providers:
- **Tech Doctor**: Independent phone and computer repair
- **Alterations Express**: Expert clothing alterations and custom tailoring
- **Key & Watch Services**: Traditional watch repair and key cutting
- **Photo Memories**: Professional photo printing and restoration

**Shopping Strategy**
To discover these gems:
1. Explore upper levels where rent is lower
2. Check the mall directory for independent stores
3. Ask security for directions to specific local businesses
4. Visit during weekday afternoons for better service

**Supporting Local Business**
Shopping at these stores:
- Supports local entrepreneurs and families
- Offers personalized customer service
- Provides unique products not found elsewhere
- Builds community connections

**Insider Information**
- Many local stores offer student discounts
- Some provide layaway services for expensive items
- Custom orders are often available with reasonable wait times
- Regular customers often receive special deals and first access to new stock

**Best Times to Visit**
Local stores typically offer the best experience during off-peak hours when staff can provide more personalized attention and detailed product information.`,
    excerpt: 'Uncover Gateway Theatre\'s hidden local stores and artisan businesses that offer unique products and personalized South African shopping experiences.',
    category: 'local',
    venueId: 'gateway_theatre',
    location: {
      city: 'Durban',
      province: 'KwaZulu-Natal'
    },
    author: {
      name: 'Priya Naidoo',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      bio: 'Durban lifestyle writer and advocate for local businesses with extensive knowledge of KZN\'s retail landscape.'
    },
    publishedAt: '2024-01-05T13:20:00Z',
    updatedAt: '2024-01-18T09:30:00Z',
    readTime: 5,
    images: [
      'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1590649804407-deada9c0c95e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=800&h=600&fit=crop'
    ],
    tags: ['gateway theatre', 'durban', 'local business', 'hidden gems', 'artisan', 'kwazulu-natal'],
    featured: false,
    trending: false,
    likes: 187,
    comments: 23,
    shares: 31,
    status: 'published',
    seoMetadata: {
      metaTitle: 'Hidden Local Stores at Gateway Theatre Durban - NaviLynx Guide',
      metaDescription: 'Discover unique local businesses and artisan stores at Gateway Theatre of Shopping in Durban beyond major brands.',
      keywords: ['gateway theatre durban', 'local stores durban', 'hidden gems shopping', 'durban local business', 'artisan stores']
    }
  },
  {
    id: 'art_005',
    title: 'Weekend Events: What\'s Happening This Month',
    subtitle: 'Your guide to mall events, exhibitions, and activities',
    content: `South African malls are no longer just shopping destinations - they're community hubs hosting exciting events, exhibitions, and activities throughout the month. Here's your comprehensive guide to weekend entertainment.

**This Month's Highlights**

**Sandton City Events**
- **Art Exhibition**: "Contemporary African Artists" (Weekends throughout January)
- **Fashion Show**: Summer collection showcase every Saturday at 14:00
- **Children's Workshop**: Art and craft activities, Sundays 10:00-12:00
- **Live Music**: Local acoustic performances, Friday evenings 18:00-20:00

**V&A Waterfront Activities**
- **Sunset Market**: Artisan crafts and food, every Sunday 16:00-21:00
- **Maritime Festival**: Boat displays and harbor tours (January 20-22)
- **Wine Tasting**: Western Cape vineyards showcase, Saturdays 15:00-18:00
- **Cultural Performances**: Traditional dance and music, weekends 12:00 & 16:00

**Gateway Theatre Entertainment**
- **Beach Culture Festival**: Surf and lifestyle expo (January 27-29)
- **Food Truck Friday**: Diverse food vendors, every Friday 12:00-21:00
- **Kids Zone**: Interactive games and entertainment, weekends all day
- **Health & Wellness Fair**: Fitness demos and health screenings (January 21)

**Canal Walk Activities**
- **Technology Expo**: Latest gadgets and demos (January 14-15)
- **Book Fair**: Local authors and reading events, weekends
- **Gaming Tournament**: Esports competitions, Saturdays 10:00-18:00
- **Charity Drive**: Community support initiatives throughout January

**Special Holiday Events**
During school holidays, expect:
- Extended operating hours
- Additional children's activities
- Special promotions and sales
- Increased entertainment programming

**How to Stay Updated**
1. Download venue-specific apps for real-time updates
2. Follow mall social media accounts
3. Check NaviLynx event notifications
4. Sign up for venue newsletters

**Planning Your Visit**
- Arrive early for popular events (limited seating)
- Check parking availability during event days
- Bring cash for artisan markets and food trucks
- Confirm event times as schedules may change

**Free vs Paid Events**
Most mall events are free, but some specialized workshops or exhibitions may have nominal fees. Always check event details before attending.

**Accessibility**
All listed venues provide wheelchair access and facilities for visitors with disabilities. Contact venue management for specific accessibility requirements.`,
    excerpt: 'Stay updated with this month\'s exciting mall events, exhibitions, and weekend activities across South Africa\'s premier shopping destinations.',
    category: 'events',
    author: {
      name: 'Themba Mthembu',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      bio: 'Events coordinator and entertainment blogger covering lifestyle and cultural activities across South African venues.'
    },
    publishedAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-25T14:00:00Z',
    readTime: 4,
    images: [
      'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=600&fit=crop'
    ],
    tags: ['events', 'weekend activities', 'mall events', 'entertainment', 'family activities', 'south africa'],
    featured: true,
    trending: false,
    likes: 256,
    comments: 38,
    shares: 52,
    status: 'published',
    seoMetadata: {
      metaTitle: 'Weekend Mall Events South Africa - What\'s On This Month | NaviLynx',
      metaDescription: 'Discover exciting weekend events, exhibitions and activities at South Africa\'s top shopping malls and entertainment venues.',
      keywords: ['mall events south africa', 'weekend activities', 'shopping mall entertainment', 'family events', 'south africa events']
    }
  }
];

// Deals Database
export const dealsDatabase: Deal[] = [
  {
    id: 'deal_001',
    title: 'Summer Fashion Sale - Up to 70% Off',
    description: 'Massive clearance on summer clothing, shoes, and accessories. Top brands including Cotton On, Markham, and Truworths.',
    venueId: 'sandton_city',
    venueName: 'Sandton City',
    category: 'fashion',
    dealType: 'percentage',
    originalPrice: 'R500 - R2,000',
    discountedPrice: 'R150 - R600',
    discountPercentage: 70,
    savings: 'Up to R1,400',
    validFrom: '2024-01-15T00:00:00Z',
    validUntil: '2024-02-15T23:59:59Z',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=600&fit=crop'
    ],
    terms: [
      'Valid at participating stores only',
      'Cannot be combined with other offers',
      'Limited stock available',
      'No rain checks',
      'Sale items are final sale'
    ],
    featured: true,
    trending: true,
    limited: true,
    stock: 500,
    claimed: 234,
    maxClaims: 500,
    locations: ['Level 1 Fashion District', 'Level 2 Lifestyle Stores'],
    tags: ['fashion', 'clearance', 'summer', 'clothing', 'shoes', 'accessories'],
    rating: 4.6,
    reviewCount: 89,
    status: 'active'
  },
  {
    id: 'deal_002',
    title: 'Electronics Mega Sale - Samsung Galaxy Deals',
    description: 'Latest Samsung smartphones and accessories with exclusive bundle offers. Trade-in your old device for additional savings.',
    venueId: 'sandton_city',
    venueName: 'Sandton City',
    category: 'electronics',
    dealType: 'bundle',
    originalPrice: 'R12,999',
    discountedPrice: 'R9,999',
    discountPercentage: 23,
    savings: 'R3,000 + Free Earbuds',
    validFrom: '2024-01-10T00:00:00Z',
    validUntil: '2024-01-31T23:59:59Z',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&h=600&fit=crop'
    ],
    terms: [
      'Valid on Samsung Galaxy S24 series only',
      'Trade-in device must be in working condition',
      'Bundle includes Galaxy Earbuds Pro',
      'Installation and setup included',
      '2-year warranty included'
    ],
    featured: true,
    trending: false,
    limited: true,
    stock: 50,
    claimed: 31,
    maxClaims: 50,
    locations: ['Samsung Store - Level 2', 'iStore - Level 1'],
    tags: ['samsung', 'smartphone', 'electronics', 'trade-in', 'bundle'],
    rating: 4.8,
    reviewCount: 45,
    status: 'active'
  },
  {
    id: 'deal_003',
    title: 'Waterfront Dining Week - 3-Course Meals',
    description: 'Enjoy specially priced 3-course meals at premium V&A Waterfront restaurants. Book your table and experience Cape Town\'s finest cuisine.',
    venueId: 'va_waterfront',
    venueName: 'V&A Waterfront',
    category: 'food',
    dealType: 'fixed_amount',
    originalPrice: 'R350 - R450',
    discountedPrice: 'R199',
    savings: 'Up to R251',
    validFrom: '2024-01-20T00:00:00Z',
    validUntil: '2024-01-27T23:59:59Z',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop'
    ],
    terms: [
      'Advance booking required',
      'Available dinner service only (18:00-22:00)',
      'Valid Sunday to Thursday',
      'Does not include beverages',
      'Dietary restrictions accommodated with notice'
    ],
    featured: false,
    trending: true,
    limited: false,
    claimed: 156,
    locations: ['Various restaurants throughout V&A Waterfront'],
    tags: ['dining', 'restaurants', 'cape town', 'fine dining', 'waterfront'],
    rating: 4.4,
    reviewCount: 78,
    status: 'active'
  },
  {
    id: 'deal_004',
    title: 'Beauty & Wellness Package Deal',
    description: 'Pamper yourself with a complete beauty package including facial, manicure, and wellness consultation at Clicks and partner spas.',
    venueId: 'gateway_theatre',
    venueName: 'Gateway Theatre',
    category: 'beauty',
    dealType: 'bundle',
    originalPrice: 'R850',
    discountedPrice: 'R499',
    discountPercentage: 41,
    savings: 'R351',
    validFrom: '2024-01-12T00:00:00Z',
    validUntil: '2024-02-29T23:59:59Z',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1596178060057-cdbecc2c3d55?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1631730486613-ee182ca06b9a?w=800&h=600&fit=crop'
    ],
    terms: [
      'Package must be used within 3 months',
      'Advance booking required for spa services',
      'Valid at participating Clicks and partner locations',
      'Cannot be split between multiple people',
      'Includes complimentary skincare consultation'
    ],
    featured: false,
    trending: false,
    limited: true,
    stock: 100,
    claimed: 45,
    maxClaims: 100,
    locations: ['Clicks - Level 1', 'Wellness Spa - Level 2'],
    tags: ['beauty', 'wellness', 'spa', 'skincare', 'package deal'],
    rating: 4.7,
    reviewCount: 34,
    status: 'active'
  },
  {
    id: 'deal_005',
    title: 'Home Décor Weekend Special',
    description: 'Transform your living space with discounted furniture, décor items, and homeware from @home, Woolworths, and HomeChoice.',
    venueId: 'canal_walk',
    venueName: 'Canal Walk',
    category: 'home',
    dealType: 'percentage',
    originalPrice: 'Various',
    discountedPrice: 'Various',
    discountPercentage: 40,
    savings: 'Up to 40% Off',
    validFrom: '2024-01-26T00:00:00Z',
    validUntil: '2024-01-28T23:59:59Z',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop'
    ],
    terms: [
      'Weekend special only (Friday-Sunday)',
      'Excludes already discounted items',
      'Free delivery on purchases over R2,000',
      'Assembly service available at extra cost',
      'Limited quantities available'
    ],
    featured: false,
    trending: false,
    limited: true,
    claimed: 67,
    locations: ['@home - Level 1', 'Woolworths Home - Level 2', 'HomeChoice - Upper Level'],
    tags: ['home decor', 'furniture', 'homeware', 'weekend special', 'interior design'],
    rating: 4.3,
    reviewCount: 23,
    status: 'active'
  }
];

// Events Database
export const eventsDatabase: EventArticle[] = [
  {
    id: 'event_001',
    title: 'African Art & Culture Festival',
    description: 'Celebrate African heritage with traditional art exhibitions, live performances, and cultural workshops featuring local artists and performers.',
    venueId: 'sandton_city',
    venueName: 'Sandton City',
    eventType: 'festival',
    startDate: '2024-02-10',
    endDate: '2024-02-12',
    startTime: '10:00',
    endTime: '20:00',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1515224313624-3c5c9a69c0a5?w=800&h=600&fit=crop'
    ],
    freeEvent: true,
    capacity: 500,
    registered: 234,
    location: {
      floor: 'Level 1',
      section: 'Central Atrium',
      address: 'Sandton City Shopping Centre, 83 Rivonia Rd, Sandhurst, Sandton'
    },
    organizer: {
      name: 'African Cultural Society',
      contact: '+27 11 217 6000',
      website: 'www.africancultural.co.za'
    },
    featured: true,
    trending: true,
    tags: ['african culture', 'art', 'festival', 'traditional music', 'workshops'],
    category: 'Cultural',
    status: 'upcoming'
  },
  {
    id: 'event_002',
    title: 'Summer Fashion Week Preview',
    description: 'Get an exclusive preview of the latest summer collections from leading South African and international fashion brands.',
    venueId: 'va_waterfront',
    venueName: 'V&A Waterfront',
    eventType: 'exhibition',
    startDate: '2024-02-15',
    endDate: '2024-02-17',
    startTime: '11:00',
    endTime: '19:00',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1574015974293-817f0ebebb74?w=800&h=600&fit=crop'
    ],
    ticketPrice: 'R50',
    freeEvent: false,
    capacity: 300,
    registered: 145,
    location: {
      floor: 'Upper Level',
      section: 'Amphitheatre',
      address: 'V&A Waterfront, Dock Rd, Victoria & Alfred Waterfront, Cape Town'
    },
    organizer: {
      name: 'Cape Town Fashion Council',
      contact: '+27 21 408 7600',
      website: 'www.capetownfashion.co.za'
    },
    featured: true,
    trending: false,
    tags: ['fashion', 'summer collection', 'runway', 'designer showcase', 'style'],
    category: 'Fashion',
    status: 'upcoming'
  },
  {
    id: 'event_003',
    title: 'Tech Innovation Conference',
    description: 'Discover the latest in technology innovation with keynote speakers, product demonstrations, and networking opportunities.',
    venueId: 'gateway_theatre',
    venueName: 'Gateway Theatre',
    eventType: 'conference',
    startDate: '2024-02-20',
    endDate: '2024-02-20',
    startTime: '09:00',
    endTime: '17:00',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop'
    ],
    ticketPrice: 'R150',
    freeEvent: false,
    capacity: 250,
    registered: 89,
    location: {
      floor: 'Level 3',
      section: 'Conference Center',
      address: 'Gateway Theatre of Shopping, 1 Palm Blvd, Umhlanga Ridge, Umhlanga'
    },
    organizer: {
      name: 'KZN Tech Hub',
      contact: '+27 31 566 4000',
      website: 'www.kzntechhub.co.za'
    },
    featured: false,
    trending: true,
    tags: ['technology', 'innovation', 'conference', 'networking', 'startups'],
    category: 'Technology',
    status: 'upcoming'
  }
];

// Helper Functions
export const getArticlesByCategory = (category: Article['category']): Article[] => {
  return articlesDatabase.filter(article => article.category === category);
};

export const getFeaturedArticles = (): Article[] => {
  return articlesDatabase.filter(article => article.featured);
};

export const getTrendingArticles = (): Article[] => {
  return articlesDatabase.filter(article => article.trending);
};

export const getArticlesByVenue = (venueId: string): Article[] => {
  return articlesDatabase.filter(article => article.venueId === venueId);
};

export const getActiveDeals = (): Deal[] => {
  const now = new Date();
  return dealsDatabase.filter(deal => 
    deal.status === 'active' && 
    new Date(deal.validUntil) > now
  );
};

export const getDealsByVenue = (venueId: string): Deal[] => {
  return dealsDatabase.filter(deal => deal.venueId === venueId);
};

export const getFeaturedDeals = (): Deal[] => {
  return getActiveDeals().filter(deal => deal.featured);
};

export const getTrendingDeals = (): Deal[] => {
  return getActiveDeals().filter(deal => deal.trending);
};

export const getUpcomingEvents = (): EventArticle[] => {
  const now = new Date();
  return eventsDatabase.filter(event => 
    event.status === 'upcoming' && 
    new Date(event.startDate) > now
  );
};

export const getEventsByVenue = (venueId: string): EventArticle[] => {
  return eventsDatabase.filter(event => event.venueId === venueId);
};

export const getFeaturedEvents = (): EventArticle[] => {
  return eventsDatabase.filter(event => event.featured);
};

export const searchContent = (query: string): {
  articles: Article[];
  deals: Deal[];
  events: EventArticle[];
} => {
  const searchTerm = query.toLowerCase();
  
  const articles = articlesDatabase.filter(article =>
    article.title.toLowerCase().includes(searchTerm) ||
    article.content.toLowerCase().includes(searchTerm) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );

  const deals = dealsDatabase.filter(deal =>
    deal.title.toLowerCase().includes(searchTerm) ||
    deal.description.toLowerCase().includes(searchTerm) ||
    deal.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );

  const events = eventsDatabase.filter(event =>
    event.title.toLowerCase().includes(searchTerm) ||
    event.description.toLowerCase().includes(searchTerm) ||
    event.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );

  return { articles, deals, events };
};

export const getContentStats = () => {
  return {
    totalArticles: articlesDatabase.length,
    totalDeals: dealsDatabase.length,
    totalEvents: eventsDatabase.length,
    featuredArticles: getFeaturedArticles().length,
    activeDeals: getActiveDeals().length,
    upcomingEvents: getUpcomingEvents().length,
    totalLikes: articlesDatabase.reduce((sum, article) => sum + article.likes, 0),
    totalComments: articlesDatabase.reduce((sum, article) => sum + article.comments, 0),
    totalShares: articlesDatabase.reduce((sum, article) => sum + article.shares, 0)
  };
};
