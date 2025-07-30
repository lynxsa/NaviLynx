import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';

interface QueueInfo {
  id: string;
  department: string;
  currentNumber: number;
  estimatedWaitTime: number; // in minutes
  patientsAhead: number;
  status: 'open' | 'closed' | 'emergency-only';
  level: string;
  specialInstructions?: string;
}

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  department: string;
  appointmentTime: string;
  roomNumber: string;
  level: string;
  status: 'scheduled' | 'checked-in' | 'in-progress' | 'completed' | 'cancelled';
  estimatedDuration: number;
  notes?: string;
}

interface MedicalProfile {
  patientId: string;
  fullName: string;
  medicalAidNumber: string;
  bloodType: string;
  allergies: string[];
  chronicConditions: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  nextOfKin: {
    name: string;
    phone: string;
    relationship: string;
  };
}

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  currentLocation: string;
  status: 'waiting' | 'in-consultation' | 'admitted' | 'discharged';
  lastUpdate: Date;
  contactPhone: string;
}

interface HospitalNavigationProps {
  visible: boolean;
  onClose: () => void;
  hospitalId?: string;
  hospitalName?: string;
  onNavigate?: (destination: string) => void;
}

export function HospitalNavigation({ 
  visible, 
  onClose, 
  hospitalId, 
  hospitalName = 'Hospital',
  onNavigate 
}: HospitalNavigationProps) {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<'queue' | 'appointments' | 'profile' | 'family'>('queue');
  const [queueData, setQueueData] = useState<QueueInfo[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medicalProfile, setMedicalProfile] = useState<MedicalProfile | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showQueueDetails, setShowQueueDetails] = useState<QueueInfo | null>(null);

  useEffect(() => {
    if (visible) {
      loadHospitalData();
    }
  }, [visible]);

  const loadHospitalData = () => {
    // Mock queue data
    setQueueData([
      {
        id: '1',
        department: 'Emergency Department',
        currentNumber: 47,
        estimatedWaitTime: 120,
        patientsAhead: 8,
        status: 'open',
        level: 'Ground Floor',
        specialInstructions: 'Triage in progress - critical cases prioritized'
      },
      {
        id: '2',
        department: 'General Outpatient',
        currentNumber: 23,
        estimatedWaitTime: 45,
        patientsAhead: 3,
        status: 'open',
        level: 'Level 1'
      },
      {
        id: '3',
        department: 'Radiology',
        currentNumber: 15,
        estimatedWaitTime: 30,
        patientsAhead: 2,
        status: 'open',
        level: 'Level 2'
      },
      {
        id: '4',
        department: 'Cardiology',
        currentNumber: 8,
        estimatedWaitTime: 25,
        patientsAhead: 1,
        status: 'open',
        level: 'Level 3'
      },
      {
        id: '5',
        department: 'Pediatrics',
        currentNumber: 12,
        estimatedWaitTime: 0,
        patientsAhead: 0,
        status: 'closed',
        level: 'Level 2',
        specialInstructions: 'Closed for lunch - reopens at 14:00'
      }
    ]);

    // Mock appointments data
    setAppointments([
      {
        id: '1',
        patientName: 'Thabo Mthembu',
        doctorName: 'Dr. Sarah Johnson',
        department: 'Cardiology',
        appointmentTime: '2024-01-15T10:30:00',
        roomNumber: 'C301',
        level: 'Level 3',
        status: 'scheduled',
        estimatedDuration: 30,
        notes: 'Follow-up consultation for hypertension'
      },
      {
        id: '2',
        patientName: 'Nomsa Dlamini',
        doctorName: 'Dr. Michael Chen',
        department: 'Radiology',
        appointmentTime: '2024-01-15T14:00:00',
        roomNumber: 'R205',
        level: 'Level 2',
        status: 'checked-in',
        estimatedDuration: 45,
        notes: 'CT scan - please arrive 15 minutes early'
      }
    ]);

    // Mock medical profile
    setMedicalProfile({
      patientId: 'P001234',
      fullName: 'Thabo Mthembu',
      medicalAidNumber: 'DISC001234567',
      bloodType: 'O+',
      allergies: ['Penicillin', 'Shellfish'],
      chronicConditions: ['Hypertension', 'Type 2 Diabetes'],
      emergencyContact: {
        name: 'Nomsa Mthembu',
        phone: '+27 82 123 4567',
        relationship: 'Spouse'
      },
      nextOfKin: {
        name: 'Nomsa Mthembu',
        phone: '+27 82 123 4567',
        relationship: 'Spouse'
      }
    });

    // Mock family tracking data
    setFamilyMembers([
      {
        id: '1',
        name: 'Nomsa Mthembu',
        relationship: 'Spouse',
        currentLocation: 'Radiology Waiting Room - Level 2',
        status: 'waiting',
        lastUpdate: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
        contactPhone: '+27 82 123 4567'
      },
      {
        id: '2',
        name: 'Junior Mthembu',
        relationship: 'Son',
        currentLocation: 'Pediatrics Ward - Level 2',
        status: 'admitted',
        lastUpdate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        contactPhone: '+27 83 987 6543'
      }
    ]);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadHospitalData();
      setRefreshing(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return colors.success;
      case 'closed': return colors.error;
      case 'emergency-only': return colors.warning;
      case 'scheduled': return colors.primary;
      case 'checked-in': return colors.warning;
      case 'in-progress': return colors.success;
      case 'completed': return colors.textSecondary;
      case 'cancelled': return colors.error;
      case 'waiting': return colors.warning;
      case 'admitted': return colors.secondary;
      case 'discharged': return colors.success;
      default: return colors.textSecondary;
    }
  };

  const formatWaitTime = (minutes: number) => {
    if (minutes === 0) return 'No wait';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const navigateToLocation = (location: string, level: string) => {
    onNavigate?.(`${location} - ${level}`);
    Alert.alert('Navigation Started', `Navigating to ${location} on ${level}`);
  };

  const QueueTab = () => (
    <ScrollView 
      style={styles.tabContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <Text style={styles.sectionTitle}>Real-Time Queue Status</Text>
      <Text style={styles.sectionSubtitle}>
        Live updates • Last refreshed: {new Date().toLocaleTimeString('en-ZA')}
      </Text>

      {queueData.map((queue) => (
        <TouchableOpacity 
          key={queue.id} 
          style={styles.queueCard}
          onPress={() => setShowQueueDetails(queue)}
        >
          <View style={styles.queueHeader}>
            <View>
              <Text style={styles.queueDepartment}>{queue.department}</Text>
              <Text style={styles.queueLocation}>{queue.level}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(queue.status) }]}>
              <Text style={styles.statusText}>
                {queue.status.replace('-', ' ').toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.queueInfo}>
            <View style={styles.queueStat}>
              <Text style={styles.queueNumber}>{queue.currentNumber}</Text>
              <Text style={styles.queueLabel}>Current #</Text>
            </View>
            <View style={styles.queueStat}>
              <Text style={styles.queueNumber}>{queue.patientsAhead}</Text>
              <Text style={styles.queueLabel}>Ahead of You</Text>
            </View>
            <View style={styles.queueStat}>
              <Text style={styles.queueNumber}>{formatWaitTime(queue.estimatedWaitTime)}</Text>
              <Text style={styles.queueLabel}>Est. Wait</Text>
            </View>
          </View>

          {queue.specialInstructions && (
            <View style={styles.instructionsContainer}>
              <Ionicons name="information-circle" size={16} color={colors.warning} />
              <Text style={styles.instructionsText}>{queue.specialInstructions}</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.navigateButton}
            onPress={() => navigateToLocation(queue.department, queue.level)}
          >
            <Ionicons name="navigate" size={16} color={colors.primary} />
            <Text style={styles.navigateButtonText}>Navigate Here</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const AppointmentsTab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Your Appointments</Text>
      <Text style={styles.sectionSubtitle}>Today&apos;s Schedule</Text>

      {appointments.map((appointment) => (
        <View key={appointment.id} style={styles.appointmentCard}>
          <View style={styles.appointmentHeader}>
            <View>
              <Text style={styles.appointmentTime}>
                {new Date(appointment.appointmentTime).toLocaleTimeString('en-ZA', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
              <Text style={styles.appointmentDepartment}>{appointment.department}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
              <Text style={styles.statusText}>
                {appointment.status.replace('-', ' ').toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.appointmentDetails}>
            <View style={styles.appointmentRow}>
              <Ionicons name="person" size={16} color={colors.textSecondary} />
              <Text style={styles.appointmentText}>Dr. {appointment.doctorName}</Text>
            </View>
            <View style={styles.appointmentRow}>
              <Ionicons name="location" size={16} color={colors.textSecondary} />
              <Text style={styles.appointmentText}>
                Room {appointment.roomNumber} - {appointment.level}
              </Text>
            </View>
            <View style={styles.appointmentRow}>
              <Ionicons name="time" size={16} color={colors.textSecondary} />
              <Text style={styles.appointmentText}>~{appointment.estimatedDuration} minutes</Text>
            </View>
          </View>

          {appointment.notes && (
            <Text style={styles.appointmentNotes}>{appointment.notes}</Text>
          )}

          <View style={styles.appointmentActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigateToLocation(`Room ${appointment.roomNumber}`, appointment.level)}
            >
              <Ionicons name="navigate" size={16} color={colors.primary} />
              <Text style={styles.actionButtonText}>Navigate</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="calendar" size={16} color={colors.primary} />
              <Text style={styles.actionButtonText}>Reschedule</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const ProfileTab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Medical Profile</Text>
      
      {medicalProfile && (
        <>
          <View style={styles.profileCard}>
            <Text style={styles.profileName}>{medicalProfile.fullName}</Text>
            <Text style={styles.profileId}>Patient ID: {medicalProfile.patientId}</Text>
            <Text style={styles.profileMedicalAid}>Medical Aid: {medicalProfile.medicalAidNumber}</Text>
          </View>

          <View style={styles.profileSection}>
            <Text style={styles.profileSectionTitle}>Basic Information</Text>
            <View style={styles.profileRow}>
              <Text style={styles.profileLabel}>Blood Type:</Text>
              <Text style={styles.profileValue}>{medicalProfile.bloodType}</Text>
            </View>
          </View>

          <View style={styles.profileSection}>
            <Text style={styles.profileSectionTitle}>Allergies</Text>
            {medicalProfile.allergies.map((allergy, index) => (
              <View key={index} style={styles.allergyItem}>
                <Ionicons name="warning" size={16} color={colors.error} />
                <Text style={styles.allergyText}>{allergy}</Text>
              </View>
            ))}
          </View>

          <View style={styles.profileSection}>
            <Text style={styles.profileSectionTitle}>Chronic Conditions</Text>
            {medicalProfile.chronicConditions.map((condition, index) => (
              <View key={index} style={styles.conditionItem}>
                <Ionicons name="medical" size={16} color={colors.primary} />
                <Text style={styles.conditionText}>{condition}</Text>
              </View>
            ))}
          </View>

          <View style={styles.profileSection}>
            <Text style={styles.profileSectionTitle}>Emergency Contact</Text>
            <View style={styles.contactCard}>
              <Text style={styles.contactName}>{medicalProfile.emergencyContact.name}</Text>
              <Text style={styles.contactRelation}>{medicalProfile.emergencyContact.relationship}</Text>
              <TouchableOpacity style={styles.contactButton}>
                <Ionicons name="call" size={16} color={colors.primary} />
                <Text style={styles.contactPhone}>{medicalProfile.emergencyContact.phone}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );

  const FamilyTab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Family Tracker</Text>
      <Text style={styles.sectionSubtitle}>Keep track of family members in the hospital</Text>

      {familyMembers.map((member) => (
        <View key={member.id} style={styles.familyCard}>
          <View style={styles.familyHeader}>
            <View>
              <Text style={styles.familyName}>{member.name}</Text>
              <Text style={styles.familyRelation}>{member.relationship}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(member.status) }]}>
              <Text style={styles.statusText}>
                {member.status.replace('-', ' ').toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.familyDetails}>
            <View style={styles.familyRow}>
              <Ionicons name="location" size={16} color={colors.textSecondary} />
              <Text style={styles.familyText}>{member.currentLocation}</Text>
            </View>
            <View style={styles.familyRow}>
              <Ionicons name="time" size={16} color={colors.textSecondary} />
              <Text style={styles.familyText}>
                Last update: {member.lastUpdate.toLocaleTimeString('en-ZA')}
              </Text>
            </View>
          </View>

          <View style={styles.familyActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigateToLocation(member.currentLocation.split(' - ')[0], member.currentLocation.split(' - ')[1] || 'Ground Floor')}
            >
              <Ionicons name="navigate" size={16} color={colors.primary} />
              <Text style={styles.actionButtonText}>Navigate</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="call" size={16} color={colors.success} />
              <Text style={styles.actionButtonText}>Call</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  if (!visible) return null;

  const tabConfig = [
    { key: 'queue' as const, icon: 'people' as const, label: 'Queue' as const },
    { key: 'appointments' as const, icon: 'calendar' as const, label: 'Appointments' as const },
    { key: 'profile' as const, icon: 'person' as const, label: 'Profile' as const },
    { key: 'family' as const, icon: 'heart' as const, label: 'Family' as const }
  ];

  const TAB_QUEUE = 'queue';
  const TAB_APPOINTMENTS = 'appointments';
  const TAB_PROFILE = 'profile';
  const TAB_FAMILY = 'family';

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#007AFF', '#5AC8FA']}
        style={styles.header}
      >
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Hospital Navigation</Text>
          <Text style={styles.headerSubtitle}>{hospitalName}</Text>
        </View>
        <View style={styles.headerRight} />
      </LinearGradient>

      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        {tabConfig.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabButton, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <Ionicons 
              name={tab.icon as any} 
              size={20} 
              color={activeTab === tab.key ? '#007AFF' : '#666'} 
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
      {activeTab === TAB_QUEUE && <QueueTab />}
      {activeTab === TAB_APPOINTMENTS && <AppointmentsTab />}
      {activeTab === TAB_PROFILE && <ProfileTab />}
      {activeTab === TAB_FAMILY && <FamilyTab />}

      {/* Queue Details Modal */}
      <Modal
        visible={!!showQueueDetails}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        {showQueueDetails && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{showQueueDetails.department}</Text>
              <TouchableOpacity onPress={() => setShowQueueDetails(null)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent}>
              <View style={styles.queueDetailCard}>
                <Text style={styles.queueDetailTitle}>Current Status</Text>
                <View style={styles.queueDetailStats}>
                  <View style={styles.queueDetailStat}>
                    <Text style={styles.queueDetailNumber}>{showQueueDetails.currentNumber}</Text>
                    <Text style={styles.queueDetailLabel}>Now Serving</Text>
                  </View>
                  <View style={styles.queueDetailStat}>
                    <Text style={styles.queueDetailNumber}>{showQueueDetails.patientsAhead}</Text>
                    <Text style={styles.queueDetailLabel}>Patients Ahead</Text>
                  </View>
                  <View style={styles.queueDetailStat}>
                    <Text style={styles.queueDetailNumber}>{formatWaitTime(showQueueDetails.estimatedWaitTime)}</Text>
                    <Text style={styles.queueDetailLabel}>Estimated Wait</Text>
                  </View>
                </View>
              </View>
              
              {showQueueDetails.specialInstructions && (
                <View style={styles.instructionsCard}>
                  <Text style={styles.instructionsTitle}>Special Instructions</Text>
                  <Text style={styles.instructionsDetail}>{showQueueDetails.specialInstructions}</Text>
                </View>
              )}

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => {
                  navigateToLocation(showQueueDetails.department, showQueueDetails.level);
                  setShowQueueDetails(null);
                }}
              >
                <Ionicons name="navigate" size={20} color="white" />
                <Text style={styles.primaryButtonText}>Navigate to {showQueueDetails.department}</Text>
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
    color: 'rgba(255,255,255,0.8)',
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
    borderBottomColor: '#007AFF',
  },
  tabLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  activeTabLabel: {
    color: '#007AFF',
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginTop: 20,
    marginHorizontal: 20,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  queueCard: {
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
  queueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  queueDepartment: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  queueLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  queueInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  queueStat: {
    alignItems: 'center',
  },
  queueNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#007AFF',
  },
  queueLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  instructionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  instructionsText: {
    flex: 1,
    fontSize: 12,
    color: '#856404',
    marginLeft: 8,
  },
  navigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f8ff',
    padding: 8,
    borderRadius: 8,
  },
  navigateButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  appointmentCard: {
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
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  appointmentTime: {
    fontSize: 20,
    fontWeight: '700',
    color: '#007AFF',
  },
  appointmentDepartment: {
    fontSize: 16,
    color: '#333',
    marginTop: 2,
  },
  appointmentDetails: {
    marginBottom: 12,
  },
  appointmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  appointmentText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  appointmentNotes: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
    backgroundColor: '#f8f8f8',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  appointmentActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  profileCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  profileId: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  profileMedicalAid: {
    fontSize: 14,
    color: '#666',
  },
  profileSection: {
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
  profileSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileLabel: {
    fontSize: 14,
    color: '#666',
  },
  profileValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  allergyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  allergyText: {
    fontSize: 14,
    color: '#FF3B30',
    marginLeft: 8,
    fontWeight: '500',
  },
  conditionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  conditionText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  contactCard: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  contactRelation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactPhone: {
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 4,
  },
  familyCard: {
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
  familyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  familyName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  familyRelation: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  familyDetails: {
    marginBottom: 12,
  },
  familyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  familyText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  familyActions: {
    flexDirection: 'row',
    gap: 12,
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
  queueDetailCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  queueDetailTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  queueDetailStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  queueDetailStat: {
    alignItems: 'center',
  },
  queueDetailNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#007AFF',
  },
  queueDetailLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  instructionsCard: {
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 8,
  },
  instructionsDetail: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
