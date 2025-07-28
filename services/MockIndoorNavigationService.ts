// Mock Indoor Navigation Service for Testing AR Navigation
export interface Waypoint {
  id: string;
  coordinates: { x: number; y: number; z: number };
  type: 'start' | 'end' | 'turn' | 'landmark';
  instruction?: string;
  distance?: number;
}

export interface ARWaypoint {
  id: string;
  position: { x: number; y: number; z: number };
  instruction: string;
  color: string;
  type: 'start' | 'end' | 'turn' | 'landmark';
}

export interface NavigationPath {
  waypoints: Waypoint[];
  totalDistance: number;
  estimatedTime: number; // in seconds
  currentWaypointIndex: number;
}

export class MockIndoorNavigationService {
  private currentPath: NavigationPath | null = null;
  private isNavigating = false;

  // Mock method to generate a simple navigation path
  generatePath(start: { x: number; y: number; z: number }, end: { x: number; y: number; z: number }): NavigationPath {
    const waypoints: Waypoint[] = [
      {
        id: 'start',
        coordinates: start,
        type: 'start',
        instruction: 'Start navigation',
        distance: 0
      },
      {
        id: 'midpoint',
        coordinates: {
          x: (start.x + end.x) / 2,
          y: (start.y + end.y) / 2,
          z: (start.z + end.z) / 2
        },
        type: 'turn',
        instruction: 'Continue straight',
        distance: Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)) / 2
      },
      {
        id: 'end',
        coordinates: end,
        type: 'end',
        instruction: 'You have arrived at your destination',
        distance: Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2))
      }
    ];

    const totalDistance = waypoints[waypoints.length - 1].distance || 0;
    
    return {
      waypoints,
      totalDistance,
      estimatedTime: totalDistance * 1.2, // Mock walking speed
      currentWaypointIndex: 0
    };
  }

  startNavigation(path: NavigationPath): void {
    this.currentPath = path;
    this.isNavigating = true;
  }

  stopNavigation(): void {
    this.currentPath = null;
    this.isNavigating = false;
  }

  getCurrentPath(): NavigationPath | null {
    return this.currentPath;
  }

  getNextWaypoint(): Waypoint | null {
    if (!this.currentPath || this.currentPath.currentWaypointIndex >= this.currentPath.waypoints.length) {
      return null;
    }
    return this.currentPath.waypoints[this.currentPath.currentWaypointIndex];
  }

  updateCurrentPosition(position: { x: number; y: number; z: number }): boolean {
    if (!this.currentPath) return false;

    const currentWaypoint = this.getNextWaypoint();
    if (!currentWaypoint) return false;

    // Simple distance check to see if we've reached the waypoint
    const distance = Math.sqrt(
      Math.pow(position.x - currentWaypoint.coordinates.x, 2) +
      Math.pow(position.y - currentWaypoint.coordinates.y, 2) +
      Math.pow(position.z - currentWaypoint.coordinates.z, 2)
    );

    // If within 2 units of the waypoint, consider it reached
    if (distance < 2) {
      this.currentPath.currentWaypointIndex++;
      return true; // Waypoint reached
    }

    return false;
  }

  isNavigationActive(): boolean {
    return this.isNavigating;
  }

  getRemainingDistance(): number {
    if (!this.currentPath) return 0;
    
    const remainingWaypoints = this.currentPath.waypoints.slice(this.currentPath.currentWaypointIndex);
    return remainingWaypoints.reduce((total, waypoint) => total + (waypoint.distance || 0), 0);
  }

  getProgress(): number {
    if (!this.currentPath) return 0;
    return this.currentPath.currentWaypointIndex / this.currentPath.waypoints.length;
  }

  generateARWaypoints(): ARWaypoint[] {
    if (!this.currentPath) return [];
    
    return this.currentPath.waypoints.map((waypoint, index) => ({
      id: waypoint.id,
      position: waypoint.coordinates,
      instruction: waypoint.instruction || 'Continue',
      color: index === this.currentPath!.currentWaypointIndex ? '#007AFF' : '#34C759',
      type: waypoint.type
    }));
  }
}

export default new MockIndoorNavigationService();
