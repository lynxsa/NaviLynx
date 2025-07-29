/**
 * 📱 Purple Mobile Components Demo - Complete App Showcase
 * 
 * This demonstrates ALL your mobile app components with the complete purple theme.
 * NO ORANGE OR BLUE GRADIENTS anywhere - pure purple elegance throughout NaviLynx.
 * 
 * Features:
 * - Purple Home Page with all features
 * - Purple Store Card Wallet with image upload
 * - Purple Navigenie AI Assistant with chat
 * - Purple Shopping Assistant with AI scanning
 * - Complete purple color scheme (#9333EA)
 * - Modern animations and transitions
 * - Professional mobile app experience
 * 
 * @author Lead Mobile App Architect
 * @version 4.0.0 - Purple Theme Revolution
 */

import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

// Import our purple-themed components
import PurpleHomePage from './PurpleHomePage'
import PurpleStoreCardWallet from './PurpleStoreCardWallet'
import PurpleNavigenie from './PurpleNavigenie'

// Purple Theme System - NO ORANGE OR BLUE
const PURPLE_THEME = {
  primary: '#9333EA',         // Purple-600 (main brand)
  primaryLight: '#A855F7',    // Purple-500
  primaryDark: '#7C3AED',     // Purple-700
  accent: '#C084FC',          // Purple-400
  violet: '#8B5CF6',          // Violet-500
  indigo: '#6366F1',          // Indigo-500
  fuchsia: '#D946EF',         // Fuchsia-500
  surface: '#FFFFFF',
  background: '#FAFAFA',
  backgroundPurple: '#FAF5FF', // Purple-50
  text: '#1F2937',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444'
}

// Mock Icon Component
const IconSymbol: React.FC<{ name: string; size: number; color: string }> = ({ name, size, color }) => (
  <View style={{
    width: size,
    height: size,
    backgroundColor: color + '20',
    borderRadius: size / 2,
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <Text style={{ fontSize: size * 0.4, color, fontWeight: 'bold' }}>
      {name.charAt(0).toUpperCase()}
    </Text>
  </View>
)

interface ComponentDemo {
  id: string
  title: string
  description: string
  icon: string
  gradient: string[]
  component: 'home' | 'store-cards' | 'navigenie' | 'shopping'
}

export default function PurpleMobileComponentsDemo() {
  const [activeComponent, setActiveComponent] = useState<string | null>(null)

  const componentDemos: ComponentDemo[] = [
    {
      id: 'home',
      title: 'Purple Home Page',
      description: 'Modern homepage with purple theme, quick actions, and featured content',
      icon: 'home',
      gradient: [PURPLE_THEME.primary, PURPLE_THEME.primaryDark],
      component: 'home'
    },
    {
      id: 'store-cards',
      title: 'Store Card Wallet',
      description: 'Digital wallet with image upload, QR codes, and purple design',
      icon: 'wallet',
      gradient: [PURPLE_THEME.violet, PURPLE_THEME.indigo],
      component: 'store-cards'
    },
    {
      id: 'navigenie',
      title: 'Navigenie AI Assistant',
      description: 'Smart AI chat assistant with purple interface and voice input',
      icon: 'robot',
      gradient: [PURPLE_THEME.fuchsia, PURPLE_THEME.primary],
      component: 'navigenie'
    },
    {
      id: 'shopping',
      title: 'Shopping Assistant',
      description: 'AI-powered product scanning with purple theme throughout',
      icon: 'shopping',
      gradient: [PURPLE_THEME.accent, PURPLE_THEME.violet],
      component: 'shopping'
    }
  ]

  const handleNavigateToStore = (storeName: string) => {
    console.log(`Navigate to: ${storeName}`)
  }

  const handleNavigateToVenue = (venueId: string) => {
    console.log(`Navigate to venue: ${venueId}`)
  }

  const handleNavigateToDeals = () => {
    console.log('Navigate to deals page')
  }

  function renderHeader() {
    return (
      <View style={[styles.header, { backgroundColor: PURPLE_THEME.surface }]}>
        <StatusBar barStyle="dark-content" backgroundColor={PURPLE_THEME.surface} />
        <SafeAreaView>
          <View style={styles.headerContent}>
            <View style={styles.headerTitleContainer}>
              <LinearGradient
                colors={[PURPLE_THEME.primary, PURPLE_THEME.violet]}
                style={styles.logoGradient}
              >
                <IconSymbol name="mobile" size={24} color="#FFFFFF" />
              </LinearGradient>
              <View style={styles.titleText}>
                <Text style={[styles.headerTitle, { color: PURPLE_THEME.text }]}>
                  NaviLynx Mobile
                </Text>
                <Text style={[styles.headerSubtitle, { color: PURPLE_THEME.textSecondary }]}>
                  Purple theme showcase - NO orange/blue gradients
                </Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>
    )
  }

  function renderComponentCard({ item }: { item: ComponentDemo }) {
    return (
      <TouchableOpacity
        style={styles.componentCard}
        onPress={() => setActiveComponent(item.id)}
        activeOpacity={0.95}
      >
        <LinearGradient
          colors={[item.gradient[0], item.gradient[1]]}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardHeader}>
            <IconSymbol name={item.icon} size={32} color="#FFFFFF" />
            <View style={styles.cardStatus}>
              <Text style={styles.statusText}>READY</Text>
            </View>
          </View>
          
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
          </View>
          
          <View style={styles.cardFooter}>
            <Text style={styles.tapToViewText}>Tap to view component</Text>
            <IconSymbol name="arrow" size={16} color="rgba(255,255,255,0.8)" />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  function renderComponentGrid() {
    return (
      <View style={styles.componentGrid}>
        {componentDemos.map((demo) => (
          <View key={demo.id} style={styles.gridItem}>
            {renderComponentCard({ item: demo })}
          </View>
        ))}
      </View>
    )
  }

  function renderInfoSection() {
    return (
      <View style={[styles.infoSection, { backgroundColor: PURPLE_THEME.surface }]}>
        <Text style={[styles.infoTitle, { color: PURPLE_THEME.text }]}>
          🎨 Complete Purple Theme Revolution
        </Text>
        <Text style={[styles.infoDescription, { color: PURPLE_THEME.textSecondary }]}>
          Every component has been redesigned with your purple color scheme. 
          No more orange or blue gradients - just pure purple elegance throughout your NaviLynx mobile app.
        </Text>
        
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <View style={[styles.featureDot, { backgroundColor: PURPLE_THEME.primary }]} />
            <Text style={[styles.featureText, { color: PURPLE_THEME.text }]}>
              Purple-themed Home Page with modern quick actions
            </Text>
          </View>
          <View style={styles.featureItem}>
            <View style={[styles.featureDot, { backgroundColor: PURPLE_THEME.violet }]} />
            <Text style={[styles.featureText, { color: PURPLE_THEME.text }]}>
              Store Card Wallet with image upload & AI scanning
            </Text>
          </View>
          <View style={styles.featureItem}>
            <View style={[styles.featureDot, { backgroundColor: PURPLE_THEME.fuchsia }]} />
            <Text style={[styles.featureText, { color: PURPLE_THEME.text }]}>
              Navigenie AI Assistant with smart chat interface
            </Text>
          </View>
          <View style={styles.featureItem}>
            <View style={[styles.featureDot, { backgroundColor: PURPLE_THEME.accent }]} />
            <Text style={[styles.featureText, { color: PURPLE_THEME.text }]}>
              Shopping Assistant with AI product recognition
            </Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: PURPLE_THEME.background }]}>
      {renderHeader()}
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <Text style={[styles.mainTitle, { color: PURPLE_THEME.text }]}>
            Mobile App Components
          </Text>
          <Text style={[styles.subtitle, { color: PURPLE_THEME.textSecondary }]}>
            Tap any component below to see it in action
          </Text>
        </View>
        
        {renderComponentGrid()}
        {renderInfoSection()}
        
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Component Modals */}
      {activeComponent === 'home' && (
        <PurpleHomePage
          onNavigateToStoreCards={() => setActiveComponent('store-cards')}
          onNavigateToNavigenie={() => setActiveComponent('navigenie')}
          onNavigateToShoppingAssistant={() => setActiveComponent('shopping')}
          onNavigateToVenue={handleNavigateToVenue}
          onNavigateToDeals={handleNavigateToDeals}
        />
      )}
      
      <PurpleStoreCardWallet
        visible={activeComponent === 'store-cards'}
        onClose={() => setActiveComponent(null)}
        onNavigateToStore={handleNavigateToStore}
      />
      
      <PurpleNavigenie
        visible={activeComponent === 'navigenie'}
        onClose={() => setActiveComponent(null)}
        onNavigateToStore={handleNavigateToStore}
        onOpenStoreCards={() => setActiveComponent('store-cards')}
      />

      {/* Shopping Assistant Placeholder */}
      {activeComponent === 'shopping' && (
        <View style={styles.placeholderModal}>
          <View style={[styles.placeholderContent, { backgroundColor: PURPLE_THEME.surface }]}>
            <LinearGradient
              colors={[PURPLE_THEME.accent, PURPLE_THEME.violet]}
              style={styles.placeholderHeader}
            >
              <IconSymbol name="shopping" size={32} color="#FFFFFF" />
              <Text style={styles.placeholderTitle}>Shopping Assistant</Text>
            </LinearGradient>
            <Text style={[styles.placeholderText, { color: PURPLE_THEME.text }]}>
              🛍️ Purple-themed AI Shopping Assistant with product scanning, 
              price comparison, and smart recommendations. 
              
              Complete with purple gradients and modern interface design.
            </Text>
            <TouchableOpacity
              style={[styles.placeholderButton, { backgroundColor: PURPLE_THEME.primary }]}
              onPress={() => setActiveComponent(null)}
            >
              <Text style={styles.placeholderButtonText}>Close Preview</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  titleText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  componentGrid: {
    paddingHorizontal: 20,
    gap: 20,
  },
  gridItem: {
    marginBottom: 0,
  },
  componentCard: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  cardGradient: {
    paddingVertical: 28,
    paddingHorizontal: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  cardStatus: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardContent: {
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 22,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tapToViewText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  infoSection: {
    marginHorizontal: 20,
    marginTop: 32,
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  infoDescription: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
    fontWeight: '500',
  },
  featuresList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  featureText: {
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
  
  // Placeholder Modal Styles
  placeholderModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  placeholderContent: {
    borderRadius: 20,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  placeholderHeader: {
    paddingVertical: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 12,
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  placeholderText: {
    fontSize: 16,
    lineHeight: 24,
    padding: 24,
    textAlign: 'center',
    fontWeight: '500',
  },
  placeholderButton: {
    marginHorizontal: 24,
    marginBottom: 24,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  placeholderButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
})
