#!/bin/bash

# Script to replace useTheme with useThemeSafe in all TSX files

echo "Updating all useTheme imports to useThemeSafe..."

# Find all TypeScript React files and update imports
find . -name "*.tsx" -not -path "./node_modules/*" -exec sed -i '' 's/import { useTheme }/import { useThemeSafe }/g' {} \;
find . -name "*.tsx" -not -path "./node_modules/*" -exec sed -i '' 's/useTheme()/useThemeSafe()/g' {} \;

echo "Update complete!"
