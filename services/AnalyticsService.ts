/**
 * 📊 Analytics Service - NaviLynx Production
 * 
 * Comprehensive analytics tracking for investor dashboard
 * Real-time user behavior, navigation patterns, and business metrics
 * 
 * @author Senior Architect
 * @version 1.0.0 - Investor Ready
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Event types for comprehensive tracking
export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  timestamp: Date;
  userId?: string;
  sessionId: string;
  data: Record<string, any>;
  location?: {
    latitude?: number;
    longitude?: number;
    venue?: string;
  };
}

export enum AnalyticsEventType {
  // User engagement
  APP_OPENED = 'app_opened',
  APP_CLOSED = 'app_closed',
  SCREEN_VIEW = 'screen_view',
  USER_INTERACTION = 'user_interaction',
  
  // Navigation events
  NAVIGATION_STARTED = 'navigation_started',
  NAVIGATION_COMPLETED = 'navigation_completed',
  ROUTE_CALCULATED = 'route_calculated',
  WAYPOINT_REACHED = 'waypoint_reached',
  
  // Venue interactions
  VENUE_VIEWED = 'venue_viewed',
  VENUE_SEARCHED = 'venue_searched',
  VENUE_FAVORITED = 'venue_favorited',
  STORE_VISITED = 'store_visited',
  
  // Store card wallet
  CARD_SCANNED = 'card_scanned',
  CARD_USED = 'card_used',
  WALLET_OPENED = 'wallet_opened',
  
  // AR features
  AR_SESSION_STARTED = 'ar_session_started',
  AR_SESSION_ENDED = 'ar_session_ended',
  AR_MARKER_DETECTED = 'ar_marker_detected',
  
  // Business metrics
  DEAL_VIEWED = 'deal_viewed',
  DEAL_SHARED = 'deal_shared',
  PROMOTION_CLICKED = 'promotion_clicked',
  
  // Errors and performance
  ERROR_OCCURRED = 'error_occurred',
  PERFORMANCE_METRIC = 'performance_metric',
  NETWORK_ERROR = 'network_error'
}

export interface UserSession {
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  screenViews: number;
  interactions: number;
  venuesVisited: string[];
  cardsUsed: number;
  errorsEncountered: number;
}

export interface BusinessMetrics {
  dailyActiveUsers: number;
  monthlyActiveUsers: number;
  averageSessionDuration: number;
  venueEngagementRate: number;
  cardWalletAdoption: number;
  dealConversionRate: number;
  arUsageRate: number;
  retentionRate: {
    day1: number;
    day7: number;
    day30: number;
  };
}

/**
 * Analytics Service Class
 */
export class AnalyticsService {
  private static currentSession: UserSession | null = null;
  private static eventQueue: AnalyticsEvent[] = [];
  private static isInitialized = false;

  /**
   * Initialize analytics service
   */
  static async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Generate or retrieve session ID
      const sessionId = await this.generateSessionId();
      
      // Start new session
      this.currentSession = {
        sessionId,
        startTime: new Date(),
        screenViews: 0,
        interactions: 0,
        venuesVisited: [],
        cardsUsed: 0,
        errorsEncountered: 0
      };

      // Track app opened
      await this.trackEvent(AnalyticsEventType.APP_OPENED, {
        version: '1.0.0',
        platform: 'mobile',
        firstLaunch: await this.isFirstLaunch()
      });

      this.isInitialized = true;
      console.log('📊 Analytics service initialized');
    } catch (error) {
      console.error('Failed to initialize analytics:', error);
    }
  }

  /**
   * Track analytics event
   */
  static async trackEvent(
    type: AnalyticsEventType,
    data: Record<string, any> = {},
    location?: { latitude?: number; longitude?: number; venue?: string }
  ): Promise<void> {
    try {
      const event: AnalyticsEvent = {
        id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        timestamp: new Date(),
        sessionId: this.currentSession?.sessionId || 'unknown',
        data,
        location
      };

      // Add to queue
      this.eventQueue.push(event);

      // Update session stats
      if (this.currentSession) {
        if (type === AnalyticsEventType.SCREEN_VIEW) {
          this.currentSession.screenViews++;
        } else if (type === AnalyticsEventType.USER_INTERACTION) {
          this.currentSession.interactions++;
        } else if (type === AnalyticsEventType.VENUE_VIEWED && data.venueId) {
          if (!this.currentSession.venuesVisited.includes(data.venueId)) {
            this.currentSession.venuesVisited.push(data.venueId);
          }
        } else if (type === AnalyticsEventType.CARD_USED) {
          this.currentSession.cardsUsed++;
        } else if (type === AnalyticsEventType.ERROR_OCCURRED) {
          this.currentSession.errorsEncountered++;
        }
      }

      // Save event to storage
      await this.saveEvent(event);

      // Batch upload if queue is large
      if (this.eventQueue.length >= 50) {
        await this.uploadEvents();
      }

      console.log(`📊 Tracked: ${type}`, data);
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  /**
   * Track screen view
   */
  static async trackScreenView(screenName: string, params?: Record<string, any>): Promise<void> {
    await this.trackEvent(AnalyticsEventType.SCREEN_VIEW, {
      screenName,
      ...params,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track user interaction
   */
  static async trackInteraction(
    element: string,
    action: string,
    value?: string | number
  ): Promise<void> {
    await this.trackEvent(AnalyticsEventType.USER_INTERACTION, {
      element,
      action,
      value,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track venue engagement
   */
  static async trackVenueEngagement(
    venueId: string,
    venueName: string,
    action: 'viewed' | 'searched' | 'favorited' | 'visited',
    duration?: number
  ): Promise<void> {
    const eventType = action === 'viewed' ? AnalyticsEventType.VENUE_VIEWED :
                     action === 'searched' ? AnalyticsEventType.VENUE_SEARCHED :
                     action === 'favorited' ? AnalyticsEventType.VENUE_FAVORITED :
                     AnalyticsEventType.STORE_VISITED;

    await this.trackEvent(eventType, {
      venueId,
      venueName,
      action,
      duration,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track navigation events
   */
  static async trackNavigation(
    action: 'started' | 'completed' | 'route_calculated' | 'waypoint_reached',
    data: Record<string, any>
  ): Promise<void> {
    const eventType = action === 'started' ? AnalyticsEventType.NAVIGATION_STARTED :
                     action === 'completed' ? AnalyticsEventType.NAVIGATION_COMPLETED :
                     action === 'route_calculated' ? AnalyticsEventType.ROUTE_CALCULATED :
                     AnalyticsEventType.WAYPOINT_REACHED;

    await this.trackEvent(eventType, {
      ...data,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track store card wallet usage
   */
  static async trackCardWallet(
    action: 'scanned' | 'used' | 'opened',
    cardData?: { storeName?: string; cardType?: string }
  ): Promise<void> {
    const eventType = action === 'scanned' ? AnalyticsEventType.CARD_SCANNED :
                     action === 'used' ? AnalyticsEventType.CARD_USED :
                     AnalyticsEventType.WALLET_OPENED;

    await this.trackEvent(eventType, {
      action,
      ...cardData,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track AR session
   */
  static async trackARSession(
    action: 'started' | 'ended' | 'marker_detected',
    data?: Record<string, any>
  ): Promise<void> {
    const eventType = action === 'started' ? AnalyticsEventType.AR_SESSION_STARTED :
                     action === 'ended' ? AnalyticsEventType.AR_SESSION_ENDED :
                     AnalyticsEventType.AR_MARKER_DETECTED;

    await this.trackEvent(eventType, {
      action,
      ...data,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track business metrics events
   */
  static async trackBusinessMetric(
    action: 'deal_viewed' | 'deal_shared' | 'promotion_clicked',
    data: Record<string, any>
  ): Promise<void> {
    const eventType = action === 'deal_viewed' ? AnalyticsEventType.DEAL_VIEWED :
                     action === 'deal_shared' ? AnalyticsEventType.DEAL_SHARED :
                     AnalyticsEventType.PROMOTION_CLICKED;

    await this.trackEvent(eventType, {
      action,
      ...data,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track errors
   */
  static async trackError(
    error: Error | string,
    context?: string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ): Promise<void> {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorStack = typeof error === 'string' ? undefined : error.stack;

    await this.trackEvent(AnalyticsEventType.ERROR_OCCURRED, {
      message: errorMessage,
      stack: errorStack,
      context,
      severity,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track performance metrics
   */
  static async trackPerformance(
    metric: string,
    value: number,
    unit: string = 'ms'
  ): Promise<void> {
    await this.trackEvent(AnalyticsEventType.PERFORMANCE_METRIC, {
      metric,
      value,
      unit,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * End current session
   */
  static async endSession(): Promise<void> {
    if (this.currentSession) {
      this.currentSession.endTime = new Date();
      
      // Calculate session duration
      const duration = this.currentSession.endTime.getTime() - 
                      this.currentSession.startTime.getTime();

      // Track app closed event
      await this.trackEvent(AnalyticsEventType.APP_CLOSED, {
        sessionDuration: duration,
        screenViews: this.currentSession.screenViews,
        interactions: this.currentSession.interactions,
        venuesVisited: this.currentSession.venuesVisited.length,
        cardsUsed: this.currentSession.cardsUsed,
        errorsEncountered: this.currentSession.errorsEncountered
      });

      // Save session data
      await this.saveSession(this.currentSession);

      // Upload remaining events
      await this.uploadEvents();

      this.currentSession = null;
    }
  }

  /**
   * Get analytics summary for investor dashboard
   */
  static async getAnalyticsSummary(): Promise<{
    todayStats: Record<string, number>;
    weeklyStats: Record<string, number>;
    monthlyStats: Record<string, number>;
    businessMetrics: Partial<BusinessMetrics>;
  }> {
    try {
      const events = await this.getStoredEvents();
      const sessions = await this.getStoredSessions();

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Filter events by time periods
      const todayEvents = events.filter(e => e.timestamp >= today);
      const weeklyEvents = events.filter(e => e.timestamp >= weekAgo);
      const monthlyEvents = events.filter(e => e.timestamp >= monthAgo);

      return {
        todayStats: {
          screenViews: todayEvents.filter(e => e.type === AnalyticsEventType.SCREEN_VIEW).length,
          interactions: todayEvents.filter(e => e.type === AnalyticsEventType.USER_INTERACTION).length,
          venueViews: todayEvents.filter(e => e.type === AnalyticsEventType.VENUE_VIEWED).length,
          cardScans: todayEvents.filter(e => e.type === AnalyticsEventType.CARD_SCANNED).length,
          errors: todayEvents.filter(e => e.type === AnalyticsEventType.ERROR_OCCURRED).length
        },
        weeklyStats: {
          totalEvents: weeklyEvents.length,
          uniqueSessions: new Set(weeklyEvents.map(e => e.sessionId)).size,
          venueEngagement: weeklyEvents.filter(e => 
            [AnalyticsEventType.VENUE_VIEWED, AnalyticsEventType.VENUE_FAVORITED].includes(e.type)
          ).length,
          walletUsage: weeklyEvents.filter(e => 
            [AnalyticsEventType.CARD_SCANNED, AnalyticsEventType.CARD_USED].includes(e.type)
          ).length
        },
        monthlyStats: {
          totalUsers: new Set(monthlyEvents.map(e => e.sessionId)).size,
          totalSessions: sessions.filter(s => s.startTime >= monthAgo).length,
          averageSessionTime: this.calculateAverageSessionDuration(sessions.filter(s => s.startTime >= monthAgo)),
          retentionRate: this.calculateRetentionRate(sessions)
        },
        businessMetrics: {
          venueEngagementRate: this.calculateEngagementRate(weeklyEvents),
          cardWalletAdoption: this.calculateWalletAdoption(weeklyEvents),
          dealConversionRate: this.calculateDealConversion(weeklyEvents),
          arUsageRate: this.calculateARUsage(weeklyEvents)
        }
      };
    } catch (error) {
      console.error('Failed to get analytics summary:', error);
      return {
        todayStats: {},
        weeklyStats: {},
        monthlyStats: {},
        businessMetrics: {}
      };
    }
  }

  // Private helper methods
  private static async generateSessionId(): Promise<string> {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static async isFirstLaunch(): Promise<boolean> {
    const hasLaunched = await AsyncStorage.getItem('has_launched');
    if (!hasLaunched) {
      await AsyncStorage.setItem('has_launched', 'true');
      return true;
    }
    return false;
  }

  private static async saveEvent(event: AnalyticsEvent): Promise<void> {
    const key = `analytics_event_${event.id}`;
    await AsyncStorage.setItem(key, JSON.stringify(event));
  }

  private static async saveSession(session: UserSession): Promise<void> {
    const key = `analytics_session_${session.sessionId}`;
    await AsyncStorage.setItem(key, JSON.stringify(session));
  }

  private static async getStoredEvents(): Promise<AnalyticsEvent[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const eventKeys = keys.filter(key => key.startsWith('analytics_event_'));
      const events: AnalyticsEvent[] = [];

      for (const key of eventKeys) {
        const data = await AsyncStorage.getItem(key);
        if (data) {
          const event = JSON.parse(data);
          event.timestamp = new Date(event.timestamp);
          events.push(event);
        }
      }

      return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    } catch (error) {
      console.error('Failed to get stored events:', error);
      return [];
    }
  }

  private static async getStoredSessions(): Promise<UserSession[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const sessionKeys = keys.filter(key => key.startsWith('analytics_session_'));
      const sessions: UserSession[] = [];

      for (const key of sessionKeys) {
        const data = await AsyncStorage.getItem(key);
        if (data) {
          const session = JSON.parse(data);
          session.startTime = new Date(session.startTime);
          if (session.endTime) session.endTime = new Date(session.endTime);
          sessions.push(session);
        }
      }

      return sessions.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
    } catch (error) {
      console.error('Failed to get stored sessions:', error);
      return [];
    }
  }

  private static async uploadEvents(): Promise<void> {
    // In production, this would upload to analytics backend
    // For now, we'll just clear the queue
    console.log(`📊 Would upload ${this.eventQueue.length} events to analytics backend`);
    this.eventQueue = [];
  }

  private static calculateAverageSessionDuration(sessions: UserSession[]): number {
    const completedSessions = sessions.filter(s => s.endTime);
    if (completedSessions.length === 0) return 0;

    const totalDuration = completedSessions.reduce((sum, session) => {
      return sum + (session.endTime!.getTime() - session.startTime.getTime());
    }, 0);

    return Math.round(totalDuration / completedSessions.length / 1000); // Return in seconds
  }

  private static calculateRetentionRate(sessions: UserSession[]): number {
    // Simplified retention calculation
    const uniqueUsers = new Set(sessions.map(s => s.sessionId.split('_')[1])).size;
    const returningUsers = sessions.length - uniqueUsers;
    return uniqueUsers > 0 ? Math.round((returningUsers / uniqueUsers) * 100) : 0;
  }

  private static calculateEngagementRate(events: AnalyticsEvent[]): number {
    const totalEvents = events.length;
    const engagementEvents = events.filter(e => 
      [
        AnalyticsEventType.VENUE_VIEWED,
        AnalyticsEventType.VENUE_FAVORITED,
        AnalyticsEventType.DEAL_VIEWED,
        AnalyticsEventType.CARD_SCANNED
      ].includes(e.type)
    ).length;

    return totalEvents > 0 ? Math.round((engagementEvents / totalEvents) * 100) : 0;
  }

  private static calculateWalletAdoption(events: AnalyticsEvent[]): number {
    const totalUsers = new Set(events.map(e => e.sessionId)).size;
    const walletUsers = new Set(
      events
        .filter(e => [AnalyticsEventType.CARD_SCANNED, AnalyticsEventType.WALLET_OPENED].includes(e.type))
        .map(e => e.sessionId)
    ).size;

    return totalUsers > 0 ? Math.round((walletUsers / totalUsers) * 100) : 0;
  }

  private static calculateDealConversion(events: AnalyticsEvent[]): number {
    const dealViews = events.filter(e => e.type === AnalyticsEventType.DEAL_VIEWED).length;
    const dealShares = events.filter(e => e.type === AnalyticsEventType.DEAL_SHARED).length;

    return dealViews > 0 ? Math.round((dealShares / dealViews) * 100) : 0;
  }

  private static calculateARUsage(events: AnalyticsEvent[]): number {
    const totalUsers = new Set(events.map(e => e.sessionId)).size;
    const arUsers = new Set(
      events
        .filter(e => e.type === AnalyticsEventType.AR_SESSION_STARTED)
        .map(e => e.sessionId)
    ).size;

    return totalUsers > 0 ? Math.round((arUsers / totalUsers) * 100) : 0;
  }
}

export default AnalyticsService;
