module.exports = {
  // Configure for NativeWind v4
  experimental: {
    textTransforms: false,
  },
  // Prevent CSS interop issues
  content: {
    strict: false,
  },
  // Disable problematic features that cause parsing errors
  transforms: {
    checkTextNodes: false,
  },
  // Disable aspect ratio processing to prevent errors
  corePlugins: {
    aspectRatio: false,
  },
};
