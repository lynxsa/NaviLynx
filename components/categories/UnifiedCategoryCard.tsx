import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '@/context/ThemeContext';
import { colors, spacing, borderRadius, shadows } from '@/styles/modernTheme';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
    image: string;
    venueCount: number;
  };
  onPress?: (categoryId: string) => void;
  width?: number;
}

export const UnifiedCategoryCard: React.FC<CategoryCardProps> = ({ 
  category, 
  onPress,
  width = 160
}) => {
  const { isDark } = useTheme();

  const handlePress = () => {
    if (onPress) {
      onPress(category.id);
    } else {
      router.push(`/explore?category=${category.id}`);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        { 
          width,
          backgroundColor: isDark ? colors.surface : '#FFFFFF'
        }
      ]}
      onPress={handlePress}
    >
      <Image source={{ uri: category.image }} style={styles.categoryImage} />
      <View style={styles.categoryOverlay}>
        <View style={styles.categoryHeader}>
          <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
            <IconSymbol name={category.icon as any} size={20} color="#FFFFFF" />
          </View>
          <View style={styles.categoryTextContainer}>
            <Text style={styles.categoryName} numberOfLines={2}>{category.name}</Text>
            <Text style={styles.categoryCount}>{category.venueCount} venues</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  categoryCard: {
    height: 160,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginBottom: spacing.md,
    ...shadows.md,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 16,
    justifyContent: 'center',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
    lineHeight: 14,
  },
  categoryCount: {
    fontSize: 10,
    color: '#FFFFFF',
    opacity: 0.8,
  },
});

export default UnifiedCategoryCard;
