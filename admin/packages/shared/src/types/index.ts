/**
 * 📱 OPERATION LIONMOUNTAIN - Shared Type Definitions
 * 
 * Common types used across mobile and admin applications
 * 
 * @version 1.0.0 - LIONMOUNTAIN Edition
 */

// Theme Types
export interface ColorTheme {
  primary: string
  primaryLight: string
  primaryDark: string
  secondary: string
  background: string
  surface: string
  text: string
  textSecondary: string
  border: string
}

// Navigation Types
export interface NavigationRoute {
  name: string
  params?: Record<string, any>
}

// Common Component Props
export interface BaseComponentProps {
  style?: any
  testID?: string
  children?: React.ReactNode
}

// Venue Types
export interface Venue {
  id: string
  name: string
  address: string
  category: string
  rating: number
  imageUrl: string
  coordinates: {
    latitude: number
    longitude: number
  }
}

// Deal Types
export interface Deal {
  id: string
  title: string
  description: string
  discount: string
  venueId: string
  imageUrl: string
  validUntil: string
}

// Store Card Types
export interface StoreCard {
  id: string
  storeName: string
  cardNumber: string
  barcode?: string
  qrCode?: string
  imageUrl?: string
  brandColor: string
}

// API Response Types
export interface APIResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}
