import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '@/context/ThemeContext';
import GlassCard from '@/components/GlassCard';

interface UserSignupData {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  homeLocation: string;
  shoppingInterests: string[];
  frequentVenues: string[];
}

interface OnboardingScreenProps {
  onComplete: (userData: UserSignupData) => void;
}

const shoppingInterests = [
  'Fashion', 'Food & Dining', 'Electronics', 'Books & Stationery',
  'Health & Beauty', 'Home & Garden', 'Sports & Fitness', 'Entertainment'
];

const frequentVenues = [
  'Sandton City', 'Rosebank Mall', 'Menlyn Park', 'Gateway Theatre',
  'Mall of Africa', 'OR Tambo Airport', 'Cape Town International',
  'Netcare Milpark', 'University of Witwatersrand'
];

const genderOptions = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

export default function OnboardingScreenEnhanced({ onComplete }: OnboardingScreenProps) {
  const { colors, isDark } = useTheme();
  const { width } = Dimensions.get('window');
  const isTablet = width > 768;
  
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState<UserSignupData>({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    homeLocation: '',
    shoppingInterests: [],
    frequentVenues: [],
  });

  const steps = [
    { title: 'Personal Info', description: 'Tell us about yourself' },
    { title: 'Contact Details', description: 'How can we reach you?' },
    { title: 'Location', description: 'Where are you based?' },
    { title: 'Preferences', description: 'What interests you?' }
  ];

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 0:
        return userData.fullName.trim() !== '' && userData.dateOfBirth.trim() !== '' && userData.gender !== '';
      case 1:
        return userData.email.trim() !== '' && userData.password.length >= 6 && userData.phoneNumber.trim() !== '';
      case 2:
        return userData.homeLocation.trim() !== '';
      case 3:
        return userData.shoppingInterests.length > 0;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (!validateCurrentStep()) {
      Alert.alert('Incomplete Information', 'Please fill in all required fields before proceeding.');
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(userData);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleSelection = (item: string, field: 'shoppingInterests' | 'frequentVenues') => {
    setUserData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  const renderProgressIndicator = () => (
    <View style={styles.progressContainer}>
      <View style={[
        styles.progressBar,
        { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }
      ]}>
        <View 
          style={[
            styles.progressFill,
            { 
              width: `${((currentStep + 1) / steps.length) * 100}%`,
              backgroundColor: colors.primary 
            }
          ]} 
        />
      </View>
      <Text style={[styles.progressText, { color: colors.mutedForeground }]}>
        Step {currentStep + 1} of {steps.length}
      </Text>
    </View>
  );

  const renderStepContent = () => {
    const containerStyle = isTablet ? styles.tabletContainer : styles.mobileContainer;
    
    switch (currentStep) {
      case 0:
        return (
          <View style={containerStyle}>
            <View style={styles.stepHeader}>
              <Text style={[styles.stepTitle, { color: colors.text }]}>
                {steps[currentStep].title}
              </Text>
              <Text style={[styles.stepDescription, { color: colors.mutedForeground }]}>
                {steps[currentStep].description}
              </Text>
            </View>

            <GlassCard variant="elevated" style={styles.inputCard}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Full Name *</Text>
              <TextInput
                style={[styles.modernInput, { 
                  backgroundColor: colors.surface, 
                  color: colors.text,
                  borderColor: colors.border 
                }]}
                value={userData.fullName}
                onChangeText={(text) => setUserData(prev => ({ ...prev, fullName: text }))}
                placeholder="Enter your full name"
                placeholderTextColor={colors.mutedForeground}
              />
            </GlassCard>

            <GlassCard variant="elevated" style={styles.inputCard}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Date of Birth *</Text>
              <TextInput
                style={[styles.modernInput, { 
                  backgroundColor: colors.surface, 
                  color: colors.text,
                  borderColor: colors.border 
                }]}
                value={userData.dateOfBirth}
                onChangeText={(text) => setUserData(prev => ({ ...prev, dateOfBirth: text }))}
                placeholder="DD/MM/YYYY"
                placeholderTextColor={colors.mutedForeground}
              />
            </GlassCard>

            <GlassCard variant="elevated" style={styles.inputCard}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Gender *</Text>
              <View style={styles.optionsGrid}>
                {genderOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.modernOptionButton,
                      { 
                        borderColor: colors.border,
                        backgroundColor: userData.gender === option ? colors.primary : colors.surface
                      }
                    ]}
                    onPress={() => setUserData(prev => ({ ...prev, gender: option }))}
                  >
                    <Text style={[
                      styles.optionText,
                      { color: userData.gender === option ? '#FFFFFF' : colors.text }
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </GlassCard>
          </View>
        );

      case 1:
        return (
          <View style={containerStyle}>
            <View style={styles.stepHeader}>
              <Text style={[styles.stepTitle, { color: colors.text }]}>
                {steps[currentStep].title}
              </Text>
              <Text style={[styles.stepDescription, { color: colors.mutedForeground }]}>
                {steps[currentStep].description}
              </Text>
            </View>

            <GlassCard variant="elevated" style={styles.inputCard}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Email Address *</Text>
              <TextInput
                style={[styles.modernInput, { 
                  backgroundColor: colors.surface, 
                  color: colors.text,
                  borderColor: colors.border 
                }]}
                value={userData.email}
                onChangeText={(text) => setUserData(prev => ({ ...prev, email: text }))}
                placeholder="your.email@example.com"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </GlassCard>

            <GlassCard variant="elevated" style={styles.inputCard}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Password *</Text>
              <TextInput
                style={[styles.modernInput, { 
                  backgroundColor: colors.surface, 
                  color: colors.text,
                  borderColor: colors.border 
                }]}
                value={userData.password}
                onChangeText={(text) => setUserData(prev => ({ ...prev, password: text }))}
                placeholder="At least 6 characters"
                placeholderTextColor={colors.mutedForeground}
                secureTextEntry
              />
            </GlassCard>

            <GlassCard variant="elevated" style={styles.inputCard}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Phone Number *</Text>
              <TextInput
                style={[styles.modernInput, { 
                  backgroundColor: colors.surface, 
                  color: colors.text,
                  borderColor: colors.border 
                }]}
                value={userData.phoneNumber}
                onChangeText={(text) => setUserData(prev => ({ ...prev, phoneNumber: text }))}
                placeholder="+27 XX XXX XXXX"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="phone-pad"
              />
            </GlassCard>
          </View>
        );

      case 2:
        return (
          <View style={containerStyle}>
            <View style={styles.stepHeader}>
              <Text style={[styles.stepTitle, { color: colors.text }]}>
                {steps[currentStep].title}
              </Text>
              <Text style={[styles.stepDescription, { color: colors.mutedForeground }]}>
                {steps[currentStep].description}
              </Text>
            </View>

            <GlassCard variant="elevated" style={styles.inputCard}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Home Location/Suburb *</Text>
              <TextInput
                style={[styles.modernInput, { 
                  backgroundColor: colors.surface, 
                  color: colors.text,
                  borderColor: colors.border 
                }]}
                value={userData.homeLocation}
                onChangeText={(text) => setUserData(prev => ({ ...prev, homeLocation: text }))}
                placeholder="e.g., Sandton, Johannesburg"
                placeholderTextColor={colors.mutedForeground}
              />
            </GlassCard>
          </View>
        );

      case 3:
        return (
          <View style={containerStyle}>
            <View style={styles.stepHeader}>
              <Text style={[styles.stepTitle, { color: colors.text }]}>
                {steps[currentStep].title}
              </Text>
              <Text style={[styles.stepDescription, { color: colors.mutedForeground }]}>
                {steps[currentStep].description}
              </Text>
            </View>

            <GlassCard variant="elevated" style={styles.inputCard}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Shopping Interests *</Text>
              <View style={styles.tagsContainer}>
                {shoppingInterests.map((interest) => (
                  <TouchableOpacity
                    key={interest}
                    style={[
                      styles.tagButton,
                      { 
                        borderColor: colors.border,
                        backgroundColor: userData.shoppingInterests.includes(interest) 
                          ? colors.primary 
                          : colors.surface
                      }
                    ]}
                    onPress={() => toggleSelection(interest, 'shoppingInterests')}
                  >
                    <Text style={[
                      styles.tagText,
                      { 
                        color: userData.shoppingInterests.includes(interest) 
                          ? '#FFFFFF' 
                          : colors.text 
                      }
                    ]}>
                      {interest}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </GlassCard>

            <GlassCard variant="elevated" style={styles.inputCard}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Frequently Visited Venues</Text>
              <Text style={[styles.optionalLabel, { color: colors.mutedForeground }]}>
                (Optional - Select venues you visit often)
              </Text>
              <View style={styles.tagsContainer}>
                {frequentVenues.map((venue) => (
                  <TouchableOpacity
                    key={venue}
                    style={[
                      styles.tagButton,
                      { 
                        borderColor: colors.border,
                        backgroundColor: userData.frequentVenues.includes(venue) 
                          ? colors.secondary 
                          : colors.surface
                      }
                    ]}
                    onPress={() => toggleSelection(venue, 'frequentVenues')}
                  >
                    <Text style={[
                      styles.tagText,
                      { 
                        color: userData.frequentVenues.includes(venue) 
                          ? '#FFFFFF' 
                          : colors.text 
                      }
                    ]}>
                      {venue}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </GlassCard>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderProgressIndicator()}
        {renderStepContent()}
        
        {/* Navigation buttons */}
        <View style={styles.buttonContainer}>
          {currentStep > 0 && (
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton, { 
                borderColor: colors.border,
                backgroundColor: colors.surface 
              }]}
              onPress={prevStep}
            >
              <IconSymbol name="chevron.left" size={20} color={colors.text} />
              <Text style={[styles.buttonText, { color: colors.text }]}>Back</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.button,
              styles.primaryButton,
              { backgroundColor: colors.primary },
              !validateCurrentStep() && { opacity: 0.5 }
            ]}
            onPress={nextStep}
            disabled={!validateCurrentStep()}
          >
            <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
              {currentStep === steps.length - 1 ? 'Complete Setup' : 'Continue'}
            </Text>
            <IconSymbol name="chevron.right" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  mobileContainer: {
    flex: 1,
  },
  tabletContainer: {
    flex: 1,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  progressContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "500",
  },
  stepHeader: {
    marginBottom: 24,
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 36,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 24,
  },
  inputCard: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  optionalLabel: {
    fontSize: 14,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  modernInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    minHeight: 50,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modernOptionButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 14,
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 32,
    paddingBottom: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
    flex: 1,
    minHeight: 50,
  },
  primaryButton: {
    // backgroundColor set dynamically
  },
  secondaryButton: {
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
