import { Tabs, Slot } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useThemeSafe } from '@/context/ThemeContext';
import { useLanguageSafe } from '@/context/LanguageContext';

// Accept children and render them inside Tabs
export default function TabLayout() {
  // Use safe hooks that provide fallback values
  const { colors } = useThemeSafe();
  const { t } = useLanguageSafe();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors?.primary || '#007AFF',
        tabBarInactiveTintColor: colors?.icon || '#8E8E93',
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
          backgroundColor: colors?.card || '#FFFFFF',
          borderTopColor: colors?.border || '#E1E1E1',
          borderTopWidth: 0.5,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 25 : 8,
          height: Platform.OS === 'ios' ? 88 : 64,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t?.('home') || 'Home',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={24} name={focused ? 'house.fill' : 'house'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: t?.('explore') || 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={24} name={focused ? 'map.fill' : 'map'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="navigenie"
        options={{
          title: 'NaviGenie',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={24} name={focused ? 'sparkles' : 'sparkles'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ar-navigator"
        options={{
          title: 'AR Nav',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={24} name={focused ? 'viewfinder.circle.fill' : 'viewfinder.circle'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="parking"
        options={{
          title: t?.('parking') || 'Parking',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={24} name={focused ? 'car.fill' : 'car'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t?.('profile') || 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={24} name={focused ? 'person.fill' : 'person'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
