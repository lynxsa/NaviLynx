import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Text,
} from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useResponsive } from '@/hooks/useResponsive';
import LanguageSelector from '@/components/LanguageSelector';
import GlassCard from '@/components/GlassCard';
import { getCurrentUser, signOut, UserProfile } from '@/services/userService';
import { router } from 'expo-router';

export default function ProfileScreenEnhanced() {
  const { colors, toggleTheme, isDark } = useTheme();
  const { setLanguage } = useLanguage();
  const { getResponsiveValue } = useResponsive();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  const handleLanguageChange = (newLanguage: 'en' | 'zu' | 'af' | 'xh' | 'ts' | 'nso' | 'tn' | 've') => {
    setLanguage(newLanguage);
    Alert.alert('Language Changed', `Language switched to ${newLanguage}`);
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            setCurrentUser(null);
            router.replace('/' as any);
          }
        }
      ]
    );
  };

  const cardPadding = getResponsiveValue({ sm: 16, md: 24, lg: 32 });
  const sectionSpacing = getResponsiveValue({ sm: 24, md: 32, lg: 48 });

  const menuItems = [
    {
      icon: 'person.circle',
      title: 'Account Settings',
      action: () => Alert.alert('Feature Coming Soon', 'Account settings will be available in the next update.')
    },
    {
      icon: 'lock.circle',
      title: 'Privacy & Security',
      action: () => Alert.alert('Feature Coming Soon', 'Privacy settings will be available in the next update.')
    },
    {
      icon: 'questionmark.circle',
      title: 'Help & Support',
      action: () => Alert.alert('Help & Support', 'For support, please contact us at support@navilynx.com')
    },
    {
      icon: 'info.circle',
      title: 'About NaviLynx',
      action: () => Alert.alert('About NaviLynx', 'NaviLynx v1.0\nAI-powered indoor navigation for South African venues.')
    }
  ];

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Enhanced Header */}
        <GlassCard 
          variant="elevated" 
          style={[styles.headerCard, { marginHorizontal: cardPadding, marginBottom: sectionSpacing }]}
        >
          <View style={styles.profileHeader}>
            <View style={[styles.avatarContainer, { backgroundColor: colors.primaryLight }]}>
              <IconSymbol 
                name="person.circle.fill" 
                size={getResponsiveValue({ sm: 60, md: 80, lg: 100 })} 
                color={colors.primary} 
              />
            </View>
            <Text style={[styles.welcomeText, { color: colors.text }]}>
              {currentUser ? `Hello, ${currentUser.fullName}!` : 'Welcome!'}
            </Text>
            <Text style={[styles.emailText, { color: colors.mutedForeground }]}>
              {currentUser?.email || 'Please sign in to access all features'}
            </Text>
          </View>
        </GlassCard>

        {/* Enhanced Stats */}
        {currentUser && (
          <GlassCard 
            variant="elevated" 
            style={[styles.statsCard, { marginHorizontal: cardPadding, marginBottom: sectionSpacing }]}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Your Journey
            </Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.primary }]}>
                  {currentUser.stats.visitedVenues}
                </Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                  Venues{'\n'}Explored
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.secondary }]}>
                  {currentUser.stats.savedParking}
                </Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                  Parking{'\n'}Spots Saved
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.accent }]}>
                  {currentUser.stats.navigationSessions}
                </Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                  Navigation{'\n'}Sessions
                </Text>
              </View>
            </View>
          </GlassCard>
        )}

        {/* Enhanced Settings */}
        <GlassCard 
          variant="elevated" 
          style={[styles.settingsCard, { marginHorizontal: cardPadding, marginBottom: sectionSpacing }]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Preferences
          </Text>

          {/* Theme Toggle */}
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <IconSymbol 
                name={isDark ? 'moon.fill' : 'sun.max.fill'} 
                size={24} 
                color={colors.primary} 
              />
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  Dark Mode
                </Text>
                <Text style={[styles.settingDescription, { color: colors.mutedForeground }]}>
                  {isDark ? 'Switch to light theme' : 'Switch to dark theme'}
                </Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
              ios_backgroundColor={colors.border}
            />
          </View>

          {/* Notifications Toggle */}
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <IconSymbol 
                name={notificationsEnabled ? 'bell.fill' : 'bell.slash.fill'} 
                size={24} 
                color={colors.primary} 
              />
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  Notifications
                </Text>
                <Text style={[styles.settingDescription, { color: colors.mutedForeground }]}>
                  Receive updates about venues and navigation
                </Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
              ios_backgroundColor={colors.border}
            />
          </View>

          {/* Language Selector */}
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <IconSymbol name="globe" size={24} color={colors.primary} />
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>
                  Language
                </Text>
                <Text style={[styles.settingDescription, { color: colors.mutedForeground }]}>
                  Choose your preferred language
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.languageContainer}>
            <LanguageSelector onLanguageChange={handleLanguageChange} />
          </View>
        </GlassCard>

        {/* Enhanced Menu */}
        <GlassCard 
          variant="elevated" 
          style={[styles.menuCard, { marginHorizontal: cardPadding, marginBottom: sectionSpacing }]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            More Options
          </Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                { borderBottomColor: colors.border },
                index === menuItems.length - 1 && styles.lastMenuItem
              ]}
              onPress={item.action}
            >
              <View style={styles.menuItemContent}>
                <IconSymbol name={item.icon as any} size={24} color={colors.primary} />
                <Text style={[styles.menuItemText, { color: colors.text }]}>
                  {item.title}
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          ))}
        </GlassCard>

        {/* Sign Out Button */}
        {currentUser && (
          <View style={{ marginHorizontal: cardPadding, marginBottom: sectionSpacing }}>
            <TouchableOpacity
              style={[styles.signOutButton, { backgroundColor: colors.error }]}
              onPress={handleSignOut}
            >
              <IconSymbol name="arrow.right.square" size={20} color="#FFFFFF" />
              <Text style={styles.signOutButtonText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* App Version */}
        <Text style={[styles.versionText, { color: colors.mutedForeground }]}>
          NaviLynx Mobile v1.0.0
        </Text>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 24,
  },
  headerCard: {
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
  },
  avatarContainer: {
    borderRadius: 9999,
    padding: 16,
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: 'center',
    marginBottom: 4,
  },
  emailText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  statsCard: {},
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 36,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 18,
  },
  settingsCard: {},
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  languageContainer: {
    marginTop: 8,
    marginLeft: 32 + 16, // Align with text
  },
  menuCard: {},
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 16,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  signOutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: "600",
  },
  versionText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  bottomSpacing: {
    height: 50,
  },
});
