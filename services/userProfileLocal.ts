import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProfile {
  fullName: string;
  email: string;
  avatar?: string;
  preferences?: any;
}

const USER_PROFILE_PREFIX = '@navilynx_user_profile_';

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const profileData = await AsyncStorage.getItem(`${USER_PROFILE_PREFIX}${userId}`);
    return profileData ? JSON.parse(profileData) : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

export const saveUserProfile = async (userId: string, profile: Partial<UserProfile>): Promise<boolean> => {
  try {
    const existingProfile = await getUserProfile(userId);
    const updatedProfile = { ...existingProfile, ...profile };
    await AsyncStorage.setItem(`${USER_PROFILE_PREFIX}${userId}`, JSON.stringify(updatedProfile));
    return true;
  } catch (error) {
    console.error('Error saving user profile:', error);
    return false;
  }
};
