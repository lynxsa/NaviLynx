
import { Alert } from 'react-native';
import { TRANSLATIONS } from '@/constants/Languages';

export interface AppError {
  code: string;
  message: string;
  details?: any;
}

export const ErrorCodes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  LOCATION_PERMISSION_DENIED: 'LOCATION_PERMISSION_DENIED',
  CAMERA_PERMISSION_DENIED: 'CAMERA_PERMISSION_DENIED',
  AR_INITIALIZATION_FAILED: 'AR_INITIALIZATION_FAILED',
  PARKING_RESERVATION_FAILED: 'PARKING_RESERVATION_FAILED',
  VENUE_NOT_FOUND: 'VENUE_NOT_FOUND',
  NAVIGATION_FAILED: 'NAVIGATION_FAILED',
} as const;

export const ErrorMessages = {
  [ErrorCodes.NETWORK_ERROR]: 'Network connection failed. Please check your internet connection.',
  [ErrorCodes.LOCATION_PERMISSION_DENIED]: 'Location permission is required for navigation.',
  [ErrorCodes.CAMERA_PERMISSION_DENIED]: 'Camera permission is required for AR navigation.',
  [ErrorCodes.AR_INITIALIZATION_FAILED]: 'Failed to initialize AR. Please try again.',
  [ErrorCodes.PARKING_RESERVATION_FAILED]: 'Unable to reserve parking spot. Please try again.',
  [ErrorCodes.VENUE_NOT_FOUND]: 'Venue information not found.',
  [ErrorCodes.NAVIGATION_FAILED]: 'Navigation failed to start. Please try again.',
};

export class AppErrorHandler {
  static createError(code: keyof typeof ErrorCodes, details?: any, language: string = 'en'): AppError {
    const translations = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;
    const message = translations[code as keyof typeof translations] || ErrorMessages[code] || 'An unknown error occurred';
    
    return {
      code,
      message,
      details,
    };
  }

  static handle(error: AppError | Error, showAlert: boolean = true, language: string = 'en'): void {
    console.error('App Error:', error);
    
    if (showAlert) {
      const translations = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;
      const message = error instanceof Error ? error.message : error.message;
      const retryText = (translations as any).retry || TRANSLATIONS.en.retry || 'Retry';
      const cancelText = (translations as any).cancel || TRANSLATIONS.en.cancel || 'Cancel';
      
      Alert.alert('Error', message, [
        { text: cancelText, style: 'cancel' },
        { text: retryText, style: 'default' }
      ]);
    }
  }

  static handleNetworkError(error: any, language: string = 'en'): void {
    const appError = this.createError(ErrorCodes.NETWORK_ERROR, error, language);
    this.handle(appError, true, language);
  }

  static handleLocationError(error: any, language: string = 'en'): void {
    const appError = this.createError(ErrorCodes.LOCATION_PERMISSION_DENIED, error, language);
    this.handle(appError, true, language);
  }

  static handleCameraError(error: any, language: string = 'en'): void {
    const appError = this.createError(ErrorCodes.CAMERA_PERMISSION_DENIED, error, language);
    this.handle(appError, true, language);
  }

  static handleARError(error: any, language: string = 'en'): void {
    const appError = this.createError(ErrorCodes.AR_INITIALIZATION_FAILED, error, language);
    this.handle(appError, true, language);
  }
}

export default AppErrorHandler;
