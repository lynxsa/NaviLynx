import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { IconSymbol } from './ui/IconSymbol';
import { Spacing } from '@/constants/Theme';
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

function ChatScreen({ venueId, onClose }: ChatScreenProps) {
  const { colors } = useTheme();
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const currentUser = getCurrentUser();

  const initializeChatRoom = useCallback(async () => {
    try {
      let room = await getChatRoom(venueId);
      if (!room) {
        room = await joinChatRoom(venueId);
      }
      setChatRoom(room);
    } catch (error) {
      // Use the error in the Alert for more detail
      Alert.alert('Error', `Failed to load chat room: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  }, [venueId]);

  useEffect(() => {
    initializeChatRoom();
  }, [initializeChatRoom]);

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
    } catch (error) {
      // Use the error in the Alert for more detail
      Alert.alert('Error', `Failed to send message: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View style={[
      styles.messageContainer,
      item.userId === currentUser?.id ? styles.ownMessage : styles.otherMessage,
      item.type === 'system' && styles.systemMessage
    ]}>
      {item.type === 'system' && (
        <IconSymbol name="megaphone.fill" size={14} color={colors.accent} />
      )}
      <View style={styles.messageContent}>
        {item.userId !== currentUser?.id && (
          <Text style={[styles.senderName, { color: colors.primary }]}>
            {item.username}
          </Text>
        )}
        <Text style={[styles.messageText, { color: colors.text }]}>
          {item.message}
        </Text>
        <Text style={[styles.messageTime, { color: colors.text + '60' }]}>
          {new Date(item.timestamp).toLocaleTimeString()}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Loading chat...
        </Text>
      </View>
    );
  }

  if (!chatRoom) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>
          Chat room not available
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={onClose}>
          <IconSymbol name="xmark" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {chatRoom.venueName}
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.text + '80' }]}>
            {chatRoom.participants} members online
          </Text>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        data={chatRoom.messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
      />

      {/* Input */}
      <View style={[styles.inputContainer, { borderTopColor: colors.border }]}>
        <TextInput
          style={[styles.textInput, { backgroundColor: colors.cardBackground, color: colors.text }]}
          placeholder="Type a message..."
          placeholderTextColor={colors.text + '60'}
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: colors.primary }]}
          onPress={handleSendMessage}
          disabled={!newMessage.trim()}
        >
          <IconSymbol name="paperplane.fill" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    gap: Spacing.sm,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  messageContainer: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  ownMessage: {
    justifyContent: 'flex-end',
  },
  otherMessage: {
    justifyContent: 'flex-start',
  },
  systemMessage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContent: {
    maxWidth: '80%',
    padding: Spacing.sm,
    borderRadius: 12,
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderTopWidth: 1,
    gap: Spacing.sm,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 50,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 50,
  },
});

export default ChatScreen;
