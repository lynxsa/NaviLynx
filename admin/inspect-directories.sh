#!/bin/bash

# 🔍 NaviLynx Directory Inspector
# This script helps you compare NaviLynx vs NaviLynx-Clean

echo "🔍 NaviLynx Directory Inspector - July 29, 2025"
echo "=============================================="
echo ""

# Check current working directory
echo "📍 Current Working Directory:"
pwd
echo ""

# Check parent directory structure
echo "📂 LYNX Code Vault Contents:"
ls -la "/Users/derahmanyelo/Documents/LYNX Code Vault/" 2>/dev/null || echo "Cannot access parent directory"
echo ""

# Check current NaviLynx structure
echo "📱 Current NaviLynx Structure:"
if [ -d "/Users/derahmanyelo/Documents/LYNX Code Vault/NaviLynx" ]; then
    ls -la "/Users/derahmanyelo/Documents/LYNX Code Vault/NaviLynx"
    echo ""
    echo "📦 NaviLynx package.json exists:"
    ls -la "/Users/derahmanyelo/Documents/LYNX Code Vault/NaviLynx/package.json" 2>/dev/null || echo "No package.json in root"
    echo ""
    echo "📱 NaviLynx app/ folder:"
    ls -la "/Users/derahmanyelo/Documents/LYNX Code Vault/NaviLynx/app/" 2>/dev/null || echo "No app/ folder"
else
    echo "❌ NaviLynx directory not found"
fi
echo ""

# Check NaviLynx-Clean structure
echo "🧹 NaviLynx-Clean Structure:"
if [ -d "/Users/derahmanyelo/Documents/LYNX Code Vault/NaviLynx-Clean" ]; then
    ls -la "/Users/derahmanyelo/Documents/LYNX Code Vault/NaviLynx-Clean"
    echo ""
    echo "📦 NaviLynx-Clean package.json exists:"
    ls -la "/Users/derahmanyelo/Documents/LYNX Code Vault/NaviLynx-Clean/package.json" 2>/dev/null || echo "No package.json in root"
    echo ""
    echo "📱 NaviLynx-Clean app/ folder:"
    ls -la "/Users/derahmanyelo/Documents/LYNX Code Vault/NaviLynx-Clean/app/" 2>/dev/null || echo "No app/ folder"
    echo ""
    echo "✅ NaviLynx-Clean completion files:"
    ls -la "/Users/derahmanyelo/Documents/LYNX Code Vault/NaviLynx-Clean/"*COMPLETE*.md 2>/dev/null || echo "No completion files found"
    ls -la "/Users/derahmanyelo/Documents/LYNX Code Vault/NaviLynx-Clean/"*FINAL*.md 2>/dev/null || echo "No final status files found"
else
    echo "❌ NaviLynx-Clean directory not found"
fi
echo ""

echo "🎯 Recommendation:"
echo "1. Open VS Code File Explorer"
echo "2. Navigate to /Users/derahmanyelo/Documents/LYNX Code Vault/"
echo "3. Compare both folders side by side"
echo "4. Look for completion status files in NaviLynx-Clean"
echo "5. Check which has more recent modifications"
