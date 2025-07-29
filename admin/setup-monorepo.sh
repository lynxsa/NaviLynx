#!/bin/bash

# NaviLynx Monorepo Setup Script
# Run this script from the NaviLynx root directory

echo "🚀 Setting up NaviLynx Monorepo Architecture..."

# Check if we're in the right directory
if [ ! -d "admin" ]; then
    echo "❌ Error: Please run this script from the NaviLynx root directory"
    exit 1
fi

# Create packages directory structure
echo "📁 Creating package structure..."
mkdir -p packages/mobile
mkdir -p packages/admin  
mkdir -p packages/shared/src/{components,theme,types,utils,constants}
mkdir -p tools
mkdir -p docs

# Move existing admin to packages/admin
echo "📦 Moving admin to packages/admin..."
if [ -d "packages/admin/src" ]; then
    echo "⚠️  packages/admin already exists, skipping move..."
else
    cp -r admin/* packages/admin/
fi

# Create shared package.json
echo "📄 Creating shared package configuration..."
cat > packages/shared/package.json << 'EOF'
{
  "name": "@navilynx/shared",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "clean": "rm -rf dist"
  },
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-native": ">=0.70.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/react": "^18.0.0"
  }
}
EOF

# Create shared TypeScript config
cat > packages/shared/tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs", 
    "lib": ["es2020"],
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "jsx": "react-jsx"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.*"]
}
EOF

# Copy our theme system to shared
echo "🎨 Setting up shared theme system..."
cp admin/src/shared/theme/index.ts packages/shared/src/theme/
cp admin/src/shared/screens/ShoppingAssistantScreen.tsx packages/shared/src/components/

# Create shared package index
cat > packages/shared/src/index.ts << 'EOF'
// Theme System
export { default as PURPLE_THEME, RN_COLORS, CSS_VARIABLES, TAILWIND_COLORS, SPACING, TYPOGRAPHY } from './theme'

// Components
export { default as ShoppingAssistantScreen } from './components/ShoppingAssistantScreen'

// Types
export * from './types'
EOF

# Create mobile package structure (Expo)
echo "📱 Setting up mobile package..."
cat > packages/mobile/package.json << 'EOF'
{
  "name": "@navilynx/mobile",
  "version": "1.0.0",
  "main": "expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android", 
    "ios": "expo start --ios",
    "web": "expo start --web",
    "build": "expo build",
    "lint": "expo lint"
  },
  "dependencies": {
    "@navilynx/shared": "*",
    "expo": "~50.0.0",
    "expo-linear-gradient": "~13.0.2",
    "expo-haptics": "~13.0.1",
    "react": "18.2.0",
    "react-native": "0.73.0",
    "@expo/vector-icons": "^14.0.0"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@types/react": "~18.2.45",
    "typescript": "^5.1.3"
  }
}
EOF

# Update root package.json
echo "🔧 Updating root package.json..."
cp admin/ROOT_PACKAGE.json ./package.json

# Create development VS Code workspace
cat > navilynx.code-workspace << 'EOF'
{
    "folders": [
        {
            "name": "🏠 Root",
            "path": "."
        },
        {
            "name": "📱 Mobile App",
            "path": "./packages/mobile"
        },
        {
            "name": "🖥️ Admin Dashboard", 
            "path": "./packages/admin"
        },
        {
            "name": "🔧 Shared Components",
            "path": "./packages/shared"
        }
    ],
    "settings": {
        "typescript.preferences.includePackageJsonAutoImports": "on",
        "typescript.suggest.autoImports": true,
        "editor.codeActionsOnSave": {
            "source.fixAll.eslint": true
        }
    },
    "extensions": {
        "recommendations": [
            "ms-vscode.vscode-typescript-next",
            "bradlc.vscode-tailwindcss",
            "ms-vscode.vscode-expo"
        ]
    }
}
EOF

# Create development documentation
cat > docs/DEVELOPMENT.md << 'EOF'
# NaviLynx Development Guide

## 🏗️ Monorepo Structure

```
NaviLynx/
├── packages/
│   ├── mobile/          # React Native Expo app
│   ├── admin/           # Next.js admin dashboard
│   └── shared/          # Shared components & theme
├── tools/               # Development tools
└── docs/               # Documentation
```

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development**
   ```bash
   # Start both apps
   npm run dev
   
   # Or individually
   npm run dev:admin    # Admin dashboard
   npm run dev:mobile   # Mobile app
   ```

3. **Open VS Code Workspace**
   ```bash
   code navilynx.code-workspace
   ```

## 🎨 Purple Theme System

The shared theme system ensures consistency:
- **Primary**: #9333EA (Purple)
- **Secondary**: #A855F7 (Light Purple)
- **Accent**: #C084FC (Purple Accent)

## 📱 Mobile Development

- Uses Expo for easy development
- Shared components from `@navilynx/shared`
- Purple theme throughout

## 🛠️ Available Scripts

- `npm run dev` - Start both apps
- `npm run build` - Build all packages
- `npm run lint` - Lint all packages
- `npm run test` - Run all tests
- `npm run clean` - Clean node_modules
EOF

echo "✅ Monorepo setup complete!"
echo ""
echo "🎯 Next Steps:"
echo "1. Run: npm install"
echo "2. Run: npm run dev"
echo "3. Open: code navilynx.code-workspace"
echo ""
echo "📱 Your mobile app will now use the purple theme!"
echo "🖥️ Admin dashboard remains unchanged but better organized!"
