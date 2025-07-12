import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import { SplashScreenComponent } from '@/components/SplashScreenComponent';
import AuthScreen from '@/components/AuthScreen';
import ModernOnboardingScreen from '@/components/ModernOnboardingScreen';
import { useAuth } from '@/context/AuthContext';
import { performanceOptimizationService } from '@/services/performanceOptimizationService';
import { hasCompletedOnboarding, setOnboardingComplete, isNewSignup } from '@/utils/onboarding';

export default function EntryScreen() {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  // Load custom fonts
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Initialize performance monitoring
  useEffect(() => {
    performanceOptimizationService.startPerformanceMonitoring();
    performanceOptimizationService.optimizeApp();
    return () => {
      const metrics = performanceOptimizationService.stopPerformanceMonitoring();
      console.log('App session performance metrics:', metrics);
    };
  }, []);

  // After splash, check onboarding status for authenticated users
  useEffect(() => {
    if (!showSplash && user) {
      (async () => {
        const onboarded = await hasCompletedOnboarding();
        const isSignup = await isNewSignup();
        
        // Only show onboarding for new signups who haven't completed it
        setShowOnboarding(isSignup && !onboarded);
        
        if (onboarded || !isSignup) {
          router.replace('/(tabs)');
        }
      })();
    }
  }, [showSplash, user]);

  // If fonts are not yet loaded, render nothing (or a loading indicator)
  if (!loaded) {
    return null;
  }

  // Show a custom splash screen component until its animation completes
  if (showSplash) {
    return (
      <SplashScreenComponent onAnimationComplete={() => setShowSplash(false)} />
    );
  }

  // Show onboarding for new users after signup or first login
  if (showOnboarding && user) {
    return (
      <ModernOnboardingScreen
        onComplete={async () => {
          await setOnboardingComplete();
          setShowOnboarding(false);
          router.replace('/(tabs)');
        }}
      />
    );
  }

  // Show auth screen if not authenticated
  if (!user && !loading) {
    return <AuthScreen />;
  }

  // Fallback (should never render)
  return null;
}
