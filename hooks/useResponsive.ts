import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';
import { Breakpoints, getResponsiveValue } from '@/constants/Theme';

interface WindowDimensions {
  width: number;
  height: number;
}

interface ResponsiveUtils {
  width: number;
  height: number;
  isSmall: boolean;
  isMedium: boolean;
  isLarge: boolean;
  isXLarge: boolean;
  isTablet: boolean;
  orientation: 'portrait' | 'landscape';
  getResponsiveValue: (value: number | { [key: string]: number }) => number;
}

export function useResponsive(): ResponsiveUtils {
  const [dimensions, setDimensions] = useState<WindowDimensions>(() => {
    const { width, height } = Dimensions.get('window');
    return { width, height };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }: { window: ScaledSize }) => {
      setDimensions({ width: window.width, height: window.height });
    });

    return () => subscription?.remove();
  }, []);

  const { width, height } = dimensions;

  return {
    width,
    height,
    isSmall: width < Breakpoints.sm,
    isMedium: width >= Breakpoints.sm && width < Breakpoints.md,
    isLarge: width >= Breakpoints.md && width < Breakpoints.lg,
    isXLarge: width >= Breakpoints.lg,
    isTablet: width >= Breakpoints.md,
    orientation: width > height ? 'landscape' : 'portrait',
    getResponsiveValue: (value) => getResponsiveValue(value, width),
  };
}

export function useBreakpoint() {
  const { width } = useResponsive();
  
  return {
    sm: width >= Breakpoints.sm,
    md: width >= Breakpoints.md,
    lg: width >= Breakpoints.lg,
    xl: width >= Breakpoints.xl,
  };
}
