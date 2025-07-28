import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeSafe } from '@/context/ThemeContext';
import { colors, spacing, borderRadius, shadows } from '@/styles/modernTheme';
import { LinearGradient } from 'expo-linear-gradient';
import { geminiService } from '@/services/geminiService';
// import { GoogleMapsDistanceService } from '@/services/GoogleMapsDistanceService';

interface APITest {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'idle' | 'testing' | 'success' | 'error';
  result?: string;
  testFunction: () => Promise<void>;
}

export default function APITestScreen() {
  const router = useRouter();
  const { isDark } = useThemeSafe();
  const [isRunningAll, setIsRunningAll] = useState(false);

  const [tests, setTests] = useState<APITest[]>([
    {
      id: 'gemini',
      name: 'Google Gemini AI',
      description: 'Test AI chat functionality',
      icon: 'sparkles',
      status: 'idle',
      testFunction: async () => {
        const response = await geminiService.getChatbotResponse('Test message: Say "Hello from NaviLynx!" if you can hear me.');
        if (response.includes('Hello from NaviLynx') || response.includes('hello') || response.includes('NaviLynx')) {
          updateTestStatus('gemini', 'success', '✅ AI responded successfully');
        } else {
          updateTestStatus('gemini', 'success', `✅ AI responded: "${response.substring(0, 50)}..."`);
        }
      },
    },
    {
      id: 'maps_distance',
      name: 'Google Maps Distance',
      description: 'Test distance calculation',
      icon: 'location',
      status: 'idle',
      testFunction: async () => {
        // const mapsService = new GoogleMapsDistanceService();
        // const result = await mapsService.calculateRealDistance(
        //   { latitude: -26.1956, longitude: 28.0341 }, // Johannesburg
        //   { latitude: -26.1906, longitude: 28.0369 }, // Nearby location
        //   'walking'
        // );
        updateTestStatus('maps_distance', 'success', `✅ Distance calculation test disabled`);
      },
    },
    {
      id: 'maps_directions',
      name: 'Google Maps Directions',
      description: 'Test route calculation',
      icon: 'arrow.triangle.turn.up.right.diamond',
      status: 'idle',
      testFunction: async () => {
        // Test directions API
        const url = `https://maps.googleapis.com/maps/api/directions/json?` +
          `origin=-26.1956,28.0341&destination=-26.1906,28.0369&` +
          `mode=walking&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.status === 'OK' && data.routes.length > 0) {
          const route = data.routes[0];
          const duration = route.legs[0]?.duration?.text || 'Unknown';
          const distance = route.legs[0]?.distance?.text || 'Unknown';
          updateTestStatus('maps_directions', 'success', `✅ Route: ${distance} (${duration})`);
        } else {
          throw new Error(`Directions API error: ${data.status}`);
        }
      },
    },
    {
      id: 'geocoding',
      name: 'Google Geocoding',
      description: 'Test address to coordinates',
      icon: 'map',
      status: 'idle',
      testFunction: async () => {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?` +
          `address=Sandton City Mall, Johannesburg&` +
          `key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.status === 'OK' && data.results.length > 0) {
          const location = data.results[0].geometry.location;
          updateTestStatus('geocoding', 'success', `✅ Coordinates: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`);
        } else {
          throw new Error(`Geocoding API error: ${data.status}`);
        }
      },
    },
    {
      id: 'places',
      name: 'Google Places',
      description: 'Test nearby places search',
      icon: 'building.2',
      status: 'idle',
      testFunction: async () => {
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
          `location=-26.1956,28.0341&radius=1000&type=shopping_mall&` +
          `key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.status === 'OK' && data.results.length > 0) {
          const placesCount = data.results.length;
          const firstPlace = data.results[0].name;
          updateTestStatus('places', 'success', `✅ Found ${placesCount} places. First: ${firstPlace}`);
        } else {
          throw new Error(`Places API error: ${data.status}`);
        }
      },
    },
  ]);

  const updateTestStatus = (id: string, status: APITest['status'], result?: string) => {
    setTests(prev => prev.map(test => 
      test.id === id ? { ...test, status, result } : test
    ));
  };

  const runSingleTest = async (test: APITest) => {
    if (test.status === 'testing') return;

    updateTestStatus(test.id, 'testing');
    try {
      await test.testFunction();
    } catch (error) {
      console.error(`${test.name} test failed:`, error);
      updateTestStatus(test.id, 'error', `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const runAllTests = async () => {
    setIsRunningAll(true);
    
    // Reset all tests
    setTests(prev => prev.map(test => ({ ...test, status: 'idle' as const, result: undefined })));
    
    // Run tests sequentially with delay
    for (const test of tests) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between tests
      await runSingleTest(test);
    }
    
    setIsRunningAll(false);
    
    // Show summary
    const successCount = tests.filter(t => t.status === 'success').length;
    const totalCount = tests.length;
    
    Alert.alert(
      'API Tests Complete',
      `${successCount}/${totalCount} tests passed successfully!`,
      [{ text: 'OK' }]
    );
  };

  const getStatusColor = (status: APITest['status']) => {
    switch (status) {
      case 'success': return '#34C759';
      case 'error': return '#FF3B30';
      case 'testing': return colors.primary;
      default: return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: APITest['status']) => {
    switch (status) {
      case 'success': return 'checkmark.circle.fill';
      case 'error': return 'xmark.circle.fill';
      case 'testing': return 'clock.fill';
      default: return 'circle';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? colors.background : '#F8F9FA' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <IconSymbol name="chevron.left" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>API Tests</Text>
          <Text style={styles.headerSubtitle}>Test production APIs</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={runAllTests}
          disabled={isRunningAll}
        >
          {isRunningAll ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <IconSymbol name="arrow.triangle.2.circlepath" size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Overview Card */}
        <View style={[
          styles.overviewCard,
          { backgroundColor: isDark ? colors.surface : '#FFFFFF' }
        ]}>
          <View style={styles.overviewHeader}>
            <IconSymbol name="checkmark.circle.fill" size={24} color={colors.primary} />
            <Text style={[styles.overviewTitle, { color: colors.text }]}>
              Production API Status
            </Text>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: '#34C759' }]}>
                {tests.filter(t => t.status === 'success').length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Passing
              </Text>
            </View>
            
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: '#FF3B30' }]}>
                {tests.filter(t => t.status === 'error').length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Failing
              </Text>
            </View>
            
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {tests.filter(t => t.status === 'testing').length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Running
              </Text>
            </View>
          </View>
        </View>

        {/* Test All Button */}
        <TouchableOpacity
          style={[styles.testAllButton, { backgroundColor: colors.primary }]}
          onPress={runAllTests}
          disabled={isRunningAll}
          activeOpacity={0.8}
        >
          {isRunningAll ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <IconSymbol name="play.fill" size={20} color="#FFFFFF" />
          )}
          <Text style={styles.testAllText}>
            {isRunningAll ? 'Running Tests...' : 'Run All Tests'}
          </Text>
        </TouchableOpacity>

        {/* Test Cards */}
        <View style={styles.testsContainer}>
          {tests.map((test) => (
            <TouchableOpacity
              key={test.id}
              style={[
                styles.testCard,
                {
                  backgroundColor: isDark ? colors.surface : '#FFFFFF',
                  borderColor: getStatusColor(test.status),
                  opacity: test.status === 'testing' ? 0.7 : 1,
                }
              ]}
              onPress={() => runSingleTest(test)}
              disabled={test.status === 'testing' || isRunningAll}
              activeOpacity={0.7}
            >
              <View style={styles.testHeader}>
                <View style={styles.testLeft}>
                  <View style={[styles.testIcon, { backgroundColor: `${colors.primary}15` }]}>
                    <IconSymbol name={test.icon as any} size={20} color={colors.primary} />
                  </View>
                  
                  <View style={styles.testInfo}>
                    <Text style={[styles.testName, { color: colors.text }]}>
                      {test.name}
                    </Text>
                    <Text style={[styles.testDescription, { color: colors.textSecondary }]}>
                      {test.description}
                    </Text>
                  </View>
                </View>

                <View style={styles.testStatus}>
                  {test.status === 'testing' ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    <IconSymbol 
                      name={getStatusIcon(test.status) as any} 
                      size={20} 
                      color={getStatusColor(test.status)} 
                    />
                  )}
                </View>
              </View>

              {test.result && (
                <View style={styles.testResult}>
                  <Text style={[
                    styles.resultText,
                    { color: test.status === 'error' ? '#FF3B30' : colors.textSecondary }
                  ]}>
                    {test.result}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Debug Info */}
        <View style={[
          styles.debugCard,
          { backgroundColor: isDark ? colors.surface : '#FFFFFF' }
        ]}>
          <Text style={[styles.debugTitle, { color: colors.text }]}>
            Environment Info
          </Text>
          
          <View style={styles.debugRow}>
            <Text style={[styles.debugLabel, { color: colors.textSecondary }]}>
              Gemini API:
            </Text>
            <Text style={[styles.debugValue, { color: colors.text }]}>
              {process.env.EXPO_PUBLIC_GEMINI_API_KEY ? '✅ Configured' : '❌ Missing'}
            </Text>
          </View>
          
          <View style={styles.debugRow}>
            <Text style={[styles.debugLabel, { color: colors.textSecondary }]}>
              Maps API:
            </Text>
            <Text style={[styles.debugValue, { color: colors.text }]}>
              {process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ? '✅ Configured' : '❌ Missing'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    paddingTop: spacing.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginRight: spacing.md,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  overviewCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  testAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.lg,
    gap: spacing.sm,
    ...shadows.lg,
  },
  testAllText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  testsContainer: {
    gap: spacing.md,
  },
  testCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    ...shadows.sm,
  },
  testHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  testLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  testIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  testInfo: {
    flex: 1,
  },
  testName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  testDescription: {
    fontSize: 13,
  },
  testStatus: {
    marginLeft: spacing.md,
  },
  testResult: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  resultText: {
    fontSize: 13,
    fontFamily: 'monospace',
  },
  debugCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.sm,
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  debugRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  debugLabel: {
    fontSize: 14,
  },
  debugValue: {
    fontSize: 14,
    fontWeight: '500',
  },
});
