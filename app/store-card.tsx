import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { router } from 'expo-router';

export default function StoreCard() {
  const { theme } = useTheme();
  
  const storeCards = [
    { 
      id: '1', 
      name: 'Edgars Card', 
      discount: '15% off',
      validity: 'Valid until Dec 2024',
      color: '#FF6B6B'
    },
    { 
      id: '2', 
      name: 'Woolworths Card', 
      discount: '10% off',
      validity: 'Valid until Jan 2025',
      color: '#4ECDC4'
    },
    { 
      id: '3', 
      name: 'Pick n Pay Card', 
      discount: '20% off',
      validity: 'Valid until Nov 2024',
      color: '#45B7D1'
    },
    { 
      id: '4', 
      name: 'Checkers Card', 
      discount: '12% off',
      validity: 'Valid until Mar 2025',
      color: '#96CEB4'
    }
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
        Store Cards
      </Text>
      
      <Text style={{ 
        color: theme.colors.text,
        fontSize: 16,
        marginBottom: 20,
        opacity: 0.7
      }}>
        Manage your store loyalty cards and exclusive offers
      </Text>
      
      <ScrollView style={{ flex: 1 }}>
        {storeCards.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={{
              backgroundColor: card.color,
              padding: 20,
              borderRadius: 15,
              marginBottom: 15,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5
            }}
            onPress={() => console.log('Selected card:', card.id)}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ 
                  color: 'white',
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginBottom: 5
                }}>
                  {card.name}
                </Text>
                <Text style={{ 
                  color: 'white',
                  fontSize: 16,
                  fontWeight: '600',
                  marginBottom: 5
                }}>
                  {card.discount}
                </Text>
                <Text style={{ 
                  color: 'white',
                  fontSize: 12,
                  opacity: 0.8
                }}>
                  {card.validity}
                </Text>
              </View>
              <View style={{
                width: 60,
                height: 40,
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>CARD</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <TouchableOpacity
        style={{
          backgroundColor: theme.colors.primary,
          paddingHorizontal: 30,
          paddingVertical: 15,
          borderRadius: 10,
          marginTop: 20
        }}
        onPress={() => router.back()}
      >
        <Text style={{ 
          color: 'white', 
          fontSize: 16, 
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          Add New Card
        </Text>
      </TouchableOpacity>
    </View>
  );
}
