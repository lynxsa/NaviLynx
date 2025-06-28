module.exports = {
  // Disable strict text checking to prevent false positives
  experimental: {
    textTransforms: false,
  },
  // Allow string literals in JSX without wrapping in Text
  content: {
    strict: false,
  },
  // Custom transformations
  transforms: {
    // Disable strict text node checking
    checkTextNodes: false,
  },
};
