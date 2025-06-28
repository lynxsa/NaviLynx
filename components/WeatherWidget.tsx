import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeSafe } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ModernCard } from './ui/ModernComponents';

// Dummy weather data for Johannesburg
const dummyWeatherData = {
  temperature: 22,
  condition: 'Partly Cloudy',
  humidity: 65,
  windSpeed: 12,
  city: 'Johannesburg',
};

export default function WeatherWidget() {
  const { colors } = useThemeSafe();
  const { t } = useLanguage();
  const weather = useState(dummyWeatherData)[0];

  return (
    <View style={styles.container}>
      <ModernCard style={styles.card}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t('currentWeather')}
          </Text>
          <IconSymbol name="paperplane.fill" size={20} color={colors.primary} />
        </View>

        <View style={styles.content}>
          <View style={styles.mainInfo}>
            <Text style={[styles.temperature, { color: colors.text }]}>
              {weather.temperature}°C
            </Text>
            <Text style={[styles.condition, { color: colors.icon }]}>
              {weather.condition}
            </Text>
            <Text style={[styles.city, { color: colors.icon }]}>
              {weather.city}
            </Text>
          </View>

          <View style={styles.details}>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: colors.icon }]}>
                Humidity
              </Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {weather.humidity}%
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: colors.icon }]}>
                Wind
              </Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {weather.windSpeed} km/h
              </Text>
            </View>
          </View>
        </View>
      </ModernCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  card: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainInfo: {
    alignItems: 'flex-start',
  },
  temperature: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  condition: {
    fontSize: 14,
    marginTop: 4,
  },
  city: {
    fontSize: 12,
    marginTop: 2,
  },
  details: {
    alignItems: 'flex-end',
  },
  detailItem: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});