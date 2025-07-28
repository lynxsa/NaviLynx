/**
 * Enhanced AR User Experience Service
 * Provides voice instructions, haptic feedback, and accessibility features
 * Integrates with Shop Assistant for seamless shopping navigation
 */

import * as Haptics from 'expo-haptics';
import { Linking, Alert } from 'react-native';
import ShopAssistantService from './ShopAssistantService';
import PriceComparisonService from './PriceComparisonService';

export interface VoiceInstruction {
  id: string;
  text: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  type: 'navigation' | 'shopping' | 'warning' | 'information';
  audioFile?: string;
  hapticPattern?: Haptics.ImpactFeedbackStyle;
}

export interface ARAccessibilitySettings {
  voiceEnabled: boolean;
  hapticEnabled: boolean;
  highContrast: boolean;
  largeText: boolean;
  slowAnimations: boolean;
  audioDescriptions: boolean;
  reducedMotion: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}

export interface ShoppingIntegrationData {
  nearbyDeals: any[];
  priceAlerts: any[];
  shoppingList: any[];
  recommendations: any[];
}

export class ARUserExperienceService {
  private static instance: ARUserExperienceService;
  private shopAssistant: ShopAssistantService;
  private priceComparison: PriceComparisonService;
  private accessibilitySettings: ARAccessibilitySettings;
  private voiceQueue: VoiceInstruction[] = [];
  private isPlayingVoice: boolean = false;
  private lastHapticTime: number = 0;
  private hapticCooldown: number = 500; // ms

  private constructor() {
    this.shopAssistant = ShopAssistantService.getInstance();
    this.priceComparison = PriceComparisonService.getInstance();
    
    this.accessibilitySettings = {
      voiceEnabled: true,
      hapticEnabled: true,
      highContrast: false,
      largeText: false,
      slowAnimations: false,
      audioDescriptions: false,
      reducedMotion: false,
      colorBlindMode: 'none'
    };

    this.initializeAudio();
  }

  public static getInstance(): ARUserExperienceService {
    if (!ARUserExperienceService.instance) {
      ARUserExperienceService.instance = new ARUserExperienceService();
    }
    return ARUserExperienceService.instance;
  }

  private async initializeAudio(): Promise<void> {
    try {
      // Audio initialization placeholder for voice synthesis
      console.log('AR UX: Audio system initialized');
    } catch (error) {
      console.warn('AR UX: Failed to initialize audio:', error);
    }
  }

  // Voice Instructions
  public async addVoiceInstruction(instruction: VoiceInstruction): Promise<void> {
    if (!this.accessibilitySettings.voiceEnabled) return;

    // Add to queue based on priority
    if (instruction.priority === 'critical') {
      this.voiceQueue.unshift(instruction);
    } else {
      this.voiceQueue.push(instruction);
    }

    // Start processing if not already playing
    if (!this.isPlayingVoice) {
      await this.processVoiceQueue();
    }
  }

  private async processVoiceQueue(): Promise<void> {
    if (this.voiceQueue.length === 0 || this.isPlayingVoice) return;

    this.isPlayingVoice = true;
    const instruction = this.voiceQueue.shift()!;

    try {
      // Trigger haptic feedback if enabled
      if (this.accessibilitySettings.hapticEnabled && instruction.hapticPattern) {
        await this.triggerHapticFeedback(instruction.hapticPattern);
      }

      // Play voice instruction
      await this.speakText(instruction.text);
      
    } catch (error) {
      console.warn('AR UX: Failed to play voice instruction:', error);
    } finally {
      this.isPlayingVoice = false;
      
      // Process next instruction after a brief delay
      setTimeout(() => {
        this.processVoiceQueue();
      }, 500);
    }
  }

  private async speakText(text: string): Promise<void> {
    // Use device's text-to-speech or play pre-recorded audio
    // For now, using alert as placeholder for TTS
    console.log('AR Voice:', text);
  }

  // Haptic Feedback
  public async triggerHapticFeedback(
    style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Medium
  ): Promise<void> {
    if (!this.accessibilitySettings.hapticEnabled) return;

    const now = Date.now();
    if (now - this.lastHapticTime < this.hapticCooldown) return;

    try {
      await Haptics.impactAsync(style);
      this.lastHapticTime = now;
    } catch (error) {
      console.warn('AR UX: Failed to trigger haptic feedback:', error);
    }
  }

  // Navigation Instructions
  public async announceNavigationStep(direction: string, distance: number, landmark?: string): Promise<void> {
    let instruction = `${direction}`;
    
    if (distance > 0) {
      instruction += ` in ${distance} meters`;
    }
    
    if (landmark) {
      instruction += ` towards ${landmark}`;
    }

    await this.addVoiceInstruction({
      id: `nav_${Date.now()}`,
      text: instruction,
      priority: 'medium',
      type: 'navigation',
      hapticPattern: Haptics.ImpactFeedbackStyle.Light
    });
  }

  public async announceDestinationReached(destinationName: string): Promise<void> {
    await this.addVoiceInstruction({
      id: `dest_${Date.now()}`,
      text: `You have arrived at ${destinationName}`,
      priority: 'high',
      type: 'navigation',
      hapticPattern: Haptics.ImpactFeedbackStyle.Heavy
    });
  }

  // Shopping Integration
  public async getShoppingIntegrationData(venueId: string): Promise<ShoppingIntegrationData> {
    try {
      // Simplified integration using available methods
      const shoppingLists = await this.shopAssistant.getShoppingLists();
      const priceAlerts = await this.priceComparison.getPriceAlerts();
      
      return {
        nearbyDeals: [], // Placeholder for future implementation
        priceAlerts: priceAlerts || [],
        shoppingList: shoppingLists || [],
        recommendations: [] // Placeholder for future implementation
      };
    } catch (error) {
      console.error('AR UX: Failed to get shopping integration data:', error);
      return {
        nearbyDeals: [],
        priceAlerts: [],
        shoppingList: [],
        recommendations: []
      };
    }
  }

  public async announceNearbyDeal(dealTitle: string, discount: string, store: string): Promise<void> {
    const text = `Deal alert: ${discount} off ${dealTitle} at ${store}`;
    
    await this.addVoiceInstruction({
      id: `deal_${Date.now()}`,
      text,
      priority: 'medium',
      type: 'shopping',
      hapticPattern: Haptics.ImpactFeedbackStyle.Medium
    });
  }

  public async announcePriceAlert(productName: string, newPrice: string, savings: string): Promise<void> {
    const text = `Price drop alert: ${productName} is now ${newPrice}, saving you ${savings}`;
    
    await this.addVoiceInstruction({
      id: `price_${Date.now()}`,
      text,
      priority: 'high',
      type: 'shopping',
      hapticPattern: Haptics.ImpactFeedbackStyle.Heavy
    });
  }

  public async announceShoppingListItem(itemName: string, isNearby: boolean): Promise<void> {
    const text = isNearby 
      ? `${itemName} from your shopping list is available nearby`
      : `Reminder: ${itemName} is on your shopping list`;
    
    await this.addVoiceInstruction({
      id: `list_${Date.now()}`,
      text,
      priority: 'low',
      type: 'shopping',
      hapticPattern: Haptics.ImpactFeedbackStyle.Light
    });
  }

  // Warning and Safety
  public async announceWarning(message: string): Promise<void> {
    await this.addVoiceInstruction({
      id: `warning_${Date.now()}`,
      text: `Warning: ${message}`,
      priority: 'critical',
      type: 'warning',
      hapticPattern: Haptics.ImpactFeedbackStyle.Heavy
    });
  }

  public async announceObstacle(obstacleType: string): Promise<void> {
    await this.announceWarning(`${obstacleType} detected ahead`);
  }

  // Accessibility Settings
  public updateAccessibilitySettings(settings: Partial<ARAccessibilitySettings>): void {
    this.accessibilitySettings = { ...this.accessibilitySettings, ...settings };
    
    // Apply settings immediately
    this.applyAccessibilitySettings();
  }

  public getAccessibilitySettings(): ARAccessibilitySettings {
    return { ...this.accessibilitySettings };
  }

  private applyAccessibilitySettings(): void {
    // Clear voice queue if voice disabled
    if (!this.accessibilitySettings.voiceEnabled) {
      this.voiceQueue = [];
      this.isPlayingVoice = false;
    }

    // Adjust haptic cooldown based on settings
    if (this.accessibilitySettings.reducedMotion) {
      this.hapticCooldown = 1000; // Longer cooldown for reduced motion
    } else {
      this.hapticCooldown = 500; // Normal cooldown
    }
  }

  // Color Blindness Support
  public getColorForType(type: string, originalColor: string): string {
    if (this.accessibilitySettings.colorBlindMode === 'none') {
      return originalColor;
    }

    // Color mappings for different types of color blindness
    const colorMappings: Record<string, Record<string, string>> = {
      protanopia: {
        '#FF4081': '#FFB74D', // Pink to Orange
        '#2196F3': '#42A5F5', // Blue (easier to see)
        '#4CAF50': '#66BB6A', // Green (adjusted)
        '#FFC107': '#FFE082', // Yellow (brighter)
      },
      deuteranopia: {
        '#FF4081': '#FF7043', // Pink to Deep Orange
        '#4CAF50': '#42A5F5', // Green to Blue
        '#FFC107': '#FFE082', // Yellow (brighter)
      },
      tritanopia: {
        '#2196F3': '#9C27B0', // Blue to Purple
        '#FFC107': '#FF5722', // Yellow to Deep Orange
      }
    };

    const mapping = colorMappings[this.accessibilitySettings.colorBlindMode];
    return mapping?.[originalColor] || originalColor;
  }

  // Context-Aware Assistance
  public async provideContextualAssistance(location: string, userIntent: string): Promise<void> {
    try {
      // Simplified contextual assistance
      const contextualMessage = `Looking for ${userIntent} at ${location}? Check nearby stores for the best options.`;
      
      await this.addVoiceInstruction({
        id: `context_${Date.now()}`,
        text: contextualMessage,
        priority: 'low',
        type: 'information'
      });
    } catch {
      // Fallback to generic assistance
      await this.addVoiceInstruction({
        id: `context_${Date.now()}`,
        text: `Navigation assistance available. Say your destination to get started.`,
        priority: 'low',
        type: 'information'
      });
    }
  }

  // Emergency Features
  public async triggerEmergencyAlert(): Promise<void> {
    await this.announceWarning('Emergency mode activated. Help is on the way.');
    
    // Trigger emergency haptic pattern
    for (let i = 0; i < 3; i++) {
      await this.triggerHapticFeedback(Haptics.ImpactFeedbackStyle.Heavy);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  public async openEmergencyContacts(): Promise<void> {
    try {
      await Linking.openURL('tel:911');
    } catch {
      Alert.alert('Emergency', 'Please dial emergency services manually');
    }
  }

  // Cleanup
  public dispose(): void {
    this.voiceQueue = [];
    this.isPlayingVoice = false;
  }
}

export default ARUserExperienceService;
