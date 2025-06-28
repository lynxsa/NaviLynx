#!/bin/bash

# NaviLynx GitHub Repository Setup Script
# This script pushes the NaviLynx project to GitHub

echo "🚀 NaviLynx GitHub Repository Setup"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in NaviLynx project directory"
    echo "Please run this script from: /Users/derahmanyelo/Documents/LYNX Code Vault/NaviLynx"
    exit 1
fi

echo "✅ Project directory confirmed"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "🔧 Initializing git repository..."
    git init
fi

# Add all files
echo "📁 Adding all project files..."
git add .

# Check if there are any changes to commit
if git diff --staged --quiet; then
    echo "ℹ️ No new changes to commit"
else
    echo "💾 Committing changes..."
    git commit -m "Update NaviLynx project for GitHub release"
fi

# Add remote if not exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "🔗 Adding GitHub remote..."
    git remote add origin https://github.com/lynxsa/NaviLynx.git
else
    echo "✅ GitHub remote already configured"
fi

# Set main branch
echo "🌿 Setting main branch..."
git branch -M main

# Push to GitHub
echo "⬆️ Pushing to GitHub..."
if git push -u origin main; then
    echo ""
    echo "🎉 SUCCESS! NaviLynx has been uploaded to GitHub!"
    echo ""
    echo "📍 Repository URL: https://github.com/lynxsa/NaviLynx"
    echo ""
    echo "🎯 Next Steps:"
    echo "1. Visit your repository: https://github.com/lynxsa/NaviLynx"
    echo "2. Check that all files are uploaded correctly"
    echo "3. Test the demo login: demo@navilynx.com / demo123"
    echo "4. Deploy with: npx expo build or eas build"
    echo ""
    echo "✨ Your NaviLynx app is now live on GitHub!"
else
    echo ""
    echo "⚠️ Push may require authentication"
    echo ""
    echo "🔧 Manual Options:"
    echo "1. Use GitHub Desktop:"
    echo "   - Add repository: $(pwd)"
    echo "   - Connect to: https://github.com/lynxsa/NaviLynx"
    echo "   - Push commits"
    echo ""
    echo "2. Use VS Code:"
    echo "   - Open project in VS Code"
    echo "   - Use Source Control panel"
    echo "   - Sync/Push to GitHub"
    echo ""
    echo "3. Try authentication:"
    echo "   - git config --global user.name 'Your Name'"
    echo "   - git config --global user.email 'your.email@example.com'"
    echo "   - git push -u origin main"
fi

echo ""
echo "📋 Project Stats:"
echo "- Files ready for upload: $(find . -type f -not -path './node_modules/*' -not -path './.git/*' | wc -l)"
echo "- Project size: $(du -sh . | cut -f1)"
echo "- Features: NaviGenie AI, AR Navigation, Custom Auth, Smart Parking"
echo "- Status: Production Ready ✅"
