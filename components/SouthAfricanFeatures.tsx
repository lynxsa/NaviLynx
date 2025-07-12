import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  RefreshControl,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  southAfricanMarketService,
  MobileMoneyProvider,
  LoadSheddingSchedule,
  VenueLoadSheddingStatus,
  SafetyAlert,
  LocalVendor
} from '../services/southAfricanMarketService';

interface SouthAfricanFeaturesProps {
  visible: boolean;
  onClose: () => void;
  venueId?: string;
  currentLocation?: { lat: number; lng: number };
}

export function SouthAfricanFeatures({ 
  visible, 
  onClose, 
  venueId,
  currentLocation 
}: SouthAfricanFeaturesProps) {
  const [activeTab, setActiveTab] = useState<'payments' | 'loadshedding' | 'safety' | 'vendors'>('payments');
  const [paymentProviders, setPaymentProviders] = useState<MobileMoneyProvider[]>([]);
  const [loadSheddingStatus, setLoadSheddingStatus] = useState<LoadSheddingSchedule | null>(null);
  const [venueLoadShedding, setVenueLoadShedding] = useState<VenueLoadSheddingStatus | null>(null);
  const [safetyAlerts, setSafetyAlerts] = useState<SafetyAlert[]>([]);
  const [localVendors, setLocalVendors] = useState<LocalVendor[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<MobileMoneyProvider | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showVendorModal, setShowVendorModal] = useState<LocalVendor | null>(null);

  const loadSouthAfricanData = useCallback(async () => {
    try {
      setRefreshing(true);
      // Load payment providers
      const providers = southAfricanMarketService.getPaymentProviders();
      setPaymentProviders(providers);

      // Load load shedding data
      const loadShedding = await southAfricanMarketService.getLoadSheddingStatus(currentLocation);
      setLoadSheddingStatus(loadShedding);

      if (venueId) {
        const venueStatus = await southAfricanMarketService.getVenueLoadSheddingStatus(venueId);
        setVenueLoadShedding(venueStatus);
      }

      // Load safety alerts
      if (currentLocation) {
        const alerts = await southAfricanMarketService.getSafetyAlerts(currentLocation);
        setSafetyAlerts(alerts);
      }

      // Load local vendors
      const vendors = southAfricanMarketService.getLocalVendors(venueId);
      setLocalVendors(vendors);
    } catch (error) {
      console.error('Error loading South African market data:', error);
      Alert.alert('Error', 'Could not load market data.');
    } finally {
      setRefreshing(false);
    }
  }, [currentLocation, venueId]);

  useEffect(() => {
    if (visible) {
      loadSouthAfricanData();
    }
  }, [visible, loadSouthAfricanData]);

  const handleRefresh = async () => {
    await loadSouthAfricanData();
  };

  const triggerPanicButton = async () => {
    Alert.alert(
      'Emergency Alert',
      'This will immediately alert emergency services and send your location. Only use in genuine emergencies.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send Emergency Alert', 
          style: 'destructive',
          onPress: async () => {
            if (currentLocation) {
              const result = await southAfricanMarketService.triggerPanicButton(currentLocation);
              if (result.success) {
                Alert.alert(
                  'Emergency Alert Sent',
                  `Alert ID: ${result.alertId}\nEstimated response time: ${result.estimatedResponseTime} minutes\n\nStay calm and remain in a safe location.`
                );
              } else {
                Alert.alert('Error', 'Failed to send emergency alert. Please call 10111 directly.');
              }
            }
          }
        }
      ]
    );
  };

  const PaymentsTab = () => (
    <ScrollView 
      style={styles.tabContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >
      <Text style={styles.sectionTitle}>Mobile Money & Payments</Text>
      <Text style={styles.sectionSubtitle}>Local South African payment methods</Text>

      {paymentProviders.map((provider) => (
        <View key={provider.id} style={styles.paymentCard}>
          <View style={styles.paymentHeader}>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentName}>{provider.name}</Text>
              <Text style={styles.paymentType}>{provider.type.toUpperCase()}</Text>
            </View>
            <View style={[styles.paymentTypeBadge, { 
              backgroundColor: provider.type === 'mobile' ? '#34C759' : '#007AFF' 
            }]}>
              <Ionicons 
                name={provider.type === 'mobile' ? 'phone-portrait' : 'card'} 
                size={16} 
                color="white" 
              />
            </View>
          </View>

          {provider.fees && (
            <View style={styles.paymentDetails}>
              <Text style={styles.paymentDetailTitle}>Fees & Limits</Text>
              <View style={styles.paymentDetailRow}>
                <Text style={styles.paymentDetailLabel}>Transaction Fee:</Text>
                <Text style={styles.paymentDetailValue}>
                  {(provider.fees.transaction * 100).toFixed(1)}%
                </Text>
              </View>
              {provider.limits && (
                <View style={styles.paymentDetailRow}>
                  <Text style={styles.paymentDetailLabel}>Daily Limit:</Text>
                  <Text style={styles.paymentDetailValue}>
                    R {provider.limits.daily.toLocaleString()}
                  </Text>
                </View>
              )}
            </View>
          )}

          {provider.supportedBanks && (
            <View style={styles.supportedBanks}>
              <Text style={styles.supportedBanksTitle}>Supported Banks:</Text>
              <Text style={styles.supportedBanksList}>
                {provider.supportedBanks.join(', ')}
              </Text>
            </View>
          )}

          <TouchableOpacity 
            style={styles.setupButton}
            onPress={() => {
              Alert.alert(
                'Setup Payment Method',
                `Setup ${provider.name} for quick payments at participating venues.`,
                [
                  { text: 'Cancel' },
                  { text: 'Setup', onPress: () => {
                    setSelectedFeature(provider);
                    setIsModalVisible(true);
                  }}
                ]
              );
            }}
          >
            <Ionicons name="add-circle" size={16} color="#007AFF" />
            <Text style={styles.setupButtonText}>Setup {provider.name}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );

  const LoadSheddingTab = () => (
    <ScrollView 
      style={styles.tabContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >
      <Text style={styles.sectionTitle}>Load Shedding Status</Text>
      
      {loadSheddingStatus && (
        <>
          <View style={styles.loadSheddingCard}>
            <View style={styles.loadSheddingHeader}>
              <View>
                <Text style={styles.loadSheddingArea}>{loadSheddingStatus.area}</Text>
                <Text style={styles.loadSheddingStage}>Stage {loadSheddingStatus.stage}</Text>
              </View>
              <View style={[styles.powerStatusBadge, {
                backgroundColor: loadSheddingStatus.currentStatus === 'on' ? '#34C759' : '#FF3B30'
              }]}>
                <Ionicons 
                  name={loadSheddingStatus.currentStatus === 'on' ? 'flash' : 'flash-off'} 
                  size={20} 
                  color="white" 
                />
                <Text style={styles.powerStatusText}>
                  {loadSheddingStatus.currentStatus.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.nextEventContainer}>
              <Text style={styles.nextEventTitle}>Next Event</Text>
              <Text style={styles.nextEventTime}>
                {loadSheddingStatus.nextEvent.type === 'start' ? 'Power Off' : 'Power On'} at{' '}
                {loadSheddingStatus.nextEvent.time.toLocaleTimeString('en-ZA', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
              <Text style={styles.nextEventDuration}>
                Duration: {loadSheddingStatus.nextEvent.duration} hours
              </Text>
            </View>
          </View>

          {venueLoadShedding && (
            <View style={styles.venueLoadSheddingCard}>
              <Text style={styles.venueLoadSheddingTitle}>Venue Power Status</Text>
              <Text style={styles.venueLoadSheddingName}>{venueLoadShedding.venueName}</Text>
              
              <View style={styles.venueStatusRow}>
                <Ionicons name="business" size={16} color="#666" />
                <Text style={styles.venueStatusText}>
                  Power: {venueLoadShedding.currentPowerStatus.toUpperCase()}
                </Text>
              </View>

              {venueLoadShedding.hasBackupPower && (
                <>
                  <View style={styles.venueStatusRow}>
                    <Ionicons name="battery-charging" size={16} color="#666" />
                    <Text style={styles.venueStatusText}>
                      Backup Power: {venueLoadShedding.backupCapacity}%
                    </Text>
                  </View>
                  
                  {venueLoadShedding.estimatedBackupRemaining && (
                    <View style={styles.venueStatusRow}>
                      <Ionicons name="time" size={16} color="#666" />
                      <Text style={styles.venueStatusText}>
                        Backup Remaining: {venueLoadShedding.estimatedBackupRemaining}h
                      </Text>
                    </View>
                  )}
                </>
              )}

              <Text style={styles.criticalServicesTitle}>Critical Services Available:</Text>
              <View style={styles.criticalServices}>
                {venueLoadShedding.criticalServices.map((service, index) => (
                  <View key={index} style={styles.serviceTag}>
                    <Text style={styles.serviceTagText}>{service}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <Text style={styles.scheduleTitle}>Today&apos;s Schedule</Text>
          {loadSheddingStatus.schedule[0]?.slots.map((slot, index) => (
            <View key={index} style={styles.scheduleSlot}>
              <View style={styles.scheduleTime}>
                <Text style={styles.scheduleTimeText}>{slot.start} - {slot.end}</Text>
                <Text style={styles.scheduleStage}>Stage {slot.stage}</Text>
              </View>
              <Ionicons name="flash-off" size={20} color="#FF3B30" />
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );

  const SafetyTab = () => (
    <ScrollView 
      style={styles.tabContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >
      <Text style={styles.sectionTitle}>Safety & Security</Text>
      
      <View style={styles.safetyControls}>
        <View style={styles.safetyRow}>
          <Text style={styles.safetyLabel}>Safety Alerts</Text>
          <Switch
            value={alertsEnabled}
            onValueChange={setAlertsEnabled}
            trackColor={{ false: '#767577', true: '#34C759' }}
            thumbColor={alertsEnabled ? '#ffffff' : '#f4f3f4'}
          />
        </View>
        
        <TouchableOpacity style={styles.panicButton} onPress={triggerPanicButton}>
          <Ionicons name="warning" size={24} color="white" />
          <Text style={styles.panicButtonText}>EMERGENCY ALERT</Text>
          <Text style={styles.panicButtonSubtext}>Police • Medical • Security</Text>
        </TouchableOpacity>
      </View>

      {alertsEnabled && (
        <>
          <Text style={styles.sectionSubtitle}>Active Safety Alerts</Text>
          {safetyAlerts.map((alert) => (
            <View key={alert.id} style={[
              styles.alertCard,
              { borderLeftColor: getSeverityColor(alert.severity) }
            ]}>
              <View style={styles.alertHeader}>
                <Ionicons 
                  name={getAlertIcon(alert.type)} 
                  size={20} 
                  color={getSeverityColor(alert.severity)} 
                />
                <View style={styles.alertInfo}>
                  <Text style={styles.alertType}>
                    {alert.type.toUpperCase()} - {alert.severity.toUpperCase()}
                  </Text>
                  <Text style={styles.alertTime}>
                    {alert.timestamp.toLocaleTimeString('en-ZA')}
                  </Text>
                </View>
              </View>
              <Text style={styles.alertMessage}>{alert.message}</Text>
              <Text style={styles.alertLocation}>📍 {alert.location.description}</Text>
            </View>
          ))}
        </>
      )}

      <View style={styles.emergencyContacts}>
        <Text style={styles.emergencyTitle}>Emergency Contacts</Text>
        <TouchableOpacity style={styles.emergencyContact}>
          <Ionicons name="call" size={20} color="#FF3B30" />
          <Text style={styles.emergencyContactText}>Police: 10111</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.emergencyContact}>
          <Ionicons name="medical" size={20} color="#34C759" />
          <Text style={styles.emergencyContactText}>Medical: 10177</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.emergencyContact}>
          <Ionicons name="flame" size={20} color="#FF9500" />
          <Text style={styles.emergencyContactText}>Fire: 10111</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const VendorsTab = () => {
    const filteredVendors = searchQuery 
      ? localVendors.filter(vendor =>
          vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vendor.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : localVendors;

    return (
      <View style={styles.tabContent}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search local vendors..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView 
          style={styles.vendorsList}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        >
          <Text style={styles.sectionTitle}>Local Vendor Marketplace</Text>
          <Text style={styles.sectionSubtitle}>Support local South African businesses</Text>

          {filteredVendors.map((vendor) => (
            <TouchableOpacity 
              key={vendor.id} 
              style={styles.vendorCard}
              onPress={() => setShowVendorModal(vendor)}
            >
              <View style={styles.vendorHeader}>
                <View style={styles.vendorInfo}>
                  <Text style={styles.vendorName}>{vendor.name}</Text>
                  <Text style={styles.vendorCategory}>{vendor.category.toUpperCase()}</Text>
                </View>
                <View style={styles.vendorRating}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.vendorRatingText}>{vendor.rating}</Text>
                </View>
              </View>

              <Text style={styles.vendorDescription}>{vendor.description}</Text>
              <Text style={styles.vendorOwner}>By {vendor.owner}</Text>

              {vendor.supportProgram && (
                <View style={[styles.supportBadge, {
                  backgroundColor: getSupportProgramColor(vendor.supportProgram)
                }]}>
                  <Ionicons name="heart" size={12} color="white" />
                  <Text style={styles.supportBadgeText}>
                    {vendor.supportProgram.replace('-', ' ').toUpperCase()}
                  </Text>
                </View>
              )}

              <View style={styles.vendorFooter}>
                <Text style={styles.vendorLocation}>📍 {vendor.location.address}</Text>
                <View style={styles.vendorPayments}>
                  {vendor.paymentMethods.slice(0, 3).map((method, index) => (
                    <Text key={index} style={styles.paymentMethod}>{method}</Text>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#FF3B30';
      case 'high': return '#FF9500';
      case 'medium': return '#FF6B35';
      case 'low': return '#34C759';
      default: return '#007AFF';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'crime': return 'shield-outline';
      case 'traffic': return 'car';
      case 'weather': return 'thunderstorm';
      case 'emergency': return 'warning';
      default: return 'information-circle';
    }
  };

  const getSupportProgramColor = (program: string) => {
    switch (program) {
      case 'black-owned': return '#34C759';
      case 'women-owned': return '#FF6B35';
      case 'youth-owned': return '#007AFF';
      case 'township-business': return '#FF9500';
      default: return '#8E8E93';
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#FF6B35', '#F7931E']}
        style={styles.header}
      >
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Mzansi Features</Text>
          <Text style={styles.headerSubtitle}>🇿🇦 Made for South Africa</Text>
        </View>
        <View style={styles.headerRight} />
      </LinearGradient>

      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        {[
          { key: 'payments', icon: 'card', label: 'Payments' },
          { key: 'loadshedding', icon: 'flash', label: 'Load Shedding' },
          { key: 'safety', icon: 'shield', label: 'Safety' },
          { key: 'vendors', icon: 'storefront', label: 'Local Vendors' }
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabButton, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <Ionicons 
              name={tab.icon as any} 
              size={18} 
              color={activeTab === tab.key ? '#FF6B35' : '#666'} 
            />
            <Text style={[
              styles.tabLabel,
              activeTab === tab.key && styles.activeTabLabel
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      {activeTab === 'payments' && <PaymentsTab />}
      {activeTab === 'loadshedding' && <LoadSheddingTab />}
      {activeTab === 'safety' && <SafetyTab />}
      {activeTab === 'vendors' && <VendorsTab />}

      {/* Vendor Details Modal */}
      <Modal
        visible={!!showVendorModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        {showVendorModal && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{showVendorModal.name}</Text>
              <TouchableOpacity onPress={() => setShowVendorModal(null)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent}>
              <Text style={styles.vendorModalDescription}>{showVendorModal.description}</Text>
              <Text style={styles.vendorModalOwner}>Owned by {showVendorModal.owner}</Text>
              
              {showVendorModal.products.length > 0 && (
                <>
                  <Text style={styles.productsTitle}>Products & Services</Text>
                  {showVendorModal.products.map((product) => (
                    <View key={product.id} style={styles.productCard}>
                      <Text style={styles.productName}>{product.name}</Text>
                      <Text style={styles.productPrice}>R {product.price}</Text>
                      {product.description && (
                        <Text style={styles.productDescription}>{product.description}</Text>
                      )}
                    </View>
                  ))}
                </>
              )}

              <View style={styles.vendorActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="call" size={20} color="#34C759" />
                  <Text style={styles.actionButtonText}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
                  <Text style={styles.actionButtonText}>WhatsApp</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="heart" size={20} color="#FF6B35" />
                  <Text style={styles.actionButtonText}>Support</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        )}
      </Modal>

      {/* Payment Setup Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        {selectedFeature && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Setup {selectedFeature.name}</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent}>
              <Text style={styles.modalDescription}>
                Follow the instructions to setup {selectedFeature.name} for quick payments.
              </Text>

              {/* Add specific setup instructions here */}
              <View style={styles.setupInstructions}>
                <Text style={styles.instructionStep}>1. Download the {selectedFeature.name} app.</Text>
                <Text style={styles.instructionStep}>2. Create an account or log in.</Text>
                <Text style={styles.instructionStep}>3. Link your bank account or card.</Text>
                <Text style={styles.instructionStep}>4. Verify your identity (if required).</Text>
                <Text style={styles.instructionStep}>5. Start using {selectedFeature.name} for payments.</Text>
              </View>

              <TouchableOpacity style={styles.doneButton} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.doneButtonText}>Got It!</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
  },
  headerRight: {
    width: 40,
  },
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF6B35',
  },
  tabLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  activeTabLabel: {
    color: '#FF6B35',
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  paymentCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  paymentType: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  paymentTypeBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentDetails: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  paymentDetailTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  paymentDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  paymentDetailLabel: {
    fontSize: 14,
    color: '#666',
  },
  paymentDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  supportedBanks: {
    marginBottom: 12,
  },
  supportedBanksTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  supportedBanksList: {
    fontSize: 14,
    color: '#666',
  },
  setupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f8ff',
    padding: 10,
    borderRadius: 8,
    gap: 6,
  },
  setupButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  loadSheddingCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadSheddingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  loadSheddingArea: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  loadSheddingStage: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  powerStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  powerStatusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  nextEventContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
  },
  nextEventTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  nextEventTime: {
    fontSize: 16,
    color: '#FF9500',
    fontWeight: '600',
  },
  nextEventDuration: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  venueLoadSheddingCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  venueLoadSheddingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  venueLoadSheddingName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  venueStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  venueStatusText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  criticalServicesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    marginBottom: 8,
  },
  criticalServices: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  serviceTag: {
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  serviceTagText: {
    fontSize: 12,
    color: '#007AFF',
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  scheduleSlot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  scheduleTime: {
    flex: 1,
  },
  scheduleTimeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  scheduleStage: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  safetyControls: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  safetyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  safetyLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  panicButton: {
    alignItems: 'center',
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 12,
    gap: 4,
  },
  panicButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  panicButtonSubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  alertCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
    borderLeftWidth: 4,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertInfo: {
    flex: 1,
    marginLeft: 12,
  },
  alertType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  alertTime: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  alertMessage: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 6,
  },
  alertLocation: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  emergencyContacts: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  emergencyContact: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 8,
  },
  emergencyContactText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  vendorsList: {
    flex: 1,
  },
  vendorCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vendorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  vendorInfo: {
    flex: 1,
  },
  vendorName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  vendorCategory: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  vendorRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  vendorRatingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  vendorDescription: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 6,
  },
  vendorOwner: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  supportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
    gap: 4,
  },
  supportBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  vendorFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vendorLocation: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  vendorPayments: {
    flexDirection: 'row',
    gap: 4,
  },
  paymentMethod: {
    fontSize: 10,
    color: '#007AFF',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  vendorModalDescription: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 8,
  },
  vendorModalOwner: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  productsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  productCard: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6B35',
    marginTop: 4,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  vendorActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  actionButton: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    minWidth: 80,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#333',
    marginTop: 4,
    fontWeight: '600',
  },
  modalDescription: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 16,
  },
  setupInstructions: {
    marginBottom: 16,
  },
  instructionStep: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  doneButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
