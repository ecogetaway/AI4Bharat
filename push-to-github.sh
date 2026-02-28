#!/bin/bash

# AI4Bharat Supply Chain Decarbonization Platform - Git Push Script
# This script pushes the prototype code to GitHub repository

echo "🚀 Starting Git push process..."
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
fi

# Check if remote exists
if git remote | grep -q "origin"; then
    echo "✓ Remote 'origin' already exists"
    git remote -v
else
    echo "📡 Adding remote repository..."
    git remote add origin https://github.com/ecogetaway/AI4Bharat.git
fi

echo ""
echo "📥 Pulling existing files from remote..."
git pull origin main --allow-unrelated-histories || git pull origin master --allow-unrelated-histories

# Check if pull was successful
if [ $? -ne 0 ]; then
    echo "⚠️  Pull failed or conflicts detected. Please resolve conflicts manually."
    echo "After resolving conflicts, run:"
    echo "  git add ."
    echo "  git commit -m 'Merge remote changes'"
    echo "  Then run this script again."
    exit 1
fi

echo ""
echo "📝 Staging files..."
git add prototype/
git add .kiro/specs/supply-chain-sustainability/
git add .gitignore

echo ""
echo "💾 Committing changes..."
git commit -m "Add AI-powered supply chain decarbonization prototype with Vite

Features:
- Rural Farmer Dashboard with carbon footprint tracking
- Emission Hotspot View with BOM-level analysis  
- Cooperative Aggregation View with FPO metrics
- React 18 + Vite setup for fast development
- Recharts for interactive data visualization
- Comprehensive mock data for demo purposes
- Updated requirements.md and design.md

Tech Stack:
- React 18
- Vite (build tool)
- React Router DOM
- Recharts
- Custom responsive CSS

AI4Bharat Hackathon 2026 - Rural Ecosystems & Sustainability Track"

echo ""
echo "🚀 Pushing to GitHub..."

# Try pushing to main first, then master if main fails
if git push origin main; then
    echo ""
    echo "✅ Successfully pushed to 'main' branch!"
elif git push origin master; then
    echo ""
    echo "✅ Successfully pushed to 'master' branch!"
else
    echo ""
    echo "❌ Push failed. This might be due to:"
    echo "  1. Authentication issues - You may need to use a Personal Access Token"
    echo "  2. Branch protection rules"
    echo "  3. Network issues"
    echo ""
    echo "To push with Personal Access Token, run:"
    echo "  git push https://YOUR_TOKEN@github.com/ecogetaway/AI4Bharat.git main"
    echo ""
    echo "Or configure Git credentials:"
    echo "  git config --global user.name 'Your Name'"
    echo "  git config --global user.email 'your.email@example.com'"
    exit 1
fi

echo ""
echo "🎉 All done! Your code is now on GitHub."
echo "View it at: https://github.com/ecogetaway/AI4Bharat"
echo ""
