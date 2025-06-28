// components/AirportFeatures.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  TextInput,
  FlatList
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/context/ThemeContext';
import GlassCard from './GlassCard';
import { IconSymbol, IconSymbolName } from './ui/IconSymbol';
import { Spacing } from '@/constants/Theme';

export interface FlightInfo {
  flightNumber: string;
  airline: string;
  destination: string;
  departure: string;
  gate: string;
  terminal: string;
  status: 'On Time' | 'Delayed' | 'Boarding' | 'Departed' | 'Cancelled';
  delay?: number; // minutes
}

export interface LayoverPlan {
  id: string;
  title: string;
  description: string;
  duration: number; // minutes
  location: string;
  category: 'dining' | 'shopping' | 'lounge' | 'entertainment' | 'rest';
  walkingTime: number; // minutes from current location
  recommended: boolean;
}

export interface PassportData {
  name: string;
  passportNumber: string;
  nationality: string;
  issuedDate: string;
  expiryDate: string;
  isValid: boolean;
}

export interface AirportFeaturesProps {
  visible: boolean;
  onClose: () => void;
  airportCode: string;
  currentTerminal?: string;
}

export default function AirportFeatures({ 
  visible, 
  onClose, 
  airportCode, 
  currentTerminal = 'A' 
}: AirportFeaturesProps) {
  const { colors } = useTheme();
  
  const [activeTab, setActiveTab] = useState<'passport' | 'layover' | 'flights' | 'gates'>('passport');
  const [showPassportScanner, setShowPassportScanner] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [passportData, setPassportData] = useState<PassportData | null>(null);
  const [flightInfo, setFlightInfo] = useState<FlightInfo[]>([]);
  const [layoverPlans, setLayoverPlans] = useState<LayoverPlan[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (visible) {
      loadAirportData();
    }
  }, [visible, airportCode]);

  const loadAirportData = async () => {
    // Mock airport data - replace with actual API calls
    setFlightInfo([
      {
        flightNumber: 'SAA123',
        airline: 'South African Airways',
        destination: 'Cape Town',
        departure: '14:30',
        gate: 'A12',
        terminal: 'A',
        status: 'On Time'
      },
      {
        flightNumber: 'BA456',
        airline: 'British Airways',
        destination: 'London',
        departure: '18:45',
        gate: 'B7',
        terminal: 'B',
        status: 'Delayed',
        delay: 25
      },
      {
        flightNumber: 'EK789',
        airline: 'Emirates',
        destination: 'Dubai',
        departure: '22:15',
        gate: 'A15',
        terminal: 'A',
        status: 'Boarding'
      }
    ]);

    setLayoverPlans([
      {
        id: '1',
        title: 'Duty-Free Shopping',
        description: 'Browse luxury goods and local souvenirs',
        duration: 45,
        location: 'Terminal A, Level 2',
        category: 'shopping',
        walkingTime: 3,
        recommended: true
      },
      {
        id: '2',
        title: 'Primi Piatti Restaurant',
        description: 'Authentic Italian cuisine with airport views',
        duration: 60,
        location: 'Terminal A, Gate Area',
        category: 'dining',
        walkingTime: 5,
        recommended: true
      },
      {
        id: '3',
        title: 'Bidvest Premier Lounge',
        description: 'Relax in comfort with complimentary refreshments',
        duration: 120,
        location: 'Terminal A, Mezzanine Level',
        category: 'lounge',
        walkingTime: 7,
        recommended: false
      },
      {
        id: '4',
        title: 'Sleep Pod Zone',
        description: 'Power nap in a private sleep pod',
        duration: 30,
        location: 'Terminal B, Quiet Zone',
        category: 'rest',
        walkingTime: 12,
        recommended: false
      }
    ]);
  };

  const handlePassportScan = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Permission Required', 'Camera access is needed to scan passport.');
        return;
      }
    }

    setShowCamera(true);
    setShowPassportScanner(true);
  };

  const simulatePassportScan = () => {
    // Simulate passport data extraction
    setTimeout(() => {
      const mockPassportData: PassportData = {
        name: 'JOHN SMITH',
        passportNumber: 'A12345678',
        nationality: 'SOUTH AFRICA',
        issuedDate: '2019-03-15',
        expiryDate: '2029-03-15',
        isValid: true
      };
      
      setPassportData(mockPassportData);
      setShowCamera(false);
      setShowPassportScanner(false);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Passport Scanned', 'Passport information has been extracted successfully!');
    }, 2000);
  };

  const getCategoryIcon = (category: string): IconSymbolName => {
    switch (category) {
      case 'dining': return 'fork.knife' as IconSymbolName;
      case 'shopping': return 'bag' as IconSymbolName;
      case 'lounge': return 'sofa' as IconSymbolName;
      case 'entertainment': return 'tv' as IconSymbolName;
      case 'rest': return 'bed.double' as IconSymbolName;
      default: return 'mappin' as IconSymbolName;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'On Time': return colors.success;
      case 'Delayed': return colors.warning;
      case 'Boarding': return colors.primary;
      case 'Departed': return colors.textSecondary;
      case 'Cancelled': return colors.destructive;
      default: return colors.text;
    }
  };

  const filteredFlights = flightInfo.filter(flight =>
    flight.flightNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flight.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flight.airline.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderPassportTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <GlassCard style={styles.featureCard}>
        <View style={styles.cardHeader}>
          <IconSymbol name="doc.text.viewfinder" size={32} color={colors.primary} />
          <View style={styles.cardInfo}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Passport Scanner
            </Text>
            <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
              Quickly extract passport information for check-in
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={[styles.scanButton, { backgroundColor: colors.primary }]}
          onPress={handlePassportScan}
        >
          <IconSymbol name="camera.fill" size={20} color="#FFFFFF" />
          <Text style={styles.scanButtonText}>Scan Passport</Text>
        </TouchableOpacity>
      </GlassCard>

      {passportData && (
        <GlassCard style={styles.passportDataCard}>
          <View style={styles.passportHeader}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Passport Information
            </Text>
            <View style={[
              styles.validityBadge,
              { backgroundColor: passportData.isValid ? colors.success : colors.destructive }
            ]}>
              <Text style={styles.validityText}>
                {passportData.isValid ? 'Valid' : 'Invalid'}
              </Text>
            </View>
          </View>
          
          <View style={styles.passportDetails}>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Name:</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {passportData.name}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Passport No:</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {passportData.passportNumber}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Nationality:</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {passportData.nationality}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Expires:</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {new Date(passportData.expiryDate).toLocaleDateString()}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.secondary }]}
            onPress={() => Alert.alert('Auto-Fill', 'Passport data will be used for check-in forms.')}
          >
            <Text style={styles.actionButtonText}>Use for Check-in</Text>
          </TouchableOpacity>
        </GlassCard>
      )}
    </ScrollView>
  );

  const renderLayoverTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Make the Most of Your Layover
      </Text>
      
      {layoverPlans.map((plan) => (
        <GlassCard key={plan.id} style={styles.layoverCard}>
          <View style={styles.layoverHeader}>
            <View style={styles.layoverInfo}>
              <View style={styles.layoverTitleRow}>
                <IconSymbol 
                  name={getCategoryIcon(plan.category)} 
                  size={20} 
                  color={colors.primary} 
                />
                <Text style={[styles.layoverTitle, { color: colors.text }]}>
                  {plan.title}
                </Text>
                {plan.recommended && (
                  <View style={[styles.recommendedBadge, { backgroundColor: colors.accent }]}>
                    <Text style={styles.recommendedText}>Recommended</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.layoverDescription, { color: colors.textSecondary }]}>
                {plan.description}
              </Text>
              <Text style={[styles.layoverLocation, { color: colors.textSecondary }]}>
                📍 {plan.location}
              </Text>
            </View>
          </View>
          
          <View style={styles.layoverMeta}>
            <View style={styles.timeInfo}>
              <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>Duration</Text>
              <Text style={[styles.timeValue, { color: colors.text }]}>
                {plan.duration} min
              </Text>
            </View>
            <View style={styles.timeInfo}>
              <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>Walking Time</Text>
              <Text style={[styles.timeValue, { color: colors.text }]}>
                {plan.walkingTime} min
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.navigateButton, { backgroundColor: colors.primary }]}
              onPress={() => Alert.alert('Navigation', `Navigating to ${plan.title}...`)}
            >
              <IconSymbol name="location.fill" size={16} color="#FFFFFF" />
              <Text style={styles.navigateButtonText}>Navigate</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>
      ))}
    </ScrollView>
  );

  const renderFlightsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: colors.surface, color: colors.text }]}
          placeholder="Search flights..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <IconSymbol name="magnifyingglass" size={20} color={colors.textSecondary} style={styles.searchIcon} />
      </View>
      
      <FlatList
        data={filteredFlights}
        keyExtractor={(item) => item.flightNumber}
        renderItem={({ item }) => (
          <GlassCard style={styles.flightCard}>
            <View style={styles.flightHeader}>
              <View style={styles.flightInfo}>
                <Text style={[styles.flightNumber, { color: colors.text }]}>
                  {item.flightNumber}
                </Text>
                <Text style={[styles.airline, { color: colors.textSecondary }]}>
                  {item.airline}
                </Text>
              </View>
              <View style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(item.status) + '20' }
              ]}>
                <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                  {item.status}
                  {item.delay && ` (+${item.delay}m)`}
                </Text>
              </View>
            </View>
            
            <View style={styles.flightDetails}>
              <View style={styles.flightDetail}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Destination</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {item.destination}
                </Text>
              </View>
              <View style={styles.flightDetail}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Departure</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {item.departure}
                </Text>
              </View>
              <View style={styles.flightDetail}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Gate</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {item.gate}
                </Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={[styles.gateNavigateButton, { backgroundColor: colors.primary }]}
              onPress={() => Alert.alert('AR Gate Finder', `Navigating to Gate ${item.gate}...`)}
            >
              <IconSymbol name="location.circle" size={16} color="#FFFFFF" />
              <Text style={styles.gateNavigateText}>Navigate to Gate</Text>
            </TouchableOpacity>
          </GlassCard>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderGatesTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <GlassCard style={styles.featureCard}>
        <View style={styles.cardHeader}>
          <IconSymbol name="camera.viewfinder" size={32} color={colors.primary} />
          <View style={styles.cardInfo}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              AR Gate Finder
            </Text>
            <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
              Use augmented reality to find your gate quickly
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={[styles.scanButton, { backgroundColor: colors.primary }]}
          onPress={() => {
            Alert.alert('AR Gate Finder', 'Opening AR navigation to your gate...');
            // Integration with AR navigator would go here
          }}
        >
          <IconSymbol name="arkit" size={20} color="#FFFFFF" />
          <Text style={styles.scanButtonText}>Open AR Gate Finder</Text>
        </TouchableOpacity>
      </GlassCard>
      
      <GlassCard style={styles.featureCard}>
        <View style={styles.cardHeader}>
          <IconSymbol name="suitcase" size={32} color={colors.secondary} />
          <View style={styles.cardInfo}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              Luggage Tracker
            </Text>
            <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
              Track your luggage in real-time
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={[styles.scanButton, { backgroundColor: colors.secondary }]}
          onPress={() => Alert.alert('Luggage Tracker', 'Luggage tracking feature coming soon!')}
        >
          <IconSymbol name="location.fill" size={20} color="#FFFFFF" />
          <Text style={styles.scanButtonText}>Track Luggage</Text>
        </TouchableOpacity>
      </GlassCard>
    </ScrollView>
  );

  const renderPassportScanner = () => (
    <Modal
      visible={showPassportScanner}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <View style={[styles.scannerContainer, { backgroundColor: colors.background }]}>
        {showCamera && (
          <CameraView
            style={styles.camera}
            facing="back"
          >
            <View style={styles.scannerOverlay}>
              <View style={styles.scannerFrame} />
              <Text style={[styles.scannerInstructions, { color: colors.text }]}>
                Position passport within the frame
              </Text>
              
              <TouchableOpacity
                style={[styles.captureButton, { backgroundColor: colors.primary }]}
                onPress={simulatePassportScan}
              >
                <IconSymbol name="camera.fill" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </CameraView>
        )}
        
        <TouchableOpacity
          style={styles.closeScanner}
          onPress={() => {
            setShowCamera(false);
            setShowPassportScanner(false);
          }}
        >
          <IconSymbol name="xmark" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </Modal>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.surface }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onClose}
          >
            <IconSymbol name="xmark" size={24} color={colors.text} />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Airport Features
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              {airportCode} • Terminal {currentTerminal}
            </Text>
          </View>

          <TouchableOpacity style={styles.settingsButton}>
            <IconSymbol name="gear" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View style={[styles.tabNav, { backgroundColor: colors.surface }]}>
          {[
            { key: 'passport', label: 'Passport', icon: 'doc.text' },
            { key: 'layover', label: 'Layover', icon: 'clock' },
            { key: 'flights', label: 'Flights', icon: 'airplane' },
            { key: 'gates', label: 'Gates', icon: 'location' }
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabButton,
                activeTab === tab.key && { backgroundColor: colors.primary + '20' }
              ]}
              onPress={() => setActiveTab(tab.key as any)}
            >
              <IconSymbol 
                name={tab.icon as IconSymbolName} 
                size={20} 
                color={activeTab === tab.key ? colors.primary : colors.textSecondary} 
              />
              <Text style={[
                styles.tabLabel,
                { color: activeTab === tab.key ? colors.primary : colors.textSecondary }
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {activeTab === 'passport' && renderPassportTab()}
        {activeTab === 'layover' && renderLayoverTab()}
        {activeTab === 'flights' && renderFlightsTab()}
        {activeTab === 'gates' && renderGatesTab()}

        {/* Passport Scanner Modal */}
        {renderPassportScanner()}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingTop: Spacing.xl,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  settingsButton: {
    padding: Spacing.xs,
  },
  tabNav: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: 8,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: Spacing.md,
  },
  featureCard: {
    marginVertical: Spacing.sm,
    padding: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  cardDescription: {
    fontSize: 14,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: 8,
    gap: Spacing.sm,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  passportDataCard: {
    marginVertical: Spacing.sm,
    padding: Spacing.md,
  },
  passportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  validityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  validityText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  passportDetails: {
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionButton: {
    paddingVertical: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  layoverCard: {
    marginVertical: Spacing.sm,
    padding: Spacing.md,
  },
  layoverHeader: {
    marginBottom: Spacing.md,
  },
  layoverInfo: {
    flex: 1,
  },
  layoverTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    gap: Spacing.sm,
  },
  layoverTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  recommendedBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 10,
  },
  recommendedText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  layoverDescription: {
    fontSize: 14,
    marginBottom: Spacing.xs,
  },
  layoverLocation: {
    fontSize: 12,
  },
  layoverMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeInfo: {
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 12,
  },
  timeValue: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
  },
  navigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    gap: Spacing.xs,
  },
  navigateButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  searchContainer: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  searchInput: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    fontSize: 16,
    paddingRight: 40,
  },
  searchIcon: {
    position: 'absolute',
    right: Spacing.md,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  flightCard: {
    marginVertical: Spacing.sm,
    padding: Spacing.md,
  },
  flightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  flightInfo: {
    flex: 1,
  },
  flightNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  airline: {
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  flightDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  flightDetail: {
    alignItems: 'center',
  },
  gateNavigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    gap: Spacing.xs,
  },
  gateNavigateText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  scannerContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  scannerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrame: {
    width: 280,
    height: 180,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: Spacing.lg,
  },
  scannerInstructions: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeScanner: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
