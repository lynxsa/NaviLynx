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
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

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

    // Simulate AI response delay
    setTimeout(() => {
      const response = generateAIResponse(messageText);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
      
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1500);
  };

  const generateAIResponse = (userMessage: string): Message => {
    const message = userMessage.toLowerCase();
    
    // Store/location queries
    if (message.includes('store') || message.includes('shop') || message.includes('find')) {
      if (message.includes('food') || message.includes('restaurant') || message.includes('eat')) {
        return {
          id: Date.now().toString(),
          text: "I found several dining options for you! The main food court is on Level 2, and we have restaurants on Ground Floor and Level 1. Would you like directions to a specific type of cuisine?",
          isUser: false,
          timestamp: new Date(),
          type: 'action',
          actions: [
            {
              id: 'navigate-food-court',
              label: 'Navigate to Food Court',
              action: () => onNavigate?.('Food Court - Level 2'),
              icon: 'restaurant',
              color: '#FF6B35'
            },
            {
              id: 'show-restaurants',
              label: 'View All Restaurants',
              action: () => Alert.alert('Restaurants', 'McDonald\'s, KFC, Nando\'s, Ocean Basket, Primi Piatti'),
              icon: 'list',
              color: '#007AFF'
            }
          ]
        };
      }
      
      if (message.includes('clothes') || message.includes('fashion') || message.includes('clothing')) {
        return {
          id: Date.now().toString(),
          text: "Fashion stores are mainly located on Levels 1 and 2. Popular brands include Zara, H&M, Woolworths, Mr Price, and Edgars. Which type of clothing are you looking for?",
          isUser: false,
          timestamp: new Date(),
          type: 'action',
          actions: [
            {
              id: 'navigate-fashion',
              label: 'Show Fashion Stores',
              action: () => onNavigate?.('Fashion District - Level 1'),
              icon: 'shirt',
              color: '#FF3B82'
            }
          ]
        };
      }

      if (message.includes('electronics') || message.includes('phone') || message.includes('tech')) {
        return {
          id: Date.now().toString(),
          text: "Electronics stores are on Level 2. You'll find iStore, Samsung Store, Incredible Connection, and Game. Need directions to a specific tech store?",
          isUser: false,
          timestamp: new Date(),
          type: 'action',
          actions: [
            {
              id: 'navigate-electronics',
              label: 'Navigate to Electronics',
              action: () => onNavigate?.('Electronics Section - Level 2'),
              icon: 'phone-portrait',
              color: '#007AFF'
            }
          ]
        };
      }

      return {
        id: Date.now().toString(),
        text: "I can help you find any store! Could you be more specific about what type of store or brand you're looking for? Popular categories include fashion, electronics, home goods, beauty, and dining.",
        isUser: false,
        timestamp: new Date(),
        type: 'suggestion',
        suggestions: ['Fashion stores', 'Electronics', 'Beauty & cosmetics', 'Home & decor', 'Sporting goods']
      };
    }

    // Directions/navigation queries
    if (message.includes('toilet') || message.includes('restroom') || message.includes('bathroom')) {
      return {
        id: Date.now().toString(),
        text: "Restrooms are located on every level near the lifts. The closest one to you is likely on this floor. Would you like directions?",
        isUser: false,
        timestamp: new Date(),
        type: 'action',
        actions: [
          {
            id: 'navigate-restroom',
            label: 'Navigate to Nearest Restroom',
            action: () => onNavigate?.('Nearest Restroom'),
            icon: 'man',
            color: '#34C759'
          }
        ]
      };
    }

    if (message.includes('parking') || message.includes('car')) {
      return {
        id: Date.now().toString(),
        text: "Parking is available on levels P1, P2, and P3. Rates are R10/hour or R50 for the full day. VIP parking is R15/hour. Do you need directions back to your car or to find a parking spot?",
        isUser: false,
        timestamp: new Date(),
        type: 'action',
        actions: [
          {
            id: 'navigate-parking',
            label: 'Find My Car',
            action: () => Alert.alert('Parking Assistant', 'Opening parking assistant to help locate your vehicle...'),
            icon: 'car',
            color: '#007AFF'
          },
          {
            id: 'parking-rates',
            label: 'View Parking Rates',
            action: () => Alert.alert('Parking Rates', 'Hourly: R10\nDaily: R50\nVIP: R15/hour\nWeekend special: R30/day'),
            icon: 'card',
            color: '#FF9500'
          }
        ]
      };
    }

    if (message.includes('exit') || message.includes('way out') || message.includes('leave')) {
      return {
        id: Date.now().toString(),
        text: "There are several exits available. The main entrance is on Ground Floor, and there are side exits on each level. Emergency exits are clearly marked. Which exit would you prefer?",
        isUser: false,
        timestamp: new Date(),
        type: 'action',
        actions: [
          {
            id: 'navigate-main-exit',
            label: 'Main Entrance',
            action: () => onNavigate?.('Main Entrance'),
            icon: 'exit',
            color: '#34C759'
          },
          {
            id: 'navigate-nearest-exit',
            label: 'Nearest Exit',
            action: () => onNavigate?.('Nearest Exit'),
            icon: 'arrow-forward',
            color: '#FF6B35'
          }
        ]
      };
    }

    // Services and amenities
    if (message.includes('wifi') || message.includes('internet')) {
      return {
        id: Date.now().toString(),
        text: "Free WiFi is available throughout the venue. Network: 'VenueFreeWiFi' - Password: 'Welcome2024'. Premium WiFi is also available for faster speeds.",
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };
    }

    if (message.includes('atm') || message.includes('money') || message.includes('bank')) {
      return {
        id: Date.now().toString(),
        text: "ATMs are available on Ground Floor (Standard Bank, FNB) and Level 1 (ABSA, Nedbank). There's also a currency exchange on Ground Floor.",
        isUser: false,
        timestamp: new Date(),
        type: 'action',
        actions: [
          {
            id: 'navigate-atm',
            label: 'Find Nearest ATM',
            action: () => onNavigate?.('ATM - Ground Floor'),
            icon: 'card',
            color: '#34C759'
          }
        ]
      };
    }

    if (message.includes('hours') || message.includes('time') || message.includes('open')) {
      return {
        id: Date.now().toString(),
        text: `${venueName} is open:\nMon-Thu: 9:00 AM - 9:00 PM\nFri-Sat: 9:00 AM - 10:00 PM\nSun: 9:00 AM - 8:00 PM\n\nSome restaurants may have extended hours.`,
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };
    }

    if (message.includes('emergency') || message.includes('help') || message.includes('security')) {
      return {
        id: Date.now().toString(),
        text: "For emergencies, security is available 24/7. Emergency exits are clearly marked. Medical services are available on Ground Floor.",
        isUser: false,
        timestamp: new Date(),
        type: 'action',
        actions: [
          {
            id: 'call-security',
            label: 'Contact Security',
            action: () => onCallService?.('Security'),
            icon: 'shield',
            color: '#FF3B30'
          },
          {
            id: 'navigate-medical',
            label: 'Medical Services',
            action: () => onNavigate?.('Medical Center - Ground Floor'),
            icon: 'medical',
            color: '#34C759'
          }
        ]
      };
    }

    // Events and promotions
    if (message.includes('event') || message.includes('promotion') || message.includes('sale')) {
      return {
        id: Date.now().toString(),
        text: "Current promotions include:\n• Summer Sale at Zara (30% off)\n• Tech Week at electronics stores\n• Buy 2 Get 1 Free at selected bookstores\n\nCheck the digital displays for more current offers!",
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };
    }

    // Default response
    return {
      id: Date.now().toString(),
      text: "I'd be happy to help you with that! I can assist with finding stores, getting directions, checking amenities, store hours, parking information, and general venue questions. What specific information are you looking for?",
      isUser: false,
      timestamp: new Date(),
      type: 'suggestion',
      suggestions: [
        'Store locations',
        'Dining options', 
        'Amenities & services',
        'Parking & transportation',
        'Current promotions'
      ]
    };
  };

  const handleSuggestionPress = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleActionPress = (action: ChatAction) => {
    action.action();
  };

  const TypingIndicator = () => (
    <View style={styles.typingContainer}>
      <Animated.View style={[styles.typingDot, { opacity: typingAnim }]} />
      <Animated.View style={[styles.typingDot, { opacity: typingAnim }]} />
      <Animated.View style={[styles.typingDot, { opacity: typingAnim }]} />
    </View>
  );

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
              <TypingIndicator />
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
          style={styles.textInput}
          placeholder="Ask me anything about the venue..."
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#666',
  },
});
