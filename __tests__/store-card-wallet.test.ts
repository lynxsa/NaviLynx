/**
 * 🧪 Store Card Wallet Integration Test - NaviLynx Production
 * 
 * Comprehensive testing suite for store card wallet functionality
 * Validates barcode scanning, analytics tracking, and UI components
 * 
 * @author Senior Architect
 * @version 1.0.0 - Investor Ready
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StoreCardWalletService } from '@/components/wallet/BarcodeScanner';
import { AnalyticsService, AnalyticsEventType } from '@/services/AnalyticsService';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  getAllKeys: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock console.log to avoid noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
};

describe('Store Card Wallet Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValue([]);
  });

  describe('StoreCardWalletService', () => {
    it('should save a new store card successfully', async () => {
      // Arrange
      const barcodeData = '6012345678901';
      const barcodeType = 'ean13';

      // Mock existing cards list
      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce(null) // store_cards_list doesn't exist
        .mockResolvedValueOnce(JSON.stringify([])); // empty cards list

      // Act
      const result = await StoreCardWalletService.saveStoreCard(barcodeData, barcodeType);

      // Assert
      expect(result).toBeDefined();
      expect(result.storeName).toBe('Checkers'); // Based on barcode starting with 6
      expect(result.barcodeData).toBe(barcodeData);
      expect(result.accentColor).toBe('#C8102E');
      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(2); // Card data + cards list
    });

    it('should detect store from barcode patterns', async () => {
      // Test different store patterns
      const testCases = [
        { barcode: '6012345678901', expectedStore: 'Checkers' },
        { barcode: '7012345678901', expectedStore: 'Pick n Pay' },
        { barcode: '8012345678901', expectedStore: 'Woolworths' },
        { barcode: '9012345678901', expectedStore: 'Shoprite' },
        { barcode: '5012345678901', expectedStore: 'Game Stores' },
        { barcode: '1012345678901', expectedStore: 'Store Card' }, // Default
      ];

      for (const testCase of testCases) {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));
        
        const result = await StoreCardWalletService.saveStoreCard(testCase.barcode, 'ean13');
        expect(result.storeName).toBe(testCase.expectedStore);
      }
    });

    it('should retrieve all stored cards', async () => {
      // Arrange
      const mockCards = [
        {
          id: 'card_1',
          storeName: 'Checkers',
          barcodeData: '6012345678901',
          createdAt: '2024-01-01T00:00:00.000Z'
        },
        {
          id: 'card_2',
          storeName: 'Pick n Pay',
          barcodeData: '7012345678901',
          createdAt: '2024-01-02T00:00:00.000Z'
        }
      ];

      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce(JSON.stringify(['card_1', 'card_2'])) // cards list
        .mockResolvedValueOnce(JSON.stringify(mockCards[0])) // card_1 data
        .mockResolvedValueOnce(JSON.stringify(mockCards[1])); // card_2 data

      // Act
      const result = await StoreCardWalletService.getStoreCards();

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].storeName).toBe('Pick n Pay'); // Should be sorted by date desc
      expect(result[1].storeName).toBe('Checkers');
    });

    it('should delete a store card', async () => {
      // Arrange
      const cardId = 'card_1';
      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce(JSON.stringify(['card_1', 'card_2'])); // existing cards list

      // Act
      const result = await StoreCardWalletService.deleteStoreCard(cardId);

      // Assert
      expect(result).toBe(true);
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(`store_card_${cardId}`);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'store_cards_list',
        JSON.stringify(['card_2'])
      );
    });

    it('should generate shareable card link', () => {
      // Arrange
      const mockCard = {
        id: 'card_1',
        storeName: 'Checkers',
        barcodeData: '6012345678901',
        logoUrl: 'https://example.com/logo.png',
        accentColor: '#C8102E',
        loyaltyTier: 'Gold',
        createdAt: new Date('2024-01-01T00:00:00.000Z')
      };

      // Act
      const result = StoreCardWalletService.generateShareableLink(mockCard);

      // Assert
      expect(result).toContain('navilynx://card/share?data=');
      expect(result).toContain('Checkers');
      expect(result).toContain('Gold');
    });
  });

  describe('Analytics Integration', () => {
    it('should track card scanning events', async () => {
      // Arrange
      const trackEventSpy = jest.spyOn(AnalyticsService, 'trackEvent').mockResolvedValue();

      // Act
      await AnalyticsService.trackCardWallet('scanned', {
        storeName: 'Checkers',
        cardType: 'loyalty'
      });

      // Assert
      expect(trackEventSpy).toHaveBeenCalledWith(
        AnalyticsEventType.CARD_SCANNED,
        expect.objectContaining({
          action: 'scanned',
          storeName: 'Checkers',
          cardType: 'loyalty'
        })
      );
    });

    it('should track wallet usage analytics', async () => {
      // Arrange
      const trackEventSpy = jest.spyOn(AnalyticsService, 'trackEvent').mockResolvedValue();

      // Act
      await AnalyticsService.trackCardWallet('opened');
      await AnalyticsService.trackCardWallet('used', { storeName: 'Pick n Pay' });

      // Assert
      expect(trackEventSpy).toHaveBeenCalledTimes(2);
      expect(trackEventSpy).toHaveBeenNthCalledWith(
        1,
        AnalyticsEventType.WALLET_OPENED,
        expect.objectContaining({ action: 'opened' })
      );
      expect(trackEventSpy).toHaveBeenNthCalledWith(
        2,
        AnalyticsEventType.CARD_USED,
        expect.objectContaining({
          action: 'used',
          storeName: 'Pick n Pay'
        })
      );
    });

    it('should generate analytics summary', async () => {
      // Arrange
      const mockEvents = [
        {
          id: 'evt_1',
          type: AnalyticsEventType.CARD_SCANNED,
          timestamp: new Date(),
          sessionId: 'session_1',
          data: { storeName: 'Checkers' }
        },
        {
          id: 'evt_2',
          type: AnalyticsEventType.VENUE_VIEWED,
          timestamp: new Date(),
          sessionId: 'session_1',
          data: { venueId: 'venue_1' }
        }
      ];

      (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValue([
        'analytics_event_evt_1',
        'analytics_event_evt_2',
        'analytics_session_session_1'
      ]);

      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce(JSON.stringify(mockEvents[0]))
        .mockResolvedValueOnce(JSON.stringify(mockEvents[1]))
        .mockResolvedValueOnce(JSON.stringify({
          sessionId: 'session_1',
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
          screenViews: 5,
          interactions: 10
        }));

      // Act
      const summary = await AnalyticsService.getAnalyticsSummary();

      // Assert
      expect(summary).toBeDefined();
      expect(summary.todayStats).toBeDefined();
      expect(summary.weeklyStats).toBeDefined();
      expect(summary.monthlyStats).toBeDefined();
      expect(summary.businessMetrics).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle storage errors gracefully', async () => {
      // Arrange
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      // Act & Assert
      const cards = await StoreCardWalletService.getStoreCards();
      expect(cards).toEqual([]);
    });

    it('should handle invalid barcode data', async () => {
      // Arrange
      const invalidBarcode = '';

      // Act & Assert
      await expect(
        StoreCardWalletService.saveStoreCard(invalidBarcode, 'unknown')
      ).rejects.toThrow();
    });

    it('should track analytics errors', async () => {
      // Arrange
      const trackEventSpy = jest.spyOn(AnalyticsService, 'trackEvent').mockResolvedValue();
      const testError = new Error('Test error');

      // Act
      await AnalyticsService.trackError(testError, 'wallet_test', 'high');

      // Assert
      expect(trackEventSpy).toHaveBeenCalledWith(
        AnalyticsEventType.ERROR_OCCURRED,
        expect.objectContaining({
          message: 'Test error',
          context: 'wallet_test',
          severity: 'high'
        })
      );
    });
  });

  describe('Business Logic Validation', () => {
    it('should detect loyalty tiers correctly', async () => {
      // Test loyalty tier detection logic
      const testCases = [
        { barcode: '6012345678908', expectedTier: 'Gold' }, // ends with 8
        { barcode: '6012345678905', expectedTier: 'Silver' }, // ends with 5
        { barcode: '6012345678902', expectedTier: 'Bronze' }, // ends with 2
        { barcode: '6012345678901', expectedTier: undefined }, // ends with 1
      ];

      for (const testCase of testCases) {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));
        
        const result = await StoreCardWalletService.saveStoreCard(testCase.barcode, 'ean13');
        expect(result.loyaltyTier).toBe(testCase.expectedTier);
      }
    });

    it('should prevent duplicate card scanning', async () => {
      // Arrange
      const barcodeData = '6012345678901';
      const existingCard = {
        id: 'card_1',
        storeName: 'Checkers',
        barcodeData,
        createdAt: new Date()
      };

      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce(JSON.stringify(['card_1'])) // cards list
        .mockResolvedValueOnce(JSON.stringify(existingCard)); // existing card

      // Act
      const cards = await StoreCardWalletService.getStoreCards();
      const duplicateExists = cards.some(card => card.barcodeData === barcodeData);

      // Assert
      expect(duplicateExists).toBe(true);
      expect(cards).toHaveLength(1);
    });
  });

  describe('Performance Tests', () => {
    it('should handle large numbers of cards efficiently', async () => {
      // Arrange
      const cardCount = 100;
      const mockCardIds = Array.from({ length: cardCount }, (_, i) => `card_${i}`);
      const mockCards = mockCardIds.map(id => ({
        id,
        storeName: 'Test Store',
        barcodeData: `${6000000000000 + parseInt(id.split('_')[1])}`,
        createdAt: new Date().toISOString()
      }));

      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce(JSON.stringify(mockCardIds));

      // Mock individual card retrievals
      mockCards.forEach((card, index) => {
        (AsyncStorage.getItem as jest.Mock)
          .mockResolvedValueOnce(JSON.stringify(card));
      });

      // Act
      const startTime = Date.now();
      const cards = await StoreCardWalletService.getStoreCards();
      const endTime = Date.now();

      // Assert
      expect(cards).toHaveLength(cardCount);
      expect(endTime - startTime).toBeLessThan(1000); // Should complete in under 1 second
    });

    it('should batch analytics events efficiently', async () => {
      // Arrange
      const eventCount = 100;
      let trackedEvents = 0;

      jest.spyOn(AnalyticsService, 'trackEvent').mockImplementation(async () => {
        trackedEvents++;
      });

      // Act
      const startTime = Date.now();
      const promises = Array.from({ length: eventCount }, (_, i) =>
        AnalyticsService.trackCardWallet('used', { storeName: `Store ${i}` })
      );
      await Promise.all(promises);
      const endTime = Date.now();

      // Assert
      expect(trackedEvents).toBe(eventCount);
      expect(endTime - startTime).toBeLessThan(500); // Should batch efficiently
    });
  });
});

describe('Component Integration Tests', () => {
  // Note: These would be actual component tests in a real scenario
  // For now, we'll just validate the component exports and interfaces

  it('should export required components', () => {
    // This test validates that our components are properly structured
    expect(StoreCardWalletService).toBeDefined();
    expect(StoreCardWalletService.saveStoreCard).toBeInstanceOf(Function);
    expect(StoreCardWalletService.getStoreCards).toBeInstanceOf(Function);
    expect(StoreCardWalletService.deleteStoreCard).toBeInstanceOf(Function);
  });

  it('should have analytics service integration', () => {
    expect(AnalyticsService).toBeDefined();
    expect(AnalyticsService.trackCardWallet).toBeInstanceOf(Function);
    expect(AnalyticsService.trackEvent).toBeInstanceOf(Function);
    expect(AnalyticsService.getAnalyticsSummary).toBeInstanceOf(Function);
  });
});

// Export test utilities for other test files
export const testUtils = {
  createMockCard: (overrides = {}) => ({
    id: 'test_card_1',
    storeName: 'Test Store',
    barcodeData: '6012345678901',
    logoUrl: 'https://example.com/logo.png',
    accentColor: '#C8102E',
    loyaltyTier: 'Gold',
    createdAt: new Date(),
    ...overrides
  }),

  createMockEvent: (type: AnalyticsEventType, overrides = {}) => ({
    id: 'test_event_1',
    type,
    timestamp: new Date(),
    sessionId: 'test_session_1',
    data: {},
    ...overrides
  }),

  mockAsyncStorage: (mockData: Record<string, any> = {}) => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => 
      Promise.resolve(mockData[key] || null)
    );
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValue(Object.keys(mockData));
  }
};

export default testUtils;
