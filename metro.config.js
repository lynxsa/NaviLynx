const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add resolver for React compiler runtime
config.resolver.alias = {
  ...config.resolver.alias,
  'react/compiler-runtime': path.resolve(__dirname, 'react-compiler-runtime.js')
};

// Configure module map for compatibility
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Handle .web.js and other platform extensions
config.resolver.platforms = ['native', 'android', 'ios', 'web'];

module.exports = config;
