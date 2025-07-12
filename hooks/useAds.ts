import { useState, useEffect, useCallback } from 'react';

export interface Ad {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  ctaAction: () => void;
  advertiser: {
    name: string;
    logo: string;
  };
  placement: 'home' | 'explore' | 'ar' | 'venue' | 'banner';
  priority: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
  impressions: number;
  clicks: number;
  budget: number;
  spent: number;
  targetAudience?: {
    ageRange?: [number, number];
    interests?: string[];
    location?: string;
  };
}

export interface AdMetrics {
  totalImpressions: number;
  totalClicks: number;
  ctr: number; // Click-through rate
  revenue: number;
  topPerformingAds: Ad[];
}

// Dummy ads data
const DUMMY_ADS: Ad[] = [
  {
    id: '1',
    title: 'Summer Sale - Up to 70% Off',
    subtitle: 'Zara Fashion Collection',
    description: 'Discover the latest summer trends with massive discounts',
    imageUrl: 'https://picsum.photos/800/400?random=10',
    ctaText: 'Shop Now',
    ctaAction: () => console.log('Navigate to Zara'),
    advertiser: {
      name: 'Zara',
      logo: 'https://picsum.photos/100/50?random=20',
    },
    placement: 'home',
    priority: 1,
    isActive: true,
    startDate: '2025-06-01T00:00:00Z',
    endDate: '2025-06-30T23:59:59Z',
    impressions: 15420,
    clicks: 892,
    budget: 10000,
    spent: 7500,
    targetAudience: {
      ageRange: [18, 45],
      interests: ['fashion', 'shopping'],
    },
  },
  {
    id: '2',
    title: 'New iPhone 15 Pro',
    subtitle: 'Now Available at iStore',
    description: 'Experience the most advanced iPhone ever made',
    imageUrl: 'https://picsum.photos/800/400?random=11',
    ctaText: 'Learn More',
    ctaAction: () => console.log('Navigate to iStore'),
    advertiser: {
      name: 'iStore',
      logo: 'https://picsum.photos/100/50?random=21',
    },
    placement: 'explore',
    priority: 2,
    isActive: true,
    startDate: '2025-06-05T00:00:00Z',
    endDate: '2025-07-05T23:59:59Z',
    impressions: 12350,
    clicks: 1245,
    budget: 15000,
    spent: 9200,
    targetAudience: {
      ageRange: [25, 55],
      interests: ['technology', 'gadgets'],
    },
  },
  {
    id: '3',
    title: 'Gourmet Coffee Experience',
    subtitle: 'Vida e Caffè Premium Blend',
    description: 'Taste the perfect cup with our artisan coffee selection',
    imageUrl: 'https://picsum.photos/800/400?random=12',
    ctaText: 'Visit Store',
    ctaAction: () => console.log('Navigate to Vida e Caffè'),
    advertiser: {
      name: 'Vida e Caffè',
      logo: 'https://picsum.photos/100/50?random=22',
    },
    placement: 'ar',
    priority: 3,
    isActive: true,
    startDate: '2025-06-10T00:00:00Z',
    endDate: '2025-06-25T23:59:59Z',
    impressions: 8760,
    clicks: 543,
    budget: 5000,
    spent: 3200,
    targetAudience: {
      ageRange: [22, 40],
      interests: ['coffee', 'lifestyle'],
    },
  },
  {
    id: '4',
    title: 'Sports Collection 2025',
    subtitle: 'Sportscene Exclusive',
    description: 'Gear up with the latest athletic wear and sneakers',
    imageUrl: 'https://picsum.photos/800/400?random=13',
    ctaText: 'Shop Collection',
    ctaAction: () => console.log('Navigate to Sportscene'),
    advertiser: {
      name: 'Sportscene',
      logo: 'https://picsum.photos/100/50?random=23',
    },
    placement: 'venue',
    priority: 2,
    isActive: true,
    startDate: '2025-06-01T00:00:00Z',
    endDate: '2025-07-31T23:59:59Z',
    impressions: 19200,
    clicks: 1680,
    budget: 12000,
    spent: 8400,
    targetAudience: {
      ageRange: [16, 35],
      interests: ['sports', 'fitness', 'fashion'],
    },
  },
  {
    id: '5',
    title: 'Home Décor Sale',
    subtitle: '@Home Interior Collection',
    description: 'Transform your space with beautiful home accessories',
    imageUrl: 'https://picsum.photos/800/400?random=14',
    ctaText: 'Explore Range',
    ctaAction: () => console.log('Navigate to @Home'),
    advertiser: {
      name: '@Home',
      logo: 'https://picsum.photos/100/50?random=24',
    },
    placement: 'banner',
    priority: 3,
    isActive: true,
    startDate: '2025-06-08T00:00:00Z',
    endDate: '2025-06-22T23:59:59Z',
    impressions: 11450,
    clicks: 687,
    budget: 8000,
    spent: 5600,
    targetAudience: {
      ageRange: [25, 50],
      interests: ['home', 'decoration', 'lifestyle'],
    },
  },
];

export function useAds() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<AdMetrics | null>(null);

  // Load ads on mount
  useEffect(() => {
    loadAds();
    calculateMetrics();
  }, []);

  const loadAds = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter active ads
      const activeAds = DUMMY_ADS.filter(ad => {
        const now = new Date();
        const startDate = new Date(ad.startDate);
        const endDate = new Date(ad.endDate);
        return ad.isActive && now >= startDate && now <= endDate;
      });
      
      // Sort by priority
      activeAds.sort((a, b) => a.priority - b.priority);
      
      setAds(activeAds);
    } catch (error) {
      console.error('Error loading ads:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const calculateMetrics = useCallback(() => {
    const totalImpressions = DUMMY_ADS.reduce((sum, ad) => sum + ad.impressions, 0);
    const totalClicks = DUMMY_ADS.reduce((sum, ad) => sum + ad.clicks, 0);
    const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const revenue = DUMMY_ADS.reduce((sum, ad) => sum + ad.spent, 0);
    
    const topPerformingAds = [...DUMMY_ADS]
      .sort((a, b) => (b.clicks / Math.max(b.impressions, 1)) - (a.clicks / Math.max(a.impressions, 1)))
      .slice(0, 3);

    setMetrics({
      totalImpressions,
      totalClicks,
      ctr,
      revenue,
      topPerformingAds,
    });
  }, []);

  const getAdsByPlacement = useCallback((placement: Ad['placement']): Ad[] => {
    return ads.filter(ad => ad.placement === placement);
  }, [ads]);

  const getRandomAd = useCallback((placement?: Ad['placement']): Ad | null => {
    const filteredAds = placement ? getAdsByPlacement(placement) : ads;
    if (filteredAds.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * filteredAds.length);
    return filteredAds[randomIndex];
  }, [ads, getAdsByPlacement]);

  const recordImpression = useCallback(async (adId: string) => {
    try {
      // In real app, this would be an API call
      setAds(currentAds => 
        currentAds.map(ad => 
          ad.id === adId 
            ? { ...ad, impressions: ad.impressions + 1 }
            : ad
        )
      );
      
      // Update the dummy data for consistency
      const adIndex = DUMMY_ADS.findIndex(ad => ad.id === adId);
      if (adIndex !== -1) {
        DUMMY_ADS[adIndex].impressions += 1;
      }
    } catch (error) {
      console.error('Error recording impression:', error);
    }
  }, []);

  const recordClick = useCallback(async (adId: string) => {
    try {
      // In real app, this would be an API call
      setAds(currentAds => 
        currentAds.map(ad => 
          ad.id === adId 
            ? { ...ad, clicks: ad.clicks + 1 }
            : ad
        )
      );
      
      // Update the dummy data for consistency
      const adIndex = DUMMY_ADS.findIndex(ad => ad.id === adId);
      if (adIndex !== -1) {
        DUMMY_ADS[adIndex].clicks += 1;
      }
      
      // Also record impression if not already recorded
      await recordImpression(adId);
    } catch (error) {
      console.error('Error recording click:', error);
    }
  }, [recordImpression]);

  const refreshAds = useCallback(async () => {
    await loadAds();
    calculateMetrics();
  }, [loadAds, calculateMetrics]);

  return {
    ads,
    isLoading,
    metrics,
    getAdsByPlacement,
    getRandomAd,
    recordImpression,
    recordClick,
    refreshAds,
  };
}
