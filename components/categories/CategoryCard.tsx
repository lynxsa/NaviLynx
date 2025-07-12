import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { BlurView } from '@/components/ui/BlurView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { spacing, borderRadius } from '@/styles/modernTheme';
import { categories } from '@/data/southAfricanVenues';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.4;

interface CategoryCardProps {
  category?: typeof categories[0];
  onPress?: (category: typeof categories[0]) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ 
  category = categories[0], 
  onPress 
}) => {
  const handlePress = () => {
    if (onPress) {
      onPress(category);
    } else {
      router.push(`/explore?category=${category.id}`);
    }
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      style={[styles.card, { width: cardWidth }]}
    >
      <ImageBackground
        source={{ uri: category.image }}
        style={styles.imageBackground}
        imageStyle={{ resizeMode: 'cover' }}
      >
        {/* Gradient Overlay */}
        <View style={styles.overlay} />
        
        {/* Glass Card Overlay */}
        <BlurView style={styles.blurOverlay} tint="light" intensity={30}>
          
          {/* Content */}
          <View style={styles.content}>
            {/* Icon and Text Side by Side */}
            <View style={styles.headerContainer}>
              <View style={styles.iconContainer}>
                <BlurView style={styles.iconBlur} tint="light" intensity={40}>
                  <IconSymbol 
                    name={category.icon as any} 
                    size={20} 
                    color="white" 
                  />
                </BlurView>
              </View>
              
              <View style={styles.textContainer}>
                <Text style={styles.categoryName} numberOfLines={2}>
                  {category.name}
                </Text>
                <View style={styles.venueInfo}>
                  <View style={styles.dot} />
                  <Text style={styles.venueCount}>
                    {category.venueCount} venues
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </BlurView>

        {/* Hover Effect Indicator */}
        <View style={styles.arrowContainer}>
          <BlurView style={styles.arrowBlur} tint="light" intensity={40}>
            <IconSymbol name="arrow.up.right" size={12} color="white" />
          </BlurView>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

// Enhanced Categories Carousel Component
interface CategoriesCarouselProps {
  onCategoryPress?: (category: typeof categories[0]) => void;
}

export const CategoriesCarousel: React.FC<CategoriesCarouselProps> = ({ onCategoryPress }) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {categories.map((category) => (
        <CategoryCard 
          key={category.id} 
          category={category} 
          onPress={onCategoryPress} 
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  imageBackground: {
    height: 144,
    borderRadius: borderRadius['2xl'],
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  blurOverlay: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    height: 70,
    borderRadius: borderRadius['2xl'],
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.md,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconContainer: {
    alignSelf: 'flex-start',
  },
  iconBlur: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  categoryName: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 2,
    lineHeight: 16,
  },
  venueInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  venueCount: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    fontWeight: '500',
  },
  arrowContainer: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
  },
  arrowBlur: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
});
