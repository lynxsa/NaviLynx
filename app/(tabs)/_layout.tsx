import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useThemeSafe } from '@/context/ThemeContext';
import { useLanguageSafe } from '@/context/LanguageContext';
import { colors } from '@/styles/modernTheme';

// Accept children and render them inside Tabs
export default function TabLayout() {
  // Use safe hooks that provide fallback values
  const { isDark } = useThemeSafe();
  const { t } = useLanguageSafe();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
        headerShown: false,
        tabBarButton: HapticTab as any,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          ...Platform.select({
            ios: {
              position: 'absolute',
            },
            default: {},
          }),
          backgroundColor: isDark ? colors.gray[900] : '#FFFFFF',
          borderTopColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 25 : 8,
          height: Platform.OS === 'ios' ? 88 : 64,
          shadowColor: isDark ? '#000000' : '#000000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: isDark ? 0.4 : 0.1,
          shadowRadius: 12,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      {/* ONLY THESE 7 TABS SHOULD BE VISIBLE */}
      <Tabs.Screen
        name="index"
        options={{
          title: t?.('home') || 'Home',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={22} name={focused ? 'house.fill' : 'house'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: t?.('explore') || 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={22} name={focused ? 'map.fill' : 'map'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ar-navigator"
        options={{
          title: 'AR Nav',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={22} name={focused ? 'viewfinder.circle.fill' : 'viewfinder.circle'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="navigenie"
        options={{
          title: 'NaviGenie',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={22} name={focused ? 'lightbulb.fill' : 'lightbulb'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="shop-assistant"
        options={{
          title: 'Shopper',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={22} name={focused ? 'bag.fill' : 'bag'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="parking"
        options={{
          title: t?.('parking') || 'Parking',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={22} name={focused ? 'car.fill' : 'car'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={22} name="person" color={color} />
          ),
        }}
      />
      
      {/* HIDE ALL OTHER FILES - THEY WILL NOT APPEAR IN TAB BAR */}
    </Tabs>
  );
}
