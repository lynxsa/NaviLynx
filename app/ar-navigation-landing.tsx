import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { router } from 'expo-router';

export default function ARNavigationLanding() {
  const { theme } = useTheme();
  
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      padding: 20
    }}>
      <Text style={{ 
        color: theme.colors.text,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
      }}>
        AR Navigation
      </Text>
      <Text style={{ 
        color: theme.colors.text,
        fontSize: 16,
        marginBottom: 30,
        textAlign: 'center'
      }}>
        Experience indoor navigation with augmented reality
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: theme.colors.primary,
          paddingHorizontal: 30,
          paddingVertical: 15,
          borderRadius: 10
        }}
        onPress={() => router.push('/ar-navigation')}
      >
        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
          Start AR Navigation
        </Text>
      </TouchableOpacity>
    </View>
  );
}
