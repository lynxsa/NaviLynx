/**
 * 🤖 OPERATION LIONMOUNTAIN - Navigenie AI Assistant
 * 
 * Complete AI chat assistant powered by Google Gemini
 * Purple theme, South African context, world-class UX
 * 
 * @version 1.0.0 - LIONMOUNTAIN Edition
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeIn,
  SlideInRight,
  SlideInLeft,
} from 'react-native-reanimated';

import { purpleTheme, spacing, borderRadius, shadows, typography } from '../theme/globalTheme';
import { AppHeader } from './AppHeader';

// Chat Interfaces
interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

interface QuickAction {
  id: string;
  text: string;
  icon: string;
  action: () => void;
}

// Mock Gemini API Service
class GeminiService {
  private static instance: GeminiService;
  
  static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  async sendMessage(message: string): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Mock responses based on message content
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Sawubona! I'm Navigenie, your AI shopping assistant. I'm here to help you navigate stores, find deals, and make your shopping experience amazing. How can I assist you today?";
    }
    
    if (lowerMessage.includes('restroom') || lowerMessage.includes('bathroom')) {
      return "I can help you find the nearest restrooms! They're located on the ground floor near the main entrance, next to the information desk. Would you like me to guide you there with AR navigation?";
    }
    
    if (lowerMessage.includes('food') || lowerMessage.includes('eat')) {
      return "The food court is on the first floor with amazing options! 🍕🍔 Popular spots include Nando's, KFC, and Steers. There's also a Woolworths Food on the ground floor for groceries. Which type of food are you craving?";
    }
    
    if (lowerMessage.includes('deals') || lowerMessage.includes('discount')) {
      return "Great deals today! 💜 Pick n Pay has 50% off selected items, Checkers is running a buy-2-get-1-free promotion, and there's a 30% discount at Woolworths. Want me to show you the way to any of these stores?";
    }
    
    if (lowerMessage.includes('ar') || lowerMessage.includes('navigation')) {
      return "AR Navigation is one of my favorite features! 🔮 Simply tell me where you want to go, and I'll overlay step-by-step directions right on your camera view. Try saying 'Navigate to Pick n Pay' or 'Take me to the food court'!";
    }
    
    if (lowerMessage.includes('parking')) {
      return "Parking info: 🚗 Ground level parking is usually full, but Level 2 and 3 have good availability. VIP parking is available near the main entrance. Parking costs R5 per hour. Need directions back to your car?";
    }
    
    // General helpful response
    return "I'm here to help with anything shopping-related! I can guide you to stores, find the best deals, locate amenities like restrooms or ATMs, or help with AR navigation. What would you like to know?";
  }
}

interface NavigenieAssistantProps {
  onNavigateToStore?: (storeName: string) => void;
  onStartARNavigation?: (destination: string) => void;
}

export const NavigenieAssistant: React.FC<NavigenieAssistantProps> = ({
  onNavigateToStore,
  onStartARNavigation,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Sawubona! Ngingakusiza kanjani? (Hello! How can I help you?)\n\nI'm Navigenie, your AI shopping assistant here at the mall. I can help you find stores, discover deals, navigate with AR, and answer any questions about your shopping experience!",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);
  const geminiService = GeminiService.getInstance();

  const quickActions: QuickAction[] = [
    {
      id: '1',
      text: 'Find nearest restroom',
      icon: 'location',
      action: () => sendQuickMessage('Where is the nearest restroom?'),
    },
    {
      id: '2',
      text: 'Food court location',
      icon: 'restaurant',
      action: () => sendQuickMessage('Where is the food court?'),
    },
    {
      id: '3',
      text: 'Today\'s deals',
      icon: 'pricetag',
      action: () => sendQuickMessage('What deals are available today?'),
    },
    {
      id: '4',
      text: 'How to use AR navigation',
      icon: 'eye',
      action: () => sendQuickMessage('How does AR navigation work?'),
    },
  ];

  useEffect(() => {
    // Auto-scroll to bottom when new message is added
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const response = await geminiService.sendMessage(text);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      Alert.alert('Error', 'Failed to get response from Navigenie. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  const sendQuickMessage = (text: string) => {
    sendMessage(text);
  };

  const renderMessage = (message: ChatMessage) => {
    const AnimatedView = Animated.View;
    
    return (
      <AnimatedView
        key={message.id}
        entering={message.isUser ? SlideInRight.duration(300) : SlideInLeft.duration(300)}
        style={[
          styles.messageContainer,
          message.isUser ? styles.userMessageContainer : styles.aiMessageContainer,
        ]}
      >
        {!message.isUser && (
          <View style={styles.aiAvatar}>
            <LinearGradient
              colors={purpleTheme.gradients.primary}
              style={styles.avatarGradient}
            >
              <Ionicons name="chatbubble-ellipses" size={20} color="white" />
            </LinearGradient>
          </View>
        )}
        
        <View
          style={[
            styles.messageBubble,
            message.isUser ? styles.userBubble : styles.aiBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              message.isUser ? styles.userText : styles.aiText,
            ]}
          >
            {message.text}
          </Text>
          <Text
            style={[
              styles.timestampText,
              message.isUser ? styles.userTimestamp : styles.aiTimestamp,
            ]}
          >
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </AnimatedView>
    );
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;
    
    return (
      <Animated.View
        entering={FadeIn.duration(300)}
        style={[styles.messageContainer, styles.aiMessageContainer]}
      >
        <View style={styles.aiAvatar}>
          <LinearGradient
            colors={purpleTheme.gradients.primary}
            style={styles.avatarGradient}
          >
            <Ionicons name="chatbubble-ellipses" size={20} color="white" />
          </LinearGradient>
        </View>
        
        <View style={[styles.messageBubble, styles.aiBubble]}>
          <View style={styles.typingIndicator}>
            <View style={[styles.typingDot, { animationDelay: '0ms' }]} />
            <View style={[styles.typingDot, { animationDelay: '200ms' }]} />
            <View style={[styles.typingDot, { animationDelay: '400ms' }]} />
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderQuickAction = (action: QuickAction) => (
    <TouchableOpacity
      key={action.id}
      onPress={action.action}
      style={styles.quickActionButton}
    >
      <LinearGradient
        colors={[`${purpleTheme.primary}20`, `${purpleTheme.primary}10`]}
        style={styles.quickActionGradient}
      >
        <Ionicons name={action.icon as any} size={16} color={purpleTheme.primary} />
        <Text style={styles.quickActionText}>{action.text}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={purpleTheme.background} />
      
      <AppHeader
        title="Navigenie"
        subtitle="AI Shopping Assistant"
        showBackButton
        onBackPress={() => {/* Handle back navigation */}}
      />

      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickActionsScroll}
          >
            {quickActions.map(renderQuickAction)}
          </ScrollView>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(renderMessage)}
          {renderTypingIndicator()}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              ref={inputRef}
              style={styles.textInput}
              placeholder="Ask Navigenie anything..."
              placeholderTextColor={purpleTheme.textSecondary}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              onSubmitEditing={() => sendMessage(inputText)}
              blurOnSubmit={false}
            />
            
            <TouchableOpacity
              onPress={() => sendMessage(inputText)}
              style={[
                styles.sendButton,
                { opacity: inputText.trim() ? 1 : 0.5 }
              ]}
              disabled={!inputText.trim() || isTyping}
            >
              <LinearGradient
                colors={purpleTheme.gradients.primary}
                style={styles.sendGradient}
              >
                <Ionicons name="send" size={20} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: purpleTheme.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  
  // Quick Actions
  quickActionsContainer: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: purpleTheme.border,
  },
  quickActionsScroll: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  quickActionButton: {
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  quickActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  quickActionText: {
    fontSize: typography.fontSizes.sm,
    color: purpleTheme.primary,
    fontWeight: typography.fontWeights.medium,
  },
  
  // Messages
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: spacing.md,
    gap: spacing.md,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  aiMessageContainer: {
    justifyContent: 'flex-start',
  },
  
  // AI Avatar
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  avatarGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Message Bubbles
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  userBubble: {
    backgroundColor: purpleTheme.primary,
    borderBottomRightRadius: spacing.xs,
    ...shadows.sm,
  },
  aiBubble: {
    backgroundColor: purpleTheme.surface,
    borderWidth: 1,
    borderColor: purpleTheme.border,
    borderBottomLeftRadius: spacing.xs,
    ...shadows.sm,
  },
  messageText: {
    fontSize: typography.fontSizes.md,
    lineHeight: typography.lineHeights.normal * typography.fontSizes.md,
  },
  userText: {
    color: 'white',
  },
  aiText: {
    color: purpleTheme.text,
  },
  timestampText: {
    fontSize: typography.fontSizes.xs,
    marginTop: spacing.xs,
  },
  userTimestamp: {
    color: 'rgba(255,255,255,0.7)',
  },
  aiTimestamp: {
    color: purpleTheme.textSecondary,
  },
  
  // Typing Indicator
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: purpleTheme.textSecondary,
    // Animation would be added with Animated API in real implementation
  },
  
  // Input
  inputContainer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: purpleTheme.border,
    backgroundColor: purpleTheme.surface,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: purpleTheme.background,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: purpleTheme.border,
    ...shadows.sm,
  },
  textInput: {
    flex: 1,
    fontSize: typography.fontSizes.md,
    color: purpleTheme.text,
    maxHeight: 100,
    minHeight: 20,
  },
  sendButton: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  sendGradient: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NavigenieAssistant;
