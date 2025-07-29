/**
 * 🎉 NaviLynx Enhanced Mobile App - Complete Integration Example
 * 
 * This component demonstrates the complete implementation of all requested features:
 * - NO ORANGE OR BLUE GRADIENTS - Pure purple theme throughout
 * - World-class home page with modern UI/UX
 * - Store card wallet with image upload and AI scanning
 * - Navigenie AI assistant with text input and voice support
 * - Shopping assistant with consistent design
 * - All components integrated into a seamless mobile experience
 * 
 * @author Lead Mobile App Architect
 * @version 4.0.0 - Purple Theme Revolution Complete
 */

import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Animated,
  Alert
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import * as Haptics from 'expo-haptics'

// Import our enhanced mobile components
import PurpleHomePage from './PurpleHomePage'
import PurpleStoreCardWallet from './PurpleStoreCardWallet'
import PurpleNavigenie from './PurpleNavigenie'
import EnhancedShoppingAssistant from './EnhancedShoppingAssistant'

const { width, height } = Dimensions.get('window')

// Purple Theme System - ZERO Orange/Blue Gradients
const PURPLE_THEME = {
  primary: '#9333EA',         // Purple-600
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
  border: '#E5E7EB'
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

type ScreenType = 'home' | 'storeCards' | 'navigenie' | 'shopping' | 'venue'

interface NaviLynxEnhancedAppProps {
  initialScreen?: ScreenType
}

export default function NaviLynxEnhancedApp({ 
  initialScreen = 'home' 
}: NaviLynxEnhancedAppProps) {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(initialScreen)
  const [showStoreCards, setShowStoreCards] = useState(false)
  const [showNavigenie, setShowNavigenie] = useState(false)
  const [showShopping, setShowShopping] = useState(false)

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    // Animate screen transitions
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [currentScreen])

  const handleScreenTransition = (screen: ScreenType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setCurrentScreen(screen)
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start()
    })
  }

  const handleNavigateToStoreCards = () => {
    setShowStoreCards(true)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
  }

  const handleNavigateToNavigenie = () => {
    setShowNavigenie(true)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
  }

  const handleNavigateToShoppingAssistant = () => {
    setShowShopping(true)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
  }

  const handleNavigateToVenue = (venueId: string) => {
    Alert.alert('Navigate to Venue', `Opening ${venueId} venue page...`)
    // In real app, this would navigate to venue detail screen
  }

  const handleNavigateToDeals = () => {
    Alert.alert('Deals', 'Opening deals page...')
    // In real app, this would navigate to deals screen
  }

  const handleNavigateToStore = (storeLocation: string) => {
    Alert.alert('Store Navigation', `Getting directions to ${storeLocation}...`)
    // In real app, this would open navigation to store
  }

  function renderBottomNavigation() {
    const navItems = [
      { id: 'home', label: 'Home', icon: 'home' },
      { id: 'venue', label: 'Venues', icon: 'map' },
      { id: 'shopping', label: 'Shopping', icon: 'shopping' },
      { id: 'navigenie', label: 'Navigenie', icon: 'robot' }
    ]

    return (
      <View style={[styles.bottomNav, { backgroundColor: PURPLE_THEME.surface }]}>
        <SafeAreaView>
          <View style={styles.bottomNavContent}>
            {navItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.navItem,
                  currentScreen === item.id && styles.navItemActive
                ]}
                onPress={() => {
                  if (item.id === 'shopping') {
                    handleNavigateToShoppingAssistant()
                  } else if (item.id === 'navigenie') {
                    handleNavigateToNavigenie()
                  } else {
                    handleScreenTransition(item.id as ScreenType)
                  }
                }}
              >
                <View style={[
                  styles.navIconContainer,
                  currentScreen === item.id && { backgroundColor: PURPLE_THEME.primary + '15' }
                ]}>
                  <IconSymbol 
                    name={item.icon} 
                    size={20} 
                    color={currentScreen === item.id ? PURPLE_THEME.primary : PURPLE_THEME.textSecondary} 
                  />
                </View>
                <Text 
                  style={[
                    styles.navLabel,
                    { color: currentScreen === item.id ? PURPLE_THEME.primary : PURPLE_THEME.textSecondary }
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </SafeAreaView>
      </View>
    )
  }

  function renderCurrentScreen() {
    switch (currentScreen) {
      case 'home':
        return (
          <PurpleHomePage
            onNavigateToStoreCards={handleNavigateToStoreCards}
            onNavigateToNavigenie={handleNavigateToNavigenie}
            onNavigateToShoppingAssistant={handleNavigateToShoppingAssistant}
            onNavigateToVenue={handleNavigateToVenue}
            onNavigateToDeals={handleNavigateToDeals}
          />
        )
      
      case 'venue':
        return (
          <View style={[styles.screenContainer, { backgroundColor: PURPLE_THEME.background }]}>
            <SafeAreaView style={{ flex: 1 }}>
              <View style={styles.screenHeader}>
                <LinearGradient
                  colors={[PURPLE_THEME.primary, PURPLE_THEME.violet]}
                  style={styles.headerGradient}
                >
                  <IconSymbol name="map" size={24} color="#FFFFFF" />
                </LinearGradient>
                <View style={styles.headerTextContainer}>
                  <Text style={[styles.screenTitle, { color: PURPLE_THEME.text }]}>
                    Venues
                  </Text>
                  <Text style={[styles.screenSubtitle, { color: PURPLE_THEME.textSecondary }]}>
                    Discover nearby locations
                  </Text>
                </View>
              </View>
              
              <ScrollView style={styles.screenContent}>
                <View style={[styles.featureCard, { backgroundColor: PURPLE_THEME.surface }]}>
                  <Text style={[styles.cardTitle, { color: PURPLE_THEME.text }]}>
                    Featured Venues
                  </Text>
                  <Text style={[styles.cardDescription, { color: PURPLE_THEME.textSecondary }]}>
                    Venue listing and navigation features would be displayed here
                  </Text>
                </View>
              </ScrollView>
            </SafeAreaView>
          </View>
        )
      
      default:
        return (
          <PurpleHomePage
            onNavigateToStoreCards={handleNavigateToStoreCards}
            onNavigateToNavigenie={handleNavigateToNavigenie}
            onNavigateToShoppingAssistant={handleNavigateToShoppingAssistant}
            onNavigateToVenue={handleNavigateToVenue}
            onNavigateToDeals={handleNavigateToDeals}
          />
        )
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: PURPLE_THEME.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={PURPLE_THEME.background} />
      
      <Animated.View style={[styles.mainContent, { opacity: fadeAnim }]}>
        {renderCurrentScreen()}
      </Animated.View>

      {renderBottomNavigation()}

      {/* Store Card Wallet Modal */}
      <PurpleStoreCardWallet
        visible={showStoreCards}
        onClose={() => setShowStoreCards(false)}
        onNavigateToStore={handleNavigateToStore}
      />

      {/* Navigenie AI Assistant Modal */}
      <PurpleNavigenie
        visible={showNavigenie}
        onClose={() => setShowNavigenie(false)}
        onNavigateToStore={handleNavigateToStore}
        onOpenStoreCards={() => {
          setShowNavigenie(false)
          setTimeout(() => setShowStoreCards(true), 300)
        }}
      />

      {/* Shopping Assistant Modal */}
      <EnhancedShoppingAssistant
        visible={showShopping}
        onClose={() => setShowShopping(false)}
        onNavigateToStore={handleNavigateToStore}
        onOpenStoreCards={() => {
          setShowShopping(false)
          setTimeout(() => setShowStoreCards(true), 300)
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
  },
  
  // Bottom Navigation
  bottomNav: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  bottomNavContent: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navItemActive: {
    // Active state styling handled by color changes
  },
  navIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  
  // Screen Containers
  screenContainer: {
    flex: 1,
  },
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  headerGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 2,
  },
  screenSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  screenContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  
  // Feature Cards
  featureCard: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 15,
    lineHeight: 22,
  },
})

// Export all components for easy integration
export {
  PurpleHomePage,
  PurpleStoreCardWallet,
  PurpleNavigenie,
  EnhancedShoppingAssistant
}
