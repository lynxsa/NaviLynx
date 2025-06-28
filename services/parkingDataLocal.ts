import AsyncStorage from '@react-native-async-storage/async-storage';

interface ParkingData {
  favoriteSpots: string[];
  recentParking: ParkingHistory[];
  preferences: {
    preferredDistance: number;
    preferredType: string;
  };
}

interface ParkingHistory {
  id: string;
  location: string;
  timestamp: number;
  duration?: number;
  cost?: number;
}

const PARKING_DATA_PREFIX = '@navilynx_parking_data_';

export const getParkingData = async (userId: string): Promise<ParkingData | null> => {
  try {
    const parkingData = await AsyncStorage.getItem(`${PARKING_DATA_PREFIX}${userId}`);
    return parkingData ? JSON.parse(parkingData) : {
      favoriteSpots: [],
      recentParking: [],
      preferences: {
        preferredDistance: 200,
        preferredType: 'covered'
      }
    };
  } catch (error) {
    console.error('Error getting parking data:', error);
    return {
      favoriteSpots: [],
      recentParking: [],
      preferences: {
        preferredDistance: 200,
        preferredType: 'covered'
      }
    };
  }
};

export const saveParkingData = async (userId: string, data: Partial<ParkingData>): Promise<boolean> => {
  try {
    const existingData = await getParkingData(userId);
    const updatedData = { ...existingData, ...data };
    await AsyncStorage.setItem(`${PARKING_DATA_PREFIX}${userId}`, JSON.stringify(updatedData));
    return true;
  } catch (error) {
    console.error('Error saving parking data:', error);
    return false;
  }
};

export const addParkingHistory = async (userId: string, historyItem: ParkingHistory): Promise<boolean> => {
  try {
    const existingData = await getParkingData(userId);
    if (!existingData) return false;
    
    const updatedData = {
      ...existingData,
      recentParking: [historyItem, ...existingData.recentParking].slice(0, 20) // Keep last 20 entries
    };
    
    await AsyncStorage.setItem(`${PARKING_DATA_PREFIX}${userId}`, JSON.stringify(updatedData));
    return true;
  } catch (error) {
    console.error('Error adding parking history:', error);
    return false;
  }
};
