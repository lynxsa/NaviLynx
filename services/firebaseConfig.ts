// Mock Firebase configuration for development/testing
// Replace with actual Firebase config for production

export const firebaseConfig = {
  apiKey: "mock-api-key",
  authDomain: "mock-project.firebaseapp.com",
  projectId: "mock-project",
  storageBucket: "mock-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456789"
};

// Mock Firestore database
export const db = {
  // Mock implementation - replace with actual Firebase initialization
  collection: () => ({
    doc: () => ({
      get: () => Promise.resolve({ exists: false, data: () => null }),
      set: () => Promise.resolve(),
      update: () => Promise.resolve()
    })
  })
};

// Export for backward compatibility
export default db;
