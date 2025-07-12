const { getDefaultConfig } = require('expo/metro-config');
// Temporarily disable NativeWind to fix CSS issues
// const { withNativeWind } = require('nativewind/metro');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Temporarily disable NativeWind support
// const nativeWindConfig = withNativeWind(config, {
//   input: './global.css',
//   configPath: './tailwind.config.js',
// });

// Add resolver for React compiler runtime
config.resolver.alias = {
  ...config.resolver.alias,
  'react/compiler-runtime': path.resolve(__dirname, 'react-compiler-runtime.js')
};

// Configure module map for compatibility
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Handle .web.js and other platform extensions
config.resolver.platforms = ['native', 'android', 'ios', 'web'];

// Add platform-specific resolution to handle native-only modules
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform, realModuleName) => {
  // Skip react-native-maps and other native-only modules on web
  if (platform === 'web' && moduleName.startsWith('react-native-maps')) {
    return {
      type: 'empty',
    };
  }
  
  // Handle other native-only modules on web
  if (platform === 'web' && moduleName.includes('codegenNativeCommands')) {
    return {
      type: 'empty',
    };
  }
  
  // Use default resolution for other cases
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform, realModuleName);
  }
  
  return context.resolveRequest(context, moduleName, platform, realModuleName);
};

module.exports = config;
