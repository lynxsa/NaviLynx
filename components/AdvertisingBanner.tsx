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
import { LinearGradient } from 'expo-linear-gradient';
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

  // Ensure banners is always an array
  const safeBanners = Array.isArray(banners) && banners.length > 0 ? banners : [];

  // Auto-scroll functionality
  useEffect(() => {
    if (safeBanners.length === 0) return;
    
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % safeBanners.length;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * BANNER_WIDTH,
        animated: true,
      });
    }, 5000); // Change slide every 5 seconds for better readability

    return () => clearInterval(interval);
  }, [currentIndex, safeBanners.length]);

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
          {/* Dark Purple Gradient Overlay - Left to Right */}
          <LinearGradient
            colors={['rgba(76, 29, 149, 0.92)', 'rgba(88, 28, 135, 0.85)', 'rgba(99, 32, 139, 0.65)', 'rgba(120, 53, 160, 0.35)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.75, y: 0 }}
            style={styles.gradientOverlay}
          />
          
          {/* Content positioned on the left with better alignment */}
          <View style={styles.content}>
            {/* Special Badge at top */}
            <View style={styles.specialBadge}>
              <Text style={styles.specialBadgeText}>✨ SPECIAL OFFER</Text>
            </View>
            
            {/* Main content area */}
            <View style={styles.mainContentArea}>
              <Text style={styles.title}>
                {banner.title}
              </Text>
              <Text style={styles.subtitle}>
                {banner.subtitle}
              </Text>
              
              {/* Venue info */}
              <View style={styles.venueInfo}>
                <IconSymbol name="location.fill" size={12} color="rgba(255,255,255,0.95)" />
                <Text style={styles.venueName}>{banner.venueName}</Text>
              </View>
            </View>
            
            {/* CTA Button at bottom */}
            <TouchableOpacity style={styles.ctaButton}>
              <Text style={styles.ctaText}>
                {banner.ctaText}
              </Text>
              <IconSymbol name="arrow.right" size={14} color="white" />
            </TouchableOpacity>
          </View>

          {/* Type Badge */}
          <View style={styles.badgeContainer}>
            <BlurView style={styles.badge} tint="light" intensity={30}>
              <Text style={styles.badgeText}>{banner.type?.toUpperCase() || 'SPECIAL'}</Text>
            </BlurView>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {safeBanners.length > 0 ? (
        <>
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
            {safeBanners.map((banner, index) => renderBanner(banner, index))}
          </ScrollView>

          {/* Enhanced Pagination Dots */}
          <View style={styles.pagination}>
            {safeBanners.map((_, index) => (
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
        </>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No promotions available</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  bannerImage: {
    height: 220,
    borderRadius: borderRadius['2xl'],
    overflow: 'hidden',
    ...shadows.lg,
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
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
    justifyContent: 'space-between',
    padding: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    maxWidth: '75%',
  },
  mainContentArea: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: spacing.sm,
  },
  specialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.95)',
    paddingHorizontal: spacing.sm + 3,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.md,
    alignSelf: 'flex-start',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: spacing.xs,
  },
  specialBadgeText: {
    color: '#1a1a1a',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  textContainer: {
    marginBottom: spacing.lg,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: spacing.xs,
    lineHeight: 20,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 0.2,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.98)',
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '600',
    marginBottom: spacing.sm,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 0.1,
  },
  venueInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  venueName: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
    letterSpacing: 0.2,
  },
  ctaButton: {
    backgroundColor: 'rgba(76, 29, 149, 0.95)',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    shadowColor: '#4C1D95',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    minWidth: 110,
    justifyContent: 'center',
  },
  ctaText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
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
  emptyState: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.lg,
    margin: spacing.md,
  },
  emptyText: {
    color: colors.gray[600],
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AdvertisingBanner;
