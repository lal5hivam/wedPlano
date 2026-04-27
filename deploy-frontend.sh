#!/bin/bash

# Wedplano Frontend Deployment Script for Netlify
# Usage: ./deploy-frontend.sh

set -e

echo "🚀 Wedplano Frontend Deployment to Netlify"
echo "==========================================="
echo ""

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI not found!"
    echo "Install it with: npm install -g netlify-cli"
    exit 1
fi

echo "✅ Netlify CLI found"
echo ""

# Navigate to frontend directory
cd "$(dirname "$0")/frontend"
echo "📁 Working directory: $(pwd)"
echo ""

# Check if logged in
if ! netlify status &> /dev/null; then
    echo "🔐 Please login to Netlify..."
    netlify login
fi

echo "✅ Logged in to Netlify"
echo ""

# Check .env.production
if [ ! -f ".env.production" ]; then
    echo "❌ .env.production not found!"
    echo "Creating from template..."
    cp .env.example .env.production
    echo ""
    echo "⚠️  Please edit .env.production and set your Railway backend URL"
    echo "   VITE_API_URL=https://your-app.up.railway.app/api"
    echo ""
    exit 1
fi

echo "📝 Current .env.production:"
cat .env.production
echo ""

read -p "Is the backend URL correct? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Please update .env.production with your Railway backend URL"
    echo "Example: VITE_API_URL=https://your-app.up.railway.app/api"
    echo ""
    exit 1
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔨 Building frontend..."
npm run build

echo ""
echo "🚀 Deploying to Netlify..."
netlify deploy --prod --dir=dist

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Set environment variable in Netlify:"
echo "   netlify env:set VITE_API_URL \"https://your-railway-url.up.railway.app/api\""
echo ""
echo "2. Update FRONTEND_URL in Railway backend:"
echo "   cd ../backend"
echo "   railway variables set FRONTEND_URL=\"https://your-netlify-url.netlify.app\""
echo ""
echo "3. Configure Firebase authorized domains"
echo "4. Configure Cloudinary allowed domains"
echo ""
echo "🎉 Done!"
