import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { BaseCard } from './BaseCard';
import { colors } from '../../styles/modernTheme';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  image: string;
}

interface ArticleCardProps {
  article: Article;
  onPress: (id: number) => void;
  style?: ViewStyle;
  cardWidth?: number;
}

export function ArticleCard({ article, onPress, style, cardWidth = 220 }: ArticleCardProps) {
  return (
    <BaseCard
      style={{
        width: cardWidth, 
        marginRight: 16,
        ...(style || {})
      }}
      onPress={() => onPress(article.id)}
      variant="elevated"
    >
      <View style={styles.container}>
        {/* Article Image */}
        <Image 
          source={{ uri: article.image }}
          style={styles.articleImage}
          resizeMode="cover"
        />

        {/* Article Content */}
        <View style={styles.contentContainer}>
          {/* Category and Read Time */}
          <View style={styles.metaContainer}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{article.category}</Text>
            </View>
            <Text style={styles.readTimeText}>{article.readTime}</Text>
          </View>

          {/* Title */}
          <Text style={styles.articleTitle} numberOfLines={2}>
            {article.title}
          </Text>

          {/* Excerpt */}
          <Text style={styles.articleExcerpt} numberOfLines={3}>
            {article.excerpt}
          </Text>
        </View>
      </View>
    </BaseCard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  articleImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  contentContainer: {
    padding: 12,
    flex: 1,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.primary,
    textTransform: 'uppercase',
  },
  readTimeText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  articleExcerpt: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
    flex: 1,
  },
});