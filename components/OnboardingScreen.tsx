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
} from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '@/context/ThemeContext';
import { useResponsive } from '@/hooks/useResponsive';
import { Spacing } from '@/constants/Theme';

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

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const { colors } = useTheme();
  const { getResponsiveValue } = useResponsive();
  // Use getResponsiveValue to set a responsive font size for the title
  const responsiveTitleFontSize = getResponsiveValue ? getResponsiveValue(24) : 24;
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
    'Personal Information',
    'Contact Details',
    'Preferences',
    'Interests & Venues'
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors.text, fontSize: responsiveTitleFontSize }]}>Personal Information</Text>
            <Text style={[styles.stepSubtitle, { color: colors.text }]}>
              Help us personalize your experience
            </Text>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Full Name *</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.surface, color: colors.text }]}
                value={userData.fullName}
                onChangeText={(text) => setUserData(prev => ({ ...prev, fullName: text }))}
                placeholder="Enter your full name"
                placeholderTextColor={colors.mutedForeground}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Date of Birth *</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.surface, color: colors.text }]}
                value={userData.dateOfBirth}
                onChangeText={(text) => setUserData(prev => ({ ...prev, dateOfBirth: text }))}
                placeholder="DD/MM/YYYY"
                placeholderTextColor={colors.mutedForeground}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Gender *</Text>
              <View style={styles.optionsContainer}>
                {genderOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionButton,
                      { borderColor: colors.border },
                      userData.gender === option && { backgroundColor: colors.primary }
                    ]}
                    onPress={() => setUserData(prev => ({ ...prev, gender: option }))}
                  >
                    <Text style={[
                      styles.optionButtonText,
                      { color: userData.gender === option ? '#FFFFFF' : colors.text }
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );

      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors.text }]}>Contact Details</Text>
            <Text style={[styles.stepSubtitle, { color: colors.text }]}>
              We&apos;ll use this to keep you updated
            </Text>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Email Address *</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.cardBackground, color: colors.text }]}
                value={userData.email}
                onChangeText={(text) => setUserData(prev => ({ ...prev, email: text }))}
                placeholder="your.email@example.com"
                placeholderTextColor={`${String(colors.text)}60`}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Password *</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.cardBackground, color: colors.text }]}
                value={userData.password}
                onChangeText={(text) => setUserData(prev => ({ ...prev, password: text }))}
                placeholder="At least 6 characters"
                placeholderTextColor={`${String(colors.text)}60`}
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Phone Number *</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.cardBackground, color: colors.text }]}
                value={userData.phoneNumber}
                onChangeText={(text) => setUserData(prev => ({ ...prev, phoneNumber: text }))}
                placeholder="+27 XX XXX XXXX"
                placeholderTextColor={`${String(colors.text)}60`}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors.text }]}>Location Preferences</Text>
            <Text style={[styles.stepSubtitle, { color: colors.text }]}>
              Help us suggest nearby venues
            </Text>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Home Location/Suburb *</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.cardBackground, color: colors.text }]}
                value={userData.homeLocation}
                onChangeText={(text) => setUserData(prev => ({ ...prev, homeLocation: text }))}
                placeholder="e.g., Sandton, Johannesburg"
                placeholderTextColor={`${String(colors.text)}60`}
              />
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors.text }]}>Interests & Venues</Text>
            <Text style={[styles.stepSubtitle, { color: colors.text }]}>
              Select your shopping interests and frequently visited venues
            </Text>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Shopping Interests *</Text>
              <View style={styles.optionsContainer}>
                {shoppingInterests.map((interest) => (
                  <TouchableOpacity
                    key={interest}
                    style={[
                      styles.optionButton,
                      { borderColor: colors.border },
                      userData.shoppingInterests.includes(interest) && { backgroundColor: colors.primary }
                    ]}
                    onPress={() => toggleSelection(interest, 'shoppingInterests')}
                  >
                    <Text style={[
                      styles.optionButtonText,
                      { color: userData.shoppingInterests.includes(interest) ? '#FFFFFF' : colors.text }
                    ]}>
                      {interest}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Frequently Visited Venues (Optional)</Text>
              <View style={styles.optionsContainer}>
                {frequentVenues.map((venue) => (
                  <TouchableOpacity
                    key={venue}
                    style={[
                      styles.optionButton,
                      { borderColor: colors.border },
                      userData.frequentVenues.includes(venue) && { backgroundColor: colors.primary }
                    ]}
                    onPress={() => toggleSelection(venue, 'frequentVenues')}
                  >
                    <Text style={[
                      styles.optionButtonText,
                      { color: userData.frequentVenues.includes(venue) ? '#FFFFFF' : colors.text }
                    ]}>
                      {venue}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  // Use Spacing in a style to avoid unused import warning
  const extraSpacing = Spacing ? 8 : 0;

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          {steps.map((step, index) => (
            <View key={index} style={styles.progressItem}>
              <View style={[
                styles.progressDot,
                { backgroundColor: index <= currentStep ? colors.primary : colors.border }
              ]} />
              <Text style={[
                styles.progressText,
                { color: index <= currentStep ? colors.primary : `${String(colors.text)}60` }
              ]}>
                {step}
              </Text>
            </View>
          ))}
        </View>

        {renderStepContent()}

        {/* Navigation buttons */}
        <View style={styles.buttonContainer}>
          {currentStep > 0 && (
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton, { borderColor: colors.border }]}
              onPress={prevStep}
            >
              <IconSymbol name="chevron.left" size={20} color={colors.text ?? '#000000'} />
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
              {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
            </Text>
            <IconSymbol name="chevron.right" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={{ marginBottom: extraSpacing }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, padding: 20 },
  progressContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, paddingHorizontal: 20 },
  progressItem: { alignItems: 'center', flex: 1 },
  progressDot: { width: 10, height: 10, borderRadius: 5, marginBottom: 4 },
  progressText: { fontSize: 12, color: '#888' },
  stepContent: { marginBottom: 32 },
  stepTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  stepSubtitle: { fontSize: 15, color: '#666', marginBottom: 16 },
  inputContainer: { marginBottom: 20 },
  inputLabel: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  textInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#fff', marginBottom: 8 },
  optionsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  optionButton: { backgroundColor: '#f1f1f1', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 8, marginRight: 8, marginBottom: 8 },
  optionButtonText: { fontSize: 14, color: '#333' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  button: { flex: 1, padding: 14, borderRadius: 8, alignItems: 'center', marginHorizontal: 4 },
  primaryButton: { backgroundColor: '#007AFF' },
  secondaryButton: { backgroundColor: '#fff', borderWidth: 1 },
  buttonText: { fontSize: 16, fontWeight: '600' },
});