import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeSafe } from '@/context/ThemeContext';
import modernTheme from '@/styles/modernTheme';

const { width, height } = Dimensions.get('window');
const { spacing } = modernTheme;

interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  image: string;
  gradient: string[];
}

interface ModernOnboardingScreenProps {
  onComplete: () => void;
}

const onboardingSlides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Welcome to NaviLynx',
    subtitle: 'Your AI Navigation Companion',
    description: 'Navigate South African venues like never before with intelligent indoor mapping, real-time directions, and personalized recommendations.',
    icon: 'location.fill',
    image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=300&fit=crop',
    gradient: ['#8B5CF6', '#A78BFA'],
  },
  {
    id: '2',
    title: 'Smart Indoor Navigation',
    subtitle: 'Never Get Lost Again',
    description: 'Our advanced AR technology guides you through malls, airports, hospitals, and universities with precise step-by-step directions.',
    icon: 'map.fill',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
    gradient: ['#06B6D4', '#0891B2'],
  },
  {
    id: '3',
    title: 'Discover South Africa',
    subtitle: 'Explore Local Venues',
    description: 'From Sandton City to Gateway Theatre, discover the best shopping, dining, and entertainment venues across South Africa.',
    icon: 'building.2.fill',
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=400&h=300&fit=crop',
    gradient: ['#10B981', '#059669'],
  },
  {
    id: '4',
    title: 'AI-Powered Assistance',
    subtitle: 'Your Personal Concierge',
    description: 'Get real-time help, find parking, discover deals, and receive personalized recommendations tailored to your preferences.',
    icon: 'brain.head.profile',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
    gradient: ['#F59E0B', '#EAB308'],
  },
];

export default function ModernOnboardingScreen({ onComplete }: ModernOnboardingScreenProps) {
  const { colors, isDark } = useThemeSafe();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleNext = () => {
    if (currentIndex < onboardingSlides.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      scrollViewRef.current?.scrollTo({
        x: prevIndex * width,
        animated: true,
      });
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const renderSlide = (slide: OnboardingSlide, index: number) => (
    <View key={slide.id} style={styles.slide}>
      <LinearGradient
        colors={slide.gradient as [string, string]}
        style={styles.slideGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Image Section */}
        <View style={styles.imageContainer}>
          <View style={[styles.iconContainer, { backgroundColor: colors.background + '20' }]}>
            <IconSymbol name={slide.icon as any} size={60} color={colors.background} />
          </View>
          <Image 
            source={{ uri: slide.image }} 
            style={styles.slideImage}
            resizeMode="cover"
          />
        </View>

        {/* Content Section */}
        <View style={[styles.contentContainer, { backgroundColor: colors.background }]}>
          <View style={styles.textContent}>
            <Text style={[styles.slideTitle, { color: colors.text }]}>
              {slide.title}
            </Text>
            <Text style={[styles.slideSubtitle, { color: colors.primary }]}>
              {slide.subtitle}
            </Text>
            <Text style={[styles.slideDescription, { color: colors.textSecondary }]}>
              {slide.description}
            </Text>
          </View>

          {/* Progress Indicators */}
          <View style={styles.progressContainer}>
            {onboardingSlides.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.progressDot,
                  {
                    backgroundColor: i === currentIndex ? colors.primary : colors.border,
                    width: i === currentIndex ? 24 : 8,
                  },
                ]}
              />
            ))}
          </View>

          {/* Navigation Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.skipButton, { backgroundColor: colors.surface }]}
              onPress={handleSkip}
            >
              <Text style={[styles.skipText, { color: colors.textSecondary }]}>
                Skip
              </Text>
            </TouchableOpacity>

            <View style={styles.navigationButtons}>
              {currentIndex > 0 && (
                <TouchableOpacity
                  style={[styles.navButton, { backgroundColor: colors.surface }]}
                  onPress={handlePrevious}
                >
                  <IconSymbol name="chevron.left" size={24} color={colors.text} />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.nextButton, { backgroundColor: colors.primary }]}
                onPress={handleNext}
              >
                <Text style={[styles.nextText, { color: colors.background }]}>
                  {currentIndex === onboardingSlides.length - 1 ? 'Get Started' : 'Next'}
                </Text>
                <IconSymbol 
                  name={currentIndex === onboardingSlides.length - 1 ? 'checkmark' : 'chevron.right'} 
                  size={20} 
                  color={colors.background} 
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(event) => {
          const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(slideIndex);
        }}
      >
        {onboardingSlides.map((slide, index) => renderSlide(slide, index))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width,
    height,
  },
  slideGradient: {
    flex: 1,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['2xl'],
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  slideImage: {
    width: width * 0.8,
    height: height * 0.25,
    borderRadius: 16,
  },
  contentContainer: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    justifyContent: 'space-between',
  },
  textContent: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  slideSubtitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  slideDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing.sm,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
    marginVertical: spacing.lg,
  },
  progressDot: {
    height: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 8,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 24,
    gap: spacing.xs,
  },
  nextText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
