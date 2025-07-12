import React from 'react';
import { BlurView as ExpoBlurView } from 'expo-blur';
import { View, ViewProps } from 'react-native';

interface BlurViewProps extends ViewProps {
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  children?: React.ReactNode;
  className?: string;
}

export const BlurView: React.FC<BlurViewProps> = ({
  intensity = 50,
  tint = 'default',
  children,
  className,
  style,
  ...props
}) => {
  return (
    <ExpoBlurView
      intensity={intensity}
      tint={tint}
      style={[{ flex: 1 }, style]}
      className={className}
      {...props}
    >
      {children}
    </ExpoBlurView>
  );
};

// Fallback component for when blur is not available
export const FallbackBlurView: React.FC<BlurViewProps> = ({
  children,
  className,
  style,
  tint = 'default',
  ...props
}) => {
  const backgroundColor = tint === 'dark' 
    ? 'rgba(0, 0, 0, 0.3)' 
    : tint === 'light' 
    ? 'rgba(255, 255, 255, 0.3)' 
    : 'rgba(128, 128, 128, 0.3)';

  return (
    <View
      style={[{ backgroundColor }, style]}
      className={className}
      {...props}
    >
      {children}
    </View>
  );
};

export default BlurView;
