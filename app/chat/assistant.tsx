import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  StatusBar 
} from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeSafe } from '@/context/ThemeContext';
import { colors, spacing, borderRadius, shadows } from '@/styles/modernTheme';
import { LinearGradient } from 'expo-linear-gradient';

export default function AssistantChatScreen() {
  const router = useRouter();
  const { isDark } = useThemeSafe();

  const assistantFeatures = [
    {
      id: 'navigation',
      title: 'Navigation Assistant',
      description: 'Get directions to any store or facility',
      icon: 'location.fill',
      color: '#007AFF',
      action: () => router.push('/(tabs)/ar-navigator'),
    },
    {
      id: 'shopping',
      title: 'Shopping Assistant',
      description: 'Find products and get shopping recommendations',
      icon: 'bag.fill',
      color: '#FF6B35',
      action: () => router.push('/(tabs)/shop-assistant'),
    },
    {
      id: 'parking',
      title: 'Parking Assistant',
      description: 'Find and book parking spaces',
      icon: 'car.fill',
      color: '#34C759',
      action: () => router.push('/(tabs)/parking'),
    },
    {
      id: 'ai-chat',
      title: 'NaviGenie AI',
      description: 'Chat with our intelligent assistant',
      icon: 'sparkles',
      color: '#FF3B30',
      action: () => router.push('/(tabs)/navigenie'),
    },
  ];

  const quickActions = [
    '🗺️ "Where is the nearest restroom?"',
    '🛒 "Help me find electronics stores"',
    '🚗 "Show me available parking"',
    '🍕 "What restaurants are open now?"',
    '💡 "How do I get to Level 3?"',
    '📍 "Navigate to customer service"',
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? colors.background : '#FFFFFF' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={[styles.backButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}
        >
          <IconSymbol name="chevron.left" size={20} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            AI Assistant
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Choose how I can help you
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          style={styles.welcomeCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.welcomeContent}>
            <IconSymbol name="sparkles" size={32} color="#FFFFFF" />
            <Text style={styles.welcomeTitle}>
              Hello! I'm your AI assistant
            </Text>
            <Text style={styles.welcomeText}>
              I can help you navigate, shop, find parking, and answer questions about your venue.
            </Text>
          </View>
        </LinearGradient>

        {/* Assistant Features */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Choose an Assistant
          </Text>
          
          <View style={styles.featuresGrid}>
            {assistantFeatures.map((feature) => (
              <TouchableOpacity
                key={feature.id}
                style={[
                  styles.featureCard,
                  {
                    backgroundColor: isDark ? colors.surface : '#FFFFFF',
                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                  }
                ]}
                onPress={feature.action}
                activeOpacity={0.7}
              >
                <View style={[styles.featureIcon, { backgroundColor: `${feature.color}15` }]}>
                  <IconSymbol name={feature.icon as any} size={24} color={feature.color} />
                </View>
                
                <View style={styles.featureContent}>
                  <Text style={[styles.featureTitle, { color: colors.text }]}>
                    {feature.title}
                  </Text>
                  <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                    {feature.description}
                  </Text>
                </View>
                
                <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Quick Questions
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Try asking me something like:
          </Text>
          
          <View style={styles.quickActionsContainer}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.quickActionChip,
                  {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F8F9FA',
                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                  }
                ]}
                onPress={() => router.push('/(tabs)/navigenie')}
              >
                <Text style={[styles.quickActionText, { color: colors.textSecondary }]}>
                  {action}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Start Chat Button */}
        <TouchableOpacity
          style={[styles.startChatButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/(tabs)/navigenie')}
          activeOpacity={0.8}
        >
          <IconSymbol name="message.circle" size={20} color="#FFFFFF" />
          <Text style={styles.startChatText}>
            Start Chat with NaviGenie
          </Text>
        </TouchableOpacity>
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
    paddingVertical: spacing.md,
    paddingTop: spacing.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  welcomeCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  welcomeContent: {
    alignItems: 'center',
    textAlign: 'center',
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  welcomeText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: spacing.lg,
  },
  featuresGrid: {
    gap: spacing.md,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    ...shadows.sm,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  quickActionsContainer: {
    gap: spacing.sm,
  },
  quickActionChip: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  quickActionText: {
    fontSize: 14,
  },
  startChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.xl,
    gap: spacing.sm,
    ...shadows.lg,
  },
  startChatText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
