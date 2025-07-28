import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { spacing, borderRadius, shadows } from '@/styles/modernTheme';

interface ModernStoreCardProps {
  name: string;
  color: string;
  discount: string;
  memberNumber?: string;
  points?: number;
  tier?: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  onPress?: () => void;
  style?: any;
}

export const ModernStoreCard: React.FC<ModernStoreCardProps> = ({
  name,
  color,
  discount,
  memberNumber,
  points,
  tier,
  onPress,
  style,
}) => {

  const getCardIcon = (storeName: string) => {
    const lowerName = storeName.toLowerCase();
    if (lowerName.includes('edgars')) return 'creditcard';
    if (lowerName.includes('woolworths')) return 'leaf.fill';
    if (lowerName.includes('pick')) return 'bag.fill';
    return 'star.fill';
  };

  const getTierIcon = (tier?: string) => {
    switch (tier) {
      case 'Bronze': return 'shield';
      case 'Silver': return 'shield.fill';
      case 'Gold': return 'crown';
      case 'Platinum': return 'crown.fill';
      default: return 'star';
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={style}>
      <LinearGradient
        colors={[color, `${color}CC`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardContainer}
      >
        {/* Gradient Overlay for depth */}
        <LinearGradient
          colors={['rgba(255,255,255,0.1)', 'rgba(0,0,0,0.1)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.overlayGradient}
        />
        
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={styles.brandContainer}>
            <View style={styles.iconContainer}>
              <IconSymbol name={getCardIcon(name)} size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.brandName} numberOfLines={1}>{name}</Text>
          </View>
          
          {tier && (
            <View style={styles.tierBadge}>
              <IconSymbol name={getTierIcon(tier)} size={10} color="#FFD700" />
              <Text style={styles.tierText}>{tier}</Text>
            </View>
          )}
        </View>

        {/* Card Content */}
        <View style={styles.cardContent}>
          {memberNumber && (
            <Text style={styles.memberNumber}>**** {memberNumber.slice(-4)}</Text>
          )}
          
          <View style={styles.bottomRow}>
            <View style={styles.discountContainer}>
              <Text style={styles.discountLabel}>Save up to</Text>
              <Text style={styles.discountValue}>{discount}</Text>
            </View>
            
            {points !== undefined && (
              <View style={styles.pointsContainer}>
                <IconSymbol name="star.fill" size={10} color="#FFD700" />
                <Text style={styles.pointsText}>{points} pts</Text>
              </View>
            )}
          </View>
        </View>

        {/* Decorative Elements */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 160,
    height: 100,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    position: 'relative',
    overflow: 'hidden',
    ...shadows.lg,
    elevation: 6,
  },
  overlayGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: borderRadius.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
    zIndex: 1,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: borderRadius.sm,
    padding: 4,
    marginRight: spacing.xs,
  },
  brandName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  tierBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    gap: 2,
  },
  tierText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '600',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
    zIndex: 1,
  },
  memberNumber: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  discountContainer: {
    flex: 1,
  },
  discountLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 9,
    fontWeight: '500',
    marginBottom: 2,
  },
  discountValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    gap: 2,
  },
  pointsText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '600',
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -15,
    left: -15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
});
