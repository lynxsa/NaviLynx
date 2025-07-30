#!/bin/bash
# Script to fix spacing references

file="app/(tabs)/index.tsx"

# Replace all spacing. with designSystem.spacing. that aren't already prefixed
sed -i '' 's/\([^.]\)spacing\./\1designSystem.spacing./g' "$file"

echo "✅ Fixed all spacing references in $file"
