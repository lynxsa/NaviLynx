import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { useNavigationState } from '@/hooks/useNavigationState';
import { Spacing, BorderRadius, Typography, Shadows } from '@/constants/Theme';

const { width: screenWidth } = Dimensions.get('window');

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type: 'text' | 'action' | 'suggestion';
  actions?: ChatAction[];
  isTyping?: boolean;
}

interface ChatAction {
  id: string;
  title: string;
  icon: string;
  action: () => void;
  color?: string;
}

interface QuickReply {
  id: string;
  text: string;
  action: () => void;
}

interface SuggestedAction {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  action: () => void;
}

export default function ChatScreenEnhanced() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { goBack, navigateToVenue, navigateToCategory } = useNavigationState();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(true);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Quick replies
  const quickReplies: QuickReply[] = [
    {
      id: '1',
      text: 'Find stores',
      action: () => handleQuickReply('Show me nearby stores'),
    },
    {
      id: '2',
      text: 'Directions',
      action: () => handleQuickReply('I need directions'),
    },
    {
      id: '3',
      text: 'Restaurants',
      action: () => handleQuickReply('Find restaurants'),
    },
    {
      id: '4',
      text: 'Parking',
      action: () => handleQuickReply('Where can I park?'),
    },
  ];

  // Suggested actions
  const suggestedActions: SuggestedAction[] = [
    {
      id: '1',
      title: 'Browse Stores',
      subtitle: 'Explore all available shops',
      icon: 'bag.fill',
      color: colors.primary,
      action: () => {
        navigateToCategory('shopping', 'Shopping');
        addMessage('Navigate to shopping category', 'user');
      },
    },
    {
      id: '2',
      title: 'Find Food',
      subtitle: 'Discover restaurants and cafes',
      icon: 'fork.knife',
      color: colors.secondary,
      action: () => {
        navigateToCategory('dining', 'Dining');
        addMessage('Show me restaurants', 'user');
      },
    },
    {
      id: '3',
      title: 'AR Navigation',
      subtitle: 'Use camera for directions',
      icon: 'camera.viewfinder',
      color: colors.accent,
      action: () => {
        router.push('/ar-navigator');
        addMessage('Start AR navigation', 'user');
      },
    },
    {
      id: '4',
      title: 'Emergency Help',
      subtitle: 'Get immediate assistance',
      icon: 'exclamationmark.triangle.fill',
      color: colors.error,
      action: () => {
        Alert.alert('Emergency', 'Connecting you to mall security...');
        addMessage('I need emergency help', 'user');
      },
    },
  ];

  useEffect(() => {
    initializeChat();
    startEntranceAnimation();
  }, []);

  const initializeChat = () => {
    const welcomeMessage: ChatMessage = {
      id: '1',
      text: `Hello ${user?.fullName || 'there'}! 👋 I'm your NaviLynx assistant. How can I help you navigate today?`,
      sender: 'assistant',
      timestamp: new Date(),
      type: 'text',
    };
    
    setMessages([welcomeMessage]);
  };

  const startEntranceAnimation = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const addMessage = useCallback((text: string, sender: 'user' | 'assistant', type: 'text' | 'action' | 'suggestion' = 'text') => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      type,
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Auto-scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  const handleQuickReply = (text: string) => {
    addMessage(text, 'user');
    setShowQuickReplies(false);
    
    // Simulate assistant response
    setTimeout(() => {
      simulateAssistantResponse(text);
    }, 1000);
  };

  const simulateAssistantResponse = (userMessage: string) => {
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      
      let response = '';
      let actions: ChatAction[] = [];
      
      if (userMessage.toLowerCase().includes('store') || userMessage.toLowerCase().includes('shop')) {
        response = "I found several popular stores nearby! Here are some options:";
        actions = [
          {
            id: '1',
            title: 'Zara',
            icon: 'bag.fill',
            action: () => navigateToVenue('1', 'Zara'),
            color: colors.primary,
          },
          {
            id: '2',
            title: 'iStore',
            icon: 'phone.fill',
            action: () => navigateToVenue('2', 'iStore'),
            color: colors.secondary,
          },
          {
            id: '3',
            title: 'Browse All',
            icon: 'list.bullet',
            action: () => navigateToCategory('shopping', 'Shopping'),
            color: colors.accent,
          },
        ];
      } else if (userMessage.toLowerCase().includes('restaurant') || userMessage.toLowerCase().includes('food')) {
        response = "Great choice! Here are some dining options:";
        actions = [
          {
            id: '1',
            title: 'Vida e Caffè',
            icon: 'cup.and.saucer.fill',
            action: () => navigateToVenue('3', 'Vida e Caffè'),
            color: '#8B4513',
          },
          {
            id: '2',
            title: 'Kauai',
            icon: 'leaf.fill',
            action: () => navigateToVenue('4', 'Kauai'),
            color: '#32CD32',
          },
          {
            id: '3',
            title: 'View All Restaurants',
            icon: 'fork.knife',
            action: () => navigateToCategory('dining', 'Dining'),
            color: colors.secondary,
          },
        ];
      } else if (userMessage.toLowerCase().includes('direction') || userMessage.toLowerCase().includes('navigate')) {
        response = "I can help you navigate! Choose how you'd like to get directions:";
        actions = [
          {
            id: '1',
            title: 'AR Navigation',
            icon: 'camera.viewfinder',
            action: () => router.push('/ar-navigator'),
            color: colors.accent,
          },
          {
            id: '2',
            title: 'Map View',
            icon: 'map.fill',
            action: () => router.push('/explore'),
            color: colors.primary,
          },
          {
            id: '3',
            title: 'Text Directions',
            icon: 'text.bubble.fill',
            action: () => addMessage('Please tell me your destination', 'assistant'),
            color: colors.secondary,
          },
        ];
      } else if (userMessage.toLowerCase().includes('park')) {
        response = "I can help you find parking! Here are the available options:";
        actions = [
          {
            id: '1',
            title: 'Basement Parking',
            icon: 'car.fill',
            action: () => addMessage('Basement parking has 45 available spots', 'assistant'),
            color: colors.success,
          },
          {
            id: '2',
            title: 'Street Parking',
            icon: 'road.lanes',
            action: () => addMessage('Street parking is limited, check nearby streets', 'assistant'),
            color: colors.warning,
          },
          {
            id: '3',
            title: 'Premium Parking',
            icon: 'star.fill',
            action: () => addMessage('Premium covered parking available on Level 2', 'assistant'),
            color: colors.accent,
          },
        ];
      } else {
        response = "I understand you need help! Here are some things I can assist you with:";
        actions = [
          {
            id: '1',
            title: 'Store Directory',
            icon: 'list.bullet',
            action: () => navigateToCategory('shopping', 'Shopping'),
            color: colors.primary,
          },
          {
            id: '2',
            title: 'Get Directions',
            icon: 'arrow.triangle.turn.up.right.diamond.fill',
            action: () => router.push('/ar-navigator'),
            color: colors.secondary,
          },
          {
            id: '3',
            title: 'Find Facilities',
            icon: 'building.2.fill',
            action: () => addMessage('What facility are you looking for?', 'assistant'),
            color: colors.accent,
          },
        ];
      }
      
      const responseMessage: ChatMessage = {
        id: Date.now().toString(),
        text: response,
        sender: 'assistant',
        timestamp: new Date(),
        type: actions.length > 0 ? 'action' : 'text',
        actions,
      };
      
      setMessages(prev => [...prev, responseMessage]);
      
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1500);
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      addMessage(inputText.trim(), 'user');
      setInputText('');
      setShowQuickReplies(false);
      setShowSuggestions(false);
      
      // Simulate assistant response
      setTimeout(() => {
        simulateAssistantResponse(inputText.trim());
      }, 1000);
    }
  };

  const renderMessage = (message: ChatMessage, index: number) => {
    const isUser = message.sender === 'user';
    
    return (
      <Animated.View
        key={message.id}
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.assistantMessageContainer,
          { transform: [{ translateY: slideAnim }], opacity: fadeAnim },
        ]}
      >
        {!isUser && (
          <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
            <IconSymbol name="sparkles" size={16} color="#FFFFFF" />
          </View>
        )}
        
        <View style={[
          styles.messageBubble,
          isUser 
            ? { backgroundColor: colors.primary }
            : { backgroundColor: colors.surface },
        ]}>
          <Text style={[
            styles.messageText,
            { color: isUser ? '#FFFFFF' : colors.text },
          ]}>
            {message.text}
          </Text>
          
          {message.actions && message.actions.length > 0 && (
            <View style={styles.actionsContainer}>
              {message.actions.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={[
                    styles.actionButton,
                    { backgroundColor: action.color || colors.accent },
                  ]}
                  onPress={action.action}
                >
                  <IconSymbol name={action.icon as any} size={16} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>
                    {action.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          <Text style={[
            styles.timestamp,
            { color: isUser ? '#FFFFFF80' : colors.mutedForeground },
          ]}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        
        {isUser && (
          <View style={[styles.avatarContainer, { backgroundColor: colors.secondary }]}>
            <IconSymbol name="person.fill" size={16} color="#FFFFFF" />
          </View>
        )}
      </Animated.View>
    );
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;
    
    return (
      <View style={[styles.messageContainer, styles.assistantMessageContainer]}>
        <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
          <IconSymbol name="sparkles" size={16} color="#FFFFFF" />
        </View>
        <View style={[styles.messageBubble, { backgroundColor: colors.surface }]}>
          <View style={styles.typingContainer}>
            <View style={[styles.typingDot, { backgroundColor: colors.mutedForeground }]} />
            <View style={[styles.typingDot, { backgroundColor: colors.mutedForeground }]} />
            <View style={[styles.typingDot, { backgroundColor: colors.mutedForeground }]} />
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <IconSymbol name="chevron.left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>NaviLynx Assistant</Text>
          <Text style={styles.headerSubtitle}>Always here to help</Text>
        </View>
        
        <TouchableOpacity style={styles.headerAction}>
          <IconSymbol name="phone.fill" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map(renderMessage)}
        {renderTypingIndicator()}
        
        {/* Suggested Actions */}
        {showSuggestions && messages.length <= 1 && (
          <View style={styles.suggestionsContainer}>
            <Text style={[styles.suggestionsTitle, { color: colors.text }]}>
              Quick Actions
            </Text>
            <View style={styles.suggestionsGrid}>
              {suggestedActions.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={[styles.suggestionCard, { backgroundColor: colors.surface }]}
                  onPress={action.action}
                >
                  <View style={[styles.suggestionIcon, { backgroundColor: action.color }]}>
                    <IconSymbol name={action.icon as any} size={20} color="#FFFFFF" />
                  </View>
                  <Text style={[styles.suggestionTitle, { color: colors.text }]}>
                    {action.title}
                  </Text>
                  <Text style={[styles.suggestionSubtitle, { color: colors.mutedForeground }]}>
                    {action.subtitle}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Quick Replies */}
      {showQuickReplies && (
        <View style={styles.quickRepliesContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickRepliesContent}
          >
            {quickReplies.map((reply) => (
              <TouchableOpacity
                key={reply.id}
                style={[styles.quickReplyButton, { backgroundColor: colors.surface }]}
                onPress={reply.action}
              >
                <Text style={[styles.quickReplyText, { color: colors.text }]}>
                  {reply.text}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Input */}
      <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
        <View style={[styles.inputWrapper, { backgroundColor: colors.background }]}>
          <TextInput
            ref={inputRef}
            style={[styles.textInput, { color: colors.text }]}
            placeholder="Type your message..."
            placeholderTextColor={colors.mutedForeground}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: inputText.trim() ? colors.primary : colors.mutedForeground },
            ]}
            onPress={handleSendMessage}
            disabled={!inputText.trim()}
          >
            <IconSymbol name="arrow.up" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    ...Shadows.medium,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: "700",
  },
  headerSubtitle: {
    color: '#FFFFFF80',
    fontSize: 14,
  },
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  assistantMessageContainer: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageBubble: {
    maxWidth: screenWidth * 0.75,
    borderRadius: 16,
    padding: Spacing.md,
    ...Shadows.small,
  },
  messageText: {
    fontSize: 16,
    lineHeight: Typography.lineHeights.relaxed * 16,
  },
  timestamp: {
    fontSize: 12,
    marginTop: Spacing.xs,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 12,
    gap: Spacing.xs,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: "600",
  },
  typingContainer: {
    flexDirection: 'row',
    gap: Spacing.xs,
    alignItems: 'center',
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  suggestionsContainer: {
    marginTop: Spacing.xl,
  },
  suggestionsTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: Spacing.md,
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  suggestionCard: {
    width: (screenWidth - Spacing.md * 3) / 2,
    padding: Spacing.lg,
    borderRadius: 16,
    alignItems: 'center',
    ...Shadows.small,
  },
  suggestionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  suggestionSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: Typography.lineHeights.normal * 14,
  },
  quickRepliesContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingVertical: Spacing.md,
  },
  quickRepliesContent: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  quickReplyButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 16,
    ...Shadows.small,
  },
  quickReplyText: {
    fontSize: 14,
    fontWeight: "500",
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    padding: Spacing.md,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 16,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    ...Shadows.small,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: Spacing.sm,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
