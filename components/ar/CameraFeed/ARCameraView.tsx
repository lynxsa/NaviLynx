import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ARCameraView = () => (
  <View style={styles.container}>
    <Text>AR Camera View (stub)</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#c0e0ff', borderRadius: 12, margin: 8, justifyContent: 'center', alignItems: 'center' },
});

export default ARCameraView;
