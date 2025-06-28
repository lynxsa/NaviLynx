/**
 * South African Market Integration Service - CHARTER ENHANCED VERSION
 * Comprehensive integration with South African-specific features including
 * load shedding, payment methods, safety features, and local business support
 * Enhanced for NaviLynx App Development Charter (Ultimate Edition)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

// Enhanced interfaces for Charter compliance

export interface LoadSheddingStatus {
  stage: number; // 0-8
  isActive: boolean;
  municipality: string;
  startTime: Date;
  endTime: Date;
  nextScheduled?: Date;
  estimatedDuration?: number; // in minutes
  affectedAreas: string[];
  venueBackupPower?: boolean;
  batteryLevel?: number;
}

export interface EnhancedPaymentMethod {
  id: string;
  name: string;
  type: 'digital_wallet' | 'instant_eft' | 'card' | 'mobile_money' | 'crypto';
  icon: string;
  isAvailable: boolean;
  maxAmount: number;
  fees: {
    fixed: number;
    percentage: number;
  };
  supportedCurrencies: string[];
  requirements: string[];
  realTimeProcessing: boolean;
  offlineCapability: boolean;
}

export interface SafetyAlert {
  id: string;
  type: 'crime' | 'emergency' | 'weather' | 'traffic' | 'protest' | 'load_shedding';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: {
    latitude: number;
    longitude: number;
    radius: number; // meters
    description: string;
  };
  message: string;
  timestamp: Date;
  source: string;
  active: boolean;
}

// South African Payment Providers
export interface MobileMoneyProvider {
  id: string;
  name: string;
  logo: string;
  type: 'mobile' | 'bank' | 'ewallet';
  supportedBanks?: string[];
  fees?: {
    transaction: number;
    withdrawal: number;
  };
  limits?: {
    daily: number;
    monthly: number;
  };
}

export interface LoadSheddingSchedule {
  area: string;
  stage: number;
  currentStatus: 'on' | 'off' | 'unknown';
  nextEvent: {
    time: Date;
    duration: number; // hours
    type: 'start' | 'end';
  };
  schedule: {
    date: string;
    slots: {
      start: string;
      end: string;
      stage: number;
    }[];
  }[];
}

export interface VenueLoadSheddingStatus {
  venueId: string;
  venueName: string;
  hasBackupPower: boolean;
  backupCapacity: number; // percentage
  criticalServices: string[];
  currentPowerStatus: 'grid' | 'backup' | 'off';
  estimatedBackupRemaining?: number; // hours
}

export interface LocalVendor {
  id: string;
  name: string;
  category: 'food' | 'retail' | 'services' | 'crafts';
  description: string;
  owner: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    venueId?: string; // if inside a mall/venue
  };
  contact: {
    phone?: string;
    whatsapp?: string;
    email?: string;
  };
  products: {
    id: string;
    name: string;
    price: number;
    currency: 'ZAR';
    description?: string;
    image?: string;
  }[];
  operatingHours: Record<string, string>;
  paymentMethods: string[];
  rating: number;
  reviewCount: number;
  verified: boolean;
  supportProgram: 'black-owned' | 'township-business' | 'women-owned' | 'youth-owned' | null;
}

export class SouthAfricanMarketService {
  private static instance: SouthAfricanMarketService;
  private paymentProviders: MobileMoneyProvider[] = [];
  private loadSheddingData: LoadSheddingSchedule | null = null;
  private safetyAlerts: SafetyAlert[] = [];
  private localVendors: LocalVendor[] = [];

  private constructor() {
    this.initializeService();
  }

  public static getInstance(): SouthAfricanMarketService {
    if (!SouthAfricanMarketService.instance) {
      SouthAfricanMarketService.instance = new SouthAfricanMarketService();
    }
    return SouthAfricanMarketService.instance;
  }

  private async initializeService() {
    await this.loadPaymentProviders();
    await this.loadLocalVendors();
    await this.loadSafetyAlerts();
  }

  // Mobile Money Integration
  private async loadPaymentProviders() {
    this.paymentProviders = [
      {
        id: 'snapscan',
        name: 'SnapScan',
        logo: 'https://snapscan.co.za/logo.png',
        type: 'mobile',
        fees: { transaction: 0.035, withdrawal: 0 },
        limits: { daily: 5000, monthly: 50000 }
      },
      {
        id: 'zapper',
        name: 'Zapper',
        logo: 'https://zapper.com/logo.png',
        type: 'mobile',
        fees: { transaction: 0.025, withdrawal: 0 },
        limits: { daily: 3000, monthly: 30000 }
      },
      {
        id: 'ozow',
        name: 'Ozow',
        logo: 'https://ozow.com/logo.png',
        type: 'bank',
        supportedBanks: ['FNB', 'Standard Bank', 'ABSA', 'Nedbank', 'Capitec'],
        fees: { transaction: 0.015, withdrawal: 0 },
        limits: { daily: 10000, monthly: 100000 }
      },
      {
        id: 'payshap',
        name: 'PayShap',
        logo: 'https://payshap.co.za/logo.png',
        type: 'bank',
        supportedBanks: ['All Major Banks'],
        fees: { transaction: 0, withdrawal: 0 },
        limits: { daily: 3000, monthly: 30000 }
      },
      {
        id: 'capitec_pay',
        name: 'Capitec Pay',
        logo: 'https://capitecbank.co.za/logo.png',
        type: 'bank',
        supportedBanks: ['Capitec'],
        fees: { transaction: 0, withdrawal: 0 },
        limits: { daily: 5000, monthly: 50000 }
      }
    ];
  }

  public getPaymentProviders(): MobileMoneyProvider[] {
    return this.paymentProviders;
  }

  public async processPayment(providerId: string, amount: number, merchantId: string): Promise<{
    success: boolean;
    transactionId?: string;
    error?: string;
  }> {
    const provider = this.paymentProviders.find(p => p.id === providerId);
    if (!provider) {
      return { success: false, error: 'Payment provider not found' };
    }

    if (provider.limits && amount > provider.limits.daily) {
      return { success: false, error: 'Amount exceeds daily limit' };
    }

    // Simulate payment processing
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.1; // 90% success rate
        if (success) {
          resolve({
            success: true,
            transactionId: `${providerId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          });
        } else {
          resolve({
            success: false,
            error: 'Payment failed. Please try again or use a different payment method.'
          });
        }
      }, 2000);
    });
  }

  // Load Shedding Alerts
  public async getLoadSheddingStatus(location?: { lat: number; lng: number }): Promise<LoadSheddingSchedule> {
    // Mock Johannesburg load shedding data
    const mockSchedule: LoadSheddingSchedule = {
      area: 'Johannesburg Block 12',
      stage: 2,
      currentStatus: 'on',
      nextEvent: {
        time: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
        duration: 2.5,
        type: 'start'
      },
      schedule: [
        {
          date: new Date().toISOString().split('T')[0],
          slots: [
            { start: '06:00', end: '08:30', stage: 2 },
            { start: '16:00', end: '18:30', stage: 2 },
            { start: '22:00', end: '00:30', stage: 2 }
          ]
        },
        {
          date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          slots: [
            { start: '08:00', end: '10:30', stage: 2 },
            { start: '18:00', end: '20:30', stage: 2 }
          ]
        }
      ]
    };

    this.loadSheddingData = mockSchedule;
    return mockSchedule;
  }

  public async getVenueLoadSheddingStatus(venueId: string): Promise<VenueLoadSheddingStatus> {
    // Mock venue power status
    return {
      venueId,
      venueName: 'Sandton City Mall',
      hasBackupPower: true,
      backupCapacity: 85,
      criticalServices: ['Emergency Lighting', 'Security Systems', 'Elevators', 'Medical Center'],
      currentPowerStatus: 'grid',
      estimatedBackupRemaining: 4.5
    };
  }

  public async subscribeToLoadSheddingAlerts(callback: (status: LoadSheddingSchedule) => void): Promise<void> {
    // Simulate real-time updates
    setInterval(async () => {
      const status = await this.getLoadSheddingStatus();
      callback(status);
    }, 5 * 60 * 1000); // Update every 5 minutes
  }

  // Safety & Security Features
  public async triggerPanicButton(location: { lat: number; lng: number }): Promise<{
    success: boolean;
    alertId?: string;
    estimatedResponseTime?: number; // minutes
  }> {
    try {
      // In a real app, this would contact emergency services
      const alertId = `panic_${Date.now()}`;
      
      // Store panic alert locally
      const panicAlert = {
        id: alertId,
        timestamp: new Date(),
        location,
        status: 'active',
        responseTime: null
      };
      
      await AsyncStorage.setItem(`panic_${alertId}`, JSON.stringify(panicAlert));
      
      // Simulate emergency response
      setTimeout(() => {
        this.notifyEmergencyResponse(alertId);
      }, 30000); // 30 seconds response acknowledgment
      
      return {
        success: true,
        alertId,
        estimatedResponseTime: 8 // minutes
      };
    } catch {
      return { success: false };
    }
  }

  private async notifyEmergencyResponse(alertId: string) {
    Alert.alert(
      'Emergency Response',
      'Emergency services have been notified and are responding to your location. Help is on the way.',
      [{ text: 'OK' }]
    );
  }

  public async getSafetyAlerts(location: { lat: number; lng: number }, radius: number = 5000): Promise<SafetyAlert[]> {
    // Filter alerts by location proximity
    return this.safetyAlerts.filter(alert => {
      const distance = this.calculateDistance(
        location.lat, location.lng,
        alert.location.latitude, alert.location.longitude
      );
      return distance <= radius && alert.active;
    });
  }

  private async loadSafetyAlerts() {
    // Mock safety alerts for Johannesburg area
    this.safetyAlerts = [
      {
        id: 'safety_1',
        type: 'traffic',
        severity: 'medium',
        location: {
          latitude: -26.2041,
          longitude: 28.0473,
          radius: 2000,
          description: 'N1 Highway near Johannesburg',
        },
        message: 'Heavy traffic congestion due to road maintenance. Expect delays.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        source: 'traffic',
        active: true
      },
      {
        id: 'safety_2',
        type: 'crime',
        severity: 'high',
        location: {
          latitude: -26.1807,
          longitude: 28.0299,
          radius: 1500,
          description: 'Hillbrow area',
        },
        message: 'Increased criminal activity reported. Avoid the area if possible and remain vigilant.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        source: 'saps',
        active: true
      }
    ];
  }

  // Local Vendor Marketplace
  private async loadLocalVendors() {
    this.localVendors = [
      {
        id: 'vendor_1',
        name: 'Mama Sibongile\'s Kitchen',
        category: 'food',
        description: 'Authentic African cuisine and traditional dishes',
        owner: 'Sibongile Mthembu',
        location: {
          lat: -26.2023,
          lng: 28.0436,
          address: 'Sandton City Mall, Food Court Level 2',
          venueId: '1'
        },
        contact: {
          phone: '+27 82 123 4567',
          whatsapp: '+27 82 123 4567'
        },
        products: [
          {
            id: 'p1',
            name: 'Bobotie with Rice',
            price: 85,
            currency: 'ZAR',
            description: 'Traditional South African spiced meatloaf with yellow rice'
          },
          {
            id: 'p2',
            name: 'Boerewors Roll',
            price: 45,
            currency: 'ZAR',
            description: 'Grilled boerewors sausage in fresh bread roll'
          },
          {
            id: 'p3',
            name: 'Pap & Vleis',
            price: 75,
            currency: 'ZAR',
            description: 'Maize porridge with grilled meat and gravy'
          }
        ],
        operatingHours: {
          'Mon-Fri': '10:00 AM - 8:00 PM',
          'Sat-Sun': '9:00 AM - 9:00 PM'
        },
        paymentMethods: ['Cash', 'SnapScan', 'Zapper', 'Card'],
        rating: 4.7,
        reviewCount: 156,
        verified: true,
        supportProgram: 'black-owned'
      },
      {
        id: 'vendor_2',
        name: 'Ubuntu Crafts',
        category: 'crafts',
        description: 'Handmade African crafts and artwork',
        owner: 'Thabo Mokoena',
        location: {
          lat: -26.2025,
          lng: 28.0438,
          address: 'Sandton City Mall, Level 1 Craft Market',
          venueId: '1'
        },
        contact: {
          phone: '+27 83 987 6543',
          whatsapp: '+27 83 987 6543',
          email: 'info@ubuntucrafts.co.za'
        },
        products: [
          {
            id: 'c1',
            name: 'Beaded Necklace',
            price: 150,
            currency: 'ZAR',
            description: 'Traditional Zulu beadwork necklace'
          },
          {
            id: 'c2',
            name: 'Wooden Giraffe Sculpture',
            price: 320,
            currency: 'ZAR',
            description: 'Hand-carved wooden giraffe sculpture'
          }
        ],
        operatingHours: {
          'Mon-Sat': '9:00 AM - 6:00 PM',
          'Sun': 'Closed'
        },
        paymentMethods: ['Cash', 'SnapScan', 'Card'],
        rating: 4.5,
        reviewCount: 89,
        verified: true,
        supportProgram: 'township-business'
      }
    ];
  }

  public getLocalVendors(venueId?: string, category?: string): LocalVendor[] {
    let vendors = this.localVendors;
    
    if (venueId) {
      vendors = vendors.filter(v => v.location.venueId === venueId);
    }
    
    if (category) {
      vendors = vendors.filter(v => v.category === category);
    }
    
    return vendors;
  }

  public async searchVendors(query: string, location?: { lat: number; lng: number }): Promise<LocalVendor[]> {
    const results = this.localVendors.filter(vendor => 
      vendor.name.toLowerCase().includes(query.toLowerCase()) ||
      vendor.description.toLowerCase().includes(query.toLowerCase()) ||
      vendor.products.some(p => p.name.toLowerCase().includes(query.toLowerCase()))
    );

    if (location) {
      // Sort by distance
      return results.sort((a, b) => {
        const distA = this.calculateDistance(location.lat, location.lng, a.location.lat, a.location.lng);
        const distB = this.calculateDistance(location.lat, location.lng, b.location.lat, b.location.lng);
        return distA - distB;
      });
    }

    return results;
  }

  public async supportLocalVendor(vendorId: string, supportType: 'purchase' | 'review' | 'share'): Promise<void> {
    const vendor = this.localVendors.find(v => v.id === vendorId);
    if (!vendor) return;

    switch (supportType) {
      case 'purchase':
        // Track purchase for analytics
        await AsyncStorage.setItem(`purchase_${vendorId}`, JSON.stringify({
          vendorId,
          timestamp: new Date(),
          supportProgram: vendor.supportProgram
        }));
        break;
      case 'review':
        // Encourage leaving a review
        Alert.alert(
          'Support Local Business',
          `Help ${vendor.name} by leaving a review! Your feedback helps other customers discover great local businesses.`,
          [
            { text: 'Later', style: 'cancel' },
            { text: 'Leave Review', onPress: () => this.openReviewDialog(vendorId) }
          ]
        );
        break;
      case 'share':
        // Share vendor information
        Alert.alert(
          'Share Local Business',
          `Share ${vendor.name} with friends and family to support local entrepreneurship!`
        );
        break;
    }
  }

  private openReviewDialog(vendorId: string) {
    // In a real app, this would open a review modal
    Alert.alert('Review', 'Review functionality would open here');
  }

  // Language Support for Indigenous Languages
  public getSupportedLanguages(): { code: string; name: string; native: string }[] {
    return [
      { code: 'en', name: 'English', native: 'English' },
      { code: 'af', name: 'Afrikaans', native: 'Afrikaans' },
      { code: 'zu', name: 'Zulu', native: 'isiZulu' },
      { code: 'xh', name: 'Xhosa', native: 'isiXhosa' },
      { code: 'st', name: 'Sotho', native: 'Sesotho' },
      { code: 'tn', name: 'Tswana', native: 'Setswana' },
      { code: 'ss', name: 'Swati', native: 'siSwati' },
      { code: 've', name: 'Venda', native: 'Tshivenḓa' },
      { code: 'ts', name: 'Tsonga', native: 'Xitsonga' },
      { code: 'nr', name: 'Ndebele', native: 'isiNdebele' },
      { code: 'nso', name: 'Northern Sotho', native: 'Sepedi' }
    ];
  }

  public async translateText(text: string, targetLanguage: string): Promise<string> {
    // Mock translation service - in reality would use Google Translate API or similar
    const translations: Record<string, Record<string, string>> = {
      'Navigate to': {
        'af': 'Navigeer na',
        'zu': 'Khomba ku',
        'xh': 'Khomba ku',
        'st': 'Tsamaea ho ya',
        'tn': 'Tsamaya go ya'
      },
      'Welcome': {
        'af': 'Welkom',
        'zu': 'Sawubona',
        'xh': 'Wamkelekile',
        'st': 'Dumela',
        'tn': 'Dumela'
      }
    };

    return translations[text]?.[targetLanguage] || text;
  }

  // Utility Methods
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }

  public async getCurrentLocation(): Promise<{ lat: number; lng: number } | null> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return null;
      }

      const location = await Location.getCurrentPositionAsync({});
      return {
        lat: location.coords.latitude,
        lng: location.coords.longitude
      };
    } catch {
      return null;
    }
  }

  // Analytics for South African Market
  public async trackLocalEngagement(eventType: string, data: any): Promise<void> {
    const event = {
      type: eventType,
      data,
      timestamp: new Date(),
      market: 'south-africa'
    };
    
    await AsyncStorage.setItem(`analytics_${Date.now()}`, JSON.stringify(event));
  }
}

export const southAfricanMarketService = SouthAfricanMarketService.getInstance();
