#!/bin/bash
# Quick deploy script for synectron

echo "🚀 Deploying Clash Tournament for synectron..."
echo ""

# Check if git repo exists
if [ ! -d .git ]; then
    echo "Initializing git repository..."
    git init
    git branch -M main
fi

# Add remote if not exists
if ! git remote | grep -q origin; then
    echo "Adding GitHub remote..."
    git remote add origin https://github.com/synectron/clash-tournament.git
fi

echo "Installing dependencies..."
npm install

echo "Building and deploying to GitHub Pages..."
npm run deploy

echo ""
echo "✅ Done! Your app will be live at:"
echo "   https://synectron.github.io/clash-tournament"
echo ""
echo "If this is your first time, go to:"
echo "   https://github.com/synectron/clash-tournament/settings/pages"
echo "   and set the source to 'gh-pages' branch."
