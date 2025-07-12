import { NavigationState, NavigationPhase, ViewMode, UserLocation, NavigationRoute, RouteWaypoint } from '@/types/navigation';
import LocationService from './LocationService';
import { southAfricanVenues, Venue } from '@/data/southAfricanVenues';

interface NavigationCallbacks {
  onStateChange?: (state: NavigationState) => void;
  onPhaseChange?: (phase: NavigationPhase) => void;
  onRouteUpdate?: (route: NavigationRoute) => void;
  onArrival?: (venue: Venue) => void;
}

// Adapter to convert southAfricanVenues.Venue to navigation.Venue
function adaptVenueForNavigation(venue: Venue): import('@/types/navigation').Venue {
  return {
    id: venue.id,
    name: venue.name,
    address: `${venue.location.city}, ${venue.location.province}`,
    coordinates: venue.location.coordinates,
    category: venue.type,
    hasIndoorNavigation: venue.levels !== undefined && venue.levels > 1,
    indoorMapUrl: undefined,
    amenities: venue.features,
  };
}

class NavigationController {
  private static instance: NavigationController;
  private state: NavigationState;
  private callbacks: NavigationCallbacks = {};
  private proximityCheckInterval: NodeJS.Timeout | null = null;
  private locationService: LocationService;

  private constructor() {
    this.locationService = LocationService.getInstance();
    
    this.state = {
      phase: 'initializing',
      viewMode: 'ar',
      userLocation: null,
      selectedVenue: null,
      currentRoute: null,
      isIndoorMode: false,
      nearbyVenues: [],
    };

    // Subscribe to location updates if method exists
    if (typeof this.locationService.onLocationUpdate === 'function') {
      this.locationService.onLocationUpdate(this.handleLocationUpdate.bind(this));
    }
  }

  public static getInstance(): NavigationController {
    if (!NavigationController.instance) {
      NavigationController.instance = new NavigationController();
    }
    return NavigationController.instance;
  }

  /**
   * Initialize the navigation system
   */
  public async initialize(): Promise<void> {
    this.setState({ phase: 'location_detection' });
    
    // Request user location
    const location = await this.locationService.requestUserLocation();
    
    if (location) {
      this.setState({ 
        userLocation: location,
        phase: 'venue_selection'
      });
      
      // Find nearby venues
      await this.findNearbyVenues(location);
    }
  }

  /**
   * Set navigation callbacks
   */
  public setCallbacks(callbacks: NavigationCallbacks): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  /**
   * Get current navigation state
   */
  public getState(): NavigationState {
    return { ...this.state };
  }

  /**
   * Select a venue for navigation
   */
  public async selectVenue(venue: Venue): Promise<void> {
    if (!this.state.userLocation) {
      throw new Error('User location not available');
    }

    const adaptedVenue = adaptVenueForNavigation(venue);
    this.setState({
      selectedVenue: adaptedVenue,
      phase: 'route_planning'
    });

    // Plan the route
    const route = await this.planRoute(this.state.userLocation, adaptedVenue);
    
    if (route) {
      this.setState({
        currentRoute: route,
        phase: 'outdoor_navigation'
      });

      // Start location tracking for navigation
      await this.locationService.startLocationTracking();
      this.startProximityChecking();

      this.callbacks.onRouteUpdate?.(route);
    }
  }

  /**
   * Toggle between AR and Map view modes
   */
  public toggleViewMode(): void {
    const newViewMode: ViewMode = this.state.viewMode === 'ar' ? 'map' : 'ar';
    this.setState({ viewMode: newViewMode });
  }

  /**
   * Switch to indoor navigation mode
   */
  public switchToIndoorMode(): void {
    if (!this.state.selectedVenue?.hasIndoorNavigation) {
      console.warn('Selected venue does not support indoor navigation');
      return;
    }

    this.setState({
      isIndoorMode: true,
      phase: 'indoor_navigation'
    });

    // Stop outdoor proximity checking
    this.stopProximityChecking();
  }

  /**
   * Switch back to outdoor navigation mode
   */
  public switchToOutdoorMode(): void {
    this.setState({
      isIndoorMode: false,
      phase: 'outdoor_navigation'
    });

    // Resume proximity checking
    this.startProximityChecking();
  }

  /**
   * Reset navigation state
   */
  public reset(): void {
    this.setState({
      phase: 'location_detection',
      selectedVenue: null,
      currentRoute: null,
      isIndoorMode: false,
      nearbyVenues: [],
    });

    this.locationService.stopLocationTracking();
    this.stopProximityChecking();
  }

  /**
   * Handle manual address input
   */
  public async setManualLocation(address: string): Promise<boolean> {
    const location = await this.locationService.geocodeAddress(address);
    
    if (location) {
      this.setState({
        userLocation: location,
        phase: 'venue_selection'
      });
      
      await this.findNearbyVenues(location);
      return true;
    }
    
    return false;
  }

  private async findNearbyVenues(location: UserLocation): Promise<void> {
    // Calculate distances to all venues
    const venuesWithDistance = southAfricanVenues.map(venue => ({
      venue,
      distance: this.locationService.calculateDistance(
        location.latitude,
        location.longitude,
        venue.location.coordinates.latitude,
        venue.location.coordinates.longitude
      )
    }));

    // Filter venues within 50km and sort by distance
    const nearbyVenues = venuesWithDistance
      .filter(item => item.distance <= 50)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 20) // Limit to top 20
      .map(item => adaptVenueForNavigation(item.venue));

    this.setState({ nearbyVenues });
  }

  private async planRoute(from: UserLocation, to: import('@/types/navigation').Venue): Promise<NavigationRoute | null> {
    try {
      // In a real implementation, this would call Google Maps Directions API
      // For now, we'll create a mock route
      const distance = this.locationService.calculateDistance(
        from.latitude,
        from.longitude,
        to.coordinates.latitude,
        to.coordinates.longitude
      );

      const mockWaypoints: RouteWaypoint[] = [
        {
          latitude: from.latitude,
          longitude: from.longitude,
          instruction: 'Starting from your location',
          distance: 0,
          maneuver: 'straight'
        },
        {
          latitude: to.coordinates.latitude,
          longitude: to.coordinates.longitude,
          instruction: `Arrive at ${to.name}`,
          distance: distance * 1000, // Convert to meters
          maneuver: 'straight'
        }
      ];

      const route: NavigationRoute = {
        startLocation: from,
        destination: to,
        waypoints: mockWaypoints,
        distance: distance * 1000, // meters
        duration: Math.round(distance * 60), // rough estimate: 1km per minute
        polyline: '', // Would be provided by Google Maps API
      };

      return route;
    } catch (error) {
      console.error('Route planning error:', error);
      return null;
    }
  }

  private handleLocationUpdate(location: UserLocation): void {
    this.setState({ userLocation: location });
  }

  private startProximityChecking(): void {
    if (this.proximityCheckInterval) return;

    this.proximityCheckInterval = setInterval(() => {
      if (this.state.selectedVenue && this.state.userLocation) {
        const isNear = this.locationService.isWithinProximity(
          this.state.selectedVenue.coordinates,
          100 // 100 meters
        );

        if (isNear) {
          this.handleArrival();
        }
      }
    }, 5000) as any; // Check every 5 seconds
  }

  private stopProximityChecking(): void {
    if (this.proximityCheckInterval) {
      clearInterval(this.proximityCheckInterval as any);
      this.proximityCheckInterval = null;
    }
  }

  private handleArrival(): void {
    if (!this.state.selectedVenue) return;

    this.setState({ phase: 'arrived' });
    
    // Convert back to original venue format for callback
    // In a real app, you'd store the original venue reference
    this.callbacks.onArrival?.(this.state.selectedVenue as any);

    // If venue supports indoor navigation, suggest switching
    if (this.state.selectedVenue.hasIndoorNavigation) {
      // This could trigger a modal or notification
      // For now, we'll auto-switch after a delay
      setTimeout(() => {
        this.switchToIndoorMode();
      }, 2000);
    }
  }

  private setState(newState: Partial<NavigationState>): void {
    const previousPhase = this.state.phase;
    this.state = { ...this.state, ...newState };
    
    this.callbacks.onStateChange?.(this.state);
    
    if (newState.phase && newState.phase !== previousPhase) {
      this.callbacks.onPhaseChange?.(newState.phase);
    }
  }
}

export default NavigationController.getInstance();
