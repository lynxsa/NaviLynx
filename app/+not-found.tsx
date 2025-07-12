import React from 'react';
import { Link, Stack } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeSafe } from '@/context/ThemeContext';
import modernTheme from '@/styles/modernTheme';

export default function NotFoundScreen() {
  const { colors, isDark } = useThemeSafe();

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.content}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
            <IconSymbol name="questionmark.circle" size={80} color={colors.primary} />
          </View>
          
          <Text style={[styles.title, { color: colors.text }]}>
            Page Not Found
          </Text>
          
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            The page you're looking for doesn't exist or has been moved.
          </Text>
          
          <Link href="/" style={[styles.button, { backgroundColor: colors.primary }]}>
            <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
              Go to Home
            </Text>
          </Link>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: modernTheme.spacing.xl,
  },
  iconContainer: {
    borderRadius: modernTheme.borderRadius.full,
    padding: modernTheme.spacing.xl,
    marginBottom: modernTheme.spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: modernTheme.spacing.md,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: modernTheme.spacing.xl,
  },
  button: {
    paddingHorizontal: modernTheme.spacing.xl,
    paddingVertical: modernTheme.spacing.md,
    borderRadius: modernTheme.borderRadius.lg,
    marginTop: modernTheme.spacing.lg,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
