import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { colors, spacing, borderRadius, shadows, typography } from '@/styles/modernTheme';
import * as ImagePicker from 'expo-image-picker';

interface StoreInfo {
  name: string;
  price: string;
  location: string;
  availability: string;
  distance: string;
}

interface ScanResult {
  itemName: string;
  description: string;
  category: string;
  estimatedPrice: string;
  stores: StoreInfo[];
  confidence: number;
}

interface ShoppingAssistantProps {
  onScanComplete?: (result: ScanResult) => void;
}

export const ShoppingAssistantCard: React.FC<ShoppingAssistantProps> = ({ onScanComplete }) => {
  const { colors: themeColors, isDark } = useTheme();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scannedImage, setScannedImage] = useState<string | null>(null);

  const handleScanItem = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission needed', 'Camera permission is required to scan items.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setScannedImage(result.assets[0].uri);
        setIsScanning(true);

        // Simulate AI processing with Gemini Vision
        setTimeout(() => {
          const mockResult: ScanResult = {
            itemName: 'Samsung Galaxy Buds Pro',
            description: 'Premium wireless earbuds with active noise cancellation',
            category: 'Electronics',
            estimatedPrice: 'R2,299 - R2,899',
            confidence: 0.92,
            stores: [
              {
                name: 'Sandton City - Samsung Store',
                price: 'R2,299',
                location: 'Upper Level, Shop 123',
                availability: 'In Stock',
                distance: '0.2km'
              },
              {
                name: 'Canal Walk - Incredible Connection',
                price: 'R2,499',
                location: 'Ground Floor, Shop 45',
                availability: 'In Stock',
                distance: '12.5km'
              },
              {
                name: 'V&A Waterfront - iStore',
                price: 'R2,899',
                location: 'Level 1, Shop 67',
                availability: 'Limited Stock',
                distance: '8.3km'
              }
            ]
          };

          setScanResult(mockResult);
          setIsScanning(false);
          onScanComplete?.(mockResult);
        }, 3000);
      }
    } catch (error) {
      console.error('Error scanning item:', error);
      Alert.alert('Error', 'Failed to scan item. Please try again.');
      setIsScanning(false);
    }
  };

  const handleSelectFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setScannedImage(result.assets[0].uri);
        setIsScanning(true);

        // Simulate processing
        setTimeout(() => {
          const mockResult: ScanResult = {
            itemName: 'Apple AirPods Pro',
            description: 'Wireless earbuds with spatial audio and adaptive transparency',
            category: 'Electronics',
            estimatedPrice: 'R4,999 - R5,599',
            confidence: 0.88,
            stores: [
              {
                name: 'Canal Walk - iStore',
                price: 'R4,999',
                location: 'Upper Level, Shop 89',
                availability: 'In Stock',
                distance: '0.5km'
              },
              {
                name: 'Sandton City - Digicape',
                price: 'R5,299',
                location: 'Level 2, Shop 156',
                availability: 'In Stock',
                distance: '15.2km'
              }
            ]
          };

          setScanResult(mockResult);
          setIsScanning(false);
          onScanComplete?.(mockResult);
        }, 2500);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Failed to process image. Please try again.');
      setIsScanning(false);
    }
  };

  const renderScanResult = () => {
    if (!scanResult) return null;

    return (
      <View style={[styles.resultContainer, { backgroundColor: themeColors.surface }]}>
        <View style={styles.resultHeader}>
          <View style={styles.resultInfo}>
            <Text style={[styles.itemName, { color: themeColors.text }]}>
              {scanResult.itemName}
            </Text>
            <Text style={[styles.itemDescription, { color: themeColors.textSecondary }]}>
              {scanResult.description}
            </Text>
            <View style={styles.confidenceContainer}>
              <IconSymbol name="checkmark.circle.fill" size={16} color={colors.accent} />
              <Text style={[styles.confidenceText, { color: colors.accent }]}>
                {Math.round(scanResult.confidence * 100)}% match
              </Text>
            </View>
          </View>
          {scannedImage && (
            <Image source={{ uri: scannedImage }} style={styles.scannedImage} />
          )}
        </View>

        <View style={styles.priceContainer}>
          <Text style={[styles.priceLabel, { color: themeColors.textSecondary }]}>
            Price Range
          </Text>
          <Text style={[styles.priceRange, { color: colors.primary }]}>
            {scanResult.estimatedPrice}
          </Text>
        </View>

        <Text style={[styles.storesHeader, { color: themeColors.text }]}>
          Available at these stores:
        </Text>

        {scanResult.stores.map((store, index) => (
          <TouchableOpacity 
            key={index} 
            style={[styles.storeCard, { backgroundColor: themeColors.background }]}
          >
            <View style={styles.storeInfo}>
              <Text style={[styles.storeName, { color: themeColors.text }]}>
                {store.name}
              </Text>
              <Text style={[styles.storeLocation, { color: themeColors.textSecondary }]}>
                {store.location}
              </Text>
              <View style={styles.storeDetails}>
                <View style={styles.availabilityContainer}>
                  <IconSymbol 
                    name={store.availability === 'In Stock' ? 'checkmark.circle.fill' : 'exclamationmark.circle.fill'} 
                    size={14} 
                    color={store.availability === 'In Stock' ? colors.accent : colors.warning} 
                  />
                  <Text style={[styles.availability, { 
                    color: store.availability === 'In Stock' ? colors.accent : colors.warning 
                  }]}>
                    {store.availability}
                  </Text>
                </View>
                <Text style={[styles.distance, { color: themeColors.textSecondary }]}>
                  {store.distance}
                </Text>
              </View>
            </View>
            <View style={styles.priceSection}>
              <Text style={[styles.storePrice, { color: colors.primary }]}>
                {store.price}
              </Text>
              <IconSymbol name="chevron.right" size={16} color={themeColors.textSecondary} />
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity 
          style={[styles.newScanButton, { backgroundColor: colors.primaryLight }]}
          onPress={() => {
            setScanResult(null);
            setScannedImage(null);
          }}
        >
          <IconSymbol name="camera.viewfinder" size={18} color="#FFFFFF" />
          <Text style={styles.newScanText}>Scan Another Item</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (isScanning) {
    return (
      <View style={[styles.container, styles.scanningContainer, { backgroundColor: themeColors.surface }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.scanningText, { color: themeColors.text }]}>
          Analyzing with AI Vision...
        </Text>
        <Text style={[styles.scanningSubtext, { color: themeColors.textSecondary }]}>
          Powered by Gemini & Google Vision
        </Text>
      </View>
    );
  }

  if (scanResult) {
    return renderScanResult();
  }

  return (
    <View style={[
      {
        backgroundColor: isDark ? 'rgba(139,92,246,0.1)' : 'rgba(139,92,246,0.05)',
        borderRadius: borderRadius['2xl'],
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: isDark ? 'rgba(139,92,246,0.3)' : 'rgba(139,92,246,0.2)',
        ...shadows.md,
      }
    ]}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
        <View style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: colors.secondary,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: spacing.sm,
        }}>
          <IconSymbol name="camera.viewfinder" size={22} color="#FFFFFF" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[
            {
              fontSize: 18,
              fontWeight: '700',
              marginBottom: 2,
              color: isDark ? '#FFFFFF' : colors.text
            }
          ]}>
            Shopping Assistant
          </Text>
          <Text style={[
            {
              fontSize: 13,
              color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
              fontWeight: '500'
            }
          ]}>
            AI-powered product scanner & price finder
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={{ 
        flexDirection: 'row', 
        gap: spacing.sm,
        marginBottom: spacing.md 
      }}>
        <TouchableOpacity
          onPress={handleScanItem}
          disabled={isScanning}
          style={[
            {
              flex: 1,
              backgroundColor: colors.secondary,
              borderRadius: borderRadius.xl,
              paddingVertical: spacing.md,
              paddingHorizontal: spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              ...shadows.sm,
            }
          ]}
          activeOpacity={0.8}
        >
          <IconSymbol 
            name={isScanning ? "camera.fill" : "camera"} 
            size={18} 
            color="#FFFFFF" 
          />
          <Text style={[
            {
              fontSize: 14,
              fontWeight: '600',
              marginLeft: spacing.xs,
              color: '#FFFFFF'
            }
          ]}>
            {isScanning ? 'Scanning...' : 'Scan Item'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSelectFromGallery}
          style={[
            {
              flex: 1,
              backgroundColor: isDark ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.1)',
              borderRadius: borderRadius.xl,
              paddingVertical: spacing.md,
              paddingHorizontal: spacing.md,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: isDark ? 'rgba(139,92,246,0.4)' : 'rgba(139,92,246,0.3)',
            }
          ]}
          activeOpacity={0.7}
        >
          <IconSymbol name="photo" size={18} color={colors.secondary} />
          <Text style={[
            {
              fontSize: 14,
              fontWeight: '600',
              marginLeft: spacing.xs,
              color: colors.secondary
            }
          ]}>
            Gallery
          </Text>
        </TouchableOpacity>
      </View>

      {/* Features */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <IconSymbol name="eye.fill" size={16} color={colors.secondary} />
          <Text style={[
            {
              fontSize: 11,
              marginTop: spacing.xs,
              textAlign: 'center',
              color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
              fontWeight: '500'
            }
          ]}>
            AI Vision
          </Text>
        </View>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <IconSymbol name="building.2.fill" size={16} color={colors.secondary} />
          <Text style={[
            {
              fontSize: 11,
              marginTop: spacing.xs,
              textAlign: 'center',
              color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
              fontWeight: '500'
            }
          ]}>
            Find Stores
          </Text>
        </View>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <IconSymbol name="chart.bar.fill" size={16} color={colors.secondary} />
          <Text style={[
            {
              fontSize: 11,
              marginTop: spacing.xs,
              textAlign: 'center',
              color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
              fontWeight: '500'
            }
          ]}>
            Compare Prices
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    ...shadows.md,
  },
  scanningContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  scanningText: {
    ...typography.heading3,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  scanningSubtext: {
    ...typography.body2,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.primary[600]}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  headerText: {
    flex: 1,
  },
  title: {
    ...typography.heading3,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body2,
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: `${colors.primary[600]}08`,
  },
  feature: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  featureText: {
    ...typography.caption,
    fontWeight: '600',
  },
  actions: {
    gap: spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  primaryAction: {
    ...shadows.sm,
  },
  secondaryAction: {
    borderWidth: 1,
  },
  actionText: {
    ...typography.body1,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  secondaryActionText: {
    ...typography.body1,
    fontWeight: '600',
  },
  resultContainer: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    ...shadows.md,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  resultInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  itemName: {
    ...typography.heading3,
    marginBottom: spacing.xs,
  },
  itemDescription: {
    ...typography.body2,
    marginBottom: spacing.sm,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  confidenceText: {
    ...typography.caption,
    fontWeight: '600',
  },
  scannedImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.lg,
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: `${colors.primary[600]}08`,
  },
  priceLabel: {
    ...typography.caption,
    marginBottom: spacing.xs,
  },
  priceRange: {
    ...typography.heading2,
    fontWeight: 'bold',
  },
  storesHeader: {
    ...typography.subtitle1,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  storeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    ...typography.subtitle2,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  storeLocation: {
    ...typography.caption,
    marginBottom: spacing.sm,
  },
  storeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  availability: {
    ...typography.caption,
    fontWeight: '600',
  },
  distance: {
    ...typography.caption,
  },
  priceSection: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  storePrice: {
    ...typography.subtitle1,
    fontWeight: 'bold',
  },
  newScanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    marginTop: spacing.lg,
    gap: spacing.sm,
    ...shadows.sm,
  },
  newScanText: {
    ...typography.body1,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default ShoppingAssistantCard;
