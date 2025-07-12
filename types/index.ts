// Global type definitions for NaviLynx application

export interface User {
  id: string;
  email: string;
  fullName: string;
  username: string;
  avatar?: string;
  preferences: UserPreferences;
  isOnline: boolean;
  lastSeen: string;
}

export interface UserPreferences {
  language: string;
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  accessibility: AccessibilitySettings;
  shoppingInterests: string[];
  frequentVenues: string[];
}

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  voiceNavigation: boolean;
}

export interface Coordinates {
  lat: number;
  lng: number;
  altitude?: number;
}

export interface Location {
  coordinates: Coordinates;
  floor?: number;
  building?: string;
  accuracy?: number;
  timestamp?: string;
}

export interface NavigationRoute {
  id: string;
  startPoint: Location;
  endPoint: Location;
  waypoints: Location[];
  distance: number;
  estimatedTime: number;
  instructions: RouteInstruction[];
  isAccessible: boolean;
}

export interface RouteInstruction {
  id: string;
  description: string;
  direction: 'straight' | 'left' | 'right' | 'up' | 'down';
  distance: number;
  landmark?: string;
  icon?: string;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  code?: number;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ErrorInfo {
  message: string;
  code?: string | number;
  details?: any;
  timestamp?: string;
  retry?: boolean;
}

export interface ThemeColors {
  text: string;
  background: string;
  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
  primary: string;
  primaryLight: string;
  secondary: string;
  secondaryLight: string;
  accent: string;
  accentLight: string;
  surface: string;
  surfaceSecondary: string;
  border: string;
  borderLight: string;
  card: string;
  cardBackground: string;
  cardSecondary: string;
  notification: string;
  success: string;
  warning: string;
  error: string;
  destructive: string;
  muted: string;
  mutedForeground: string;
  textSecondary: string;
}

export interface Theme {
  colors: ThemeColors;
  isDark: boolean;
}

// Form validation types
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export interface FormField {
  name: string;
  value: any;
  error?: string;
  rules?: ValidationRule[];
}

export interface FormState {
  fields: Record<string, FormField>;
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
}

// Network and connectivity
export interface NetworkState {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string | null;
}

export interface SyncStatus {
  isOnline: boolean;
  lastSync: string | null;
  pendingOperations: number;
  syncInProgress: boolean;
}

// Component prop types
export interface ComponentProps {
  className?: string;
  testID?: string;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export interface ModalProps extends ComponentProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  backdrop?: boolean;
  animation?: 'slide' | 'fade' | 'none';
}

export interface ButtonProps extends ComponentProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type ID = string | number;

export type Timestamp = string | number | Date;

export type Language = 'en' | 'af' | 'zu' | 'xh' | 'st' | 'tn' | 'nso';

export type VenueCategory = 'shopping' | 'airport' | 'hospital' | 'education' | 'convention';

export type MessageType = 'text' | 'system' | 'location' | 'image';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';
