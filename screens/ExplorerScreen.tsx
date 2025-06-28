import React, { useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import Filters from '../components/explorer/Filters/Filters';
import MapContainer from '../components/explorer/MapView/MapContainer';
import { venues } from '../data/venues';

type RootStackParamList = {
  'AR Navigator': { filter: string; venueId?: string };
  // ...other screens
};

export default function ExplorerScreen() {
  const [selected, setSelected] = useState('All');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();

  const handleARToggle = () => {
    navigation.navigate('AR Navigator', { filter: selected });
  };

  const handleMarkerPress = (venueId: string) => {
    navigation.navigate('AR Navigator', {
      filter: selected,
      venueId,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Filters selected={selected} onSelect={setSelected} />
      <Button title="Switch to AR" onPress={handleARToggle} />
      <MapContainer filter={selected} onMarkerPress={handleMarkerPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
});
