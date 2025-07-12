/**
 * VoiceNavigationService - Advanced voice guidance for turn-by-turn navigation
 * Provides natural, contextual voice instructions with gamification elements
 */

import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface VoiceSettings {
  enabled: boolean;
  language: string;
  rate: number;
  pitch: number;
  volume: number;
  voice?: string;
  earlyWarning: boolean; // Announce turns early
  distanceUnits: 'metric' | 'imperial';
  personalityMode: 'professional' | 'friendly' | 'energetic' | 'gamified';
}

export interface VoiceInstruction {
  id: string;
  text: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  type: 'direction' | 'warning' | 'arrival' | 'gamification' | 'encouragement';
  delay?: number; // Optional delay before speaking
  interruptible?: boolean;
}

const VOICE_SETTINGS_KEY = 'navilynx_voice_settings';
const GAMIFICATION_STATS_KEY = 'navilynx_gamification_stats';

interface GamificationStats {
  successfulNavigations: number;
  totalDistance: number;
  perfectTurns: number;
  level: number;
  experience: number;
  badges: string[];
  streak: number;
}

class VoiceNavigationService {
  private static instance: VoiceNavigationService;
  private settings: VoiceSettings;
  private isInitialized: boolean = false;
  private instructionQueue: VoiceInstruction[] = [];
  private currentlySeaking: boolean = false;
  private gamificationStats: GamificationStats;

  private readonly defaultSettings: VoiceSettings = {
    enabled: true,
    language: 'en-ZA', // South African English
    rate: 0.5,
    pitch: 1.0,
    volume: 1.0,
    earlyWarning: true,
    distanceUnits: 'metric',
    personalityMode: 'friendly'
  };

  private readonly defaultGamificationStats: GamificationStats = {
    successfulNavigations: 0,
    totalDistance: 0,
    perfectTurns: 0,
    level: 1,
    experience: 0,
    badges: [],
    streak: 0
  };

  private constructor() {
    this.settings = { ...this.defaultSettings };
    this.gamificationStats = { ...this.defaultGamificationStats };
    this.initialize();
  }

  public static getInstance(): VoiceNavigationService {
    if (!VoiceNavigationService.instance) {
      VoiceNavigationService.instance = new VoiceNavigationService();
    }
    return VoiceNavigationService.instance;
  }

  /**
   * Initialize voice service with saved settings
   */
  private async initialize(): Promise<void> {
    try {
      // Load saved settings
      const savedSettings = await AsyncStorage.getItem(VOICE_SETTINGS_KEY);
      if (savedSettings) {
        this.settings = { ...this.defaultSettings, ...JSON.parse(savedSettings) };
      }

      // Load gamification stats
      const savedStats = await AsyncStorage.getItem(GAMIFICATION_STATS_KEY);
      if (savedStats) {
        this.gamificationStats = { ...this.defaultGamificationStats, ...JSON.parse(savedStats) };
      }

      // Check available voices
      const voices = await Speech.getAvailableVoicesAsync();
      console.log('Available voices:', voices.length);

      // Set South African English voice if available
      const saVoice = voices.find(v => v.language === 'en-ZA' || v.language === 'en-GB');
      if (saVoice) {
        this.settings.voice = saVoice.identifier;
      }

      this.isInitialized = true;
      console.log('VoiceNavigationService initialized successfully');
    } catch (error) {
      console.error('Failed to initialize VoiceNavigationService:', error);
    }
  }

  /**
   * Public initialize method for external use
   */
  public async initializeService(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
      this.isInitialized = true;
    }
  }

  /**
   * Speak navigation instruction with context and gamification
   */
  public async speak(instruction: VoiceInstruction): Promise<void> {
    if (!this.settings.enabled || !this.isInitialized) return;

    try {
      // Add to queue if currently speaking
      if (this.currentlySeaking && instruction.interruptible !== false) {
        Speech.stop();
      }

      if (this.currentlySeaking && instruction.interruptible === false) {
        this.instructionQueue.push(instruction);
        return;
      }

      // Process instruction with personality and gamification
      const processedText = this.processInstructionText(instruction);

      // Apply delay if specified
      if (instruction.delay) {
        setTimeout(() => this.speakNow(processedText), instruction.delay);
      } else {
        await this.speakNow(processedText);
      }
    } catch (error) {
      console.error('Voice instruction error:', error);
    }
  }

  /**
   * Process instruction text with personality and gamification
   */
  private processInstructionText(instruction: VoiceInstruction): string {
    let text = instruction.text;

    // Add personality based on mode
    switch (this.settings.personalityMode) {
      case 'professional':
        // Keep text as is
        break;
      
      case 'friendly':
        text = this.addFriendlyTouch(text, instruction.type);
        break;
      
      case 'energetic':
        text = this.addEnergeticTouch(text, instruction.type);
        break;
      
      case 'gamified':
        text = this.addGamificationElements(text, instruction.type);
        break;
    }

    return text;
  }

  /**
   * Add friendly personality to instructions
   */
  private addFriendlyTouch(text: string, type: string): string {
    const friendlyPrefixes = [
      "Alright, ",
      "Okay, ",
      "Perfect! ",
      "Great! ",
      ""
    ];

    const friendlySuffixes = [
      " You're doing great!",
      " Keep it up!",
      " Almost there!",
      ""
    ];

    if (type === 'direction') {
      const prefix = friendlyPrefixes[Math.floor(Math.random() * friendlyPrefixes.length)];
      return `${prefix}${text}`;
    }

    if (type === 'encouragement') {
      const suffix = friendlySuffixes[Math.floor(Math.random() * friendlySuffixes.length)];
      return `${text}${suffix}`;
    }

    return text;
  }

  /**
   * Add energetic personality to instructions
   */
  private addEnergeticTouch(text: string, type: string): string {
    const energeticPrefixes = [
      "Let's go! ",
      "Awesome! ",
      "Fantastic! ",
      "Here we go! ",
      "Perfect! "
    ];

    if (type === 'direction') {
      const prefix = energeticPrefixes[Math.floor(Math.random() * energeticPrefixes.length)];
      return `${prefix}${text}`;
    }

    return text.replace(/\./g, '!');
  }

  /**
   * Add gamification elements to instructions
   */
  private addGamificationElements(text: string, type: string): string {
    const level = this.gamificationStats.level;
    const experience = this.gamificationStats.experience;

    if (type === 'direction') {
      // Add achievement-style language
      const gamifiedPhrases = [
        `Navigator level ${level}! `,
        `${experience} XP earned! `,
        "Quest objective: ",
        "Mission update: ",
        "Achievement unlocked: "
      ];

      const phrase = gamifiedPhrases[Math.floor(Math.random() * gamifiedPhrases.length)];
      return `${phrase}${text}`;
    }

    if (type === 'arrival') {
      return `🎉 Mission accomplished! ${text} You've earned ${Math.floor(Math.random() * 50 + 25)} XP!`;
    }

    return text;
  }

  /**
   * Actually speak the text
   */
  private async speakNow(text: string): Promise<void> {
    this.currentlySeaking = true;

    const options: Speech.SpeechOptions = {
      language: this.settings.language,
      rate: this.settings.rate,
      pitch: this.settings.pitch,
      volume: this.settings.volume,
      voice: this.settings.voice,
      onDone: () => {
        this.currentlySeaking = false;
        this.processQueue();
      },
      onError: (error) => {
        console.error('Speech error:', error);
        this.currentlySeaking = false;
        this.processQueue();
      }
    };

    await Speech.speak(text, options);
  }

  /**
   * Process queued instructions
   */
  private processQueue(): void {
    if (this.instructionQueue.length > 0 && !this.currentlySeaking) {
      const nextInstruction = this.instructionQueue.shift();
      if (nextInstruction) {
        this.speak(nextInstruction);
      }
    }
  }

  /**
   * Generate turn-by-turn instruction
   */
  public generateTurnInstruction(
    maneuver: string,
    distance: string,
    streetName?: string,
    isEarlyWarning: boolean = false
  ): VoiceInstruction {
    const distanceText = this.formatDistance(distance);
    let instruction = '';

    // Early warning (500m+ before turn)
    if (isEarlyWarning) {
      instruction = `In ${distanceText}, you'll need to ${this.formatManeuver(maneuver)}`;
      if (streetName) {
        instruction += ` onto ${streetName}`;
      }
      return {
        id: `early_${Date.now()}`,
        text: instruction,
        priority: 'normal',
        type: 'direction',
        interruptible: true
      };
    }

    // Immediate instruction (50m before turn)
    instruction = `${this.formatManeuver(maneuver)}`;
    if (streetName) {
      instruction += ` onto ${streetName}`;
    }
    
    if (distance !== '0 m') {
      instruction = `In ${distanceText}, ${instruction.toLowerCase()}`;
    }

    return {
      id: `turn_${Date.now()}`,
      text: instruction,
      priority: 'high',
      type: 'direction',
      interruptible: false
    };
  }

  /**
   * Format maneuver for natural speech
   */
  private formatManeuver(maneuver: string): string {
    const maneuverMap: { [key: string]: string } = {
      'turn-left': 'turn left',
      'turn-right': 'turn right',
      'turn-slight-left': 'bear left',
      'turn-slight-right': 'bear right',
      'turn-sharp-left': 'turn sharply left',
      'turn-sharp-right': 'turn sharply right',
      'straight': 'continue straight',
      'ramp-left': 'take the ramp on the left',
      'ramp-right': 'take the ramp on the right',
      'merge': 'merge',
      'fork-left': 'take the left fork',
      'fork-right': 'take the right fork',
      'ferry': 'take the ferry',
      'roundabout-left': 'take the roundabout and exit left',
      'roundabout-right': 'take the roundabout and exit right'
    };

    return maneuverMap[maneuver] || maneuver;
  }

  /**
   * Format distance for natural speech
   */
  private formatDistance(distance: string): string {
    if (this.settings.distanceUnits === 'metric') {
      return distance.replace(' m', ' meters').replace(' km', ' kilometers');
    } else {
      // Convert to imperial if needed
      const meters = parseInt(distance.replace(/[^0-9]/g, ''));
      if (meters < 1609) {
        const feet = Math.round(meters * 3.28084);
        return `${feet} feet`;
      } else {
        const miles = (meters / 1609.34).toFixed(1);
        return `${miles} miles`;
      }
    }
  }

  /**
   * Announce arrival at destination
   */
  public announceArrival(venueName: string): void {
    const instruction: VoiceInstruction = {
      id: `arrival_${Date.now()}`,
      text: `You have arrived at ${venueName}. Navigation complete!`,
      priority: 'high',
      type: 'arrival',
      interruptible: false
    };

    this.speak(instruction);
    this.updateGamificationStats('navigation_complete');
  }

  /**
   * Announce off-route detection
   */
  public announceOffRoute(): void {
    const instruction: VoiceInstruction = {
      id: `offroute_${Date.now()}`,
      text: "Route deviation detected. Recalculating route...",
      priority: 'urgent',
      type: 'warning',
      interruptible: false
    };

    this.speak(instruction);
  }

  /**
   * Update gamification statistics
   */
  public updateGamificationStats(action: 'perfect_turn' | 'navigation_complete' | 'distance_traveled', value?: number): void {
    switch (action) {
      case 'perfect_turn':
        this.gamificationStats.perfectTurns++;
        this.gamificationStats.experience += 10;
        break;
      
      case 'navigation_complete':
        this.gamificationStats.successfulNavigations++;
        this.gamificationStats.experience += 50;
        this.gamificationStats.streak++;
        break;
      
      case 'distance_traveled':
        if (value) {
          this.gamificationStats.totalDistance += value;
          this.gamificationStats.experience += Math.floor(value / 100); // 1 XP per 100m
        }
        break;
    }

    // Level up logic
    const newLevel = Math.floor(this.gamificationStats.experience / 100) + 1;
    if (newLevel > this.gamificationStats.level) {
      this.gamificationStats.level = newLevel;
      this.announceLevelUp(newLevel);
    }

    // Save stats
    this.saveGamificationStats();
  }

  /**
   * Announce achievement unlock
   */
  public announceAchievement(title: string, description: string): void {
    if (!this.settings.enabled) return;

    const instruction: VoiceInstruction = {
      id: `achievement_${Date.now()}`,
      text: `Achievement unlocked! ${title}: ${description}`,
      priority: 'normal',
      type: 'gamification',
      interruptible: false,
    };

    this.speak(instruction);
  }

  /**
   * Announce level up
   */
  public announceLevelUp(newLevel: number): void {
    if (!this.settings.enabled) return;

    const instruction: VoiceInstruction = {
      id: `level_up_${Date.now()}`,
      text: `Level up! You're now level ${newLevel}. Great job!`,
      priority: 'normal',
      type: 'gamification',
      interruptible: false,
    };

    this.speak(instruction);
  }

  /**
   * Save gamification stats
   */
  private async saveGamificationStats(): Promise<void> {
    try {
      await AsyncStorage.setItem(GAMIFICATION_STATS_KEY, JSON.stringify(this.gamificationStats));
    } catch (error) {
      console.error('Failed to save gamification stats:', error);
    }
  }

  /**
   * Update voice settings
   */
  public async updateSettings(newSettings: Partial<VoiceSettings>): Promise<void> {
    this.settings = { ...this.settings, ...newSettings };
    
    try {
      await AsyncStorage.setItem(VOICE_SETTINGS_KEY, JSON.stringify(this.settings));
    } catch (error) {
      console.error('Failed to save voice settings:', error);
    }
  }

  /**
   * Get current settings
   */
  public getSettings(): VoiceSettings {
    return { ...this.settings };
  }

  /**
   * Get gamification stats
   */
  public getGamificationStats(): GamificationStats {
    return { ...this.gamificationStats };
  }

  /**
   * Stop all speech
   */
  public stop(): void {
    Speech.stop();
    this.currentlySeaking = false;
    this.instructionQueue = [];
  }

  /**
   * Test voice with sample instruction
   */
  public async testVoice(): Promise<void> {
    const testInstruction: VoiceInstruction = {
      id: 'test',
      text: "Voice navigation test. NaviLynx is ready to guide you!",
      priority: 'normal',
      type: 'direction'
    };

    await this.speak(testInstruction);
  }
}

export default VoiceNavigationService;
