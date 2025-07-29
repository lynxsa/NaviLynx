/**
 * 📱 OPERATION LIONMOUNTAIN - Universal App Header
 * 
 * Standardized header component used across all screens
 * Consistent purple theme with modern design
 * 
 * @version 1.0.0 - LIONMOUNTAIN Edition
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { purpleTheme, spacing, typography } from '../theme/globalTheme';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  showLogo?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  leftComponent?: React.ReactNode;
  variant?: 'default' | 'gradient' | 'transparent';
  isDark?: boolean;
  style?: ViewStyle;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  showLogo = false,
  onBackPress,
  rightComponent,
  leftComponent,
  variant = 'default',
  isDark = false,
  style,
}) => {
  const handleBackPress = () => {
    if (onBackPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onBackPress();
    }
  };

  const renderContent = () => (
    <View style={[styles.container, style]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      
      <View style={styles.header}>
        {/* Left Section */}
        <View style={styles.leftSection}>
          {leftComponent ? (
            leftComponent
          ) : showBackButton ? (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
              activeOpacity={0.7}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={isDark ? purpleTheme.textDark : purpleTheme.text}
              />
            </TouchableOpacity>
          ) : showLogo ? (
            <View style={styles.logoContainer}>
              <Text style={[styles.logo, { color: purpleTheme.primary }]}>
                NaviLynx
              </Text>
            </View>
          ) : (
            <View style={styles.spacer} />
          )}
        </View>

        {/* Center Section */}
        <View style={styles.centerSection}>
          <Text
            style={[
              styles.title,
              { color: isDark ? purpleTheme.textDark : purpleTheme.text }
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                { color: isDark ? purpleTheme.textSecondaryDark : purpleTheme.textSecondary }
              ]}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          )}
        </View>

        {/* Right Section */}
        <View style={styles.rightSection}>
          {rightComponent || <View style={styles.spacer} />}
        </View>
      </View>
    </View>
  );

  if (variant === 'gradient') {
    return (
      <LinearGradient
        colors={purpleTheme.gradients.primary}
        style={styles.gradientContainer}
      >
        <SafeAreaView edges={['top']}>
          {renderContent()}
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (variant === 'transparent') {
    return (
      <SafeAreaView edges={['top']} style={styles.transparentContainer}>
        {renderContent()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={['top']}
      style={[
        styles.defaultContainer,
        { backgroundColor: isDark ? purpleTheme.surfaceDark : purpleTheme.surface }
      ]}
    >
      {renderContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  defaultContainer: {
    backgroundColor: purpleTheme.surface,
    borderBottomWidth: 1,
    borderBottomColor: purpleTheme.border,
  },
  gradientContainer: {
    // Gradient styles handled by LinearGradient
  },
  transparentContainer: {
    backgroundColor: 'transparent',
  },
  container: {
    paddingBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    minHeight: 56,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 3,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: spacing.xs,
    borderRadius: 8,
  },
  logoContainer: {
    padding: spacing.xs,
  },
  logo: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
  },
  title: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.normal,
    textAlign: 'center',
    marginTop: 2,
  },
  spacer: {
    width: 32,
  },
});

export default AppHeader;
