import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BannerAd() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ad Banner (stub)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 8, alignItems: 'center' },
  text: { color: '#333', fontSize: 16 },
});
