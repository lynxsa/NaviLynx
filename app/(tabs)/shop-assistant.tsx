import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { colors, spacing, borderRadius, shadows } from '@/styles/modernTheme';

export default function ShopAssistantScreen() {
  const { isDark } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const assistantFeatures = [
    {
      id: '1',
      title: 'Smart Shopping List',
      description: 'AI-powered shopping recommendations',
      icon: 'list.bullet' as const,
      color: colors.primary,
    },
    {
      id: '2',
      title: 'Price Comparison',
      description: 'Find the best deals across stores',
      icon: 'chart.bar.fill' as const,
      color: '#10B981',
    },
    {
      id: '3',
      title: 'Store Navigation',
      description: 'Find items quickly in-store',
      icon: 'location.fill' as const,
      color: '#3B82F6',
    },
    {
      id: '4',
      title: 'Product Scanner',
      description: 'Scan items for reviews and prices',
      icon: 'camera.viewfinder' as const,
      color: '#F59E0B',
    },
  ];

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: isDark ? '#000000' : '#FFFFFF' 
    }}>
      <StatusBar 
        barStyle={isDark ? "light-content" : "dark-content"} 
        backgroundColor="transparent"
        translucent
      />
      
      {/* Header */}
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
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <View style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: spacing.sm,
          }}>
            <IconSymbol name="bag.fill" size={16} color="#FFFFFF" />
          </View>
          <Text style={{
            fontSize: 18,
            fontWeight: '700',
            color: isDark ? '#FFFFFF' : colors.text,
            letterSpacing: 0.5,
          }}>
            Shop Assistant
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Welcome Section */}
        <View style={{ 
          paddingHorizontal: spacing.lg, 
          paddingVertical: spacing.xl 
        }}>
          <View style={{
            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.9)',
            borderRadius: borderRadius['2xl'],
            padding: spacing.xl,
            borderWidth: 1,
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
            ...shadows.md,
          }}>
            <View style={{ alignItems: 'center', marginBottom: spacing.lg }}>
              <View style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: colors.primary,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: spacing.md,
              }}>
                <IconSymbol name="bag.fill" size={40} color="#FFFFFF" />
              </View>
              <Text style={{
                fontSize: 24,
                fontWeight: '700',
                color: isDark ? '#FFFFFF' : colors.text,
                textAlign: 'center',
                marginBottom: spacing.xs,
              }}>
                Your Smart Shopping Assistant
              </Text>
              <Text style={{
                fontSize: 16,
                color: isDark ? '#FFFFFF' : colors.text,
                opacity: 0.7,
                textAlign: 'center',
                lineHeight: 24,
              }}>
                AI-powered shopping made simple. Find deals, navigate stores, and shop smarter.
              </Text>
            </View>
          </View>
        </View>

        {/* Features Grid */}
        <View style={{ 
          paddingHorizontal: spacing.lg,
          marginBottom: spacing.xl,
        }}>
          <Text style={{
            fontSize: 20,
            fontWeight: '700',
            color: isDark ? '#FFFFFF' : colors.text,
            marginBottom: spacing.lg,
          }}>
            Assistant Features
          </Text>
          
          <View style={{ gap: spacing.md }}>
            {assistantFeatures.map((feature) => (
              <TouchableOpacity
                key={feature.id}
                style={{
                  backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.9)',
                  borderRadius: borderRadius.xl,
                  padding: spacing.lg,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                  ...shadows.sm,
                }}
                activeOpacity={0.7}
              >
                <View style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: feature.color,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: spacing.md,
                }}>
                  <IconSymbol name={feature.icon} size={24} color="#FFFFFF" />
                </View>
                
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: isDark ? '#FFFFFF' : colors.text,
                    marginBottom: spacing.xs,
                  }}>
                    {feature.title}
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: isDark ? '#FFFFFF' : colors.text,
                    opacity: 0.7,
                  }}>
                    {feature.description}
                  </Text>
                </View>
                
                <IconSymbol 
                  name="chevron.right" 
                  size={16} 
                  color={isDark ? '#FFFFFF' : colors.text} 
                  style={{ opacity: 0.5 }}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={{ 
          paddingHorizontal: spacing.lg,
          marginBottom: spacing.xl,
        }}>
          <Text style={{
            fontSize: 20,
            fontWeight: '700',
            color: isDark ? '#FFFFFF' : colors.text,
            marginBottom: spacing.lg,
          }}>
            Quick Actions
          </Text>
          
          <View style={{ gap: spacing.sm }}>
            <TouchableOpacity
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
              <IconSymbol name="camera" size={20} color="#FFFFFF" />
              <Text style={{ 
                color: '#FFFFFF', 
                fontWeight: '600', 
                marginLeft: spacing.sm,
                fontSize: 16,
              }}>
                Scan Product
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                backgroundColor: '#10B981',
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
              <IconSymbol name="list.bullet" size={20} color="#FFFFFF" />
              <Text style={{ 
                color: '#FFFFFF', 
                fontWeight: '600', 
                marginLeft: spacing.sm,
                fontSize: 16,
              }}>
                Create Shopping List
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
