import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function PhotoCapture({ onPhoto }: { onPhoto: (uri: string) => void }) {
  const [photo, setPhoto] = useState<string | null>(null);

  const handleCapture = async () => {
    const res = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.5 });
    if (!res.canceled && res.assets && res.assets[0].uri) {
      setPhoto(res.assets[0].uri);
      onPhoto(res.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      {photo && <Image source={{ uri: photo }} style={styles.image} />}
      <Button title={photo ? 'Retake Photo' : 'Capture Parking Photo'} onPress={handleCapture} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 8, alignItems: 'center' },
  text: { color: '#333', fontSize: 16 },
  image: { width: 180, height: 120, borderRadius: 12, marginBottom: 8 },
});
