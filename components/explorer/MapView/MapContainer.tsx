import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, Dimensions, Animated } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { getVenuesWithCache } from '../../../utils/venueCache';
import GlassCard from '../../ui/GlassCard';

export default function MapContainer({ filter = 'All', onMarkerPress }: { filter?: string; onMarkerPress?: (id: string) => void }) {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [venues, setVenues] = useState<any[]>([]);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Location permission denied. Showing default map region.');
        } else {
          const loc = await Location.getCurrentPositionAsync({});
          setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
        }
      } catch (e) {
        setError('Could not get your location. Showing default map region.');
      }
      // Load venues (with offline cache)
      try {
        const loadedVenues = await getVenuesWithCache();
        setVenues(loadedVenues);
      } catch (e) {
        setError('Could not load venues.');
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!loading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [loading]);

  const filtered = filter === 'All' ? venues : venues.filter(v => v.type === filter);

  const initialRegion = location
    ? { latitude: location.latitude, longitude: location.longitude, latitudeDelta: 0.1, longitudeDelta: 0.1 }
    : { latitude: -28.4793, longitude: 24.6727, latitudeDelta: 10, longitudeDelta: 10 };

  const screenHeight = Dimensions.get('window').height;
  const mapHeight = Math.max(220, Math.min(400, screenHeight * 0.35));

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 32 }} />
      ) : (
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <MapView
            style={[styles.map, { height: mapHeight }]}
            provider={PROVIDER_GOOGLE}
            initialRegion={initialRegion}
            showsUserLocation={!!location}
          >
            {filtered.map(v => (
              <Marker
                key={v.id}
                coordinate={{ latitude: v.coordinates.lat, longitude: v.coordinates.lng }}
                title={v.name}
                description={v.description}
                onPress={() => onMarkerPress && onMarkerPress(v.id)}
              />
            ))}
          </MapView>
        </Animated.View>
      )}
      {error && (
        <GlassCard
          style={{ position: 'absolute', bottom: 24, left: 24, right: 24, alignItems: 'center', backgroundColor: 'rgba(255,0,0,0.12)' }}
          accessible accessibilityRole="alert" accessibilityLabel={error}
        >
          <Text style={styles.error}>{error}</Text>
        </GlassCard>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, borderRadius: 16, backgroundColor: '#d0f0c0', margin: 12, overflow: 'hidden' },
  map: { flex: 1, width: '100%', borderRadius: 16 },
  error: { color: '#F44336', margin: 12, textAlign: 'center' },
});
