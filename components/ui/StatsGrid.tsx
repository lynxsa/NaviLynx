import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { IconSymbol } from './IconSymbol';
import { useTheme } from '@/context/ThemeContext';
import { colors, spacing, borderRadius, shadows } from '@/styles/modernTheme';

interface StatCardProps {
  icon: string;
  title: string;
  value: string;
  description: string;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  icon, 
  title, 
  value, 
  description, 
  color = colors.primary 
}) => {
  const { isDark } = useTheme();

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: isDark ? colors.gray[800] : '#FFFFFF',
        borderLeftColor: color,
        borderLeftWidth: 4,
        ...shadows.sm,
      }
    ]}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
        <IconSymbol name={icon as any} size={20} color={color} />
      </View>
      
      <Text style={[
        styles.value,
        { 
          color: isDark ? '#FFFFFF' : colors.text,
          fontSize: 22,
          fontWeight: '700',
          marginBottom: spacing.xs,
          lineHeight: 26
        }
      ]}>
        {value}
      </Text>
      
      <Text style={[
        styles.title,
        { 
          color: isDark ? colors.gray[200] : colors.textSecondary,
          fontSize: 14,
          fontWeight: '600',
          marginBottom: spacing.xs
        }
      ]}>
        {title}
      </Text>
      
      <Text style={[
        styles.description,
        { 
          color: isDark ? colors.gray[400] : colors.gray[500],
          fontSize: 12,
          fontWeight: '500'
        }
      ]}>
        {description}
      </Text>
    </View>
  );
};

interface StatsGridProps {
  stats?: {
    icon: string;
    title: string;
    value: string;
    description: string;
    color?: string;
  }[];
}

const defaultStats = [
  {
    icon: 'location.fill',
    title: 'Visits This Week',
    value: '3',
    description: 'Trending up',
    color: colors.primary,
  },
  {
    icon: 'creditcard.fill',
    title: 'Amount Spent',
    value: 'R 1,250',
    description: 'This month',
    color: colors.success,
  },
];

export const StatsGrid: React.FC<StatsGridProps> = ({ stats = defaultStats }) => {
  const { isDark } = useTheme();

  return (
    <View style={styles.grid}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md }}>
        <View>
          <Text style={[
            {
              fontSize: 16,
              fontWeight: '600',
              color: isDark ? '#FFFFFF' : colors.text,
              marginBottom: 2
            }
          ]}>
            Your Activity
          </Text>
          <Text style={[
            {
              fontSize: 11,
              opacity: 0.7,
              color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
              fontWeight: '500'
            }
          ]}>
            Recent visits and spending
          </Text>
        </View>
      </View>
      <View style={styles.gridContainer}>
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  gridContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  container: {
    flex: 1,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderLeftWidth: 4,
    minHeight: 120,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  title: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 2,
  },
  description: {
    fontSize: 10,
    opacity: 0.7,
  },
});

export default StatsGrid;
