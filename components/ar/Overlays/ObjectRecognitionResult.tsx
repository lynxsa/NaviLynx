import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  label: string;
  confidence: number;
}

export default function ObjectRecognitionResult({ label, confidence }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.confidence}>{(confidence * 100).toFixed(1)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    margin: 8,
  },
  label: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  confidence: {
    color: '#FFD700',
    fontSize: 14,
    marginTop: 4,
  },
});
