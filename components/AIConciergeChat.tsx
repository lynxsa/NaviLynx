import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { geminiService } from '@/services/geminiService';
import { LoadingSkeleton } from '@/components/ui/LoadingStates';
import { timing } from '@/services/PerformanceMonitor';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'location' | 'action';
  actions?: ChatAction[];
  suggestions?: string[];
}

interface ChatAction {
  id: string;
  label: string;
  action: () => void;
  icon?: string;
  color?: string;
}

interface AIConciergeProps {
  visible: boolean;
  onClose: () => void;
  venueId?: string;
  venueName?: string;
  onNavigate?: (destination: string) => void;
  onCallService?: (service: string) => void;
}

export function AIConcierge({ 
  visible, 
  onClose, 
  venueId, 
  venueName = 'Venue',
  onNavigate,
  onCallService 
}: AIConciergeProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [quickSuggestions] = useState([
    'Find nearest restroom',
    'Where is the food court?',
    'Store hours and locations',
    'Parking information',
    'Emergency services',
    'WiFi password'
  ]);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const typingAnim = useRef(new Animated.Value(0)).current;

  const initializeChat = useCallback(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      text: `Hi! I'm your AI assistant for ${venueName}. I can help you find stores, get directions, check amenities, and answer questions about the venue. How can I assist you today?`,
      isUser: false,
      timestamp: new Date(),
      type: 'text',
      suggestions: [
        'Find a specific store',
        'Get directions to parking',
        'What restaurants are open?',
        'Emergency information'
      ]
    };

    setMessages([welcomeMessage]);
  }, [venueName]);

  useEffect(() => {
    if (visible) {
      initializeChat();
    } else {
      setMessages([]);
      setInputText('');
    }
  }, [visible, venueName, initializeChat]);

  useEffect(() => {
    if (isTyping) {
      Animated.timing(typingAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(typingAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [isTyping, typingAnim]);

  const generateAIResponse = useCallback((userMessage: string): Message => {
    const message = userMessage.toLowerCase();
    
    // Store/location queries
    if (message.includes('store') || message.includes('shop') || message.includes('find')) {
      if (message.includes('food') || message.includes('restaurant') || message.includes('eat')) {
        return {
          id: Date.now().toString(),
          text: "I found several dining options for you! The main food court is on Level 2, and we have restaurants on Ground Floor and Level 1. Would you like directions to a specific type of cuisine?",
          isUser: false,
          timestamp: new Date(),
          type: 'suggestion',
          actions: [{
            id: 'navigate-food',
            label: 'Show Food Court',
            action: () => onNavigate?.('Food Court - Level 2'),
            icon: 'restaurant'
          }],
          suggestions: ['Italian restaurants', 'Fast food options', 'Coffee shops']
        };
      }
      
      if (message.includes('clothing') || message.includes('fashion') || message.includes('clothes')) {
        return {
          id: Date.now().toString(),
          text: `Great! ${venueName} has many fashion stores. Popular clothing stores include H&M, Zara, and Woolworths on Level 1, and Cotton On and Mr Price on Ground Floor. What type of clothing are you looking for?`,
          isUser: false,
          timestamp: new Date(),
          type: 'suggestion',
          suggestions: ['Women\'s fashion', 'Men\'s clothing', 'Children\'s wear', 'Sports wear']
        };
      }
    }
    
    // Navigation queries
    if (message.includes('where') || message.includes('directions') || message.includes('location')) {
      return {
        id: Date.now().toString(),
        text: "I can help you navigate! What are you looking for? I can provide directions to stores, restaurants, restrooms, exits, and other facilities.",
        isUser: false,
        timestamp: new Date(),
        type: 'suggestion',
        suggestions: ['Restrooms', 'ATM', 'Customer Service', 'Parking', 'Exit']
      };
    }
    
    // Services and amenities
    if (message.includes('help') || message.includes('service') || message.includes('assistance')) {
      return {
        id: Date.now().toString(),
        text: "I'm here to help! I can assist with store information, directions, current promotions, and general venue services. You can also call our customer service if you need immediate assistance.",
        isUser: false,
        timestamp: new Date(),
        type: 'suggestion',
        actions: [{
          id: 'call-service',
          label: 'Call Customer Service',
          action: () => onCallService?.('customer-service'),
          icon: 'call'
        }],
        suggestions: [
          'Store directory', 
          'Current promotions', 
          'Facility information',
          'Lost and found'
        ]
      };
    }
    
    // Parking queries
    if (message.includes('park') || message.includes('car') || message.includes('vehicle')) {
      return {
        id: Date.now().toString(),
        text: "Parking information: We have covered parking on Levels P1-P3. Parking is free for the first 2 hours, then R5 per hour. Electric vehicle charging stations are available on Level P1.",
        isUser: false,
        timestamp: new Date(),
        type: 'suggestion',
        actions: [{
          id: 'navigate-parking',
          label: 'Show Parking',
          action: () => onNavigate?.('Parking Entrance'),
          icon: 'car'
        }],
        suggestions: ['Parking rates', 'EV charging', 'Parking levels', 'Exit routes']
      };
    }
    
    // Default response
    return {
      id: Date.now().toString(),
      text: `Hello! Welcome to ${venueName}. I'm your AI concierge assistant. I can help you find stores, restaurants, services, and navigate around the venue. What can I help you with today?`,
      isUser: false,
      timestamp: new Date(),
      type: 'suggestion',
      suggestions: [
        'Find stores', 
        'Dining options', 
        'Amenities & services',
        'Parking & transportation',
        'Current promotions'
      ]
    };
  }, [venueName, onNavigate, onCallService]);

  const handleSendMessage = useCallback(async (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    // Start performance timing
    timing.start('chat_message_processing', { 
      messageLength: messageText.length,
      hasVenueContext: !!venueId 
    });

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      // Use real Gemini AI for responses with structured context
      const chatContext = { venueId, venueName };
      
      // Track Gemini API call
      timing.start('gemini_api_call');
      const aiResponseText = await geminiService.getChatbotResponse(messageText, chatContext);
      timing.end('gemini_api_call');
      
      // Create AI response message
      const aiResponse: Message = {
        id: Date.now().toString(),
        text: aiResponseText,
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      
      // End performance timing
      timing.end('chat_message_processing');
      
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('AI response error:', error);
      // Fallback to hardcoded response if AI fails
      const fallbackResponse = generateAIResponse(messageText);
      setMessages(prev => [...prev, fallbackResponse]);
      setIsTyping(false);
      
      // End performance timing even on error
      timing.end('chat_message_processing');
      
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [inputText, venueId, venueName, generateAIResponse]);

  const handleSuggestionPress = useCallback((suggestion: string) => {
    handleSendMessage(suggestion);
  }, [handleSendMessage]);

  const handleActionPress = (action: ChatAction) => {
    action.action();
  };

  if (!visible) return null;

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarContainer}>
            <Ionicons name="chatbox" size={24} color="#007AFF" />
          </View>
          <View>
            <Text style={styles.headerTitle}>AI Concierge</Text>
            <Text style={styles.headerSubtitle}>{venueName}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View key={message.id} style={[
            styles.messageContainer,
            message.isUser ? styles.userMessage : styles.aiMessage
          ]}>
            <View style={[
              styles.messageBubble,
              message.isUser ? styles.userBubble : styles.aiBubble
            ]}>
              <Text style={[
                styles.messageText,
                message.isUser ? styles.userText : styles.aiText
              ]}>
                {message.text}
              </Text>
              
              {/* Action buttons */}
              {message.actions && (
                <View style={styles.actionsContainer}>
                  {message.actions.map((action) => (
                    <TouchableOpacity
                      key={action.id}
                      style={[styles.actionButton, { backgroundColor: action.color || '#007AFF' }]}
                      onPress={() => handleActionPress(action)}
                    >
                      {action.icon && (
                        <Ionicons name={action.icon as any} size={16} color="white" />
                      )}
                      <Text style={styles.actionButtonText}>{action.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Suggestions */}
              {message.suggestions && (
                <View style={styles.suggestionsContainer}>
                  {message.suggestions.map((suggestion, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.suggestionButton}
                      onPress={() => handleSuggestionPress(suggestion)}
                    >
                      <Text style={styles.suggestionText}>{suggestion}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            <Text style={styles.timestamp}>
              {message.timestamp.toLocaleTimeString('en-ZA', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
          </View>
        ))}
        
        {isTyping && (
          <View style={[styles.messageContainer, styles.aiMessage]}>
            <View style={[styles.messageBubble, styles.aiBubble]}>
              <View style={styles.typingContainer}>
                <LoadingSkeleton width={40} height={12} style={{ marginBottom: 4 }} />
                <LoadingSkeleton width={60} height={12} style={{ marginBottom: 4 }} />
                <LoadingSkeleton width={30} height={12} />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Quick Suggestions */}
      {messages.length <= 1 && (
        <View style={styles.quickSuggestionsContainer}>
          <Text style={styles.quickSuggestionsTitle}>Quick Help:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {quickSuggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickSuggestionButton}
                onPress={() => handleSuggestionPress(suggestion)}
              >
                <Text style={styles.quickSuggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          testID="message-input"
          style={styles.textInput}
          placeholder="Ask me anything about the venue..."
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          testID="send-button"
          style={[styles.sendButton, { opacity: inputText.trim() ? 1 : 0.5 }]}
          onPress={() => handleSendMessage()}
          disabled={!inputText.trim()}
        >
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  closeButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 18,
    padding: 12,
  },
  userBubble: {
    backgroundColor: '#007AFF',
  },
  aiBubble: {
    backgroundColor: '#f1f1f1',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: 'white',
  },
  aiText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  actionsContainer: {
    marginTop: 12,
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    gap: 6,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  suggestionsContainer: {
    marginTop: 12,
    gap: 6,
  },
  suggestionButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    borderRadius: 8,
  },
  suggestionText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  quickSuggestionsContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  quickSuggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  quickSuggestionButton: {
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  quickSuggestionText: {
    fontSize: 13,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typingContainer: {
    flexDirection: 'column',
    gap: 4,
  },
});
