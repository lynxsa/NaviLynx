// Navigation types for NaviLynx

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface UserLocation extends Coordinates {
  accuracy?: number;
  address?: string;
  timestamp: number;
}

export interface IndoorCoordinates {
  x: number;
  y: number;
  level: number; // Floor level
}

export interface PointOfInterest {
  id: string;
  name: string;
  type: 'store' | 'restroom' | 'elevator' | 'escalator' | 'stairs' | 'exit' | 'info' | 'custom';
  coordinates: Coordinates | IndoorCoordinates;
  description?: string;
  tags?: string[];
  storeDetails?: { // Optional: if POI is a store
    category?: string;
    logoUrl?: string;
    promotions?: string[];
  };
}

export interface PathSegment {
  id?: string; // Optional unique identifier for the path segment
  fromPOIId: string;
  toPOIId: string;
  distance: number; // in meters
  type: 'walkway' | 'elevator' | 'escalator' | 'stairs';
  isAccessible?: boolean; // Wheelchair accessible
  durationEstimate?: number; // in seconds
}

export interface MallFloor {
  level: number;
  name: string; // e.g., "Ground Floor", "Level 1"
  mapImageUrl?: string; // URL to the floor map image
  pois: PointOfInterest[];
  paths: PathSegment[];
}

export interface MallLayout {
  id: string;
  name: string;
  floors: MallFloor[];
}

export interface Route {
  id: string;
  originPOIId: string;
  destinationPOIId: string;
  segments: PathSegment[];
  totalDistance: number; // in meters
  estimatedDuration: number; // in seconds
  isAccessible: boolean;
  preferenceType: 'shortest' | 'accessible' | 'least_crowded';
  instructions?: string[]; // Turn-by-turn text instructions
}

export interface NavigationUserPreferences {
  preferAccessibleRoutes: boolean;
  avoidStairs: boolean;
  avoidEscalators: boolean;
  preferredMode?: 'shortest' | 'least_crowded'; // Future use for AI
}

// AR Navigation Extensions
export interface ARUserLocation {
  latitude: number;
  longitude: number;
  address?: string;
  accuracy?: number;
  timestamp: number;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  category: string;
  hasIndoorNavigation: boolean;
  indoorMapUrl?: string;
  amenities?: string[];
  mallLayout?: MallLayout; // Link to existing mall layout if applicable
}

export interface NavigationRoute {
  startLocation: UserLocation;
  destination: Venue;
  waypoints: RouteWaypoint[];
  distance: number; // in meters
  duration: number; // in seconds
  polyline: string; // encoded polyline from Google Maps
}

export interface RouteWaypoint {
  latitude: number;
  longitude: number;
  instruction: string;
  distance: number;
  maneuver: 'straight' | 'left' | 'right' | 'slight-left' | 'slight-right' | 'sharp-left' | 'sharp-right';
}

export type NavigationPhase = 
  | 'initializing'
  | 'location_detection'
  | 'venue_selection'
  | 'route_planning'
  | 'outdoor_navigation'
  | 'indoor_navigation'
  | 'arrived';

export type ViewMode = 'ar' | 'map';

export interface NavigationState {
  phase: NavigationPhase;
  viewMode: ViewMode;
  userLocation: UserLocation | null;
  selectedVenue: Venue | null;
  currentRoute: NavigationRoute | null;
  isIndoorMode: boolean;
  nearbyVenues: Venue[];
}

export interface ARCapabilities {
  isARSupported: boolean;
  hasARCore: boolean; // Android
  hasARKit: boolean; // iOS
  supportsPlaneDetection: boolean;
  supportsLightEstimation: boolean;
}
