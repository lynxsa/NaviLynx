import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function ChatWindow({ messages = [] }: { messages?: { from: 'user' | 'ai'; text: string }[] }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {messages.map((msg, idx) => (
        <View key={idx} style={[styles.bubble, msg.from === 'user' ? styles.user : styles.ai]}>
          <Text style={styles.text}>{msg.text}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 12 },
  content: { paddingBottom: 24 },
  bubble: { padding: 12, borderRadius: 16, marginBottom: 8, maxWidth: '80%' },
  user: { backgroundColor: '#007AFF', alignSelf: 'flex-end' },
  ai: { backgroundColor: '#e0e7ef', alignSelf: 'flex-start' },
  text: { color: '#222', fontSize: 15 },
});
