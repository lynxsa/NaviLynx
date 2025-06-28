export interface Coordinates {
  x: number;
  y: number;
  z?: number; // Optional: for 3D positioning if needed beyond level
  level: number;
}

export interface POI {
  id: string; // Assuming string IDs, adjust if numeric
  name: string;
  coordinates: Coordinates;
  type?: string; // e.g., 'store', 'restroom', 'gate', 'elevator_lobby'
  description?: string;
  // Add other POI-specific properties as needed
}

export interface RouteSegment {
  id: string; // Unique ID for the segment
  fromPOIId: string;
  toPOIId: string;
  distance: number; // meters
  instruction?: string; // Pre-generated instruction for this segment
  type: 'walk' | 'elevator' | 'escalator' | 'stairs' | 'travelator'; // Type of segment
  path?: Coordinates[]; // Optional detailed path for complex segments
  // Add other segment-specific properties as needed
}

export interface Route {
  id: string; // Unique ID for the route
  originPOIId: string;
  destinationPOIId: string;
  segments: RouteSegment[];
  totalDistance: number; // meters
  estimatedTime?: number; // minutes
  // Add other route-specific properties as needed
}
