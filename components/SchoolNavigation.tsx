import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Classroom {
  id: string;
  roomNumber: string;
  building: string;
  floor: string;
  capacity: number;
  type: 'lecture' | 'lab' | 'seminar' | 'tutorial';
  equipment: string[];
  availability: 'available' | 'occupied' | 'reserved';
  nextAvailable?: string;
}

interface StudentSchedule {
  id: string;
  subject: string;
  time: string;
  duration: number; // minutes
  classroom: Classroom;
  lecturer: string;
  type: 'lecture' | 'tutorial' | 'practical' | 'exam';
  attendance: 'required' | 'optional';
}

interface SafetyAlert {
  id: string;
  type: 'emergency' | 'weather' | 'security' | 'maintenance';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location?: string;
  timestamp: Date;
  active: boolean;
}

interface SchoolNavigationProps {
  visible: boolean;
  onClose: () => void;
  schoolId?: string;
  schoolName?: string;
  onNavigate?: (destination: string) => void;
}

export function SchoolNavigation({ 
  visible, 
  onClose, 
  schoolId, 
  schoolName = 'School',
  onNavigate 
}: SchoolNavigationProps) {
  const [activeTab, setActiveTab] = useState<'schedule' | 'rooms' | 'safety' | 'services'>('schedule');
  const [schedule, setSchedule] = useState<StudentSchedule[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [safetyAlerts, setSafetyAlerts] = useState<SafetyAlert[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showStudentID, setShowStudentID] = useState(false);
  const [safetyMode, setSafetyMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'zu', name: 'isiZulu', flag: '🇿🇦' },
    { code: 'af', name: 'Afrikaans', flag: '🇿🇦' },
    { code: 'xh', name: 'isiXhosa', flag: '🇿🇦' },
    { code: 'st', name: 'Sesotho', flag: '🇿🇦' },
    { code: 'tn', name: 'Setswana', flag: '🇿🇦' }
  ];

  useEffect(() => {
    if (visible) {
      loadSchoolData();
    }
  }, [visible]);

  const loadSchoolData = () => {
    // Mock schedule data
    setSchedule([
      {
        id: '1',
        subject: 'Mathematics',
        time: '08:00',
        duration: 90,
        classroom: {
          id: 'c1',
          roomNumber: 'M101',
          building: 'Main Building',
          floor: 'Ground Floor',
          capacity: 40,
          type: 'lecture',
          equipment: ['Projector', 'Whiteboard', 'Computer'],
          availability: 'occupied'
        },
        lecturer: 'Mr. Ndlovu',
        type: 'lecture',
        attendance: 'required'
      },
      {
        id: '2',
        subject: 'English Literature',
        time: '10:00',
        duration: 60,
        classroom: {
          id: 'c2',
          roomNumber: 'E205',
          building: 'Arts Building',
          floor: '2nd Floor',
          capacity: 30,
          type: 'seminar',
          equipment: ['Projector', 'Audio System'],
          availability: 'available'
        },
        lecturer: 'Mrs. Johnson',
        type: 'lecture',
        attendance: 'required'
      },
      {
        id: '3',
        subject: 'Physics Laboratory',
        time: '14:00',
        duration: 120,
        classroom: {
          id: 'c3',
          roomNumber: 'S301',
          building: 'Science Block',
          floor: '3rd Floor',
          capacity: 20,
          type: 'lab',
          equipment: ['Lab Equipment', 'Safety Equipment', 'Computers'],
          availability: 'reserved'
        },
        lecturer: 'Dr. Patel',
        type: 'practical',
        attendance: 'required'
      }
    ]);

    // Mock classroom data
    setClassrooms([
      {
        id: 'c4',
        roomNumber: 'L101',
        building: 'Library Building',
        floor: 'Ground Floor',
        capacity: 50,
        type: 'lecture',
        equipment: ['Smart Board', 'Projector', 'Sound System'],
        availability: 'available'
      },
      {
        id: 'c5',
        roomNumber: 'C201',
        building: 'Computer Center',
        floor: '2nd Floor',
        capacity: 25,
        type: 'lab',
        equipment: ['30 Computers', 'Projector', 'Printer'],
        availability: 'occupied',
        nextAvailable: '15:30'
      }
    ]);

    // Mock safety alerts
    setSafetyAlerts([
      {
        id: '1',
        type: 'weather',
        title: 'Thunderstorm Warning',
        message: 'Severe thunderstorm expected between 14:00-16:00. Avoid outdoor activities.',
        severity: 'medium',
        location: 'All outdoor areas',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        active: true
      },
      {
        id: '2',
        type: 'maintenance',
        title: 'Elevator Out of Service',
        message: 'Main Building elevator is under maintenance. Use stairs or North Building elevator.',
        severity: 'low',
        location: 'Main Building',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        active: true
      }
    ]);
  };

  const getNextClass = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    for (const cls of schedule) {
      const [hours, minutes] = cls.time.split(':').map(Number);
      const classTime = hours * 60 + minutes;
      
      if (classTime > currentTime) {
        return cls;
      }
    }
    return null;
  };

  const navigateToRoom = (classroom: Classroom) => {
    const destination = `${classroom.roomNumber} - ${classroom.building}, ${classroom.floor}`;
    onNavigate?.(destination);
    Alert.alert('Navigation Started', `Navigating to ${destination}`);
  };

  const showStudentIDCard = () => {
    setShowStudentID(true);
  };

  const triggerPanicButton = () => {
    Alert.alert(
      'Emergency Alert',
      'Are you sure you want to trigger the emergency alert? This will notify security and emergency services.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Emergency', 
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Emergency Alert Sent',
              'Security and emergency services have been notified. Help is on the way. Stay in a safe location.'
            );
          }
        }
      ]
    );
  };

  const ScheduleTab = () => {
    const nextClass = getNextClass();
    
    return (
      <ScrollView style={styles.tabContent}>
        <Text style={styles.sectionTitle}>Today&apos;s Schedule</Text>
        
        {nextClass && (
          <View style={styles.nextClassCard}>
            <Text style={styles.nextClassTitle}>Next Class</Text>
            <Text style={styles.nextClassSubject}>{nextClass.subject}</Text>
            <View style={styles.nextClassDetails}>
              <View style={styles.nextClassRow}>
                <Ionicons name="time" size={16} color="#007AFF" />
                <Text style={styles.nextClassText}>
                  {nextClass.time} ({nextClass.duration} min)
                </Text>
              </View>
              <View style={styles.nextClassRow}>
                <Ionicons name="location" size={16} color="#007AFF" />
                <Text style={styles.nextClassText}>
                  {nextClass.classroom.roomNumber} - {nextClass.classroom.building}
                </Text>
              </View>
              <View style={styles.nextClassRow}>
                <Ionicons name="person" size={16} color="#007AFF" />
                <Text style={styles.nextClassText}>{nextClass.lecturer}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.navigateButton}
              onPress={() => navigateToRoom(nextClass.classroom)}
            >
              <Ionicons name="navigate" size={16} color="white" />
              <Text style={styles.navigateButtonText}>Navigate to Classroom</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.sectionSubtitle}>All Classes</Text>
        {schedule.map((cls) => (
          <View key={cls.id} style={styles.scheduleCard}>
            <View style={styles.scheduleHeader}>
              <View>
                <Text style={styles.scheduleTime}>{cls.time}</Text>
                <Text style={styles.scheduleSubject}>{cls.subject}</Text>
              </View>
              <View style={[
                styles.attendanceBadge,
                { backgroundColor: cls.attendance === 'required' ? '#FF6B35' : '#34C759' }
              ]}>
                <Text style={styles.attendanceText}>
                  {cls.attendance.toUpperCase()}
                </Text>
              </View>
            </View>
            
            <View style={styles.scheduleDetails}>
              <Text style={styles.scheduleRoom}>
                {cls.classroom.roomNumber} - {cls.classroom.building}
              </Text>
              <Text style={styles.scheduleLecturer}>{cls.lecturer}</Text>
            </View>

            <TouchableOpacity
              style={styles.smallNavigateButton}
              onPress={() => navigateToRoom(cls.classroom)}
            >
              <Ionicons name="navigate" size={14} color="#007AFF" />
              <Text style={styles.smallNavigateText}>Navigate</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    );
  };

  const RoomsTab = () => {
    const filteredRooms = classrooms.filter(room =>
      room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.building.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <View style={styles.tabContent}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search rooms..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView style={styles.roomsList}>
          <Text style={styles.sectionTitle}>Available Classrooms</Text>
          {filteredRooms.map((room) => (
            <View key={room.id} style={styles.roomCard}>
              <View style={styles.roomHeader}>
                <View>
                  <Text style={styles.roomNumber}>{room.roomNumber}</Text>
                  <Text style={styles.roomBuilding}>{room.building} - {room.floor}</Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: room.availability === 'available' ? '#34C759' : '#FF9500' }
                ]}>
                  <Text style={styles.statusText}>
                    {room.availability.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.roomDetails}>
                <View style={styles.roomDetailRow}>
                  <Ionicons name="people" size={16} color="#666" />
                  <Text style={styles.roomDetailText}>Capacity: {room.capacity}</Text>
                </View>
                <View style={styles.roomDetailRow}>
                  <Ionicons name="library" size={16} color="#666" />
                  <Text style={styles.roomDetailText}>Type: {room.type}</Text>
                </View>
                {room.nextAvailable && (
                  <View style={styles.roomDetailRow}>
                    <Ionicons name="time" size={16} color="#666" />
                    <Text style={styles.roomDetailText}>Next available: {room.nextAvailable}</Text>
                  </View>
                )}
              </View>

              <View style={styles.equipmentList}>
                <Text style={styles.equipmentTitle}>Equipment:</Text>
                <View style={styles.equipmentTags}>
                  {room.equipment.map((item, index) => (
                    <View key={index} style={styles.equipmentTag}>
                      <Text style={styles.equipmentTagText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                style={styles.smallNavigateButton}
                onPress={() => navigateToRoom(room)}
              >
                <Ionicons name="navigate" size={14} color="#007AFF" />
                <Text style={styles.smallNavigateText}>Navigate</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const SafetyTab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Safety & Security</Text>
      
      <View style={styles.safetyControls}>
        <View style={styles.safetyRow}>
          <Text style={styles.safetyLabel}>Safe Path Alerts</Text>
          <Switch
            value={safetyMode}
            onValueChange={setSafetyMode}
            trackColor={{ false: '#767577', true: '#34C759' }}
            thumbColor={safetyMode ? '#ffffff' : '#f4f3f4'}
          />
        </View>
        
        <TouchableOpacity style={styles.panicButton} onPress={triggerPanicButton}>
          <Ionicons name="warning" size={24} color="white" />
          <Text style={styles.panicButtonText}>Emergency Alert</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionSubtitle}>Active Safety Alerts</Text>
      {safetyAlerts.filter(alert => alert.active).map((alert) => (
        <View key={alert.id} style={[
          styles.alertCard,
          { borderLeftColor: getAlertColor(alert.severity) }
        ]}>
          <View style={styles.alertHeader}>
            <Ionicons 
              name={getAlertIcon(alert.type)} 
              size={20} 
              color={getAlertColor(alert.severity)} 
            />
            <Text style={styles.alertTitle}>{alert.title}</Text>
            <Text style={styles.alertTime}>
              {alert.timestamp.toLocaleTimeString('en-ZA', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
          </View>
          <Text style={styles.alertMessage}>{alert.message}</Text>
          {alert.location && (
            <Text style={styles.alertLocation}>Location: {alert.location}</Text>
          )}
        </View>
      ))}

      <View style={styles.emergencyContacts}>
        <Text style={styles.emergencyTitle}>Emergency Contacts</Text>
        <TouchableOpacity style={styles.contactButton}>
          <Ionicons name="shield" size={20} color="#FF3B30" />
          <Text style={styles.contactText}>Campus Security: 011-123-4567</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactButton}>
          <Ionicons name="medical" size={20} color="#34C759" />
          <Text style={styles.contactText}>Medical Center: 011-123-4568</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactButton}>
          <Ionicons name="call" size={20} color="#007AFF" />
          <Text style={styles.contactText}>Emergency Services: 10111</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const ServicesTab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Student Services</Text>
      
      <TouchableOpacity style={styles.serviceCard} onPress={showStudentIDCard}>
        <View style={styles.serviceIcon}>
          <Ionicons name="card" size={24} color="#007AFF" />
        </View>
        <View style={styles.serviceContent}>
          <Text style={styles.serviceTitle}>Student ID Card</Text>
          <Text style={styles.serviceDescription}>Access digital student ID</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </TouchableOpacity>

      <View style={styles.languageSection}>
        <Text style={styles.languageTitle}>Language Support</Text>
        <Text style={styles.languageSubtitle}>Select your preferred language for navigation</Text>
        <View style={styles.languageGrid}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageButton,
                selectedLanguage === lang.code && styles.selectedLanguage
              ]}
              onPress={() => setSelectedLanguage(lang.code)}
            >
              <Text style={styles.languageFlag}>{lang.flag}</Text>
              <Text style={[
                styles.languageName,
                selectedLanguage === lang.code && styles.selectedLanguageName
              ]}>
                {lang.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.quickServices}>
        <Text style={styles.quickServicesTitle}>Quick Services</Text>
        <View style={styles.quickServiceGrid}>
          <TouchableOpacity style={styles.quickServiceButton}>
            <Ionicons name="library" size={24} color="#007AFF" />
            <Text style={styles.quickServiceText}>Library</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickServiceButton}>
            <Ionicons name="restaurant" size={24} color="#FF6B35" />
            <Text style={styles.quickServiceText}>Cafeteria</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickServiceButton}>
            <Ionicons name="car" size={24} color="#34C759" />
            <Text style={styles.quickServiceText}>Parking</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickServiceButton}>
            <Ionicons name="wifi" size={24} color="#FF9500" />
            <Text style={styles.quickServiceText}>WiFi Info</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  const getAlertColor = (severity: string) => {
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
      case 'emergency': return 'warning';
      case 'weather': return 'thunderstorm';
      case 'security': return 'shield';
      case 'maintenance': return 'construct';
      default: return 'information-circle';
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#34C759', '#30D158']}
        style={styles.header}
      >
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>School Navigation</Text>
          <Text style={styles.headerSubtitle}>{schoolName}</Text>
        </View>
        <TouchableOpacity style={styles.idButton} onPress={showStudentIDCard}>
          <Ionicons name="card" size={24} color="white" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        {[
          { key: 'schedule', icon: 'calendar', label: 'Schedule' },
          { key: 'rooms', icon: 'business', label: 'Rooms' },
          { key: 'safety', icon: 'shield', label: 'Safety' },
          { key: 'services', icon: 'grid', label: 'Services' }
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabButton, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <Ionicons 
              name={tab.icon as any} 
              size={20} 
              color={activeTab === tab.key ? '#34C759' : '#666'} 
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
      {activeTab === 'schedule' && <ScheduleTab />}
      {activeTab === 'rooms' && <RoomsTab />}
      {activeTab === 'safety' && <SafetyTab />}
      {activeTab === 'services' && <ServicesTab />}

      {/* Student ID Modal */}
      <Modal
        visible={showStudentID}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Student ID Card</Text>
            <TouchableOpacity onPress={() => setShowStudentID(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <View style={styles.idCardContainer}>
            <LinearGradient
              colors={['#34C759', '#30D158']}
              style={styles.idCard}
            >
              <Text style={styles.idSchoolName}>{schoolName}</Text>
              <View style={styles.idPhoto}>
                <Ionicons name="person" size={40} color="white" />
              </View>
              <Text style={styles.idStudentName}>Thabo Mthembu</Text>
              <Text style={styles.idStudentNumber}>Student #: 2024001234</Text>
              <Text style={styles.idGrade}>Grade 11A</Text>
              <View style={styles.idBarcode}>
                <Text style={styles.barcodeText}>||||  ||  ||||  |||  ||||||</Text>
              </View>
            </LinearGradient>
          </View>
        </View>
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
  idButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
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
    borderBottomColor: '#34C759',
  },
  tabLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  activeTabLabel: {
    color: '#34C759',
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
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginHorizontal: 20,
    marginBottom: 8,
  },
  nextClassCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  nextClassTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  nextClassSubject: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  nextClassDetails: {
    marginBottom: 16,
  },
  nextClassRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  nextClassText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  navigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    gap: 6,
  },
  navigateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  scheduleCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  scheduleTime: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
  },
  scheduleSubject: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },
  attendanceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  attendanceText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  scheduleDetails: {
    marginBottom: 8,
  },
  scheduleRoom: {
    fontSize: 14,
    color: '#666',
  },
  scheduleLecturer: {
    fontSize: 14,
    color: '#666',
  },
  smallNavigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  smallNavigateText: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '600',
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
  roomsList: {
    flex: 1,
  },
  roomCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  roomNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  roomBuilding: {
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
  roomDetails: {
    marginBottom: 12,
  },
  roomDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  roomDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  equipmentList: {
    marginBottom: 12,
  },
  equipmentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  equipmentTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  equipmentTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  equipmentTagText: {
    fontSize: 12,
    color: '#666',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B30',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  panicButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
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
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginLeft: 8,
  },
  alertTime: {
    fontSize: 12,
    color: '#666',
  },
  alertMessage: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 4,
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
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  serviceContent: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  languageSection: {
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
  languageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  languageSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedLanguage: {
    backgroundColor: '#f0f8ff',
    borderColor: '#007AFF',
  },
  languageFlag: {
    fontSize: 16,
    marginRight: 6,
  },
  languageName: {
    fontSize: 14,
    color: '#333',
  },
  selectedLanguageName: {
    color: '#007AFF',
    fontWeight: '600',
  },
  quickServices: {
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
  quickServicesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  quickServiceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickServiceButton: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  quickServiceText: {
    fontSize: 12,
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
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
  idCardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  idCard: {
    width: 300,
    height: 200,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  idSchoolName: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  idPhoto: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  idStudentName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  idStudentNumber: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  idGrade: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  idBarcode: {
    alignItems: 'center',
  },
  barcodeText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'monospace',
  },
});
