import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AvatarStatsProps {
  profile?: {
    fullName?: string;
    email?: string;
    venues?: number;
    saved?: number;
    visits?: number;
  };
}

export default function AvatarStats({ profile }: AvatarStatsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.avatar} />
      <Text style={styles.name}>{profile?.fullName || 'User Name'}</Text>
      <Text style={styles.email}>{profile?.email || ''}</Text>
      <View style={styles.statsRow}>
        <View style={styles.stat}><Text style={styles.statValue}>{profile?.venues ?? 0}</Text><Text style={styles.statLabel}>Venues</Text></View>
        <View style={styles.stat}><Text style={styles.statValue}>{profile?.saved ?? 0}</Text><Text style={styles.statLabel}>Saved</Text></View>
        <View style={styles.stat}><Text style={styles.statValue}>{profile?.visits ?? 0}</Text><Text style={styles.statLabel}>Visits</Text></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#e0e7ef', marginBottom: 12 },
  name: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  email: { fontSize: 13, color: '#888', marginBottom: 8 },
  statsRow: { flexDirection: 'row', marginTop: 8 },
  stat: { alignItems: 'center', marginHorizontal: 16 },
  statValue: { fontSize: 16, fontWeight: 'bold', color: '#007AFF' },
  statLabel: { fontSize: 12, color: '#888' },
});
