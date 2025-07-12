import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useThemeSafe } from '@/context/ThemeContext';
import { IconSymbol } from './ui/IconSymbol';
import { 
  ChatMessage, 
  ChatRoom, 
  getChatRoom, 
  sendMessage,
  joinChatRoom 
} from '@/services/chatService';
import { getCurrentUser } from '@/services/userService';

interface ChatScreenProps {
  venueId: string;
  onClose: () => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ venueId, onClose }) => {
  const { colors } = useThemeSafe();
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const currentUser = getCurrentUser();

  useEffect(() => {
    const initializeChatRoom = async () => {
      try {
        let room = await getChatRoom(venueId);
        if (!room) {
          room = await joinChatRoom(venueId);
        }
        setChatRoom(room);
      } catch {
        Alert.alert('Error', 'Failed to load chat room');
      } finally {
        setLoading(false);
      }
    };

    initializeChatRoom();
  }, [venueId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser || !chatRoom) return;

    try {
      await sendMessage(
        chatRoom.id, 
        newMessage.trim(), 
        'text'
      );
      setNewMessage('');
      // Refresh chat room
      const updatedRoom = await getChatRoom(chatRoom.id);
      if (updatedRoom) {
        setChatRoom(updatedRoom);
      }
    } catch {
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View className={`flex-row mb-4 ${
      item.userId === currentUser?.id ? 'justify-end' : 
      item.type === 'system' ? 'justify-center' : 'justify-start'
    }`}>
      {item.type === 'system' ? (
        <View className="glass-card dark:glass-card-dark px-4 py-2 rounded-full flex-row items-center">
          <IconSymbol name="megaphone.fill" size={16} color="#6A0DAD" />
          <Text className="text-sm text-primary font-medium ml-2">
            {item.message}
          </Text>
        </View>
      ) : (
        <View className={`max-w-xs ${
          item.userId === currentUser?.id 
            ? 'bg-primary rounded-2xl rounded-tr-md' 
            : 'card rounded-2xl rounded-tl-md'
        }`}>
          <View className="px-4 py-3">
            {item.userId !== currentUser?.id && (
              <Text className="text-xs font-bold text-primary mb-1">
                {item.username}
              </Text>
            )}
            <Text className={`text-base leading-relaxed ${
              item.userId === currentUser?.id 
                ? 'text-white' 
                : 'text-gray-900 dark:text-white'
            }`}>
              {item.message}
            </Text>
            <Text className={`text-xs mt-2 ${
              item.userId === currentUser?.id 
                ? 'text-white/70' 
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              {new Date(item.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
          </View>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 page-container">
        <View className="flex-1 flex-center">
          <View className="glass-card dark:glass-card-dark rounded-2xl p-8 mx-8">
            <View className="animate-pulse-soft mb-4">
              <IconSymbol name="message" size={48} color="#6A0DAD" />
            </View>
            <Text className="text-heading text-center mb-2">
              Loading Chat
            </Text>
            <Text className="text-body text-center">
              Connecting to venue conversation...
            </Text>
          </View>
        </View>
      </View>
    );
  }

  if (!chatRoom) {
    return (
      <View className="flex-1 page-container">
        <View className="flex-1 flex-center">
          <View className="glass-card dark:glass-card-dark rounded-2xl p-8 mx-8">
            <IconSymbol name="exclamationmark.triangle" size={48} color="#F59E0B" />
            <Text className="text-heading text-center mb-2 mt-4">
              Chat Unavailable
            </Text>
            <Text className="text-body text-center mb-6">
              Unable to connect to the chat room for this venue
            </Text>
            <TouchableOpacity onPress={onClose} className="btn-primary">
              <Text className="text-white font-semibold">Go Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 page-container">
      {/* Enhanced Header */}
      <View className="flex-row items-center px-6 py-4 border-b border-gray-100 dark:border-gray-800 safe-top">
        <TouchableOpacity 
          onPress={onClose}
          className="btn-secondary mr-4"
          activeOpacity={0.7}
        >
          <IconSymbol name="chevron.left" size={20} color="#6A0DAD" />
        </TouchableOpacity>
        
        <View className="flex-1">
          <Text className="text-subheading">
            {chatRoom.venueName}
          </Text>
          <Text className="text-caption flex-row items-center">
            <IconSymbol name="person.2" size={12} color="#10B981" />
            <Text className="ml-1">
              {chatRoom.participants} members online
            </Text>
          </Text>
        </View>
        
        <TouchableOpacity className="btn-secondary">
          <IconSymbol name="info.circle" size={20} color="#6A0DAD" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        data={chatRoom.messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        className="flex-1"
        contentContainerStyle={{ 
          padding: 20,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
        inverted={false}
      />

      {/* Enhanced Input Area */}
      <View className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 safe-bottom">
        <View className="flex-row items-end space-x-3">
          <View className="flex-1">
            <TextInput
              className="input-primary py-4 px-5 h-12 max-h-32"
              placeholder="Share your thoughts, ask questions..."
              placeholderTextColor="#9CA3AF"
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
              textAlignVertical="center"
            />
          </View>
          
          <TouchableOpacity
            className={`btn-fab ${!newMessage.trim() && 'opacity-50'}`}
            onPress={handleSendMessage}
            disabled={!newMessage.trim()}
            activeOpacity={0.8}
          >
            <IconSymbol name="paperplane.fill" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        {/* Quick Actions */}
        <View className="flex-row items-center mt-3 space-x-2">
          <TouchableOpacity className="glass-card dark:glass-card-dark px-3 py-2 rounded-full">
            <Text className="text-xs text-primary font-medium">Ask for directions</Text>
          </TouchableOpacity>
          <TouchableOpacity className="glass-card dark:glass-card-dark px-3 py-2 rounded-full">
            <Text className="text-xs text-primary font-medium">Find services</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ChatScreen;
