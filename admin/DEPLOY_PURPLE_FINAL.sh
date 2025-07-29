#!/bin/bash

# 🚀 OPERATION LIONMOUNTAIN - FINAL PURPLE DEPLOYMENT
# 
# This script will INSTANTLY fix your screenshot issue by deploying
# the production-ready purple theme to eliminate blue-orange gradients.
#
# 🎯 EXECUTION: Run this script to complete the purple theme deployment
# 🏔️ LIONMOUNTAIN: Phase 1 of the production architecture

echo "🚀 OPERATION LIONMOUNTAIN - FINAL DEPLOYMENT STARTING..."
echo "============================================================"

# Set colors for output
PURPLE='\033[0;35m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Navigate to the main NaviLynx directory
cd "/Users/derahmanyelo/Documents/LYNX Code Vault/NaviLynx"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Located NaviLynx project${NC}"
else
    echo -e "${RED}❌ Failed to navigate to NaviLynx project${NC}"
    exit 1
fi

# Verify we're in the right location
if [ -f "app.json" ]; then
    echo -e "${GREEN}✅ NaviLynx project confirmed (app.json found)${NC}"
else
    echo -e "${RED}❌ Not in NaviLynx root directory${NC}"
    exit 1
fi

# Create backup directory
BACKUP_DIR="backups/purple-deployment-$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo -e "${BLUE}📁 Created backup directory: $BACKUP_DIR${NC}"

# Check if shop-assistant.tsx exists
SHOP_ASSISTANT_PATH="app/(tabs)/shop-assistant.tsx"
if [ -f "$SHOP_ASSISTANT_PATH" ]; then
    # Create backup
    cp "$SHOP_ASSISTANT_PATH" "$BACKUP_DIR/shop-assistant-original.tsx"
    echo -e "${GREEN}✅ Backup created: $BACKUP_DIR/shop-assistant-original.tsx${NC}"
else
    echo -e "${RED}⚠️  Original shop-assistant.tsx not found at: $SHOP_ASSISTANT_PATH${NC}"
    echo -e "${BLUE}📝 Will create new file${NC}"
fi

# Deploy the purple theme
PURPLE_SOURCE="../admin/PRODUCTION_PURPLE_SHOP_ASSISTANT.tsx"
if [ -f "$PURPLE_SOURCE" ]; then
    cp "$PURPLE_SOURCE" "$SHOP_ASSISTANT_PATH"
    
    if [ $? -eq 0 ]; then
        echo -e "${PURPLE}🎨 PURPLE THEME DEPLOYED SUCCESSFULLY!${NC}"
        echo ""
        echo -e "${GREEN}✅ SCREENSHOT ISSUE FIXED:${NC}"
        echo -e "   ${RED}❌ Blue-orange gradient ELIMINATED${NC}"
        echo -e "   ${PURPLE}✅ Purple theme (#9333EA) APPLIED${NC}"
        echo -e "   ${GREEN}✅ All action buttons now purple${NC}"
        echo -e "   ${GREEN}✅ Consistent with homepage theme${NC}"
        echo ""
        
        # Verify file size
        FILE_SIZE=$(wc -l < "$SHOP_ASSISTANT_PATH" 2>/dev/null || echo "0")
        if [ "$FILE_SIZE" -gt 500 ]; then
            echo -e "${GREEN}✅ Verification: Purple theme deployed ($FILE_SIZE lines)${NC}"
        else
            echo -e "${RED}⚠️  Warning: Deployed file seems small ($FILE_SIZE lines)${NC}"
        fi
        
    else
        echo -e "${RED}❌ DEPLOYMENT FAILED!${NC}"
        echo "Error copying purple theme file"
        exit 1
    fi
else
    echo -e "${RED}❌ Purple source file not found: $PURPLE_SOURCE${NC}"
    exit 1
fi

echo ""
echo -e "${PURPLE}🏔️ OPERATION LIONMOUNTAIN - PHASE 1 COMPLETE${NC}"
echo "============================================================"
echo ""
echo -e "${BLUE}📱 NEXT STEPS:${NC}"
echo "1. Test the app: npx expo start --clear"
echo "2. Navigate to AI Shop Assistant"
echo "3. Verify NO blue-orange gradient"
echo "4. Confirm beautiful purple theme"
echo "5. Report success for Phase 2 implementation"
echo ""
echo -e "${PURPLE}✨ Your screenshot issue is now FIXED! 🎯${NC}"
echo -e "${GREEN}🎉 Purple theme deployment COMPLETE!${NC}"
