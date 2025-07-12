export {}; // Ensure this file is treated as a module

declare module 'expo-speech' {
  export interface SpeechOptions {
    language?: string;
    pitch?: number;
    rate?: number;
    volume?: number;
    voice?: string;
    onStart?: () => void;
    onDone?: () => void;
    onStopped?: () => void;
    onError?: (error: Error) => void;
  }

  export interface Voice {
    identifier: string;
    name: string;
    quality: 'default' | 'enhanced';
    language: string;
  }

  export function speak(text: string, options?: SpeechOptions): void;
  export function getAvailableVoicesAsync(): Promise<Voice[]>;
  export function isSpeakingAsync(): Promise<boolean>;
  export function stop(): Promise<void>;
  export function pause(): Promise<void>;
  export function resume(): Promise<void>;

  // Add other exports from expo-speech if needed
}
