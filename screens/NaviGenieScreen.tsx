import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import ChatHeader from '../components/navigenie/ChatHeader/ChatHeader';
import ChatWindow from '../components/navigenie/ChatWindow/ChatWindow';
import QuickActionChips from '../components/navigenie/QuickActionChips/QuickActionChips';
import TextInputBar from '../components/navigenie/TextInputBar/TextInputBar';
import { useAuth } from '../context/AuthContext';
import { getChatHistory, saveChatHistory } from '../services/chatHistoryLocal';
import { geminiChat } from '../services/geminiAI';

type Message = { from: 'ai' | 'user'; text: string };

export default function NaviGenieScreen() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { from: 'ai', text: 'Hi! I am NaviGenie. How can I help you today?' },
  ]);

  // Load chat history from local storage on sign in
  useEffect(() => {
    if (user) {
      getChatHistory(user.id).then((chatHistory) => {
        if (chatHistory && chatHistory.messages && chatHistory.messages.length > 0) {
          // Convert ChatMessage format to Message format
          const convertedMessages = chatHistory.messages.map(msg => ({
            from: msg.isUser ? 'user' as const : 'ai' as const,
            text: msg.text
          }));
          setMessages(convertedMessages);
        }
      });
    }
  }, [user]);

  // Save chat history to local storage on change
  useEffect(() => {
    if (user && messages.length > 1) { // Only save if there are more than the initial message
      const chatHistory = {
        messages: messages.map((msg, index) => ({
          id: `${Date.now()}_${index}`,
          text: msg.text,
          timestamp: Date.now(),
          isUser: msg.from === 'user'
        })),
        lastUpdated: Date.now()
      };
      saveChatHistory(user.id, chatHistory);
    }
  }, [messages, user]);

  const handleSend = async (text: string) => {
    setMessages((msgs) => [...msgs, { from: 'user', text }]);
    // Show a loading AI message
    setMessages((msgs) => [...msgs, { from: 'ai', text: 'Thinking...' }]);
    try {
      const aiResponse = await geminiChat(text);
      setMessages((msgs) => [
        ...msgs.slice(0, -1), // Remove 'Thinking...'
        { from: 'ai', text: aiResponse },
      ]);
    } catch {
      setMessages((msgs) => [
        ...msgs.slice(0, -1),
        { from: 'ai', text: 'AI service unavailable.' },
      ]);
    }
  };

  const handleAction = (action: string) => {
    handleSend(action);
  };

  return (
    <View style={styles.container}>
      <ChatHeader />
      <QuickActionChips onAction={handleAction} />
      <ChatWindow messages={messages} />
      <TextInputBar onSend={handleSend} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', borderRadius: 16, overflow: 'hidden' },
});
