# NaviLynx Monorepo Architecture Refactor

## 🏗️ Senior Engineer Assessment & Refactor Plan

### Current Issue Analysis
1. **Workspace Isolation**: Admin and mobile app are separate, making integration difficult
2. **Theme Inconsistency**: Mobile app still has blue-orange gradients vs purple admin theme
3. **Code Duplication**: Similar components exist in both codebases without sharing
4. **Build Process**: No unified development workflow

## 📁 Proposed Monorepo Structure

```
NaviLynx/                          # Root monorepo
├── package.json                   # Root package.json with workspaces
├── packages/
│   ├── mobile/                    # React Native Expo app
│   │   ├── package.json
│   │   ├── app.json
│   │   ├── App.tsx
│   │   ├── src/
│   │   │   ├── screens/
│   │   │   │   ├── ShoppingAssistant/  # Fix blue-orange gradient here
│   │   │   │   └── index.tsx
│   │   │   ├── components/
│   │   │   └── navigation/
│   │   └── assets/
│   ├── admin/                     # Next.js admin dashboard
│   │   ├── package.json
│   │   ├── src/
│   │   └── ...existing admin files
│   └── shared/                    # Shared components & utilities
│       ├── package.json
│       ├── src/
│       │   ├── components/        # Cross-platform components
│       │   ├── theme/            # Unified purple theme system
│       │   ├── types/            # Shared TypeScript types
│       │   ├── utils/            # Common utilities
│       │   └── constants/        # App constants
├── apps/                         # Build outputs
├── tools/                        # Development tools
└── docs/                         # Documentation
```

## 🎨 Unified Theme System

### 1. Shared Theme Package
- Single source of truth for colors
- Cross-platform compatibility (React Native + Web)
- Purple-first design system

### 2. Component Library
- Shared UI components that work on both platforms
- Platform-specific implementations where needed
- Storybook for documentation

## 🚀 Implementation Steps

### Phase 1: Workspace Setup
1. Create root package.json with yarn/npm workspaces
2. Move existing code into packages/mobile and packages/admin
3. Create shared package structure

### Phase 2: Theme Unification
1. Extract purple theme to shared package
2. Update mobile app Shopping Assistant to use purple theme
3. Remove all blue-orange gradients

### Phase 3: Component Sharing
1. Identify common components
2. Create cross-platform shared components
3. Update both apps to use shared components

### Phase 4: Development Workflow
1. Unified build scripts
2. Cross-platform hot reloading
3. Shared testing setup
