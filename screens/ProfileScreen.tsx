import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, Button, Alert } from 'react-native';
import AvatarStats from '../components/profile/AvatarStats/AvatarStats';
import SettingsList from '../components/profile/SettingsList/SettingsList';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, saveUserProfile } from '../services/userProfileLocal';

export default function ProfileScreen() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '' });

  useEffect(() => {
    if (user) {
      getUserProfile(user.id).then((data) => {
        setProfile(data);
        setForm({ fullName: data?.fullName || '', email: data?.email || user.email || '' });
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    await saveUserProfile(user.id, { fullName: form.fullName, email: form.email });
    setProfile((p: any) => ({ ...p, fullName: form.fullName, email: form.email }));
    setEdit(false);
    Alert.alert('Profile updated!');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <AvatarStats profile={profile} />
      {edit ? (
        <View style={styles.editForm}>
          <TextInput
            style={styles.input}
            value={form.fullName}
            onChangeText={v => setForm(f => ({ ...f, fullName: v }))}
            placeholder="Full Name"
          />
          <TextInput
            style={styles.input}
            value={form.email}
            onChangeText={v => setForm(f => ({ ...f, email: v }))}
            placeholder="Email"
            keyboardType="email-address"
          />
          <Button title="Save" onPress={handleSave} />
          <Button title="Cancel" onPress={() => setEdit(false)} color="#888" />
        </View>
      ) : (
        <Button title="Edit Profile" onPress={() => setEdit(true)} />
      )}
      <SettingsList />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { paddingBottom: 32 },
  editForm: { padding: 16, gap: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 8, backgroundColor: '#fff' },
});
