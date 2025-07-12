export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  homeLocation: string;
  shoppingInterests: string[];
  frequentVenues: string[];
  createdAt: string;
  stats: {
    visitedVenues: number;
    savedParking: number;
    navigationSessions: number;
  };
}

export interface AuthResult {
  success: boolean;
  user?: UserProfile;
  error?: string;
}

// Mock user storage - in real app this would be connected to backend
let currentUser: UserProfile | null = null;
const mockUsers: UserProfile[] = [];

export const signUp = async (userData: {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  homeLocation: string;
  shoppingInterests: string[];
  frequentVenues: string[];
}): Promise<AuthResult> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Check if user already exists
    const existingUser = mockUsers.find(user => user.email === userData.email);
    if (existingUser) {
      return {
        success: false,
        error: 'User with this email already exists'
      };
    }

    // Create new user
    const newUser: UserProfile = {
      id: Date.now().toString(),
      fullName: userData.fullName,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      dateOfBirth: userData.dateOfBirth,
      gender: userData.gender,
      homeLocation: userData.homeLocation,
      shoppingInterests: userData.shoppingInterests,
      frequentVenues: userData.frequentVenues,
      createdAt: new Date().toISOString(),
      stats: {
        visitedVenues: 0,
        savedParking: 0,
        navigationSessions: 0
      }
    };

    mockUsers.push(newUser);
    currentUser = newUser;

    return {
      success: true,
      user: newUser
    };
  } catch (error) {
    return {
      success: false,
      error: 'Registration failed. Please try again.'
    };
  }
};

export const signIn = async (email: string, password: string): Promise<AuthResult> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = mockUsers.find(user => user.email === email);
    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    // In real app, verify password hash
    currentUser = user;

    return {
      success: true,
      user: user
    };
  } catch (error) {
    return {
      success: false,
      error: 'Sign in failed. Please try again.'
    };
  }
};

export const signOut = async (): Promise<void> => {
  currentUser = null;
};

export const getCurrentUser = (): UserProfile | null => {
  return currentUser;
};

export const updateUserProfile = async (updates: Partial<UserProfile>): Promise<AuthResult> => {
  try {
    if (!currentUser) {
      return {
        success: false,
        error: 'No user logged in'
      };
    }

    // Update current user
    currentUser = { ...currentUser, ...updates };

    // Update in mock storage
    const userIndex = mockUsers.findIndex(user => user.id === currentUser?.id);
    if (userIndex !== -1) {
      mockUsers[userIndex] = currentUser;
    }

    return {
      success: true,
      user: currentUser
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to update profile'
    };
  }
};

export const updateUser = async (updates: Partial<UserProfile>): Promise<AuthResult> => {
  try {
    if (!currentUser) {
      return {
        success: false,
        error: 'No user is currently logged in'
      };
    }

    // Update the current user
    currentUser = {
      ...currentUser,
      ...updates
    };

    // Update the user in the mock storage
    const userIndex = mockUsers.findIndex(user => user.id === currentUser!.id);
    if (userIndex !== -1) {
      mockUsers[userIndex] = currentUser;
    }

    return {
      success: true,
      user: currentUser
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update user'
    };
  }
};

export const getPersonalizedRecommendations = (): string[] => {
  if (!currentUser) return [];

  const { shoppingInterests, dateOfBirth } = currentUser;
  const recommendations: string[] = [];

  // Age-based recommendations
  const birthYear = new Date(dateOfBirth).getFullYear();
  const age = new Date().getFullYear() - birthYear;

  if (age >= 18 && age <= 25) {
    recommendations.push('Trending fashion stores for young adults');
    recommendations.push('Tech and gadget stores');
  } else if (age >= 26 && age <= 40) {
    recommendations.push('Professional clothing and accessories');
    recommendations.push('Home and lifestyle stores');
  } else if (age > 40) {
    recommendations.push('Premium shopping experiences');
    recommendations.push('Health and wellness stores');
  }

  // Interest-based recommendations
  if (shoppingInterests.includes('Fashion')) {
    recommendations.push('Latest fashion collections available');
  }
  if (shoppingInterests.includes('Electronics')) {
    recommendations.push('New tech releases and deals');
  }
  if (shoppingInterests.includes('Food & Dining')) {
    recommendations.push('Popular restaurants and food courts');
  }

  return recommendations.slice(0, 3); // Return top 3
};

export const incrementUserStat = (statType: keyof UserProfile['stats']): void => {
  if (currentUser) {
    currentUser.stats[statType]++;
  }
};
