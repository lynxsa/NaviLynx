import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export default function IndexEnhanced() {
  const { theme } = useTheme();
  
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: theme.colors.background 
    }}>
      <Text style={{ color: theme.colors.text }}>
        Enhanced Index Screen - Coming Soon
      </Text>
    </View>
  );
}
