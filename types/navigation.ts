// /Users/derahmanyelo/Documents/LYNX Code Vault/NaviLynx-v04/types/navigation.ts

export interface Coordinates {
  x: number;
  y: number;
  level: number; // Floor level
}

export interface PointOfInterest {
  id: string;
  name: string;
  type: 'store' | 'restroom' | 'elevator' | 'escalator' | 'stairs' | 'exit' | 'info' | 'custom';
  coordinates: Coordinates;
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
