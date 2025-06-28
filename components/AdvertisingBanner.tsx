import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '@/context/ThemeContext';
import { useAds, Ad } from '@/hooks/useAds';
import { Spacing, BorderRadius, Typography, Shadows } from '@/constants/Theme';

const { width: screenWidth } = Dimensions.get('window');

interface AdvertisingBannerProps {
  placement: 'home' | 'explore' | 'ar' | 'venue' | 'banner';
  style?: any;
  autoRotate?: boolean;
  rotationInterval?: number;
  showCloseButton?: boolean;
  compact?: boolean;
}

export default function AdvertisingBanner({
  placement,
  style,
  autoRotate = true,
  rotationInterval = 5000,
  showCloseButton = false,
  compact = false,
}: AdvertisingBannerProps) {
  const { colors } = useTheme();
  const { getAdsByPlacement, recordImpression, recordClick } = useAds();
  
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [ads, setAds] = useState<Ad[]>([]);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  // Fix: Timer type for cross-platform compatibility
  const rotationTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    loadAds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placement]);

  useEffect(() => {
    if (ads.length > 0) {
      startEntranceAnimation();
      recordImpression(ads[currentAdIndex].id);
      if (autoRotate && ads.length > 1) {
        startAutoRotation();
      }
    }
    return () => {
      if (rotationTimer.current) {
        clearInterval(rotationTimer.current);
      }
    };
    // Only include variables, not functions, in dependency array for stability
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ads, currentAdIndex, autoRotate, recordImpression]);

  const loadAds = () => {
    const placementAds = getAdsByPlacement(placement);
    setAds(placementAds);
    setCurrentAdIndex(0);
  };

  const startEntranceAnimation = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const startAutoRotation = () => {
    if (rotationTimer.current) {
      clearInterval(rotationTimer.current);
    }
    
    rotationTimer.current = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, rotationInterval);
  };

  const handleAdPress = (ad: Ad) => {
    recordClick(ad.id);
    ad.ctaAction();
  };

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsVisible(false);
    });
  };

  const swipeGesture = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > 20;
    },
    onPanResponderMove: (_, gestureState) => {
      if (ads.length > 1) {
        const progress = gestureState.dx / screenWidth;
        slideAnim.setValue(1 + progress * 0.2);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (ads.length > 1) {
        if (gestureState.dx > 50) {
          // Swipe right - previous ad
          setCurrentAdIndex((prevIndex) => 
            prevIndex === 0 ? ads.length - 1 : prevIndex - 1
          );
        } else if (gestureState.dx < -50) {
          // Swipe left - next ad
          setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
        }
        
        // Reset animation
        Animated.spring(slideAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  if (!isVisible || ads.length === 0) {
    return null;
  }

  const currentAd = ads[currentAdIndex];

  if (compact) {
    return (
      <Animated.View
        style={[
          viewStyles.compactContainer,
          { backgroundColor: colors.surface, opacity: fadeAnim, transform: [{ scale: slideAnim }] },
          style,
        ]}
        {...swipeGesture.panHandlers}
      >
        <TouchableOpacity
          style={viewStyles.compactContent}
          onPress={() => handleAdPress(currentAd)}
          activeOpacity={0.8}
        >
          <Image source={{ uri: currentAd.imageUrl }} style={imageStyles.compactImage} />
          <View style={viewStyles.compactInfo}>
            <Text style={[textStyles.compactTitle, { color: colors.text }]} numberOfLines={1}>
              {currentAd.title}
            </Text>
            <Text style={[textStyles.compactSubtitle, { color: colors.mutedForeground }]} numberOfLines={1}>
              {currentAd.subtitle}
            </Text>
          </View>
          <View style={[viewStyles.compactCta, { backgroundColor: colors.primary }]}>
            <Text style={textStyles.compactCtaText}>{currentAd.ctaText}</Text>
          </View>
        </TouchableOpacity>
        
        {showCloseButton && (
          <TouchableOpacity style={viewStyles.closeButton} onPress={handleClose}>
            <IconSymbol name="xmark" size={12} color={colors.mutedForeground} />
          </TouchableOpacity>
        )}
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        viewStyles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: slideAnim }],
        },
        style,
      ]}
      {...swipeGesture.panHandlers}
    >
      <TouchableOpacity
        style={viewStyles.adContainer}
        onPress={() => handleAdPress(currentAd)}
        activeOpacity={0.9}
      >
        <Image source={{ uri: currentAd.imageUrl }} style={imageStyles.backgroundImage} />
        
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={viewStyles.overlay}
        />
        
        <View style={viewStyles.content}>
          <View style={viewStyles.advertiserInfo}>
            <Image source={{ uri: currentAd.advertiser.logo }} style={imageStyles.advertiserLogo} />
            <Text style={textStyles.advertiserName}>{currentAd.advertiser.name}</Text>
          </View>
          
          <View style={viewStyles.adInfo}>
            <Text style={textStyles.adTitle}>{currentAd.title}</Text>
            <Text style={textStyles.adSubtitle}>{currentAd.subtitle}</Text>
            <Text style={textStyles.adDescription}>{currentAd.description}</Text>
          </View>
          
          <View style={viewStyles.ctaContainer}>
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              style={viewStyles.ctaButton}
            >
              <Text style={textStyles.ctaText}>{currentAd.ctaText}</Text>
              <IconSymbol name="arrow.right" size={16} color="#FFFFFF" />
            </LinearGradient>
          </View>
        </View>
        
        {showCloseButton && (
          <TouchableOpacity style={viewStyles.closeButtonLarge} onPress={handleClose}>
            <View style={[viewStyles.closeButtonBg, { backgroundColor: colors.surface + 'CC' }]}>
              <IconSymbol name="xmark" size={16} color={colors.text} />
            </View>
          </TouchableOpacity>
        )}
        
        {ads.length > 1 && (
          <View style={viewStyles.pagination}>
            {ads.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  viewStyles.paginationDot,
                  {
                    backgroundColor: index === currentAdIndex ? '#FFFFFF' : '#FFFFFF50',
                  },
                ]}
                onPress={() => setCurrentAdIndex(index)}
              />
            ))}
          </View>
        )}
      </TouchableOpacity>
      
      <View style={viewStyles.adLabel}>
        <Text style={[textStyles.adLabelText, { color: colors.mutedForeground }]}>
          Sponsored
        </Text>
      </View>
    </Animated.View>
  );
}

const viewStyles = StyleSheet.create({
  container: {
    marginVertical: Spacing.md,
  },
  adContainer: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    ...Shadows.medium,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'space-between',
  },
  advertiserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
    gap: Spacing.xs,
  },
  adInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  ctaContainer: {
    alignSelf: 'flex-start',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    gap: Spacing.sm,
    ...Shadows.small,
  },
  closeButtonLarge: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
  },
  closeButtonBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pagination: {
    position: 'absolute',
    bottom: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  adLabel: {
    position: 'absolute',
    top: Spacing.xs,
    left: Spacing.xs,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
  },
  
  // Compact styles
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    ...Shadows.small,
  },
  compactContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  compactInfo: {
    flex: 1,
  },
  compactCta: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    marginLeft: Spacing.md,
  },
  closeButton: {
    padding: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const textStyles = StyleSheet.create({
  advertiserName: {
    fontSize: 12,
    fontWeight: "600",
    color: '#000000',
  },
  adTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: '#FFFFFF',
    marginBottom: Spacing.xs,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  adSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: '#FFFFFF',
    marginBottom: Spacing.xs,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  adDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: "600",
    color: '#FFFFFF',
  },
  adLabelText: {
    fontSize: 12,
    fontWeight: "500",
  },
  compactTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  compactSubtitle: {
    fontSize: 14,
  },
  compactCtaText: {
    fontSize: 14,
    fontWeight: "600",
    color: '#FFFFFF',
  },
});

const imageStyles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  advertiserLogo: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  compactImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: Spacing.md,
  },
});
