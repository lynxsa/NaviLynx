import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { IconSymbol } from '@/components/ui/IconSymbol';
import GlassCard from './GlassCard';

export default function EmergencyButton() {
  const { colors } = useTheme();
  const { t } = useLanguage();

  const handleEmergencyPress = () => {
    Alert.alert(
      t('emergency'),
      t('callSecurity'),
      [
        { text: t('tryAgain'), style: 'cancel' },
        { 
          text: t('callSecurity'), 
          style: 'destructive',
          onPress: () => console.log('Emergency call initiated')
        }
      ]
    );
  };

  return (
    <TouchableOpacity onPress={handleEmergencyPress} style={styles.container}>
      <GlassCard style={[styles.card, { borderColor: '#EF4444' }]}>
        <IconSymbol name="paperplane.fill" size={24} color="#EF4444" />
        <Text style={[styles.text, { color: colors.text }]}>
          {t('emergency')}
        </Text>
      </GlassCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  card: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
});