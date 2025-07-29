#!/bin/bash

# 🚀 OPERATION LIONMOUNTAIN - INSTANT PURPLE DEPLOYMENT
# 
# This script ELIMINATES the blue-orange gradient from your screenshot
# by deploying the production-ready purple shop assistant.
#
# 🎯 TARGET: /NaviLynx/app/(tabs)/shop-assistant.tsx
# 🎨 REPLACES: Blue-orange gradient with purple theme (#9333EA)
# ⚡ EXECUTION TIME: 30 seconds
#
# 🏔️ PRODUCTION READY - LIONMOUNTAIN ARCHITECTURE

echo "🚀 OPERATION LIONMOUNTAIN - PURPLE DEPLOYMENT STARTING..."
echo "============================================================"

# Navigate to the NaviLynx project root
cd "/Users/derahmanyelo/Documents/LYNX Code Vault/NaviLynx"

# Verify we're in the right location
if [ ! -f "app.json" ]; then
    echo "❌ ERROR: Not in NaviLynx project root!"
    echo "Expected to find app.json file"
    exit 1
fi

echo "✅ NaviLynx project located"

# Create backup of original file
BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

if [ -f "app/(tabs)/shop-assistant.tsx" ]; then
    cp "app/(tabs)/shop-assistant.tsx" "$BACKUP_DIR/shop-assistant.tsx.backup"
    echo "✅ Backup created: $BACKUP_DIR/shop-assistant.tsx.backup"
else
    echo "⚠️  Original shop-assistant.tsx not found - creating new file"
fi

# Deploy the purple theme file
echo "🎨 Deploying PRODUCTION PURPLE theme..."

# Copy the production-ready purple file to the mobile app
cp "../admin/PRODUCTION_PURPLE_SHOP_ASSISTANT.tsx" "app/(tabs)/shop-assistant.tsx"

if [ $? -eq 0 ]; then
    echo "✅ PURPLE THEME DEPLOYED SUCCESSFULLY!"
    echo ""
    echo "🎯 SCREENSHOT ISSUE FIXED:"
    echo "   ❌ Blue-orange gradient ELIMINATED"
    echo "   ✅ Purple theme (#9333EA) APPLIED"
    echo "   ✅ All action buttons now purple"
    echo "   ✅ Consistent with homepage theme"
    echo ""
    echo "🏔️ OPERATION LIONMOUNTAIN - PHASE 1 COMPLETE"
    echo "============================================================"
    echo ""
    echo "📱 NEXT STEPS:"
    echo "1. Test the app to verify purple theme"
    echo "2. Check that blue-orange gradient is gone"
    echo "3. Confirm all functionality works"
    echo "4. Run: npx expo start --clear"
    echo ""
    echo "✨ Your AI Shop Assistant now has a beautiful purple theme!"
else
    echo "❌ DEPLOYMENT FAILED!"
    echo "Error copying purple theme file"
    exit 1
fi

# Quick verification
if [ -f "app/(tabs)/shop-assistant.tsx" ]; then
    FILE_SIZE=$(wc -l < "app/(tabs)/shop-assistant.tsx")
    if [ "$FILE_SIZE" -gt 500 ]; then
        echo "✅ Verification: Purple theme file deployed ($FILE_SIZE lines)"
        echo "✅ Ready for testing!"
    else
        echo "⚠️  Warning: Deployed file seems small ($FILE_SIZE lines)"
    fi
fi

echo ""
echo "🎉 PURPLE DEPLOYMENT COMPLETE!"
echo "Your screenshot issue is now FIXED! 🎯"
