import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = 'hasOnboarded';
const USER_SIGNUP_KEY = 'isNewSignup';

export async function hasCompletedOnboarding(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_KEY);
    return value === 'true';
  } catch {
    return false;
  }
}

export async function setOnboardingComplete(): Promise<void> {
  await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
  await AsyncStorage.removeItem(USER_SIGNUP_KEY); // Clear signup flag
}

export async function isNewSignup(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(USER_SIGNUP_KEY);
    return value === 'true';
  } catch {
    return false;
  }
}

export async function setNewSignupFlag(): Promise<void> {
  await AsyncStorage.setItem(USER_SIGNUP_KEY, 'true');
}

export async function clearNewSignupFlag(): Promise<void> {
  await AsyncStorage.removeItem(USER_SIGNUP_KEY);
}
