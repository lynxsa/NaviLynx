import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAT_CACHE_KEY = 'chat_history_cache';

export async function cacheChatHistory(chatHistory: any[]) {
  try {
    await AsyncStorage.setItem(CHAT_CACHE_KEY, JSON.stringify(chatHistory));
  } catch (e) {
    // Ignore cache errors
  }
}

export async function getCachedChatHistory(): Promise<any[] | null> {
  try {
    const data = await AsyncStorage.getItem(CHAT_CACHE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    // Ignore cache errors
  }
  return null;
}

export async function getChatHistoryWithCache(fetchChatHistory: () => Promise<any[]>): Promise<any[]> {
  try {
    const chatHistory = await fetchChatHistory();
    await cacheChatHistory(chatHistory);
    return chatHistory;
  } catch (e) {
    const cached = await getCachedChatHistory();
    return cached || [];
  }
}
