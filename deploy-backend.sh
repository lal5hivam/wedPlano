#!/bin/bash

# Wedplano Backend Deployment Script for Railway
# Usage: ./deploy-backend.sh

set -e

echo "🚀 Wedplano Backend Deployment to Railway"
echo "=========================================="
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found!"
    echo "Install it with: npm install -g @railway/cli"
    exit 1
fi

echo "✅ Railway CLI found"
echo ""

# Navigate to backend directory
cd "$(dirname "$0")/backend"
echo "📁 Working directory: $(pwd)"
echo ""

# Check if logged in
if ! railway whoami &> /dev/null; then
    echo "🔐 Please login to Railway..."
    railway login
fi

echo "✅ Logged in to Railway"
echo ""

# Check if project is linked
if ! railway status &> /dev/null; then
    echo "🔗 No Railway project linked. Initializing..."
    railway init
else
    echo "✅ Railway project linked"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔍 Checking environment variables..."
echo ""
echo "⚠️  Make sure you have set these variables in Railway Dashboard:"
echo "   - NODE_ENV"
echo "   - JWT_SECRET"
echo "   - JWT_EXPIRES_IN"
echo "   - FIREBASE_PROJECT_ID"
echo "   - FIREBASE_PRIVATE_KEY_ID"
echo "   - FIREBASE_PRIVATE_KEY"
echo "   - FIREBASE_CLIENT_EMAIL"
echo "   - FIREBASE_CLIENT_ID"
echo "   - FIREBASE_AUTH_URI"
echo "   - FIREBASE_TOKEN_URI"
echo "   - CLOUDINARY_CLOUD_NAME"
echo "   - CLOUDINARY_API_KEY"
echo "   - CLOUDINARY_API_SECRET"
echo "   - FRONTEND_URL"
echo ""

read -p "Have you set all environment variables? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Please set environment variables in Railway Dashboard:"
    echo "1. Go to https://railway.app/dashboard"
    echo "2. Select your project"
    echo "3. Go to Variables tab"
    echo "4. Add all required variables"
    echo ""
    echo "Or use Railway CLI:"
    echo "railway variables set KEY=\"value\""
    echo ""
    exit 1
fi

echo ""
echo "🚀 Deploying to Railway..."
railway up

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Getting your backend URL..."
DOMAIN=$(railway domain 2>/dev/null || echo "Run 'railway domain' to get your URL")
echo "Backend URL: $DOMAIN"
echo ""
echo "📝 Next steps:"
echo "1. Test health endpoint: $DOMAIN/health"
echo "2. Check API docs: $DOMAIN/api/docs"
echo "3. Update FRONTEND_URL in Railway if needed"
echo "4. Deploy frontend with this backend URL"
echo ""
echo "🎉 Done!"
