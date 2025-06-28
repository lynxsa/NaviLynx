import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface VenueMarkerProps {
  name: string;
  onPress: () => void;
}

export default function VenueMarker({ name, onPress }: VenueMarkerProps) {
  return (
    <TouchableOpacity style={styles.marker} onPress={onPress}>
      <Text style={styles.text}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  marker: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    margin: 4,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
