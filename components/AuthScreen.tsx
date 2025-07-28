import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  ActivityIndicator,
  Button,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeSafe } from '@/context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface FormData {
  fullName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  address: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  address?: string;
}

export default function AuthScreen() {
  const { colors } = useThemeSafe();
  const { signIn, signUp, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    address: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (isLogin) {
      // Login validation - use email for login
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required for login';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 3) {
        newErrors.password = 'Password must be at least 3 characters';
      }
    } else {
      // Signup validation
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
      if (!formData.username.trim()) {
        newErrors.username = 'Username is required';
      } else if (formData.username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
      }
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      if (isLogin) {
        const success = await signIn(formData.email, formData.password);
        if (success) {
          Alert.alert('Welcome Back!', `Hello, welcome back to NaviLynx!`);
        } else {
          Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
        }
      } else {
        const success = await signUp(formData.email, formData.password, formData.fullName);
        if (success) {
          Alert.alert('Welcome to NaviLynx!', `Your account has been created successfully!`);
        } else {
          Alert.alert('Signup Failed', 'Email already exists or signup failed. Please try again.');
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const fillDummyData = () => {
    if (isLogin) {
      setFormData(prev => ({
        ...prev,
        email: 'demo@navilynx.com',
        password: 'demo123',
      }));
    } else {
      setFormData({
        fullName: 'Derah Manyelo',
        email: 'test@example.com',
        username: 'derah123',
        password: 'test123',
        confirmPassword: 'test123',
        address: 'Linden Street, Sandown, Sandton, Johannesburg 2196',
      });
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      fullName: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      address: '',
    });
    setErrors({});
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Image
              source={{ uri: 'https://picsum.photos/120/120?random=logo' }}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={[styles.title, { color: '#FFFFFF' }]}>
              {isLogin ? 'Welcome Back' : 'Join NaviLynx'}
            </Text>
            <Text style={[styles.subtitle, { color: '#FFFFFF90' }]}>
              {isLogin 
                ? 'Sign in to continue your navigation journey'
                : 'Create your account and start exploring'
              }
            </Text>
          </View>

          {/* Form Card */}
          <View style={[styles.formCard, { backgroundColor: colors.surface }]}>
            {/* Toggle Buttons */}
            <View style={[styles.toggleContainer, { backgroundColor: colors.background }]}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  isLogin && { backgroundColor: colors.primary },
                ]}
                onPress={() => setIsLogin(true)}
              >
                <Text style={[
                  styles.toggleText,
                  { color: isLogin ? '#FFFFFF' : colors.mutedForeground }
                ]}>
                  Sign In
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  !isLogin && { backgroundColor: colors.primary },
                ]}
                onPress={() => setIsLogin(false)}
              >
                <Text style={[
                  styles.toggleText,
                  { color: !isLogin ? '#FFFFFF' : colors.mutedForeground }
                ]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <View style={styles.formFields}>
              {!isLogin && (
                <>
                  <View style={styles.inputContainer}>
                    <Text style={[styles.inputLabel, { color: colors.text }]}>
                      Full Name
                    </Text>
                    <TextInput
                      style={[
                        styles.input,
                        { 
                          backgroundColor: colors.background,
                          borderColor: errors.fullName ? colors.error : colors.border,
                          color: colors.text,
                        }
                      ]}
                      placeholder="Enter your full name"
                      placeholderTextColor={colors.mutedForeground}
                      value={formData.fullName}
                      onChangeText={(value) => handleInputChange('fullName', value)}
                      autoCapitalize="words"
                    />
                    {errors.fullName && (
                      <Text style={[styles.errorText, { color: colors.error }]}>
                        {errors.fullName}
                      </Text>
                    )}
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={[styles.inputLabel, { color: colors.text }]}>
                      Email
                    </Text>
                    <TextInput
                      style={[
                        styles.input,
                        { 
                          backgroundColor: colors.background,
                          borderColor: errors.email ? colors.error : colors.border,
                          color: colors.text,
                        }
                      ]}
                      placeholder="Enter your email"
                      placeholderTextColor={colors.mutedForeground}
                      value={formData.email}
                      onChangeText={(value) => handleInputChange('email', value)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                    {errors.email && (
                      <Text style={[styles.errorText, { color: colors.error }]}>
                        {errors.email}
                      </Text>
                    )}
                  </View>
                </>
              )}

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  Username
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: colors.background,
                      borderColor: errors.username ? colors.error : colors.border,
                      color: colors.text,
                    }
                  ]}
                  placeholder="Enter your username"
                  placeholderTextColor={colors.mutedForeground}
                  value={formData.username}
                  onChangeText={(value) => handleInputChange('username', value)}
                  autoCapitalize="none"
                />
                {errors.username && (
                  <Text style={[styles.errorText, { color: colors.error }]}>
                    {errors.username}
                  </Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  Password
                </Text>
                <View style={[
                  styles.passwordContainer,
                  { 
                    backgroundColor: colors.background,
                    borderColor: errors.password ? colors.error : colors.border,
                  }
                ]}>
                  <TextInput
                    style={[styles.passwordInput, { color: colors.text }]}
                    placeholder="Enter your password"
                    placeholderTextColor={colors.mutedForeground}
                    value={formData.password}
                    onChangeText={(value) => handleInputChange('password', value)}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <IconSymbol
                      name={showPassword ? 'eye.slash' : 'eye'}
                      size={20}
                      color={colors.mutedForeground}
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <Text style={[styles.errorText, { color: colors.error }]}>
                    {errors.password}
                  </Text>
                )}
              </View>

              {!isLogin && (
                <>
                  <View style={styles.inputContainer}>
                    <Text style={[styles.inputLabel, { color: colors.text }]}>
                      Confirm Password
                    </Text>
                    <TextInput
                      style={[
                        styles.input,
                        { 
                          backgroundColor: colors.background,
                          borderColor: errors.confirmPassword ? colors.error : colors.border,
                          color: colors.text,
                        }
                      ]}
                      placeholder="Confirm your password"
                      placeholderTextColor={colors.mutedForeground}
                      value={formData.confirmPassword}
                      onChangeText={(value) => handleInputChange('confirmPassword', value)}
                      secureTextEntry={true}
                    />
                    {errors.confirmPassword && (
                      <Text style={[styles.errorText, { color: colors.error }]}>
                        {errors.confirmPassword}
                      </Text>
                    )}
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={[styles.inputLabel, { color: colors.text }]}>
                      Address (Optional)
                    </Text>
                    <TextInput
                      style={[
                        styles.input,
                        { 
                          backgroundColor: colors.background,
                          borderColor: colors.border,
                          color: colors.text,
                        }
                      ]}
                      placeholder="Enter your address"
                      placeholderTextColor={colors.mutedForeground}
                      value={formData.address}
                      onChangeText={(value) => handleInputChange('address', value)}
                      multiline
                      numberOfLines={2}
                    />
                  </View>
                </>
              )}
            </View>

            {/* Demo Data Button */}
            <TouchableOpacity
              style={[styles.demoButton, { backgroundColor: colors.accent + '20' }]}
              onPress={fillDummyData}
            >
              <IconSymbol name="wand.and.stars" size={16} color={colors.accent} />
              <Text style={[styles.demoButtonText, { color: colors.accent }]}>
                Fill Demo Data
              </Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: colors.primary }]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.submitButtonText}>
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </Text>
                  <IconSymbol name="arrow.right" size={20} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>

            {/* Demo Login Helper */}
            <TouchableOpacity 
              style={[styles.demoButton, { backgroundColor: colors.muted }]} 
              onPress={fillDummyData}
            >
              <Text style={[styles.demoButtonText, { color: colors.mutedForeground }]}>
                Fill Demo Data
              </Text>
            </TouchableOpacity>

            {/* Toggle Auth Mode */}
            <TouchableOpacity style={styles.switchModeButton} onPress={toggleAuthMode}>
              <Text style={[styles.switchModeText, { color: colors.mutedForeground }]}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <Text style={{ color: colors.primary, fontWeight: '600' }}>
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 32,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 24,
  },
  formCard: {
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: "600",
  },
  formFields: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  eyeButton: {
    padding: 4,
  },
  errorText: {
    fontSize: 14,
    marginTop: 4,
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 20,
    gap: 4,
  },
  demoButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderRadius: 12,
    marginTop: 24,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: "600",
  },
  demoButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  demoButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  switchModeButton: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 12,
  },
  switchModeText: {
    fontSize: 16,
  },
});
