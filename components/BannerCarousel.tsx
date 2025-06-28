import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Text,
  ImageBackground,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { brand } from '@/constants/branding';

export interface BannerData {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaAction: () => void;
  gradient?: string[];
}

interface BannerCarouselProps {
  banners: BannerData[];
  autoRotate?: boolean;
  autoRotateInterval?: number;
}

const { width: screenWidth } = Dimensions.get('window');

export function BannerCarousel({ 
  banners, 
  autoRotate = true, 
  autoRotateInterval = 5000 
}: BannerCarouselProps) {
  const { colors } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    if (!autoRotate || banners.length <= 1) return;

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % banners.length;
      
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.7,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();

      scrollViewRef.current?.scrollTo({
        x: nextIndex * screenWidth,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }, autoRotateInterval);

    return () => clearInterval(interval);
  }, [currentIndex, autoRotate, autoRotateInterval, banners.length, fadeAnim]);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / screenWidth);
    setCurrentIndex(index);
  };

  const renderBanner = (banner: BannerData, index: number) => (
    <View key={banner.id} style={[styles.bannerContainer, { width: screenWidth - 32 }]}>
      <ImageBackground
        source={{ uri: banner.image }}
        style={styles.bannerImage}
        imageStyle={styles.bannerImageStyle}
      >
        <LinearGradient
          colors={
            (banner.gradient && banner.gradient.length >= 2
              ? banner.gradient
              : ['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']) as [string, string, ...string[]]
          }
          style={styles.bannerGradient}
        >
          <Animated.View style={[styles.bannerContent, { opacity: fadeAnim }]}>
            <View style={styles.bannerText}>
              <Text style={styles.bannerTitle}>{banner.title}</Text>
              <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
            </View>
            
            <TouchableOpacity
              style={[styles.ctaButton, { backgroundColor: colors.primary }]}
              onPress={banner.ctaAction}
            >
              <Text style={[styles.ctaButtonText, { color: brand.light }]}>{banner.ctaText}</Text>
              <IconSymbol name="arrow.right" size={16} color={brand.light} />
            </TouchableOpacity>
          </Animated.View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );

  if (banners.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContainer}
        decelerationRate="fast"
        snapToInterval={screenWidth - 32}
        snapToAlignment="start"
      >
        {banners.map(renderBanner)}
      </ScrollView>
      
      {banners.length > 1 && (
        <View style={styles.pagination}>
          {banners.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                {
                  backgroundColor: currentIndex === index 
                    ? colors.primary 
                    : colors.text + '30',
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

export default BannerCarousel;

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  scrollContainer: {
    paddingHorizontal: 16,
  },
  bannerContainer: {
    height: 200,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  bannerImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bannerImageStyle: {
    borderRadius: 16,
  },
  bannerGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  bannerContent: {
    gap: 16,
  },
  bannerText: {
    gap: 4,
  },
  bannerTitle: {
    color: brand.light,
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bannerSubtitle: {
    color: brand.light,
    fontSize: 16,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
    alignSelf: 'flex-start',
  },
  ctaButtonText: {
    color: brand.light,
    fontSize: 16,
    fontWeight: '600',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
