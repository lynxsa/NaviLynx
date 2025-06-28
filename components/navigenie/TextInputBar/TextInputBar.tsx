import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';

export default function TextInputBar({ onSend }: { onSend: (text: string) => void }) {
  const [value, setValue] = useState('');
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={setValue}
        placeholder="Type your message..."
        onSubmitEditing={() => {
          if (value.trim()) {
            onSend(value);
            setValue('');
          }
        }}
      />
      <TouchableOpacity
        style={styles.sendButton}
        onPress={() => {
          if (value.trim()) {
            onSend(value);
            setValue('');
          }
        }}
      >
        <Text style={styles.sendText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', padding: 8, backgroundColor: '#fff', borderBottomLeftRadius: 16, borderBottomRightRadius: 16 },
  input: { flex: 1, fontSize: 16, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 12 },
  sendButton: { marginLeft: 8, backgroundColor: '#007AFF', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10 },
  sendText: { color: '#fff', fontWeight: 'bold' },
});
