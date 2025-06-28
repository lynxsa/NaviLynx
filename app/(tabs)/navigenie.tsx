import React from 'react';
import { View, StyleSheet } from 'react-native';
import NaviGenieScreen from '@/screens/NaviGenieScreen';
import { useThemeSafe } from '@/context/ThemeContext';

export default function NaviGenieTab() {
  const { colors } = useThemeSafe();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <NaviGenieScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
