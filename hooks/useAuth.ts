import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  fullName: string;
  email: string;
  username: string;
  address: string;
  avatar?: string;
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    notifications: boolean;
  };
  visitHistory: VisitHistoryItem[];
  favorites: string[];
  createdAt: string;
}

export interface VisitHistoryItem {
  id: string;
  venueId: string;
  venueName: string;
  visitDate: string;
  duration: number; // in minutes
  activities: string[];
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const DUMMY_USERS: User[] = [
  {
    id: '1',
    fullName: 'Derah Manyelo',
    email: 'derah.manyelo@navilynx.com',
    username: 'derah123',
    address: 'Linden Street, Sandown, Sandton, Johannesburg 2196',
    avatar: 'https://picsum.photos/200/200?random=1',
    preferences: {
      theme: 'auto',
      language: 'en',
      notifications: true,
    },
    visitHistory: [
      {
        id: '1',
        venueId: '1',
        venueName: 'Sandton City',
        visitDate: '2025-06-10T14:30:00Z',
        duration: 120,
        activities: ['Shopping', 'Dining', 'Entertainment'],
      },
      {
        id: '2',
        venueId: '2',
        venueName: 'Gateway Theatre of Shopping',
        visitDate: '2025-06-08T16:45:00Z',
        duration: 180,
        activities: ['Shopping', 'Movies', 'Dining'],
      },
    ],
    favorites: ['1', '2', '4'],
    createdAt: '2025-01-15T10:00:00Z',
  },
  {
    id: '2',
    fullName: 'John Smith',
    email: 'john.smith@example.com',
    username: 'johnsmith',
    address: '123 Main Street, Cape Town',
    preferences: {
      theme: 'light',
      language: 'en',
      notifications: false,
    },
    visitHistory: [],
    favorites: [],
    createdAt: '2025-02-01T08:00:00Z',
  },
];

const AUTH_STORAGE_KEY = '@navilynx_auth';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Load user from storage on app start
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedAuth = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (storedAuth) {
        const user = JSON.parse(storedAuth);
        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Error loading auth:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const login = useCallback(async (username: string, password: string): Promise<{
    success: boolean;
    user?: User;
    error?: string;
  }> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find user by username
      const user = DUMMY_USERS.find(u => u.username === username);
      
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      // In a real app, you'd verify the password
      // For demo, accept any password for existing users
      if (!password || password.length < 3) {
        return { success: false, error: 'Password must be at least 3 characters' };
      }

      // Store auth state
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      
      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
      });

      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  }, []);

  const signup = useCallback(async (userData: {
    fullName: string;
    email: string;
    username: string;
    password: string;
    address?: string;
  }): Promise<{
    success: boolean;
    user?: User;
    error?: string;
  }> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if username already exists
      if (DUMMY_USERS.some(u => u.username === userData.username)) {
        return { success: false, error: 'Username already exists' };
      }

      // Create new user
      const newUser: User = {
        id: String(Date.now()),
        fullName: userData.fullName,
        email: userData.email,
        username: userData.username,
        address: userData.address || '',
        preferences: {
          theme: 'auto',
          language: 'en',
          notifications: true,
        },
        visitHistory: [],
        favorites: [],
        createdAt: new Date().toISOString(),
      };

      // Add to dummy users (in real app, this would be API call)
      DUMMY_USERS.push(newUser);

      // Store auth state
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
      
      setAuthState({
        user: newUser,
        isLoading: false,
        isAuthenticated: true,
      });

      return { success: true, user: newUser };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  const updateUser = useCallback(async (updates: Partial<User>) => {
    if (!authState.user) return;

    try {
      const updatedUser = { ...authState.user, ...updates };
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
      
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }));
    } catch (error) {
      console.error('Update user error:', error);
    }
  }, [authState.user]);

  const addToFavorites = useCallback(async (venueId: string) => {
    if (!authState.user) return;

    const favorites = [...authState.user.favorites];
    if (!favorites.includes(venueId)) {
      favorites.push(venueId);
      await updateUser({ favorites });
    }
  }, [authState.user, updateUser]);

  const removeFromFavorites = useCallback(async (venueId: string) => {
    if (!authState.user) return;

    const favorites = authState.user.favorites.filter(id => id !== venueId);
    await updateUser({ favorites });
  }, [authState.user, updateUser]);

  const addVisit = useCallback(async (visit: Omit<VisitHistoryItem, 'id'>) => {
    if (!authState.user) return;

    const visitHistory = [...authState.user.visitHistory];
    const newVisit: VisitHistoryItem = {
      ...visit,
      id: String(Date.now()),
    };
    visitHistory.unshift(newVisit); // Add to beginning
    
    // Keep only last 50 visits
    if (visitHistory.length > 50) {
      visitHistory.splice(50);
    }

    await updateUser({ visitHistory });
  }, [authState.user, updateUser]);

  return {
    ...authState,
    login,
    signup,
    logout,
    updateUser,
    addToFavorites,
    removeFromFavorites,
    addVisit,
  };
}
