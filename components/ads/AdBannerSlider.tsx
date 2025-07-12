import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useThemeSafe } from '@/context/ThemeContext';
import { Advertisement } from '@/data/southAfricanVenues';
import { spacing, borderRadius, shadows } from '@/styles/modernTheme';

interface AdBannerSliderProps {
  ads: Advertisement[];
  height?: number;
  autoplay?: boolean;
  showsPagination?: boolean;
}

export const AdBannerSlider: React.FC<AdBannerSliderProps> = ({
  ads,
  height = 180,
  autoplay = true,
  showsPagination = true
}) => {
  const { colors } = useThemeSafe();

  const handleAdPress = (ad: Advertisement) => {
    // Navigate to venue details or handle CTA
    router.push(`/venue/${ad.venueId}`);
  };

  if (ads.length === 0) return null;

  return (
    <View style={{
      marginHorizontal: spacing.lg,
      marginBottom: spacing.lg,
      borderRadius: borderRadius['2xl'],
      overflow: 'hidden',
      ...shadows.lg,
      height,
    }}>
      <Swiper
        autoplay={autoplay}
        autoplayTimeout={4}
        showsPagination={showsPagination}
        paginationStyle={{ bottom: 10 }}
        dotStyle={{
          backgroundColor: 'rgba(255,255,255,0.4)',
          width: 6,
          height: 6,
        }}
        activeDotStyle={{
          backgroundColor: colors.primary,
          width: 8,
          height: 8,
        }}
        loop
      >
        {ads.map((ad) => (
          <TouchableOpacity
            key={ad.id}
            onPress={() => handleAdPress(ad)}
            activeOpacity={0.9}
            style={{ flex: 1 }}
          >
            <Image
              source={{ uri: ad.image }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                height: '100%',
              }}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: 'flex-end',
                padding: spacing.lg,
              }}
            >
              <View style={{ marginBottom: spacing.xs }}>
                <Text style={{
                  color: '#FFFFFF',
                  fontSize: 18,
                  fontWeight: '700',
                  marginBottom: spacing.xs,
                }}>
                  {ad.title}
                </Text>
                <Text style={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: 14,
                  marginBottom: spacing.sm,
                }}>
                  {ad.subtitle}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View
                    style={{
                      paddingHorizontal: spacing.sm,
                      paddingVertical: 4,
                      borderRadius: borderRadius.full,
                      marginRight: spacing.xs,
                      backgroundColor: colors.primary,
                    }}
                  >
                    <Text style={{
                      color: '#FFFFFF',
                      fontSize: 12,
                      fontWeight: '600',
                    }}>
                      {ad.ctaText}
                    </Text>
                  </View>
                  <Text style={{
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: 12,
                  }}>
                    {ad.venueName}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </Swiper>
    </View>
  );
};

interface SingleAdBannerProps {
  ad: Advertisement;
  height?: number;
}

export const SingleAdBanner: React.FC<SingleAdBannerProps> = ({
  ad,
  height = 140
}) => {
  const { isDark } = useThemeSafe();

  const handlePress = () => {
    router.push(`/venue/${ad.venueId}`);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.9}
      style={{
        marginHorizontal: spacing.lg,
        marginBottom: spacing.md,
        borderRadius: borderRadius['2xl'],
        overflow: 'hidden',
        height,
        backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.9)',
        borderWidth: 1,
        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
        ...shadows.lg,
      }}
    >
      <Image
        source={{ uri: ad.image }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
        }}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'flex-end',
          padding: spacing.lg,
        }}
      >
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <View style={{ flex: 1 }}>
            <Text style={{
              color: '#FFFFFF',
              fontSize: 18,
              fontWeight: '700',
              marginBottom: spacing.xs,
              textShadowColor: 'rgba(0, 0, 0, 0.8)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 2,
            }}>
              {ad.title}
            </Text>
            <Text style={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: 14,
              fontWeight: '500',
              textShadowColor: 'rgba(0, 0, 0, 0.6)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 1,
            }}>
              {ad.subtitle}
            </Text>
          </View>
          <View style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: borderRadius.full,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.xs,
            marginLeft: spacing.sm,
          }}>
            <Text style={{
              color: '#FFFFFF',
              fontSize: 13,
              fontWeight: '700',
            }}>
              {ad.ctaText || 'View'}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};
