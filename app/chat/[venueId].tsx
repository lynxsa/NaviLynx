import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import ChatScreen from '../../components/ChatScreen';

export default function ChatScreenRoute() {
  const { venueId } = useLocalSearchParams<{ venueId: string }>();

  const handleClose = () => {
    router.back();
  };

  if (!venueId) {
    router.back();
    return null;
  }

  return (
    <SafeAreaView className="flex-1 page-container" edges={['top']}>
      <ChatScreen venueId={venueId} onClose={handleClose} />
    </SafeAreaView>
  );
}
