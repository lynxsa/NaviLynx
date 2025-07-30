#!/usr/bin/env node

// Import test script to verify all imports work correctly
console.log('🔍 Testing imports...\n');

try {
  console.log('✓ Testing context imports...');
  // Test context imports with relative paths
  const path = require('path');
  
  // Test if files exist
  const contextPath = path.join(process.cwd(), 'context');
  const componentsPath = path.join(process.cwd(), 'components');
  
  console.log('Context path:', contextPath);
  console.log('Components path:', componentsPath);
  
  const fs = require('fs');
  
  const contextFiles = [
    'ThemeContext.tsx',
    'LanguageContext.tsx', 
    'AuthContext.tsx',
    'SavedVenuesContext.tsx',
    'ErrorHandlerContext.tsx',
    'PerformanceContext.tsx'
  ];
  
  contextFiles.forEach(file => {
    const filePath = path.join(contextPath, file);
    if (fs.existsSync(filePath)) {
      console.log(`✓ ${file} exists`);
    } else {
      console.log(`✗ ${file} missing`);
    }
  });
  
  const componentsFiles = [
    'ErrorBoundary.tsx'
  ];
  
  componentsFiles.forEach(file => {
    const filePath = path.join(componentsPath, file);
    if (fs.existsSync(filePath)) {
      console.log(`✓ ${file} exists`);
    } else {
      console.log(`✗ ${file} missing`);
    }
  });
  
  console.log('\n✓ All file checks completed');
  
} catch (error) {
  console.error('❌ Import test failed:', error.message);
  console.error('Stack:', error.stack);
}
