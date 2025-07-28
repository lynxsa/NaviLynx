import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import ShopAssistantService, { Product } from './ShopAssistantService';

export interface ScanResult {
  success: boolean;
  product?: Product;
  confidence: number;
  message: string;
  alternativeProducts?: Product[];
  scanTime: number;
}

export interface ScanSession {
  id: string;
  startTime: string;
  scannedProducts: Product[];
  totalScans: number;
  successfulScans: number;
}

class ProductScannerService {
  private static instance: ProductScannerService;
  private shopAssistantService: ShopAssistantService;
  private currentSession: ScanSession | null = null;
  private scanHistory: ScanResult[] = [];

  private constructor() {
    this.shopAssistantService = ShopAssistantService.getInstance();
  }

  public static getInstance(): ProductScannerService {
    if (!ProductScannerService.instance) {
      ProductScannerService.instance = new ProductScannerService();
    }
    return ProductScannerService.instance;
  }

  // Camera Permissions and Setup
  public async requestCameraPermission(): Promise<boolean> {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      return false;
    }
  }

  public async requestImageLibraryPermission(): Promise<boolean> {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting image library permission:', error);
      return false;
    }
  }

  // Image Capture and Processing
  public async captureProductImage(): Promise<{
    success: boolean;
    imageUri?: string;
    error?: string;
  }> {
    try {
      const hasPermission = await this.requestCameraPermission();
      if (!hasPermission) {
        return {
          success: false,
          error: 'Camera permission not granted'
        };
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: false,
      });

      if (result.canceled) {
        return {
          success: false,
          error: 'Image capture cancelled'
        };
      }

      return {
        success: true,
        imageUri: result.assets[0].uri
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to capture image: ${error}`
      };
    }
  }

  public async selectImageFromLibrary(): Promise<{
    success: boolean;
    imageUri?: string;
    error?: string;
  }> {
    try {
      const hasPermission = await this.requestImageLibraryPermission();
      if (!hasPermission) {
        return {
          success: false,
          error: 'Image library permission not granted'
        };
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: false,
      });

      if (result.canceled) {
        return {
          success: false,
          error: 'Image selection cancelled'
        };
      }

      return {
        success: true,
        imageUri: result.assets[0].uri
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to select image: ${error}`
      };
    }
  }

  private async processImageForScanning(imageUri: string): Promise<string> {
    try {
      // For now, return the image URI as base64 would be handled by the AI service
      // In production, this would optimize the image for better scanning
      return imageUri;
    } catch (error) {
      console.error('Error processing image:', error);
      throw new Error('Failed to process image for scanning');
    }
  }

  // Product Scanning and Recognition
  public async scanProductFromImage(imageUri: string): Promise<ScanResult> {
    const scanStartTime = Date.now();
    
    try {
      // Process image for optimal scanning
      const processedImage = await this.processImageForScanning(imageUri);
      
      // Use ShopAssistantService for product recognition
      const scanResult = await this.shopAssistantService.scanProduct(processedImage);
      
      const scanTime = Date.now() - scanStartTime;
      
      const result: ScanResult = {
        success: scanResult.success,
        product: scanResult.product,
        confidence: scanResult.confidence,
        message: scanResult.message,
        scanTime,
        alternativeProducts: scanResult.product ? 
          await this.findAlternativeProducts(scanResult.product) : undefined
      };

      // Record scan in history
      this.scanHistory.push(result);
      
      // Update current session
      if (this.currentSession) {
        this.currentSession.totalScans++;
        if (result.success && result.product) {
          this.currentSession.successfulScans++;
          this.currentSession.scannedProducts.push(result.product);
        }
      }

      return result;
    } catch (error) {
      const scanTime = Date.now() - scanStartTime;
      const errorResult: ScanResult = {
        success: false,
        confidence: 0,
        message: `Scan failed: ${error}`,
        scanTime
      };
      
      this.scanHistory.push(errorResult);
      return errorResult;
    }
  }

  // Alternative Product Suggestions
  private async findAlternativeProducts(product: Product): Promise<Product[]> {
    try {
      // Search for similar products in the same category
      const similarProducts = await this.shopAssistantService.searchProducts(product.category);
      
      // Filter out the original product and return top 3 alternatives
      return similarProducts
        .filter(p => p.id !== product.id)
        .slice(0, 3);
    } catch (error) {
      console.error('Error finding alternative products:', error);
      return [];
    }
  }

  // Scanning Session Management
  public startScanningSession(): ScanSession {
    this.currentSession = {
      id: `session_${Date.now()}`,
      startTime: new Date().toISOString(),
      scannedProducts: [],
      totalScans: 0,
      successfulScans: 0
    };
    
    return this.currentSession;
  }

  public getCurrentSession(): ScanSession | null {
    return this.currentSession;
  }

  public endScanningSession(): ScanSession | null {
    const session = this.currentSession;
    this.currentSession = null;
    return session;
  }

  // Scan History and Analytics
  public getScanHistory(limit?: number): ScanResult[] {
    if (limit) {
      return this.scanHistory.slice(-limit);
    }
    return [...this.scanHistory];
  }

  public getScanStatistics(): {
    totalScans: number;
    successfulScans: number;
    successRate: number;
    averageScanTime: number;
    topScannedCategories: { category: string; count: number }[];
  } {
    const totalScans = this.scanHistory.length;
    const successfulScans = this.scanHistory.filter(scan => scan.success).length;
    const successRate = totalScans > 0 ? (successfulScans / totalScans) * 100 : 0;
    
    const totalScanTime = this.scanHistory.reduce((sum, scan) => sum + scan.scanTime, 0);
    const averageScanTime = totalScans > 0 ? totalScanTime / totalScans : 0;

    // Calculate top scanned categories
    const categoryCount: { [key: string]: number } = {};
    this.scanHistory.forEach(scan => {
      if (scan.success && scan.product) {
        const category = scan.product.category;
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      }
    });

    const topScannedCategories = Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalScans,
      successfulScans,
      successRate: Math.round(successRate * 10) / 10,
      averageScanTime: Math.round(averageScanTime),
      topScannedCategories
    };
  }

  // Barcode Scanning (Mock Implementation)
  public async scanBarcode(barcode: string): Promise<ScanResult> {
    const scanStartTime = Date.now();
    
    try {
      // In production, this would query a barcode database
      // For now, simulate barcode lookup
      const mockProduct: Product = {
        id: `barcode_${barcode}`,
        name: 'Scanned Product',
        category: 'Unknown',
        barcode,
        avgPrice: 25.99,
        reviews: { rating: 4.0, count: 100 }
      };

      const scanTime = Date.now() - scanStartTime;
      
      const result: ScanResult = {
        success: true,
        product: mockProduct,
        confidence: 0.95,
        message: 'Product found via barcode',
        scanTime
      };

      this.scanHistory.push(result);
      return result;
    } catch (error) {
      const scanTime = Date.now() - scanStartTime;
      const errorResult: ScanResult = {
        success: false,
        confidence: 0,
        message: `Barcode scan failed: ${error}`,
        scanTime
      };
      
      this.scanHistory.push(errorResult);
      return errorResult;
    }
  }

  // Quick Actions for Scanned Products
  public async addScannedProductToList(
    product: Product, 
    listId: string, 
    quantity: number = 1
  ): Promise<void> {
    await this.shopAssistantService.addItemToList(listId, {
      productId: product.id,
      name: product.name,
      quantity,
      unit: 'item',
      category: product.category,
      priority: 'medium',
      estimatedPrice: product.avgPrice,
      isCompleted: false
    });
  }

  public async compareScannedProductPrices(product: Product) {
    return await this.shopAssistantService.compareProductPrices(product.id);
  }

  // Utility Methods
  public formatScanTime(milliseconds: number): string {
    if (milliseconds < 1000) {
      return `${milliseconds}ms`;
    }
    return `${(milliseconds / 1000).toFixed(1)}s`;
  }

  public getConfidenceLevel(confidence: number): 'low' | 'medium' | 'high' {
    if (confidence >= 0.8) return 'high';
    if (confidence >= 0.6) return 'medium';
    return 'low';
  }

  public clearScanHistory(): void {
    this.scanHistory = [];
  }
}

export default ProductScannerService;
