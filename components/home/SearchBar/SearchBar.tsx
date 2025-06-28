import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const SearchBar = () => (
  <View style={styles.container}>
    <TextInput placeholder="Search venues, stores, or categories..." style={styles.input} />
  </View>
);

const styles = StyleSheet.create({
  container: { padding: 8, backgroundColor: '#fff', borderRadius: 8, margin: 8 },
  input: { fontSize: 16, padding: 8 },
});

export default SearchBar;
