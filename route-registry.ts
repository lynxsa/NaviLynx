// This file helps with static analysis for Expo Router
// Import all route components to ensure they're registered

// Root routes
import RootLayout from './app/_layout';
import AuthScreen from './app/auth';
import NotFoundScreen from './app/+not-found';

// Tab routes
import TabLayout from './app/(tabs)/_layout';
import HomeScreen from './app/(tabs)/index';
import ExploreScreen from './app/(tabs)/explore';
import ARNavigatorScreen from './app/(tabs)/ar-navigator';
import ParkingScreen from './app/(tabs)/parking';
import ProfileScreen from './app/(tabs)/profile';

// Dynamic routes
import VenueScreen from './app/venue/[id]';
import ChatScreen from './app/chat/[venueId]';

console.log('✓ All route components registered');

export {
  RootLayout,
  AuthScreen,
  NotFoundScreen,
  TabLayout,
  HomeScreen,
  ExploreScreen,
  ARNavigatorScreen,
  ParkingScreen,
  ProfileScreen,
  VenueScreen,
  ChatScreen,
};
