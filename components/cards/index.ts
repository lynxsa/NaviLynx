// Card Components Index
// Reusable card components for NaviLynx application

// Legacy cards
export { BaseCard } from './BaseCard';
export { VenueCard } from './VenueCard';
export { EnhancedVenueCard } from './EnhancedVenueCard';
export { DealCard } from './DealCard';
export { ArticleCard } from './ArticleCard';

// Enhanced V2 cards (World-class components)
export { EnhancedVenueCard as EnhancedVenueCardV2 } from './EnhancedVenueCardV2';
export { EnhancedDealCard as EnhancedDealCardV2 } from './EnhancedDealCardV2';
export { EnhancedArticleCard as EnhancedArticleCardV2 } from './EnhancedArticleCardV2';
export { BaseCard as EnhancedBaseCard } from './EnhancedBaseCard';

// Modern cards with enhanced image visibility and CTA functionality (2025 Edition)
export { ModernVenueCard } from './ModernVenueCard';
export { EnhancedDealCard as ModernDealCard } from './EnhancedDealCardV2';
export { ModernArticleCard } from './ModernArticleCard';

// Type exports for easier usage
export type { BaseCardProps } from './BaseCard';

// Card variant types for consistency
export type CardVariant = 'featured' | 'list' | 'grid' | 'compact';
export type CardSize = 'small' | 'medium' | 'large';

// Common card interfaces
export interface BaseCardItem {
  id: string;
  title?: string;
  image?: string;
  category?: string;
}
