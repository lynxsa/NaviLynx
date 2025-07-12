import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_CACHE_KEY = 'user_profile_cache';

export async function cacheUserProfile(profile: any) {
  try {
    await AsyncStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(profile));
  } catch (e) {
    // Ignore cache errors
  }
}

export async function getCachedUserProfile(): Promise<any | null> {
  try {
    const data = await AsyncStorage.getItem(PROFILE_CACHE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    // Ignore cache errors
  }
  return null;
}

export async function getUserProfileWithCache(fetchUserProfile: () => Promise<any>): Promise<any> {
  try {
    const profile = await fetchUserProfile();
    await cacheUserProfile(profile);
    return profile;
  } catch (e) {
    const cached = await getCachedUserProfile();
    return cached || null;
  }
}
