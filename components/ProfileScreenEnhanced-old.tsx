import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Text,
  StatusBar,
} from 'react-native';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeSafe } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useResponsive } from '@/hooks/useResponsive';
import LanguageSelector from '@/components/LanguageSelector';
import GlassCard from '@/components/ui/GlassCard';
import { getCurrentUser, signOut, UserProfile } from '@/services/userService';
import { router } from 'expo-router';
import modernTheme from '@/styles/modernTheme';

export default function ProfileScreenEnhanced() {
  const { colors, toggleTheme, isDark } = useThemeSafe();
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
    <View style={[{ backgroundColor: isDark ? '#000000' : '#FFFFFF', flex: 1 }]}>
      <StatusBar 
        barStyle={isDark ? "light-content" : "dark-content"} 
        backgroundColor="transparent"
        translucent
      />
      
      {/* Header with Logo and Icons */}
      <View style={{ 
        paddingHorizontal: 20, 
        paddingTop: 44 + 8, 
        paddingBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
        borderBottomWidth: 1,
        borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
      }}>
        {/* Logo with Profile Text */}
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <View style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: '#6A0DAD',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
          }}>
            <IconSymbol name="person" size={16} color="#FFFFFF" />
          </View>
          <Text style={{
            fontSize: 18,
            fontWeight: '700',
            color: isDark ? '#FFFFFF' : '#1F2937',
            letterSpacing: 0.5,
          }}>
            Profile
          </Text>
        </View>
        
        {/* Header Icons */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity 
            style={{
              backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
              borderRadius: 20,
              padding: 10,
              borderWidth: 1,
              borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
            }}
            activeOpacity={0.7}
          >
            <IconSymbol name="gear" size={18} color="#6A0DAD" />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView 
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting Message */}
        <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
          <Text style={{
            fontSize: 16, 
            fontWeight: '600',
            letterSpacing: 0.2,
            marginBottom: 1,
            color: isDark ? '#FFFFFF' : '#1F2937',
          }}>
            {currentUser ? `Hello, ${currentUser.fullName}!` : 'Welcome!'}
          </Text>
          <Text style={{
            fontSize: 11, 
            opacity: 0.6,
            fontWeight: '400',
            letterSpacing: 0.1,
            color: isDark ? '#FFFFFF' : '#1F2937',
          }}>
            {currentUser?.email || 'Please sign in to access all features'}
          </Text>
        </View>

        {/* Enhanced Profile Card */}
        <View style={{
          backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.9)',
          borderRadius: 24,
          margin: 16,
          padding: 20,
          borderWidth: 1,
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
          alignItems: 'center',
        }}>
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: '#6A0DAD',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <IconSymbol 
              name="person.circle.fill" 
              size={60} 
              color="#FFFFFF" 
            />
          </View>
          <Text style={{
            fontSize: 20,
            fontWeight: '700',
            color: isDark ? '#FFFFFF' : '#1F2937',
            marginBottom: 8,
          }}>
            {currentUser ? currentUser.fullName : 'Guest User'}
          </Text>
          <Text style={{
            fontSize: 14,
            color: isDark ? '#FFFFFF' : '#1F2937',
            opacity: 0.7,
          }}>
            {currentUser?.email || 'Sign in to sync your data'}
          </Text>
        </View>

        {/* Enhanced Stats */}
        {currentUser && (
          <View style={{
            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.9)',
            borderRadius: 24,
            margin: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '700',
              color: isDark ? '#FFFFFF' : '#1F2937',
              marginBottom: 16,
            }}>
              Your Journey
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{
                  fontSize: 24,
                  fontWeight: '700',
                  color: '#6A0DAD',
                }}>
                  {currentUser.stats.visitedVenues}
                </Text>
                <Text style={{
                  fontSize: 11,
                  color: isDark ? '#FFFFFF' : '#1F2937',
                  opacity: 0.7,
                  textAlign: 'center',
                }}>
                  Venues{'\n'}Explored
                </Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{
                  fontSize: 24,
                  fontWeight: '700',
                  color: '#10B981',
                }}>
                  {currentUser.stats.savedParking}
                </Text>
                <Text style={{
                  fontSize: 11,
                  color: isDark ? '#FFFFFF' : '#1F2937',
                  opacity: 0.7,
                  textAlign: 'center',
                }}>
                  Parking{'\n'}Spots Saved
                </Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{
                  fontSize: 24,
                  fontWeight: '700',
                  color: '#F59E0B',
                }}>
                  {currentUser.stats.navigationSessions}
                </Text>
                <Text style={{
                  fontSize: 11,
                  color: isDark ? '#FFFFFF' : '#1F2937',
                  opacity: 0.7,
                  textAlign: 'center',
                }}>
                  Navigation{'\n'}Sessions
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Enhanced Settings */}
        <View style={{
          backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.9)',
          borderRadius: 24,
          margin: 16,
          padding: 20,
          borderWidth: 1,
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '700',
            color: isDark ? '#FFFFFF' : '#1F2937',
            marginBottom: 16,
          }}>
            Preferences
          </Text>

          {/* Theme Toggle */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: isDark ? '#FFFFFF' : '#1F2937',
              }}>
                Dark Mode
              </Text>
              <Text style={{
                fontSize: 12,
                color: isDark ? '#FFFFFF' : '#1F2937',
                opacity: 0.7,
              }}>
                Toggle dark theme
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              thumbColor={isDark ? '#6A0DAD' : '#f4f3f4'}
              trackColor={{ false: '#767577', true: '#6A0DAD' }}
            />
          </View>
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
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: isDark ? '#FFFFFF' : '#1F2937',
              }}>
                Notifications
              </Text>
              <Text style={{
                fontSize: 12,
                color: isDark ? '#FFFFFF' : '#1F2937',
                opacity: 0.7,
              }}>
                Receive updates about venues and navigation
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              thumbColor={notificationsEnabled ? '#6A0DAD' : '#f4f3f4'}
              trackColor={{ false: '#767577', true: '#6A0DAD' }}
            />
          </View>
        </View>
          backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.9)',
          borderRadius: 24,
          margin: 16,
          padding: 20,
          borderWidth: 1,
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '700',
            color: isDark ? '#FFFFFF' : '#1F2937',
            marginBottom: 16,
          }}>
            More Options
          </Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 16,
                borderBottomWidth: index === menuItems.length - 1 ? 0 : 1,
                borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
              }}
              onPress={item.action}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <IconSymbol name={item.icon as any} size={24} color="#6A0DAD" />
                <Text style={{
                  fontSize: 16,
                  color: isDark ? '#FFFFFF' : '#1F2937',
                  marginLeft: 16,
                }}>
                  {item.title}
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={16} color={isDark ? '#FFFFFF' : '#1F2937'} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out Button */}
        {currentUser && (
          <View style={{ margin: 16 }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#EF4444',
                borderRadius: 16,
                paddingVertical: 16,
                paddingHorizontal: 20,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={handleSignOut}
            >
              <IconSymbol name="arrow.right.square" size={20} color="#FFFFFF" />
              <Text style={{ color: '#FFFFFF', fontWeight: '600', marginLeft: 8 }}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* App Version */}
        <Text style={{
          fontSize: 12,
          color: isDark ? '#FFFFFF' : '#1F2937',
          opacity: 0.5,
          textAlign: 'center',
          marginBottom: 32,
        }}>
          NaviLynx Mobile v1.0.0
        </Text>
      </ScrollView>
    </View>
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
