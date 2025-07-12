import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle, TextStyle, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { modernTheme, responsive } from '@/constants/ModernTheme';
import { useThemeSafe } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { brand } from '@/constants/branding';

// Enhanced Button Component with NativeWind and better responsive design
interface ModernButtonProps {
  variant?: 'primary' | 'secondary' | 'sa-gradient' | 'glass' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  className?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const ModernButton: React.FC<ModernButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onPress,
  disabled = false,
  icon,
  iconPosition = 'left',
  className = '',
  style,
  textStyle,
  fullWidth = false,
}) => {
  const { colors, isDark } = useThemeSafe();
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          container: `bg-primary-500 ${isDark ? 'shadow-lg' : 'shadow-button'}`,
          text: 'text-white font-semibold',
        };
      case 'secondary':
        return {
          container: `${isDark ? 'bg-gray-800' : 'bg-gray-100'} shadow-sm border ${isDark ? 'border-gray-700' : 'border-gray-200'}`,
          text: `${isDark ? 'text-gray-200' : 'text-gray-700'} font-medium`,
        };
      case 'sa-gradient':
        return {
          container: 'shadow-button',
          text: 'text-white font-bold',
          gradient: [modernTheme.colors.southAfrica.orange, modernTheme.colors.southAfrica.gold],
        };
      case 'glass':
        return {
          container: `${isDark ? 'glass-card-dark' : 'glass-card'} shadow-glass`,
          text: `${isDark ? 'text-white' : 'text-gray-800'} font-medium`,
        };
      case 'outline':
        return {
          container: `border-2 border-primary-500 bg-transparent ${isDark ? 'border-primary-400' : ''}`,
          text: `${isDark ? 'text-primary-400' : 'text-primary-500'} font-medium`,
        };
      default:
        return {
          container: `bg-primary-500 ${isDark ? 'shadow-lg' : 'shadow-button'}`,
          text: 'text-white font-semibold',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'px-3 py-2 rounded-lg h-9',
          text: 'text-responsive-sm',
          icon: Platform.select({ ios: 16, android: 16, default: 14 }),
        };
      case 'md':
        return {
          container: 'px-4 py-3 rounded-xl h-11',
          text: 'text-responsive-base',
          icon: Platform.select({ ios: 20, android: 20, default: 18 }),
        };
      case 'lg':
        return {
          container: 'px-6 py-4 rounded-xl h-13',
          text: 'text-responsive-lg',
          icon: Platform.select({ ios: 24, android: 24, default: 20 }),
        };
      default:
        return {
          container: 'px-4 py-3 rounded-xl h-11',
          text: 'text-responsive-base',
          icon: Platform.select({ ios: 20, android: 20, default: 18 }),
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  const isDisabled = disabled;

  const baseClasses = `flex-row items-center justify-center ${sizeStyles.container} ${variantStyles.container} ${fullWidth ? 'w-full' : ''} ${className}`;
  const textClasses = `${sizeStyles.text} ${variantStyles.text}`;

  const buttonContent = (
    <>
      {icon && iconPosition === 'left' && (
        <IconSymbol 
          name={icon as any}
          size={sizeStyles.icon} 
          color={variant === 'outline' ? (isDark ? colors.primary : colors.primary) : '#FFFFFF'} 
          style={{ marginRight: 8 }}
        />
      )}
      <Text className={textClasses} style={[textStyle, { textAlign: 'center' }]}>
        {children}
      </Text>
      {icon && iconPosition === 'right' && (
        <IconSymbol 
          name={icon as any}
          size={sizeStyles.icon} 
          color={variant === 'outline' ? (isDark ? colors.primary : colors.primary) : '#FFFFFF'} 
          style={{ marginLeft: 8 }}
        />
      )}
    </>
  );

  if (variant === 'sa-gradient' && variantStyles.gradient) {
    return (
      <TouchableOpacity 
        onPress={onPress} 
        disabled={isDisabled} 
        style={style}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={variantStyles.gradient as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className={baseClasses}
          style={isDisabled ? { opacity: 0.5 } : {}}
        >
          {buttonContent}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={isDisabled}
      className={baseClasses}
      style={[style, isDisabled ? { opacity: 0.5 } : {}]}
      activeOpacity={0.8}
    >
      {buttonContent}
    </TouchableOpacity>
  );
};

// Enhanced Card Component with better responsive design
interface ModernCardProps {
  variant?: 'standard' | 'glass' | 'elevated' | 'sa-themed' | 'outline';
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  onPress?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const ModernCard: React.FC<ModernCardProps> = ({
  variant = 'standard',
  children,
  className = '',
  style,
  onPress,
  padding = 'md',
}) => {
  const { isDark } = useThemeSafe();

  const getPaddingClasses = () => {
    switch (padding) {
      case 'none':
        return '';
      case 'sm':
        return 'p-3';
      case 'md':
        return 'p-4';
      case 'lg':
        return 'p-6';
      default:
        return 'p-4';
    }
  };

  const getVariantClasses = () => {
    const paddingClasses = getPaddingClasses();
    
    switch (variant) {
      case 'glass':
        return `${isDark ? 'glass-card-dark' : 'glass-card'} rounded-xl ${paddingClasses} shadow-glass`;
      case 'elevated':
        return `${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'} rounded-xl ${paddingClasses} shadow-xl`;
      case 'sa-themed':
        return `${isDark ? 'bg-gray-800 border-l-4 border-sa-orange' : 'bg-white border-l-4 border-sa-orange'} rounded-xl ${paddingClasses} shadow-card`;
      case 'outline':
        return `${isDark ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'} rounded-xl ${paddingClasses} shadow-sm`;
      default:
        return `${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'} rounded-xl ${paddingClasses} shadow-card`;
    }
  };

  const cardClasses = `${getVariantClasses()} ${className}`;

  if (onPress) {
    return (
      <TouchableOpacity 
        className={cardClasses} 
        style={style} 
        onPress={onPress}
        activeOpacity={0.9}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View className={cardClasses} style={style}>
      {children}
    </View>
  );
};

// Enhanced Typography Component with responsive design
interface ModernTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'label';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'white' | 'sa-orange';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  children: React.ReactNode;
  className?: string;
  style?: TextStyle;
  numberOfLines?: number;
}

export const ModernText: React.FC<ModernTextProps> = ({
  variant = 'body',
  color = 'primary',
  weight,
  children,
  className = '',
  style,
  numberOfLines,
}) => {
  const { isDark } = useThemeSafe();

  const getVariantClasses = () => {
    switch (variant) {
      case 'h1':
        return 'text-responsive-3xl font-bold leading-tight';
      case 'h2':
        return 'text-responsive-2xl font-bold leading-tight';
      case 'h3':
        return 'text-responsive-xl font-semibold leading-normal';
      case 'h4':
        return 'text-responsive-lg font-semibold leading-normal';
      case 'body':
        return 'text-responsive-base leading-relaxed';
      case 'caption':
        return 'text-responsive-sm leading-normal';
      case 'label':
        return 'text-responsive-sm font-medium leading-normal';
      default:
        return 'text-responsive-base leading-relaxed';
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return isDark ? 'text-white' : 'text-gray-900';
      case 'secondary':
        return isDark ? 'text-gray-300' : 'text-gray-600';
      case 'success':
        return 'text-sa-green';
      case 'warning':
        return 'text-yellow-500';
      case 'error':
        return 'text-sa-red';
      case 'white':
        return 'text-white';
      case 'sa-orange':
        return 'text-sa-orange';
      default:
        return isDark ? 'text-white' : 'text-gray-900';
    }
  };

  const getWeightClasses = () => {
    if (!weight) return '';
    
    switch (weight) {
      case 'light':
        return 'font-light';
      case 'normal':
        return 'font-normal';
      case 'medium':
        return 'font-medium';
      case 'semibold':
        return 'font-semibold';
      case 'bold':
        return 'font-bold';
      default:
        return '';
    }
  };

  const textClasses = `${getVariantClasses()} ${getColorClasses()} ${getWeightClasses()} ${className}`;

  return (
    <Text 
      className={textClasses} 
      style={style}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
};

// Enhanced Container Component with responsive design
interface ModernContainerProps {
  variant?: 'page' | 'section' | 'content' | 'safe';
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  padding?: boolean;
}

export const ModernContainer: React.FC<ModernContainerProps> = ({
  variant = 'content',
  children,
  className = '',
  style,
  padding = true,
}) => {
  const { isDark } = useThemeSafe();

  const getVariantClasses = () => {
    const paddingClasses = padding ? 'container-safe' : '';
    
    switch (variant) {
      case 'page':
        return `flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} ${paddingClasses}`;
      case 'section':
        return `py-6 ${paddingClasses}`;
      case 'content':
        return paddingClasses;
      case 'safe':
        return `flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} safe-top safe-bottom ${paddingClasses}`;
      default:
        return paddingClasses;
    }
  };

  const containerClasses = `${getVariantClasses()} ${className}`;

  return (
    <View className={containerClasses} style={style}>
      {children}
    </View>
  );
};

// Enhanced Status Badge Component
interface ModernBadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'sa-themed';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

export const ModernBadge: React.FC<ModernBadgeProps> = ({
  variant = 'info',
  size = 'md',
  children,
  className = '',
  style,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'bg-sa-green text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'error':
        return 'bg-sa-red text-white';
      case 'info':
        return 'bg-sa-blue text-white';
      case 'sa-themed':
        return 'bg-sa-orange text-white';
      default:
        return 'bg-sa-blue text-white';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 rounded-md text-xs';
      case 'md':
        return 'px-3 py-1 rounded-lg text-sm';
      default:
        return 'px-3 py-1 rounded-lg text-sm';
    }
  };

  const badgeClasses = `font-semibold ${getVariantClasses()} ${getSizeClasses()} ${className}`;

  return (
    <View className={badgeClasses} style={style}>
      <Text className="text-inherit font-inherit">
        {children}
      </Text>
    </View>
  );
};

// Gemini AI/AR Assistant Entry Points
export const GeminiAISearchBar = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const { colors, isDark } = useThemeSafe();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardBackground, borderRadius: 16, padding: 8, marginVertical: 12, elevation: 2 }}>
      <Ionicons name="search" size={22} color={colors.primary} style={{ marginRight: 8 }} />
      <TouchableOpacity style={{ flex: 1 }} onPress={() => onSearch('')}>
        <Text style={{ fontSize: 16, color: colors.textSecondary }}>Ask Gemini anything...</Text>
      </TouchableOpacity>
    </View>
  );
};

export const ARScannerFAB = ({ onPress }: { onPress: () => void }) => {
  const { colors } = useThemeSafe();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ position: 'absolute', bottom: 32, right: 24, backgroundColor: colors.primary, borderRadius: 32, padding: 18, elevation: 6 }}
      accessibilityLabel="Open AR Object Scanner"
    >
      <Ionicons name="scan" size={28} color={brand.light} />
    </TouchableOpacity>
  );
};

export const SmartSuggestionsCarousel = ({ suggestions }: { suggestions: string[] }) => {
  const { colors } = useThemeSafe();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
      {suggestions.map((s, i) => (
        <View key={i} style={{ backgroundColor: colors.background, borderRadius: 14, padding: 12, marginRight: 10, minWidth: 180 }}>
          <Text style={{ color: colors.text, fontWeight: '600' }}>{s}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export const IndoorNavigationCard = ({ onPress }: { onPress: () => void }) => {
  const { colors } = useThemeSafe();
  return (
    <TouchableOpacity onPress={onPress} style={{ backgroundColor: colors.primary, borderRadius: 18, padding: 18, marginVertical: 12, alignItems: 'center', flexDirection: 'row' }}>
      <Ionicons name="navigate" size={26} color={brand.light} style={{ marginRight: 12 }} />
      <Text style={{ color: brand.light, fontSize: 18, fontWeight: 'bold' }}>Indoor Navigation</Text>
    </TouchableOpacity>
  );
};

export const GeminiVisionStub = () => {
  const { colors } = useThemeSafe();
  return (
    <View style={{ backgroundColor: colors.accentLight, borderRadius: 14, padding: 16, marginVertical: 10 }}>
      <Text style={{ color: colors.accent, fontWeight: 'bold' }}>Gemini Vision (Coming Soon)</Text>
      <Text style={{ color: colors.text, marginTop: 4 }}>Scan objects and get instant info, prices, and nearby matches!</Text>
    </View>
  );
};

export const GeminiChatStub = () => {
  const { colors } = useThemeSafe();
  return (
    <View style={{ backgroundColor: colors.primaryLight, borderRadius: 14, padding: 16, marginVertical: 10 }}>
      <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Gemini AI Chat (Coming Soon)</Text>
      <Text style={{ color: colors.text, marginTop: 4 }}>Ask for directions, product info, or anything else!</Text>
    </View>
  );
};

// Export all components
export {
  modernTheme,
  responsive,
};
