import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useThemeSafe } from '@/context/ThemeContext';
import { IconSymbol } from '@/components/ui/IconSymbol';

const { width } = Dimensions.get('window');

// Stat Card Component
interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  color?: string;
  onPress?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  color,
  onPress
}) => {
  const { colors } = useThemeSafe();
  const cardColor = color || colors.primary;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="flex-1 rounded-2xl p-4 mx-1"
      style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }}
    >
      <View className="flex-row items-center justify-between mb-2">
        <View 
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: cardColor + '20' }}
        >
          <IconSymbol name={icon as any} size={20} color={cardColor} />
        </View>
      </View>
      <Text 
        className="text-2xl font-bold mb-1"
        style={{ color: colors.text }}
      >
        {value}
      </Text>
      <Text 
        className="text-sm"
        style={{ color: colors.textSecondary }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// Quick Action Component
interface QuickActionProps {
  icon: string;
  label: string;
  color?: string;
  onPress?: () => void;
}

export const QuickAction: React.FC<QuickActionProps> = ({
  icon,
  label,
  color,
  onPress
}) => {
  const { colors } = useThemeSafe();
  const actionColor = color || colors.primary;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="items-center p-3 rounded-2xl"
      style={{ 
        backgroundColor: colors.surface, 
        borderColor: colors.border, 
        borderWidth: 1,
        width: (width - 64) / 4,
        marginHorizontal: 2
      }}
    >
      <View 
        className="w-12 h-12 rounded-2xl items-center justify-center mb-2"
        style={{ backgroundColor: actionColor + '20' }}
      >
        <IconSymbol name={icon as any} size={20} color={actionColor} />
      </View>
      <Text 
        className="text-xs font-medium text-center"
        style={{ color: colors.text }}
        numberOfLines={2}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// NaviGenie Card Component
interface NaviGenieCardProps {
  onPress?: () => void;
}

export const NaviGenieCard: React.FC<NaviGenieCardProps> = ({ onPress }) => {
  const { colors } = useThemeSafe();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push('/(tabs)/navigenie' as any);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.9}
      className="mx-4 mb-6 rounded-2xl overflow-hidden shadow-lg"
      style={{ height: 120 }}
    >
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1 p-4 justify-between"
      >
        <View className="flex-row items-center">
          <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center mr-3">
            <IconSymbol name="sparkles" size={24} color="#FFFFFF" />
          </View>
          <View className="flex-1">
            <Text className="text-white text-lg font-bold">
              NaviGenie AI
            </Text>
            <Text className="text-white/90 text-sm">
              Your intelligent navigation assistant
            </Text>
          </View>
        </View>
        
        <View className="flex-row justify-between items-center">
          <Text className="text-white/80 text-sm">
            Ask me anything about indoor navigation
          </Text>
          <View className="flex-row items-center">
            <Text className="text-white text-sm font-medium mr-2">
              Chat Now
            </Text>
            <IconSymbol name="chevron.right" size={16} color="#FFFFFF" />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

// Event Card Component
interface EventCardProps {
  event?: {
    id: string;
    title: string;
    venue: string;
    date: string;
    time: string;
    category: string;
  };
  onPress?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
  const { colors } = useThemeSafe();

  // Default event if none provided
  const defaultEvent = {
    id: 'default',
    title: 'Summer Shopping Festival',
    venue: 'Sandton City',
    date: 'Dec 15, 2024',
    time: '10:00 AM',
    category: 'Shopping'
  };

  const eventData = event || defaultEvent;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="mx-4 mb-6 rounded-2xl p-4"
      style={{ 
        backgroundColor: colors.primary + '10', 
        borderColor: colors.primary + '30',
        borderWidth: 1
      }}
    >
      <View className="flex-row items-center justify-between mb-3">
        <View 
          className="px-3 py-1 rounded-full"
          style={{ backgroundColor: colors.primary + '20' }}
        >
          <Text 
            className="text-xs font-medium"
            style={{ color: colors.primary }}
          >
            {eventData.category}
          </Text>
        </View>
        <View className="flex-row items-center">
          <IconSymbol name="calendar" size={14} color={colors.textSecondary} />
          <Text 
            className="text-xs ml-1"
            style={{ color: colors.textSecondary }}
          >
            {eventData.date}
          </Text>
        </View>
      </View>

      <Text 
        className="text-lg font-bold mb-1"
        style={{ color: colors.text }}
      >
        {eventData.title}
      </Text>
      
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <IconSymbol name="location" size={14} color={colors.textSecondary} />
          <Text 
            className="text-sm ml-1"
            style={{ color: colors.textSecondary }}
          >
            {eventData.venue}
          </Text>
        </View>
        <View className="flex-row items-center">
          <IconSymbol name="clock" size={14} color={colors.textSecondary} />
          <Text 
            className="text-sm ml-1"
            style={{ color: colors.textSecondary }}
          >
            {eventData.time}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
