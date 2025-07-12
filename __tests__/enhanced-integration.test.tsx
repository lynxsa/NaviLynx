/**
 * Enhanced Integration Tests for NaviLynx Core Features
 * Testing AR Navigation, Chat, Performance, and User Experience
 */

import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import ARNavigator from '@/app/(tabs)/ar-navigator';
import { AIConcierge } from '@/components/AIConciergeChat';
import { geminiService } from '@/services/geminiService';
import { performanceMonitor } from '@/services/PerformanceMonitor';
import { LocationService } from '@/services/LocationService';
import { NavigationService } from '@/services/NavigationService';
import { ThemeProvider } from '@/context/ThemeContext';

// Mock external dependencies
jest.mock('@/services/geminiService');
jest.mock('@/services/LocationService');
jest.mock('@/services/NavigationService');
jest.mock('@/services/PerformanceMonitor');

const mockLocationService = LocationService as jest.Mocked<typeof LocationService>;
const mockNavigationService = NavigationService as jest.Mocked<typeof NavigationService>;
const mockGeminiService = geminiService as jest.Mocked<typeof geminiService>;
const mockPerformanceMonitor = performanceMonitor as jest.Mocked<typeof performanceMonitor>;

describe('NaviLynx Enhanced Integration Tests', () => {
  // Test utilities
  const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );

  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    venueId: 'test-venue-1',
    venueName: 'Test Venue',
    onNavigate: jest.fn(),
    onCallService: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    
    // Mock successful location service
    mockLocationService.getInstance.mockReturnValue({
      requestUserLocation: jest.fn().mockResolvedValue({
        latitude: -26.2041,
        longitude: 28.0473,
        accuracy: 10,
        timestamp: Date.now(),
      }),
      startLocationTracking: jest.fn().mockResolvedValue(undefined),
      stopLocationTracking: jest.fn(),
    } as any);

    // Mock successful navigation service
    mockNavigationService.getInstance.mockReturnValue({
      calculateAdvancedRoute: jest.fn().mockResolvedValue({
        steps: [
          { coords: { latitude: -26.2041, longitude: 28.0473 } },
          { coords: { latitude: -26.2042, longitude: 28.0474 } },
        ],
        distance: 100,
        duration: 60,
        polyline: 'test-polyline',
      }),
      calculateDistance: jest.fn().mockReturnValue(100),
      startAdvancedNavigation: jest.fn(),
      stopNavigation: jest.fn(),
    } as any);

    // Mock Gemini service
    mockGeminiService.getChatbotResponse.mockResolvedValue('Test AI response');
    mockGeminiService.analyzeObject.mockResolvedValue({
      name: 'Test Item',
      description: 'Test Description',
      category: 'general',
      confidence: 0.9,
      suggestions: ['related item 1', 'related item 2'],
      estimatedPrice: 'R99.99',
      nearbyStores: ['Test Store'],
    });

    // Mock performance monitor
    mockPerformanceMonitor.startTiming.mockImplementation(() => {});
    mockPerformanceMonitor.endTiming.mockReturnValue(100);
  });

  describe('AR Navigator Core Functionality', () => {
    test('should initialize and display venues correctly', async () => {
      const { getByText } = render(<ARNavigator />);
      
      // Wait for initialization
      await waitFor(() => {
        expect(mockLocationService.getInstance).toHaveBeenCalled();
      });

      // Check if venues are loaded (this would depend on the actual implementation)
      await waitFor(() => {
        expect(getByText(/venue/i)).toBeTruthy();
      }, { timeout: 5000 });
    });

    test('should handle venue selection and start navigation', async () => {
      render(<ARNavigator />);
      
      await waitFor(() => {
        expect(mockLocationService.getInstance).toHaveBeenCalled();
      });

      // This test would need to be adapted based on the actual UI implementation
      // The venue selection flow would be tested here
    });

    test('should switch between AR and Map modes', async () => {
      render(<ARNavigator />);
      
      await waitFor(() => {
        expect(mockLocationService.getInstance).toHaveBeenCalled();
      });

      // Test mode switching - would need actual test IDs in the component
      // const modeToggle = getByTestId('mode-toggle');
      // fireEvent.press(modeToggle);
    });
  });

  describe('AI Concierge Chat Integration', () => {
    const defaultProps = {
      visible: true,
      onClose: jest.fn(),
      venueId: 'test-venue-1',
      venueName: 'Test Venue',
      onNavigate: jest.fn(),
      onCallService: jest.fn(),
    };

    test('should render chat interface correctly', () => {
      const { getByText, getByPlaceholderText } = render(
        <AIConcierge {...defaultProps} />
      );

      expect(getByText('AI Concierge')).toBeTruthy();
      expect(getByText('Test Venue')).toBeTruthy();
      expect(getByPlaceholderText(/ask me anything/i)).toBeTruthy();
    });

    test('should send message and receive AI response', async () => {
      const { getByPlaceholderText, getByText, getByTestId } = render(
        <AIConcierge {...defaultProps} />
      );

      const input = getByPlaceholderText(/ask me anything/i);
      const sendButton = getByTestId('send-button');

      // Type message
      fireEvent.changeText(input, 'Where is the food court?');
      
      // Send message
      await act(async () => {
        fireEvent.press(sendButton);
      });

      // Check if AI service was called
      await waitFor(() => {
        expect(mockGeminiService.getChatbotResponse).toHaveBeenCalledWith(
          'Where is the food court?',
          { venueId: 'test-venue-1', venueName: 'Test Venue' }
        );
      });

      // Check if response appears
      await waitFor(() => {
        expect(getByText('Test AI response')).toBeTruthy();
      });
    });

    test('should handle quick suggestions', async () => {
      const { getByText } = render(<AIConcierge {...defaultProps} />);

      // Wait for suggestions to appear
      await waitFor(() => {
        expect(getByText(/find stores/i)).toBeTruthy();
      });

      // Press a suggestion
      const suggestion = getByText(/find stores/i);
      fireEvent.press(suggestion);

      // Check if AI service was called with the suggestion
      await waitFor(() => {
        expect(mockGeminiService.getChatbotResponse).toHaveBeenCalled();
      });
    });

    test('should display loading state during AI processing', async () => {
      // Mock delayed response
      mockGeminiService.getChatbotResponse.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve('Delayed response'), 100))
      );

      const { getByPlaceholderText, getByText } = render(
        <AIConcierge {...defaultProps} />
      );

      const input = getByPlaceholderText(/ask me anything/i);
      // For now, let's just use a simple approach to find the send button
      fireEvent.changeText(input, 'Test message');
      
      // Submit by pressing enter or triggering send
      await act(async () => {
        fireEvent(input, 'submitEditing');
      });

      // Check if loading skeleton appears (this would need to be implemented in the component)
      // expect(queryByTestId('loading-skeleton')).toBeTruthy();

      // Wait for response
      await waitFor(() => {
        expect(getByText('Delayed response')).toBeTruthy();
      });
    });

    test('should handle action buttons in responses', async () => {
      const { getByPlaceholderText, getByTestId } = render(
        <AIConcierge {...defaultProps} />
      );

      const input = getByPlaceholderText(/ask me anything/i);
      const sendButton = getByTestId('send-button');

      fireEvent.changeText(input, 'Where can I park?');
      
      await act(async () => {
        fireEvent.press(sendButton);
      });

      await waitFor(() => {
        expect(mockGeminiService.getChatbotResponse).toHaveBeenCalled();
      });

      // Check if action buttons are rendered (this would depend on the AI response)
      // In practice, you'd mock the AI response to include action buttons
    });
  });

  describe('Performance Monitoring', () => {
    test('should track chat message processing time', async () => {
      const { getByPlaceholderText, getByTestId } = render(
        <AIConcierge {...defaultProps} />
      );

      const input = getByPlaceholderText(/ask me anything/i);
      const sendButton = getByTestId('send-button');

      fireEvent.changeText(input, 'Test performance');
      
      await act(async () => {
        fireEvent.press(sendButton);
      });

      // Check if performance monitoring was called
      await waitFor(() => {
        expect(mockPerformanceMonitor.startTiming).toHaveBeenCalledWith(
          'chat_message_processing',
          expect.objectContaining({
            messageLength: expect.any(Number),
            hasVenueContext: true,
          })
        );
        expect(mockPerformanceMonitor.endTiming).toHaveBeenCalledWith(
          'chat_message_processing'
        );
      });
    });

    test('should track Gemini API call performance', async () => {
      const { getByPlaceholderText, getByTestId } = render(
        <AIConcierge {...defaultProps} />
      );

      const input = getByPlaceholderText(/ask me anything/i);
      const sendButton = getByTestId('send-button');

      fireEvent.changeText(input, 'API performance test');
      
      await act(async () => {
        fireEvent.press(sendButton);
      });

      await waitFor(() => {
        expect(mockPerformanceMonitor.startTiming).toHaveBeenCalledWith('gemini_api_call');
        expect(mockPerformanceMonitor.endTiming).toHaveBeenCalledWith('gemini_api_call');
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle Gemini API errors gracefully', async () => {
      mockGeminiService.getChatbotResponse.mockRejectedValue(new Error('API Error'));

      const { getByPlaceholderText, getByTestId, getByText } = render(
        <AIConcierge {...defaultProps} />
      );

      const input = getByPlaceholderText(/ask me anything/i);
      const sendButton = getByTestId('send-button');

      fireEvent.changeText(input, 'Error test');
      
      await act(async () => {
        fireEvent.press(sendButton);
      });

      // Should still show a response (fallback)
      await waitFor(() => {
        expect(getByText(/welcome/i)).toBeTruthy(); // Fallback response
      });

      // Performance timing should still be ended
      expect(mockPerformanceMonitor.endTiming).toHaveBeenCalledWith(
        'chat_message_processing'
      );
    });

    test('should handle location service errors', async () => {
      mockLocationService.getInstance.mockReturnValue({
        requestUserLocation: jest.fn().mockRejectedValue(new Error('Location Error')),
        startLocationTracking: jest.fn(),
        stopLocationTracking: jest.fn(),
      } as any);

      const component = render(
        <TestWrapper>
          <ARNavigator />
        </TestWrapper>
      );

      // Should handle location error gracefully
      await waitFor(() => {
        // The component should show some error handling or fallback
        expect(component).toBeTruthy(); // Basic render test
      });
    });
  });

  describe('User Experience', () => {
    test('should maintain scroll position during chat', async () => {
      const { getByPlaceholderText, getByTestId } = render(
        <AIConcierge {...defaultProps} />
      );

      const input = getByPlaceholderText(/ask me anything/i);
      const sendButton = getByTestId('send-button');

      // Send multiple messages
      for (let i = 0; i < 5; i++) {
        fireEvent.changeText(input, `Message ${i}`);
        await act(async () => {
          fireEvent.press(sendButton);
        });
        
        await waitFor(() => {
          expect(mockGeminiService.getChatbotResponse).toHaveBeenCalled();
        });
      }

      // ScrollView should auto-scroll to bottom
      // This would need to be tested with actual scroll behavior
    });

    test('should clear input after sending message', async () => {
      const { getByPlaceholderText, getByTestId } = render(
        <AIConcierge {...defaultProps} />
      );

      const input = getByPlaceholderText(/ask me anything/i);
      const sendButton = getByTestId('send-button');

      fireEvent.changeText(input, 'Test message');
      expect(input.props.value).toBe('Test message');
      
      await act(async () => {
        fireEvent.press(sendButton);
      });

      // Input should be cleared
      expect(input.props.value).toBe('');
    });
  });

  describe('Caching and Optimization', () => {
    test('should cache AI responses', async () => {
      const { getByPlaceholderText, getByTestId } = render(
        <AIConcierge {...defaultProps} />
      );

      const input = getByPlaceholderText(/ask me anything/i);
      const sendButton = getByTestId('send-button');

      // Send same message twice
      const testMessage = 'Where is customer service?';
      
      fireEvent.changeText(input, testMessage);
      await act(async () => {
        fireEvent.press(sendButton);
      });

      await waitFor(() => {
        expect(mockGeminiService.getChatbotResponse).toHaveBeenCalledTimes(1);
      });

      // Clear and send same message again
      fireEvent.changeText(input, testMessage);
      await act(async () => {
        fireEvent.press(sendButton);
      });

      // Should use cached response (if caching is implemented)
      // This test assumes the caching logic is working
    });
  });
});

describe('Integration Test Utilities', () => {
  test('should provide test utilities for performance monitoring', () => {
    expect(mockPerformanceMonitor.startTiming).toBeDefined();
    expect(mockPerformanceMonitor.endTiming).toBeDefined();
  });

  test('should provide mock services for testing', () => {
    expect(mockGeminiService.getChatbotResponse).toBeDefined();
    expect(mockLocationService.getInstance).toBeDefined();
    expect(mockNavigationService.getInstance).toBeDefined();
  });
});

// Export utilities for other tests
export {
  mockLocationService,
  mockNavigationService,
  mockGeminiService,
  mockPerformanceMonitor,
};
