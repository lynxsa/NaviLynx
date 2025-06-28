import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BannerAd = () => (
  <View style={styles.banner}>
    <Text>Ad Banner (stub)</Text>
  </View>
);

const styles = StyleSheet.create({
  banner: { height: 60, backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center', borderRadius: 8, margin: 8 },
});

export default BannerAd;
