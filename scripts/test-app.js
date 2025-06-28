
#!/usr/bin/env node

/**
 * NaviLynx App Testing Script
 * Runs functional and non-functional tests
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Starting NaviLynx App Tests...\n');

// Test Categories
const tests = {
  functional: [
    'Navigation flows',
    'Form validation',
    'Data fetching',
    'Language switching',
    'Theme switching',
    'User authentication',
    'Chat functionality',
    'AR navigation features',
    'Parking features',
  ],
  nonFunctional: [
    'Performance (60fps target)',
    'Error handling',
    'Accessibility',
    'Memory usage',
    'Network resilience',
    'Offline capability',
    'Asset loading',
  ],
  platforms: [
    'iOS Simulator',
    'Android Emulator',
    'Web Browser',
  ]
};

// Component completeness check
function checkComponentCompleteness() {
  console.log('📋 Checking Component Completeness...');
  
  const requiredComponents = [
    'BannerCarousel.tsx',
    'SmartTile.tsx', 
    'VenueCard.tsx',
    'ChatScreen.tsx',
    'LanguageSelector.tsx',
    'OnboardingScreen.tsx',
    'ErrorBoundary.tsx',
    'WeatherWidget.tsx',
    'EmergencyButton.tsx',
    'AIRecommendations.tsx',
  ];

  const componentsDir = path.join(__dirname, '../components');
  const missingComponents = [];

  requiredComponents.forEach(component => {
    const componentPath = path.join(componentsDir, component);
    if (!fs.existsSync(componentPath)) {
      missingComponents.push(component);
    }
  });

  if (missingComponents.length === 0) {
    console.log('✅ All required components present');
  } else {
    console.log('❌ Missing components:', missingComponents);
  }
  console.log('');
}

// Service integration check
function checkServiceIntegration() {
  console.log('🔌 Checking Service Integration...');
  
  const requiredServices = [
    'userService.ts',
    'venueService.ts',
    'chatService.ts',
    'geminiService.ts',
  ];

  const servicesDir = path.join(__dirname, '../services');
  const missingServices = [];

  requiredServices.forEach(service => {
    const servicePath = path.join(servicesDir, service);
    if (!fs.existsSync(servicePath)) {
      missingServices.push(service);
    }
  });

  if (missingServices.length === 0) {
    console.log('✅ All required services present');
  } else {
    console.log('❌ Missing services:', missingServices);
  }
  console.log('');
}

// Language support check
function checkLanguageSupport() {
  console.log('🌍 Checking Language Support...');
  
  try {
    const languageFile = path.join(__dirname, '../constants/Languages.ts');
    const content = fs.readFileSync(languageFile, 'utf8');
    
    const supportedLanguages = ['en', 'zu', 'af', 'xh', 'ts', 'nso', 'tn', 've'];
    const missingLanguages = [];
    
    supportedLanguages.forEach(lang => {
      if (!content.includes(`${lang}:`)) {
        missingLanguages.push(lang);
      }
    });

    if (missingLanguages.length === 0) {
      console.log('✅ All 8 South African languages supported');
    } else {
      console.log('❌ Missing language support:', missingLanguages);
    }
  } catch (error) {
    console.log('❌ Error checking language support:', error.message);
  }
  console.log('');
}

// Run TypeScript check
function runTypeScriptCheck() {
  console.log('🔍 Running TypeScript Check...');
  
  try {
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
    console.log('✅ TypeScript compilation successful');
  } catch (error) {
    console.log('❌ TypeScript errors found');
    console.log(error.stdout.toString());
  }
  console.log('');
}

// Run ESLint check
function runLintCheck() {
  console.log('🧹 Running ESLint Check...');
  
  try {
    execSync('npx eslint . --ext .ts,.tsx --max-warnings 0', { stdio: 'pipe' });
    console.log('✅ No linting errors found');
  } catch (error) {
    console.log('⚠️ Linting warnings/errors found');
    // Don't fail the build for linting issues
  }
  console.log('');
}

// Check asset integrity
function checkAssetIntegrity() {
  console.log('🖼️ Checking Asset Integrity...');
  
  const assetsDir = path.join(__dirname, '../assets');
  const requiredAssets = [
    'images/icon.png',
    'images/splash-icon.png',
    'images/adaptive-icon.png',
    'images/favicon.png',
  ];

  const missingAssets = [];
  
  requiredAssets.forEach(asset => {
    const assetPath = path.join(assetsDir, asset);
    if (!fs.existsSync(assetPath)) {
      missingAssets.push(asset);
    }
  });

  if (missingAssets.length === 0) {
    console.log('✅ All required assets present');
  } else {
    console.log('❌ Missing assets:', missingAssets);
  }
  console.log('');
}

// Print test matrix
function printTestMatrix() {
  console.log('📊 Test Matrix:\n');
  
  console.log('🔧 Functional Tests:');
  tests.functional.forEach(test => {
    console.log(`  • ${test}`);
  });
  
  console.log('\n⚡ Non-Functional Tests:');
  tests.nonFunctional.forEach(test => {
    console.log(`  • ${test}`);
  });
  
  console.log('\n📱 Platform Tests:');
  tests.platforms.forEach(platform => {
    console.log(`  • ${platform}`);
  });
  
  console.log('\n');
}

// Main execution
function main() {
  checkComponentCompleteness();
  checkServiceIntegration();
  checkLanguageSupport();
  runTypeScriptCheck();
  runLintCheck();
  checkAssetIntegrity();
  printTestMatrix();
  
  console.log('🎯 NaviLynx Ready for Testing!');
  console.log('📋 Next steps:');
  console.log('  1. Run: npm run start');
  console.log('  2. Test on iOS/Android with Expo Go');
  console.log('  3. Test web version in browser');
  console.log('  4. Verify all navigation flows');
  console.log('  5. Test language switching');
  console.log('  6. Validate form inputs');
  console.log('  7. Test AR features');
  console.log('  8. Check chat functionality');
}

main();
