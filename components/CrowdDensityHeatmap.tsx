// components/CrowdDensityHeatmap.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal
} from 'react-native';
import Svg, { Circle, Rect, Defs, RadialGradient, Stop } from 'react-native-svg';
import { useTheme } from '@/context/ThemeContext';
import { ModernCard } from './ui/ModernComponents';
import { IconSymbol, IconSymbolName } from './ui/IconSymbol';
import { Spacing } from '@/constants/Theme';

const { width } = Dimensions.get('window');

export interface CrowdDensityData {
  id: string;
  area: string;
  density: 'low' | 'medium' | 'high' | 'very_high';
  count: number;
  maxCapacity: number;
  coordinates: { x: number; y: number };
  radius: number;
  timestamp: string;
  trend: 'increasing' | 'stable' | 'decreasing';
}

export interface HeatmapProps {
  visible: boolean;
  onClose: () => void;
  venueId: string;
  floor?: string;
}

export default function CrowdDensityHeatmap({ 
  visible, 
  onClose, 
  venueId, 
  floor = 'Ground Floor' 
}: HeatmapProps) {
  const { colors } = useTheme();
  const [crowdData, setCrowdData] = useState<CrowdDensityData[]>([]);
  const [selectedArea, setSelectedArea] = useState<CrowdDensityData | null>(null);
  const [updateInterval, setUpdateInterval] = useState<ReturnType<typeof setInterval> | null>(null);
  const [isRealTimeMode, setIsRealTimeMode] = useState(true);
  const [showLegend, setShowLegend] = useState(true);

  useEffect(() => {
    if (visible) {
      loadCrowdData();
      
      if (isRealTimeMode) {
        const interval = setInterval(loadCrowdData, 30000); // Update every 30 seconds
        setUpdateInterval(interval);
        return () => {
          clearInterval(interval);
        };
      }
    }

    return () => {
      if (updateInterval) {
        clearInterval(updateInterval);
        setUpdateInterval(null);
      }
    };
  }, [visible, isRealTimeMode, venueId, floor, updateInterval]);

  const loadCrowdData = async () => {
    // Mock crowd density data - in real app, this would come from sensors/APIs
    const mockData: CrowdDensityData[] = [
      {
        id: 'area_1',
        area: 'Main Entrance',
        density: 'high',
        count: 85,
        maxCapacity: 100,
        coordinates: { x: 50, y: 80 },
        radius: 30,
        timestamp: new Date().toISOString(),
        trend: 'stable'
      },
      {
        id: 'area_2',
        area: 'Food Court',
        density: 'very_high',
        count: 145,
        maxCapacity: 150,
        coordinates: { x: 200, y: 120 },
        radius: 40,
        timestamp: new Date().toISOString(),
        trend: 'increasing'
      },
      {
        id: 'area_3',
        area: 'Central Corridor',
        density: 'medium',
        count: 35,
        maxCapacity: 80,
        coordinates: { x: 150, y: 200 },
        radius: 35,
        timestamp: new Date().toISOString(),
        trend: 'decreasing'
      },
      {
        id: 'area_4',
        area: 'North Wing',
        density: 'low',
        count: 12,
        maxCapacity: 60,
        coordinates: { x: 80, y: 160 },
        radius: 25,
        timestamp: new Date().toISOString(),
        trend: 'stable'
      },
      {
        id: 'area_5',
        area: 'South Wing',
        density: 'medium',
        count: 42,
        maxCapacity: 75,
        coordinates: { x: 220, y: 180 },
        radius: 28,
        timestamp: new Date().toISOString(),
        trend: 'increasing'
      },
      {
        id: 'area_6',
        area: 'East Entrance',
        density: 'low',
        count: 18,
        maxCapacity: 50,
        coordinates: { x: 280, y: 100 },
        radius: 22,
        timestamp: new Date().toISOString(),
        trend: 'stable'
      }
    ];

    setCrowdData(mockData);
  };

  const getDensityColor = (density: string): { primary: string; secondary: string } => {
    switch (density) {
      case 'low':
        return { primary: '#4CAF50', secondary: '#4CAF5040' };
      case 'medium':
        return { primary: '#FF9800', secondary: '#FF980040' };
      case 'high':
        return { primary: '#FF5722', secondary: '#FF572240' };
      case 'very_high':
        return { primary: '#F44336', secondary: '#F4433640' };
      default:
        return { primary: '#4CAF50', secondary: '#4CAF5040' };
    }
  };

  const getDensityIcon = (density: string): IconSymbolName => {
    switch (density) {
      case 'low': return 'person' as IconSymbolName;
      case 'medium': return 'person.2' as IconSymbolName;
      case 'high': return 'person.3' as IconSymbolName;
      case 'very_high': return 'person.3.fill' as IconSymbolName;
      default: return 'person' as IconSymbolName;
    }
  };

  const getTrendIcon = (trend: string): IconSymbolName => {
    switch (trend) {
      case 'increasing': return 'arrow.up' as IconSymbolName;
      case 'decreasing': return 'arrow.down' as IconSymbolName;
      case 'stable': return 'minus' as IconSymbolName;
      default: return 'minus' as IconSymbolName;
    }
  };

  const handleAreaPress = (area: CrowdDensityData) => {
    setSelectedArea(area);
  };

  const getAvoidanceRecommendation = (area: CrowdDensityData): string => {
    if (area.density === 'very_high') {
      return 'Consider avoiding this area or visiting later';
    } else if (area.density === 'high') {
      return 'Busy area - allow extra time for navigation';
    } else if (area.density === 'medium') {
      return 'Moderate crowd levels expected';
    }
    return 'Low crowd levels - good time to visit';
  };

  const renderHeatmapOverlay = () => (
    <Svg
      width={width - 40}
      height={300}
      style={styles.heatmapOverlay}
    >
      <Defs>
        {crowdData.map((area) => {
          const colors = getDensityColor(area.density);
          return (
            <RadialGradient
              key={`gradient_${area.id}`}
              id={`gradient_${area.id}`}
              cx="50%"
              cy="50%"
              r="50%"
            >
              <Stop offset="0%" stopColor={colors.primary} stopOpacity="0.8" />
              <Stop offset="70%" stopColor={colors.primary} stopOpacity="0.4" />
              <Stop offset="100%" stopColor={colors.primary} stopOpacity="0.1" />
            </RadialGradient>
          );
        })}
      </Defs>

      {/* Venue outline */}
      <Rect
        x="10"
        y="10"
        width={width - 60}
        height="280"
        fill="none"
        stroke={colors.border}
        strokeWidth="2"
        rx="8"
      />

      {/* Crowd density areas */}
      {crowdData.map((area) => (
        <Circle
          key={area.id}
          cx={area.coordinates.x}
          cy={area.coordinates.y}
          r={area.radius}
          fill={`url(#gradient_${area.id})`}
          onPress={() => handleAreaPress(area)}
        />
      ))}

      {/* Area labels */}
      {crowdData.map((area) => (
        <React.Fragment key={`label_${area.id}`}>
          <Circle
            cx={area.coordinates.x}
            cy={area.coordinates.y}
            r="12"
            fill={colors.background}
            stroke={getDensityColor(area.density).primary}
            strokeWidth="2"
          />
        </React.Fragment>
      ))}
    </Svg>
  );

  const renderAreaDetails = () => {
    if (!selectedArea) return null;

    const densityColors = getDensityColor(selectedArea.density);
    const occupancyPercentage = Math.round((selectedArea.count / selectedArea.maxCapacity) * 100);

    return (
      <ModernCard style={styles.detailsCard}>
        <View style={styles.detailsHeader}>
          <View style={styles.areaInfo}>
            <Text style={[styles.areaName, { color: colors.text }]}>
              {selectedArea.area}
            </Text>
            <View style={styles.densityBadge}>
              <View 
                style={[
                  styles.densityIndicator, 
                  { backgroundColor: densityColors.primary }
                ]} 
              />
              <Text style={[styles.densityText, { color: colors.text }]}>
                {selectedArea.density.replace('_', ' ').toUpperCase()}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedArea(null)}
          >
            <IconSymbol name="xmark" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.metricsContainer}>
          <View style={styles.metric}>
            <IconSymbol 
              name={getDensityIcon(selectedArea.density)} 
              size={24} 
              color={densityColors.primary} 
            />
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {selectedArea.count}
            </Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
              People
            </Text>
          </View>

          <View style={styles.metric}>
            <IconSymbol 
              name="chart.bar.fill" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {occupancyPercentage}%
            </Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
              Capacity
            </Text>
          </View>

          <View style={styles.metric}>
            <IconSymbol 
              name={getTrendIcon(selectedArea.trend)} 
              size={24} 
              color={selectedArea.trend === 'increasing' ? '#FF5722' : 
                     selectedArea.trend === 'decreasing' ? '#4CAF50' : colors.textSecondary} 
            />
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {selectedArea.trend}
            </Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
              Trend
            </Text>
          </View>
        </View>

        <View style={styles.recommendationContainer}>
          <IconSymbol name="lightbulb" size={20} color={colors.warning} />
          <Text style={[styles.recommendationText, { color: colors.text }]}>
            {getAvoidanceRecommendation(selectedArea)}
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => {
              // Navigate around this area
              Alert.alert('Route Alternative', 'Finding alternative routes that avoid this crowded area...');
            }}
          >
            <IconSymbol name="arrow.triangle.2.circlepath" size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Avoid Area</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.secondary }]}
            onPress={() => {
              // Set alert for when crowd reduces
              Alert.alert('Alert Set', 'You\'ll be notified when crowd levels decrease.');
            }}
          >
            <IconSymbol name="bell" size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Alert Me</Text>
          </TouchableOpacity>
        </View>
      </ModernCard>
    );
  };

  const renderLegend = () => {
    if (!showLegend) return null;

    const densityLevels = [
      { level: 'low', label: 'Low', description: '< 40% capacity' },
      { level: 'medium', label: 'Medium', description: '40-70% capacity' },
      { level: 'high', label: 'High', description: '70-90% capacity' },
      { level: 'very_high', label: 'Very High', description: '> 90% capacity' }
    ];

    return (
      <ModernCard style={styles.legendCard}>
        <View style={styles.legendHeader}>
          <Text style={[styles.legendTitle, { color: colors.text }]}>
            Crowd Density Legend
          </Text>
          <TouchableOpacity
            onPress={() => setShowLegend(false)}
            style={styles.legendToggle}
          >
            <IconSymbol name="eye.slash" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {densityLevels.map((item) => {
          const densityColors = getDensityColor(item.level);
          return (
            <View key={item.level} style={styles.legendItem}>
              <View 
                style={[
                  styles.legendColorBox, 
                  { backgroundColor: densityColors.primary }
                ]} 
              />
              <View style={styles.legendText}>
                <Text style={[styles.legendLabel, { color: colors.text }]}>
                  {item.label}
                </Text>
                <Text style={[styles.legendDescription, { color: colors.textSecondary }]}>
                  {item.description}
                </Text>
              </View>
            </View>
          );
        })}
      </ModernCard>
    );
  };

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
              Crowd Density
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              {floor} • Real-time data
            </Text>
          </View>

          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => setIsRealTimeMode(!isRealTimeMode)}
          >
            <IconSymbol 
              name={isRealTimeMode ? "pause.circle" : "play.circle"} 
              size={24} 
              color={colors.primary} 
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Heatmap visualization */}
          <ModernCard style={styles.heatmapCard}>
            <View style={styles.heatmapHeader}>
              <Text style={[styles.heatmapTitle, { color: colors.text }]}>
                Live Crowd Heatmap
              </Text>
              <TouchableOpacity
                onPress={() => setShowLegend(!showLegend)}
                style={styles.legendToggleButton}
              >
                <IconSymbol 
                  name={showLegend ? "eye.slash" : "eye"} 
                  size={16} 
                  color={colors.primary} 
                />
                <Text style={[styles.legendToggleText, { color: colors.primary }]}>
                  Legend
                </Text>
              </TouchableOpacity>
            </View>
            
            {renderHeatmapOverlay()}
            
            <Text style={[styles.heatmapNote, { color: colors.textSecondary }]}>
              Tap on any area to view detailed information
            </Text>
          </ModernCard>

          {/* Legend */}
          {renderLegend()}

          {/* Area details */}
          {renderAreaDetails()}

          {/* Overall statistics */}
          <ModernCard style={styles.statsCard}>
            <Text style={[styles.statsTitle, { color: colors.text }]}>
              Overall Statistics
            </Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <IconSymbol name="person.3.fill" size={24} color={colors.primary} />
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {crowdData.reduce((sum, area) => sum + area.count, 0)}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Total People
                </Text>
              </View>

              <View style={styles.statItem}>
                <IconSymbol name="exclamationmark.triangle" size={24} color={colors.warning} />
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {crowdData.filter(area => area.density === 'very_high').length}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  High Density Areas
                </Text>
              </View>

              <View style={styles.statItem}>
                <IconSymbol name="clock" size={24} color={colors.secondary} />
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Last Updated
                </Text>
              </View>
            </View>
          </ModernCard>
        </ScrollView>
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
  content: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  heatmapCard: {
    marginVertical: Spacing.sm,
    padding: Spacing.md,
  },
  heatmapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  heatmapTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  legendToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  legendToggleText: {
    fontSize: 14,
    fontWeight: '500',
  },
  heatmapOverlay: {
    alignSelf: 'center',
    marginVertical: Spacing.md,
  },
  heatmapNote: {
    textAlign: 'center',
    fontSize: 12,
    fontStyle: 'italic',
  },
  legendCard: {
    marginVertical: Spacing.sm,
    padding: Spacing.md,
  },
  legendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  legendToggle: {
    padding: Spacing.xs,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  legendColorBox: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: Spacing.sm,
  },
  legendText: {
    flex: 1,
  },
  legendLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  legendDescription: {
    fontSize: 12,
  },
  detailsCard: {
    marginVertical: Spacing.sm,
    padding: Spacing.md,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  areaInfo: {
    flex: 1,
  },
  areaName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  densityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  densityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.xs,
  },
  densityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  closeButton: {
    padding: Spacing.xs,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.md,
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: Spacing.xs,
  },
  metricLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  recommendationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    padding: Spacing.sm,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
  },
  recommendationText: {
    fontSize: 14,
    flex: 1,
    marginLeft: Spacing.sm,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    gap: Spacing.xs,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  statsCard: {
    marginVertical: Spacing.sm,
    padding: Spacing.md,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: Spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: Spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
});
