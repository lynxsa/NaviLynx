import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { BlurView } from '@/components/ui/BlurView';
import { useTheme } from '@/context/ThemeContext';
import { colors, spacing, borderRadius, shadows } from '@/styles/modernTheme';
import { categories, getVenuesByCategory } from '@/data/southAfricanVenues';

const { width } = Dimensions.get('window');

interface CategoryGridProps {
  onCategoryPress?: (categoryId: string) => void;
}

export const EnhancedCategoriesGrid: React.FC<CategoryGridProps> = ({ onCategoryPress }) => {
  const { isDark } = useTheme();

  const handleCategoryPress = (categoryId: string) => {
    if (onCategoryPress) {
      onCategoryPress(categoryId);
    } else {
      router.push(`/explore?category=${categoryId}`);
    }
  };

  const getIconName = (categoryId: string) => {
    const iconMap: Record<string, string> = {
      'shopping-malls': 'bag.fill',
      'airports': 'airplane',
      'parks': 'leaf.fill',
      'hospitals': 'cross.fill',
      'stadiums': 'sportscourt.fill',
      'universities': 'graduationcap.fill',
      'government': 'building.columns.fill'
    };
    return iconMap[categoryId] || 'building.2.fill';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? '#FFFFFF' : colors.gray[900] }]}>
          Explore South Africa
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? colors.gray[300] : colors.gray[600] }]}>
          Navigate through {categories.length} venue categories
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {categories.map((category, index) => {
            const venuesInCategory = getVenuesByCategory(category.id);
            const isLarge = index % 3 === 0; // Every third item is large
            
            return (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  isLarge ? styles.largeCategoryCard : styles.smallCategoryCard,
                  { backgroundColor: category.color + '20' }
                ]}
                onPress={() => handleCategoryPress(category.id)}
                activeOpacity={0.8}
              >
                <ImageBackground
                  source={{ uri: category.image }}
                  style={styles.categoryImage}
                  imageStyle={{ borderRadius: borderRadius.xl }}
                >
                  {/* Gradient overlay */}
                  <View style={[styles.overlay, { backgroundColor: category.color + '80' }]} />
                  
                  {/* Content */}
                  <View style={styles.categoryContent}>
                    {/* Icon container */}
                    <View style={styles.iconContainer}>
                      <BlurView style={styles.iconBlur} tint="light" intensity={40}>
                        <IconSymbol 
                          name={getIconName(category.id) as any} 
                          size={isLarge ? 32 : 24} 
                          color="white" 
                        />
                      </BlurView>
                    </View>

                    {/* Bottom content */}
                    <View style={styles.bottomContent}>
                      <Text style={[styles.categoryName, { fontSize: isLarge ? 20 : 16 }]}>
                        {category.name}
                      </Text>
                      <Text style={[styles.categoryDescription, { fontSize: isLarge ? 14 : 12 }]}>
                        {venuesInCategory.length} venues
                      </Text>
                      
                      {isLarge && (
                        <Text style={styles.categoryDetails} numberOfLines={2}>
                          {category.description}
                        </Text>
                      )}

                      {/* Featured venues for large cards */}
                      {isLarge && venuesInCategory.length > 0 && (
                        <View style={styles.featuredVenues}>
                          <Text style={styles.featuredLabel}>Featured:</Text>
                          <Text style={styles.featuredVenue} numberOfLines={1}>
                            {venuesInCategory[0]?.name}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Arrow indicator */}
                    <View style={styles.arrowContainer}>
                      <BlurView style={styles.arrowBlur} tint="light" intensity={40}>
                        <IconSymbol name="arrow.up.right" size={14} color="white" />
                      </BlurView>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Quick stats */}
        <View style={[styles.statsContainer, { backgroundColor: isDark ? colors.gray[800] : colors.gray[50] }]}>
          <Text style={[styles.statsTitle, { color: isDark ? '#FFFFFF' : colors.gray[900] }]}>
            NaviLynx Coverage
          </Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: isDark ? '#FFFFFF' : colors.gray[900] }]}>
                {categories.reduce((total, cat) => total + getVenuesByCategory(cat.id).length, 0)}
              </Text>
              <Text style={[styles.statLabel, { color: isDark ? colors.gray[300] : colors.gray[600] }]}>
                Total Venues
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: isDark ? '#FFFFFF' : colors.gray[900] }]}>
                9
              </Text>
              <Text style={[styles.statLabel, { color: isDark ? colors.gray[300] : colors.gray[600] }]}>
                Provinces
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: isDark ? '#FFFFFF' : colors.gray[900] }]}>
                24/7
              </Text>
              <Text style={[styles.statLabel, { color: isDark ? colors.gray[300] : colors.gray[600] }]}>
                Navigation
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  grid: {
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  largeCategoryCard: {
    width: '100%',
    height: 200,
  },
  smallCategoryCard: {
    width: (width - spacing.md * 3) / 2,
    height: 160,
  },
  categoryImage: {
    flex: 1,
    justifyContent: 'space-between',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  categoryContent: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  iconContainer: {
    alignSelf: 'flex-start',
  },
  iconBlur: {
    borderRadius: borderRadius.full,
    padding: spacing.sm,
  },
  bottomContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  categoryName: {
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  categoryDescription: {
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  categoryDetails: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    marginTop: spacing.xs,
    lineHeight: 18,
  },
  featuredVenues: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginRight: spacing.xs,
  },
  featuredVenue: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  arrowContainer: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
  },
  arrowBlur: {
    borderRadius: borderRadius.full,
    padding: spacing.xs,
  },
  statsContainer: {
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default EnhancedCategoriesGrid;
