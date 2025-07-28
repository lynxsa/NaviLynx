import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

const STORAGE_KEY = 'saved_venues';

type SavedVenuesContextType = {
  savedVenues: Set<string>;
  toggleVenue: (id: string) => void;
  isSaved: (id: string) => boolean;
};

const SavedVenuesContext = createContext<SavedVenuesContextType | undefined>(undefined);

export const SavedVenuesProvider = ({ children }: { children: ReactNode }) => {
  const [savedVenues, setSavedVenues] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  // Load saved venues from AsyncStorage on mount or user change
  useEffect(() => {
    const load = async () => {
      if (user) {
        const userStorageKey = `${STORAGE_KEY}_${user.id}`;
        const data = await AsyncStorage.getItem(userStorageKey);
        setSavedVenues(data ? new Set(JSON.parse(data)) : new Set());
      } else {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        setSavedVenues(data ? new Set(JSON.parse(data)) : new Set());
      }
    };
    load();
  }, [user]);

  // Save to AsyncStorage whenever savedVenues changes
  useEffect(() => {
    const save = async () => {
      const storageKey = user ? `${STORAGE_KEY}_${user.id}` : STORAGE_KEY;
      await AsyncStorage.setItem(storageKey, JSON.stringify(Array.from(savedVenues)));
    };
    save();
  }, [savedVenues, user]);

  const toggleVenue = (id: string) => {
    setSavedVenues((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isSaved = (id: string) => savedVenues.has(id);

  return (
    <SavedVenuesContext.Provider value={{ savedVenues, toggleVenue, isSaved }}>
      {children}
    </SavedVenuesContext.Provider>
  );
};

export const useSavedVenues = () => {
  const ctx = useContext(SavedVenuesContext);
  if (!ctx) throw new Error('useSavedVenues must be used within a SavedVenuesProvider');
  return ctx;
};

// Add default export
export default SavedVenuesProvider;
