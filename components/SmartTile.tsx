
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Dimensions } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useLanguage } from '@/context/LanguageContext';

interface SmartTileProps {
  title: string;
  icon: string;
  onPress: () => void;
  badgeCount?: number;
  isActive?: boolean;
  variant?: 'default' | 'compact' | 'featured';
  size?: 'small' | 'medium' | 'large';
}

export function SmartTile({ 
  title, 
  icon, 
  onPress, 
  badgeCount, 
  isActive = false,
  variant = 'default',
  size = 'medium'
}: SmartTileProps) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { width } = Dimensions.get('window');
  const isTablet = width > 768;

  const getSize = () => {
    const baseSize = isTablet ? 120 : 100;
    switch (size) {
      case 'small': return baseSize * 0.8;
      case 'large': return baseSize * 1.2;
      default: return baseSize;
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small': return 20;
      case 'large': return 32;
      default: return 24;
    }
  };

  const getBackgroundColor = () => {
    if (isActive) {
      return colors.primary + '15';
    }
    switch (variant) {
      case 'featured':
        return colors.surface;
      case 'compact':
        return colors.muted;
      default:
        return colors.card;
    }
  };

  const getBorderColor = () => {
    if (isActive) return colors.primary;
    return variant === 'featured' ? colors.border : colors.borderLight;
  };

  const tileSize = getSize();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          width: tileSize,
          height: tileSize,
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderRadius: variant === 'compact' ? 8 : 16,
        },
        variant === 'featured' && {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 4,
        },
        isActive && styles.activeContainer,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <IconSymbol 
          name={icon as any} 
          size={getIconSize()} 
          color={isActive ? colors.primary : colors.icon} 
        />
        {badgeCount && badgeCount > 0 && (
          <View style={[styles.badge, { backgroundColor: colors.error }]}>
            <Text style={styles.badgeText}>
              {badgeCount > 99 ? '99+' : badgeCount.toString()}
            </Text>
          </View>
        )}
      </View>
      
      <Text 
        style={[
          styles.title,
          { 
            color: isActive ? colors.primary : colors.text,
            fontSize: size === 'small' ? 12 : 14
          }
        ]}
        numberOfLines={2}
      >
        {t(title.toLowerCase()) || title}
      </Text>
    </TouchableOpacity>
  );
}

export default SmartTile;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  activeContainer: {
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 18,
  },
});
