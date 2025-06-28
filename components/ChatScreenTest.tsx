import React from 'react';
import { View, Text } from 'react-native';

interface ChatScreenProps {
  venueId: string;
  onClose: () => void;
}

export default function ChatScreen({ venueId, onClose }: ChatScreenProps) {
  return (
    <View>
      <Text>Chat for venue: {venueId}</Text>
    </View>
  );
}
