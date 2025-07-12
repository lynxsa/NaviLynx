// Jest setup file to mock native modules
import 'react-native-gesture-handler/jestSetup';
import { jest } from '@jest/globals';

// Ensure Jest globals are available
global.jest = jest;

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock Expo modules
jest.mock('expo-localization', () => ({
  getLocales: jest.fn(() => [{ languageCode: 'en', languageTag: 'en-US' }]),
  locale: 'en-US',
  locales: [{ languageCode: 'en', languageTag: 'en-US' }],
  timezone: 'America/New_York',
  isRTL: false,
  getCalendars: jest.fn(() => []),
}));

jest.mock('expo-constants', () => ({
  expoConfig: {
    name: 'NaviLynx',
    slug: 'navilynx',
  },
  appOwnership: 'expo',
  executionEnvironment: 'standalone',
}));

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getCurrentPositionAsync: jest.fn(() => Promise.resolve({
    coords: {
      latitude: -26.2041,
      longitude: 28.0473,
      altitude: 1000,
      accuracy: 5,
    },
  })),
}));

jest.mock('expo-camera', () => ({
  Camera: {
    Constants: {
      Type: {
        back: 'back',
        front: 'front',
      },
    },
  },
  requestCameraPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
}));

jest.mock('expo-sensors', () => ({
  Accelerometer: {
    addListener: jest.fn(),
    removeAllListeners: jest.fn(),
    setUpdateInterval: jest.fn(),
  },
  Gyroscope: {
    addListener: jest.fn(),
    removeAllListeners: jest.fn(),
    setUpdateInterval: jest.fn(),
  },
  Magnetometer: {
    addListener: jest.fn(),
    removeAllListeners: jest.fn(),
    setUpdateInterval: jest.fn(),
  },
}));

jest.mock('expo-network', () => ({
  getNetworkStateAsync: jest.fn(() => Promise.resolve({
    type: 'WIFI',
    isConnected: true,
    isInternetReachable: true,
  })),
}));

jest.mock('expo-gl', () => ({
  GLView: 'GLView',
}));

// Mock expo-three
jest.mock('expo-three', () => ({
  AR: {
    startAsync: jest.fn(),
    stopAsync: jest.fn(),
  },
  Renderer: jest.fn(),
  TextureLoader: jest.fn(),
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: View,
    SafeAreaProvider: ({ children }) => children,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
    SafeAreaInsetsContext: {
      Consumer: ({ children }) => children({ top: 0, right: 0, bottom: 0, left: 0 }),
    },
  };
});

// Mock react-native-reanimated components
jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    ...require('react-native-reanimated/mock'),
    useAnimatedStyle: () => ({}),
    useSharedValue: (value) => ({ value }),
    withTiming: (value) => value,
    withSpring: (value) => value,
    default: {
      View: View,
      call: () => {},
    },
  };
});

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    navigate: jest.fn(),
    back: jest.fn(),
  },
  useRouter: () => ({
    push: jest.fn(),
    navigate: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mock venue data service
jest.mock('@/services/venueDataService', () => {
  const mockVenues = [
    { 
      id: '1', 
      name: 'Sandton City Mall', 
      type: 'mall',
      location: { province: 'Gauteng', city: 'Johannesburg' },
      southAfricanContext: {
        loadSheddingBackup: true,
        localPayments: ['cash', 'card', 'snapscan'],
        safetyRating: 4.5
      }
    },
    { 
      id: '2', 
      name: 'OR Tambo International Airport', 
      type: 'airport',
      location: { province: 'Gauteng', city: 'Johannesburg' },
      southAfricanContext: {
        loadSheddingBackup: true,
        localPayments: ['cash', 'card', 'eft'],
        safetyRating: 4.8
      }
    },
    { 
      id: '3', 
      name: 'V&A Waterfront', 
      type: 'mall',
      location: { province: 'Western Cape', city: 'Cape Town' },
      southAfricanContext: {
        loadSheddingBackup: true,
        localPayments: ['cash', 'card', 'snapscan', 'zapper'],
        safetyRating: 4.7
      }
    },
    { 
      id: '4', 
      name: 'Gateway Theatre of Shopping', 
      type: 'mall',
      location: { province: 'KwaZulu-Natal', city: 'Durban' },
      southAfricanContext: {
        loadSheddingBackup: true,
        localPayments: ['cash', 'card', 'eft'],
        safetyRating: 4.3
      }
    },
    { 
      id: '5', 
      name: 'Menlyn Park Shopping Centre', 
      type: 'mall',
      location: { province: 'Gauteng', city: 'Pretoria' },
      southAfricanContext: {
        loadSheddingBackup: true,
        localPayments: ['cash', 'card', 'snapscan'],
        safetyRating: 4.4
      }
    },
    { 
      id: '6', 
      name: 'Cape Town International Airport', 
      type: 'airport',
      location: { province: 'Western Cape', city: 'Cape Town' },
      southAfricanContext: {
        loadSheddingBackup: true,
        localPayments: ['cash', 'card', 'eft'],
        safetyRating: 4.6
      }
    },
    { 
      id: '7', 
      name: 'Canal Walk Shopping Centre', 
      type: 'mall',
      location: { province: 'Western Cape', city: 'Cape Town' },
      southAfricanContext: {
        loadSheddingBackup: true,
        localPayments: ['cash', 'card', 'snapscan', 'zapper'],
        safetyRating: 4.2
      }
    },
    { 
      id: '8', 
      name: 'Eastgate Shopping Centre', 
      type: 'mall',
      location: { province: 'Gauteng', city: 'Johannesburg' },
      southAfricanContext: {
        loadSheddingBackup: true,
        localPayments: ['cash', 'card'],
        safetyRating: 4.1
      }
    },
    { 
      id: '9', 
      name: 'King Shaka International Airport', 
      type: 'airport',
      location: { province: 'KwaZulu-Natal', city: 'Durban' },
      southAfricanContext: {
        loadSheddingBackup: true,
        localPayments: ['cash', 'card', 'eft'],
        safetyRating: 4.5
      }
    },
    { 
      id: '10', 
      name: 'Cresta Shopping Centre', 
      type: 'mall',
      location: { province: 'Gauteng', city: 'Johannesburg' },
      southAfricanContext: {
        loadSheddingBackup: true,
        localPayments: ['cash', 'card', 'snapscan'],
        safetyRating: 4.0
      }
    },
    { 
      id: '11', 
      name: 'Tyger Valley Centre', 
      type: 'mall',
      location: { province: 'Western Cape', city: 'Cape Town' },
      southAfricanContext: {
        loadSheddingBackup: true,
        localPayments: ['cash', 'card', 'eft', 'snapscan'],
        safetyRating: 4.3
      }
    },
    { 
      id: '12', 
      name: 'The Pavilion Shopping Centre', 
      type: 'mall',
      location: { province: 'KwaZulu-Natal', city: 'Durban' },
      southAfricanContext: {
        loadSheddingBackup: true,
        localPayments: ['cash', 'card', 'eft'],
        safetyRating: 4.2
      }
    }
  ];
  
  return {
    VenueDataService: class {
      static getInstance() {
        return {
          getTopVenues: jest.fn(() => Promise.resolve(mockVenues)),
          searchVenues: jest.fn((query) => Promise.resolve(
            mockVenues.filter(v => 
              v.type.toLowerCase().includes(query.toLowerCase()) ||
              v.name.toLowerCase().includes(query.toLowerCase())
            )
          )),
        };
      }
      
      static getAllVenues() {
        return mockVenues;
      }
      
      static searchVenues(query) {
        return mockVenues.filter(v => 
          v.type.toLowerCase().includes(query.toLowerCase()) ||
          v.name.toLowerCase().includes(query.toLowerCase())
        );
      }
      
      static getVenuesByProvince(province) {
        return mockVenues.filter(v => v.location.province === province);
      }
    },
  };
});

// Mock Google AI Service
jest.mock('@/services/googleAIService', () => ({
  googleAIService: {
    processVenueQuery: jest.fn((query) => Promise.resolve({
      text: `Found venues for: ${query}`,
      suggestions: ['Sandton City Mall', 'OR Tambo Airport']
    })),
    recognizeObject: jest.fn((objectType) => Promise.resolve({
      object: objectType === 'elevator' ? 'Elevator' : 'Smartphone',
      description: objectType === 'elevator' ? 'Vertical elevator transportation device for moving between floors' : 'Latest generation smartphone with advanced features',
      confidence: 0.9,
      suggestions: objectType === 'elevator' ? ['Lift', 'Escalator', 'Staircase'] : ['Tablet', 'Smartwatch', 'Laptop'],
      alternatives: objectType === 'elevator' ? ['Lift', 'Escalator', 'Staircase'] : ['Tablet', 'Smartwatch', 'Laptop'],
      relatedStores: objectType === 'elevator' ? [] : ['iStore', 'Samsung Store', 'Cell C', 'Vodacom'],
      estimatedPrice: objectType === 'elevator' ? null : 'R15,000 - R25,000'
    })),
    generateVoiceOver: jest.fn((options) => Promise.resolve(
      `Voice over for: ${options.text} in ${options.language}`
    ))
  }
}));

// Mock Multilingual Service
jest.mock('@/services/multilingualService', () => ({
  multilingualService: {
    getAvailableLanguages: jest.fn(() => [
      { code: 'en', name: 'English', culturalContext: { politenessLevel: 'informal' } },
      { code: 'af', name: 'Afrikaans', culturalContext: { politenessLevel: 'formal' } },
      { code: 'zu', name: 'Zulu', culturalContext: { politenessLevel: 'formal' } },
      { code: 'xh', name: 'Xhosa', culturalContext: { politenessLevel: 'formal' } },
      { code: 'st', name: 'Sotho', culturalContext: { politenessLevel: 'formal' } },
      { code: 'nso', name: 'Northern Sotho', culturalContext: { politenessLevel: 'formal' } },
      { code: 'tn', name: 'Tswana', culturalContext: { politenessLevel: 'formal' } },
      { code: 'ss', name: 'Swazi', culturalContext: { politenessLevel: 'formal' } },
      { code: 've', name: 'Venda', culturalContext: { politenessLevel: 'formal' } },
      { code: 'ts', name: 'Tsonga', culturalContext: { politenessLevel: 'formal' } },
      { code: 'nr', name: 'Ndebele', culturalContext: { politenessLevel: 'formal' } }
    ]),
    getGreeting: jest.fn((langCode) => {
      const greetings = {
        'en': 'Hello',
        'zu': 'Sawubona',
        'af': 'Hallo',
        'xh': 'Molo'
      };
      return greetings[langCode] || 'Hello';
    }),
    getCulturalNavigationInstructions: jest.fn((route, langCode) => {
      // Mock a proper route structure
      const mockRoute = {
        legs: [{
          steps: route.steps ? route.steps.map(step => ({
            html_instructions: step,
            distance: { text: '100m' },
            duration: { text: '2 mins' }
          })) : []
        }]
      };
      
      return mockRoute.legs[0].steps.map(step => {
        let instruction = step.html_instructions.replace(/<[^>]*>/g, '');
        return langCode === 'zu' ? `Sawubona, ${instruction}` : instruction;
      });
    })
  }
}));

// Mock Enhanced SA Market Service
jest.mock('@/services/enhancedSAMarketService', () => ({
  enhancedSAMarketService: {
    getRealTimeLoadSheddingStatus: jest.fn((area) => Promise.resolve({
      stage: 2,
      municipality: 'City of Johannesburg',
      area: area,
      nextChange: '2024-01-20 14:00',
      duration: '2 hours'
    })),
    getAdvancedPaymentMethods: jest.fn(() => new Map([
      ['card', { name: 'Credit/Debit Card', supported: true }],
      ['cash', { name: 'Cash', supported: true }],
      ['eft', { name: 'EFT', supported: true }],
      ['snapscan', { name: 'SnapScan', supported: true }],
      ['zapper', { name: 'Zapper', supported: true }],
      ['cryptocurrency', { name: 'Cryptocurrency', supported: true }],
      ['stokvel', { name: 'Stokvel', supported: true }],
      ['snapscan_pro', { name: 'SnapScan Pro', supported: true }],
      ['payshap_instant', { name: 'PayShap Instant', supported: true }],
      ['crypto_rand', { name: 'Crypto Rand', supported: true }],
      ['stokvel_pay', { name: 'Stokvel Pay', supported: true }]
    ])),
    getAIEnhancedSafetyAlerts: jest.fn((lat, lng) => Promise.resolve([
      {
        type: 'traffic',
        severity: 'medium',
        message: 'Heavy traffic on M1 highway',
        location: { lat, lng }
      }
    ])),
    getTownshipBusinesses: jest.fn((lat, lng) => Promise.resolve([
      {
        name: 'Soweto Spaza Shop',
        supportPrograms: ['SMME Development'],
        paymentMethods: ['cash', 'eft'],
        location: { lat, lng }
      }
    ]))
  }
}));

// Mock Enhanced AR Core Service
jest.mock('@/services/enhancedARCoreService', () => ({
  enhancedARCoreService: {
    addARObject: jest.fn((object) => Promise.resolve(`AR object ${object.id} added`)),
    detectedPlanes: [
      { id: 1, type: 'horizontal', size: { width: 2, height: 2 } },
      { id: 2, type: 'vertical', size: { width: 1, height: 3 } }
    ]
  }
}));

// Mock Performance Optimization Service
jest.mock('@/services/performanceOptimizationService', () => {
  let sessionStartTime = 0;
  let isMonitoring = false;
  
  return {
    performanceOptimizationService: {
      getMetrics: jest.fn(() => ({
        frameRate: 58,
        loadTime: 2.5,
        memoryUsage: 45,
        sessionDuration: isMonitoring ? Math.max(1, Date.now() - sessionStartTime) : 0
      })),
      getTargets: jest.fn(() => ({
        frameRate: 60,
        loadTime: 3.0,
        memoryLimit: 50
      })),
      optimizeApp: jest.fn(),
      optimizeFrameRate: jest.fn(),
      optimizeMemoryUsage: jest.fn(),
      optimizeLoadTime: jest.fn(),
      getPerformanceReport: jest.fn(() => ({
        overall: 'good',
        metrics: {
          frameRate: 58,
          loadTime: 2.5,
          memoryUsage: 45
        },
        targets: {
          frameRate: 60,
          loadTime: 3.0,
          memoryLimit: 50
        },
        recommendations: ['Optimize image loading', 'Reduce bundle size']
      })),
      isPerformanceOptimal: jest.fn(() => true),
      createErrorBoundary: jest.fn(() => 'ErrorBoundary'),
      startPerformanceMonitoring: jest.fn(() => {
        sessionStartTime = Date.now();
        isMonitoring = true;
        // Add a small delay to ensure time passes
        return new Promise(resolve => setTimeout(resolve, 1));
      }),
      stopPerformanceMonitoring: jest.fn(() => {
        isMonitoring = false;
      })
    }
  };
});

// Mock Modern UI Components
jest.mock('@/components/ui/ModernComponents', () => ({
  ModernButton: 'ModernButton',
  ModernCard: 'ModernCard', 
  ModernText: 'ModernText'
}));

// Mock Modern Home Screen
jest.mock('@/components/ModernHomeScreen', () => ({
  __esModule: true,
  default: 'ModernHomeScreen'
}));

// Mock venue cache utility
jest.mock('@/utils/venueCache', () => ({
  getVenuesWithCache: jest.fn(() => Promise.resolve([])),
}));

// Mock console methods for cleaner test output
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock global fetch for network requests
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  })
);

// Mock timers - removed to avoid conflicts with waitFor
// jest.useFakeTimers();

// Mock react-native-maps
jest.mock('react-native-maps', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: View,
    Marker: View,
    PROVIDER_GOOGLE: 'google',
  };
});

// Mock browser environment for expo-three
Object.defineProperty(window, 'navigator', {
  value: {
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  },
  writable: true
});

// Mock window properties that expo-three might need
Object.defineProperty(global, 'navigator', {
  value: {
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  },
  writable: true
});
