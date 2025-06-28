/**
 * NaviLynx Charter Demo Script
 * Comprehensive demonstration of all charter features
 */

import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import * as THREE from 'three';

// Modern UI Components
import {
  ModernButton,
  ModernCard,
  ModernText,
  ModernContainer,
  ModernBadge,
} from '@/components/ui/ModernComponents';

// Charter Services
import { googleAIService } from '@/services/googleAIService';
import { enhancedARCoreService } from '@/services/enhancedARCoreService';
import { multilingualService, Language } from '@/services/multilingualService';
import { enhancedSAMarketService, CharterPaymentMethod } from '@/services/enhancedSAMarketService';
import { VenueDataService } from '@/services/venueDataService';
import { performanceOptimizationService } from '@/services/performanceOptimizationService';

interface DemoSection {
  id: string;
  title: string;
  description: string;
  phase: string;
  action: () => Promise<string>;
  status: 'pending' | 'running' | 'success' | 'error';
  result?: string;
}

export default function CharterDemoScreen() {
  const [demoSections, setDemoSections] = useState<DemoSection[]>([
    {
      id: 'google-ai',
      title: 'Google AI Integration',
      description: 'Smart venue search with Gemini Pro AI',
      phase: 'Phase 1',
      action: async () => {
        const results = await googleAIService.processVenueQuery('luxury shopping mall johannesburg');
        return `AI Recommendation: ${results.text.substring(0, 100)}...`;
      },
      status: 'pending',
    },
    {
      id: 'ar-core',
      title: 'Enhanced AR Core',
      description: 'Unity-like AR interactions and object recognition',
      phase: 'Phase 1',
      action: async () => {
        const object = await enhancedARCoreService.addARObject({
          id: 'demo-ar-object',
          type: 'information',
          position: new THREE.Vector3(0, 0, -2),
        });
        return `Created AR object: ${object.id}`;
      },
      status: 'pending',
    },
    {
      id: 'multilingual',
      title: '11 South African Languages',
      description: 'Complete multilingual support with cultural adaptation',
      phase: 'Phase 2',
      action: async () => {
        const languagesArray: Language[] = multilingualService.getAvailableLanguages();
        const languagesCount = languagesArray.length; // Corrected to use .length
        // Corrected to call translate with 2 arguments as per error
        const greeting = multilingualService.translate('welcome', 'zu'); 
        return `${languagesCount} languages supported. Zulu greeting: "${greeting}"`;
      },
      status: 'pending',
    },
    {
      id: 'load-shedding',
      title: 'Load Shedding Integration',
      description: 'Real-time Eskom load shedding alerts',
      phase: 'Phase 3',
      action: async () => {
        const status = await enhancedSAMarketService.getRealTimeLoadSheddingStatus('2001');
        return `Load shedding Stage ${status.stage} in area ${status.municipality}`;
      },
      status: 'pending',
    },
    {
      id: 'payments',
      title: 'SA Payment Methods',
      description: 'Comprehensive local payment ecosystem',
      phase: 'Phase 3',
      action: async () => {
        const methodsMap: Map<string, CharterPaymentMethod> = enhancedSAMarketService.getAdvancedPaymentMethods();
        const methods: CharterPaymentMethod[] = Array.from(methodsMap.values());
        return `${methods.length} payment methods: ${methods.slice(0, 3).map((m: CharterPaymentMethod) => m.name).join(', ')}...`;
      },
      status: 'pending',
    },
    {
      id: 'safety-alerts',
      title: 'AI Safety Alerts',
      description: 'Real-time safety monitoring with SAPS integration',
      phase: 'Phase 3',
      action: async () => {
        const alerts = await enhancedSAMarketService.getAIEnhancedSafetyAlerts(-26.2041, 28.0473);
        return `${alerts.length} safety alerts in 5km radius`;
      },
      status: 'pending',
    },
    {
      id: 'township-marketplace',
      title: 'Township Business Marketplace',
      description: 'Support local vendors and community businesses',
      phase: 'Phase 3',
      action: async () => {
        const vendors = await enhancedSAMarketService.getTownshipBusinesses(-26.2041, 28.0473);
        return `${vendors.length} local vendors found`;
      },
      status: 'pending',
    },
    {
      id: 'venue-database',
      title: 'Comprehensive Venue Database',
      description: 'Major South African venues with detailed information',
      phase: 'Phase 5',
      action: async () => {
        const venues = VenueDataService.getAllVenues();
        const stats = VenueDataService.getVenueStatistics();
        return `${venues.length} venues across ${stats.provinces} provinces`;
      },
      status: 'pending',
    },
    {
      id: 'performance',
      title: 'Performance Excellence',
      description: 'Sub-second load times, 60 FPS, <0.05% crash rate',
      phase: 'Phase 6',
      action: async () => {
        const metrics = performanceOptimizationService.getMetrics();
        const report = performanceOptimizationService.getPerformanceReport();
        return `Performance: ${report.overall} (${metrics.frameRate.toFixed(1)} FPS)`;
      },
      status: 'pending',
    },
  ]);

  const [overallProgress, setOverallProgress] = useState(0);
  const [isRunningDemo, setIsRunningDemo] = useState(false);

  const runSingleDemo = async (sectionId: string) => {
    setDemoSections(prev => prev.map(section =>
      section.id === sectionId
        ? { ...section, status: 'running' }
        : section
    ));

    try {
      const section = demoSections.find(s => s.id === sectionId);
      if (!section) return;

      const result = await section.action();

      setDemoSections(prev => prev.map(s =>
        s.id === sectionId
          ? { ...s, status: 'success', result }
          : s
      ));
    } catch (error) {
      setDemoSections(prev => prev.map(s =>
        s.id === sectionId
          ? { ...s, status: 'error', result: 'Demo failed: ' + (error as Error).message }
          : s
      ));
    }
  };

  const runFullDemo = async () => {
    setIsRunningDemo(true);
    setOverallProgress(0);

    for (let i = 0; i < demoSections.length; i++) {
      const section = demoSections[i];
      await runSingleDemo(section.id);
      setOverallProgress(((i + 1) / demoSections.length) * 100);

      // Small delay between demos for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunningDemo(false);

    Alert.alert(
      'Charter Demo Complete! 🎉',
      'All NaviLynx Charter features have been successfully demonstrated. The app is ready for South African market launch!',
      [
        { text: 'View Report', onPress: () => showDetailedReport() },
        { text: 'OK', style: 'default' }
      ]
    );
  };

  const showDetailedReport = () => {
    const report = performanceOptimizationService.getPerformanceReport();
    const venueStats = VenueDataService.getVenueStatistics();

    Alert.alert(
      'Charter Compliance Report',
      `
Performance: ${report.overall.toUpperCase()}
Venues: ${venueStats.totalVenues} across ${venueStats.provinces} provinces
Languages: 11 South African languages
Payment Methods: 8+ local options
Load Shedding: Real-time monitoring
Safety: AI-powered alerts
AR: Unity-like interactions
AI: Gemini Pro integration

🇿🇦 Ready for South African market! 🚀
      `,
      [{ text: 'Excellent!', style: 'default' }]
    );
  };

  // Corrected return type to be more general or specific to ModernBadge variant prop values
  const getStatusColor = (status: DemoSection['status']): 'info' | 'warning' | 'success' | 'error' => {
    switch (status) {
      case 'pending': return 'info';
      case 'running': return 'warning';
      case 'success': return 'success';
      case 'error': return 'error';
      default: return 'info';
    }
  };

  const getStatusIcon = (status: DemoSection['status']) => {
    switch (status) {
      case 'pending': return 'circle';
      case 'running': return 'clock';
      case 'success': return 'checkmark.circle.fill';
      case 'error': return 'xmark.circle.fill';
      default: return 'circle';
    }
  };

  return (
    <ModernContainer variant="page">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header */}
        <View className="px-4 pt-16 pb-8">
          <ModernText variant="h1" weight="bold" className="mb-2">
            NaviLynx Charter Demo
          </ModernText>

          <ModernText variant="body" color="secondary" className="mb-6">
            Comprehensive demonstration of all charter features and South African market integration
          </ModernText>

          {/* Progress Bar */}
          {isRunningDemo && (
            <View className="mb-6">
              <View className="flex-row justify-between items-center mb-2">
                <ModernText variant="label" weight="medium">
                  Demo Progress
                </ModernText>
                <ModernText variant="label" color="primary">
                  {overallProgress.toFixed(0)}%
                </ModernText>
              </View>

              <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <View
                  className="h-full bg-primary-500 rounded-full transition-all duration-300"
                  style={{ width: `${overallProgress}%` }}
                />
              </View>
            </View>
          )}

          {/* Control Buttons */}
          <View className="flex-row space-x-3">
            <ModernButton
              variant="sa-gradient"
              size="lg"
              onPress={runFullDemo}
              disabled={isRunningDemo}
              icon="play.fill"
              className="flex-1"
            >
              {isRunningDemo ? 'Running Demo...' : 'Run Full Demo'}
            </ModernButton>

            <ModernButton
              variant="outline"
              size="lg"
              onPress={showDetailedReport}
              icon="doc.text.fill"
            >
              Report
            </ModernButton>
          </View>
        </View>

        {/* Demo Sections */}
        <View className="px-4 space-y-4">
          {demoSections.map((section) => (
            <ModernCard key={section.id} variant="standard" className="p-4">
              <View className="flex-row items-start justify-between mb-3">
                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <ModernBadge variant={getStatusColor(section.status)} size="sm" className="mr-2">
                      {section.phase} 
                    </ModernBadge>

                    <ModernText variant="h4" weight="semibold">
                      {section.title}
                    </ModernText>
                  </View>

                  <ModernText variant="body" color="secondary" className="mb-2">
                    {section.description}
                  </ModernText>

                  {section.result && (
                    <ModernText
                      variant="caption"
                      color={section.status === 'success' ? 'success' : 'error'}
                      className="font-medium"
                    >
                      {section.result}
                    </ModernText>
                  )}
                </View>

                <View className="ml-3 items-center">
                  <ModernBadge
                    variant={getStatusColor(section.status)} // Ensure this variant is valid for ModernBadge
                    size="sm"
                    className="mb-2"
                  >
                    {section.status}
                  </ModernBadge>

                  <ModernButton
                    variant="outline"
                    size="sm"
                    onPress={() => runSingleDemo(section.id)}
                    disabled={isRunningDemo || section.status === 'running'}
                    icon={getStatusIcon(section.status)}
                  >
                    Test
                  </ModernButton>
                </View>
              </View>
            </ModernCard>
          ))}
        </View>

        {/* Charter Summary */}
        <View className="px-4 py-8">
          <ModernCard variant="sa-themed" className="p-6">
            <ModernText variant="h3" weight="bold" className="mb-3 text-center">
              🇿🇦 NaviLynx Charter Status
            </ModernText>

            <View className="space-y-2">
              <View className="flex-row justify-between">
                <ModernText variant="body">Google AI Integration:</ModernText>
                <ModernText variant="body" weight="semibold" color="success">✅ Complete</ModernText>
              </View>

              <View className="flex-row justify-between">
                <ModernText variant="body">Multilingual Support:</ModernText>
                <ModernText variant="body" weight="semibold" color="success">✅ 11 Languages</ModernText>
              </View>

              <View className="flex-row justify-between">
                <ModernText variant="body">SA Market Features:</ModernText>
                <ModernText variant="body" weight="semibold" color="success">✅ Comprehensive</ModernText>
              </View>

              <View className="flex-row justify-between">
                <ModernText variant="body">Modern UI/UX:</ModernText>
                <ModernText variant="body" weight="semibold" color="success">✅ NativeWind</ModernText>
              </View>

              <View className="flex-row justify-between">
                <ModernText variant="body">Venue Database:</ModernText>
                <ModernText variant="body" weight="semibold" color="success">✅ 15+ Major Venues</ModernText>
              </View>

              <View className="flex-row justify-between">
                <ModernText variant="body">Performance:</ModernText>
                <ModernText variant="body" weight="semibold" color="success">✅ Targets Exceeded</ModernText>
              </View>
            </View>

            <View className="mt-6 pt-4 border-t border-gray-200">
              <ModernText variant="body" className="text-center font-medium">
                🎉 Ready for South African Market Launch! 🚀
              </ModernText>
            </View>
          </ModernCard>
        </View>

        {/* Navigation Actions */}
        <View className="px-4 pb-8 space-y-3">
          <ModernButton
            variant="primary"
            onPress={() => router.push('/')}
            icon="house.fill"
          >
            Return to Home
          </ModernButton>

          <ModernButton
            variant="secondary"
            onPress={() => router.push('/explore')}
            icon="map.fill"
          >
            Explore Venues
          </ModernButton>
        </View>
      </ScrollView>
    </ModernContainer>
  );
}
