// Advanced Admin Dashboard for NaviLynx
// Enterprise-grade venue and business management platform

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Modal,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { useTheme } from '../context/ThemeContext';
import { productionBackend } from '../services/ProductionBackendService';

const { width } = Dimensions.get('window');

export interface VenueAnalytics {
  venueId: string;
  venueName: string;
  dailyVisitors: number;
  weeklyVisitors: number;
  monthlyVisitors: number;
  averageDwellTime: number; // minutes
  popularHours: Array<{ hour: number; visitors: number }>;
  popularAreas: Array<{ name: string; visits: number }>;
  revenueMetrics: {
    totalDeals: number;
    dealsClaimed: number;
    conversionRate: number;
    averageSpend: number;
  };
  beaconHealth: Array<{
    id: string;
    name: string;
    status: 'active' | 'inactive' | 'low_battery';
    battery: number;
    lastSeen: string;
  }>;
}

export interface BusinessMetrics {
  totalVenues: number;
  totalUsers: number;
  totalDeals: number;
  totalRevenue: number;
  growthMetrics: {
    userGrowth: number; // percentage
    revenueGrowth: number;
    venueGrowth: number;
  };
  topPerformingVenues: VenueAnalytics[];
  recentActivity: Array<{
    id: string;
    type: 'user_registration' | 'deal_claimed' | 'venue_added' | 'beacon_offline';
    message: string;
    timestamp: string;
    severity: 'info' | 'warning' | 'error';
  }>;
}

export const AdminDashboard: React.FC = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'venues' | 'analytics' | 'settings'>('overview');
  const [businessMetrics, setBusinessMetrics] = useState<BusinessMetrics | null>(null);
  const [selectedVenue, setSelectedVenue] = useState<VenueAnalytics | null>(null);
  const [showVenueModal, setShowVenueModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Mock business metrics - in production, this would fetch from backend
      const mockMetrics: BusinessMetrics = {
        totalVenues: 15,
        totalUsers: 25847,
        totalDeals: 342,
        totalRevenue: 1245600,
        growthMetrics: {
          userGrowth: 23.5,
          revenueGrowth: 31.2,
          venueGrowth: 15.8
        },
        topPerformingVenues: [
          {
            venueId: 'sandton_city',
            venueName: 'Sandton City',
            dailyVisitors: 1250,
            weeklyVisitors: 8750,
            monthlyVisitors: 35000,
            averageDwellTime: 45,
            popularHours: [
              { hour: 9, visitors: 120 },
              { hour: 12, visitors: 200 },
              { hour: 18, visitors: 180 }
            ],
            popularAreas: [
              { name: 'Food Court', visits: 850 },
              { name: 'Electronics', visits: 720 },
              { name: 'Fashion', visits: 650 }
            ],
            revenueMetrics: {
              totalDeals: 45,
              dealsClaimed: 38,
              conversionRate: 84.4,
              averageSpend: 320
            },
            beaconHealth: [
              { id: 'b1', name: 'Entrance A', status: 'active', battery: 85, lastSeen: '2025-07-30T10:30:00Z' },
              { id: 'b2', name: 'Food Court', status: 'active', battery: 72, lastSeen: '2025-07-30T10:29:00Z' },
              { id: 'b3', name: 'Parking B1', status: 'low_battery', battery: 15, lastSeen: '2025-07-30T10:25:00Z' }
            ]
          }
        ],
        recentActivity: [
          {
            id: '1',
            type: 'deal_claimed',
            message: '50% Electronics deal claimed at Sandton City',
            timestamp: '2025-07-30T10:15:00Z',
            severity: 'info'
          },
          {
            id: '2',
            type: 'beacon_offline',
            message: 'Beacon B3 at Sandton City has low battery',
            timestamp: '2025-07-30T10:10:00Z',
            severity: 'warning'
          }
        ]
      };

      setBusinessMetrics(mockMetrics);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshData = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const renderOverviewTab = () => {
    if (!businessMetrics) return null;

    return (
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Key Metrics Cards */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 15 }}>
          <View style={styles.metricCard}>
            <Ionicons name="business-outline" size={24} color={theme.primary} />
            <Text style={[styles.metricValue, { color: theme.text }]}>
              {businessMetrics.totalVenues}
            </Text>
            <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
              Active Venues
            </Text>
            <Text style={[styles.metricGrowth, { color: '#4CAF50' }]}>
              +{businessMetrics.growthMetrics.venueGrowth}%
            </Text>
          </View>

          <View style={styles.metricCard}>
            <Ionicons name="people-outline" size={24} color={theme.primary} />
            <Text style={[styles.metricValue, { color: theme.text }]}>
              {businessMetrics.totalUsers.toLocaleString()}
            </Text>
            <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
              Total Users
            </Text>
            <Text style={[styles.metricGrowth, { color: '#4CAF50' }]}>
              +{businessMetrics.growthMetrics.userGrowth}%
            </Text>
          </View>

          <View style={styles.metricCard}>
            <Ionicons name="pricetag-outline" size={24} color={theme.primary} />
            <Text style={[styles.metricValue, { color: theme.text }]}>
              {businessMetrics.totalDeals}
            </Text>
            <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
              Active Deals
            </Text>
            <Text style={[styles.metricGrowth, { color: '#4CAF50' }]}>
              +12.3%
            </Text>
          </View>

          <View style={styles.metricCard}>
            <Ionicons name="trending-up-outline" size={24} color={theme.primary} />
            <Text style={[styles.metricValue, { color: theme.text }]}>
              R{(businessMetrics.totalRevenue / 1000).toFixed(0)}K
            </Text>
            <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
              Revenue
            </Text>
            <Text style={[styles.metricGrowth, { color: '#4CAF50' }]}>
              +{businessMetrics.growthMetrics.revenueGrowth}%
            </Text>
          </View>
        </View>

        {/* Revenue Chart */}
        <View style={[styles.chartContainer, { backgroundColor: theme.card }]}>
          <Text style={[styles.chartTitle, { color: theme.text }]}>
            Revenue Trend (Last 7 Days)
          </Text>
          <LineChart
            data={{
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              datasets: [{
                data: [45000, 52000, 48000, 61000, 58000, 75000, 68000]
              }]
            }}
            width={width - 50}
            height={200}
            chartConfig={{
              backgroundColor: theme.card,
              backgroundGradientFrom: theme.card,
              backgroundGradientTo: theme.card,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
              style: { borderRadius: 16 }
            }}
            style={{ borderRadius: 16 }}
          />
        </View>

        {/* Top Performing Venues */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Top Performing Venues
          </Text>
          {businessMetrics.topPerformingVenues.map(venue => (
            <TouchableOpacity
              key={venue.venueId}
              onPress={() => {
                setSelectedVenue(venue);
                setShowVenueModal(true);
              }}
              style={styles.venueItem}
            >
              <View>
                <Text style={[styles.venueName, { color: theme.text }]}>
                  {venue.venueName}
                </Text>
                <Text style={[styles.venueStats, { color: theme.textSecondary }]}>
                  {venue.dailyVisitors} daily visitors • {venue.averageDwellTime}min avg
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.conversionRate, { color: '#4CAF50' }]}>
                  {venue.revenueMetrics.conversionRate}%
                </Text>
                <Text style={[styles.venueRevenue, { color: theme.textSecondary }]}>
                  R{venue.revenueMetrics.averageSpend}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Recent Activity
          </Text>
          {businessMetrics.recentActivity.map(activity => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={[
                styles.activityIcon,
                {
                  backgroundColor: activity.severity === 'error' ? '#FF4757' :
                    activity.severity === 'warning' ? '#FFA726' : '#4CAF50'
                }
              ]}>
                <Ionicons
                  name={
                    activity.type === 'deal_claimed' ? 'pricetag' :
                    activity.type === 'beacon_offline' ? 'warning' :
                    activity.type === 'user_registration' ? 'person-add' : 'business'
                  }
                  size={16}
                  color="white"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.activityMessage, { color: theme.text }]}>
                  {activity.message}
                </Text>
                <Text style={[styles.activityTime, { color: theme.textSecondary }]}>
                  {new Date(activity.timestamp).toLocaleTimeString()}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  const renderVenuesTab = () => {
    if (!businessMetrics) return null;

    return (
      <ScrollView style={{ flex: 1, padding: 15 }}>
        <Text style={[styles.pageTitle, { color: theme.text }]}>
          Venue Management
        </Text>
        
        {businessMetrics.topPerformingVenues.map(venue => (
          <View key={venue.venueId} style={[styles.venueCard, { backgroundColor: theme.card }]}>
            <View style={styles.venueHeader}>
              <Text style={[styles.venueCardName, { color: theme.text }]}>
                {venue.venueName}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setSelectedVenue(venue);
                  setShowVenueModal(true);
                }}
              >
                <Ionicons name="settings-outline" size={20} color={theme.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.venueMetrics}>
              <View style={styles.venueMetric}>
                <Text style={[styles.metricNumber, { color: theme.text }]}>
                  {venue.dailyVisitors}
                </Text>
                <Text style={[styles.metricText, { color: theme.textSecondary }]}>
                  Daily Visitors
                </Text>
              </View>
              <View style={styles.venueMetric}>
                <Text style={[styles.metricNumber, { color: theme.text }]}>
                  {venue.averageDwellTime}m
                </Text>
                <Text style={[styles.metricText, { color: theme.textSecondary }]}>
                  Avg Dwell Time
                </Text>
              </View>
              <View style={styles.venueMetric}>
                <Text style={[styles.metricNumber, { color: '#4CAF50' }]}>
                  {venue.revenueMetrics.conversionRate}%
                </Text>
                <Text style={[styles.metricText, { color: theme.textSecondary }]}>
                  Conversion
                </Text>
              </View>
            </View>

            {/* Beacon Status */}
            <View style={styles.beaconSection}>
              <Text style={[styles.beaconTitle, { color: theme.text }]}>
                Beacon Status
              </Text>
              <View style={styles.beaconList}>
                {venue.beaconHealth.map(beacon => (
                  <View key={beacon.id} style={styles.beaconItem}>
                    <View style={[
                      styles.beaconStatus,
                      {
                        backgroundColor: beacon.status === 'active' ? '#4CAF50' :
                          beacon.status === 'low_battery' ? '#FFA726' : '#FF4757'
                      }
                    ]} />
                    <Text style={[styles.beaconName, { color: theme.text }]}>
                      {beacon.name}
                    </Text>
                    <Text style={[styles.beaconBattery, { color: theme.textSecondary }]}>
                      {beacon.battery}%
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderAnalyticsTab = () => {
    if (!businessMetrics) return null;

    const venue = businessMetrics.topPerformingVenues[0];

    return (
      <ScrollView style={{ flex: 1, padding: 15 }}>
        <Text style={[styles.pageTitle, { color: theme.text }]}>
          Analytics Dashboard
        </Text>

        {/* Popular Hours Chart */}
        <View style={[styles.chartContainer, { backgroundColor: theme.card }]}>
          <Text style={[styles.chartTitle, { color: theme.text }]}>
            Popular Hours - {venue.venueName}
          </Text>
          <BarChart
            data={{
              labels: ['9AM', '12PM', '6PM'],
              datasets: [{
                data: venue.popularHours.map(h => h.visitors)
              }]
            }}
            width={width - 50}
            height={200}
            chartConfig={{
              backgroundColor: theme.card,
              backgroundGradientFrom: theme.card,
              backgroundGradientTo: theme.card,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
            }}
            style={{ borderRadius: 16 }}
          />
        </View>

        {/* Popular Areas Chart */}
        <View style={[styles.chartContainer, { backgroundColor: theme.card }]}>
          <Text style={[styles.chartTitle, { color: theme.text }]}>
            Popular Areas - {venue.venueName}
          </Text>
          <PieChart
            data={venue.popularAreas.map((area, index) => ({
              name: area.name,
              population: area.visits,
              color: ['#8e44ad', '#3498db', '#e74c3c'][index],
              legendFontColor: theme.text,
              legendFontSize: 12
            }))}
            width={width - 50}
            height={200}
            chartConfig={{
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
          />
        </View>
      </ScrollView>
    );
  };

  const renderSettingsTab = () => {
    return (
      <ScrollView style={{ flex: 1, padding: 15 }}>
        <Text style={[styles.pageTitle, { color: theme.text }]}>
          Settings
        </Text>

        <View style={[styles.settingsSection, { backgroundColor: theme.card }]}>
          <Text style={[styles.settingsTitle, { color: theme.text }]}>
            Notifications
          </Text>
          
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>
              Beacon Alerts
            </Text>
            <Switch value={true} onValueChange={() => {}} />
          </View>

          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>
              Revenue Reports
            </Text>
            <Switch value={true} onValueChange={() => {}} />
          </View>

          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>
              User Activity Alerts
            </Text>
            <Switch value={false} onValueChange={() => {}} />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.primary }]}
          onPress={() => Alert.alert('Export', 'Analytics data will be exported')}
        >
          <Text style={{ color: theme.background, fontWeight: 'bold' }}>
            Export Analytics Data
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ color: theme.textSecondary, marginTop: 10 }}>
          Loading dashboard...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          NaviLynx Admin
        </Text>
        <TouchableOpacity onPress={refreshData}>
          <Ionicons name="refresh-outline" size={24} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={[styles.tabContainer, { backgroundColor: theme.card }]}>
        {[
          { id: 'overview', icon: 'analytics-outline', label: 'Overview' },
          { id: 'venues', icon: 'business-outline', label: 'Venues' },
          { id: 'analytics', icon: 'bar-chart-outline', label: 'Analytics' },
          { id: 'settings', icon: 'settings-outline', label: 'Settings' }
        ].map(tab => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setSelectedTab(tab.id as any)}
            style={[
              styles.tab,
              { backgroundColor: selectedTab === tab.id ? theme.primary : 'transparent' }
            ]}
          >
            <Ionicons
              name={tab.icon as any}
              size={20}
              color={selectedTab === tab.id ? theme.background : theme.textSecondary}
            />
            <Text
              style={{
                color: selectedTab === tab.id ? theme.background : theme.textSecondary,
                fontSize: 12,
                marginTop: 2
              }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>
        {selectedTab === 'overview' && renderOverviewTab()}
        {selectedTab === 'venues' && renderVenuesTab()}
        {selectedTab === 'analytics' && renderAnalyticsTab()}
        {selectedTab === 'settings' && renderSettingsTab()}
      </View>

      {/* Venue Detail Modal */}
      <Modal
        visible={showVenueModal}
        animationType="slide"
        onRequestClose={() => setShowVenueModal(false)}
      >
        {selectedVenue && (
          <View style={{ flex: 1, backgroundColor: theme.background }}>
            <View style={[styles.modalHeader, { backgroundColor: theme.card }]}>
              <TouchableOpacity onPress={() => setShowVenueModal(false)}>
                <Ionicons name="close-outline" size={24} color={theme.text} />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                {selectedVenue.venueName}
              </Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView style={{ flex: 1, padding: 15 }}>
              {/* Detailed venue analytics would go here */}
              <Text style={[styles.modalSection, { color: theme.text }]}>
                Detailed Analytics
              </Text>
              <Text style={{ color: theme.textSecondary }}>
                Comprehensive venue management interface would be implemented here
                with detailed analytics, beacon management, deal configuration, etc.
              </Text>
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
};

const styles = {
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold' as const,
  },
  tabContainer: {
    flexDirection: 'row' as const,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  tab: {
    flex: 1,
    alignItems: 'center' as const,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  metricCard: {
    width: (width - 45) / 2,
    backgroundColor: 'rgba(134, 65, 244, 0.1)',
    borderRadius: 15,
    padding: 15,
    margin: 5,
    alignItems: 'center' as const,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    marginTop: 5,
  },
  metricLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  metricGrowth: {
    fontSize: 12,
    fontWeight: '600' as const,
    marginTop: 5,
  },
  chartContainer: {
    margin: 15,
    borderRadius: 15,
    padding: 15,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    marginBottom: 10,
  },
  section: {
    margin: 15,
    borderRadius: 15,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    marginBottom: 15,
  },
  venueItem: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  venueName: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  venueStats: {
    fontSize: 14,
    marginTop: 2,
  },
  conversionRate: {
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
  venueRevenue: {
    fontSize: 14,
    marginTop: 2,
  },
  activityItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 12,
  },
  activityMessage: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  activityTime: {
    fontSize: 12,
    marginTop: 2,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    marginBottom: 20,
  },
  venueCard: {
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  venueHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 15,
  },
  venueCardName: {
    fontSize: 18,
    fontWeight: 'bold' as const,
  },
  venueMetrics: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
    marginBottom: 15,
  },
  venueMetric: {
    alignItems: 'center' as const,
  },
  metricNumber: {
    fontSize: 20,
    fontWeight: 'bold' as const,
  },
  metricText: {
    fontSize: 12,
    marginTop: 2,
  },
  beaconSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: 15,
  },
  beaconTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 10,
  },
  beaconList: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
  },
  beaconItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginRight: 15,
    marginBottom: 5,
  },
  beaconStatus: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  beaconName: {
    fontSize: 12,
    marginRight: 5,
  },
  beaconBattery: {
    fontSize: 10,
  },
  settingsSection: {
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: 10,
  },
  settingLabel: {
    fontSize: 16,
  },
  actionButton: {
    borderRadius: 10,
    padding: 15,
    alignItems: 'center' as const,
    marginTop: 20,
  },
  modalHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
  },
  modalSection: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    marginBottom: 10,
  },
};

export default AdminDashboard;
