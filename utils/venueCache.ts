import AsyncStorage from '@react-native-async-storage/async-storage';
import { venues as staticVenues } from '../data/venues';

const VENUE_CACHE_KEY = 'venue_cache';

export async function cacheVenues(venues: any[]) {
  try {
    await AsyncStorage.setItem(VENUE_CACHE_KEY, JSON.stringify(venues));
  } catch (e) {
    // Ignore cache errors
  }
}

export async function getCachedVenues(): Promise<any[] | null> {
  try {
    const data = await AsyncStorage.getItem(VENUE_CACHE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    // Ignore cache errors
  }
  return null;
}

export async function getVenuesWithCache(): Promise<any[]> {
  // In a real app, fetch from API here. For now, use static data.
  try {
    // Simulate network fetch
    await cacheVenues(staticVenues);
    return staticVenues;
  } catch (e) {
    const cached = await getCachedVenues();
    return cached || staticVenues;
  }
}
