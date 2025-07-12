import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  ImageBackground,
  Dimensions,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeSafe } from '@/context/ThemeContext';
import { getVenueById, type Venue } from '@/data/southAfricanVenues';

const { width, height } = Dimensions.get('window');

export default function VenueDetailScreen() {
  const { colors, isDark } = useThemeSafe();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVenue = async () => {
      try {
        if (id) {
          const venueData = getVenueById(id);
          setVenue(venueData || null);
        }
      } catch (error) {
        console.error('Error loading venue:', error);
        Alert.alert('Error', 'Failed to load venue details');
      } finally {
        setLoading(false);
      }
    };

    loadVenue();
  }, [id]);

  const startNavigation = () => {
    if (venue) {
      router.push(`/ar-navigator?destination=${venue.id}`);
    }
  };

  const openChat = () => {
    if (venue) {
      router.push(`/chat/${venue.id}`);
    }
  };

  const handleCall = () => {
    if (venue?.contact?.phone) {
      Linking.openURL(`tel:${venue.contact.phone}`);
    }
  };

  const handleWebsite = () => {
    if (venue?.contact?.website) {
      Linking.openURL(venue.contact.website);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading venue details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!venue) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        <View style={styles.errorContainer}>
          <IconSymbol name="exclamationmark.triangle" size={64} color={colors.textSecondary} />
          <Text style={[styles.errorTitle, { color: colors.text }]}>Venue Not Found</Text>
          <Text style={[styles.errorSubtitle, { color: colors.textSecondary }]}>
            The venue you're looking for doesn't exist or has been removed.
          </Text>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: colors.surface }]}
          onPress={() => router.back()}
        >
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          {venue.name}
        </Text>
        
        <TouchableOpacity 
          style={[styles.shareButton, { backgroundColor: colors.surface }]}
          onPress={() => Alert.alert('Share', 'Share venue functionality')}
        >
          <IconSymbol name="square.and.arrow.up" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <ImageBackground
          source={{ uri: venue.image }}
          style={styles.heroImage}
          resizeMode="cover"
        >
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>{venue.name}</Text>
            <Text style={styles.heroSubtitle}>
              {venue.location.city}, {venue.location.province}
            </Text>
            <View style={styles.ratingContainer}>
              <IconSymbol name="star.fill" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>{venue.rating}</Text>
            </View>
          </View>
        </ImageBackground>

        {/* Quick Actions */}
        <View style={[styles.actionsContainer, { backgroundColor: colors.background }]}>
          <TouchableOpacity 
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            onPress={startNavigation}
          >
            <IconSymbol name="location.fill" size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Start Navigation</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.secondaryButton, { backgroundColor: colors.surface }]}
            onPress={openChat}
          >
            <IconSymbol name="message.fill" size={20} color={colors.primary} />
            <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>Ask NaviGenie</Text>
          </TouchableOpacity>
        </View>

        {/* Info Section */}
        <View style={[styles.infoSection, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {venue.description}
          </Text>
          
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Hours</Text>
          <Text style={[styles.hoursText, { color: colors.textSecondary }]}>
            {venue.openingHours}
          </Text>
        </View>

        {/* Features */}
        <View style={[styles.featuresSection, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Features</Text>
          <View style={styles.featuresGrid}>
            {venue.features.map((feature, index) => (
              <View key={index} style={[styles.featureItem, { backgroundColor: colors.surface }]}>
                <IconSymbol name="checkmark.circle.fill" size={16} color={colors.success} />
                <Text style={[styles.featureText, { color: colors.text }]}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Contact */}
        <View style={[styles.contactSection, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact</Text>
          
          <View style={styles.contactGrid}>
            <TouchableOpacity 
              style={[styles.contactItem, { backgroundColor: colors.surface }]}
              onPress={handleCall}
            >
              <IconSymbol name="phone.fill" size={20} color={colors.primary} />
              <Text style={[styles.contactText, { color: colors.text }]}>Call</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.contactItem, { backgroundColor: colors.surface }]}
              onPress={handleWebsite}
            >
              <IconSymbol name="globe" size={20} color={colors.primary} />
              <Text style={[styles.contactText, { color: colors.text }]}>Website</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  heroImage: {
    width: width,
    height: height * 0.3,
    justifyContent: 'flex-end',
  },
  heroOverlay: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  hoursText: {
    fontSize: 16,
    lineHeight: 24,
  },
  featuresSection: {
    padding: 20,
    paddingTop: 0,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
    minWidth: '45%',
  },
  featureText: {
    fontSize: 14,
    fontWeight: '500',
  },
  contactSection: {
    padding: 20,
    paddingTop: 0,
  },
  contactGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  contactItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  contactText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
