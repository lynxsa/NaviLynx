import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, Dimensions } from 'react-native';
import GlassCard from '../../ui/GlassCard';

const VenueCard = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get('window').width;
  const cardPadding = Math.max(12, Math.min(24, screenWidth * 0.05));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <GlassCard style={{ padding: cardPadding }}>
        <Text>Venue Card (stub)</Text>
      </GlassCard>
    </Animated.View>
  );
};

export default VenueCard;
