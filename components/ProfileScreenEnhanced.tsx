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
  Image,
} from 'react-native';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeSafe } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import { getCurrentUser, signOut, UserProfile } from '@/services/userService';
import { router } from 'expo-router';
import { colors, spacing, borderRadius, shadows } from '@/styles/modernTheme';

export default function ProfileScreenEnhanced() {
  const { colors: themeColors, toggleTheme, isDark } = useThemeSafe();
  const { setLanguage } = useLanguage();
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
        paddingHorizontal: spacing.lg, 
        paddingTop: spacing.xl + 8, 
        paddingBottom: spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
        borderBottomWidth: 1,
        borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
      }}>
        {/* Logo with Profile Text */}
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <Image 
            source={
              isDark 
                ? require('@/assets/images/logo-w.png')
                : require('@/assets/images/logo-p.png')
            }
            style={{
              width: 28,
              height: 28,
              resizeMode: 'contain',
              marginRight: spacing.sm,
            }}
          />
          <Text style={{
            fontSize: 18,
            fontWeight: '700',
            color: isDark ? '#FFFFFF' : colors.text,
            letterSpacing: 0.5,
          }}>
            Profile
          </Text>
        </View>
        
        {/* Header Icons */}
        <View style={{ flexDirection: 'row', gap: spacing.xs }}>
          <TouchableOpacity 
            style={{
              backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
              borderRadius: borderRadius.xl,
              padding: spacing.sm + 2,
              borderWidth: 1,
              borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
              ...shadows.sm,
            }}
            activeOpacity={0.7}
          >
            <IconSymbol name="gear" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView 
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting Message */}
        <View style={{ paddingHorizontal: spacing.md, marginBottom: spacing.md }}>
          <Text style={{
            fontSize: 16, 
            fontWeight: '600',
            letterSpacing: 0.2,
            marginBottom: 1,
            color: isDark ? '#FFFFFF' : colors.text,
          }}>
            {currentUser ? `Hello, ${currentUser.fullName}!` : 'Welcome!'}
          </Text>
          <Text style={{
            fontSize: 11, 
            opacity: 0.6,
            fontWeight: '400',
            letterSpacing: 0.1,
            color: isDark ? '#FFFFFF' : colors.text,
          }}>
            {currentUser?.email || 'Please sign in to access all features'}
          </Text>
        </View>

        {/* Enhanced Profile Card */}
        <View style={{
          backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.9)',
          borderRadius: borderRadius['2xl'],
          margin: spacing.md,
          padding: spacing.lg,
          borderWidth: 1,
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
          alignItems: 'center',
          ...shadows.md,
        }}>
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: spacing.md,
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
            color: isDark ? '#FFFFFF' : colors.text,
            marginBottom: spacing.xs,
          }}>
            {currentUser ? currentUser.fullName : 'Guest User'}
          </Text>
          <Text style={{
            fontSize: 14,
            color: isDark ? '#FFFFFF' : colors.text,
            opacity: 0.7,
          }}>
            {currentUser?.email || 'Sign in to sync your data'}
          </Text>
        </View>

        {/* Enhanced Stats */}
        {currentUser && (
          <View style={{
            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.9)',
            borderRadius: borderRadius['2xl'],
            margin: spacing.md,
            padding: spacing.lg,
            borderWidth: 1,
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
            ...shadows.md,
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '700',
              color: isDark ? '#FFFFFF' : colors.text,
              marginBottom: spacing.md,
            }}>
              Your Journey
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{
                  fontSize: 24,
                  fontWeight: '700',
                  color: colors.primary,
                }}>
                  {currentUser.stats.visitedVenues}
                </Text>
                <Text style={{
                  fontSize: 11,
                  color: isDark ? '#FFFFFF' : colors.text,
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
                  color: isDark ? '#FFFFFF' : colors.text,
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
                  color: isDark ? '#FFFFFF' : colors.text,
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
          borderRadius: borderRadius['2xl'],
          margin: spacing.md,
          padding: spacing.lg,
          borderWidth: 1,
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
          ...shadows.md,
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '700',
            color: isDark ? '#FFFFFF' : colors.text,
            marginBottom: spacing.md,
          }}>
            Preferences
          </Text>

          {/* Theme Toggle */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.sm }}>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: isDark ? '#FFFFFF' : colors.text,
              }}>
                Dark Mode
              </Text>
              <Text style={{
                fontSize: 12,
                color: isDark ? '#FFFFFF' : colors.text,
                opacity: 0.7,
              }}>
                Toggle dark theme
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              thumbColor={isDark ? colors.primary : '#f4f3f4'}
              trackColor={{ false: '#767577', true: colors.primary }}
            />
          </View>

          {/* Notifications Toggle */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.sm }}>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: isDark ? '#FFFFFF' : colors.text,
              }}>
                Notifications
              </Text>
              <Text style={{
                fontSize: 12,
                color: isDark ? '#FFFFFF' : colors.text,
                opacity: 0.7,
              }}>
                Receive updates about venues and navigation
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              thumbColor={notificationsEnabled ? colors.primary : '#f4f3f4'}
              trackColor={{ false: '#767577', true: colors.primary }}
            />
          </View>
        </View>

        {/* Enhanced Menu */}
        <View style={{
          backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.9)',
          borderRadius: borderRadius['2xl'],
          margin: spacing.md,
          padding: spacing.lg,
          borderWidth: 1,
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
          ...shadows.md,
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '700',
            color: isDark ? '#FFFFFF' : colors.text,
            marginBottom: spacing.md,
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
                paddingVertical: spacing.md,
                borderBottomWidth: index === menuItems.length - 1 ? 0 : 1,
                borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
              }}
              onPress={item.action}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <IconSymbol name={item.icon as any} size={24} color={colors.primary} />
                <Text style={{
                  fontSize: 16,
                  color: isDark ? '#FFFFFF' : colors.text,
                  marginLeft: spacing.md,
                }}>
                  {item.title}
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={16} color={isDark ? '#FFFFFF' : colors.text} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out Button */}
        {currentUser && (
          <View style={{ margin: spacing.md }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#EF4444',
                borderRadius: borderRadius.xl,
                paddingVertical: spacing.md,
                paddingHorizontal: spacing.lg,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                ...shadows.sm,
              }}
              onPress={handleSignOut}
            >
              <IconSymbol name="arrow.right.square" size={20} color="#FFFFFF" />
              <Text style={{ color: '#FFFFFF', fontWeight: '600', marginLeft: spacing.xs }}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* App Version */}
        <Text style={{
          fontSize: 12,
          color: isDark ? '#FFFFFF' : colors.text,
          opacity: 0.5,
          textAlign: 'center',
          marginBottom: spacing.xl,
        }}>
          NaviLynx Mobile v1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}
