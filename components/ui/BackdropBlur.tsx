import React from 'react';
import { View, ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';

interface BackdropBlurProps extends ViewProps {
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  children?: React.ReactNode;
  className?: string;
  backdropBlur?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

const blurIntensityMap = {
  'xs': 10,
  'sm': 20,
  'md': 30,
  'lg': 40,
  'xl': 50,
  '2xl': 60,
  '3xl': 70,
};

export const BackdropBlur: React.FC<BackdropBlurProps> = ({
  intensity,
  tint = 'default',
  children,
  className = '',
  backdropBlur = 'md',
  style,
  ...props
}) => {
  const blurIntensity = intensity || blurIntensityMap[backdropBlur];

  return (
    <View className={className} style={style} {...props}>
      <BlurView
        intensity={blurIntensity}
        tint={tint}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <View style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </View>
    </View>
  );
};

export default BackdropBlur;
