import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const actions = [
  'Find a venue',
  'Get directions',
  'Venue recommendations',
  'Parking help',
];

export default function QuickActionChips({ onAction }: { onAction: (action: string) => void }) {
  return (
    <View style={styles.container}>
      {actions.map((action) => (
        <TouchableOpacity key={action} style={styles.chip} onPress={() => onAction(action)}>
          <Text style={styles.text}>{action}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', flexWrap: 'wrap', padding: 8 },
  chip: { backgroundColor: '#e0e7ef', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 8, margin: 4 },
  text: { color: '#007AFF', fontWeight: '500' },
});
