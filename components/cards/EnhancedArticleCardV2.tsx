import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { BaseCard } from './EnhancedBaseCard';
import { designSystem } from '../../styles/designSystem';
import { IconSymbol } from '../ui/IconSymbol';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  image: string;
  author?: {
    name: string;
    avatar?: string;
  };
  publishedAt?: string;
  tags?: string[];
  isBookmarked?: boolean;
  shareUrl?: string;
}

interface EnhancedArticleCardProps {
  article: Article;
  onPress: (articleId: number) => void;
  onBookmark?: (articleId: number) => void;
  onShare?: (articleId: number) => void;
  style?: ViewStyle;
  variant?: 'compact' | 'standard' | 'featured';
  showAuthor?: boolean;
  showTags?: boolean;
  maxTags?: number;
}

export function EnhancedArticleCard({
  article,
  onPress,
  onBookmark,
  onShare,
  style,
  variant = 'standard',
  showAuthor = true,
  showTags = true,
  maxTags = 2,
}: EnhancedArticleCardProps) {
  const handlePress = () => onPress(article.id);
  const handleBookmark = () => onBookmark?.(article.id);
  const handleShare = () => onShare?.(article.id);

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
    const colors = {
      'Navigation': designSystem.colors.primary[500],
      'Shopping': designSystem.colors.success[500],
      'Technology': designSystem.colors.warning[500],
      'Food': designSystem.colors.error[500],
      'Travel': designSystem.colors.primary[600],
      'Entertainment': designSystem.colors.warning[600],
    };
    return colors[category as keyof typeof colors] || designSystem.colors.gray[500];
  };

  const renderCategoryBadge = () => (
    <View style={[
      styles.categoryBadge,
      { backgroundColor: getCategoryColor(article.category) + '20' }
    ]}>
      <Text style={[
        styles.categoryText,
        { color: getCategoryColor(article.category) }
      ]}>
        {article.category}
      </Text>
    </View>
  );

  const renderReadTime = () => (
    <View style={styles.readTimeContainer}>
      <IconSymbol name="clock" size={12} color={designSystem.colors.text.secondary} />
      <Text style={styles.readTimeText}>{article.readTime}</Text>
    </View>
  );

  const renderAuthor = () => {
    if (!showAuthor || !article.author) return null;
    
    return (
      <View style={styles.authorContainer}>
        {article.author.avatar && (
          <Image source={{ uri: article.author.avatar }} style={styles.authorAvatar} />
        )}
        <Text style={styles.authorName}>{article.author.name}</Text>
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
          <Text style={styles.moreTagsText}>
            +{article.tags.length - maxTags} more
          </Text>
        )}
      </View>
    );
  };

  const renderActions = () => (
    <View style={styles.actionsContainer}>
      {onBookmark && (
        <View style={styles.actionButton}>
          <IconSymbol 
            name={article.isBookmarked ? "bookmark.fill" : "bookmark"} 
            size={16} 
            color={article.isBookmarked ? designSystem.colors.primary[500] : designSystem.colors.text.secondary} 
          />
        </View>
      )}
      {onShare && (
        <View style={styles.actionButton}>
          <IconSymbol 
            name="square.and.arrow.up" 
            size={16} 
            color={designSystem.colors.text.secondary} 
          />
        </View>
      )}
    </View>
  );

  if (variant === 'compact') {
    return (
      <BaseCard
        style={[styles.compactCard, style]}
        onPress={handlePress}
        variant="outlined"
        size="compact"
        trackingProps={{
          category: 'article',
          action: 'view',
          label: article.title,
        }}
        id={article.id.toString()}
      >
        <View style={styles.compactContent}>
          <Image source={{ uri: article.image }} style={styles.compactImage} />
          
          <View style={styles.compactInfo}>
            <View style={styles.compactHeader}>
              {renderCategoryBadge()}
              {renderReadTime()}
            </View>
            
            <Text style={styles.compactTitle} numberOfLines={2}>
              {article.title}
            </Text>
            
            <View style={styles.compactFooter}>
              {renderAuthor()}
              {article.publishedAt && (
                <Text style={styles.publishedDate}>
                  {formatDate(article.publishedAt)}
                </Text>
              )}
            </View>
          </View>
          
          {renderActions()}
        </View>
      </BaseCard>
    );
  }

  if (variant === 'featured') {
    return (
      <BaseCard
        style={[styles.featuredCard, style]}
        onPress={handlePress}
        variant="elevated"
        size="expanded"
        trackingProps={{
          category: 'article',
          action: 'view_featured',
          label: article.title,
        }}
        id={article.id.toString()}
      >
        <View style={styles.featuredContent}>
          <View style={styles.featuredImageContainer}>
            <Image source={{ uri: article.image }} style={styles.featuredImage} />
            <View style={styles.featuredOverlay}>
              {renderCategoryBadge()}
            </View>
          </View>
          
          <View style={styles.featuredInfo}>
            <View style={styles.featuredHeader}>
              <Text style={styles.featuredTitle} numberOfLines={3}>
                {article.title}
              </Text>
              
              <View style={styles.featuredMeta}>
                {renderReadTime()}
                {article.publishedAt && (
                  <Text style={styles.publishedDate}>
                    {formatDate(article.publishedAt)}
                  </Text>
                )}
              </View>
            </View>
            
            <Text style={styles.featuredExcerpt} numberOfLines={4}>
              {article.excerpt}
            </Text>
            
            {renderTags()}
            
            <View style={styles.featuredFooter}>
              {renderAuthor()}
              {renderActions()}
            </View>
          </View>
        </View>
      </BaseCard>
    );
  }

  // Standard variant
  return (
    <BaseCard
      style={[styles.standardCard, style]}
      onPress={handlePress}
      variant="elevated"
      size="standard"
      trackingProps={{
        category: 'article',
        action: 'view',
        label: article.title,
      }}
      id={article.id.toString()}
    >
      <View style={styles.standardContent}>
        <View style={styles.standardImageContainer}>
          <Image source={{ uri: article.image }} style={styles.standardImage} />
          <View style={styles.standardOverlay}>
            {renderCategoryBadge()}
          </View>
        </View>
        
        <View style={styles.standardInfo}>
          <View style={styles.standardHeader}>
            <Text style={styles.standardTitle} numberOfLines={2}>
              {article.title}
            </Text>
            {renderActions()}
          </View>
          
          <View style={styles.standardMeta}>
            {renderReadTime()}
            {article.publishedAt && (
              <Text style={styles.publishedDate}>
                {formatDate(article.publishedAt)}
              </Text>
            )}
          </View>
          
          <Text style={styles.standardExcerpt} numberOfLines={3}>
            {article.excerpt}
          </Text>
          
          <View style={styles.standardFooter}>
            {renderAuthor()}
            {renderTags()}
          </View>
        </View>
      </View>
    </BaseCard>
  );
}

const styles = StyleSheet.create({
  // Compact variant
  compactCard: {
    marginBottom: designSystem.spacing.sm,
  },
  
  compactContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  compactImage: {
    width: 80,
    height: 80,
    borderRadius: designSystem.borderRadius.lg,
    marginRight: designSystem.spacing.md,
  },
  
  compactInfo: {
    flex: 1,
  },
  
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designSystem.spacing.sm,
    marginBottom: designSystem.spacing.xs,
  },
  
  compactTitle: {
    fontSize: designSystem.typography.fontSizes.base,
    fontWeight: designSystem.typography.fontWeights.semibold,
    color: designSystem.colors.text.primary,
    lineHeight: designSystem.typography.lineHeights.snug * designSystem.typography.fontSizes.base,
    marginBottom: designSystem.spacing.sm,
  },
  
  compactFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Featured variant
  featuredCard: {
    marginBottom: designSystem.spacing.lg,
  },
  
  featuredContent: {
    flex: 1,
  },
  
  featuredImageContainer: {
    position: 'relative',
    height: 220,
    borderRadius: designSystem.borderRadius.xl,
    overflow: 'hidden',
    marginBottom: designSystem.spacing.md,
  },
  
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  
  featuredOverlay: {
    position: 'absolute',
    top: designSystem.spacing.md,
    left: designSystem.spacing.md,
  },
  
  featuredInfo: {
    flex: 1,
  },
  
  featuredHeader: {
    marginBottom: designSystem.spacing.md,
  },
  
  featuredTitle: {
    fontSize: designSystem.typography.fontSizes['2xl'],
    fontWeight: designSystem.typography.fontWeights.bold,
    color: designSystem.colors.text.primary,
    lineHeight: designSystem.typography.lineHeights.tight * designSystem.typography.fontSizes['2xl'],
    marginBottom: designSystem.spacing.sm,
  },
  
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designSystem.spacing.md,
  },
  
  featuredExcerpt: {
    fontSize: designSystem.typography.fontSizes.base,
    color: designSystem.colors.text.secondary,
    lineHeight: designSystem.typography.lineHeights.relaxed * designSystem.typography.fontSizes.base,
    marginBottom: designSystem.spacing.md,
  },
  
  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: designSystem.spacing.md,
  },

  // Standard variant
  standardCard: {
    marginBottom: designSystem.spacing.md,
  },
  
  standardContent: {
    flex: 1,
  },
  
  standardImageContainer: {
    position: 'relative',
    height: 160,
    borderRadius: designSystem.borderRadius.xl,
    overflow: 'hidden',
    marginBottom: designSystem.spacing.md,
  },
  
  standardImage: {
    width: '100%',
    height: '100%',
  },
  
  standardOverlay: {
    position: 'absolute',
    top: designSystem.spacing.md,
    left: designSystem.spacing.md,
  },
  
  standardInfo: {
    flex: 1,
  },
  
  standardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: designSystem.spacing.sm,
  },
  
  standardTitle: {
    fontSize: designSystem.typography.fontSizes.lg,
    fontWeight: designSystem.typography.fontWeights.semibold,
    color: designSystem.colors.text.primary,
    flex: 1,
    marginRight: designSystem.spacing.sm,
    lineHeight: designSystem.typography.lineHeights.snug * designSystem.typography.fontSizes.lg,
  },
  
  standardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designSystem.spacing.md,
    marginBottom: designSystem.spacing.sm,
  },
  
  standardExcerpt: {
    fontSize: designSystem.typography.fontSizes.base,
    color: designSystem.colors.text.secondary,
    lineHeight: designSystem.typography.lineHeights.relaxed * designSystem.typography.fontSizes.base,
    marginBottom: designSystem.spacing.md,
  },
  
  standardFooter: {
    gap: designSystem.spacing.sm,
  },

  // Common components
  categoryBadge: {
    paddingHorizontal: designSystem.spacing.sm,
    paddingVertical: 4,
    borderRadius: designSystem.borderRadius.full,
  },
  
  categoryText: {
    fontSize: designSystem.typography.fontSizes.xs,
    fontWeight: designSystem.typography.fontWeights.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  readTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  
  readTimeText: {
    fontSize: designSystem.typography.fontSizes.sm,
    color: designSystem.colors.text.secondary,
    fontWeight: designSystem.typography.fontWeights.medium,
  },
  
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: designSystem.spacing.sm,
  },
  
  authorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  
  authorName: {
    fontSize: designSystem.typography.fontSizes.sm,
    color: designSystem.colors.text.primary,
    fontWeight: designSystem.typography.fontWeights.medium,
  },
  
  publishedDate: {
    fontSize: designSystem.typography.fontSizes.sm,
    color: designSystem.colors.text.secondary,
  },
  
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: designSystem.spacing.xs,
    alignItems: 'center',
  },
  
  tagBadge: {
    backgroundColor: designSystem.colors.gray[100],
    paddingHorizontal: designSystem.spacing.sm,
    paddingVertical: 2,
    borderRadius: designSystem.borderRadius.md,
  },
  
  tagText: {
    fontSize: designSystem.typography.fontSizes.xs,
    color: designSystem.colors.text.secondary,
    fontWeight: designSystem.typography.fontWeights.medium,
  },
  
  moreTagsText: {
    fontSize: designSystem.typography.fontSizes.xs,
    color: designSystem.colors.text.secondary,
    fontStyle: 'italic',
  },
  
  actionsContainer: {
    flexDirection: 'row',
    gap: designSystem.spacing.sm,
  },
  
  actionButton: {
    padding: designSystem.spacing.xs,
    borderRadius: designSystem.borderRadius.md,
    backgroundColor: designSystem.colors.gray[50],
  },
});
