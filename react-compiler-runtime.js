// React Compiler Runtime Polyfill
// This file provides minimal compatibility for React 19 without the React compiler

// Export an empty object to satisfy the "react/compiler-runtime" import
module.exports = {};

// If using ES modules
if (typeof exports === 'object' && typeof module !== 'undefined') {
  module.exports = {};
} else if (typeof define === 'function' && define.amd) {
  define(function() { return {}; });
} else {
  // Browser global
  (function() {
    if (typeof window !== 'undefined') {
      window.ReactCompilerRuntime = {};
    }
    if (typeof global !== 'undefined') {
      global.ReactCompilerRuntime = {};
    }
  })();
}
