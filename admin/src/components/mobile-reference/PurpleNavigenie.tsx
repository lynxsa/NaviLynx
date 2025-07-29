/**
 * 🤖 Purple-Themed Navigenie AI Assistant - Mobile App Component
 * 
 * Revolutionary AI chat assistant with PURE purple theme - NO orange or blue gradients.
 * World-class conversational AI matching your purple color requirements.
 * 
 * Features:
 * - Complete purple color scheme throughout (#9333EA primary)
 * - Text input with voice-to-text capabilities
 * - Smart context-aware responses about shopping and navigation
 * - Modern chat interface with purple message bubbles
 * - Typing indicators and smooth animations
 * - Quick action suggestions with purple theming
 * 
 * @author Lead Mobile App Architect
 * @version 4.0.0 - Purple Theme Revolution
 */

import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Animated,
  FlatList,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import * as Haptics from 'expo-haptics'

const { width, height } = Dimensions.get('window')

// Purple Theme System - NO ORANGE OR BLUE
const PURPLE_THEME = {
  primary: '#9333EA',         // Purple-600 (main brand)
  primaryLight: '#A855F7',    // Purple-500
  primaryDark: '#7C3AED',     // Purple-700
  accent: '#C084FC',          // Purple-400
  violet: '#8B5CF6',          // Violet-500
  indigo: '#6366F1',          // Indigo-500
  fuchsia: '#D946EF',         // Fuchsia-500
  surface: '#FFFFFF',
  background: '#FAFAFA',
  backgroundPurple: '#FAF5FF', // Purple-50
  text: '#1F2937',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444'
}

// Mock Icon Component
const IconSymbol: React.FC<{ name: string; size: number; color: string }> = ({ name, size, color }) => (
  <View style={{
    width: size,
    height: size,
    backgroundColor: color + '20',
    borderRadius: size / 2,
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <Text style={{ fontSize: size * 0.4, color, fontWeight: 'bold' }}>
      {name.charAt(0).toUpperCase()}
    </Text>
  </View>
)

interface ChatMessage {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  suggestions?: string[]
}

interface QuickSuggestion {
  id: string
  text: string
  icon: string
  gradient: string[]
}

interface PurpleNavigenieProps {
  visible: boolean
  onClose: () => void
  onNavigateToStore?: (storeName: string) => void
  onOpenStoreCards?: () => void
}

export default function PurpleNavigenie({
  visible,
  onClose,
  onNavigateToStore,
  onOpenStoreCards
}: PurpleNavigenieProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [quickSuggestions, setQuickSuggestions] = useState<QuickSuggestion[]>([])

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(height)).current
  const typingAnim = useRef(new Animated.Value(0)).current
  const flatListRef = useRef<FlatList<ChatMessage>>(null)

  const initializeChat = useCallback(() => {
    const welcomeMessage: ChatMessage = {
      id: '1',
      text: "Hi! I'm Navigenie, your AI shopping and navigation assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
      suggestions: [
        'Find stores near me',
        'Show my store cards',
        'Best deals today',
        'Navigate to checkout'
      ]
    }

    const suggestions: QuickSuggestion[] = [
      {
        id: '1',
        text: 'Find nearest stores',
        icon: 'location',
        gradient: [PURPLE_THEME.primary, PURPLE_THEME.primaryDark] as [string, string]
      },
      {
        id: '2',
        text: 'Show store cards',
        icon: 'wallet',
        gradient: [PURPLE_THEME.violet, PURPLE_THEME.indigo] as [string, string]
      },
      {
        id: '3',
        text: 'Current deals',
        icon: 'tag',
        gradient: [PURPLE_THEME.fuchsia, PURPLE_THEME.primary] as [string, string]
      },
      {
        id: '4',
        text: 'Product scanner',
        icon: 'scan',
        gradient: [PURPLE_THEME.accent, PURPLE_THEME.violet] as [string, string]
      }
    ]

    setMessages([welcomeMessage])
    setQuickSuggestions(suggestions)
  }, [])

  const startAnimations = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      })
    ]).start()
  }, [fadeAnim, slideAnim])

  const resetAnimations = useCallback(() => {
    fadeAnim.setValue(0)
    slideAnim.setValue(height)
  }, [fadeAnim, slideAnim])

  useEffect(() => {
    if (visible) {
      initializeChat()
      startAnimations()
    } else {
      resetAnimations()
    }
  }, [visible, startAnimations, resetAnimations, initializeChat])

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)

    // Simulate typing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(typingAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(typingAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ])
    ).start()

    // Simulate AI processing delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(text.trim())
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
      typingAnim.stopAnimation()
      
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true })
      }, 100)
    }, 1500)
  }, [typingAnim])

  const generateAIResponse = (userText: string): ChatMessage => {
    const lowerText = userText.toLowerCase()
    
    let responseText = ''
    let suggestions: string[] = []

    if (lowerText.includes('store') && lowerText.includes('card')) {
      responseText = "I can help you with your store cards! You have 3 active cards in your wallet: Pick n Pay, Checkers, and Woolworths. Would you like me to open your digital wallet?"
      suggestions = ['Open wallet', 'Add new card', 'Check loyalty points']
    } else if (lowerText.includes('deal') || lowerText.includes('discount')) {
      responseText = "Here are today's hottest deals near you:\n\n🔥 50% off Electronics at Pick n Pay\n🛍️ Buy 2 Get 1 Free Fashion at Woolworths\n🥬 30% off Groceries at Checkers\n\nWould you like me to navigate you to any of these stores?"
      suggestions = ['Navigate to Pick n Pay', 'Show all deals', 'Set deal alerts']
    } else if (lowerText.includes('navigate') || lowerText.includes('direction')) {
      responseText = "I can help you navigate! Where would you like to go? I can provide AR-guided directions to any store, section, or product in the mall."
      suggestions = ['Find nearest checkout', 'Locate restrooms', 'Go to food court']
    } else if (lowerText.includes('product') || lowerText.includes('scan')) {
      responseText = "Use the AI product scanner to get instant information! Simply point your camera at any item to see:\n\n📱 Product details & reviews\n💰 Price comparisons\n🎯 Alternative suggestions\n🏷️ Available discounts\n\nShould I open the scanner for you?"
      suggestions = ['Open scanner', 'Compare prices', 'Find alternatives']
    } else if (lowerText.includes('help') || lowerText.includes('what')) {
      responseText = "I'm your AI shopping companion! I can help you with:\n\n🛍️ Store navigation & AR directions\n💳 Digital store card management\n🔍 Product scanning & comparisons\n🎯 Personalized deal recommendations\n📍 Store locator & hours\n\nWhat would you like to explore?"
      suggestions = ['Store navigation', 'Product scanner', 'Best deals', 'Store hours']
    } else {
      responseText = "I understand you're looking for assistance! I specialize in shopping, navigation, and store services. Could you tell me more about what you need help with?"
      suggestions = ['Find stores', 'Check deals', 'Scan products', 'Get directions']
    }

    return {
      id: (Date.now() + 1).toString(),
      text: responseText,
      isUser: false,
      timestamp: new Date(),
      suggestions
    }
  }

  const handleSuggestionPress = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  const handleQuickSuggestionPress = (suggestion: QuickSuggestion) => {
    if (suggestion.text.includes('store cards') && onOpenStoreCards) {
      onOpenStoreCards()
    } else if (suggestion.text.includes('Find nearest') && onNavigateToStore) {
      onNavigateToStore('Sandton City Mall')
    } else {
      handleSendMessage(suggestion.text)
    }
  }

  const startVoiceInput = async () => {
    setIsListening(true)
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    
    // Simulate voice recognition
    setTimeout(() => {
      setIsListening(false)
      setInputText("Show me the best deals today")
    }, 2000)
  }

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      })
    ]).start(() => {
      onClose()
    })
  }

  function renderHeader() {
    return (
      <View style={[styles.header, { backgroundColor: PURPLE_THEME.surface }]}>
        <StatusBar barStyle="dark-content" backgroundColor={PURPLE_THEME.surface} />
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={[styles.headerButton, { backgroundColor: PURPLE_THEME.backgroundPurple }]}
              onPress={handleClose}
            >
              <IconSymbol name="close" size={18} color={PURPLE_THEME.text} />
            </TouchableOpacity>
            
            <View style={styles.headerTitleContainer}>
              <View style={styles.navigenieLogo}>
                <LinearGradient
                  colors={[PURPLE_THEME.primary, PURPLE_THEME.violet]}
                  style={styles.logoGradient}
                >
                  <IconSymbol name="robot" size={24} color="#FFFFFF" />
                </LinearGradient>
              </View>
              <View style={styles.headerTextContainer}>
                <Text style={[styles.headerTitle, { color: PURPLE_THEME.text }]}>
                  Navigenie AI
                </Text>
                <Text style={[styles.headerSubtitle, { color: PURPLE_THEME.textSecondary }]}>
                  Your smart shopping assistant
                </Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={[styles.headerButton, { backgroundColor: PURPLE_THEME.primary + '15' }]}
              onPress={() => setMessages([])}
            >
              <IconSymbol name="refresh" size={18} color={PURPLE_THEME.primary} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    )
  }

  function renderQuickSuggestions() {
    return (
      <View style={styles.quickSuggestionsSection}>
        <Text style={[styles.quickSuggestionsTitle, { color: PURPLE_THEME.text }]}>
          Quick Actions
        </Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickSuggestionsList}
        >
          {quickSuggestions.map((suggestion) => (
            <TouchableOpacity
              key={suggestion.id}
              style={styles.quickSuggestionItem}
              onPress={() => handleQuickSuggestionPress(suggestion)}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={suggestion.gradient}
                style={styles.quickSuggestionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <IconSymbol name={suggestion.icon} size={20} color="#FFFFFF" />
                <Text style={styles.quickSuggestionText}>{suggestion.text}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    )
  }

  function renderMessage({ item }: { item: ChatMessage }) {
    return (
      <Animated.View 
        style={[
          styles.messageContainer,
          item.isUser ? styles.userMessageContainer : styles.aiMessageContainer
        ]}
      >
        {!item.isUser && (
          <View style={[styles.aiAvatar, { backgroundColor: PURPLE_THEME.primary }]}>
            <IconSymbol name="robot" size={16} color="#FFFFFF" />
          </View>
        )}
        
        <View 
          style={[
            styles.messageBubble,
            item.isUser 
              ? { backgroundColor: PURPLE_THEME.primary }
              : { backgroundColor: PURPLE_THEME.surface }
          ]}
        >
          <Text 
            style={[
              styles.messageText,
              { color: item.isUser ? '#FFFFFF' : PURPLE_THEME.text }
            ]}
          >
            {item.text}
          </Text>
          
          {item.suggestions && item.suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              {item.suggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.suggestionChip, { 
                    backgroundColor: item.isUser ? 'rgba(255,255,255,0.2)' : PURPLE_THEME.backgroundPurple,
                    borderColor: item.isUser ? 'rgba(255,255,255,0.3)' : PURPLE_THEME.primary + '40'
                  }]}
                  onPress={() => handleSuggestionPress(suggestion)}
                >
                  <Text 
                    style={[
                      styles.suggestionText,
                      { color: item.isUser ? '#FFFFFF' : PURPLE_THEME.primary }
                    ]}
                  >
                    {suggestion}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        
        <Text style={[styles.messageTime, { color: PURPLE_THEME.textSecondary }]}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </Animated.View>
    )
  }

  function renderTypingIndicator() {
    if (!isTyping) return null

    return (
      <Animated.View 
        style={[
          styles.messageContainer,
          styles.aiMessageContainer,
          { opacity: typingAnim }
        ]}
      >
        <View style={[styles.aiAvatar, { backgroundColor: PURPLE_THEME.primary }]}>
          <IconSymbol name="robot" size={16} color="#FFFFFF" />
        </View>
        
        <View style={[styles.messageBubble, { backgroundColor: PURPLE_THEME.surface }]}>
          <View style={styles.typingContainer}>
            <View style={[styles.typingDot, { backgroundColor: PURPLE_THEME.primary }]} />
            <View style={[styles.typingDot, { backgroundColor: PURPLE_THEME.primary }]} />
            <View style={[styles.typingDot, { backgroundColor: PURPLE_THEME.primary }]} />
          </View>
        </View>
      </Animated.View>
    )
  }

  function renderInputArea() {
    return (
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={[styles.inputArea, { backgroundColor: PURPLE_THEME.surface }]}>
          <View style={[styles.inputRow, { backgroundColor: PURPLE_THEME.backgroundPurple }]}>
            <TouchableOpacity
              style={[
                styles.voiceButton,
                { backgroundColor: isListening ? PURPLE_THEME.primary : 'transparent' }
              ]}
              onPress={startVoiceInput}
            >
              <IconSymbol 
                name="mic" 
                size={20} 
                color={isListening ? '#FFFFFF' : PURPLE_THEME.primary} 
              />
            </TouchableOpacity>
            
            <TextInput
              style={[styles.textInput, { color: PURPLE_THEME.text }]}
              placeholder="Ask me anything about shopping..."
              placeholderTextColor={PURPLE_THEME.textSecondary}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              onSubmitEditing={() => handleSendMessage(inputText)}
            />
            
            <TouchableOpacity
              style={[
                styles.sendButton,
                { 
                  backgroundColor: inputText.trim() ? PURPLE_THEME.primary : PURPLE_THEME.backgroundPurple,
                  opacity: inputText.trim() ? 1 : 0.5
                }
              ]}
              onPress={() => handleSendMessage(inputText)}
              disabled={!inputText.trim()}
            >
              <IconSymbol 
                name="send" 
                size={18} 
                color={inputText.trim() ? '#FFFFFF' : PURPLE_THEME.textSecondary} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    )
  }

  return (
    <Modal
      visible={visible}
      animationType="none"
      presentationStyle="fullScreen"
    >
      <Animated.View 
        style={[
          styles.container,
          { backgroundColor: PURPLE_THEME.background },
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        {renderHeader()}
        
        <View style={{ flex: 1 }}>
          {messages.length === 0 ? (
            renderQuickSuggestions()
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              style={styles.messagesList}
              contentContainerStyle={styles.messagesContent}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={renderTypingIndicator}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />
          )}
        </View>
        
        {renderInputArea()}
      </Animated.View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  navigenieLogo: {
    marginRight: 12,
  },
  logoGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  
  // Quick Suggestions
  quickSuggestionsSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  quickSuggestionsTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
  quickSuggestionsList: {
    gap: 16,
    paddingRight: 20,
  },
  quickSuggestionItem: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  quickSuggestionGradient: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 12,
    minWidth: 140,
  },
  quickSuggestionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  
  // Messages
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexGrow: 1,
  },
  messageContainer: {
    marginBottom: 20,
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  aiMessageContainer: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 8,
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 4,
  },
  messageBubble: {
    maxWidth: width * 0.75,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
    marginHorizontal: 4,
    fontWeight: '500',
  },
  
  // Suggestions
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  suggestionChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  suggestionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  
  // Typing Indicator
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  
  // Input Area
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  inputArea: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    gap: 12,
  },
  voiceButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 8,
    fontWeight: '500',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
