/**
 * Store Card Types for NaviLynx Wallet Feature
 */

export interface StoreCard {
  id: string;
  storeName: string;
  barcodeData: string;
  logoUrl: string;
  accentColor: string;
  loyaltyTier?: string;
  createdAt: Date;
}

export interface StoreCardDB {
  id: string;
  user_id: string;
  store_name: string;
  barcode_data: string;
  logo_url: string;
  accent_color: string;
  loyalty_tier?: string;
  created_at: string;
}

export type SupportedBarcodeFormat = 
  | 'qr'
  | 'ean13'
  | 'ean8'
  | 'code128'
  | 'code39'
  | 'code93'
  | 'codabar'
  | 'upc_a'
  | 'upc_e';

export interface BarcodeScannedData {
  data: string;
  format: SupportedBarcodeFormat;
  timestamp: Date;
}
