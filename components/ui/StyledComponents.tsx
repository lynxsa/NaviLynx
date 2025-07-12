import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { colors, globalStyles, spacing, borderRadius, shadows } from '../../styles/theme';

interface StyledCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  isDark?: boolean;
  variant?: 'default' | 'elevated' | 'outlined';
}

export const StyledCard: React.FC<StyledCardProps> = ({ 
  children, 
  style, 
  isDark = false, 
  variant = 'default' 
}) => {
  const baseStyle = isDark ? globalStyles.cardDark : globalStyles.card;
  
  let additionalStyles: ViewStyle = {};
  
  if (variant === 'elevated') {
    additionalStyles = {
      ...shadows.lg,
    };
  } else if (variant === 'outlined') {
    additionalStyles = {
      borderWidth: 1,
      borderColor: isDark ? colors.dark.border : colors.light.border,
      ...shadows.sm,
    };
  }

  return (
    <View style={[baseStyle, additionalStyles, style]}>
      {children}
    </View>
  );
};

interface StyledButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  isDark?: boolean;
  style?: ViewStyle;
}

export const StyledButton: React.FC<StyledButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  isDark = false,
  style,
}) => {
  const getButtonStyle = (): ViewStyle => {
    let baseStyle: ViewStyle = globalStyles.buttonPrimary as ViewStyle;
    
    if (variant === 'secondary') {
      baseStyle = isDark ? globalStyles.buttonSecondaryDark as ViewStyle : globalStyles.buttonSecondary as ViewStyle;
    } else if (variant === 'outline') {
      const outlineBase = globalStyles.buttonSecondary as ViewStyle;
      baseStyle = {
        ...outlineBase,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.primary[600],
      };
    }
    
    // Size variations
    if (size === 'small') {
      baseStyle = {
        ...baseStyle,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
      };
    } else if (size === 'large') {
      baseStyle = {
        ...baseStyle,
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.xl,
      };
    }
    
    if (disabled) {
      baseStyle = {
        ...baseStyle,
        opacity: 0.5,
      };
    }
    
    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    if (variant === 'primary') {
      return globalStyles.buttonText;
    } else if (variant === 'outline') {
      return {
        ...globalStyles.buttonTextSecondary,
        color: colors.primary[600],
      };
    }
    return isDark ? globalStyles.buttonTextSecondaryDark : globalStyles.buttonTextSecondary;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={getTextStyle()}>{title}</Text>
    </TouchableOpacity>
  );
};

interface StyledTextProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  isDark?: boolean;
  style?: TextStyle;
  color?: string;
}

export const StyledText: React.FC<StyledTextProps> = ({
  children,
  variant = 'body',
  isDark = false,
  style,
  color,
}) => {
  const getTextStyle = (): TextStyle => {
    let baseStyle: TextStyle;
    
    switch (variant) {
      case 'h1':
        baseStyle = isDark ? globalStyles.heading1Dark : globalStyles.heading1;
        break;
      case 'h2':
        baseStyle = isDark ? globalStyles.heading2Dark : globalStyles.heading2;
        break;
      case 'h3':
        baseStyle = isDark ? globalStyles.heading3Dark : globalStyles.heading3;
        break;
      case 'caption':
        baseStyle = isDark ? globalStyles.captionTextDark : globalStyles.captionText;
        break;
      default:
        baseStyle = isDark ? globalStyles.bodyTextDark : globalStyles.bodyText;
    }
    
    if (color) {
      baseStyle = { ...baseStyle, color };
    }
    
    return baseStyle;
  };

  return <Text style={[getTextStyle(), style]}>{children}</Text>;
};

interface GradientCardProps {
  children: React.ReactNode;
  colors?: string[];
  style?: ViewStyle;
}

export const GradientCard: React.FC<GradientCardProps> = ({
  children,
  colors: gradientColors = [colors.primary[600], colors.primary[800]],
  style,
}) => {
  return (
    <View
      style={[
        {
          borderRadius: borderRadius['2xl'],
          padding: spacing.lg,
          ...shadows.md,
          // We'll use a simple backgroundColor for now since LinearGradient needs more setup
          backgroundColor: gradientColors[0],
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

interface QuickActionProps {
  icon: string;
  label: string;
  onPress: () => void;
  isDark?: boolean;
}

export const QuickAction: React.FC<QuickActionProps> = ({
  icon,
  label,
  onPress,
  isDark = false,
}) => {
  return (
    <TouchableOpacity
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.xl,
        backgroundColor: isDark ? colors.dark.surface : colors.light.surface,
        ...shadows.sm,
      }}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: colors.primary[100],
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: spacing.xs,
        }}
      >
        <Text style={{ fontSize: 20 }}>📱</Text>
      </View>
      <StyledText variant="caption" isDark={isDark} style={{ textAlign: 'center' }}>
        {label}
      </StyledText>
    </TouchableOpacity>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon?: string;
  isDark?: boolean;
  style?: ViewStyle;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon = '📊',
  isDark = false,
  style,
}) => {
  const combinedStyle: ViewStyle = {
    padding: spacing.lg,
    ...style,
  };
  
  return (
    <StyledCard isDark={isDark} style={combinedStyle}>
      <View style={[globalStyles.flexRow, globalStyles.alignCenter]}>
        <Text style={{ fontSize: 24, marginRight: spacing.sm }}>{icon}</Text>
        <View style={{ flex: 1 }}>
          <StyledText variant="h3" isDark={isDark}>
            {value}
          </StyledText>
          <StyledText variant="caption" isDark={isDark}>
            {title}
          </StyledText>
        </View>
      </View>
    </StyledCard>
  );
};

export default {
  StyledCard,
  StyledButton,
  StyledText,
  GradientCard,
  QuickAction,
  StatCard,
};
