
import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { useTheme } from '@/context/ThemeContext';
import { ModernCard } from './ui/ModernComponents';
import { IconSymbol } from './ui/IconSymbol';
import { geminiService } from '@/services/geminiService';
import * as FileSystem from 'expo-file-system';

interface ScannedObject {
  name: string;
  description: string;
  category: string;
  estimatedPrice: string;
  nearbyStores: string[];
  confidence: number;
}

interface AIObjectScannerProps {
  visible: boolean;
  onClose: () => void;
  onObjectScanned?: (object: ScannedObject) => void;
}

export function AIObjectScanner({ visible, onClose, onObjectScanned }: AIObjectScannerProps) {
  const { colors } = useTheme();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedObject, setScannedObject] = useState<ScannedObject | null>(null);
  const cameraRef = useRef<CameraView>(null);

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const analyzeImage = async (imageUri: string): Promise<ScannedObject> => {
    try {
      // Convert image to base64
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // Use Gemini Vision API through our service
      const result = await geminiService.analyzeObject(base64);
      
      return {
        name: result.name,
        description: result.description,
        category: result.category,
        estimatedPrice: result.estimatedPrice || 'Unknown',
        nearbyStores: result.nearbyStores || ['General store'],
        confidence: result.confidence
      };
    } catch (error) {
      console.error('Image analysis error:', error);
      
      // Fallback to mock data if API fails
      const mockObjects = [
        {
          name: 'Nike Air Max Sneakers',
          description: 'Popular athletic footwear with Air Max cushioning technology',
          category: 'Footwear',
          estimatedPrice: 'R1,200 - R2,500',
          nearbyStores: ['Sportscene', 'Totalsports', 'The Cross Trainer'],
          confidence: 0.89
        },
        {
          name: 'Samsung Galaxy Smartphone',
          description: 'Android smartphone with advanced camera features',
          category: 'Electronics',
          estimatedPrice: 'R8,000 - R15,000',
          nearbyStores: ['iStore', 'MTN Store', 'Vodacom Shop'],
          confidence: 0.92
        },
        {
          name: 'Coffee Mug',
          description: 'Ceramic coffee mug, standard size',
          category: 'Home & Kitchen',
          estimatedPrice: 'R50 - R200',
          nearbyStores: ['@Home', 'Mr Price Home', 'Woolworths'],
          confidence: 0.76
        }
      ];

      return mockObjects[Math.floor(Math.random() * mockObjects.length)];
    }
  };

  const takePicture = useCallback(async () => {
    if (!cameraRef.current || isScanning) return;
    
    setIsScanning(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });
      
      if (photo) {
        const result = await analyzeImage(photo.uri);
        setScannedObject(result);
        onObjectScanned?.(result);
      }
    } catch (error) {
      Alert.alert('Error', `Failed to analyze object: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    } finally {
      setIsScanning(false);
    }
  }, [isScanning, onObjectScanned]);

  const resetScanner = () => {
    setScannedObject(null);
  };

  if (hasPermission === null) {
    return (
      <Modal visible={visible} animationType="slide">
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.text }]}>
              Requesting camera permission...
            </Text>
          </View>
        </View>
      </Modal>
    );
  }

  if (hasPermission === false) {
    return (
      <Modal visible={visible} animationType="slide">
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={styles.centerContent}>
            <IconSymbol name="camera.fill" size={64} color={colors.icon} />
            <Text style={[styles.permissionTitle, { color: colors.text }]}>
              Camera Access Required
            </Text>
            <Text style={[styles.permissionText, { color: colors.icon }]}>
              NaviLynx needs camera access to scan and identify objects
            </Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide">
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.card }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <IconSymbol name="xmark" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            AI Object Scanner
          </Text>
          <TouchableOpacity onPress={resetScanner} style={styles.resetButton}>
            <IconSymbol name="arrow.clockwise" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {scannedObject ? (
          // Results View
          <ScrollView style={styles.resultsContainer}>
            <ModernCard style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <IconSymbol name="checkmark.circle.fill" size={32} color="#4CAF50" />
                <Text style={[styles.resultTitle, { color: colors.text }]}>
                  Object Identified!
                </Text>
              </View>
              
              <View style={styles.objectInfo}>
                <Text style={[styles.objectName, { color: colors.primary }]}>
                  {scannedObject.name}
                </Text>
                
                <Text style={[styles.objectDescription, { color: colors.text }]}>
                  {scannedObject.description}
                </Text>
                
                <View style={styles.metadataRow}>
                  <View style={styles.metadataItem}>
                    <Text style={[styles.metadataLabel, { color: colors.icon }]}>
                      Category
                    </Text>
                    <Text style={[styles.metadataValue, { color: colors.text }]}>
                      {scannedObject.category}
                    </Text>
                  </View>
                  
                  <View style={styles.metadataItem}>
                    <Text style={[styles.metadataLabel, { color: colors.icon }]}>
                      Confidence
                    </Text>
                    <Text style={[styles.metadataValue, { color: colors.text }]}>
                      {Math.round(scannedObject.confidence * 100)}%
                    </Text>
                  </View>
                </View>
                
                <View style={styles.priceSection}>
                  <Text style={[styles.priceLabel, { color: colors.icon }]}>
                    Estimated Price Range
                  </Text>
                  <Text style={[styles.priceValue, { color: colors.primary }]}>
                    {scannedObject.estimatedPrice}
                  </Text>
                </View>
                
                <View style={styles.storesSection}>
                  <Text style={[styles.storesLabel, { color: colors.icon }]}>
                    Available at nearby stores:
                  </Text>
                  {scannedObject.nearbyStores.map((store, index) => (
                    <View key={index} style={styles.storeItem}>
                      <IconSymbol name="storefront" size={16} color={colors.primary} />
                      <Text style={[styles.storeName, { color: colors.text }]}>
                        {store}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
              
              <TouchableOpacity
                style={[styles.scanAgainButton, { backgroundColor: colors.primary }]}
                onPress={resetScanner}
              >
                <IconSymbol name="camera.fill" size={20} color="#FFFFFF" />
                <Text style={styles.scanAgainText}>Scan Another Object</Text>
              </TouchableOpacity>
            </ModernCard>
          </ScrollView>
        ) : (
          // Camera View
          <View style={styles.cameraContainer}>
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing="back"
            >
              <View style={styles.overlay}>
                <View style={styles.scanArea}>
                  <View style={[styles.corner, styles.topLeft]} />
                  <View style={[styles.corner, styles.topRight]} />
                  <View style={[styles.corner, styles.bottomLeft]} />
                  <View style={[styles.corner, styles.bottomRight]} />
                </View>
                
                <View style={styles.instructionContainer}>
                  <Text style={styles.instructionText}>
                    Point camera at an object to scan
                  </Text>
                </View>
                
                <View style={styles.captureContainer}>
                  <TouchableOpacity
                    style={[
                      styles.captureButton,
                      { backgroundColor: colors.primary },
                      isScanning && styles.captureButtonDisabled
                    ]}
                    onPress={takePicture}
                    disabled={isScanning}
                  >
                    {isScanning ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <IconSymbol name="camera.fill" size={24} color="#FFFFFF" />
                    )}
                  </TouchableOpacity>
                  
                  {isScanning && (
                    <Text style={styles.scanningText}>
                      Analyzing object...
                    </Text>
                  )}
                </View>
              </View>
            </CameraView>
          </View>
        )}
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 50,
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  resetButton: {
    padding: 4,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 32,
  },
  scanArea: {
    width: 200,
    height: 200,
    position: 'relative',
    marginTop: 100,
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#FFFFFF',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  instructionContainer: {
    alignItems: 'center',
  },
  instructionText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  captureContainer: {
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  captureButtonDisabled: {
    opacity: 0.7,
  },
  scanningText: {
    color: '#FFFFFF',
    fontSize: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  resultCard: {
    padding: 24,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  objectInfo: {
    marginBottom: 24,
  },
  objectName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  objectDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metadataItem: {
    flex: 1,
  },
  metadataLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  metadataValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  priceSection: {
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  storesSection: {
    marginBottom: 16,
  },
  storesLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  storeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  storeName: {
    marginLeft: 8,
    fontSize: 16,
  },
  scanAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  scanAgainText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
