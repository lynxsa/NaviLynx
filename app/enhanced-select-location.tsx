import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { router } from 'expo-router';

export default function EnhancedSelectLocation() {
  const { theme } = useTheme();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  
  const locations = [
    { id: '1', name: 'Sandton City Mall', address: 'Sandton, Johannesburg' },
    { id: '2', name: 'V&A Waterfront', address: 'Cape Town' },
    { id: '3', name: 'Gateway Theatre of Shopping', address: 'Durban' },
    { id: '4', name: 'Menlyn Park Shopping Centre', address: 'Pretoria' },
    { id: '5', name: 'Canal Walk Shopping Centre', address: 'Cape Town' }
  ];
  
  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: theme.colors.background,
      padding: 20
    }}>
      <Text style={{ 
        color: theme.colors.text,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20
      }}>
        Select Location
      </Text>
      
      <ScrollView style={{ flex: 1 }}>
        {locations.map((location) => (
          <TouchableOpacity
            key={location.id}
            style={{
              backgroundColor: selectedLocation === location.id ? theme.colors.primary : theme.colors.card,
              padding: 15,
              borderRadius: 10,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: selectedLocation === location.id ? theme.colors.primary : theme.colors.border
            }}
            onPress={() => setSelectedLocation(location.id)}
          >
            <Text style={{ 
              color: selectedLocation === location.id ? 'white' : theme.colors.text,
              fontSize: 18,
              fontWeight: 'bold'
            }}>
              {location.name}
            </Text>
            <Text style={{ 
              color: selectedLocation === location.id ? 'white' : theme.colors.text,
              fontSize: 14,
              opacity: 0.7,
              marginTop: 5
            }}>
              {location.address}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <TouchableOpacity
        style={{
          backgroundColor: selectedLocation ? theme.colors.primary : theme.colors.border,
          paddingHorizontal: 30,
          paddingVertical: 15,
          borderRadius: 10,
          marginTop: 20
        }}
        disabled={!selectedLocation}
        onPress={() => selectedLocation && router.push('/ar-navigation')}
      >
        <Text style={{ 
          color: selectedLocation ? 'white' : theme.colors.text, 
          fontSize: 16, 
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          Continue to Navigation
        </Text>
      </TouchableOpacity>
    </View>
  );
}
