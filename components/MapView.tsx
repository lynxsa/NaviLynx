import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

const { width, height } = Dimensions.get('window');

interface MapViewProps {
  destination?: string;
  showNavigation?: boolean;
  onNavigationStart?: () => void;
  onNavigationEnd?: () => void;
}

export default function MapView({ 
  destination, 
  showNavigation = false,
  onNavigationStart,
  onNavigationEnd 
}: MapViewProps) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required for navigation');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Could not get your current location');
    }
  };

  const handleStartNavigation = () => {
    setIsNavigating(true);
    onNavigationStart?.();
  };

  const handleEndNavigation = () => {
    setIsNavigating(false);
    onNavigationEnd?.();
  };

  // Generate map HTML with indoor floor plan simulation
  const generateMapHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, sans-serif;
              background: ${colors.background};
              color: ${colors.text};
            }
            #map {
              width: 100%;
              height: 100vh;
              position: relative;
              background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
              overflow: hidden;
            }
            .floor-plan {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 90%;
              height: 80%;
              background: white;
              border: 2px solid #ddd;
              border-radius: 20px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            }
            .venue-marker {
              position: absolute;
              width: 40px;
              height: 40px;
              background: #007AFF;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              cursor: pointer;
              animation: pulse 2s infinite;
              box-shadow: 0 4px 12px rgba(0,122,255,0.3);
            }
            .user-location {
              position: absolute;
              width: 20px;
              height: 20px;
              background: #34C759;
              border: 3px solid white;
              border-radius: 50%;
              animation: pulse 1.5s infinite;
              box-shadow: 0 2px 8px rgba(52,199,89,0.4);
            }
            .navigation-path {
              position: absolute;
              height: 4px;
              background: linear-gradient(90deg, #007AFF, #34C759);
              border-radius: 2px;
              opacity: 0.8;
              animation: ${isNavigating ? 'pathAnimation 2s infinite' : 'none'};
            }
            .floor-info {
              position: absolute;
              top: 20px;
              left: 20px;
              background: rgba(255,255,255,0.9);
              padding: 12px 16px;
              border-radius: 12px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            .controls {
              position: absolute;
              bottom: 20px;
              right: 20px;
              display: flex;
              flex-direction: column;
              gap: 12px;
            }
            .control-btn {
              width: 50px;
              height: 50px;
              background: white;
              border: none;
              border-radius: 25px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              font-size: 20px;
            }
            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.1); }
              100% { transform: scale(1); }
            }
            @keyframes pathAnimation {
              0% { opacity: 0.4; }
              50% { opacity: 1; }
              100% { opacity: 0.4; }
            }
          </style>
        </head>
        <body>
          <div id="map">
            <div class="floor-plan">
              <!-- Floor Info -->
              <div class="floor-info">
                <div style="font-weight: bold; color: #333;">Ground Floor</div>
                <div style="font-size: 12px; color: #666;">Sandton City Mall</div>
              </div>
              
              <!-- User Location -->
              <div class="user-location" style="bottom: 30%; left: 20%;"></div>
              
              <!-- Navigation Path -->
              ${isNavigating ? `
                <div class="navigation-path" style="
                  bottom: 30%; 
                  left: 20%; 
                  width: 40%; 
                  transform: rotate(45deg);
                "></div>
                <div class="navigation-path" style="
                  bottom: 45%; 
                  left: 50%; 
                  width: 30%; 
                  transform: rotate(-30deg);
                "></div>
              ` : ''}
              
              <!-- Venue Markers -->
              <div class="venue-marker" style="top: 20%; left: 30%;" onclick="selectVenue('entrance')">E</div>
              <div class="venue-marker" style="top: 40%; right: 20%;" onclick="selectVenue('store1')">S1</div>
              <div class="venue-marker" style="bottom: 30%; right: 30%;" onclick="selectVenue('restaurant')">R</div>
              <div class="venue-marker" style="top: 60%; left: 40%;" onclick="selectVenue('atm')">💳</div>
              
              <!-- Destination Marker -->
              ${destination ? `
                <div class="venue-marker" style="
                  top: 15%; 
                  right: 25%; 
                  background: #FF6B35;
                  animation: pulse 1s infinite;
                " onclick="selectVenue('destination')">🎯</div>
              ` : ''}
              
              <!-- Map Controls -->
              <div class="controls">
                <button class="control-btn" onclick="zoomIn()">+</button>
                <button class="control-btn" onclick="zoomOut()">-</button>
                <button class="control-btn" onclick="recenter()">📍</button>
              </div>
            </div>
          </div>
          
          <script>
            function selectVenue(venueId) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'venueSelected',
                venue: venueId
              }));
            }
            
            function zoomIn() {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'zoom',
                direction: 'in'
              }));
            }
            
            function zoomOut() {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'zoom',
                direction: 'out'
              }));
            }
            
            function recenter() {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'recenter'
              }));
            }
          </script>
        </body>
      </html>
    `;
  };

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      switch (data.type) {
        case 'venueSelected':
          Alert.alert('Venue Selected', `Selected: ${data.venue}`);
          break;
        case 'zoom':
          console.log(`Zoom ${data.direction}`);
          break;
        case 'recenter':
          console.log('Recenter map');
          break;
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/* Map Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View style={styles.headerContent}>
          <IconSymbol name="map.fill" size={24} color={colors.primary} />
          <ThemedText type="defaultSemiBold" style={{ marginLeft: 8 }}>
            Indoor Map
          </ThemedText>
        </View>
        
        {showNavigation && (
          <TouchableOpacity
            style={[
              styles.navigationButton,
              { 
                backgroundColor: isNavigating ? '#FF3B30' : '#007AFF',
              }
            ]}
            onPress={isNavigating ? handleEndNavigation : handleStartNavigation}
          >
            <IconSymbol 
              name={isNavigating ? "stop.fill" : "location.fill"} 
              size={16} 
              color="white" 
            />
            <ThemedText style={[styles.navigationButtonText, { color: 'white' }]}>
              {isNavigating ? 'Stop' : 'Navigate'}
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>

      {/* Interactive Map */}
      <WebView
        source={{ html: generateMapHTML() }}
        style={styles.webView}
        onMessage={handleWebViewMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
      />

      {/* Map Legend */}
      <View style={[styles.legend, { backgroundColor: colors.surface }]}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#34C759' }]} />
          <ThemedText style={styles.legendText}>Your Location</ThemedText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#007AFF' }]} />
          <ThemedText style={styles.legendText}>Points of Interest</ThemedText>
        </View>
        {destination && (
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FF6B35' }]} />
            <ThemedText style={styles.legendText}>Destination</ThemedText>
          </View>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  navigationButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  webView: {
    flex: 1,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
  },
});
