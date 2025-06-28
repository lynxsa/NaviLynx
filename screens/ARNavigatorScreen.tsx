import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useVisionRecognition } from '../hooks/useVisionRecognition';
import ObjectRecognitionResult from '../components/ar/Overlays/ObjectRecognitionResult';
import ARNavigationOverlay from '../components/ar/Overlays/ARNavigationOverlay';
import { venues } from '../data/venues';
import { Camera, useCameraPermissions } from 'expo-camera';
import { useTheme } from '../context/ThemeContext';

export default function ARNavigatorScreen() {
  const [image, setImage] = useState<string | null>(null);
  const { result, loading, error, recognize } = useVisionRecognition();
  const route = useRoute();
  const filter = (route.params as any)?.filter;
  const venueId = (route.params as any)?.venueId;
  const selectedVenue = venueId ? venues.find(v => v.id === venueId) : null;
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const { colors } = useTheme();

  const pickImage = async () => {
    const res = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.5 });
    if (!res.canceled && res.assets && res.assets[0].uri) {
      setImage(res.assets[0].uri);
      recognize(res.assets[0].uri);
    }
  };

  if (!cameraPermission) {
    return <View style={[styles.container, { backgroundColor: colors.background }]}><Text style={{ color: colors.text }}>Checking camera permissions...</Text></View>;
  }
  if (!cameraPermission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}> 
        <Text style={[styles.error, { color: colors.error }]}>Camera permission is required for AR features.</Text>
        <Button title="Grant Camera Permission" onPress={requestCameraPermission} />
      </View>
    );
  }
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Text style={[styles.title, { color: colors.text }]}>AR Navigator {filter ? `(Filter: ${filter})` : ''}</Text>
      {selectedVenue && (
        <>
          <View style={{ marginBottom: 16, alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, color: colors.text }}>Navigating to:</Text>
            <Text style={{ fontSize: 16, color: colors.text }}>{selectedVenue.name}</Text>
            <Text style={{ color: colors.textSecondary }}>{selectedVenue.description}</Text>
          </View>
          <ARNavigationOverlay venueName={selectedVenue.name} />
        </>
      )}
      <Button title="Scan Object" onPress={pickImage} disabled={loading} />
      {image && <Image source={{ uri: image }} style={styles.preview} />}
      {loading && <Text style={[styles.info, { color: colors.textSecondary }]}>Recognizing...</Text>}
      {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}
      {result && <ObjectRecognitionResult label={result.label} confidence={result.confidence} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  preview: { width: 220, height: 220, borderRadius: 16, margin: 16 },
  info: { margin: 8 },
  error: { margin: 8 },
});
