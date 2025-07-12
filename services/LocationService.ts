import * as Location from 'expo-location';
import { Alert } from 'react-native';
import { UserLocation } from '@/types/navigation';

class LocationService {
  private static instance: LocationService;
  private currentLocation: UserLocation | null = null;
  private watchSubscription: Location.LocationSubscription | null = null;
  private locationCallbacks: ((location: UserLocation) => void)[] = [];

  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  /**
   * Request user location with permission handling
   */
  public async requestUserLocation(): Promise<UserLocation | null> {
    try {
      // Request permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'Please enable location access to find nearby venues and provide navigation.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Location.requestForegroundPermissionsAsync() }
          ]
        );
        return null;
      }

      // Get current position
      const locationResult = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
      });

      // Reverse geocode to get address
      let address: string | undefined;
      try {
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: locationResult.coords.latitude,
          longitude: locationResult.coords.longitude,
        });
        
        if (reverseGeocode.length > 0) {
          const addr = reverseGeocode[0];
          address = `${addr.street || ''} ${addr.streetNumber || ''}, ${addr.city || ''}, ${addr.region || ''}`.trim();
        }
      } catch (geocodeError) {
        console.warn('Reverse geocoding failed:', geocodeError);
      }

      const userLocation: UserLocation = {
        latitude: locationResult.coords.latitude,
        longitude: locationResult.coords.longitude,
        accuracy: locationResult.coords.accuracy || undefined,
        address,
        timestamp: Date.now(),
      };

      this.currentLocation = userLocation;
      this.notifyLocationCallbacks(userLocation);

      return userLocation;
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(
        'Location Error',
        'Unable to get your current location. Please check your GPS settings and try again.',
        [{ text: 'OK' }]
      );
      return null;
    }
  }

  /**
   * Start watching location changes (for navigation)
   */
  public async startLocationTracking(): Promise<void> {
    if (this.watchSubscription) {
      return; // Already tracking
    }

    try {
      this.watchSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000, // Update every 2 seconds
          distanceInterval: 5, // Update when moved 5 meters
        },
        (locationUpdate) => {
          const userLocation: UserLocation = {
            latitude: locationUpdate.coords.latitude,
            longitude: locationUpdate.coords.longitude,
            accuracy: locationUpdate.coords.accuracy || undefined,
            timestamp: Date.now(),
          };

          this.currentLocation = userLocation;
          this.notifyLocationCallbacks(userLocation);
        }
      );
    } catch (error) {
      console.error('Error starting location tracking:', error);
    }
  }

  /**
   * Stop location tracking
   */
  public stopLocationTracking(): void {
    if (this.watchSubscription) {
      this.watchSubscription.remove();
      this.watchSubscription = null;
    }
  }

  /**
   * Get cached current location
   */
  public getCurrentLocation(): UserLocation | null {
    return this.currentLocation;
  }

  /**
   * Geocode an address to coordinates
   */
  public async geocodeAddress(address: string): Promise<UserLocation | null> {
    try {
      const geocodeResult = await Location.geocodeAsync(address);
      
      if (geocodeResult.length > 0) {
        const coords = geocodeResult[0];
        const userLocation: UserLocation = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          address: address,
          timestamp: Date.now(),
        };

        this.currentLocation = userLocation;
        return userLocation;
      }
      
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      Alert.alert(
        'Address Error',
        'Unable to find the specified address. Please check the spelling and try again.',
        [{ text: 'OK' }]
      );
      return null;
    }
  }

  /**
   * Calculate distance between two points in kilometers
   */
  public calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Subscribe to location updates
   */
  public onLocationUpdate(callback: (location: UserLocation) => void): () => void {
    this.locationCallbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.locationCallbacks = this.locationCallbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Check if user is within proximity of a venue (in meters)
   */
  public isWithinProximity(venueCoords: { latitude: number; longitude: number }, radiusMeters: number = 100): boolean {
    if (!this.currentLocation) return false;
    
    const distanceKm = this.calculateDistance(
      this.currentLocation.latitude,
      this.currentLocation.longitude,
      venueCoords.latitude,
      venueCoords.longitude
    );
    
    return (distanceKm * 1000) <= radiusMeters;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private notifyLocationCallbacks(location: UserLocation): void {
    this.locationCallbacks.forEach(callback => {
      try {
        callback(location);
      } catch (error) {
        console.error('Error in location callback:', error);
      }
    });
  }
}

export { LocationService };
export default LocationService;
