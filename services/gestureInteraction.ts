// services/gestureInteraction.ts
import { PanGestureHandler, TapGestureHandler, PinchGestureHandler } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { Animated } from 'react-native';

export interface GestureConfig {
  enabled: boolean;
  sensitivity: 'low' | 'medium' | 'high';
  hapticFeedback: boolean;
  customGestures: CustomGesture[];
}

export interface CustomGesture {
  id: string;
  name: string;
  pattern: GesturePattern;
  action: GestureAction;
  contexts: string[]; // Where this gesture is available
  accessibility: boolean;
}

export interface GesturePattern {
  type: 'tap' | 'double_tap' | 'long_press' | 'swipe' | 'pinch' | 'shake' | 'draw';
  direction?: 'up' | 'down' | 'left' | 'right';
  fingers?: number;
  duration?: number; // milliseconds
  distance?: number; // pixels
  shape?: string; // for draw gestures like 'circle', 'line'
}

export interface GestureAction {
  type: 'navigation' | 'ui_control' | 'ar_interaction' | 'accessibility' | 'custom';
  command: string;
  parameters?: Record<string, any>;
}

export interface GestureRecognition {
  gesture: CustomGesture;
  confidence: number;
  timestamp: number;
  position: { x: number; y: number };
}

export interface AccessibilityGestures {
  voiceNavigation: boolean;
  largeGestureAreas: boolean;
  simplifiedGestures: boolean;
  audioFeedback: boolean;
  vibrationPatterns: boolean;
}

class GestureInteractionService {
  private gestureConfig: GestureConfig;
  private activeGestures: Map<string, CustomGesture> = new Map();
  private gestureListeners: ((recognition: GestureRecognition) => void)[] = [];
  private accessibilityMode: boolean = false;

  constructor() {
    this.gestureConfig = {
      enabled: true,
      sensitivity: 'medium',
      hapticFeedback: true,
      customGestures: this.getDefaultGestures()
    };
  }

  private getDefaultGestures(): CustomGesture[] {
    return [
      {
        id: 'quick_search',
        name: 'Quick Search',
        pattern: {
          type: 'double_tap',
          fingers: 2
        },
        action: {
          type: 'ui_control',
          command: 'open_search'
        },
        contexts: ['home', 'explore', 'venue_detail'],
        accessibility: true
      },
      {
        id: 'navigation_menu',
        name: 'Navigation Menu',
        pattern: {
          type: 'swipe',
          direction: 'right',
          fingers: 1,
          distance: 100
        },
        action: {
          type: 'navigation',
          command: 'open_menu'
        },
        contexts: ['all'],
        accessibility: true
      },
      {
        id: 'ar_zoom',
        name: 'AR Zoom',
        pattern: {
          type: 'pinch',
          fingers: 2
        },
        action: {
          type: 'ar_interaction',
          command: 'zoom_ar_view'
        },
        contexts: ['ar_navigation'],
        accessibility: false
      },
      {
        id: 'emergency_call',
        name: 'Emergency Call',
        pattern: {
          type: 'long_press',
          fingers: 3,
          duration: 2000
        },
        action: {
          type: 'custom',
          command: 'emergency_contact'
        },
        contexts: ['all'],
        accessibility: true
      },
      {
        id: 'back_navigation',
        name: 'Go Back',
        pattern: {
          type: 'swipe',
          direction: 'left',
          fingers: 1,
          distance: 80
        },
        action: {
          type: 'navigation',
          command: 'go_back'
        },
        contexts: ['all'],
        accessibility: true
      },
      {
        id: 'voice_command',
        name: 'Voice Command',
        pattern: {
          type: 'tap',
          fingers: 3
        },
        action: {
          type: 'accessibility',
          command: 'start_voice_input'
        },
        contexts: ['all'],
        accessibility: true
      },
      {
        id: 'ar_marker_select',
        name: 'Select AR Marker',
        pattern: {
          type: 'tap',
          fingers: 1
        },
        action: {
          type: 'ar_interaction',
          command: 'select_ar_marker'
        },
        contexts: ['ar_navigation'],
        accessibility: true
      },
      {
        id: 'refresh',
        name: 'Refresh Content',
        pattern: {
          type: 'draw',
          shape: 'circle',
          fingers: 1
        },
        action: {
          type: 'ui_control',
          command: 'refresh_content'
        },
        contexts: ['home', 'explore'],
        accessibility: false
      },
      {
        id: 'bookmark_venue',
        name: 'Bookmark Venue',
        pattern: {
          type: 'long_press',
          fingers: 1,
          duration: 1000
        },
        action: {
          type: 'ui_control',
          command: 'bookmark_venue'
        },
        contexts: ['venue_detail'],
        accessibility: true
      },
      {
        id: 'toggle_map_view',
        name: 'Toggle Map View',
        pattern: {
          type: 'double_tap',
          fingers: 1
        },
        action: {
          type: 'ui_control',
          command: 'toggle_map_view'
        },
        contexts: ['ar_navigation'],
        accessibility: true
      }
    ];
  }

  initializeGestures(accessibilityMode: boolean = false): void {
    this.accessibilityMode = accessibilityMode;
    
    // Load gestures based on accessibility needs
    const gestures = this.accessibilityMode 
      ? this.gestureConfig.customGestures.filter(g => g.accessibility)
      : this.gestureConfig.customGestures;

    gestures.forEach(gesture => {
      this.activeGestures.set(gesture.id, gesture);
    });
  }

  recognizeGesture(
    gestureData: {
      type: string;
      direction?: string;
      fingers?: number;
      duration?: number;
      distance?: number;
      position: { x: number; y: number };
    },
    context: string
  ): GestureRecognition | null {
    
    for (const [id, gesture] of this.activeGestures) {
      if (!gesture.contexts.includes('all') && !gesture.contexts.includes(context)) {
        continue;
      }

      const confidence = this.calculateGestureConfidence(gestureData, gesture.pattern);
      
      if (confidence > 0.7) { // 70% confidence threshold
        const recognition: GestureRecognition = {
          gesture,
          confidence,
          timestamp: Date.now(),
          position: gestureData.position
        };

        this.executeGestureAction(recognition);
        return recognition;
      }
    }

    return null;
  }

  private calculateGestureConfidence(
    gestureData: any,
    pattern: GesturePattern
  ): number {
    let confidence = 0;

    // Type match
    if (gestureData.type === pattern.type) {
      confidence += 0.4;
    } else {
      return 0; // Must match type
    }

    // Direction match
    if (pattern.direction) {
      if (gestureData.direction === pattern.direction) {
        confidence += 0.2;
      } else {
        confidence -= 0.3;
      }
    }

    // Finger count match
    if (pattern.fingers) {
      if (gestureData.fingers === pattern.fingers) {
        confidence += 0.2;
      } else {
        confidence -= 0.2;
      }
    }

    // Duration match (for long press)
    if (pattern.duration && gestureData.duration) {
      const durationDiff = Math.abs(gestureData.duration - pattern.duration);
      if (durationDiff < 500) { // Within 500ms tolerance
        confidence += 0.1;
      }
    }

    // Distance match (for swipes)
    if (pattern.distance && gestureData.distance) {
      const distanceDiff = Math.abs(gestureData.distance - pattern.distance);
      const tolerance = pattern.distance * 0.3; // 30% tolerance
      if (distanceDiff < tolerance) {
        confidence += 0.1;
      }
    }

    return Math.max(0, Math.min(1, confidence));
  }

  private async executeGestureAction(recognition: GestureRecognition): Promise<void> {
    const { gesture } = recognition;
    
    // Provide haptic feedback
    if (this.gestureConfig.hapticFeedback) {
      await this.provideHapticFeedback(gesture.pattern.type);
    }

    // Notify listeners
    this.gestureListeners.forEach(listener => {
      try {
        listener(recognition);
      } catch (error) {
        console.error('Gesture listener error:', error);
      }
    });

    // Execute the action based on type
    switch (gesture.action.type) {
      case 'navigation':
        await this.handleNavigationAction(gesture.action);
        break;
      case 'ui_control':
        await this.handleUIControlAction(gesture.action);
        break;
      case 'ar_interaction':
        await this.handleARInteractionAction(gesture.action);
        break;
      case 'accessibility':
        await this.handleAccessibilityAction(gesture.action);
        break;
      case 'custom':
        await this.handleCustomAction(gesture.action);
        break;
    }
  }

  private async provideHapticFeedback(gestureType: string): Promise<void> {
    try {
      switch (gestureType) {
        case 'tap':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'double_tap':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'long_press':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case 'swipe':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'pinch':
          await Haptics.selectionAsync();
          break;
        default:
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (error) {
      console.error('Haptic feedback error:', error);
    }
  }

  private async handleNavigationAction(action: GestureAction): Promise<void> {
    console.log('Executing navigation action:', action.command);
    // Integration with navigation system would go here
  }

  private async handleUIControlAction(action: GestureAction): Promise<void> {
    console.log('Executing UI control action:', action.command);
    // Integration with UI state management would go here
  }

  private async handleARInteractionAction(action: GestureAction): Promise<void> {
    console.log('Executing AR interaction action:', action.command);
    // Integration with AR system would go here
  }

  private async handleAccessibilityAction(action: GestureAction): Promise<void> {
    console.log('Executing accessibility action:', action.command);
    // Integration with accessibility features would go here
  }

  private async handleCustomAction(action: GestureAction): Promise<void> {
    console.log('Executing custom action:', action.command);
    
    if (action.command === 'emergency_contact') {
      // Handle emergency contact
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      // Would integrate with emergency services
    }
  }

  addCustomGesture(gesture: CustomGesture): void {
    this.gestureConfig.customGestures.push(gesture);
    this.activeGestures.set(gesture.id, gesture);
  }

  removeCustomGesture(gestureId: string): void {
    this.gestureConfig.customGestures = this.gestureConfig.customGestures.filter(
      g => g.id !== gestureId
    );
    this.activeGestures.delete(gestureId);
  }

  updateGestureConfig(config: Partial<GestureConfig>): void {
    this.gestureConfig = { ...this.gestureConfig, ...config };
  }

  getGestureConfig(): GestureConfig {
    return { ...this.gestureConfig };
  }

  getActiveGestures(context?: string): CustomGesture[] {
    const gestures = Array.from(this.activeGestures.values());
    
    if (context) {
      return gestures.filter(g => 
        g.contexts.includes('all') || g.contexts.includes(context)
      );
    }
    
    return gestures;
  }

  addGestureListener(listener: (recognition: GestureRecognition) => void): void {
    this.gestureListeners.push(listener);
  }

  removeGestureListener(listener: (recognition: GestureRecognition) => void): void {
    const index = this.gestureListeners.indexOf(listener);
    if (index > -1) {
      this.gestureListeners.splice(index, 1);
    }
  }

  getAccessibilityGestures(): CustomGesture[] {
    return this.activeGestures.values()
      ? Array.from(this.activeGestures.values()).filter(g => g.accessibility)
      : [];
  }

  enableAccessibilityMode(enabled: boolean): void {
    this.accessibilityMode = enabled;
    this.initializeGestures(enabled);
  }

  getGestureHelp(context: string): { gesture: string; description: string }[] {
    const activeGestures = this.getActiveGestures(context);
    
    return activeGestures.map(gesture => ({
      gesture: this.formatGestureDescription(gesture.pattern),
      description: gesture.name
    }));
  }

  private formatGestureDescription(pattern: GesturePattern): string {
    let description = '';
    
    if (pattern.fingers && pattern.fingers > 1) {
      description += `${pattern.fingers}-finger `;
    }
    
    description += pattern.type;
    
    if (pattern.direction) {
      description += ` ${pattern.direction}`;
    }
    
    if (pattern.duration && pattern.duration > 1000) {
      description += ` (hold for ${pattern.duration / 1000}s)`;
    }
    
    return description;
  }

  trainCustomGesture(
    samples: { gestureData: any; expectedGesture: string }[]
  ): void {
    // In a real implementation, this would use machine learning
    // to improve gesture recognition accuracy
    console.log('Training custom gesture recognition with', samples.length, 'samples');
  }
}

export const gestureInteractionService = new GestureInteractionService();
