import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Switch,
  Alert,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Theme and styling
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { colors, spacing, borderRadius, shadows } from '@/styles/modernTheme';

// Icons
import { IconSymbol } from '@/components/ui/IconSymbol';

const { width } = Dimensions.get('window');

interface SettingsSection {
  id: string;
  title: string;
  items: SettingsItem[];
}

interface SettingsItem {
  id: string;
  title: string;
  subtitle?: string;
  type: 'toggle' | 'button' | 'navigation' | 'info';
  value?: boolean;
  icon: string;
  action?: () => void;
  adminControlled?: boolean;
}

export default function EnhancedSettingsScreen() {
  const { isDark, toggleTheme } = useTheme();
  const { currentLanguage, changeLanguage, t } = useLanguage();
  
  // Settings state
  const [settings, setSettings] = useState({
    // Navigation Settings
    arNavigation: true,
    voiceGuidance: true,
    hapticFeedback: true,
    autoLocation: true,
    offlineMode: false,
    
    // Privacy Settings
    locationTracking: true,
    analyticsSharing: true,
    personalizedAds: false,
    dataBackup: true,
    
    // Notification Settings
    pushNotifications: true,
    dealAlerts: true,
    navigationUpdates: true,
    venueUpdates: false,
    marketingEmails: false,
    
    // Accessibility Settings
    highContrast: false,
    largeText: false,
    screenReader: false,
    reducedMotion: false,
    
    // App Settings
    autoTheme: true,
    biometricAuth: false,
    autoSync: true,
    backgroundRefresh: true,
  });

  const [adminSettings, setAdminSettings] = useState({
    debugMode: false,
    betaFeatures: false,
    advancedLogging: false,
    performanceMetrics: false,
  });

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('app_settings');
      const savedAdminSettings = await AsyncStorage.getItem('admin_settings');
      
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
      
      if (savedAdminSettings) {
        setAdminSettings(JSON.parse(savedAdminSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings: any, isAdmin = false) => {
    try {
      const key = isAdmin ? 'admin_settings' : 'app_settings';
      await AsyncStorage.setItem(key, JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const toggleSetting = (key: string, isAdmin = false) => {
    if (isAdmin) {
      const newAdminSettings = {
        ...adminSettings,
        [key]: !adminSettings[key as keyof typeof adminSettings]
      };
      setAdminSettings(newAdminSettings);
      saveSettings(newAdminSettings, true);
    } else {
      const newSettings = {
        ...settings,
        [key]: !settings[key as keyof typeof settings]
      };
      setSettings(newSettings);
      saveSettings(newSettings);
    }
  };

  const resetAppData = () => {
    Alert.alert(
      'Reset App Data',
      'This will clear all app data including preferences, cache, and saved locations. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert('Success', 'App data has been reset');
              // Reset to default settings
              setSettings({
                arNavigation: true,
                voiceGuidance: true,
                hapticFeedback: true,
                autoLocation: true,
                offlineMode: false,
                locationTracking: true,
                analyticsSharing: true,
                personalizedAds: false,
                dataBackup: true,
                pushNotifications: true,
                dealAlerts: true,
                navigationUpdates: true,
                venueUpdates: false,
                marketingEmails: false,
                highContrast: false,
                largeText: false,
                screenReader: false,
                reducedMotion: false,
                autoTheme: true,
                biometricAuth: false,
                autoSync: true,
                backgroundRefresh: true,
              });
            } catch (error) {
              Alert.alert('Error', 'Failed to reset app data');
            }
          }
        }
      ]
    );
  };

  const exportData = () => {
    Alert.alert(
      'Export Data',
      'Your data will be exported to a file that you can share or backup.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => {
          // TODO: Implement data export functionality
          Alert.alert('Info', 'Data export feature coming soon!');
        }}
      ]
    );
  };

  const contactSupport = () => {
    Alert.alert(
      'Contact Support',
      'Need help? Our support team is here to assist you.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Email Support', onPress: () => {
          // TODO: Open email client
          Alert.alert('Info', 'Opening email client...');
        }},
        { text: 'Live Chat', onPress: () => {
          router.push('/chat');
        }}
      ]
    );
  };

  const settingsSections: SettingsSection[] = [
    {
      id: 'navigation',
      title: 'Navigation & AR',
      items: [
        {
          id: 'arNavigation',
          title: 'AR Navigation',
          subtitle: 'Enable augmented reality navigation features',
          type: 'toggle',
          value: settings.arNavigation,
          icon: 'camera',
          action: () => toggleSetting('arNavigation')
        },
        {
          id: 'voiceGuidance',
          title: 'Voice Guidance',
          subtitle: 'Enable voice navigation instructions',
          type: 'toggle',
          value: settings.voiceGuidance,
          icon: 'speaker-wave',
          action: () => toggleSetting('voiceGuidance')
        },
        {
          id: 'hapticFeedback',
          title: 'Haptic Feedback',
          subtitle: 'Feel vibrations for navigation cues',
          type: 'toggle',
          value: settings.hapticFeedback,
          icon: 'hand-raised',
          action: () => toggleSetting('hapticFeedback')
        },
        {
          id: 'autoLocation',
          title: 'Auto Location Detection',
          subtitle: 'Automatically detect your location in venues',
          type: 'toggle',
          value: settings.autoLocation,
          icon: 'map-pin',
          action: () => toggleSetting('autoLocation')
        },
        {
          id: 'offlineMode',
          title: 'Offline Mode',
          subtitle: 'Download maps for offline navigation',
          type: 'toggle',
          value: settings.offlineMode,
          icon: 'cloud-arrow-down',
          action: () => toggleSetting('offlineMode')
        }
      ]
    },
    {
      id: 'privacy',
      title: 'Privacy & Data',
      items: [
        {
          id: 'locationTracking',
          title: 'Location Tracking',
          subtitle: 'Allow app to track your location for better experience',
          type: 'toggle',
          value: settings.locationTracking,
          icon: 'shield-check',
          action: () => toggleSetting('locationTracking')
        },
        {
          id: 'analyticsSharing',
          title: 'Analytics Sharing',
          subtitle: 'Help improve the app by sharing usage data',
          type: 'toggle',
          value: settings.analyticsSharing,
          icon: 'chart-bar',
          action: () => toggleSetting('analyticsSharing')
        },
        {
          id: 'personalizedAds',
          title: 'Personalized Ads',
          subtitle: 'Show ads based on your interests',
          type: 'toggle',
          value: settings.personalizedAds,
          icon: 'megaphone',
          action: () => toggleSetting('personalizedAds')
        },
        {
          id: 'dataBackup',
          title: 'Data Backup',
          subtitle: 'Backup your preferences and saved locations',
          type: 'toggle',
          value: settings.dataBackup,
          icon: 'cloud',
          action: () => toggleSetting('dataBackup')
        }
      ]
    },
    {
      id: 'notifications',
      title: 'Notifications',
      items: [
        {
          id: 'pushNotifications',
          title: 'Push Notifications',
          subtitle: 'Receive app notifications',
          type: 'toggle',
          value: settings.pushNotifications,
          icon: 'bell',
          action: () => toggleSetting('pushNotifications')
        },
        {
          id: 'dealAlerts',
          title: 'Deal Alerts',
          subtitle: 'Get notified about nearby deals and offers',
          type: 'toggle',
          value: settings.dealAlerts,
          icon: 'tag',
          action: () => toggleSetting('dealAlerts')
        },
        {
          id: 'navigationUpdates',
          title: 'Navigation Updates',
          subtitle: 'Receive updates about route changes',
          type: 'toggle',
          value: settings.navigationUpdates,
          icon: 'arrow-path',
          action: () => toggleSetting('navigationUpdates')
        },
        {
          id: 'venueUpdates',
          title: 'Venue Updates',
          subtitle: 'Get notified about venue changes and events',
          type: 'toggle',
          value: settings.venueUpdates,
          icon: 'building-storefront',
          action: () => toggleSetting('venueUpdates')
        }
      ]
    },
    {
      id: 'accessibility',
      title: 'Accessibility',
      items: [
        {
          id: 'highContrast',
          title: 'High Contrast',
          subtitle: 'Increase contrast for better visibility',
          type: 'toggle',
          value: settings.highContrast,
          icon: 'adjustments-horizontal',
          action: () => toggleSetting('highContrast')
        },
        {
          id: 'largeText',
          title: 'Large Text',
          subtitle: 'Increase text size throughout the app',
          type: 'toggle',
          value: settings.largeText,
          icon: 'text-size',
          action: () => toggleSetting('largeText')
        },
        {
          id: 'screenReader',
          title: 'Screen Reader Support',
          subtitle: 'Enhanced support for screen readers',
          type: 'toggle',
          value: settings.screenReader,
          icon: 'speaker-wave',
          action: () => toggleSetting('screenReader')
        },
        {
          id: 'reducedMotion',
          title: 'Reduced Motion',
          subtitle: 'Minimize animations and transitions',
          type: 'toggle',
          value: settings.reducedMotion,
          icon: 'pause',
          action: () => toggleSetting('reducedMotion')
        }
      ]
    },
    {
      id: 'app',
      title: 'App Settings',
      items: [
        {
          id: 'theme',
          title: 'Theme',
          subtitle: isDark ? 'Dark mode enabled' : 'Light mode enabled',
          type: 'button',
          icon: isDark ? 'moon' : 'sun',
          action: toggleTheme
        },
        {
          id: 'language',
          title: 'Language',
          subtitle: `Current: ${currentLanguage === 'en' ? 'English' : currentLanguage === 'af' ? 'Afrikaans' : 'Zulu'}`,
          type: 'navigation',
          icon: 'language',
          action: () => {
            // Language selector
            Alert.alert(
              'Select Language',
              'Choose your preferred language',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'English', onPress: () => changeLanguage('en') },
                { text: 'Afrikaans', onPress: () => changeLanguage('af') },
                { text: 'Zulu', onPress: () => changeLanguage('zu') }
              ]
            );
          }
        },
        {
          id: 'biometricAuth',
          title: 'Biometric Authentication',
          subtitle: 'Use fingerprint or face ID for app access',
          type: 'toggle',
          value: settings.biometricAuth,
          icon: 'finger-print',
          action: () => toggleSetting('biometricAuth')
        },
        {
          id: 'autoSync',
          title: 'Auto Sync',
          subtitle: 'Automatically sync data when online',
          type: 'toggle',
          value: settings.autoSync,
          icon: 'arrow-path',
          action: () => toggleSetting('autoSync')
        }
      ]
    },
    {
      id: 'advanced',
      title: 'Advanced',
      items: [
        {
          id: 'debugMode',
          title: 'Debug Mode',
          subtitle: 'Enable debug logging and diagnostic features',
          type: 'toggle',
          value: adminSettings.debugMode,
          icon: 'bug-ant',
          action: () => toggleSetting('debugMode', true),
          adminControlled: true
        },
        {
          id: 'betaFeatures',
          title: 'Beta Features',
          subtitle: 'Access experimental features',
          type: 'toggle',
          value: adminSettings.betaFeatures,
          icon: 'beaker',
          action: () => toggleSetting('betaFeatures', true),
          adminControlled: true
        },
        {
          id: 'exportData',
          title: 'Export Data',
          subtitle: 'Export your app data and preferences',
          type: 'button',
          icon: 'arrow-down-tray',
          action: exportData
        },
        {
          id: 'resetData',
          title: 'Reset App Data',
          subtitle: 'Clear all app data and preferences',
          type: 'button',
          icon: 'trash',
          action: resetAppData
        }
      ]
    },
    {
      id: 'support',
      title: 'Support & Info',
      items: [
        {
          id: 'help',
          title: 'Help & FAQ',
          subtitle: 'Get answers to common questions',
          type: 'navigation',
          icon: 'question-mark-circle',
          action: () => {
            // TODO: Navigate to help screen
            Alert.alert('Info', 'Help section coming soon!');
          }
        },
        {
          id: 'contact',
          title: 'Contact Support',
          subtitle: 'Get help from our support team',
          type: 'button',
          icon: 'chat-bubble-left-right',
          action: contactSupport
        },
        {
          id: 'privacy',
          title: 'Privacy Policy',
          subtitle: 'Read our privacy policy',
          type: 'navigation',
          icon: 'shield-check',
          action: () => {
            Alert.alert('Info', 'Opening privacy policy...');
          }
        },
        {
          id: 'terms',
          title: 'Terms of Service',
          subtitle: 'Read our terms of service',
          type: 'navigation',
          icon: 'document-text',
          action: () => {
            Alert.alert('Info', 'Opening terms of service...');
          }
        },
        {
          id: 'version',
          title: 'App Version',
          subtitle: 'v2.1.0 (Build 2025.01)',
          type: 'info',
          icon: 'information-circle'
        }
      ]
    }
  ];

  const renderSettingsItem = (item: SettingsItem) => (
    <TouchableOpacity
      key={item.id}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
          backgroundColor: isDark ? colors.gray[800] : colors.white,
          marginBottom: spacing.xs,
          borderRadius: borderRadius.lg,
          ...shadows.sm,
        },
        item.adminControlled && {
          borderLeftWidth: 3,
          borderLeftColor: colors.warning
        }
      ]}
      onPress={item.action}
      disabled={item.type === 'info'}
      activeOpacity={item.type === 'info' ? 1 : 0.7}
    >
      <View style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: isDark ? colors.gray[700] : colors.gray[100],
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md
      }}>
        <IconSymbol 
          name={item.icon as any} 
          size={20} 
          color={item.adminControlled ? colors.warning : colors.primary} 
        />
      </View>
      
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: 16,
          fontWeight: '600',
          color: isDark ? colors.white : colors.gray[900],
          marginBottom: spacing.xs / 2
        }}>
          {item.title}
          {item.adminControlled && (
            <Text style={{ color: colors.warning, fontSize: 12 }}> (Admin)</Text>
          )}
        </Text>
        {item.subtitle && (
          <Text style={{
            fontSize: 14,
            color: isDark ? colors.gray[400] : colors.gray[600],
            lineHeight: 18
          }}>
            {item.subtitle}
          </Text>
        )}
      </View>
      
      {item.type === 'toggle' && (
        <Switch
          value={item.value}
          onValueChange={item.action}
          trackColor={{ false: colors.gray[300], true: colors.primary }}
          thumbColor={item.value ? colors.white : colors.gray[50]}
          ios_backgroundColor={colors.gray[300]}
        />
      )}
      
      {(item.type === 'navigation' || item.type === 'button') && (
        <IconSymbol 
          name="chevron.right" 
          size={16} 
          color={isDark ? colors.gray[400] : colors.gray[500]} 
        />
      )}
    </TouchableOpacity>
  );

  const renderSection = (section: SettingsSection) => (
    <View key={section.id} style={{ marginBottom: spacing.xl }}>
      <Text style={{
        fontSize: 18,
        fontWeight: '700',
        color: isDark ? colors.white : colors.gray[900],
        marginBottom: spacing.md,
        marginLeft: spacing.lg
      }}>
        {section.title}
      </Text>
      <View style={{
        backgroundColor: isDark ? colors.gray[900] : colors.gray[50],
        borderRadius: borderRadius.xl,
        padding: spacing.sm,
        marginHorizontal: spacing.lg
      }}>
        {section.items.map(renderSettingsItem)}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: isDark ? colors.gray[950] : colors.gray[50]
    }}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'} 
        backgroundColor={isDark ? colors.gray[900] : colors.white}
      />
      
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: isDark ? colors.gray[900] : colors.white,
        borderBottomWidth: 1,
        borderBottomColor: isDark ? colors.gray[800] : colors.gray[200],
        ...shadows.sm
      }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: isDark ? colors.gray[800] : colors.gray[100],
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: spacing.md
          }}
        >
          <IconSymbol name="arrow.left" size={20} color={colors.primary} />
        </TouchableOpacity>
        
        <Text style={{
          fontSize: 24,
          fontWeight: '700',
          color: isDark ? colors.white : colors.gray[900],
          flex: 1
        }}>
          Settings
        </Text>
        
        <TouchableOpacity
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onPress={() => {
            Alert.alert(
              'Admin Panel',
              'Access admin dashboard for advanced controls',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Open Dashboard', onPress: () => {
                  // TODO: Open admin dashboard
                  Alert.alert('Info', 'Admin dashboard integration coming soon!');
                }}
              ]
            );
          }}
        >
          <IconSymbol name="gear" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingVertical: spacing.lg }}
        showsVerticalScrollIndicator={false}
      >
        {settingsSections.map(renderSection)}
        
        {/* Footer */}
        <View style={{
          alignItems: 'center',
          paddingVertical: spacing.xl,
          paddingHorizontal: spacing.lg
        }}>
          <Text style={{
            fontSize: 14,
            color: isDark ? colors.gray[500] : colors.gray[600],
            textAlign: 'center',
            marginBottom: spacing.md
          }}>
            NaviLynx AR Navigation System
          </Text>
          <Text style={{
            fontSize: 12,
            color: isDark ? colors.gray[600] : colors.gray[500],
            textAlign: 'center'
          }}>
            © 2025 NaviLynx Technologies. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
