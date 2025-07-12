import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';

// Test component to verify NativeWind is working
export const StyleTest: React.FC = () => {
  return (
    <View className="p-4 bg-purple-600 rounded-lg">
      <Text className="text-white font-bold text-lg">
        NativeWind Style Test
      </Text>
      <Text className="text-white/80 mt-2">
        If you can see this styled properly, NativeWind is working!
      </Text>
    </View>
  );
};

// Utility function to convert Tailwind classes to React Native styles (fallback)
export const tw = (classes: string): ViewStyle | TextStyle => {
  const style: any = {};
  
  // Basic color mappings
  if (classes.includes('bg-purple-600')) style.backgroundColor = '#7C3AED';
  if (classes.includes('bg-white')) style.backgroundColor = '#FFFFFF';
  if (classes.includes('bg-gray-900')) style.backgroundColor = '#111827';
  if (classes.includes('text-white')) style.color = '#FFFFFF';
  if (classes.includes('text-gray-900')) style.color = '#111827';
  if (classes.includes('text-purple-600')) style.color = '#7C3AED';
  
  // Spacing
  if (classes.includes('p-4')) style.padding = 16;
  if (classes.includes('p-3')) style.padding = 12;
  if (classes.includes('px-4')) { style.paddingHorizontal = 16; }
  if (classes.includes('py-2')) { style.paddingVertical = 8; }
  if (classes.includes('m-4')) style.margin = 16;
  if (classes.includes('mb-4')) style.marginBottom = 16;
  if (classes.includes('mt-2')) style.marginTop = 8;
  
  // Border radius
  if (classes.includes('rounded-lg')) style.borderRadius = 8;
  if (classes.includes('rounded-xl')) style.borderRadius = 12;
  if (classes.includes('rounded-full')) style.borderRadius = 9999;
  
  // Flexbox
  if (classes.includes('flex-1')) style.flex = 1;
  if (classes.includes('flex-row')) style.flexDirection = 'row';
  if (classes.includes('items-center')) style.alignItems = 'center';
  if (classes.includes('justify-center')) style.justifyContent = 'center';
  if (classes.includes('justify-between')) style.justifyContent = 'space-between';
  
  // Font
  if (classes.includes('font-bold')) style.fontWeight = 'bold';
  if (classes.includes('font-semibold')) style.fontWeight = '600';
  if (classes.includes('text-lg')) style.fontSize = 18;
  if (classes.includes('text-xl')) style.fontSize = 20;
  if (classes.includes('text-2xl')) style.fontSize = 24;
  if (classes.includes('text-sm')) style.fontSize = 14;
  if (classes.includes('text-xs')) style.fontSize = 12;
  
  return style;
};

export default StyleTest;
