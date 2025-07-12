// services/multiModalNavigation.ts
export interface NavigationMode {
  id: string;
  name: string;
  icon: string;
  description: string;
  accessibility: string[];
  estimatedTime: number; // in minutes
  difficultyLevel: 'easy' | 'moderate' | 'challenging';
  features: string[];
}

export interface RouteStep {
  id: string;
  instruction: string;
  mode: string;
  duration: number; // in seconds
  distance: number; // in meters
  floor?: string;
  landmark?: string;
  accessibility?: string;
}

export interface NavigationRoute {
  id: string;
  startPoint: string;
  destination: string;
  totalDistance: number;
  totalDuration: number;
  floors: string[];
  steps: RouteStep[];
  accessibility: string[];
  energyEfficiency: number; // 1-10 scale
  crowdDensity: 'low' | 'medium' | 'high';
}

export interface UserAccessibilityPreferences {
  useElevators: boolean;
  avoidStairs: boolean;
  wheelchairAccessible: boolean;
  visualAidRequired: boolean;
  hearingAidRequired: boolean;
  preferShorterRoutes: boolean;
  avoidCrowds: boolean;
}

class MultiModalNavigationService {
  private navigationModes: NavigationMode[] = [
    {
      id: 'walking',
      name: 'Walking',
      icon: 'figure.walk',
      description: 'Standard walking route',
      accessibility: ['wheelchair', 'mobility_aid'],
      estimatedTime: 5,
      difficultyLevel: 'easy',
      features: ['shortest_path', 'scenic_route']
    },
    {
      id: 'elevator',
      name: 'Elevator Route',
      icon: 'arrow.up.arrow.down.square',
      description: 'Routes using elevators for floor changes',
      accessibility: ['wheelchair', 'mobility_aid', 'heavy_luggage'],
      estimatedTime: 7,
      difficultyLevel: 'easy',
      features: ['accessible', 'comfortable']
    },
    {
      id: 'escalator',
      name: 'Escalator Route',
      icon: 'arrow.up.right.square',
      description: 'Faster routes using escalators',
      accessibility: ['mobile_users'],
      estimatedTime: 4,
      difficultyLevel: 'moderate',
      features: ['fast', 'efficient']
    },
    {
      id: 'stairs',
      name: 'Stair Route',
      icon: 'figure.stairs',
      description: 'Direct routes using stairs',
      accessibility: ['mobile_users'],
      estimatedTime: 3,
      difficultyLevel: 'challenging',
      features: ['fastest', 'exercise']
    },
    {
      id: 'wheelchair',
      name: 'Wheelchair Accessible',
      icon: 'figure.roll',
      description: 'Fully wheelchair accessible routes',
      accessibility: ['wheelchair', 'mobility_aid'],
      estimatedTime: 8,
      difficultyLevel: 'easy',
      features: ['accessible', 'safe', 'wide_paths']
    },
    {
      id: 'energy_saver',
      name: 'Energy Saver',
      icon: 'leaf',
      description: 'Most energy-efficient route',
      accessibility: ['all_users'],
      estimatedTime: 6,
      difficultyLevel: 'moderate',
      features: ['eco_friendly', 'minimal_elevation']
    }
  ];

  getNavigationModes(): NavigationMode[] {
    return this.navigationModes;
  }

  getRecommendedModes(userPreferences: UserAccessibilityPreferences): NavigationMode[] {
    return this.navigationModes.filter(mode => {
      if (userPreferences.wheelchairAccessible && !mode.accessibility.includes('wheelchair')) {
        return false;
      }
      if (userPreferences.avoidStairs && mode.id === 'stairs') {
        return false;
      }
      if (userPreferences.useElevators && mode.id === 'escalator') {
        return false;
      }
      return true;
    });
  }

  generateRoute(
    start: string,
    destination: string,
    mode: string,
    userPreferences: UserAccessibilityPreferences
  ): NavigationRoute {
    const selectedMode = this.navigationModes.find(m => m.id === mode);
    if (!selectedMode) {
      throw new Error('Invalid navigation mode');
    }

    // Mock route generation based on mode
    const baseSteps = this.generateRouteSteps(start, destination, mode, userPreferences);
    
    return {
      id: `route_${Date.now()}`,
      startPoint: start,
      destination,
      totalDistance: baseSteps.reduce((sum, step) => sum + step.distance, 0),
      totalDuration: baseSteps.reduce((sum, step) => sum + step.duration, 0),
      floors: this.extractFloorsFromSteps(baseSteps),
      steps: baseSteps,
      accessibility: selectedMode.accessibility,
      energyEfficiency: this.calculateEnergyEfficiency(mode, baseSteps),
      crowdDensity: this.estimateCrowdDensity()
    };
  }

  private generateRouteSteps(
    start: string,
    destination: string,
    mode: string,
    preferences: UserAccessibilityPreferences
  ): RouteStep[] {
    const steps: RouteStep[] = [];

    // Starting step
    steps.push({
      id: 'start',
      instruction: `Start at ${start}`,
      mode: 'walking',
      duration: 0,
      distance: 0,
      floor: 'Ground Floor',
      accessibility: 'All users'
    });

    // Navigation steps based on mode
    switch (mode) {
      case 'elevator':
        steps.push(
          {
            id: 'walk_to_elevator',
            instruction: 'Walk to the nearest elevator',
            mode: 'walking',
            duration: 60,
            distance: 25,
            floor: 'Ground Floor',
            landmark: 'Main Elevator Bank',
            accessibility: 'Wheelchair accessible'
          },
          {
            id: 'use_elevator',
            instruction: 'Take elevator to Level 2',
            mode: 'elevator',
            duration: 45,
            distance: 0,
            floor: 'Level 2',
            accessibility: 'Wheelchair accessible'
          },
          {
            id: 'walk_to_destination',
            instruction: `Walk to ${destination}`,
            mode: 'walking',
            duration: 90,
            distance: 45,
            floor: 'Level 2',
            accessibility: 'Wheelchair accessible'
          }
        );
        break;

      case 'escalator':
        steps.push(
          {
            id: 'walk_to_escalator',
            instruction: 'Walk to the escalator',
            mode: 'walking',
            duration: 45,
            distance: 20,
            floor: 'Ground Floor',
            landmark: 'Central Escalator'
          },
          {
            id: 'use_escalator',
            instruction: 'Take escalator up to Level 2',
            mode: 'escalator',
            duration: 30,
            distance: 0,
            floor: 'Level 2'
          },
          {
            id: 'walk_to_destination',
            instruction: `Walk to ${destination}`,
            mode: 'walking',
            duration: 75,
            distance: 38,
            floor: 'Level 2'
          }
        );
        break;

      case 'stairs':
        steps.push(
          {
            id: 'walk_to_stairs',
            instruction: 'Walk to the staircase',
            mode: 'walking',
            duration: 30,
            distance: 15,
            floor: 'Ground Floor',
            landmark: 'Emergency Stairwell A'
          },
          {
            id: 'use_stairs',
            instruction: 'Take stairs up to Level 2 (24 steps)',
            mode: 'stairs',
            duration: 45,
            distance: 12,
            floor: 'Level 2'
          },
          {
            id: 'walk_to_destination',
            instruction: `Walk to ${destination}`,
            mode: 'walking',
            duration: 60,
            distance: 30,
            floor: 'Level 2'
          }
        );
        break;

      case 'wheelchair':
        steps.push(
          {
            id: 'accessible_path',
            instruction: 'Follow the accessible path with ramps',
            mode: 'walking',
            duration: 120,
            distance: 60,
            floor: 'Ground Floor',
            accessibility: 'Wheelchair accessible with 1:12 gradient ramps'
          },
          {
            id: 'use_accessible_elevator',
            instruction: 'Use accessible elevator to Level 2',
            mode: 'elevator',
            duration: 60,
            distance: 0,
            floor: 'Level 2',
            accessibility: 'Extra wide elevator with audio announcements'
          },
          {
            id: 'accessible_route_to_destination',
            instruction: `Follow accessible route to ${destination}`,
            mode: 'walking',
            duration: 100,
            distance: 50,
            floor: 'Level 2',
            accessibility: 'Wide corridors, no obstacles'
          }
        );
        break;

      case 'energy_saver':
        steps.push(
          {
            id: 'efficient_route',
            instruction: 'Take the most energy-efficient path',
            mode: 'walking',
            duration: 180,
            distance: 75,
            floor: 'Ground Floor',
            landmark: 'Minimal elevation changes'
          },
          {
            id: 'gentle_ramp',
            instruction: 'Use gentle ramp to upper level',
            mode: 'walking',
            duration: 90,
            distance: 45,
            floor: 'Level 2',
            accessibility: 'Gradual incline, rest areas available'
          },
          {
            id: 'final_stretch',
            instruction: `Complete journey to ${destination}`,
            mode: 'walking',
            duration: 60,
            distance: 25,
            floor: 'Level 2'
          }
        );
        break;

      default: // walking
        steps.push(
          {
            id: 'main_corridor',
            instruction: 'Walk through the main corridor',
            mode: 'walking',
            duration: 90,
            distance: 45,
            floor: 'Ground Floor',
            landmark: 'Main Shopping Corridor'
          },
          {
            id: 'turn_right',
            instruction: 'Turn right at the information desk',
            mode: 'walking',
            duration: 30,
            distance: 15,
            floor: 'Ground Floor',
            landmark: 'Information Desk'
          },
          {
            id: 'final_approach',
            instruction: `Walk straight to ${destination}`,
            mode: 'walking',
            duration: 60,
            distance: 30,
            floor: 'Ground Floor'
          }
        );
    }

    return steps;
  }

  private extractFloorsFromSteps(steps: RouteStep[]): string[] {
    const floors = new Set<string>();
    steps.forEach(step => {
      if (step.floor) {
        floors.add(step.floor);
      }
    });
    return Array.from(floors);
  }

  private calculateEnergyEfficiency(mode: string, steps: RouteStep[]): number {
    const baseEfficiency: Record<string, number> = {
      walking: 6,
      elevator: 8,
      escalator: 5,
      stairs: 3,
      wheelchair: 7,
      energy_saver: 10
    };

    const elevationChanges = steps.filter(step => 
      step.mode === 'stairs' || step.mode === 'escalator'
    ).length;

    return Math.max(1, baseEfficiency[mode] - elevationChanges);
  }

  private estimateCrowdDensity(): 'low' | 'medium' | 'high' {
    const hour = new Date().getHours();
    if (hour >= 11 && hour <= 14) return 'high'; // Lunch time
    if (hour >= 17 && hour <= 19) return 'high'; // Evening rush
    if (hour >= 9 && hour <= 11) return 'medium'; // Morning
    if (hour >= 15 && hour <= 17) return 'medium'; // Afternoon
    return 'low';
  }

  getRouteAlternatives(
    start: string,
    destination: string,
    userPreferences: UserAccessibilityPreferences
  ): NavigationRoute[] {
    const recommendedModes = this.getRecommendedModes(userPreferences);
    
    return recommendedModes.map(mode => 
      this.generateRoute(start, destination, mode.id, userPreferences)
    ).sort((a, b) => {
      // Sort by user preferences
      if (userPreferences.preferShorterRoutes) {
        return a.totalDuration - b.totalDuration;
      }
      return b.energyEfficiency - a.energyEfficiency;
    });
  }

  getCrowdDensityInfo(): {
    current: 'low' | 'medium' | 'high';
    forecast: { time: string; density: 'low' | 'medium' | 'high' }[];
  } {
    const current = this.estimateCrowdDensity();
    const forecast = [];
    
    for (let i = 1; i <= 6; i++) {
      const futureHour = (new Date().getHours() + i) % 24;
      const time = `${futureHour.toString().padStart(2, '0')}:00`;
      let density: 'low' | 'medium' | 'high' = 'low';
      
      if (futureHour >= 11 && futureHour <= 14) density = 'high';
      else if (futureHour >= 17 && futureHour <= 19) density = 'high';
      else if ((futureHour >= 9 && futureHour <= 11) || 
               (futureHour >= 15 && futureHour <= 17)) density = 'medium';
      
      forecast.push({ time, density });
    }
    
    return { current, forecast };
  }
}

export const multiModalNavigationService = new MultiModalNavigationService();
