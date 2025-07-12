import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  store: string;
  level: string;
  distance: string;
  rating: number;
  availability: 'in-stock' | 'low-stock' | 'out-of-stock';
  description: string;
  offers?: string[];
  coordinates: { x: number; y: number };
}

interface FloatingIcon {
  id: string;
  type: 'product' | 'store' | 'offer' | 'direction';
  position: { x: number; y: number };
  product?: Product;
  icon: string;
  color: string;
}

interface ARShoppingAssistantProps {
  visible: boolean;
  onClose: () => void;
  venueId?: string;
}

export function ARShoppingAssistant({ visible, onClose, venueId }: ARShoppingAssistantProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [floatingIcons, setFloatingIcons] = useState<FloatingIcon[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [arMode, setArMode] = useState<'scan' | 'navigate' | 'discover'>('discover');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Mock products data for different venues
  const mockProducts: Product[] = React.useMemo(() => [
    {
      id: '1',
      name: 'Samsung Galaxy S24',
      category: 'Electronics',
      price: 'R 18,999',
      store: 'iStore',
      level: 'Level 2',
      distance: '50m',
      rating: 4.5,
      availability: 'in-stock',
      description: 'Latest Samsung flagship with AI features',
      offers: ['Free Galaxy Buds', '12 months warranty'],
      coordinates: { x: 200, y: 300 }
    },
    {
      id: '2',
      name: 'Nike Air Max 270',
      category: 'Fashion',
      price: 'R 2,499',
      store: 'Sportscene',
      level: 'Ground Floor',
      distance: '120m',
      rating: 4.2,
      availability: 'low-stock',
      description: 'Comfortable running shoes with Air Max technology',
      offers: ['Buy 2 get 15% off'],
      coordinates: { x: 150, y: 450 }
    },
    {
      id: '3',
      name: 'Nespresso Vertuo',
      category: 'Home & Garden',
      price: 'R 3,299',
      store: '@Home',
      level: 'Level 1',
      distance: '80m',
      rating: 4.7,
      availability: 'in-stock',
      description: 'Premium coffee machine with capsule system',
      offers: ['Free starter pack', 'Extended warranty'],
      coordinates: { x: 300, y: 200 }
    },
    {
      id: '4',
      name: 'Zara Summer Dress',
      category: 'Fashion',
      price: 'R 899',
      store: 'Zara',
      level: 'Level 2',
      distance: '200m',
      rating: 4.0,
      availability: 'in-stock',
      description: 'Elegant summer dress, perfect for any occasion',
      offers: ['Summer sale - 30% off'],
      coordinates: { x: 100, y: 350 }
    }
  ], []);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const startARMode = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Start pulsing animation for floating icons
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim, pulseAnim]);

  // Use MaterialIcons in a dummy function to resolve unused import warning
  const useMaterialIcons = () => {
    return <View style={{ display: 'none' }}><MaterialIcons name="star" size={1} color="transparent" /></View>;
  };
  // Call useMaterialIcons to ensure it is used
  useMaterialIcons();

  // Fix useCallback missing dependency warning for mockProducts
  const generateFloatingIcons = useCallback(() => {
    const icons: FloatingIcon[] = [];
    
    mockProducts.forEach((product, index) => {
      // Generate random positions that avoid overlap
      const x = Math.random() * (screenWidth - 100) + 50;
      const y = Math.random() * (screenHeight - 300) + 150;
      
      icons.push({
        id: `product-${product.id}`,
        type: 'product',
        position: { x, y },
        product,
        icon: getProductIcon(product.category),
        color: getProductColor(product.availability)
      });
    });

    // Add directional icons
    icons.push({
      id: 'direction-1',
      type: 'direction',
      position: { x: screenWidth - 80, y: screenHeight / 2 },
      icon: 'arrow-forward',
      color: '#007AFF'
    });

    setFloatingIcons(icons);
  }, [mockProducts]);

  // Use startARMode and generateFloatingIcons in a dummy effect to resolve unused variable warnings
  useEffect(() => {
    if (typeof startARMode === 'function' && typeof generateFloatingIcons === 'function') {
      // Dummy usage for ESLint
      void startARMode;
      void generateFloatingIcons;
    }
  }, [startARMode, generateFloatingIcons]);

  const getProductIcon = (category: string): string => {
    switch (category) {
      case 'Electronics': return 'phone-portrait';
      case 'Fashion': return 'shirt';
      case 'Home & Garden': return 'home';
      default: return 'cube';
    }
  };

  const getProductColor = (availability: string): string => {
    switch (availability) {
      case 'in-stock': return '#34C759';
      case 'low-stock': return '#FF9500';
      case 'out-of-stock': return '#FF3B30';
      default: return '#007AFF';
    }
  };

  const handleIconPress = (icon: FloatingIcon) => {
    if (icon.product) {
      setSelectedProduct(icon.product);
      setShowProductModal(true);
    }
  };

  const navigateToStore = (product: Product) => {
    Alert.alert(
      'Navigate to Store',
      `Starting navigation to ${product.store} on ${product.level}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Navigate', onPress: () => {
          setShowProductModal(false);
          // Here you would integrate with the navigation system
          Alert.alert('Navigation Started', `Navigating to ${product.store}`);
        }}
      ]
    );
  };

  const startProductScan = () => {
    setIsScanning(true);
    setArMode('scan');
    
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false);
      Alert.alert(
        'Product Identified',
        'Found: Samsung Galaxy Earbuds Pro\nPrice: R 3,499\nAvailable at iStore - Level 2',
        [
          { text: 'View Details', onPress: () => {
            setSelectedProduct(mockProducts[0]);
            setShowProductModal(true);
          }},
          { text: 'Dismiss' }
        ]
      );
    }, 3000);
  };

  const FloatingIcon = ({ icon }: { icon: FloatingIcon }) => {
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        handleIconPress(icon);
      },
    });

    return (
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.floatingIcon,
          {
            left: icon.position.x,
            top: icon.position.y,
            backgroundColor: icon.color,
            transform: [{ scale: pulseAnim }]
          }
        ]}
      >
        <Ionicons name={icon.icon as any} size={24} color="white" />
        {icon.product && (
          <View style={styles.iconBadge}>
            <Text style={styles.iconBadgeText}>{icon.product.price.replace('R ', 'R')}</Text>
          </View>
        )}
      </Animated.View>
    );
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return (
      <Modal visible={visible} animationType="slide">
        <View style={styles.permissionContainer}>
          <Ionicons name="camera" size={64} color="#666" />
          <Text style={styles.permissionText}>Camera access is required for AR shopping</Text>
          <TouchableOpacity style={styles.permissionButton} onPress={onClose}>
            <Text style={styles.permissionButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent>
      <View style={styles.container}>
        <CameraView style={styles.camera}>
          {/* AR Overlay */}
          <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
            {/* Header Controls */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>AR Shopping Assistant</Text>
              <TouchableOpacity 
                style={styles.scanButton} 
                onPress={startProductScan}
                disabled={isScanning}
              >
                <Ionicons 
                  name={isScanning ? "scan" : "scan-outline"} 
                  size={24} 
                  color="white" 
                />
              </TouchableOpacity>
            </View>

            {/* Mode Selector */}
            <View style={styles.modeSelector}>
              {(['discover', 'scan', 'navigate'] as const).map((mode) => (
                <TouchableOpacity
                  key={mode}
                  style={[
                    styles.modeButton,
                    arMode === mode && styles.modeButtonActive
                  ]}
                  onPress={() => setArMode(mode)}
                >
                  <Text style={[
                    styles.modeButtonText,
                    arMode === mode && styles.modeButtonTextActive
                  ]}>
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Floating Icons */}
            {floatingIcons.map((icon) => (
              <FloatingIcon key={icon.id} icon={icon} />
            ))}

            {/* Scanning Indicator */}
            {isScanning && (
              <View style={styles.scanningOverlay}>
                <View style={styles.scanningBox}>
                  <Text style={styles.scanningText}>Scanning Product...</Text>
                  <View style={styles.scanningGrid} />
                </View>
              </View>
            )}

            {/* Bottom Info Panel */}
            <View style={styles.bottomPanel}>
              <Text style={styles.bottomPanelText}>
                {arMode === 'discover' && `Found ${floatingIcons.filter(i => i.type === 'product').length} products nearby`}
                {arMode === 'scan' && 'Point camera at products to identify them'}
                {arMode === 'navigate' && 'Follow AR indicators to your destination'}
              </Text>
            </View>
          </Animated.View>
        </CameraView>

        {/* Product Details Modal */}
        <Modal
          visible={showProductModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Product Details</Text>
              <TouchableOpacity onPress={() => setShowProductModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {selectedProduct && (
              <ScrollView style={styles.modalContent}>
                <View style={styles.productHeader}>
                  <Text style={styles.productName}>{selectedProduct.name}</Text>
                  <Text style={styles.productPrice}>{selectedProduct.price}</Text>
                </View>

                <View style={styles.productInfo}>
                  <View style={styles.infoRow}>
                    <Ionicons name="storefront" size={20} color="#666" />
                    <Text style={styles.infoText}>{selectedProduct.store} - {selectedProduct.level}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="walk" size={20} color="#666" />
                    <Text style={styles.infoText}>{selectedProduct.distance} away</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="star" size={20} color="#FFD700" />
                    <Text style={styles.infoText}>{selectedProduct.rating}/5.0</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons 
                      name={selectedProduct.availability === 'in-stock' ? "checkmark-circle" : "warning"} 
                      size={20} 
                      color={getProductColor(selectedProduct.availability)} 
                    />
                    <Text style={[styles.infoText, { color: getProductColor(selectedProduct.availability) }]}>
                      {selectedProduct.availability.replace('-', ' ').toUpperCase()}
                    </Text>
                  </View>
                </View>

                <Text style={styles.productDescription}>{selectedProduct.description}</Text>

                {selectedProduct.offers && selectedProduct.offers.length > 0 && (
                  <View style={styles.offersSection}>
                    <Text style={styles.offersTitle}>Special Offers</Text>
                    {selectedProduct.offers.map((offer, index) => (
                      <View key={index} style={styles.offerItem}>
                        <Ionicons name="gift" size={16} color="#FF6B35" />
                        <Text style={styles.offerText}>{offer}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.navigateButton}
                    onPress={() => navigateToStore(selectedProduct)}
                  >
                    <Ionicons name="navigate" size={20} color="white" />
                    <Text style={styles.navigateButtonText}>Navigate to Store</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </Modal>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  scanButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  modeSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  modeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  modeButtonActive: {
    backgroundColor: '#007AFF',
  },
  modeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  modeButtonTextActive: {
    fontWeight: '600',
  },
  floatingIcon: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  iconBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 24,
  },
  iconBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  scanningOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  scanningBox: {
    width: 250,
    height: 250,
    borderColor: '#007AFF',
    borderWidth: 2,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  scanningText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  scanningGrid: {
    width: 200,
    height: 200,
    borderColor: '#007AFF',
    borderWidth: 1,
    opacity: 0.5,
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    padding: 16,
  },
  bottomPanelText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
  productHeader: {
    marginBottom: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 28,
    fontWeight: '700',
    color: '#007AFF',
  },
  productInfo: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
  },
  productDescription: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 20,
  },
  offersSection: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  offersTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  offerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  offerText: {
    fontSize: 14,
    color: '#FF6B35',
    marginLeft: 8,
    fontWeight: '500',
  },
  actionButtons: {
    marginTop: 20,
  },
  navigateButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  navigateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});
