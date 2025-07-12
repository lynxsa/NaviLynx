import React from 'react';
import { View, ScrollView, SafeAreaView, ViewStyle, StatusBar, RefreshControlProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  variant?: 'default' | 'gradient' | 'glass';
  scrollable?: boolean;
  safeArea?: boolean;
  className?: string;
  style?: ViewStyle;
  refreshControl?: React.ReactElement<RefreshControlProps>;
  showStatusBar?: boolean;
  statusBarStyle?: 'auto' | 'light' | 'dark';
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  variant = 'default',
  scrollable = true,
  safeArea = true,
  className = '',
  style,
  refreshControl,
  showStatusBar = true,
  statusBarStyle = 'auto',
}) => {
  const { colors, isDark } = useTheme();

  const getBackgroundComponent = () => {
    const baseClasses = `flex-1 ${className}`;
    
    switch (variant) {
      case 'gradient':
        return (
          <LinearGradient
            colors={isDark 
              ? ['#1f2937', '#111827'] 
              : ['#f3f4f6', '#ffffff']
            }
            className={baseClasses}
            style={style}
          >
            {renderContent()}
          </LinearGradient>
        );
      case 'glass':
        return (
          <View className={`${baseClasses} ${isDark ? 'glass-card-dark' : 'glass-card'}`} style={style}>
            {renderContent()}
          </View>
        );
      default:
        return (
          <View 
            className={`${baseClasses} ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`} 
            style={style}
          >
            {renderContent()}
          </View>
        );
    }
  };

  const renderContent = () => {
    if (scrollable) {
      return (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          refreshControl={refreshControl}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View className="container-safe flex-1">
            {children}
          </View>
        </ScrollView>
      );
    }

    return (
      <View className="container-safe flex-1">
        {children}
      </View>
    );
  };

  const content = getBackgroundComponent();

  if (safeArea) {
    return (
      <>
        {showStatusBar && (
          <StatusBar 
            barStyle={
              statusBarStyle === 'auto' 
                ? (isDark ? 'light-content' : 'dark-content')
                : statusBarStyle === 'light' 
                  ? 'light-content' 
                  : 'dark-content'
            }
            backgroundColor={isDark ? '#111827' : '#ffffff'}
          />
        )}
        <SafeAreaView className="flex-1">
          {content}
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      {showStatusBar && (
        <StatusBar 
          barStyle={
            statusBarStyle === 'auto' 
              ? (isDark ? 'light-content' : 'dark-content')
              : statusBarStyle === 'light' 
                ? 'light-content' 
                : 'dark-content'
          }
          backgroundColor={isDark ? '#111827' : '#ffffff'}
        />
      )}
      {content}
    </>
  );
};

// Grid Layout Component
interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: ViewStyle;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns = 2,
  gap = 'md',
  className = '',
  style,
}) => {
  const getGapClasses = () => {
    switch (gap) {
      case 'sm':
        return 'gap-2';
      case 'md':
        return 'gap-4';
      case 'lg':
        return 'gap-6';
      default:
        return 'gap-4';
    }
  };

  const getColumnClasses = () => {
    switch (columns) {
      case 1:
        return 'flex-col';
      case 2:
        return 'flex-row flex-wrap';
      case 3:
        return 'flex-row flex-wrap';
      case 4:
        return 'flex-row flex-wrap';
      default:
        return 'flex-row flex-wrap';
    }
  };

  return (
    <View 
      className={`${getColumnClasses()} ${getGapClasses()} ${className}`}
      style={style}
    >
      {React.Children.map(children, (child, index) => (
        <View 
          key={index}
          className={
            columns === 1 ? 'w-full' :
            columns === 2 ? 'w-1/2' :
            columns === 3 ? 'w-1/3' :
            'w-1/4'
          }
        >
          {child}
        </View>
      ))}
    </View>
  );
};

// Responsive Spacer Component
interface ResponsiveSpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  horizontal?: boolean;
}

export const ResponsiveSpacer: React.FC<ResponsiveSpacerProps> = ({
  size = 'md',
  horizontal = false,
}) => {
  const getSizeClasses = () => {
    const dimension = horizontal ? 'w' : 'h';
    
    switch (size) {
      case 'xs':
        return `${dimension}-1`;
      case 'sm':
        return `${dimension}-2`;
      case 'md':
        return `${dimension}-4`;
      case 'lg':
        return `${dimension}-6`;
      case 'xl':
        return `${dimension}-8`;
      default:
        return `${dimension}-4`;
    }
  };

  return <View className={getSizeClasses()} />;
};
