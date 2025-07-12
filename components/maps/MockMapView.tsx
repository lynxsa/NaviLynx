import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeSafe } from '@/context/ThemeContext';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Venue } from '@/data/southAfricanVenues';

const { width, height } = Dimensions.get('window');

interface MockMapViewProps {
  venues: Venue[];
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  onVenuePress?: (venue: Venue) => void;
  showUserLocation?: boolean;
}

export const MockMapView: React.FC<MockMapViewProps> = ({
  venues,
  initialRegion,
  onVenuePress,
  showUserLocation = true
}) => {
  const { colors, isDark } = useThemeSafe();
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  // Default region (Johannesburg/Sandton area)
  const defaultRegion = {
    latitude: -26.1076,
    longitude: 28.0567,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  const region = initialRegion || defaultRegion;

  const mapStyle = isDark ? [
    {
      "elementType": "geometry",
      "stylers": [{ "color": "#242f3e" }]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#746855" }]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [{ "color": "#242f3e" }]
    }
  ] : [];

  const handleMarkerPress = (venue: Venue) => {
    setSelectedVenue(venue);
    onVenuePress?.(venue);
  };

  return (
    <View className="flex-1">
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={region}
        showsUserLocation={showUserLocation}
        showsMyLocationButton={false}
        customMapStyle={mapStyle}
      >
        {venues.map((venue) => (
          <Marker
            key={venue.id}
            coordinate={{
              latitude: venue.location.coordinates.latitude,
              longitude: venue.location.coordinates.longitude,
            }}
            onPress={() => handleMarkerPress(venue)}
          >
            <View className="items-center">
              <View
                className="w-12 h-12 rounded-full shadow-lg items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <IconSymbol
                  name={venue.type === 'mall' ? 'storefront' : 
                        venue.type === 'airport' ? 'airplane' :
                        venue.type === 'hospital' ? 'cross.fill' :
                        'location.fill'}
                  size={20}
                  color="#FFFFFF"
                />
              </View>
              <View
                className="mt-1 px-2 py-1 rounded"
                style={{ backgroundColor: colors.surface + 'E6' }}
              >
                <Text
                  className="text-xs font-medium"
                  style={{ color: colors.text }}
                >
                  {venue.name}
                </Text>
              </View>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Floor plan overlay toggle */}
      <TouchableOpacity
        className="absolute bottom-20 left-4 px-4 py-2 rounded-full shadow-md"
        style={{ backgroundColor: colors.surface + 'E6' }}
      >
        <View className="flex-row items-center">
          <IconSymbol name="building.2" size={16} color={colors.primary} />
          <Text
            className="ml-2 text-sm font-medium"
            style={{ color: colors.text }}
          >
            Floor Plans
          </Text>
        </View>
      </TouchableOpacity>

      {/* Selected venue info card */}
      {selectedVenue && (
        <View
          className="absolute bottom-0 left-0 right-0 p-4 rounded-t-2xl shadow-lg"
          style={{ backgroundColor: colors.surface }}
        >
          <View className="flex-row items-center justify-between mb-2">
            <Text
              className="text-lg font-bold"
              style={{ color: colors.text }}
            >
              {selectedVenue.name}
            </Text>
            <TouchableOpacity onPress={() => setSelectedVenue(null)}>
              <IconSymbol name="xmark" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <Text
            className="text-sm mb-3"
            style={{ color: colors.textSecondary }}
          >
            {selectedVenue.description}
          </Text>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <IconSymbol name="star.fill" size={14} color="#FFD700" />
              <Text
                className="ml-1 font-medium"
                style={{ color: colors.text }}
              >
                {selectedVenue.rating}
              </Text>
            </View>
            
            <TouchableOpacity
              className="px-4 py-2 rounded-full"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-white font-medium">
                Navigate
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

// Simple map overlay for AR mode
export const MapOverlay: React.FC<{
  venues: Venue[];
  selectedVenue?: Venue;
  onVenueSelect?: (venue: Venue) => void;
}> = ({ venues, selectedVenue, onVenueSelect }) => {
  const { colors } = useThemeSafe();

  return (
    <View className="absolute top-4 left-4 right-4">
      <View
        className="p-3 rounded-xl shadow-md"
        style={{ backgroundColor: colors.surface + 'E6' }}
      >
        <Text
          className="text-sm font-medium mb-2"
          style={{ color: colors.text }}
        >
          Nearby Venues
        </Text>
        
        {venues.slice(0, 3).map((venue) => (
          <TouchableOpacity
            key={venue.id}
            onPress={() => onVenueSelect?.(venue)}
            className="flex-row items-center py-2"
          >
            <View
              className="w-8 h-8 rounded-full mr-3 items-center justify-center"
              style={{ 
                backgroundColor: selectedVenue?.id === venue.id 
                  ? colors.primary 
                  : colors.primary + '20' 
              }}
            >
              <IconSymbol
                name="location"
                size={14}
                color={selectedVenue?.id === venue.id ? '#FFFFFF' : colors.primary}
              />
            </View>
            <View className="flex-1">
              <Text
                className="text-sm font-medium"
                style={{ color: colors.text }}
              >
                {venue.name}
              </Text>
              <Text
                className="text-xs"
                style={{ color: colors.textSecondary }}
              >
                {venue.location.city}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
