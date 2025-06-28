import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ChatHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>NaviGenie</Text>
      <Text style={styles.subtitle}>Your AI Concierge</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#007AFF', borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  title: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  subtitle: { color: '#e0e7ef', fontSize: 14, marginTop: 2 },
});
