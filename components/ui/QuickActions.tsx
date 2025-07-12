import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { IconSymbol } from './IconSymbol';
import { useTheme } from '@/context/ThemeContext';
import { colors, spacing, borderRadius, shadows } from '@/styles/modernTheme';

interface QuickAction {
  id: string;
  icon: string;
  label: string;
  onPress: () => void;
}

interface QuickActionsProps {
  actions?: QuickAction[];
}

const defaultActions: QuickAction[] = [
  {
    id: 'scan',
    icon: 'viewfinder.circle',
    label: 'Scan Item',
    onPress: () => console.log('Scan pressed'),
  },
  {
    id: 'checkin',
    icon: 'location.circle',
    label: 'Check-In',
    onPress: () => console.log('Check-in pressed'),
  },
  {
    id: 'favorites',
    icon: 'heart.circle',
    label: 'Favorites',
    onPress: () => console.log('Favorites pressed'),
  },
  {
    id: 'history',
    icon: 'clock.arrow.circlepath',
    label: 'History',
    onPress: () => console.log('History pressed'),
  },
];

export const QuickActions: React.FC<QuickActionsProps> = ({ 
  actions = defaultActions 
}) => {
  const { isDark } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[
        styles.title,
        { color: isDark ? '#FFFFFF' : colors.gray[900] }
      ]}>
        Quick Actions
      </Text>
      <View style={styles.grid}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            onPress={action.onPress}
            style={[
              styles.actionButton,
              {
                backgroundColor: isDark ? colors.gray[800] : colors.gray[50],
              }
            ]}
            activeOpacity={0.7}
          >
            <View style={[
              styles.iconContainer,
              { backgroundColor: `${colors.primary[600]}15` }
            ]}>
              <IconSymbol 
                name={action.icon as any} 
                size={24} 
                color={colors.primary[600]} 
              />
            </View>
            <Text style={[
              styles.label,
              { color: isDark ? colors.gray[200] : colors.gray[700] }
            ]}>
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    minWidth: '22%',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    ...shadows.sm,
  },
  iconContainer: {
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default QuickActions;
