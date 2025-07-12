import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setNewSignupFlag } from '@/utils/onboarding';

// Simple user interface for our custom auth
interface CustomUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: CustomUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, name: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for testing (in production, this would be a real API)
const DEMO_USERS = [
  { id: '1', email: 'demo@navilynx.com', password: 'demo123', name: 'Demo User' },
  { id: '2', email: 'test@example.com', password: 'test123', name: 'Test User' },
  { id: '3', email: 'user@navilynx.com', password: 'password', name: 'NaviLynx User' },
];

const AUTH_STORAGE_KEY = '@navilynx_auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from storage on app start
  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check demo users
      const demoUser = DEMO_USERS.find(u => u.email === email && u.password === password);
      
      if (demoUser) {
        const user: CustomUser = {
          id: demoUser.id,
          email: demoUser.email,
          name: demoUser.name,
          avatar: `https://api.dicebear.com/7.x/avataaars/png?seed=${demoUser.email}`
        };
        
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        setUser(user);
        setLoading(false);
        return true;
      }
      
      setLoading(false);
      return false;
    } catch (error) {
      console.error('Sign in error:', error);
      setLoading(false);
      return false;
    }
  };

  const signUp = async (email: string, password: string, name: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const existingUser = DEMO_USERS.find(u => u.email === email);
      if (existingUser) {
        setLoading(false);
        return false; // User already exists
      }
      
      // Create new user
      const newUser: CustomUser = {
        id: Date.now().toString(),
        email,
        name,
        avatar: `https://api.dicebear.com/7.x/avataaars/png?seed=${email}`
      };
      
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
      await setNewSignupFlag(); // Mark as new signup for onboarding
      setUser(newUser);
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Sign up error:', error);
      setLoading(false);
      return false;
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Safe version that doesn't throw
export function useAuthSafe() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    return {
      user: null,
      loading: false,
      signIn: async () => false,
      signUp: async () => false,
      signOut: async () => {},
      isAuthenticated: false,
    };
  }
  return context;
}
