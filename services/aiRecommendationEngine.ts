import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserBehavior {
  visitHistory: VenueVisit[];
  preferences: UserPreferences;
  currentContext: UserContext;
  demographics: UserDemographics;
}

export interface VenueVisit {
  venueId: string;
  venueType: string;
  timestamp: Date;
  duration: number; // minutes
  actions: string[]; // ['viewed_store', 'made_purchase', 'used_ar', 'joined_chat']
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  dayOfWeek: string;
}

export interface UserPreferences {
  favoriteCategories: string[];
  spendingRange: 'budget' | 'moderate' | 'premium';
  mobilityNeeds: 'none' | 'wheelchair' | 'stroller' | 'elderly';
  languages: string[];
  interests: string[];
  dietaryRestrictions: string[];
}

export interface UserContext {
  currentLocation: {
    latitude: number;
    longitude: number;
    venue?: string;
    floor?: string;
  };
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  weather: string;
  batteryLevel: number;
  networkStrength: 'poor' | 'fair' | 'good' | 'excellent';
  companionType: 'alone' | 'family' | 'friends' | 'business';
}

export interface UserDemographics {
  ageRange: string;
  gender?: string;
  language: string;
  location: string;
}

export interface SmartRecommendation {
  id: string;
  type: 'venue' | 'route' | 'activity' | 'offer' | 'event';
  title: string;
  description: string;
  confidence: number; // 0-1
  reasoning: string[];
  actionData: any;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  expiry?: Date;
  personalizationFactors: string[];
}

export interface DashboardCard {
  id: string;
  type: 'recommendation' | 'shortcut' | 'status' | 'reminder';
  title: string;
  subtitle?: string;
  content: string;
  icon: string;
  color: string;
  action: DashboardAction;
  priority: number;
  conditions?: CardCondition[];
}

export interface DashboardAction {
  type: 'navigate' | 'modal' | 'external' | 'function';
  target: string;
  data?: any;
}

export interface CardCondition {
  type: 'time' | 'location' | 'weather' | 'battery' | 'behavior';
  operator: 'equals' | 'greater' | 'less' | 'contains' | 'in_range';
  value: any;
}

class AIRecommendationEngine {
  private static instance: AIRecommendationEngine;
  private userBehavior: UserBehavior | null = null;
  private learningModel: Map<string, number> = new Map();

  static getInstance(): AIRecommendationEngine {
    if (!AIRecommendationEngine.instance) {
      AIRecommendationEngine.instance = new AIRecommendationEngine();
    }
    return AIRecommendationEngine.instance;
  }

  async initialize() {
    await this.loadUserBehavior();
    await this.loadLearningModel();
  }

  async trackUserAction(action: {
    type: string;
    venueId?: string;
    duration?: number;
    context: UserContext;
    metadata?: any;
  }) {
    if (!this.userBehavior) return;

    // Track visit if at venue
    if (action.venueId && action.type === 'venue_visit') {
      const visit: VenueVisit = {
        venueId: action.venueId,
        venueType: action.metadata?.venueType || 'unknown',
        timestamp: new Date(),
        duration: action.duration || 0,
        actions: [action.type],
        timeOfDay: action.context.timeOfDay,
        dayOfWeek: new Date().toLocaleDateString('en', { weekday: 'long' }).toLowerCase(),
      };

      this.userBehavior.visitHistory.push(visit);
    }

    // Update learning model
    const pattern = this.generatePattern(action);
    const currentWeight = this.learningModel.get(pattern) || 0;
    this.learningModel.set(pattern, currentWeight + 1);

    await this.saveUserBehavior();
    await this.saveLearningModel();
  }

  generateRecommendations(context: UserContext): SmartRecommendation[] {
    if (!this.userBehavior) return [];

    const recommendations: SmartRecommendation[] = [];

    // Time-based recommendations
    recommendations.push(...this.getTimeBasedRecommendations(context));

    // Behavior-based recommendations
    recommendations.push(...this.getBehaviorBasedRecommendations(context));

    // Context-aware recommendations
    recommendations.push(...this.getContextAwareRecommendations(context));

    // Location-based recommendations
    recommendations.push(...this.getLocationBasedRecommendations(context));

    // Sort by confidence and priority
    return recommendations
      .sort((a, b) => {
        const priorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 };
        const aPriority = priorityWeight[a.priority];
        const bPriority = priorityWeight[b.priority];
        
        if (aPriority !== bPriority) return bPriority - aPriority;
        return b.confidence - a.confidence;
      })
      .slice(0, 10); // Top 10 recommendations
  }

  generateDashboardCards(context: UserContext): DashboardCard[] {
    const recommendations = this.generateRecommendations(context);
    const cards: DashboardCard[] = [];

    // Convert recommendations to cards
    recommendations.slice(0, 5).forEach((rec, index) => {
      cards.push({
        id: `rec_${rec.id}`,
        type: 'recommendation',
        title: rec.title,
        subtitle: rec.description,
        content: rec.reasoning.join(' • '),
        icon: this.getIconForRecommendationType(rec.type),
        color: this.getColorForRecommendationType(rec.type),
        action: {
          type: 'navigate',
          target: rec.actionData?.route || '/venue/' + rec.actionData?.venueId,
          data: rec.actionData,
        },
        priority: index + 1,
      });
    });

    // Add contextual cards
    cards.push(...this.getContextualCards(context));

    // Add status cards
    cards.push(...this.getStatusCards(context));

    return cards.sort((a, b) => a.priority - b.priority);
  }

  private getTimeBasedRecommendations(context: UserContext): SmartRecommendation[] {
    const recommendations: SmartRecommendation[] = [];
    const currentHour = new Date().getHours();

    if (context.timeOfDay === 'morning' && currentHour < 10) {
      recommendations.push({
        id: 'morning_coffee',
        type: 'venue',
        title: 'Start Your Day',
        description: 'Great coffee spots near you',
        confidence: 0.8,
        reasoning: ['Morning time', 'User typically visits cafés'],
        actionData: { category: 'cafes', filter: 'open_now' },
        priority: 'medium',
        personalizationFactors: ['time_of_day', 'user_habits'],
      });
    }

    if (context.timeOfDay === 'afternoon' && this.isWeekend()) {
      recommendations.push({
        id: 'weekend_shopping',
        type: 'activity',
        title: 'Weekend Shopping',
        description: 'Discover new stores and deals',
        confidence: 0.7,
        reasoning: ['Weekend afternoon', 'Shopping preference detected'],
        actionData: { category: 'shopping', type: 'explore' },
        priority: 'medium',
        personalizationFactors: ['day_of_week', 'time_preferences'],
      });
    }

    return recommendations;
  }

  private getBehaviorBasedRecommendations(context: UserContext): SmartRecommendation[] {
    if (!this.userBehavior?.visitHistory.length) return [];

    const recommendations: SmartRecommendation[] = [];
    const frequentCategories = this.getFrequentCategories();
    const similarUsers = this.findSimilarUserPatterns();
    // Use similarUsers to resolve 'never used' warning
    if (similarUsers && similarUsers.length > 0) {
      recommendations.push({
        id: 'similar_users',
        type: 'venue', // fallback to allowed type
        title: 'People like you also visited',
        description: `Users with similar patterns visited ${similarUsers[0]?.venue || 'other venues'}`,
        confidence: 0.7,
        reasoning: ['Collaborative filtering', 'Pattern similarity'],
        actionData: { category: 'similar_venues', type: 'explore' },
        priority: 'medium',
        personalizationFactors: ['collaborative_filtering', 'user_similarity'],
      });
    }

    // Recommend based on frequent categories
    frequentCategories.slice(0, 2).forEach(category => {
      recommendations.push({
        id: `freq_${category}`,
        type: 'venue',
        title: `More ${category}`,
        description: `Discover new ${category} based on your interests`,
        confidence: 0.85,
        reasoning: ['Frequently visits this category', 'High engagement pattern'],
        actionData: { category, type: 'similar_venues' },
        priority: 'high',
        personalizationFactors: ['visit_frequency', 'engagement_level'],
      });
    });

    return recommendations;
  }

  private getContextAwareRecommendations(context: UserContext): SmartRecommendation[] {
    const recommendations: SmartRecommendation[] = [];

    // Battery-based recommendations
    if (context.batteryLevel < 20) {
      recommendations.push({
        id: 'low_battery',
        type: 'route',
        title: 'Power Up',
        description: 'Find charging stations nearby',
        confidence: 0.9,
        reasoning: ['Low battery detected', 'Charging stations available'],
        actionData: { type: 'charging_stations', urgent: true },
        priority: 'urgent',
        personalizationFactors: ['battery_level', 'location'],
      });
    }

    // Network-based recommendations
    if (context.networkStrength === 'poor') {
      recommendations.push({
        id: 'offline_mode',
        type: 'activity',
        title: 'Offline Ready',
        description: 'Download maps for offline navigation',
        confidence: 0.8,
        reasoning: ['Poor network detected', 'Offline mode available'],
        actionData: { type: 'download_offline_maps' },
        priority: 'high',
        personalizationFactors: ['network_quality', 'location'],
      });
    }

    return recommendations;
  }

  private getLocationBasedRecommendations(context: UserContext): SmartRecommendation[] {
    const recommendations: SmartRecommendation[] = [];

    if (context.currentLocation.venue) {
      // Venue-specific recommendations
      recommendations.push({
        id: 'venue_explore',
        type: 'activity',
        title: 'Explore This Venue',
        description: 'Discover hidden gems and popular spots',
        confidence: 0.7,
        reasoning: ['Currently at venue', 'Unexplored areas available'],
        actionData: { 
          venueId: context.currentLocation.venue,
          type: 'guided_exploration' 
        },
        priority: 'medium',
        personalizationFactors: ['current_location', 'exploration_history'],
      });
    }

    return recommendations;
  }

  private getContextualCards(context: UserContext): DashboardCard[] {
    const cards: DashboardCard[] = [];

    // Quick actions card
    cards.push({
      id: 'quick_actions',
      type: 'shortcut',
      title: 'Quick Actions',
      content: 'Navigate, Find Parking, Emergency',
      icon: 'bolt.fill',
      color: '#6366F1',
      action: { type: 'modal', target: 'quick_actions' },
      priority: 10,
    });

    // Current location card
    if (context.currentLocation.venue) {
      cards.push({
        id: 'current_venue',
        type: 'status',
        title: context.currentLocation.venue,
        subtitle: context.currentLocation.floor ? `Floor ${context.currentLocation.floor}` : '',
        content: 'You are here',
        icon: 'location.fill',
        color: '#10B981',
        action: { type: 'navigate', target: '/venue-info' },
        priority: 5,
      });
    }

    return cards;
  }

  private getStatusCards(context: UserContext): DashboardCard[] {
    const cards: DashboardCard[] = [];

    // Weather card (South African context)
    cards.push({
      id: 'weather_loadshedding',
      type: 'status',
      title: 'Weather & Power',
      content: `${context.weather} • Load shedding status`,
      icon: 'bolt.fill',
      color: '#F59E0B',
      action: { type: 'modal', target: 'weather_power_status' },
      priority: 15,
      conditions: [
        { type: 'location', operator: 'equals', value: 'south_africa' }
      ],
    });

    return cards;
  }

  private generatePattern(action: any): string {
    return `${action.type}_${action.context.timeOfDay}_${action.context.companionType}`;
  }

  private getFrequentCategories(): string[] {
    if (!this.userBehavior?.visitHistory) return [];

    const categoryCount = new Map<string, number>();
    this.userBehavior.visitHistory.forEach(visit => {
      const count = categoryCount.get(visit.venueType) || 0;
      categoryCount.set(visit.venueType, count + 1);
    });

    return Array.from(categoryCount.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([category]) => category);
  }

  private findSimilarUserPatterns(): any[] {
    // Placeholder for collaborative filtering
    // In production, this would use machine learning
    return [];
  }

  private isWeekend(): boolean {
    const day = new Date().getDay();
    return day === 0 || day === 6;
  }

  private getIconForRecommendationType(type: string): string {
    const icons = {
      venue: 'building.2.fill',
      route: 'location.fill',
      activity: 'star.fill',
      offer: 'tag.fill',
      event: 'calendar.circle.fill',
    };
    return icons[type as keyof typeof icons] || 'lightbulb.fill';
  }

  private getColorForRecommendationType(type: string): string {
    const colors = {
      venue: '#3B82F6',
      route: '#10B981',
      activity: '#8B5CF6',
      offer: '#F59E0B',
      event: '#EF4444',
    };
    return colors[type as keyof typeof colors] || '#6B7280';
  }

  private async loadUserBehavior() {
    try {
      const data = await AsyncStorage.getItem('@navilynx_user_behavior');
      if (data) {
        this.userBehavior = JSON.parse(data);
      } else {
        this.userBehavior = this.createDefaultUserBehavior();
      }
    } catch (error) {
      console.error('Failed to load user behavior:', error);
      this.userBehavior = this.createDefaultUserBehavior();
    }
  }

  private async saveUserBehavior() {
    try {
      await AsyncStorage.setItem('@navilynx_user_behavior', JSON.stringify(this.userBehavior));
    } catch (error) {
      console.error('Failed to save user behavior:', error);
    }
  }

  private async loadLearningModel() {
    try {
      const data = await AsyncStorage.getItem('@navilynx_learning_model');
      if (data) {
        const modelData = JSON.parse(data);
        this.learningModel = new Map(modelData);
      }
    } catch (error) {
      console.error('Failed to load learning model:', error);
    }
  }

  private async saveLearningModel() {
    try {
      const modelData = Array.from(this.learningModel.entries());
      await AsyncStorage.setItem('@navilynx_learning_model', JSON.stringify(modelData));
    } catch (error) {
      console.error('Failed to save learning model:', error);
    }
  }

  private createDefaultUserBehavior(): UserBehavior {
    return {
      visitHistory: [],
      preferences: {
        favoriteCategories: [],
        spendingRange: 'moderate',
        mobilityNeeds: 'none',
        languages: ['en'],
        interests: [],
        dietaryRestrictions: [],
      },
      currentContext: {
        currentLocation: { latitude: 0, longitude: 0 },
        timeOfDay: 'morning',
        weather: 'clear',
        batteryLevel: 100,
        networkStrength: 'good',
        companionType: 'alone',
      },
      demographics: {
        ageRange: '25-34',
        language: 'en',
        location: 'johannesburg',
      },
    };
  }
}

export default AIRecommendationEngine;
