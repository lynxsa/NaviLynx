import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Alert, Image } from 'react-native';
import PhotoCapture from '../components/parking/PhotoCapture/PhotoCapture';
import TimerControls from '../components/parking/TimerControls/TimerControls';
import FindMyCar from '../components/parking/FindMyCar/FindMyCar';
import RateCalculator from '../components/parking/RateCalculator/RateCalculator';
import BannerAd from '../components/parking/AdBanner/BannerAd';
import { useAuth } from '../context/AuthContext';
import { getParkingData, saveParkingData, addParkingHistory } from '../services/parkingDataLocal';

export default function ParkingScreen() {
  const { user } = useAuth();
  const [showTimer, setShowTimer] = useState(false);
  const [showFindCar, setShowFindCar] = useState(false);
  const [showRateCalc, setShowRateCalc] = useState(false);
  const [location, setLocation] = useState('');
  const [timer, setTimer] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  // Load parking data from local storage on sign in
  useEffect(() => {
    if (user) {
      getParkingData(user.id).then((data) => {
        // Use the recent parking data
        if (data && data.recentParking.length > 0) {
          const latest = data.recentParking[0];
          setLocation(latest.location || '');
          setHistory(data.recentParking || []);
        }
      });
    }
  }, [user]);

  // Save parking data to local storage and add to history
  const handleSave = async () => {
    if (!user) return;
    const parkingHistory = { 
      id: Date.now().toString(),
      location, 
      timestamp: Date.now() 
    };
    await addParkingHistory(user.id, parkingHistory);
    Alert.alert('Parking info saved!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Smart Parking</Text>
      <PhotoCapture onPhoto={setPhoto} />
      {photo && <Text style={styles.photoLabel}>Last parking photo saved.</Text>}
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Enter parking location (e.g. P2, Level 3, Bay 42)"
      />
      <TextInput
        style={styles.input}
        value={timer}
        onChangeText={setTimer}
        placeholder="Set parking timer (e.g. 2h 30m)"
      />
      <Button title="Save Parking Info" onPress={handleSave} />
      {/* Parking History */}
      {history.length > 0 && (
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Parking History</Text>
          {history.slice().reverse().map((event, idx) => (
            <View key={event.timestamp || idx} style={styles.historyItem}>
              {event.photo && <Image source={{ uri: event.photo }} style={styles.historyImage} />}
              <View style={{ flex: 1 }}>
                <Text style={styles.historyText}>Location: {event.location}</Text>
                <Text style={styles.historyText}>Timer: {event.timer}</Text>
                <Text style={styles.historyText}>Time: {event.timestamp ? new Date(event.timestamp).toLocaleString() : ''}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
      <Button title={showTimer ? "Hide Timer" : "Show Timer"} onPress={() => setShowTimer(v => !v)} />
      {showTimer && <TimerControls />}
      <Button title={showFindCar ? "Hide Find My Car" : "Show Find My Car"} onPress={() => setShowFindCar(v => !v)} />
      {showFindCar && <FindMyCar />}
      <Button title={showRateCalc ? "Hide Rate Calculator" : "Show Rate Calculator"} onPress={() => setShowRateCalc(v => !v)} />
      {showRateCalc && <RateCalculator />}
      <BannerAd />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 8, backgroundColor: '#fff' },
  photoLabel: { textAlign: 'center', marginVertical: 8, color: '#666' },
  historySection: { marginTop: 24 },
  historyTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  historyItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, backgroundColor: '#f0f4f8', borderRadius: 10, padding: 8 },
  historyImage: { width: 60, height: 40, borderRadius: 6, marginRight: 10 },
  historyText: { fontSize: 13, color: '#333' },
});
