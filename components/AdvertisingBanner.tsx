import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  ImageBackground,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { IconSymbol } from './ui/IconSymbol';
import { BlurView } from './ui/BlurView';
import { useTheme } from '@/context/ThemeContext';
import { colors, spacing, borderRadius, shadows } from '@/styles/modernTheme';
import { advertisements } from '@/data/southAfricanVenues';

const { width: screenWidth } = Dimensions.get('window');
const BANNER_WIDTH = screenWidth - (spacing.md * 2); // Account for padding

interface AdvertisingBannerProps {
  banners?: typeof advertisements;
}

export const AdvertisingBanner: React.FC<AdvertisingBannerProps> = ({ 
  banners = advertisements 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { isDark } = useTheme();

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % banners.length;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * BANNER_WIDTH,
        animated: true,
      });
    }, 5000); // Change slide every 5 seconds for better readability

    return () => clearInterval(interval);
  }, [currentIndex, banners.length]);

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / BANNER_WIDTH);
    setCurrentIndex(index);
  };

  const renderBanner = (banner: typeof advertisements[0], index: number) => (
    <View key={banner.id} style={{ width: BANNER_WIDTH }}>
      <TouchableOpacity activeOpacity={0.9}>
        <ImageBackground
          source={{ uri: banner.image }}
          style={styles.bannerImage}
          imageStyle={{ resizeMode: 'cover' }}
        >
          {/* Gradient Overlay */}
          <View style={styles.overlay} />
          
          {/* Content */}
          <View style={styles.content}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>
                {banner.title}
              </Text>
              <Text style={styles.subtitle}>
                {banner.subtitle}
              </Text>
            </View>
            
            <TouchableOpacity style={styles.ctaButton}>
              <Text style={styles.ctaText}>
                {banner.ctaText}
              </Text>
              <IconSymbol name="arrow.right" size={16} color="white" />
            </TouchableOpacity>
          </View>

          {/* Premium Badge */}
          <View style={styles.badgeContainer}>
            <BlurView style={styles.badge} tint="light" intensity={30}>
              <Text style={styles.badgeText}>{banner.type.toUpperCase()}</Text>
            </BlurView>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Banner Carousel */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        contentContainerStyle={{ paddingHorizontal: 0 }}
        scrollEventThrottle={16}
      >
        {banners.map((banner, index) => renderBanner(banner, index))}
      </ScrollView>

      {/* Enhanced Pagination Dots */}
      <View style={styles.pagination}>
        {banners.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setCurrentIndex(index);
              scrollViewRef.current?.scrollTo({
                x: index * BANNER_WIDTH,
                animated: true,
              });
            }}
            style={[
              styles.dot,
              index === currentIndex ? styles.activeDot : styles.inactiveDot,
              { 
                backgroundColor: index === currentIndex 
                  ? colors.primary[600] 
                  : isDark ? colors.gray[600] : colors.gray[300]
              }
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  bannerImage: {
    height: 180,
    borderRadius: borderRadius['2xl'],
    overflow: 'hidden',
    ...shadows.lg,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: borderRadius['2xl'],
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: spacing.lg,
  },
  textContainer: {
    marginBottom: spacing.lg,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: spacing.sm,
    lineHeight: 26,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
  },
  ctaButton: {
    backgroundColor: `${colors.primary[600]}DD`,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    ...shadows.sm,
  },
  ctaText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  badgeContainer: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
  },
  badge: {
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    ...shadows.sm,
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 11,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    ...shadows.sm,
  },
  activeDot: {
    width: 24,
  },
  inactiveDot: {
    width: 6,
  },
});

export default AdvertisingBanner;
