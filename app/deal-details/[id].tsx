import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Share,
  Dimensions,
  StatusBar,
  Alert,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ModernCard } from '@/components/ui/ModernCard';
import { useTheme } from '@/context/ThemeContext';
import DealsService, { ExtendedDeal } from '@/services/DealsService';

const { height } = Dimensions.get('window');

export default function DealDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const dealsService = DealsService.getInstance();
  const [deal, setDeal] = useState<ExtendedDeal | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDeal = async () => {
      try {
        const foundDeal = await dealsService.getDealById(id as string);
        setDeal(foundDeal);
        if (foundDeal) {
          setIsFavorited(dealsService.isFavorite(foundDeal.id));
        }
      } catch (error) {
        console.error('Error loading deal:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadDeal();
    }
  }, [id, dealsService]);

  const handleShare = async () => {
    if (!deal) return;
    
    try {
      await Share.share({
        message: `Check out this amazing deal: ${deal.title} - ${deal.discount} at ${deal.venueName}!`,
        title: 'Amazing Deal on NaviLynx',
      });
    } catch (error) {
      console.error('Error sharing deal:', error);
    }
  };

  const handleClaimDeal = async () => {
    if (!deal) return;
    
    try {
      const result = await dealsService.claimDeal(deal.id);
      if (result.success) {
        Alert.alert(
          'Deal Claimed!',
          `${result.message}\nYour claim code: ${result.claimCode}`,
          [
            { 
              text: 'Go to Venue', 
              onPress: () => router.push(`/venue/${deal.venueId}`)
            }
          ]
        );
      } else {
        Alert.alert('Unable to Claim', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to claim deal. Please try again.');
    }
  };

  const handleNavigateToVenue = () => {
    if (!deal) return;
    router.push(`/venue/${deal.venueId}`);
  };

  const toggleFavorite = async () => {
    if (!deal) return;
    
    try {
      if (isFavorited) {
        await dealsService.removeFromFavorites(deal.id);
      } else {
        await dealsService.addToFavorites(deal.id);
      }
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading deal...
          </Text>
        </View>
      </View>
    );
  }

  if (!deal) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <IconSymbol name="exclamationmark.triangle" size={48} color="#6366f1" />
          <Text style={[styles.errorTitle, { color: colors.text }]}>
            Deal Not Found
          </Text>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>
            The deal you're looking for doesn't exist or has expired.
          </Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <LinearGradient
              colors={['#6366f1', '#8b5cf6']}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonText}>Go Back</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const isExpired = new Date(deal.validUntil) < new Date();
  const timeRemaining = Math.ceil((new Date(deal.validUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <View style={[
      styles.container,
      { backgroundColor: isDark ? colors.dark.background : colors.light.background }
    ]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image Section */}
        <View style={styles.heroSection}>
          <Image 
            source={{ uri: deal.image }} 
            style={styles.heroImage}
            resizeMode="cover"
          />
          
          {/* Overlay with back button and favorite */}
          <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'transparent']}
            style={styles.heroOverlay}
          >
            <View style={styles.topActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => router.back()}
              >
                <BlurView intensity={20} style={styles.blurButton}>
                  <IconSymbol name="chevron.left" size={24} color="white" />
                </BlurView>
              </TouchableOpacity>
              
              <View style={styles.rightActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={handleShare}
                >
                  <BlurView intensity={20} style={styles.blurButton}>
                    <IconSymbol name="square.and.arrow.up" size={24} color="white" />
                  </BlurView>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={toggleFavorite}
                >
                  <BlurView intensity={20} style={styles.blurButton}>
                    <IconSymbol 
                      name={isFavorited ? "heart.fill" : "heart"} 
                      size={24} 
                      color={isFavorited ? colors.accent : "white"} 
                    />
                  </BlurView>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>

          {/* Discount Badge */}
          <View style={styles.discountBadge}>
            <LinearGradient
              colors={[colors.accent, colors.primary]}
              style={styles.badgeGradient}
            >
              <Text style={styles.discountText}>{deal.discount}</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <ModernCard style={styles.dealInfoCard}>
            <View style={styles.dealHeader}>
              <Text style={[
                styles.dealTitle,
                { color: isDark ? colors.dark.text : colors.light.text }
              ]}>
                {deal.title}
              </Text>
              
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{deal.category}</Text>
              </View>
            </View>

            <Text style={[
              styles.dealDescription,
              { color: isDark ? colors.dark.textSecondary : colors.light.textSecondary }
            ]}>
              {deal.description}
            </Text>

            {/* Venue Info */}
            <TouchableOpacity 
              style={styles.venueInfo}
              onPress={handleNavigateToVenue}
            >
              <View style={styles.venueDetails}>
                <IconSymbol name="location" size={20} color={colors.primary} />
                <Text style={[
                  styles.venueName,
                  { color: isDark ? colors.dark.text : colors.light.text }
                ]}>
                  {deal.venueName}
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={16} color={colors.primary} />
            </TouchableOpacity>

            {/* Validity Info */}
            <View style={styles.validitySection}>
              <View style={styles.validityItem}>
                <IconSymbol 
                  name={isExpired ? "clock.badge.xmark" : "clock"} 
                  size={20} 
                  color={isExpired ? colors.error : colors.primary} 
                />
                <Text style={[
                  styles.validityText,
                  { 
                    color: isExpired 
                      ? colors.error 
                      : (isDark ? colors.dark.textSecondary : colors.light.textSecondary)
                  }
                ]}>
                  {isExpired 
                    ? 'Expired' 
                    : `Valid for ${timeRemaining} more day${timeRemaining !== 1 ? 's' : ''}`
                  }
                </Text>
              </View>
            </View>
          </ModernCard>

          {/* Terms and Conditions */}
          <ModernCard style={styles.termsCard}>
            <Text style={[
              styles.termsTitle,
              { color: isDark ? colors.dark.text : colors.light.text }
            ]}>
              Terms & Conditions
            </Text>
            <Text style={[
              styles.termsText,
              { color: isDark ? colors.dark.textSecondary : colors.light.textSecondary }
            ]}>
              • Deal valid only at participating {deal.venueName} locations{'\n'}
              • Cannot be combined with other offers{'\n'}
              • Valid until {new Date(deal.validUntil).toLocaleDateString()}{'\n'}
              • Subject to availability{'\n'}
              • Management reserves the right to withdraw this offer at any time
            </Text>
          </ModernCard>
        </View>
      </ScrollView>

      {/* Bottom Action Button */}
      {!isExpired && (
        <View style={styles.bottomActions}>
          <TouchableOpacity 
            style={styles.claimButton}
            onPress={handleClaimDeal}
          >
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              style={styles.claimGradient}
            >
              <IconSymbol name="checkmark.circle" size={24} color="white" />
              <Text style={styles.claimButtonText}>Claim Deal</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.large,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: spacing.medium,
    marginBottom: spacing.small,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: spacing.large,
  },
  backButton: {
    marginTop: spacing.medium,
  },
  gradientButton: {
    paddingHorizontal: spacing.large,
    paddingVertical: spacing.medium,
    borderRadius: borderRadius.large,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  heroSection: {
    height: height * 0.4,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    paddingTop: 50,
  },
  topActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.medium,
  },
  rightActions: {
    flexDirection: 'row',
    gap: spacing.small,
  },
  actionButton: {
    borderRadius: borderRadius.medium,
    overflow: 'hidden',
  },
  blurButton: {
    padding: spacing.small,
    borderRadius: borderRadius.medium,
  },
  discountBadge: {
    position: 'absolute',
    top: 120,
    right: spacing.medium,
    borderRadius: borderRadius.large,
    overflow: 'hidden',
  },
  badgeGradient: {
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
  },
  discountText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentSection: {
    padding: spacing.medium,
    marginTop: -spacing.medium,
  },
  dealInfoCard: {
    marginBottom: spacing.medium,
  },
  dealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.medium,
  },
  dealTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    marginRight: spacing.small,
  },
  categoryBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.small,
    paddingVertical: 4,
    borderRadius: borderRadius.small,
  },
  categoryText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  dealDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: spacing.medium,
  },
  venueInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.small,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginVertical: spacing.medium,
  },
  venueDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.small,
  },
  venueName: {
    fontSize: 16,
    fontWeight: '600',
  },
  validitySection: {
    marginTop: spacing.small,
  },
  validityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.small,
  },
  validityText: {
    fontSize: 14,
    fontWeight: '500',
  },
  termsCard: {
    marginBottom: spacing.xlarge,
  },
  termsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.medium,
  },
  termsText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bottomActions: {
    padding: spacing.medium,
    paddingBottom: spacing.large,
  },
  claimButton: {
    borderRadius: borderRadius.large,
    overflow: 'hidden',
    ...shadows.medium,
  },
  claimGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.medium,
    gap: spacing.small,
  },
  claimButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
