import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { BaseCard } from './EnhancedBaseCard';
import { designSystem } from '../../styles/designSystem';
import { IconSymbol } from '../ui/IconSymbol';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  readTime: string;
  image: string;
  author?: {
    name: string;
    avatar?: string;
    title?: string;
  };
  publishedAt?: string;
  tags?: string[];
  likes?: number;
  views?: number;
  isBookmarked?: boolean;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

interface ModernArticleCardProps {
  article: Article;
  onPress: (articleId: number) => void;
  onBookmark?: (articleId: number) => void;
  onShare?: (articleId: number) => void;
  onLike?: (articleId: number) => void;
  style?: ViewStyle;
  variant?: 'compact' | 'standard' | 'featured';
  showAuthor?: boolean;
  showTags?: boolean;
  showActions?: boolean;
  maxTags?: number;
}

export function ModernArticleCard({
  article,
  onPress,
  onBookmark,
  onShare,
  onLike,
  style,
  variant = 'standard',
  showAuthor = true,
  showTags = true,
  showActions = true,
  maxTags = 3,
}: ModernArticleCardProps) {

  const handlePress = () => {
    onPress(article.id);
  };

  const handleBookmark = () => {
    if (onBookmark) {
      onBookmark(article.id);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(article.id);
    }
  };

  const handleLike = () => {
    if (onLike) {
      onLike(article.id);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const categoryColors: { [key: string]: string } = {
      'Technology': designSystem.colors.primary[500],
      'Business': designSystem.colors.success[500],
      'Design': designSystem.colors.primary[500],
      'Marketing': designSystem.colors.warning[500],
      'Travel': designSystem.colors.primary[500],
      'Lifestyle': designSystem.colors.error[500],
    };
    return categoryColors[category] || designSystem.colors.gray[500];
  };

  const getDifficultyColor = (difficulty?: string) => {
    const difficultyColors = {
      'beginner': designSystem.colors.success[500],
      'intermediate': designSystem.colors.warning[500],
      'advanced': designSystem.colors.error[500],
    };
    return difficulty ? difficultyColors[difficulty] : designSystem.colors.gray[500];
  };

  const renderCategoryBadge = () => {
    return (
      <View style={[
        styles.categoryBadge,
        { backgroundColor: getCategoryColor(article.category) }
      ]}>
        <Text style={styles.categoryText}>{article.category}</Text>
      </View>
    );
  };

  const renderDifficultyBadge = () => {
    if (!article.difficulty) return null;
    
    return (
      <View style={[
        styles.difficultyBadge,
        { backgroundColor: getDifficultyColor(article.difficulty) }
      ]}>
        <Text style={styles.difficultyText}>{article.difficulty}</Text>
      </View>
    );
  };

  const renderAuthor = () => {
    if (!showAuthor || !article.author) return null;
    
    return (
      <View style={styles.authorContainer}>
        {article.author.avatar && (
          <Image source={{ uri: article.author.avatar }} style={styles.authorAvatar} />
        )}
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{article.author.name}</Text>
          {article.author.title && (
            <Text style={styles.authorTitle}>{article.author.title}</Text>
          )}
        </View>
      </View>
    );
  };

  const renderTags = () => {
    if (!showTags || !article.tags?.length) return null;
    
    const displayTags = article.tags.slice(0, maxTags);
    
    return (
      <View style={styles.tagsContainer}>
        {displayTags.map((tag, index) => (
          <View key={index} style={styles.tagBadge}>
            <Text style={styles.tagText}>#{tag}</Text>
          </View>
        ))}
        {article.tags.length > maxTags && (
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>+{article.tags.length - maxTags}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderActionButtons = () => {
    if (!showActions) return null;
    
    return (
      <View style={styles.actionsContainer}>
        <View style={styles.statsContainer}>
          {article.likes !== undefined && (
            <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
              <IconSymbol name="heart" size={16} color={designSystem.colors.gray[600]} />
              <Text style={styles.actionText}>{article.likes}</Text>
            </TouchableOpacity>
          )}
          {article.views !== undefined && (
            <View style={styles.statItem}>
              <IconSymbol name="eye" size={16} color={designSystem.colors.gray[600]} />
              <Text style={styles.actionText}>{article.views}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.socialActions}>
          {onBookmark && (
            <TouchableOpacity style={styles.actionButton} onPress={handleBookmark}>
              <IconSymbol 
                name={article.isBookmarked ? "bookmark.fill" : "bookmark"} 
                size={16} 
                color={article.isBookmarked ? designSystem.colors.primary[600] : designSystem.colors.gray[600]} 
              />
            </TouchableOpacity>
          )}
          {onShare && (
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <IconSymbol name="square.and.arrow.up" size={16} color={designSystem.colors.gray[600]} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  // Modernized Compact Variant
  if (variant === 'compact') {
    return (
      <BaseCard
        style={[styles.modernCompactCard, style]}
        onPress={handlePress}
        variant="elevated"
        trackingProps={{
          category: 'article',
          action: 'view',
          label: article.title,
        }}
        id={article.id.toString()}
      >
        <View style={styles.modernCompactContent}>
          {/* Large image with overlays */}
          <View style={styles.modernCompactImageContainer}>
            <Image source={{ uri: article.image }} style={styles.modernCompactImage} />
            <View style={styles.modernCompactOverlay}>
              {renderCategoryBadge()}
              {renderDifficultyBadge()}
            </View>
            <View style={styles.readTimeContainer}>
              <IconSymbol name="clock" size={12} color="#FFFFFF" />
              <Text style={styles.readTimeText}>{article.readTime}</Text>
            </View>
          </View>
          
          {/* Content section */}
          <View style={styles.modernCompactInfo}>
            <Text style={styles.modernCompactTitle} numberOfLines={2}>{article.title}</Text>
            <Text style={styles.modernCompactExcerpt} numberOfLines={2}>{article.excerpt}</Text>
            
            {showAuthor && article.publishedAt && (
              <View style={styles.modernCompactMeta}>
                <Text style={styles.publishDate}>{formatDate(article.publishedAt)}</Text>
              </View>
            )}
            
            {renderTags()}
            {renderActionButtons()}
          </View>
        </View>
      </BaseCard>
    );
  }

  // Modernized Standard Variant
  if (variant === 'standard') {
    return (
      <BaseCard
        style={[styles.modernStandardCard, style]}
        onPress={handlePress}
        variant="elevated"
        trackingProps={{
          category: 'article',
          action: 'view',
          label: article.title,
        }}
        id={article.id.toString()}
      >
        <View style={styles.modernStandardContent}>
          {/* Hero image */}
          <View style={styles.modernStandardImageContainer}>
            <Image source={{ uri: article.image }} style={styles.modernStandardImage} />
            <View style={styles.modernStandardOverlay}>
              {renderCategoryBadge()}
              {renderDifficultyBadge()}
            </View>
            <View style={styles.readTimeContainerStandard}>
              <IconSymbol name="clock" size={14} color="#FFFFFF" />
              <Text style={styles.readTimeTextStandard}>{article.readTime}</Text>
            </View>
          </View>
          
          {/* Content section */}
          <View style={styles.modernStandardInfo}>
            <Text style={styles.modernStandardTitle} numberOfLines={2}>{article.title}</Text>
            <Text style={styles.modernStandardExcerpt} numberOfLines={3}>{article.excerpt}</Text>
            
            {renderAuthor()}
            
            <View style={styles.modernStandardMeta}>
              {article.publishedAt && (
                <Text style={styles.publishDateStandard}>{formatDate(article.publishedAt)}</Text>
              )}
            </View>
            
            {renderTags()}
            {renderActionButtons()}
          </View>
        </View>
      </BaseCard>
    );
  }

  // Modernized Featured Variant
  if (variant === 'featured') {
    return (
      <BaseCard
        style={[styles.modernFeaturedCard, style]}
        onPress={handlePress}
        variant="elevated"
        trackingProps={{
          category: 'article',
          action: 'view',
          label: article.title,
        }}
        id={article.id.toString()}
      >
        <View style={styles.modernFeaturedContent}>
          {/* Large hero image with gradient */}
          <View style={styles.modernFeaturedImageContainer}>
            <Image source={{ uri: article.image }} style={styles.modernFeaturedImage} />
            <View style={styles.modernFeaturedGradient}>
              <View style={styles.modernFeaturedTopBadges}>
                {renderCategoryBadge()}
                {renderDifficultyBadge()}
              </View>
              
              <View style={styles.modernFeaturedBottomContent}>
                <View style={styles.modernFeaturedTitleSection}>
                  <Text style={styles.modernFeaturedTitle} numberOfLines={2}>{article.title}</Text>
                  <View style={styles.readTimeContainerFeatured}>
                    <IconSymbol name="clock" size={14} color="rgba(255,255,255,0.9)" />
                    <Text style={styles.readTimeTextFeatured}>{article.readTime}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          
          {/* Rich content */}
          <View style={styles.modernFeaturedInfo}>
            <Text style={styles.modernFeaturedExcerpt} numberOfLines={4}>{article.excerpt}</Text>
            
            {renderAuthor()}
            
            <View style={styles.modernFeaturedMeta}>
              {article.publishedAt && (
                <Text style={styles.publishDateFeatured}>{formatDate(article.publishedAt)}</Text>
              )}
            </View>
            
            {renderTags()}
            {renderActionButtons()}
          </View>
        </View>
      </BaseCard>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  // Common styles
  categoryBadge: {
    paddingHorizontal: designSystem.spacing.sm,
    paddingVertical: 4,
    borderRadius: designSystem.borderRadius.lg,
    position: 'absolute',
    top: designSystem.spacing.sm,
    left: designSystem.spacing.sm,
  },
  
  categoryText: {
    color: '#FFFFFF',
    fontSize: designSystem.typography.fontSizes.xs,
    fontWeight: designSystem.typography.fontWeights.bold,
  },
  
  difficultyBadge: {
    paddingHorizontal: designSystem.spacing.sm,
    paddingVertical: 4,
    borderRadius: designSystem.borderRadius.lg,
    position: 'absolute',
    top: designSystem.spacing.sm,
    right: designSystem.spacing.sm,
  },
  
  difficultyText: {
    color: '#FFFFFF',
    fontSize: designSystem.typography.fontSizes.xs,
    fontWeight: designSystem.typography.fontWeights.bold,
    textTransform: 'capitalize',
  },
  
  readTimeContainer: {
    position: 'absolute',
    bottom: designSystem.spacing.sm,
    right: designSystem.spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: designSystem.spacing.sm,
    paddingVertical: 4,
    borderRadius: designSystem.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  
  readTimeText: {
    color: '#FFFFFF',
    fontSize: designSystem.typography.fontSizes.xs,
    fontWeight: designSystem.typography.fontWeights.medium,
  },
  
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designSystem.spacing.sm,
    marginVertical: designSystem.spacing.sm,
  },
  
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: designSystem.colors.gray[200],
  },
  
  authorInfo: {
    flex: 1,
  },
  
  authorName: {
    fontSize: designSystem.typography.fontSizes.sm,
    fontWeight: designSystem.typography.fontWeights.semibold,
    color: designSystem.colors.gray[900],
  },
  
  authorTitle: {
    fontSize: designSystem.typography.fontSizes.xs,
    color: designSystem.colors.gray[600],
  },
  
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: designSystem.spacing.xs,
    marginTop: designSystem.spacing.sm,
  },
  
  tagBadge: {
    backgroundColor: designSystem.colors.gray[100],
    paddingHorizontal: designSystem.spacing.sm,
    paddingVertical: 4,
    borderRadius: designSystem.borderRadius.md,
  },
  
  tagText: {
    fontSize: designSystem.typography.fontSizes.xs,
    color: designSystem.colors.gray[700],
    fontWeight: designSystem.typography.fontWeights.medium,
  },
  
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: designSystem.spacing.md,
    paddingTop: designSystem.spacing.md,
    borderTopWidth: 1,
    borderTopColor: designSystem.colors.gray[200],
  },
  
  statsContainer: {
    flexDirection: 'row',
    gap: designSystem.spacing.md,
  },
  
  socialActions: {
    flexDirection: 'row',
    gap: designSystem.spacing.sm,
  },
  
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: designSystem.spacing.xs,
  },
  
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  
  actionText: {
    fontSize: designSystem.typography.fontSizes.sm,
    color: designSystem.colors.gray[600],
    fontWeight: designSystem.typography.fontWeights.medium,
  },
  
  publishDate: {
    fontSize: designSystem.typography.fontSizes.xs,
    color: designSystem.colors.gray[500],
  },

  // Compact Variant - Modernized
  modernCompactCard: {
    width: 300, // Increased width
    marginRight: designSystem.spacing.md,
  },
  
  modernCompactContent: {
    flex: 1,
  },
  
  modernCompactImageContainer: {
    position: 'relative',
    height: 180, // Larger image
    borderRadius: designSystem.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: designSystem.spacing.md,
  },
  
  modernCompactImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  
  modernCompactOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  modernCompactInfo: {
    paddingHorizontal: designSystem.spacing.sm,
  },
  
  modernCompactTitle: {
    fontSize: designSystem.typography.fontSizes.lg,
    fontWeight: designSystem.typography.fontWeights.bold,
    color: designSystem.colors.gray[900],
    marginBottom: designSystem.spacing.xs,
  },
  
  modernCompactExcerpt: {
    fontSize: designSystem.typography.fontSizes.sm,
    color: designSystem.colors.gray[700],
    lineHeight: 20,
    marginBottom: designSystem.spacing.sm,
  },
  
  modernCompactMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: designSystem.spacing.sm,
  },

  // Standard Variant - Modernized
  modernStandardCard: {
    width: '100%',
    marginBottom: designSystem.spacing.lg,
  },
  
  modernStandardContent: {
    flex: 1,
  },
  
  modernStandardImageContainer: {
    position: 'relative',
    height: 220, // Generous image height
    borderRadius: designSystem.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: designSystem.spacing.md,
  },
  
  modernStandardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  
  modernStandardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  readTimeContainerStandard: {
    position: 'absolute',
    bottom: designSystem.spacing.md,
    right: designSystem.spacing.md,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: designSystem.spacing.md,
    paddingVertical: 6,
    borderRadius: designSystem.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  
  readTimeTextStandard: {
    color: '#FFFFFF',
    fontSize: designSystem.typography.fontSizes.sm,
    fontWeight: designSystem.typography.fontWeights.medium,
  },
  
  modernStandardInfo: {
    paddingHorizontal: designSystem.spacing.md,
    paddingBottom: designSystem.spacing.md,
  },
  
  modernStandardTitle: {
    fontSize: designSystem.typography.fontSizes.xl,
    fontWeight: designSystem.typography.fontWeights.bold,
    color: designSystem.colors.gray[900],
    marginBottom: designSystem.spacing.sm,
  },
  
  modernStandardExcerpt: {
    fontSize: designSystem.typography.fontSizes.md,
    color: designSystem.colors.gray[700],
    lineHeight: 22,
    marginBottom: designSystem.spacing.sm,
  },
  
  modernStandardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: designSystem.spacing.sm,
  },
  
  publishDateStandard: {
    fontSize: designSystem.typography.fontSizes.sm,
    color: designSystem.colors.gray[500],
  },

  // Featured Variant - Premium
  modernFeaturedCard: {
    width: '100%',
    marginBottom: designSystem.spacing.xl,
  },
  
  modernFeaturedContent: {
    flex: 1,
  },
  
  modernFeaturedImageContainer: {
    position: 'relative',
    height: 280, // Large hero image
    borderRadius: designSystem.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: designSystem.spacing.md,
  },
  
  modernFeaturedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  
  modernFeaturedGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'space-between',
    padding: designSystem.spacing.md,
  },
  
  modernFeaturedTopBadges: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  
  modernFeaturedBottomContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  
  modernFeaturedTitleSection: {
    flex: 1,
  },
  
  modernFeaturedTitle: {
    fontSize: designSystem.typography.fontSizes['2xl'],
    fontWeight: designSystem.typography.fontWeights.bold,
    color: '#FFFFFF',
    marginBottom: designSystem.spacing.sm,
  },
  
  readTimeContainerFeatured: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  
  readTimeTextFeatured: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: designSystem.typography.fontSizes.md,
    fontWeight: designSystem.typography.fontWeights.medium,
  },
  
  modernFeaturedInfo: {
    paddingHorizontal: designSystem.spacing.md,
    paddingBottom: designSystem.spacing.md,
  },
  
  modernFeaturedExcerpt: {
    fontSize: designSystem.typography.fontSizes.lg,
    color: designSystem.colors.gray[700],
    lineHeight: 26,
    marginBottom: designSystem.spacing.md,
  },
  
  modernFeaturedMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: designSystem.spacing.sm,
  },
  
  publishDateFeatured: {
    fontSize: designSystem.typography.fontSizes.md,
    color: designSystem.colors.gray[500],
  },
});
