// Advanced Mobile Features Implementation
// Next Phase Mobile Enhancements for NaviLynx

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Image,
  Animated,
  PanGestureHandler,
  State,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import * as Location from 'expo-location';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';
import { productionBackend } from '../services/ProductionBackendService';

const { width, height } = Dimensions.get('window');

// Advanced AI Voice Assistant
export const VoiceNavigationService = {
  isListening: false,
  
  async startVoiceNavigation() {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        throw new Error('Microphone permission required');
      }

      this.isListening = true;
      
      // Start speech recognition
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();

      return recording;
    } catch (error) {
      console.error('Voice navigation error:', error);
      throw error;
    }
  },

  async processVoiceCommand(audioUri: string): Promise<string> {
    try {
      // Process audio with AI service
      const response = await fetch('/api/voice-processing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioUri })
      });

      const { command, intent, entities } = await response.json();
      
      // Execute navigation command
      return await this.executeVoiceCommand(command, intent, entities);
    } catch (error) {
      console.error('Voice processing error:', error);
      return 'Sorry, I didn\'t understand that command.';
    }
  },

  async executeVoiceCommand(command: string, intent: string, entities: any[]): Promise<string> {
    switch (intent) {
      case 'navigate_to':
        const destination = entities.find(e => e.type === 'location')?.value;
        if (destination) {
          // Start navigation to destination
          return `Starting navigation to ${destination}`;
        }
        break;
      
      case 'find_store':
        const store = entities.find(e => e.type === 'store')?.value;
        if (store) {
          // Search for store
          return `Finding ${store} for you`;
        }
        break;
      
      case 'show_deals':
        // Show available deals
        return 'Here are the current deals near you';
      
      default:
        return 'I can help you navigate, find stores, or show deals. What would you like to do?';
    }
    
    return 'Command not recognized';
  },

  async speakResponse(text: string) {
    await Speech.speak(text, {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.9,
    });
  }
};

// Advanced AR Overlay Component
interface AROverlayProps {
  venues: any[];
  userLocation: { latitude: number; longitude: number };
  heading: number;
}

export const AdvancedAROverlay: React.FC<AROverlayProps> = ({
  venues,
  userLocation,
  heading
}) => {
  const { theme } = useTheme();
  const [arElements, setArElements] = useState<any[]>([]);

  useEffect(() => {
    // Calculate AR overlay positions
    const elements = venues.map(venue => {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        venue.coordinates.latitude,
        venue.coordinates.longitude
      );

      const bearing = calculateBearing(
        userLocation.latitude,
        userLocation.longitude,
        venue.coordinates.latitude,
        venue.coordinates.longitude
      );

      const relativeAngle = bearing - heading;
      const screenX = (relativeAngle / 120) * width + width / 2; // 120° FOV
      
      return {
        ...venue,
        distance,
        screenX,
        screenY: height / 2, // Center vertically for now
        visible: Math.abs(relativeAngle) < 60 // Only show if within 60° of center
      };
    });

    setArElements(elements.filter(e => e.visible));
  }, [venues, userLocation, heading]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const calculateBearing = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const lat1Rad = lat1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;
    
    const y = Math.sin(dLon) * Math.cos(lat2Rad);
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - 
              Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
    
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  };

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      {arElements.map((element, index) => (
        <View
          key={element.id}
          style={{
            position: 'absolute',
            left: element.screenX - 50,
            top: element.screenY - 30,
            backgroundColor: 'rgba(0,0,0,0.7)',
            borderRadius: 15,
            padding: 10,
            alignItems: 'center',
            borderWidth: 2,
            borderColor: theme.primary,
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>
            {element.name}
          </Text>
          <Text style={{ color: 'white', fontSize: 10 }}>
            {element.distance.toFixed(0)}m
          </Text>
          <View style={{
            position: 'absolute',
            bottom: -10,
            left: '50%',
            marginLeft: -5,
            width: 10,
            height: 10,
            backgroundColor: theme.primary,
            borderRadius: 5,
          }} />
        </View>
      ))}
    </View>
  );
};

// Smart Parking Assistant
export const SmartParkingAssistant: React.FC = () => {
  const { theme } = useTheme();
  const [parkingSpots, setParkingSpots] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<any>(null);

  const scanForParkingSpots = async () => {
    try {
      setIsScanning(true);
      
      // Use camera to detect parking spots
      const { granted } = await Camera.requestCameraPermissionsAsync();
      if (!granted) {
        throw new Error('Camera permission required');
      }

      // Simulate AI-powered parking spot detection
      const mockSpots = [
        {
          id: '1',
          level: 'B1',
          section: 'A',
          number: '15',
          status: 'available',
          distance: 50,
          timeLimit: 120, // minutes
          price: 15.00, // per hour
          features: ['electric_charging', 'covered']
        },
        {
          id: '2',
          level: 'B1',
          section: 'B',
          number: '23',
          status: 'available',
          distance: 75,
          timeLimit: 240,
          price: 12.00,
          features: ['covered']
        }
      ];

      setParkingSpots(mockSpots);
    } catch (error) {
      console.error('Parking scan error:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const reserveParkingSpot = async (spot: any) => {
    try {
      await productionBackend.trackUserAction('parking_reservation', {
        spotId: spot.id,
        level: spot.level,
        section: spot.section,
        number: spot.number,
        price: spot.price
      });

      setSelectedSpot(spot);
      
      // Start navigation to parking spot
      // Implementation would integrate with AR navigation
    } catch (error) {
      console.error('Parking reservation error:', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={{ padding: 20 }}>
        <Text style={{ color: theme.text, fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
          Smart Parking Assistant
        </Text>

        <TouchableOpacity
          onPress={scanForParkingSpots}
          disabled={isScanning}
          style={{
            backgroundColor: theme.primary,
            padding: 15,
            borderRadius: 10,
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          {isScanning ? (
            <ActivityIndicator color={theme.background} />
          ) : (
            <>
              <Ionicons name="car-outline" size={24} color={theme.background} />
              <Text style={{ color: theme.background, fontWeight: 'bold', marginTop: 5 }}>
                Scan for Available Spots
              </Text>
            </>
          )}
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false}>
          {parkingSpots.map(spot => (
            <TouchableOpacity
              key={spot.id}
              onPress={() => reserveParkingSpot(spot)}
              style={{
                backgroundColor: theme.card,
                borderRadius: 15,
                padding: 15,
                marginBottom: 15,
                borderWidth: selectedSpot?.id === spot.id ? 2 : 0,
                borderColor: theme.primary,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={{ color: theme.text, fontSize: 18, fontWeight: 'bold' }}>
                    {spot.level} - {spot.section}{spot.number}
                  </Text>
                  <Text style={{ color: theme.textSecondary, fontSize: 14 }}>
                    {spot.distance}m away • R{spot.price}/hour
                  </Text>
                  <View style={{ flexDirection: 'row', marginTop: 5 }}>
                    {spot.features.map((feature: string) => (
                      <View
                        key={feature}
                        style={{
                          backgroundColor: theme.accent,
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 10,
                          marginRight: 5,
                        }}
                      >
                        <Text style={{ color: theme.background, fontSize: 10 }}>
                          {feature.replace('_', ' ')}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
                
                <View style={{ alignItems: 'center' }}>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: spot.status === 'available' ? '#4CAF50' : '#FF4757',
                    }}
                  />
                  <Text style={{ color: theme.textSecondary, fontSize: 12, marginTop: 5 }}>
                    {spot.status}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

// Advanced Social Features
export const SocialShoppingExperience: React.FC = () => {
  const { theme } = useTheme();
  const [friends, setFriends] = useState<any[]>([]);
  const [sharedLists, setSharedLists] = useState<any[]>([]);
  const [groupShopping, setGroupShopping] = useState(false);

  const startGroupShopping = async () => {
    try {
      setGroupShopping(true);
      
      // Create a shared shopping session
      const session = await productionBackend.createSharedSession({
        type: 'group_shopping',
        participants: friends.filter(f => f.isOnline),
        venue: 'current_venue',
        features: ['shared_cart', 'real_time_chat', 'location_sharing']
      });

      // Notify friends about shopping session
      await productionBackend.notifyFriends(session.id, {
        message: 'Join me for shopping!',
        venue: session.venue,
        estimatedDuration: 60
      });

    } catch (error) {
      console.error('Group shopping error:', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Social shopping interface */}
      <View style={{ padding: 20 }}>
        <Text style={{ color: theme.text, fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
          Social Shopping
        </Text>

        <TouchableOpacity
          onPress={startGroupShopping}
          style={{
            backgroundColor: theme.primary,
            padding: 15,
            borderRadius: 10,
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <Text style={{ color: theme.background, fontWeight: 'bold' }}>
            Start Group Shopping Session
          </Text>
        </TouchableOpacity>

        {/* Friends list and shared features would go here */}
      </View>
    </View>
  );
};

// Advanced Analytics Dashboard
export const UserAnalyticsDashboard: React.FC = () => {
  const { theme } = useTheme();
  const [analytics, setAnalytics] = useState<any>({});

  useEffect(() => {
    loadUserAnalytics();
  }, []);

  const loadUserAnalytics = async () => {
    try {
      const data = await productionBackend.getUserAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Analytics loading error:', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView style={{ padding: 20 }}>
        <Text style={{ color: theme.text, fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
          Your Shopping Insights
        </Text>

        {/* Analytics cards would go here */}
        <View style={{
          backgroundColor: theme.card,
          borderRadius: 15,
          padding: 20,
          marginBottom: 15,
        }}>
          <Text style={{ color: theme.text, fontSize: 18, fontWeight: 'bold' }}>
            This Month
          </Text>
          <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 5 }}>
            Venues visited: {analytics.venuesVisited || 0}
          </Text>
          <Text style={{ color: theme.textSecondary, fontSize: 14 }}>
            Deals claimed: {analytics.dealsClaimed || 0}
          </Text>
          <Text style={{ color: theme.textSecondary, fontSize: 14 }}>
            Money saved: R{analytics.moneySaved || 0}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default {
  VoiceNavigationService,
  AdvancedAROverlay,
  SmartParkingAssistant,
  SocialShoppingExperience,
  UserAnalyticsDashboard
};
