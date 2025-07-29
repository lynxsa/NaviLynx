import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'

// Import our unified purple theme
const PURPLE_THEME = {
  primary: '#9333EA',
  primaryLight: '#A855F7', 
  primaryDark: '#7C3AED',
  violet: '#8B5CF6',
  indigo: '#6366F1',
  fuchsia: '#D946EF',
  accent: '#C084FC',
  white: '#FFFFFF',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray600: '#4B5563',
  gray800: '#1F2937',
}

const { width, height } = Dimensions.get('window')

interface QuickAction {
  id: string
  title: string
  subtitle: string
  icon: keyof typeof Ionicons.glyphMap
  gradient: [string, string]
  onPress: () => void
}

interface Recommendation {
  id: string
  icon: keyof typeof Ionicons.glyphMap
  title: string
  description: string
  confidence: string
  onPress: () => void
}

const ShoppingAssistantScreen: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Smart Scan',
      subtitle: 'AI product recognition',
      icon: 'scan',
      gradient: [PURPLE_THEME.primary, PURPLE_THEME.primaryDark],
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        // Handle smart scan
      }
    },
    {
      id: '2', 
      title: 'AI Assistant',
      subtitle: 'Smart shopping advice',
      icon: 'chatbubble-ellipses',
      gradient: [PURPLE_THEME.violet, PURPLE_THEME.indigo],
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        // Handle AI assistant
      }
    },
    {
      id: '3',
      title: 'Hot Deals',
      subtitle: 'Curated savings',
      icon: 'pricetag',
      gradient: [PURPLE_THEME.fuchsia, PURPLE_THEME.primary],
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        // Handle hot deals
      }
    },
    {
      id: '4',
      title: 'Find Stores',
      subtitle: 'AR navigation ready',
      icon: 'storefront',
      gradient: [PURPLE_THEME.accent, PURPLE_THEME.violet],
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        // Handle store finder
      }
    }
  ]

  useEffect(() => {
    // Load smart recommendations
    setRecommendations([
      {
        id: '1',
        icon: 'bulb',
        title: 'Try Local SA Brands',
        description: 'Consider Jungle Oats instead of imported cereals - better value and supports local',
        confidence: '85% sure',
        onPress: () => {}
      },
      {
        id: '2',
        icon: 'bulb',
        title: 'Shop at Pick n Pay for Basics',
        description: 'Your grocery staples are typically 15% cheaper here',
        confidence: '92% sure',
        onPress: () => {}
      }
    ])
  }, [])

  const renderQuickAction = (action: QuickAction) => (
    <TouchableOpacity
      key={action.id}
      style={styles.actionCard}
      onPress={action.onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={action.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.actionGradient}
      >
        <View style={styles.actionIconContainer}>
          <Ionicons 
            name={action.icon} 
            size={32} 
            color={PURPLE_THEME.white}
          />
        </View>
      </LinearGradient>
      <View style={styles.actionContent}>
        <Text style={styles.actionTitle}>{action.title}</Text>
        <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
      </View>
    </TouchableOpacity>
  )

  const renderRecommendation = (rec: Recommendation) => (
    <TouchableOpacity
      key={rec.id}
      style={styles.recommendationCard}
      onPress={rec.onPress}
      activeOpacity={0.8}
    >
      <View style={styles.recommendationLeft}>
        <View style={styles.recommendationIconContainer}>
          <Ionicons 
            name={rec.icon} 
            size={20} 
            color={PURPLE_THEME.primary}
          />
        </View>
        <View style={styles.recommendationContent}>
          <Text style={styles.recommendationTitle}>{rec.title}</Text>
          <Text style={styles.recommendationDescription}>{rec.description}</Text>
        </View>
      </View>
      <View style={styles.recommendationRight}>
        <Text style={styles.confidenceText}>{rec.confidence}</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={PURPLE_THEME.primary} />
      
      {/* Header with Purple Gradient */}
      <LinearGradient
        colors={[PURPLE_THEME.primary, PURPLE_THEME.violet]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>AI Shop Assistant</Text>
          <Text style={styles.headerSubtitle}>Smart shopping with AI-powered insights</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Quick Actions Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="rocket" size={24} color={PURPLE_THEME.primary} />
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>
          <Text style={styles.sectionSubtitle}>AI-powered shopping tools at your fingertips</Text>
          
          <View style={styles.actionsGrid}>
            {quickActions.map(renderQuickAction)}
          </View>
        </View>

        {/* Smart Recommendations Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Smart Recommendations</Text>
          
          {recommendations.map(renderRecommendation)}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PURPLE_THEME.gray100,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 32,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: PURPLE_THEME.white,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: PURPLE_THEME.white,
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: PURPLE_THEME.gray800,
    marginLeft: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: PURPLE_THEME.gray600,
    marginBottom: 20,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 60) / 2,
    backgroundColor: PURPLE_THEME.white,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: PURPLE_THEME.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionGradient: {
    height: 80,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionContent: {
    padding: 16,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: PURPLE_THEME.gray800,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: PURPLE_THEME.gray600,
  },
  recommendationCard: {
    backgroundColor: PURPLE_THEME.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: PURPLE_THEME.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: PURPLE_THEME.primary,
  },
  recommendationLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  recommendationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${PURPLE_THEME.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: PURPLE_THEME.gray800,
    marginBottom: 4,
  },
  recommendationDescription: {
    fontSize: 14,
    color: PURPLE_THEME.gray600,
    lineHeight: 20,
  },
  recommendationRight: {
    alignItems: 'flex-end',
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '500',
    color: PURPLE_THEME.primary,
    backgroundColor: `${PURPLE_THEME.primary}15`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
})

export default ShoppingAssistantScreen
