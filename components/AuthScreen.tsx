import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  ActivityIndicator,
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
      className="flex-1" 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#9333ea', '#7c3aed']}
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 32 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="items-center mb-8 pt-8">
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=120&h=120&fit=crop&crop=center' }}
              className="w-20 h-20 rounded-2xl mb-6"
              resizeMode="contain"
            />
            <Text className="text-3xl font-bold mb-4 text-center text-white">
              {isLogin ? 'Welcome Back' : 'Join NaviLynx'}
            </Text>
            <Text className="text-lg text-center leading-6 text-white/70">
              {isLogin 
                ? 'Sign in to continue your navigation journey'
                : 'Create your account and start exploring'
              }
            </Text>
          </View>

          {/* Form Card */}
          <View className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-lg">
            {/* Toggle Buttons */}
            <View className="flex-row bg-gray-100 dark:bg-gray-800 rounded-2xl p-1 mb-6">
              <TouchableOpacity
                className={`flex-1 py-3 rounded-xl items-center ${isLogin ? 'bg-purple-600' : ''}`}
                onPress={() => setIsLogin(true)}
              >
                <Text className={`text-base font-semibold ${isLogin ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                  Sign In
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-3 rounded-xl items-center ${!isLogin ? 'bg-purple-600' : ''}`}
                onPress={() => setIsLogin(false)}
              >
                <Text className={`text-base font-semibold ${!isLogin ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <View className="gap-5">
              {!isLogin && (
                <>
                  <View className="gap-2">
                    <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                      Full Name
                    </Text>
                    <TextInput
                      className={`border rounded-xl px-3 py-3 text-base bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white ${errors.fullName ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}
                      placeholder="Enter your full name"
                      placeholderTextColor="#9CA3AF"
                      value={formData.fullName}
                      onChangeText={(value) => handleInputChange('fullName', value)}
                      autoCapitalize="words"
                    />
                    {errors.fullName && (
                      <Text className="text-sm text-red-500 mt-1">
                        {errors.fullName}
                      </Text>
                    )}
                  </View>

                  <View className="gap-2">
                    <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                      Username
                    </Text>
                    <TextInput
                      className={`border rounded-xl px-3 py-3 text-base bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white ${errors.username ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}
                      placeholder="Choose a username"
                      placeholderTextColor="#9CA3AF"
                      value={formData.username}
                      onChangeText={(value) => handleInputChange('username', value)}
                      autoCapitalize="none"
                    />
                    {errors.username && (
                      <Text className="text-sm text-red-500 mt-1">
                        {errors.username}
                      </Text>
                    )}
                  </View>
                </>
              )}

              <View className="gap-2">
                <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                  Email
                </Text>
                <TextInput
                  className={`border rounded-xl px-3 py-3 text-base bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white ${errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {errors.email && (
                  <Text className="text-sm text-red-500 mt-1">
                    {errors.email}
                  </Text>
                )}
              </View>

              <View className="gap-2">
                <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                  Password
                </Text>
                <View className={`flex-row items-center border rounded-xl px-3 bg-gray-50 dark:bg-gray-800 ${errors.password ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}>
                  <TextInput
                    className="flex-1 py-3 text-base text-gray-900 dark:text-white"
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    value={formData.password}
                    onChangeText={(value) => handleInputChange('password', value)}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity 
                    className="p-1"
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <IconSymbol 
                      name={showPassword ? 'eye.slash' : 'eye'} 
                      size={20} 
                      color="#9CA3AF" 
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <Text className="text-sm text-red-500 mt-1">
                    {errors.password}
                  </Text>
                )}
              </View>

              {!isLogin && (
                <>
                  <View className="gap-2">
                    <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                      Confirm Password
                    </Text>
                    <TextInput
                      className={`border rounded-xl px-3 py-3 text-base bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}
                      placeholder="Confirm your password"
                      placeholderTextColor="#9CA3AF"
                      value={formData.confirmPassword}
                      onChangeText={(value) => handleInputChange('confirmPassword', value)}
                      secureTextEntry={!showPassword}
                    />
                    {errors.confirmPassword && (
                      <Text className="text-sm text-red-500 mt-1">
                        {errors.confirmPassword}
                      </Text>
                    )}
                  </View>

                  <View className="gap-2">
                    <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                      Address
                    </Text>
                    <TextInput
                      className={`border rounded-xl px-3 py-3 text-base bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white ${errors.address ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}
                      placeholder="Enter your address"
                      placeholderTextColor="#9CA3AF"
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
              className="flex-row items-center justify-center py-2 px-3 rounded-xl mt-5 gap-1 bg-purple-100 dark:bg-purple-900/30"
              onPress={fillDummyData}
            >
              <IconSymbol name="wand.and.stars" size={16} color="#9333ea" />
              <Text className="text-sm font-medium text-purple-600 dark:text-purple-400">
                Fill Demo Data
              </Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity
              className="flex-row items-center justify-center py-5 rounded-xl mt-6 gap-2 bg-purple-600 shadow-lg"
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text className="text-white text-lg font-semibold">
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </Text>
                  <IconSymbol name="arrow.right" size={20} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>

            {/* Toggle Auth Mode */}
            <TouchableOpacity className="items-center mt-5 py-3" onPress={toggleAuthMode}>
              <Text className="text-base text-gray-600 dark:text-gray-400">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <Text className="text-purple-600 font-semibold">
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
