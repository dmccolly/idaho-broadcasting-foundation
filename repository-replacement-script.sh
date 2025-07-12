#!/bin/bash

# Idaho Broadcasting Foundation - Repository Replacement Script
# This script will replace your current repository with the new integrated codebase

set -e  # Exit on any error

echo "🚀 Idaho Broadcasting Foundation - Repository Replacement"
echo "=================================================="

# Check if we're in the right directory
if [ ! -d ".git" ]; then
    echo "❌ Error: This script must be run from your repository root directory"
    echo "Please navigate to your idaho-broadcasting-foundation repository and run this script again"
    exit 1
fi

# Check if backup branch exists
if git show-ref --verify --quiet refs/heads/backup-original-site; then
    echo "✅ Backup branch 'backup-original-site' already exists"
else
    echo "📦 Creating backup branch..."
    git checkout -b backup-original-site
    git push origin backup-original-site
    echo "✅ Backup created successfully"
fi

# Switch back to main branch
echo "🔄 Switching to main branch..."
git checkout main

# Clear the repository (keep .git)
echo "🧹 Clearing current repository contents..."
find . -maxdepth 1 ! -name '.git' ! -name '.' ! -name '..' -exec rm -rf {} +

# Copy new codebase (you'll need to extract the package first)
echo "📁 Please extract the idaho-broadcasting-foundation-package.tar.gz file"
echo "Then copy all contents to this directory:"
echo ""
echo "tar -xzf idaho-broadcasting-foundation-package.tar.gz"
echo "cp -r idaho-broadcasting-foundation-package/* ."
echo "cp -r idaho-broadcasting-foundation-package/.* . 2>/dev/null || true"
echo ""
read -p "Press Enter after you've copied the files..."

# Install dependencies
if [ -f "package.json" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "❌ Error: package.json not found. Please ensure you copied all files correctly."
    exit 1
fi

# Test the build
echo "🔨 Testing build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

# Commit changes
echo "💾 Committing changes..."
git add .
git commit -m "feat: integrate modern Tailwind template with broadcasting tools

- Add VoxPro Media Player with 5-key interface
- Integrate Current Key Assignments display  
- Implement Events page with calendar functionality
- Add The Back Corner content area
- Update branding to Idaho Broadcasting Foundation
- Add Supabase integration with real credentials
- Implement responsive design with Tailwind CSS 4.0
- Add TypeScript support and modern Next.js 15 architecture"

# Push changes
echo "🚀 Pushing to repository..."
git push origin main

echo ""
echo "🎉 Repository replacement complete!"
echo "✅ Backup created: backup-original-site branch"
echo "✅ New codebase deployed to main branch"
echo "✅ Supabase configured with your credentials"
echo ""
echo "Next steps:"
echo "1. Check your Netlify deployment (should auto-deploy)"
echo "2. Verify the site works at: ornate-syrniki-0df84f.netlify.app"
echo "3. Update Netlify build settings if needed:"
echo "   - Build command: npm run build"
echo "   - Publish directory: out"
echo ""
echo "🌐 Your new integrated site should be live shortly!"

