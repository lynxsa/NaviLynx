import React from 'react';
import { View, Text } from 'react-native';
import GlassCard from './GlassCard';
import { BackdropBlur } from './BackdropBlur';

interface GlassElementsProps {
  children?: React.ReactNode;
}

// Glass Card with Blur Effect
export const ModernGlassCard: React.FC<GlassElementsProps> = ({ children }) => (
  <GlassCard 
    intensity={40}
    tint="light"
    className="m-4 shadow-lg"
  >
    {children}
  </GlassCard>
);

// Dark Glass Card
export const DarkGlassCard: React.FC<GlassElementsProps> = ({ children }) => (
  <GlassCard 
    intensity={30}
    tint="dark"
    className="m-4 shadow-lg bg-gray-900/20"
  >
    {children}
  </GlassCard>
);

// Backdrop Blur Container
export const BlurContainer: React.FC<GlassElementsProps> = ({ children }) => (
  <BackdropBlur
    backdropBlur="lg"
    tint="light"
    className="rounded-2xl p-4 border border-white/30"
  >
    {children}
  </BackdropBlur>
);

// Status Bar with Blur
export const BlurStatusBar: React.FC<{ title: string; status: string }> = ({ title, status }) => (
  <BackdropBlur
    backdropBlur="md"
    tint="dark"
    className="flex-row items-center justify-between p-4 rounded-xl mx-4 my-2"
  >
    <Text className="text-white font-semibold text-lg">{title}</Text>
    <View className="bg-green-500 px-3 py-1 rounded-full">
      <Text className="text-white text-sm font-medium">{status}</Text>
    </View>
  </BackdropBlur>
);

// Navigation Overlay with Blur
export const BlurNavigationOverlay: React.FC<GlassElementsProps> = ({ children }) => (
  <View className="absolute bottom-6 left-6 right-6">
    <GlassCard 
      intensity={60}
      tint="dark"
      className="shadow-2xl"
    >
      {children}
    </GlassCard>
  </View>
);

export default {
  ModernGlassCard,
  DarkGlassCard,
  BlurContainer,
  BlurStatusBar,
  BlurNavigationOverlay,
};
