/**
 * NavigationService - Handles route calculation and navigation logic
 * Integrates with Google Directions API and provides turn-by-turn navigation
 */

import { Client } from '@googlemaps/google-maps-services-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VoiceNavigationService from './VoiceNavigationService';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface RouteOptions {
  mode: 'driving' | 'walking' | 'transit' | 'bicycling';
  avoidTolls?: boolean;
  avoidHighways?: boolean;
  avoidFerries?: boolean;
  optimize?: boolean;
  language?: string;
  region?: string;
}

export interface NavigationAlert {
  id: string;
  type: 'speed_camera' | 'accident' | 'construction' | 'traffic' | 'police';
  location: Coordinates;
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: number;
}

export interface RouteStep {
  id: string;
  coords: Coordinates;
  instruction: string;
  distance: string;
  duration: string;
  maneuver?: string;
  polyline?: string;
  nextTurn?: string;
  streetName?: string;
  speedLimit?: number;
  trafficCondition?: 'unknown' | 'free_flow' | 'slow' | 'congested' | 'severe_congestion';
}

export interface NavigationRoute {
  id: string;
  origin: Coordinates;
  destination: Coordinates;
  steps: RouteStep[];
  totalDistance: string;
  totalDuration: string;
  polyline: string;
  bounds: {
    northeast: Coordinates;
    southwest: Coordinates;
  };
}

export interface NavigationProgress {
  currentStepIndex: number;
  distanceToNextTurn: number;
  distanceToDestination: number;
  routeProgress: number; // Progress as percentage (0-1)
  estimatedTimeRemaining: string;
  currentInstruction: string;
  isOffRoute: boolean;
}

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '';
const OFFLINE_ROUTES_KEY = 'navilynx_offline_routes';

class NavigationService {
  private static instance: NavigationService;
  private client: Client;
  private currentRoute: NavigationRoute | null = null;
  private currentProgress: NavigationProgress | null = null;
  private navigationCallbacks: ((progress: NavigationProgress) => void)[] = [];
  private voiceService: VoiceNavigationService;
  private routeMonitoring: boolean = false;
  private offRouteThreshold: number = 50; // meters
  private lastKnownLocation: Coordinates | null = null;
  private navigationAlerts: NavigationAlert[] = [];

  private constructor() {
    this.client = new Client({});
    this.voiceService = VoiceNavigationService.getInstance();
  }

  public static getInstance(): NavigationService {
    if (!NavigationService.instance) {
      NavigationService.instance = new NavigationService();
    }
    return NavigationService.instance;
  }

  /**
   * Calculate route between origin and destination
   */
  public async calculateRoute(
    origin: Coordinates,
    destination: Coordinates,
    options: RouteOptions = { mode: 'walking' }
  ): Promise<NavigationRoute | null> {
    try {
      // Check for offline route first
      const offlineRoute = await this.getOfflineRoute(origin, destination);
      if (offlineRoute) {
        console.log('Using offline route');
        return offlineRoute;
      }

      if (!GOOGLE_MAPS_API_KEY) {
        console.warn('Google Maps API key not configured, using mock route');
        return this.generateMockRoute(origin, destination);
      }

      // Prepare request parameters
      const params: any = {
        origin: `${origin.latitude},${origin.longitude}`,
        destination: `${destination.latitude},${destination.longitude}`,
        mode: options.mode,
        key: GOOGLE_MAPS_API_KEY,
        alternatives: false,
        units: 'metric' as any,
        language: options.language || 'en',
        region: options.region || 'ZA', // South Africa
      };

      // Add avoidance options
      const avoid = [];
      if (options.avoidTolls) avoid.push('tolls');
      if (options.avoidHighways) avoid.push('highways');
      if (options.avoidFerries) avoid.push('ferries');
      if (avoid.length > 0) {
        params.avoid = avoid;
      }

      const response = await this.client.directions({
        params,
      });

      if (response.data.status === 'OK' && response.data.routes.length > 0) {
        const route = response.data.routes[0];
        const navigationRoute = this.parseGoogleRoute(route, origin, destination);
        
        // Cache route for offline use
        await this.cacheRoute(navigationRoute);
        
        this.currentRoute = navigationRoute;
        return navigationRoute;
      }

      throw new Error(`Directions API error: ${response.data.status}`);
    } catch (error) {
      console.error('Route calculation error:', error);
      
      // Fallback to mock route
      const mockRoute = this.generateMockRoute(origin, destination);
      this.currentRoute = mockRoute;
      return mockRoute;
    }
  }

  /**
   * Start navigation with progress tracking
   */
  public startNavigation(route: NavigationRoute): void {
    this.currentRoute = route;
    const totalDistanceNum = parseFloat(route.totalDistance.replace(/[^\d.]/g, '')) || 1000; // Default 1km
    this.currentProgress = {
      currentStepIndex: 0,
      distanceToNextTurn: 0,
      distanceToDestination: totalDistanceNum,
      routeProgress: 0,
      estimatedTimeRemaining: route.totalDuration,
      currentInstruction: route.steps[0]?.instruction || 'Start navigation',
      isOffRoute: false,
    };
    
    this.notifyNavigationCallbacks();
  }

  /**
   * Update navigation progress based on current location
   */
  public updateProgress(currentLocation: Coordinates): NavigationProgress | null {
    if (!this.currentRoute || !this.currentProgress) {
      return null;
    }

    const currentStep = this.currentRoute.steps[this.currentProgress.currentStepIndex];
    if (!currentStep) {
      return this.currentProgress;
    }

    // Calculate distance to next turn
    const distanceToNextTurn = this.calculateDistance(
      currentLocation,
      currentStep.coords
    );

    // Check if user reached the current step
    if (distanceToNextTurn < 20) { // 20 meters threshold
      const nextStepIndex = this.currentProgress.currentStepIndex + 1;
      if (nextStepIndex < this.currentRoute.steps.length) {
        this.currentProgress.currentStepIndex = nextStepIndex;
        this.currentProgress.currentInstruction = this.currentRoute.steps[nextStepIndex].instruction;
      } else {
        // Navigation complete
        this.currentProgress.currentInstruction = 'You have arrived at your destination';
      }
    }

    // Check if user is off route
    const isOffRoute = this.isUserOffRoute(currentLocation);
    
    this.currentProgress = {
      ...this.currentProgress,
      distanceToNextTurn,
      isOffRoute,
    };

    this.notifyNavigationCallbacks();
    return this.currentProgress;
  }

  /**
   * Subscribe to navigation progress updates
   */
  public onNavigationUpdate(callback: (progress: NavigationProgress) => void): () => void {
    this.navigationCallbacks.push(callback);
    
    return () => {
      const index = this.navigationCallbacks.indexOf(callback);
      if (index > -1) {
        this.navigationCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  public calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (coord1.latitude * Math.PI) / 180;
    const φ2 = (coord2.latitude * Math.PI) / 180;
    const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
    const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  /**
   * Generate mock route for testing/offline use
   */
  private generateMockRoute(origin: Coordinates, destination: Coordinates): NavigationRoute {
    const totalDistance = this.calculateDistance(origin, destination);
    const steps: RouteStep[] = [];

    // Create intermediate points
    const numSteps = Math.max(3, Math.floor(totalDistance / 100)); // Step every ~100m
    
    for (let i = 0; i <= numSteps; i++) {
      const progress = i / numSteps;
      const lat = origin.latitude + (destination.latitude - origin.latitude) * progress;
      const lng = origin.longitude + (destination.longitude - origin.longitude) * progress;
      
      let instruction = '';
      if (i === 0) {
        instruction = 'Start navigation';
      } else if (i === numSteps) {
        instruction = 'Arrive at destination';
      } else {
        const directions = ['Continue straight', 'Turn left', 'Turn right', 'Keep straight'];
        instruction = directions[i % directions.length];
      }

      steps.push({
        id: `step-${i}`,
        coords: { latitude: lat, longitude: lng },
        instruction,
        distance: `${Math.round(totalDistance / numSteps)}m`,
        duration: `${Math.round(totalDistance / numSteps / 1.4)}s`, // Walking speed ~1.4 m/s
        maneuver: i === 0 ? 'start' : i === numSteps ? 'arrive' : 'straight',
      });
    }

    return {
      id: `route-${Date.now()}`,
      origin,
      destination,
      steps,
      totalDistance: `${Math.round(totalDistance)}m`,
      totalDuration: `${Math.round(totalDistance / 1.4)}s`,
      polyline: '', // Would be encoded polyline in real implementation
      bounds: {
        northeast: {
          latitude: Math.max(origin.latitude, destination.latitude),
          longitude: Math.max(origin.longitude, destination.longitude),
        },
        southwest: {
          latitude: Math.min(origin.latitude, destination.latitude),
          longitude: Math.min(origin.longitude, destination.longitude),
        },
      },
    };
  }

  /**
   * Parse Google Directions API response
   */
  private parseGoogleRoute(route: any, origin: Coordinates, destination: Coordinates): NavigationRoute {
    const steps: RouteStep[] = [];
    let stepIndex = 0;

    route.legs.forEach((leg: any) => {
      leg.steps.forEach((step: any) => {
        steps.push({
          id: `step-${stepIndex++}`,
          coords: {
            latitude: step.end_location.lat,
            longitude: step.end_location.lng,
          },
          instruction: step.html_instructions.replace(/<[^>]*>/g, ''), // Remove HTML tags
          distance: step.distance.text,
          duration: step.duration.text,
          maneuver: step.maneuver || 'straight',
          polyline: step.polyline?.points,
          streetName: step.html_instructions.match(/on <b>(.*?)<\/b>/)?.[1],
        });
      });
    });

    return {
      id: `route-${Date.now()}`,
      origin,
      destination,
      steps,
      totalDistance: route.legs[0].distance.text,
      totalDuration: route.legs[0].duration.text,
      polyline: route.overview_polyline.points,
      bounds: {
        northeast: route.bounds.northeast,
        southwest: route.bounds.southwest,
      },
    };
  }

  /**
   * Stop navigation and clear current route
   */
  public stopNavigation(): void {
    this.currentRoute = null;
    this.currentProgress = null;
    this.routeMonitoring = false;
    this.voiceService.stop();
  }
  
  /**
   * Basic navigation progress update
   */
  public updateNavigationProgress(currentLocation: Coordinates): NavigationProgress | null {
    if (!this.currentRoute || !this.currentProgress) return null;

    const currentStep = this.currentRoute.steps[this.currentProgress.currentStepIndex];
    if (!currentStep) return this.currentProgress;

    // Calculate distance to next turn
    const distanceToNextTurn = this.calculateDistance(currentLocation, currentStep.coords);

    // Check if user reached the current step
    if (distanceToNextTurn < 20) { // 20 meters threshold
      const nextStepIndex = this.currentProgress.currentStepIndex + 1;
      if (nextStepIndex < this.currentRoute.steps.length) {
        this.currentProgress.currentStepIndex = nextStepIndex;
        this.currentProgress.currentInstruction = this.currentRoute.steps[nextStepIndex].instruction;
      } else {
        // Navigation complete
        this.currentProgress.currentInstruction = 'You have arrived at your destination';
      }
    }

    // Check if user is off route
    const isOffRoute = this.isUserOffRoute(currentLocation);
    
    this.currentProgress = {
      ...this.currentProgress,
      distanceToNextTurn,
      isOffRoute,
    };

    this.notifyNavigationCallbacks();
    return this.currentProgress;
  }

  /**
   * Check if user is off the current route
   */
  private isUserOffRoute(currentLocation: Coordinates): boolean {
    if (!this.currentRoute) return false;

    const currentStep = this.currentRoute.steps[this.currentProgress?.currentStepIndex || 0];
    if (!currentStep) return false;

    const distanceToRoute = this.calculateDistance(currentLocation, currentStep.coords);
    return distanceToRoute > this.offRouteThreshold;
  }

  /**
   * Start advanced route monitoring with voice guidance
   */
  public startAdvancedNavigation(route: NavigationRoute, enableVoice: boolean = true): void {
    this.currentRoute = route;
    this.routeMonitoring = true;
    const totalDistanceNum = parseFloat(route.totalDistance.replace(/[^\d.]/g, '')) || 1000;
    
    this.currentProgress = {
      currentStepIndex: 0,
      distanceToNextTurn: 0,
      distanceToDestination: totalDistanceNum,
      routeProgress: 0,
      estimatedTimeRemaining: route.totalDuration,
      currentInstruction: route.steps[0]?.instruction || 'Start navigation',
      isOffRoute: false,
    };

    if (enableVoice) {
      this.voiceService.speak({
        id: 'start_navigation',
        text: `Navigation started. Route distance: ${route.totalDistance}. Estimated time: ${route.totalDuration}`,
        priority: 'high',
        type: 'direction',
        interruptible: false
      });
    }
  }

  /**
   * Enhanced location update with voice guidance and gamification
   */
  public updateLocationAdvanced(currentLocation: Coordinates): NavigationProgress | null {
    if (!this.currentRoute || !this.currentProgress) return null;

    const progress = this.updateNavigationProgress(currentLocation);
    if (!progress) return null;

    // Voice guidance logic
    const currentStep = this.currentRoute.steps[progress.currentStepIndex];
    const distanceToTurn = progress.distanceToNextTurn;

    // Early warning (500m before turn)
    if (distanceToTurn <= 500 && distanceToTurn > 400 && currentStep.maneuver) {
      const instruction = this.voiceService.generateTurnInstruction(
        currentStep.maneuver,
        `${Math.round(distanceToTurn)}m`,
        currentStep.streetName,
        true
      );
      this.voiceService.speak(instruction);
    }

    // Immediate instruction (50m before turn)
    if (distanceToTurn <= 50 && distanceToTurn > 10 && currentStep.maneuver) {
      const instruction = this.voiceService.generateTurnInstruction(
        currentStep.maneuver,
        `${Math.round(distanceToTurn)}m`,
        currentStep.streetName,
        false
      );
      this.voiceService.speak(instruction);
    }

    // Perfect turn detection for gamification
    if (this.lastKnownLocation && distanceToTurn < 10) {
      const lastDistance = this.calculateDistance(this.lastKnownLocation, currentStep.coords);
      if (lastDistance > 10) {
        // User successfully executed a turn
        this.voiceService.updateGamificationStats('perfect_turn');
      }
    }

    // Off-route detection with recalculation
    if (progress.isOffRoute) {
      this.voiceService.announceOffRoute();
      this.recalculateRoute(currentLocation);
    }

    // Update distance traveled for gamification
    if (this.lastKnownLocation) {
      const distanceTraveled = this.calculateDistance(this.lastKnownLocation, currentLocation);
      this.voiceService.updateGamificationStats('distance_traveled', distanceTraveled);
    }

    this.lastKnownLocation = currentLocation;
    return progress;
  }

  /**
   * Recalculate route when user goes off-route
   */
  private async recalculateRoute(currentLocation: Coordinates): Promise<void> {
    if (!this.currentRoute) return;

    try {
      const newRoute = await this.calculateRoute(
        currentLocation,
        this.currentRoute.destination,
        { mode: 'walking' }
      );

      if (newRoute) {
        this.currentRoute = newRoute;
        const totalDistanceNum = parseFloat(newRoute.totalDistance.replace(/[^\d.]/g, '')) || 1000;
        this.currentProgress = {
          currentStepIndex: 0,
          distanceToNextTurn: 0,
          distanceToDestination: totalDistanceNum,
          routeProgress: 0,
          estimatedTimeRemaining: newRoute.totalDuration,
          currentInstruction: newRoute.steps[0]?.instruction || 'Continue navigation',
          isOffRoute: false,
        };

        this.voiceService.speak({
          id: 'route_recalculated',
          text: 'Route recalculated. Continue following the new directions.',
          priority: 'high',
          type: 'direction',
          interruptible: false
        });
      }
    } catch (error) {
      console.error('Route recalculation failed:', error);
    }
  }

  /**
   * Add navigation alert (speed cameras, traffic, etc.)
   */
  public addNavigationAlert(alert: NavigationAlert): void {
    this.navigationAlerts.push(alert);
    
    // Announce high-priority alerts
    if (alert.severity === 'high') {
      this.voiceService.speak({
        id: `alert_${alert.id}`,
        text: `Attention: ${alert.message}`,
        priority: 'urgent',
        type: 'warning',
        interruptible: false
      });
    }
  }

  /**
   * Get nearby navigation alerts
   */
  public getNearbyAlerts(location: Coordinates, radius: number = 1000): NavigationAlert[] {
    return this.navigationAlerts.filter(alert => {
      const distance = this.calculateDistance(location, alert.location);
      return distance <= radius;
    });
  }

  /**
   * Complete navigation with gamification
   */
  public completeNavigation(venueName: string): void {
    if (this.currentRoute) {
      this.voiceService.announceArrival(venueName);
      this.voiceService.updateGamificationStats('navigation_complete');
    }
    this.stopNavigation();
  }

  /**
   * Get estimated arrival time
   */
  public getEstimatedArrival(): Date | null {
    if (!this.currentProgress) return null;
    
    const remainingMinutes = parseInt(this.currentProgress.estimatedTimeRemaining.replace(/\D/g, ''));
    const arrivalTime = new Date();
    arrivalTime.setMinutes(arrivalTime.getMinutes() + remainingMinutes);
    
    return arrivalTime;
  }

  /**
   * Cache route for offline use
   */
  private async cacheRoute(route: NavigationRoute): Promise<void> {
    try {
      const cachedRoutes = await AsyncStorage.getItem(OFFLINE_ROUTES_KEY);
      const routes = cachedRoutes ? JSON.parse(cachedRoutes) : [];
      routes.push({
        ...route,
        cachedAt: Date.now(),
      });
      await AsyncStorage.setItem(OFFLINE_ROUTES_KEY, JSON.stringify(routes));
    } catch (error) {
      console.error('Failed to cache route:', error);
    }
  }

  /**
   * Get offline cached route
   */
  private async getOfflineRoute(origin: Coordinates, destination: Coordinates): Promise<NavigationRoute | null> {
    try {
      const cachedRoutes = await AsyncStorage.getItem(OFFLINE_ROUTES_KEY);
      if (!cachedRoutes) return null;

      const routes = JSON.parse(cachedRoutes);
      const similarRoute = routes.find((route: any) => {
        const originDistance = this.calculateDistance(origin, route.origin);
        const destDistance = this.calculateDistance(destination, route.destination);
        return originDistance < 100 && destDistance < 100; // Within 100m
      });
      
      return similarRoute || null;
    } catch (error) {
      console.warn('Failed to get offline route:', error);
      return null;
    }
  }

  /**
   * Notify all navigation callbacks
   */
  private notifyNavigationCallbacks(): void {
    if (this.currentProgress) {
      this.navigationCallbacks.forEach(callback => {
        try {
          callback(this.currentProgress!);
        } catch (error) {
          console.error('Navigation callback error:', error);
        }
      });
    }
  }

  /**
   * Get current route
   */
  public getCurrentRoute(): NavigationRoute | null {
    return this.currentRoute;
  }

  /**
   * Calculate advanced route with enhanced Google Maps options
   */
  public async calculateAdvancedRoute(
    origin: Coordinates,
    destination: Coordinates,
    options: {
      mode?: 'walking' | 'driving' | 'transit' | 'bicycling';
      avoidTolls?: boolean;
      avoidHighways?: boolean;
      optimizeWaypoints?: boolean;
      alternatives?: boolean;
      traffic?: boolean;
      language?: string;
    } = {}
  ): Promise<NavigationRoute | null> {
    try {
      if (!GOOGLE_MAPS_API_KEY) {
        console.warn('Google Maps API key not configured, using fallback route');
        return this.createFallbackRoute(origin, destination);
      }

      const {
        mode = 'walking',
        avoidTolls = false,
        avoidHighways = false,
        alternatives = true,
        traffic = true,
        language = 'en'
      } = options;

      // Build request parameters
      const params = new URLSearchParams({
        origin: `${origin.latitude},${origin.longitude}`,
        destination: `${destination.latitude},${destination.longitude}`,
        mode,
        language,
        key: GOOGLE_MAPS_API_KEY,
      });

      if (avoidTolls) params.append('avoid', 'tolls');
      if (avoidHighways) params.append('avoid', 'highways');
      if (alternatives) params.append('alternatives', 'true');
      if (traffic && mode === 'driving') params.append('departure_time', 'now');

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?${params}`
      );

      if (!response.ok) {
        throw new Error(`Google Maps API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== 'OK' || !data.routes?.length) {
        console.warn('No routes found, using fallback');
        return this.createFallbackRoute(origin, destination);
      }

      // Use the first route (best route according to Google)
      const route = data.routes[0];
      const leg = route.legs[0];

      // Process route steps with enhanced information
      const steps: RouteStep[] = leg.steps.map((step: any, index: number) => ({
        id: `step_${index}`,
        instruction: this.cleanInstruction(step.html_instructions || step.maneuver || 'Continue'),
        coords: {
          latitude: step.end_location.lat,
          longitude: step.end_location.lng,
        },
        distance: step.distance?.text || '0 m',
        duration: step.duration?.text || '0 mins',
        maneuver: step.maneuver || 'straight',
        polyline: step.polyline?.points || '',
        trafficCondition: this.assessTrafficCondition(step.duration?.value, step.duration_in_traffic?.value),
      }));

      const navigationRoute: NavigationRoute = {
        id: `route_${Date.now()}`,
        origin,
        destination,
        steps,
        totalDistance: leg.distance?.text || '0 km',
        totalDuration: leg.duration?.text || '0 mins',
        polyline: route.overview_polyline?.points || '',
        bounds: {
          northeast: {
            latitude: route.bounds.northeast.lat,
            longitude: route.bounds.northeast.lng,
          },
          southwest: {
            latitude: route.bounds.southwest.lat,
            longitude: route.bounds.southwest.lng,
          },
        },
      };

      // Cache route for offline use
      await this.cacheRoute(navigationRoute);

      console.log('Advanced route calculated successfully:', {
        distance: leg.distance?.text,
        duration: leg.duration?.text,
        steps: steps.length,
      });

      return navigationRoute;

    } catch (error) {
      console.error('Advanced route calculation error:', error);
      // Fallback to basic route calculation
      return this.calculateRoute(origin, destination, { mode: options.mode || 'walking' });
    }
  }

  /**
   * Clean HTML instructions from Google Maps response
   */
  private cleanInstruction(htmlInstruction: string): string {
    return htmlInstruction
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
      .replace(/&amp;/g, '&') // Replace HTML entities
      .trim();
  }

  /**
   * Assess traffic condition based on duration comparison
   */
  private assessTrafficCondition(
    normalDuration?: number,
    trafficDuration?: number
  ): 'unknown' | 'free_flow' | 'slow' | 'congested' | 'severe_congestion' {
    if (!normalDuration || !trafficDuration) return 'unknown';
    
    const ratio = trafficDuration / normalDuration;
    
    if (ratio <= 1.1) return 'free_flow';
    if (ratio <= 1.3) return 'slow';
    if (ratio <= 1.6) return 'congested';
    return 'severe_congestion';
  }

  /**
   * Create a fallback route when Google Maps API is unavailable
   */
  private createFallbackRoute(origin: Coordinates, destination: Coordinates): NavigationRoute {
    const distance = this.calculateDistance(origin, destination);
    const estimatedDuration = Math.round(distance / 1.4); // Walking speed ~1.4 m/s
    
    return {
      id: `fallback_route_${Date.now()}`,
      origin,
      destination,
      steps: [
        {
          id: 'step_0',
          instruction: `Walk ${distance > 1000 ? (distance / 1000).toFixed(1) + 'km' : Math.round(distance) + 'm'} to ${destination.latitude.toFixed(4)}, ${destination.longitude.toFixed(4)}`,
          coords: destination,
          distance: distance > 1000 ? `${(distance / 1000).toFixed(1)} km` : `${Math.round(distance)} m`,
          duration: estimatedDuration > 60 ? `${Math.round(estimatedDuration / 60)} mins` : `${estimatedDuration} secs`,
          maneuver: 'straight',
          polyline: '',
          trafficCondition: 'unknown',
        }
      ],
      totalDistance: distance > 1000 ? `${(distance / 1000).toFixed(1)} km` : `${Math.round(distance)} m`,
      totalDuration: estimatedDuration > 60 ? `${Math.round(estimatedDuration / 60)} mins` : `${estimatedDuration} secs`,
      polyline: '',
      bounds: {
        northeast: {
          latitude: Math.max(origin.latitude, destination.latitude),
          longitude: Math.max(origin.longitude, destination.longitude),
        },
        southwest: {
          latitude: Math.min(origin.latitude, destination.latitude),
          longitude: Math.min(origin.longitude, destination.longitude),
        },
      },
    };
  }
}

export { NavigationService };
export default NavigationService;
