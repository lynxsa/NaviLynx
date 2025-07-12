// Local storage service for parking data (replaces Firebase)
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveParkingData(uid: string, parking: any) {
  try {
    await AsyncStorage.setItem(`parking_${uid}`, JSON.stringify(parking));
  } catch (error) {
    console.error('Error saving parking data:', error);
  }
}

export async function getParkingData(uid: string) {
  try {
    const data = await AsyncStorage.getItem(`parking_${uid}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading parking data:', error);
    return null;
  }
}

export async function updateParkingData(uid: string, updates: any) {
  try {
    const existing = await getParkingData(uid);
    const updated = { ...existing, ...updates };
    await saveParkingData(uid, updated);
  } catch (error) {
    console.error('Error updating parking data:', error);
  }
}

export async function addParkingHistory(uid: string, event: any) {
  try {
    const existing = await getParkingData(uid);
    const history = existing?.history || [];
    const updated = {
      ...existing,
      history: [...history, event]
    };
    await saveParkingData(uid, updated);
  } catch (error) {
    console.error('Error adding parking history:', error);
  }
}
