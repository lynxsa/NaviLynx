import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import ChatScreen from '../../components/ChatScreen';
import { useThemeSafe } from '@/context/ThemeContext';

export default function ChatScreenRoute() {
  const { colors } = useThemeSafe();
  const { venueId } = useLocalSearchParams<{ venueId: string }>();

  const handleClose = () => {
    router.back();
  };

  if (!venueId) {
    router.back();
    return null;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ChatScreen venueId={venueId} onClose={handleClose} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
