import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { colors, spacing, borderRadius, shadows } from '@/styles/modernTheme';
import { geminiService } from '@/services/geminiService';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'navigation' | 'deal' | 'shopping' | 'scan';
  imageUri?: string;
  scanResult?: {
    itemName: string;
    description: string;
    stores: {
      name: string;
      price: string;
      location: string;
      availability: string;
    }[];
  };
}

interface QuickChip {
  id: string;
  label: string;
  icon: string;
  action: string;
  color?: string;
}

export default function NaviGenieScreen() {
  const { isDark } = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "👋 **Welcome to NaviGenie!**\n\nI'm your AI-powered shopping and navigation assistant. I can help you:\n\n🎯 **Navigate** - Find any store, restaurant, or amenity\n🛍️ **Shop Smart** - Scan items, compare prices, find deals\n🚗 **Venue Services** - Parking, restrooms, ATMs, WiFi\n🔍 **Real-time Info** - Store hours, availability, directions\n\nTry asking me: 'Find coffee shops' or 'Show me deals'!\n\nHow can I assist you today? 😊",
      isUser: false,
      timestamp: new Date(),
      type: 'text',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isAIConnected, setIsAIConnected] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const quickChips: QuickChip[] = [
    { id: '1', label: 'Scan & Shop', icon: 'qrcode.viewfinder', action: 'scan', color: colors.primary },
    { id: '2', label: 'Find Coffee', icon: 'cup.and.saucer.fill', action: 'coffee', color: colors.accent },
    { id: '3', label: 'Hot Deals', icon: 'tag.fill', action: 'deals' },
    { id: '4', label: 'Find Parking', icon: 'car.fill', action: 'parking' },
    { id: '5', label: 'Restrooms', icon: 'figure.walk', action: 'restroom' },
    { id: '6', label: 'ATM', icon: 'creditcard.fill', action: 'atm' },
    { id: '7', label: 'Food Court', icon: 'fork.knife', action: 'food' },
  ];

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Add a small delay to show the typing indicator
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      // Use real Gemini AI for intelligent responses with enhanced context
      const contextPrompt = `You are NaviGenie, an AI shopping and navigation assistant for South African venues like Sandton City, Canal Walk, V&A Waterfront, Gateway Theatre, and Menlyn Park. 

      You help users with:
      - Indoor navigation and directions
      - Store locations, hours, and information
      - Shopping assistance and price comparisons
      - Venue amenities (parking, restrooms, ATMs, WiFi)
      - Current deals and promotions
      - South African shopping culture and payment methods (EFT, SnapScan, etc.)
      
      Provide helpful, friendly, and actionable responses. Use emojis and format responses clearly. Always offer specific next steps or ask follow-up questions. Do not use ** for bold text as it will be formatted automatically.`;
      
      const context = {
        venueName: 'General Shopping Assistant',
        previousMessages: messages.slice(-3).map(m => m.text), // Last 3 messages for context
      };
      
      const response = await geminiService.getChatbotResponse(`${contextPrompt}\n\nUser: ${text.trim()}`, context);
      
      // Mark AI as connected if we get a response
      setIsAIConnected(true);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    } catch (error) {
      console.error('AI response error:', error);
      // Mark AI as disconnected and use fallback
      setIsAIConnected(false);
      const fallbackResponse = generateAIResponse(text.trim());
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: fallbackResponse,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }
  };

  const generateAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    // Coffee and café queries
    if (lowerInput.includes('coffee') || lowerInput.includes('cafe') || lowerInput.includes('caffè')) {
      return "☕ **Coffee Shops Found**\n\nI found 3 great coffee spots nearby:\n\n🔥 **Vida e Caffè** - Level 2, Main Entrance\n• Fresh roasted beans & healthy options\n• 2-minute walk from your location\n\n☕ **Starbucks** - Food Court, Level 1\n• Classic favorites & seasonal drinks\n• 3-minute walk\n\n🥐 **Mugg & Bean** - Level 3, Cinema Area\n• Full breakfast menu & artisan coffee\n• 4-minute walk\n\nWhich one would you like directions to?";
    }
    
    // Parking assistance
    if (lowerInput.includes('parking') || lowerInput.includes('park')) {
      return "🚗 **Parking Assistant**\n\nReal-time parking availability:\n\n🔴 **Level 1**: 85% full - Limited spaces\n🟡 **Level 2**: 60% full - **Recommended**\n🟢 **Level 3**: 45% full - Plenty of space\n🟢 **Rooftop**: 30% full - Best availability\n\n💡 **Smart Tip**: Level 2 has the shortest walk to main entrances and lifts!\n\nWould you like me to guide you to Level 2?";
    }
    
    // Restroom locations
    if (lowerInput.includes('restroom') || lowerInput.includes('bathroom') || lowerInput.includes('toilet')) {
      return "🚻 **Restroom Locations**\n\nNearest facilities:\n\n🏃‍♂️ **Level 2** - Main Escalators\n• 1-minute walk • Recently cleaned\n• Baby changing facilities available\n\n�‍♀️ **Level 1** - Food Court Area\n• 2-minute walk • Family-friendly\n• Wheelchair accessible\n\n�‍♂️ **Level 3** - Cinema Entrance\n• 3-minute walk • Premium facilities\n\n**Recommended**: Level 2 restrooms are closest and well-maintained!";
    }
    
    // Deals and offers
    if (lowerInput.includes('deals') || lowerInput.includes('offers') || lowerInput.includes('sale') || lowerInput.includes('discount')) {
      return "🏷️ **Today's Hot Deals**\n\nLimited-time offers just for you:\n\n👗 **Zara** - 30% off new collection\n• Valid until 8 PM today\n• All fashion items included\n\n🍗 **KFC** - Buy 1 Get 1 Free\n• Streetwise meals only\n• Valid until 10 PM\n\n☕ **Woolworths** - Free coffee with purchase\n• R50+ purchases qualify\n• Premium coffee included\n\n📱 **Game** - 20% off electronics\n• Gaming & tech accessories\n• Weekend special\n\nWhich store would you like directions to?";
    }
    
    // Food and dining
    if (lowerInput.includes('food') || lowerInput.includes('eat') || lowerInput.includes('hungry') || lowerInput.includes('restaurant') || lowerInput.includes('lunch') || lowerInput.includes('dinner')) {
      return "🍽️ **Dining Options**\n\nGreat places to eat right now:\n\n🍕 **Food Court** - Level 1\n• Quick bites • 15+ options • Budget-friendly\n• Pizza, burgers, Asian cuisine\n\n🦐 **Ocean Basket** - Level 2\n• Fresh seafood • Sit-down dining\n• Family-friendly • Great reviews\n\n🥗 **Kauai** - Level 1\n• Healthy options • Fresh smoothies\n• Vegan & vegetarian friendly\n\n🍔 **Burger King** - Food Court\n• Fast food • Quick service\n• Kids meals available\n\nWhat type of cuisine are you craving?";
    }
    
    // ATM locations
    if (lowerInput.includes('atm') || lowerInput.includes('cash') || lowerInput.includes('money') || lowerInput.includes('withdraw')) {
      return "🏧 **ATM Locations**\n\nNearest cash points:\n\n💳 **FNB ATM** - Level 1, Main Entrance\n• 1-minute walk • Always available\n• R10 transaction fee\n\n💳 **Standard Bank** - Level 2, Centre Court\n• 2-minute walk • Recent service\n• Free for Standard Bank clients\n\n💳 **ABSA** - Level 3, Near Cinemas\n• 3-minute walk • 24/7 access\n• Contactless transactions available\n\nAll ATMs accept major cards and offer multiple languages!";
    }
    
    // Navigation and directions
    if (lowerInput.includes('direction') || lowerInput.includes('navigate') || lowerInput.includes('find') || lowerInput.includes('where') || lowerInput.includes('location')) {
      return "🧭 **Navigation Assistant**\n\nI can help you find:\n\n🏪 **Stores & Shops**\n• Over 200+ stores available\n• Real-time operating hours\n\n🍽️ **Restaurants & Food**\n• Dining options by cuisine type\n• Current wait times\n\n🚗 **Amenities**\n• Parking, restrooms, ATMs\n• Baby facilities, WiFi zones\n\n🎯 **AR Navigation**\n• Point your camera for live directions\n• Step-by-step visual guidance\n\nWhat specific place are you looking for?";
    }
    
    // Shopping assistance
    if (lowerInput.includes('shop') || lowerInput.includes('buy') || lowerInput.includes('purchase') || lowerInput.includes('store')) {
      return "🛍️ **Shopping Assistant**\n\nI'm here to make your shopping easier:\n\n📱 **Smart Features**\n• Scan barcodes for price comparison\n• Find items across multiple stores\n• Get personalized recommendations\n\n🏪 **Store Categories**\n• Fashion & Apparel\n• Electronics & Tech\n• Home & Garden\n• Beauty & Health\n\n💰 **Money-Saving Tips**\n• Current deals and discounts\n• Price alerts and comparisons\n• Loyalty program benefits\n\nWhat are you shopping for today?";
    }
    
    // General greeting or unclear input
    if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey') || input.trim().length < 3) {
      return "👋 **Hello! I'm NaviGenie**\n\nYour AI-powered shopping and navigation assistant! I can help you with:\n\n🎯 **Navigation & Directions**\n• Find any store or amenity\n• Real-time walking directions\n• AR-powered guidance\n\n🛍️ **Shopping Assistance**\n• Scan products for prices\n• Compare deals across stores\n• Personalized recommendations\n\n🚗 **Venue Services**\n• Parking availability\n• Restroom locations\n• ATM and WiFi spots\n\nTry asking me: 'Find coffee shops' or 'Show me deals'!";
    }
    
    // Default helpful response
    return "🤖 **NaviGenie AI Assistant**\n\nI understand you're looking for help! I can assist you with:\n\n🔍 **Search & Find**\n• 'Find coffee shops'\n• 'Where are the restrooms?'\n• 'Show me electronics stores'\n\n🏷️ **Deals & Offers**\n• 'What deals are available?'\n• 'Show me discounts'\n\n🚗 **Venue Services**\n• 'Help with parking'\n• 'Find the nearest ATM'\n\n📱 **Smart Shopping**\n• 'Scan this item'\n• 'Compare prices'\n\nWhat would you like help with today?";
  };

  // Helper function to format text and render styled components
  const formatMessage = (text: string, textColor: string, isDark: boolean) => {
    // Split text by bold markers
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        // Bold text - remove asterisks and apply bold styling
        const boldText = part.slice(2, -2);
        return (
          <Text key={index} style={{ fontWeight: '700', color: textColor }}>
            {boldText}
          </Text>
        );
      } else {
        // Regular text
        return (
          <Text key={index} style={{ fontWeight: '400', color: textColor }}>
            {part}
          </Text>
        );
      }
    });
  };

  const handleQuickChip = (chip: QuickChip) => {
    switch (chip.action) {
      case 'scan':
        Alert.alert('Scanner', 'Opening barcode scanner...');
        break;
      case 'coffee':
        sendMessage('Find coffee shops');
        break;
      case 'deals':
        sendMessage('Show me current deals');
        break;
      case 'parking':
        sendMessage('Help me with parking');
        break;
      case 'restroom':
        sendMessage('Where are the restrooms?');
        break;
      case 'atm':
        sendMessage('Find nearest ATM');
        break;
      case 'food':
        sendMessage('Show me food options');
        break;
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const textColor = item.isUser ? '#FFFFFF' : (isDark ? '#FFFFFF' : colors.text);
    
    return (
      <View style={{
        marginBottom: spacing.lg,
        alignItems: item.isUser ? 'flex-end' : 'flex-start',
      }}>
        <View
          style={{
            maxWidth: '85%',
            padding: spacing.md,
            borderRadius: borderRadius.xl,
            borderBottomRightRadius: item.isUser ? borderRadius.sm : borderRadius.xl,
            borderBottomLeftRadius: item.isUser ? borderRadius.xl : borderRadius.sm,
            backgroundColor: item.isUser ? colors.primary : (isDark ? 'rgba(255,255,255,0.08)' : '#F8F9FA'),
            ...shadows.sm,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              lineHeight: 22,
              color: textColor,
            }}
          >
            {formatMessage(item.text, textColor, isDark)}
          </Text>
          <Text
            style={{
              fontSize: 11,
              marginTop: spacing.xs,
              color: item.isUser ? 'rgba(255,255,255,0.7)' : (isDark ? 'rgba(255,255,255,0.6)' : colors.textSecondary),
              fontWeight: '500',
            }}
          >
            {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  const renderTypingIndicator = () => (
    <View style={{ alignItems: 'flex-start', marginBottom: spacing.lg }}>
      <View
        style={{
          padding: spacing.md,
          borderRadius: borderRadius.xl,
          borderBottomLeftRadius: borderRadius.sm,
          backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F8F9FA',
          ...shadows.sm,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', gap: spacing.xs }}>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: isDark ? 'rgba(255,255,255,0.4)' : colors.textSecondary,
              }}
            />
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: isDark ? 'rgba(255,255,255,0.4)' : colors.textSecondary,
              }}
            />
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: isDark ? 'rgba(255,255,255,0.4)' : colors.textSecondary,
              }}
            />
          </View>
          <Text
            style={{
              fontSize: 13,
              marginLeft: spacing.sm,
              color: isDark ? 'rgba(255,255,255,0.6)' : colors.textSecondary,
              fontWeight: '500',
            }}
          >
            NaviGenie is typing...
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[{ backgroundColor: isDark ? colors.gray[900] : '#FFFFFF', flex: 1 }]}>
      <StatusBar 
        barStyle={isDark ? "light-content" : "dark-content"} 
        backgroundColor="transparent"
        translucent
      />
      
      {/* Header with Logo and Icons */}
      <View style={{ 
        paddingHorizontal: spacing.lg, 
        paddingTop: spacing.xl + 8, 
        paddingBottom: spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
        borderBottomWidth: 1,
        borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
      }}>
        {/* Logo with NaviGenie Text */}
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <View style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: spacing.sm,
          }}>
            <IconSymbol name="lightbulb" size={22} color="#FFFFFF" />
            <View style={{
              position: 'absolute',
              top: -2,
              right: -2,
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: '#10b981',
            }} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
              <Text style={{
                fontSize: 18,
                fontWeight: '700',
                color: isDark ? '#FFFFFF' : colors.text,
                letterSpacing: 0.5,
                marginRight: spacing.xs,
              }}>
                NaviGenie
              </Text>
              <View style={{
                backgroundColor: colors.primary,
                borderRadius: borderRadius.sm,
                paddingHorizontal: spacing.xs,
                paddingVertical: 2,
              }}>
                <Text style={{ color: '#FFFFFF', fontSize: 9, fontWeight: '700' }}>AI</Text>
              </View>
            </View>
            <Text style={{
              fontSize: 11,
              color: isDark ? '#FFFFFF' : colors.text,
              opacity: 0.6,
              fontWeight: '400',
              letterSpacing: 0.1,
            }}>
              {isAIConnected ? 'AI Assistant • Connected' : 'AI Assistant • Fallback Mode'}
            </Text>
          </View>
        </View>
        
        {/* Header Icons */}
        <View style={{ flexDirection: 'row', gap: spacing.xs }}>
          <TouchableOpacity 
            style={{
              backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
              borderRadius: borderRadius.xl,
              padding: spacing.sm + 2,
              borderWidth: 1,
              borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
              ...shadows.sm,
            }}
            activeOpacity={0.7}
          >
            <IconSymbol name="ellipsis" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        {/* Chat Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={{ 
            padding: spacing.lg,
            paddingBottom: spacing.xl,
          }}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={isTyping ? renderTypingIndicator : null}
        />

        {/* Quick Chips */}
        <View style={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.lg }}>
          <Text style={{
            fontSize: 13,
            fontWeight: '600',
            marginBottom: spacing.sm,
            color: isDark ? 'rgba(255,255,255,0.8)' : colors.textSecondary,
          }}>
            Quick Actions
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              {quickChips.map((chip) => (
                <TouchableOpacity
                  key={chip.id}
                  onPress={() => handleQuickChip(chip)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm,
                    borderRadius: borderRadius.full,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F8F9FA',
                    borderColor: isDark ? 'rgba(255,255,255,0.12)' : colors.border,
                    borderWidth: 1,
                    ...shadows.sm,
                  }}
                >
                  <IconSymbol
                    name={chip.icon as any}
                    size={16}
                    color={colors.primary}
                  />
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '500',
                      marginLeft: spacing.xs,
                      color: isDark ? '#FFFFFF' : colors.text,
                    }}
                  >
                    {chip.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Input Area - Enhanced visibility and positioning */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.lg,
            paddingBottom: Platform.OS === 'ios' ? spacing.lg + 10 : spacing.lg,
            borderTopWidth: 1,
            borderColor: isDark ? 'rgba(255,255,255,0.15)' : colors.border,
            backgroundColor: isDark ? '#000000' : '#FFFFFF',
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: isDark ? 0.3 : 0.1,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm + 4,
              borderRadius: borderRadius.xl,
              marginRight: spacing.sm,
              backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : '#F8F9FA',
              borderWidth: 2,
              borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#E5E7EB',
              minHeight: 48,
              ...shadows.md,
            }}
          >
            <TextInput
              style={{
                flex: 1,
                fontSize: 16,
                color: isDark ? '#FFFFFF' : colors.text,
                fontWeight: '500',
                minHeight: 22,
                maxHeight: 100,
                textAlignVertical: 'center',
              }}
              placeholder="Ask NaviGenie anything..."
              placeholderTextColor={isDark ? 'rgba(255,255,255,0.6)' : colors.textSecondary}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              onSubmitEditing={() => {
                if (!isTyping && inputText.trim()) {
                  sendMessage(inputText);
                }
              }}
              blurOnSubmit={false}
              returnKeyType="send"
              enablesReturnKeyAutomatically={true}
              autoCorrect={true}
              spellCheck={true}
            />
          </View>
          
          <TouchableOpacity
            onPress={() => sendMessage(inputText)}
            disabled={!inputText.trim() || isTyping}
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: (inputText.trim() && !isTyping) ? colors.primary : (isDark ? 'rgba(255,255,255,0.15)' : '#E5E7EB'),
              opacity: (inputText.trim() && !isTyping) ? 1 : 0.7,
              ...shadows.lg,
            }}
          >
            <IconSymbol
              name={isTyping ? "clock" : "paperplane.fill"}
              size={22}
              color={(inputText.trim() && !isTyping) ? '#FFFFFF' : (isDark ? 'rgba(255,255,255,0.6)' : colors.textSecondary)}
            />
          </TouchableOpacity>
        </View>

        {/* Scanner FAB - Adjusted position */}
        <TouchableOpacity
          onPress={() => Alert.alert('Scanner', 'Barcode scanner feature coming soon!')}
          style={{
            position: 'absolute',
            bottom: 150,
            right: spacing.lg,
            width: 56,
            height: 56,
            borderRadius: 28,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.accent,
            ...shadows.lg,
          }}
        >
          <IconSymbol name="qrcode.viewfinder" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}
