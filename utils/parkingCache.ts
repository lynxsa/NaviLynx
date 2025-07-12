import AsyncStorage from '@react-native-async-storage/async-storage';

const PARKING_CACHE_KEY = 'parking_data_cache';

export async function cacheParkingData(parkingData: any[]) {
  try {
    await AsyncStorage.setItem(PARKING_CACHE_KEY, JSON.stringify(parkingData));
  } catch (e) {
    // Ignore cache errors
  }
}

export async function getCachedParkingData(): Promise<any[] | null> {
  try {
    const data = await AsyncStorage.getItem(PARKING_CACHE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    // Ignore cache errors
  }
  return null;
}

export async function getParkingDataWithCache(fetchParkingData: () => Promise<any[]>): Promise<any[]> {
  try {
    const parkingData = await fetchParkingData();
    await cacheParkingData(parkingData);
    return parkingData;
  } catch (e) {
    const cached = await getCachedParkingData();
    return cached || [];
  }
}
