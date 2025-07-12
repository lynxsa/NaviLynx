import AsyncStorage from '@react-native-async-storage/async-storage';

interface ChatMessage {
  id: string;
  text: string;
  timestamp: number;
  isUser: boolean;
}

interface ChatHistory {
  messages: ChatMessage[];
  lastUpdated: number;
}

const CHAT_HISTORY_PREFIX = '@navilynx_chat_history_';

export const getChatHistory = async (userId: string): Promise<ChatHistory | null> => {
  try {
    const chatData = await AsyncStorage.getItem(`${CHAT_HISTORY_PREFIX}${userId}`);
    return chatData ? JSON.parse(chatData) : { messages: [], lastUpdated: Date.now() };
  } catch (error) {
    console.error('Error getting chat history:', error);
    return { messages: [], lastUpdated: Date.now() };
  }
};

export const saveChatHistory = async (userId: string, history: ChatHistory): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(`${CHAT_HISTORY_PREFIX}${userId}`, JSON.stringify({
      ...history,
      lastUpdated: Date.now()
    }));
    return true;
  } catch (error) {
    console.error('Error saving chat history:', error);
    return false;
  }
};
