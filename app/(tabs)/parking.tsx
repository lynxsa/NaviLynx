import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { BlurView } from '@/components/ui/BlurView';
import { SingleAdBanner } from '@/components/ads/AdBannerSlider';
import { advertisements } from '@/data/southAfricanVenues';
import { colors, spacing, borderRadius, shadows } from '@/styles/modernTheme';

// Real images data
import realImages from '@/assets/data/realImages.json';

interface ParkingSpot {
  id: string;
  location: string;
  level: string;
  section: string;
  timestamp: Date;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  photo?: string;
}

interface ParkingTimer {
  isActive: boolean;
  startTime: Date | null;
  duration: number; // in minutes
  cost: number;
}

export default function ParkingScreen() {
  const { isDark } = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [savedSpot, setSavedSpot] = useState<ParkingSpot | null>(null);
  const [timer, setTimer] = useState<ParkingTimer>({
    isActive: false,
    startTime: null,
    duration: 0,
    cost: 0,
  });
  const [elapsedTime, setElapsedTime] = useState('00:00:00');

  // Update timer every second
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timer.isActive && timer.startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - timer.startTime!.getTime()) / 1000);
        const hours = Math.floor(elapsed / 3600);
        const minutes = Math.floor((elapsed % 3600) / 60);
        const seconds = elapsed % 60;
        
        setElapsedTime(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
        
        // Calculate cost (R5 per hour)
        const hoursElapsed = elapsed / 3600;
        const cost = Math.ceil(hoursElapsed * 5);
        setTimer(prev => ({ ...prev, cost }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer.isActive, timer.startTime]);

  const saveCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to save your parking spot.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const newSpot: ParkingSpot = {
        id: Date.now().toString(),
        location: 'Sandton City',
        level: 'Level 2',
        section: 'Section B',
        timestamp: new Date(),
        coordinates: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      };

      setSavedSpot(newSpot);
      Alert.alert('Success', 'Parking spot saved successfully!');
    } catch {
      Alert.alert('Error', 'Failed to save parking location.');
    }
  };

  const startTimer = () => {
    setTimer({
      isActive: true,
      startTime: new Date(),
      duration: 0,
      cost: 0,
    });
  };

  const stopTimer = () => {
    setTimer({
      isActive: false,
      startTime: null,
      duration: 0,
      cost: 0,
    });
    setElapsedTime('00:00:00');
  };

  const takeParkingPhoto = () => {
    if (!permission?.granted) {
      requestPermission();
      return;
    }
    setShowCamera(true);
  };

  const findMyCar = () => {
    if (savedSpot) {
      Alert.alert(
        'Navigate to Car',
        `Your car is parked at ${savedSpot.location}, ${savedSpot.level}, ${savedSpot.section}`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Navigate', onPress: () => console.log('Navigate to car') },
        ]
      );
    } else {
      Alert.alert('No Saved Location', 'Please save your parking location first.');
    }
  };

  if (showCamera && permission?.granted) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <CameraView style={{ flex: 1 }}>
          <View className="absolute top-12 left-6 right-6 flex-row justify-between items-center">
            <TouchableOpacity
              onPress={() => setShowCamera(false)}
              className="btn-fab w-12 h-12"
              activeOpacity={0.8}
            >
              <IconSymbol name="xmark" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <BlurView className="rounded-2xl px-4 py-2" tint="dark" intensity={80}>
              <Text className="text-white font-semibold text-center">Position your car in frame</Text>
            </BlurView>
            <View style={{ width: 48 }} />
          </View>

          <TouchableOpacity
            className="absolute bottom-12 self-center w-20 h-20 rounded-full border-4 border-white items-center justify-center shadow-2xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}
            onPress={() => {
              setShowCamera(false);
              Alert.alert('Photo Saved', 'Parking photo has been saved with location data!');
            }}
            activeOpacity={0.8}
          >
            <View className="w-14 h-14 rounded-full bg-white" />
          </TouchableOpacity>
        </CameraView>
      </SafeAreaView>
    );
  }

  return (
    <View style={[{ backgroundColor: isDark ? colors.gray[900] : '#FFFFFF', flex: 1 }]}>
      <StatusBar 
        barStyle={isDark ? "light-content" : "dark-content"} 
        backgroundColor="transparent"
        translucent
      />
      
      {/* Header with Logo and Icons */}
      <View style={{ 
        paddingHorizontal: spacing.lg, 
        paddingTop: spacing.xl + 8, 
        paddingBottom: spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
        borderBottomWidth: 1,
        borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
      }}>
        {/* Logo with NaviLynx Text */}
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <Image 
            source={
              isDark 
                ? require('@/assets/images/logo-w.png')
                : require('@/assets/images/logo-p.png')
            }
            style={{
              width: 28,
              height: 28,
              resizeMode: 'contain',
              marginRight: spacing.sm,
            }}
          />
          <Text style={{
            fontSize: 18,
            fontWeight: '700',
            color: isDark ? '#FFFFFF' : colors.text,
            letterSpacing: 0.5,
          }}>
            Smart Parking
          </Text>
        </View>
        
        {/* Header Icons */}
        <View style={{ flexDirection: 'row', gap: spacing.xs }}>
          <TouchableOpacity 
            style={{
              backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
              borderRadius: borderRadius.xl,
              padding: spacing.sm + 2,
              borderWidth: 1,
              borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
              ...shadows.sm,
            }}
            onPress={() => Alert.alert('Refresh', 'Refreshing parking data...')}
            activeOpacity={0.7}
          >
            <IconSymbol name="arrow.clockwise" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        {/* Greeting Message */}
        <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.lg }}>
          <Text style={{
            fontSize: 16, 
            fontWeight: '600',
            letterSpacing: 0.2,
            marginBottom: 2,
            color: isDark ? '#FFFFFF' : colors.text,
          }}>
            Smart Parking Assistant
          </Text>
          <Text style={{
            fontSize: 12, 
            opacity: 0.6,
            fontWeight: '400',
            letterSpacing: 0.1,
            color: isDark ? '#FFFFFF' : colors.text,
          }}>
            AI-powered parking management with location tracking and timer features
          </Text>
        </View>

        {/* Enhanced Camera Preview Card */}
        <View style={{
          backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.9)',
          borderRadius: borderRadius['2xl'],
          margin: spacing.lg,
          padding: spacing.lg,
          borderWidth: 1,
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
          ...shadows.lg,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg }}>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 20,
                fontWeight: '700',
                color: isDark ? '#FFFFFF' : colors.text,
                marginBottom: 4,
              }}>
                Capture Your Spot
              </Text>
              <Text style={{
                fontSize: 14,
                color: isDark ? 'rgba(255,255,255,0.7)' : colors.textSecondary,
                fontWeight: '400',
              }}>
                Never lose your car again with AI-powered photo capture
              </Text>
            </View>
            <View style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              backgroundColor: colors.primary,
              justifyContent: 'center',
              alignItems: 'center',
              ...shadows.md,
            }}>
              <IconSymbol name="camera.fill" size={24} color="#FFFFFF" />
            </View>
          </View>
          
          <View style={{ 
            height: 220, 
            borderRadius: borderRadius['2xl'], 
            marginBottom: spacing.lg, 
            overflow: 'hidden', 
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            position: 'relative',
          }}>
            <Image 
              source={{ uri: realImages.venues.sandton_city.hero }}
              style={{ width: '100%', height: '100%', opacity: 0.4 }}
              resizeMode="cover"
            />
            
            {/* Overlay Content */}
            <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.3)',
            }}>
              <View style={{
                backgroundColor: isDark ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.95)',
                borderRadius: borderRadius['2xl'],
                padding: spacing.lg,
                alignItems: 'center',
                ...shadows.lg,
                borderWidth: 1,
                borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              }}>
                <View style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: colors.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: spacing.sm,
                  ...shadows.md,
                }}>
                  <IconSymbol name="car.fill" size={32} color="#FFFFFF" />
                </View>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  textAlign: 'center',
                  color: colors.text,
                  marginBottom: spacing.xs,
                }}>
                  Smart Photo Capture
                </Text>
                <Text style={{
                  fontSize: 13,
                  textAlign: 'center',
                  color: colors.textSecondary,
                  lineHeight: 18,
                }}>
                  Take a photo with location data{'\n'}to remember your parking spot
                </Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity
            onPress={takeParkingPhoto}
            style={{
              backgroundColor: colors.primary,
              borderRadius: borderRadius.xl,
              paddingVertical: spacing.md + 2,
              paddingHorizontal: spacing.lg,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              ...shadows.lg,
            }}
            activeOpacity={0.8}
          >
            <IconSymbol name="camera" size={20} color="#FFFFFF" />
            <Text style={{ color: '#FFFFFF', fontWeight: '700', marginLeft: spacing.sm, fontSize: 16 }}>Capture Parking Spot</Text>
          </TouchableOpacity>
        </View>

        {/* Enhanced Location Card */}
        <View style={{
          backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.9)',
          borderRadius: borderRadius['2xl'],
          margin: spacing.lg,
          padding: spacing.lg,
          borderWidth: 1,
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
          ...shadows.lg,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '700',
              color: isDark ? '#FFFFFF' : colors.text,
            }}>
              Location Details
            </Text>
            <View style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: '#10B981',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <IconSymbol name="location.fill" size={20} color="#FFFFFF" />
            </View>
          </View>
          
          {savedSpot ? (
            <View style={{ gap: spacing.sm }}>
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                paddingVertical: spacing.sm,
                borderBottomWidth: 1,
                borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : colors.border,
              }}>
                <Text style={{ fontSize: 13, color: isDark ? 'rgba(255,255,255,0.7)' : colors.textSecondary }}>Venue:</Text>
                <Text style={{ 
                  fontSize: 14, 
                  fontWeight: '600',
                  color: isDark ? '#FFFFFF' : colors.text,
                }}>
                  {savedSpot.location}
                </Text>
              </View>
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                paddingVertical: spacing.sm,
                borderBottomWidth: 1,
                borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : colors.border,
              }}>
                <Text style={{ fontSize: 13, color: isDark ? 'rgba(255,255,255,0.7)' : colors.textSecondary }}>Level:</Text>
                <Text style={{ 
                  fontSize: 14, 
                  fontWeight: '600',
                  color: isDark ? '#FFFFFF' : colors.text,
                }}>
                  {savedSpot.level}
                </Text>
              </View>
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                paddingVertical: spacing.sm,
                borderBottomWidth: 1,
                borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : colors.border,
              }}>
                <Text style={{ fontSize: 13, color: isDark ? 'rgba(255,255,255,0.7)' : colors.textSecondary }}>Section:</Text>
                <Text style={{ 
                  fontSize: 14, 
                  fontWeight: '600',
                  color: isDark ? '#FFFFFF' : colors.text,
                }}>
                  {savedSpot.section}
                </Text>
              </View>
              <View style={{ 
                marginTop: spacing.md,
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                borderRadius: borderRadius.xl,
                padding: spacing.sm,
              }}>
                <Text style={{ 
                  fontSize: 12, 
                  textAlign: 'center',
                  color: isDark ? 'rgba(255,255,255,0.7)' : colors.textSecondary,
                }}>
                  Saved on {savedSpot.timestamp.toLocaleString()}
                </Text>
              </View>
            </View>
          ) : (
            <View style={{ alignItems: 'center', paddingVertical: spacing.lg }}>
              <View style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : colors.border,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: spacing.md,
              }}>
                <IconSymbol name="location" size={24} color={isDark ? 'rgba(255,255,255,0.5)' : colors.textSecondary} />
              </View>
              <Text style={{
                fontSize: 14,
                textAlign: 'center',
                marginBottom: spacing.md,
                color: isDark ? '#FFFFFF' : colors.text,
              }}>
                No parking location saved yet
              </Text>
              <TouchableOpacity
                onPress={saveCurrentLocation}
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: borderRadius.xl,
                  paddingVertical: spacing.md,
                  paddingHorizontal: spacing.lg,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  ...shadows.sm,
                }}
                activeOpacity={0.8}
              >
                <IconSymbol name="location.fill" size={16} color="#FFFFFF" />
                <Text style={{ color: '#FFFFFF', fontWeight: '600', marginLeft: spacing.xs, fontSize: 15 }}>Save Current Location</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Enhanced Timer Controls */}
        <View style={{
          backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.9)',
          borderRadius: borderRadius['2xl'],
          margin: spacing.lg,
          padding: spacing.lg,
          borderWidth: 1,
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
          ...shadows.lg,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '700',
              color: isDark ? '#FFFFFF' : colors.text,
            }}>
              Parking Timer
            </Text>
            <View style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: '#3B82F6',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <IconSymbol name="clock.fill" size={20} color="#FFFFFF" />
            </View>
          </View>
          
          <View style={{ alignItems: 'center', marginBottom: spacing.lg }}>
            <View style={{
              backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              borderRadius: borderRadius['2xl'],
              padding: spacing.lg,
              width: '100%',
            }}>
              <Text style={{
                fontSize: 32,
                fontWeight: '700',
                textAlign: 'center',
                color: colors.primary,
                marginBottom: spacing.xs,
              }}>
                {elapsedTime}
              </Text>
              <Text style={{
                fontSize: 12,
                textAlign: 'center',
                color: isDark ? 'rgba(255,255,255,0.7)' : colors.textSecondary,
              }}>
                Current parking duration
              </Text>
              {timer.isActive && (
                <View style={{
                  marginTop: spacing.md,
                  backgroundColor: isDark ? 'rgba(76, 175, 80, 0.1)' : 'rgba(76, 175, 80, 0.1)',
                  borderRadius: borderRadius.xl,
                  padding: spacing.sm,
                }}>
                  <Text style={{
                    fontSize: 18,
                    fontWeight: '700',
                    color: '#4CAF50',
                    textAlign: 'center',
                  }}>
                    Estimated Cost: R{timer.cost}
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    textAlign: 'center',
                    marginTop: 2,
                    color: isDark ? 'rgba(255,255,255,0.7)' : colors.textSecondary,
                  }}>
                    R5 per hour rate
                  </Text>
                </View>
              )}
            </View>
          </View>
          
          <TouchableOpacity
            onPress={timer.isActive ? stopTimer : startTimer}
            style={{
              backgroundColor: timer.isActive ? '#EF4444' : colors.primary,
              borderRadius: borderRadius.xl,
              paddingVertical: spacing.md,
              paddingHorizontal: spacing.lg,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              ...shadows.sm,
            }}
            activeOpacity={0.8}
          >
            <IconSymbol 
              name={timer.isActive ? 'stop.fill' : 'play.fill'} 
              size={16} 
              color="#FFFFFF" 
            />
            <Text style={{
              color: '#FFFFFF',
              fontWeight: '600',
              marginLeft: spacing.xs,
              fontSize: 15,
            }}>
              {timer.isActive ? 'Stop Timer' : 'Start Timer'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Enhanced Find My Car */}
        <View style={{ margin: spacing.lg }}>
          <View style={{
            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.9)',
            borderRadius: borderRadius['2xl'],
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
            ...shadows.lg,
          }}>
            <LinearGradient
              colors={['#6A0DAD', '#8E44AD']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: 24 }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md }}>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    color: '#FFFFFF',
                    fontSize: 20,
                    fontWeight: '700',
                    marginBottom: spacing.xs,
                  }}>
                    Find My Car
                  </Text>
                  <Text style={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: 14,
                  }}>
                    Get step-by-step AR navigation back to your parked vehicle
                  </Text>
                </View>
                <View style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <IconSymbol name="car.2.fill" size={28} color="#FFFFFF" />
                </View>
              </View>
              
              <TouchableOpacity
                onPress={findMyCar}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  paddingVertical: spacing.md,
                  borderRadius: borderRadius.xl,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                activeOpacity={0.8}
              >
                <IconSymbol name="location.fill" size={16} color="#FFFFFF" />
                <Text style={{
                  color: '#FFFFFF',
                  fontWeight: '700',
                  marginLeft: spacing.xs,
                  fontSize: 15,
                }}>
                  Navigate to My Car
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>

        {/* Enhanced Parking Rates */}
        <View style={{
          backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.9)',
          borderRadius: borderRadius['2xl'],
          margin: spacing.lg,
          padding: spacing.lg,
          borderWidth: 1,
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
          ...shadows.lg,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '700',
              color: isDark ? '#FFFFFF' : colors.text,
            }}>
              Parking Rates
            </Text>
            <View style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: '#F59E0B',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <IconSymbol name="creditcard.fill" size={20} color="#FFFFFF" />
            </View>
          </View>
          
          <View style={{ gap: spacing.sm }}>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              paddingVertical: spacing.sm,
              borderBottomWidth: 1,
              borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : colors.border,
            }}>
              <Text style={{ fontSize: 14, color: isDark ? '#FFFFFF' : colors.text }}>First hour:</Text>
              <View style={{
                backgroundColor: '#10B981',
                paddingHorizontal: spacing.sm,
                paddingVertical: 4,
                borderRadius: borderRadius.full,
              }}>
                <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 12 }}>FREE</Text>
              </View>
            </View>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              paddingVertical: spacing.sm,
              borderBottomWidth: 1,
              borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : colors.border,
            }}>
              <Text style={{ fontSize: 14, color: isDark ? '#FFFFFF' : colors.text }}>Additional hours:</Text>
              <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 14 }}>R5/hour</Text>
            </View>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              paddingVertical: spacing.sm,
              borderBottomWidth: 1,
              borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : colors.border,
            }}>
              <Text style={{ fontSize: 14, color: isDark ? '#FFFFFF' : colors.text }}>Daily maximum:</Text>
              <Text style={{ color: '#F97316', fontWeight: '700', fontSize: 14 }}>R50</Text>
            </View>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              paddingVertical: spacing.sm,
            }}>
              <Text style={{ fontSize: 14, color: isDark ? '#FFFFFF' : colors.text }}>Lost ticket:</Text>
              <Text style={{ color: '#EF4444', fontWeight: '700', fontSize: 14 }}>R100</Text>
            </View>
          </View>
        </View>

        {/* Ad Banner */}
        <View style={{ marginBottom: spacing.xl }}>
          <SingleAdBanner 
            ad={advertisements[0]}
          />
        </View>

        {/* Enhanced Quick Actions */}
        <View style={{ margin: spacing.lg, marginBottom: spacing.xl }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '700',
            marginBottom: spacing.md,
            color: isDark ? '#FFFFFF' : colors.text,
          }}>Quick Actions</Text>
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between',
            gap: spacing.sm,
          }}>
            <TouchableOpacity 
              style={{
                flex: 1,
                backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.9)',
                borderRadius: borderRadius['2xl'],
                padding: spacing.md,
                borderWidth: 1,
                borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                ...shadows.sm,
              }}
              activeOpacity={0.8}
            >
              <View style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: '#6A0DAD',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: spacing.sm,
              }}>
                <IconSymbol name="map" size={20} color="#FFFFFF" />
              </View>
              <Text style={{ 
                fontSize: 14, 
                fontWeight: '600', 
                marginBottom: 2,
                color: isDark ? '#FFFFFF' : colors.text,
              }}>Parking Map</Text>
              <Text style={{ 
                fontSize: 12, 
                color: isDark ? 'rgba(255,255,255,0.7)' : colors.textSecondary,
              }}>View available spots</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={{
                flex: 1,
                backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.9)',
                borderRadius: borderRadius['2xl'],
                padding: spacing.md,
                borderWidth: 1,
                borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                ...shadows.sm,
              }}
              activeOpacity={0.8}
            >
              <View style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: '#3B82F6',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: spacing.sm,
              }}>
                <IconSymbol name="bell" size={20} color="#FFFFFF" />
              </View>
              <Text style={{ 
                fontSize: 14, 
                fontWeight: '600', 
                marginBottom: 2,
                color: isDark ? '#FFFFFF' : colors.text,
              }}>Reminders</Text>
              <Text style={{ 
                fontSize: 12, 
                color: isDark ? 'rgba(255,255,255,0.7)' : colors.textSecondary,
              }}>Set parking alerts</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={{
                flex: 1,
                backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.9)',
                borderRadius: borderRadius['2xl'],
                padding: spacing.md,
                borderWidth: 1,
                borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                ...shadows.sm,
              }}
              activeOpacity={0.8}
            >
              <View style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: '#10B981',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: spacing.sm,
              }}>
                <IconSymbol name="creditcard" size={20} color="#FFFFFF" />
              </View>
              <Text style={{ 
                fontSize: 14, 
                fontWeight: '600', 
                marginBottom: 2,
                color: isDark ? '#FFFFFF' : colors.text,
              }}>Payment</Text>
              <Text style={{ 
                fontSize: 12, 
                color: isDark ? 'rgba(255,255,255,0.7)' : colors.textSecondary,
              }}>Pay parking fees</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
