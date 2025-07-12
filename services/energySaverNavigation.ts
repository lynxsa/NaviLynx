// services/energySaverNavigation.ts
import { UserAccessibilityPreferences } from './multiModalNavigation';

export interface EnergyProfile {
  userId: string;
  currentBatteryLevel: number;
  averageBatteryUsage: number; // per minute
  energySavingMode: 'off' | 'adaptive' | 'aggressive';
  preferences: {
    reduceAnimations: boolean;
    lowerRefreshRate: boolean;
    disableHaptics: boolean;
    minimizeScreenBrightness: boolean;
    useSimplifiedUI: boolean;
  };
}

export interface EnergyOptimizedRoute {
  id: string;
  startPoint: string;
  destination: string;
  energyScore: number; // 1-10, higher is more efficient
  estimatedBatteryUsage: number; // percentage
  features: {
    minimalElevationChange: boolean;
    shorterDistance: boolean;
    lessComplexTurns: boolean;
    avoidCrowdedAreas: boolean;
    optimizedForWalking: boolean;
  };
  steps: EnergyOptimizedStep[];
  alternatives: EnergyOptimizedRoute[];
}

export interface EnergyOptimizedStep {
  id: string;
  instruction: string;
  energyImpact: 'low' | 'medium' | 'high';
  duration: number;
  distance: number;
  restOpportunities: string[];
  landmarks: string[];
}

export interface BatteryMonitoring {
  currentLevel: number;
  estimatedTimeRemaining: number; // minutes
  usageByFeature: {
    arRendering: number;
    gpsTracking: number;
    cameraUsage: number;
    screenBrightness: number;
    hapticFeedback: number;
  };
  recommendations: string[];
}

class EnergySaverNavigationService {
  private energyProfile: EnergyProfile | null = null;
  private batteryMonitoring: BatteryMonitoring | null = null;
  private energyOptimizations: Map<string, boolean> = new Map();

  initializeEnergyProfile(userId: string, batteryLevel: number): EnergyProfile {
    this.energyProfile = {
      userId,
      currentBatteryLevel: batteryLevel,
      averageBatteryUsage: this.calculateAverageBatteryUsage(),
      energySavingMode: this.determineEnergySavingMode(batteryLevel),
      preferences: {
        reduceAnimations: batteryLevel < 30,
        lowerRefreshRate: batteryLevel < 20,
        disableHaptics: batteryLevel < 15,
        minimizeScreenBrightness: batteryLevel < 25,
        useSimplifiedUI: batteryLevel < 20
      }
    };

    return this.energyProfile;
  }

  private calculateAverageBatteryUsage(): number {
    // Mock calculation - in real app, this would be based on historical data
    return 2.5; // 2.5% per minute average
  }

  private determineEnergySavingMode(batteryLevel: number): 'off' | 'adaptive' | 'aggressive' {
    if (batteryLevel < 15) return 'aggressive';
    if (batteryLevel < 30) return 'adaptive';
    return 'off';
  }

  generateEnergyOptimizedRoute(
    start: string,
    destination: string,
    userPreferences: UserAccessibilityPreferences,
    currentBatteryLevel: number
  ): EnergyOptimizedRoute {
    const energyProfile = this.initializeEnergyProfile('user', currentBatteryLevel);
    
    const baseRoute = this.calculateBaseRoute(start, destination);
    const optimizedSteps = this.optimizeStepsForEnergy(baseRoute.steps, energyProfile);
    
    const energyScore = this.calculateEnergyScore(optimizedSteps, energyProfile);
    const estimatedBatteryUsage = this.estimateBatteryUsage(optimizedSteps, energyProfile);

    return {
      id: `energy_route_${Date.now()}`,
      startPoint: start,
      destination,
      energyScore,
      estimatedBatteryUsage,
      features: {
        minimalElevationChange: true,
        shorterDistance: energyProfile.energySavingMode !== 'off',
        lessComplexTurns: true,
        avoidCrowdedAreas: energyProfile.energySavingMode === 'aggressive',
        optimizedForWalking: true
      },
      steps: optimizedSteps,
      alternatives: this.generateAlternativeRoutes(start, destination, energyProfile)
    };
  }

  private calculateBaseRoute(start: string, destination: string): { steps: EnergyOptimizedStep[] } {
    // Mock route calculation
    return {
      steps: [
        {
          id: 'step_1',
          instruction: `Start at ${start}`,
          energyImpact: 'low',
          duration: 0,
          distance: 0,
          restOpportunities: ['Seating area at entrance'],
          landmarks: ['Main entrance', 'Information desk']
        },
        {
          id: 'step_2',
          instruction: 'Walk straight along the main corridor',
          energyImpact: 'low',
          duration: 120,
          distance: 60,
          restOpportunities: ['Bench halfway through corridor'],
          landmarks: ['Central fountain', 'ATM area']
        },
        {
          id: 'step_3',
          instruction: 'Take the gentle ramp up (avoid escalator to save energy)',
          energyImpact: 'medium',
          duration: 90,
          distance: 45,
          restOpportunities: ['Rest area at top of ramp'],
          landmarks: ['Ramp entrance', 'Level 2 sign']
        },
        {
          id: 'step_4',
          instruction: `Walk directly to ${destination}`,
          energyImpact: 'low',
          duration: 60,
          distance: 30,
          restOpportunities: [],
          landmarks: [destination]
        }
      ]
    };
  }

  private optimizeStepsForEnergy(
    steps: EnergyOptimizedStep[],
    energyProfile: EnergyProfile
  ): EnergyOptimizedStep[] {
    return steps.map(step => {
      const optimizedStep = { ...step };

      // Add rest opportunities for low battery
      if (energyProfile.currentBatteryLevel < 20) {
        optimizedStep.restOpportunities = [
          ...step.restOpportunities,
          'Rest recommended for energy conservation'
        ];
      }

      // Adjust instructions for energy saving
      if (energyProfile.energySavingMode === 'aggressive') {
        if (step.instruction.includes('escalator')) {
          optimizedStep.instruction = step.instruction.replace(
            'escalator',
            'ramp or elevator (energy efficient)'
          );
        }
      }

      return optimizedStep;
    });
  }

  private calculateEnergyScore(
    steps: EnergyOptimizedStep[],
    energyProfile: EnergyProfile
  ): number {
    let score = 10; // Start with perfect score

    // Reduce score for high energy steps
    const highEnergySteps = steps.filter(step => step.energyImpact === 'high').length;
    score -= highEnergySteps * 2;

    // Adjust for total distance
    const totalDistance = steps.reduce((sum, step) => sum + step.distance, 0);
    if (totalDistance > 100) score -= 1;
    if (totalDistance > 200) score -= 2;

    // Bonus for rest opportunities
    const restOpportunities = steps.reduce(
      (sum, step) => sum + step.restOpportunities.length, 0
    );
    score += Math.min(2, restOpportunities * 0.5);

    return Math.max(1, Math.min(10, score));
  }

  private estimateBatteryUsage(
    steps: EnergyOptimizedStep[],
    energyProfile: EnergyProfile
  ): number {
    const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);
    const baseBatteryUsage = (totalDuration / 60) * energyProfile.averageBatteryUsage;

    // Adjust for energy saving mode
    let multiplier = 1;
    if (energyProfile.energySavingMode === 'adaptive') multiplier = 0.8;
    if (energyProfile.energySavingMode === 'aggressive') multiplier = 0.6;

    return Math.round(baseBatteryUsage * multiplier * 100) / 100;
  }

  private generateAlternativeRoutes(
    start: string,
    destination: string,
    energyProfile: EnergyProfile
  ): EnergyOptimizedRoute[] {
    // Generate 2-3 alternative routes with different energy trade-offs
    return [
      {
        id: `alt_1_${Date.now()}`,
        startPoint: start,
        destination,
        energyScore: 8,
        estimatedBatteryUsage: 3.2,
        features: {
          minimalElevationChange: true,
          shorterDistance: false,
          lessComplexTurns: true,
          avoidCrowdedAreas: false,
          optimizedForWalking: true
        },
        steps: [],
        alternatives: []
      },
      {
        id: `alt_2_${Date.now()}`,
        startPoint: start,
        destination,
        energyScore: 9,
        estimatedBatteryUsage: 2.8,
        features: {
          minimalElevationChange: true,
          shorterDistance: true,
          lessComplexTurns: false,
          avoidCrowdedAreas: true,
          optimizedForWalking: true
        },
        steps: [],
        alternatives: []
      }
    ];
  }

  getBatteryMonitoring(): BatteryMonitoring {
    if (!this.batteryMonitoring) {
      this.batteryMonitoring = {
        currentLevel: 85, // Mock data
        estimatedTimeRemaining: 240, // 4 hours
        usageByFeature: {
          arRendering: 15,
          gpsTracking: 8,
          cameraUsage: 12,
          screenBrightness: 25,
          hapticFeedback: 3
        },
        recommendations: this.generateEnergyRecommendations()
      };
    }
    return this.batteryMonitoring;
  }

  private generateEnergyRecommendations(): string[] {
    const recommendations: string[] = [];
    
    if (!this.energyProfile) return recommendations;

    const batteryLevel = this.energyProfile.currentBatteryLevel;

    if (batteryLevel < 30) {
      recommendations.push('Enable energy saver mode');
      recommendations.push('Reduce screen brightness');
      recommendations.push('Disable haptic feedback');
    }

    if (batteryLevel < 20) {
      recommendations.push('Use simplified UI mode');
      recommendations.push('Avoid AR features when possible');
      recommendations.push('Close unnecessary background apps');
    }

    if (batteryLevel < 15) {
      recommendations.push('Consider charging before long navigation');
      recommendations.push('Use basic navigation mode only');
      recommendations.push('Enable aggressive power saving');
    }

    return recommendations;
  }

  enableEnergyOptimization(feature: string, enabled: boolean): void {
    this.energyOptimizations.set(feature, enabled);
  }

  getEnergyOptimizations(): Map<string, boolean> {
    return new Map(this.energyOptimizations);
  }

  updateBatteryLevel(newLevel: number): void {
    if (this.energyProfile) {
      this.energyProfile.currentBatteryLevel = newLevel;
      this.energyProfile.energySavingMode = this.determineEnergySavingMode(newLevel);
      
      // Update preferences based on battery level
      this.energyProfile.preferences = {
        reduceAnimations: newLevel < 30,
        lowerRefreshRate: newLevel < 20,
        disableHaptics: newLevel < 15,
        minimizeScreenBrightness: newLevel < 25,
        useSimplifiedUI: newLevel < 20
      };
    }

    // Update battery monitoring
    if (this.batteryMonitoring) {
      this.batteryMonitoring.currentLevel = newLevel;
      this.batteryMonitoring.estimatedTimeRemaining = this.calculateTimeRemaining(newLevel);
      this.batteryMonitoring.recommendations = this.generateEnergyRecommendations();
    }
  }

  private calculateTimeRemaining(batteryLevel: number): number {
    if (!this.energyProfile) return 0;
    
    // Simple calculation: batteryLevel / averageUsagePerMinute
    return Math.round(batteryLevel / this.energyProfile.averageBatteryUsage);
  }

  getEnergySavingTips(): string[] {
    return [
      'Use ramps instead of escalators when possible',
      'Take breaks at seating areas to conserve energy',
      'Follow the most direct route to save time and battery',
      'Use offline maps when available',
      'Reduce screen brightness in well-lit areas',
      'Disable AR features when not essential',
      'Close other apps running in the background',
      'Use airplane mode in areas with poor signal'
    ];
  }

  calculateEnergyImpactScore(
    feature: 'ar' | 'camera' | 'gps' | 'haptics' | 'animations',
    duration: number
  ): number {
    const baseImpact: Record<string, number> = {
      ar: 5.0,      // Very high impact
      camera: 3.5,   // High impact
      gps: 1.5,      // Medium impact
      haptics: 0.5,  // Low impact
      animations: 2.0 // Medium impact
    };

    const impactPerMinute = baseImpact[feature] || 1.0;
    return (duration / 60) * impactPerMinute;
  }
}

export const energySaverNavigationService = new EnergySaverNavigationService();
