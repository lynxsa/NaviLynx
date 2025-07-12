import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type Props = { label: string; onPress: () => void };

const QuickActionButton: React.FC<Props> = ({ label, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.text}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: { backgroundColor: '#007AFF', borderRadius: 8, padding: 12, margin: 4 },
  text: { color: '#fff', fontWeight: 'bold' },
});

export default QuickActionButton;
