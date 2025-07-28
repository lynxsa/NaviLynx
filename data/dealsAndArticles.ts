import { ExtendedDeal } from '@/services/DealsService';

// Legacy data file - deals are now managed by DealsService
// This file is kept for backward compatibility and data migration

export const dealsData: ExtendedDeal[] = [
  {
    id: '1',
    title: 'Flash Sale: Electronics',
    description: 'Smartphones, laptops & accessories at unbeatable prices. Get the latest tech gadgets with massive savings.',
    discount: '25% OFF',
    discountPercentage: 25,
    originalPrice: 15999,
    discountedPrice: 11999,
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800',
    venueName: 'TechZone Menlyn',
    venueId: 'store1',
    category: 'Electronics',
    isLimited: true,
    limitedQuantity: 50,
    remainingQuantity: 23,
    badge: 'HOT DEAL',
    tags: ['electronics', 'smartphones', 'laptops'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Fashion Week Special',
    description: 'Latest trends from top South African designers. Discover exclusive collections.',
    discount: '40% OFF',
    discountPercentage: 40,
    originalPrice: 2499,
    discountedPrice: 1499,
    validUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
    venueName: 'Trendy Fashion',
    venueId: 'store2',
    category: 'Fashion',
    isLimited: false,
    badge: 'DESIGNER',
    tags: ['fashion', 'designer', 'clothing'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Article data (for future implementation)
export interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  publishedAt: string;
  image: string;
  category: string;
  tags: string[];
}

export const articlesData: Article[] = [
  // To be implemented when articles feature is added
];

export default {
  deals: dealsData,
  articles: articlesData,
};