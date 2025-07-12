/**
 * TurnByTurnPanel - Navigation instruction panel
 * Shows current navigation instruction and progress information
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

// Internal imports
import { IconSymbol } from '@/components/ui/IconSymbol';
import { colors, spacing, borderRadius } from '@/styles/modernTheme';
import { NavigationRoute, NavigationProgress } from '@/services/NavigationService';
import { Venue } from '@/data/southAfricanVenues';

interface TurnByTurnPanelProps {
  progress: NavigationProgress;
  route: NavigationRoute | null;
  isIndoorMode: boolean;
  venue: Venue | null;
}

export default function TurnByTurnPanel({
  progress,
  route,
  isIndoorMode,
  venue,
}: TurnByTurnPanelProps) {
  
  /**
   * Get appropriate icon for current maneuver
   */
  const getManeuverIcon = (instruction: string): string => {
    const lowercaseInstruction = instruction.toLowerCase();
    
    if (lowercaseInstruction.includes('left')) {
      return 'arrow.turn.up.left';
    } else if (lowercaseInstruction.includes('right')) {
      return 'arrow.turn.up.right';
    } else if (lowercaseInstruction.includes('straight') || lowercaseInstruction.includes('continue')) {
      return 'arrow.up';
    } else if (lowercaseInstruction.includes('arrive') || lowercaseInstruction.includes('destination')) {
      return 'flag.checkered';
    } else if (lowercaseInstruction.includes('start')) {
      return 'location';
    } else {
      return 'arrow.up';
    }
  };

  /**
   * Format distance for display
   */
  const formatDistance = (distance: number): string => {
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    } else {
      return `${(distance / 1000).toFixed(1)}km`;
    }
  };

  /**
   * Format ETA to destination
   */
  const formatETA = (timeRemaining: string): string => {
    // Extract minutes from time string
    const match = timeRemaining.match(/(\d+)/);
    if (match) {
      const minutes = parseInt(match[1]);
      const now = new Date();
      const eta = new Date(now.getTime() + minutes * 60000);
      return `ETA ${eta.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}`;
    }
    return 'ETA Unknown';
  };

  /**
   * Get urgency level based on distance to next turn
   */
  const getUrgencyLevel = (distance: number): 'low' | 'medium' | 'high' => {
    if (distance < 20) return 'high';
    if (distance < 50) return 'medium';
    return 'low';
  };

  /**
   * Calculate route completion percentage
   */
  const getRouteProgress = (): number => {
    if (!route) return 0;
    return Math.min(100, (progress.currentStepIndex / route.steps.length) * 100);
  };

  const urgencyLevel = getUrgencyLevel(progress.distanceToNextTurn);
  const routeProgress = getRouteProgress();

  return (
    <View style={[
      styles.container,
      urgencyLevel === 'high' && styles.urgentContainer
    ]}>
      {/* Main navigation instruction */}
      <View style={[
        styles.instructionPanel,
        urgencyLevel === 'high' && styles.urgentInstruction
      ]}>
        <View style={[
          styles.iconContainer,
          urgencyLevel === 'high' && styles.urgentIcon
        ]}>
          <IconSymbol
            size={urgencyLevel === 'high' ? 32 : 28}
            name={getManeuverIcon(progress.currentInstruction) as any}
            color={urgencyLevel === 'high' ? colors.warning : colors.primary}
          />
        </View>
        
        <View style={styles.instructionContent}>
          <Text style={[
            styles.instructionText,
            urgencyLevel === 'high' && styles.urgentText
          ]}>
            {progress.currentInstruction}
          </Text>
          
          {progress.distanceToNextTurn > 0 && (
            <Text style={[
              styles.distanceText,
              urgencyLevel === 'high' && styles.urgentDistance
            ]}>
              in {formatDistance(progress.distanceToNextTurn)}
            </Text>
          )}

          {/* ETA Display */}
          <Text style={styles.etaText}>
            {formatETA(progress.estimatedTimeRemaining)}
          </Text>
        </View>
        
        {progress.isOffRoute && (
          <View style={styles.offRouteIndicator}>
            <IconSymbol size={20} name="exclamationmark.triangle" color={colors.warning} />
          </View>
        )}
      </View>

      {/* Indoor mode indicators */}
      {isIndoorMode && venue && (
        <View style={styles.indoorInfo}>
          <IconSymbol size={16} name="building.2" color={colors.secondary} />
          <Text style={styles.indoorText}>
            Indoor navigation: {venue.name}
          </Text>
          <IconSymbol size={16} name="wifi" color={colors.success} />
        </View>
      )}

      {/* Enhanced progress indicators with gamification */}
      {route && (
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Route Progress</Text>
            <Text style={styles.progressPercentage}>{Math.round(routeProgress)}%</Text>
          </View>
          
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { width: `${routeProgress}%` }
              ]} 
            />
          </View>
          
          <View style={styles.progressDetails}>
            <Text style={styles.progressText}>
              Step {progress.currentStepIndex + 1} of {route.steps.length}
            </Text>
            
            {/* Gamification elements */}
            <View style={styles.achievementContainer}>
              <IconSymbol size={14} name="star.fill" color={colors.warning} />
              <Text style={styles.achievementText}>+{Math.round(routeProgress / 10)} XP</Text>
            </View>
          </View>
        </View>
      )}

      {/* Voice control indicator */}
      <TouchableOpacity style={styles.voiceButton} onPress={() => {
        // Toggle voice guidance
        Alert.alert(
          'Voice Navigation',
          'Voice navigation controls',
          [
            { text: 'Mute Voice', style: 'destructive' },
            { text: 'Repeat Instructions' },
            { text: 'Cancel', style: 'cancel' }
          ]
        );
      }}>
        <IconSymbol size={20} name="message" color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  instructionPanel: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  instructionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  instructionContent: {
    flex: 1,
  },
  instructionText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: 4,
  },
  distanceText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  etaText: {
    fontSize: 12,
    color: colors.gray[600],
    fontWeight: '500',
    marginTop: spacing.xs,
  },
  urgentText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  urgentDistance: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  urgentContainer: {
    borderColor: colors.warning,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 69, 0, 0.1)',
  },
  urgentInstruction: {
    backgroundColor: 'rgba(255, 69, 0, 0.9)',
  },
  urgentIcon: {
    backgroundColor: colors.warning,
  },
  offRouteIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.warning + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indoorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary + '10',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  indoorText: {
    fontSize: 14,
    color: colors.secondary,
    fontWeight: '500',
    marginLeft: spacing.sm,
  },
  progressContainer: {
    marginTop: spacing.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  progressLabel: {
    fontSize: 12,
    color: colors.gray[700],
    fontWeight: '500',
  },
  progressPercentage: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.gray[200],
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  progressDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  progressText: {
    fontSize: 12,
    color: colors.gray[600],
    textAlign: 'center',
  },
  nextInstructionPanel: {
    backgroundColor: colors.gray[50],
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
  },
  nextInstructionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  nextInstructionLabel: {
    fontSize: 12,
    color: colors.gray[600],
    fontWeight: '500',
    marginLeft: spacing.xs,
  },
  nextInstructionText: {
    fontSize: 14,
    color: colors.gray[800],
    fontWeight: '500',
  },
  nextDistanceText: {
    fontSize: 12,
    color: colors.gray[600],
    marginTop: spacing.xs,
  },
  indoorFeatures: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
  },
  indoorFeatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  indoorFeatureButton: {
    alignItems: 'center',
    padding: spacing.sm,
  },
  indoorFeatureText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
    marginTop: spacing.xs,
  },
  routeSummary: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.9)',
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    justifyContent: 'space-around',
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 12,
    color: colors.gray[700],
    fontWeight: '500',
    marginLeft: spacing.xs,
  },
  voiceButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  achievementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  achievementText: {
    fontSize: 10,
    color: colors.warning,
    fontWeight: 'bold',
    marginLeft: spacing.xs,
  },
});
