import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const categories = ['All', 'Mall', 'Hospital', 'Airport', 'Entertainment', 'Food', 'Parking'];

export default function Filters({ selected, onSelect }: { selected: string; onSelect: (cat: string) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat}
          style={[styles.chip, selected === cat && styles.selectedChip]}
          onPress={() => onSelect(cat)}
        >
          <Text style={[styles.chipText, selected === cat && styles.selectedText]}>{cat}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', padding: 8, backgroundColor: '#f8fafc' },
  chip: { backgroundColor: '#e0e7ef', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 8, marginRight: 8 },
  selectedChip: { backgroundColor: '#007AFF' },
  chipText: { color: '#333', fontWeight: '500' },
  selectedText: { color: '#fff' },
});
