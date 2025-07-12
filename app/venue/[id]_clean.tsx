import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeSafe } from '@/context/ThemeContext';
import { VenueDetailsCard } from '@/components/venues/VenueDetailsCard';
import { getVenueById, type Venue } from '@/data/southAfricanVenues';
import modernTheme from '@/styles/modernTheme';

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

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
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

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <VenueDetailsCard venue={venue} />
        
        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            onPress={startNavigation}
          >
            <IconSymbol name="location.fill" size={20} color="#FFFFFF" />
            <Text style={[styles.primaryButtonText, { color: '#FFFFFF' }]}>
              Start Navigation
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.secondaryButton, { backgroundColor: colors.surface }]}
            onPress={openChat}
          >
            <IconSymbol name="message.fill" size={20} color={colors.primary} />
            <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>
              Ask NaviGenie
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: modernTheme.spacing.lg,
    paddingVertical: modernTheme.spacing.md,
    ...modernTheme.shadows.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: modernTheme.spacing.md,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: modernTheme.spacing.xl,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: modernTheme.spacing.lg,
    marginBottom: modernTheme.spacing.sm,
  },
  errorSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: modernTheme.spacing.xl,
  },
  actionsContainer: {
    padding: modernTheme.spacing.lg,
    gap: modernTheme.spacing.md,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: modernTheme.spacing.md,
    borderRadius: modernTheme.borderRadius.lg,
    ...modernTheme.shadows.sm,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: modernTheme.spacing.sm,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: modernTheme.spacing.md,
    borderRadius: modernTheme.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: modernTheme.spacing.sm,
  },
  button: {
    paddingHorizontal: modernTheme.spacing.xl,
    paddingVertical: modernTheme.spacing.md,
    borderRadius: modernTheme.borderRadius.lg,
    marginTop: modernTheme.spacing.lg,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
