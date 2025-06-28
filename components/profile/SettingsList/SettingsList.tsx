import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

const settings = [
  { label: 'Dark Mode', value: false },
  { label: 'Notifications', value: true },
  { label: 'Language', value: 'English' },
];

export default function SettingsList() {
  return (
    <View style={styles.container}>
      {settings.map((s, idx) => (
        <View key={s.label} style={styles.row}>
          <Text style={styles.label}>{s.label}</Text>
          {typeof s.value === 'boolean' ? (
            <Switch value={s.value} />
          ) : (
            <Text style={styles.value}>{s.value}</Text>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  label: { fontSize: 15, color: '#222' },
  value: { fontSize: 15, color: '#007AFF' },
});
